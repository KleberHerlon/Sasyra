import { useMemo } from "react";
import Accordion from "../components/Accordion";
import { PSE_COLORS } from "../data/pseFoster";

const C = {
  bg:"#0E141B",surface:"#111822",card:"#19243A",cardAlt:"#162030",
  border:"#1F2E45",borderLight:"#2A3F5C",green:"#4ADE80",greenDim:"#22C55E",
  greenDeep:"#0D9E5C",greenBg:"rgba(74,222,128,0.09)",greenBgHov:"rgba(74,222,128,0.16)",
  amber:"#FBBF24",amberBg:"rgba(251,191,36,0.10)",red:"#F87171",redBg:"rgba(248,113,113,0.09)",
  blue:"#60A5FA",blueBg:"rgba(96,165,250,0.09)",purple:"#A78BFA",purpleBg:"rgba(167,139,250,0.09)",
  text:"#DDE6F0",textSub:"#A8BECC",textMuted:"#5E7A96",textDim:"#364D62",white:"#FFFFFF",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

function MiniBarChart({ data, valueKey, labelKey, colorKey, height, maxValue }) {
  const mx = maxValue || Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height: height || 80, padding:"4px 0" }}>
      {data.map((d, i) => {
        const h = ((d[valueKey] || 0) / mx) * (height || 80);
        const c = colorKey ? d[colorKey] : C.green;
        return (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontSize:8, fontWeight:700, color:c }}>{d[valueKey]}</span>
            <div style={{ width:"100%", height:Math.max(h, 4), background:c, borderRadius:"3px 3px 0 0", opacity:0.8 }} />
            <span style={{ fontSize:7, color:C.textDim, writingMode:"vertical-lr", textOrientation:"mixed" }}>{d[labelKey]?.slice(5)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function PerformanceDashboard({ student, bfEvolution, savedAssessments, rmResult, cooperResult, weeklyVolume, pseSessoes, acsmRisk, objetivo, nivel, estruturaTreino, macrociclo }) {
  const ultimaAvaliacao = savedAssessments?.[savedAssessments?.length - 1];
  const vo2Evolution = useMemo(() => {
    return (savedAssessments || []).filter(a => a.cooper?.vo2max).map(a => ({ data: a.data, vo2max: a.cooper.vo2max })).sort((a, b) => a.data.localeCompare(b.data));
  }, [savedAssessments]);

  const rmEvolution = useMemo(() => {
    return (savedAssessments || []).filter(a => a.rm?.rm).map(a => ({ data: a.data, rm: a.rm.rm })).sort((a, b) => a.data.localeCompare(b.data));
  }, [savedAssessments]);

  const pseMedio = pseSessoes?.length > 0 ? (pseSessoes.reduce((s, se) => s + (se.pse || 0), 0) / pseSessoes.length).toFixed(1) : "—";
  const volTotal = weeklyVolume?.length > 0 ? weeklyVolume.reduce((s, g) => s + (g.volumeLoad || 0), 0) : 0;

  const hasData = (bfEvolution?.length || 0) > 0 || (vo2Evolution?.length || 0) > 0 || (rmEvolution?.length || 0) > 0 || (pseSessoes?.length || 0) > 0;

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:10, marginBottom:16 }}>
        {[
          { label:"% Gordura Atual", val: bfEvolution?.length > 0 ? `${bfEvolution[bfEvolution.length - 1].percentualGordura}%` : "—", delta: bfEvolution?.length >= 2 ? `${(bfEvolution[bfEvolution.length - 1].percentualGordura - bfEvolution[0].percentualGordura).toFixed(1)} pp` : null, color: C.green },
          { label:"VO₂ Máx", val: ultimaAvaliacao?.cooper?.vo2max ? `${ultimaAvaliacao.cooper.vo2max}` : cooperResult?.vo2max || "—", sub: "ml/kg/min", color: C.blue },
          { label:"1RM Estimado", val: ultimaAvaliacao?.rm?.rm ? `${ultimaAvaliacao.rm.rm} kg` : rmResult?.rm ? `${rmResult.rm} kg` : "—", color: C.purple },
          { label:"PSE Médio", val: pseMedio, sub: "/10 CR-10", color: pseMedio !== "—" && parseFloat(pseMedio) > 7 ? C.red : C.amber },
          { label:"Volume Semanal", val: volTotal > 0 ? `${(volTotal / 1000).toFixed(1)}k` : "—", sub: "kg·rep", color: C.text },
        ].map((c, i) => (
          <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", textAlign:"center" }}>
            <div style={{ fontSize:9, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{c.label}</div>
            <div style={{ fontSize:22, fontWeight:900, color:c.color }}>{c.val}<span style={{ fontSize:10, color:C.textMuted, fontWeight:400 }}> {c.sub || ""}</span></div>
            {c.delta && (
              <div style={{ fontSize:10, fontWeight:700, color: parseFloat(c.delta) < 0 ? C.green : C.red, marginTop:2 }}>
                Δ {c.delta}
              </div>
            )}
          </div>
        ))}
      </div>

      {!hasData && (
        <div style={{ textAlign:"center", padding:"48px 24px", color:C.textDim, fontSize:13 }}>
          Nenhum dado disponível. Realize avaliações e registre sessões PSE para ver o dashboard.
        </div>
      )}

      {/* Charts */}
      {bfEvolution?.length > 0 && (
        <Accordion title={`Evolução %BF (${bfEvolution.length} avaliações)`} icon="📈" defaultOpen>
          <MiniBarChart data={bfEvolution} valueKey="percentualGordura" labelKey="data" height={100} maxValue={50} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textMuted, marginTop:4 }}>
            <span>{bfEvolution[0].data} — {bfEvolution[0].percentualGordura}%</span>
            <span>{bfEvolution[bfEvolution.length - 1].data} — {bfEvolution[bfEvolution.length - 1].percentualGordura}%</span>
          </div>
          {bfEvolution.length >= 2 && (
            <div style={{ textAlign:"center", marginTop:4 }}>
              <span style={{ fontSize:11, fontWeight:700, color: bfEvolution[bfEvolution.length - 1].percentualGordura < bfEvolution[0].percentualGordura ? C.green : C.red }}>
                Δ {+(bfEvolution[bfEvolution.length - 1].percentualGordura - bfEvolution[0].percentualGordura).toFixed(1)} p.p.
                {bfEvolution[bfEvolution.length - 1].percentualGordura < bfEvolution[0].percentualGordura ? " ↓ Redução" : " ↑ Aumento"}
              </span>
            </div>
          )}
        </Accordion>
      )}

      {vo2Evolution?.length > 0 && (
        <Accordion title={`Evolução VO₂máx (${vo2Evolution.length} avaliações)`} icon="❤️">
          <MiniBarChart data={vo2Evolution} valueKey="vo2max" labelKey="data" height={100} maxValue={60} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textMuted, marginTop:4 }}>
            <span>{vo2Evolution[0].data} — {vo2Evolution[0].vo2max}</span>
            <span>{vo2Evolution[vo2Evolution.length - 1].data} — {vo2Evolution[vo2Evolution.length - 1].vo2max}</span>
          </div>
        </Accordion>
      )}

      {rmEvolution?.length > 0 && (
        <Accordion title={`Evolução 1RM (${rmEvolution.length} avaliações)`} icon="💪">
          <MiniBarChart data={rmEvolution} valueKey="rm" labelKey="data" height={100} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textMuted, marginTop:4 }}>
            <span>{rmEvolution[0].data} — {rmEvolution[0].rm} kg</span>
            <span>{rmEvolution[rmEvolution.length - 1].data} — {rmEvolution[rmEvolution.length - 1].rm} kg</span>
          </div>
        </Accordion>
      )}

      {/* PSE Timeline */}
      {pseSessoes?.length > 0 && (
        <Accordion title={`Timeline PSE (${pseSessoes.length} sessões)`} icon="📊" defaultOpen>
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:80, padding:"4px 0" }}>
            {pseSessoes.map((s, i) => {
              const h = ((s.pse || 0) / 10) * 80;
              const c = PSE_COLORS[Math.round(s.pse)] || C.green;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                  <div style={{ width:"100%", height:Math.max(h, 4), background:c, borderRadius:"3px 3px 0 0", opacity:0.8 }} title={`PSE ${s.pse} · ${s.cargaInternaUA} UA`} />
                  <span style={{ fontSize:6, color:C.textDim }}>{s.data?.slice(5)}</span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>
            PSE médio: <strong style={{color:C.text}}>{pseMedio}/10</strong> · 
            Carga total: <strong style={{color:C.text}}>{pseSessoes.reduce((s, se) => s + (se.cargaInternaUA || 0), 0).toLocaleString()} UA</strong>
          </div>
        </Accordion>
      )}

      {/* Weekly Volume */}
      {weeklyVolume?.length > 0 && (
        <Accordion title="Volume Semanal por Grupo Muscular" icon="📊">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:6 }}>
            {weeklyVolume.map(g => {
              const maxVol = Math.max(...weeklyVolume.map(x => x.volumeLoad), 1);
              const volPct = (g.volumeLoad / maxVol) * 100;
              const intensity = g.volumeLoad > maxVol * 0.7 ? C.red : g.volumeLoad > maxVol * 0.4 ? C.amber : C.green;
              return (
                <div key={g.musculo} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.text, marginBottom:3 }}>{g.musculo}</div>
                  <div style={{ height:5, background:C.border, borderRadius:3, overflow:"hidden", marginBottom:3 }}>
                    <div style={{ height:"100%", width:`${volPct}%`, background:intensity, borderRadius:3, minWidth:4 }} />
                  </div>
                  <div style={{ fontSize:8, color:C.textMuted, display:"flex", justifyContent:"space-between" }}>
                    <span>{g.seriesSemanais} séries</span>
                    <span style={{ fontWeight:700, color:intensity }}>{(g.volumeLoad / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Accordion>
      )}

      {/* ACSM Risk */}
      {acsmRisk && (
        <Accordion title="Estratificação de Risco ACSM" icon="🛡️">
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:18 }}>{acsmRisk.estagio === 3 ? "🔴" : acsmRisk.estagio === 2 ? "🟡" : "🟢"}</span>
            <span style={{ fontWeight:700, fontSize:13, color: acsmRisk.cor }}>{acsmRisk.label}</span>
          </div>
          <div style={{ fontSize:11, color:C.textSub, lineHeight:1.6 }}>{acsmRisk.descricao}</div>
          <div style={{ fontSize:11, color: acsmRisk.cor, background:`${acsmRisk.cor}18`, borderRadius:6, padding:"6px 10px", marginTop:6, lineHeight:1.5 }}>
            📋 {acsmRisk.recomendacao}
          </div>
        </Accordion>
      )}

      {/* Periodization */}
      {macrociclo && (
        <Accordion title="Periodização Ativa" icon="📅">
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:8 }}>
            <strong style={{color:C.text}}>{macrociclo.params?.label}</strong> · {macrociclo.totalSemanas} semanas · {macrociclo.nivel}
          </div>
          {macrociclo.mesociclos?.map((meso, i) => (
            <div key={i} style={{
              background: meso.ehDeload ? C.amberBg : C.surface,
              border:`1px solid ${meso.ehDeload ? C.amber + "40" : C.border}`,
              borderLeft: `3px solid ${meso.ehDeload ? C.amber : C.green}`,
              borderRadius:6, padding:"8px 12px", marginBottom:6,
            }}>
              <div style={{ fontSize:11, fontWeight:700, color: meso.ehDeload ? C.amber : C.text }}>{meso.nome}</div>
              <div style={{ fontSize:10, color:C.textMuted }}>{meso.semanas} · {meso.objetivo}</div>
            </div>
          ))}
        </Accordion>
      )}
    </div>
  );
}
