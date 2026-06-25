import { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import { calcBioimpedancia } from "../data/physicalAssessment";

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
const primaryBtn = (e={}) => ({ background:C.purple, color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const ghostBtn = (e={}) => ({ background:"transparent", color:C.purple, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const iconBtn = (active=false, activeColor=C.purple, e={}) => ({ background:active ? `${activeColor}18` : C.surface, border:`1px solid ${active ? activeColor+"50" : C.border}`, color:active ? activeColor : C.textMuted, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:active ? 700 : 400, cursor:"pointer", fontFamily:F, transition:"all 0.12s", ...e });

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
        return <button key={v} onClick={() => onChange(active ? "" : v)} style={iconBtn(active, activeColor || C.purple)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
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
        return <button key={v} onClick={() => toggle(v)} style={iconBtn(active, activeColor || C.purple)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
      })}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={card()}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.purple, flex:1 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── SAVE / LOAD HELPERS ──────────────────────────────────────────────────────
function saveTOData(studentId, data) {
  try {
    const key = `to_data_${studentId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* empty */ }
}
function loadTOData(studentId) {
  try {
    const key = `to_data_${studentId}`;
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}

// ── EVIDÊNCIAS TO ────────────────────────────────────────────────────────────
const TO_EVIDENCE = {
  avc: {
    label:"Acidente Vascular Cerebral",
    goldStandard:"Terapia orientada à tarefa repetitiva (200-600 reps/sessão) — Evidência A. Uso de CIMT (Constraint-Induced Movement Therapy) para membro superior. Treino de marcha com suporte parcial de peso. Acomodação ambiental e órteses para prevenção de deformidades.",
    escalas:["MIF (Medida de Independência Funcional)","Barthel Index","DASH","Berg Balance Scale","HAQ"],
    referencias:[{ id:"Cochrane CD008349", title:"CIMT after stroke (Cochrane 2021)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD008349/" }],
  },
  paralisia_cerebral: {
    label:"Paralisia Cerebral",
    goldStandard:"Abordagem centrada na família. Treino de AVDs com adaptações. Órteses para posicionamento e prevenção de deformidades. Tecnologia assistiva (CAA, switches). Mobilidade funcional (GMFCS como prognóstico). Evidência A para terapia orientada a metas.",
    escalas:["MIF","GMFCS (Gross Motor Function Classification System)","MACS (Manual Ability Classification System)","HAQ"],
  },
  demencia: {
    label:"Demência / Doença de Alzheimer",
    goldStandard:"Estimulação cognitiva (CST — Cognitive Stimulation Therapy) — Evidência A. Adaptação ambiental para redução de quedas. Treino de AVDs com pistas e rotinas. Abordagem centrada na pessoa. Terapia de orientação para realidade (ROT) em estágios iniciais.",
    escalas:["MEEM / Mini-Mental","MIF","Barthel Index","Lawton IADL","HAQ"],
    referencias:[{ id:"Cochrane CD005562", title:"Cognitive stimulation therapy for dementia (Cochrane 2023)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD005562/" }],
  },
  tea: {
    label:"Transtorno do Espectro Autista",
    goldStandard:"Integração sensorial (Ayres) — Evidência moderada. Estratégias visuais e TEACCH para rotinas. Intervenção precoce (modelo ESDM — Early Start Denver Model). Treino de habilidades sociais. Terapia ocupacional com foco em regulação sensorial e AVDs.",
    escalas:["MIF","MACS","PEDI (Pediatric Evaluation of Disability Inventory)"],
  },
  lesao_medular: {
    label:"Lesão Medular",
    goldStandard:"Reabilitação funcional intensiva. Treino de transferências e mobilidade funcional. Órteses e adaptações para AVDs. Tecnologia assistiva (cadeira de rodas, CAA). Estimulação elétrica funcional (FES) para membro superior em lesão C6-C7. Cuidados com integridade cutânea.",
    escalas:["MIF","HAQ","DASH","Barthel Index","SCIM (Spinal Cord Independence Measure)"],
    referencias:[{ id:"Cochrane CD006768", title:"FES for upper limb in SCI (Cochrane 2022)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006768/" }],
  },
  osteoartrite: {
    label:"Osteoartrite",
    goldStandard:"Treino de AVDs com conservação de energia. Órteses para descarga articular. Adaptações para higiene pessoal e vestuário. Exercício terapêutico supervisionado. Evitar órtese de repouso prolongado. Evidência A para exercício + educação.",
    escalas:["HAQ","DASH","WOMAC","AUSCAN","COPM"],
  },
};

// ── BARTHEL INDEX (embedded) ─────────────────────────────────────────────────
const BARTHEL_QUESTIONS = [
  { id:"alimentacao", label:"Alimentação", options:[{t:"Independente",s:10},{t:"Precisa de ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"banho", label:"Banho", options:[{t:"Independente",s:5},{t:"Dependente",s:0}] },
  { id:"vestir", label:"Vestuário", options:[{t:"Independente",s:10},{t:"Precisa de ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"higiene", label:"Higiene pessoal", options:[{t:"Independente",s:5},{t:"Dependente",s:0}] },
  { id:"uso_banheiro", label:"Uso do banheiro", options:[{t:"Independente",s:10},{t:"Precisa de ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"transferencia", label:"Transferência (cama/sofá)", options:[{t:"Independente",s:15},{t:"Mínima ajuda",s:10},{t:"Grande ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"deambulacao", label:"Deambulação", options:[{t:"Independente > 50m",s:15},{t:"Independente < 50m",s:10},{t:"Cadeira de rodas",s:5},{t:"Imóvel",s:0}] },
  { id:"escadas", label:"Escadas", options:[{t:"Independente",s:10},{t:"Precisa de ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"controle_bexiga", label:"Controle da bexiga", options:[{t:"Continente",s:10},{t:"Incontinência ocasional",s:5},{t:"Incontinente / Sonda",s:0}] },
  { id:"controle_intestino", label:"Controle do intestino", options:[{t:"Continente",s:10},{t:"Incontinência ocasional",s:5},{t:"Incontinente",s:0}] },
];

function calcBarthel(answers) {
  const total = BARTHEL_QUESTIONS.reduce((sum, q) => sum + (Number(answers[q.id]) || 0), 0);
  const level = total >= 100 ? "Independente" : total >= 91 ? "Leve dependência" : total >= 61 ? "Moderada dependência" : total >= 21 ? "Grave dependência" : "Total dependência";
  return { total, level, color: total >= 91 ? C.green : total >= 61 ? C.amber : C.red };
}

// ── LAWTON IADL (embedded) ──────────────────────────────────────────────────
const LAWTON_QUESTIONS = [
  { id:"telefone", label:"Usar telefone", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"compras", label:"Fazer compras", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"alimentos", label:"Preparar alimentos", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"casa", label:"Cuidados domésticos", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"lavanderia", label:"Lavar roupa", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"transporte", label:"Meio de transporte", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"medicamentos", label:"Responsabilidade medicamentos", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"financas", label:"Lidar com finanças", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
];

function calcLawton(answers) {
  const total = LAWTON_QUESTIONS.reduce((sum, q) => sum + (Number(answers[q.id]) || 0), 0);
  const level = total === 24 ? "Independente" : total >= 16 ? "Dependência leve/moderada" : "Dependência grave";
  return { total, level, max: 24, color: total === 24 ? C.green : total >= 16 ? C.amber : C.red };
}

// ── COPM-STYLE GOALS ────────────────────────────────────────────────────────
function SectionRow({ label, value, onChange, placeholder, type }) {
  return (
    <div>
      <span style={lbl()}>{label}</span>
      {type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} style={{ ...inp({ resize:"vertical", lineHeight:1.5 }), fontSize:12 }} />
      ) : type === "select" ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={sel()}>
          {(placeholder ? [""] : []).concat(placeholder ? [{value:"",label:placeholder}].concat(placeholder) : []).length === 0 && placeholder ? "" : null}
        </select>
      ) : (
        <input type={type || "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inp()} />
      )}
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function OccupationalTherapy({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");

  // Anamnese
  const [diagnosticoMedico, setDiagnosticoMedico] = useState("");
  const [queixaTO, setQueixaTO] = useState("");
  const [ocupacao, setOcupacao] = useState("");
  const [rotina, setRotina] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [acompanhante, setAcompanhante] = useState("");
  const [tecnologiaAssistiva, setTecnologiaAssistiva] = useState([]);
  const [adaptacoes, setAdaptacoes] = useState([]);
  const [condicoesAssociadas, setCondicoesAssociadas] = useState([]);

  // Domínios de desempenho
  const [avds, setAvds] = useState([]);
  const [aivds, setAivds] = useState([]);
  const [lazer, setLazer] = useState([]);
  const [trabalhoProd, setTrabalhoProd] = useState([]);

  // COPM-style goals
  const [copmGoals, setCopmGoals] = useState([]);

  // Barthel
  const [barthelAnswers, setBarthelAnswers] = useState({});
  const [barthelResult, setBarthelResult] = useState(null);

  // Lawton
  const [lawtonAnswers, setLawtonAnswers] = useState({});
  const [lawtonResult, setLawtonResult] = useState(null);

  // Função manual
  const [forcaPinça, setForcaPinça] = useState({ D:"", E:"" });
  const [forcaPreensao, setForcaPreensao] = useState({ D:"", E:"" });
  const [jebsenTime, setJebsenTime] = useState({ D:"", E:"" });
  const [manipulacaoFina, setManipulacaoFina] = useState([]);

  // Sensorial
  const [sensibilidade, setSensibilidade] = useState([]);
  const [estereognosia, setEstereognosia] = useState("");

  // Cognitivo
  const [miniMental, setMiniMental] = useState("");
  const [memoria, setMemoria] = useState([]);
  const [atencao, setAtencao] = useState([]);
  const [funcaoExecutiva, setFuncaoExecutiva] = useState([]);

  // Ambiental
  const [barreiras, setBarreiras] = useState([]);
  const [riscoQueda, setRiscoQueda] = useState("");

  // Evolução
  const [evolucao, setEvolucao] = useState("");
  const [metas, setMetas] = useState("");

  // BIA
  const [biaResistencia, setBiaResistencia] = useState("");
  const [biaReactancia, setBiaReactancia] = useState("");
  const [pesoBia, setPesoBia] = useState(student?.peso || "");
  const [alturaBia, setAlturaBia] = useState(student?.altura || "");
  const [biaResult, setBiaResult] = useState(null);

  const sid = student?.id || student?.nome;
  const enhancer = useEnhancer("terapia_ocupacional", sid, `to_enhancer_${sid}`);
  const toColors = { ...C, accent: C.purple, font: F };

  useEffect(() => {
    if (student?.id || student?.nome) {
      const sid = student.id || student.nome;
      const saved = loadTOData(sid);
      if (saved) {
        setDiagnosticoMedico(saved.diagnosticoMedico || "");
        setQueixaTO(saved.queixaTO || "");
        setOcupacao(saved.ocupacao || "");
        setRotina(saved.rotina || "");
        setDomicilio(saved.domicilio || "");
        setAcompanhante(saved.acompanhante || "");
        setTecnologiaAssistiva(saved.tecnologiaAssistiva || []);
        setAdaptacoes(saved.adaptacoes || []);
        setCondicoesAssociadas(saved.condicoesAssociadas || []);
        setAvds(saved.avds || []);
        setAivds(saved.aivds || []);
        setLazer(saved.lazer || []);
        setTrabalhoProd(saved.trabalhoProd || []);
        setCopmGoals(saved.copmGoals || []);
        setBarthelAnswers(saved.barthelAnswers || {});
        setBarthelResult(saved.barthelResult || null);
        setLawtonAnswers(saved.lawtonAnswers || {});
        setLawtonResult(saved.lawtonResult || null);
        setForcaPinça(saved.forcaPinça || { D:"", E:"" });
        setForcaPreensao(saved.forcaPreensao || { D:"", E:"" });
        setJebsenTime(saved.jebsenTime || { D:"", E:"" });
        setManipulacaoFina(saved.manipulacaoFina || []);
        setSensibilidade(saved.sensibilidade || []);
        setEstereognosia(saved.estereognosia || "");
        setMiniMental(saved.miniMental || "");
        setMemoria(saved.memoria || []);
        setAtencao(saved.atencao || []);
        setFuncaoExecutiva(saved.funcaoExecutiva || []);
        setBarreiras(saved.barreiras || []);
        setRiscoQueda(saved.riscoQueda || "");
        setEvolucao(saved.evolucao || "");
        setMetas(saved.metas || "");
        if (saved.pain) enhancer.setPain(saved.pain);
        if (saved.logs) enhancer.setLogs(saved.logs);
        if (saved.redFlags) enhancer.setRedFlags(saved.redFlags);
        if (saved.aiRes) enhancer.setAiRes(saved.aiRes);
      }
    }
  }, [student?.id, student?.nome]);

  // Auto BIA
  useEffect(() => {
    const r = parseFloat(biaResistencia), xc = parseFloat(biaReactancia);
    const p = parseFloat(pesoBia), alt = parseFloat(alturaBia);
    if (!r || !xc || !p || !alt || !student?.sexo) { setBiaResult(null); return; }
    setBiaResult(calcBioimpedancia(r, xc, student.sexo, null, p, alt));
  }, [biaResistencia, biaReactancia, pesoBia, alturaBia, student?.sexo]);

  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    const sid = student.id || student.nome;
    saveTOData(sid, {
      diagnosticoMedico, queixaTO, ocupacao, rotina, domicilio, acompanhante,
      tecnologiaAssistiva, adaptacoes, condicoesAssociadas, avds, aivds, lazer, trabalhoProd,
      copmGoals, barthelAnswers, barthelResult, lawtonAnswers, lawtonResult,
      forcaPinça, forcaPreensao, jebsenTime, manipulacaoFina,
      sensibilidade, estereognosia, miniMental, memoria, atencao, funcaoExecutiva,
      barreiras, riscoQueda, evolucao, metas,
      pain: enhancer.pain, logs: enhancer.logs, redFlags: enhancer.redFlags, aiRes: enhancer.aiRes,
      data: new Date().toISOString().slice(0,10),
    });
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"0.05em" }}>🤲 Terapia Ocupacional</span>
          <button onClick={() => { localStorage.removeItem("sasyra_module"); window.location.reload(); }} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um paciente para iniciar o atendimento</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Pacientes {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Novo Paciente"}
          </button>
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.purple}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.purple, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
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
                <div style={{ width:40, height:40, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:C.purple, flexShrink:0 }}>
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
                <span style={{ color:C.purple, fontSize:16 }}>→</span>
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

      {/* Delete modals */}
      {deleteTarget && deleteStep === 1 && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.red}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.red, marginBottom:8 }}>Excluir paciente</div>
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
              Todos os dados de avaliação de <strong>{deleteTarget.nome}</strong> serão perdidos permanentemente. Esta operação <strong style={{color:C.red}}>não pode ser desfeita</strong>.
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

      {/* Edit modal */}
      {editTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => setEditTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.purple}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.purple, marginBottom:8 }}>Editar dados do paciente</div>
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
                style={{ background:C.purple, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
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
          <button onClick={() => setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })}>← Pacientes</button>
          <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>🤲 Terapia Ocupacional</span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Avaliação"],["biometria","🔬","Biometria"],["sessoes","📅","Sessões"],["relatorio","📊","Relatório"],["evolucao","📈","Evolução"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.purpleBg : "transparent",
              border: `1px solid ${tab === k ? C.purple + "50" : "transparent"}`,
              borderRadius: 8, padding: "7px 14px", fontSize: 12,
              fontWeight: tab === k ? 700 : 400,
              color: tab === k ? C.purple : C.textMuted, cursor: "pointer", fontFamily: F,
            }}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {student?.nome && (
            <>
              <div style={{ width:30, height:30, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.purple }}>
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
            <Section title="Perfil Ocupacional e Anamnese" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados do perfil ocupacional, diagnóstico médico e demandas funcionais do paciente.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <SectionRow label="Diagnóstico médico / Condição principal" value={diagnosticoMedico} onChange={setDiagnosticoMedico} placeholder="Ex: AVC isquêmico hemisfério E, LESÃO MEDULAR T10" />
                <SectionRow label="Ocupação / Papéis ocupacionais" value={ocupacao} onChange={setOcupacao} placeholder="Ex: Estudante, trabalhador, cuidador, aposentado" />
              </div>
              <div style={{ marginTop:12 }}>
                <SectionRow label="Queixa principal / Demanda do paciente" value={queixaTO} onChange={setQueixaTO} placeholder="Ex: Dificuldade para vestir-se, tomar banho e alimentar-se com independência" type="textarea" />
              </div>
              <div style={{ marginTop:12 }}>
                <SectionRow label="Rotina diária" value={rotina} onChange={setRotina} placeholder="Descreva a rotina típica do paciente (horários, atividades, suporte necessário)" type="textarea" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <SectionRow label="Tipo de domicílio" value={domicilio} onChange={setDomicilio} placeholder="Casa, apartamento, escadas, adaptado?" />
                <SectionRow label="Acompanhante / Cuidador" value={acompanhante} onChange={setAcompanhante} placeholder="Ex: Mãe, esposa, cuidador 24h, sem cuidador" />
              </div>
            </Section>

            <Section title="Domínios de Desempenho Ocupacional" icon="🎯">
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>AVDs (Atividades de Vida Diária) comprometidas</span>
                <TagSelect options={["Banho","Vestuário","Alimentação","Higiene íntima","Transferências","Mobilidade na cama","Deambulação","Uso do banheiro"]}
                  value={avds} onChange={setAvds} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>AIVDs (Atividades Instrumentais) comprometidas</span>
                <TagSelect options={["Preparar refeições","Lavar roupa","Limpeza doméstica","Compras","Uso de transporte","Gestão de finanças","Uso de telefone","Gestão de medicamentos"]}
                  value={aivds} onChange={setAivds} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Lazer e participação social comprometidos</span>
                <TagSelect options={["Hobbies / Passatempos","Esportes","Atividades religiosas","Eventos sociais","Visitas a amigos/família","Atividades ao ar livre"]}
                  value={lazer} onChange={setLazer} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Trabalho / Produtividade comprometidos</span>
                <TagSelect options={["Trabalho formal","Trabalho informal","Estudos","Voluntariado","Atividades domésticas","Cuidado de dependentes"]}
                  value={trabalhoProd} onChange={setTrabalhoProd} activeColor={C.purple} />
              </div>
            </Section>

            <Section title="Metas Funcionais (COPM)" icon="🎯">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Defina até 5 metas funcionais priorizadas pelo paciente. Cada meta deve ser específica, mensurável e centrada no paciente.
              </div>
              {copmGoals.map((g, i) => (
                <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px" }}>
                  <span style={{ fontSize:10, fontWeight:800, color:C.textDim, minWidth:20 }}>{i+1}.</span>
                  <div style={{ flex:1 }}>
                    <input type="text" value={g.desc} onChange={e => {
                      const next = [...copmGoals]; next[i] = { ...next[i], desc: e.target.value }; setCopmGoals(next);
                    }} style={{ ...inp({ padding:"6px 10px", fontSize:12 }), marginBottom:4 }} placeholder="Descrição da meta..." />
                    <div style={{ display:"flex", gap:8 }}>
                      <div style={{ flex:1 }}><span style={{ fontSize:9, color:C.textDim }}>Desempenho (1-10)</span>
                        <input type="number" min="1" max="10" value={g.desempenho || ""} onChange={e => {
                          const next = [...copmGoals]; next[i] = { ...next[i], desempenho: e.target.value }; setCopmGoals(next);
                        }} style={{ ...inp({ padding:"4px 8px", fontSize:11 }), textAlign:"center" }} />
                      </div>
                      <div style={{ flex:1 }}><span style={{ fontSize:9, color:C.textDim }}>Satisfação (1-10)</span>
                        <input type="number" min="1" max="10" value={g.satisfacao || ""} onChange={e => {
                          const next = [...copmGoals]; next[i] = { ...next[i], satisfacao: e.target.value }; setCopmGoals(next);
                        }} style={{ ...inp({ padding:"4px 8px", fontSize:11 }), textAlign:"center" }} />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setCopmGoals(copmGoals.filter((_, j) => j !== i))}
                    style={{ background:"none", border:"none", color:C.red, fontSize:16, cursor:"pointer", padding:"0 4px" }}>×</button>
                </div>
              ))}
              {copmGoals.length < 5 && (
                <button onClick={() => setCopmGoals([...copmGoals, { desc:"", desempenho:"", satisfacao:"" }])}
                  style={{ background:"transparent", border:`1px dashed ${C.border}`, borderRadius:8, padding:"8px 12px", fontSize:12, color:C.textMuted, cursor:"pointer", width:"100%", fontFamily:F }}>
                  + Adicionar meta
                </button>
              )}
              {copmGoals.length > 0 && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.purple, marginBottom:4 }}>COPM — Média de desempenho: {copmGoals.filter(g=>g.desempenho).length > 0 ? (copmGoals.filter(g=>g.desempenho).reduce((a,g)=>a+Number(g.desempenho),0)/copmGoals.filter(g=>g.desempenho).length).toFixed(1) : "—"} | Satisfação: {copmGoals.filter(g=>g.satisfacao).length > 0 ? (copmGoals.filter(g=>g.satisfacao).reduce((a,g)=>a+Number(g.satisfacao),0)/copmGoals.filter(g=>g.satisfacao).length).toFixed(1) : "—"}</div>
                </div>
              )}
            </Section>

            <Section title="Escalas Funcionais" icon="📊">
              <Accordion title="Índice de Barthel (AVDs)" icon="🛁" defaultOpen>
                <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                  Avalia o nível de independência funcional nas AVDs básicas. Quanto maior a pontuação, maior a independência.
                </div>
                {BARTHEL_QUESTIONS.map(q => (
                  <div key={q.id} style={{ marginBottom:8 }}>
                    <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                    <SingleSelect options={q.options.map(o => ({ value:String(o.s), label:o.t }))} value={barthelAnswers[q.id] || ""} onChange={v => {
                      const next = { ...barthelAnswers, [q.id]: v };
                      setBarthelAnswers(next);
                      setBarthelResult(calcBarthel(next));
                    }} activeColor={C.purple} />
                  </div>
                ))}
                {barthelResult && (
                  <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Índice de Barthel</div>
                    <div style={{ fontSize:32, fontWeight:900, color:barthelResult.color }}>{barthelResult.total}/100</div>
                    <div style={{ fontSize:14, fontWeight:700, color:barthelResult.color, marginTop:4 }}>{barthelResult.level}</div>
                  </div>
                )}
              </Accordion>

              <Accordion title="Escala Lawton & Brody (AIVDs)" icon="🏠">
                <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                  Avalia a capacidade para realizar atividades instrumentais de vida diária. Pontuação máxima 24 (independente).
                </div>
                {LAWTON_QUESTIONS.map(q => (
                  <div key={q.id} style={{ marginBottom:8 }}>
                    <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                    <SingleSelect options={q.options.map(o => ({ value:String(o.s), label:o.t }))} value={lawtonAnswers[q.id] || ""} onChange={v => {
                      const next = { ...lawtonAnswers, [q.id]: v };
                      setLawtonAnswers(next);
                      setLawtonResult(calcLawton(next));
                    }} activeColor={C.purple} />
                  </div>
                ))}
                {lawtonResult && (
                  <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Lawton & Brody</div>
                    <div style={{ fontSize:32, fontWeight:900, color:lawtonResult.color }}>{lawtonResult.total}/{lawtonResult.max}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:lawtonResult.color, marginTop:4 }}>{lawtonResult.level}</div>
                  </div>
                )}
              </Accordion>
            </Section>

            <Section title="Função Manual e Sensorial" icon="🤚">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <NumericField label="Força de preensão palmar D (kgf)" value={forcaPreensao.D} onChange={v => setForcaPreensao(p=>({...p,D:v}))} unit="kgf" min={0} max={80} step={0.5} />
                <NumericField label="Força de preensão palmar E (kgf)" value={forcaPreensao.E} onChange={v => setForcaPreensao(p=>({...p,E:v}))} unit="kgf" min={0} max={80} step={0.5} />
                <NumericField label="Força de pinça polpa-polegar D (kgf)" value={forcaPinça.D} onChange={v => setForcaPinça(p=>({...p,D:v}))} unit="kgf" min={0} max={20} step={0.1} />
                <NumericField label="Força de pinça polpa-polegar E (kgf)" value={forcaPinça.E} onChange={v => setForcaPinça(p=>({...p,E:v}))} unit="kgf" min={0} max={20} step={0.1} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Sensibilidade / Estereognosia</span>
                <TagSelect options={["Tátil normal","Hipoestesia","Hiperestesia","Alodinia","Estereognosia preservada","Estereognosia prejudicada","Ausência de sensibilidade"]}
                  value={sensibilidade} onChange={v => setSensibilidade(v)} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Manipulação fina comprometida</span>
                <TagSelect options={["Abrir/fechar botões","Amarrar cadarços","Escrever","Usar talheres","Pegar moedas","Enfiar agulha","Usar chave","Recortar"]}
                  value={manipulacaoFina} onChange={setManipulacaoFina} activeColor={C.purple} />
              </div>
            </Section>

            <Section title="Avaliação Cognitiva" icon="🧠">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <SectionRow label="MEEM / Mini-Mental (0-30)" value={miniMental} onChange={setMiniMental} placeholder="Ex: 24" />
              </div>
              {miniMental && (
                <div style={{ marginBottom:14, background: Number(miniMental) >= 24 ? C.greenBg : Number(miniMental) >= 18 ? C.amberBg : C.redBg, border:`1px solid ${Number(miniMental) >= 24 ? C.green : Number(miniMental) >= 18 ? C.amber : C.red}40`, borderRadius:8, padding:"8px 12px" }}>
                  <span style={{ fontSize:12, fontWeight:700, color: Number(miniMental) >= 24 ? C.green : Number(miniMental) >= 18 ? C.amber : C.red }}>
                    {Number(miniMental) >= 24 ? "🟢 Normal (≥24)" : Number(miniMental) >= 18 ? "🟡 Leve comprometimento (18-23)" : "🔴 Comprometimento significativo (<18)"}
                  </span>
                </div>
              )}
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Domínios cognitivos comprometidos</span>
                <TagSelect options={["Memória recente","Memória remota","Atenção sustentada","Atenção seletiva","Função executiva","Linguagem","Orientação","Praxia","Gnosia"]}
                  value={[...memoria, ...atencao, ...funcaoExecutiva]} onChange={v => {
                    setMemoria(v.filter(x => ["Memória recente","Memória remota"].includes(x)));
                    setAtencao(v.filter(x => ["Atenção sustentada","Atenção seletiva","Orientação"].includes(x)));
                    setFuncaoExecutiva(v.filter(x => ["Função executiva","Linguagem","Praxia","Gnosia"].includes(x)));
                  }} activeColor={C.purple} />
              </div>
            </Section>

            <Section title="Fatores Ambientais" icon="🏡">
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Barreiras ambientais identificadas</span>
                <TagSelect options={["Degraus / escadas sem corrimão","Banheiro sem adaptação","Portas estreitas","Tapetes soltos","Iluminação inadequada","Móveis inadequados","Acesso externo difícil","Piso escorregadio"]}
                  value={barreiras} onChange={setBarreiras} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Risco de quedas</span>
                <SingleSelect options={["Baixo","Moderado","Alto","Muito alto"]} value={riscoQueda} onChange={setRiscoQueda} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Tecnologia assistiva / Adaptações em uso</span>
                <TagSelect options={["Cadeira de rodas","Andador","Bengala","Muleta","Órtese de MMSS","Órtese de MMII","Prótese","Comunicação alternativa","Adaptação para banho","Adaptação para alimentação"]}
                  value={tecnologiaAssistiva} onChange={setTecnologiaAssistiva} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Adaptações necessárias</span>
                <TagSelect options={["Barra de apoio","Assento sanitário elevado","Cadeira de banho","Rampa","Alargador de porta","Cama hospitalar","Cadeira para box","Tapete antiderrapante"]}
                  value={adaptacoes} onChange={setAdaptacoes} activeColor={C.purple} />
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
            </div>
          </>
        )}

        {tab === "biometria" && (
          <>
            <Section title="Bioimpedância (BIA)" icon="⚡">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:12, lineHeight:1.5 }}>
                Valores obtidos do aparelho de bioimpedância para avaliação da composição corporal.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <NumericField label="Peso (kg)" value={pesoBia} onChange={setPesoBia} unit="kg" min={20} max={300} step={0.1} />
                <NumericField label="Altura (cm)" value={alturaBia} onChange={setAlturaBia} unit="cm" min={50} max={250} step={0.5} />
                <NumericField label="Resistência (R)" value={biaResistencia} onChange={setBiaResistencia} unit="Ω" min={200} max={900} step={1} />
                <NumericField label="Reactância (Xc)" value={biaReactancia} onChange={setBiaReactancia} unit="Ω" min={10} max={200} step={1} />
              </div>
              {biaResult && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>% Gordura</div>
                      <div style={{ fontSize:24, fontWeight:900, color:C.purple }}>{biaResult.percentualGordura}<span style={{ fontSize:12, color:C.textMuted }}>%</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>M. Magra</div>
                      <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{biaResult.massaMagra} <span style={{ fontSize:10, color:C.textMuted }}>kg</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Ângulo de Fase</div>
                      <div style={{ fontSize:16, fontWeight:700, color:C.amber }}>{biaResult.anguloFase}°</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Água Total</div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.blue }}>{biaResult.aguaTotal} <span style={{ fontSize:10, color:C.textMuted }}>L</span></div>
                    </div>
                  </div>
                </div>
              )}
            </Section>
          </>
        )}

        {tab === "sessoes" && (
          <>
            <PainSection pain={enhancer.pain} setPain={enhancer.setPain} colors={toColors} />
            <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
              flags={["Dor súbita + perda de função","Parestesia progressiva","Ferida/úlcera com sinais de infecção","Queda recente + fratura suspeita","Disfagia + tosse/engasgo","Agitação psicomotora grave","Ideação suicida relatada","Alucinações visuais/auditivas recentes"]}
              colors={toColors} />
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={toColors} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nDiagnóstico: ${diagnosticoMedico}\nQueixa: ${queixaTO}\nOcupação: ${ocupacao}\nAVDs: ${avds.join(", ")}\nAIVDs: ${aivds.join(", ")}\nTecnologia assistiva: ${tecnologiaAssistiva.join(", ")}\nBarreiras: ${barreiras.join(", ")}\nEVA Mov: ${enhancer.pain.evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep}/10\nDor local: ${enhancer.pain.localDor.join(", ")}\nEvolução: ${evolucao}`}
              colors={toColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="Terapia Ocupacional" colors={toColors} />
        )}

        {tab === "evidencias" && (
          <Section title="Diretrizes e Evidências em Terapia Ocupacional" icon="🔬">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Baseado nas condições identificadas, as diretrizes abaixo representam as recomendações de prática clínica baseada em evidências.
            </div>
            {Object.entries(TO_EVIDENCE).map(([key, condition]) => {
              const active = diagnosticoMedico.toLowerCase().includes(key.replace(/_/g," ")) || queixaTO.toLowerCase().includes(key.replace(/_/g," "));
              return (
                <div key={key} style={{
                  ...card(),
                  border: active ? `1px solid ${C.purple}50` : `1px solid ${C.border}`,
                  opacity: active ? 1 : 0.6,
                  cursor:"pointer"
                }} onClick={() => {
                  if (!active) setQueixaTO(prev => prev + " " + condition.label);
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    {active && <span style={{ fontSize:10, fontWeight:800, color:C.purple, background:C.purpleBg, padding:"2px 8px", borderRadius:6 }}>Condição identificada ✓</span>}
                    <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{condition.label}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7, marginBottom:8 }}>{condition.goldStandard}</div>
                  {condition.escalas && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {condition.escalas.map(s => (
                        <span key={s} style={{ fontSize:10, color:C.purple, background:C.purpleBg, border:`1px solid ${C.purple}30`, borderRadius:6, padding:"2px 8px" }}>{s}</span>
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

        {tab === "evolucao" && (
          <Section title="Evolução e Reavaliação" icon="📈">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Registre a evolução do paciente, reavaliação das metas funcionais e planejamento das próximas sessões.
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucao} onChange={e => setEvolucao(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução desde a última sessão, resposta às intervenções, mudanças no desempenho ocupacional..." />
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Metas para próximas sessões</span>
              <textarea value={metas} onChange={e => setMetas(e.target.value)} rows={3}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Plano de tratamento, adaptações a serem implementadas, orientações para o paciente/cuidador..." />
            </div>

            {copmGoals.filter(g => g.desc).length > 0 && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.purple, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Reavaliação das Metas COPM</div>
                {copmGoals.filter(g => g.desc).map((g, i) => (
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, fontSize:12 }}>
                    <span style={{ color:C.textDim, fontWeight:700 }}>{i+1}.</span>
                    <span style={{ flex:1, color:C.text }}>{g.desc}</span>
                    <span style={{ color:C.purple, fontWeight:700 }}>D: {g.desempenho || "—"}</span>
                    <span style={{ color:C.green, fontWeight:700 }}>S: {g.satisfacao || "—"}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Evolução</button>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
