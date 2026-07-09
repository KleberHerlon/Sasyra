import { useState } from "react";

const EHS_STAGES = [
  { grade: 0, label: "E0 — Sem ereção", desc: "Pênis flácido, sem aumento de volume ou rigidez" },
  { grade: 1, label: "E1 — Aumentado", desc: "Volume aumentado, mas sem rigidez para penetração" },
  { grade: 2, label: "E2 — Rígido parcial", desc: "Rigidez insuficiente para penetração" },
  { grade: 3, label: "E3 — Rígido total", desc: "Ereção completa, adequada para relação sexual" },
];

export default function ErectionRigidityScale({ value, onChange, colors }) {
  const C = colors || {};
  const accent = C.accent || "#FBBF24";
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

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>
        Escala de Rigidez da Ereção (EHS)
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {EHS_STAGES.map((s) => {
          const active = value === s.grade;
          const c = gradeColor(s.grade);
          return (
            <button key={s.grade} onClick={() => onChange(active ? null : s.grade)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                background: active ? `${c}14` : card,
                border: `1.5px solid ${active ? c : border}`,
                borderRadius: 8, padding: "10px 6px", cursor: "pointer",
                fontFamily: font, transition: "all 0.12s", textAlign: "center",
              }}>
              {/* Ilustração clínica — silhueta corporal simplificada + pênis em ângulo */}
              <svg width="52" height="64" viewBox="0 0 52 64" style={{ display: "block" }}>
                {/* Silhueta corporal (abdômen e coxas) */}
                <ellipse cx="36" cy="40" rx="8" ry="10" fill="none" stroke={textMuted} strokeWidth="1" opacity="0.3" />
                <line x1="32" y1="48" x2="34" y2="60" stroke={textMuted} strokeWidth="1" opacity="0.25" />
                <line x1="40" y1="48" x2="42" y2="60" stroke={textMuted} strokeWidth="1" opacity="0.25" />

                {/* Pênis em cada estágio */}
                {s.grade === 0 && <>
                  <path d="M18,42 Q18,34 18,26" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                  <ellipse cx="18" cy="24" rx="6" ry="4" fill="none" stroke={c} strokeWidth="2.5" opacity="0.4" />
                </>}
                {s.grade === 1 && <>
                  <path d="M16,42 Q14,32 12,24" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
                  <ellipse cx="12" cy="22" rx="7" ry="5" fill="none" stroke={c} strokeWidth="2.5" opacity="0.55" />
                </>}
                {s.grade === 2 && <>
                  <path d="M12,44 Q8,36 6,22 L8,8" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
                  <ellipse cx="8" cy="6" rx="8" ry="5" fill="none" stroke={c} strokeWidth="3" opacity="0.7" transform="rotate(-20,8,6)" />
                </>}
                {s.grade === 3 && <>
                  <path d="M8,44 Q4,34 2,20 L4,2 L8,-4" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <ellipse cx="8" cy="-6" rx="9" ry="6" fill="none" stroke={c} strokeWidth="3.5" opacity="0.9" transform="rotate(-25,8,-6)" />
                </>}
              </svg>
              <div style={{ fontSize: 10, fontWeight: 700, color: active ? c : text }}>{s.label}</div>
              <div style={{ fontSize: 8, color: textMuted, lineHeight: 1.3 }}>{s.desc}</div>
              {active && <span style={{ fontSize: 11, color: c, fontWeight: 700 }}>✓ Selecionado</span>}
            </button>
          );
        })}
      </div>
      {value !== null && value !== undefined ? (
        <div style={{ marginTop: 8, fontSize: 10, color: textMuted, fontFamily: font }}>
          Selecionado: <strong style={{ color: gradeColor(value) }}>{EHS_STAGES.find(s => s.grade === value)?.label}</strong>
        </div>
      ) : null}
    </div>
  );
}
