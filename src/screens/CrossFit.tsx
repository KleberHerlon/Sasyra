// @ts-nocheck
import { useState, useEffect } from "react";
import Accordion from "../components/Accordion";

const C = {
  bg:"#0E141B",surface:"#111822",card:"#19243A",cardAlt:"#162030",
  border:"#1F2E45",borderLight:"#2A3F5C",green:"#4ADE80",greenDim:"#22C55E",
  greenDeep:"#0D9E5C",greenBg:"rgba(74,222,128,0.09)",greenBgHov:"rgba(74,222,128,0.16)",
  amber:"#FBBF24",amberBg:"rgba(251,191,36,0.10)",red:"#F87171",redBg:"rgba(248,113,113,0.09)",
  blue:"#60A5FA",blueBg:"rgba(96,165,250,0.09)",purple:"#A78BFA",purpleBg:"rgba(167,139,250,0.09)",
  text:"#DDE6F0",textSub:"#A8BECC",textMuted:"#5E7A96",textDim:"#364D62",white:"#FFFFFF",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";
const inp = (e={}) => ({ width:"100%", boxSizing:"border-box", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, padding:"9px 12px", outline:"none", fontFamily:F, ...e });
const sel = (e={}) => ({...inp(), cursor:"pointer", ...e });
const lbl = (e={}) => ({ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:5, ...e });
const card = (e={}) => ({ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", marginBottom:14, ...e });
const primaryBtn = (e={}) => ({ background:C.amber, color:"#061A0C", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const ghostBtn = (e={}) => ({ background:"transparent", color:C.amber, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const iconBtn = (active=false, activeColor=C.amber, e={}) => ({ background:active ? `${activeColor}18` : C.surface, border:`1px solid ${active ? activeColor+"50" : C.border}`, color:active ? activeColor : C.textMuted, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:active ? 700 : 400, cursor:"pointer", fontFamily:F, transition:"all 0.12s", ...e });

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
        return <button key={v} onClick={() => onChange(active ? "" : v)} style={iconBtn(active, activeColor || C.amber)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
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
        return <button key={v} onClick={() => toggle(v)} style={iconBtn(active, activeColor || C.amber)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
      })}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={card()}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.amber, flex:1 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function saveCFData(studentId, data) {
  try { localStorage.setItem(`cf_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadCFData(studentId) {
  try { const d = localStorage.getItem(`cf_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { /* empty */ return null; }
}

const CF_EVIDENCE = {
  lombalgia: {
    label:"Lombalgia em CrossFitters",
    goldStandard:"Avaliação inicial com triagem de bandeiras vermelhas. Exercícios de estabilização segmentar lombar e fortalecimento do core. Correção técnica em levantamento terra e agachamento. McKenzie method para direcionamento preferencial. Evitar extensão lombar em atletas com espondilólise. Evidência B para exercícios de McGill.",
    escalas:["Oswestry Disability Index","Tampa Scale of Kinesiophobia","NPRS","FMS (Functional Movement Screen)"],
    referencias:[{ id:"JOSPT 2021", title:"Low back pain in CrossFit athletes", url:"https://www.jospt.org/" }],
  },
  ombro: {
    label:"Ombro do CrossFitter",
    goldStandard:"Avaliação de discinese escapular e range of motion. Fortalecimento de rotadores externos, trapézio médio/inferior e serrátil anterior. Evitar kipping pull-up em atletas com instabilidade glenoumeral. Progressão gradual em movimentos overhead. Evidência B para exercícios de Jobe e scapular retraction drills.",
    escalas:["DASH","ASES Shoulder Score","NPRS","FMS"],
    referencias:[{ id:"Sports Health 2022", title:"Shoulder injuries in CrossFit: a systematic review", url:"https://journals.sagepub.com/home/sph" }],
  },
  joelho: {
    label:"Joelho do CrossFitter",
    goldStandard:"Fortalecimento de quadríceps, posterior de coxa e glúteos. Treino de quedas e aterrissagens para absorção de impacto em box jump. Correção de valgo dinâmico no agachamento. Liberação miofascial do trato iliotibial. Evitar deep squat (>135°) em atletas com dor patelofemoral.",
    escalas:["IKDC","Kujala Scale","NPRS","Y-Balance Test"],
    referencias:[{ id:"AJSM 2020", title:"Knee injury patterns in CrossFit", url:"https://journals.sagepub.com/home/ajs" }],
  },
  rabdomiolise: {
    label:"Rhabdomiólise",
    goldStandard:"Suspensão imediata da atividade. Hidratação agressiva (VO ou EV conforme gravidade). Monitorização de CK, creatinina, potássio e enzimas hepáticas. Hospitalização se CK > 50.000 U/L ou sinais de IRA. Retorno gradual apenas com CK normalizada e função renal preservada. Prevenção: progressão gradual de volume e intensidade.",
    escalas:["CK sérico","Creatinina","Potássio","Função renal"],
    referencias:[{ id:"CIMS 2023", title:"Rhabdomyolysis in CrossFit: clinical management", url:"https://www.crossfit.com/medical" }],
  },
  tunelCarpo: {
    label:"Síndrome do túnel do carpo em ginástica",
    goldStandard:"Modificação temporária de atividades de apoio de peso (handstand, HSPU, burpee). Órtese neutra noturna. Alongamento de flexores dos dedos e punho. Mobilização do nervo mediano. Fortalecimento de extensores. Se persistente, considerar infiltração corticosteroide ou liberação cirúrgica.",
    escalas:["Boston Carpal Tunnel Questionnaire","NPRS","Força de preensão"],
  },
  tendinopatiaAquiles: {
    label:"Tendinopatia de Aquiles em saltadores",
    goldStandard:"Exercícios excêntricos (protocolo Alfredson, 3x15, 2x/dia, 12 semanas). Carga progressiva em dupla perna → unipodal. Evitar saltos e double-unders durante fase aguda. Liberação de panturrilha e mobilização de tornozelo. Retorno gradual com redução de volume de saltos. Evidência A para excêntricos isolados.",
    escalas:["VISA-A","NPRS","Hopping Test"],
    referencias:[{ id:"BJSM 2021", title:"Achilles tendinopathy management", url:"https://bjsm.bmj.com/" }],
  },
};

export default function CrossFit({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onUpdateStudentById, onDeleteStudent }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");

  // Anamnese
  const [nomeAtleta, setNomeAtleta] = useState("");
  const [idadeAtleta, setIdadeAtleta] = useState("");
  const [sexoAtleta, setSexoAtleta] = useState("");
  const [tempoCrossfit, setTempoCrossfit] = useState("");
  const [modalidades, setModalidades] = useState([]);
  const [lesoesPrevias, setLesoesPrevias] = useState([]);
  const [restricoesMovimentos, setRestricoesMovimentos] = useState([]);
  const [nivelAtleta, setNivelAtleta] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [frequenciaSemanal, setFrequenciaSemanal] = useState("");

  // Treinos
  const [treinoData, setTreinoData] = useState("");
  const [treinoTipo, setTreinoTipo] = useState("");
  const [treinoNome, setTreinoNome] = useState("");
  const [treinoDescricao, setTreinoDescricao] = useState("");
  const [treinoResultado, setTreinoResultado] = useState("");
  const [treinoRPE, setTreinoRPE] = useState("");
  const [treinoObservacoes, setTreinoObservacoes] = useState("");
  const [historicoTreinos, setHistoricoTreinos] = useState([]);

  // Métricas
  const [snatchRM, setSnatchRM] = useState("");
  const [cleanJerkRM, setCleanJerkRM] = useState("");
  const [backSquatRM, setBackSquatRM] = useState("");
  const [frontSquatRM, setFrontSquatRM] = useState("");
  const [deadliftRM, setDeadliftRM] = useState("");
  const [benchPressRM, setBenchPressRM] = useState("");
  const [shoulderPressRM, setShoulderPressRM] = useState("");
  const [benchmarksHistorico, setBenchmarksHistorico] = useState([]);

  // Evolução
  const [evolucao, setEvolucao] = useState("");

  useEffect(() => {
    if (student?.id || student?.nome) {
      const sid = student.id || student.nome;
      const saved = loadCFData(sid);
      if (saved) {
        setNomeAtleta(saved.nomeAtleta || "");
        setIdadeAtleta(saved.idadeAtleta || "");
        setSexoAtleta(saved.sexoAtleta || "");
        setTempoCrossfit(saved.tempoCrossfit || "");
        setModalidades(saved.modalidades || []);
        setLesoesPrevias(saved.lesoesPrevias || []);
        setRestricoesMovimentos(saved.restricoesMovimentos || []);
        setNivelAtleta(saved.nivelAtleta || "");
        setObjetivos(saved.objetivos || []);
        setFrequenciaSemanal(saved.frequenciaSemanal || "");
        setHistoricoTreinos(saved.historicoTreinos || []);
        setSnatchRM(saved.snatchRM || "");
        setCleanJerkRM(saved.cleanJerkRM || "");
        setBackSquatRM(saved.backSquatRM || "");
        setFrontSquatRM(saved.frontSquatRM || "");
        setDeadliftRM(saved.deadliftRM || "");
        setBenchPressRM(saved.benchPressRM || "");
        setShoulderPressRM(saved.shoulderPressRM || "");
        setBenchmarksHistorico(saved.benchmarksHistorico || []);
        setEvolucao(saved.evolucao || "");
      }
    }
  }, [student?.id, student?.nome]);

  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    const sid = student.id || student.nome;
    saveCFData(sid, {
      nomeAtleta, idadeAtleta, sexoAtleta, tempoCrossfit, modalidades, lesoesPrevias,
      restricoesMovimentos, nivelAtleta, objetivos, frequenciaSemanal,
      historicoTreinos,
      snatchRM, cleanJerkRM, backSquatRM, frontSquatRM, deadliftRM, benchPressRM, shoulderPressRM,
      benchmarksHistorico,
      evolucao,
      data: new Date().toISOString().slice(0,10),
    });
  };

  const addTreino = () => {
    if (!treinoNome && !treinoData) return;
    const novo = {
      data: treinoData || new Date().toISOString().slice(0,10),
      tipo: treinoTipo,
      nome: treinoNome,
      descricao: treinoDescricao,
      resultado: treinoResultado,
      rpe: treinoRPE,
      observacoes: treinoObservacoes,
      id: Date.now(),
    };
    const updated = [novo, ...historicoTreinos].slice(0, 50);
    setHistoricoTreinos(updated);
    setTreinoData("");
    setTreinoTipo("");
    setTreinoNome("");
    setTreinoDescricao("");
    setTreinoResultado("");
    setTreinoRPE("");
    setTreinoObservacoes("");
  };

  const addBenchmarkResult = (label) => {
    const novo = {
      label,
      resultado: treinoResultado || "",
      data: treinoData || new Date().toISOString().slice(0,10),
      rpe: treinoRPE || "",
      id: Date.now(),
    };
    setBenchmarksHistorico([novo, ...benchmarksHistorico].slice(0, 30));
  };

  const handleSaveMetricas = () => {
    handleSave();
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"0.05em" }}>💪 CrossFit</span>
          <button onClick={() => { localStorage.removeItem("sasyra_module"); window.location.reload(); }} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um aluno para iniciar o treinamento</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Alunos {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Novo Aluno"}
          </button>
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.amber}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.amber, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              {editingStudent ? "✏️ Editar Aluno" : "➕ Novo Aluno"}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
              {[
                {k:"nome",l:"Nome completo",pl:"Nome do aluno"},
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
            }} disabled={!f.nome.trim()} style={{...primaryBtn({width:"100%",justifyContent:"center",padding:"11px",fontSize:14}),opacity:f.nome.trim()?1:0.4,cursor:f.nome.trim()?"pointer":"not-allowed"}}>{editingStudent ? "Salvar Alterações" : "Cadastrar Aluno"}</button>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[...(students||[])].reverse().map(p => (
            <div key={p.id} style={{ display:"flex", gap:8, alignItems:"stretch" }}>
              <button onClick={() => {
                onSelectStudent(p);
                setStudentListView(false);
              }} style={{
                flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", cursor:"pointer",
                textAlign:"left", fontFamily:F, color:C.text, display:"flex", alignItems:"center", gap:14, width:"100%",
                transition:"all 0.12s"
              }}>
                <div style={{ width:40, height:40, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:C.amber, flexShrink:0 }}>
                  {p.nome[0]?.toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:2 }}>{p.nome}</div>
                  <div style={{ fontSize:11, color:C.textMuted, display:"flex", gap:8, flexWrap:"wrap" }}>
                    {p.sexo && <span>{p.sexo}</span>}
                    {p.dataNasc && <span>Nasc: {p.dataNasc}</span>}
                    {p.convenio && <span>{p.convenio}</span>}
                  </div>
                </div>
                <span style={{ color:C.amber, fontSize:16 }}>→</span>
              </button>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={() => { setEditTarget(p); }}
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0, transition:"all 0.12s" }}
                  title="Editar aluno">✏️</button>
                <button onClick={() => { setDeleteTarget(p); setDeleteStep(1); }}
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0, transition:"all 0.12s" }}
                  title="Excluir aluno">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && deleteStep === 1 && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.red}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.red, marginBottom:8 }}>Excluir aluno</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16, padding:"8px 12px", background:C.card, borderRadius:8, border:`1px solid ${C.border}` }}>{deleteTarget.nome}</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Deseja realmente excluir <strong>{deleteTarget.nome}</strong>?</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}
                style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => setDeleteStep(2)}
                style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && deleteStep === 2 && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.red}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔴</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.red, marginBottom:8 }}>Confirmação final</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:16, lineHeight:1.6 }}>
              Todos os dados de treino de <strong>{deleteTarget.nome}</strong> serão perdidos permanentemente. Esta operação <strong style={{color:C.red}}>não pode ser desfeita</strong>.
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}
                style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => { onDeleteStudent(deleteTarget); setDeleteTarget(null); setDeleteStep(1); }}
                style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Sim, excluir permanentemente</button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => setEditTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.amber}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.amber, marginBottom:8 }}>Editar dados do aluno</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16, padding:"8px 12px", background:C.card, borderRadius:8, border:`1px solid ${C.border}` }}>{editTarget.nome}</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Deseja editar os dados cadastrais de <strong>{editTarget.nome}</strong>?</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setEditTarget(null)}
                style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
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
                style={{ background:C.amber, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#061A0C", cursor:"pointer", fontFamily:F }}>Continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })}>← Alunos</button>
          <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>💪 CrossFit</span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Anamnese"],["treinos","🏋️","Treinos"],["metricas","📊","Métricas"],["evolucao","📈","Evolução"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.amberBg : "transparent",
              border: `1px solid ${tab === k ? C.amber + "50" : "transparent"}`,
              borderRadius: 8, padding: "7px 14px", fontSize: 12,
              fontWeight: tab === k ? 700 : 400,
              color: tab === k ? C.amber : C.textMuted, cursor: "pointer", fontFamily: F,
            }}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {student?.nome && (
            <>
              <div style={{ width:30, height:30, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.amber }}>
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
            <Section title="Perfil do Atleta" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha o perfil do atleta de CrossFit para personalizar o treinamento.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Nome do atleta</span>
                  <input type="text" value={nomeAtleta} onChange={e => setNomeAtleta(e.target.value)} style={inp()} placeholder="Nome completo" />
                </div>
                <div>
                  <span style={lbl()}>Idade</span>
                  <input type="number" value={idadeAtleta} onChange={e => setIdadeAtleta(e.target.value)} style={inp()} min={10} max={100} placeholder="Ex: 28" />
                </div>
                <div>
                  <span style={lbl()}>Sexo</span>
                  <SingleSelect options={["Masculino","Feminino","Outro"]} value={sexoAtleta} onChange={setSexoAtleta} activeColor={C.amber} />
                </div>
                <div>
                  <span style={lbl()}>Tempo de CrossFit</span>
                  <input type="text" value={tempoCrossfit} onChange={e => setTempoCrossfit(e.target.value)} style={inp()} placeholder="Ex: 2 anos e 3 meses" />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Modalidades favoritas</span>
                <TagSelect options={["Levantamento olímpico","Ginástica","Metcon","Endurance","Strongman"]}
                  value={modalidades} onChange={setModalidades} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Lesões prévias</span>
                <TagSelect options={["Ombro","Coluna lombar","Joelho","Quadril","Punho","Tornozelo","Cotovelo"]}
                  value={lesoesPrevias} onChange={setLesoesPrevias} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Restrições / Movimentos proibidos</span>
                <TagSelect options={["Snatch","Clean & Jerk","Back squat","Overhead squat","Muscle-up","Handstand push-up","Burpee","Double-under","Kipping pull-up","Box jump"]}
                  value={restricoesMovimentos} onChange={setRestricoesMovimentos} activeColor={C.amber} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Nível</span>
                  <SingleSelect options={["Iniciante","Intermediário","Avançado","Elite/Competidor"]} value={nivelAtleta} onChange={setNivelAtleta} activeColor={C.amber} />
                </div>
                <div>
                  <span style={lbl()}>Frequência semanal</span>
                  <input type="number" value={frequenciaSemanal} onChange={e => setFrequenciaSemanal(e.target.value)} style={inp()} min={1} max={14} placeholder="Ex: 5" />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Objetivos</span>
                <TagSelect options={["Ganho de força","Emagrecimento","Melhorar condicionamento","Competição","Técnica olímpico","Resistência muscular","Mobilidade"]}
                  value={objetivos} onChange={setObjetivos} activeColor={C.amber} />
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Perfil</button>
            </div>
          </>
        )}

        {tab === "treinos" && (
          <>
            <Section title="Registro de Treinos" icon="🏋️">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Registre os treinos realizados pelo atleta.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Data</span>
                  <input type="date" value={treinoData} onChange={e => setTreinoData(e.target.value)} style={inp()} />
                </div>
                <div>
                  <span style={lbl()}>Tipo de treino</span>
                  <SingleSelect options={["Strength","Metcon","Gymnastics","Weightlifting","Endurance","WOD específico"]} value={treinoTipo} onChange={setTreinoTipo} activeColor={C.amber} />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Nome do WOD</span>
                <input type="text" value={treinoNome} onChange={e => setTreinoNome(e.target.value)} style={inp()} placeholder="Ex: Fran, Cindy, WOD personalizado..." />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Descrição</span>
                <textarea value={treinoDescricao} onChange={e => setTreinoDescricao(e.target.value)} rows={3}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.5 }) }}
                  placeholder="Descreva o WOD, rounds, repetições, cargas..." />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Resultado</span>
                  <input type="text" value={treinoResultado} onChange={e => setTreinoResultado(e.target.value)} style={inp()} placeholder="Ex: 8:32, 95kg, 12 rounds..." />
                </div>
                <div>
                  <span style={lbl()}>RPE (0-10)</span>
                  <input type="number" value={treinoRPE} onChange={e => setTreinoRPE(e.target.value)} style={inp()} min={0} max={10} step={0.5} placeholder="Ex: 8" />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Observações</span>
                <textarea value={treinoObservacoes} onChange={e => setTreinoObservacoes(e.target.value)} rows={2}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.3 }) }}
                  placeholder="Sensações, dificuldades, ajustes..." />
              </div>
              <button onClick={addTreino} style={primaryBtn({ width:"100%", justifyContent:"center", padding:"11px", fontSize:14 })}>💾 Salvar Treino</button>
            </Section>

            <Section title="Benchmark WODs Predefinidos" icon="🔥">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:12, lineHeight:1.5 }}>
                Clique em um benchmark para registrar o resultado rapidamente.
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  "Fran (21-15-9: Thruster + Pull-up)",
                  "Helen (3 rounds: 400m run, 21 KB swing, 12 pull-up)",
                  "Cindy (AMRAP 20 min: 5 pull-ups, 10 push-ups, 15 squats)",
                  "Grace (30 C&J for time)",
                  "Isabel (30 snatch for time)",
                  "Diane (21-15-9: DL + HSPU)",
                  "Annie (50-40-30-20-10: DU + sit-up)",
                  "Karen (150 wall balls for time)",
                  "Kelly (5 rounds: 400m run, 30 box jump, 30 wall ball)",
                ].map(b => (
                  <div key={b} style={{ display:"flex", gap:8, alignItems:"center", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px" }}>
                    <span style={{ flex:1, fontSize:12, color:C.text }}>{b}</span>
                    <button onClick={() => {
                      setTreinoNome(b.split(" (")[0]);
                      setTreinoDescricao(b);
                      addBenchmarkResult(b);
                    }} style={ghostBtn({ padding:"4px 10px", fontSize:10 })}>📝 Registrar</button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Histórico de Treinos" icon="📜">
              {historicoTreinos.length === 0 ? (
                <div style={{ fontSize:12, color:C.textMuted, textAlign:"center", padding:"16px 0" }}>Nenhum treino registrado ainda.</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {historicoTreinos.slice(0, 20).map(t => (
                    <div key={t.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                        <span style={{ fontWeight:700, fontSize:13, color:C.text }}>{t.nome || "WOD"}</span>
                        <span style={{ fontSize:10, color:C.textDim }}>{t.data}</span>
                      </div>
                      {t.tipo && <span style={{ fontSize:10, color:C.amber, background:C.amberBg, borderRadius:4, padding:"1px 6px" }}>{t.tipo}</span>}
                      {t.descricao && <div style={{ fontSize:11, color:C.textSub, marginTop:4 }}>{t.descricao}</div>}
                      {t.resultado && <div style={{ fontSize:11, color:C.text, marginTop:2 }}>Resultado: {t.resultado}</div>}
                      {t.rpe && <div style={{ fontSize:10, color:C.textDim, marginTop:2 }}>RPE: {t.rpe}/10</div>}
                      {t.observacoes && <div style={{ fontSize:10, color:C.textMuted, marginTop:2, fontStyle:"italic" }}>{t.observacoes}</div>}
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </>
        )}

        {tab === "metricas" && (
          <>
            <Section title="1RM Tracking" icon="📊">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Registre as cargas máximas (1RM) para cada levantamento.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Snatch" value={snatchRM} onChange={setSnatchRM} unit="kg" min={0} max={300} step={0.5} />
                <NumericField label="Clean & Jerk" value={cleanJerkRM} onChange={setCleanJerkRM} unit="kg" min={0} max={400} step={0.5} />
                <NumericField label="Back Squat" value={backSquatRM} onChange={setBackSquatRM} unit="kg" min={0} max={500} step={0.5} />
                <NumericField label="Front Squat" value={frontSquatRM} onChange={setFrontSquatRM} unit="kg" min={0} max={400} step={0.5} />
                <NumericField label="Deadlift" value={deadliftRM} onChange={setDeadliftRM} unit="kg" min={0} max={500} step={0.5} />
                <NumericField label="Bench Press" value={benchPressRM} onChange={setBenchPressRM} unit="kg" min={0} max={400} step={0.5} />
                <NumericField label="Shoulder Press" value={shoulderPressRM} onChange={setShoulderPressRM} unit="kg" min={0} max={300} step={0.5} />
              </div>

              {snatchRM && cleanJerkRM && (
                <div style={{ marginTop:14, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"12px 16px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Total Olímpico</div>
                  <div style={{ fontSize:24, fontWeight:900, color:C.amber }}>{parseFloat(snatchRM || 0) + parseFloat(cleanJerkRM || 0)} <span style={{ fontSize:12, color:C.textMuted }}>kg</span></div>
                </div>
              )}
            </Section>

            <Section title="Comparação de Benchmarks" icon="📉">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Últimos resultados registrados nos benchmarks.
              </div>
              {benchmarksHistorico.length === 0 ? (
                <div style={{ fontSize:12, color:C.textMuted, textAlign:"center", padding:"16px 0" }}>Nenhum benchmark registrado. Use a aba Treinos para registrar.</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {benchmarksHistorico.slice(0, 15).map(b => (
                    <div key={b.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"6px 10px", fontSize:11 }}>
                      <span style={{ color:C.text, fontWeight:600 }}>{b.label}</span>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        {b.resultado && <span style={{ color:C.amber }}>{b.resultado}</span>}
                        {b.data && <span style={{ color:C.textDim, fontSize:9 }}>{b.data}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSaveMetricas} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Métricas</button>
            </div>
          </>
        )}

        {tab === "evolucao" && (
          <Section title="Evolução do Atleta" icon="📈">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Registre a evolução do atleta, progressão de cargas, observações sobre desempenho e planejamento de treinos.
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução / Observações</span>
              <textarea value={evolucao} onChange={e => setEvolucao(e.target.value)} rows={6}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução do atleta: progressão de cargas, melhora de condicionamento, ajustes técnicos, próximos passos..." />
            </div>

            {snatchRM && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Resumo de Métricas</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(120px, 1fr))", gap:8 }}>
                  {[
                    {l:"Snatch", v:snatchRM},
                    {l:"C&J", v:cleanJerkRM},
                    {l:"Back Squat", v:backSquatRM},
                    {l:"Front Squat", v:frontSquatRM},
                    {l:"Deadlift", v:deadliftRM},
                    {l:"Bench Press", v:benchPressRM},
                    {l:"Shoulder Press", v:shoulderPressRM},
                  ].filter(x => x.v).map(x => (
                    <div key={x.l} style={{ textAlign:"center", background:C.surface, borderRadius:6, padding:"6px 8px" }}>
                      <div style={{ fontSize:9, color:C.textDim }}>{x.l}</div>
                      <div style={{ fontSize:16, fontWeight:800, color:C.text }}>{x.v} <span style={{ fontSize:9, color:C.textMuted }}>kg</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {historicoTreinos.length > 0 && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Últimos Treinos</div>
                {historicoTreinos.slice(0, 5).map(t => (
                  <div key={t.id} style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.textSub, padding:"3px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ color:C.text }}>{t.nome || "WOD"}</span>
                    <span>{t.data} {t.resultado && `— ${t.resultado}`}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Evolução</button>
            </div>
          </Section>
        )}

        {tab === "evidencias" && (
          <Section title="Diretrizes e Evidências em CrossFit" icon="🔬">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Baseado nas condições identificadas, as diretrizes abaixo representam as recomendações de prática clínica baseada em evidências para atletas de CrossFit.
            </div>
            {Object.entries(CF_EVIDENCE).map(([key, condition]) => {
              const active = lesoesPrevias.some(l => l.toLowerCase().includes(key.replace(/_/g," ").split(" ")[0])) ||
                restricoesMovimentos.some(r => r.toLowerCase().includes(key.replace(/_/g," ").split(" ")[0])) ||
                evolucao.toLowerCase().includes(key.replace(/_/g," "));
              return (
                <div key={key} style={{
                  ...card(),
                  border: active ? `1px solid ${C.amber}50` : `1px solid ${C.border}`,
                  opacity: active ? 1 : 0.6,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    {active && <span style={{ fontSize:10, fontWeight:800, color:C.amber, background:C.amberBg, padding:"2px 8px", borderRadius:6 }}>Condição identificada ✓</span>}
                    <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{condition.label}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7, marginBottom:8 }}>{condition.goldStandard}</div>
                  {condition.escalas && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {condition.escalas.map(s => (
                        <span key={s} style={{ fontSize:10, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"2px 8px" }}>{s}</span>
                      ))}
                    </div>
                  )}
                  {condition.referencias?.map((ref, i) => (
                    <div key={i} style={{ marginTop:6, fontSize:10, color:C.blue }}>
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ color:C.blue }}>{ref.id} — {ref.title}</a>
                    </div>
                  ))}
                </div>
              );
            })}
          </Section>
        )}
      </div>
    </div>
  );
}
