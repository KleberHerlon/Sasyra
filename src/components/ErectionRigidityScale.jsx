import { useState } from "react";
import ehsImage from "/ehs-erection-scale.png";

const EHS_STAGES = [
  { grade: 0, label: "E0 — Sem ereção", desc: "Pênis flácido, sem aumento de volume ou rigidez", detail: "Disfunção erétil grave" },
  { grade: 1, label: "E1 — Aumentado", desc: "Volume aumentado, mas sem rigidez para penetração", detail: "Insuficiente" },
  { grade: 2, label: "E2 — Rígido parcial", desc: "Rigidez insuficiente para penetração", detail: "Parcial" },
  { grade: 3, label: "E3 — Rígido total", desc: "Ereção completa, adequada para relação sexual", detail: "Normal" },
];

const TYPE_ZONES = [
  { y: 0,  h: 25 },   // E0
  { y: 25, h: 25 },   // E1
  { y: 50, h: 25 },   // E2
  { y: 75, h: 25 },   // E3
];

export default function ErectionRigidityScale({ value, onChange, colors }) {
  const C = colors || {};
  const surface = C.surface || "#111822";
  const border = C.border || "#1F2E45";
  const card = C.card || "#19243A";
  const text = C.text || "#DDE6F0";
  const textMuted = C.textMuted || "#5E7A96";
  const green = C.green || "#4ADE80";
  const amber = C.amber || "#FBBF24";
  const red = C.red || "#F87171";
  const font = C.font || "'Inter','Segoe UI',system-ui,sans-serif";

  const gradeColor = (g) => g === 3 ? green : g === 2 ? amber : g === 1 ? amber : red;
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>
        Escala de Rigidez da Ereção (EHS)
      </div>

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Imagem à esquerda */}
        <div style={{ position: "relative", background: "#fff", borderRadius: 8, border: `1px solid ${border}`, overflow: "hidden", width: 110, flexShrink: 0 }}>
          <img
            src={ehsImage}
            alt="Escala de Rigidez da Ereção"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          {TYPE_ZONES.map((zone, i) => {
            const t = EHS_STAGES[i];
            const active = value === t.grade;
            const isHovered = hovered === t.grade;
            const c = gradeColor(t.grade);
            return (
              <div key={t.grade}
                onClick={() => onChange(active ? null : t.grade)}
                onMouseEnter={() => setHovered(t.grade)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "absolute",
                  left: 0, right: 0,
                  top: `${zone.y}%`,
                  height: `${zone.h}%`,
                  cursor: "pointer",
                  background: active ? `${c}18` : isHovered ? `${c}08` : "transparent",
                  border: active ? `2px solid ${c}` : isHovered ? `1px dashed ${c}50` : "1px solid transparent",
                  transition: "all 0.12s",
                  display: "flex", alignItems: "center", justifyContent: "flex-end",
                  paddingRight: 8,
                  boxSizing: "border-box",
                }}>
                {active && (
                  <span style={{
                    background: c, color: "#fff",
                    borderRadius: "50%", width: 18, height: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  }}>✓</span>
                )}
                {isHovered && !active && (
                  <span style={{ fontSize: 8, color: c, fontWeight: 700, opacity: 0.8 }}>{t.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Descrições à direita */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {EHS_STAGES.map((s) => {
            const active = value === s.grade;
            const c = gradeColor(s.grade);
            return (
              <button key={s.grade} onClick={() => onChange(active ? null : s.grade)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: active ? `${c}14` : "transparent",
                  border: `1px solid ${active ? c : "transparent"}`,
                  color: active ? c : text,
                  borderRadius: 6, padding: "6px 10px", fontSize: 12,
                  fontWeight: active ? 700 : 400,
                  cursor: "pointer", fontFamily: font, transition: "all 0.12s",
                  textAlign: "left", lineHeight: 1.4,
                }}>
                <span style={{ minWidth: 18, fontWeight: 800, fontSize: 12, color: active ? c : textMuted }}>
                  {active ? "✓" : s.grade}
                </span>
                <span style={{ fontWeight: 600 }}>{s.label}:</span>
                <span style={{ color: active ? c : textMuted }}>{s.desc}</span>
                <span style={{ color: textMuted, fontSize: 11, marginLeft: "auto", opacity: 0.7 }}>{s.detail}</span>
              </button>
            );
          })}
          {value !== null && value !== undefined && (
            <div style={{ marginTop: 4, fontSize: 11, color: textMuted, fontFamily: font }}>
              Selecionado: <strong style={{ color: gradeColor(value) }}>{EHS_STAGES.find(s => s.grade === value)?.label}</strong>
              {" — "}{EHS_STAGES.find(s => s.grade === value)?.detail}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
