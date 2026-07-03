import { useMemo, useState } from "react";
import { useMediaQuery } from "../components";

const C = {
  bg: "var(--bg)", surface: "var(--surface)", card: "var(--card)", border: "var(--border)",
  green: "var(--green)", greenBg: "var(--greenBg)",
  amber: "var(--amber)", amberBg: "var(--amberBg)",
  red: "var(--red)", redBg: "var(--redBg)",
  blue: "var(--blue)", purple: "var(--purple)",
  text: "var(--text)", textSub: "var(--textSub)", textMuted: "var(--textMuted)", textDim: "var(--textDim)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

const MODULES = [
  { id: "ortopedica",      key: "assessment", icon: "🦴", title: "Ortopédica",     color: C.green,      enhancerKey: null },
  { id: "neurologica",     key: "neuro",      icon: "🧠", title: "Neurológica",    color: C.purple,     enhancerKey: "neuro" },
  { id: "pediatrica",      key: "ped",        icon: "👶", title: "Pediátrica",     color: C.blue,       enhancerKey: "ped" },
  { id: "cardioRespiratoria", key: "cardio",  icon: "❤️", title: "Cardio-Resp.",   color: C.red,        enhancerKey: "cardio" },
  { id: "uroginecologica", key: "uro",        icon: "🚺", title: "Uro-Ginecol.",   color: C.amber,      enhancerKey: "uro" },
  { id: "geriatria",       key: "geriatria",  icon: "👴", title: "Geriatria",      color: C.green,      enhancerKey: "geriatria" },
  { id: "dermatoFuncional", key: "dermato",   icon: "🔬", title: "Dermatofunc.",   color: C.amber,      enhancerKey: "dermato" },
  { id: "reumatologica",   key: "reumato",    icon: "🦴", title: "Reumatológica",  color: C.purple,     enhancerKey: "reumato" },
  { id: "esportiva",       key: "esportiva",  icon: "⚽", title: "Esportiva",      color: C.blue,       enhancerKey: "esportiva" },
  { id: "oncologica",      key: "onco",       icon: "🎗️", title: "Oncológica",    color: C.amber,      enhancerKey: "onco" },
  { id: "nutricao",        key: "nutri",      icon: "🥗", title: "Nutrição",       color: C.green,      enhancerKey: "nutri" },
  { id: "crossfit",        key: "cf",         icon: "💪", title: "CrossFit",       color: C.amber,      enhancerKey: "cf" },
  { id: "terapiaOcupacional", key: "to",      icon: "🖐️", title: "T. Ocupacional", color: "#F472B6",    enhancerKey: "to" },
  { id: "educacaoFisica",  key: "pe",         icon: "🏋️", title: "Ed. Física",    color: C.blue,       enhancerKey: "pe" },
];

function readStorage(key) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : null; } catch { return null; }
}

function loadModuleData(patientId) {
  const results = [];
  for (const mod of MODULES) {
    let data = null;
    if (mod.id === "ortopedica") {
      const all = readStorage("sasyra_assessments");
      if (all) {
        const pts = all.filter(a => a.patientId === patientId);
        if (pts.length > 0) data = pts.sort((a, b) => (b.id || 0) - (a.id || 0))[0];
      }
    } else {
      data = readStorage(`${mod.key}_data_${patientId}`);
    }
    const enhancer = mod.enhancerKey ? readStorage(`${mod.enhancerKey}_enhancer_${patientId}`) : null;
    if (data || enhancer) {
      const evaMov = data?.evaMov ?? enhancer?.pain?.eva ?? null;
      const evaRep = data?.evaRep ?? null;
      const logs = enhancer?.logs || [];
      const redFlags = enhancer?.redFlags?.length || data?.selectedRedFlags?.length || 0;
      const lastLog = logs.length ? [...logs].sort((a, b) => (b.data || "").localeCompare(a.data || ""))[0] : null;
      const self = mod.id === "ortopedica" ? 0 : 1;
      const regiao = data?.regiao || null;
      results.push({ ...mod, data, enhancer, evaMov, evaRep, logs, redFlags, lastLog, regiao });
    }
  }
  return results;
}

function cardStyle(extra) {
  return { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 14, ...extra };
}
function inp(extra) {
  return { width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 12px", outline: "none", fontFamily: F, ...extra };
}
function primaryBtn(extra) {
  return { background: C.green, color: "#061A0C", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...extra };
}
function ghostBtn(extra) {
  return { background: "transparent", color: C.green, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...extra };
}

export default function GlobalDashboard({ patient, onBack }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  const pid = patient?.id || patient?.nome;
  const [sortBy, setSortBy] = useState("recent");

  const modules = useMemo(() => {
    if (!pid) return [];
    return loadModuleData(pid);
  }, [pid]);

  const sorted = useMemo(() => {
    if (sortBy === "eva") return [...modules].sort((a, b) => (b.evaMov ?? -1) - (a.evaMov ?? -1));
    if (sortBy === "sessions") return [...modules].sort((a, b) => b.logs.length - a.logs.length);
    return modules;
  }, [modules, sortBy]);

  const aggregates = useMemo(() => {
    const totalSessions = modules.reduce((s, m) => s + m.logs.length, 0);
    const totalRedFlags = modules.reduce((s, m) => s + m.redFlags, 0);
    const painModules = modules.filter(m => m.evaMov != null);
    const avgPain = painModules.length ? (painModules.reduce((s, m) => s + m.evaMov, 0) / painModules.length).toFixed(1) : null;
    const modulesWithData = modules.filter(m => m.data);
    const modulesWithEnhancer = modules.filter(m => m.enhancer);
    return { totalSessions, totalRedFlags, avgPain, modulesWithData: modulesWithData.length, modulesWithEnhancer: modulesWithEnhancer.length };
  }, [modules]);

  if (!pid) return <div style={{ padding: 40, textAlign: "center", color: C.textSub, fontFamily: F }}>Nenhum paciente selecionado.</div>;

  return (
    <div style={{ background: `radial-gradient(ellipse at 50% 0%, ${C.card} 0%, ${C.bg} 70%)`, minHeight: "100vh", fontFamily: F, color: C.text, padding: isMobile ? 12 : 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onBack} style={ghostBtn({ fontSize: 12 })}>← Voltar</button>
            <div style={{ width: 36, height: 36, background: C.greenBg, border: `1px solid ${C.green}40`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: C.green }}>{patient.nome?.[0]?.toUpperCase()}</div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>{patient.nome}</span>
            {patient.dataNasc && <span style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Nasc: {patient.dataNasc}</span>}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["recent", "eva", "sessions"].map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                style={{ background: sortBy === s ? C.greenBg : "transparent", border: `1px solid ${sortBy === s ? C.green + "50" : C.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: sortBy === s ? 700 : 400, color: sortBy === s ? C.green : C.textMuted, cursor: "pointer", fontFamily: F }}>
                {s === "recent" ? "📅 Recente" : s === "eva" ? "💉 Dor" : "📋 Sessões"}
              </button>
            ))}
          </div>
        </div>

        {/* Aggregate cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
          {[
            ["📊", "Módulos com dados", `${aggregates.modulesWithData}/${modules.length}`, C.green],
            ["📅", "Total de sessões", aggregates.totalSessions, C.blue],
            ["🚩", "Red flags ativas", aggregates.totalRedFlags, aggregates.totalRedFlags > 0 ? C.red : C.textMuted],
            ["💉", "Média de dor (EVA)", aggregates.avgPain ?? "—", aggregates.avgPain > 5 ? C.red : aggregates.avgPain > 3 ? C.amber : C.green],
          ].map(([icon, label, value, color]) => (
            <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1.2 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          {modules.length === 0 ? "Nenhum dado encontrado para este paciente" : `${modules.length} módulo(s) com dados`}
        </div>

        {sorted.length === 0 && (
          <div style={{ ...cardStyle({ textAlign: "center", padding: "40px 24px" }) }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.textSub, marginBottom: 6 }}>Nenhum dado encontrado</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Este paciente ainda não possui registros em nenhum módulo.</div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
          {sorted.map(mod => (
            <div key={mod.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", borderLeft: `3px solid ${mod.color}` }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{mod.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: mod.color }}>{mod.title}</div>
                  {mod.lastLog && <div style={{ fontSize: 10, color: C.textDim, marginTop: 1, letterSpacing: "0.04em" }}>Última sessão: {mod.lastLog.data}</div>}
                </div>
                <div style={{ fontSize: 10, color: C.textDim, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>
                  {mod.logs.length} sessão(ões)
                </div>
              </div>

              {/* Pain + Red Flags */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                <div style={{ textAlign: "center", background: C.surface, borderRadius: 8, padding: "8px 6px" }}>
                  <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>EVA Mov.</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: mod.evaMov != null ? (mod.evaMov > 5 ? C.red : mod.evaMov > 3 ? C.amber : C.green) : C.textDim }}>{mod.evaMov != null ? mod.evaMov : "—"}</div>
                </div>
                <div style={{ textAlign: "center", background: C.surface, borderRadius: 8, padding: "8px 6px" }}>
                  <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>EVA Rep.</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: mod.evaRep != null ? (mod.evaRep > 5 ? C.red : mod.evaRep > 3 ? C.amber : C.green) : C.textDim }}>{mod.evaRep != null ? mod.evaRep : "—"}</div>
                </div>
                <div style={{ textAlign: "center", background: C.surface, borderRadius: 8, padding: "8px 6px" }}>
                  <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Red Flags</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: mod.redFlags > 0 ? C.red : C.textDim }}>{mod.redFlags > 0 ? `${mod.redFlags} 🚩` : "0"}</div>
                </div>
              </div>

              {/* AI summary */}
              {mod.enhancer?.aiRes && (
                <div style={{ fontSize: 11, color: C.textSub, lineHeight: 1.6, background: C.surface, borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.border}`, marginBottom: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>🤖 Análise IA</div>
                  <div style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{mod.enhancer.aiRes}</div>
                </div>
              )}

              {/* Module-specific quick stats */}
              {mod.data && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {mod.data.queixa && <span style={{ fontSize: 10, background: C.greenBg, color: C.green, borderRadius: 6, padding: "2px 8px", fontWeight: 600, border: `1px solid ${C.green}30` }}>🩺 {mod.data.queixa.slice(0, 50)}{mod.data.queixa.length > 50 ? "…" : ""}</span>}
                  {mod.data.regiao && <span style={{ fontSize: 10, color: C.textMuted, background: C.surface, borderRadius: 6, padding: "2px 8px", border: `1px solid ${C.border}` }}>📍 {mod.data.regiao}</span>}
                  {mod.data.localDor?.length > 0 && <span style={{ fontSize: 10, color: C.blue, background: C.surface, borderRadius: 6, padding: "2px 8px", border: `1px solid ${C.border}` }}>📍 {mod.data.localDor.slice(0, 3).join(", ")}{mod.data.localDor.length > 3 ? "…" : ""}</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cross-module insights */}
        {modules.length >= 2 && (
          <div style={{ ...cardStyle({ marginTop: 20 }) }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>🔗 Insights Cross-Módulo</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {aggregates.totalRedFlags > 0 && (
                <div style={{ fontSize: 12, color: C.red, background: C.redBg, borderRadius: 8, padding: "8px 12px", border: `1px solid ${C.red}40` }}>
                  🚩 <strong>{aggregates.totalRedFlags} red flag(s)</strong> identificada(s) em {modules.filter(m => m.redFlags > 0).length} módulo(s) — revisar bandeiras vermelhas antes de procedimentos.
                </div>
              )}
              {aggregates.avgPain && (
                <div style={{ fontSize: 12, color: C.text, background: C.surface, borderRadius: 8, padding: "8px 12px", border: `1px solid ${C.border}` }}>
                  💉 <strong>Média de dor (EVA) global</strong>: {aggregates.avgPain}/10 ({aggregates.avgPain <= 3 ? "Leve" : aggregates.avgPain <= 6 ? "Moderada" : "Intensa"}) — calculada em {modules.filter(m => m.evaMov != null).length} módulo(s).
                </div>
              )}
              {aggregates.totalSessions > 0 && (
                <div style={{ fontSize: 12, color: C.text, background: C.surface, borderRadius: 8, padding: "8px 12px", border: `1px solid ${C.border}` }}>
                  📅 <strong>Total de {aggregates.totalSessions} sessões</strong> realizadas em {modules.filter(m => m.logs.length > 0).length} módulo(s).
                </div>
              )}
              <div style={{ fontSize: 12, color: C.textSub, background: C.surface, borderRadius: 8, padding: "8px 12px", border: `1px solid ${C.border}` }}>
                📊 Paciente com registros em <strong>{modules.length}</strong> módulo(s) — {aggregates.modulesWithData} com avaliação clínica, {aggregates.modulesWithEnhancer} com dados de evolução.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
