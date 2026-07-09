import { useState } from "react";

// Mapeamento de sensibilidade por dermátomos (C2-S4) — grade tabular interativa.
// Estado: array de { dermatomo, lado, modalidade, valor }
// modalidade: "Tato" | "Dor" | "Temperatura" | "Propriocepção" | "Vibratória"
// valor: "Normal" | "Hipo" | "Hiper" | "Anestesia"
// Lado: "D" | "E"
const DERMATOMOS = [
  "C2", "C3", "C4", "C5", "C6", "C7", "C8",
  "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12",
  "L1", "L2", "L3", "L4", "L5",
  "S1", "S2", "S3", "S4",
];

const MODALIDADES = ["Tato superficial", "Dor", "Temperatura", "Propriocepção", "Vibratória"];
const GRADUACOES = [
  { v: "Normal", color: "#4ADE80" },
  { v: "Hipo", color: "#A78BFA" },
  { v: "Hiper", color: "#FBBF24" },
  { v: "Anestesia", color: "#F87171" },
];

function keyOf(d, lado, mod) { return `${d}|${lado}|${mod}`; }

export default function DermatomeMap({ value = [], onChange, colors }) {
  const C = colors || {};
  const accent = C.accent || C.green || "#4ADE80";
  const surface = C.surface || "#111822";
  const border = C.border || "#1F2E45";
  const borderLight = C.borderLight || "#2A3F5C";
  const cardAlt = C.cardAlt || "#162030";
  const text = C.text || "#DDE6F0";
  const textMuted = C.textMuted || "#5E7A96";
  const textDim = C.textDim || "#364D62";
  const font = C.font || "'Inter','Segoe UI',system-ui,sans-serif";

  const [active, setActive] = useState({ derm: null, lado: null }); // célula selecionada para edição

  const map = {};
  value.forEach((e) => { map[keyOf(e.dermatomo, e.lado, e.modalidade)] = e.valor; });

  const findByCell = (d, lado) => value.find((e) => e.dermatomo === d && e.lado === lado);

  const setCell = (d, lado, mod, grad) => {
    const k = keyOf(d, lado, mod);
    const next = value.filter((e) => keyOf(e.dermatomo, e.lado, e.modalidade) !== k);
    if (grad) next.push({ dermatomo: d, lado, modalidade: mod, valor: grad });
    onChange(next);
  };

  // Resumo da célula: graduação mais grave registrada (cor + letra)
  const cellSummary = (d, lado) => {
    const entries = value.filter((e) => e.dermatomo === d && e.lado === lado);
    if (entries.length === 0) return null;
    // prioridade de severidade: Anestesia > Hiper > Hipo > Normal
    const order = { Anestesia: 4, Hiper: 3, Hipo: 2, Normal: 1 };
    const worst = entries.reduce((acc, e) => (order[e.valor] > order[acc.valor] ? e : acc), entries[0]);
    return worst;
  };

  const activeCell = active.derm ? findByCell(active.derm, active.lado) : null;
  const activeMods = active.derm ? value.filter((e) => e.dermatomo === active.derm && e.lado === active.lado) : [];

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 8 }}>
        Mapa de Sensibilidade por Dermátomos (C2–S4)
      </div>

      {/* Grade D/E */}
      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: 2, fontSize: 11, fontFamily: font }}>
        <div style={{ padding: "6px 4px", color: textMuted, fontWeight: 700, textAlign: "center", borderBottom: `1px solid ${border}` }}>Derm.</div>
        <div style={{ padding: "6px 4px", color: textMuted, fontWeight: 700, textAlign: "center", borderBottom: `1px solid ${border}` }}>Direito</div>
        <div style={{ padding: "6px 4px", color: textMuted, fontWeight: 700, textAlign: "center", borderBottom: `1px solid ${border}` }}>Esquerdo</div>

        {DERMATOMOS.map((d) => {
          const cellD = cellSummary(d, "D");
          const cellE = cellSummary(d, "E");
          const isActiveD = active.derm === d && active.lado === "D";
          const isActiveE = active.derm === d && active.lado === "E";
          const gradColor = (c) => (c ? GRADUACOES.find((g) => g.v === c.valor)?.color : borderLight);
          const cellBtn = (c, isActive) => ({
            background: c ? `${gradColor(c)}18` : "transparent",
            border: `1px solid ${isActive ? accent : c ? gradColor(c) + "60" : border}`,
            color: c ? gradColor(c) : textDim,
            borderRadius: 6, padding: "5px 4px", fontSize: 10, fontWeight: c ? 700 : 400, cursor: "pointer",
            fontFamily: font, transition: "all 0.12s", minHeight: 24,
          });
          return (
            <div key={d} style={{ display: "contents" }}>
              <div style={{ padding: "5px 4px", color: textMuted, fontWeight: 700, textAlign: "center", fontSize: 10 }}>{d}</div>
              <button style={cellBtn(cellD, isActiveD)} onClick={() => setActive({ derm: d, lado: "D" })}>
                {cellD ? cellD.valor : "—"}
              </button>
              <button style={cellBtn(cellE, isActiveE)} onClick={() => setActive({ derm: d, lado: "E" })}>
                {cellE ? cellE.valor : "—"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Painel de edição da célula ativa */}
      {active.derm && (
        <div style={{ marginTop: 10, background: cardAlt, border: `1px solid ${accent}40`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>Dermátomo {active.derm} — Lado {active.lado}</span>
            <button onClick={() => setActive({ derm: null, lado: null })} style={{ background: "none", border: "none", color: textMuted, cursor: "pointer", fontSize: 14 }}>×</button>
          </div>
          {MODALIDADES.map((mod) => {
            const cur = activeMods.find((e) => e.modalidade === mod);
            return (
              <div key={mod} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: textMuted, marginBottom: 4 }}>{mod}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {GRADUACOES.map((g) => {
                    const isCur = cur?.valor === g.v;
                    return (
                      <button
                        key={g.v}
                        onClick={() => setCell(active.derm, active.lado, mod, isCur ? null : g.v)}
                        style={{
                          background: isCur ? `${g.color}18` : "transparent",
                          border: `1px solid ${isCur ? g.color : border}`,
                          color: isCur ? g.color : textMuted,
                          borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: isCur ? 700 : 400,
                          cursor: "pointer", fontFamily: font,
                        }}
                      >
                        {isCur && "✓ "}{g.v}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {activeMods.length > 0 && (
            <button
              onClick={() => { onChange(value.filter((e) => !(e.dermatomo === active.derm && e.lado === active.lado))); setActive({ derm: null, lado: null }); }}
              style={{ background: "transparent", border: `1px solid ${border}`, color: textMuted, borderRadius: 6, padding: "5px 10px", fontSize: 10, cursor: "pointer", fontFamily: font, marginTop: 4 }}
            >
              Limpar dermátomo
            </button>
          )}
        </div>
      )}

      {/* Legenda + resumo */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10, fontSize: 9, color: textMuted }}>
        {GRADUACOES.map((g) => (
          <span key={g.v} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, background: g.color, borderRadius: 2 }} /> {g.v}
          </span>
        ))}
        <span style={{ marginLeft: "auto" }}>{value.length} registro(s)</span>
      </div>
    </div>
  );
}
