import { useState, useEffect } from "react";
import AssignFromOtherModules from "../components/AssignFromOtherModules";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import { AudioField, EvaSlider, TagSelect, SingleSelect, GonioRow, MRCRow, TestCard, Row, HonorariosCard, Section } from "../components";
import { useClinicalScan } from "../hooks/useClinicalScan.js";
import { useSemanticScanner } from "../hooks/useSemanticScanner.js";
import { detectLocalDor, extractClinicalEntities } from "../utils/clinicalDetection.js";
import { CIF } from "../data/cif.js";
import ScaleSelector from "../components/ScaleSelector";
import GeneralAssessment from "../components/GeneralAssessment";
import { calcMAS, calcBBS, calcMIF, calcGlasgow, calcTIS } from "../data/neuroScales";
import LogoSVG from "../components/LogoSVG";
import StopwatchField from "../components/StopwatchField";
import PatientIdentification from "../components/PatientIdentification";
import DermatomeMap from "../components/DermatomeMap";
import ReflexMatrix from "../components/ReflexMatrix";

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

import CREFITO_REGIOES from "../data/crefito";

// ── Helpers ──────────────────────────────────────────────────────────────────
function useMediaQuery(q) {
  const [m,setM]=useState(()=>window.matchMedia(q).matches);
  useEffect(()=>{const mq=window.matchMedia(q),fn=e=>setM(e.matches);mq.addEventListener("change",fn);return ()=>mq.removeEventListener("change",fn)},[q]);
  return m;
}

function CollapsibleSection({ title, icon, badge, expanded, onToggle, children }) {
  const mobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:mobile?"14px 12px":"20px 22px", marginBottom:14 }}>
      <div onClick={onToggle} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", userSelect:"none" }}>
        {icon && <span style={{ fontSize:16 }}>{icon}</span>}
        <span style={{ flex:1, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.purple }}>{title}</span>
        {badge && <span style={{ background:C.amberBg, color:C.amber, fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:6 }}>{badge}</span>}
        <span style={{ fontSize:12, color:C.textMuted, transform:expanded ? "rotate(90deg)" : "rotate(0deg)", transition:"transform 0.15s" }}>▶</span>
      </div>
      {expanded && <div style={{ marginTop:16 }}>{children}</div>}
    </div>
  );
}

function CollapsibleSub({ title, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen !== false);
  const mobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ background:C.cardAlt, borderRadius:10, padding:mobile?"10px 10px":"14px 16px", marginBottom:10 }}>
      <div onClick={()=>setOpen(!open)} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none" }}>
        <span style={{ flex:1, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:C.textMuted }}>{title}</span>
        <span style={{ fontSize:10, color:C.textMuted, transform:open?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.15s" }}>▶</span>
      </div>
      {open && <div style={{ marginTop:10 }}>{children}</div>}
    </div>
  );
}

// ── Scale calculations ───────────────────────────────────────────────────────


// ── Scale definitions ────────────────────────────────────────────────────────
const MAS_QUESTIONS = [
  { id:"flexoresCotoveloD",label:"Flexores de cotovelo D",lado:"D" },
  { id:"flexoresCotoveloE",label:"Flexores de cotovelo E",lado:"E" },
  { id:"extensoresJoelhoD",label:"Extensores de joelho D",lado:"D" },
  { id:"extensoresJoelhoE",label:"Extensores de joelho E",lado:"E" },
  { id:"flexoresPlantaresD",label:"Flexores plantares D",lado:"D" },
  { id:"flexoresPlantaresE",label:"Flexores plantares E",lado:"E" },
  { id:"flexoresPunhoD",label:"Flexores de punho D",lado:"D" },
  { id:"flexoresPunhoE",label:"Flexores de punho E",lado:"E" },
  { id:"adutoresQuadrilD",label:"Adutores de quadril D",lado:"D" },
  { id:"adutoresQuadrilE",label:"Adutores de quadril E",lado:"E" },
  { id:"flexoresQuadrilD",label:"Flexores de quadril D",lado:"D" },
  { id:"flexoresQuadrilE",label:"Flexores de quadril E",lado:"E" },
];
const BBS_QUESTIONS = [
  { id:"bbs1",  label:"Sentado para em pé" },
  { id:"bbs2",  label:"Em pé sem apoio" },
  { id:"bbs3",  label:"Sentado sem apoio" },
  { id:"bbs4",  label:"Em pé para sentado" },
  { id:"bbs5",  label:"Transferências" },
  { id:"bbs6",  label:"Em pé com olhos fechados" },
  { id:"bbs7",  label:"Em pé com pés juntos" },
  { id:"bbs8",  label:"Alcançar à frente com braço estendido" },
  { id:"bbs9",  label:"Pegar objeto do chão" },
  { id:"bbs10", label:"Virar-se para olhar atrás" },
  { id:"bbs11", label:"Girar 360 graus" },
  { id:"bbs12", label:"Apoio alternado em banco" },
  { id:"bbs13", label:"Em pé com um pé à frente (tandem)" },
  { id:"bbs14", label:"Em pé sobre uma perna (apoio unipodal)" },
];
const MIF_QUESTIONS = [
  { id:"mif1",  label:"Alimentação" },
  { id:"mif2",  label:"Higiene pessoal" },
  { id:"mif3",  label:"Banho" },
  { id:"mif4",  label:"Vestir-se — parte superior" },
  { id:"mif5",  label:"Vestir-se — parte inferior" },
  { id:"mif6",  label:"Uso do vaso sanitário" },
  { id:"mif7",  label:"Controle da bexiga" },
  { id:"mif8",  label:"Controle do intestino" },
  { id:"mif9",  label:"Transferência: leito/cadeira/cadeira de rodas" },
  { id:"mif10", label:"Transferência: vaso sanitário" },
  { id:"mif11", label:"Transferência: banheira/chuveiro" },
  { id:"mif12", label:"Locomoção: marcha/cadeira de rodas" },
  { id:"mif13", label:"Escadas" },
  { id:"mif14", label:"Compreensão" },
  { id:"mif15", label:"Expressão" },
  { id:"mif16", label:"Interação social" },
  { id:"mif17", label:"Resolução de problemas" },
  { id:"mif18", label:"Memória" },
];
const MAS_OPTIONS = [
  { value:"0",label:"0 - Sem aumento de tônus" },
  { value:"1",label:"1 - Leve aumento, sem resistência" },
  { value:"2",label:"2 - Aumento moderado, ADM fácil" },
  { value:"3",label:"3 - Aumento acentuado, ADM difícil" },
  { value:"4",label:"4 - Rigidez em flexão/extensão" },
];
const BBS_OPTIONS = [
  { value:"0",label:"0 - Incapaz" },
  { value:"1",label:"1 - Ajuda substancial" },
  { value:"2",label:"2 - Ajuda moderada" },
  { value:"3",label:"3 - Ajuda mínima" },
  { value:"4",label:"4 - Independente" },
];
const MIF_OPTIONS = [
  { value:"1",label:"1 - Dependência total" },
  { value:"2",label:"2 - Assistência máxima" },
  { value:"3",label:"3 - Assistência moderada" },
  { value:"4",label:"4 - Assistência mínima" },
  { value:"5",label:"5 - Supervisão" },
  { value:"6",label:"6 - Independência modificada" },
  { value:"7",label:"7 - Independência completa" },
];

const PROCEDIMENTOS_CATEGORIES_NEURO = [
  { category: "Treino de Marcha", items: ["Marcha em solo", "Marcha em esteira", "Marcha com suporte parcial de peso", "Marcha com pistas auditivas/visuais", "Marcha em tandem", "Marcha com obstáculos"] },
  { category: "Controle de Tronco & Equilíbrio", items: ["Sentado estático", "Sentado dinâmico", "Bipedestação", "Apoio unipodal", "Superfície instável", "Dupla tarefa", "Alcance funcional"] },
  { category: "Facilitação Neuromuscular", items: ["PNF", "Treino orientado a tarefa", "CIMT (membro superior)", "Integração sensorial", "Espelho", "Biofeedback"] },
  { category: "Fortalecimento Funcional", items: ["Fortalecimento MMSS", "Fortalecimento MMII", "Cadência", "Potência", "Resistência"] },
  { category: "Transferências", items: ["Cadeira ↔ cama", "Sentar / levantar", "Chão ↔ pé", "Carro"] },
  { category: "Recursos Adjuvantes", items: ["FES", "Estimulação cortical", "Realidade virtual", "Órteses / AFO", "Tecnologia assistiva"] },
  { category: "Manutenção e Suporte", items: ["Alongamento passivo", "Posicionamento", "Mobilização articular", "Ventilação (C1-C4)", "Cuidados com integridade cutânea"] },
  { category: "Educação e Orientação", items: ["Orientação ao cuidador", "Prescrição domiciliar", "PNE — Educação em Dor", "Adesão ao tratamento", "Prevenção de quedas"] },
  { category: "Hidroterapia", items: ["Hidroterapia"] },
];

// ── CIF Neuro ────────────────────────────────────────────────────────────────
const CIF_NEURO = {
  ...CIF,
  b110:{desc:"Funções da consciência",cat:"funcoes"},
  b167:{desc:"Funções mentais da linguagem",cat:"funcoes"},
  b280:{desc:"Sensação de dor",cat:"funcoes"},
  b265:{desc:"Função tátil",cat:"funcoes"},
  b7350:{desc:"Tônus de grupos musculares isolados",cat:"funcoes"},
  b735:{desc:"Funções tônus muscular",cat:"funcoes"},
  b770:{desc:"Padrão de marcha",cat:"funcoes"},
  b144:{desc:"Funções da memória",cat:"funcoes"},
  b164:{desc:"Funções cognitivas superiores",cat:"funcoes"},
  b152:{desc:"Funções emocionais",cat:"funcoes"},
  b755:{desc:"Funções de reação ao movimento",cat:"funcoes"},
  b760:{desc:"Controle motor voluntário",cat:"funcoes"},
  d540:{desc:"Vestir-se",cat:"atividades"},
  d510:{desc:"Lavar-se",cat:"atividades"},
  d420:{desc:"Transferir-se",cat:"atividades"},
  d465:{desc:"Deslocar-se usando transporte",cat:"atividades"},
  d450:{desc:"Andar",cat:"atividades"},
  d330:{desc:"Falar",cat:"atividades"},
  s120:{desc:"Medula espinhal",cat:"estruturas"},
  s110:{desc:"Estrutura do cérebro",cat:"estruturas"},
};
const CIF_AUTO_KEYS = [
  {code:"b28013",label:"Dor no dorso",map:()=>{}},
  {code:"b110",label:"Consciência alterada",map:(d)=>d.gcsResult?.total<13?2:0},
  {code:"b167",label:"Alteração de linguagem",map:(d)=>(d.comunicacao&&d.comunicacao!=="Fluente")?2:0},
  {code:"b7350",label:"Tônus muscular alterado",map:(d)=>d.tono&&d.tono!=="Normal"?2:0},
  {code:"b770",label:"Alteração da marcha",map:(d)=>d.tipoMarcha?.length>0?2:0},
  {code:"b7300",label:"Força muscular reduzida",map:(d)=>Object.values(d.forcaNeuro||{}).filter(v=>v!==0&&v!==5).length>0?2:0},
  {code:"d450",label:"Andar",map:(d)=>d.bbsResult?.total<=20?3:d.bbsResult?.total<41?1:0},
  {code:"d540",label:"Vestir-se",map:(d)=>d.mifResult?.total<36?2:0},
  {code:"d420",label:"Transferir-se",map:(d)=>d.avdsNeuro?.includes("Transferências")?2:0},
  {code:"d510",label:"Lavar-se",map:(d)=>d.avdsNeuro?.includes("Banho")?2:0},
  {code:"b144",label:"Comprometimento de memória",map:(d)=>d.sintomas?.includes("Alteração cognitiva")?2:0},
  {code:"b152",label:"Comprometimento emocional",map:(d)=>0},
];
const CIF_SUGGESTIONS_BY_COND = {
  avc:{codes:["b7300","b7350","b770","d540","d510","s110","b167","b110"]},
  "lesão medular":{codes:["b7300","b7350","d420","d465","s120","b28013"]},
  parkinson:{codes:["b735","b770","d450","b755","d540","b152"]},
  "esclerose múltipla":{codes:["b7300","b7350","d450","b144","d540","b770","b167"]},
  tce:{codes:["b144","b164","b7300","d540","s110","b110"]},
  ela:{codes:["b7300","d540","d510","s120","b167"]},
  ataxia:{codes:["b760","b755","b770","d450"]},
  neuropatia:{codes:["b28015","b7300","d450","b780","b265"]},
  paralisia_facial:{codes:["b7300","b28010","d330"]},
  distrofia:{codes:["b7300","b7350","d450","d540","b7400"]},
};

// ── Knowledge Base for Neurology ─────────────────────────────────────────────
const NEURO_KB = [
  {
    key:"avc",pattern:/avc|acidente vascular|hemiparesia|hemiplegia|derrame/i,
    label:"Acidente Vascular Cerebral / Hemiparesia",
    goldStandard:"Marcha com suporte parcial de peso corporal (Evidência A). CIMT para membro superior: 200-600 reps/sessão. FES para drop foot. Treino orientado a tarefa repetitiva. Reabilitação intensiva precoce <48h melhora desfecho funcional (AVERT Trial 2015, Lancet). PNF para controle motor.",
    escalas:["MIF","NIHSS","Berg Balance Scale","MAS","Fugl-Meyer","Barthel Index","HAQ"],
    redFlags:["Déficit motor focal súbito","Perda de consciência","Cefaleia súbita intensa","Disfagia progressiva"],
    cifCodes:["b7300","b7350","b770","d540","d510","s110"],
    testes:["romberg","mingazzini","barré","babinski","fingerToNose","marchaTandem"],
  },
  {
    key:"lesao_medular",pattern:/lesão medular|lesao medular|paraplégi|tetraplégi|paraplegi|tetraplegi|lesao vertebral|trauma raquimedular/i,
    label:"Lesão Medular",
    goldStandard:"Treino de transferências e mobilidade funcional. Fortalecimento de MMSS para cadeira de rodas. FES para membro superior (C6-C7). Treino de marcha com suporte parcial (lesão incompleta). Cuidados com integridade cutânea. Reabilitação respiratória (C1-C4). Órteses para punho e mão. AVDs adaptadas com tecnologia assistiva (Cochrane 2021 - Evidência A).",
    escalas:["MIF","SCIM","HAQ","Barthel Index","DASH","Berg Balance Scale"],
    redFlags:["Perda de força súbita","Disfagia progressiva","Piora progressiva"],
    cifCodes:["b7300","b7350","d420","d465","s120"],
    testes:["romberg","schober","lasègue","babinski","fingerToNose"],
  },
  {
    key:"parkinson",pattern:/parkinson|doença de parkinson|mal de parkinson/i,
    label:"Doença de Parkinson",
    goldStandard:"LSVT BIG — treino de amplitude de movimento, Evidência A. Marcha com pistas rítmicas auditivas/visuais. Exercício aeróbio para condicionamento. Dupla tarefa para prevenção de quedas. Alongamento global para rigidez. Treino de equilíbrio e coordenação reversa. Atividade física regular retarda progressão (BJSM 2022 - Evidência A).",
    escalas:["UPDRS","Berg Balance Scale","Timed Up and Go (TUG)","HAQ"],
    redFlags:["Piora progressiva","Disfagia progressiva"],
    cifCodes:["b735","b770","d450","b755","d540"],
    testes:["romberg","fingerToNose","marchaTandem","timedUpAndGo"],
  },
  {
    key:"esclerose_multipla",pattern:/esclerose múltipla|esclerose multipla|em |neurite óptica|desmielinizante/i,
    label:"Esclerose Múltipla",
    goldStandard:"Exercício aeróbio moderado (caminhada, bicicleta, hidroterapia). Fortalecimento progressivo de MMII para marcha. Alongamento para espasticidade. Treino de equilíbrio e propriocepção. Estratégias de conservação de energia para fadiga. Evitar superaquecimento. Exercício é seguro e melhora qualidade de vida (Cochrane 2021 - Evidência A).",
    escalas:["EDSS","MSFC","Berg Balance Scale","HAQ","MIF"],
    redFlags:["Piora progressiva","Disfagia progressiva","Déficit motor focal súbito"],
    cifCodes:["b7300","b7350","d450","b144","d540"],
    testes:["romberg","fingerToNose","marchaTandem","timedUpAndGo"],
  },
  {
    key:"tce",pattern:/tce|traumatismo cranio|trauma cranio|traumatismo cranioencefálico|concussão|concussao|lesão cerebral traumática|lesao cerebral traumatica/i,
    label:"Traumatismo Cranioencefálico",
    goldStandard:"Reabilitação vestibular para tontura/desequilíbrio. Treino de equilíbrio e marcha. Integração sensorial. Terapia cognitiva para atenção e memória. Treino de AVDs com adaptações. Abordagem multidisciplinar (TO, fono, neuropsicologia). Estimulação precoce na fase aguda. (Brain Injury Medicine 2022 - Evidência A).",
    escalas:["MIF","Berg Balance Scale","DASH","HAQ","Rancho Los Amigos","Glasgow Outcome Scale"],
    redFlags:["Perda de consciência","Cefaleia súbita intensa","Trauma craniano recente","Piora progressiva"],
    cifCodes:["b144","b164","b7300","d540","s110"],
    testes:["romberg","fingerToNose","marchaTandem","babinski","minimental"],
  },
  {
    key:"elau",pattern:/ela |esclerose lateral|elau|als |doença do neurônio motor|doenca do neuronio motor/i,
    label:"Esclerose Lateral Amiotrófica (ELA)",
    goldStandard:"Alongamento passivo diário para contraturas. Posicionamento adequado. Suporte ventilatório não invasivo (VNI). Órteses para queda de pé/punho. CAA precoce. Abordagem paliativa centrada no paciente. Nutrição enteral se disfagia significativa. Exercício aeróbio leve (Cochrane 2022 - Evidência B).",
    escalas:["ALSFRS-R","MIF","Força muscular (MRC)","Capacidade vital forçada (CVF)"],
    redFlags:["Disfagia progressiva","Piora progressiva","Perda de força súbita"],
    cifCodes:["b7300","d540","d510","s120"],
    testes:["mingazzini","barré","babinski"],
  },
  {
    key:"ataxia",pattern:/ataxia|cerebelar|disfunção cerebelar|disfuncao cerebelar|frenkel|dismetria/i,
    label:"Ataxia / Disfunção Cerebelar",
    goldStandard:"Exercícios de Frenkel (coordenação progressiva). Fortalecimento proximal para estabilização. Marcha com base alargada. Pistas visuais para coordenação. Equilíbrio em superfícies instáveis. Pesos nos tornozelos pode reduzir tremor intencional. Treino funcional de AVDs com adaptações (Cochrane 2021 - Evidência B).",
    escalas:["SARA","Berg Balance Scale","Timed Up and Go (TUG)","HAQ"],
    redFlags:["Piora progressiva","Perda de consciência"],
    cifCodes:["b760","b755","b770","d450"],
    testes:["fingerToNose","marchaTandem","romberg","diadococinesia"],
  },
  {
    key:"neuropatia",pattern:/neuropatia|polineuropatia|síndrome do túnel|sindrome do tunel|carpal|charcot|marie-tooth/i,
    label:"Neuropatia Periférica",
    goldStandard:"Treino de equilíbrio e propriocepção para prevenção de quedas. Fortalecimento de MMII (dorsiflexores, eversores). Órtese ankle-foot (AFO) se pé caído. Dessensibilização para dor neuropática. TENS para alívio sintomático. Exercício aeróbio moderado melhora circulação e regeneração nervosa.",
    escalas:["MIF","Berg Balance Scale","HAQ","DN4 (dor neuropática)"],
    redFlags:["Perda de força súbita","Piora progressiva"],
    cifCodes:["b28015","b7300","d450","b780"],
    testes:["romberg","tinel","phalen","monofilamento"],
  },
  {
    key:"paralisia_facial",pattern:/paralisia facial|paralisia de bell|bell |paralisia do facial|parésia facial|paresia facial/i,
    label:"Paralisia Facial Periférica",
    goldStandard:"Exercícios miofuncionais faciais (simetria). Biofeedback com espelho para reeducação muscular. Massagem facial suave para relaxamento. Proteção ocular (lubrificante, óculos). Abordagem precoce ≤72h melhora prognóstico. Evitar estimulação elétrica na fase aguda (risco de sincinesia). A maioria recupera em 3-6 meses (Cochrane 2022 - Evidência B).",
    escalas:["House-Brackmann (HB)","Sunnybrook Facial Grading Scale"],
    redFlags:["Cefaleia súbita intensa","Perda de consciência","Déficit motor focal súbito"],
    cifCodes:["b7300","b28010","d330"],
    testes:[],
  },
  {
    key:"distrofia",pattern:/distrofia|distrofia muscular|duchenne|becker|dmd |dmb /i,
    label:"Distrofia Muscular",
    goldStandard:"Alongamento global diário para prevenção de contraturas. Fortalecimento muscular submáximo (evitar sobrecarga excêntrica). Treino de AVDs e mobilidade. Exercício aeróbio moderado para condicionamento. Órteses noturnas para manter ADM. Ventilação não invasiva conforme progressão. Suporte psicológico e multidisciplinar. Evitar imobilização prolongada.",
    escalas:["MIF","Força muscular (MRC)","Barthel Index","Egen Klassifikation"],
    redFlags:["Piora progressiva","Disfagia progressiva","Perda de força súbita"],
    cifCodes:["b7300","b7350","d450","d540","b7400"],
    testes:["gowers","mingazzini","barré"],
  },
];

// ── Special tests for Neurology ──────────────────────────────────────────────
const NEURO_TESTES = {
  romberg:{nome:"Teste de Romberg",desc:"Avalia propriocepção e função vestibular. Paciente em pé, pés juntos, olhos fechados por 30s.",how:"Paciente em pé com pés unidos e olhos abertos (10s), depois fecha os olhos (30s). Observe oscilação ou queda. Positivo se oscilação aumentada ou queda com olhos fechados."},
  mingazzini:{nome:"Teste de Mingazzini (MMII)",desc:"Avalia paresia de membros inferiores. Paciente em decúbito dorsal, MMII elevados a 45°. Observar queda de um membro em 30s.",how:"Paciente em DD, flexão de quadril a 45°, joelhos estendidos. Manter por 30s. Positivo se um membro cai em relação ao outro."},
  barré:{nome:"Teste de Barré (MMSS)",desc:"Avalia paresia de membros superiores. Paciente sentado, MMSS estendidos à frente. Observar queda de um membro em 30s.",how:"Paciente sentado, MMSS estendidos horizontalmente, palmas para cima, olhos fechados. Manter 30s. Positivo se um braço desce ou pronacia."},
  babinski:{nome:"Sinal de Babinski",desc:"Avalia integridade do trato corticoespinhal. Estímulo na borda lateral do pé, do calcâneo em direção aos dedos.",how:"Com objeto semi-cortante (chave, espátula), estimular borda lateral do pé do calcâneo em direção aos dedos, curvando medialmente. Resposta normal: flexão plantar dos dedos. Babinski+: extensão do hálux + abertura dos demais dedos."},
  fingerToNose:{nome:"Teste Índex-Nariz (Dismetria)",desc:"Avalia coordenação e dismetria cerebelar. Paciente toca o nariz com o indicador, movendo entre o nariz e o dedo do examinador.",how:"Sentado, tocar nariz com indicador D, depois estender e tocar o dedo do examinador. Repetir 5x cada lado. Observar tremor intencional e dismetria (passar do alvo)."},
  marchaTandem:{nome:"Marcha em Tandem (Equilíbrio)",desc:"Avalia ataxia de marcha e equilíbrio dinâmico. Paciente anda em linha reta tocando calcanhar na ponta do outro pé.",how:"Paciente anda 10 passos em linha reta, tocando calcanhar D na ponta do pé E e vice-versa. Avaliar desvio da linha e oscilação. Normal: ≤1 desvio em 10 passos."},
  diadococinesia:{nome:"Diadococinesia",desc:"Avalia coordenação de movimentos alternados rápidos. Paciente alterna pronação e supinação das mãos.",how:"Sentado, palmas das mãos apoiadas nas coxas. Alternar pronação/supinação o mais rápido possível. Avaliar ritmo, amplitude e disdiadococinesia (lentidão, irregularidade)."},
  timedUpAndGo:{nome:"Timed Up and Go (TUG)",desc:"Avalia mobilidade funcional e risco de queda. Levantar, andar 3m, virar, retornar e sentar.",how:"Paciente sentado em cadeira padrão. Ao comando, levantar, andar 3m, virar, retornar e sentar. Cronometrar. <10s: normal. 10-20s: risco moderado. >20s: alto risco de queda."},
  schober:{nome:"Teste de Schober (Flexão Lombar)",desc:"Avalia mobilidade da coluna lombar. Marcação de 10cm acima e 5cm abaixo da linha das cristas ilíacas.",how:"De pé, marcar L5-S1 (entre cristas), 10cm acima e 5cm abaixo. Paciente flexiona o tronco. Medir distância entre marcas. Normal: aumento ≥5cm (de 15 para 20cm+)."},
  lasègue:{nome:"Teste de Lasègue",desc:"Avalia compressão radicular L4-S1. Elevação passiva do membro inferior estendido.",how:"DD, elevar passivamente o MI estendido pelo calcâneo. Positivo se reproduzir dor irradiada entre 30-70°. Anotar ângulo de reprodução da dor. Diferenciar de dor posterior (alongamento de isquiotibiais)."},
  trendelenburg:{nome:"Teste de Trendelenburg (Quadril)",desc:"Avalia fraqueza do glúteo médio. Paciente em apoio unipodal, observando inclinação pélvica.",how:"Em pé, elevar um pé do chão, manter 30s. Observar inclinação pélvica do lado elevado. Positivo se pelve do lado elevado desce (fraqueza de glúteo médio do lado de apoio)."},
  monofilamento:{nome:"Teste do Monofilamento (Sensibilidade)",desc:"Avalia sensibilidade protetora plantar. Monofilamento 10g aplicado em pontos específicos do pé.",how:"Com monofilamento 10g (5.07 Semmes-Weinstein), tocar perpendicularmente na pele por 1.5s em 4-5 pontos na planta do pé. Paciente de olhos fechados, responder 'sim' quando sentir. Perda em ≥2 pontos = perda de sensibilidade protetora."},
};

// ── Yellow Flags ─────────────────────────────────────────────────────────────
const YELLOW_FLAGS_NEURO = [
  "Catastrofização","Cinesiofobia","Baixa autoeficácia","Depressão/ansiedade","Isolamento social",
  "Baixa adesão ao tratamento","Fadiga crônica","Dependência funcional acentuada","Conflitos familiares",
  "Baixa expectativa de recuperação","Sobrecarga do cuidador","Litígio trabalhista/previdenciário",
];

// ── Evidence Base ────────────────────────────────────────────────────────────
const NEURO_EVIDENCE = {
  avc: {
    label:"Acidente Vascular Cerebral",
    goldStandard:"Marcha com suporte parcial de peso corporal (Evidência A, AVERT Trial 2015). CIMT para membro superior: 200-600 reps/sessão. FES para drop foot. Treino orientado a tarefa repetitiva. Reabilitação intensiva precoce <48h melhora desfecho funcional.",
    escalas:["MIF","NIHSS","Berg Balance Scale","MAS","Fugl-Meyer","Barthel Index"],
    referencias:[
      { id:"AVERT 2015", title:"Efficacy and safety of very early mobilisation within 24h of stroke (AVERT)", url:"https://pubmed.ncbi.nlm.nih.gov/26095867/" },
      { id:"Cochrane 2020", title:"Constraint-induced movement therapy for upper extremities in stroke", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004433.pub3/" },
    ],
  },
  lesao_medular: {
    label:"Lesão Medular",
    goldStandard:"Treino de transferências e mobilidade funcional. Fortalecimento de MMSS para cadeira de rodas. FES para membro superior. Treino de marcha com suporte parcial (lesão incompleta). Cuidados com integridade cutânea e reabilitação respiratória (C1-C4). Órteses e tecnologia assistiva para AVDs (Cochrane 2021 Evidência A).",
    escalas:["MIF","SCIM","HAQ","Barthel Index","DASH"],
    referencias:[
      { id:"Cochrane 2021", title:"Functional electrical stimulation for walking after spinal cord injury", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD012676.pub2/" },
      { id:"Consortium SCIM 2022", title:"Spinal Cord Injury Rehabilitation Evidence (SCIRE)", url:"https://scireproject.com/" },
    ],
  },
  parkinson: {
    label:"Doença de Parkinson",
    goldStandard:"LSVT BIG — treino de amplitude de movimento (Evidência A). Marcha com pistas rítmicas auditivas/visuais. Exercício aeróbio para condicionamento. Dupla tarefa para prevenção de quedas. Alongamento global para rigidez. Atividade física regular retarda progressão (BJSM 2022).",
    escalas:["UPDRS","Berg Balance Scale","Timed Up and Go (TUG)","HAQ"],
    referencias:[
      { id:"BJSM 2022", title:"Physical activity and Parkinson's disease progression", url:"https://pubmed.ncbi.nlm.nih.gov/35396304/" },
      { id:"LSVT Global", title:"LSVT BIG — Amplitude-based exercise for Parkinson's", url:"https://www.lsvtglobal.com/" },
    ],
  },
  esclerose_multipla: {
    label:"Esclerose Múltipla",
    goldStandard:"Exercício aeróbio moderado (caminhada, bicicleta, hidroterapia). Fortalecimento progressivo de MMII. Alongamento para espasticidade. Treino de equilíbrio e propriocepção. Conservação de energia para fadiga. Evitar superaquecimento. Exercício seguro e melhora qualidade de vida (Cochrane 2021 Evidência A).",
    escalas:["EDSS","MSFC","Berg Balance Scale","HAQ","MIF"],
    referencias:[
      { id:"Cochrane 2021", title:"Exercise therapy for multiple sclerosis", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003980.pub4/" },
    ],
  },
  tce: {
    label:"Traumatismo Cranioencefálico",
    goldStandard:"Reabilitação vestibular para tontura/desequilíbrio. Treino de equilíbrio e marcha. Integração sensorial. Terapia cognitiva para atenção e memória. Treino de AVDs com adaptações. Abordagem multidisciplinar (TO, fono, neuropsicologia). Estimulação precoce na fase aguda (Brain Injury Medicine 2022).",
    escalas:["MIF","Berg Balance Scale","DASH","HAQ","Rancho Los Amigos"],
    referencias:[
      { id:"Brain Inj Med 2022", title:"Guidelines for the rehabilitation of traumatic brain injury", url:"https://pubmed.ncbi.nlm.nih.gov/35768934/" },
    ],
  },
  ela: {
    label:"Esclerose Lateral Amiotrófica (ELA)",
    goldStandard:"Alongamento passivo diário para contraturas. Posicionamento e órteses. Suporte ventilatório não invasivo. CAA precoce. Abordagem paliativa centrada no paciente. Nutrição enteral se disfagia. Exercício aeróbio leve (Cochrane 2022 Evidência B).",
    escalas:["ALSFRS-R","MIF","Força muscular (MRC)","Capacidade vital forçada"],
    referencias:[
      { id:"Cochrane 2022", title:"Exercise therapy for amyotrophic lateral sclerosis", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD014899.pub2/" },
    ],
  },
  ataxia: {
    label:"Ataxia / Disfunção Cerebelar",
    goldStandard:"Exercícios de Frenkel (coordenação progressiva). Fortalecimento proximal. Marcha com base alargada. Pistas visuais para coordenação. Equilíbrio em superfícies instáveis. Pesos nos tornozelos reduz tremor intencional. Treino funcional de AVDs (Cochrane 2021 Evidência B).",
    escalas:["SARA","Berg Balance Scale","Timed Up and Go (TUG)","HAQ"],
    referencias:[
      { id:"Cochrane 2021", title:"Rehabilitation for cerebellar ataxia", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD013597.pub2/" },
    ],
  },
  neuropatia: {
    label:"Neuropatia Periférica",
    goldStandard:"Treino de equilíbrio e propriocepção para prevenção de quedas. Fortalecimento de MMII (dorsiflexores, eversores). Órtese AFO se pé caído. Dessensibilização para dor neuropática. TENS para alívio sintomático. Exercício aeróbio moderado melhora circulação e regeneração nervosa.",
    escalas:["MIF","Berg Balance Scale","HAQ","DN4 (dor neuropática)"],
    referencias:[
      { id:"Cochrane 2017", title:"Exercise for diabetic peripheral neuropathy", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD010274.pub2/" },
    ],
  },
  paralisia_facial: {
    label:"Paralisia Facial Periférica",
    goldStandard:"Exercícios miofuncionais faciais com biofeedback por espelho. Massagem facial suave. Proteção ocular (lubrificante, óculos). Abordagem precoce ≤72h melhora prognóstico. Evitar estimulação elétrica na fase aguda (risco de sincinesia). A maioria recupera em 3-6 meses (Cochrane 2022 Evidência B).",
    escalas:["House-Brackmann (HB)","Sunnybrook Facial Grading Scale"],
    referencias:[
      { id:"Cochrane 2022", title:"Physical therapy for Bell's palsy", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006283.pub4/" },
    ],
  },
  distrofia: {
    label:"Distrofia Muscular",
    goldStandard:"Alongamento global diário para prevenção de contraturas. Fortalecimento submáximo (evitar excêntrica). Treino de AVDs e mobilidade. Exercício aeróbio moderado. Órteses noturnas para ADM. Ventilação não invasiva conforme progressão. Evitar imobilização prolongada.",
    escalas:["MIF","Força muscular (MRC)","Barthel Index","Egen Klassifikation"],
    referencias:[
      { id:"Cochrane 2020", title:"Exercise for Duchenne muscular dystrophy", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004725.pub4/" },
    ],
  },
};

// ── Persistence ──────────────────────────────────────────────────────────────
function saveNeuroData(studentId, data) { try { localStorage.setItem(`neuro_data_${studentId}`,JSON.stringify(data)); } catch {} }
function loadNeuroData(studentId) { try { const d = localStorage.getItem(`neuro_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; } }

// ── Main component ───────────────────────────────────────────────────────────
export default function Neuro({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onUpdateStudentById, onDeleteStudent,
  plan, onUpgrade, canUseFeature, tryFeature, aiRemaining, aiLimit, hasExpansion, purchaseAIExpansion, currentModuleId, allPatients,
  onAgenda, onFinanceiro, onSubscription, planLabel,
}) {
  // ── Navigation ────────────────────────────────────────────────────────────────
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("avaliacao");
  const [expandedSections, setExpandedSections] = useState([]);
  const isMobile = useMediaQuery("(max-width:767px)");

  // ── Assessment history ────────────────────────────────────────────────────────
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const sid = student?.id || student?.nome;

  // ── Patient data ──────────────────────────────────────────────────────────────
  const [queixa, setQueixa] = useState("");
  const [diagnosticoMedico, setDiagnosticoMedico] = useState("");
  const [tempoLesao, setTempoLesao] = useState("");
  const [mecanismoLesao, setMecanismoLesao] = useState("");
  const [ladoAfetado, setLadoAfetado] = useState("");
  const [historicoNeuro, setHistoricoNeuro] = useState("");
  const [medicacoes, setMedicacoes] = useState("");
  const [comorbidadesNeuro, setComorbidadesNeuro] = useState([]);
  const [sintomas, setSintomas] = useState([]);
  const [avdsNeuro, setAvdsNeuro] = useState([]);
  const [nivelAti, setNivelAti] = useState("");

  // ── Pain ──────────────────────────────────────────────────────────────────────
  const [localDor, setLocalDor] = useState([]);
  const [caraterDor, setCaraterDor] = useState([]);
  const [tempoDor, setTempoDor] = useState("");
  const [melhora, setMelhora] = useState([]);
  const [piora, setPiora] = useState([]);
  const [evaMov, setEvaMov] = useState(0);
  const [evaRep, setEvaRep] = useState(0);
  const [hda, setHda] = useState("");

  // ── Scales ────────────────────────────────────────────────────────────────────
  const [masScores, setMasScores] = useState({});
  const [masResult, setMasResult] = useState(null);
  const [bbsScores, setBbsScores] = useState({});
  const [bbsResult, setBbsResult] = useState(null);
  const [mifScores, setMifScores] = useState({});
  const [mifResult, setMifResult] = useState(null);

  // ── Physical exam ─────────────────────────────────────────────────────────────
  const [tono, setTono] = useState("");
  const [forcaNeuro, setForcaNeuro] = useState({});
  const [forcaRows, setForcaRows] = useState([]);
  const [gonioRows, setGonioRows] = useState([]);
  const [sensibilidade, setSensibilidade] = useState([]);
  const [coordenacao, setCoordenacao] = useState([]);
  const [tipoMarcha, setTipoMarcha] = useState([]);
  const [reflexos, setReflexos] = useState([]);
  const [postura, setPostura] = useState([]);
  const [marcha, setMarcha] = useState("");
  const [edema, setEdema] = useState("");

  // ── Neuro-specific new fields ─────────────────────────────────────────────────
  const [gcsScores, setGcsScores] = useState({}); // { aberturaOcular, respostaVerbal, respostaMotora }
  const [gcsResult, setGcsResult] = useState(null);
  const [orientacao, setOrientacao] = useState([]);
  const [comunicacao, setComunicacao] = useState("");
  const [tisScores, setTisScores] = useState({}); // { sentadoEstatico, sentadoDinamico, transferencias }
  const [tisResult, setTisResult] = useState(null);
  const [tugSegundos, setTugSegundos] = useState("");
  const [reflexosMatriz, setReflexosMatriz] = useState({}); // matriz 0-4 + patológicos
  const [sensibilidadeMap, setSensibilidadeMap] = useState([]); // [{dermatomo, lado, modalidade, valor}]
  const [tempoIctus, setTempoIctus] = useState("");
  const [progressaoLesao, setProgressaoLesao] = useState("");
  const [reacoesPosturais, setReacoesPosturais] = useState([]);
  const [orteses, setOrteses] = useState([]);
  const [marchaIndependente, setMarchaIndependente] = useState("");
  const [metasCurtoPrazo, setMetasCurtoPrazo] = useState([]);
  const [metasLongoPrazo, setMetasLongoPrazo] = useState("");
  const [planoAcao, setPlanoAcao] = useState([]); // [{ nomeFase, numSessoes, frequencia, intervencoes }]
  const [palpacao, setPalpacao] = useState("");
  const [obs, setObs] = useState("");

  // ── Special tests ─────────────────────────────────────────────────────────────
  const [tests, setTests] = useState({});

  // ── Yellow Flags ──────────────────────────────────────────────────────────────
  const [yellowFlags, setYellowFlags] = useState([]);

  // ── DCT ───────────────────────────────────────────────────────────────────────
  const [diagnosticoCinesio, setDiagnosticoCinesio] = useState("");
  const [evolucaoNeuro, setEvolucaoNeuro] = useState("");

  // ── KB ────────────────────────────────────────────────────────────────────────
  const [kbList, setKbList] = useState([]);
  const [queixaKey, setQueixaKey] = useState("");
  const [cifAuto, setCifAuto] = useState([]);

  // ── CREFITO ───────────────────────────────────────────────────────────────────
  const [regiao, setRegiao] = useState("");

  // ── Hooks ─────────────────────────────────────────────────────────────────────
  const { entities, dcSuggestion } = useClinicalScan(queixa);
  const { detected, handleComorbidChange, handleAntecChange } = useSemanticScanner(queixa, { setComorbid: setComorbidadesNeuro, setAntec: setComorbidadesNeuro });
  const enhancer = useEnhancer("neurofuncional", sid, `neuro_enhancer_${sid}`);
  const neuroColors = { ...C, accent: C.purple, font: F };
  const [savedScales, setSavedScales] = useState(() => { try { const d = localStorage.getItem(`neuro_scales_${sid}`); return d ? JSON.parse(d) : []; } catch { return []; } });
  const handleScaleSave = (result) => {
    const next = [...savedScales, { ...result, savedAt: new Date().toISOString() }];
    setSavedScales(next);
    try { localStorage.setItem(`neuro_scales_${sid}`, JSON.stringify(next)); } catch {}
  };

  // ── Detect KB from queixa ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!queixa) { setKbList([]); return; }
    const matched = NEURO_KB.filter(k => k.pattern.test(queixa));
    setKbList(matched);
    if (matched.length > 0) setDiagnosticoMedico(prev => prev || matched[0].label);
  }, [queixa]);

  // ── Auto-detect pain location and character from queixa ───────────────────────
  useEffect(() => {
    if (!queixa) return;
    const regions = detectLocalDor(queixa);
    if (regions.length > 0) setLocalDor(prev => [...new Set([...prev, ...regions])]);
    const { painChars } = extractClinicalEntities(queixa);
    if (painChars.length > 0) setCaraterDor(prev => [...new Set([...prev, ...painChars])]);
  }, [queixa]);

  // ── CIF auto calculation ──────────────────────────────────────────────────────
  useEffect(() => {
    const data = { tono, tipoMarcha, forcaNeuro, bbsResult, mifResult, avdsNeuro, sintomas, evaMov, evaRep, localDor, gcsResult, comunicacao };
    const computed = CIF_AUTO_KEYS.map(({code,label,map}) => {
      const q = map(data) || 1;
      return q > 0 ? { code, label, qualifier: q } : null;
    }).filter(Boolean);
    setCifAuto(computed);
  }, [tono, tipoMarcha, forcaNeuro, bbsResult, mifResult, avdsNeuro, sintomas, evaMov, evaRep, gcsResult, comunicacao]);

  // ── Load saved data ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sid) return;
    const saved = loadNeuroData(sid);
    if (saved) {
      setQueixa(saved.queixa || "");
      setDiagnosticoMedico(saved.diagnosticoMedico || "");
      setTempoLesao(saved.tempoLesao || "");
      setMecanismoLesao(saved.mecanismoLesao || "");
      setLadoAfetado(saved.ladoAfetado || "");
      setHistoricoNeuro(saved.historicoNeuro || "");
      setMedicacoes(saved.medicacoes || "");
      setComorbidadesNeuro(saved.comorbidadesNeuro || []);
      setSintomas(saved.sintomas || []);
      setAvdsNeuro(saved.avdsNeuro || []);
      setNivelAti(saved.nivelAti || "");
      setLocalDor(saved.localDor || []);
      setCaraterDor(saved.caraterDor || []);
      setTempoDor(saved.tempoDor || "");
      setMelhora(saved.melhora || []);
      setPiora(saved.piora || []);
      setEvaMov(saved.evaMov ?? 0);
      setEvaRep(saved.evaRep ?? 0);
      setHda(saved.hda || "");
      setMasScores(saved.masScores || {});
      setMasResult(saved.masResult || null);
      setBbsScores(saved.bbsScores || {});
      setBbsResult(saved.bbsResult || null);
      setMifScores(saved.mifScores || {});
      setMifResult(saved.mifResult || null);
      setTono(saved.tono || "");
      setForcaNeuro(saved.forcaNeuro || {});
      setForcaRows(saved.forcaRows || []);
      setGonioRows(saved.gonioRows || []);
      setSensibilidade(saved.sensibilidade || []);
      setCoordenacao(saved.coordenacao || []);
      setTipoMarcha(saved.tipoMarcha || []);
      setReflexos(saved.reflexos || []);
      setPostura(saved.postura || []);
      setMarcha(saved.marcha || "");
      setEdema(saved.edema || "");
      setPalpacao(saved.palpacao || "");
      setObs(saved.obs || "");
      setEvolucaoNeuro(saved.evolucaoNeuro || "");
      setTests(saved.tests || {});
      setYellowFlags(saved.yellowFlags || []);
      setDiagnosticoCinesio(saved.diagnosticoCinesio || "");
      setRegiao(saved.regiao || "");
      setExpandedSections(saved.expandedSections || []);
      setAssessmentHistory(saved.assessmentHistory || []);
      if (saved.pain) enhancer.setPain(saved.pain);
      if (saved.logs) enhancer.setLogs(saved.logs);
      if (saved.redFlags) enhancer.setRedFlags(saved.redFlags);
      if (saved.aiRes) enhancer.setAiRes(saved.aiRes);
    } else {
      setExpandedSections([]);
    }
  }, [sid]);

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!sid) return;
    saveNeuroData(sid, {
      queixa, diagnosticoMedico, tempoLesao, mecanismoLesao, ladoAfetado, historicoNeuro, medicacoes,
      comorbidadesNeuro, sintomas, avdsNeuro, nivelAti, localDor, caraterDor, tempoDor, melhora, piora,
      evaMov, evaRep, hda,
      masScores, masResult, bbsScores, bbsResult, mifScores, mifResult,
      tono, forcaNeuro, forcaRows, gonioRows, sensibilidade, coordenacao, tipoMarcha, reflexos,
      postura, marcha, edema, palpacao, obs,
      tests, yellowFlags, evolucaoNeuro, diagnosticoCinesio, regiao, expandedSections, assessmentHistory,
      pain: enhancer.pain, logs: enhancer.logs, redFlags: enhancer.redFlags, aiRes: enhancer.aiRes,
      data: new Date().toISOString().slice(0,10),
      // Novos campos neuro
      gcsScores, gcsResult, orientacao, comunicacao,
      tisScores, tisResult, tugSegundos,
      reflexosMatriz, sensibilidadeMap,
      tempoIctus, progressaoLesao, reacoesPosturais,
      orteses, marchaIndependente,
      metasCurtoPrazo, metasLongoPrazo, planoAcao,
    });
  };

  // ── Assessment history helpers ────────────────────────────────────────────────
  const saveAssessment = () => {
    handleSave();
    const entry = {
      id: Date.now(), date: new Date().toISOString().slice(0,10),
      queixa, diagnosticoMedico, tempoLesao, masResult, bbsResult, mifResult,
    };
    setAssessmentHistory(p => [entry, ...p]);
  };
  const loadAssessment = (entry) => {
    const saved = loadNeuroData(sid);
    if (!saved) return;
    // Reload everything from the last save
    setQueixa(saved.queixa || ""); setDiagnosticoMedico(saved.diagnosticoMedico || "");
    setTempoLesao(saved.tempoLesao || ""); setMecanismoLesao(saved.mecanismoLesao || "");
    setLadoAfetado(saved.ladoAfetado || ""); setHistoricoNeuro(saved.historicoNeuro || "");
    setMedicacoes(saved.medicacoes || ""); setComorbidadesNeuro(saved.comorbidadesNeuro || []);
    setSintomas(saved.sintomas || []); setAvdsNeuro(saved.avdsNeuro || []);
    setNivelAti(saved.nivelAti || ""); setLocalDor(saved.localDor || []); setCaraterDor(saved.caraterDor || []);
    setTempoDor(saved.tempoDor || ""); setMelhora(saved.melhora || []);
    setPiora(saved.piora || []); setEvaMov(saved.evaMov ?? 0); setEvaRep(saved.evaRep ?? 0);
    setHda(saved.hda || "");
    setMasScores(saved.masScores || {}); setMasResult(saved.masResult || null);
    setBbsScores(saved.bbsScores || {}); setBbsResult(saved.bbsResult || null);
    setMifScores(saved.mifScores || {}); setMifResult(saved.mifResult || null);
    setTono(saved.tono || ""); setForcaNeuro(saved.forcaNeuro || {});
    setForcaRows(saved.forcaRows || []); setGonioRows(saved.gonioRows || []);
    setSensibilidade(saved.sensibilidade || []); setCoordenacao(saved.coordenacao || []);
    setTipoMarcha(saved.tipoMarcha || []); setReflexos(saved.reflexos || []);
    setPostura(saved.postura || []); setMarcha(saved.marcha || "");
    setEdema(saved.edema || ""); setPalpacao(saved.palpacao || ""); setObs(saved.obs || "");
    setTests(saved.tests || {}); setYellowFlags(saved.yellowFlags || []);
    setEvolucaoNeuro(saved.evolucaoNeuro || "");
    setDiagnosticoCinesio(saved.diagnosticoCinesio || ""); setRegiao(saved.regiao || "");
    if (saved.pain) enhancer.setPain(saved.pain);
    if (saved.logs) enhancer.setLogs(saved.logs);
    if (saved.redFlags) enhancer.setRedFlags(saved.redFlags);
    if (saved.aiRes) enhancer.setAiRes(saved.aiRes);
    setGcsScores(saved.gcsScores || {}); setGcsResult(saved.gcsResult || null);
    setOrientacao(saved.orientacao || []); setComunicacao(saved.comunicacao || "");
    setTisScores(saved.tisScores || {}); setTisResult(saved.tisResult || null);
    setTugSegundos(saved.tugSegundos || "");
    setReflexosMatriz(saved.reflexosMatriz || {}); setSensibilidadeMap(saved.sensibilidadeMap || []);
    setTempoIctus(saved.tempoIctus || ""); setProgressaoLesao(saved.progressaoLesao || "");
    setReacoesPosturais(saved.reacoesPosturais || []);
    setOrteses(saved.orteses || []); setMarchaIndependente(saved.marchaIndependente || "");
    setMetasCurtoPrazo(saved.metasCurtoPrazo || []); setMetasLongoPrazo(saved.metasLongoPrazo || "");
    setPlanoAcao(saved.planoAcao || []);
  };
  const resetAssessment = () => {
    setQueixa(""); setDiagnosticoMedico(""); setTempoLesao(""); setMecanismoLesao("");
    setLadoAfetado(""); setHistoricoNeuro(""); setMedicacoes("");
    setComorbidadesNeuro([]); setSintomas([]); setAvdsNeuro([]);
    setNivelAti(""); setLocalDor([]); setCaraterDor([]); setTempoDor(""); setMelhora([]); setPiora([]);
    setEvaMov(0); setEvaRep(0); setHda("");
    setMasScores({}); setMasResult(null); setBbsScores({}); setBbsResult(null);
    setMifScores({}); setMifResult(null);
    setTono(""); setForcaNeuro({}); setForcaRows([]); setGonioRows([]);
    setSensibilidade([]); setCoordenacao([]); setTipoMarcha([]); setReflexos([]);
    setPostura([]); setMarcha(""); setEdema(""); setPalpacao(""); setObs("");
    setTests({}); setYellowFlags([]); setEvolucaoNeuro(""); setDiagnosticoCinesio(""); setRegiao("");
    enhancer.setPain({ evaMov:0, evaRep:0, localDor:[], caraterDor:[], melhora:[], piora:[] });
    enhancer.setLogs([]); enhancer.setRedFlags([]); enhancer.setAiRes("");
    setGcsScores({}); setGcsResult(null); setOrientacao([]); setComunicacao("");
    setTisScores({}); setTisResult(null); setTugSegundos("");
    setReflexosMatriz({}); setSensibilidadeMap([]);
    setTempoIctus(""); setProgressaoLesao(""); setReacoesPosturais([]);
    setOrteses([]); setMarchaIndependente("");
    setMetasCurtoPrazo([]); setMetasLongoPrazo(""); setPlanoAcao([]);
  };

  // ── Derived ───────────────────────────────────────────────────────────────────
  const mergedRedFlags = kbList.length > 0
    ? [...new Set(["Cefaleia súbita e intensa (hemorragia)","Déficit motor focal súbito (AVC)","Perda de consciência","Piora progressiva","Febre + rigidez nucal (meningite)","Trauma craniano recente","Tumor cerebral suspeito","Disfagia progressiva", ...kbList.flatMap(k=>k.redFlags||[])])]
    : ["Cefaleia súbita e intensa (hemorragia)","Déficit motor focal súbito (AVC)","Perda de consciência","Piora progressiva","Febre + rigidez nucal (meningite)","Trauma craniano recente","Tumor cerebral suspeito","Disfagia progressiva"];
  const mergedEscalas = kbList.length > 0 ? [...new Set(kbList.flatMap(k=>k.escalas||[]))] : [];

  // ── Toggle section ────────────────────────────────────────────────────────────
  const toggleSection = (key) => {
    setExpandedSections(p => p.includes(key) ? p.filter(x=>x!==key) : [...p, key]);
  };

  // ── ──────────────────────────────────────────────────────────────────────────
  //  STUDENT LIST VIEW
  // ── ──────────────────────────────────────────────────────────────────────────
  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um paciente para iniciar o atendimento</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>
            Pacientes {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}
          </span>
          <button onClick={()=>{setShowForm(!showForm); setEditingStudent(null); if(!showForm) setF({nome:"",dataNasc:"",sexo:"",profissao:"",convenio:"",telefone:"",peso:"",altura:""})}}
            style={primaryBtn({padding:"9px 18px",fontSize:13})}>
            {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Novo Paciente"}
          </button>
        </div>
        <AssignFromOtherModules allPatients={allPatients} currentModuleId={currentModuleId} onUpdateStudentById={onUpdateStudentById} accentColor={C.purple} />

        {showForm && (
          <div style={{...card(), marginBottom:16, border:`1px solid ${C.purple}50`}}>
            <div style={{ fontSize:14, fontWeight:700, color:C.purple, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              {editingStudent ? "✏️ Editar Paciente" : "➕ Novo Paciente"}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
              {[
                {k:"nome",l:"Nome completo",pl:"Nome do paciente"},
                {k:"dataNasc",l:"Nascimento",pl:"",type:"date"},
                {k:"sexo",l:"Sexo",type:"select",opts:["","Feminino","Masculino","Outro"]},
                {k:"profissao",l:"Profissão",pl:"Profissão"},
                {k:"convenio",l:"Convênio",type:"select",opts:["","Particular","Unimed","Bradesco Saúde","Amil","SulAmérica","Hapvida","NotreDame","IPSEMG","SUS / NASF","Outro"]},
                {k:"telefone",l:"Telefone",pl:"(99) 99999-9999"},
                {k:"peso",l:"Peso (kg)",pl:"kg"},
                {k:"altura",l:"Altura (cm)",pl:"cm"},
              ].map(({k,l,pl,type,opts})=>(
                <div key={k}><span style={lbl()}>{l}</span>
                  {opts ? <select value={f[k]} onChange={e=>setF(p=>({...p,[k]:e.target.value}))} style={sel()}>
                    {opts.map(o => <option key={o} value={o}>{o||"Selecionar…"}</option>)}
                  </select> : <input type={type||"text"} value={f[k]} placeholder={pl||""} onChange={e=>setF(p=>({...p,[k]:e.target.value}))} style={inp()} />}
                </div>
              ))}
            </div>
            <button onClick={()=>{
              if (!f.nome.trim()) return;
              if (editingStudent) { onUpdateStudentById(editingStudent.id||editingStudent.nome, f); Object.entries(f).forEach(([k,v])=>onUpdateStudent(k,v)); setEditingStudent(null); }
              else { onAddStudent({...f, id:Date.now(), data:new Date().toISOString().slice(0,10), assignedModules: [currentModuleId]}); }
              setF({nome:"",dataNasc:"",sexo:"",profissao:"",convenio:"",telefone:"",peso:"",altura:""}); setShowForm(false);
            }} disabled={!f.nome.trim()} style={{...primaryBtn({width:"100%",justifyContent:"center",padding:"11px",fontSize:14}),opacity:f.nome.trim()?1:0.4,cursor:f.nome.trim()?"pointer":"not-allowed"}}>
              {editingStudent ? "Salvar Alterações" : "Cadastrar Paciente"}
            </button>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[...(students||[])].reverse().map(p => (
            <div key={p.id} style={{ display:"flex", gap:8, alignItems:"stretch" }}>
              <button onClick={()=>{onSelectStudent(p); setStudentListView(false)}}
                style={{flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", cursor:"pointer", textAlign:"left", fontFamily:F, color:C.text, display:"flex", alignItems:"center", gap:14, transition:"all 0.12s"}}>
                <div style={{width:40,height:40,background:C.purpleBg,border:`1px solid ${C.purple}40`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:C.purple,flexShrink:0}}>{p.nome[0]?.toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:2}}>{p.nome}</div>
                  <div style={{fontSize:11,color:C.textMuted,display:"flex",gap:8,flexWrap:"wrap"}}>{p.sexo&&<span>{p.sexo}</span>}{p.dataNasc&&<span>Nasc: {p.dataNasc}</span>}{p.convenio&&<span>{p.convenio}</span>}</div>
                </div>
                <span style={{color:C.purple,fontSize:16}}>→</span>
              </button>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>setEditTarget(p)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:12,cursor:"pointer",width:40,height:48,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.textDim,fontFamily:F,flexShrink:0}} title="Editar">✏️</button>
                <button onClick={()=>{setDeleteTarget(p);setDeleteStep(1)}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:12,cursor:"pointer",width:40,height:48,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.textDim,fontFamily:F,flexShrink:0}} title="Excluir">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Delete modals */}
      {deleteTarget && deleteStep===1 && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>{setDeleteTarget(null);setDeleteStep(1)}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.surface,border:`1px solid ${C.red}`,borderRadius:16,padding:"24px 28px",maxWidth:420,width:"90%",textAlign:"center",fontFamily:F}}>
            <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
            <div style={{fontSize:16,fontWeight:800,color:C.red,marginBottom:8}}>Excluir paciente</div>
            <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:16,padding:"8px 12px",background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>{deleteTarget.nome}</div>
            <div style={{fontSize:13,color:C.textSub,marginBottom:18,lineHeight:1.6}}>Deseja realmente excluir <strong>{deleteTarget.nome}</strong>?</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>{setDeleteTarget(null);setDeleteStep(1)}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 24px",fontSize:13,fontWeight:700,color:C.textSub,cursor:"pointer",fontFamily:F}}>Cancelar</button>
              <button onClick={()=>setDeleteStep(2)} style={{background:C.red,border:"none",borderRadius:10,padding:"10px 24px",fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:F}}>Continuar</button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && deleteStep===2 && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>{setDeleteTarget(null);setDeleteStep(1)}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.surface,border:`1px solid ${C.red}`,borderRadius:16,padding:"24px 28px",maxWidth:420,width:"90%",textAlign:"center",fontFamily:F}}>
            <div style={{fontSize:40,marginBottom:12}}>🔴</div>
            <div style={{fontSize:16,fontWeight:800,color:C.red,marginBottom:8}}>Confirmação final</div>
            <div style={{fontSize:13,color:C.textSub,marginBottom:16,lineHeight:1.6}}>Todos os dados de <strong>{deleteTarget.nome}</strong> serão perdidos. <strong style={{color:C.red}}>Não pode ser desfeito</strong>.</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>{setDeleteTarget(null);setDeleteStep(1)}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 24px",fontSize:13,fontWeight:700,color:C.textSub,cursor:"pointer",fontFamily:F}}>Cancelar</button>
              <button onClick={()=>{onDeleteStudent(deleteTarget);setDeleteTarget(null);setDeleteStep(1)}} style={{background:C.red,border:"none",borderRadius:10,padding:"10px 24px",fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:F}}>Sim, excluir permanentemente</button>
            </div>
          </div>
        </div>
      )}
      {editTarget && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>setEditTarget(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.surface,border:`1px solid ${C.purple}`,borderRadius:16,padding:"24px 28px",maxWidth:420,width:"90%",textAlign:"center",fontFamily:F}}>
            <div style={{fontSize:40,marginBottom:12}}>✏️</div>
            <div style={{fontSize:16,fontWeight:800,color:C.purple,marginBottom:8}}>Editar paciente</div>
            <div style={{fontSize:13,color:C.textSub,marginBottom:18,lineHeight:1.6}}>Deseja editar <strong>{editTarget.nome}</strong>?</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>setEditTarget(null)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 24px",fontSize:13,fontWeight:700,color:C.textSub,cursor:"pointer",fontFamily:F}}>Cancelar</button>
              <button onClick={()=>{setF({nome:editTarget.nome||"",dataNasc:editTarget.dataNasc||"",sexo:editTarget.sexo||"",profissao:editTarget.profissao||"",convenio:editTarget.convenio||"",telefone:editTarget.telefone||"",peso:editTarget.peso||"",altura:editTarget.altura||""});setEditingStudent(editTarget);setEditTarget(null);setShowForm(true)}} style={{background:C.purple,border:"none",borderRadius:10,padding:"10px 24px",fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:F}}>Continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── ──────────────────────────────────────────────────────────────────────────
  //  MAIN VIEW
  // ── ──────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:isMobile?"10px 12px":"0 24px", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", minHeight:isMobile?"auto":60, gap:isMobile?8:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <LogoSVG C={C} F={F}/>
          <button onClick={()=>setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Trocar paciente">👥 Pacientes</button>
          {onAgenda && <button onClick={onAgenda} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Agenda">📅 Agenda</button>}
          {onFinanceiro && <button onClick={onFinanceiro} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Financeiro">💰 Financeiro</button>}
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {[["avaliacao","📋",isMobile?"":"Avaliação"],["evolucao","📈",isMobile?"":"Evolução"],["relatorio","📊",isMobile?"":"Relatório"],["evidencias","🔬",isMobile?"":"Evidências"]].map(([k,ic,lb])=>(
            <button key={k} onClick={()=>setTab(k)} style={{background:tab===k?C.purpleBg:"transparent",border:`1px solid ${tab===k?C.purple+"50":"transparent"}`,borderRadius:8,padding:isMobile?"5px 10px":"7px 16px",fontSize:isMobile?11:13,fontWeight:tab===k?700:400,color:tab===k?C.purple:C.textMuted,cursor:"pointer",fontFamily:F}}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {onSubscription && (
            <button onClick={onSubscription}
              style={{ background:plan==="start"?`${C.amber}15`:"transparent", border:`1px solid ${plan==="start"?C.amber+"50":C.border}`, borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:700, color:plan==="start"?C.amber:C.green, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>
              {plan === "start" ? "⭐ Start" : `⭐ ${planLabel || ""}`}
            </button>
          )}
          {student?.nome && (
            <><div style={{width:isMobile?24:30,height:isMobile?24:30,background:C.purpleBg,border:`1px solid ${C.purple}40`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:isMobile?10:13,fontWeight:800,color:C.purple}}>{student.nome[0]?.toUpperCase()}</div>
              {!isMobile && <span style={{fontSize:12,color:C.textSub,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{student.nome}</span>}</>
          )}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:isMobile?"12px 8px":"20px 16px" }}>

        {/* ════════ TAB: AVALIAÇÃO ════════ */}
        {tab === "avaliacao" && <>
          {/* 📂 Histórico de Avaliações */}
          <Section title="Histórico de Avaliações" icon="📂">
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <select value="" onChange={e=>{const idx=Number(e.target.value);if(idx>=0&&assessmentHistory[idx])loadAssessment(assessmentHistory[idx])}} style={{...sel({maxWidth:260,fontSize:12})}}>
                <option value="">Selecionar avaliação anterior...</option>
                {assessmentHistory.map((a,i)=><option key={a.id} value={i}>{a.date} — {(a.queixa||"").slice(0,50)}</option>)}
              </select>
              <button onClick={saveAssessment} style={primaryBtn({padding:"7px 16px",fontSize:12})}>💾 Salvar avaliação</button>
              <button onClick={resetAssessment} style={{...ghostBtn({padding:"7px 16px",fontSize:12}),color:C.amber,borderColor:`${C.amber}50`}}>🔄 Nova avaliação</button>
              {assessmentHistory.length > 0 && <span style={{fontSize:10,color:C.textMuted}}>{assessmentHistory.length} avaliação(ões) salva(s)</span>}
            </div>
          </Section>

          <PatientIdentification student={student} onUpdate={(field, value) => onUpdateStudent && onUpdateStudent(student?.id, field, value)} regiao={regiao} setRegiao={setRegiao} />

          {/* 📝 Queixa Principal e Anamnese */}
          <CollapsibleSection title="Queixa Principal e Anamnese" icon="📝" expanded={expandedSections.includes("queixa")} onToggle={()=>toggleSection("queixa")}>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:10,lineHeight:1.5}}>Registre a queixa principal, histórico e comorbidades do paciente neurológico. A IA cruzará os dados com evidências científicas.</div>
            <div style={{ background:C.redBg, border:`1.5px solid ${C.red}`, borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:C.red }}>Queixa principal</span>
                  <span style={{ fontSize:9, fontWeight:800, color:"#fff", background:C.red, borderRadius:6, padding:"2px 8px", letterSpacing:"0.05em", textTransform:"uppercase" }}>OBRIGATÓRIO</span>
                </div>
                <span style={{ fontSize:10, color:C.red, opacity:0.7 }}>— digite ou use o microfone</span>
              </div>
              <AudioField value={queixa} onChange={v=>{const t=typeof v==="function"?v(queixa):v;setQueixa(t)}} placeholder="Ex: Hemiparesia espástica esquerda pós-AVC isquêmico..." rows={2} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:"9px 12px",fontFamily:F,lineHeight:1.5}} />
            </div>

            {entities && (entities.muscles?.length>0||entities.laterality||entities.painChars?.length>0) && (
              <div style={{ background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"10px 14px", margin:"12px 0" }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.blue, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>🔍 Varredura Semântica</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, fontSize:12 }}>
                  {entities.muscles?.length>0 && <span style={{color:C.textSub}}>Músculos: <strong style={{color:C.text}}>{entities.muscles.join(", ")}</strong></span>}
                  {entities.laterality && <span style={{color:C.textSub}}>Lateralidade: <strong style={{color:C.text}}>{entities.laterality}</strong></span>}
                  {entities.painChars?.length>0 && <span style={{color:C.textSub}}>Caráter: <strong style={{color:C.text}}>{entities.painChars.join(", ")}</strong></span>}
                </div>
              </div>
            )}

            {kbList.length > 0 && (
              <div style={{background:`${C.green}08`,border:`1px solid ${C.green}30`,borderRadius:10,padding:"14px 16px",marginTop:12}}>
                <div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:6}}>✓ Condição(ões) identificada(s): {kbList.slice(0,2).map(k=>k.label).join(", ")}{kbList.length>2&&` +${kbList.length-2}`}</div>
                {kbList[0]?.goldStandard&&<div style={{fontSize:11,color:C.textSub,lineHeight:1.6,marginBottom:8}}><strong style={{color:C.green}}>Padrão-ouro:</strong> {kbList[0].goldStandard}</div>}
                {canUseFeature?.("cif") ? (
                  kbList[0]?.cifCodes?.length>0 && (
                    <div style={{marginTop:6}}><span style={{fontSize:9,fontWeight:700,color:C.blue,textTransform:"uppercase",letterSpacing:"0.08em"}}>CIF Sugeridos:</span>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{kbList[0].cifCodes.map(c=>CIF_NEURO[c]?<span key={c} style={{fontSize:10,background:C.blueBg,color:C.blue,border:`1px solid ${C.blue}30`,borderRadius:6,padding:"2px 8px"}}>{c} — {CIF_NEURO[c].desc}</span>:null)}</div>
                    </div>
                  )
                ) : (
                  <div style={{background:C.amberBg,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.amber,marginTop:8,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                    <span>🔒 Sugestão CIF nos planos <strong style={{color:C.green}}>Evidência</strong> e <strong style={{color:C.green}}>Clínica</strong></span>
                    <button onClick={() => onUpgrade?.()}
                      style={{background:"transparent",border:"none",color:C.green,fontWeight:700,cursor:"pointer",fontSize:11,fontFamily:F,textDecoration:"underline",whiteSpace:"nowrap"}}>
                      Desbloquear
                    </button>
                  </div>
                )}
                {canUseFeature?.("cif") && cifAuto.length > 0 && (
                  <div style={{marginTop:8}}><span style={{fontSize:9,fontWeight:700,color:C.purple,textTransform:"uppercase",letterSpacing:"0.08em"}}>CIF Automáticos:</span>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{cifAuto.map(c=><span key={c.code} style={{fontSize:10,background:C.purpleBg,color:C.purple,border:`1px solid ${C.purple}30`,borderRadius:6,padding:"2px 8px"}}>{c.code}({c.qualifier}) — {c.label}</span>)}</div>
                  </div>
                )}
                {mergedEscalas.length > 0 && (
                  <div style={{marginTop:8}}><span style={{fontSize:9,fontWeight:700,color:C.amber,textTransform:"uppercase",letterSpacing:"0.08em"}}>📏 Escalas:</span>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{mergedEscalas.map(s=><span key={s} style={{fontSize:10,background:C.amberBg,color:C.amber,border:`1px solid ${C.amber}30`,borderRadius:6,padding:"2px 8px"}}>{s}</span>)}</div>
                  </div>
                )}
              </div>
            )}

            <div style={{ background:C.redBg, border:`1px solid ${C.red}40`, borderRadius:8, padding:"8px 12px", marginBottom:10, marginTop:12 }}>
              <div style={{ fontSize:10, fontWeight:800, color:C.red, letterSpacing:"0.1em", marginBottom:6 }}>
                🚩 RED FLAGS — INVESTIGAR ANTES DE PROSSEGUIR
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {mergedRedFlags.map(f => {
                  const active = enhancer.redFlags.includes(f);
                  return (
                    <button key={f} onClick={() => enhancer.setRedFlags(active ? enhancer.redFlags.filter(x=>x!==f) : [...enhancer.redFlags, f])}
                      style={{
                        fontSize:11, color:active?"#fff":C.red, background:active?C.red:C.redBg,
                        border:`1px solid ${C.red}50`, borderRadius:6, padding:"3px 10px",
                        cursor:"pointer", fontFamily:F, fontWeight:active?700:400, transition:"all 0.12s",
                      }}>
                      {active && "✓ "}{f}
                    </button>
                  );
                })}
              </div>
              {enhancer.redFlags.length > 0 && (
                <div style={{ marginTop:6, fontSize:10, color:C.red, fontWeight:600 }}>
                  ⚠ {enhancer.redFlags.length} red flag(s) selecionada(s)
                </div>
              )}
            </div>



            <CollapsibleSub title="História da Doença Atual (HDA)">
              <AudioField value={hda} onChange={setHda} placeholder="Início, mecanismo de lesão, evolução, tratamentos anteriores, exames realizados..." rows={3} style={{...inp({resize:"vertical",lineHeight:1.5})}} />
            </CollapsibleSub>

            <CollapsibleSub title="Diagnóstico Cinesioterapêutico (DCT)">
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{flex:1}}><span style={lbl()}>DCT</span><input type="text" value={diagnosticoCinesio} onChange={e=>setDiagnosticoCinesio(e.target.value)} style={inp()} placeholder="Ex: Hemiparesia D com espasticidade e disfunção de marcha" /></div>
                {dcSuggestion && !diagnosticoCinesio && <button onClick={()=>setDiagnosticoCinesio(dcSuggestion)} style={{...ghostBtn({padding:"9px 14px",fontSize:11,flexShrink:0}),marginBottom:5}}>← Sugestão</button>}
              </div>
              {dcSuggestion && !diagnosticoCinesio && <div style={{fontSize:10,color:C.textMuted,fontStyle:"italic",marginTop:2}}>Baseado na queixa: {dcSuggestion}</div>}
            </CollapsibleSub>

            <CollapsibleSub title="Histórico Clínico e Comorbidades">
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>Diagnóstico médico</span><input type="text" value={diagnosticoMedico} onChange={e=>setDiagnosticoMedico(e.target.value)} style={inp()} placeholder="Ex: AVC isquêmico hemisfério E" /></div>
                <div><span style={lbl()}>Tempo de lesão</span><input type="text" value={tempoLesao} onChange={e=>setTempoLesao(e.target.value)} style={inp()} placeholder="Ex: 3 meses" /></div>
              </Row>
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px" style={{marginTop:12}}>
                <div><span style={lbl()}>Lado afetado</span><SingleSelect options={["Direito","Esquerdo","Bilateral","Axial (tronco)"]} value={ladoAfetado} onChange={setLadoAfetado} activeColor={C.purple} /></div>
                <div><span style={lbl()}>Medicações</span><input type="text" value={medicacoes} onChange={e=>setMedicacoes(e.target.value)} style={inp()} placeholder="Ex: Baclofeno, Levodopa" /></div>
              </Row>
              <div style={{marginTop:12}}><span style={lbl()}>Mecanismo da lesão</span><textarea value={mecanismoLesao} onChange={e=>setMecanismoLesao(e.target.value)} rows={2} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Descreva o mecanismo da lesão..." /></div>
              <div style={{marginTop:12}}><span style={lbl()}>Comorbidades</span><TagSelect options={["AVE","LESÃO MEDULAR","TCE","DOENÇA DE PARKINSON","ESCLEROSE MÚLTIPLA","ELA","POLIO","ATAXIA","NEUROPATIA PERIFÉRICA","TUMOR SNC","HIDROCEFALIA","PARALISIA FACIAL","DISTROFIA MUSCULAR"]} value={comorbidadesNeuro} onChange={setComorbidadesNeuro} activeColor={C.purple} /></div>
              <div style={{marginTop:8}}><span style={lbl()}>Histórico cirúrgico</span><textarea value={historicoNeuro} onChange={e=>setHistoricoNeuro(e.target.value)} rows={2} style={{...inp({resize:"vertical",lineHeight:1.3,fontSize:12})}} placeholder="Cirurgias prévias, internações, complicações..." /></div>
            </CollapsibleSub>

            <CollapsibleSub title="Sintomas">
              <div><span style={lbl()}>Sintomas</span><TagSelect options={["Fraqueza","Espasticidade","Ataxia","Tremor","Rigidez","Hipomimia","Disartria","Disfagia","Alteração sensitiva","Dor neuropática","Fadiga","Incontinência","Tontura","Visão dupla","Alteração cognitiva"]} value={sintomas} onChange={setSintomas} activeColor={C.purple} /></div>
            </CollapsibleSub>
          </CollapsibleSection>

          <GeneralAssessment storageKey="neuro" studentId={sid} colors={{ ...C, accent: C.purple }} initialBodyPain={localDor} />

          {/* ⚡ Dor e Funcionalidade */}
          <CollapsibleSection title="Dor e Funcionalidade" icon="⚡" expanded={expandedSections.includes("dor")} onToggle={()=>toggleSection("dor")}>
            <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
              <CollapsibleSub title="Escala de Dor (EVA)">
                <EvaSlider label="EVA — Movimento" value={evaMov} onChange={setEvaMov} colors={{text:C.text,textMuted:C.textMuted,card:C.card,border:C.border,font:F,accent:C.purple}} />
                <div style={{marginTop:8}}><EvaSlider label="EVA — Repouso" value={evaRep} onChange={setEvaRep} colors={{text:C.text,textMuted:C.textMuted,card:C.card,border:C.border,font:F,accent:C.purple}} /></div>
              </CollapsibleSub>
              <CollapsibleSub title="Função e Atividades">
                <div><span style={lbl()}>Nível de atividade</span><SingleSelect options={["Sedentário","Levemente ativo","Moderadamente ativo","Muito ativo","Atleta"]} value={nivelAti} onChange={setNivelAti} /></div>
                <div style={{marginTop:10}}><span style={lbl()}>AVDs comprometidas</span><TagSelect options={["Andar","Subir escadas","Agachar","Sentar/levantar","Vestir-se","Higiene pessoal","Dormir","Dirigir","Trabalho","Esporte","Carregar peso","Vida sexual","Sem limitações"]} value={avdsNeuro} onChange={setAvdsNeuro} activeColor={C.purple} /></div>
              </CollapsibleSub>
            </Row>
          </CollapsibleSection>

          {/* 🧠 Estado Cognitivo e Consciência */}
          <CollapsibleSection title="Estado Cognitivo e Consciência" icon="🧠" expanded={expandedSections.includes("cognitivo")} onToggle={()=>toggleSection("cognitivo")}>
            <CollapsibleSub title="Escala de Coma de Glasgow (GCS) — Cálculo em tempo real">
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Avaliação do nível de consciência: 3-15. Use os seletores abaixo.</div>
              <Row cols={isMobile ? "1fr" : "1fr 1fr 1fr"} gap="8px 14px">
                <div>
                  <span style={lbl()}>Abertura Ocular (1-4)</span>
                  <SingleSelect options={[
                    { value: "4", label: "4 — Espontânea" },
                    { value: "3", label: "3 — Ao comando" },
                    { value: "2", label: "2 — À dor" },
                    { value: "1", label: "1 — Nenhuma" },
                  ]} value={gcsScores.aberturaOcular || ""} onChange={v => { const next = { ...gcsScores, aberturaOcular: v }; setGcsScores(next); setGcsResult(calcGlasgow(next)); }} activeColor={C.purple} />
                </div>
                <div>
                  <span style={lbl()}>Resposta Verbal (1-5)</span>
                  <SingleSelect options={[
                    { value: "5", label: "5 — Orientada" },
                    { value: "4", label: "4 — Confusa" },
                    { value: "3", label: "3 — Palavras inapropriadas" },
                    { value: "2", label: "2 — Sons incompreensíveis" },
                    { value: "1", label: "1 — Nenhuma" },
                  ]} value={gcsScores.respostaVerbal || ""} onChange={v => { const next = { ...gcsScores, respostaVerbal: v }; setGcsScores(next); setGcsResult(calcGlasgow(next)); }} activeColor={C.purple} />
                </div>
                <div>
                  <span style={lbl()}>Resposta Motora (1-6)</span>
                  <SingleSelect options={[
                    { value: "6", label: "6 — Obedece comandos" },
                    { value: "5", label: "5 — Localiza dor" },
                    { value: "4", label: "4 — Retira" },
                    { value: "3", label: "3 — Flexão anormal" },
                    { value: "2", label: "2 — Extensão" },
                    { value: "1", label: "1 — Nenhuma" },
                  ]} value={gcsScores.respostaMotora || ""} onChange={v => { const next = { ...gcsScores, respostaMotora: v }; setGcsScores(next); setGcsResult(calcGlasgow(next)); }} activeColor={C.purple} />
                </div>
              </Row>
              {gcsResult && (
                <div style={{ marginTop: 10, background: C.purpleBg, border: `1px solid ${C.purple}40`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, textTransform: "uppercase" }}>Glasgow</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: gcsResult.color }}>{gcsResult.total}/15</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: gcsResult.color }}>{gcsResult.level}</div>
                </div>
              )}
            </CollapsibleSub>
            <div style={{ marginTop: 10 }}>
              <span style={lbl()}>Orientação</span>
              <TagSelect options={["Tempo", "Espaço", "Pessoa", "Situação"]} value={orientacao} onChange={setOrientacao} activeColor={C.purple} />
            </div>
            <div style={{ marginTop: 10 }}>
              <span style={lbl()}>Comunicação</span>
              <SingleSelect options={["Fluente", "Disartria", "Afasia expressiva", "Afasia receptiva", "Muta", "Alternativa/aumentativa"]} value={comunicacao} onChange={setComunicacao} activeColor={C.purple} />
            </div>
            <div style={{ marginTop: 10 }}>
              <span style={lbl()}>Tempo de Ictus / Lesão</span>
              <SingleSelect options={[
                { value: "agudo", label: "Aguda (<72h)" },
                { value: "subagudo", label: "Subaguda (72h–3m)" },
                { value: "cronico", label: "Crônica (3m–1a)" },
                { value: "cronicoEstavel", label: "Crônica estável (>1a)" },
              ]} value={tempoIctus} onChange={setTempoIctus} activeColor={C.purple} />
            </div>
            <div style={{ marginTop: 10 }}>
              <span style={lbl()}>Progressão da lesão</span>
              <SingleSelect options={["Progressiva", "Estacionária", "Regredida (melhora)", "Flutuante / Surtos"]} value={progressaoLesao} onChange={setProgressaoLesao} activeColor={C.purple} />
            </div>
            <div style={{ marginTop: 10 }}>
              <span style={lbl()}>Reações posturais</span>
              <TagSelect options={["Endireitamento", "Equilíbrio", "Proteção", "Anfíbia", "Ausentes"]} value={reacoesPosturais} onChange={setReacoesPosturais} activeColor={C.purple} />
            </div>
          </CollapsibleSection>

          {/* 🔬 Exame Físico */}
          <CollapsibleSection title="Exame Físico" icon="🔬" expanded={expandedSections.includes("exame")} onToggle={()=>toggleSection("exame")}>
            <CollapsibleSub title="Inspeção, Tônus e Marcha">
              <Row cols={isMobile?"1fr":"1fr 1fr"} gap="12px 16px">
                <div><span style={lbl()}>Tônus</span><SingleSelect options={["Normal","Hipotonia","Espasticidade","Rigidez plástica","Rigidez em roda denteada"]} value={tono} onChange={setTono} activeColor={C.purple} /></div>
                <div><span style={lbl()}>Marcha independente</span><SingleSelect options={["Independente","Supervisão","Assistência mínima","Assistência máxima","Não deambula"]} value={marchaIndependente} onChange={setMarchaIndependente} activeColor={C.purple} /></div>
              </Row>
              <div style={{marginTop:8,display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:"8px 16px"}}>
                <div><span style={lbl()}>Postura</span><TagSelect options={["Anteriorização de cabeça","Protração de ombros","Hipercifose torácica","Escoliose","Pelve anteriorizada","Pelve posteriorizada","Sem alterações"]} value={postura} onChange={setPostura} activeColor={C.purple} /></div>
                <div><span style={lbl()}>Marcha</span><TagSelect options={["Hemiparética","Parkinsoniana","Atáxica","Escarvante","Anserina","Miotônica","Não deambula","Normal"]} value={tipoMarcha} onChange={setTipoMarcha} activeColor={C.purple} /></div>
              </div>
              <div style={{marginTop:8}}>
                <span style={lbl()}>Órteses / Dispositivos</span>
                <TagSelect options={["Bengala","Andador","AFO","Cadeira de rodas","Muleta","Órtese de punho","Sem dispositivo"]} value={orteses} onChange={setOrteses} activeColor={C.purple} />
              </div>
              <div style={{marginTop:8}}><span style={lbl()}>Coordenação</span><TagSelect options={["Normal","Dismetria","Ataxia apendicular","Ataxia de marcha","Disdiadococinesia","Tremor intencional"]} value={coordenacao} onChange={setCoordenacao} activeColor={C.purple} /></div>
              <div style={{marginTop:8}}><span style={lbl()}>Edema</span><select value={edema} onChange={e=>setEdema(e.target.value)} style={sel()}>{["","Ausente","Edema leve (1+)","Edema moderado (2+)","Edema importante (3+)","Calor local","Rubor"].map(o=><option key={o} value={o}>{o||"Selecionar…"}</option>)}</select></div>
            </CollapsibleSub>

            {/* Sensibilidade — DermatomeMap */}
            <CollapsibleSub title="Sensibilidade — Mapa de Dermátomos" defaultOpen={false}>
              <DermatomeMap value={sensibilidadeMap} onChange={setSensibilidadeMap} colors={{...C, accent: C.purple, font: F}} />
            </CollapsibleSub>

            {/* Reflexos — Matriz Interativa */}
            <CollapsibleSub title="Reflexos Osteotendíneos e Patológicos" defaultOpen={false}>
              <ReflexMatrix reflexos={reflexosMatriz} onChange={setReflexosMatriz} colors={{...C, accent: C.purple, font: F}} />
            </CollapsibleSub>

            {/* MAS */}
            <CollapsibleSub title="Escala de Ashworth (MAS)">
              <div style={{fontSize:12,color:C.textMuted,marginBottom:8}}>Espasticidade: 0=Sem aumento, 4=Rigidez.</div>
              {MAS_QUESTIONS.map(q => (
                <div key={q.id} style={{marginBottom:6}}>
                  <span style={{...lbl({fontSize:10,marginBottom:2})}}>{q.label}</span>
                  <SingleSelect options={MAS_OPTIONS} value={masScores[q.id]||""} onChange={v=>{const next={...masScores,[q.id]:v};setMasScores(next);setMasResult(calcMAS(next))}} activeColor={C.purple} />
                </div>
              ))}
              {masResult && <div style={{marginTop:8,background:C.purpleBg,border:`1px solid ${C.purple}40`,borderRadius:10,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:10,color:C.textMuted,fontWeight:700,textTransform:"uppercase"}}>MAS</div>
                <div style={{fontSize:28,fontWeight:900,color:masResult.color}}>{masResult.total}/{masResult.max}</div>
                <div style={{fontSize:13,fontWeight:700,color:masResult.color}}>{masResult.level}</div>
              </div>}
            </CollapsibleSub>

            {/* BBS */}
            <CollapsibleSub title="Berg Balance Scale (BBS)">
              <div style={{fontSize:12,color:C.textMuted,marginBottom:8}}>Equilíbrio: 0=Incapaz, 4=Independente. Max 20.</div>
              {BBS_QUESTIONS.map(q => (
                <div key={q.id} style={{marginBottom:6}}>
                  <span style={{...lbl({fontSize:10,marginBottom:2})}}>{q.label}</span>
                  <SingleSelect options={BBS_OPTIONS} value={bbsScores[q.id]||""} onChange={v=>{const next={...bbsScores,[q.id]:v};setBbsScores(next);setBbsResult(calcBBS(next))}} activeColor={C.purple} />
                </div>
              ))}
              {bbsResult && <div style={{marginTop:8,background:C.purpleBg,border:`1px solid ${C.purple}40`,borderRadius:10,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:10,color:C.textMuted,fontWeight:700,textTransform:"uppercase"}}>BBS</div>
                <div style={{fontSize:28,fontWeight:900,color:bbsResult.color}}>{bbsResult.total}/{bbsResult.max}</div>
                <div style={{fontSize:13,fontWeight:700,color:bbsResult.color}}>{bbsResult.level}</div>
              </div>}
            </CollapsibleSub>

            {/* TUG */}
            <CollapsibleSub title="Timed Up and Go (TUG) — Cronômetro Integrado" defaultOpen={false}>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Avalia mobilidade funcional e risco de queda. Paciente levanta, anda 3m, vira, retorna e senta.</div>
              <StopwatchField value={tugSegundos} onChange={setTugSegundos} label="TUG — Timed Up and Go" unit="s" colors={{...C, accent: C.purple, font: F}} />
              {tugSegundos && (
                <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: Number(tugSegundos) <= 10 ? C.green : Number(tugSegundos) <= 20 ? C.amber : C.red }}>
                  {Number(tugSegundos) <= 10 ? "✓ Normal (<10s)" : Number(tugSegundos) <= 20 ? "⚠ Risco moderado de queda (10–20s)" : "🚩 Alto risco de queda (>20s)"}
                </div>
              )}
            </CollapsibleSub>

            {/* MIF */}
            <CollapsibleSub title="Medida de Independência Funcional (MIF)">
              <div style={{fontSize:12,color:C.textMuted,marginBottom:8}}>Funcionalidade: 0=Dep. total, 7=Indep. Max 42.</div>
              {MIF_QUESTIONS.map(q => (
                <div key={q.id} style={{marginBottom:6}}>
                  <span style={{...lbl({fontSize:10,marginBottom:2})}}>{q.label}</span>
                  <SingleSelect options={MIF_OPTIONS} value={mifScores[q.id]||""} onChange={v=>{const next={...mifScores,[q.id]:v};setMifScores(next);setMifResult(calcMIF(next))}} activeColor={C.purple} />
                </div>
              ))}
              {mifResult && <div style={{marginTop:8,background:C.purpleBg,border:`1px solid ${C.purple}40`,borderRadius:10,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:10,color:C.textMuted,fontWeight:700,textTransform:"uppercase"}}>MIF</div>
                <div style={{fontSize:28,fontWeight:900,color:mifResult.color}}>{mifResult.total}/{mifResult.max}</div>
                <div style={{fontSize:13,fontWeight:700,color:mifResult.color}}>{mifResult.level}</div>
              </div>}
            </CollapsibleSub>

            {/* TIS */}
            <CollapsibleSub title="Trunk Impairment Scale (TIS) — Controle de Tronco" defaultOpen={false}>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Avalia controle de tronco: sentado estático (0-7), dinâmico (0-10), transferências (0-6). Max 23.</div>
              {[
                { id: "sentadoEstatico", label: "Sentado estático (0-7)" },
                { id: "sentadoDinamico", label: "Sentado dinâmico (0-10)" },
                { id: "transferencias", label: "Transferências (0-6)" },
              ].map(q => (
                <div key={q.id} style={{ marginBottom: 4 }}>
                  <span style={{ ...lbl({ fontSize: 10, marginBottom: 2 }) }}>{q.label}</span>
                  <input type="number" min="0" max={q.id === "sentadoDinamico" ? 10 : q.id === "transferencias" ? 6 : 7} value={tisScores[q.id] || ""} onChange={e => { const next = { ...tisScores, [q.id]: e.target.value }; setTisScores(next); setTisResult(calcTIS(next)); }}
                    style={inp({ textAlign: "center", fontSize: 14, fontWeight: 700 })} placeholder="Score" />
                </div>
              ))}
              {tisResult && (
                <div style={{ marginTop: 8, background: C.purpleBg, border: `1px solid ${C.purple}40`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, textTransform: "uppercase" }}>TIS</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: tisResult.color }}>{tisResult.total}/{tisResult.max}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: tisResult.color }}>{tisResult.level}</div>
                </div>
              )}
            </CollapsibleSub>

            {/* MRC */}
            <CollapsibleSub title="Força Muscular — MRC (0-5)">
              {forcaRows.map((row,i)=>(
                <MRCRow key={row.id||i} value={row} onChange={v=>setForcaRows(p=>p.map((r,j)=>j===i?{...r,...v}:r))} onRemove={()=>setForcaRows(p=>p.filter((_,j)=>j!==i))}
                  muscleOptions={["Deltoide D","Deltoide E","Bíceps D","Bíceps E","Extensor punho D","Extensor punho E","Flexor quadril D","Flexor quadril E","Quadríceps D","Quadríceps E","Tibial anterior D","Tibial anterior E","Trapézio D","Trapézio E","Peitoral D","Peitoral E","Tríceps D","Tríceps E","Glúteo D","Glúteo E","Isquiotibiais D","Isquiotibiais E","Gastrocnêmio D","Gastrocnêmio E"]}
                  colors={{surface:C.surface,border:C.border,text:C.text,textMuted:C.textMuted,red:C.red,font:F}} />
              ))}
              <button onClick={()=>setForcaRows(p=>[...p,{id:Date.now(),muscle:"",value:""}])} style={ghostBtn({fontSize:11,marginTop:4})}>+ Adicionar músculo</button>
              {forcaRows.filter(r=>r.value).length >= 2 && (()=>{
                const withVals = forcaRows.filter(r=>r.value);
                const avg = (withVals.reduce((a,r)=>a+Number(r.value),0)/withVals.length).toFixed(1);
                const c = avg >= 4 ? C.green : avg >= 3 ? C.amber : C.red;
                return (
                  <div style={{marginTop:8,background:C.purpleBg,border:`1px solid ${C.purple}40`,borderRadius:8,padding:"8px 12px",textAlign:"center"}}>
                    <span style={{fontSize:10,color:C.textMuted,fontWeight:700}}>Média MRC: </span>
                    <span style={{fontSize:16,fontWeight:900,color:c}}>{avg}/5</span>
                    <span style={{fontSize:10,color:C.textMuted}}> ({withVals.length} grupos)</span>
                  </div>
                );
              })()}
            </CollapsibleSub>
          </CollapsibleSection>

          {/* 📐 Goniometria */}
          <CollapsibleSection title="Goniometria" icon="📐" expanded={expandedSections.includes("gonio")} onToggle={()=>toggleSection("gonio")} badge={`${gonioRows.filter(g=>g.value).length} med.`}>
            {gonioRows.map((row,i)=>(
              <GonioRow key={row.id||i} value={row} onChange={v=>setGonioRows(p=>p.map((r,j)=>j===i?{...r,...v}:r))} onRemove={()=>setGonioRows(p=>p.filter((_,j)=>j!==i))}
                colors={{surface:C.surface,border:C.border,text:C.text,textMuted:C.textMuted,red:C.red,font:F}} />
            ))}
            <button onClick={()=>setGonioRows(p=>[...p,{id:Date.now(),joint:"",movement:"",value:""}])} style={ghostBtn({fontSize:11,marginTop:4})}>+ Adicionar medida</button>
          </CollapsibleSection>

          {/* 🧪 Testes Especiais */}
          {kbList.length > 0 && kbList[0]?.testes?.length > 0 && (
            <CollapsibleSection title={`Testes Especiais — ${kbList[0].label}`} icon="🧪" expanded={expandedSections.includes("testes")} onToggle={()=>toggleSection("testes")}>
              {kbList[0].testes.map(tKey => {
                const test = NEURO_TESTES[tKey];
                if (!test) return null;
                const testKey = `${kbList[0].key}|${tKey}`;
                return <TestCard key={testKey} test={{...test, name:test.nome}} result={tests[testKey]} onResult={v=>setTests(p=>({...p,[testKey]:v}))}
                  colors={{surface:C.surface,cardAlt:C.cardAlt,card:C.card,border:C.border,text:C.text,textMuted:C.textMuted,green:C.green,greenBg:C.greenBg,red:C.red,redBg:C.redBg,amber:C.amber,amberBg:C.amberBg,blue:C.blue,font:F}} />;
              })}
            </CollapsibleSection>
          )}

          {/* 💬 Observações Clínicas */}
          <CollapsibleSection title="Observações Clínicas" icon="💬" expanded={expandedSections.includes("obs")} onToggle={()=>toggleSection("obs")}>
            <span style={lbl()}>Palpação</span>
            <textarea value={palpacao} onChange={e=>setPalpacao(e.target.value)} rows={2} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Pontos gatilho, espasmo, dor à palpação..." />
            <div style={{marginTop:10}}>
              <span style={lbl()}>Observações adicionais</span>
              <textarea value={obs} onChange={e=>setObs(e.target.value)} rows={3} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Comportamento, achados, exames de imagem, considerações clínicas..." />
            </div>
            <div style={{marginTop:10}}>
              <span style={lbl()}>Evolução clínica</span>
              <textarea value={evolucaoNeuro} onChange={e=>setEvolucaoNeuro(e.target.value)} rows={3} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Evolução desde a última sessão..." />
            </div>
          </CollapsibleSection>

          {/* 🎯 Metas e Plano de Ação */}
          <CollapsibleSection title="Metas e Plano de Ação" icon="🎯" expanded={expandedSections.includes("metas")} onToggle={()=>toggleSection("metas")}>
            <CollapsibleSub title="Metas de Curto Prazo">
              <div style={{fontSize:11,color:C.textMuted,marginBottom:6}}>Selecione as metas para as próximas 4-8 semanas.</div>
              <TagSelect options={["Ganhar ADM", "Sentar sem apoio", "Deambular com bengala", "Reduzir EVA em 2 pts", "Melhorar equilíbrio estático", "Melhorar equilíbrio dinâmico", "Transferências independentes", "Vestir-se com mín. assistência", "Higiene pessoal independente", "Reduzir fadiga", "Aumentar cadência"]} value={metasCurtoPrazo} onChange={setMetasCurtoPrazo} activeColor={C.purple} />
            </CollapsibleSub>
            <CollapsibleSub title="Metas de Longo Prazo" defaultOpen={false}>
              <textarea value={metasLongoPrazo} onChange={e=>setMetasLongoPrazo(e.target.value)} rows={3} placeholder="Ex: Marcha independente em 6 meses, retorno ao trabalho, independência funcional..."
                style={{...inp({resize:"vertical",lineHeight:1.5})}} />
            </CollapsibleSub>
            <CollapsibleSub title="Plano de Ação — Fases do Tratamento" defaultOpen={false}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Defina as fases do plano de reabilitação. Cada fase contém objetivos, número de sessões e intervenções.</div>
              {planoAcao.map((fase, i) => (
                <div key={i} style={{background:C.cardAlt,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.purple}}>Fase {i+1}</span>
                    <button onClick={()=>setPlanoAcao(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:14,fontFamily:F}}>×</button>
                  </div>
                  <input value={fase.nomeFase||""} onChange={e=>{const next=[...planoAcao];next[i]={...next[i],nomeFase:e.target.value};setPlanoAcao(next)}} placeholder="Nome da fase (ex: Fase 1 — Analgesia e Controle Motor)"
                    style={{...inp({fontSize:12,marginBottom:6})}} />
                  <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:6}}>
                    <input value={fase.numSessoes||""} onChange={e=>{const next=[...planoAcao];next[i]={...next[i],numSessoes:e.target.value};setPlanoAcao(next)}} placeholder="Nº de sessões (ex: 1-4)"
                      style={{...inp({fontSize:11})}} />
                    <input value={fase.frequencia||""} onChange={e=>{const next=[...planoAcao];next[i]={...next[i],frequencia:e.target.value};setPlanoAcao(next)}} placeholder="Frequência semanal (ex: 2x/semana)"
                      style={{...inp({fontSize:11})}} />
                  </div>
                  <textarea value={fase.intervencoes||""} onChange={e=>{const next=[...planoAcao];next[i]={...next[i],intervencoes:e.target.value};setPlanoAcao(next)}} rows={2} placeholder="Intervenções detalhadas da fase..."
                    style={{...inp({resize:"vertical",lineHeight:1.4,marginTop:6,fontSize:11})}} />
                </div>
              ))}
              <button onClick={()=>setPlanoAcao(p=>[...p,{nomeFase:"",numSessoes:"",frequencia:"",intervencoes:""}])} style={ghostBtn({fontSize:11})}>+ Adicionar fase</button>
            </CollapsibleSub>
          </CollapsibleSection>

          {/* 📊 Escalas Padronizadas */}
          <CollapsibleSection title="Escalas Padronizadas" icon="📊" expanded={expandedSections.includes("escalas")} onToggle={()=>toggleSection("escalas")}>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.5}}>Selecione uma escala validada para aplicar ao paciente. Os resultados ficam salvos neste módulo.</div>
             <ScaleSelector scaleNames={["Fugl-Meyer Assessment","NIH Stroke Scale (NIHSS)","SCIM III","EDSS","Barthel Index","Glasgow Coma Scale (GCS)","Trunk Impairment Scale (TIS)"]}
              onSave={handleScaleSave} savedResults={savedScales} />
            {savedScales.length > 0 && (
              <div style={{marginTop:12}}>
                <span style={{fontSize:9,fontWeight:700,color:C.green,textTransform:"uppercase",letterSpacing:"0.08em"}}>✓ Resultados Salvos: {savedScales.length}</span>
                <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6}}>
                  {savedScales.slice().reverse().map((r,i) => (
                    <div key={i} style={{background:C.greenBg,borderRadius:6,padding:"6px 10px",fontSize:10,color:C.text,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${C.green}30`}}>
                      <span><strong>{r.shortName || r.scaleName}</strong>: {r.pct}% — {r.interpretation}</span>
                      <span style={{fontSize:9,color:C.textMuted}}>{r.savedAt?.slice(0,10) || r.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleSection>

          {/* 🤖 Análise por IA */}
          <CollapsibleSection title="Análise por Inteligência Artificial — Baseada em Evidências" icon="🤖" expanded={expandedSections.includes("ia")} onToggle={()=>toggleSection("ia")}>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.6}}>Preencha os campos da avaliação e clique em analisar. A IA cruzará os dados com evidências científicas atualizadas para sugerir intervenções, prognosticar e gerar relatório.</div>
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
            <button onClick={()=>{handleSave(); saveAssessment()}} style={primaryBtn({padding:"11px 26px",fontSize:14})}>💾 Salvar Avaliação Completa</button>
          </div>
        </>}

        {/* ════════ TAB: SESSÕES ════════ */}
        {tab === "evolucao" && <>
          {enhancer.redFlags.length > 0 && (
            <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
              flags={mergedRedFlags} colors={neuroColors} />
          )}
          <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={neuroColors} sessionLabel="Evolução" specialty="neuro" proceduresCategories={PROCEDIMENTOS_CATEGORIES_NEURO} defaultExpanded={true} pain={enhancer.pain} setPain={enhancer.setPain} />
          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:4}}>
            <button onClick={handleSave} style={primaryBtn({padding:"11px 26px",fontSize:14})}>💾 Salvar Tudo</button>
          </div>
        </>}

        {/* ════════ TAB: RELATÓRIO ════════ */}
        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome||"—"}
            moduleLabel="Neurofuncional" colors={neuroColors} />
        )}

        {/* ════════ TAB: EVIDÊNCIAS ════════ */}
        {tab === "evidencias" && (
          <Section title="Diretrizes e Evidências em Reabilitação Neurológica" icon="🔬">
            <div style={{fontSize:13,color:C.textMuted,marginBottom:14,lineHeight:1.6}}>Diretrizes baseadas em evidências para reabilitação neurológica, organizadas por condição.</div>
            {Object.entries(NEURO_EVIDENCE).map(([key,condition])=>{
              const active = diagnosticoMedico.toLowerCase().includes(key.replace(/_/g," "))||comorbidadesNeuro.some(c=>c.toLowerCase().includes(key.replace(/_/g," ")));
              return (
                <div key={key} style={{...card(),border:active?`1px solid ${C.purple}50`:`1px solid ${C.border}`,opacity:active?1:0.6,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    {active&&<span style={{fontSize:10,fontWeight:800,color:C.purple,background:C.purpleBg,padding:"2px 8px",borderRadius:6}}>Condição identificada ✓</span>}
                    <span style={{fontWeight:700,fontSize:14,color:C.text}}>{condition.label}</span>
                  </div>
                  <div style={{fontSize:12,color:C.textSub,lineHeight:1.7,marginBottom:8}}>{condition.goldStandard}</div>
                  {condition.escalas&&<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{condition.escalas.map(s=><span key={s} style={{fontSize:10,color:C.purple,background:C.purpleBg,border:`1px solid ${C.purple}30`,borderRadius:6,padding:"2px 8px"}}>{s}</span>)}</div>}
                  {condition.referencias?.map((ref,i)=>(
                    <div key={i} style={{marginTop:6,fontSize:10,color:C.blue}}><a href={ref.url} target="_blank" rel="noopener noreferrer" style={{color:C.blue}}>{ref.id} — {ref.title}</a></div>
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
