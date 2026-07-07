import { useState } from "react";
import ScaleModal from "../ScaleModal";
import SCALES from "../scales";

const C = {
  card:"var(--card)",border:"var(--border)",green:"var(--green)",greenBg:"var(--greenBg)",
  text:"var(--text)",textMuted:"var(--textMuted)",surface:"var(--surface)",
};

export default function ScaleSelector({ scaleNames, onSave, savedResults = [] }) {
  const [modal, setModal] = useState({ open: false, scale: null });

  const handleOpen = (name) => {
    let s = SCALES[name];
    if (!s) s = Object.values(SCALES).find(sc => sc.aliases?.includes(name));
    if (!s) { console.warn("Scale not found:", name); return; }
    setModal({ open: true, scale: s });
  };

  const handleSave = (result) => {
    setModal({ open: false, scale: null });
    if (onSave) onSave(result);
  };

  const isSaved = (name) => {
    const key = name.toLowerCase();
    return savedResults.some(r =>
      r.scale?.toLowerCase() === key ||
      r.shortName?.toLowerCase() === key ||
      r.scaleName?.toLowerCase() === key
    );
  };

  return (
    <div>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textMuted, marginBottom:8 }}>
        Escalas Padronizadas
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {scaleNames.map(name => {
          const saved = isSaved(name);
          return (
            <button key={name} onClick={() => handleOpen(name)}
              style={{
                background: saved ? `${C.greenBg}` : C.surface,
                border: `1px solid ${saved ? C.green : C.border}`,
                borderRadius: 8, padding: "5px 10px",
                fontSize: 10, fontWeight: saved ? 700 : 500,
                color: saved ? C.green : C.text,
                cursor: "pointer", fontFamily: "'Inter',sans-serif",
                transition: "all 0.1s",
              }}>
              {saved ? "✓ " : ""}{name}
            </button>
          );
        })}
      </div>
      <ScaleModal
        scale={modal.scale}
        open={modal.open}
        onClose={() => setModal({ open: false, scale: null })}
        onSave={handleSave}
        initial={{}}
      />
    </div>
  );
}
