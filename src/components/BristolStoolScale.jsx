import { useState } from "react";
import bristolImage from "/bristol-stool-scale.png";

const BRISTOL_TYPES = [
  { type: 1, label: "Tipo 1", desc: "Caroços duros separados", detail: "Constipação grave" },
  { type: 2, label: "Tipo 2", desc: "Salsicha grumosa", detail: "Constipação leve" },
  { type: 3, label: "Tipo 3", desc: "Salsicha com fissuras", detail: "Forma ideal" },
  { type: 4, label: "Tipo 4", desc: "Cobra lisa e macia", detail: "Saudável — normal" },
  { type: 5, label: "Tipo 5", desc: "Pedaços macios, bordas nítidas", detail: "Baixa ingestão de fibras" },
  { type: 6, label: "Tipo 6", desc: "Pastoso, bordas irregulares", detail: "Diarreia leve" },
  { type: 7, label: "Tipo 7", desc: "Líquido, sem peças sólidas", detail: "Diarreia franca" },
];

// Posições Y aproximadas de cada tipo na imagem da escala de Bristol
const TYPE_ZONES = [
  { y: 2,  h: 10 },  // Tipo 1
  { y: 14, h: 10 },  // Tipo 2
  { y: 26, h: 10 },  // Tipo 3
  { y: 38, h: 10 },  // Tipo 4
  { y: 51, h: 10 },  // Tipo 5
  { y: 64, h: 10 },  // Tipo 6
  { y: 77, h: 10 },  // Tipo 7
];

export default function BristolStoolScale({ value, onChange, colors }) {
  const C = colors || {};
  const accent = C.accent || "#FBBF24";
  const surface = C.surface || "#111822";
  const border = C.border || "#1F2E45";
  const card = C.card || "#19243A";
  const text = C.text || "#DDE6F0";
  const textMuted = C.textMuted || "#5E7A96";
  const red = C.red || "#F87171";
  const green = C.green || "#4ADE80";
  const font = C.font || "'Inter','Segoe UI',system-ui,sans-serif";

  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>
        Escala de Bristol — Consistência das Fezes
      </div>

      {/* Layout lado a lado: imagem à esquerda, descrições à direita */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Imagem interativa com zonas clicáveis sobrepostas */}
        <div style={{ position: "relative", background: "#fff", borderRadius: 8, border: `1px solid ${border}`, overflow: "hidden", width: 100, flexShrink: 0 }}>
          <img
            src={bristolImage}
            alt="Escala de Bristol"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          {/* Zonas clicáveis sobrepostas — uma para cada tipo */}
          {TYPE_ZONES.map((zone, i) => {
            const t = BRISTOL_TYPES[i];
            const active = value === t.type;
            const isHovered = hovered === t.type;
            const zoneColor = t.type <= 2 ? red : t.type <= 4 ? green : red;
            return (
              <div key={t.type}
                onClick={() => onChange(active ? null : t.type)}
                onMouseEnter={() => setHovered(t.type)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "absolute",
                  left: 0, right: 0,
                  top: `${zone.y}%`,
                  height: `${zone.h}%`,
                  cursor: "pointer",
                  background: active
                    ? `${zoneColor}28`
                    : isHovered
                      ? `${zoneColor}10`
                      : "transparent",
                  border: active
                    ? `2px solid ${zoneColor}`
                    : isHovered
                      ? `1px dashed ${zoneColor}50`
                      : "1px solid transparent",
                  transition: "all 0.12s",
                  display: "flex", alignItems: "center", justifyContent: "flex-end",
                  paddingRight: 8,
                  boxSizing: "border-box",
                }}>
                {active && (
                  <span style={{
                    background: zoneColor,
                    color: "#fff",
                    borderRadius: "50%",
                    width: 18, height: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  }}>✓</span>
                )}
                {isHovered && !active && (
                  <span style={{ fontSize: 8, color: zoneColor, fontWeight: 700, opacity: 0.8 }}>
                    {t.desc}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legenda de seleção + detalhe */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {BRISTOL_TYPES.map((t) => {
            const active = value === t.type;
            const typeColor = t.type <= 2 ? red : t.type <= 4 ? green : red;
            return (
              <button key={t.type} onClick={() => onChange(active ? null : t.type)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: active ? `${typeColor}18` : "transparent",
                  border: `1px solid ${active ? typeColor : "transparent"}`,
                  color: active ? typeColor : text,
                  borderRadius: 6, padding: "6px 10px", fontSize: 12,
                  fontWeight: active ? 700 : 400,
                  cursor: "pointer", fontFamily: font, transition: "all 0.12s",
                  textAlign: "left", lineHeight: 1.4,
                }}>
                <span style={{ minWidth: 18, fontWeight: 800, fontSize: 12, color: active ? typeColor : textMuted }}>
                  {active ? "✓" : t.type}
                </span>
                <span style={{ fontWeight: 600 }}>{t.label}:</span>
                <span style={{ color: active ? typeColor : textMuted }}>{t.desc}</span>
                <span style={{ color: textMuted, fontSize: 11, marginLeft: "auto", opacity: 0.7 }}>{t.detail}</span>
              </button>
            );
          })}
          {value && (
            <div style={{ marginTop: 4, fontSize: 11, color: textMuted, fontFamily: font }}>
              Selecionado: <strong style={{ color: value <= 2 ? red : value <= 4 ? green : red }}>
                Tipo {value} — {BRISTOL_TYPES[value - 1]?.desc}
              </strong> — {BRISTOL_TYPES[value - 1]?.detail}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
