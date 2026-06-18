import { useState, useMemo } from "react";

const C = {
  bg: "var(--bg)", surface: "var(--surface)", card: "var(--card)", cardAlt: "var(--cardAlt)",
  border: "var(--border)", borderLight: "var(--borderLight)",
  green: "var(--green)", greenDim: "var(--greenDim)", greenDeep: "var(--greenDeep)",
  greenBg: "var(--greenBg)", greenBgHov: "var(--greenBgHov)",
  amber: "var(--amber)", amberBg: "var(--amberBg)",
  red: "var(--red)", redBg: "var(--redBg)",
  blue: "var(--blue)", blueBg: "var(--blueBg)",
  purple: "var(--purple)", purpleBg: "var(--purpleBg)",
  text: "var(--text)", textSub: "var(--textSub)", textMuted: "var(--textMuted)",
  textDim: "var(--textDim)", white: "var(--white)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

const CREFITO_REGIOES = {
  "Sul (RS/SC/PR)":         { consulta: 180, sessao: 160, avaliacao: 250, relatorio: 120 },
  "Sudeste SP":             { consulta: 220, sessao: 200, avaliacao: 320, relatorio: 150 },
  "Sudeste RJ/ES/MG":       { consulta: 190, sessao: 170, avaliacao: 280, relatorio: 130 },
  "Centro-Oeste":           { consulta: 170, sessao: 150, avaliacao: 240, relatorio: 110 },
  "Nordeste":               { consulta: 150, sessao: 140, avaliacao: 220, relatorio: 100 },
  "Norte":                  { consulta: 140, sessao: 130, avaliacao: 210, relatorio: 95  },
};

const inp = (extra = {}) => ({ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 12px", outline: "none", fontFamily: F, ...extra });
const sel = (extra = {}) => ({ ...inp(), cursor: "pointer", ...extra });
const lbl = (extra = {}) => ({ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMuted, marginBottom: 5, ...extra });
const primaryBtn = (extra = {}) => ({ background: C.green, color: "#061A0C", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...extra });
const ghostBtn = (extra = {}) => ({ background: "transparent", color: C.green, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...extra });

function ValorCell({ label, value, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", textAlign: "center" }}>
      <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: color || C.text, lineHeight: 1.1 }}>R$ {value.toFixed(2)}</div>
    </div>
  );
}

export default function Financeiro({ onNavigateToPatient }) {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [pagamentos, setPagamentos] = useState(() => {
    try { const d = localStorage.getItem("sasyra_pagamentos"); return d ? JSON.parse(d) : {}; } catch { return {}; }
  });
  const [showModal, setShowModal] = useState(null);

  const patients = useMemo(() => {
    try { const d = localStorage.getItem("sasyra_patients"); return d ? JSON.parse(d) : []; } catch { return []; }
  }, []);

  const allLogs = useMemo(() => {
    try { const d = localStorage.getItem("sasyra_logs"); return d ? JSON.parse(d) : []; } catch { return []; }
  }, []);

  const logsInMonth = useMemo(() => {
    return allLogs.filter(l => l.data && l.data.startsWith(month));
  }, [allLogs, month]);

  const totalSessoes = logsInMonth.length;

  const patientSummary = useMemo(() => {
    const map = {};
    logsInMonth.forEach(log => {
      const pid = log.patientId;
      if (!map[pid]) map[pid] = { patientId: pid, nome: "", convenio: "", sessions: 0, logIds: [] };
      const patient = patients.find(p => p.id === pid || p.nome === pid);
      if (patient) {
        map[pid].nome = patient.nome;
        map[pid].convenio = patient.convenio || "";
      } else {
        map[pid].nome = typeof pid === "string" ? pid : `ID ${pid}`;
      }
      map[pid].sessions++;
      map[pid].logIds.push(log.id);
    });
    return Object.values(map).sort((a, b) => b.sessions - a.sessions);
  }, [logsInMonth, patients]);

  const calcSessionValue = (convenio) => {
    if (convenio === "Particular") {
      const tabela = CREFITO_REGIOES["Centro-Oeste"];
      return tabela.sessao;
    }
    return 80;
  };

  const totalFaturado = useMemo(() => {
    return patientSummary.reduce((acc, p) => acc + p.sessions * calcSessionValue(p.convenio), 0);
  }, [patientSummary]);

  const totalRecebido = useMemo(() => {
    return Object.entries(pagamentos).reduce((acc, [id, pago]) => {
      if (pago) {
        const log = allLogs.find(l => l.id === Number(id));
        if (log && log.data && log.data.startsWith(month)) {
          const patient = patients.find(pt => pt.id === log.patientId || pt.nome === log.patientId);
          return acc + calcSessionValue(patient?.convenio);
        }
      }
      return acc;
    }, 0);
  }, [pagamentos, allLogs, month, patients]);

  const totalAReceber = totalFaturado - totalRecebido;

  const togglePagamento = (logId) => {
    setPagamentos(prev => {
      const next = { ...prev, [String(logId)]: !prev[String(logId)] };
      try { localStorage.setItem("sasyra_pagamentos", JSON.stringify(next)); } catch { }
      return next;
    });
  };

  const marcarTodas = (pagos) => {
    const next = { ...pagamentos };
    logsInMonth.forEach(l => { next[String(l.id)] = pagos; });
    setPagamentos(next);
    try { localStorage.setItem("sasyra_pagamentos", JSON.stringify(next)); } catch { }
  };

  const patientLogs = useMemo(() => {
    if (!showModal) return [];
    return logsInMonth.filter(l => l.patientId === showModal.patientId);
  }, [showModal, logsInMonth]);

  return (
    <div style={{ fontFamily: F, color: C.text, minHeight: "100vh", background: C.bg, padding: "0 0 40px" }}>
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 8, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>💰 Financeiro</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            style={{ ...inp({ width: 180, fontSize: 12 }) }} />
          <button onClick={() => marcarTodas(true)} style={ghostBtn({ fontSize: 11, padding: "6px 12px" })}>Pagar Todas</button>
          <button onClick={() => marcarTodas(false)} style={{ ...ghostBtn({ fontSize: 11, padding: "6px 12px" }), color: C.textMuted }}>Desmarcar</button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          <ValorCell label="Sessões Realizadas" value={totalSessoes} color={C.blue} />
          <ValorCell label="Total Faturado" value={totalFaturado} color={C.purple} />
          <ValorCell label="Valor por Sessão" value={80} color={C.textMuted} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          <div style={{
            background: C.greenBg, border: `1px solid ${C.green}40`, borderRadius: 12,
            padding: "16px 18px", textAlign: "center",
          }}>
            <div style={{ fontSize: 9, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Recebido</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.green, lineHeight: 1.1 }}>R$ {totalRecebido.toFixed(2)}</div>
          </div>
          <div style={{
            background: C.amberBg, border: `1px solid ${C.amber}40`, borderRadius: 12,
            padding: "16px 18px", textAlign: "center",
          }}>
            <div style={{ fontSize: 9, color: C.amber, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>A Receber</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.amber, lineHeight: 1.1 }}>R$ {totalAReceber.toFixed(2)}</div>
          </div>
          <div style={{
            background: C.redBg, border: `1px solid ${C.red}40`, borderRadius: 12,
            padding: "16px 18px", textAlign: "center",
          }}>
            <div style={{ fontSize: 9, color: C.red, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Inadimplência</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.red, lineHeight: 1.1 }}>
              {totalFaturado > 0 ? `${((totalAReceber / totalFaturado) * 100).toFixed(0)}%` : "0%"}
            </div>
          </div>
        </div>

        {patientSummary.length === 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Nenhuma sessão registrada</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>As sessões do diário aparecerão aqui automaticamente.</div>
          </div>
        )}

        {patientSummary.map(p => {
          const totalP = p.sessions * calcSessionValue(p.convenio);
          const recebidoP = p.logIds.reduce((acc, id) => acc + (pagamentos[String(id)] ? calcSessionValue(p.convenio) : 0), 0);
          const aReceberP = totalP - recebidoP;
          const pctP = totalP > 0 ? (recebidoP / totalP) * 100 : 0;

          return (
            <div key={p.patientId} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: "14px 16px", marginBottom: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, background: C.greenBg, border: `1px solid ${C.green}40`,
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: C.green,
                  }}>{p.nome[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{p.nome}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{p.convenio || "—"} · {p.sessions} sessão(ões)</div>
                  </div>
                </div>
                <button onClick={() => setShowModal(p)} style={ghostBtn({ fontSize: 10, padding: "4px 10px" })}>
                  Detalhes →
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
                <div style={{ background: C.surface, borderRadius: 8, padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: C.textMuted }}>Total</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.purple }}>R$ {totalP.toFixed(2)}</div>
                </div>
                <div style={{ background: C.greenBg, borderRadius: 8, padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: C.green }}>Recebido</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.green }}>R$ {recebidoP.toFixed(2)}</div>
                </div>
                <div style={{ background: aReceberP > 0 ? C.amberBg : C.surface, borderRadius: 8, padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: aReceberP > 0 ? C.amber : C.textMuted }}>A Receber</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: aReceberP > 0 ? C.amber : C.textMuted }}>R$ {aReceberP.toFixed(2)}</div>
                </div>
              </div>

              <div style={{ height: 4, background: C.surface, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pctP}%`, background: `linear-gradient(90deg, ${C.green}, ${C.greenDim})`, borderRadius: 99, transition: "width 0.3s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }} onClick={() => setShowModal(null)}>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: 22, maxWidth: 480, width: "100%", fontFamily: F, maxHeight: "80vh", overflow: "auto",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{showModal.nome}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{showModal.convenio || "—"} · {showModal.sessions} sessões</div>
              </div>
              <button onClick={() => setShowModal(null)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 20, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Sessões — marque como recebido
            </div>

            {patientLogs.map(log => {
              const pago = pagamentos[String(log.id)];
              const valor = calcSessionValue(showModal.convenio);
              return (
                <div key={log.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 8, marginBottom: 4,
                  background: pago ? C.greenBg : C.surface,
                  border: `1px solid ${pago ? C.green + "40" : C.border}`,
                }}>
                  <button onClick={() => togglePagamento(log.id)} style={{
                    width: 22, height: 22, borderRadius: 6, border: `2px solid ${pago ? C.green : C.textMuted}`,
                    background: pago ? C.green : "transparent", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {pago && "✓"}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
                      {log.data} {log.data && `· Sessão #${log.sessaoNum || ""}`}
                    </div>
                    {log.evolucao && <div style={{ fontSize: 10, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.evolucao}</div>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: pago ? C.green : C.amber }}>
                    R$ {valor.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
