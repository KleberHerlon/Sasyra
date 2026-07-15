import { useState, useEffect } from "react";

const EMPTY_ENTRY = { time: "", volume: "", intake: "", urgency: "0", leakage: false, pad: false };
const EMPTY_DAY = [EMPTY_ENTRY, EMPTY_ENTRY, EMPTY_ENTRY, EMPTY_ENTRY, EMPTY_ENTRY, EMPTY_ENTRY, EMPTY_ENTRY, EMPTY_ENTRY];

function DayDiary({ day, data, onChange, colors }) {
  const C = colors;
  const entries = data || EMPTY_DAY;
  const update = (i, field, value) => {
    const updated = entries.map((e, idx) =>
      idx === i ? { ...e, [field]: value } : e
    );
    onChange(updated);
  };

  const addEntry = () => onChange([...entries, { ...EMPTY_ENTRY }]);
  const removeEntry = (i) => {
    if (entries.length <= 3) return;
    onChange(entries.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 8 }}>
        Dia {day}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ background: C.cardAlt }}>
            <th style={{ padding: "6px 8px", textAlign: "left", color: C.textMuted, fontWeight: 700, fontSize: 10 }}>Hora</th>
            <th style={{ padding: "6px 8px", textAlign: "left", color: C.textMuted, fontWeight: 700, fontSize: 10 }}>Volume (ml)</th>
            <th style={{ padding: "6px 8px", textAlign: "left", color: C.textMuted, fontWeight: 700, fontSize: 10 }}>Ingestão (ml)</th>
            <th style={{ padding: "6px 8px", textAlign: "center", color: C.textMuted, fontWeight: 700, fontSize: 10 }}>Perda</th>
            <th style={{ padding: "6px 8px", textAlign: "center", color: C.textMuted, fontWeight: 700, fontSize: 10 }}>Troca</th>
            <th style={{ padding: "6px 4px", textAlign: "center", color: C.textMuted, fontWeight: 700, fontSize: 10 }}></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}40` }}>
              <td style={{ padding: "4px 8px" }}>
                <input type="time" value={e.time || ""} onChange={ev => update(i, "time", ev.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11, padding: "4px 6px", fontFamily: "'Inter',sans-serif" }} />
              </td>
              <td style={{ padding: "4px 8px" }}>
                <input type="number" value={e.volume || ""} onChange={ev => update(i, "volume", ev.target.value)}
                  placeholder="ml" min="0" max="1000"
                  style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11, padding: "4px 6px", fontFamily: "'Inter',sans-serif" }} />
              </td>
              <td style={{ padding: "4px 8px" }}>
                <input type="number" value={e.intake || ""} onChange={ev => update(i, "intake", ev.target.value)}
                  placeholder="ml" min="0" max="1000"
                  style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11, padding: "4px 6px", fontFamily: "'Inter',sans-serif" }} />
              </td>
              <td style={{ padding: "4px 8px", textAlign: "center" }}>
                <input type="checkbox" checked={e.leakage || false} onChange={ev => update(i, "leakage", ev.target.checked)}
                  style={{ accentColor: C.amber, width: 14, height: 14, cursor: "pointer" }} />
              </td>
              <td style={{ padding: "4px 8px", textAlign: "center" }}>
                <input type="checkbox" checked={e.pad || false} onChange={ev => update(i, "pad", ev.target.checked)}
                  style={{ accentColor: C.amber, width: 14, height: 14, cursor: "pointer" }} />
              </td>
              <td style={{ padding: "4px 4px", textAlign: "center" }}>
                <button onClick={() => removeEntry(i)}
                  style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 14, padding: "2px 4px" }}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addEntry}
        style={{ marginTop: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 600, color: C.textSub, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
        + Adicionar horário
      </button>
    </div>
  );
}

export function calcBladderDiary(diary) {
  if (!diary || !diary.days) return null;
  const totals = { day1: {}, day2: {}, day3: {}, all: {} };

  for (const d of [1, 2, 3]) {
    const entries = diary.days[`day${d}`] || [];
    const volume = entries.reduce((s, e) => s + (Number(e.volume) || 0), 0);
    const intake = entries.reduce((s, e) => s + (Number(e.intake) || 0), 0);
    const leaks = entries.filter(e => e.leakage).length;
    const pads = entries.filter(e => e.pad).length;
    const voids = entries.filter(e => Number(e.volume) > 0).length;
    totals[`day${d}`] = { volume, intake, leaks, pads, voids, entries: entries.length };
  }

  const allVol = totals.day1.volume + totals.day2.volume + totals.day3.volume;
  const allIntake = totals.day1.intake + totals.day2.intake + totals.day3.intake;
  const allLeaks = totals.day1.leaks + totals.day2.leaks + totals.day3.leaks;
  const allVoids = totals.day1.voids + totals.day2.voids + totals.day3.voids;

  totals.all = {
    avgVol24h: Math.round(allVol / 3),
    avgIntake24h: Math.round(allIntake / 3),
    avgVoids24h: Math.round(allVoids / 3 * 10) / 10,
    totalLeaks: allLeaks,
    avgVolPerVoid: allVoids > 0 ? Math.round(allVol / allVoids) : 0,
    polyuria: allVol > 7500 ? "Poliúria (>2,5L/24h)" : null,
    nocturia: 0, // requires time analysis
  };

  return totals;
}

export default function BladderDiary({ studentId, colors, onSave, initialData }) {
  const C = colors;
  const [tab, setTab] = useState(1);
  const [data, setData] = useState(initialData || { days: { day1: EMPTY_DAY.slice(0, 4), day2: EMPTY_DAY.slice(0, 4), day3: EMPTY_DAY.slice(0, 4) } });
  const [loaded, setLoaded] = useState(false);

  const key = `uro_diary_${studentId}`;

  useEffect(() => {
    if (!studentId) return;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setData(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [studentId]);

  const updateDay = (day, entries) => {
    setData(d => ({ ...d, days: { ...d.days, [`day${day}`]: entries } }));
  };

  const persist = () => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
    onSave?.();
  };

  const summary = calcBladderDiary(data);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
        <span>📝</span> Diário Miccional — 3 Dias (ICS)
      </h3>

      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {[1, 2, 3].map(d => (
          <button key={d} onClick={() => setTab(d)}
            style={{
              background: tab === d ? C.amber : "transparent",
              border: `1px solid ${tab === d ? C.amber : C.border}`,
              borderRadius: 8, padding: "6px 14px", fontSize: 12,
              fontWeight: tab === d ? 700 : 400, color: tab === d ? C.text : C.textMuted,
              cursor: "pointer", fontFamily: "'Inter',sans-serif"
            }}>
            Dia {d}
          </button>
        ))}
      </div>

      {[1, 2, 3].map(d => (
        tab === d && (
          <DayDiary key={d} day={d} data={data.days[`day${d}`]} onChange={(e) => updateDay(d, e)} colors={C} />
        )
      ))}

      {summary && (
        <div style={{ marginTop: 16, background: C.cardAlt, borderRadius: 10, padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 16px" }}>
          <div><span style={{ fontSize: 10, color: C.textMuted }}>Volume médio 24h</span><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{summary.all.avgVol24h} ml</div></div>
          <div><span style={{ fontSize: 10, color: C.textMuted }}>Ingestão média 24h</span><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{summary.all.avgIntake24h} ml</div></div>
          <div><span style={{ fontSize: 10, color: C.textMuted }}>Micções médias/24h</span><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{summary.all.avgVoids24h}</div></div>
          <div><span style={{ fontSize: 10, color: C.textMuted }}>Volume médio/micção</span><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{summary.all.avgVolPerVoid} ml</div></div>
          <div><span style={{ fontSize: 10, color: C.textMuted }}>Episódios de perda (total)</span><div style={{ fontSize: 16, fontWeight: 900, color: summary.all.totalLeaks > 3 ? C.red : C.green }}>{summary.all.totalLeaks}</div></div>
          {summary.all.polyuria && <div><span style={{ fontSize: 10, color: C.textMuted }}>Alerta</span><div style={{ fontSize: 12, fontWeight: 700, color: C.amber }}>{summary.all.polyuria}</div></div>}
        </div>
      )}

      <button onClick={persist}
        style={{ marginTop: 14, background: C.amber, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
        💾 Salvar Diário
      </button>
    </div>
  );
}
