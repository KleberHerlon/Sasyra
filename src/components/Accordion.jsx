import { useState } from "react";

const C = {
  bg:"var(--bg)",surface:"var(--surface)",card:"var(--card)",cardAlt:"var(--cardAlt)",
  border:"var(--border)",borderLight:"var(--borderLight)",green:"var(--green)",greenDim:"var(--greenDim)",
  greenBg:"var(--greenBg)",greenBgHov:"var(--greenBgHov)",amber:"var(--amber)",amberBg:"var(--amberBg)",
  red:"var(--red)",redBg:"var(--redBg)",blue:"var(--blue)",blueBg:"var(--blueBg)",
  purple:"var(--purple)",purpleBg:"var(--purpleBg)",
  text:"var(--text)",textSub:"var(--textSub)",textMuted:"var(--textMuted)",textDim:"var(--textDim)",
};

export default function Accordion({ title, icon, badge, children, defaultOpen, accent }) {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <div style={{
      background: C.card, border: `1px solid ${accent ? accent + "50" : C.border}`,
      borderRadius: 14, marginBottom: 12, overflow: "hidden",
      borderLeft: accent ? `3px solid ${accent}` : undefined,
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none",
        padding: "16px 20px", cursor: "pointer", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        display: "flex", alignItems: "center", gap: 10, color: C.text,
        transition: "background 0.12s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = C.greenBgHov}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        {icon && <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>}
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, textAlign: "left", letterSpacing: "0.02em" }}>
          {title}
        </span>
        {badge && <span style={{
          fontSize: 10, background: C.amberBg, color: C.amber,
          border: `1px solid ${C.amber}40`, borderRadius: 20, padding: "2px 10px", fontWeight: 700,
        }}>{badge}</span>}
        <span style={{
          fontSize: 14, color: C.textMuted, transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>▼</span>
      </button>
      <div style={{
        maxHeight: open ? "8000px" : "0", overflow: "hidden",
        transition: "max-height 0.35s ease",
      }}>
        <div style={{ padding: "0 20px 20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
