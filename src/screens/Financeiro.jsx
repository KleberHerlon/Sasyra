import { useState, useMemo } from "react";
import { OnboardingDica } from "../components";

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

const DESPESA_CATEGORIAS = ["Aluguel", "Materiais", "Marketing", "Contas", "Equipamentos", "Transporte", "Assinaturas", "Impostos", "Salários", "Outros"];

const inp = (extra = {}) => ({ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 12px", outline: "none", fontFamily: F, ...extra });
const sel = (extra = {}) => ({ ...inp(), cursor: "pointer", ...extra });
const lbl = (extra = {}) => ({ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMuted, marginBottom: 5, ...extra });
const primaryBtn = (extra = {}) => ({ background: C.green, color: "#061A0C", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...extra });
const ghostBtn = (extra = {}) => ({ background: "transparent", color: C.green, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...extra });

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{ background: bg || C.card, border: `1px solid ${color || C.border}40`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: color || C.text, lineHeight: 1.1 }}>R$ {value.toFixed(2)}</div>
      </div>
    </div>
  );
}

function smallBtn(active, activeColor, extra = {}) {
  return {
    background: active ? `${activeColor}18` : "transparent",
    border: active ? `1px solid ${activeColor}50` : `1px solid ${C.border}`,
    color: active ? activeColor : C.textMuted, borderRadius: 6, padding: "4px 12px",
    fontSize: 11, fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: F, ...extra,
  };
}

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : initial; } catch { return initial; }
  });
  const save = (next) => {
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { }
  };
  return [val, save];
}

export default function Financeiro({ onNavigateToPatient, onNavigate }) {
  const [tab, setTab] = useState("resumo");
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [showYear, setShowYear] = useState(false);
  const [pagamentos, setPagamentos] = useLocalStorage("sasyra_pagamentos", {});
  const [valoresPaciente, setValoresPaciente] = useLocalStorage("sasyra_valores_paciente", {});
  const [despesas, setDespesas] = useLocalStorage("sasyra_despesas", []);
  const [showModal, setShowModal] = useState(null);
  const [editDespesa, setEditDespesa] = useState(null);

  const period = showYear ? month.slice(0, 4) : month;
  const patients = useMemo(() => {
    try { const d = localStorage.getItem("sasyra_patients"); return d ? JSON.parse(d) : []; } catch { return []; }
  }, []);

  const allLogs = useMemo(() => {
    try { const d = localStorage.getItem("sasyra_logs"); return d ? JSON.parse(d) : []; } catch { return []; }
  }, []);

  const logsInPeriod = useMemo(() => {
    return allLogs.filter(l => l.data && l.data.startsWith(period));
  }, [allLogs, period]);

  const despesasNoPeriodo = useMemo(() => {
    return despesas.filter(d => d.data && d.data.startsWith(period));
  }, [despesas, period]);

  const calcSessionValue = (convenio, patientId) => {
    if (valoresPaciente[patientId] != null) return Number(valoresPaciente[patientId]);
    if (convenio === "Particular") return CREFITO_REGIOES["Centro-Oeste"].sessao;
    return 80;
  };

  const patientSummary = useMemo(() => {
    const map = {};
    logsInPeriod.forEach(log => {
      const pid = log.patientId;
      if (!map[pid]) map[pid] = { patientId: pid, nome: "", convenio: "", sessions: 0, logIds: [] };
      const p = patients.find(pt => pt.id === pid || pt.nome === pid);
      if (p) { map[pid].nome = p.nome; map[pid].convenio = p.convenio || ""; }
      else map[pid].nome = typeof pid === "string" ? pid : `ID ${pid}`;
      map[pid].sessions++;
      map[pid].logIds.push(log.id);
    });
    return Object.values(map).sort((a, b) => b.sessions - a.sessions);
  }, [logsInPeriod, patients]);

  const totalSessoes = logsInPeriod.length;
  const totalFaturado = useMemo(() =>
    patientSummary.reduce((acc, p) => acc + p.sessions * calcSessionValue(p.convenio, p.patientId), 0),
    [patientSummary, valoresPaciente]
  );
  const totalRecebido = useMemo(() =>
    Object.entries(pagamentos).reduce((acc, [id, pago]) => {
      if (!pago) return acc;
      const log = allLogs.find(l => l.id === Number(id));
      if (log && log.data && log.data.startsWith(period)) {
        const p = patients.find(pt => pt.id === log.patientId || pt.nome === log.patientId);
        return acc + calcSessionValue(p?.convenio, log.patientId);
      }
      return acc;
    }, 0),
    [pagamentos, allLogs, period, patients, valoresPaciente]
  );
  const totalAReceber = totalFaturado - totalRecebido;
  const totalDespesas = despesasNoPeriodo.reduce((acc, d) => acc + Number(d.valor || 0), 0);
  const saldoLiquido = totalRecebido - totalDespesas;

  const togglePagamento = (logId) => {
    const wasPaid = pagamentos[String(logId)];
    if (wasPaid) {
      if (!window.confirm("Estornar este pagamento? O status voltará para \"a receber\".")) return;
    }
    setPagamentos({ ...pagamentos, [String(logId)]: !wasPaid });
  };
  const marcarTodas = (pago) => {
    const next = { ...pagamentos };
    logsInPeriod.forEach(l => { next[String(l.id)] = pago; });
    setPagamentos(next);
  };

  const exportCSV = () => {
    const rows = [["Paciente", "Convênio", "Sessões", "Valor Unitário", "Total", "Recebido", "Pendente"]];
    patientSummary.forEach(p => {
      const valor = calcSessionValue(p.convenio, p.patientId);
      const total = p.sessions * valor;
      const recebido = p.logIds.reduce((acc, id) => acc + (pagamentos[String(id)] ? valor : 0), 0);
      rows.push([p.nome, p.convenio || "—", p.sessions, valor.toFixed(2), total.toFixed(2), recebido.toFixed(2), (total - recebido).toFixed(2)]);
    });
    rows.push([]);
    rows.push(["Resumo", "", "", "", "", "", ""]);
    rows.push(["Faturamento Bruto", "", "", "", totalFaturado.toFixed(2), "", ""]);
    rows.push(["Total Recebido", "", "", "", totalRecebido.toFixed(2), "", ""]);
    rows.push(["Total Despesas", "", "", "", totalDespesas.toFixed(2), "", ""]);
    rows.push(["Saldo Líquido", "", "", "", saldoLiquido.toFixed(2), "", ""]);
    despesasNoPeriodo.forEach(d => {
      rows.push(["Despesa: " + d.descricao, d.categoria, "", "", d.valor, "", ""]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `sasyra_financeiro_${period}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const comissaoProfissionais = useMemo(() => {
    const map = {};
    logsInPeriod.forEach(l => {
      const pid = l.patientId;
      const nome = patients.find(p => p.id === pid)?.nome || `ID ${pid}`;
      const valor = calcSessionValue(l.convenio, pid);
      const recebido = pagamentos[String(l.id)] ? valor : 0;
      if (!map[pid]) map[pid] = { nome, sessions: 0, total: 0, recebido: 0 };
      map[pid].sessions++;
      map[pid].total += valor;
      map[pid].recebido += recebido;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [logsInPeriod, pagamentos]);

  const handleAddDespesa = () => {
    if (!editDespesa?.descricao?.trim() || !editDespesa?.valor) return;
    if (editDespesa.id) {
      setDespesas(despesas.map(d => d.id === editDespesa.id ? editDespesa : d));
    } else {
      setDespesas([...despesas, { ...editDespesa, id: Date.now() }]);
    }
    setEditDespesa(null);
  };

  const handleDelDespesa = (id) => setDespesas(despesas.filter(d => d.id !== id));

  const monthNav = (delta) => {
    const d = new Date(month + "-01");
    if (showYear) d.setFullYear(d.getFullYear() + delta);
    else d.setMonth(d.getMonth() + delta);
    setMonth(d.toISOString().slice(0, 7));
  };

  const monthLabel = showYear
    ? new Date(month + "-01").toLocaleDateString("pt-BR", { year: "numeric" })
    : `${new Date(month + "-01").toLocaleDateString("pt-BR", { month: "long" }).replace(/^[a-z]/, m => m.toUpperCase())} de ${new Date(month + "-01").getFullYear()}`;

  return (
    <div style={{ fontFamily: F, color: C.text, minHeight: "100vh", background: C.bg, padding: "0 0 40px" }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => onNavigate?.("patients")} style={{ ...ghostBtn({ padding: "5px 10px", fontSize: 11 }), color: C.textSub }}>← Pacientes</button>
            <button onClick={() => onNavigate?.("agenda")} style={ghostBtn({ padding: "5px 10px", fontSize: 11 })}>📅 Agenda</button>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>💰 Financeiro</span>
          <div />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => monthNav(-1)} style={ghostBtn({ padding: "4px 8px", fontSize: 13 })}>◀</button>
            <span style={{ fontWeight: 700, fontSize: 14, minWidth: 160, textAlign: "center" }}>{monthLabel}</span>
            <button onClick={() => monthNav(1)} style={ghostBtn({ padding: "4px 8px", fontSize: 13 })}>▶</button>
            <input type="month" value={month} onChange={e => setMonth(e.target.value)}
              style={{ ...inp({ width: 140, fontSize: 11, padding: "5px 8px" }) }} />
          </div>
          <button onClick={() => setShowYear(s => !s)} style={smallBtn(showYear, C.blue)}>
            {showYear ? "📆 Anual" : "📅 Mensal"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 4, flex: 1 }}>
              {[
                { k: "resumo", l: "📊 Resumo" },
                { k: "pacientes", l: "👥 Pacientes" },
                { k: "despesas", l: "💸 Despesas" },
                { k: "comissao", l: "🤝 Comissão" },
              ].map(({ k, l }) => (
                <button key={k} onClick={() => setTab(k)} style={{
                  ...smallBtn(tab === k, C.green), flex: 1, textAlign: "center", padding: "7px 8px", fontSize: 12,
                }}>{l}</button>
              ))}
            </div>
            <button onClick={exportCSV} style={{ ...ghostBtn({ padding: "5px 12px", fontSize: 10 }), color: C.blue }}>
              📥 Exportar CSV
            </button>
        </div>

        <OnboardingDica storageKey="financeiro" dicas={[
          { icon: "💰", titulo: "Bem-vindo ao Financeiro", texto: "Acompanhe recebimentos, despesas e comissões. Use as abas acima para navegar entre resumo, pacientes, despesas e comissão." },
          { icon: "📥", titulo: "Registrando Recebimentos", texto: "Na aba Pacientes, clique em cada sessão para marcar como recebida. Clique novamente para estornar (com confirmação)." },
          { icon: "📤", titulo: "Exportando Dados", texto: "Use o botão 'Exportar CSV' para baixar relatório financeiro em planilha. Ideal para contabilidade e análise." },
          { icon: "🤝", titulo: "Comissão Automática", texto: "A aba Comissão calcula automaticamente 40% sobre os recebimentos de cada profissional." },
        ]} />

        {tab === "resumo" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <StatCard icon="💰" label="Faturamento Bruto" value={totalFaturado} color={C.purple} bg={C.purpleBg} />
              <StatCard icon="📥" label="Total Recebido" value={totalRecebido} color={C.green} bg={C.greenBg} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              <StatCard icon="⏳" label="A Receber" value={totalAReceber} color={C.amber} bg={C.amberBg} />
              <StatCard icon="💸" label="Despesas" value={totalDespesas} color={C.red} bg={C.redBg} />
              <StatCard icon="🏦" label="Saldo Líquido" value={saldoLiquido} color={saldoLiquido >= 0 ? C.green : C.red} bg={saldoLiquido >= 0 ? C.greenBg : C.redBg} />
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>📋 Resumo do período</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
                {[
                  ["Sessões realizadas", `${totalSessoes}`, C.blue],
                  ["Valor médio por sessão", `R$ ${totalSessoes > 0 ? (totalFaturado / totalSessoes).toFixed(2) : "0,00"}`, C.text],
                  ["Recebido", `${totalFaturado > 0 ? ((totalRecebido / totalFaturado) * 100).toFixed(0) : 0}%`, C.green],
                  ["Pacientes ativos", `${patientSummary.length}`, C.purple],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                    <span style={{ color: C.textMuted }}>{l}</span>
                    <span style={{ fontWeight: 700, color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "pacientes" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
              <button onClick={() => marcarTodas(true)} style={primaryBtn({ padding: "5px 14px", fontSize: 11 })}>✓ Pagar Todas</button>
              <button onClick={() => marcarTodas(false)} style={{ ...ghostBtn({ padding: "5px 14px", fontSize: 11 }), color: C.textMuted }}>Desmarcar Todas</button>
            </div>

            {patientSummary.length === 0 && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>Nenhuma sessão no período</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Registre sessões no diário do paciente para vê-las aqui.</div>
              </div>
            )}

            {patientSummary.map(p => {
              const valorSessao = calcSessionValue(p.convenio, p.patientId);
              const totalP = p.sessions * valorSessao;
              const recebidoP = p.logIds.reduce((acc, id) => acc + (pagamentos[String(id)] ? valorSessao : 0), 0);
              const aReceberP = totalP - recebidoP;
              const pctP = totalP > 0 ? (recebidoP / totalP) * 100 : 0;

              return (
                <div key={p.patientId} style={{
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                  padding: "12px 14px", marginBottom: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 30, height: 30, background: C.greenBg, border: `1px solid ${C.green}40`,
                        borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 800, color: C.green, flexShrink: 0,
                      }}>{p.nome[0]?.toUpperCase()}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nome}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{p.convenio || "—"} · {p.sessions} sessões</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => {
                        const v = prompt(`Valor por sessão para ${p.nome}:`, String(valorSessao));
                        if (v && !isNaN(Number(v))) setValoresPaciente({ ...valoresPaciente, [p.patientId]: Number(v) });
                      }} style={{ ...ghostBtn({ fontSize: 9, padding: "3px 8px" }), color: C.purple }}>
                        R$ {valorSessao}
                      </button>
                      <button onClick={() => setShowModal(p)} style={ghostBtn({ fontSize: 9, padding: "3px 8px" })}>
                        Detalhes
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
                    <div style={{ background: C.surface, borderRadius: 6, padding: "6px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: C.textMuted }}>Total</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: C.purple }}>R$ {totalP.toFixed(2)}</div>
                    </div>
                    <div style={{ background: recebidoP > 0 ? C.greenBg : C.surface, borderRadius: 6, padding: "6px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: recebidoP > 0 ? C.green : C.textMuted }}>Recebido</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: recebidoP > 0 ? C.green : C.textMuted }}>R$ {recebidoP.toFixed(2)}</div>
                    </div>
                  </div>

                  <div style={{ height: 3, background: C.surface, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pctP}%`, background: `linear-gradient(90deg, ${C.green}, ${C.greenDim})`, borderRadius: 99, transition: "width 0.3s" }} />
                  </div>
                  {aReceberP > 0 && (
                    <div style={{ fontSize: 10, color: C.amber, marginTop: 4, fontWeight: 600 }}>
                      ⏳ R$ {aReceberP.toFixed(2)} a receber
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {tab === "comissao" && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>🤝 Comissão por Profissional</div>
              {comissaoProfissionais.length === 0 ? (
                <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: 16 }}>Nenhuma sessão no período.</div>
              ) : (
                comissaoProfissionais.map((prof, i) => {
                  const pctP = prof.total > 0 ? (prof.recebido / prof.total) * 100 : 0;
                  return (
                    <div key={i} style={{ marginBottom: 10, padding: "8px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 26, height: 26, background: C.greenBg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.green }}>
                            {prof.nome[0]?.toUpperCase()}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{prof.nome}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: C.green }}>R$ {prof.recebido.toFixed(2)}</div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>{prof.sessions} sessões · R$ {prof.total.toFixed(2)}</div>
                        </div>
                      </div>
                      <div style={{ height: 3, background: C.surface, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pctP}%`, background: `linear-gradient(90deg, ${C.green}, ${C.greenDim})`, borderRadius: 99, transition: "width 0.3s" }} />
                      </div>
                      <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>
                        Recebimento: {pctP.toFixed(0)}% · Comissão estimada (40%): <strong style={{ color: C.amber }}>R$ {(prof.recebido * 0.4).toFixed(2)}</strong>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.6 }}>
                A comissão é calculada com base no valor recebido por profissional. A porcentagem padrão sugerida é 40% (configurável).<br />
                <strong style={{ color: C.amber }}>Total em comissões: R$ {(comissaoProfissionais.reduce((a, p) => a + p.recebido * 0.4, 0)).toFixed(2)}</strong>
              </div>
            </div>
          </>
        )}

        {tab === "despesas" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button onClick={() => setEditDespesa({ data: new Date().toISOString().slice(0, 10), descricao: "", categoria: "Outros", valor: "" })}
                style={primaryBtn({ padding: "6px 16px", fontSize: 12 })}>
                + Nova Despesa
              </button>
              <div style={{ fontSize: 11, color: C.textMuted, alignSelf: "center" }}>
                Total despesas: <strong style={{ color: C.red }}>R$ {totalDespesas.toFixed(2)}</strong>
              </div>
            </div>

            {editDespesa && (
              <div style={{ background: C.cardAlt, border: `1px solid ${C.amber}40`, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.amber, marginBottom: 8 }}>
                  {editDespesa.id ? "Editar Despesa" : "Nova Despesa"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <div>
                    <span style={lbl()}>Descrição</span>
                    <input value={editDespesa.descricao} onChange={e => setEditDespesa({ ...editDespesa, descricao: e.target.value })}
                      style={inp({ fontSize: 12 })} placeholder="Ex: Compra de faixas elásticas" />
                  </div>
                  <div>
                    <span style={lbl()}>Valor (R$)</span>
                    <input type="number" step="0.01" min="0" value={editDespesa.valor} onChange={e => setEditDespesa({ ...editDespesa, valor: e.target.value })}
                      style={inp({ fontSize: 12 })} placeholder="0,00" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <div>
                    <span style={lbl()}>Data</span>
                    <input type="date" value={editDespesa.data} onChange={e => setEditDespesa({ ...editDespesa, data: e.target.value })} style={inp({ fontSize: 12 })} />
                  </div>
                  <div>
                    <span style={lbl()}>Categoria</span>
                    <select value={editDespesa.categoria} onChange={e => setEditDespesa({ ...editDespesa, categoria: e.target.value })} style={sel({ fontSize: 12 })}>
                      {DESPESA_CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  <button onClick={handleAddDespesa} disabled={!editDespesa.descricao?.trim() || !editDespesa.valor}
                    style={{ ...primaryBtn({ padding: "6px 16px", fontSize: 11 }), opacity: (!editDespesa.descricao?.trim() || !editDespesa.valor) ? 0.5 : 1 }}>
                    {editDespesa.id ? "Salvar" : "Adicionar"}
                  </button>
                  <button onClick={() => setEditDespesa(null)} style={ghostBtn({ padding: "6px 16px", fontSize: 11 })}>Cancelar</button>
                </div>
              </div>
            )}

            {despesasNoPeriodo.length === 0 && !editDespesa && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "40px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💸</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Nenhuma despesa registrada</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Clique em "+ Nova Despesa" para adicionar.</div>
              </div>
            )}

            {despesasNoPeriodo.map(d => (
              <div key={d.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "10px 12px", marginBottom: 6,
              }}>
                <div style={{
                  width: 4, height: 32, borderRadius: 2,
                  background: d.categoria === "Aluguel" ? C.red : d.categoria === "Materiais" ? C.blue : d.categoria === "Marketing" ? C.purple : C.amber,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{d.descricao}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, display: "flex", gap: 8 }}>
                    <span>{d.data}</span>
                    <span>{d.categoria}</span>
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, color: C.red }}>R$ {Number(d.valor).toFixed(2)}</div>
                <button onClick={() => setEditDespesa(d)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 14, cursor: "pointer", padding: 4 }}>✏️</button>
                <button onClick={() => handleDelDespesa(d.id)} style={{ background: "none", border: "none", color: C.textDim, fontSize: 14, cursor: "pointer", padding: 4 }}>×</button>
              </div>
            ))}
          </>
        )}

        <div style={{ marginTop: 16, fontSize: 10, color: C.textDim, textAlign: "center", lineHeight: 1.6 }}>
          Dados salvos automaticamente · <button onClick={exportCSV} style={{ background: "none", border: "none", color: C.blue, cursor: "pointer", fontSize: 10, textDecoration: "underline", padding: 0 }}>📥 Exportar CSV</button>
          {tab === "pacientes" && <><br />Clique no valor em <strong style={{ color: C.purple }}>roxo</strong> para personalizar o valor por sessão do paciente. Clique em uma sessão para estornar.</>}
          {tab === "comissao" && <><br />A comissão é calculada automaticamente com base nos recebimentos. Use a aba "Pacientes" para marcar recebimentos.</>}
          {tab === "despesas" && <><br />Despesas fixas (aluguel, contas) podem ser registradas mensalmente. Categorias ajudam na organização fiscal.</>}
        </div>
      </div>

      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }} onClick={() => setShowModal(null)}>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: 20, maxWidth: 460, width: "100%", fontFamily: F, maxHeight: "80vh", overflow: "auto",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{showModal.nome}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{showModal.convenio || "—"} · {showModal.sessions} sessões</div>
              </div>
              <button onClick={() => setShowModal(null)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 20, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ marginBottom: 10, fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Sessões — marque como recebido
            </div>

            {(() => {
              const logs = logsInPeriod.filter(l => l.patientId === showModal.patientId);
              const valor = calcSessionValue(showModal.convenio, showModal.patientId);
              return logs.map(log => {
                const pago = pagamentos[String(log.id)];
                return (
                  <div key={log.id} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 10px", borderRadius: 8, marginBottom: 4,
                    background: pago ? C.greenBg : C.surface,
                    border: `1px solid ${pago ? C.green + "40" : C.border}`,
                    cursor: "pointer",
                  }} onClick={() => togglePagamento(log.id)}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 5, border: `2px solid ${pago ? C.green : C.textMuted}`,
                      background: pago ? C.green : "transparent", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0,
                    }}>{pago && "✓"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
                        {log.data} · Sessão {log.sessaoNum || ""}
                      </div>
                      {log.evolucao && <div style={{ fontSize: 10, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.evolucao}</div>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: pago ? C.green : C.amber, flexShrink: 0 }}>
                      R$ {valor.toFixed(2)}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
