import { useState } from "react";

const EHS_STAGES = [
  { grade: 0, label: "E0 — Sem ereção", desc: "Pênis flácido, sem aumento de volume ou rigidez", detail: "Disfunção erétil grave" },
  { grade: 1, label: "E1 — Aumentado", desc: "Volume aumentado, mas sem rigidez para penetração", detail: "Insuficiente" },
  { grade: 2, label: "E2 — Rígido parcial", desc: "Rigidez insuficiente para penetração", detail: "Parcial" },
  { grade: 3, label: "E3 — Rígido total", desc: "Ereção completa, adequada para relação sexual", detail: "Normal" },
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
        {/* Ilustração à esquerda */}
        <div style={{ position: "relative", background: `${border}40`, borderRadius: 8, border: `1px solid ${border}`, overflow: "hidden", width: 120, flexShrink: 0 }}>
          <svg width="120" height="300" viewBox="0 0 120 300" style={{ display: "block" }}>
            {/* Fundo levemente demarcado */}
            <rect x="0" y="0" width="120" height="300" fill="transparent" />

            {/* Zonas por grade */}
            {[
              { grade: 0, y: 6,  h: 60, label: "E0" },
              { grade: 1, y: 74, h: 60, label: "E1" },
              { grade: 2, y: 142, h: 70, label: "E2" },
              { grade: 3, y: 212, h: 76, label: "E3" },
            ].map((zone) => {
              const s = EHS_STAGES.find(e => e.grade === zone.grade);
              const active = value === zone.grade;
              const isHovered = hovered === zone.grade;
              const c = gradeColor(zone.grade);

              return (
                <g key={zone.grade}
                  onClick={() => onChange(active ? null : zone.grade)}
                  onMouseEnter={() => setHovered(zone.grade)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}>
                  {/* Hit zone */}
                  <rect x="0" y={zone.y} width="120" height={zone.h}
                    fill={active ? `${c}12` : isHovered ? `${c}08` : "transparent"}
                    stroke={active ? c : isHovered ? `${c}40` : "transparent"}
                    strokeWidth={active ? 1.5 : isHovered ? 1 : 0}
                    rx={4} />
                  {/* Checkmark */}
                  {active && (
                    <>
                      <circle cx="110" cy={zone.y + 14} r="10" fill={c} />
                      <text x="110" y={zone.y + 18} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">✓</text>
                    </>
                  )}

                  {/* Ilustração do estágio */}
                  {/* Corpo (abdômen) */}
                  <ellipse cx="68" cy={zone.y + zone.h - 16} rx="14" ry="16" fill="none" stroke={textMuted} strokeWidth="0.8" opacity="0.25" />
                  <line x1="62" y1={zone.y + zone.h - 4} x2="64" y2={zone.y + zone.h + 4} stroke={textMuted} strokeWidth="0.8" opacity="0.2" />
                  <line x1="74" y1={zone.y + zone.h - 4} x2="76" y2={zone.y + zone.h + 4} stroke={textMuted} strokeWidth="0.8" opacity="0.2" />

                  {/* Pênis — cada grade com inclinação/ângulo diferente */}
                  {zone.grade === 0 && <>
                    <path d={`M68,${zone.y + zone.h - 20} Q68,${zone.y + zone.h - 34} 68,${zone.y + zone.h - 40}`}
                      fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
                    <ellipse cx="68" cy={zone.y + zone.h - 44} rx="6" ry="4" fill="none" stroke={c} strokeWidth="2" opacity="0.35" />
                  </>}
                  {zone.grade === 1 && <>
                    <path d={`M66,${zone.y + zone.h - 20} Q62,${zone.y + zone.h - 34} 58,${zone.y + zone.h - 44}`}
                      fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
                    <ellipse cx="58" cy={zone.y + zone.h - 46} rx="7" ry="5" fill="none" stroke={c} strokeWidth="2.5" opacity="0.55" />
                  </>}
                  {zone.grade === 2 && <>
                    <path d={`M62,${zone.y + zone.h - 20} Q54,${zone.y + zone.h - 34} 48,${zone.y + zone.h - 46} L44,${zone.y + 16}`}
                      fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
                    <ellipse cx="43" cy={zone.y + 12} rx="8" ry="5" fill="none" stroke={c} strokeWidth="3" opacity="0.7" transform={`rotate(-22,43,${zone.y + 12})`} />
                  </>}
                  {zone.grade === 3 && <>
                    <path d={`M58,${zone.y + zone.h - 20} Q48,${zone.y + zone.h - 34} 40,${zone.y + zone.h - 50} L36,${zone.y + 10} L32,${zone.y + 2}`}
                      fill="none" stroke={c} strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
                    <ellipse cx="32" cy={zone.y} rx="9" ry="6" fill="none" stroke={c} strokeWidth="3.5" opacity="0.9" transform={`rotate(-28,32,${zone.y})`} />
                  </>}
                </g>
              );
            })}

            {/* Linhas separadoras sutis */}
            {[72, 140, 210].map(ly => (
              <line key={ly} x1="14" y1={ly} x2="106" y2={ly} stroke={border} strokeWidth="0.5" opacity="0.5" />
            ))}
          </svg>
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
