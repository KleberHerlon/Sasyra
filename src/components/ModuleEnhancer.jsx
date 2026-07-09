import { useState, useRef, useEffect } from "react";
import { GonioRow, MRCRow, JOINTS, MVMT, MUSCLES } from "../components";
import { AI_LIMITS, AI_OVERAGE } from "../data/plans";

const STYLE = {
  evaColor: (v) => v <= 3 ? "#22c55e" : v <= 6 ? "#eab308" : "#ef4444",
};

function TagSelect({ options, value, onChange, colors }) {
  const toggle = (v) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((o) => {
        const v = o.value || o, l = o.label || o, active = value.includes(v);
        return (
          <button key={v} type="button" onClick={() => toggle(v)}
            style={{
              background: active ? `${colors.accent}18` : colors.surface,
              border: `1px solid ${active ? colors.accent + "50" : colors.border}`,
              color: active ? colors.accent : colors.textMuted,
              borderRadius: 10, padding: "6px 14px", fontSize: 12,
              fontWeight: active ? 700 : 400, cursor: "pointer",
              fontFamily: colors.font || "'Inter',sans-serif",
              transition: "all 0.12s",
            }}>
            {active && "✓ "}{l}
          </button>
        );
      })}
    </div>
  );
}

function EvaSlider({ label, value, onChange, colors }) {
  const c = STYLE.evaColor(value);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub }}>{label}</span>
        <span style={{ fontSize: 18, fontWeight: 900, color: c, lineHeight: 1 }}>{value}<span style={{ fontSize: 10, fontWeight: 400, color: colors.textMuted }}>/10</span></span>
      </div>
      <input type="range" min={0} max={10} value={value} onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: c, height: 6, borderRadius: 3 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: colors.textDim, marginTop: 1 }}>
        <span>Sem dor</span><span>Máxima</span>
      </div>
    </div>
  );
}

function loadSub() {
  try {
    const d = localStorage.getItem("sasyra_subscription");
    if (d) return JSON.parse(d);
  } catch {}
  return { plan: "avulso", aiAnalysesUsed: 0, aiPeriodStart: "", aiExpansion: null };
}

function monthKey() { return new Date().toISOString().slice(0, 7); }

function readQuota() {
  const sub = loadSub();
  const baseLimit = AI_LIMITS[sub.plan] || 0;
  const expLimit = sub.aiExpansion?.analyses || 0;
  const aiLimit = baseLimit + expLimit;
  const curMonth = monthKey();
  const used = sub.aiPeriodStart !== curMonth ? 0 : (sub.aiAnalysesUsed || 0);
  const remaining = Math.max(0, aiLimit - used);
  return { sub, plan: sub.plan, aiAnalysesUsed: used, aiLimit, remaining };
}

function consumeQuota() {
  const sub = loadSub();
  const curMonth = monthKey();
  const used = sub.aiPeriodStart !== curMonth ? 0 : (sub.aiAnalysesUsed || 0);
  sub.aiAnalysesUsed = used + 1;
  sub.aiPeriodStart = curMonth;
  localStorage.setItem("sasyra_subscription", JSON.stringify(sub));
  window.dispatchEvent(new CustomEvent("sasyra-sub-changed"));
  return sub;
}

function addInvoice(amount, desc) {
  const sub = loadSub();
  sub.invoices = [...(sub.invoices || []), { amount, date: new Date().toISOString(), status: "Pago", desc }];
  localStorage.setItem("sasyra_subscription", JSON.stringify(sub));
  window.dispatchEvent(new CustomEvent("sasyra-sub-changed"));
}

export function useEnhancer(moduleName, studentId, storageKey) {
  const STORAGE_KEY = storageKey || `${moduleName}_enhancer_${studentId}`;
  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, []);

  const load = (fallback) => {
    try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
  };
  const save = (data) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  };

  const [pain, setPainState] = useState(() => load({
    evaMov: 0, evaRep: 0, localDor: [], caraterDor: [], tempoDor: "",
    melhora: [], piora: [],
  }));
  const [logs, setLogsState] = useState(() => load([]));
  const [redFlags, setRedFlagsState] = useState(() => load([]));
  const [aiRes, setAiResState] = useState(() => load(""));

  const setPain = (fn) => setPainState(prev => { const next = typeof fn === "function" ? fn(prev) : fn; save(next); return next; });
  const setLogs = (fn) => setLogsState(prev => { const next = typeof fn === "function" ? fn(prev) : fn; save(next); return next; });
  const setRedFlags = (fn) => setRedFlagsState(prev => { const next = typeof fn === "function" ? fn(prev) : fn; save(next); return next; });
  const setAiRes = (fn) => setAiResState(prev => { const next = typeof fn === "function" ? fn(prev) : fn; save(next); return next; });

  const addLog = (entry) => {
    const log = { id: Date.now(), date: new Date().toISOString().slice(0, 10), ...entry };
    setLogs(prev => [log, ...prev]);
  };

  const runAI = async (summaryText) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const { sub, plan, aiAnalysesUsed, aiLimit, remaining } = readQuota();
    const baseLimit = AI_LIMITS[plan] || 0;
    const overage = AI_OVERAGE[plan] || AI_OVERAGE.avulso;

    if (remaining > 0 && baseLimit > 0) {
      consumeQuota();
    } else if (plan === "avulso" || baseLimit === 0) {
      addInvoice(overage.pricePerAnalysis, `1 análise avulsa IA (${moduleName}) — R$ ${overage.pricePerAnalysis.toFixed(2)}`);
    } else if (remaining <= 0 && baseLimit > 0) {
      addInvoice(overage.pricePerAnalysis, `1 análise extra IA (${moduleName}) — R$ ${overage.pricePerAnalysis.toFixed(2)}`);
    }

    setAiRes("Carregando...");
    try {
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 2800,
          _patientName: studentId,
          _queixa: pain.localDor.join(", "),
          _plan: plan,
          _aiAnalysesUsed: aiAnalysesUsed + 1,
          _aiLimit: aiLimit,
          system: `Você é um profissional de ${moduleName} especialista em medicina baseada em evidências. Responda em português.`,
          messages: [{ role: "user", content: `Com base nos dados clínicos abaixo, gere uma análise completa seguindo a estrutura solicitada no system prompt.

DADOS DO PACIENTE:
${summaryText}` }],
        }),
      });
      const d = await res.json();
      const text = d.content?.map(c => c.text || "").join("\n") || "Sem resposta.";
      if (!controller.signal.aborted) {
        setAiRes(text);
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      if (!controller.signal.aborted) {
        setAiRes("Erro ao consultar IA.");
      }
    }
  };

  return { pain, setPain, logs, addLog, setLogs, redFlags, setRedFlags, aiRes, setAiRes, runAI };
}

export function PainSection({ pain, setPain, colors }) {
  return (
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: colors.text, display: "flex", alignItems: "center", gap: 8 }}>
        <span>⚡</span> Dor e Funcionalidade
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <EvaSlider label="EVA — Movimento" value={pain.evaMov} onChange={(v) => setPain(p => ({ ...p, evaMov: v }))} colors={colors} />
        <EvaSlider label="EVA — Repouso" value={pain.evaRep} onChange={(v) => setPain(p => ({ ...p, evaRep: v }))} colors={colors} />
      </div>
      <div style={{ marginTop: 16 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Localização da dor</span>
        <TagSelect options={["Cervical", "Torácica", "Lombar", "Ombro", "Braço", "Cotovelo", "Antebraço", "Punho/Mão", "Quadril", "Joelho", "Perna", "Tornozelo/Pé", "Cabeça", "Abdome"]}
          value={pain.localDor} onChange={(v) => setPain(p => ({ ...p, localDor: v }))} colors={colors} />
      </div>
      <div style={{ marginTop: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Caráter</span>
        <TagSelect options={["Latejante", "Queimação", "Pontada", "Pressão", "Facada", "Formigamento", "Peso", "Cãibra", "Choques"]}
          value={pain.caraterDor} onChange={(v) => setPain(p => ({ ...p, caraterDor: v }))} colors={colors} />
      </div>
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Fatores de melhora</span>
          <TagSelect options={["Repouso", "Calor", "Frio", "Movimento", "Analgésico", "Posição específica"]}
            value={pain.melhora} onChange={(v) => setPain(p => ({ ...p, melhora: v }))} colors={colors} />
        </div>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Fatores de piora</span>
          <TagSelect options={["Movimento", "Carga", "Postura", "Frio", "Stress", "Noite", "Trabalho", "Após atividade"]}
            value={pain.piora} onChange={(v) => setPain(p => ({ ...p, piora: v }))} colors={colors} />
        </div>
      </div>
    </div>
  );
}

export function RedFlagsSection({ redFlags, setRedFlags, flags, colors }) {
  const toggle = (f) => setRedFlags(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  return (
    <div style={{ background: colors.redBg || "rgba(239,68,68,0.06)", border: `1px solid ${colors.red || "#ef4444"}40`, borderRadius: 14, padding: "16px 20px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>🚩</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: colors.red || "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em" }}>Red Flags — Investigar antes de prosseguir</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {flags.map((f) => (
          <button key={f} type="button" onClick={() => toggle(f)}
            style={{
              background: redFlags.includes(f) ? `${colors.red || "#ef4444"}18` : "transparent",
              border: `1px solid ${redFlags.includes(f) ? (colors.red || "#ef4444") + "50" : colors.border}`,
              color: redFlags.includes(f) ? (colors.red || "#ef4444") : colors.textMuted,
              borderRadius: 10, padding: "5px 12px", fontSize: 11,
              fontWeight: redFlags.includes(f) ? 700 : 400, cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif",
            }}>
            {f}{redFlags.includes(f) ? " ⚠" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

const PROCEDIMENTOS_CATEGORIES = [
  { category: "Eletroterapia", items: ["TENS", "FES", "Ultrassom terapêutico", "Laser de baixa potência", "Magnetoterapia"] },
  { category: "Termoterapia", items: ["Crioterapia", "Termoterapia"] },
  { category: "Terapia Manual", items: ["Massagem terapêutica", "Mobilização articular", "Manipulação", "Tração", "Dry needling", "Ventosaterapia", "Liberação miofascial"] },
  { category: "Bandagens Funcionais", items: ["Bandagem funcional", "Kinesio taping"] },
  { category: "Cinesioterapia e Exercícios", items: ["RPG", "Pilates clínico", "Cinesioterapia", "Treino de força", "Treino proprioceptivo", "Treino funcional", "Exercício neuromotor"] },
  { category: "Hidroterapia", items: ["Hidroterapia"] },
  { category: "Alongamento", items: ["Alongamento global"] },
  { category: "Abordagens Cognitivo-Comportamentais", items: ["PNE – Educação em Dor", "Graded Exposure", "CFT – Terapia Funcional Cognitiva"] },
];

function ProcedimentosCategorizados({ value, onChange, colors, categories }) {
  const cats = categories || PROCEDIMENTOS_CATEGORIES;
  const [expanded, setExpanded] = useState([]);
  return (
    <div>
      {cats.map(cat => {
        const open = expanded.includes(cat.category);
        return (
          <div key={cat.category} style={{ marginBottom: 6 }}>
            <div onClick={() => setExpanded(p => open ? p.filter(x => x !== cat.category) : [...p, cat.category])}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 10px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, userSelect: "none" }}>
              <span style={{ fontSize: 10, color: colors.textMuted, transition: "transform 0.15s", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.text, flex: 1 }}>{cat.category}</span>
              <span style={{ fontSize: 10, color: colors.textMuted }}>{cat.items.length} procedimento{cat.items.length > 1 ? "s" : ""}</span>
            </div>
            {open && (
              <div style={{ padding: "8px 4px 4px 10px" }}>
                <TagSelect options={cat.items} value={value} onChange={onChange} colors={colors} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SessionLogSection({ logs, addLog, colors, sessionLabel = "Sessão", proceduresCategories, specialty, defaultExpanded, pain, setPain }) {
  const [showForm, setShowForm] = useState(defaultExpanded || false);
  const neuroBase = specialty === "neuro" ? { fadiga: 0, tonusHoje: "", queixaDia: "", toleranciaOrtostatica: "", fadigaCentral: [], pa: "", heartRate: "", spo2: "", masSession: {} } : {};
  const [f, setF] = useState({ data: new Date().toISOString().slice(0, 10), eva: 0, procedimentos: [], resposta: "", evolucao: "", metas: "", adms: [], mrcs: [], ...neuroBase });

  const handleSave = () => {
    addLog({ ...f });
    setF({ data: new Date().toISOString().slice(0, 10), eva: 0, procedimentos: [], resposta: "", evolucao: "", metas: "", adms: [], mrcs: [], ...neuroBase });
    setShowForm(false);
  };

  return (
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: colors.text, display: "flex", alignItems: "center", gap: 8 }}>
        <span>📅</span> {sessionLabel === "Evolução" ? "Registro de Evoluções" : "Registro de Sessões"}
      </h3>

      {!showForm ? (
        <button type="button" onClick={() => setShowForm(true)}
          style={{
            background: colors.accent || colors.green, color: "#fff", border: "none",
            borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif",
          }}>
          + Nova {sessionLabel}
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Data</span>
              <input type="date" value={f.data} onChange={e => setF(p => ({ ...p, data: e.target.value }))}
                style={{ width: "100%", boxSizing: "border-box", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.text, fontSize: 13, padding: "9px 12px", outline: "none", fontFamily: colors.font || "'Inter',sans-serif" }} />
            </div>
            <EvaSlider label="EVA da sessão" value={f.eva} onChange={(v) => setF(p => ({ ...p, eva: v }))} colors={colors} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Resposta</span>
              <select value={f.resposta} onChange={e => setF(p => ({ ...p, resposta: e.target.value }))}
                style={{ width: "100%", boxSizing: "border-box", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.text, fontSize: 12, padding: "9px 12px", outline: "none", cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif" }}>
                <option value="">Selecionar…</option>
                {["Excelente melhora", "Boa melhora", "Melhora parcial", "Sem melhora", "Piora", "Intercorrência"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Neuro: Status de Entrada + Sinais Vitais ── */}
          {specialty === "neuro" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, background: colors.card, borderRadius: 10, padding: "12px 14px", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>🧠 Status de Entrada — Avaliação Neurológica</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Flutuação diária de tônus</span>
                  <select value={f.tonusHoje} onChange={e => setF(p => ({ ...p, tonusHoje: e.target.value }))}
                    style={{ width: "100%", boxSizing: "border-box", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.text, fontSize: 12, padding: "9px 12px", outline: "none", cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif" }}>
                    <option value="">Selecionar…</option>
                    {["Normal", "Aumentado", "Reduzido", "Variável"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Tolerância ortostática</span>
                  <select value={f.toleranciaOrtostatica} onChange={e => setF(p => ({ ...p, toleranciaOrtostatica: e.target.value }))}
                    style={{ width: "100%", boxSizing: "border-box", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.text, fontSize: 12, padding: "9px 12px", outline: "none", cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif" }}>
                    <option value="">Selecionar…</option>
                    {["Boa", "Regular", "Limitada", "Intolerante"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Nível de fadiga — {f.fadiga || 0}/10</span>
                <input type="range" min={0} max={10} value={f.fadiga || 0} onChange={e => setF(p => ({ ...p, fadiga: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: (f.fadiga || 0) <= 3 ? "#4ADE80" : (f.fadiga || 0) <= 6 ? "#FBBF24" : "#F87171", height: 6, borderRadius: 3 }} />
              </div>

              <div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Queixa do dia</span>
                <input value={f.queixaDia} onChange={e => setF(p => ({ ...p, queixaDia: e.target.value }))}
                  placeholder="Relato do paciente sobre o dia..."
                  style={{ width: "100%", boxSizing: "border-box", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.text, fontSize: 13, padding: "10px 12px", outline: "none", fontFamily: colors.font || "'Inter',sans-serif" }} />
              </div>

              <div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Sinais de fadiga central</span>
                <TagSelect options={["Bocejo", "Dormência", "Irritabilidade", "Perda de atenção", "Cefaleia", "Nenhum"]} value={f.fadigaCentral} onChange={v => setF(p => ({ ...p, fadigaCentral: v }))} colors={colors} />
              </div>

              {/* Vitais */}
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>💓 Sinais Vitais</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { k: "pa", label: "PA (mmHg)", placeholder: "120x80", alert: (v) => { if (!v) return null; const [s, d] = (v || "").split(/[xX/]/).map(Number); if (!s || !d) return null; if (s < 90 || d < 60) return { color: "#F87171", text: "Hipotensão" }; if (s > 140 || d > 90) return { color: "#F87171", text: "Hipertensão" }; return s > 130 || d > 85 ? { color: "#FBBF24", text: "Elevado" } : null; } },
                    { k: "heartRate", label: "FC (bpm)", placeholder: "72", type: "number", alert: (v) => { const n = Number(v); if (!n) return null; if (n < 50 || n > 120) return { color: "#F87171", text: "Alerta" }; if (n < 60 || n > 100) return { color: "#FBBF24", text: "Atenção" }; return null; } },
                    { k: "spo2", label: "SpO₂ (%)", placeholder: "98", type: "number", alert: (v) => { const n = Number(v); if (!n) return null; if (n < 90) return { color: "#F87171", text: "Hipoxemia" }; if (n < 95) return { color: "#FBBF24", text: "Baixo" }; return null; } },
                  ].map(({ k, label, placeholder, type, alert: al }) => {
                    const a = al(f[k]);
                    return (
                      <div key={k}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: colors.textSub, marginBottom: 3, display: "block" }}>{label}</span>
                        <input type={type || "text"} value={f[k] ?? ""} onChange={e => setF(p => ({ ...p, [k]: e.target.value }))} placeholder={placeholder}
                          style={{ width: "100%", boxSizing: "border-box", background: colors.surface, border: `1.5px solid ${a ? a.color : colors.border}`, borderRadius: 10, color: colors.text, fontSize: 12, padding: "7px 8px", outline: "none", fontFamily: colors.font || "'Inter',sans-serif", textAlign: "center" }} />
                        {a && <span style={{ fontSize: 8, fontWeight: 700, color: a.color, display: "block", marginTop: 2 }}>{a.text}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ⚡ Dor e Funcionalidade — colapsado */}
          {specialty === "neuro" && pain && setPain && (
            <div style={{ background: colors.card, borderRadius: 10, border: `1px solid ${colors.border}` }}>
              <div onClick={() => setF(p => ({ ...p, _showPain: !p._showPain }))}
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "10px 14px", userSelect: "none" }}>
                <span style={{ fontSize: 10, color: colors.textMuted, transition: "transform 0.15s", transform: f._showPain ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", flex: 1 }}>⚡ Dor e Funcionalidade</span>
              </div>
              {f._showPain && (
                <div style={{ padding: "0 14px 12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <EvaSlider label="EVA — Movimento" value={pain.evaMov} onChange={(v) => setPain(p => ({ ...p, evaMov: v }))} colors={colors} />
                    <EvaSlider label="EVA — Repouso" value={pain.evaRep} onChange={(v) => setPain(p => ({ ...p, evaRep: v }))} colors={colors} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: colors.textSub, marginBottom: 4, display: "block" }}>Localização da dor</span>
                    <TagSelect options={["Cervical", "Torácica", "Lombar", "Ombro", "Braço", "Cotovelo", "Antebraço", "Punho/Mão", "Quadril", "Joelho", "Perna", "Tornozelo/Pé", "Cabeça", "Abdome"]}
                      value={pain.localDor} onChange={(v) => setPain(p => ({ ...p, localDor: v }))} colors={colors} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: colors.textSub, marginBottom: 4, display: "block" }}>Caráter</span>
                    <TagSelect options={["Latejante", "Queimação", "Pontada", "Pressão", "Facada", "Formigamento", "Peso", "Cãibra", "Choques"]}
                      value={pain.caraterDor} onChange={(v) => setPain(p => ({ ...p, caraterDor: v }))} colors={colors} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Procedimentos realizados</span>
            <ProcedimentosCategorizados value={f.procedimentos} onChange={(v) => setF(p => ({ ...p, procedimentos: v }))} colors={colors} categories={proceduresCategories} />
          </div>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Evolução / Observação</span>
            <textarea value={f.evolucao} onChange={(e) => setF(p => ({ ...p, evolucao: e.target.value }))} rows={2}
              style={{
                width: "100%", boxSizing: "border-box", background: colors.surface,
                border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.text,
                fontSize: 13, padding: "10px 12px", outline: "none",
                fontFamily: colors.font || "'Inter',sans-serif", resize: "vertical",
              }}
              placeholder="Evolução clínica, resposta ao tratamento..." />
          </div>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Meta para próxima {sessionLabel.toLowerCase()}</span>
            <input value={f.metas} onChange={(e) => setF(p => ({ ...p, metas: e.target.value }))}
              style={{
                width: "100%", boxSizing: "border-box", background: colors.surface,
                border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.text,
                fontSize: 13, padding: "10px 12px", outline: "none",
                fontFamily: colors.font || "'Inter',sans-serif",
              }}
              placeholder="Critérios de progressão, nova carga..." />
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 4, marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", userSelect: "none" }}
              onClick={() => setF(p => ({ ...p, _showAdm: !p._showAdm }))}>
              📐 ADM {f._showAdm ? "▲" : "▼"}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", userSelect: "none" }}
              onClick={() => setF(p => ({ ...p, _showMrc: !p._showMrc }))}>
              💪 MRC {f._showMrc ? "▲" : "▼"}
            </span>
            {specialty === "neuro" && (
              <span style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", userSelect: "none" }}
                onClick={() => setF(p => ({ ...p, _showMas: !p._showMas }))}>
                🦵 MAS {f._showMas ? "▲" : "▼"}
              </span>
            )}
          </div>
          {f._showAdm && (
            <div style={{ background: colors.card, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, marginBottom: 6 }}>Registrar ADM desta sessão</div>
              {f.adms.map((row, i) => (
                <GonioRow key={row._id || i} row={row} onUpdate={(u) => setF(p => {
                  const next = [...p.adms]; next[i] = u; return { ...p, adms: next };
                })} onRemove={() => setF(p => ({ ...p, adms: p.adms.filter((_, j) => j !== i) }))} />
              ))}
              <button onClick={() => setF(p => ({ ...p, adms: [...p.adms, { _id: Date.now() + Math.random(), joint: JOINTS[0], movement: Object.keys(MVMT)[0], value: "" }] }))}
                style={{ background: "transparent", border: `1px dashed ${colors.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: colors.textMuted, cursor: "pointer", width: "100%", fontFamily: colors.font || "'Inter',sans-serif", marginTop: 4 }}>
                + ADM
              </button>
            </div>
          )}
          {f._showMrc && (
            <div style={{ background: colors.card, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, marginBottom: 6 }}>Registrar Força MRC desta sessão</div>
              {f.mrcs.map((row, i) => (
                <MRCRow key={row._id || i} row={row} onUpdate={(u) => setF(p => {
                  const next = [...p.mrcs]; next[i] = u; return { ...p, mrcs: next };
                })} onRemove={() => setF(p => ({ ...p, mrcs: p.mrcs.filter((_, j) => j !== i) }))} />
              ))}
              <button onClick={() => setF(p => ({ ...p, mrcs: [...p.mrcs, { _id: Date.now() + Math.random(), muscle: (MUSCLES[0]?.id || MUSCLES[0]), value: "" }] }))}
                style={{ background: "transparent", border: `1px dashed ${colors.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: colors.textMuted, cursor: "pointer", width: "100%", fontFamily: colors.font || "'Inter',sans-serif", marginTop: 4 }}>
                + MRC
              </button>
            </div>
          )}
          {f._showMas && (
            <div style={{ background: colors.card, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, marginBottom: 6 }}>MAS — Espasticidade (0-4) — Abreviado</div>
              {[
                { id: "flexoresCotoveloD", label: "Flexores cotovelo D" },
                { id: "flexoresCotoveloE", label: "Flexores cotovelo E" },
                { id: "extensoresJoelhoD", label: "Extensores joelho D" },
                { id: "extensoresJoelhoE", label: "Extensores joelho E" },
                { id: "flexoresPlantaresD", label: "Flexores plantares D" },
                { id: "flexoresPlantaresE", label: "Flexores plantares E" },
              ].map(q => (
                <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: colors.textSub, flex: 1 }}>{q.label}</span>
                  <select value={(f.masSession || {})[q.id] || ""} onChange={e => setF(p => ({ ...p, masSession: { ...(p.masSession || {}), [q.id]: e.target.value } }))}
                    style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.text, fontSize: 11, padding: "4px 8px", outline: "none", cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif", width: 60 }}>
                    <option value="">—</option>
                    {[0,1,2,3,4].map(g => <option key={g} value={String(g)}>{g}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={handleSave}
              style={{
                background: colors.accent || colors.green, color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif",
              }}>Salvar {sessionLabel.toLowerCase()}</button>
            <button type="button" onClick={() => setShowForm(false)}
              style={{
                background: "transparent", border: `1px solid ${colors.border}`,
                borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 500,
                color: colors.textMuted, cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif",
              }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* EVA Evolution Chart */}
      {logs.length >= 2 && (
        <div style={{ marginTop: 20 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 8, display: "block" }}>Evolução da Dor (EVA)</span>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60, padding: "0 4px" }}>
            {[...logs].reverse().map((l, i) => {
              const h = (l.eva / 10) * 52;
              const c = STYLE.evaColor(l.eva);
              return (
                <div key={l.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 8, color: c, fontWeight: 700 }}>{l.eva}</span>
                  <div style={{ width: "100%", height: h, background: c, borderRadius: "4px 4px 0 0", opacity: 0.7 }} />
                  <span style={{ fontSize: 7, color: colors.textDim }}>S{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Logs History */}
      {logs.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 8, display: "block" }}>
            Histórico — {logs.length} {sessionLabel.toLowerCase()}(ões)
          </span>
          {logs.map((log) => (
            <div key={log.id} style={{
              background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10,
              padding: "12px 14px", marginBottom: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: colors.accent || colors.green, background: `${colors.accent || colors.green}0C`, padding: "2px 8px", borderRadius: 6 }}>{sessionLabel}</span>
                  <span style={{ fontSize: 11, color: colors.textMuted }}>{log.data || log.date}</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 900, color: STYLE.evaColor(log.eva), lineHeight: 1 }}>{log.eva}<span style={{ fontSize: 9, fontWeight: 400, color: colors.textMuted }}>/10</span></span>
              </div>
              {log.procedimentos?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                  {log.procedimentos.map((p) => (
                    <span key={p} style={{ fontSize: 9, color: colors.textMuted, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "2px 7px" }}>{p}</span>
                  ))}
                </div>
              )}
              {log.resposta && <p style={{ margin: "4px 0", fontSize: 11, color: colors.amber }}>📋 {log.resposta}</p>}
              {log.evolucao && <p style={{ margin: "4px 0", fontSize: 12, color: colors.text, lineHeight: 1.5 }}>{log.evolucao}</p>}
              {log.metas && <p style={{ margin: "4px 0 0", fontSize: 10, color: colors.textMuted }}>→ {log.metas}</p>}
              {(log.adms?.length > 0 || log.mrcs?.length > 0) && (
                <div style={{ marginTop: 6, display: "flex", gap: 8, fontSize: 10, color: colors.textMuted }}>
                  {log.adms?.length > 0 && <span>📐 {log.adms.filter(a => a.value).map(a => `${a.joint} ${a.movement}:${a.value}°`).join(", ")}</span>}
                  {log.mrcs?.length > 0 && <span>💪 {log.mrcs.filter(m => m.value).map(m => `${m.muscle}:${m.value}`).join(", ")}</span>}
                </div>
              )}
              {/* ── Neuro chips ── */}
              {(log.fadiga || log.tonusHoje || log.pa || log.heartRate || log.spo2 || (log.masSession && Object.values(log.masSession).some(v=>v))) && (
                <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4, fontSize: 9 }}>
                  {log.fadiga > 0 && <span style={{ color: log.fadiga <= 3 ? "#4ADE80" : log.fadiga <= 6 ? "#FBBF24" : "#F87171", background: `${log.fadiga <= 3 ? "#4ADE80" : log.fadiga <= 6 ? "#FBBF24" : "#F87171"}15`, borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>⚡ Fadiga {log.fadiga}/10</span>}
                  {log.tonusHoje && <span style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "2px 6px", color: colors.textMuted }}>🦵 {log.tonusHoje}</span>}
                  {log.toleranciaOrtostatica && <span style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "2px 6px", color: colors.textMuted }}>↕ {log.toleranciaOrtostatica}</span>}
                  {log.pa && <span style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "2px 6px", color: colors.textMuted }}>💓 {log.pa}</span>}
                  {log.heartRate && <span style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "2px 6px", color: colors.textMuted }}>{log.heartRate} bpm</span>}
                  {log.spo2 && <span style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "2px 6px", color: colors.textMuted }}>SpO₂ {log.spo2}%</span>}
                  {log.masSession && Object.values(log.masSession).filter(v=>v).length > 0 && (
                    <span style={{ background: `${colors.accent || "#4ADE80"}15`, border: `1px solid ${(colors.accent || "#4ADE80")}40`, borderRadius: 4, padding: "2px 6px", color: colors.accent || "#4ADE80", fontWeight: 700 }}>
                      🦵 MAS {Object.values(log.masSession).filter(v=>v).reduce((a,b)=>a+Number(b),0)}
                    </span>
                  )}
                  {log.fadigaCentral?.length > 0 && log.fadigaCentral.filter(f=>f!=="Nenhum").length > 0 && (
                    <span style={{ background: "#FBBF2415", border: "1px solid #FBBF2440", borderRadius: 4, padding: "2px 6px", color: "#FBBF24", fontWeight: 700 }}>😵 {log.fadigaCentral.filter(f=>f!=="Nenhum").length} fadiga(s)</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AIAnalysisSection({ aiRes, runAI, summaryText, patientName, moduleLabel, colors }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    await runAI(summaryText);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiRes || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrintAi = () => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Análise IA — SASYRA</title>
      <style>body{font-family:Inter,sans-serif;padding:40px;color:#1a202c;line-height:1.8;font-size:14px;max-width:800px;margin:0 auto}
      pre{white-space:pre-wrap;margin:0;font-family:Inter,sans-serif}h1{color:#0e141b;font-size:20px;border-bottom:2px solid #0f6e56;padding-bottom:8px}
      .header{color:#7c8fa6;font-size:12px;margin:8px 0 24px}
      .footer{text-align:center;color:#7c8fa6;font-size:11px;margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0}
      @media print{body{padding:20px}}</style></head><body>
      <h1>🤖 Análise Clínica — SASYRA IA</h1>
      <div class="header">Paciente: ${patientName || "—"} | ${moduleLabel || "Clínico"} | ${new Date().toLocaleDateString("pt-BR")}</div>
      <pre>${aiRes || "Nenhuma análise disponível."}</pre>
      <div class="footer">SASYRA — Sistema de Assistência e Análise em Saúde<br/>Documento gerado em ${new Date().toLocaleString("pt-BR")}</div>
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const handleShare = async () => {
    const text = `SASYRA — Análise IA (${moduleLabel || "Clínico"})\nPaciente: ${patientName || "—"}\n\n${aiRes || ""}`;
    if (navigator.share) {
      await navigator.share({ title: `Análise IA — ${moduleLabel}`, text });
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: colors.text, display: "flex", alignItems: "center", gap: 8 }}>
        <span>🤖</span> Análise por IA — Baseada em Evidências
      </h3>
      <p style={{ fontSize: 11, color: colors.textMuted, margin: "0 0 12px", lineHeight: 1.6 }}>
        A IA cruzará os dados preenchidos com evidências científicas e gerará hipótese diagnóstica, plano de tratamento e prognóstico.
      </p>
      <button type="button" onClick={handleRun} disabled={loading}
        style={{
          background: colors.accent || colors.green, color: "#fff", border: "none",
          borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700,
          cursor: loading ? "wait" : "pointer", fontFamily: colors.font || "'Inter',sans-serif",
          opacity: loading ? 0.6 : 1,
        }}>
        {loading ? "⏳ Analisando..." : "🔍 Gerar análise"}
      </button>
      {aiRes && (
        <div style={{ marginTop: 16, background: colors.surface, border: `1px solid ${(colors.accent || colors.green)}30`, borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: colors.accent || colors.green, letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>
            ANÁLISE CLÍNICA — SASYRA IA
          </div>
          {aiRes === "Carregando..." ? (
            <div style={{ fontSize: 12, color: colors.textMuted }}>Carregando...</div>
          ) : (
            <pre style={{ fontSize: 12, color: colors.text, whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.7, fontFamily: colors.font || "'Inter',sans-serif" }}>{aiRes}</pre>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button type="button" onClick={handlePrintAi}
              style={{ background: colors.text, color: colors.card, border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif" }}>
              🖨️ Imprimir
            </button>
            <button type="button" onClick={handleCopy}
              style={{ background: "transparent", color: colors.accent || colors.green, border: `1px solid ${(colors.accent || colors.green)}50`, borderRadius: 8, padding: "7px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif" }}>
              {copied ? "✓ Copiado!" : "📋 Copiar"}
            </button>
            <button type="button" onClick={handleShare}
              style={{ background: "transparent", color: colors.accent || colors.green, border: `1px solid ${(colors.accent || colors.green)}50`, borderRadius: 8, padding: "7px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif" }}>
              📤 Compartilhar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReportSection({ pain, logs, redFlags, aiRes, patientName, moduleLabel, colors }) {
  const evaColor = (v) => v <= 3 ? "#22c55e" : v <= 6 ? "#eab308" : "#ef4444";
  const [copiedReport, setCopiedReport] = useState(false);

  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Relatório SASYRA</title>
      <style>body{font-family:Inter,sans-serif;padding:40px;color:#1a202c;line-height:1.7;font-size:14px}
      pre{white-space:pre-wrap;margin:0}hr{margin:20px 0;border:none;border-top:1px solid #e2e8f0}
      h1{color:#0e141b;font-size:20px}h2{color:#4a7c59;font-size:14px;margin-top:24px}
      .tag{display:inline-block;background:#f0fdf4;color:#166534;padding:2px 10px;border-radius:6px;font-size:12px}
      </style></head><body>
      <h1>🧾 RELATÓRIO ${moduleLabel?.toUpperCase() || "CLÍNICO"}</h1>
      <p><strong>Paciente:</strong> ${patientName || "—"} &nbsp;|&nbsp; <strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
      <hr/>
      <h2>⚡ Dor</h2>
      <p><strong>EVA Movimento:</strong> <span class="tag" style="background:${evaColor(pain.evaMov)}18;color:${evaColor(pain.evaMov)};font-weight:700">${pain.evaMov}/10</span>
      &nbsp; <strong>EVA Repouso:</strong> <span class="tag" style="background:${evaColor(pain.evaRep)}18;color:${evaColor(pain.evaRep)};font-weight:700">${pain.evaRep}/10</span></p>
      <p><strong>Localização:</strong> ${pain.localDor.join(", ") || "—"}<br/>
      <strong>Caráter:</strong> ${pain.caraterDor.join(", ") || "—"}<br/>
      <strong>Melhora com:</strong> ${pain.melhora.join(", ") || "—"}<br/>
      <strong>Piora com:</strong> ${pain.piora.join(", ") || "—"}</p>
      <h2>🚩 Red Flags</h2>
      <p>${redFlags.length > 0 ? redFlags.join(" • ") : "Nenhum sinal de alerta registrado."}</p>
      <h2>📅 Histórico de Sessões (${logs.length})</h2>
      ${logs.length > 0 ? logs.map((l, i) => `
        <div style="border-left:3px solid ${evaColor(l.eva)};padding-left:12px;margin-bottom:12px">
          <p><strong>Sessão ${logs.length - i}</strong> — ${l.date} — EVA <strong style="color:${evaColor(l.eva)}">${l.eva}/10</strong></p>
          ${l.procedimentos.length ? `<p>Procedimentos: ${l.procedimentos.join(", ")}</p>` : ""}
          ${l.evolucao ? `<p>${l.evolucao}</p>` : ""}
          ${l.metas ? `<p style="color:#7c8fa6">→ ${l.metas}</p>` : ""}
        </div>
      `).join("") : "<p>Nenhuma sessão registrada.</p>"}
      ${aiRes ? `<h2>🤖 Análise IA</h2><pre style="background:#f8fafc;padding:14px;border-radius:8px;font-size:13px">${aiRes}</pre>` : ""}
      <hr/><p style="text-align:center;color:#7c8fa6;font-size:11px">
        SASYRA — Sistema de Assistência e Análise em ${moduleLabel || "Saúde"}<br/>
        Documento gerado em ${new Date().toLocaleString("pt-BR")}
      </p>
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: colors.text, display: "flex", alignItems: "center", gap: 8 }}>
        <span>📊</span> Relatório
      </h3>
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, color: "#1a202c", fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#0e141b", marginBottom: 4 }}>
          {moduleLabel} — SASYRA
        </div>
        <div style={{ color: "#7c8fa6", marginBottom: 14 }}>
          Paciente: {patientName || "—"} | {new Date().toLocaleDateString("pt-BR")}
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "10px 0" }} />
        <div><strong style={{ color: "#0f6e56" }}>⚡ Dor:</strong> EVA Mov {pain.evaMov}/10, EVA Rep {pain.evaRep}/10</div>
        {pain.localDor.length > 0 && <div><strong style={{ color: "#0f6e56" }}>Local:</strong> {pain.localDor.join(", ")}</div>}
        {redFlags.length > 0 && <div style={{ marginTop: 6 }}><strong style={{ color: "#dc2626" }}>🚩 Red Flags:</strong> {redFlags.join(" • ")}</div>}
        {logs.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <strong style={{ color: "#0f6e56" }}>📅 {logs.length} sessão(ões)</strong>
            {[...logs].reverse().slice(0, 5).map((l) => (
              <div key={l.id} style={{ borderLeft: `3px solid ${evaColor(l.eva)}`, paddingLeft: 10, marginTop: 6 }}>
                <div style={{ fontSize: 11, color: "#7c8fa6" }}>{l.date} — EVA {l.eva}/10</div>
                {l.evolucao && <div style={{ fontSize: 12 }}>{l.evolucao}</div>}
              </div>
            ))}
            {logs.length > 5 && <div style={{ fontSize: 11, color: "#7c8fa6", marginTop: 4 }}>...e mais {logs.length - 5} sessões</div>}
          </div>
        )}
        {aiRes && aiRes !== "Carregando..." && (
          <div style={{ marginTop: 10 }}>
            <strong style={{ color: "#0f6e56" }}>🤖 Análise IA:</strong>
            <pre style={{ fontSize: 11, whiteSpace: "pre-wrap", margin: "4px 0 0", color: "#374151", fontFamily: "Inter,sans-serif" }}>{aiRes}</pre>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={handlePrint}
          style={{
            background: colors.accent || colors.green, color: "#fff", border: "none",
            borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif",
          }}>
          🖨️ Imprimir / PDF
        </button>
        <button type="button" onClick={() => {
          const txt = `RELATÓRIO ${moduleLabel?.toUpperCase() || "CLÍNICO"} — SASYRA\nPaciente: ${patientName || "—"}\nData: ${new Date().toLocaleDateString("pt-BR")}\n\nEVA Mov: ${pain.evaMov}/10 | EVA Rep: ${pain.evaRep}/10\nLocal: ${pain.localDor.join(", ") || "—"}\nRed Flags: ${redFlags.length > 0 ? redFlags.join(", ") : "Nenhum"}\nSessões: ${logs.length}\n\nAnálise IA:\n${aiRes || "Nenhuma"}\n\nSASYRA — Sistema de Assistência e Análise em ${moduleLabel || "Saúde"}`;
          navigator.clipboard.writeText(txt).then(() => {
            setCopiedReport(true);
            setTimeout(() => setCopiedReport(false), 2000);
          });
        }}
          style={{
            background: "transparent", color: colors.accent || colors.green,
            border: `1px solid ${(colors.accent || colors.green)}50`,
            borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif",
          }}>
          {copiedReport ? "✓ Copiado!" : "📋 Copiar"}
        </button>
      </div>
    </div>
  );
}
