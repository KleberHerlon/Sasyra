import { useState, useRef, useEffect, useCallback, useMemo } from "react";

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

const inp = (extra = {}) => ({ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 12px", outline: "none", fontFamily: F, ...extra });
const sel = (extra = {}) => ({ ...inp(), cursor: "pointer", ...extra });
const lbl = (extra = {}) => ({ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMuted, marginBottom: 5, ...extra });
const primaryBtn = (extra = {}) => ({ background: C.green, color: "#061A0C", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...extra });
const ghostBtn = (extra = {}) => ({ background: "transparent", color: C.green, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...extra });

const HOUR_HEIGHT = 52;
const START_HOUR = 6;
const END_HOUR = 22;
const TOTAL_HOURS = END_HOUR - START_HOUR;

const STATUS_MAP = {
  agendado: { label: "Agendado", color: C.blue, bg: C.blueBg },
  em_atendimento: { label: "Em Atendimento", color: C.amber, bg: C.amberBg },
  concluido: { label: "Concluído", color: C.green, bg: C.greenBg },
  cancelado_paciente: { label: "Cancelado", color: C.red, bg: C.redBg, strikethrough: true },
  falta_justificada: { label: "Falta Justificada", color: C.red, bg: C.redBg, strikethrough: true },
  falta_injustificada: { label: "Falta Injustificada", color: C.red, bg: C.redBg, strikethrough: true },
  bloqueado: { label: "Bloqueado", color: C.textMuted, bg: C.cardAlt },
};

function formatTime(h, m) {
  return `${String(h).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
}

function parseTime(str) {
  const [h, m] = (str || "00:00").split(":").map(Number);
  return h + (m || 0) / 60;
}

function getWeekDays(refDate) {
  const d = new Date(refDate);
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const dd = new Date(mon);
    dd.setDate(mon.getDate() + i);
    days.push(dd);
  }
  return days;
}

function getMonthGrid(refDate) {
  const y = refDate.getFullYear();
  const m = refDate.getMonth();
  const first = new Date(y, m, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const grid = [];
  let row = [];
  for (let i = 0; i < startPad; i++) row.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    row.push(new Date(y, m, d));
    if (row.length === 7) { grid.push(row); row = []; }
  }
  if (row.length) { while (row.length < 7) row.push(null); grid.push(row); }
  return grid;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function ApptCard({ appt, compact, onContextMenu }) {
  const s = STATUS_MAP[appt.status] || STATUS_MAP.agendado;
  return (
    <div
      onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(appt, e); }}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", appt.id); e.currentTarget.style.opacity = "0.4"; }}
      onDragEnd={(e) => { e.currentTarget.style.opacity = "1"; }}
      onClick={() => onContextMenu?.(appt)}
      style={{
        background: s.bg, borderLeft: `3px solid ${s.color}`, borderRadius: 6,
        padding: compact ? "2px 6px" : "4px 8px", cursor: "pointer",
        fontSize: compact ? 10 : 11, color: C.text, marginBottom: 1,
        textDecoration: s.strikethrough ? "line-through" : "none",
        opacity: s.strikethrough ? 0.6 : 1, transition: "all 0.1s",
        userSelect: "none", position: "relative", overflow: "hidden",
        minHeight: compact ? 16 : 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {appt.hasRedFlag && <span style={{ color: C.red, fontSize: 10, flexShrink: 0 }}>🚩</span>}
        <span style={{ fontWeight: 700, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {compact ? appt.patientName?.split(" ")[0] : appt.patientName}
        </span>
        {!compact && appt.type && (
          <span style={{
            fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
            background: appt.type === "avaliacao" ? C.purpleBg : C.greenBg,
            color: appt.type === "avaliacao" ? C.purple : C.green, flexShrink: 0,
          }}>
            {appt.type === "avaliacao" ? "AV" : "S"}
          </span>
        )}
      </div>
      {!compact && (
        <div style={{ fontSize: 9, color: C.textMuted, marginTop: 1 }}>
          {appt.start}–{appt.end}
        </div>
      )}
    </div>
  );
}

function StatusLegend() {
  const items = [
    { s: "agendado", label: "Agendado" },
    { s: "em_atendimento", label: "Em Atendimento" },
    { s: "concluido", label: "Concluído" },
    { s: "cancelado_paciente", label: "Cancelado/Falta" },
    { s: "bloqueado", label: "Bloqueado" },
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      {items.map(({ s, label }) => {
        const st = STATUS_MAP[s];
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: st.color, opacity: 0.7 }} />
            <span style={{ fontSize: 10, color: C.textMuted }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function DeleteConfirmModal({ open, onClose, onConfirm, appt }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
        padding: 24, maxWidth: 400, width: "100%", fontFamily: F,
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.red, marginBottom: 8 }}>Excluir agendamento?</div>
        <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6, marginBottom: 16 }}>
          Esta ação removerá permanentemente o agendamento de <strong>{appt?.patientName}</strong> em {appt?.date} às {appt?.start}.
          <br /><br />Deseja <strong>Cancelar</strong> (mantém registro) ou <strong>Excluir</strong> permanentemente?
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={ghostBtn({ fontSize: 12 })}>Voltar</button>
          <button onClick={() => onConfirm?.("cancel")} style={{
            ...ghostBtn(), border: `1px solid ${C.amber}`, color: C.amber, fontSize: 12,
          }}>Cancelar Agendamento</button>
          <button onClick={() => onConfirm?.("delete")} style={{
            ...primaryBtn(), background: C.red, color: "#fff", fontSize: 12,
          }}>Excluir Permanentemente</button>
        </div>
      </div>
    </div>
  );
}

function ApptDetailModal({ open, onClose, appt, patients, onStartSession, onEdit, onDelete, onCancel }) {
  const [tab, setTab] = useState("view");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (appt && open) {
      setEditData({ ...appt });
      setTab("view");
    }
  }, [appt, open]);

  if (!open || !appt) return null;

  if (tab === "edit" && editData) {
    const st = STATUS_MAP[editData.status] || STATUS_MAP.agendado;
    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }} onClick={onClose}>
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 24, maxWidth: 400, width: "100%", fontFamily: F, maxHeight: "90vh", overflow: "auto",
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 16 }}>
            Editar Agendamento
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={lbl()}>Paciente</span>
            <select value={editData.patientId} onChange={(e) => setEditData({ ...editData, patientId: e.target.value, patientName: patients.find(p => p.id === Number(e.target.value))?.nome || "" })}
              style={sel()}>
              <option value="">Selecionar paciente…</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={lbl()}>Tipo</span>
            <select value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })} style={sel()}>
              <option value="sessao">Sessão</option>
              <option value="avaliacao">Avaliação</option>
              <option value="bloqueio">Bloqueio de Horário</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={lbl()}>Status</span>
            <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} style={sel()}>
              {Object.entries(STATUS_MAP).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div>
              <span style={lbl()}>Data</span>
              <input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} style={inp()} />
            </div>
            <div>
              <span style={lbl()}>Horário</span>
              <input type="time" value={editData.start} onChange={(e) => setEditData({ ...editData, start: e.target.value })} style={inp()} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setTab("view")} style={ghostBtn({ fontSize: 12 })}>Cancelar</button>
            <button onClick={() => { onEdit?.(editData); onClose?.(); }} style={primaryBtn({ fontSize: 12 })}>Salvar</button>
          </div>
        </div>
      </div>
    );
  }

  const s = STATUS_MAP[appt.status] || STATUS_MAP.agendado;
  const isBlock = appt.type === "bloqueio";
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
        padding: 0, maxWidth: 380, width: "100%", fontFamily: F, overflow: "hidden",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          background: s.bg, padding: "18px 22px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          {!isBlock && appt.hasRedFlag && <span style={{ fontSize: 20 }}>🚩</span>}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 2 }}>
              {isBlock ? "Horário Bloqueado" : appt.patientName}
            </div>
            <div style={{ fontSize: 12, color: C.textSub }}>
              {appt.date} • {appt.start}–{appt.end}
            </div>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 6,
            background: s.bg, color: s.color, border: `1px solid ${s.color}50`,
            whiteSpace: "nowrap",
          }}>{s.label}</span>
        </div>

        <div style={{ padding: "16px 22px" }}>
          {!isBlock && (
            <>
              <div style={{ fontSize: 12, color: C.textSub, marginBottom: 4 }}>
                Tipo: <strong style={{ color: C.text }}>{appt.type === "avaliacao" ? "Avaliação" : "Sessão"}</strong>
              </div>
              <div style={{ fontSize: 12, color: C.textSub, marginBottom: 4 }}>
                Telefone: <strong style={{ color: C.text }}>{appt.phone || "—"}</strong>
              </div>
              {appt.convenio && (
                <div style={{ fontSize: 12, color: C.textSub, marginBottom: 14 }}>
                  Convênio: <strong style={{ color: C.text }}>{appt.convenio}</strong>
                </div>
              )}

              {appt.status === "agendado" && (
                <div style={{
                  background: C.greenBg, border: `1px solid ${C.green}40`, borderRadius: 10,
                  padding: "12px 14px", marginBottom: 16,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 8 }}>
                    {appt.type === "avaliacao" ? "Iniciar Avaliação" : "Registrar Sessão"}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => onStartSession?.(appt)} style={{
                      ...primaryBtn(), fontSize: 11, padding: "7px 14px", flex: 1, justifyContent: "center",
                    }}>
                      {appt.type === "avaliacao" ? "📋 Abrir Anamnese" : "📝 Nova Evolução"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => { if (appt.type !== "bloqueio") setTab("edit"); else { onEdit?.(appt); onClose?.(); } }}
              style={ghostBtn({ fontSize: 11, padding: "6px 12px" })}>✏️ Reagendar</button>
            {appt.status === "agendado" && !isBlock && (
              <button onClick={() => { onCancel?.(appt, "cancelado_paciente"); onClose?.(); }}
                style={{ ...ghostBtn({ fontSize: 11, padding: "6px 12px" }), color: C.amber, border: `1px solid ${C.amber}50` }}>
                ❌ Cancelar Atendimento
              </button>
            )}
            {appt.type === "bloqueio" && (
              <button onClick={() => { onDelete?.(appt.id); onClose?.(); }}
                style={{ ...ghostBtn({ fontSize: 11, padding: "6px 12px" }), color: C.red, border: `1px solid ${C.red}50` }}>
                🗑️ Remover Bloqueio
              </button>
            )}
            {(appt.status === "concluido" || appt.status === "cancelado_paciente" || appt.status === "falta_injustificada") && (
              <button onClick={() => { onDelete?.(appt.id); onClose?.(); }}
                style={{ ...ghostBtn({ fontSize: 11, padding: "6px 12px" }), color: C.red, border: `1px solid ${C.red}50` }}>
                🗑️ Excluir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniForm({ patients, date, startTime, onSave, onClose, existingAppt }) {
  const [f, setF] = useState({
    patientId: existingAppt?.patientId || "",
    patientName: existingAppt?.patientName || "",
    type: existingAppt?.type || "sessao",
    date: existingAppt?.date || date || "",
    start: existingAppt?.start || startTime || formatTime(START_HOUR, 0),
    end: existingAppt?.end || (() => {
      if (existingAppt?.start) {
        const [h, m] = existingAppt.start.split(":").map(Number);
        return formatTime(h + 1, m);
      }
      return formatTime(START_HOUR + 1, 0);
    })(),
    status: existingAppt?.status || "agendado",
  });

  const handleSave = () => {
    if (!f.patientId && f.type !== "bloqueio") return;
    onSave({
      ...existingAppt,
      id: existingAppt?.id || Date.now(),
      patientId: f.type === "bloqueio" ? 0 : Number(f.patientId),
      patientName: f.type === "bloqueio" ? "Bloqueado" : (patients.find(p => p.id === Number(f.patientId))?.nome || f.patientName),
      type: f.type,
      date: f.date,
      start: f.start,
      end: f.end || (() => {
        const [h, m] = f.start.split(":").map(Number);
        return formatTime(h + 1, m);
      })(),
      status: f.type === "bloqueio" ? "bloqueado" : f.status,
      phone: patients.find(p => p.id === Number(f.patientId))?.telefone,
      convenio: patients.find(p => p.id === Number(f.patientId))?.convenio,
      hasRedFlag: existingAppt?.hasRedFlag || false,
    });
    onClose?.();
  };

  const isBlock = f.type === "bloqueio";

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
        padding: 22, maxWidth: 380, width: "100%", fontFamily: F,
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 16 }}>
          {existingAppt ? "Reagendamento" : isBlock ? "Bloquear Horário" : "Novo Agendamento"}
        </div>

        {!isBlock && (
          <div style={{ marginBottom: 12 }}>
            <span style={lbl()}>Paciente</span>
            <select value={f.patientId} onChange={(e) => setF({ ...f, patientId: e.target.value })}
              style={sel()}>
              <option value="">Selecionar paciente…</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <span style={lbl()}>Tipo</span>
          <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} style={sel()}>
            <option value="sessao">Sessão de Fisioterapia</option>
            <option value="avaliacao">Avaliação / Triagem</option>
            <option value="bloqueio">Bloqueio de Horário</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div>
            <span style={lbl()}>Data</span>
            <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} style={inp()} />
          </div>
          <div>
            <span style={lbl()}>Início</span>
            <input type="time" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} style={inp()} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <div>
            <span style={lbl()}>Término</span>
            <input type="time" value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} style={inp()} />
          </div>
          <div>
            <span style={lbl()}> </span>
            <button onClick={handleSave}
              disabled={!isBlock && !f.patientId}
              style={{
                ...primaryBtn({ width: "100%", justifyContent: "center", padding: "10px", fontSize: 13 }),
                opacity: (!isBlock && !f.patientId) ? 0.4 : 1,
              }}>
              {existingAppt ? "Confirmar Alteração" : "Agendar"}
            </button>
          </div>
        </div>

        <button onClick={onClose} style={{ ...ghostBtn({ width: "100%", justifyContent: "center", fontSize: 12 }) }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function DayColumn({ date, appointments, onDrop, onApptClick, compact, weekend }) {
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);
  const dayAppts = useMemo(() =>
    appointments.filter(a => a.date === dateStr(date) && a.status !== "bloqueado"),
    [appointments, date]
  );
  const blocks = useMemo(() =>
    appointments.filter(a => a.date === dateStr(date) && a.status === "bloqueado"),
    [appointments, date]
  );

  const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.style.background = `${C.green}08`; };
  const handleDragLeave = (e) => { e.currentTarget.style.background = "transparent"; };
  const handleDrop = (e, hour) => {
    e.preventDefault();
    e.currentTarget.style.background = "transparent";
    const apptId = e.dataTransfer.getData("text/plain");
    if (apptId) onDrop?.(apptId, dateStr(date), formatTime(hour, 0));
  };

  const getApptsForHour = (h) => {
    const slotStart = h;
    const slotEnd = h + 1;
    return dayAppts.filter(a => {
      const aStart = parseTime(a.start);
      const aEnd = parseTime(a.end || formatTime(Math.ceil(aStart), 0));
      return aStart < slotEnd && aEnd > slotStart;
    });
  };

  const getBlocksForHour = (h) => {
    return blocks.filter(a => {
      const aStart = parseTime(a.start);
      const aEnd = parseTime(a.end || formatTime(Math.ceil(aStart), 0));
      return aStart < h + 1 && aEnd > h;
    });
  };

  const today = isSameDay(new Date(), date);

  return (
    <div style={{
      flex: 1, minWidth: compact ? 0 : 120,
      borderLeft: `1px solid ${C.border}`,
      background: weekend ? `${C.cardAlt}30` : "transparent",
    }}>
      <div style={{
        textAlign: "center", padding: compact ? "6px 2px" : "8px 4px",
        borderBottom: `1px solid ${C.border}`,
        background: today ? C.greenBg : "transparent",
        fontWeight: today ? 800 : 400,
      }}>
        <div style={{ fontSize: compact ? 9 : 10, color: C.textMuted, textTransform: "uppercase" }}>
          {date.toLocaleDateString("pt-BR", { weekday: compact ? "narrow" : "short" })}
        </div>
        <div style={{ fontSize: compact ? 12 : 16, fontWeight: 700, color: today ? C.green : C.text }}>
          {date.getDate()}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        {hours.map(h => {
          const apptsInSlot = getApptsForHour(h);
          const blocksInSlot = getBlocksForHour(h);
          const hasBlock = blocksInSlot.length > 0;
          return (
            <div
              key={h}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, h)}
              onDoubleClick={() => onApptClick?.(date, formatTime(h, 0))}
              style={{
                height: HOUR_HEIGHT, borderBottom: `1px solid ${C.borderLight}`,
                position: "relative", cursor: hasBlock ? "not-allowed" : "default",
                background: hasBlock ? `${C.cardAlt}70` : "transparent",
                transition: "background 0.15s",
              }}
            >
              {hasBlock && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 9, color: C.textMuted,
                  fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
                  pointerEvents: "none",
                }}>
                  {blocksInSlot.map(b => b.patientName).join(", ")}
                </div>
              )}
              {apptsInSlot.map(a => (
                <ApptCard key={a.id} appt={a} compact={compact} onContextMenu={onApptClick} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthCell({ date, appointments, onApptClick, onDrop }) {
  const today = isSameDay(new Date(), date);
  const dayAppts = useMemo(() =>
    appointments.filter(a => a.date === dateStr(date)),
    [appointments, date]
  );

  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    const apptId = e.dataTransfer.getData("text/plain");
    if (apptId) onDrop?.(apptId, dateStr(date), "09:00");
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDoubleClick={() => onApptClick?.(date, "09:00")}
      style={{
        minHeight: 80, border: `1px solid ${C.borderLight}`, padding: 3,
        background: today ? C.greenBg : "transparent", cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <div style={{
        fontSize: 11, fontWeight: today ? 800 : 400, color: today ? C.green : C.text,
        marginBottom: 2,
      }}>
        {date.getDate()}
      </div>
      {dayAppts.slice(0, 3).map(a => (
        <ApptCard key={a.id} appt={a} compact onContextMenu={onApptClick} />
      ))}
      {dayAppts.length > 3 && (
        <div style={{ fontSize: 9, color: C.textMuted, marginTop: 1 }}>
          +{dayAppts.length - 3} mais
        </div>
      )}
    </div>
  );
}

export default function Agenda({ patients, onNavigateToPatient }) {
  const [view, setView] = useState("week");
  const [refDate, setRefDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [showMiniForm, setShowMiniForm] = useState(false);
  const [miniFormData, setMiniFormData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailAppt, setDetailAppt] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dragDate, setDragDate] = useState(null);

  const weekDays = useMemo(() => getWeekDays(refDate), [refDate]);
  const monthGrid = useMemo(() => getMonthGrid(refDate), [refDate]);

  const navTitle = useMemo(() => {
    if (view === "day") return refDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (view === "week") {
      const first = weekDays[0];
      const last = weekDays[6];
      if (first.getMonth() === last.getMonth()) {
        return `${first.getDate()}–${last.getDate()} de ${first.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`;
      }
      return `${first.getDate()} ${first.toLocaleDateString("pt-BR", { month: "short" })} – ${last.getDate()} ${last.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}`;
    }
    return refDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  }, [view, refDate, weekDays]);

  const handlePrev = () => {
    const d = new Date(refDate);
    if (view === "day") d.setDate(d.getDate() - 1);
    else if (view === "week") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setRefDate(d);
  };

  const handleNext = () => {
    const d = new Date(refDate);
    if (view === "day") d.setDate(d.getDate() + 1);
    else if (view === "week") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setRefDate(d);
  };

  const handleToday = () => setRefDate(new Date());

  const handleDoubleClickSlot = (date, startTime) => {
    setMiniFormData({ date: dateStr(date), startTime });
    setShowMiniForm(true);
  };

  const handleApptClick = (appt, e) => {
    if (appt && appt.id) {
      setDetailAppt(appt);
      setShowDetail(true);
    } else if (appt instanceof Date) {
      handleDoubleClickSlot(appt, e);
    }
  };

  const handleSaveAppointment = (appt) => {
    setAppointments(prev => {
      const idx = prev.findIndex(a => a.id === appt.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = appt;
        return updated;
      }
      return [...prev, appt];
    });
  };

  const handleDrop = (apptId, newDate, newStart) => {
    setAppointments(prev => prev.map(a => {
      if (String(a.id) === String(apptId)) {
        const duration = parseTime(a.end) - parseTime(a.start);
        const newEnd = formatTime(Math.round((parseTime(newStart) + duration) * 4) / 4, 0);
        return { ...a, date: newDate, start: newStart, end: newEnd };
      }
      return a;
    }));
  };

  const handleEdit = (appt) => {
    setAppointments(prev => prev.map(a => a.id === appt.id ? appt : a));
  };

  const handleCancel = (appt, reason) => {
    setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: reason } : a));
  };

  const handleStartSession = (appt) => {
    setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: "em_atendimento" } : a));
    const patient = patients.find(p => p.id === appt.patientId);
    if (patient) onNavigateToPatient?.(patient, appt.type === "avaliacao" ? "avaliacao" : "diario");
  };

  const handleDeleteConfirm = (action) => {
    if (action === "delete") {
      setAppointments(prev => prev.filter(a => a.id !== deleteTarget?.id));
    } else if (action === "cancel") {
      setAppointments(prev => prev.map(a => a.id === deleteTarget?.id ? { ...a, status: "cancelado_paciente" } : a));
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const handleDeleteRequest = (appt) => {
    setDeleteTarget(appt);
    setShowDeleteConfirm(true);
  };

  const blockedAppts = useMemo(() =>
    appointments.filter(a => a.status === "bloqueado"),
    [appointments]
  );

  return (
    <div style={{ fontFamily: F, color: C.text, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 8, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={handleToday} style={primaryBtn({ padding: "6px 14px", fontSize: 12 })}>Hoje</button>
          <button onClick={handlePrev} style={ghostBtn({ padding: "6px 10px", fontSize: 14 })}>◀</button>
          <button onClick={handleNext} style={ghostBtn({ padding: "6px 10px", fontSize: 14 })}>▶</button>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.text, minWidth: 200 }}>
            {navTitle}
          </span>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {[
            { k: "day", l: "Dia" },
            { k: "week", l: "Semana" },
            { k: "month", l: "Mês" },
          ].map(({ k, l }) => (
            <button key={k} onClick={() => setView(k)} style={{
              background: view === k ? C.greenBg : "transparent",
              border: view === k ? `1px solid ${C.green}50` : `1px solid transparent`,
              borderRadius: 8, padding: "6px 14px", fontSize: 12,
              fontWeight: view === k ? 700 : 400,
              color: view === k ? C.green : C.textMuted,
              cursor: "pointer", fontFamily: F,
            }}>{l}</button>
          ))}
        </div>

        <button onClick={() => { setMiniFormData(null); setShowMiniForm(true); }}
          style={primaryBtn({ padding: "6px 14px", fontSize: 12 })}>
          + Novo
        </button>
      </div>

      <StatusLegend />

      {view === "day" && (
        <div style={{ flex: 1, display: "flex", overflow: "auto" }}>
          <div style={{ minWidth: 60, borderRight: `1px solid ${C.border}` }}>
            <div style={{ height: 40 }} />
            {Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i).map(h => (
              <div key={h} style={{
                height: HOUR_HEIGHT, borderBottom: `1px solid ${C.borderLight}`,
                display: "flex", alignItems: "flex-start", justifyContent: "center",
                paddingTop: 2, fontSize: 10, color: C.textMuted,
              }}>
                {formatTime(h, 0)}
              </div>
            ))}
          </div>
          <DayColumn
            date={refDate}
            appointments={appointments}
            onDrop={handleDrop}
            onApptClick={(d, t) => handleDoubleClickSlot(d, t)}
            compact={false}
            weekend={refDate.getDay() === 0 || refDate.getDay() === 6}
          />
        </div>
      )}

      {view === "week" && (
        <div style={{ flex: 1, display: "flex", overflow: "auto" }}>
          <div style={{ minWidth: 48, borderRight: `1px solid ${C.border}` }}>
            <div style={{ height: 40 }} />
            {Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i).map(h => (
              <div key={h} style={{
                height: HOUR_HEIGHT, borderBottom: `1px solid ${C.borderLight}`,
                display: "flex", alignItems: "flex-start", justifyContent: "center",
                paddingTop: 2, fontSize: 9, color: C.textMuted,
              }}>
                {formatTime(h, 0)}
              </div>
            ))}
          </div>
          {weekDays.slice(0, 5).map((d, i) => (
            <DayColumn
              key={i}
              date={d}
              appointments={appointments}
              onDrop={handleDrop}
              onApptClick={handleDoubleClickSlot}
              compact={false}
              weekend={d.getDay() === 0 || d.getDay() === 6}
            />
          ))}
        </div>
      )}

      {view === "month" && (
        <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1 }}>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
              <div key={d} style={{
                fontSize: 10, fontWeight: 700, color: C.textMuted,
                textTransform: "uppercase", textAlign: "center",
                padding: "6px 0", borderBottom: `1px solid ${C.border}`,
              }}>{d}</div>
            ))}
            {monthGrid.flat().map((d, i) => (
              d ? (
                <MonthCell
                  key={i}
                  date={d}
                  appointments={appointments}
                  onApptClick={handleDoubleClickSlot}
                  onDrop={handleDrop}
                />
              ) : (
                <div key={i} style={{ border: `1px solid ${C.borderLight}`, background: C.cardAlt }} />
              )
            ))}
          </div>
        </div>
      )}

      {showMiniForm && (
        <MiniForm
          patients={patients}
          date={miniFormData?.date}
          startTime={miniFormData?.startTime}
          existingAppt={null}
          onSave={handleSaveAppointment}
          onClose={() => { setShowMiniForm(false); setMiniFormData(null); }}
        />
      )}

      {showDetail && detailAppt && (
        <ApptDetailModal
          open={showDetail}
          onClose={() => { setShowDetail(false); setDetailAppt(null); }}
          appt={detailAppt}
          patients={patients}
          onStartSession={handleStartSession}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onCancel={handleCancel}
        />
      )}

      {showDeleteConfirm && deleteTarget && (
        <DeleteConfirmModal
          open={showDeleteConfirm}
          onClose={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }}
          onConfirm={handleDeleteConfirm}
          appt={deleteTarget}
        />
      )}
    </div>
  );
}
