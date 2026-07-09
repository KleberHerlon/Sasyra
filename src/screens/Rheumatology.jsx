import { useState, useEffect } from "react";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import CifAndHonorarios from "../components/CifAndHonorarios";
import CifSection from "../components/CifSection";
import { CIF } from "../data/cif";
import { CollapsibleSection, CollapsibleSub, AudioField } from "../components";
import ScaleSelector from "../components/ScaleSelector";
import AssignFromOtherModules from "../components/AssignFromOtherModules";
import GeneralAssessment from "../components/GeneralAssessment";
import { detectLocalDor } from "../utils/clinicalDetection.js";
import { useClinicalScan } from "../hooks/useClinicalScan.js";
import { useSemanticScanner } from "../hooks/useSemanticScanner.js";
import { extractClinicalEntities } from "../utils/clinicalDetection.js";
import LogoSVG from "../components/LogoSVG";
import { calcDAS28, calcBASDAI, calcHAQ, calcWOMAC, calcWPI } from "../data/rheumatologyScales";

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

function saveReumatoData(studentId, data) {
  try { localStorage.setItem(`reumato_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadReumatoData(studentId) {
  try { const d = localStorage.getItem(`reumato_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

const JOINT_28 = [
  "Ombro D", "Ombro E",
  "Cotovelo D", "Cotovelo E",
  "Punho D", "Punho E",
  "MCF 1 D", "MCF 1 E", "MCF 2 D", "MCF 2 E", "MCF 3 D", "MCF 3 E", "MCF 4 D", "MCF 4 E", "MCF 5 D", "MCF 5 E",
  "IFP 1 D", "IFP 1 E", "IFP 2 D", "IFP 2 E", "IFP 3 D", "IFP 3 E", "IFP 4 D", "IFP 4 E", "IFP 5 D", "IFP 5 E",
  "Joelho D", "Joelho E",
];

const HAQ_CATEGORIES = [
  { id:"vestir", label:"Vestir-se e arrumar-se" },
  { id:"levantar", label:"Levantar-se" },
  { id:"comer", label:"Alimenta\u00e7\u00e3o" },
  { id:"andar", label:"Andar" },
  { id:"higiene", label:"Higiene" },
  { id:"alcancar", label:"Alcan\u00e7ar" },
  { id:"preensao", label:"Preens\u00e3o" },
  { id:"atividades", label:"Atividades di\u00e1rias" },
];

const WOMAC_PAIN = [
  { id:"wp1", label:"Andando em superf\u00edcie plana" },
  { id:"wp2", label:"Subindo ou descendo escadas" },
  { id:"wp3", label:"\u00c0 noite na cama" },
  { id:"wp4", label:"Sentado ou deitado" },
  { id:"wp5", label:"Em p\u00e9" },
];

const WOMAC_STIFFNESS = [
  { id:"ws1", label:"Rigidez ao acordar" },
  { id:"ws2", label:"Rigidez ap\u00f3s repouso" },
];

const WOMAC_FUNCTION = [
  { id:"wf1", label:"Descer escadas" },
  { id:"wf2", label:"Subir escadas" },
  { id:"wf3", label:"Levantar da cama" },
  { id:"wf4", label:"Ficar em p\u00e9" },
  { id:"wf5", label:"Abaixar-se" },
  { id:"wf6", label:"Andar em piso plano" },
  { id:"wf7", label:"Entrar/sair de carro" },
  { id:"wf8", label:"Ir \u00e0s compras" },
  { id:"wf9", label:"Calcular meias" },
  { id:"wf10", label:"Sair da cama" },
  { id:"wf11", label:"Tirar meias" },
  { id:"wf12", label:"Deitar na cama" },
  { id:"wf13", label:"Entrar/sair do banho" },
  { id:"wf14", label:"Sentar-se" },
  { id:"wf15", label:"Sentar/levantar do vaso" },
  { id:"wf16", label:"Tarefas dom\u00e9sticas pesadas" },
  { id:"wf17", label:"Tarefas dom\u00e9sticas leves" },
];

const REUMATO_EVIDENCE = {
  artrite_reumatoide: {
    cif:["b710","b715","b730","d445","d540","d850"],
    label:"Artrite Reumatoide (AR)",
    goldStandard:"Exerc\u00edcio aer\u00f3bio (caminhada, bicicleta) e fortalecimento muscular de intensidade moderada. Exerc\u00edcios de ADM para prevenir contraturas. Treino de AVDs com adapta\u00e7\u00f5es. Terapia de calor/frio para al\u00edvio dos sintomas. \u00d3rteses para punho e m\u00e3o em repouso noturno. Orienta\u00e7\u00e3o sobre prote\u00e7\u00e3o articular e conserva\u00e7\u00e3o de energia. Atividade f\u00edsica regular reduz progress\u00e3o radiol\u00f3gica (EULAR 2022 - Evid\u00eancia A). Evitar exerc\u00edcios de alto impacto durante crises agudas.",
    escalas:["DAS28","HAQ","WOMAC","CDAI","SDAI","RADAI"],
    referencias:[{ id:"EULAR 2022", title:"EULAR recommendations for physical activity in RA", url:"https://ard.bmj.com/content/81/9/1302" }],
  },
  osteoartrite: {
    cif:["b710","b715","b28015","d410","d450"],
    label:"Osteoartrite (OA)",
    goldStandard:"Exerc\u00edcio aer\u00f3bio de baixo impacto (hidroterapia, bicicleta, caminhada). Fortalecimento muscular (quadr\u00edceps em OA de joelho). Treino de propriocep\u00e7\u00e3o e equil\u00edbrio. Controle de peso corporal. Terapia manual para al\u00edvio de dor. Eletroterapia (TENS) para analgesia. Palmilhas e \u00f3rteses para descarga articular. Tai Chi e Yoga para OA de joelho. Evitar sobrecarga articular repetitiva (OARSI 2022 - Evid\u00eancia A).",
    escalas:["WOMAC","Lequesne","KOOS","HOOS","HAQ"],
    referencias:[{ id:"OARSI 2022", title:"OARSI guidelines for non-surgical management of knee OA", url:"https://oarsi.org/research/guidelines" }],
  },
  espondilite_anquilosante: {
    cif:["b710","b715","b28013","d410","d415","d850"],
    label:"Espondilite Anquilosante",
    goldStandard:"Exerc\u00edcios de alongamento da coluna e expans\u00e3o tor\u00e1cica di\u00e1rios. Fortalecimento da musculatura paravertebral. Treino postural (evitar cifose). Hidroterapia \u00e9 altamente recomendada. Exerc\u00edcio aer\u00f3bio regular para condicionamento. T\u00e9cnicas de reeduca\u00e7\u00e3o respirat\u00f3ria. Alongamento de cadeia anterior (peitoral, flexores de quadril). Programa domiciliar di\u00e1rio \u00e9 essencial (ASAS/EULAR 2022 - Evid\u00eancia A).",
    escalas:["BASDAI","BASFI","BASMI","ASDAS","HAQ"],
    referencias:[{ id:"ASAS/EULAR 2022", title:"ASAS-EULAR recommendations for axial SpA management", url:"https://ard.bmj.com/content/81/11/1514" }],
  },
  lupus: {
    cif:["b710","b730","b152","d570","d850","s810"],
    label:"L\u00fapus Eritematoso Sist\u00eamico (LES)",
    goldStandard:"Exerc\u00edcio aer\u00f3bio de intensidade leve a moderada (caminhada, bicicleta, nata\u00e7\u00e3o). Fortalecimento muscular progressivo. Alongamento global para fadiga muscular. Treino de equil\u00edbrio (risco de quedas aumentado). Evitar exposi\u00e7\u00e3o solar durante exerc\u00edcios ao ar livre. Repouso adequado entre sess\u00f5es. Hidroterapia \u00e9 bem tolerada. Atividade f\u00edsica regular reduz fadiga e melhora QV (Lupus Science & Medicine 2022 - Evid\u00eancia A). Contraindicado exerc\u00edcio intenso durante flare.",
    escalas:["SLEDAI","HAQ","FACIT-Fadiga","SF-36"],
    referencias:[{ id:"Lupus Sci Med 2022", title:"Exercise in SLE - systematic review and meta-analysis", url:"https://lupus.bmj.com/content/9/1/e000686" }],
  },
  fibromialgia: {
    cif:["b280","b130","b152","d240","d850"],
    label:"Fibromialgia",
    goldStandard:"Exerc\u00edcio aer\u00f3bio de intensidade moderada: caminhada, hidroterapia, ciclismo, 30-45 min, 3-5x/semana. Fortalecimento progressivo de baixa a moderada intensidade. Tai Chi, Yoga e Pilates s\u00e3o eficazes. Treino de alongamento e relaxamento. Terapia cognitivo-comportamental (TCC) associada. Higiene do sono essencial. Educa\u00e7\u00e3o em neuroci\u00eancia da dor. Evitar exerc\u00edcio extenuante em dias de crise. Iniciar com baixa intensidade e progredir gradualmente (EULAR 2022 - Evid\u00eancia A).",
    escalas:["FIQ (Fibromyalgia Impact Questionnaire)","WPI (Widespread Pain Index)","SSS (Symptom Severity Scale)","HAQ","SF-36"],
    referencias:[{ id:"EULAR 2022", title:"EULAR revised recommendations for fibromyalgia management", url:"https://ard.bmj.com/content/81/3/318" }],
  },
  gota: {
    cif:["b710","b715","b28015","d450","d410"],
    label:"Gota / Artrite Gotosa",
    goldStandard:"Exerc\u00edcio aer\u00f3bio moderado: hidroterapia, bicicleta, caminhada. Fortalecimento muscular geral. Alongamento de ADM completa, exceto durante crise aguda. Treino de marcha com descarga de peso conforme toler\u00e2ncia. Orienta\u00e7\u00e3o nutricional e controle de peso (dieta pobre em purinas). Hidrata\u00e7\u00e3o adequada. Evitar exerc\u00edcio durante crise gotosa aguda (repouso articular). Controle de comorbidades (hipertens\u00e3o, diabetes).",
    escalas:["HAQ","WOMAC (se joelho afetado)","SF-36"],
    referencias:[{ id:"ACR 2020", title:"ACR Guideline for the Management of Gout", url:"https://rheumatology.org/gout-guideline" }],
  },
  esclerodermia: {
    cif:["s810","b710","b730","d445","d4401","d570"],
    label:"Esclerodermia / Esclerose Sist\u00eamica",
    goldStandard:"Exerc\u00edcio aer\u00f3bio moderado para condicionamento cardiovascular. Alongamento facial e oral para microstomia. Mobiliza\u00e7\u00e3o de m\u00e3os e dedos (contraturas em flex\u00e3o). Exerc\u00edcios respirat\u00f3rios e expans\u00e3o tor\u00e1cica (fibrose pulmonar). Terapia de calor para al\u00edvio de rigidez. Prote\u00e7\u00e3o articular e adapta\u00e7\u00f5es para AVDs. Evitar frio intenso (fen\u00f4meno de Raynaud). Massagem suave para \u00falceras digitais. Hidroterapia \u00e9 bem tolerada.",
    escalas:["HAQ","MSS (Modified Rodnan Skin Score)","SF-36","FACIT-Fadiga"],
    referencias:[{ id:"EULAR 2023", title:"EULAR recommendations for SSC management", url:"https://ard.bmj.com/content/82/1/19" }],
  },
};

function generateCIFReuma({ evaMov, avds }) {
  const result = [];
  if (evaMov >= 7) result.push({ code:"b280", desc:"Sensação de dor intensa", qualifier:3 });
  else if (evaMov >= 4) result.push({ code:"b280", desc:"Sensação de dor moderada", qualifier:2 });
  else if (evaMov >= 1) result.push({ code:"b280", desc:"Sensação de dor leve", qualifier:1 });
  result.push({ code:"b730", desc:"Força muscular", qualifier:2 });
  result.push({ code:"b710", desc:"Mobilidade das articulações", qualifier:2 });
  if (avds?.some(c => c.includes("Andar"))) result.push({ code:"d450", desc:"Andar", qualifier:2 });
  if (avds?.some(c => c.includes("Tarefas"))) result.push({ code:"d640", desc:"Realizar tarefas domésticas", qualifier:2 });
  return result;
}

export default function Rheumatology({ student, students, allPatients, currentModuleId, onSelectStudent, onAddStudent, onUpdateStudent, onUpdateStudentById, onDeleteStudent,
  plan, onUpgrade, canUseFeature, tryFeature, aiRemaining, aiLimit, hasExpansion, purchaseAIExpansion,
  onAgenda, onFinanceiro, onSubscription, planLabel }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");
  const [regiao, setRegiao] = useState("Centro-Oeste");

  const [queixaReumato, setQueixaReumato] = useState("");
  const [hdaReuma, setHdaReuma] = useState("");
  const [diagnosticoCinesioReuma, setDiagnosticoCinesioReuma] = useState("");
  const [localDor, setLocalDor] = useState([]);
  const [diagnosticoReumato, setDiagnosticoReumato] = useState("");
  const [tempoDiagnostico, setTempoDiagnostico] = useState("");
  const [rigidezMatinal, setRigidezMatinal] = useState("");
  const [articulacoesDolorosas, setArticulacoesDolorosas] = useState([]);
  const [articulacoesEdemaciadas, setArticulacoesEdemaciadas] = useState([]);
  const [fadigaFACT, setFadigaFACT] = useState("");
  const [escalaFadiga, setEscalaFadiga] = useState("");
  const [historicoReumato, setHistoricoReumato] = useState("");
  const [medicacoesReumato, setMedicacoesReumato] = useState("");

  const [das28Tender, setDas28Tender] = useState("");
  const [das28Swollen, setDas28Swollen] = useState("");
  const [das28ESR, setDas28ESR] = useState("");
  const [das28Global, setDas28Global] = useState("");
  const [das28Result, setDas28Result] = useState(null);

  const [basdaiScores, setBasdaiScores] = useState({});
  const [basdaiResult, setBasdaiResult] = useState(null);

  const [haqScores, setHaqScores] = useState({});
  const [haqResult, setHaqResult] = useState(null);

  const [womacPain, setWomacPain] = useState({});
  const [womacStiffness, setWomacStiffness] = useState({});
  const [womacFunction, setWomacFunction] = useState({});
  const [womacResult, setWomacResult] = useState(null);

  const [wpiValue, setWpiValue] = useState("");
  const [sssValue, setSssValue] = useState("");
  const [wpiResult, setWpiResult] = useState(null);

  const [evolucaoReumato, setEvolucaoReumato] = useState("");

  const [expandedSections, setExpandedSections] = useState([]);
  const toggleSection = (id) => { setExpandedSections(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]); };
  const sid = student?.id || student?.nome;
  const enhancer = useEnhancer("reumatologia", sid, `reumato_enhancer_${sid}`);
  const [savedScales, setSavedScales] = useState(() => { try { const d = localStorage.getItem(`reumato_scales_${sid}`); return d ? JSON.parse(d) : []; } catch { return []; } });
  const handleScaleSave = (result) => {
    const next = [...savedScales, { ...result, savedAt: new Date().toISOString() }];
    setSavedScales(next);
    try { localStorage.setItem(`reumato_scales_${sid}`, JSON.stringify(next)); } catch {}
  };
  const reumatoColors = { ...C, accent: C.purple, font: F };
  const autoCifReuma = generateCIFReuma({ evaMov: enhancer.pain.evaMov, avds: [] });
  const matchedCif = Object.entries(REUMATO_EVIDENCE).find(([key]) =>
    (queixaReumato||"").toLowerCase().includes(key.replace(/_/g," "))
  );
  const cifSuggestionsReuma = matchedCif ? matchedCif[1].cif || [] : [];

  useEffect(() => {
    if (student?.id || student?.nome) {
      const saved = loadReumatoData(sid);
      if (saved) {
        setQueixaReumato(saved.queixaReumato || "");
        setHdaReuma(saved.hdaReuma || "");
        setDiagnosticoCinesioReuma(saved.diagnosticoCinesioReuma || "");
        setDiagnosticoReumato(saved.diagnosticoReumato || "");
        setTempoDiagnostico(saved.tempoDiagnostico || "");
        setRigidezMatinal(saved.rigidezMatinal || "");
        setArticulacoesDolorosas(saved.articulacoesDolorosas || []);
        setArticulacoesEdemaciadas(saved.articulacoesEdemaciadas || []);
        setFadigaFACT(saved.fadigaFACT || "");
        setEscalaFadiga(saved.escalaFadiga || "");
        setHistoricoReumato(saved.historicoReumato || "");
        setMedicacoesReumato(saved.medicacoesReumato || "");
        setDas28Tender(saved.das28Tender || "");
        setDas28Swollen(saved.das28Swollen || "");
        setDas28ESR(saved.das28ESR || "");
        setDas28Global(saved.das28Global || "");
        setDas28Result(saved.das28Result || null);
        setBasdaiScores(saved.basdaiScores || {});
        setBasdaiResult(saved.basdaiResult || null);
        setHaqScores(saved.haqScores || {});
        setHaqResult(saved.haqResult || null);
        setWomacPain(saved.womacPain || {});
        setWomacStiffness(saved.womacStiffness || {});
        setWomacFunction(saved.womacFunction || {});
        setWomacResult(saved.womacResult || null);
        setWpiValue(saved.wpiValue || "");
        setSssValue(saved.sssValue || "");
        setWpiResult(saved.wpiResult || null);
        setEvolucaoReumato(saved.evolucaoReumato || "");
        setLocalDor(saved.localDor || []);
        if (saved.pain) enhancer.setPain(saved.pain);
        if (saved.logs) enhancer.setLogs(saved.logs);
        if (saved.redFlags) enhancer.setRedFlags(saved.redFlags);
        if (saved.aiRes) enhancer.setAiRes(saved.aiRes);
      }
    }
  }, [student?.id, student?.nome]);

  const { entities } = useClinicalScan(queixaReumato);
  const { detected } = useSemanticScanner(queixaReumato, {});

  useEffect(() => {
    const regions = detectLocalDor(queixaReumato);
    if (regions.length > 0) setLocalDor(prev => [...new Set([...prev, ...regions])]);
  }, [queixaReumato]);

  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    const sid = student.id || student.nome;
    saveReumatoData(sid, {
      queixaReumato, hdaReuma, diagnosticoCinesioReuma, diagnosticoReumato, tempoDiagnostico, rigidezMatinal,
      articulacoesDolorosas, articulacoesEdemaciadas, fadigaFACT, escalaFadiga,
      historicoReumato, medicacoesReumato,
      das28Tender, das28Swollen, das28ESR, das28Global, das28Result,
      basdaiScores, basdaiResult, haqScores, haqResult,
      womacPain, womacStiffness, womacFunction, womacResult,
      wpiValue, sssValue, wpiResult, evolucaoReumato, localDor,
      pain: enhancer.pain, logs: enhancer.logs, redFlags: enhancer.redFlags, aiRes: enhancer.aiRes,
      data: new Date().toISOString().slice(0,10),
    });
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um paciente para iniciar o atendimento</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Pacientes {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Novo Paciente"}
          </button>
        </div>
        <div style={{ marginTop:8 }}>
          <AssignFromOtherModules allPatients={allPatients} currentModuleId={currentModuleId} onUpdateStudentById={onUpdateStudentById} accentColor={C.purple} />
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
                onAddStudent({ ...f, id:Date.now(), data:new Date().toISOString().slice(0,10), assignedModules: [currentModuleId] });
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
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <LogoSVG C={C} F={F}/>
          <button onClick={()=>setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Trocar paciente">👥 Pacientes</button>
          {onAgenda && <button onClick={onAgenda} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Agenda">📅 Agenda</button>}
          {onFinanceiro && <button onClick={onFinanceiro} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Financeiro">💰 Financeiro</button>}
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Anamnese"],["avaliacao","🔬","Avaliação"],["evolucao","📈","Evolução"],["sessoes","📅","Sessões"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.purpleBg : "transparent",
              border: `1px solid ${tab === k ? C.purple + "50" : "transparent"}`,
              borderRadius:8, padding:"7px 14px", fontSize:12,
              fontWeight: tab === k ? 700 : 400,
              color: tab === k ? C.purple : C.textMuted, cursor:"pointer", fontFamily:F,
            }}>{ic} {lb}</button>
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
            <><div style={{ width:30, height:30, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.purple }}>{student.nome[0]?.toUpperCase()}</div>
              <span style={{ fontSize:12, color:C.textSub, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.nome}</span></>
          )}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"20px 16px" }}>
        {tab === "anamnese" && (
          <>
            <Section title="Anamnese Reumatológica" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados da avaliação reumatológica, diagnóstico, tempo de doença, rigidez matinal e articulações envolvidas.
              </div>
              <div style={{ background:"C.redBg", border:"1.5px solid C.red", borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"C.red" }}>Queixa principal</span>
                    <span style={{ fontSize:9, fontWeight:800, color:"#fff", background:"C.red", borderRadius:6, padding:"2px 8px", letterSpacing:"0.05em", textTransform:"uppercase" }}>OBRIGATÓRIO</span>
                  </div>
                  <span style={{ fontSize:10, color:"C.red", opacity:0.7 }}>— digite ou use o microfone</span>
                </div>
                <AudioField value={queixaReumato} onChange={v=>setQueixaReumato(typeof v==="function"?v(queixaReumato):v)} placeholder="Ex: Dor poliarticular simétrica há 6 meses, rigidez matinal >1h..." rows={2} style={{background:"C.surface",border:"1px solid C.border",borderRadius:8,color:"C.text",fontSize:13,padding:"9px 12px",fontFamily:F,lineHeight:1.5}} />
              </div>
              {queixaReumato && entities && (entities.muscles?.length>0||entities.laterality||entities.painChars?.length>0) && (
                <div style={{ background:"C.blueBg", border:"1px solid rgba(96,165,250,0.25)", borderRadius:10, padding:"10px 14px", margin:"12px 0" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"C.blue", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>🔍 Varredura Semântica</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, fontSize:12 }}>
                    {entities.muscles?.length>0 && <span style={{color:"C.textSub"}}>Músculos: <strong style={{color:"C.text"}}>{entities.muscles.join(", ")}</strong></span>}
                    {entities.laterality && <span style={{color:"C.textSub"}}>Lateralidade: <strong style={{color:"C.text"}}>{entities.laterality}</strong></span>}
                    {entities.painChars?.length>0 && <span style={{color:"C.textSub"}}>Caráter: <strong style={{color:"C.text"}}>{entities.painChars.join(", ")}</strong></span>}
                  </div>
                </div>
              )}
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Diagnóstico médico / Condição reumática</span>
                <input type="text" value={diagnosticoReumato} onChange={e => setDiagnosticoReumato(e.target.value)} style={inp()} placeholder="Ex: Artrite Reumatoide soropositiva, Espondilite Anquilosante..." />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>HDA — História da Doença Atual</span>
                <AudioField value={hdaReuma} onChange={v => setHdaReuma(typeof v === "function" ? v(hdaReuma) : v)} placeholder="Início, evolução, tratamentos prévios, exames realizados…" rows={3} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Diagnóstico Cinesioterapêutico (DCT)</span>
                <input type="text" value={diagnosticoCinesioReuma} onChange={e => setDiagnosticoCinesioReuma(e.target.value)} style={inp()} placeholder="Ex: Artrite Reumatoide com limitação funcional e rigidez matinal" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Tempo de diagnóstico</span>
                  <input type="text" value={tempoDiagnostico} onChange={e => setTempoDiagnostico(e.target.value)} style={inp()} placeholder="Ex: 2 anos, 6 meses, 10 anos" />
                </div>
                <div>
                  <span style={lbl()}>Rigidez matinal (minutos)</span>
                  <input type="number" value={rigidezMatinal} onChange={e => setRigidezMatinal(e.target.value)} style={inp()} placeholder="Ex: 45 minutos" min={0} />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Articulações dolorosas (contagem 28)</span>
                <TagSelect options={JOINT_28} value={articulacoesDolorosas} onChange={setArticulacoesDolorosas} activeColor={C.purple} />
                <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>Selecionadas: {articulacoesDolorosas.length}</div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Articulações edemaciadas (contagem 28)</span>
                <TagSelect options={JOINT_28} value={articulacoesEdemaciadas} onChange={setArticulacoesEdemaciadas} activeColor={C.purple} />
                <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>Selecionadas: {articulacoesEdemaciadas.length}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Fadiga — FACT-F (0-52)</span>
                  <input type="number" value={fadigaFACT} onChange={e => setFadigaFACT(e.target.value)} style={inp()} min={0} max={52} placeholder="0-52" />
                </div>
                <div>
                  <span style={lbl()}>Escala de fadiga (0-10)</span>
                  <input type="number" value={escalaFadiga} onChange={e => setEscalaFadiga(e.target.value)} style={inp()} min={0} max={10} step={0.1} placeholder="0-10" />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Histórico médico / Cirurgias</span>
                  <textarea value={historicoReumato} onChange={e => setHistoricoReumato(e.target.value)} rows={2}
                    style={{ ...inp({ resize:"vertical", lineHeight:1.3, fontSize:12 }) }}
                    placeholder="Cirurgias ortopédicas prévias, internações..." />
                </div>
                <div>
                  <span style={lbl()}>Medicações em uso</span>
                  <input type="text" value={medicacoesReumato} onChange={e => setMedicacoesReumato(e.target.value)} style={inp()} placeholder="Ex: Metotrexato, Prednisona, Biológicos..." />
                </div>
              </div>
            </Section>

            <GeneralAssessment storageKey="reumato" studentId={sid} colors={{ ...C, accent: C.purple }} initialBodyPain={localDor} />

            <CifSection cifSuggestions={cifSuggestionsReuma} autoCif={autoCifReuma} colors={{ ...C, green: C.green, blue: C.blue, blueBg: C.blueBg, purple: C.purple, purpleBg: C.purpleBg, surface: C.surface, card: C.card, textMuted: C.textMuted }} />

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Anamnese</button>
            </div>
          </>
        )}

        {tab === "avaliacao" && (
          <>
            <Section title="DAS28 — Atividade de Doença (AR)" icon="📊">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Disease Activity Score 28 joint count. Avalia atividade da artrite reumatoide. VHS (ESR) em mm/h. Calculado automaticamente.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Nº articulações dolorosas (28)" value={das28Tender} onChange={v => { setDas28Tender(v); setDas28Result(calcDAS28(v, das28Swollen, das28ESR, das28Global)); }} min={0} max={28} />
                <NumericField label="Nº articulações edemaciadas (28)" value={das28Swollen} onChange={v => { setDas28Swollen(v); setDas28Result(calcDAS28(das28Tender, v, das28ESR, das28Global)); }} min={0} max={28} />
                <NumericField label="VHS / ESR (mm/h)" value={das28ESR} onChange={v => { setDas28ESR(v); setDas28Result(calcDAS28(das28Tender, das28Swollen, v, das28Global)); }} min={0} max={200} />
                <NumericField label="Saúde global (0-100)" value={das28Global} onChange={v => { setDas28Global(v); setDas28Result(calcDAS28(das28Tender, das28Swollen, das28ESR, v)); }} min={0} max={100} />
              </div>
              {das28Result && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>DAS28</div>
                  <div style={{ fontSize:32, fontWeight:900, color:das28Result.color }}>{das28Result.total}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:das28Result.color, marginTop:4 }}>{das28Result.level}</div>
                </div>
              )}
            </Section>

            <Section title="BASDAI — Espondilite Anquilosante" icon="📊">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Bath Ankylosing Spondylitis Disease Activity Index. Cada item de 0 (nenhum) a 10 (muito grave). Calculado automaticamente.
              </div>
              {[
                { id:"basdai_fadiga", label:"Fadiga / Cansaço" },
                { id:"basdai_dorColuna", label:"Dor na coluna (noturna / total)" },
                { id:"basdai_dorArticular", label:"Dor / inchaço em outras articulações" },
                { id:"basdai_sensibilidade", label:"Sensibilidade à pressão (entese)" },
                { id:"basdai_rigidezSeveridade", label:"Rigidez matinal — gravidade" },
                { id:"basdai_rigidezDuracao", label:"Rigidez matinal — duração (0=nenhuma, 10=≥2h)" },
              ].map(q => (
                <div key={q.id} style={{ marginBottom:8 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label} (0-10)</span>
                  <NumericField value={basdaiScores[q.id] || ""} onChange={v => {
                    const next = { ...basdaiScores, [q.id]: v };
                    setBasdaiScores(next);
                    setBasdaiResult(calcBASDAI(next));
                  }} min={0} max={10} step={0.5} />
                </div>
              ))}
              {basdaiResult && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>BASDAI</div>
                  <div style={{ fontSize:32, fontWeight:900, color:basdaiResult.color }}>{basdaiResult.total}/10</div>
                  <div style={{ fontSize:14, fontWeight:700, color:basdaiResult.color, marginTop:4 }}>{basdaiResult.level}</div>
                </div>
              )}
            </Section>

            <Section title="HAQ — Health Assessment Questionnaire" icon="📋">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação funcional para doenças reumáticas. Cada categoria de 0 (sem dificuldade) a 3 (incapaz). Média de 8 categorias.
              </div>
              {HAQ_CATEGORIES.map(cat => (
                <div key={cat.id} style={{ marginBottom:8 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{cat.label} (0-3)</span>
                  <NumericField value={haqScores[cat.id] || ""} onChange={v => {
                    const next = { ...haqScores, [cat.id]: v };
                    setHaqScores(next);
                    setHaqResult(calcHAQ(next));
                  }} min={0} max={3} step={0.125} />
                </div>
              ))}
              {haqResult && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>HAQ</div>
                  <div style={{ fontSize:32, fontWeight:900, color:haqResult.color }}>{haqResult.total}/3</div>
                  <div style={{ fontSize:14, fontWeight:700, color:haqResult.color, marginTop:4 }}>{haqResult.level}</div>
                </div>
              )}
            </Section>

            <Section title="WOMAC — Osteoartrite" icon="📋">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Western Ontario and McMaster Universities Arthritis Index. Cada item de 0 (nenhum) a 4 (extremo). Avalia dor, rigidez e função.
              </div>
              <div style={{ fontSize:11, fontWeight:800, color:C.purple, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Dor (0-20)</div>
              {WOMAC_PAIN.map(item => (
                <div key={item.id} style={{ marginBottom:6 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:2 }) }}>{item.label} (0-4)</span>
                  <NumericField value={womacPain[item.id] || ""} onChange={v => {
                    const next = { ...womacPain, [item.id]: v };
                    setWomacPain(next);
                    setWomacResult(calcWOMAC(next, womacStiffness, womacFunction));
                  }} min={0} max={4} />
                </div>
              ))}
              <div style={{ fontSize:11, fontWeight:800, color:C.purple, marginTop:12, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Rigidez (0-8)</div>
              {WOMAC_STIFFNESS.map(item => (
                <div key={item.id} style={{ marginBottom:6 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:2 }) }}>{item.label} (0-4)</span>
                  <NumericField value={womacStiffness[item.id] || ""} onChange={v => {
                    const next = { ...womacStiffness, [item.id]: v };
                    setWomacStiffness(next);
                    setWomacResult(calcWOMAC(womacPain, next, womacFunction));
                  }} min={0} max={4} />
                </div>
              ))}
              <div style={{ fontSize:11, fontWeight:800, color:C.purple, marginTop:12, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Função (0-68)</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 12px" }}>
                {WOMAC_FUNCTION.map(item => (
                  <div key={item.id} style={{ marginBottom:4 }}>
                    <span style={{ ...lbl({ fontSize:9, marginBottom:2 }) }}>{item.label} (0-4)</span>
                    <NumericField value={womacFunction[item.id] || ""} onChange={v => {
                      const next = { ...womacFunction, [item.id]: v };
                      setWomacFunction(next);
                      setWomacResult(calcWOMAC(womacPain, womacStiffness, next));
                    }} min={0} max={4} />
                  </div>
                ))}
              </div>
              {womacResult && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>WOMAC</div>
                  <div style={{ fontSize:32, fontWeight:900, color:womacResult.color }}>{womacResult.grandTotal}/96</div>
                  <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:6, fontSize:11, color:C.textSub }}>
                    <span>Dor: {womacResult.painTotal}/20</span>
                    <span>Rigidez: {womacResult.stiffTotal}/8</span>
                    <span>Função: {womacResult.funcTotal}/68</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:womacResult.color, marginTop:4 }}>{womacResult.level}</div>
                </div>
              )}
            </Section>

            <Section title="Fibromialgia — WPI e SSS" icon="📋">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Widespread Pain Index (0-19) e Symptom Severity Scale (0-12) para classificação da fibromialgia segundo critérios ACR 2016.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>WPI — Índice de Dor Generalizada (0-19)</span>
                  <input type="number" value={wpiValue} onChange={e => { setWpiValue(e.target.value); setWpiResult(calcWPI(e.target.value)); }} style={inp()} min={0} max={19} placeholder="0-19" />
                  {wpiResult && (
                    <div style={{ marginTop:8, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
                      <div style={{ fontSize:24, fontWeight:900, color:wpiResult.color }}>{wpiResult.total}/19</div>
                      <div style={{ fontSize:12, fontWeight:700, color:wpiResult.color }}>{wpiResult.level}</div>
                    </div>
                  )}
                </div>
                <div>
                  <span style={lbl()}>SSS — Escala de Gravidade de Sintomas (0-12)</span>
                  <input type="number" value={sssValue} onChange={e => setSssValue(e.target.value)} style={inp()} min={0} max={12} placeholder="0-12" />
                  <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>Fadiga + Sono não reparador + Sintomas cognitivos + Somáticos (0-3 cada)</div>
                </div>
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
            </div>
            {/* 📊 Escalas Padronizadas */}
            <CollapsibleSection title="Escalas Padronizadas" icon="📊" expanded={expandedSections.includes("escalas")} onToggle={()=>toggleSection("escalas")}>
              <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.5}}>Selecione uma escala validada para aplicar ao paciente. Os resultados ficam salvos neste módulo.</div>
              <ScaleSelector scaleNames={["BASDAI (Bath Ankylosing Spondylitis Disease Activity Index)","DAS28","HAQ","WOMAC","FIQ","WPI","SSS (Symptom Severity Scale)"]} onSave={handleScaleSave} savedResults={savedScales} />
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
          </>
        )}

        {tab === "evolucao" && (
          <Section title="Evolução e Reavaliação" icon="📈">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Registre a evolução do paciente, resposta às intervenções, mudanças na atividade de doença e planejamento das próximas sessões.
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucaoReumato} onChange={e => setEvolucaoReumato(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução desde a última sessão, resposta às intervenções, mudanças na rigidez matinal, fadiga, dor articular..." />
            </div>
            {(das28Result || basdaiResult || haqResult || womacResult) && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.purple, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Última avaliação</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>
                  {das28Result && <>DAS28: {das28Result.total} ({das28Result.level})</>}
                  {basdaiResult && <> · BASDAI: {basdaiResult.total}/10 ({basdaiResult.level})</>}
                  {haqResult && <> · HAQ: {haqResult.total} ({haqResult.level})</>}
                  {womacResult && <> · WOMAC: {womacResult.grandTotal}/96 ({womacResult.level})</>}
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
            <PainSection pain={enhancer.pain} setPain={enhancer.setPain} colors={reumatoColors} />
            {enhancer.redFlags.length > 0 && (
              <div style={{ background:"C.redBg", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"8px 12px", marginTop:12, marginBottom:10 }}>
                <div style={{ fontSize:10, fontWeight:800, color:"C.red", letterSpacing:"0.1em", marginBottom:6 }}>🚩 RED FLAGS — INVESTIGAR ANTES DE PROSSEGUIR</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {["Artrite de início súbito monoarticular","Febre + rash articular","Rigidez matinal >2h","Deformidade articular progressiva","Derrame articular significativo","Síndrome de cauda equina suspeita","Uveíte/irite"].map(f => {
                    const active = enhancer.redFlags.includes(f);
                    return (
                      <button key={f} onClick={() => enhancer.setRedFlags(active ? enhancer.redFlags.filter(x=>x!==f) : [...enhancer.redFlags, f])}
                        style={{ fontSize:11, color:active?"#fff":"C.red", background:active?"C.red":"C.redBg", border:"1px solid rgba(239,68,68,0.3)", borderRadius:6, padding:"3px 10px", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:active?700:400, transition:"all 0.12s" }}>
                        {active && "✓ "}{f}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={reumatoColors} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nDiagnóstico: ${diagnosticoReumato}\nQueixa: ${queixaReumato}\nTempo diagnóstico: ${tempoDiagnostico}\nRigidez matinal: ${rigidezMatinal} min\nArtic. dolorosas (28): ${articulacoesDolorosas.length}\nArtic. edemaciadas (28): ${articulacoesEdemaciadas.length}\nDAS28: ${das28Result?.total || "—"} (${das28Result?.level || "—"})\nBASDAI: ${basdaiResult?.total || "—"}\nHAQ: ${haqResult?.total || "—"}\nWOMAC: ${womacResult?.grandTotal || "—"}\nWPI: ${wpiResult?.total || "—"}\nFadiga (FACT-F): ${fadigaFACT || "—"}\nEVA Mov: ${enhancer.pain.evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep}/10\nDor local: ${enhancer.pain.localDor.join(", ")}\nEvolução: ${evolucaoReumato}`}
              colors={reumatoColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {tab === "relatorio" && (() => {
          const matched = Object.entries(REUMATO_EVIDENCE).find(([key]) =>
            (queixaReumato||"").toLowerCase().includes(key.replace(/_/g," ")) ||
            (diagnosticoReumato||"").toLowerCase().includes(key.replace(/_/g," "))
          );
          const cifCodes = matched ? matched[1].cif || [] : [];
          return (
            <>
              <CifAndHonorarios cifCodes={cifCodes} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.purple} />
              <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
                aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
                moduleLabel="Fisioterapia Reumatológica" colors={reumatoColors} />
            </>
          );
        })()}

        {tab === "evidencias" && (() => {
          const matched = Object.entries(REUMATO_EVIDENCE).find(([key]) =>
            (queixaReumato||"").toLowerCase().includes(key.replace(/_/g," ")) ||
            (diagnosticoReumato||"").toLowerCase().includes(key.replace(/_/g," "))
          );
          const cifCodes = matched ? matched[1].cif || [] : [];
          return (
            <>
              <CifAndHonorarios cifCodes={cifCodes} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.purple} />
              <Section title="Diretrizes e Evidências em Reumatologia" icon="🔬">
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                  Diretrizes baseadas em evidências para reabilitação reumatológica, organizadas por condição.
                </div>
                {Object.entries(REUMATO_EVIDENCE).map(([key, condition]) => {
                  const active = diagnosticoReumato.toLowerCase().includes(key.replace(/_/g," "));
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
            </>
          );
        })()}
      </div>
    </div>
  );
}

