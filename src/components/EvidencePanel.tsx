// @ts-nocheck
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const C = {
  bg:"var(--bg)",surface:"var(--surface)",card:"var(--card)",cardAlt:"var(--cardAlt)",
  border:"var(--border)",green:"var(--green)",greenDim:"var(--greenDim)",
  greenBg:"var(--greenBg)",amber:"var(--amber)",amberBg:"var(--amberBg)",
  red:"var(--red)",redBg:"var(--redBg)",blue:"var(--blue)",blueBg:"var(--blueBg)",
  purple:"var(--purple)",purpleBg:"var(--purpleBg)",
  text:"var(--text)",textSub:"var(--textSub)",textMuted:"var(--textMuted)",textDim:"var(--textDim)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

function ExtLink({ href, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color:C.blue, textDecoration:"none", fontSize:12, fontWeight:600, display:"inline-flex", alignItems:"center", gap:4, transition:"color 0.12s" }}
      onMouseEnter={e => e.target.style.color = C.green}
      onMouseLeave={e => e.target.style.color = C.blue}>
      {label}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  );
}

function Badge({ label, color, bg }) {
  return (
    <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.06em", padding:"2px 8px", borderRadius:20, color, background:bg || `${color}18`, border:`1px solid ${color}40`, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

const EVIDENCE_LABELS = {
  lombalgia: { icon:"🦴", color:"#F59E0B" },
  cervicalgia: { icon:"🦴", color:"#8B5CF6" },
  gonalgia: { icon:"🦵", color:"#3B82F6" },
  ombralgia: { icon:"💪", color:"#EF4444" },
  tornozelo: { icon:"🦶", color:"#10B981" },
  cotovelo: { icon:"💪", color:"#F97316" },
  "fascite-plantar":{ icon:"🦶", color:"#6366F1" },
  "tendinopatia-aquiles":{ icon:"🦶", color:"#14B8A6" },
  lca:{ icon:"🦵", color:"#0EA5E9" },
  "artrose-joelho":{ icon:"🦵", color:"#8B5CF6" },
  coxartrose:{ icon:"🦵", color:"#EC4899" },
  "hernia-disco-lombar":{ icon:"🦴", color:"#F59E0B" },
  fibromialgia:{ icon:"🧠", color:"#A855F7" },
};

const TABS = ["Diretriz Clínica", "Padrão-Ouro", "Referências"];

function StudyCard({ study }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.borderLight}`, borderRadius:8, padding:"10px 14px", marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:3 }}>{study.titulo}</div>
          <div style={{ fontSize:11, color:C.textSub, lineHeight:1.5 }}>{study.conclusao}</div>
          <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"2px 8px", fontWeight:600 }}>{study.id}</span>
            <span style={{ fontSize:10, color:C.textMuted, background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"2px 8px" }}>{study.fonte}</span>
            {study.url && <ExtLink href={study.url} label="Artigo" />}
            {study.doi && <ExtLink href={`https://doi.org/${study.doi}`} label="DOI" />}
          </div>
        </div>
        <div style={{ textAlign:"center", flexShrink:0 }}>
          <div style={{ fontSize:18, fontWeight:900, color:C.green }}>{study.pontuacao}</div>
          <div style={{ fontSize:9, color:C.textMuted, fontWeight:700 }}>/10 PEDro</div>
        </div>
      </div>
    </div>
  );
}

function RefLink({ ref }) {
  return (
    <div style={{ padding:"6px 0", borderBottom:`1px solid ${C.borderLight}`, display:"flex", gap:8, alignItems:"flex-start" }}>
      <span style={{ fontSize:10, color:C.textMuted, fontWeight:700, minWidth:80, flexShrink:0, letterSpacing:"0.03em" }}>{ref.id}</span>
      <div style={{ flex:1 }}>
        <span style={{ fontSize:12, color:C.text }}>{ref.title}</span>
      </div>
      {ref.url && <ExtLink href={ref.url} label="Abrir" />}
    </div>
  );
}

export default function EvidencePanel({ evidence, kb }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [expanded, setExpanded] = useState("");
  const [activeTab, setActiveTab] = useState({});

  const toggle = (key) => setExpanded(p => p === key ? "" : key);

  return (
    <div style={{ maxWidth:800, margin:"0 auto" }}>
      <div style={{ marginBottom:14, padding:"12px 16px", background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:12, fontSize:12, color:C.textSub, lineHeight:1.7 }}>
        📚 Base de evidências do SASYRA — estudos PEDro ≥ 7, meta-análises Cochrane e CPGs internacionais
        (JOSPT, NICE, APTA, EuroPain). Atualizado conforme guidelines 2025–2026.
      </div>

      {Object.entries(kb).map(([key, entry]) => {
        const ev = evidence[key];
        if (!ev) return null;
        const meta = EVIDENCE_LABELS[key] || { icon:"📋", color:C.green };
        const isOpen = expanded === key;
        const tab = activeTab[key] || 0;
        const pedroCount = ev.pedro?.length || 0;
        const refCount = ev.referencias?.length || 0;

        return (
          <div key={key} style={{
            background:C.card, border:`1px solid ${isOpen ? meta.color+"50" : C.border}`,
            borderRadius:14, marginBottom:10, overflow:"hidden",
            transition:"border-color 0.15s",
          }}>
            {/* Header (clickable accordion) */}
            <div onClick={() => toggle(key)}
              style={{
                display:"flex", alignItems:"center", gap:10, padding:isMobile?"12px 14px":"14px 18px",
                cursor:"pointer", userSelect:"none",
                background: isOpen ? `${meta.color}08` : "transparent",
                transition:"background 0.12s",
              }}>
              <span style={{ fontSize:18 }}>{meta.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:isMobile?12:13, fontWeight:800, color:C.text, marginBottom:1 }}>
                  {entry.label}
                </div>
                {ev.atualizacao && (
                  <div style={{ fontSize:9, color:C.textMuted, display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span>🕐 {ev.atualizacao}</span>
                  </div>
                )}
              </div>
              <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                {pedroCount > 0 && <Badge label={`${pedroCount} PEDro`} color={C.green} />}
                {refCount > 0 && <Badge label={`${refCount} refs`} color={C.blue} />}
              </div>
              <span style={{ fontSize:11, color:C.textMuted, transition:"transform 0.15s", transform:isOpen?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
            </div>

            {/* Expanded body */}
            {isOpen && (
              <div style={{ padding:isMobile?"8px 12px 14px":"10px 18px 18px", borderTop:`1px solid ${C.borderLight}` }}>
                {/* Sub-tabs */}
                <div style={{ display:"flex", gap:2, marginBottom:14, flexWrap:"wrap" }}>
                  {TABS.map((t, i) => (
                    <button key={t} onClick={() => setActiveTab(p => ({...p, [key]:i}))}
                      style={{
                        background: tab === i ? `${meta.color}18` : C.surface,
                        border: tab === i ? `1px solid ${meta.color}50` : `1px solid ${C.borderLight}`,
                        borderRadius:8, padding:"6px 14px", fontSize:isMobile?10:11, fontWeight: tab === i ? 800 : 600,
                        color: tab === i ? meta.color : C.textMuted, cursor:"pointer", fontFamily:F, transition:"all 0.1s",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* Tab: Diretriz Clínica */}
                {tab === 0 && (
                  <div>
                    {ev.diretrizes?.length > 0 ? (
                      ev.diretrizes.map((d, i) => (
                        <div key={i} style={{ background:C.surface, border:`1px solid ${C.borderLight}`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:6 }}>
                            <div style={{ fontWeight:700, fontSize:12, color:C.text, flex:1 }}>{d.title}</div>
                            <Badge label={d.org} color={meta.color} />
                          </div>
                          <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7, marginBottom:8 }}>{d.summary}</div>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                            {d.grade && <Badge label={`Grau ${d.grade}`} color={C.green} bg={C.greenBg} />}
                            {d.year && <span style={{ fontSize:10, color:C.textMuted }}>{d.year}</span>}
                            {d.url && <ExtLink href={d.url} label="Diretriz completa" />}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7, marginBottom:10 }}>
                        {entry.goldStandard}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Padrão-Ouro */}
                {tab === 1 && (
                  <div>
                    {/* Conduta padrão-ouro */}
                    <div style={{ background:`${C.greenBg}80`, border:`1px solid ${C.green}40`, borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
                      <div style={{ fontSize:10, fontWeight:800, color:C.green, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>
                        🏆 Conduta Padrão-Ouro
                      </div>
                      <div style={{ fontSize:12, color:C.text, lineHeight:1.7 }}>
                        {entry.goldStandard}
                      </div>
                    </div>

                    {/* Estudos PEDro */}
                    {pedroCount > 0 && (
                      <>
                        <div style={{ fontSize:10, fontWeight:800, color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8, marginTop:4 }}>
                          🔬 Ensaios Clínicos (PEDro ≥ 7)
                        </div>
                        {ev.pedro.map(study => (
                          <StudyCard key={study.id} study={study} />
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* Tab: Referências */}
                {tab === 2 && (
                  <div>
                    {ev.referencias?.length > 0 ? (
                      <>
                        <div style={{ fontSize:10, fontWeight:800, color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>
                          📖 Referências Bibliográficas
                        </div>
                        {ev.referencias.map((r, i) => (
                          <RefLink key={i} ref={r} />
                        ))}
                      </>
                    ) : (
                      <div style={{ fontSize:12, color:C.textMuted, fontStyle:"italic" }}>
                        Nenhuma referência adicional cadastrada para esta condição.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
