import { useState } from "react";
import { MODULE_LABELS, ALL_MODULE_IDS } from "../data/moduleAssignment";

const C = {
  bg:"var(--bg)", surface:"var(--surface)", card:"var(--card)",
  border:"var(--border)", green:"var(--green)", greenBg:"var(--greenBg)",
  text:"var(--text)", textSub:"var(--textSub)", textMuted:"var(--textMuted)",
  red:"var(--red)", amber:"var(--amber)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

const modalOverlay = {
  position:"fixed", top:0, left:0, right:0, bottom:0,
  background:"rgba(0,0,0,0.6)", display:"flex",
  alignItems:"center", justifyContent:"center", zIndex:1100,
};

export default function AssignModulesModal({ patient, assignedModules, onSave, onClose }) {
  const [selected, setSelected] = useState([...(assignedModules || [])]);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:C.surface, border:`1px solid ${C.border}`, borderRadius:16,
        padding:"24px 28px", maxWidth:440, width:"90%", fontFamily:F,
      }}>
        <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>
          Atribuir paciente a módulos
        </div>
        <div style={{ fontSize:13, color:C.textSub, marginBottom:18 }}>
          {patient?.nome || "Paciente"} aparecerá apenas nos módulos marcados abaixo:
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
          {ALL_MODULE_IDS.map(id => {
            const active = selected.includes(id);
            return (
              <label key={id} style={{
                display:"flex", alignItems:"center", gap:12, padding:"8px 12px",
                background: active ? `${C.green}10` : C.card,
                border:`1px solid ${active ? C.green+"50" : C.border}`,
                borderRadius:10, cursor:"pointer", transition:"all 0.12s",
              }}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggle(id)}
                  style={{ accentColor:C.green, width:16, height:16, cursor:"pointer" }}
                />
                <span style={{ fontSize:13, fontWeight: active ? 700 : 400, color: active ? C.green : C.text }}>
                  {MODULE_LABELS[id]}
                </span>
              </label>
            );
          })}
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{
            background:"transparent", border:`1px solid ${C.border}`, borderRadius:10,
            padding:"10px 20px", fontSize:13, fontWeight:700, color:C.textSub,
            cursor:"pointer", fontFamily:F,
          }}>
            Cancelar
          </button>
          <button onClick={() => onSave(selected)} style={{
            background:C.green, border:"none", borderRadius:10, padding:"10px 20px",
            fontSize:13, fontWeight:800, color:"#061A0C", cursor:"pointer", fontFamily:F,
          }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
