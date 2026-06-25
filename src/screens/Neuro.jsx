import { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";

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

function saveNeuroData(studentId, data) {
  try { localStorage.setItem(`neuro_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadNeuroData(studentId) {
  try { const d = localStorage.getItem(`neuro_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

function calcMAS(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total === 0 ? "Sem espasticidade" : total <= 6 ? "Espasticidade leve" : total <= 12 ? "Espasticidade moderada" : "Espasticidade grave";
  const color = total === 0 ? C.green : total <= 6 ? C.amber : total <= 12 ? C.purple : C.red;
  return { total, level, color };
}

function calcBBS(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total >= 16 ? "Baixo risco de queda" : total >= 10 ? "Médio risco de queda" : "Alto risco de queda";
  const color = total >= 16 ? C.green : total >= 10 ? C.amber : C.red;
  return { total, level, color };
}

function calcMIF(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total >= 36 ? "Independência modificada" : total >= 24 ? "Dependência moderada" : total >= 12 ? "Dependência grave" : "Dependência total";
  const color = total >= 36 ? C.green : total >= 24 ? C.amber : C.red;
  return { total, level, max: 42, color };
}

const MAS_QUESTIONS = [
  { id:"flexoresCotoveloD", label:"Flexores de cotovelo D", lado:"D" },
  { id:"flexoresCotoveloE", label:"Flexores de cotovelo E", lado:"E" },
  { id:"extensoresJoelhoD", label:"Extensores de joelho D", lado:"D" },
  { id:"extensoresJoelhoE", label:"Extensores de joelho E", lado:"E" },
  { id:"flexoresPlantaresD", label:"Flexores plantares D", lado:"D" },
  { id:"flexoresPlantaresE", label:"Flexores plantares E", lado:"E" },
];

const BBS_QUESTIONS = [
  { id:"sentaPe", label:"Sentado para em pé (0-4)" },
  { id:"peSemApoio", label:"Em pé sem apoio (0-4)" },
  { id:"transferencias", label:"Transferências (0-4)" },
  { id:"alcanceFrente", label:"Alcance à frente com braço estendido (0-4)" },
  { id:"apoioUnipodal", label:"Apoio unipodal (0-4)" },
];

const MIF_QUESTIONS = [
  { id:"alimentacao", label:"Alimentação (0-7)" },
  { id:"higiene", label:"Higiene pessoal (0-7)" },
  { id:"banho", label:"Banho (0-7)" },
  { id:"vestirSuperior", label:"Vestir-se superior (0-7)" },
  { id:"vestirInferior", label:"Vestir-se inferior (0-7)" },
  { id:"usoBanheiro", label:"Uso do banheiro (0-7)" },
];

const MAS_OPTIONS = [
  { value:"0", label:"0 - Sem aumento de tônus" },
  { value:"1", label:"1 - Leve aumento, liberação ao final da ADM" },
  { value:"2", label:"2 - Aumento moderado durante toda a ADM" },
  { value:"3", label:"3 - Aumento acentuado, movimento difícil" },
  { value:"4", label:"4 - Rigidez em flexão/extensão" },
];

const BBS_OPTIONS = [
  { value:"0", label:"0 - Incapaz" },
  { value:"1", label:"1 - Precisa de ajuda" },
  { value:"2", label:"2 - Com supervisão" },
  { value:"3", label:"3 - Com leve dificuldade" },
  { value:"4", label:"4 - Independente" },
];

const NEURO_EVIDENCE = {
  avc_isquemico: {
    label:"Acidente Vascular Cerebral / Hemiparesia",
    goldStandard:"Marcha com suporte parcial de peso corporal: Evidência A. CIMT (Constraint-Induced Movement Therapy) para membro superior: 200-600 reps/sessão. FES (eletroestimulação funcional) para drop foot. Facilitação neuromuscular proprioceptiva (PNF) para controle motor. Treino orientado a tarefa repetitiva. Reabilitação intensiva precoce (< 48h) melhora desfecho funcional (AVERT Trial 2015, Lancet). Evitar imobilização e compensações precoces.",
    escalas:["MIF","NIHSS","Berg Balance Scale","MAS (Ashworth)","Fugl-Meyer","Barthel Index","HAQ"],
    referencias:[{ id:"Cochrane CD006768", title:"FES for upper limb in stroke (Cochrane 2022)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006768/" }],
  },
  lesao_medular: {
    label:"Lesão Medular",
    goldStandard:"Treino de transferências e mobilidade funcional. Fortalecimento de MMSS (importante para cadeira de rodas). FES para membro superior em lesão C6-C7. Treino de marcha com suporte parcial se lesão incompleta. Cuidados com integridade cutânea e prevenção de úlceras por pressão. Reabilitação respiratória se nível alto (C1-C4). Órteses para punho e mão para ganho funcional. AVDs adaptadas: tecnologia assistiva essencial (Cochrane 2021 - Evidência A).",
    escalas:["MIF","SCIM (Spinal Cord Independence Measure)","HAQ","Barthel Index","DASH","Berg Balance Scale"],
    referencias:[{ id:"Cochrane CD006768", title:"FES for upper limb in SCI (Cochrane 2022)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006768/" }],
  },
  parkinson: {
    label:"Doença de Parkinson",
    goldStandard:"LSVT BIG (Lee Silverman Voice Treatment) — treino de amplitude de movimento, Evidência A. Treino de marcha com pistas rítmicas (auditivas/visuais). Exercício aeróbio (caminhada, bicicleta) para condicionamento. Dupla tarefa para prevenção de quedas. Alongamento global para rigidez. Treino de equilíbrio e coordenação. Atividade física regular retarda progressão de sintomas motores (BJSM 2022 - Evidência A).",
    escalas:["UPDRS (Unified Parkinson Disease Rating Scale)","Berg Balance Scale","Timed Up and Go (TUG)","HAQ"],
    referencias:[{ id:"BJSM 2022", title:"LSVT BIG for Parkinson's", url:"https://pubmed.ncbi.nlm.nih.gov/" }],
  },
  esclerose_multipla: {
    label:"Esclerose Múltipla",
    goldStandard:"Exercício aeróbio de intensidade moderada (caminhada, bicicleta ergométrica, hidroterapia). Fortalecimento progressivo de MMII para melhora de marcha. Alongamento global para espasticidade. Treino de equilíbrio e propriocepção. Estratégias de conservação de energia para fadiga. Evitar exercício em ambiente muito quente (fadiga por calor). Exercício é seguro e melhora qualidade de vida (Cochrane 2021 - Evidência A).",
    escalas:["EDSS (Expanded Disability Status Scale)","MSFC (Multiple Sclerosis Functional Composite)","Berg Balance Scale","HAQ"],
  },
  tce: {
    label:"Traumatismo Cranioencefálico",
    goldStandard:"Reabilitação vestibular para tontura e desequilíbrio. Treino de equilíbrio e marcha. Integração sensorial para déficits de processamento. Terapia cognitiva para atenção, memória e função executiva. Treino de AVDs com adaptações. Abordagem multidisciplinar com TO, fonoaudiologia e neuropsicologia. Estimulação precoce na fase aguda. Programa de reabilitação intensiva (Brain Injury Medicine 2022 - Evidência A).",
    escalas:["MIF","Berg Balance Scale","DASH","HAQ","Rancho Los Amigos (RLA)","Glasgow Outcome Scale"],
  },
  elau: {
    label:"Esclerose Lateral Amiotrófica",
    goldStandard:"Alongamento passivo diário para prevenção de contraturas. Posicionamento adequado em cadeira de rodas e leito. Suporte ventilatório não invasivo (VNI) quando necessário. Órteses para queda de pé e punho. Comunicação aumentativa e alternativa (CAA) precoce. Abordagem paliativa centrada no paciente. Nutrição enteral quando disfagia significativa. Exercício aeróbio leve para manutenção de condicionamento (Cochrane 2022 - Evidência B).",
    escalas:["ALSFRS-R (ALS Functional Rating Scale)","MIF","Força muscular (MRC)","Capacidade vital forçada (CVF)"],
  },
  ataxia: {
    label:"Ataxia / Disfunção Cerebelar",
    goldStandard:"Exercícios de Frenkel (coordenação em decúbito, sentado, em pé). Fortalecimento proximal para estabilização. Treino de marcha com base alargada. Pistas visuais para melhora de coordenação. Exercícios de equilíbrio em superfícies instáveis. Pesos nos tornozelos pode reduzir tremor intencional. Treino funcional de AVDs com adaptações (Cochrane 2021 - Evidência B).",
    escalas:["SARA (Scale for Assessment and Rating of Ataxia)","Berg Balance Scale","Timed Up and Go (TUG)","HAQ"],
  },
};

export default function Neuro({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");

  const [diagnosticoMedico, setDiagnosticoMedico] = useState("");
  const [tempoLesao, setTempoLesao] = useState("");
  const [mecanismoLesao, setMecanismoLesao] = useState("");
  const [ladoAfetado, setLadoAfetado] = useState("");
  const [historicoNeuro, setHistoricoNeuro] = useState("");
  const [medicacoes, setMedicacoes] = useState("");
  const [comorbidadesNeuro, setComorbidadesNeuro] = useState([]);
  const [sintomas, setSintomas] = useState([]);
  const [avdsNeuro, setAvdsNeuro] = useState([]);

  const [masScores, setMasScores] = useState({});
  const [masResult, setMasResult] = useState(null);
  const [bbsScores, setBbsScores] = useState({});
  const [bbsResult, setBbsResult] = useState(null);
  const [mifScores, setMifScores] = useState({});
  const [mifResult, setMifResult] = useState(null);

  const [tono, setTono] = useState("");
  const [forcaNeuro, setForcaNeuro] = useState({ deltoideD:"", deltoideE:"", bicepsD:"", bicepsE:"", extensorPunhoD:"", extensorPunhoE:"", flexorQuadrilD:"", flexorQuadrilE:"", quadricepsD:"", quadricepsE:"", tibialAnteriorD:"", tibialAnteriorE:"" });
  const [sensibilidade, setSensibilidade] = useState([]);
  const [coordenacao, setCoordenacao] = useState([]);
  const [tipoMarcha, setTipoMarcha] = useState([]);
  const [reflexos, setReflexos] = useState([]);

  const [evolucaoNeuro, setEvolucaoNeuro] = useState("");

  const sid = student?.id || student?.nome;
  const enhancer = useEnhancer("neurofuncional", sid, `neuro_enhancer_${sid}`);
  const neuroColors = { ...C, accent: C.purple, font: F };

  useEffect(() => {
    if (student?.id || student?.nome) {
      const saved = loadNeuroData(sid);
      if (saved) {
        setDiagnosticoMedico(saved.diagnosticoMedico || "");
        setTempoLesao(saved.tempoLesao || "");
        setMecanismoLesao(saved.mecanismoLesao || "");
        setLadoAfetado(saved.ladoAfetado || "");
        setHistoricoNeuro(saved.historicoNeuro || "");
        setMedicacoes(saved.medicacoes || "");
        setComorbidadesNeuro(saved.comorbidadesNeuro || []);
        setSintomas(saved.sintomas || []);
        setAvdsNeuro(saved.avdsNeuro || []);
        setMasScores(saved.masScores || {});
        setMasResult(saved.masResult || null);
        setBbsScores(saved.bbsScores || {});
        setBbsResult(saved.bbsResult || null);
        setMifScores(saved.mifScores || {});
        setMifResult(saved.mifResult || null);
        setTono(saved.tono || "");
        setForcaNeuro(saved.forcaNeuro || { deltoideD:"", deltoideE:"", bicepsD:"", bicepsE:"", extensorPunhoD:"", extensorPunhoE:"", flexorQuadrilD:"", flexorQuadrilE:"", quadricepsD:"", quadricepsE:"", tibialAnteriorD:"", tibialAnteriorE:"" });
        setSensibilidade(saved.sensibilidade || []);
        setCoordenacao(saved.coordenacao || []);
        setTipoMarcha(saved.tipoMarcha || []);
        setReflexos(saved.reflexos || []);
        setEvolucaoNeuro(saved.evolucaoNeuro || "");
        if (saved.pain) enhancer.setPain(saved.pain);
        if (saved.logs) enhancer.setLogs(saved.logs);
        if (saved.redFlags) enhancer.setRedFlags(saved.redFlags);
        if (saved.aiRes) enhancer.setAiRes(saved.aiRes);
      }
    }
  }, [student?.id, student?.nome]);

  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    const sid = student.id || student.nome;
    saveNeuroData(sid, {
      diagnosticoMedico, tempoLesao, mecanismoLesao, ladoAfetado, historicoNeuro, medicacoes,
      comorbidadesNeuro, sintomas, avdsNeuro,
      masScores, masResult, bbsScores, bbsResult, mifScores, mifResult,
      tono, forcaNeuro, sensibilidade, coordenacao, tipoMarcha, reflexos,
      evolucaoNeuro,
      pain: enhancer.pain, logs: enhancer.logs, redFlags: enhancer.redFlags, aiRes: enhancer.aiRes,
      data: new Date().toISOString().slice(0,10),
    });
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"0.05em" }}>🧠 Neurofuncional</span>
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
          <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>🧠 Neurofuncional</span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Anamnese"],["avaliacao","🔬","Avaliação"],["evolucao","📈","Evolução"],["sessoes","📅","Sessões"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
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
            <Section title="Anamnese Neurológica" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados da avaliação neurológica, diagnóstico, tempo de lesão e histórico do paciente.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>Diagnóstico médico / Condição principal</span>
                  <input type="text" value={diagnosticoMedico} onChange={e => setDiagnosticoMedico(e.target.value)} style={inp()} placeholder="Ex: AVC isquêmico hemisfério E, LESÃO MEDULAR T10" />
                </div>
                <div>
                  <span style={lbl()}>Tempo de lesão / diagnóstico</span>
                  <input type="text" value={tempoLesao} onChange={e => setTempoLesao(e.target.value)} style={inp()} placeholder="Ex: 3 meses, 5 anos, 2 semanas" />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Mecanismo da lesão / História da doença atual</span>
                <textarea value={mecanismoLesao} onChange={e => setMecanismoLesao(e.target.value)} rows={2}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.5 }) }}
                  placeholder="Descreva o mecanismo da lesão ou história da doença neurológica..." />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Lado afetado</span>
                <SingleSelect options={["Direito","Esquerdo","Bilateral","Axial (tronco)"]} value={ladoAfetado} onChange={setLadoAfetado} activeColor={C.purple} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Histórico de internações / Cirurgias neurológicas</span>
                  <textarea value={historicoNeuro} onChange={e => setHistoricoNeuro(e.target.value)} rows={2}
                    style={{ ...inp({ resize:"vertical", lineHeight:1.3, fontSize:12 }) }}
                    placeholder="Cirurgias prévias, internações, complicações..." />
                </div>
                <div>
                  <span style={lbl()}>Medicações em uso</span>
                  <input type="text" value={medicacoes} onChange={e => setMedicacoes(e.target.value)} style={inp()} placeholder="Ex: Baclofeno, Levodopa, Anticoagulante..." />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Comorbidades neurológicas</span>
                <TagSelect options={["AVE","LESÃO MEDULAR","TCE","DOENÇA DE PARKINSON","ESCLEROSE MÚLTIPLA","ELA","POLIO","ATAXIA","NEUROPATIA PERIFÉRICA","TUMOR SNC","HIDROCEFALIA"]}
                  value={comorbidadesNeuro} onChange={setComorbidadesNeuro} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Sintomas neurológicos</span>
                <TagSelect options={["Fraqueza","Espasticidade","Ataxia","Tremor","Rigidez","Hipomimia","Disartria","Disfagia","Alteração sensitiva","Dor neuropática","Fadiga","Incontinência","Tontura","Visão dupla"]}
                  value={sintomas} onChange={setSintomas} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>AVDs comprometidas</span>
                <TagSelect options={["Banho","Vestuário","Alimentação","Higiene","Transferências","Marcha","Subir escadas","Dirigir","Trabalho","Lazer"]}
                  value={avdsNeuro} onChange={setAvdsNeuro} activeColor={C.purple} />
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Anamnese</button>
            </div>
          </>
        )}

        {tab === "avaliacao" && (
          <>
            <Section title="Exame Neurológico" icon="🔬">
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Tônus muscular</span>
                <SingleSelect options={["Normal","Hipotonia","Espasticidade","Rigidez plástica","Rigidez em roda denteada"]} value={tono} onChange={setTono} activeColor={C.purple} />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 16px", marginBottom:14 }}>
                <NumericField label="Deltoide D (MRC 0-5)" value={forcaNeuro.deltoideD} onChange={v => setForcaNeuro(p => ({...p, deltoideD: v}))} min={0} max={5} step={1} />
                <NumericField label="Deltoide E (MRC 0-5)" value={forcaNeuro.deltoideE} onChange={v => setForcaNeuro(p => ({...p, deltoideE: v}))} min={0} max={5} step={1} />
                <NumericField label="Bíceps D (MRC 0-5)" value={forcaNeuro.bicepsD} onChange={v => setForcaNeuro(p => ({...p, bicepsD: v}))} min={0} max={5} step={1} />
                <NumericField label="Bíceps E (MRC 0-5)" value={forcaNeuro.bicepsE} onChange={v => setForcaNeuro(p => ({...p, bicepsE: v}))} min={0} max={5} step={1} />
                <NumericField label="Extensor punho D (MRC 0-5)" value={forcaNeuro.extensorPunhoD} onChange={v => setForcaNeuro(p => ({...p, extensorPunhoD: v}))} min={0} max={5} step={1} />
                <NumericField label="Extensor punho E (MRC 0-5)" value={forcaNeuro.extensorPunhoE} onChange={v => setForcaNeuro(p => ({...p, extensorPunhoE: v}))} min={0} max={5} step={1} />
                <NumericField label="Flexor quadril D (MRC 0-5)" value={forcaNeuro.flexorQuadrilD} onChange={v => setForcaNeuro(p => ({...p, flexorQuadrilD: v}))} min={0} max={5} step={1} />
                <NumericField label="Flexor quadril E (MRC 0-5)" value={forcaNeuro.flexorQuadrilE} onChange={v => setForcaNeuro(p => ({...p, flexorQuadrilE: v}))} min={0} max={5} step={1} />
                <NumericField label="Quadríceps D (MRC 0-5)" value={forcaNeuro.quadricepsD} onChange={v => setForcaNeuro(p => ({...p, quadricepsD: v}))} min={0} max={5} step={1} />
                <NumericField label="Quadríceps E (MRC 0-5)" value={forcaNeuro.quadricepsE} onChange={v => setForcaNeuro(p => ({...p, quadricepsE: v}))} min={0} max={5} step={1} />
                <NumericField label="Tibial anterior D (MRC 0-5)" value={forcaNeuro.tibialAnteriorD} onChange={v => setForcaNeuro(p => ({...p, tibialAnteriorD: v}))} min={0} max={5} step={1} />
                <NumericField label="Tibial anterior E (MRC 0-5)" value={forcaNeuro.tibialAnteriorE} onChange={v => setForcaNeuro(p => ({...p, tibialAnteriorE: v}))} min={0} max={5} step={1} />
              </div>

              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Sensibilidade</span>
                <SingleSelect options={["Normal","Hipoestesia","Hiperestesia","Alodinia","Perda proprioceptiva","Anestesia"]} value={sensibilidade} onChange={v => setSensibilidade([v])} activeColor={C.purple} />
              </div>

              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Coordenação</span>
                <TagSelect options={["Normal","Dismetria","Ataxia apendicular","Ataxia de marcha","Disdiadococinesia","Tremor intencional"]}
                  value={coordenacao} onChange={setCoordenacao} activeColor={C.purple} />
              </div>

              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Tipo de marcha</span>
                <TagSelect options={["Hemiparética","Parkinsoniana","Atáxica","Escarvante","Anserina (Trendelenburg)","Miotônica","Não deambula","Marcha normal"]}
                  value={tipoMarcha} onChange={setTipoMarcha} activeColor={C.purple} />
              </div>

              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Reflexos</span>
                <TagSelect options={["Normorreflexia","Hiperreflexia","Hiporreflexia","Clônus","Babinski presente","Sinal de Hoffman"]}
                  value={reflexos} onChange={setReflexos} activeColor={C.purple} />
              </div>
            </Section>

            <Section title="Escala de Ashworth Modificada (MAS)" icon="📊">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação da espasticidade. 0 = Sem aumento de tônus. 4 = Rigidez completa.
              </div>
              {MAS_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom:8 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                  <SingleSelect options={MAS_OPTIONS} value={masScores[q.id] || ""} onChange={v => {
                    const next = { ...masScores, [q.id]: v };
                    setMasScores(next);
                    setMasResult(calcMAS(next));
                  }} activeColor={C.purple} />
                </div>
              ))}
              {masResult && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>MAS Total</div>
                  <div style={{ fontSize:32, fontWeight:900, color:masResult.color }}>{masResult.total}/24</div>
                  <div style={{ fontSize:14, fontWeight:700, color:masResult.color, marginTop:4 }}>{masResult.level}</div>
                </div>
              )}
            </Section>

            <Section title="Berg Balance Scale (BBS) — Simplificada" icon="⚖️">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação de equilíbrio funcional. 0 = Incapaz, 4 = Independente. Máximo 20 pontos.
              </div>
              {BBS_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom:8 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                  <SingleSelect options={BBS_OPTIONS} value={bbsScores[q.id] || ""} onChange={v => {
                    const next = { ...bbsScores, [q.id]: v };
                    setBbsScores(next);
                    setBbsResult(calcBBS(next));
                  }} activeColor={C.purple} />
                </div>
              ))}
              {bbsResult && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>BBS</div>
                  <div style={{ fontSize:32, fontWeight:900, color:bbsResult.color }}>{bbsResult.total}/20</div>
                  <div style={{ fontSize:14, fontWeight:700, color:bbsResult.color, marginTop:4 }}>{bbsResult.level}</div>
                </div>
              )}
            </Section>

            <Section title="Medida de Independência Funcional (MIF) — Simplificada" icon="📋">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação da funcionalidade. 0 = Totalmente dependente, 7 = Independente. Máximo 42 pontos.
              </div>
              {MIF_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom:8 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Totalmente dependente" },
                    { value:"1", label:"1 - Dependência total" },
                    { value:"2", label:"2 - Dependência máxima" },
                    { value:"3", label:"3 - Dependência moderada" },
                    { value:"4", label:"4 - Dependência mínima" },
                    { value:"5", label:"5 - Supervisão" },
                    { value:"6", label:"6 - Com adaptação" },
                    { value:"7", label:"7 - Independente" },
                  ]} value={mifScores[q.id] || ""} onChange={v => {
                    const next = { ...mifScores, [q.id]: v };
                    setMifScores(next);
                    setMifResult(calcMIF(next));
                  }} activeColor={C.purple} />
                </div>
              ))}
              {mifResult && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>MIF</div>
                  <div style={{ fontSize:32, fontWeight:900, color:mifResult.color }}>{mifResult.total}/{mifResult.max}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:mifResult.color, marginTop:4 }}>{mifResult.level}</div>
                </div>
              )}
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
            </div>
          </>
        )}

        {tab === "evolucao" && (
          <Section title="Evolução e Reavaliação" icon="📈">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Registre a evolução do paciente neurológico, resposta às intervenções e planejamento das próximas sessões.
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucaoNeuro} onChange={e => setEvolucaoNeuro(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução desde a última sessão, resposta às intervenções, mudanças na funcionalidade..." />
            </div>
            {masResult && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.purple, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Última avaliação</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>
                  <strong>MAS:</strong> {masResult.total}/24 ({masResult.level}) · <strong>BBS:</strong> {bbsResult?.total || "—"}/20 · <strong>MIF:</strong> {mifResult?.total || "—"}/{mifResult?.max || "—"}
                </div>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Evolução</button>
            </div>
          </Section>
        )}

        {tab === "sessoes" && (
          <>
            <PainSection pain={enhancer.pain} setPain={enhancer.setPain} colors={neuroColors} />
            <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
              flags={["Cefaleia súbita e intensa (hemorragia)","Déficit motor focal súbito (AVC)","Perda de consciência","Piora progressiva","Febre + rigidez nucal (meningite)","Trauma craniano recente","Tumor cerebral suspeito","Disfagia progressiva"]}
              colors={neuroColors} />
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={neuroColors} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nDiagnóstico: ${diagnosticoMedico}\nTempo lesão: ${tempoLesao}\nLado afetado: ${ladoAfetado}\nSintomas: ${sintomas.join(", ")}\nMAS: ${masResult?.total || "—"}\nBBS: ${bbsResult?.total || "—"}\nMIF: ${mifResult?.total || "—"}\nEVA Mov: ${enhancer.pain.evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep}/10\nDor local: ${enhancer.pain.localDor.join(", ")}\nMarcha: ${tipoMarcha.join(", ")}\nCoordenação: ${coordenacao.join(", ")}\nEvolução: ${evolucaoNeuro}`}
              colors={neuroColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="Neurofuncional" colors={neuroColors} />
        )}

        {tab === "evidencias" && (
          <Section title="Diretrizes e Evidências em Reabilitação Neurológica" icon="🔬">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Diretrizes baseadas em evidências para reabilitação neurológica, organizadas por condição.
            </div>
            {Object.entries(NEURO_EVIDENCE).map(([key, condition]) => {
              const active = diagnosticoMedico.toLowerCase().includes(key.replace(/_/g," ")) || comorbidadesNeuro.some(c => c.toLowerCase().includes(key.replace(/_/g," ")));
              return (
                <div key={key} style={{
                  ...card(),
                  border: active ? `1px solid ${C.purple}50` : `1px solid ${C.border}`,
                  opacity: active ? 1 : 0.6,
                  cursor:"pointer"
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
      </div>
    </div>
  );
}