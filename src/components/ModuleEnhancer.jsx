import { useState } from "react";

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

export function useEnhancer(moduleName, studentId, storageKey) {
  const STORAGE_KEY = storageKey || `${moduleName}_enhancer_${studentId}`;

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
    setAiRes("Carregando...");
    try {
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          _patientName: studentId,
          _queixa: pain.localDor.join(", "),
          system: `Você é um profissional de ${moduleName} especialista em medicina baseada em evidências. Responda em português.`,
          messages: [{ role: "user", content: `Com base nos dados abaixo, forneça:\n1. Hipótese diagnóstica funcional\n2. Plano de tratamento padrão-ouro\n3. Prognóstico\n\nDADOS:\n${summaryText}` }],
        }),
      });
      const d = await res.json();
      const text = d.content?.map(c => c.text || "").join("\n") || "Sem resposta.";
      setAiRes(text);
    } catch {
      setAiRes("Erro ao consultar IA.");
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

export function SessionLogSection({ logs, addLog, colors }) {
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ eva: 0, procedimentos: [], evolucao: "", metas: "" });

  const PROCEDIMENTOS = [
    "Avaliação", "Exercício terapêutico", "Fortalecimento muscular", "Alongamento",
    "Mobilização articular", "Treino funcional", "Treino proprioceptivo",
    "Terapia manual", "Eletroterapia", "Crioterapia", "Termoterapia",
    "Orientação/postura", "Treino de marcha", "Treino de equilíbrio",
    "Estimulação motora", "Integração sensorial", "Atividades lúdicas",
    "Exercícios respiratórios", "Relaxamento", "Reavaliação",
  ];

  const handleSave = () => {
    addLog({ ...f });
    setF({ eva: 0, procedimentos: [], evolucao: "", metas: "" });
    setShowForm(false);
  };

  return (
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: colors.text, display: "flex", alignItems: "center", gap: 8 }}>
        <span>📅</span> Registro de Sessões
      </h3>

      {!showForm ? (
        <button type="button" onClick={() => setShowForm(true)}
          style={{
            background: colors.accent || colors.green, color: "#fff", border: "none",
            borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif",
          }}>
          + Nova Sessão
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <EvaSlider label="EVA da sessão" value={f.eva} onChange={(v) => setF(p => ({ ...p, eva: v }))} colors={colors} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Procedimentos</span>
              <TagSelect options={PROCEDIMENTOS} value={f.procedimentos} onChange={(v) => setF(p => ({ ...p, procedimentos: v }))} colors={colors} />
            </div>
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
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.textSub, marginBottom: 5, display: "block" }}>Meta para próxima sessão</span>
            <input value={f.metas} onChange={(e) => setF(p => ({ ...p, metas: e.target.value }))}
              style={{
                width: "100%", boxSizing: "border-box", background: colors.surface,
                border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.text,
                fontSize: 13, padding: "10px 12px", outline: "none",
                fontFamily: colors.font || "'Inter',sans-serif",
              }}
              placeholder="Critérios de progressão, nova carga..." />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={handleSave}
              style={{
                background: colors.accent || colors.green, color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif",
              }}>Salvar sessão</button>
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
            Histórico — {logs.length} sessão(ões)
          </span>
          {logs.map((log) => (
            <div key={log.id} style={{
              background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10,
              padding: "12px 14px", marginBottom: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: colors.accent || colors.green, background: `${colors.accent || colors.green}0C`, padding: "2px 8px", borderRadius: 6 }}>Sessão</span>
                  <span style={{ fontSize: 11, color: colors.textMuted }}>{log.date}</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 900, color: STYLE.evaColor(log.eva), lineHeight: 1 }}>{log.eva}<span style={{ fontSize: 9, fontWeight: 400, color: colors.textMuted }}>/10</span></span>
              </div>
              {log.procedimentos.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                  {log.procedimentos.map((p) => (
                    <span key={p} style={{ fontSize: 9, color: colors.textMuted, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "2px 7px" }}>{p}</span>
                  ))}
                </div>
              )}
              {log.evolucao && <p style={{ margin: "4px 0", fontSize: 12, color: colors.text, lineHeight: 1.5 }}>{log.evolucao}</p>}
              {log.metas && <p style={{ margin: "4px 0 0", fontSize: 10, color: colors.textMuted }}>→ {log.metas}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AIAnalysisSection({ aiRes, runAI, summaryText, colors }) {
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    await runAI(summaryText);
    setLoading(false);
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
        </div>
      )}
    </div>
  );
}

export function ReportSection({ pain, logs, redFlags, aiRes, patientName, moduleLabel, colors }) {
  const evaColor = (v) => v <= 3 ? "#22c55e" : v <= 6 ? "#eab308" : "#ef4444";

  const reportContent = `
RELATÓRIO ${moduleLabel?.toUpperCase() || "CLÍNICO"} — SASYRA
Paciente: ${patientName || "—"} | Gerado em: ${new Date().toLocaleDateString("pt-BR")}

═ DOR ═
EVA Movimento: ${pain.evaMov}/10
EVA Repouso: ${pain.evaRep}/10
Local: ${pain.localDor.join(", ") || "—"}
Caráter: ${pain.caraterDor.join(", ") || "—"}
Melhora: ${pain.melhora.join(", ") || "—"}
Piora: ${pain.piora.join(", ") || "—"}

═ RED FLAGS ═
${redFlags.length > 0 ? redFlags.join("\n") : "Nenhum sinal de alerta registrado."}

═ SESSÕES ═
${logs.length > 0
    ? logs.map((l, i) => `Sessão ${logs.length - i} — ${l.date}
  EVA: ${l.eva}/10
  Procedimentos: ${l.procedimentos.join(", ") || "—"}
  Evolução: ${l.evolucao || "—"}
  Metas: ${l.metas || "—"}`).join("\n\n")
    : "Nenhuma sessão registrada."}

═ ANÁLISE IA ═
${aiRes || "Nenhuma análise realizada."}

─ SASYRA — Sistema de Assistência e Análise em ${moduleLabel || "Saúde"}
`;

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
            <pre style={{ fontSize: 11, whiteSpace: "pre-wrap", margin: "4px 0 0", color: "#374151", fontFamily: "Inter,sans-serif" }}>{aiRes.slice(0, 500)}{aiRes.length > 500 ? "..." : ""}</pre>
          </div>
        )}
      </div>
      <button type="button" onClick={handlePrint}
        style={{
          background: colors.accent || colors.green, color: "#fff", border: "none",
          borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: colors.font || "'Inter',sans-serif",
        }}>
        🖨️ Imprimir / Gerar PDF
      </button>
    </div>
  );
}
