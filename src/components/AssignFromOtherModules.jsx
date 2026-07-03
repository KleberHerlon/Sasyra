import { useState, useMemo } from "react";
import { MODULE_LABELS } from "../data/moduleAssignment";

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

export default function AssignFromOtherModules({ allPatients, currentModuleId, onUpdateStudentById, accentColor }) {
  const [open, setOpen] = useState(false);

  const unassigned = useMemo(() =>
    (allPatients || []).filter(p => {
      const am = p.assignedModules || [];
      return !am.includes(currentModuleId);
    }),
    [allPatients, currentModuleId]
  );

  const assign = (p) => {
    const pid = p.id || p.nome;
    const current = p.assignedModules || [];
    if (!current.includes(currentModuleId)) {
      onUpdateStudentById(pid, { assignedModules: [...current, currentModuleId] });
    }
  };

  const ac = accentColor || C.green;

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        background:`${ac}10`, border:`1px solid ${ac}50`, borderRadius:8,
        padding:"7px 14px", fontSize:11, fontWeight:700, color:ac,
        cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:4,
        transition:"all 0.12s",
      }}>
        + Atribuir paciente de outro módulo
      </button>

      {open && (
        <div style={modalOverlay} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:C.surface, border:`1px solid ${C.border}`, borderRadius:16,
            padding:"24px 28px", maxWidth:480, width:"90%", fontFamily:F, maxHeight:"80vh",
            display:"flex", flexDirection:"column",
          }}>
            <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>
              Atribuir paciente existente
            </div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:16 }}>
              Selecione um paciente para atribuir a {MODULE_LABELS[currentModuleId] || currentModuleId}:
            </div>

            {unassigned.length === 0 ? (
              <div style={{ padding:"24px", textAlign:"center", color:C.textMuted, fontSize:13 }}>
                Todos os pacientes já estão atribuídos a este módulo.
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:6, overflowY:"auto", flex:1 }}>
                {unassigned.map(p => (
                  <button key={p.id} onClick={() => { assign(p); setOpen(false); }}
                    style={{
                      display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
                      background:C.card, border:`1px solid ${C.border}`, borderRadius:10,
                      cursor:"pointer", textAlign:"left", fontFamily:F, color:C.text,
                      transition:"all 0.12s",
                    }}>
                    <div style={{ width:32,height:32, background:`${ac}20`, borderRadius:"50%", display:"flex",alignItems:"center",justifyContent:"center", fontSize:13, fontWeight:800, color:ac, flexShrink:0 }}>
                      {p.nome[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700 }}>{p.nome}</div>
                      <div style={{ fontSize:10, color:C.textMuted }}>{p.sexo}{p.dataNasc ? ` · Nasc: ${p.dataNasc}` : ""}{p.convenio ? ` · ${p.convenio}` : ""}</div>
                    </div>
                    <span style={{ color:ac, fontSize:13, fontWeight:700 }}>+</span>
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => setOpen(false)} style={{
              marginTop:16, background:"transparent", border:`1px solid ${C.border}`, borderRadius:10,
              padding:"10px 20px", fontSize:13, fontWeight:700, color:C.textSub,
              cursor:"pointer", fontFamily:F, width:"100%",
            }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
