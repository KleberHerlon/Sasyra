import { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import { AudioField, BodyMap, EvaSlider, TagSelect, SingleSelect, Row, HonorariosCard } from "../components";
import { useMediaQuery } from "../components";
import AssignFromOtherModules from "../components/AssignFromOtherModules";
import { useClinicalScan } from "../hooks/useClinicalScan.js";
import { useSemanticScanner } from "../hooks/useSemanticScanner.js";
import { detectLocalDor, extractClinicalEntities } from "../utils/clinicalDetection.js";
import { CIF } from "../data/cif.js";
import { calcBioimpedancia, calcPollock7Dobras, calcPollock3Dobras } from "../data/physicalAssessment";
import { calcIMC, calcRCQ } from "../data/peScales";

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

// ── SAVE ─────────────────────────────────────────────────────────────────────
function saveNutriData(studentId, data) {
  try { localStorage.setItem(`nutri_data_${studentId}`, JSON.stringify(data)); } catch { }
}
function loadNutriData(studentId) {
  try { const d = localStorage.getItem(`nutri_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

const NUTRI_HISTORY_KEY = "nutri_history_";
function loadHistory(sid) {
  try { const d = localStorage.getItem(NUTRI_HISTORY_KEY + sid); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveHistory(sid, history) {
  try { localStorage.setItem(NUTRI_HISTORY_KEY + sid, JSON.stringify(history)); } catch { }
}

// ── MUST ─────────────────────────────────────────────────────────────────────
function calcMUST(pesoAtual, altura, perdaPeso, doenteAgudo) {
  let score = 0;
  const imc = parseFloat(pesoAtual) / (parseFloat(altura)/100) ** 2;
  if (!imc || imc > 0) {
    if (imc > 20) score += 0; else if (imc >= 18.5) score += 1; else score += 2;
  }
  if (perdaPeso) {
    const pp = parseFloat(perdaPeso);
    if (pp > 0) { if (pp < 5) score += 1; else if (pp <= 10) score += 2; else score += 3; }
  }
  if (doenteAgudo) score += 2;
  return { total: Math.min(score, 6), riscos: ["Baixo","Médio","Alto"], indice: score <= 1 ? 0 : score <= 2 ? 1 : 2 };
}

// ── SARC-F ───────────────────────────────────────────────────────────────────
const SARCF_QUESTIONS = [
  { id:"forca", label:"Qual a dificuldade para carregar 4,5 kg?", options:[{t:"Nenhuma",s:0},{t:"Alguma",s:1},{t:"Muita/Impossível",s:2}] },
  { id:"caminhada", label:"Qual a dificuldade para atravessar um cômodo?", options:[{t:"Nenhuma",s:0},{t:"Alguma",s:1},{t:"Muita/Impossível",s:2}] },
  { id:"levantar", label:"Qual a dificuldade para levantar de uma cadeira?", options:[{t:"Nenhuma",s:0},{t:"Alguma",s:1},{t:"Muita/Impossível",s:2}] },
  { id:"escadas", label:"Qual a dificuldade para subir 10 degraus?", options:[{t:"Nenhuma",s:0},{t:"Alguma",s:1},{t:"Muita/Impossível",s:2}] },
  { id:"quedas", label:"Quantas quedas no último ano?", options:[{t:"Nenhuma",s:0},{t:"1-3 quedas",s:1},{t:"≥4 quedas",s:2}] },
];

// ── REFEIÇÕES ────────────────────────────────────────────────────────────────
const REFEICOES = ["Café da manhã","Lanche da manhã","Almoço","Lanche da tarde","Jantar","Ceia"];
const ALIMENTOS_POR_REFEICAO = {
  "Café da manhã":["Pão francês","Pão integral","Pão de forma","Torrada","Cereal matinal","Granola","Aveia","Leite integral","Leite desnatado","Iogurte","Café","Café com leite","Chá","Suco natural","Suco industrializado","Frutas","Ovo","Queijo","Manteiga/margarina","Pasta de amendoim"]};
ALIMENTOS_POR_REFEICAO["Lanche da manhã"]=["Frutas","Barra de cereal","Iogurte","Castanhas","Biscoito integral","Biscoito recheado","Salgadinho","Suco","Café","Chá","Pão de queijo","Tapioca"];
ALIMENTOS_POR_REFEICAO["Almoço"]=["Arroz branco","Arroz integral","Feijão","Lentilha","Grão de bico","Carne bovina","Frango","Peixe","Porco","Ovo","Salada verde","Legumes cozidos","Batata","Mandioquinha","Macarrão","Macarrão integral","Sopa","Refrigerante","Suco natural"];
ALIMENTOS_POR_REFEICAO["Lanche da tarde"]=["Café","Café com leite","Chá","Leite","Iogurte","Frutas","Pão","Biscoito","Bolo","Tapioca","Sanduíche natural","Salada de frutas","Sorvete"];
ALIMENTOS_POR_REFEICAO["Jantar"]=["Sopa","Salada","Omelete","Ovo cozido","Peixe grelhado","Frango grelhado","Salada de frutas","Iogurte","Pão integral","Tapioca","Macarrão","Arroz","Legumes"];
ALIMENTOS_POR_REFEICAO["Ceia"]=["Leite","Chá","Iogurte","Frutas","Biscoito","Torrada","Gelatina","Castanhas"];

// ── NUTRI EVIDENCE ───────────────────────────────────────────────────────────
const NUTRI_EVIDENCE = {
  obesidade: {
    label:"Obesidade",
    goldStandard:"Dieta hipocalórica individualizada (500-1000 kcal/dia de déficit). Abordagem multiprofissional (nutricionista, educador físico, psicólogo). Terapia cognitivo-comportamental para modificação de hábitos. Em casos selecionados, cirurgia bariátrica (IAMC ≥40 ou ≥35 + comorbidades).",
    escalas:["IMC","RCQ","% Gordura (BIA/Dobras)","Bioimpedância"],
    referencias:[{ id:"ABESO 2022", title:"Diretrizes Brasileiras de Obesidade", url:"https://abeso.org.br/" }],
    redFlags:["IAMC ≥50 com indicação cirúrgica urgente","Apneia do sono com hipoxemia","Síndrome metabólica descompensada","Ganho de peso acelerado inexplicado","Sinais de transtorno alimentar"],
  },
  diabetes: {
    label:"Diabetes tipo 2",
    goldStandard:"Plano alimentar individualizado com distribuição adequada de carboidratos (45-60% VET). Preferir carboidratos de baixo índice glicêmico. Fracionamento de refeições (5-6x/dia). Fibra ≥25-30g/dia. Controle de porções e registro alimentar. Evitar açúcares simples e refinados.",
    escalas:["HbA1c","Glicemia jejum","IMC","RCQ"],
    referencias:[{ id:"SBD 2023", title:"Diretrizes da Sociedade Brasileira de Diabetes", url:"https://www.diabetes.org.br/" }],
    redFlags:["HbA1c > 9% com cetose","Glicemia > 300 mg/dL","Hipoglicemia recorrente","Perda de peso não intencional","Feridas com má cicatrização"],
  },
  desnutricao: {
    label:"Desnutrição",
    goldStandard:"Suplementação nutricional oral (SNO) com fórmula hipercalórica/hiperproteica (1,5-2,0 kcal/mL). Fracionamento das refeições. Alimentos fortificados e enriquecidos. Monitoramento semanal de peso. Se ingesta < 60% das necessidades por ≥ 5 dias, considerar nutrição enteral.",
    escalas:["MUST","IMC","Albumina sérica","Prealbumina"],
    referencias:[{ id:"BRASPEN 2021", title:"Diretriz de Terapia Nutricional", url:"https://braspen.org.br/" }],
    redFlags:["IMC < 16 kg/m²","Perda de peso > 10% em 3 meses","Disfagia com broncoaspiração","Albumina < 2,5 g/dL","Recusa alimentar total > 48h"],
  },
  dislipidemia: {
    label:"Dislipidemia",
    goldStandard:"Redução de gorduras saturadas (<7% VET) e gorduras trans (<1% VET). Ácidos graxos insaturados (azeite, abacate, castanhas, peixes ricos em ômega-3). Fibras solúveis (aveia, psyllium, leguminosas). Esteróis/estanóis vegetais (2g/dia). Controle de peso e atividade física regular.",
    escalas:["Colesterol Total","LDL","HDL","Triglicerídeos"],
    referencias:[{ id:"SBC 2022", title:"Diretriz Brasileira de Dislipidemias", url:"https://www.arquivosonline.com.br/" }],
    redFlags:["LDL > 190 mg/dL","TG > 500 mg/dL (risco pancreatite)","Pancreatite prévia","Histórico de IAM recente","Xantomas / arco corneano"],
  },
  hipertensao: {
    label:"Hipertensão Arterial",
    goldStandard:"Dieta DASH (Dietary Approaches to Stop Hypertension) — Evidência A. Redução de sódio < 2g/dia (<5g sal). Aumento de potássio (> 3,5g/dia). Controle de peso. Restrição de álcool (<30g/dia homens, <15g/dia mulheres). Incentivo a alimentos in natura.",
    escalas:["PA consultório","MAPAS","IMC","RCQ"],
    referencias:[{ id:"SBC 2023", title:"Diretriz Brasileira de Hipertensão", url:"https://www.diretrizes.com.br/" }],
    redFlags:["PA > 180/110 mmHg (crise hipertensiva)","Sinais de encefalopatia hipertensiva","Dissecção aórtica","Eclampsia na gestante","Edema agudo de pulmão"],
  },
  drc: {
    label:"Doença Renal Crônica",
    goldStandard:"Restrição proteica (0,6-0,8 g/kg/dia) em DRC estágios 3-5. Restrição de fósforo (<800-1000mg/dia). Restrição de potássio conforme níveis séricos. Controle de sódio (<2g/dia). Aporte hídrico controlado. Suplementação de vitaminas hidrossolúveis se diálise. Evitar anti-inflamatórios e fitoterápicos nefrotóxicos.",
    escalas:["Creatinina","Ureia","Potássio","TFG estimada"],
    referencias:[{ id:"NKF 2023", title:"KDOQI Clinical Practice Guidelines for Nutrition in CKD", url:"https://www.kidney.org/" }],
    redFlags:["Creatinina > 4 mg/dL","Potássio > 6,0 mEq/L","Ureia > 200 mg/dL","Oligúria / anúria","Sinais de uremia (náusea, confusão)"],
  },
};

// ── KB DETECT ────────────────────────────────────────────────────────────────
function detectKBList(doencas) {
  const text = doencas.join(" ").toLowerCase();
  return Object.entries(NUTRI_EVIDENCE)
    .filter(([key]) => {
      const map = { obesidade:"obes", diabetes:"diabetes", desnutricao:"desnutri", dislipidemia:"dislipid", hipertensao:"hiperten", drc:"renal|drc" };
      const pattern = map[key] || key.replace(/_/g, " ").split(" ")[0];
      return doencas.some(d => d.toLowerCase().includes(pattern));
    })
    .map(([key, val]) => ({ key, label: val.label, ...val }));
}

// ── CIF AUTO KEYS ────────────────────────────────────────────────────────────
function autoCIFKeys({ doencas, imcResult, rcqResult, mustScore, sarcfScore, pain }) {
  const keys = [];
  if (imcResult && parseFloat(imcResult) >= 30) keys.push("b530");
  if (imcResult && parseFloat(imcResult) < 18.5) keys.push("b530");
  if (rcqResult && rcqResult.risco === "Alto") keys.push("b530");
  if (mustScore && mustScore > 2) keys.push("b530");
  if (sarcfScore && sarcfScore >= 4) keys.push("b730");
  if (doencas.some(d => d.toLowerCase().includes("diabetes"))) keys.push("b540");
  if (doencas.some(d => d.toLowerCase().includes("hipertensao") || d.toLowerCase().includes("hipertensão"))) keys.push("b420");
  if (doencas.some(d => d.toLowerCase().includes("dislipid"))) keys.push("b540");
  if (doencas.some(d => d.toLowerCase().includes("renal"))) keys.push("b610");
  if (pain?.evaRep > 0 || pain?.evaMov > 0) keys.push("b280");
  return [...new Set(keys)];
}

function suggestDCT(doencas, imcResult) {
  if (doencas.some(d => d.toLowerCase().includes("obes")))
    return "Excesso de peso (IMC " + (imcResult || "—") + ") com riscos metabólicos associados, necessitando de reeducação alimentar, déficit calórico controlado e acompanhamento multiprofissional.";
  if (doencas.some(d => d.toLowerCase().includes("diabetes")))
    return "Diabetes mellitus tipo 2 com necessidade de controle glicêmico através de plano alimentar individualizado, fracionamento de refeições e escolhas de baixo índice glicêmico.";
  if (doencas.some(d => d.toLowerCase().includes("desnutri")))
    return "Desnutrição energético-proteica com perda ponderal significativa, necessitando de suplementação nutricional e monitoramento de ingestão calórica e proteica.";
  if (doencas.some(d => d.toLowerCase().includes("dislipid")))
    return "Dislipidemia com perfil lipídico alterado, necessitando de redução de gorduras saturadas e aumento de fibras solúveis e ácidos graxos insaturados na alimentação.";
  if (doencas.some(d => d.toLowerCase().includes("hiperten")))
    return "Hipertensão arterial sistêmica com necessidade de restrição de sódio, adoção de dieta DASH e controle de peso para redução de PA.";
  return "";
}

const YELLOW_FLAGS_NUTRI = [
  { id:"transtorno", label:"Transtorno alimentar suspeito / histórico" },
  { id:"restricao", label:"Restrição alimentar extrema / ortorexia" },
  { id:"adesao", label:"Baixa adesão a planos anteriores" },
  { id:"expectativa", label:"Expectativa irreal de perda de peso" },
  { id:"compulsao", label:"Compulsão alimentar / episódios de binge" },
  { id:"emocional", label:"Comer emocional / estresse crônico" },
  { id:"suplemento", label:"Uso indiscriminado de suplementos" },
  { id:"cirurgia", label:"Pós-operatório de cirurgia bariátrica com complicações" },
];

function getMergedRedFlags(kbList) {
  const base = [
    "Perda de peso não intencional >5% em 1 mês",
    "Disfagia / odinofagia progressiva",
    "Vômitos frequentes / diarreia persistente",
    "Desidratação com alteração de consciência",
    "Edema generalizado / anasarca",
    "Hipoglicemia < 50 mg/dL sintomática",
    "Sinais de bulimia / purgação",
    "Internação recente por desnutrição",
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

export default function Nutrition({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onUpdateStudentById, onDeleteStudent, plan, onUpgrade, canUseFeature, tryFeature, aiRemaining, aiLimit, hasExpansion, purchaseAIExpansion, currentModuleId, allPatients }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("avaliacao");

  // Anamnese
  const [queixaNutri, setQueixaNutri] = useState("");
  const [historicoPeso, setHistoricoPeso] = useState("");
  const [alergias, setAlergias] = useState([]);
  const [restricoes, setRestricoes] = useState([]);
  const [suplementos, setSuplementos] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const [cirurgias, setCirurgias] = useState("");
  const [doencas, setDoencas] = useState([]);
  const [historicoFamiliar, setHistoricoFamiliar] = useState([]);
  const [qualidadeSono, setQualidadeSono] = useState("");
  const [tabagismo, setTabagismo] = useState([]);
  const [consumoAgua, setConsumoAgua] = useState("");

  // Antropometria
  const [pesoAtual, setPesoAtual] = useState(student?.peso || "");
  const [alturaCM, setAlturaCM] = useState(student?.altura || "");
  const [circCintura, setCircCintura] = useState("");
  const [circQuadril, setCircQuadril] = useState("");
  const [circPescoco, setCircPescoco] = useState("");
  const [perdaPeso, setPerdaPeso] = useState("");
  const [doenteAgudo, setDoenteAgudo] = useState(false);
  const [mustScore, setMustScore] = useState(null);
  const [mustAnswers, setMustAnswers] = useState({});
  const [sarcfAnswers, setSarcfAnswers] = useState({});
  const [sarcfScore, setSarcfScore] = useState(null);

  // TMB / GET
  const [pal, setPal] = useState("");
  const [tmrFormula, setTmrFormula] = useState("mifflin");
  const [tmbResult, setTmbResult] = useState(null);

  // BIA
  const [biaResistencia, setBiaResistencia] = useState("");
  const [biaReactancia, setBiaReactancia] = useState("");
  const [pesoBia, setPesoBia] = useState(student?.peso || "");
  const [alturaBia, setAlturaBia] = useState(student?.altura || "");
  const [biaResult, setBiaResult] = useState(null);

  // Dobras
  const [prot7, setProt7] = useState("7");
  const [dobras, setDobras] = useState({ peitoral:"", abdominal:"", coxa:"", suprailiaca:"", subescapular:"", tricipital:"", axilarMedia:"" });
  const [pollockResult, setPollockResult] = useState(null);

  // Bioquímica
  const [exames, setExames] = useState({ glicemiaJejum:"", hba1c:"", colesterolTotal:"", hdl:"", ldl:"", triglicerides:"", creatinina:"", ureia:"", tsh:"", vitaminaD:"", ferritina:"", albumina:"", tgp:"", tgo:"", potassio:"" });

  // Recordatório 24h
  const [recordatorio, setRecordatorio] = useState({});
  const [refeicoesObservacoes, setRefeicoesObservacoes] = useState({});
  const [ipaq, setIpaq] = useState("");

  // Evolução
  const [evolucao, setEvolucao] = useState("");
  const [conduta, setConduta] = useState("");

  // Advanced
  const [diagnosticoCinesio, setDiagnosticoCinesio] = useState("");
  const [yellowFlags, setYellowFlags] = useState([]);
  const [evaMov, setEvaMov] = useState(0);
  const [evaRep, setEvaRep] = useState(0);
  const [localDor, setLocalDor] = useState([]);
  const [bodyPain, setBodyPain] = useState([]);
  const [regiao, setRegiao] = useState("");
  const [expandedSections, setExpandedSections] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);

  const sid = student?.id || student?.nome;
  const isMobile = useMediaQuery("(max-width:767px)");
  const enhancer = useEnhancer("nutricao", sid, `nutri_enhancer_${sid}`);
  const nutriColors = { ...C, accent: C.amber, font: F };
  const { scan } = useClinicalScan();
  const { semanticScan } = useSemanticScanner();
  const kbList = detectKBList(doencas);
  const imcCalc = pesoAtual && alturaCM ? calcIMC(parseFloat(pesoAtual), parseFloat(alturaCM)) : null;
  const rcqCalc = circCintura && circQuadril ? calcRCQ(parseFloat(circCintura), parseFloat(circQuadril), student?.sexo === "Masculino" ? "M" : "F") : null;
  const cifKeys = autoCIFKeys({ doencas, imcResult: imcCalc?.imc, rcqResult: rcqCalc, mustScore: mustScore?.total, sarcfScore: sarcfScore?.total, pain: enhancer.pain });
  const cifEntries = CIF.filter(c => cifKeys.includes(c.code));
  const mergedRedFlags = getMergedRedFlags(kbList);
  const dctSuggestion = suggestDCT(doencas, imcCalc?.imc);

  const toggleSection = (id) => {
    setExpandedSections(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  // Auto MUST
  useEffect(() => {
    if (pesoAtual && alturaCM) setMustScore(calcMUST(pesoAtual, alturaCM, perdaPeso, doenteAgudo));
  }, [pesoAtual, alturaCM, perdaPeso, doenteAgudo]);

  // Auto SARC-F
  useEffect(() => {
    const s = Object.values(sarcfAnswers).reduce((a,v)=>a+(Number(v)||0), 0);
    setSarcfScore({ total: s, color: s >= 4 ? C.red : s >= 2 ? C.amber : C.green, level: s >= 4 ? "Sarcopenia provável" : s >= 2 ? "Risco de sarcopenia" : "Normal" });
  }, [sarcfAnswers]);

  // Auto TMB/GET
  useEffect(() => {
    const p = parseFloat(pesoAtual), a = parseFloat(alturaCM), id = parseInt(student?.dataNasc?.split("-")[0]) || 30;
    const sex = student?.sexo === "Masculino" ? "M" : student?.sexo === "Feminino" ? "F" : "";
    if (!p || !a || !sex) { setTmbResult(null); return; }
    const idade = 2026 - id;
    const h = a;
    let tmb = 0;
    if (tmrFormula === "mifflin") {
      tmb = sex === "M" ? 10*p + 6.25*h - 5*idade + 5 : 10*p + 6.25*h - 5*idade - 161;
    } else {
      tmb = sex === "M" ? 88.362 + 13.397*p + 4.799*h - 5.677*idade : 447.593 + 9.247*p + 3.098*h - 4.330*idade;
    }
    const palFactors = { "\"1.2\"":1.2,"\"1.375\"":1.375,"\"1.55\"":1.55,"\"1.725\"":1.725,"\"1.9\"":1.9 };
    const get = tmb * (palFactors[pal] || 1.2);
    setTmbResult({ tmb: Math.round(tmb), get: Math.round(get), formula: tmrFormula === "mifflin" ? "Mifflin-St Jeor" : "Harris-Benedict" });
  }, [pesoAtual, alturaCM, student?.sexo, student?.dataNasc, tmrFormula, pal]);

  // Auto BIA
  useEffect(() => {
    const r = parseFloat(biaResistencia), xc = parseFloat(biaReactancia);
    const p = parseFloat(pesoBia), alt = parseFloat(alturaBia);
    if (!r || !xc || !p || !alt || !student?.sexo) { setBiaResult(null); return; }
    setBiaResult(calcBioimpedancia(r, xc, student.sexo, null, p, alt));
  }, [biaResistencia, biaReactancia, pesoBia, alturaBia, student?.sexo]);

  // Auto Dobras
  useEffect(() => {
    const vals = Object.values(dobras).map(Number);
    if (vals.some(v => !v || v <= 0)) { setPollockResult(null); return; }
    try {
      if (prot7 === "7") {
        const res = calcPollock7Dobras(dobras.peitoral, dobras.abdominal, dobras.coxa, dobras.suprailiaca, dobras.subescapular, dobras.tricipital, dobras.axilarMedia, student?.sexo === "Masculino" ? "M" : "F", parseFloat(pesoAtual), parseFloat(alturaCM));
        setPollockResult(res);
      } else {
        const res = calcPollock3Dobras(dobras.peitoral, dobras.abdominal, dobras.coxa, student?.sexo === "Masculino" ? "M" : "F", parseFloat(pesoAtual), parseFloat(alturaCM));
        setPollockResult(res);
      }
    } catch { setPollockResult(null); }
  }, [dobras, prot7, student?.sexo, pesoAtual, alturaCM]);

  useEffect(() => {
    if (student?.id || student?.nome) {
      const saved = loadNutriData(sid);
      if (saved) {
        setQueixaNutri(saved.queixaNutri || ""); setHistoricoPeso(saved.historicoPeso || "");
        setAlergias(saved.alergias || []); setRestricoes(saved.restricoes || []);
        setSuplementos(saved.suplementos || ""); setMedicamentos(saved.medicamentos || "");
        setCirurgias(saved.cirurgias || ""); setDoencas(saved.doencas || []);
        setHistoricoFamiliar(saved.historicoFamiliar || []); setQualidadeSono(saved.qualidadeSono || "");
        setTabagismo(saved.tabagismo || []); setConsumoAgua(saved.consumoAgua || "");
        setPesoAtual(saved.pesoAtual || student?.peso || "");
        setAlturaCM(saved.alturaCM || student?.altura || "");
        setCircCintura(saved.circCintura || ""); setCircQuadril(saved.circQuadril || "");
        setCircPescoco(saved.circPescoco || ""); setPerdaPeso(saved.perdaPeso || "");
        setDoenteAgudo(saved.doenteAgudo || false);
        setMustAnswers(saved.mustAnswers || {}); setSarcfAnswers(saved.sarcfAnswers || {});
        setPal(saved.pal || ""); setTmrFormula(saved.tmrFormula || "mifflin");
        setBiaResistencia(saved.biaResistencia || ""); setBiaReactancia(saved.biaReactancia || "");
        setPesoBia(saved.pesoBia || student?.peso || ""); setAlturaBia(saved.alturaBia || student?.altura || "");
        setProt7(saved.prot7 || "7");
        if (saved.dobras) setDobras(saved.dobras);
        if (saved.exames) setExames(saved.exames);
        if (saved.recordatorio) setRecordatorio(saved.recordatorio);
        if (saved.refeicoesObservacoes) setRefeicoesObservacoes(saved.refeicoesObservacoes);
        setIpaq(saved.ipaq || ""); setEvolucao(saved.evolucao || ""); setConduta(saved.conduta || "");
        setDiagnosticoCinesio(saved.diagnosticoCinesio || ""); setYellowFlags(saved.yellowFlags || []);
        setEvaMov(saved.evaMov || 0); setEvaRep(saved.evaRep || 0);
        setLocalDor(saved.localDor || []); setBodyPain(saved.bodyPain || []);
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
    saveNutriData(sid, {
      queixaNutri, historicoPeso, alergias, restricoes, suplementos, medicamentos, cirurgias,
      doencas, historicoFamiliar, qualidadeSono, tabagismo, consumoAgua,
      pesoAtual, alturaCM, circCintura, circQuadril, circPescoco, perdaPeso, doenteAgudo,
      mustAnswers, sarcfAnswers, pal, tmrFormula, biaResistencia, biaReactancia, pesoBia, alturaBia,
      prot7, dobras, exames, recordatorio, refeicoesObservacoes, ipaq, evolucao, conduta,
      diagnosticoCinesio, yellowFlags, evaMov, evaRep, localDor, bodyPain, expandedSections,
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
      queixa: queixaNutri, doencas: [...doencas],
      peso: pesoAtual, imc: imcCalc?.imc, mustScore: mustScore?.total,
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
    setQueixaNutri(entry.queixa || "");
    setDoencas(entry.doencas || []);
    if (entry.peso) setPesoAtual(entry.peso);
    setYellowFlags(entry.yellowFlags || []);
  };

  const handleReset = () => {
    if (!window.confirm("Tem certeza? Todos os dados serão perdidos.")) return;
    localStorage.removeItem(`nutri_data_${sid}`);
    window.location.reload();
  };

  // ── PATIENT LIST VIEW ─────────────────────────────────────────────────────
  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding: isMobile ? 12 : 24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"0.05em" }}>🥗 Nutrição Clínica</span>
          <button onClick={() => { localStorage.removeItem("sasyra_module"); window.location.reload(); }} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um paciente para iniciar o acompanhamento nutricional</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Pacientes {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <AssignFromOtherModules allPatients={allPatients} currentModuleId={currentModuleId} onUpdateStudentById={onUpdateStudentById} />
            <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
              {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Novo Paciente"}
            </button>
          </div>
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.amber}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.amber, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
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
              if (editingStudent) { onUpdateStudentById(editingStudent.id || editingStudent.nome, f); Object.entries(f).forEach(([k,v])=>onUpdateStudent(k,v)); setEditingStudent(null); }
              else { onAddStudent({...f,id:Date.now(),data:new Date().toISOString().slice(0,10),assignedModules:[currentModuleId]}); }
              setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); setShowForm(false);
            }} disabled={!f.nome.trim()} style={{...primaryBtn({width:"100%",justifyContent:"center",padding:"11px",fontSize:14}),opacity:f.nome.trim()?1:0.4}}>{editingStudent?"Salvar Alterações":"Cadastrar Paciente"}</button>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[...(students||[])].reverse().map(p => (
            <div key={p.id} style={{ display:"flex", gap:8, alignItems:"stretch" }}>
              <button onClick={() => { onSelectStudent(p); setStudentListView(false); }} style={{
                flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", cursor:"pointer",
                textAlign:"left", fontFamily:F, color:C.text, display:"flex", alignItems:"center", gap:14,
              }}>
                <div style={{ width:40, height:40, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:C.amber, flexShrink:0 }}>{p.nome[0]?.toUpperCase()}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{p.nome}</div>
                  <div style={{ fontSize:11, color:C.textMuted, display:"flex", gap:8, flexWrap:"wrap" }}>
                    {p.sexo && <span>{p.sexo}</span>}{p.dataNasc && <span>Nasc: {p.dataNasc}</span>}{p.convenio && <span>{p.convenio}</span>}
                  </div>
                </div>
                <span style={{ color:C.amber, fontSize:16 }}>→</span>
              </button>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={() => setEditTarget(p)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0 }}>✏️</button>
                <button onClick={() => { setDeleteTarget(p); setDeleteStep(1); }} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0 }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.red}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>{deleteStep===1?"⚠️":"🔴"}</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.red, marginBottom:8 }}>{deleteStep===1?"Excluir paciente":"Confirmação final"}</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16, padding:"8px 12px", background:C.card, borderRadius:8 }}>{deleteTarget.nome}</div>
            {deleteStep===1 ? (
              <><div style={{ fontSize:13, color:C.textSub, marginBottom:18 }}>Deseja realmente excluir <strong>{deleteTarget.nome}</strong>?</div>
              <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
                <button onClick={() => setDeleteStep(2)} style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
              </div></>
            ) : (
              <><div style={{ fontSize:13, color:C.textSub, marginBottom:18 }}>Todos os dados de <strong>{deleteTarget.nome}</strong> serão perdidos. <strong style={{color:C.red}}>Não pode ser desfeito</strong>.</div>
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
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.amber}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.amber, marginBottom:8 }}>Editar dados</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:18 }}>Deseja editar os dados de <strong>{editTarget.nome}</strong>?</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setEditTarget(null)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => { setF({ nome:editTarget.nome||"",dataNasc:editTarget.dataNasc||"",sexo:editTarget.sexo||"",profissao:editTarget.profissao||"",convenio:editTarget.convenio||"",telefone:editTarget.telefone||"",peso:editTarget.peso||"",altura:editTarget.altura||"" }); setEditingStudent(editTarget); setEditTarget(null); setShowForm(true); }}
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
          <button onClick={() => setStudentListView(true)} style={ghostBtn({ padding:"5px 8px", fontSize: isMobile ? 10 : 11 })}>← {isMobile ? "" : "Pacientes"}</button>
          <span style={{ fontSize: isMobile ? 10 : 11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>{isMobile ? "🥗" : "🥗 Nutrição"}</span>
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
        {tab === "avaliacao" && (
          <>
            <Section title="Anamnese Nutricional" icon="📋">
              <span style={lbl()}>Queixa principal / Demanda nutricional</span>
              <AudioField value={queixaNutri} onChange={v=>{const t=typeof v==="function"?v(queixaNutri):v;setQueixaNutri(t)}}
                placeholder="Ex: Ganho de peso nos últimos meses, dificuldade para controlar glicemia..." rows={2}
                style={{background:C.surface,border:`1px solid ${C.amber}40`,borderRadius:8,color:C.text,fontSize:13,padding:"9px 12px",fontFamily:F,lineHeight:1.5}} />
              <Row cols={isMobile ? "1fr" : "1fr 1fr"} gap="12px 16px" style={{marginTop:12}}>
                <div>
                  <span style={lbl()}>Histórico de peso</span>
                  <input type="text" value={historicoPeso} onChange={e => setHistoricoPeso(e.target.value)} style={inp()} placeholder="Ex: 75kg → 82kg em 6 meses" />
                </div>
                <div>
                  <span style={lbl()}>Consumo de água (copos/dia)</span>
                  <input type="number" value={consumoAgua} onChange={e => setConsumoAgua(e.target.value)} style={inp()} min={0} max={30} placeholder="Ex: 8" />
                </div>
              </Row>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Alergias / Intolerâncias</span>
                <TagSelect options={["Lactose","Glúten","Ovo","Soja","Amendoim","Castanhas","Frutos do mar","Corantes"]} value={alergias} onChange={setAlergias} activeColor={C.amber} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Restrições alimentares / Preferências</span>
                <TagSelect options={["Vegetariano","Vegano","Low-carb","Cetogênica","Paleo","Jejum intermitente","Sem restrições"]} value={restricoes} onChange={setRestricoes} activeColor={C.amber} />
              </div>
              <Row cols={isMobile ? "1fr" : "1fr 1fr"} gap="12px 16px" style={{marginTop:12}}>
                <div>
                  <span style={lbl()}>Suplementos em uso</span>
                  <input type="text" value={suplementos} onChange={e => setSuplementos(e.target.value)} style={inp()} placeholder="Ex: Whey, creatina, ômega-3" />
                </div>
                <div>
                  <span style={lbl()}>Medicamentos em uso</span>
                  <input type="text" value={medicamentos} onChange={e => setMedicamentos(e.target.value)} style={inp()} placeholder="Ex: Metformina, losartana" />
                </div>
              </Row>
              <Row cols={isMobile ? "1fr" : "1fr 1fr"} gap="12px 16px" style={{marginTop:12}}>
                <div>
                  <span style={lbl()}>Cirurgias prévias</span>
                  <input type="text" value={cirurgias} onChange={e => setCirurgias(e.target.value)} style={inp()} placeholder="Ex: Bariátrica, colecistectomia" />
                </div>
                <div>
                  <span style={lbl()}>Qualidade do sono</span>
                  <SingleSelect options={["Boa","Regular","Ruim"]} value={qualidadeSono} onChange={setQualidadeSono} activeColor={C.amber} />
                </div>
              </Row>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Doenças diagnosticadas</span>
                <TagSelect options={["Diabetes tipo 2","Hipertensão","Dislipidemia","Obesidade","Desnutrição","DRC","Hipotireoidismo","Dç. inflamatória intestinal"]} value={doencas} onChange={setDoencas} activeColor={C.amber} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Histórico familiar</span>
                <TagSelect options={["Diabetes","Hipertensão","Obesidade","Dislipidemia","Câncer","Doença cardíaca","AVC","DRC"]} value={historicoFamiliar} onChange={setHistoricoFamiliar} activeColor={C.amber} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Tabagismo / Etilismo</span>
                <TagSelect options={["Tabagista ativo","Ex-tabagista","Nunca fumou","Consumo álcool ≤1x/sem","Consumo álcool ≥2x/sem","Ex-etilista"]} value={tabagismo} onChange={setTabagismo} activeColor={C.amber} />
              </div>
            </Section>

            {/* MUST */}
            <Section title="MUST — Malnutrition Universal Screening Tool" icon="⚠️">
              <div style={{ marginBottom:10, fontSize:12, color:C.textMuted }}>Score automático: {mustScore !== null ? <span style={{ fontWeight:700, color: mustScore.riscos[mustScore.indice] === "Baixo" ? C.green : mustScore.riscos[mustScore.indice] === "Médio" ? C.amber : C.red }}>{mustScore.total} — {mustScore.riscos[mustScore.indice]}</span> : "Preencha peso e altura"}</div>
              <div style={{ marginBottom:10 }}>
                <span style={lbl()}>Perda de peso não intencional (kg)</span>
                <input type="number" value={perdaPeso} onChange={e => setPerdaPeso(e.target.value)} style={inp()} placeholder="Ex: 3" min={0} step={0.5} />
              </div>
              <div>
                <span style={lbl()}>Paciente agudamente doente / em jejum >5 dias</span>
                <SingleSelect options={[{v:true,l:"Sim"},{v:"",l:"Não"}]} value={doenteAgudo} onChange={v => setDoenteAgudo(v === true)} activeColor={C.amber} />
              </div>
            </Section>

            {/* SARC-F */}
            <Section title="SARC-F — Triagem de Sarcopenia" icon="💪">
              {SARCF_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom:10 }}>
                  <span style={{ ...lbl({ fontSize:10 }) }}>{q.label}</span>
                  <SingleSelect options={q.options} value={sarcfAnswers[q.id] || ""} onChange={v => setSarcfAnswers(p=>({...p,[q.id]:v}))} activeColor={C.amber} />
                </div>
              ))}
              {sarcfScore && (
                <div style={{ background:C.cardAlt, border:`1px solid ${sarcfScore.color}40`, borderRadius:8, padding:"10px 12px", textAlign:"center", marginTop:8 }}>
                  <div style={{ fontSize:11, color:C.textMuted }}>SARC-F: <strong style={{ fontSize:18, color:sarcfScore.color }}>{sarcfScore.total}/10</strong> — <span style={{ color:sarcfScore.color }}>{sarcfScore.level}</span></div>
                </div>
              )}
            </Section>

            {/* CIF + DCT */}
            <Section title="CIF — Classificação Internacional de Funcionalidade" icon="🏛️">
              {cifKeys.length > 0 && <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {cifEntries.slice(0, 10).map(c => <span key={c.code} style={{ fontSize:11, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"3px 10px", lineHeight:1.6 }}><strong>{c.code}</strong>: {c.desc}</span>)}
              </div>}
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Diagnóstico Cinesioterapêutico (DCT)</span>
                <input type="text" value={diagnosticoCinesio} onChange={e => setDiagnosticoCinesio(e.target.value)} style={inp()} placeholder="Ex: Obesidade grau I com alterações metabólicas" />
                {!diagnosticoCinesio && dctSuggestion && <button onClick={() => setDiagnosticoCinesio(dctSuggestion)} style={{ ...ghostBtn({ fontSize:10, marginTop:6 }), borderStyle:"dashed" }}>💡 Sugerir DCT</button>}
              </div>
            </Section>

            {/* Dor + Yellow Flags + BodyMap */}
            <Section title="Dor, Bandeiras Amarelas e Condições" icon="⚠️">
              <Row cols={isMobile ? "1fr" : "1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>EVA Movimento</span><EvaSlider value={evaMov} onChange={setEvaMov} color={C.amber} /></div>
                <div><span style={lbl()}>EVA Repouso</span><EvaSlider value={evaRep} onChange={setEvaRep} color={C.amber} /></div>
              </Row>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Local da dor</span>
                <SingleSelect options={["Abdome","Cabeça","Articulações","Muscular difusa","MMSS","MMII","Tórax","Sem dor"]} value={localDor} onChange={setLocalDor} activeColor={C.amber} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Bandeiras Amarelas</span>
                <TagSelect options={YELLOW_FLAGS_NUTRI.map(f => f.label)} value={yellowFlags} onChange={setYellowFlags} activeColor={C.amber} />
              </div>
              {kbList.length > 0 && <div style={{ marginTop:12, background:C.cardAlt, borderRadius:10, padding:"14px 16px" }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Condições identificadas pelo KB</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>{kbList.map(k => <span key={k.key} style={{ fontSize:10, background:C.amberBg, color:C.amber, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"2px 8px" }}>{k.label}</span>)}</div>
              </div>}
            </Section>

            <CollapsibleSection title="BodyMap — Mapa Corporal de Dor" icon="🧍" expanded={expandedSections.includes("bodymap")} onToggle={() => toggleSection("bodymap")}>
              <BodyMap value={bodyPain} onChange={setBodyPain} colors={{ mark:C.amber, ...C }} />
            </CollapsibleSection>

            <CollapsibleSection title="Histórico de Avaliações" icon="📚" expanded={expandedSections.includes("history")} onToggle={() => toggleSection("history")}>
              {assessmentHistory.length === 0 && <div style={{ fontSize:13, color:C.textMuted }}>Nenhuma avaliação salva ainda.</div>}
              {assessmentHistory.slice(0, 10).map((entry, i) => (
                <div key={entry.id} style={{ display:"flex", justifyContent:"space-between", background:C.cardAlt, borderRadius:8, padding:"8px 12px", marginBottom:6 }}>
                  <div><span style={{ fontSize:11, fontWeight:700, color:C.text }}>#{i+1}</span><span style={{ fontSize:11, color:C.textSub, marginLeft:8 }}>{entry.data}</span><span style={{ fontSize:10, color:C.textMuted, marginLeft:8 }}>{entry.queixa?.slice(0, 40)}</span></div>
                  <button onClick={() => handleLoadAssessment(entry)} style={ghostBtn({ padding:"4px 10px", fontSize:10 })}>Carregar</button>
                </div>
              ))}
            </CollapsibleSection>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleReset} style={ghostBtn({ color:C.red, borderColor:C.red+"50", padding:"10px 20px" })}>🔄 Resetar</button>
              <button onClick={handleSaveAssessment} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar</button>
            </div>

          </>
        )}









        {/* ════════ TAB: EVOLUÇÃO ════════ */}
        {tab === "evolucao" && (
          <>
            {enhancer.redFlags.length > 0 && (
              <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
                flags={mergedRedFlags} colors={nutriColors} />
            )}
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={nutriColors} sessionLabel="Evolução" specialty="nutricao" defaultExpanded={true} pain={enhancer.pain} setPain={enhancer.setPain} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nQueixa: ${queixaNutri}\nDoenças: ${doencas.join(", ")}\nAlergias: ${alergias.join(", ")}\nRestrições: ${restricoes.join(", ")}\nPeso: ${pesoAtual || "—"}kg\nIMC: ${imcCalc?.imc || "—"}\nRCQ: ${rcqCalc?.rcq || "—"}\nMUST: ${mustScore?.total || "—"}\nSARC-F: ${sarcfScore?.total || "—"}\nTMB: ${tmbResult?.tmb || "—"}kcal\nGET: ${tmbResult?.get || "—"}kcal\n%Gordura: ${biaResult?.percentualGordura || pollockResult?.percentualGordura || "—"}%\nEVA Mov: ${enhancer.pain.evaMov || evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep || evaRep}/10\nDor local: ${enhancer.pain.localDor || localDor}\nYellow Flags: ${yellowFlags.join(", ")}\nIPAQ: ${ipaq}\nEvolução: ${evolucao}\nConduta: ${conduta}`}
              colors={nutriColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {/* ════════ TAB: RELATÓRIO ════════ */}
        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="Nutrição Clínica" colors={nutriColors} />
        )}

        {/* ════════ TAB: EVIDÊNCIAS ════════ */}
        {tab === "evidencias" && (
          <Section title="Evidências em Nutrição" icon="🔬">
            {Object.entries(NUTRI_EVIDENCE).map(([key, condition]) => {
              const active = kbList.some(k => k.key === key) || doencas.some(d => new RegExp(key.replace(/_/g, " ").split(" ")[0], "i").test(d));
              return (
                <div key={key} style={{ ...card({ marginBottom:8 }), border: active ? `1px solid ${C.amber}50` : `1px solid ${C.border}`, opacity: active ? 1 : 0.6 }}>
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
