// @ts-nocheck
import { useState, useEffect } from "react";

const C = {
  bg:"#F5F0EB",surface:"#FCFAF7",card:"#FCFAF7",cardAlt:"#F0EBE5",
  border:"#E8E0D8",borderLight:"#F0EBE5",green:"#A8C9A8",greenDim:"#96BA96",
  greenDeep:"#7CA07C",greenBg:"rgba(168,201,168,0.10)",greenBgHov:"rgba(168,201,168,0.18)",
  amber:"#E8D090",amberBg:"rgba(232,208,144,0.10)",red:"#D4A0A0",redBg:"rgba(212,160,160,0.09)",
  blue:"#E8A0A0",blueBg:"rgba(232,160,160,0.09)",purple:"#C8B0D8",purpleBg:"rgba(200,176,216,0.09)",
  text:"#4A3F3A",textSub:"#8C7D74",textMuted:"#B5A89E",textDim:"#D0C8C0",white:"#FFFFFF",
};
const F = "'Nunito','Inter','Segoe UI',system-ui,sans-serif";
const inp = (e={}) => ({ width:"100%", boxSizing:"border-box", background:"#F8F5F0", border:`1px solid ${C.border}`, borderRadius:14, color:C.text, fontSize:13, padding:"11px 14px", outline:"none", fontFamily:F, ...e });
const sel = (e={}) => ({...inp(), cursor:"pointer", ...e });
const lbl = (e={}) => ({ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textSub, marginBottom:5, ...e });
const card = (e={}) => ({ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"22px 24px", marginBottom:14, boxShadow:"0 2px 12px rgba(232,160,160,0.06)", ...e });
const primaryBtn = (e={}) => ({ background:C.blue, color:"#fff", border:"none", borderRadius:14, padding:"12px 22px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, boxShadow:"0 3px 10px rgba(232,160,160,0.25)", ...e });
const ghostBtn = (e={}) => ({ background:"transparent", color:C.blue, border:`1px solid ${C.border}`, borderRadius:14, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const iconBtn = (active=false, activeColor=C.blue, e={}) => ({ background:active ? `${activeColor}18` : "#F8F5F0", border:`1px solid ${active ? activeColor+"50" : C.border}`, color:active ? activeColor : C.textSub, borderRadius:12, padding:"7px 16px", fontSize:12, fontWeight:active ? 700 : 400, cursor:"pointer", fontFamily:F, transition:"all 0.15s", ...e });

function NumericField({ label, value, onChange, unit, min, max, step }) {
  return (
    <div>
      <span style={lbl()}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
        <input type="number" value={value} min={min} max={max} step={step || 1} onChange={e => onChange(e.target.value)}
          style={{ ...inp(), border:"none", background:"transparent", textAlign:"center", fontSize:16, fontWeight:700, color:C.text, padding:"10px 4px", flex:1 }} />
        {unit && <span style={{ fontSize:11, color:C.textMuted, paddingRight:12, flexShrink:0 }}>{unit}</span>}
      </div>
    </div>
  );
}

function SingleSelect({ options, value, onChange, activeColor }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {options.map(o => {
        const v = o.value || o, l = o.label || o, active = value === v;
        return <button key={v} onClick={() => onChange(active ? "" : v)} style={iconBtn(active, activeColor || C.blue)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
      })}
    </div>
  );
}

function TagSelect({ options, value, onChange, activeColor }) {
  const toggle = v => onChange(value.includes(v) ? value.filter(x=>x!==v) : [...value, v]);
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {options.map(o => {
        const v = o.value || o, l = o.label || o, active = value.includes(v);
        return <button key={v} onClick={() => toggle(v)} style={iconBtn(active, activeColor || C.blue)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
      })}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={card()}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, padding:"10px 14px", margin:"-22px -24px 16px", background:`${C.blue}0C`, borderBottom:`2px solid ${C.blue}20`, borderRadius:"18px 18px 0 0" }}>
        <span style={{ fontSize:20 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:13, fontWeight:700, color:C.text, flex:1 }}>{title}</h3>
        <span style={{ fontSize:10 }}>✨</span>
      </div>
      {children}
    </div>
  );
}

// ── SAVE / LOAD ──────────────────────────────────────────────────────────────
function savePedData(studentId, data) {
  try { localStorage.setItem(`ped_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadPedData(studentId) {
  try { const d = localStorage.getItem(`ped_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { /* empty */ return null; }
}

// ── PEDIATRIC EVIDENCE ───────────────────────────────────────────────────────
const PEDIATRIC_EVIDENCE = {
  paralisia_cerebral: {
    label:"Paralisia Cerebral",
    goldStandard:"Terapia orientada a tarefa + CIMT (Constraint-Induced Movement Therapy) para membro superior. GMFCS como prognóstico funcional. Manejo de espasticidade (toxina botulínica, órteses seriadas). Treino de marcha com suporte parcial se deambulador. Abordagem centrada na família com treino de AVDs.",
    escalas:["GMFCS","MACS","MIF","PEDI","Gross Motor Function Measure (GMFM)"],
  },
  sindrome_down: {
    label:"Síndrome de Down",
    goldStandard:"Estimulação precoce com intervenção neuropsicomotora desde o diagnóstico. Hidroterapia para fortalecimento e coordenação. Treino de equilíbrio e marcha. Fortalecimento muscular global. Incentivo à participação em esportes adaptados. Monitoramento de instabilidade atlantoaxial.",
    escalas:["GMFCS","MIF","PEDI","Escala de Desenvolvimento Motor"],
  },
  tea: {
    label:"Transtorno do Espectro Autista",
    goldStandard:"Integração sensorial baseada na teoria de Ayres — Evidência moderada. Estratégias visuais e rotinas estruturadas (TEACCH). Intervenção precoce ESDM (Early Start Denver Model). Treino de habilidades sociais e comunicação funcional. Fisioterapia focada em coordenação motora grossa e equilíbrio.",
    escalas:["PEDI","MIF","MABC-2 (Movement Assessment Battery for Children)"],
  },
  mielomeningocele: {
    label:"Mielomeningocele",
    goldStandard:"Treino de marcha com órteses (AFO, KAFO, RGO conforme nível lesional). Cuidados de pele para prevenção de úlceras por pressão. Programa de alongamento para prevenir contraturas. Treino de transferências e mobilidade funcional. Cateterismo vesical intermitente se bexiga neurogênica. Monitoramento de hidrocefalia (DP shunt).",
    escalas:["GMFCS","MIF","PEDI","Escala de Deambulação Funcional (FAC)"],
  },
  distrofia_muscular: {
    label:"Distrofia Muscular",
    goldStandard:"Alongamento diário para prevenção de contraturas (Aquiles, isquiotibiais, flexores de quadril). Órteses noturnas para manter ADM. Treino respiratório com incentivador respiratório. Uso de corticoides (prednisona/defllazacorte) para prolongar deambulação. Ventilação não invasiva quando necessário. Evitar imobilização prolongada.",
    escalas:["Vignos Scale","GMFCS","MIF","Teste de caminhada de 6 minutos (TC6M)"],
  },
  torcicolo_congenito: {
    label:"Torcicolo Congênito",
    goldStandard:"Alongamento passivo do ECM (esternocleidomastóideo) pelo menos 3-5x/dia. Posicionamento adequado no berço e durante o sono. Mobilização ativa com estímulo visual para rotação contralateral. Tummy time supervisionado. Plagiocefalia posicional associada requer reposicionamento e em casos refratários órtese craniana (capacete).",
    escalas:["GMFCS","Escala de torcicolo (Cervical Range of Motion)"],
  },
};

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Pediatria({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");

  // Anamnese
  const [queixaPrincipal, setQueixaPrincipal] = useState("");
  const [diagnosticoMedico, setDiagnosticoMedico] = useState("");
  const [historiaGestacional, setHistoriaGestacional] = useState("");
  const [tipoParto, setTipoParto] = useState("");
  const [prematuridade, setPrematuridade] = useState("");
  const [apgar, setApgar] = useState("");
  const [marcosMotores, setMarcosMotores] = useState([]);
  const [comorbidades, setComorbidades] = useState([]);
  const [tonus, setTonus] = useState("");
  const [reflexosPrimitivos, setReflexosPrimitivos] = useState([]);
  const [coordenacao, setCoordenacao] = useState([]);
  const [gmfcs, setGmfcs] = useState("");
  const [aimsScore, setAimsScore] = useState("");
  const [mchat, setMchat] = useState([]);

  // Terapia
  const [objetivosFuncionais, setObjetivosFuncionais] = useState("");
  const [atividadesTerapeuticas, setAtividadesTerapeuticas] = useState([]);
  const [frequencia, setFrequencia] = useState("");
  const [orientacoesCuidador, setOrientacoesCuidador] = useState("");

  // Evolução
  const [evolucao, setEvolucao] = useState("");

  useEffect(() => {
    if (student?.id || student?.nome) {
      const sid = student.id || student.nome;
      const saved = loadPedData(sid);
      if (saved) {
        setQueixaPrincipal(saved.queixaPrincipal || "");
        setDiagnosticoMedico(saved.diagnosticoMedico || "");
        setHistoriaGestacional(saved.historiaGestacional || "");
        setTipoParto(saved.tipoParto || "");
        setPrematuridade(saved.prematuridade || "");
        setApgar(saved.apgar || "");
        setMarcosMotores(saved.marcosMotores || []);
        setComorbidades(saved.comorbidades || []);
        setTonus(saved.tonus || "");
        setReflexosPrimitivos(saved.reflexosPrimitivos || []);
        setCoordenacao(saved.coordenacao || []);
        setGmfcs(saved.gmfcs || "");
        setAimsScore(saved.aimsScore || "");
        setMchat(saved.mchat || []);
        setObjetivosFuncionais(saved.objetivosFuncionais || "");
        setAtividadesTerapeuticas(saved.atividadesTerapeuticas || []);
        setFrequencia(saved.frequencia || "");
        setOrientacoesCuidador(saved.orientacoesCuidador || "");
        setEvolucao(saved.evolucao || "");
      }
    }
  }, [student?.id, student?.nome]);

  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    const sid = student.id || student.nome;
    savePedData(sid, {
      queixaPrincipal, diagnosticoMedico, historiaGestacional, tipoParto, prematuridade, apgar,
      marcosMotores, comorbidades, tonus, reflexosPrimitivos, coordenacao,
      gmfcs, aimsScore, mchat,
      objetivosFuncionais, atividadesTerapeuticas, frequencia, orientacoesCuidador,
      evolucao,
      data: new Date().toISOString().slice(0,10),
    });
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:22, fontWeight:800, color:C.blue }}>👶 Pediatria</span>
          <button onClick={() => { localStorage.removeItem("sasyra_module"); window.location.reload(); }} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>
        <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.5 }}>🧸 Selecione uma criança para iniciar o atendimento ou cadastre um novo paciente</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>✨ Pacientes {(students||[]).length > 0 && <span style={{ color:C.textSub, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "✕ Cancelar" : editingStudent ? "✏️ Editando" : "➕ Novo"}
          </button>
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.blue}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.blue, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              {editingStudent ? "✏️ Editar Paciente" : "➕ Novo Paciente"}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
              {[
                {k:"nome",l:"Nome completo",pl:"Nome do paciente"},
                {k:"dataNasc",l:"Nascimento",pl:"",type:"date"},
                {k:"sexo",l:"Sexo",type:"select",opts:["","Feminino","Masculino","Outro"]},
                {k:"profissao",l:"Profissão",pl:"Profissão"},
                {k:"convenio",l:"Convênio",type:"select",opts:["","Particular","Unimed","Bradesco Saúde","Amil","SulAmérica","Hapvida","NotreDame","IPSEMG","SUS / NASF","Outro"]},
                {k:"telefone",l:"Telefone",pl:"(99) 99999-9999"},
                {k:"peso",l:"Peso (kg)",pl:"kg"},
                {k:"altura",l:"Altura (cm)",pl:"cm"},
              ].map(({k,l,pl,type,opts}) => (
                <div key={k}>
                  <span style={lbl()}>{l}</span>
                  {opts ? (
                    <select value={f[k]} onChange={e => setF(p=>({...p,[k]:e.target.value}))} style={sel()}>
                      {opts.map(o => <option key={o} value={o}>{o||"Selecionar…"}</option>)}
                    </select>
                  ) : (
                    <input type={type||"text"} value={f[k]} placeholder={pl||""} onChange={e => setF(p=>({...p,[k]:e.target.value}))} style={inp()} />
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => {
              if (!f.nome.trim()) return;
              if (editingStudent) {
                const id = editingStudent.id || editingStudent.nome;
                onUpdateStudentById(id, f);
                Object.entries(f).forEach(([k, v]) => onUpdateStudent(k, v));
                setEditingStudent(null);
              } else {
                onAddStudent({ ...f, id:Date.now(), data:new Date().toISOString().slice(0,10) });
              }
              setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
              setShowForm(false);
            }} disabled={!f.nome.trim()} style={{...primaryBtn({width:"100%",justifyContent:"center",padding:"11px",fontSize:14}),opacity:f.nome.trim()?1:0.4,cursor:f.nome.trim()?"pointer":"not-allowed"}}>{editingStudent ? "Salvar Alterações" : "Cadastrar Paciente"}</button>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[...(students||[])].reverse().map(p => (
            <div key={p.id} style={{ display:"flex", gap:8, alignItems:"stretch" }}>
              <button onClick={() => {
                onSelectStudent(p);
                setStudentListView(false);
              }} style={{
                flex:1, background:"#FFFFFF", border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 18px", cursor:"pointer",
                textAlign:"left", fontFamily:F, color:C.text, display:"flex", alignItems:"center", gap:14, width:"100%",
                boxShadow:"0 2px 8px rgba(232,160,160,0.06)", transition:"all 0.15s"
              }}>
                <div style={{ width:42, height:42, background:`${C.blue}12`, border:`2px solid ${C.blue}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:C.blue, flexShrink:0 }}>
                  {p.nome[0]?.toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:3 }}>{p.nome}</div>
                  <div style={{ fontSize:11, color:C.textSub, display:"flex", gap:10, flexWrap:"wrap" }}>
                    {p.sexo && <span>{p.sexo === "Masculino" ? "👦" : p.sexo === "Feminino" ? "👧" : "🧒"} {p.sexo}</span>}
                    {p.dataNasc && <span>🎂 {p.dataNasc}</span>}
                    {p.convenio && <span>🏥 {p.convenio}</span>}
                  </div>
                </div>
                <span style={{ color:C.blue, fontSize:18 }}>→</span>
              </button>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={() => { setEditTarget(p); }}
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0, transition:"all 0.12s" }}
                  title="Editar paciente">✏️</button>
                <button onClick={() => { setDeleteTarget(p); setDeleteStep(1); }}
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0, transition:"all 0.12s" }}
                  title="Excluir paciente">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && deleteStep === 1 && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(62,39,35,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#FFFFFF", border:`2px solid ${C.red}50`, borderRadius:20, padding:"28px 32px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F, boxShadow:"0 8px 30px rgba(229,115,115,0.15)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>😢</div>
            <div style={{ fontSize:17, fontWeight:800, color:C.red, marginBottom:8 }}>Excluir paciente</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16, padding:"10px 14px", background:"#F8F5F0", borderRadius:12, border:`1px solid ${C.border}` }}>{deleteTarget.nome}</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Deseja realmente excluir <strong>{deleteTarget.nome}</strong>?</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}
                style={{ background:"#F8F5F0", border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => setDeleteStep(2)}
                style={{ background:C.red, border:"none", borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && deleteStep === 2 && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(62,39,35,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#FFFFFF", border:`2px solid ${C.red}50`, borderRadius:20, padding:"28px 32px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F, boxShadow:"0 8px 30px rgba(229,115,115,0.15)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔴</div>
            <div style={{ fontSize:17, fontWeight:800, color:C.red, marginBottom:8 }}>Confirmação final</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:16, lineHeight:1.6 }}>
              Todos os dados de <strong>{deleteTarget.nome}</strong> serão perdidos permanentemente. <strong style={{color:C.red}}>Não pode ser desfeito</strong>.
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}
                style={{ background:"#F8F5F0", border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => { onDeleteStudent(deleteTarget); setDeleteTarget(null); setDeleteStep(1); }}
                style={{ background:C.red, border:"none", borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(62,39,35,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => setEditTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#FFFFFF", border:`2px solid ${C.blue}50`, borderRadius:20, padding:"28px 32px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F, boxShadow:"0 8px 30px rgba(232,160,160,0.12)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:17, fontWeight:800, color:C.blue, marginBottom:8 }}>Editar dados</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16, padding:"10px 14px", background:"#F8F5F0", borderRadius:12, border:`1px solid ${C.border}` }}>{editTarget.nome}</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Deseja editar os dados de <strong>{editTarget.nome}</strong>?</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setEditTarget(null)}
                style={{ background:"#F8F5F0", border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => {
                setF({
                  nome: editTarget.nome || "", dataNasc: editTarget.dataNasc || "", sexo: editTarget.sexo || "",
                  profissao: editTarget.profissao || "", convenio: editTarget.convenio || "", telefone: editTarget.telefone || "",
                  peso: editTarget.peso || "", altura: editTarget.altura || "",
                });
                setEditingStudent(editTarget);
                setEditTarget(null);
                setShowForm(true);
              }}
                style={{ background:C.blue, border:"none", borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F, boxShadow:"0 3px 10px rgba(232,160,160,0.25)" }}>Continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>
      <div style={{ background:"#FFFFFF", borderBottom:`2px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, boxShadow:"0 2px 12px rgba(232,160,160,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })}>← Voltar</button>
          <span style={{ fontSize:12, fontWeight:800, color:C.blue }}>👶 Pediatria</span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Anamnese"],["terapia","🏃‍♂️","Terapia"],["evolucao","📈","Evolução"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.blueBg : "#F8F5F0",
              border: `1px solid ${tab === k ? C.blue + "50" : C.border}`,
              borderRadius: 30, padding: "8px 18px", fontSize: 12,
              fontWeight: tab === k ? 800 : 500,
              color: tab === k ? C.blue : C.textSub, cursor: "pointer", fontFamily: F,
              boxShadow: tab === k ? "0 2px 8px rgba(232,160,160,0.2)" : "none",
            }}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {student?.nome && (
            <>
              <div style={{ width:30, height:30, background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.blue }}>
                {student.nome[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize:12, color:C.textSub, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.nome}</span>
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"20px 16px" }}>
        {tab === "anamnese" && (
          <>
            <Section title="Anamnese Pediátrica" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados da anamnese pediátrica, história gestacional, marcos do desenvolvimento e exame físico.
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Queixa principal</span>
                <textarea value={queixaPrincipal} onChange={e => setQueixaPrincipal(e.target.value)} rows={2}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.5 }) }}
                  placeholder="Ex: Atraso na marcha, não sustenta cervical, dificuldade para engatinhar..." />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Diagnóstico médico</span>
                <input type="text" value={diagnosticoMedico} onChange={e => setDiagnosticoMedico(e.target.value)} style={inp()} placeholder="Ex: Paralisia cerebral, Síndrome de Down, Mielomeningocele..." />
              </div>

              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>História gestacional e perinatal</span>
                <textarea value={historiaGestacional} onChange={e => setHistoriaGestacional(e.target.value)} rows={3}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.5 }) }}
                  placeholder="Descreva a gestação: intercorrências, uso de medicamentos, infecções, sofrimento fetal, idade gestacional ao nascer..." />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Tipo de parto</span>
                  <SingleSelect options={["Vaginal","Cesárea","Fórceps"]} value={tipoParto} onChange={setTipoParto} activeColor={C.blue} />
                </div>
                <div>
                  <span style={lbl()}>Prematuridade</span>
                  <SingleSelect options={["Não","Pré-termo (<37 sem)","Muito pré-termo (<32 sem)","Extremo (<28 sem)"]} value={prematuridade} onChange={setPrematuridade} activeColor={C.blue} />
                </div>
                <div>
                  <span style={lbl()}>APGAR</span>
                  <input type="number" value={apgar} onChange={e => setApgar(e.target.value)} style={inp()} min={0} max={10} placeholder="Ex: 8/9" />
                </div>
              </div>

              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Marcos motores — Idade de aquisição / Atraso</span>
                <TagSelect options={["Sustentação cervical","Sentar sem apoio","Engatinhar","Ficar em pé","Andar","Correr","Subir escadas"]}
                  value={marcosMotores} onChange={setMarcosMotores} activeColor={C.blue} />
              </div>

              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Comorbidades</span>
                <TagSelect options={["Paralisia cerebral","Mielomeningocele","Síndrome de Down","TEA","Distrofia muscular","Atraso motor","Torcicolo congênito","Displasia de quadril"]}
                  value={comorbidades} onChange={setComorbidades} activeColor={C.blue} />
              </div>
            </Section>

            <Section title="Exame Físico Pediátrico" icon="🩺">
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Tônus muscular</span>
                <SingleSelect options={["Hipotônico","Normal","Espástico","Hiperônico"]} value={tonus} onChange={setTonus} activeColor={C.blue} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Reflexos primitivos</span>
                <TagSelect options={["Reflexo de busca","Reflexo de sucção","Reflexo de Moro","Preensão palmar","Babinski presente"]}
                  value={reflexosPrimitivos} onChange={setReflexosPrimitivos} activeColor={C.blue} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Coordenação motora</span>
                <TagSelect options={["Adequada","Dismetria","Ataxia","Disdiadococinesia","Tremor intencional"]}
                  value={coordenacao} onChange={setCoordenacao} activeColor={C.blue} />
              </div>
            </Section>

            <Section title="Escalas Pediátricas" icon="📊">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>GMFCS (Classificação da Função Motora Grossa)</span>
                  <SingleSelect options={[
                    { value:"I", label:"I — Deambula sem limitações" },
                    { value:"II", label:"II — Deambula com limitações" },
                    { value:"III", label:"III — Deambula com auxílio" },
                    { value:"IV", label:"IV — Mobilidade limitada" },
                    { value:"V", label:"V — Transportado em cadeira de rodas" },
                  ]} value={gmfcs} onChange={setGmfcs} activeColor={C.blue} />
                </div>
                <div>
                  <span style={lbl()}>AIMS (Alberta Infant Motor Scale)</span>
                  <input type="number" value={aimsScore} onChange={e => setAimsScore(e.target.value)} style={inp()} min={0} max={58} placeholder="Ex: 24" />
                </div>
              </div>
              {aimsScore && (
                <div style={{ marginBottom:14, background: Number(aimsScore) >= 25 ? C.greenBg : Number(aimsScore) >= 10 ? C.amberBg : C.redBg, border:`1px solid ${Number(aimsScore) >= 25 ? C.green : Number(aimsScore) >= 10 ? C.amber : C.red}40`, borderRadius:8, padding:"8px 12px" }}>
                  <span style={{ fontSize:12, fontWeight:700, color: Number(aimsScore) >= 25 ? C.green : Number(aimsScore) >= 10 ? C.amber : C.red }}>
                    {Number(aimsScore) >= 25 ? "🟢 Percentil ≥25 (adequado)" : Number(aimsScore) >= 10 ? "🟡 Percentil 10-25 (risco)" : "🔴 Percentil <10 (atraso significativo)"}
                  </span>
                </div>
              )}
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>M-CHAT — Itens de alerta para TEA</span>
                <TagSelect options={["Não responde ao próprio nome","Evita contato visual","Não aponta para pedir/ mostrar","Atraso na fala","Movimentos repetitivos","Interesse restrito","Não imita","Não brinca de faz de conta","Hipersensibilidade sensorial","Hipo-sensibilidade sensorial","Não segue olhar","Não mostra objetos de interesse"]}
                  value={mchat} onChange={setMchat} activeColor={C.blue} />
                {mchat.length > 0 && (
                  <div style={{ marginTop:8, background: mchat.length >= 3 ? C.redBg : mchat.length >= 2 ? C.amberBg : C.greenBg, border:`1px solid ${mchat.length >= 3 ? C.red : mchat.length >= 2 ? C.amber : C.green}40`, borderRadius:8, padding:"8px 12px", fontSize:12, color:C.textSub }}>
                    {mchat.length >= 3 ? "🔴 ≥3 itens: Risco elevado — encaminhamento para avaliação especializada" : mchat.length >= 2 ? "🟡 2 itens: Risco moderado — monitorar e reaplicar" : "🟢 <2 itens: Baixo risco (M-CHAT)"}
                  </div>
                )}
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Anamnese</button>
            </div>
          </>
        )}

        {tab === "terapia" && (
          <>
            <Section title="Plano Terapêutico" icon="🏃‍♂️">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Defina os objetivos funcionais, atividades terapêuticas e orientações para o plano de tratamento pediátrico.
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Objetivos funcionais</span>
                <textarea value={objetivosFuncionais} onChange={e => setObjetivosFuncionais(e.target.value)} rows={3}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.5 }) }}
                  placeholder="Ex: Alcançar marcha independente com andador, melhorar equilíbrio de tronco na postura sentada, facilitar transferências..." />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Atividades terapêuticas</span>
                <TagSelect options={["Estimulação motora grossa","Estimulação motora fina","Treino de marcha","Alongamento","Fortalecimento","Equilíbrio","Coordenação","Integração sensorial","Exercícios lúdicos","Órtese/posicionamento","Treino de AVDs"]}
                  value={atividadesTerapeuticas} onChange={setAtividadesTerapeuticas} activeColor={C.blue} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Frequência (sessões/semana)</span>
                  <input type="number" value={frequencia} onChange={e => setFrequencia(e.target.value)} style={inp()} min={1} max={7} placeholder="Ex: 3" />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Orientações para cuidadores</span>
                <textarea value={orientacoesCuidador} onChange={e => setOrientacoesCuidador(e.target.value)} rows={3}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.5 }) }}
                  placeholder="Alongamentos diários, posicionamento, estímulos sensoriais, brincadeiras dirigidas, adaptações domiciliares..." />
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Plano</button>
            </div>
          </>
        )}

        {tab === "evolucao" && (
          <Section title="Evolução e Reavaliação" icon="📈">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Registre a evolução do paciente, resposta às intervenções e planejamento das próximas sessões.
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucao} onChange={e => setEvolucao(e.target.value)} rows={5}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução desde a última sessão, progressos nos objetivos funcionais, adesão ao tratamento, dificuldades encontradas..." />
            </div>

            {comorbidades.length > 0 && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.blue, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Condições identificadas</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {comorbidades.map(d => (
                    <span key={d} style={{ fontSize:11, color:C.blue, background:C.blueBg, border:`1px solid ${C.blue}30`, borderRadius:6, padding:"2px 8px" }}>{d}</span>
                  ))}
                </div>
              </div>
            )}

            {atividadesTerapeuticas.length > 0 && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.green, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Atividades em andamento</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {atividadesTerapeuticas.map(a => (
                    <span key={a} style={{ fontSize:11, color:C.green, background:C.greenBg, border:`1px solid ${C.green}30`, borderRadius:6, padding:"2px 8px" }}>{a}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Evolução</button>
            </div>
          </Section>
        )}

        {tab === "evidencias" && (
          <Section title="Evidências em Pediatria" icon="🔬">
            <div style={{ fontSize:13, color:C.textSub, marginBottom:14, lineHeight:1.6 }}>
              🧪 Diretrizes e condutas baseadas em evidências para as principais condições pediátricas.
            </div>
            {Object.entries(PEDIATRIC_EVIDENCE).map(([key, condition]) => {
              const active = comorbidades.some(c => c.toLowerCase().includes(key.replace(/_/g," "))) || diagnosticoMedico.toLowerCase().includes(key.replace(/_/g," ")) || queixaPrincipal.toLowerCase().includes(key.replace(/_/g," "));
              return (
                <div key={key} style={{
                  ...card(),
                  border: active ? `1px solid ${C.blue}50` : `1px solid ${C.border}`,
                  opacity: active ? 1 : 0.6,
                  cursor:"pointer"
                }} onClick={() => {
                  if (!active) setDiagnosticoMedico(prev => prev + " " + condition.label);
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    {active && <span style={{ fontSize:10, fontWeight:800, color:C.blue, background:C.blueBg, padding:"2px 8px", borderRadius:6 }}>Condição identificada ✓</span>}
                    <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{condition.label}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7, marginBottom:8 }}>{condition.goldStandard}</div>
                  {condition.escalas && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {condition.escalas.map(s => (
                        <span key={s} style={{ fontSize:10, color:C.blue, background:C.blueBg, border:`1px solid ${C.blue}30`, borderRadius:6, padding:"2px 8px" }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </Section>
        )}
      </div>
    </div>
  );
}
