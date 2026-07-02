import { useState, useEffect } from "react";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import { AudioField, BodyMap, EvaSlider, TagSelect, SingleSelect, GonioRow, MRCRow, TestCard, Row, HonorariosCard } from "../components";
import { useMediaQuery } from "../components";
import { useClinicalScan } from "../hooks/useClinicalScan.js";
import { useSemanticScanner } from "../hooks/useSemanticScanner.js";
import { detectLocalDor, extractClinicalEntities } from "../utils/clinicalDetection.js";
import { CIF } from "../data/cif.js";

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

function CollapsibleSection({ title, icon, badge, expanded, onToggle, children }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ ...card(), padding: isMobile ? "14px 12px" : "20px 22px", cursor:"pointer" }} onClick={onToggle}>
      <div style={{ display:"flex", alignItems:"center", gap:8, paddingBottom:expanded?12:0, borderBottom:expanded?`1px solid ${C.border}`:"none", marginBottom:expanded?isMobile?14:18:0 }}>
        <span style={{ fontSize:10, color:C.textMuted, transition:"transform 0.15s", transform:expanded?"rotate(90deg)":"rotate(0deg)" }}>▶</span>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:isMobile?11:12, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:C.blue, flex:1 }}>{title}</h3>
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

// ── SAVE / LOAD ──────────────────────────────────────────────────────────────
function savePedData(studentId, data) {
  try { localStorage.setItem(`ped_data_${studentId}`, JSON.stringify(data)); } catch { }
}
function loadPedData(studentId) {
  try { const d = localStorage.getItem(`ped_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

// ── ASSESSMENT HISTORY ──────────────────────────────────────────────────────
const PED_HISTORY_KEY = "ped_history_";
function loadHistory(sid) {
  try { const d = localStorage.getItem(PED_HISTORY_KEY + sid); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveHistory(sid, history) {
  try { localStorage.setItem(PED_HISTORY_KEY + sid, JSON.stringify(history)); } catch { }
}

// ── PEDIATRIC GONIOMETRY ────────────────────────────────────────────────────
const PED_GONIO_DEFAULT = [
  { joint:"Quadril — Flexão", ref:"120° (0-145)", l:"", r:"" },
  { joint:"Quadril — Extensão", ref:"30° (0-45)", l:"", r:"" },
  { joint:"Quadril — Abdução", ref:"45° (0-60)", l:"", r:"" },
  { joint:"Quadril — Rotação externa", ref:"45° (0-60)", l:"", r:"" },
  { joint:"Quadril — Rotação interna", ref:"35° (0-50)", l:"", r:"" },
  { joint:"Joelho — Flexão", ref:"135° (120-150)", l:"", r:"" },
  { joint:"Joelho — Extensão", ref:"0° (-10-0)", l:"", r:"" },
  { joint:"Tornozelo — Flexão dorsal", ref:"20° (10-30)", l:"", r:"" },
  { joint:"Tornozelo — Flexão plantar", ref:"50° (30-60)", l:"", r:"" },
  { joint:"Ombro — Flexão", ref:"180° (170-190)", l:"", r:"" },
  { joint:"Ombro — Abdução", ref:"180° (170-190)", l:"", r:"" },
  { joint:"Ombro — Rotação externa", ref:"90° (80-100)", l:"", r:"" },
  { joint:"Ombro — Rotação interna", ref:"70° (60-80)", l:"", r:"" },
  { joint:"Cotovelo — Flexão", ref:"145° (130-160)", l:"", r:"" },
  { joint:"Cotovelo — Extensão", ref:"0° (-5-0)", l:"", r:"" },
  { joint:"Punho — Flexão", ref:"80° (70-90)", l:"", r:"" },
  { joint:"Punho — Extensão", ref:"70° (60-80)", l:"", r:"" },
];

// ── PEDIATRIC MRC ────────────────────────────────────────────────────────────
const PED_MRC_DEFAULT = [
  { muscle:"Flexores de quadril (L1-L2)", value:5 },
  { muscle:"Extensores de quadril (L4-S1)", value:5 },
  { muscle:"Extensores de joelho (L3-L4)", value:5 },
  { muscle:"Flexores de joelho (L5-S1)", value:5 },
  { muscle:"Flexores dorsais (L4-L5)", value:5 },
  { muscle:"Flexores plantares (S1-S2)", value:5 },
  { muscle:"Abdutores de quadril (L4-S1)", value:5 },
  { muscle:"Flexores de ombro (C5-C6)", value:5 },
  { muscle:"Extensores de cotovelo (C7-C8)", value:5 },
  { muscle:"Flexores de cotovelo (C5-C6)", value:5 },
  { muscle:"Extensores de punho (C6-C7)", value:5 },
  { muscle:"Apertar mão (C8-T1)", value:5 },
];

// ── PEDIATRIC SPECIAL TESTS ─────────────────────────────────────────────────
const PED_TESTES = [
  { id:"denver_ii", name:"Triagem DENVER II", area:"Desenvolvimento", desc:"Avalia motor grosso, motor fino, linguagem e pessoal-social em crianças 0-6a. Itens-chave para marcos etários.", video:"https://www.youtube.com/watch?v=example1" },
  { id:"gmfm_66", name:"GMFM-66 (Gross Motor Function Measure)", area:"Função Motora Grossa", desc:"66 itens em 5 dimensões: deitar/rolar, sentar, engatinhar/ajoelhar, em pé, andar/correr/pular. Gold standard para PC.", video:"https://www.youtube.com/watch?v=example2" },
  { id:"alberta_infant", name:"AIMS (Alberta Infant Motor Scale)", area:"Desenvolvimento Motor", desc:"Avalia 58 itens em 4 posturas: prono, supino, sentado, em pé. Do nascimento até marcha independente.", video:"https://www.youtube.com/watch?v=example3" },
  { id:"pedi_cat", name:"PEDI-CAT", area:"AVDs", desc:"Avalia mobilidade, autocuidado e função social em crianças. Score normativo por idade.", video:"https://www.youtube.com/watch?v=example4" },
  { id:"mchat_r", name:"M-CHAT R/F", area:"Triagem TEA", desc:"23 itens de rastreio para autismo (16-30 meses). Follow-up interview confirma risco.", video:"https://www.youtube.com/watch?v=example5" },
  { id:"bayley_iv", name:"Bayley-IV (Bayley Scales)", area:"Desenvolvimento Infantil", desc:"Escala de desenvolvimento infantil (1-42 meses). Avalia cognitivo, linguagem, motor, socioemocional.", video:"https://www.youtube.com/watch?v=example6" },
  { id:"ped_sensory", name:"Perfil Sensorial 2 (SP-2)", area:"Integração Sensorial", desc:"Avalia padrões de processamento sensorial em crianças 0-14a. Quadrantes: busca, evitação, sensibilidade, registro.", video:"https://www.youtube.com/watch?v=example7" },
  { id:"tug_pediatric", name:"TUG Pediátrico (Timed Up and Go)", area:"Mobilidade/Marcha", desc:"Cronometra levantar, andar 3m, virar, voltar e sentar. Referência ≥3,5s para risco de queda.", video:"https://www.youtube.com/watch?v=example8" },
  { id:"six_min_walk", name:"TC6M Pediátrico (Teste de Caminhada 6 min)", area:"Capacidade Funcional", desc:"Distância percorrida em 6 min. Referência por idade/sexo. Avalia endurance e resposta ao tratamento.", video:"https://www.youtube.com/watch?v=example9" },
  { id:"ped_balance", name:"Escala de Equilíbrio Pediátrica (PBS)", area:"Equilíbrio", desc:"14 itens da Berg adaptada para crianças (0-56). ≤40 indica risco de queda.", video:"https://www.youtube.com/watch?v=example10" },
];

// ── PEDIATRIC EVIDENCE KB ───────────────────────────────────────────────────
const PEDIATRIC_EVIDENCE = {
  paralisia_cerebral: {
    label:"Paralisia Cerebral",
    goldStandard:"Terapia orientada a tarefa + CIMT (Constraint-Induced Movement Therapy) para membro superior. GMFCS como prognóstico funcional. Manejo de espasticidade (toxina botulínica, órteses seriadas). Treino de marcha com suporte parcial se deambulador. Abordagem centrada na família com treino de AVDs.",
    escalas:["GMFCS","MACS","MIF","PEDI","GMFM"],
    redFlags:["Irritabilidade sem causa aparente","Dificuldade alimentar progressiva","Postura assimétrica persistente","Atraso motor >2 marcos","Opistótono / hiperextensão cervical"],
  },
  sindrome_down: {
    label:"Síndrome de Down",
    goldStandard:"Estimulação precoce com intervenção neuropsicomotora desde o diagnóstico. Hidroterapia para fortalecimento e coordenação. Treino de equilíbrio e marcha. Fortalecimento muscular global. Incentivo à participação em esportes adaptados. Monitoramento de instabilidade atlantoaxial.",
    escalas:["GMFCS","MIF","PEDI","Escala de Desenvolvimento Motor"],
    redFlags:["Hipotonia severa com dificuldade respiratória","Instabilidade atlantoaxial suspeita","Cianose / sopro cardíaco (investigar cardiopatia)","Atraso motor grave sem progresso","Disfagia com broncoaspiração de repetição"],
  },
  tea: {
    label:"Transtorno do Espectro Autista",
    goldStandard:"Integração sensorial baseada na teoria de Ayres. Estratégias visuais e rotinas estruturadas (TEACCH). Intervenção precoce ESDM. Treino de habilidades sociais e comunicação funcional. Fisioterapia focada em coordenação motora grossa e equilíbrio.",
    escalas:["PEDI","MIF","MABC-2","Perfil Sensorial 2"],
    redFlags:["Regressão de habilidades adquiridas","Autoagressão / heteroagressão","Crise de agitação psicomotora prolongada","Recusa alimentar total","Fuga / risco de segurança"],
  },
  mielomeningocele: {
    label:"Mielomeningocele",
    goldStandard:"Treino de marcha com AFO/KAFO/RGO conforme nível lesional. Cuidados de pele para prevenção de úlceras. Programa de alongamento para contraturas. Treino de transferências. Cateterismo vesical intermitente se bexiga neurogênica. Monitoramento de hidrocefalia (DP shunt).",
    escalas:["GMFCS","MIF","PEDI","FAC"],
    redFlags:["Febre + vômito (suspeita de infecção de shunt)","Hipertensão intracraniana (fontanela tensa)","Lesão de pele / úlcera por pressão","Piora súbita de força em MMSS","Retenção urinária aguda"],
  },
  distrofia_muscular: {
    label:"Distrofia Muscular de Duchenne",
    goldStandard:"Alongamento diário para prevenção de contraturas (Aquiles, isquiotibiais, flexores de quadril). Órteses noturnas. Treino respiratório com incentivador. Uso de corticoides (prednisona/defllazacorte) para prolongar deambulação. Ventilação não invasiva quando necessário. Evitar imobilização prolongada.",
    escalas:["Vignos","GMFCS","MIF","TC6M"],
    redFlags:["Dispneia súbita / desconforto respiratório","Queda da saturação <92%","Cardiomiopatia (sintomas de IC)","Impossibilidade súbita de deambular","Pseudo-hipertrofia com dor intensa"],
  },
  torcicolo_congenito: {
    label:"Torcicolo Congênito",
    goldStandard:"Alongamento passivo do ECM 3-5x/dia. Posicionamento adequado no berço e durante o sono. Mobilização ativa com estímulo visual para rotação contralateral. Tummy time supervisionado. Plagiocefalia posicional requer reposicionamento; em casos refratários, órtese craniana (capacete).",
    escalas:["Cervical ROM","GMFCS"],
    redFlags:["Ausência de melhora após 6 meses de alongamento","Massem cervical fixa / endurecida","Estrabismo / assimetria facial progressiva","Irritabilidade constante","Sinais de hipertensão intracraniana"],
  },
};

// ── CIF AUTO KEYS ────────────────────────────────────────────────────────────
function autoCIFKeys({ gmfcs, aimsScore, tonus, marcosMotores, comorbidades, coordenacao, queixaPrincipal, diagnosticoMedico, pain }) {
  const keys = [];
  if (gmfcs) {
    const g = parseInt(gmfcs) || (gmfcs === "I" ? 1 : gmfcs === "II" ? 2 : gmfcs === "III" ? 3 : gmfcs === "IV" ? 4 : gmfcs === "V" ? 5 : 1);
    if (g <= 2) keys.push("d450"); // walking
    else keys.push("d460"); // moving around
    keys.push("d410"); // changing body position
  }
  if (tonus === "Espástico") keys.push("b735");
  if (tonus === "Hipotônico") keys.push("b735");
  if (aimsScore && Number(aimsScore) < 25) keys.push("b760");
  if (coordenacao.length > 0 && (coordenacao.includes("Ataxia") || coordenacao.includes("Dismetria"))) keys.push("b760");
  if (marcosMotores.length > 0) {
    if (!marcosMotores.includes("Sustentação cervical")) keys.push("b765");
    if (!marcosMotores.includes("Andar")) keys.push("d450");
  }
  if (comorbidades.some(c => c.toLowerCase().includes("paralisia cerebral"))) keys.push("b770");
  if (queixaPrincipal.toLowerCase().includes("marcha") || diagnosticoMedico.toLowerCase().includes("marcha")) keys.push("d450");
  if (pain?.evaRep > 0 || pain?.evaMov > 0) keys.push("b280");
  return [...new Set(keys)];
}

// ── KB CONDITIONS ────────────────────────────────────────────────────────────
function detectKBList(comorbidades, diagnosticoMedico, queixaPrincipal) {
  const text = [diagnosticoMedico, queixaPrincipal, ...comorbidades].join(" ").toLowerCase();
  return Object.entries(PEDIATRIC_EVIDENCE)
    .filter(([key]) => text.includes(key.replace(/_/g, " ")) || comorbidades.some(c => c.toLowerCase().includes(key.replace(/_/g, " "))))
    .map(([key, val]) => ({ key, label: val.label, ...val }));
}

const CREFITO_REGIOES = {
  "Sul (RS/SC/PR)":{consulta:180,sessao:160,avaliacao:250,relatorio:120},
  "Sudeste - SP":{consulta:220,sessao:200,avaliacao:320,relatorio:150},
  "Sudeste - RJ/ES/MG":{consulta:190,sessao:170,avaliacao:280,relatorio:130},
  "Centro-Oeste":{consulta:170,sessao:150,avaliacao:240,relatorio:110},
  "Nordeste":{consulta:150,sessao:140,avaliacao:220,relatorio:100},
  "Norte":{consulta:140,sessao:130,avaliacao:210,relatorio:95},
};

// ── YELLOW FLAGS ─────────────────────────────────────────────────────────────
const YELLOW_FLAGS_PED = [
  { id:"escola", label:"Baixa frequência escolar / isolamento social" },
  { id:"familia", label:"Conflitos familiares / superproteção" },
  { id:"adesao", label:"Baixa adesão ao tratamento domiciliar" },
  { id:"emocional", label:"Sinais de ansiedade/depressão na criança" },
  { id:"cuidador", label:"Cuidador com sobrecarga / esgotamento" },
  { id:"expectativa", label:"Expectativas irreais de recuperação" },
  { id:"segundopiniao", label:"Busca excessiva de segunda opinião" },
  { id:"litigio", label:"Processo judicial / litígio" },
];

// ── MERGED RED FLAGS ─────────────────────────────────────────────────────────
function getMergedRedFlags(kbList) {
  const base = [
    "Febre ≥38°C (risco infeccioso)","Sonolência/letargia","Hipoatividade súbita",
    "Recusa alimentar progressiva","Cianose / desconforto respiratório",
    "Convulsão recente","Vômitos em jato / hipertensão intracraniana","Assimetria de força súbita",
  ];
  const fromKB = kbList.flatMap(k => k.redFlags || []);
  return [...new Set([...base, ...fromKB])];
}

// ── DCT AUTO-SUGGESTION ─────────────────────────────────────────────────────
function suggestDCT(comorbidades, diagnosticoMedico, tonus, gmfcs) {
  if (comorbidades.includes("Paralisia cerebral") || diagnosticoMedico.toLowerCase().includes("paralisia cerebral"))
    return "Hemiparesia/ diparesia espástica com limitação funcional na marcha e AVDs, GMFCS " + (gmfcs || "II") + ", necessitando de cinesioterapia para ganho de força, ADM e controle motor seletivo.";
  if (comorbidades.includes("Síndrome de Down") || diagnosticoMedico.toLowerCase().includes("sindrome de down"))
    return "Hipotonia generalizada com atraso nas aquisições motoras, necessitando de estimulação neuropsicomotora precoce para alcance de marcos do desenvolvimento.";
  if (comorbidades.includes("Distrofia muscular") || diagnosticoMedico.toLowerCase().includes("distrofia"))
    return "Fraqueza muscular progressiva de cinturas com limitação na deambulação e AVDs, necessitando de alongamentos, fortalecimento preservado e treino funcional para retardar perda de função.";
  if (comorbidades.includes("Mielomeningocele") || diagnosticoMedico.toLowerCase().includes("mielomeningocele"))
    return "Paraplegia flácida nível " + (diagnosticoMedico.toLowerCase().includes("lombar") ? "lombar" : "torácico baixo") + " com bexiga neurogênica, necessitando de órteses e treino de marcha assistida.";
  if (comorbidades.includes("TEA") || diagnosticoMedico.toLowerCase().includes("autista"))
    return "Atraso motor com alterações sensoriais e de coordenação, necessitando de terapia de integração sensorial e estímulo ao desenvolvimento motor global.";
  return "";
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Pediatria({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById, plan, onUpgrade, canUseFeature, tryFeature, aiRemaining, aiLimit, hasExpansion, purchaseAIExpansion }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("avaliacao");

  // Anamnese
  const [queixaPrincipal, setQueixaPrincipal] = useState("");
  const [diagnosticoMedico, setDiagnosticoMedico] = useState("");
  const [historiaGestacional, setHistoriaGestacional] = useState("");
  const [tipoParto, setTipoParto] = useState("");
  const [prematuridade, setPrematuridade] = useState("");
  const [apgar, setApgar] = useState("");
  const [marcosMotores, setMarcosMotores] = useState([]);
  const [comorbidades, setComorbidades] = useState([]);

  // Exame físico
  const [tonus, setTonus] = useState("");
  const [reflexosPrimitivos, setReflexosPrimitivos] = useState([]);
  const [coordenacao, setCoordenacao] = useState([]);

  // Escalas
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

  // Advanced features
  const [diagnosticoCinesio, setDiagnosticoCinesio] = useState("");
  const [yellowFlags, setYellowFlags] = useState([]);
  const [evaMov, setEvaMov] = useState(0);
  const [evaRep, setEvaRep] = useState(0);
  const [localDor, setLocalDor] = useState([]);
  const [bodyPain, setBodyPain] = useState([]);
  const [gonioRows, setGonioRows] = useState(JSON.parse(JSON.stringify(PED_GONIO_DEFAULT)));
  const [mrcRows, setMrcRows] = useState(JSON.parse(JSON.stringify(PED_MRC_DEFAULT)));
  const [testResults, setTestResults] = useState([]);
  const [regiao, setRegiao] = useState("");
  const [expandedSections, setExpandedSections] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const sid = student?.id || student?.nome;
  const isMobile = useMediaQuery("(max-width:767px)");
  const enhancer = useEnhancer("pediatria", sid, `ped_enhancer_${sid}`);
  const pedColors = { ...C, accent: C.blue, font: F };

  // ── KB Detection ─────────────────────────────────────────────────────────
  const kbList = detectKBList(comorbidades, diagnosticoMedico, queixaPrincipal);

  // ── Clinical Scan ─────────────────────────────────────────────────────────
  const { scan } = useClinicalScan();
  const { semanticScan } = useSemanticScanner();

  // ── Auto CIF ──────────────────────────────────────────────────────────────
  const cifKeys = autoCIFKeys({ gmfcs, aimsScore, tonus, marcosMotores, comorbidades, coordenacao, queixaPrincipal, diagnosticoMedico, pain: enhancer.pain });
  const CIF_ENTRIES = Object.entries(CIF).map(([code, desc]) => ({ code, desc }));
  const cifEntries = CIF_ENTRIES.filter(c => cifKeys.includes(c.code));

  // ── Merged Red Flags ──────────────────────────────────────────────────────
  const mergedRedFlags = getMergedRedFlags(kbList);

  // ── DCT suggestion ────────────────────────────────────────────────────────
  const dctSuggestion = suggestDCT(comorbidades, diagnosticoMedico, tonus, gmfcs);

  // ── Expand/Collapse ──────────────────────────────────────────────────────
  const toggleSection = (id) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
    );
  };

  // ── Load ─────────────────────────────────────────────────────────────────
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
        setDiagnosticoCinesio(saved.diagnosticoCinesio || "");
        setYellowFlags(saved.yellowFlags || []);
        setEvaMov(saved.evaMov || 0);
        setEvaRep(saved.evaRep || 0);
        setLocalDor(saved.localDor || []);
        setBodyPain(saved.bodyPain || []);
        setGonioRows(saved.gonioRows || JSON.parse(JSON.stringify(PED_GONIO_DEFAULT)));
        setMrcRows(saved.mrcRows || JSON.parse(JSON.stringify(PED_MRC_DEFAULT)));
        setTestResults(saved.testResults || []);
        setExpandedSections(saved.expandedSections || []);
        if (saved.pain) enhancer.setPain(saved.pain);
        if (saved.logs) enhancer.setLogs(saved.logs);
        if (saved.redFlags) enhancer.setRedFlags(saved.redFlags);
        if (saved.aiRes) enhancer.setAiRes(saved.aiRes);
      } else {
        setExpandedSections(["identificacao"]);
      }
      setAssessmentHistory(loadHistory(sid));
    }
  }, [student?.id, student?.nome]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    const sid = student.id || student.nome;
    savePedData(sid, {
      queixaPrincipal, diagnosticoMedico, historiaGestacional, tipoParto, prematuridade, apgar,
      marcosMotores, comorbidades, tonus, reflexosPrimitivos, coordenacao,
      gmfcs, aimsScore, mchat,
      objetivosFuncionais, atividadesTerapeuticas, frequencia, orientacoesCuidador,
      evolucao, diagnosticoCinesio, yellowFlags, evaMov, evaRep, localDor, bodyPain,
      gonioRows, mrcRows, testResults, expandedSections,
      pain: enhancer.pain, logs: enhancer.logs, redFlags: enhancer.redFlags, aiRes: enhancer.aiRes,
      data: new Date().toISOString().slice(0,10),
    });
  };

  // ── Save Assessment History ──────────────────────────────────────────────
  const handleSaveAssessment = () => {
    if (!sid) return;
    handleSave();
    const entry = {
      id: Date.now(),
      data: new Date().toISOString().slice(0,10),
      hora: new Date().toLocaleTimeString("pt-BR", {hour:"2-digit",minute:"2-digit"}),
      queixa: queixaPrincipal,
      diagnostico: diagnosticoMedico,
      gmfcs, aims: aimsScore, mchat: mchat.length,
      tonus, comorbidades: [...comorbidades], evaMov, evaRep,
      gonioRows: JSON.parse(JSON.stringify(gonioRows)),
      mrcRows: JSON.parse(JSON.stringify(mrcRows)),
      testResults: [...testResults],
      yellowFlags: [...yellowFlags],
    };
    const history = loadHistory(sid);
    history.unshift(entry);
    if (history.length > 20) history.pop();
    saveHistory(sid, history);
    setAssessmentHistory(history);
  };

  const handleLoadAssessment = (entry) => {
    if (!entry) return;
    setQueixaPrincipal(entry.queixa || "");
    setDiagnosticoMedico(entry.diagnostico || "");
    setGmfcs(entry.gmfcs || "");
    setAimsScore(entry.aims || "");
    setMchat(entry.mchat ? Array(entry.mchat).fill("item") : []);
    setTonus(entry.tonus || "");
    setComorbidades(entry.comorbidades || []);
    setEvaMov(entry.evaMov || 0);
    setEvaRep(entry.evaRep || 0);
    setGonioRows(entry.gonioRows || JSON.parse(JSON.stringify(PED_GONIO_DEFAULT)));
    setMrcRows(entry.mrcRows || JSON.parse(JSON.stringify(PED_MRC_DEFAULT)));
    setTestResults(entry.testResults || []);
    setYellowFlags(entry.yellowFlags || []);
    setShowHistory(false);
  };

  const handleReset = () => {
    if (!window.confirm("Tem certeza? Todos os dados atuais serão perdidos.")) return;
    const sid = student.id || student.nome;
    localStorage.removeItem(`ped_data_${sid}`);
    window.location.reload();
  };

  // ── Test results toggle ──────────────────────────────────────────────────
  const toggleTest = (testId) => {
    setTestResults(prev => {
      if (prev.includes(testId)) return prev.filter(x => x !== testId);
      const newTest = { ...PED_TESTES.find(t => t.id === testId), result:"+", notes:"" };
      return [...prev, newTest];
    });
  };

  // ── Patient List View ─────────────────────────────────────────────────────
  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding: isMobile ? 12 : 24 }}>
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
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
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

      {/* Delete/Edit modals — same as original */}
      {deleteTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(62,39,35,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#FFFFFF", border:`2px solid ${C.red}50`, borderRadius:20, padding:"28px 32px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F, boxShadow:"0 8px 30px rgba(229,115,115,0.15)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>{deleteStep === 1 ? "😢" : "🔴"}</div>
            <div style={{ fontSize:17, fontWeight:800, color:C.red, marginBottom:8 }}>{deleteStep === 1 ? "Excluir paciente" : "Confirmação final"}</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16, padding:"10px 14px", background:"#F8F5F0", borderRadius:12, border:`1px solid ${C.border}` }}>{deleteTarget.nome}</div>
            {deleteStep === 1 ? (
              <>
                <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Deseja realmente excluir <strong>{deleteTarget.nome}</strong>?</div>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}
                    style={{ background:"#F8F5F0", border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
                  <button onClick={() => setDeleteStep(2)}
                    style={{ background:C.red, border:"none", borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize:13, color:C.textSub, marginBottom:16, lineHeight:1.6 }}>
                  Todos os dados de <strong>{deleteTarget.nome}</strong> serão perdidos permanentemente. <strong style={{color:C.red}}>Não pode ser desfeito</strong>.
                </div>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}
                    style={{ background:"#F8F5F0", border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
                  <button onClick={() => { onDeleteStudent(deleteTarget); setDeleteTarget(null); setDeleteStep(1); }}
                    style={{ background:C.red, border:"none", borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Sim, excluir</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {editTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(62,39,35,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => setEditTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#FFFFFF", border:`2px solid ${C.blue}50`, borderRadius:20, padding:"28px 32px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F, boxShadow:"0 8px 30px rgba(232,160,160,0.12)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:17, fontWeight:800, color:C.blue, marginBottom:8 }}>Editar dados</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Deseja editar os dados de <strong>{editTarget.nome}</strong>?</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setEditTarget(null)}
                style={{ background:"#F8F5F0", border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => {
                setF({ nome:editTarget.nome||"", dataNasc:editTarget.dataNasc||"", sexo:editTarget.sexo||"", profissao:editTarget.profissao||"", convenio:editTarget.convenio||"", telefone:editTarget.telefone||"", peso:editTarget.peso||"", altura:editTarget.altura||"" });
                setEditingStudent(editTarget);
                setEditTarget(null);
                setShowForm(true);
              }} style={{ background:C.blue, border:"none", borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F, boxShadow:"0 3px 10px rgba(232,160,160,0.25)" }}>Continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── Main Screen ──────────────────────────────────────────────────────────
  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>
      <div style={{ background:"#FFFFFF", borderBottom:`2px solid ${C.border}`, padding: isMobile ? "0 10px" : "0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height: isMobile ? 50 : 60, boxShadow:"0 2px 12px rgba(232,160,160,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })}>← Voltar</button>
          <span style={{ fontSize:12, fontWeight:800, color:C.blue }}>👶 Pediatria</span>
        </div>
        <div style={{ display:"flex", gap:4, overflowX: isMobile ? "auto" : "visible", flexShrink:1, msOverflowStyle:"none", scrollbarWidth:"none" }}>
          {[["avaliacao","📋",isMobile?"":"Avaliação"],["sessoes","📅",isMobile?"":"Sessões"],["relatorio","📊",isMobile?"":"Relatório"],["evidencias","🔬",isMobile?"":"Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.blueBg : "#F8F5F0",
              border: `1px solid ${tab === k ? C.blue + "50" : C.border}`,
              borderRadius: 30, padding: isMobile ? "8px 12px" : "8px 18px", fontSize: isMobile ? 11 : 12,
              fontWeight: tab === k ? 800 : 500,
              whiteSpace:"nowrap",
              color: tab === k ? C.blue : C.textSub, cursor: "pointer", fontFamily: F,
              boxShadow: tab === k ? "0 2px 8px rgba(232,160,160,0.2)" : "none",
            }}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {student?.nome && (
            <>
              <div style={{ width: isMobile ? 24 : 30, height: isMobile ? 24 : 30, background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile ? 10 : 13, fontWeight:800, color:C.blue }}>
                {student.nome[0]?.toUpperCase()}
              </div>
              {!isMobile && <span style={{ fontSize:12, color:C.textSub, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.nome}</span>}
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding: isMobile ? "12px 10px" : "20px 16px" }}>
        {/* ════════ TAB: AVALIAÇÃO ════════ */}
        {tab === "avaliacao" && <>
          {/* 📂 Histórico de Avaliações */}
          <Section title="Histórico de Avaliações" icon="📂">
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <select value="" onChange={e=>{const idx=Number(e.target.value);if(idx>=0&&assessmentHistory[idx])handleLoadAssessment(assessmentHistory[idx])}} style={{...sel({maxWidth:260,fontSize:12})}}>
                <option value="">Selecionar avaliação anterior...</option>
                {assessmentHistory.map((a,i)=><option key={a.id} value={i}>{a.data||""} — {(a.queixaPrincipal||"").slice(0,50)}</option>)}
              </select>
              <button onClick={handleSaveAssessment} style={primaryBtn({padding:"7px 16px",fontSize:12})}>💾 Salvar avaliação</button>
              <button onClick={handleReset} style={{...ghostBtn({padding:"7px 16px",fontSize:12}),color:C.amber,borderColor:`${C.amber}50`}}>🔄 Nova avaliação</button>
              {assessmentHistory.length > 0 && <span style={{fontSize:10,color:C.textMuted}}>{assessmentHistory.length} avaliação(ões) salva(s)</span>}
            </div>
          </Section>

          {/* 👤 Identificação do Paciente */}
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

          {/* 📝 Queixa Principal e Anamnese */}
          <CollapsibleSection title="Queixa Principal e Anamnese" icon="📝" expanded={expandedSections.includes("queixa")} onToggle={()=>toggleSection("queixa")}>
            <div style={{background:C.redBg,border:`1.5px solid ${C.red}`,borderRadius:12,padding:"12px 14px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <span style={{background:C.red,color:"#fff",fontSize:9,fontWeight:900,letterSpacing:"0.08em",padding:"2px 10px",borderRadius:4,lineHeight:"18px"}}>OBRIGATÓRIO</span>
                <span style={{fontSize:10,fontWeight:800,color:C.red,letterSpacing:"0.08em",textTransform:"uppercase"}}>Queixa principal</span>
              </div>
              <AudioField value={queixaPrincipal} onChange={v=>{const t=typeof v==="function"?v(queixaPrincipal):v;setQueixaPrincipal(t)}}
                placeholder="Ex: Atraso na marcha, não sustenta cervical, dificuldade para engatinhar..." rows={2} />
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

            <CollapsibleSub title="Caracterização da Dor">
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>Localização da dor</span><SingleSelect options={["Cabeça","Pescoço","Tronco","MMSS D","MMSS E","MMII D","MMII E","Generalizada"]} value={localDor} onChange={setLocalDor} activeColor={C.blue} /></div>
                <div><span style={lbl()}>Intensidade — EVA Movimento</span><EvaSlider value={evaMov} onChange={setEvaMov} color={C.blue} /></div>
              </Row>
              <div style={{marginTop:8}}><span style={lbl()}>Intensidade — EVA Repouso</span><EvaSlider value={evaRep} onChange={setEvaRep} color={C.blue} /></div>
            </CollapsibleSub>

            <CollapsibleSub title="História Gestacional e Perinatal">
              <Row cols={isMobile?"1fr":"1fr 1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>Tipo de parto</span><SingleSelect options={["Vaginal","Cesárea","Fórceps"]} value={tipoParto} onChange={setTipoParto} activeColor={C.blue} /></div>
                <div><span style={lbl()}>Prematuridade</span><SingleSelect options={["Não","Pré-termo (<37 sem)","Muito pré-termo (<32 sem)","Extremo (<28 sem)"]} value={prematuridade} onChange={setPrematuridade} activeColor={C.blue} /></div>
                <div><span style={lbl()}>APGAR</span><input type="number" value={apgar} onChange={e=>setApgar(e.target.value)} style={inp()} min={0} max={10} placeholder="Ex: 8/9" /></div>
              </Row>
              <div style={{marginTop:8}}><span style={lbl()}>História gestacional</span><textarea value={historiaGestacional} onChange={e=>setHistoriaGestacional(e.target.value)} rows={2} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Intercorrências, medicações, infecções, sofrimento fetal..." /></div>
              <div style={{marginTop:8}}><span style={lbl()}>Diagnóstico médico</span><input type="text" value={diagnosticoMedico} onChange={e=>setDiagnosticoMedico(e.target.value)} style={inp()} placeholder="Ex: Paralisia cerebral, Síndrome de Down..." /></div>
              <div style={{marginTop:8}}><span style={lbl()}>Marcos motores</span><TagSelect options={["Sustentação cervical","Sentar sem apoio","Engatinhar","Ficar em pé","Andar","Correr","Subir escadas"]} value={marcosMotores} onChange={setMarcosMotores} activeColor={C.blue} /></div>
              <div style={{marginTop:8}}><span style={lbl()}>Comorbidades</span><TagSelect options={["Paralisia cerebral","Mielomeningocele","Síndrome de Down","TEA","Distrofia muscular Duchenne","Atraso motor","Torcicolo congênito","Displasia de quadril"]} value={comorbidades} onChange={setComorbidades} activeColor={C.blue} /></div>
            </CollapsibleSub>

            <CollapsibleSub title="CIF — Classificação Internacional de Funcionalidade">
              {cifKeys.length === 0 && <div style={{fontSize:11,color:C.textMuted}}>Preencha GMFCS, tônus e escalas para gerar sugestões.</div>}
              {cifKeys.length > 0 && <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{cifEntries.slice(0,8).map(c=><span key={c.code} style={{fontSize:10,color:C.blue,background:C.blueBg,border:`1px solid ${C.blue}30`,borderRadius:6,padding:"2px 8px",lineHeight:1.6}}><strong>{c.code}</strong>: {c.desc}</span>)}</div>}
              <div style={{marginTop:8}}><span style={lbl()}>Diagnóstico Cinesioterapêutico (DCT)</span><input type="text" value={diagnosticoCinesio} onChange={e=>setDiagnosticoCinesio(e.target.value)} style={inp()} placeholder="Ex: Hemiparesia D com espasticidade e limitação funcional na marcha" />
                {!diagnosticoCinesio && dctSuggestion && <button onClick={()=>setDiagnosticoCinesio(dctSuggestion)} style={{...ghostBtn({fontSize:11,marginTop:6}),borderStyle:"dashed"}}>💡 Sugerir DCT: {dctSuggestion.slice(0,90)}…</button>}
              </div>
            </CollapsibleSub>

            <CollapsibleSub title="Yellow Flags (Fatores Psicossociais)">
              <TagSelect options={YELLOW_FLAGS_PED.map(f=>f.label)} value={yellowFlags} onChange={setYellowFlags} activeColor={C.amber} />
              {yellowFlags.length >= 3 && <div style={{marginTop:6,background:C.amberBg,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.amber,lineHeight:1.6}}>⚠️ {yellowFlags.length} yellow flags.</div>}
            </CollapsibleSub>
          </CollapsibleSection>

          {/* 🔬 Exame Físico */}
          <CollapsibleSection title="Exame Físico" icon="🔬" expanded={expandedSections.includes("exame")} onToggle={()=>toggleSection("exame")}>
            <CollapsibleSub title="Inspeção, Tônus e Coordenação">
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>Tônus muscular</span><SingleSelect options={["Hipotônico","Normal","Espástico","Hipertônico"]} value={tonus} onChange={setTonus} activeColor={C.blue} /></div>
                <div><span style={lbl()}>Coordenação</span><TagSelect options={["Adequada","Dismetria","Ataxia","Disdiadococinesia","Tremor intencional"]} value={coordenacao} onChange={setCoordenacao} activeColor={C.blue} /></div>
              </Row>
              <div style={{marginTop:8}}><span style={lbl()}>Reflexos primitivos</span><TagSelect options={["Reflexo de busca","Reflexo de sucção","Reflexo de Moro","Preensão palmar","Babinski presente"]} value={reflexosPrimitivos} onChange={setReflexosPrimitivos} activeColor={C.blue} /></div>
            </CollapsibleSub>

            <CollapsibleSub title="Escalas — GMFCS / AIMS / M-CHAT">
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>GMFCS</span><SingleSelect options={[{value:"I",label:"I — Deambula sem limitações"},{value:"II",label:"II — Deambula com limitações"},{value:"III",label:"III — Deambula com auxílio"},{value:"IV",label:"IV — Mobilidade limitada"},{value:"V",label:"V — Transportado em cadeira de rodas"}]} value={gmfcs} onChange={setGmfcs} activeColor={C.blue} /></div>
                <div><span style={lbl()}>AIMS (Alberta Infant Motor Scale)</span><input type="number" value={aimsScore} onChange={e=>setAimsScore(e.target.value)} style={inp()} min={0} max={58} placeholder="Ex: 24" /></div>
              </Row>
              {aimsScore&&<div style={{marginBottom:10,background:Number(aimsScore)>=25?C.greenBg:Number(aimsScore)>=10?C.amberBg:C.redBg,border:`1px solid ${Number(aimsScore)>=25?C.green:Number(aimsScore)>=10?C.amber:C.red}40`,borderRadius:8,padding:"8px 12px"}}><span style={{fontSize:11,fontWeight:700,color:Number(aimsScore)>=25?C.green:Number(aimsScore)>=10?C.amber:C.red}}>{Number(aimsScore)>=25?"🟢 Percentil ≥25 (adequado)":Number(aimsScore)>=10?"🟡 Percentil 10-25 (risco)":"🔴 Percentil <10 (atraso significativo)"}</span></div>}
              <div><span style={lbl()}>M-CHAT — Itens de alerta para TEA</span><TagSelect options={["Não responde ao próprio nome","Evita contato visual","Não aponta para pedir/mostrar","Atraso na fala","Movimentos repetitivos","Interesse restrito","Não imita","Não brinca de faz de conta","Hipersensibilidade sensorial","Hipo-sensibilidade sensorial","Não segue olhar","Não mostra objetos de interesse"]} value={mchat} onChange={setMchat} activeColor={C.blue} /></div>
              {mchat.length>0&&<div style={{marginTop:8,background:mchat.length>=3?C.redBg:mchat.length>=2?C.amberBg:C.greenBg,border:`1px solid ${mchat.length>=3?C.red:mchat.length>=2?C.amber:C.green}40`,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textSub}}>{mchat.length>=3?"🔴 ≥3 itens: Risco elevado":mchat.length>=2?"🟡 2 itens: Risco moderado":"🟢 <2 itens: Baixo risco (M-CHAT)"}</div>}
            </CollapsibleSub>

            <CollapsibleSub title="Força Muscular — MRC (0-5)">
              <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Graduação simplificada pediátrica (12 grupos musculares).</div>
              {mrcRows.map((row,i)=><MRCRow key={i} muscle={row.muscle} value={row.value} index={i} onChange={(idx,val)=>{setMrcRows(prev=>{const p=[...prev];p[idx]={...p[idx],value:val};return p})}} style={{marginBottom:4}} />)}
            </CollapsibleSub>
          </CollapsibleSection>

          {/* 📐 Goniometria */}
          <CollapsibleSection title="Goniometria" icon="📐" badge={`${gonioRows.filter(g=>g.l||g.r).length} med.`} expanded={expandedSections.includes("gonio")} onToggle={()=>toggleSection("gonio")}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>Valores de referência pediátricos entre parênteses.</div>
            {gonioRows.map((row,i)=><GonioRow key={i} joint={row.joint} ref={row.ref} l={row.l} r={row.r} index={i} onChange={(idx,side,val)=>{setGonioRows(prev=>{const p=[...prev];p[idx]={...p[idx],[side]:val};return p})}} style={{marginBottom:4}} />)}
          </CollapsibleSection>

          {/* 🧪 Testes Especiais */}
          <CollapsibleSection title="Testes Especiais Pediátricos" icon="🧪" expanded={expandedSections.includes("testes")} onToggle={()=>toggleSection("testes")}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>Toque em um teste para registrar como presente.</div>
            {PED_TESTES.map(test=>{
              const active=testResults.some(t=>t.id===test.id);
              return <TestCard key={test.id} test={test} active={active} onToggle={()=>toggleTest(test.id)} onNotes={(id,notes)=>{setTestResults(prev=>prev.map(t=>t.id===id?{...t,notes}:t))}} colors={{accent:C.blue,...C}} />
            })}
          </CollapsibleSection>

          {/* 💬 Observações Clínicas */}
          <CollapsibleSection title="Observações Clínicas" icon="💬" expanded={expandedSections.includes("obs")} onToggle={()=>toggleSection("obs")}>
            <CollapsibleSub title="Plano Terapêutico">
              <div style={{marginBottom:10}}><span style={lbl()}>Objetivos funcionais</span><textarea value={objetivosFuncionais} onChange={e=>setObjetivosFuncionais(e.target.value)} rows={2} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Alcançar marcha independente, melhorar equilíbrio de tronco..." /></div>
              <div style={{marginBottom:10}}><span style={lbl()}>Atividades terapêuticas</span><TagSelect options={["Estimulação motora grossa","Estimulação motora fina","Treino de marcha","Alongamento","Fortalecimento","Equilíbrio","Coordenação","Integração sensorial","Exercícios lúdicos","Órtese/posicionamento","Treino de AVDs"]} value={atividadesTerapeuticas} onChange={setAtividadesTerapeuticas} activeColor={C.blue} /></div>
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>Frequência (sessões/semana)</span><input type="number" value={frequencia} onChange={e=>setFrequencia(e.target.value)} style={inp()} min={1} max={7} placeholder="Ex: 3" /></div>
              </Row>
              <div style={{marginTop:10}}><span style={lbl()}>Orientações para cuidadores</span><textarea value={orientacoesCuidador} onChange={e=>setOrientacoesCuidador(e.target.value)} rows={2} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Alongamentos diários, posicionamento, adaptações domiciliares..." /></div>
            </CollapsibleSub>
            <CollapsibleSub title="Evolução Clínica">
              <textarea value={evolucao} onChange={e=>setEvolucao(e.target.value)} rows={3} style={{...inp({resize:"vertical",lineHeight:1.6})}} placeholder="Evolução desde a última sessão, progressos, dificuldades..." />
              {kbList.length>0&&<div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>{kbList.map(k=><span key={k.key} style={{fontSize:10,color:C.blue,background:C.blueBg,border:`1px solid ${C.blue}30`,borderRadius:6,padding:"2px 8px"}}>{k.label}</span>)}</div>}
              {atividadesTerapeuticas.length>0&&<div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>{atividadesTerapeuticas.map(a=><span key={a} style={{fontSize:10,color:C.green,background:C.greenBg,border:`1px solid ${C.green}30`,borderRadius:6,padding:"2px 8px"}}>{a}</span>)}</div>}
            </CollapsibleSub>
            <CollapsibleSub title="BodyMap — Mapa Corporal de Dor">
              <BodyMap value={bodyPain} onChange={setBodyPain} colors={{mark:C.blue,...C}} />
            </CollapsibleSub>
          </CollapsibleSection>

          {/* 🤖 Análise por IA */}
          <CollapsibleSection title="Análise por Inteligência Artificial — Baseada em Evidências" icon="🤖" expanded={expandedSections.includes("ia")} onToggle={()=>toggleSection("ia")}>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.6}}>Preencha os campos da avaliação e clique em analisar. A IA cruzará os dados com evidências científicas atualizadas para sugerir intervenções e gerar relatório.</div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <button onClick={()=>{
                if (aiRemaining <= 0 && !canUseFeature?.("ai")) { if (plan==="trial") { onUpgrade?.(); return; } enhancer.runAI(true); return; }
                enhancer.runAI();
              }} style={primaryBtn({padding:"10px 20px"})}>🔍 Gerar análise clínica</button>
              {canUseFeature?.("ai") && <span style={{fontSize:11,color:aiRemaining<10?C.amber:C.textMuted}}>📊 {aiRemaining}/{aiLimit} análises restantes</span>}
              {!canUseFeature?.("ai") && <span style={{fontSize:11,color:C.textMuted}}>
                {hasExpansion && aiRemaining > 0 ? `✅ ${aiRemaining} crédito(s) restante(s)` :
                  plan==="trial" ? <><span style={{color:C.amber,fontWeight:600}}>🎯 Fim do teste. </span><button onClick={()=>onUpgrade?.()} style={{background:"none",border:"none",color:C.green,fontWeight:700,cursor:"pointer",fontSize:11,fontFamily:F,textDecoration:"underline",padding:0}}>Escolher plano</button></> :
                  <span>Ao clicar, será cobrado <strong>R$ 5,90</strong> por esta análise avulsa.</span>}
              </span>}
            </div>
            {enhancer.aiRes && (
              <div style={{marginTop:12,background:C.greenBg,border:`1px solid ${C.green}40`,borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>ANÁLISE CLÍNICA — SASYRA IA</div>
                <pre style={{fontSize:13,color:C.text,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:F,margin:0}}>{enhancer.aiRes}</pre>
              </div>
            )}
          </CollapsibleSection>

          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:4}}>
            <button onClick={()=>{handleSave(); handleSaveAssessment()}} style={primaryBtn({padding:"11px 26px",fontSize:14})}>💾 Salvar Avaliação Completa</button>
          </div>
        </>}

        {/* ════════ TAB: EVIDÊNCIAS ════════ */}
        {tab === "evidencias" && (
          <Section title="Diretrizes e Evidências em Pediatria" icon="🔬">
            <div style={{fontSize:13,color:C.textMuted,marginBottom:14,lineHeight:1.6}}>Diretrizes baseadas em evidências para reabilitação pediátrica, organizadas por condição.</div>
            {Object.entries(PEDIATRIC_EVIDENCE).map(([key,condition])=>{
              const active = comorbidades.some(c=>c.toLowerCase().includes(key.replace(/_/g," ")))||diagnosticoMedico.toLowerCase().includes(key.replace(/_/g," "))||queixaPrincipal.toLowerCase().includes(key.replace(/_/g," "));
              return (
                <div key={key} style={{...card(),border:active?`1px solid ${C.blue}50`:`1px solid ${C.border}`,opacity:active?1:0.6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    {active&&<span style={{fontSize:10,fontWeight:800,color:C.blue,background:C.blueBg,padding:"2px 8px",borderRadius:6}}>Condição identificada ✓</span>}
                    <span style={{fontWeight:700,fontSize:14,color:C.text}}>{condition.label}</span>
                  </div>
                  <div style={{fontSize:12,color:C.textSub,lineHeight:1.7,marginBottom:8}}>{condition.goldStandard}</div>
                  {condition.escalas&&<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{condition.escalas.map(s=><span key={s} style={{fontSize:10,color:C.blue,background:C.blueBg,border:`1px solid ${C.blue}30`,borderRadius:6,padding:"2px 8px"}}>{s}</span>)}</div>}
                  {condition.redFlags&&<div style={{marginTop:6,display:"flex",flexWrap:"wrap",gap:4}}>{condition.redFlags.map(r=><span key={r} style={{fontSize:10,color:C.red,background:C.redBg,border:`1px solid ${C.red}30`,borderRadius:6,padding:"2px 8px"}}>🚩 {r}</span>)}</div>}
                </div>
              );
            })}
          </Section>
        )}

        {/* ════════ TAB: SESSÕES ════════ */}
        {tab === "sessoes" && (
          <>
            <PainSection pain={enhancer.pain} setPain={enhancer.setPain} colors={pedColors} />
            <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
              flags={mergedRedFlags} colors={pedColors} />
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={pedColors} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente pediátrico: ${student?.nome || "—"}\nQueixa: ${queixaPrincipal}\nDiagnóstico: ${diagnosticoMedico}\nComorbidades: ${comorbidades.join(", ")}\nGMFCS: ${gmfcs || "—"}\nAIMS: ${aimsScore || "—"}\nM-CHAT: ${mchat.length} itens\nTônus: ${tonus}\nEVA Mov: ${enhancer.pain.evaMov || evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep || evaRep}/10\nDor local: ${enhancer.pain.localDor || localDor}\nMarcos motores: ${marcosMotores.join(", ")}\nAtividades: ${atividadesTerapeuticas.join(", ")}\nYellow Flags: ${yellowFlags.join(", ")}\nDCT: ${diagnosticoCinesio}\nEvolução: ${evolucao}`}
              patientName={student?.nome} moduleLabel="Pediatria" colors={pedColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {/* ════════ TAB: RELATÓRIO ════════ */}
        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="Pediatria" colors={pedColors} />
        )}
      </div>
    </div>
  );
}
