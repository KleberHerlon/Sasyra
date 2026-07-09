import { useState, useEffect } from "react";
import AssignFromOtherModules from "../components/AssignFromOtherModules";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import { AudioField, BodyMap, EvaSlider, TagSelect, SingleSelect, GonioRow, MRCRow, TestCard, Row, HonorariosCard } from "../components";
import { useMediaQuery } from "../components";
import { useClinicalScan } from "../hooks/useClinicalScan.js";
import { useSemanticScanner } from "../hooks/useSemanticScanner.js";
import { detectLocalDor, extractClinicalEntities } from "../utils/clinicalDetection.js";
import { CIF } from "../data/cif.js";

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

function CollapsibleSection({ title, icon, badge, expanded, onToggle, children }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ ...card(), padding: isMobile ? "14px 12px" : "20px 22px", cursor:"pointer" }} onClick={onToggle}>
      <div style={{ display:"flex", alignItems:"center", gap:8, paddingBottom:expanded?12:0, borderBottom:expanded?`1px solid ${C.border}`:"none", marginBottom:expanded?isMobile?14:18:0 }}>
        <span style={{ fontSize:10, color:C.textMuted, transition:"transform 0.15s", transform:expanded?"rotate(90deg)":"rotate(0deg)" }}>▶</span>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:isMobile?11:12, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:C.amber, flex:1 }}>{title}</h3>
        {badge && <span style={{ fontSize:11, background:C.amberBg, color:C.amber, border:`1px solid ${C.amber}40`, borderRadius:20, padding:"2px 10px" }}>{badge}</span>}
      </div>
      {expanded && <div>{children}</div>}
    </div>
  );
}

function CollapsibleSub({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ marginBottom: 14, background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: isMobile ? "8px 10px" : "10px 14px" }}>
      <div onClick={() => setOpen(!open)} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none", paddingBottom:open?8:0, borderBottom:open?`1px solid ${C.border}`:"none", marginBottom:open?10:0 }}>
        <span style={{ fontSize:10, color:C.textMuted, transition:"transform 0.15s", transform:open?"rotate(90deg)":"rotate(0deg)" }}>▶</span>
        <span style={{ fontSize:11, fontWeight:800, color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", flex:1 }}>{title}</span>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}

function saveCFData(studentId, data) {
  try { localStorage.setItem(`cf_data_${studentId}`, JSON.stringify(data)); } catch { }
}
function loadCFData(studentId) {
  try { const d = localStorage.getItem(`cf_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

const CF_HISTORY_KEY = "cf_history_";
function loadHistory(sid) {
  try { const d = localStorage.getItem(CF_HISTORY_KEY + sid); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveHistory(sid, history) {
  try { localStorage.setItem(CF_HISTORY_KEY + sid, JSON.stringify(history)); } catch { }
}

const CF_GONIO_DEFAULT = [
  { joint:"Ombro — Flexão", ref:"180° (170-190)", l:"", r:"" },
  { joint:"Ombro — Abdução", ref:"180° (170-190)", l:"", r:"" },
  { joint:"Ombro — Rotação externa 90°", ref:"90° (80-100)", l:"", r:"" },
  { joint:"Ombro — Rotação interna 90°", ref:"70° (60-80)", l:"", r:"" },
  { joint:"Cotovelo — Flexão", ref:"145° (130-160)", l:"", r:"" },
  { joint:"Cotovelo — Extensão", ref:"0° (-5-0)", l:"", r:"" },
  { joint:"Punho — Flexão", ref:"80° (70-90)", l:"", r:"" },
  { joint:"Punho — Extensão", ref:"70° (60-80)", l:"", r:"" },
  { joint:"Quadril — Flexão", ref:"120° (0-145)", l:"", r:"" },
  { joint:"Quadril — Extensão", ref:"30° (0-45)", l:"", r:"" },
  { joint:"Joelho — Flexão", ref:"135° (120-150)", l:"", r:"" },
  { joint:"Joelho — Extensão", ref:"0° (-10-0)", l:"", r:"" },
  { joint:"Tornozelo — Flexão dorsal", ref:"20° (10-30)", l:"", r:"" },
  { joint:"Tornozelo — Flexão plantar", ref:"50° (30-60)", l:"", r:"" },
  { joint:"Coluna lombar — Flexão", ref:"60° (50-70)", l:"", r:"" },
  { joint:"Coluna lombar — Extensão", ref:"25° (15-35)", l:"", r:"" },
];

const CF_MRC_DEFAULT = [
  { muscle:"Flexores de ombro (C5-C6)", value:5 },
  { muscle:"Abdutores de ombro (C5-C6)", value:5 },
  { muscle:"Flexores de cotovelo (C5-C6)", value:5 },
  { muscle:"Extensores de cotovelo (C7-C8)", value:5 },
  { muscle:"Extensores de punho (C6-C7)", value:5 },
  { muscle:"Flexores de quadril (L1-L2)", value:5 },
  { muscle:"Extensores de joelho (L3-L4)", value:5 },
  { muscle:"Flexores de joelho (L5-S1)", value:5 },
  { muscle:"Flexores dorsais (L4-L5)", value:5 },
  { muscle:"Extensores de tronco (T1-L5)", value:5 },
];

const CF_TESTES = [
  { id:"fms", name:"Functional Movement Screen (FMS)", area:"Movimento Funcional", desc:"7 testes: agachamento profundo, step, afundo, mobilidade de ombro, elevação ativa de perna, push-up de tronco, rotação lumbar. Score 0-3 cada. ≤14 indica risco de lesão.", video:"https://www.youtube.com/watch?v=example1" },
  { id:"y_balance", name:"Y-Balance Test (Lower Quarter)", area:"Equilíbrio/Controle", desc:"3 direções: anterior, posteromedial, posterolateral. Assimetria >4cm indica risco de lesão. Norma: ≥90% altura perna.", video:"https://www.youtube.com/watch?v=example2" },
  { id:"y_balance_upper", name:"Y-Balance Test (Upper Quarter)", area:"Estabilidade MMSS", desc:"4 direções: medial, inferior, superolateral, inferolateral. Assimetria >4cm indica risco. Teste em posição de prancha.", video:"https://www.youtube.com/watch?v=example3" },
  { id:"hop_test", name:"Triple Hop Test", area:"Potência/Risco", desc:"3 saltos unipodais consecutivos. Distância total. Assimetria >10% entre pernas indica risco de lesão de joelho. LSI (Limb Symmetry Index) referência ≥90%.", video:"https://www.youtube.com/watch?v=example4" },
  { id:"overhead_squat", name:"Overhead Squat Assessment (OHSA)", area:"Mobilidade/Estabilidade", desc:"Avalia mobilidade de tornozelo, joelho em valgo, inclinação de tronco, elevação de braços. Padrões compensatórios comuns em CrossFitters.", video:"https://www.youtube.com/watch?v=example5" },
  { id:"shoulder_mobility", name:"Teste de Mobilidade de Ombro (Apley)", area:"Ombro", desc:"Toque escapular superior e inferior. Distância entre dedos. Norma ≤0cm (dedos se tocam). Avalia rotação combinada.", video:"https://www.youtube.com/watch?v=example6" },
  { id:"tomas_test", name:"Tomas Test (Flexores de Quadril)", area:"Quadril", desc:"Avalia contratura em flexão de quadril. Ângulo normal ~0°. CrossFitters frequentemente apresentam encurtamento por excesso de agachamento.", video:"https://www.youtube.com/watch?v=example7" },
  { id:"eley_test", name:"Eley Test (Instabilidade Lombar)", area:"Lombar", desc:"Em 4 apoios, elevação alternada de braço/perna. Instabilidade se movimento excessivo de rotação pélvica. Screening para atletas com dor lombar.", video:"https://www.youtube.com/watch?v=example8" },
  { id:"rucker_test", name:"Teste de Rucker (Punho/Carga)", area:"Punho", desc:"Flexão de punho contra resistência em posição de handstand. Avalia capacidade de suporte de peso em HSPU e handstand walk.", video:"https://www.youtube.com/watch?v=example9" },
];

const CF_EVIDENCE = {
  lombalgia: {
    label:"Lombalgia em CrossFitters",
    goldStandard:"Avaliação inicial com triagem de bandeiras vermelhas. Exercícios de estabilização segmentar lombar e fortalecimento do core. Correção técnica em levantamento terra e agachamento. McKenzie method para direcionamento preferencial. Evitar extensão lombar em atletas com espondilólise. Evidência B para exercícios de McGill.",
    escalas:["Oswestry Disability Index","Tampa Scale of Kinesiophobia","NPRS","FMS"],
    referencias:[{ id:"JOSPT 2021", title:"Low back pain in CrossFit athletes", url:"https://www.jospt.org/" }],
    redFlags:["Dor lombar + irradiação para MMII","Perda de controle esfincteriano","Anestesia em sela","Febre + dor lombar intensa","Histórico de câncer + dor óssea"],
  },
  ombro: {
    label:"Ombro do CrossFitter",
    goldStandard:"Avaliação de discinese escapular e range of motion. Fortalecimento de rotadores externos, trapézio médio/inferior e serrátil anterior. Evitar kipping pull-up em atletas com instabilidade glenoumeral. Progressão gradual em movimentos overhead. Evidência B para exercícios de Jobe e scapular retraction drills.",
    escalas:["DASH","ASES Shoulder Score","NPRS","FMS"],
    referencias:[{ id:"Sports Health 2022", title:"Shoulder injuries in CrossFit", url:"https://journals.sagepub.com/home/sph" }],
    redFlags:["Luxação glenoumeral aguda","Perda de força súbita em ombro","Dor noturna intensa","Sinal de Neer/Hawkins positivo","Instabilidade com subluxação"],
  },
  joelho: {
    label:"Joelho do CrossFitter",
    goldStandard:"Fortalecimento de quadríceps, posterior de coxa e glúteos. Treino de quedas e aterrissagens para absorção de impacto em box jump. Correção de valgo dinâmico no agachamento. Liberação miofascial do trato iliotibial. Evitar deep squat (>135°) em atletas com dor patelofemoral.",
    escalas:["IKDC","Kujala Scale","NPRS","Y-Balance Test"],
    referencias:[{ id:"AJSM 2020", title:"Knee injury patterns in CrossFit", url:"https://journals.sagepub.com/home/ajs" }],
    redFlags:["Joelho travado / falseio","Derrame articular significativo","Dor em repouso noturno","Instabilidade patelar franca","Nega carga total na perna"],
  },
  rabdomiolise: {
    label:"Rhabdomiólise",
    goldStandard:"Suspensão imediata da atividade. Hidratação agressiva (VO ou EV conforme gravidade). Monitorização de CK, creatinina, potássio e enzimas hepáticas. Hospitalização se CK > 50.000 U/L ou sinais de IRA. Retorno gradual apenas com CK normalizada e função renal preservada. Prevenção: progressão gradual de volume e intensidade.",
    escalas:["CK sérico","Creatinina","Potássio","Função renal"],
    referencias:[{ id:"CIMS 2023", title:"Rhabdomyolysis in CrossFit", url:"https://www.crossfit.com/medical" }],
    redFlags:["Urina escura (cor de coca-cola)","CK > 10.000 U/L","Oligúria / anúria","Dor muscular desproporcional ao treino","Confusão mental / mal-estar geral"],
  },
  tendinopatiaAquiles: {
    label:"Tendinopatia de Aquiles em saltadores",
    goldStandard:"Exercícios excêntricos (protocolo Alfredson, 3x15, 2x/dia, 12 semanas). Carga progressiva em dupla perna → unipodal. Evitar saltos e double-unders durante fase aguda. Liberação de panturrilha e mobilização de tornozelo. Retorno gradual com redução de volume de saltos. Evidência A para excêntricos isolados.",
    escalas:["VISA-A","NPRS","Hopping Test"],
    referencias:[{ id:"BJSM 2021", title:"Achilles tendinopathy management", url:"https://bjsm.bmj.com/" }],
    redFlags:["Rotura audível + incapacidade de flexão plantar","Dor intensa súbita em panturrilha","Sinal de Thompson positivo","Hematoma na panturrilha","Impossibilidade de ficar na ponta dos pés"],
  },
};

// ── KB DETECT ────────────────────────────────────────────────────────────────
function detectKBList(lesoesPrevias, restricoesMovimentos, evolucao) {
  const text = [evolucao, ...lesoesPrevias, ...restricoesMovimentos].join(" ").toLowerCase();
  return Object.entries(CF_EVIDENCE)
    .filter(([key]) => text.includes(key.replace(/_/g, " ").split(" ")[0]))
    .map(([key, val]) => ({ key, label: val.label, ...val }));
}

// ── CIF AUTO KEYS ────────────────────────────────────────────────────────────
function autoCIFKeys({ lesoesPrevias, restricoesMovimentos, modalidades, snatchRM, cleanJerkRM, pain }) {
  const keys = [];
  if (lesoesPrevias.includes("Ombro") || restricoesMovimentos.some(r => r.includes("overhead") || r.includes("snatch"))) keys.push("b710");
  if (lesoesPrevias.includes("Coluna lombar") || lesoesPrevias.includes("Lombar")) keys.push("b280", "d410");
  if (lesoesPrevias.includes("Joelho")) keys.push("b730", "b770");
  if (restricoesMovimentos.some(r => r.includes("squat") || r.includes("agachamento"))) keys.push("d410");
  if (lesoesPrevias.includes("Punho")) keys.push("b710");
  if (lesoesPrevias.includes("Tornozelo")) keys.push("b770", "d450");
  if (pain?.evaRep > 0 || pain?.evaMov > 0) keys.push("b280");
  return [...new Set(keys)];
}

function suggestDCT(lesoesPrevias, restricoesMovimentos) {
  if (lesoesPrevias.includes("Ombro") || restricoesMovimentos.some(r => r.includes("overhead") || r.includes("pull-up")))
    return "Disfunção de movimento escapular / ombro com limitação em movimentos overhead, necessitando de reabilitação de cuff e retorno progressivo aos levantamentos.";
  if (lesoesPrevias.includes("Coluna lombar") || lesoesPrevias.includes("Lombar"))
    return "Lombalgia mecânica em atleta CrossFit com disfunção de core e técnica de levantamento, necessitando de estabilização segmentar e correção biomecânica.";
  if (lesoesPrevias.includes("Joelho"))
    return "Dor patelofemoral / tendinopatia patelar em atleta CrossFit com limitação em agachamento e box jump, necessitando de fortalecimento excêntrico e correção de valgo dinâmico.";
  if (restricoesMovimentos.some(r => r.includes("squat")))
    return "Síndrome de encurtamento de flexores de quadril e limitada ADM de tornozelo, necessitando de liberação miofascial e treino de mobilidade para agachamento profundo.";
  return "";
}

const YELLOW_FLAGS_CF = [
  { id:"overtraining", label:"Sinais de overtraining / fadiga crônica" },
  { id:"tecnicapobre", label:"Técnica pobre / compensações persistentes" },
  { id:"medo_movimento", label:"Medo de movimento específico (cinesiofobia)" },
  { id:"pressao", label:"Pressão por performance / competição iminente" },
  { id:"adesao", label:"Adesão irregular / faltas frequentes" },
  { id:"sono", label:"Distúrbio do sono / recuperação inadequada" },
  { id:"nutricao", label:"Déficit nutricional / restrição calórica intensa" },
  { id:"suplementacao", label:"Uso de suplementos proibidos / suspeita de doping" },
];

function getMergedRedFlags(kbList) {
  const base = [
    "Dor torácica durante exercício","Falta de ar desproporcional",
    "Tontura/síncope","Palpitações","Edema articular agudo",
    "Hematúria pós-treino","Febre + mialgia intensa","Perda de força súbita",
  ];
  const fromKB = kbList.flatMap(k => k.redFlags || []);
  return [...new Set([...base, ...fromKB])];
}

const CREFITO_REGIOES = {
  "Sul (RS/SC/PR)":{consulta:180,sessao:160,avaliacao:250,relatorio:120},
  "Sudeste - SP":{consulta:220,sessao:200,avaliacao:320,relatorio:150},
  "Sudeste - RJ/ES/MG":{consulta:190,sessao:170,avaliacao:280,relatorio:130},
  "Centro-Oeste":{consulta:170,sessao:150,avaliacao:240,relatorio:110},
  "Nordeste":{consulta:150,sessao:140,avaliacao:220,relatorio:100},
  "Norte":{consulta:140,sessao:130,avaliacao:210,relatorio:95},
};

export default function CrossFit({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onUpdateStudentById, onDeleteStudent, plan, onUpgrade, canUseFeature, tryFeature, aiRemaining, aiLimit, hasExpansion, purchaseAIExpansion, currentModuleId, allPatients }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("avaliacao");

  // Anamnese
  const [queixaAtleta, setQueixaAtleta] = useState("");
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

  // Advanced
  const [diagnosticoCinesio, setDiagnosticoCinesio] = useState("");
  const [yellowFlags, setYellowFlags] = useState([]);
  const [evaMov, setEvaMov] = useState(0);
  const [evaRep, setEvaRep] = useState(0);
  const [localDor, setLocalDor] = useState([]);
  const [bodyPain, setBodyPain] = useState([]);
  const [gonioRows, setGonioRows] = useState(JSON.parse(JSON.stringify(CF_GONIO_DEFAULT)));
  const [mrcRows, setMrcRows] = useState(JSON.parse(JSON.stringify(CF_MRC_DEFAULT)));
  const [testResults, setTestResults] = useState([]);
  const [regiao, setRegiao] = useState("");
  const [expandedSections, setExpandedSections] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const sid = student?.id || student?.nome;
  const isMobile = useMediaQuery("(max-width:767px)");
  const enhancer = useEnhancer("crossfit", sid, `cf_enhancer_${sid}`);
  const cfColors = { ...C, accent: C.amber, font: F };
  const { scan } = useClinicalScan();
  const { semanticScan } = useSemanticScanner();
  const kbList = detectKBList(lesoesPrevias, restricoesMovimentos, evolucao);
  const cifKeys = autoCIFKeys({ lesoesPrevias, restricoesMovimentos, modalidades, snatchRM, cleanJerkRM, pain: enhancer.pain });
  const cifEntries = CIF.filter(c => cifKeys.includes(c.code));
  const mergedRedFlags = getMergedRedFlags(kbList);
  const dctSuggestion = suggestDCT(lesoesPrevias, restricoesMovimentos);

  const toggleSection = (id) => {
    setExpandedSections(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  useEffect(() => {
    if (student?.id || student?.nome) {
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
        setQueixaAtleta(saved.queixaAtleta || "");
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
        setDiagnosticoCinesio(saved.diagnosticoCinesio || "");
        setYellowFlags(saved.yellowFlags || []);
        setEvaMov(saved.evaMov || 0);
        setEvaRep(saved.evaRep || 0);
        setLocalDor(saved.localDor || []);
        setBodyPain(saved.bodyPain || []);
        setGonioRows(saved.gonioRows || JSON.parse(JSON.stringify(CF_GONIO_DEFAULT)));
        setMrcRows(saved.mrcRows || JSON.parse(JSON.stringify(CF_MRC_DEFAULT)));
        setTestResults(saved.testResults || []);
        setExpandedSections(saved.expandedSections || []);
        if (saved.pain) enhancer.setPain(saved.pain);
        if (saved.logs) enhancer.setLogs(saved.logs);
        if (saved.redFlags) enhancer.setRedFlags(saved.redFlags);
        if (saved.aiRes) enhancer.setAiRes(saved.aiRes);
      }
      setAssessmentHistory(loadHistory(sid));
    }
  }, [student?.id, student?.nome]);

  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    saveCFData(sid, {
      nomeAtleta, idadeAtleta, sexoAtleta, tempoCrossfit, modalidades, lesoesPrevias,
      restricoesMovimentos, nivelAtleta, objetivos, frequenciaSemanal, queixaAtleta,
      historicoTreinos, snatchRM, cleanJerkRM, backSquatRM, frontSquatRM, deadliftRM,
      benchPressRM, shoulderPressRM, benchmarksHistorico, evolucao,
      diagnosticoCinesio, yellowFlags, evaMov, evaRep, localDor, bodyPain,
      gonioRows, mrcRows, testResults, expandedSections,
      pain: enhancer.pain, logs: enhancer.logs, redFlags: enhancer.redFlags, aiRes: enhancer.aiRes,
      data: new Date().toISOString().slice(0,10),
    });
  };

  const handleSaveAssessment = () => {
    if (!sid) return;
    handleSave();
    const entry = {
      id: Date.now(), data: new Date().toISOString().slice(0,10),
      hora: new Date().toLocaleTimeString("pt-BR", {hour:"2-digit",minute:"2-digit"}),
      nome: nomeAtleta, lesoes: [...lesoesPrevias], restricoes: [...restricoesMovimentos],
      snatch: snatchRM, cleanJerk: cleanJerkRM, backSquat: backSquatRM,
      gonioRows: JSON.parse(JSON.stringify(gonioRows)),
      mrcRows: JSON.parse(JSON.stringify(mrcRows)),
      testResults: [...testResults], yellowFlags: [...yellowFlags],
      treinoCount: historicoTreinos.length,
    };
    const history = loadHistory(sid);
    history.unshift(entry);
    if (history.length > 20) history.pop();
    saveHistory(sid, history);
    setAssessmentHistory(history);
  };

  const handleLoadAssessment = (entry) => {
    if (!entry) return;
    setNomeAtleta(entry.nome || "");
    setLesoesPrevias(entry.lesoes || []);
    setRestricoesMovimentos(entry.restricoes || []);
    if (entry.snatch) setSnatchRM(entry.snatch);
    if (entry.cleanJerk) setCleanJerkRM(entry.cleanJerk);
    if (entry.backSquat) setBackSquatRM(entry.backSquat);
    setGonioRows(entry.gonioRows || JSON.parse(JSON.stringify(CF_GONIO_DEFAULT)));
    setMrcRows(entry.mrcRows || JSON.parse(JSON.stringify(CF_MRC_DEFAULT)));
    setTestResults(entry.testResults || []);
    setYellowFlags(entry.yellowFlags || []);
    setShowHistory(false);
  };

  const handleReset = () => {
    if (!window.confirm("Tem certeza? Todos os dados atuais serão perdidos.")) return;
    localStorage.removeItem(`cf_data_${sid}`);
    window.location.reload();
  };

  const addTreino = () => {
    if (!treinoNome && !treinoData) return;
    const novo = {
      data: treinoData || new Date().toISOString().slice(0,10),
      tipo: treinoTipo, nome: treinoNome, descricao: treinoDescricao,
      resultado: treinoResultado, rpe: treinoRPE, observacoes: treinoObservacoes, id: Date.now(),
    };
    const updated = [novo, ...historicoTreinos].slice(0, 50);
    setHistoricoTreinos(updated);
    setTreinoData(""); setTreinoTipo(""); setTreinoNome(""); setTreinoDescricao("");
    setTreinoResultado(""); setTreinoRPE(""); setTreinoObservacoes("");
  };

  const addBenchmarkResult = (label) => {
    const novo = {
      label, resultado: treinoResultado || "", data: treinoData || new Date().toISOString().slice(0,10),
      rpe: treinoRPE || "", id: Date.now(),
    };
    setBenchmarksHistorico([novo, ...benchmarksHistorico].slice(0, 30));
  };

  const toggleTest = (testId) => {
    setTestResults(prev => {
      if (prev.includes(testId)) return prev.filter(x => x !== testId);
      const newTest = { ...CF_TESTES.find(t => t.id === testId), result:"+", notes:"" };
      return [...prev, newTest];
    });
  };

  const handleSaveMetricas = () => { handleSave(); };

  // ── PATIENT LIST VIEW ─────────────────────────────────────────────────────
  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding: isMobile ? 12 : 24 }}>
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
        <AssignFromOtherModules allPatients={allPatients} currentModuleId={currentModuleId} onUpdateStudentById={onUpdateStudentById} accentColor={C.blue} />

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.amber}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.amber, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              {editingStudent ? "✏️ Editar Aluno" : "➕ Novo Aluno"}
            </div>
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
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
                onAddStudent({ ...f, id:Date.now(), data:new Date().toISOString().slice(0,10), assignedModules: [currentModuleId] });
              }
              setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
              setShowForm(false);
            }} disabled={!f.nome.trim()} style={{...primaryBtn({width:"100%",justifyContent:"center",padding:"11px",fontSize:14}),opacity:f.nome.trim()?1:0.4,cursor:f.nome.trim()?"pointer":"not-allowed"}}>{editingStudent ? "Salvar Alterações" : "Cadastrar Aluno"}</button>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[...(students||[])].reverse().map(p => (
            <div key={p.id} style={{ display:"flex", gap:8, alignItems:"stretch" }}>
              <button onClick={() => { onSelectStudent(p); setStudentListView(false); }} style={{
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
                <button onClick={() => setEditTarget(p)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0 }} title="Editar">✏️</button>
                <button onClick={() => { setDeleteTarget(p); setDeleteStep(1); }} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0 }} title="Excluir">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.red}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>{deleteStep===1?"⚠️":"🔴"}</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.red, marginBottom:8 }}>{deleteStep===1?"Excluir aluno":"Confirmação final"}</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16, padding:"8px 12px", background:C.card, borderRadius:8, border:`1px solid ${C.border}` }}>{deleteTarget.nome}</div>
            {deleteStep===1 ? (
              <><div style={{ fontSize:13, color:C.textSub, marginBottom:18 }}>Deseja realmente excluir <strong>{deleteTarget.nome}</strong>?</div>
              <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
                <button onClick={() => setDeleteStep(2)} style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
              </div></>
            ) : (
              <><div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Todos os dados de <strong>{deleteTarget.nome}</strong> serão perdidos permanentemente. <strong style={{color:C.red}}>Não pode ser desfeito</strong>.</div>
              <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
                <button onClick={() => { onDeleteStudent(deleteTarget); setDeleteTarget(null); setDeleteStep(1); }} style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Sim, excluir</button>
              </div></>
            )}
          </div>
        </div>
      )}

      {editTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => setEditTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.amber}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.amber, marginBottom:8 }}>Editar dados do aluno</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:18 }}>Deseja editar os dados de <strong>{editTarget.nome}</strong>?</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setEditTarget(null)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => { setF({ nome:editTarget.nome||"", dataNasc:editTarget.dataNasc||"", sexo:editTarget.sexo||"", profissao:editTarget.profissao||"", convenio:editTarget.convenio||"", telefone:editTarget.telefone||"", peso:editTarget.peso||"", altura:editTarget.altura||"" }); setEditingStudent(editTarget); setEditTarget(null); setShowForm(true); }}
                style={{ background:C.amber, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#061A0C", cursor:"pointer", fontFamily:F }}>Continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── MAIN SCREEN ───────────────────────────────────────────────────────────
  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding: isMobile ? "0 8px" : "0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height: isMobile ? 50 : 60 }}>
        <div style={{ display:"flex", alignItems:"center", gap: isMobile ? 6 : 12 }}>
          <button onClick={() => setStudentListView(true)} style={ghostBtn({ padding:"5px 8px", fontSize: isMobile ? 10 : 11 })}>← {isMobile ? "" : "Alunos"}</button>
          <span style={{ fontSize: isMobile ? 10 : 11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>{isMobile ? "💪" : "💪 CrossFit"}</span>
        </div>
        <div style={{ display:"flex", gap:4, overflowX: isMobile ? "auto" : "visible", flexShrink:1, msOverflowStyle:"none", scrollbarWidth:"none" }}>
          {[["avaliacao","📋",isMobile?"":"Avaliação"],["evolucao","📈",isMobile?"":"Evolução"],["relatorio","📊",isMobile?"":"Relatório"],["evidencias","🔬",isMobile?"":"Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.amberBg : "transparent", border: `1px solid ${tab === k ? C.amber + "50" : "transparent"}`,
              borderRadius: 8, padding: isMobile ? "6px 10px" : "7px 14px", fontSize: isMobile ? 10 : 12,
              fontWeight: tab === k ? 700 : 400, whiteSpace:"nowrap",
              color: tab === k ? C.amber : C.textMuted, cursor: "pointer", fontFamily: F,
            }}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {student?.nome && (
            <><div style={{ width: isMobile ? 24 : 30, height: isMobile ? 24 : 30, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile ? 10 : 13, fontWeight:800, color:C.amber }}>{student.nome[0]?.toUpperCase()}</div>
              {!isMobile && <span style={{ fontSize:12, color:C.textSub, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.nome}</span>}</>
          )}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding: isMobile ? "12px 10px" : "20px 16px" }}>
        {/* ════════ TAB: AVALIAÇÃO ════════ */}
        {tab === "avaliacao" && <>
          <Section title="Histórico de Avaliações" icon="📂">
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <select value="" onChange={e=>{const idx=Number(e.target.value);if(idx>=0&&assessmentHistory[idx])handleLoadAssessment(assessmentHistory[idx])}} style={{...sel({maxWidth:260,fontSize:12})}}>
                <option value="">Selecionar avaliação anterior...</option>
                {assessmentHistory.map((a,i)=><option key={a.id} value={i}>{a.data||""} — {(a.queixaAtleta||"").slice(0,50)}</option>)}
              </select>
              <button onClick={handleSaveAssessment} style={primaryBtn({padding:"7px 16px",fontSize:12})}>💾 Salvar avaliação</button>
              <button onClick={handleReset} style={{...ghostBtn({padding:"7px 16px",fontSize:12}),color:C.amber,borderColor:`${C.amber}50`}}>🔄 Nova avaliação</button>
              {assessmentHistory.length > 0 && <span style={{fontSize:10,color:C.textMuted}}>{assessmentHistory.length} avaliação(ões) salva(s)</span>}
            </div>
          </Section>

          <CollapsibleSection title="Identificação do Paciente" icon="👤" expanded={expandedSections.includes("identificacao")} onToggle={()=>toggleSection("identificacao")}>
            <Row cols={isMobile?"1fr":"1fr 1fr 1fr"} gap="12px 16px">
              <div style={{gridColumn:isMobile?"1":"span 2"}}><span style={lbl()}>Nome completo</span><input type="text" value={student?.nome||""} style={inp()} readOnly /></div>
              <div><span style={lbl()}>Data da avaliação</span><input type="date" style={inp()} defaultValue={new Date().toISOString().slice(0,10)} /></div>
            </Row>
            <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
              <div><span style={lbl()}>Data de nascimento</span><input type="date" value={student?.dataNasc||""} style={inp()} readOnly /></div>
              <div><span style={lbl()}>Sexo</span><input type="text" value={student?.sexo||""} style={inp()} readOnly /></div>
            </Row>
            <CollapsibleSub title="Dados Administrativos e Financeiros">
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>Convênio</span><select value={student?.convenio||""} style={sel()}>{["","Particular","Unimed","Bradesco Saúde","Amil","SulAmérica","Hapvida","NotreDame","IPSEMG","SUS / NASF","Outro"].map(o=><option key={o} value={o}>{o||"Selecionar…"}</option>)}</select></div>
                {student?.convenio==="Particular"&&<div><span style={lbl()}>Região CREFITO</span><select value={regiao} onChange={e=>setRegiao(e.target.value)} style={sel()}>{["",...Object.keys(CREFITO_REGIOES)].map(o=><option key={o} value={o}>{o||"Selecionar…"}</option>)}</select></div>}
              </Row>
              {student?.convenio==="Particular"&&regiao&&<HonorariosCard convenio="Particular" regiao={regiao} sessoesAuth={student?.sessoesAuth||0} />}
            </CollapsibleSub>
          </CollapsibleSection>

          <CollapsibleSection title="Queixa Principal e Anamnese" icon="📝" expanded={expandedSections.includes("queixa")} onToggle={()=>toggleSection("queixa")}>
            <div style={{background:C.redBg,border:`1.5px solid ${C.red}`,borderRadius:12,padding:"12px 14px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <span style={{background:C.red,color:"#fff",fontSize:9,fontWeight:900,letterSpacing:"0.08em",padding:"2px 10px",borderRadius:4,lineHeight:"18px"}}>OBRIGATÓRIO</span>
                <span style={{fontSize:10,fontWeight:800,color:C.red,letterSpacing:"0.08em",textTransform:"uppercase"}}>Queixa principal</span>
              </div>
              <input type="text" value={queixaAtleta} onChange={e=>setQueixaAtleta(e.target.value)} style={inp()} placeholder="Ex: Dor no ombro D no snatch, joelho no agachamento..." />
            </div>

            {kbList.length > 0 && (
              <div style={{background:C.greenBg,border:`1px solid ${C.green}40`,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:6}}>✓ Condição(ões) identificada(s): {kbList.slice(0,2).map(k=>k.label).join(", ")}{kbList.length>2&&` +${kbList.length-2}`}</div>
                {kbList[0]?.goldStandard&&<div style={{fontSize:11,color:C.textSub,lineHeight:1.6,marginBottom:8}}><strong style={{color:C.green}}>Padrão-ouro:</strong> {kbList[0].goldStandard}</div>}
                {kbList[0]?.escalas?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{kbList[0].escalas.map(s=><span key={s} style={{fontSize:10,color:C.amber,background:C.amberBg,border:`1px solid ${C.amber}30`,borderRadius:6,padding:"2px 8px"}}>{s}</span>)}</div>}
              </div>
            )}

            <div style={{marginBottom:12}}>
              <span style={{...lbl({color:C.red})}}>🚩 RED FLAGS — INVESTIGAR ANTES DE PROSSEGUIR</span>
              <TagSelect options={mergedRedFlags} value={enhancer.redFlags} onChange={enhancer.setRedFlags} activeColor={C.red} />
              {enhancer.redFlags.length > 0 && <div style={{fontSize:11,color:C.red,marginTop:4}}>⚠ {enhancer.redFlags.length} red flag(s) selecionada(s)</div>}
            </div>

            <CollapsibleSub title="Perfil do Atleta">
              <Row cols={isMobile?"1fr":"1fr 1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>Idade</span><input type="number" value={idadeAtleta} onChange={e=>setIdadeAtleta(e.target.value)} style={inp()} min={10} max={90} placeholder="28" /></div>
                <div><span style={lbl()}>Sexo</span><SingleSelect options={["Masculino","Feminino","Outro"]} value={sexoAtleta} onChange={setSexoAtleta} activeColor={C.amber} /></div>
                <div><span style={lbl()}>Tempo CrossFit</span><input type="text" value={tempoCrossfit} onChange={e=>setTempoCrossfit(e.target.value)} style={inp()} placeholder="2 anos" /></div>
              </Row>
              <div style={{marginTop:8}}><span style={lbl()}>Modalidades</span><TagSelect options={["CrossFit","Weightlifting","Gymnastics","Powerlifting","Endurance","Rowing","Calisthenics","Strongman"]} value={modalidades} onChange={setModalidades} activeColor={C.amber} /></div>
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px" style={{marginTop:8}}>
                <div><span style={lbl()}>Nível</span><SingleSelect options={["Iniciante","Intermediário","Avançado","Elite/Competidor"]} value={nivelAtleta} onChange={setNivelAtleta} activeColor={C.amber} /></div>
                <div><span style={lbl()}>Frequência semanal</span><input type="number" value={frequenciaSemanal} onChange={e=>setFrequenciaSemanal(e.target.value)} style={inp()} min={1} max={14} placeholder="5" /></div>
              </Row>
              <div style={{marginTop:8}}><span style={lbl()}>Objetivos</span><TagSelect options={["Ganho de força","Emagrecimento","Condicionamento","Competição","Técnica olímpico","Resistência","Mobilidade"]} value={objetivos} onChange={setObjetivos} activeColor={C.amber} /></div>
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px" style={{marginTop:8}}>
                <div style={{gridColumn:isMobile?"1":"span 2"}}><span style={lbl()}>Lesões prévias</span><TagSelect options={["Ombro","Coluna lombar","Joelho","Quadril","Punho","Tornozelo","Cotovelo","Nenhuma"]} value={lesoesPrevias} onChange={setLesoesPrevias} activeColor={C.red} /></div>
                <div><span style={lbl()}>Restrições</span><TagSelect options={["Snatch","Clean & Jerk","Back squat","Overhead squat","Muscle-up","Handstand push-up","Burpee","Double-under","Kipping pull-up","Box jump","Nenhuma"]} value={restricoesMovimentos} onChange={setRestricoesMovimentos} activeColor={C.amber} /></div>
              </Row>
            </CollapsibleSub>

            <CollapsibleSub title="CIF e DCT">
              {cifKeys.length>0?<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{cifEntries.slice(0,8).map(c=><span key={c.code} style={{fontSize:10,color:C.amber,background:C.amberBg,border:`1px solid ${C.amber}30`,borderRadius:6,padding:"2px 8px"}}><strong>{c.code}</strong>: {c.desc}</span>)}</div>:<span style={{fontSize:10,color:C.textMuted}}>Preencha o perfil para gerar CIF.</span>}
              <div><span style={lbl()}>Diagnóstico Cinesioterapêutico (DCT)</span><input type="text" value={diagnosticoCinesio} onChange={e=>setDiagnosticoCinesio(e.target.value)} style={inp()} placeholder="Ex: Disfunção de ombro no overhead" />
                {!diagnosticoCinesio&&dctSuggestion&&<button onClick={()=>setDiagnosticoCinesio(dctSuggestion)} style={{...ghostBtn({fontSize:10,marginTop:6}),borderStyle:"dashed"}}>💡 Sugerir DCT</button>}
              </div>
            </CollapsibleSub>

            <CollapsibleSub title="Yellow Flags (Fatores Psicossociais)">
              <TagSelect options={YELLOW_FLAGS_CF.map(f=>f.label)} value={yellowFlags} onChange={setYellowFlags} activeColor={C.amber} />
              {yellowFlags.length >= 3 && <div style={{marginTop:6,background:C.amberBg,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.amber,lineHeight:1.6}}>⚠️ {yellowFlags.length} yellow flags.</div>}
            </CollapsibleSub>
          </CollapsibleSection>

          <CollapsibleSection title="Dor e Funcionalidade" icon="⚡" expanded={expandedSections.includes("dor")} onToggle={()=>toggleSection("dor")}>
            <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
              <CollapsibleSub title="Escala de Dor (EVA)">
                <EvaSlider label="EVA — Movimento" value={evaMov} onChange={setEvaMov} colors={{text:C.text,textMuted:C.textMuted,card:C.card,border:C.border,font:F,accent:C.amber}} />
                <div style={{marginTop:8}}><EvaSlider label="EVA — Repouso" value={evaRep} onChange={setEvaRep} colors={{text:C.text,textMuted:C.textMuted,card:C.card,border:C.border,font:F,accent:C.amber}} /></div>
              </CollapsibleSub>
              <CollapsibleSub title="Localização e BodyMap">
                <div><span style={lbl()}>Local da dor</span><SingleSelect options={["Cabeça","Pescoço","Ombro","Lombar","Quadril","Joelho","Tornozelo","Punho","Generalizada"]} value={localDor} onChange={setLocalDor} activeColor={C.amber} /></div>
                <div style={{marginTop:10}}><BodyMap value={bodyPain} onChange={setBodyPain} colors={{mark:C.amber,...C}} /></div>
              </CollapsibleSub>
            </Row>
          </CollapsibleSection>

          <CollapsibleSection title="Exame Físico" icon="🔬" expanded={expandedSections.includes("exame")} onToggle={()=>toggleSection("exame")}>
            <CollapsibleSub title="Goniometria">
              {gonioRows.map((row,i)=><GonioRow key={i} joint={row.joint} ref={row.ref} l={row.l} r={row.r} index={i} onChange={(idx,side,val)=>setGonioRows(p=>{const z=[...p];z[idx]={...z[idx],[side]:val};return z})} style={{marginBottom:4}} />)}
            </CollapsibleSub>
            <CollapsibleSub title="Força Muscular (MRC 0-5)">
              {mrcRows.map((row,i)=><MRCRow key={i} muscle={row.muscle} value={row.value} index={i} onChange={(idx,val)=>setMrcRows(p=>{const z=[...p];z[idx]={...z[idx],value:val};return z})} style={{marginBottom:4}} />)}
            </CollapsibleSub>
            <CollapsibleSub title="Testes Especiais">
              {CF_TESTES.map(test=>{const active=testResults.some(t=>t.id===test.id);return <TestCard key={test.id} test={test} active={active} onToggle={()=>toggleTest(test.id)} onNotes={(id,notes)=>setTestResults(prev=>prev.map(t=>t.id===id?{...t,notes}:t))} colors={{accent:C.amber,...C}} />})}
            </CollapsibleSub>
          </CollapsibleSection>

          <CollapsibleSection title="Treinos e Métricas" icon="🏋️" expanded={expandedSections.includes("treinos")} onToggle={()=>toggleSection("treinos")}>
            <CollapsibleSub title="Registro de Treinos">
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>Data</span><input type="date" value={treinoData} onChange={e=>setTreinoData(e.target.value)} style={inp()} /></div>
                <div><span style={lbl()}>Tipo</span><SingleSelect options={["Strength","Metcon","Gymnastics","Weightlifting","Endurance","WOD"]} value={treinoTipo} onChange={setTreinoTipo} activeColor={C.amber} /></div>
              </Row>
              <div style={{marginTop:8}}><span style={lbl()}>Nome do WOD</span><input type="text" value={treinoNome} onChange={e=>setTreinoNome(e.target.value)} style={inp()} placeholder="Fran, Cindy..." /></div>
              <div style={{marginTop:8}}><span style={lbl()}>Descrição</span><textarea value={treinoDescricao} onChange={e=>setTreinoDescricao(e.target.value)} rows={2} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Rounds, reps, cargas..." /></div>
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px" style={{marginTop:8}}>
                <div><span style={lbl()}>Resultado</span><input type="text" value={treinoResultado} onChange={e=>setTreinoResultado(e.target.value)} style={inp()} placeholder="8:32, 95kg..." /></div>
                <div><span style={lbl()}>RPE (1-10)</span><input type="number" value={treinoRPE} onChange={e=>setTreinoRPE(e.target.value)} style={inp()} min={0} max={10} step={0.5} /></div>
              </Row>
              <button onClick={addTreino} style={primaryBtn({width:"100%",justifyContent:"center",padding:"10px",marginTop:8})}>+ Adicionar Treino</button>
              {historicoTreinos.length>0&&<div style={{marginTop:8,maxHeight:200,overflowY:"auto"}}>{historicoTreinos.slice(0,15).map(t=><div key={t.id} style={{background:C.cardAlt,borderRadius:6,padding:"6px 10px",marginBottom:3,fontSize:11,display:"flex",justifyContent:"space-between"}}><span>{t.data} — <strong>{t.nome}</strong></span><span style={{color:C.textMuted}}>{t.resultado}</span></div>)}</div>}
            </CollapsibleSub>
            <CollapsibleSub title="Benchmark WODs">
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:6}}>
                {["Fran (21-15-9: Thruster + Pull-up)","Helen (3 rounds: 400m + 21 KB + 12 PU)","Cindy (AMRAP 20: 5 PU + 10 PP + 15 SQ)","Grace (30 C&J for time)","Isabel (30 snatch for time)","Diane (21-15-9: DL + HSPU)","Annie (50-40-30-20-10: DU + sit-up)","Karen (150 wall balls)","Kelly (5 rounds: 400m + 30 BJ + 30 WB)"].map(b=>(
                  <div key={b} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 10px",fontSize:11,cursor:"pointer"}} onClick={()=>{setTreinoNome(b.split(" (")[0]);setTreinoDescricao(b)}}>
                    <div style={{fontWeight:700,color:C.amber}}>{b.split(" (")[0]}</div>
                    <div style={{fontSize:9,color:C.textMuted,marginTop:2}}>{b.split(" (")[1]?.replace(")","")}</div>
                  </div>
                ))}
              </div>
            </CollapsibleSub>
            <CollapsibleSub title="1RM Tracking">
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"1fr 1fr 1fr",gap:10}}>
                <NumericField label="Snatch" value={snatchRM} onChange={setSnatchRM} unit="kg" min={0} max={300} step={0.5} />
                <NumericField label="Clean & Jerk" value={cleanJerkRM} onChange={setCleanJerkRM} unit="kg" min={0} max={400} step={0.5} />
                <NumericField label="Back Squat" value={backSquatRM} onChange={setBackSquatRM} unit="kg" min={0} max={500} step={0.5} />
                <NumericField label="Front Squat" value={frontSquatRM} onChange={setFrontSquatRM} unit="kg" min={0} max={400} step={0.5} />
                <NumericField label="Deadlift" value={deadliftRM} onChange={setDeadliftRM} unit="kg" min={0} max={500} step={0.5} />
                <NumericField label="Bench Press" value={benchPressRM} onChange={setBenchPressRM} unit="kg" min={0} max={400} step={0.5} />
                <NumericField label="Shoulder Press" value={shoulderPressRM} onChange={setShoulderPressRM} unit="kg" min={0} max={300} step={0.5} />
              </div>
              {snatchRM&&cleanJerkRM&&<div style={{marginTop:10,background:C.amberBg,border:`1px solid ${C.amber}40`,borderRadius:8,padding:"10px",textAlign:"center"}}><span style={{fontSize:10,fontWeight:800,color:C.amber,textTransform:"uppercase"}}>Total Olímpico </span><span style={{fontSize:24,fontWeight:900,color:C.amber}}>{parseFloat(snatchRM||0)+parseFloat(cleanJerkRM||0)} kg</span></div>}
            </CollapsibleSub>
          </CollapsibleSection>

          <CollapsibleSection title="Observações Clínicas" icon="💬" expanded={expandedSections.includes("obs")} onToggle={()=>toggleSection("obs")}>
            <span style={lbl()}>Evolução do Atleta</span>
            <textarea value={evolucao} onChange={e=>setEvolucao(e.target.value)} rows={4} style={{...inp({resize:"vertical",lineHeight:1.6})}} placeholder="Progressão de cargas, melhora de condicionamento, ajustes técnicos..." />
          </CollapsibleSection>

          <CollapsibleSection title="Análise por Inteligência Artificial — Baseada em Evidências" icon="🤖" expanded={expandedSections.includes("ia")} onToggle={()=>toggleSection("ia")}>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.6}}>Preencha os campos e clique em analisar.</div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <button onClick={()=>{if(aiRemaining<=0&&!canUseFeature?.("ai")){if(plan==="trial"){onUpgrade?.();return}enhancer.runAI(true);return}enhancer.runAI()}} style={primaryBtn({padding:"10px 20px"})}>🔍 Gerar análise clínica</button>
              {canUseFeature?.("ai")&&<span style={{fontSize:11,color:aiRemaining<10?C.amber:C.textMuted}}>📊 {aiRemaining}/{aiLimit}</span>}
              {!canUseFeature?.("ai")&&<span style={{fontSize:11,color:C.textMuted}}>{hasExpansion&&aiRemaining>0?`✅ ${aiRemaining} crédito(s)`:plan==="trial"?<><span style={{color:C.amber,fontWeight:600}}>🎯 Fim do teste. </span><button onClick={()=>onUpgrade?.()} style={{background:"none",border:"none",color:C.green,fontWeight:700,cursor:"pointer",fontSize:11,fontFamily:F,textDecoration:"underline",padding:0}}>Escolher plano</button></>:<span>R$ 5,90 por análise avulsa.</span>}</span>}
            </div>
            {enhancer.aiRes&&<div style={{marginTop:12,background:C.greenBg,border:`1px solid ${C.green}40`,borderRadius:10,padding:"14px 16px"}}><div style={{fontSize:10,fontWeight:800,color:C.green,textTransform:"uppercase",marginBottom:8}}>ANÁLISE CLÍNICA — SASYRA IA</div><pre style={{fontSize:13,color:C.text,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:F,margin:0}}>{enhancer.aiRes}</pre></div>}
          </CollapsibleSection>

          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:4}}>
            <button onClick={()=>{handleSave();handleSaveAssessment()}} style={primaryBtn({padding:"11px 26px",fontSize:14})}>💾 Salvar Avaliação Completa</button>
          </div>
        </>}

        {/* ════════ TAB: EVIDÊNCIAS ════════ */}
        {tab === "evidencias" && (
          <Section title="Diretrizes e Evidências em CrossFit" icon="🔬">
            <div style={{fontSize:13,color:C.textMuted,marginBottom:14,lineHeight:1.6}}>Diretrizes baseadas em evidências para atletas de CrossFit.</div>
            {Object.entries(CF_EVIDENCE).map(([key,condition])=>{
              const active=lesoesPrevias.some(l=>l.toLowerCase().includes(key.replace(/_/g," ").split(" ")[0]))||restricoesMovimentos.some(r=>r.toLowerCase().includes(key.replace(/_/g," ").split(" ")[0]));
              return (
                <div key={key} style={{...card(),border:active?`1px solid ${C.amber}50`:`1px solid ${C.border}`,opacity:active?1:0.6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    {active&&<span style={{fontSize:10,fontWeight:800,color:C.amber,background:C.amberBg,padding:"2px 8px",borderRadius:6}}>Condição identificada ✓</span>}
                    <span style={{fontWeight:700,fontSize:14,color:C.text}}>{condition.label}</span>
                  </div>
                  <div style={{fontSize:12,color:C.textSub,lineHeight:1.7,marginBottom:8}}>{condition.goldStandard}</div>
                  {condition.escalas&&<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{condition.escalas.map(s=><span key={s} style={{fontSize:10,color:C.amber,background:C.amberBg,border:`1px solid ${C.amber}30`,borderRadius:6,padding:"2px 8px"}}>{s}</span>)}</div>}
                  {condition.referencias?.map((ref,i)=><div key={i} style={{marginTop:6,fontSize:10,color:C.blue}}><a href={ref.url} target="_blank" rel="noopener noreferrer" style={{color:C.blue}}>{ref.id} — {ref.title}</a></div>)}
                  {condition.redFlags&&<div style={{marginTop:6,display:"flex",flexWrap:"wrap",gap:4}}>{condition.redFlags.map(r=><span key={r} style={{fontSize:10,color:C.red,background:C.redBg,border:`1px solid ${C.red}30`,borderRadius:6,padding:"2px 8px"}}>🚩 {r}</span>)}</div>}
                </div>
              );
            })}
          </Section>
        )}

        {/* ════════ TAB: EVOLUÇÃO ════════ */}
        {tab === "evolucao" && (
          <>
            {enhancer.redFlags.length > 0 && (
              <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
                flags={mergedRedFlags} colors={cfColors} />
            )}
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={cfColors} sessionLabel="Evolução" specialty="crossfit" defaultExpanded={true} pain={enhancer.pain} setPain={enhancer.setPain} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Atleta: ${student?.nome || "—"}\nNível: ${nivelAtleta}\nQueixa: ${queixaAtleta}\nModalidades: ${modalidades.join(", ")}\nLesões: ${lesoesPrevias.join(", ")}\nRestrições: ${restricoesMovimentos.join(", ")}\nObjetivos: ${objetivos.join(", ")}\nEVA Mov: ${enhancer.pain.evaMov || evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep || evaRep}/10\nDor local: ${enhancer.pain.localDor || localDor}\nSnatch: ${snatchRM || "—"}kg\nC&J: ${cleanJerkRM || "—"}kg\nBack SQ: ${backSquatRM || "—"}kg\nTreinos: ${historicoTreinos.length}\nYellow Flags: ${yellowFlags.join(", ")}\nDCT: ${diagnosticoCinesio}\nEvolução: ${evolucao}`}
              colors={cfColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {/* ════════ TAB: RELATÓRIO ════════ */}
        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="CrossFit" colors={cfColors} />
        )}
      </div>
    </div>
  );
}
