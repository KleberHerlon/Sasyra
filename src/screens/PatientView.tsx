// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { getPatientTreinosAtivos, getUltimaAvaliacao, getEvolucaoPeso, getPseHistory, recordPatientView, getPatientAppData } from "../data/patientApp";

const C = {
  bg:"#0E141B",surface:"#111822",card:"#19243A",cardAlt:"#162030",
  border:"#1F2E45",borderLight:"#2A3F5C",green:"#4ADE80",greenDim:"#22C55E",
  greenDeep:"#0D9E5C",greenBg:"rgba(74,222,128,0.09)",greenBgHov:"rgba(74,222,128,0.16)",
  amber:"#FBBF24",amberBg:"rgba(251,191,36,0.10)",red:"#F87171",redBg:"rgba(248,113,113,0.09)",
  blue:"#60A5FA",blueBg:"rgba(96,165,250,0.09)",purple:"#A78BFA",purpleBg:"rgba(167,139,250,0.09)",
  text:"#DDE6F0",textSub:"#A8BECC",textMuted:"#5E7A96",textDim:"#364D62",white:"#FFFFFF",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

function Label({ children, color }) {
  return <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color: color || C.textMuted, marginBottom:4, display:"block" }}>{children}</span>;
}

function Card({ children, accent }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${accent ? accent + "40" : C.border}`, borderLeft: accent ? `3px solid ${accent}` : `1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", marginBottom:12 }}>
      {children}
    </div>
  );
}

function Badge({ children, color }) {
  return <span style={{ fontSize:10, fontWeight:700, background: `${color || C.blue}18`, color: color || C.blue, border:`1px solid ${color || C.blue}40`, borderRadius:6, padding:"2px 8px", display:"inline-block", marginRight:4, marginBottom:4 }}>{children}</span>;
}

function EvoBar({ value, max, label, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom:8, fontSize:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
        <span style={{ color:C.textSub }}>{label}</span>
        <span style={{ fontWeight:700, color: color || C.text }}>{value}{max ? `/${max}` : ""}</span>
      </div>
      <div style={{ height:6, background:C.border, borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background: color || C.green, borderRadius:99, transition:"width 0.4s" }} />
      </div>
    </div>
  );
}

export default function PatientView({ studentId, onBack }) {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("treinos");

  useEffect(() => {
    if (studentId) {
      recordPatientView(studentId);
      try {
        const raw = localStorage.getItem("pe_data");
        const peData = raw ? JSON.parse(raw) : {};
        const studentRaw = localStorage.getItem("sasyra_patients");
        const students = studentRaw ? JSON.parse(studentRaw) : [];
        const studentData = students.find(p => (p.id || p.nome) === studentId) || { nome: studentId };
        setData({
          student: studentData,
          treinos: getPatientTreinosAtivos(studentId),
          ultimaAvaliacao: getUltimaAvaliacao(studentId),
          evolucao: getEvolucaoPeso(studentId),
          pse: getPseHistory(studentId),
          peData: peData[studentId] || {},
        });
      } catch { setData(null); }
    }
  }, [studentId]);

  const stats = useMemo(() => {
    if (!data) return null;
    const lastAv = data.ultimaAvaliacao;
    return {
      gordura: lastAv?.percentualGordura,
      peso: data.student?.peso,
      treinosCount: data.treinos?.length || 0,
      assessmentsCount: (data.peData?.assessments?.length) || 0,
    };
  }, [data]);

  const ultimoTreino = useMemo(() => {
    if (!data?.treinos || data.treinos.length === 0) return null;
    return data.treinos[0];
  }, [data]);

  if (!studentId) {
    return (
      <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F, color:C.text, padding:24 }}>
        <div style={{ textAlign:"center", maxWidth:400 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔑</div>
          <h2 style={{ fontSize:20, fontWeight:800, margin:"0 0 8px" }}>Acesso do Paciente</h2>
          <p style={{ fontSize:13, color:C.textMuted, lineHeight:1.6, marginBottom:20 }}>
            Código de acesso inválido. Solicite um novo código ao seu profissional de saúde.
          </p>
          {onBack && <button onClick={onBack} style={{ background:C.green, color:"#061A0C", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F }}>Voltar</button>}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F, color:C.text }}>
        <div style={{ fontSize:14, color:C.textMuted }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, paddingBottom:80 }}>
      <div style={{ background:`linear-gradient(135deg, ${C.greenDeep} 0%, ${C.green} 100%)`, padding:"40px 20px 24px", textAlign:"center" }}>
        <div style={{ width:56, height:56, background:"rgba(255,255,255,0.2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#fff", margin:"0 auto 10px" }}>
          {data.student?.nome?.[0]?.toUpperCase() || "?"}
        </div>
        <h1 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>{data.student?.nome || "Paciente"}</h1>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.8)", margin:0 }}>Seu portal de treinos e evolução</p>
      </div>

      {stats && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8, margin:"-16px 16px 16px", position:"relative", zIndex:1 }}>
          <div style={{ background:C.card, borderRadius:10, padding:"12px 8px", textAlign:"center", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:18, fontWeight:900, color:C.green }}>{stats.treinosCount}</div>
            <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>Treinos</div>
          </div>
          <div style={{ background:C.card, borderRadius:10, padding:"12px 8px", textAlign:"center", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:18, fontWeight:900, color:C.blue }}>{stats.assessmentsCount}</div>
            <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>Avaliações</div>
          </div>
          <div style={{ background:C.card, borderRadius:10, padding:"12px 8px", textAlign:"center", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:18, fontWeight:900, color:C.amber }}>{stats.gordura ? stats.gordura + "%" : "—"}</div>
            <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>% Gordura</div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", gap:4, padding:"0 16px", marginBottom:16, flexWrap:"wrap" }}>
        {[["treinos","🏋️","Treinos"],["avaliacao","📊","Avaliação"],["evolucao","📈","Evolução"]].map(([k,ic,lb]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex:1, background: tab === k ? C.greenBg : "transparent",
            border: `1px solid ${tab === k ? C.green + "50" : C.border}`,
            borderRadius: 8, padding: "8px 12px", fontSize: 11,
            fontWeight: tab === k ? 700 : 400,
            color: tab === k ? C.green : C.textMuted, cursor: "pointer", fontFamily: F,
            textAlign:"center", minWidth:0,
          }}>{ic} {lb}</button>
        ))}
      </div>

      <div style={{ padding:"0 16px" }}>
        {tab === "treinos" && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:C.text }}>📋 Meus Treinos</span>
              {ultimoTreino && <span style={{ fontSize:10, color:C.textMuted }}>Último: {ultimoTreino.dataPrescricao}</span>}
            </div>
            {ultimoTreino ? (
              ultimoTreino.estrutura?.map((grupo, gi) => (
                <Card key={gi} accent={C.green}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <span style={{ fontSize:14, fontWeight:900, color:C.green }}>{grupo.key}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{grupo.nome}</div>
                      <div style={{ fontSize:10, color:C.textMuted }}>Foco: {grupo.foco}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:10, color:C.textDim, marginBottom:8, display:"flex", gap:12 }}>
                    <span>🎯 {ultimoTreino.objetivo}</span>
                    <span>📊 {ultimoTreino.nivel}</span>
                  </div>
                  {grupo.exercicios?.map((ex, ei) => (
                    <div key={ei} style={{ background:C.surface, borderRadius:8, padding:"12px", marginBottom:6, border:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                        <span style={{ fontSize:10, fontWeight:800, color:C.textDim, marginTop:2 }}>{ei + 1}.</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:2 }}>{ex.nome}</div>
                          <div style={{ fontSize:10, color:C.textSub }}>{ex.musculoPrimario}{ex.equipamento ? ` · ${ex.equipamento}` : ""}</div>
                          <div style={{ display:"flex", gap:12, marginTop:6, fontSize:11 }}>
                            <span style={{ color:C.blue, fontWeight:700 }}>{ex.series}x</span>
                            <span style={{ color:C.amber, fontWeight:700 }}>{ex.repeticoes} reps</span>
                            {ex.carga && <span style={{ color:C.green, fontWeight:700 }}>{ex.carga} kg</span>}
                            <span style={{ color:C.textMuted, fontSize:10 }}>⏱ {ex.descanso}</span>
                          </div>
                          {ex.instrucoes?.length > 0 && (
                            <details style={{ marginTop:6 }}>
                              <summary style={{ fontSize:10, color:C.blue, cursor:"pointer", fontWeight:600 }}>Instruções</summary>
                              <ol style={{ paddingLeft:18, margin:"6px 0", fontSize:10, color:C.textSub, lineHeight:1.6 }}>
                                {ex.instrucoes.map((inst, ii) => <li key={ii}>{inst}</li>)}
                              </ol>
                            </details>
                          )}
                          {ex.videoUrl && (
                            <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:10, color:C.blue, textDecoration:"underline", display:"inline-block", marginTop:4 }}>🎥 Ver vídeo</a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              ))
            ) : (
              <Card>
                <div style={{ textAlign:"center", padding:"20px 0" }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>🏋️</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.textSub }}>Nenhum treino cadastrado ainda</div>
                  <p style={{ fontSize:12, color:C.textMuted, margin:"4px 0 0" }}>Seu profissional ainda não prescreveu treinos para você.</p>
                </div>
              </Card>
            )}

            {data.pse?.length > 0 && (
              <Card accent={C.purple}>
                <Label>📊 Últimas sessões PSE</Label>
                <div style={{ display:"flex", gap:8, overflow:"auto", paddingBottom:4 }}>
                  {data.pse.slice(-7).reverse().map((s, i) => {
                    const intensity = s.pse <= 3 ? C.green : s.pse <= 6 ? C.amber : C.red;
                    return (
                      <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px", minWidth:70, textAlign:"center", flexShrink:0 }}>
                        <div style={{ fontSize:18, fontWeight:900, color:intensity }}>{s.pse}</div>
                        <div style={{ fontSize:9, color:C.textMuted }}>{s.data?.slice(5) || "—"}</div>
                        <div style={{ fontSize:8, color:C.textDim }}>{s.duracao}min</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </>
        )}

        {tab === "avaliacao" && (
          <>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:10 }}>📊 Minha Avaliação Física</div>
            {data.ultimaAvaliacao ? (
              <>
                <Card accent={C.amber}>
                  <Label>Última avaliação</Label>
                  <div style={{ fontSize:11, color:C.textMuted, marginBottom:8 }}>Data: {data.ultimaAvaliacao.data}</div>
                  {data.ultimaAvaliacao.percentualGordura && (
                    <EvoBar value={data.ultimaAvaliacao.percentualGordura} max={40} label="% Gordura" color={C.green} />
                  )}
                  {data.ultimaAvaliacao.densidadeCorporal && (
                    <div style={{ fontSize:12, marginBottom:4 }}><span style={{ color:C.textSub }}>Densidade corporal:</span> <strong style={{color:C.text}}>{data.ultimaAvaliacao.densidadeCorporal} g/cm³</strong></div>
                  )}
                  {data.ultimaAvaliacao.rm?.rm && (
                    <div style={{ fontSize:12, marginBottom:4 }}>
                      <span style={{ color:C.textSub }}>1RM (Brzycki):</span> <strong style={{color:C.amber}}>{data.ultimaAvaliacao.rm.rm} kg</strong>
                      {data.ultimaAvaliacao.rm.classe && <Badge color={C.purple}>{data.ultimaAvaliacao.rm.classe}</Badge>}
                    </div>
                  )}
                  {data.ultimaAvaliacao.cooper?.vo2max && (
                    <div style={{ fontSize:12, marginBottom:4 }}>
                      <span style={{ color:C.textSub }}>VO₂max (Cooper):</span> <strong style={{color:C.blue}}>{data.ultimaAvaliacao.cooper.vo2max} ml/kg/min</strong>
                      <Badge color={C.amber}>{data.ultimaAvaliacao.cooper.classificacao}</Badge>
                    </div>
                  )}
                  {data.ultimaAvaliacao.isak?.percentualGordura && (
                    <div style={{ fontSize:12, marginBottom:4 }}>
                      <span style={{ color:C.textSub }}>ISAK %G:</span> <strong style={{color:C.text}}>{data.ultimaAvaliacao.isak.percentualGordura}%</strong>
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <Card>
                <div style={{ textAlign:"center", padding:"20px 0" }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>📏</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.textSub }}>Nenhuma avaliação registrada</div>
                </div>
              </Card>
            )}
          </>
        )}

        {tab === "evolucao" && (
          <>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:10 }}>📈 Minha Evolução</div>
            {data.evolucao?.length > 0 ? (
              <Card accent={C.green}>
                <Label>Evolução do % de Gordura</Label>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:100, padding:"4px 0" }}>
                  {data.evolucao.filter(a => a.percentualGordura).map((pt, i) => {
                    const h = (pt.percentualGordura / 40) * 80;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                        <span style={{ fontSize:9, color:C.green, fontWeight:700 }}>{pt.percentualGordura}%</span>
                        <div style={{ width:"100%", height:Math.max(h, 4), background:C.green, borderRadius:"3px 3px 0 0", opacity:0.8 }} />
                        <span style={{ fontSize:8, color:C.textDim, textAlign:"center" }}>{pt.data?.slice(5) || ""}</span>
                      </div>
                    );
                  })}
                </div>
                {data.evolucao.length >= 2 && (() => {
                  const first = data.evolucao.find(a => a.percentualGordura);
                  const last = data.evolucao.filter(a => a.percentualGordura).pop();
                  if (!first || !last) return null;
                  const diff = (first.percentualGordura - last.percentualGordura).toFixed(1);
                  return (
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:8, textAlign:"center" }}>
                      {diff > 0
                        ? <span style={{ color: C.green }}>↓ Redução de {diff} p.p. de gordura corporal</span>
                        : diff < 0
                        ? <span style={{ color: C.amber }}>↑ Aumento de {Math.abs(diff)} p.p.</span>
                        : <span>Estável</span>
                      }
                    </div>
                  );
                })()}
              </Card>
            ) : (
              <Card>
                <div style={{ textAlign:"center", padding:"20px 0" }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>📈</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.textSub }}>Dados insuficientes para gráfico</div>
                  <p style={{ fontSize:12, color:C.textMuted, margin:"4px 0 0" }}>Serão necessárias pelo menos 2 avaliações para mostrar a evolução.</p>
                </div>
              </Card>
            )}

            {data.pse?.length > 0 && (
              <Card accent={C.purple}>
                <Label>📊 Carga Interna (PSE × Duração)</Label>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:80, padding:"4px 0" }}>
                  {data.pse.slice(-14).map((s, i) => {
                    const maxVal = 1000;
                    const h = (s.cargaInternaUA / maxVal) * 60;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                        <span style={{ fontSize:7, color:C.textDim }}>{s.cargaInternaUA}</span>
                        <div style={{ width:"100%", height:Math.max(h, 4), background: s.pse <= 3 ? C.green : s.pse <= 6 ? C.amber : C.red, borderRadius:"2px 2px 0 0", opacity:0.8 }} />
                        <span style={{ fontSize:7, color:C.textDim }}>{s.data?.slice(5) || ""}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, padding:"10px 16px", display:"flex", justifyContent:"center" }}>
        <span style={{ fontSize:10, color:C.textDim }}>SASYRA · Portal do Paciente</span>
      </div>
    </div>
  );
}