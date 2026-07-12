import { useState, useEffect } from "react";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import CifAndHonorarios from "../components/CifAndHonorarios";
import CifSection from "../components/CifSection";
import { CIF } from "../data/cif";
import { calcMinnesota } from "../data/cardioScales";
import { CollapsibleSection, CollapsibleSub, Row, useMediaQuery, AudioField } from "../components";
import ScaleSelector from "../components/ScaleSelector";
import AssignFromOtherModules from "../components/AssignFromOtherModules";
import GeneralAssessment from "../components/GeneralAssessment";
import PatientIdentification from "../components/PatientIdentification";
import { detectLocalDor } from "../utils/clinicalDetection.js";
import { useClinicalScan } from "../hooks/useClinicalScan.js";
import { useSemanticScanner } from "../hooks/useSemanticScanner.js";
import { extractClinicalEntities } from "../utils/clinicalDetection.js";
import LogoSVG from "../components/LogoSVG";

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
const primaryBtn = (e={}) => ({ background:C.red, color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const ghostBtn = (e={}) => ({ background:"transparent", color:C.red, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const iconBtn = (active=false, activeColor=C.red, e={}) => ({ background:active ? `${activeColor}18` : C.surface, border:`1px solid ${active ? activeColor+"50" : C.border}`, color:active ? activeColor : C.textMuted, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:active ? 700 : 400, cursor:"pointer", fontFamily:F, transition:"all 0.12s", ...e });

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
        return <button key={v} onClick={() => onChange(active ? "" : v)} style={iconBtn(active, activeColor || C.red)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
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
        return <button key={v} onClick={() => toggle(v)} style={iconBtn(active, activeColor || C.red)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
      })}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={card()}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.red, flex:1 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function saveCardioData(studentId, data) {
  try { localStorage.setItem(`cardio_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadCardioData(studentId) {
  try { const d = localStorage.getItem(`cardio_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

const MINNESOTA_QUESTIONS = [
  { id:"m1", label:"Causou inchaço nos tornozelos/pernas?" },
  { id:"m2", label:"Dificultou seu trabalho ou suas atividades domésticas?" },
  { id:"m3", label:"Dificultou sua locomoção (caminhadas, subir escadas)?" },
  { id:"m4", label:"Dificultou seu trabalho no período noturno?" },
  { id:"m5", label:"Causou cansaço/fadiga durante o dia?" },
  { id:"m6", label:"Causou falta de ar durante o dia?" },
  { id:"m7", label:"Obrigou você a deitar para descansar durante o dia?" },
  { id:"m8", label:"Dificultou sua vida sexual?" },
  { id:"m9", label:"Dificultou sua participação em atividades de lazer/esportes?" },
  { id:"m10", label:"Dificultou seu convívio com amigos/familiares?" },
  { id:"m11", label:"Dificultou seu apetite digestão?" },
  { id:"m12", label:"Causou preocupação com custos médicos?" },
  { id:"m13", label:"Causou efeitos colaterais das medicações?" },
  { id:"m14", label:"Fez você se sentir um peso para os outros?" },
  { id:"m15", label:"Causou dificuldade de concentração/memória?" },
  { id:"m16", label:"Causou falta de ar ao deitar?" },
  { id:"m17", label:"Causou dificuldade para dormir?" },
  { id:"m18", label:"Causou sentimentos de preocupação/depressão?" },
  { id:"m19", label:"Causou palpitações/taquicardia?" },
  { id:"m20", label:"Causou tontura/vertigem?" },
  { id:"m21", label:"Causou cansaço extremo aos pequenos esforços?" },
];

const CARDIO_EVIDENCE = {
  cardiopatia_isquemica: {
    cif: ["b455","b440","b450","d460","d570"],
    label:"Cardiopatia Isquêmica / IAM",
    goldStandard:"Reabilitação cardíaca fase II (supervisionada): exercício aeróbio 3-5x/sem, 30-60 min, 40-70% FC reserva. Treino resistido complementar 2x/sem. Controle de fatores de risco: cessação tabagismo, dieta mediterrânea, estatinas, antiagregantes. Aconselhamento psicológico para ansiedade/depressão pós-IAM. Retorno ao trabalho com teste ergométrico prévio. Programas de reabilitação cardíaca reduzem mortalidade em 26% (Cochrane 2021 - Evidência A).",
    escalas:["NYHA","Borg (CR10)","Minnesota Living with HF","SF-36","Teste de Caminhada 6 min"],
    referencias:[{ id:"Cochrane CD001800", title:"Exercise-based cardiac rehabilitation for coronary heart disease (Cochrane 2021)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001800.pub4/" }],
  },
  dpoc: {
    cif: ["b440","b445","b450","d450","d460"],
    label:"DPOC",
    goldStandard:"Reabilitação pulmonar: exercício aeróbio (esteira/bicicleta) 30 min/dia, 5x/sem. Treino de MMSS para AVDs. Treino de musculatura inspiratória (Threshold IMT) 30% PImáx, 15 min, 2x/dia. Educação em autogestão: técnica de conservação de energia, uso correto de medicação inalatória. Estratégia de tosse assistida e higiene brônquica. Oxigenioterapia se SpO2 < 88% ao esforço. Manutenção de atividade física reduz exacerbações (ATS/ERS 2022 - Evidência A).",
    escalas:["mMRC (Escala de Dispneia)","Borg","CVF","VEF1","VEF1/CVF","Teste de Caminhada 6 min"],
    referencias:[{ id:"ATS/ERS 2022", title:"Pulmonary Rehabilitation Guidelines (ATS/ERS 2022)", url:"https://www.thoracic.org/statements/pulmonary-rehabilitation/" }],
  },
  insuficiencia_cardiaca: {
    cif: ["b455","b450","b460","d410","d570"],
    label:"Insuficiência Cardíaca (ICC)",
    goldStandard:"Reabilitação cardíaca com exercício aeróbio: FC alvo = repouso + 20-30 bpm ou 40-60% VO2pico, 3-5x/sem. Treino resistido de baixa-moderada intensidade (40-60% 1RM) 2x/sem. Controle hídrico e restrição de sódio. Monitorização de peso diário. Educação em sinais de descompensação (dispneia, edema, ganho de peso > 2kg/3dias). Otimização medicamentosa com cardiologista. Reabilitação reduz mortalidade e hospitalizações (ESC 2023 - Evidência A).",
    escalas:["NYHA","Minnesota Living with HF","Teste de Caminhada 6 min","Borg","CVF"],
    referencias:[{ id:"ESC 2023", title:"ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure", url:"https://academic.oup.com/eurheartj/article/44/37/3627/7241584" }],
  },
  asma: {
    cif: ["b440","b445","b450","d460","d240"],
    label:"Asma",
    goldStandard:"Treino aeróbio (caminhada/ciclismo/natação) 3-5x/sem, 30 min, 60-80% FC máx. Treino de musculatura inspiratória se fraqueza diafragmática. Exercícios de respiração: método Papworth, respiração diafragmática, respiração com lábios franzidos. Aquecimento pré-exercício + resfriamento gradual para prevenir broncoespasmo induzido. Educação sobre uso correto de corticosteroides inalatórios. Atividade física melhora controle da asma e qualidade de vida (GINA 2023 - Evidência A).",
    escalas:["Borg","CVF","VEF1","PEF (Peak Flow)","ACQ (Asthma Control Questionnaire)"],
    referencias:[{ id:"GINA 2023", title:"Global Initiative for Asthma Report 2023", url:"https://ginasthma.org/gina-reports/" }],
  },
  pos_covid: {
    cif: ["b455","b450","b130","d450","d570","b152"],
    label:"Síndrome Pós-COVID",
    goldStandard:"Reabilitação progressiva iniciar com exercícios de baixa intensidade (caminhada leve, alongamentos, respiração diafragmática). Progressão gradual conforme tolerância e SpO2. Treino aeróbio: 3-5x/sem, 15-30 min, 40-60% FC reserva. Treino resistido leve 2x/sem. Treino de musculatura inspiratória se dispneia persistente. Estratégias de conservação de energia para fadiga. Avaliação de função pulmonar (CVF, DLCO) se sintomas persistentes > 3 meses. Abordagem multidisciplinar (WHO 2023 - Evidência B).",
    escalas:["Borg","mMRC","Teste de Caminhada 6 min","CVF","SF-36"],
    referencias:[{ id:"WHO 2023", title:"Clinical management of COVID-19: rehabilitation", url:"https://www.who.int/publications/i/item/WHO-2019-nCoV-Clinical-2023.2" }],
  },
  hipertensao_pulmonar: {
    cif: ["b455","b440","b450","d460","d570"],
    label:"Hipertensão Pulmonar",
    goldStandard:"Exercício aeróbio supervisionado 3-5x/sem, 20-40 min, 40-60% VO2pico ou FC < 120 bpm. Treino resistido leve (faixas elásticas, peso corporal). Evitar exercícios com Valsalva. Treino de musculatura inspiratória (Threshold IMT 30% PImáx). Monitorização contínua de SpO2 e sintomas (dispneia, tontura, pré-síncope). Adaptação da intensidade conforme NYHA. Reabilitação melhora capacidade funcional e qualidade de vida (ERS 2022 - Evidência B).",
    escalas:["NYHA","Borg","Teste de Caminhada 6 min","CVF","SF-36"],
    referencias:[{ id:"ERS 2022", title:"ERS statement on exercise training and rehabilitation in pulmonary hypertension", url:"https://erj.ersjournals.com/content/59/1/2101344" }],
  },
  fibrose_pulmonar: {
    cif: ["b440","b445","b450","d460","d570"],
    label:"Fibrose Pulmonar",
    goldStandard:"Reabilitação pulmonar: exercício aeróbio com oxigenioterapia suplementar se necessário. Treino de MMSS para independência funcional. Alongamento global para prevenir contraturas. Treino de musculatura inspiratória (Threshold IMT). Técnicas de conservação de energia e proteção articular. Estratégia de tosse assistida. Educação sobre progressão da doença e plano avançado de cuidados. Oxigenioterapia ambulatorial se SpO2 < 88%. Transplante pulmonar em casos selecionados (ATS/ERS 2022 - Evidência A).",
    escalas:["mMRC","Borg","CVF","VEF1","DLCO","Teste de Caminhada 6 min"],
    referencias:[{ id:"ATS/ERS 2022", title:"Idiopathic Pulmonary Fibrosis Guidelines (ATS/ERS)", url:"https://www.thoracic.org/statements/interstitial-lung-disease/" }],
  },
};

function generateCIFCardio({ evaMov, sintomas, limitacoes }) {
  const result = [];
  if (evaMov >= 7) result.push({ code:"b280", desc:"Sensação de dor intensa", qualifier:3 });
  else if (evaMov >= 4) result.push({ code:"b280", desc:"Sensação de dor moderada", qualifier:2 });
  else if (evaMov >= 1) result.push({ code:"b280", desc:"Sensação de dor leve", qualifier:1 });
  if (sintomas?.includes("Dispneia")) result.push({ code:"b440", desc:"Respiração", qualifier:2 });
  if (sintomas?.includes("Tosse")) result.push({ code:"b450", desc:"Tolerância ao exercício", qualifier:2 });
  if (limitacoes?.includes("Deambular") || limitacoes?.includes("Subir escadas")) result.push({ code:"d450", desc:"Andar", qualifier:2 });
  if (limitacoes?.includes("AVDs domésticas")) result.push({ code:"d640", desc:"Realizar tarefas domésticas", qualifier:2 });
  if (limitacoes?.includes("Trabalho")) result.push({ code:"d850", desc:"Trabalho remunerado", qualifier:2 });
  if (sintomas?.includes("Fadiga")) result.push({ code:"b130", desc:"Funções energéticas (fadiga)", qualifier:2 });
  return result;
}

export default function CardioRespiratory({ student, students, allPatients, currentModuleId, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById, plan, onAgenda, onFinanceiro, onSubscription, planLabel }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("avaliacao");
  const [regiao, setRegiao] = useState("Centro-Oeste");

  const [queixaCardio, setQueixaCardio] = useState("");
  const [hdaCardio, setHdaCardio] = useState("");
  const [diagnosticoCinesioCardio, setDiagnosticoCinesioCardio] = useState("");
  const [localDor, setLocalDor] = useState([]);
  const [historicoTabagismo, setHistoricoTabagismo] = useState("");
  const [comorbidadesCardio, setComorbidadesCardio] = useState([]);
  const [medicamentosCardio, setMedicamentosCardio] = useState("");
  const [cirurgiasCardio, setCirurgiasCardio] = useState("");
  const [alergiasCardio, setAlergiasCardio] = useState("");
  const [historicoFamiliarCardio, setHistoricoFamiliarCardio] = useState("");
  const [sintomasCardio, setSintomasCardio] = useState([]);
  const [limitacoesCardio, setLimitacoesCardio] = useState([]);

  const [fc, setFc] = useState("");
  const [fr, setFr] = useState("");
  const [paSist, setPaSist] = useState("");
  const [paDiast, setPaDiast] = useState("");
  const [spo2, setSpo2] = useState("");
  const [auscultaPulmonar, setAuscultaPulmonar] = useState("");
  const [auscultaCardiaca, setAuscultaCardiaca] = useState("");
  const [padraoRespiratorio, setPadraoRespiratorio] = useState([]);
  const [tosse, setTosse] = useState([]);
  const [secrecao, setSecrecao] = useState([]);
  const [edema, setEdema] = useState("");
  const [jugular, setJugular] = useState("");

  const [nyha, setNyha] = useState("");
  const [borg, setBorg] = useState("");
  const [mrcDispneia, setMrcDispneia] = useState("");
  const [tc6mDistancia, setTc6mDistancia] = useState("");
  const [tc6mSpO2, setTc6mSpO2] = useState("");
  const [cvf, setCvf] = useState("");
  const [vef1, setVef1] = useState("");
  const [relacaoVEF1CVF, setRelacaoVEF1CVF] = useState("");

  const [minnesotaScores, setMinnesotaScores] = useState({});
  const [minnesotaResult, setMinnesotaResult] = useState(null);

  const [evolucaoCardio, setEvolucaoCardio] = useState("");

  const [fcAlvo, setFcAlvo] = useState("");
  const [pctFcReserva, setPctFcReserva] = useState("");
  const [borgAlvo, setBorgAlvo] = useState("");
  const [tipoExercicio, setTipoExercicio] = useState("");
  const [duracaoExercicio, setDuracaoExercicio] = useState("");
  const [freqExercicio, setFreqExercicio] = useState("");
  const [spo2Alvo, setSpo2Alvo] = useState("");
  const [obsExercicio, setObsExercicio] = useState("");

  const [expandedSections, setExpandedSections] = useState([]);
  const toggleSection = (id) => { setExpandedSections(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]); };
  const sid = student?.id || student?.nome;
  const enhancer = useEnhancer("cardiorespiratorio", sid, `cardio_enhancer_${sid}`);
  const [savedScales, setSavedScales] = useState(() => { try { const d = localStorage.getItem(`cardio_scales_${sid}`); return d ? JSON.parse(d) : []; } catch { return []; } });
  const handleScaleSave = (result) => {
    const next = [...savedScales, { ...result, savedAt: new Date().toISOString() }];
    setSavedScales(next);
    try { localStorage.setItem(`cardio_scales_${sid}`, JSON.stringify(next)); } catch {}
  };
  const cardioColors = { ...C, accent: C.red, font: F };
  const isMobile = useMediaQuery("(max-width:767px)");
  // CIF auto
  const autoCifCardio = generateCIFCardio({ evaMov: enhancer.pain.evaMov, sintomas: sintomasCardio, limitacoes: limitacoesCardio });
  const matchedCif = Object.entries(CARDIO_EVIDENCE).find(([key]) =>
    (queixaCardio||"").toLowerCase().includes(key.replace(/_/g," ")) ||
    (comorbidadesCardio||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
  );
  const cifSuggestionsCardio = matchedCif ? matchedCif[1].cif || [] : [];

  useEffect(() => {
    if (student?.id || student?.nome) {
      const saved = loadCardioData(sid);
      if (saved) {
        setQueixaCardio(saved.queixaCardio || "");
        setHistoricoTabagismo(saved.historicoTabagismo || "");
        setComorbidadesCardio(saved.comorbidadesCardio || []);
        setMedicamentosCardio(saved.medicamentosCardio || "");
        setCirurgiasCardio(saved.cirurgiasCardio || "");
        setAlergiasCardio(saved.alergiasCardio || "");
        setHistoricoFamiliarCardio(saved.historicoFamiliarCardio || "");
        setSintomasCardio(saved.sintomasCardio || []);
        setLimitacoesCardio(saved.limitacoesCardio || []);
        setFc(saved.fc || "");
        setFr(saved.fr || "");
        setPaSist(saved.paSist || "");
        setPaDiast(saved.paDiast || "");
        setSpo2(saved.spo2 || "");
        setAuscultaPulmonar(saved.auscultaPulmonar || "");
        setAuscultaCardiaca(saved.auscultaCardiaca || "");
        setPadraoRespiratorio(saved.padraoRespiratorio || []);
        setTosse(saved.tosse || []);
        setSecrecao(saved.secrecao || []);
        setEdema(saved.edema || "");
        setJugular(saved.jugular || "");
        setNyha(saved.nyha || "");
        setBorg(saved.borg || "");
        setMrcDispneia(saved.mrcDispneia || "");
        setTc6mDistancia(saved.tc6mDistancia || "");
        setTc6mSpO2(saved.tc6mSpO2 || "");
        setCvf(saved.cvf || "");
        setVef1(saved.vef1 || "");
        setRelacaoVEF1CVF(saved.relacaoVEF1CVF || "");
        setMinnesotaScores(saved.minnesotaScores || {});
        setMinnesotaResult(saved.minnesotaResult || null);
        setEvolucaoCardio(saved.evolucaoCardio || "");
        setFcAlvo(saved.fcAlvo || "");
        setPctFcReserva(saved.pctFcReserva || "");
        setBorgAlvo(saved.borgAlvo || "");
        setTipoExercicio(saved.tipoExercicio || "");
        setDuracaoExercicio(saved.duracaoExercicio || "");
        setFreqExercicio(saved.freqExercicio || "");
        setSpo2Alvo(saved.spo2Alvo || "");
        setObsExercicio(saved.obsExercicio || "");
        setHdaCardio(saved.hdaCardio || "");
        setDiagnosticoCinesioCardio(saved.diagnosticoCinesioCardio || "");
        setLocalDor(saved.localDor || []);
        if (saved.pain) enhancer.setPain(saved.pain);
        if (saved.logs) enhancer.setLogs(saved.logs);
        if (saved.redFlags) enhancer.setRedFlags(saved.redFlags);
        if (saved.aiRes) enhancer.setAiRes(saved.aiRes);
      }
    }
  }, [student?.id, student?.nome]);

  const { entities } = useClinicalScan(queixaCardio);
  const { detected } = useSemanticScanner(queixaCardio, {});

  useEffect(() => {
    const regions = detectLocalDor(queixaCardio);
    if (regions.length > 0) setLocalDor(prev => [...new Set([...prev, ...regions])]);
  }, [queixaCardio]);

  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    const sid = student.id || student.nome;
    saveCardioData(sid, {
      queixaCardio, hdaCardio, diagnosticoCinesioCardio, historicoTabagismo, comorbidadesCardio, medicamentosCardio,
      cirurgiasCardio, alergiasCardio, historicoFamiliarCardio, sintomasCardio, limitacoesCardio,
      fc, fr, paSist, paDiast, spo2, auscultaPulmonar, auscultaCardiaca,
      padraoRespiratorio, tosse, secrecao, edema, jugular,
      nyha, borg, mrcDispneia, tc6mDistancia, tc6mSpO2, cvf, vef1, relacaoVEF1CVF,
      minnesotaScores, minnesotaResult,
      evolucaoCardio, localDor,
      fcAlvo, pctFcReserva, borgAlvo, tipoExercicio, duracaoExercicio, freqExercicio, spo2Alvo, obsExercicio,
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
          <AssignFromOtherModules allPatients={allPatients} currentModuleId={currentModuleId} onUpdateStudentById={onUpdateStudentById} accentColor={C.red} />
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.red}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.red, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
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
                <div style={{ width:40, height:40, background:C.redBg, border:`1px solid ${C.red}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:C.red, flexShrink:0 }}>
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
                <span style={{ color:C.red, fontSize:16 }}>→</span>
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
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.red}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.red, marginBottom:8 }}>Editar dados do paciente</div>
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
                style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
          {[["avaliacao","🔬","Avaliação"],["evolucao","📈","Evolução"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{ background:tab === k ? C.redBg : "transparent", border:`1px solid ${tab === k ? C.red + "50" : "transparent"}`, borderRadius:8, padding:isMobile?"5px 10px":"7px 16px", fontSize:isMobile?11:13, fontWeight:tab === k ? 700 : 400, color:tab === k ? C.red : C.textMuted, cursor:"pointer", fontFamily:F }}>{ic} {lb}</button>
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
            <><div style={{ width:30, height:30, background:C.redBg, border:`1px solid ${C.red}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.red }}>{student.nome[0]?.toUpperCase()}</div>
              <span style={{ fontSize:12, color:C.textSub, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.nome}</span></>
          )}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"20px 16px" }}>
        {tab === "avaliacao" && (
          <>
            <PatientIdentification student={student} onUpdate={(field, value) => onUpdateStudent && onUpdateStudent(student?.id, field, value)} regiao={regiao} setRegiao={setRegiao} />
            <Section title="Anamnese Cardiorrespiratória" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados da avaliação cardiorrespiratória, queixa principal, histórico e fatores de risco do paciente.
              </div>
              <div style={{ background:C.redBg, border:`1.5px solid ${C.red}`, borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:C.red }}>Queixa principal</span>
                    <span style={{ fontSize:9, fontWeight:800, color:"#fff", background:C.red, borderRadius:6, padding:"2px 8px", letterSpacing:"0.05em", textTransform:"uppercase" }}>OBRIGATÓRIO</span>
                  </div>
                  <span style={{ fontSize:10, color:C.red, opacity:0.7 }}>— digite ou use o microfone</span>
                </div>
                <AudioField value={queixaCardio} onChange={v => setQueixaCardio(typeof v === "function" ? v(queixaCardio) : v)} placeholder="Ex: ICC descompensada, DPOC exacerbação, Pós-IAM..." rows={2} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:"9px 12px",fontFamily:F,lineHeight:1.5}} />
              </div>
              {queixaCardio && entities && (entities.muscles?.length>0||entities.laterality||entities.painChars?.length>0) && (
                <div style={{ background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"10px 14px", margin:"0 0 12px 0" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.blue, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>🔍 Varredura Semântica</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, fontSize:12 }}>
                    {entities.muscles?.length>0 && <span style={{color:C.textSub}}>Músculos: <strong style={{color:C.text}}>{entities.muscles.join(", ")}</strong></span>}
                    {entities.laterality && <span style={{color:C.textSub}}>Lateralidade: <strong style={{color:C.text}}>{entities.laterality}</strong></span>}
                    {entities.painChars?.length>0 && <span style={{color:C.textSub}}>Caráter: <strong style={{color:C.text}}>{entities.painChars.join(", ")}</strong></span>}
                  </div>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:12 }}>
                <div>
                  <span style={lbl()}>Histórico de tabagismo</span>
                  <input type="text" value={historicoTabagismo} onChange={e => setHistoricoTabagismo(e.target.value)} style={inp()} placeholder="Ex: 30 anos-maço, ex-tabagista há 5 anos" />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>HDA — História da Doença Atual</span>
                <AudioField value={hdaCardio} onChange={v => setHdaCardio(typeof v === "function" ? v(hdaCardio) : v)} placeholder="Início, evolução, tratamentos prévios, exames realizados…" rows={3} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Diagnóstico Cinesioterapêutico (DCT)</span>
                <input value={diagnosticoCinesioCardio} onChange={e => setDiagnosticoCinesioCardio(e.target.value)} style={inp()} placeholder="Ex: ICC com limitação funcional, intolerância ao exercício e dessaturação aos esforços" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Medicações em uso</span>
                  <input type="text" value={medicamentosCardio} onChange={e => setMedicamentosCardio(e.target.value)} style={inp()} placeholder="Ex: Enalapril, Furosemida, Beta-bloqueador..." />
                </div>
                <div>
                  <span style={lbl()}>Cirurgias cardíacas/torácicas prévias</span>
                  <input type="text" value={cirurgiasCardio} onChange={e => setCirurgiasCardio(e.target.value)} style={inp()} placeholder="Ex: Revascularização, Troca valvar" />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Alergias</span>
                  <input type="text" value={alergiasCardio} onChange={e => setAlergiasCardio(e.target.value)} style={inp()} placeholder="Ex: Medicamentosas, látex" />
                </div>
                <div>
                  <span style={lbl()}>Histórico familiar cardiopulmonar</span>
                  <input type="text" value={historicoFamiliarCardio} onChange={e => setHistoricoFamiliarCardio(e.target.value)} style={inp()} placeholder="Ex: IAM precoce, HAS, ICC, DM" />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Comorbidades</span>
                <TagSelect options={["HAS","DM","Obesidade","Dislipidemia","Doença arterial coronariana","DPOC","Asma","ICC","FA","Estenose aórtica","TVP/TEP","Síndrome metabólica","Doença renal crônica","Anemia"]}
                  value={comorbidadesCardio} onChange={setComorbidadesCardio} activeColor={C.red} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Sintomas</span>
                <TagSelect options={["Dispneia","Dor torácica","Palpitações","Tosse","Edema MMII","Fadiga","Ortopneia","Dispneia paroxística noturna","Síncope","Cianose","Hemoptise","Febre","Chiado"]}
                  value={sintomasCardio} onChange={setSintomasCardio} activeColor={C.red} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Limitações funcionais</span>
                <TagSelect options={["Deambular","Subir escadas","AVDs domésticas","Trabalho","Atividade sexual","Exercício físico","Carregar peso","Deitar-se","Dirigir"]}
                  value={limitacoesCardio} onChange={setLimitacoesCardio} activeColor={C.red} />
              </div>
            </Section>

            <GeneralAssessment storageKey="cardio" studentId={sid} colors={{ ...C, accent: C.red }} initialBodyPain={localDor} />

            <CifSection cifSuggestions={cifSuggestionsCardio} autoCif={autoCifCardio} colors={{ ...C, green: C.green, blue: C.blue, blueBg: C.blueBg, purple: C.purple, purpleBg: C.purpleBg, surface: C.surface, card: C.card, textMuted: C.textMuted }} />

            <Section title="Exame Físico" icon="🔬">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <NumericField label="Frequência Cardíaca (FC)" value={fc} onChange={setFc} unit="bpm" min={20} max={220} />
                <NumericField label="Frequência Respiratória (FR)" value={fr} onChange={setFr} unit="irpm" min={4} max={60} />
                <NumericField label="SpO₂" value={spo2} onChange={setSpo2} unit="%" min={50} max={100} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <NumericField label="PA Sistólica" value={paSist} onChange={setPaSist} unit="mmHg" min={50} max={300} />
                <NumericField label="PA Diastólica" value={paDiast} onChange={setPaDiast} unit="mmHg" min={30} max={200} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Ausculta pulmonar</span>
                <SingleSelect options={["Normal","Roncos difusos","Sibilos difusos","Crepitações úmidas","Crepitações secas","Atrito pleural","Murmúrio vesicular diminuído","MV abolido à direita","MV abolido à esquerda","Sibilos localizados"]} value={auscultaPulmonar} onChange={setAuscultaPulmonar} activeColor={C.red} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Ausculta cardíaca</span>
                <SingleSelect options={["Normal","Sopro sistólico","Sopro diastólico","B3 presente","B4 presente","Desdobramento B2","Atrito pericárdico","Ritmo irregular (FA)","Estalido de abertura"]} value={auscultaCardiaca} onChange={setAuscultaCardiaca} activeColor={C.red} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Padrão respiratório</span>
                <TagSelect options={["Eupneico","Dispneico","Taquipneico","Bradipneico","Respiração superficial","Respiração paradoxal","Batimento de asa nasal","Tiragem intercostal","Uso de musculatura acessória","Respiração de Cheyne-Stokes","Respiração de Kussmaul"]}
                  value={padraoRespiratorio} onChange={setPadraoRespiratorio} activeColor={C.red} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Tosse</span>
                  <TagSelect options={["Ausente","Seca","Produtiva","Hematêmica","Crônica","Noturna","Aos esforços"]}
                    value={tosse} onChange={setTosse} activeColor={C.red} />
                </div>
                <div>
                  <span style={lbl()}>Secreção</span>
                  <TagSelect options={["Ausente","Mucóide","Purulenta","Sanguinolenta","Espessa","Clara","Aspecto leitoso"]}
                    value={secrecao} onChange={setSecrecao} activeColor={C.red} />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>Edema de MMII</span>
                  <SingleSelect options={["Ausente","+/4","++/4","+++/4","++++/4","Anasarca"]} value={edema} onChange={setEdema} activeColor={C.red} />
                </div>
                <div>
                  <span style={lbl()}>Turgência jugular</span>
                  <SingleSelect options={["Ausente","Turgência jugular leve ( < 5 cm)","Turgência jugular moderada (5-10 cm)","Turgência jugular grave ( > 10 cm)"]} value={jugular} onChange={setJugular} activeColor={C.red} />
                </div>
              </div>
            </Section>

            <Section title="Classificação Funcional" icon="📊">
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>NYHA — Classificação Funcional (Insuficiência Cardíaca)</span>
                <SingleSelect options={[
                  { value:"I", label:"I — Atividade física habitual não causa sintomas" },
                  { value:"II", label:"II — Leve limitação aos esforços habituais" },
                  { value:"III", label:"III — Limitação acentuada (menos que esforços habituais)" },
                  { value:"IV", label:"IV — Sintomas em repouso" },
                ]} value={nyha} onChange={setNyha} activeColor={C.red} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Borg (CR10) — Dispneia / Esforço percebido</span>
                <NumericField label="Borg (0-10)" value={borg} onChange={setBorg} min={0} max={10} step={0.5} unit="" />
              </div>
              <div>
                <span style={lbl()}>mMRC — Dispneia (atividades diárias)</span>
                <SingleSelect options={[
                  { value:"0", label:"0 — Falta de ar apenas a exercícios intensos" },
                  { value:"1", label:"1 — Falta de ar ao andar rápido ou subida leve" },
                  { value:"2", label:"2 — Anda mais devagar que pessoas da mesma idade" },
                  { value:"3", label:"3 — Para para respirar após 100m ou poucos minutos" },
                  { value:"4", label:"4 — Falta de ar ao vestir-se/sair de casa" },
                ]} value={mrcDispneia} onChange={setMrcDispneia} activeColor={C.red} />
              </div>
            </Section>

            <CollapsibleSub title="Prescrição de Exercício" defaultOpen={false}>
              <div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>Parâmetros para prescrição segura do programa de reabilitação cardiorrespiratória.</div>
              <Row cols={isMobile?"1fr":"1fr 1fr 1fr"} gap="8px 14px">
                <div><span style={lbl()}>FC alvo (bpm)</span><input type="number" value={fcAlvo} onChange={e=>setFcAlvo(e.target.value)} style={inp()} min={30} max={220} placeholder="Ex: 110" /></div>
                <div><span style={lbl()}>% FC reserva</span><input type="number" value={pctFcReserva} onChange={e=>setPctFcReserva(e.target.value)} style={inp()} min={0} max={100} placeholder="Ex: 60" /></div>
                <div><span style={lbl()}>Borg alvo (CR10)</span>
                  <SingleSelect options={[{value:"0",label:"0 — Nenhum"},{value:"0.5",label:"0.5 — Muito, muito leve"},{value:"1",label:"1 — Muito leve"},{value:"2",label:"2 — Leve"},{value:"3",label:"3 — Moderado"},{value:"4",label:"4 — Pouco intenso"},{value:"5",label:"5-6 — Intenso"},{value:"7",label:"7-9 — Muito intenso"},{value:"10",label:"10 — Máximo"}]} value={borgAlvo} onChange={setBorgAlvo} activeColor={C.green} /></div>
              </Row>
              <Row cols={isMobile?"1fr":"1fr 1fr 1fr 1fr"} gap="8px 14px" style={{marginTop:8}}>
                <div><span style={lbl()}>Tipo de exercício</span><SingleSelect options={["Aeróbio contínuo","Aeróbio intervalado","Resistido","Combinado (aeróbio + resistido)","Inspiratório (IMT)","Funcional"]} value={tipoExercicio} onChange={setTipoExercicio} activeColor={C.green} /></div>
                <div><span style={lbl()}>Duração (min)</span><input type="number" value={duracaoExercicio} onChange={e=>setDuracaoExercicio(e.target.value)} style={inp()} min={5} max={120} placeholder="Ex: 30" /></div>
                <div><span style={lbl()}>Frequência (x/semana)</span><input type="number" value={freqExercicio} onChange={e=>setFreqExercicio(e.target.value)} style={inp()} min={1} max={7} placeholder="Ex: 3" /></div>
                <div><span style={lbl()}>Saturação alvo (%)</span><input type="number" value={spo2Alvo} onChange={e=>setSpo2Alvo(e.target.value)} style={inp()} min={88} max={100} placeholder="≥92" /></div>
              </Row>
              <div style={{marginTop:8}}><span style={lbl()}>Observações / Precauções</span><textarea value={obsExercicio} onChange={e=>setObsExercicio(e.target.value)} rows={2} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Precauções específicas, progressão planejada, critérios de interrupção..." /></div>
            </CollapsibleSub>

            <Section title="Teste de Caminhada 6 Minutos" icon="🚶">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação funcional submáxima. Registre a distância percorrida em 6 minutos e SpO₂ final.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Distância percorrida" value={tc6mDistancia} onChange={setTc6mDistancia} unit="m" min={0} max={1000} />
                <NumericField label="SpO₂ final" value={tc6mSpO2} onChange={setTc6mSpO2} unit="%" min={50} max={100} />
              </div>
              {student?.altura && student?.peso && tc6mDistancia && (() => {
                const idade = student?.idade || 60;
                const altura = Number(student?.altura);
                const peso = Number(student?.peso);
                const sexo = student?.sexo || "Masculino";
                const sexoKey = sexo === "Feminino" || sexo === "female" ? "F" : "M";
                const predito = sexoKey === "F"
                  ? (2.11 * altura) - (2.29 * peso) - (5.78 * idade) + 667
                  : (7.57 * altura) - (5.02 * idade) - (1.76 * peso) - 309;
                const pct = Math.round((tc6mDistancia / predito) * 100);
                const cor = pct >= 80 ? C.green : pct >= 60 ? C.amber : C.red;
                return <div style={{marginTop:10,fontSize:11,color:cor,fontWeight:600}}>% Predito: {pct}% ({tc6mDistancia}m / {Math.round(predito)}m previsto &mdash; Enright&Sherrill)</div>;
              })()}
            </Section>

            <Section title="Espirometria" icon="🫁">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Valores espirométricos para avaliação de função pulmonar.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="CVF (L)" value={cvf} onChange={setCvf} unit="L" min={0} max={10} step={0.1} />
                <NumericField label="VEF1 (L)" value={vef1} onChange={setVef1} unit="L" min={0} max={10} step={0.1} />
                <NumericField label="Relação VEF1/CVF" value={relacaoVEF1CVF} onChange={setRelacaoVEF1CVF} unit="%" min={0} max={100} />
              </div>
            </Section>

            <Section title="Minnesota Living with Heart Failure (MLHFQ)" icon="❤️">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação de qualidade de vida específica para insuficiência cardíaca. Cada item: 0 (ausente) a 5 (muito). Máximo 105 pontos.
              </div>
              {MINNESOTA_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom:8 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 — Não" },
                    { value:"1", label:"1 — Muito pouco" },
                    { value:"2", label:"2 — Pouco" },
                    { value:"3", label:"3 — Moderado" },
                    { value:"4", label:"4 — Muito" },
                    { value:"5", label:"5 — Multíssimo" },
                  ]} value={minnesotaScores[q.id] || ""} onChange={v => {
                    const next = { ...minnesotaScores, [q.id]: v };
                    setMinnesotaScores(next);
                    setMinnesotaResult(calcMinnesota(next));
                  }} activeColor={C.red} />
                </div>
              ))}
              {minnesotaResult && (
                <div style={{ marginTop:12, background:C.redBg, border:`1px solid ${C.red}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>MLHFQ</div>
                  <div style={{ fontSize:32, fontWeight:900, color:minnesotaResult.color }}>{minnesotaResult.total}/{minnesotaResult.max}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:minnesotaResult.color, marginTop:4 }}>{minnesotaResult.level}</div>
                </div>
              )}
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
            </div>
            {/* 📊 Escalas Padronizadas */}
            <CollapsibleSection title="Escalas Padronizadas" icon="📊" expanded={expandedSections.includes("escalas")} onToggle={()=>toggleSection("escalas")}>
              <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.5}}>Selecione uma escala validada para aplicar ao paciente. Os resultados ficam salvos neste módulo.</div>
                             <ScaleSelector scaleNames={["BODE Index","London Chest Activity of Daily Living (LCADL)","Duke Activity Status Index (DASI)"]} onSave={handleScaleSave} savedResults={savedScales} />
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
          <>
            <Section title="Evolução e Reavaliação" icon="📈">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Registre a evolução do paciente cardiorrespiratório, resposta às intervenções e planejamento terapêutico.
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Evolução clínica / Observações</span>
                <textarea value={evolucaoCardio} onChange={e => setEvolucaoCardio(e.target.value)} rows={4}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                  placeholder="Descreva a evolução desde a última sessão, resposta à reabilitação, sinais vitais, tolerância ao exercício..." />
              </div>
              {minnesotaResult && (
                <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.red, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Última avaliação</div>
                  <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>
                    <strong>NYHA:</strong> {nyha || "—"} · <strong>Borg:</strong> {borg || "—"} · <strong>mMRC:</strong> {mrcDispneia || "—"} · <strong>TC6M:</strong> {tc6mDistancia || "—"}m · <strong>SpO₂:</strong> {spo2 || "—"}% · <strong>MLHFQ:</strong> {minnesotaResult.total}/{minnesotaResult.max} ({minnesotaResult.level})
                  </div>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
                <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Evolução</button>
              </div>
            </Section>
            {enhancer.redFlags.length > 0 && (
              <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags} flags={["Dor torácica em repouso","Dispneia em repouso","Hemoptise","Síncope","Cianose central","Taquicardia >120 bpm em repouso","SpO2 <88% em repouso","PA sistólica >180 ou <90 mmHg","Febre >38°C + sintomas respiratórios","TEP suspeita (dor pleurítica + dispneia súbita)"]} colors={cardioColors} />
            )}
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={cardioColors} sessionLabel="Evolução" specialty="cardiorespiratorio" defaultExpanded={true} pain={enhancer.pain} setPain={enhancer.setPain} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nQueixa: ${queixaCardio}\nComorbidades: ${comorbidadesCardio.join(", ")}\nSintomas: ${sintomasCardio.join(", ")}\nFC: ${fc} bpm | SpO2: ${spo2}% | PA: ${paSist}/${paDiast} mmHg\nNYHA: ${nyha}\nBorg: ${borg}\nmMRC: ${mrcDispneia}\nTC6M: ${tc6mDistancia}m\nEspirometria: CVF ${cvf}L, VEF1 ${vef1}L, Rel ${relacaoVEF1CVF}%\nMLHFQ: ${minnesotaResult?.total || "—"}/105\nEVA Mov: ${enhancer.pain.evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep}/10\nDor local: ${enhancer.pain.localDor.join(", ")}\nAusculta pulmonar: ${auscultaPulmonar}\nAusculta cardíaca: ${auscultaCardiaca}\nEdema: ${edema}\nJugular: ${jugular}\nEvolução: ${evolucaoCardio}`}
              colors={cardioColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="Cardio-Respiratória" colors={cardioColors} />
        )}

        {tab === "evidencias" && (() => {
          const matched = Object.entries(CARDIO_EVIDENCE).find(([key]) =>
            (queixaCardio||"").toLowerCase().includes(key.replace(/_/g," ")) ||
            (comorbidadesCardio||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
          );
          const cifCodes = matched ? matched[1].cif || [] : [];
          return (
            <>
              <CifAndHonorarios cifCodes={cifCodes} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.red} />
              <Section title="Diretrizes e Evidências em Reabilitação Cardiorrespiratória" icon="🔬">
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                  Diretrizes baseadas em evidências para reabilitação cardiorrespiratória, organizadas por condição.
                </div>
                {Object.entries(CARDIO_EVIDENCE).map(([key, condition]) => {
                  const active = (queixaCardio||"").toLowerCase().includes(key.replace(/_/g," ")) || (comorbidadesCardio||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")));
                  return (
                    <div key={key} style={{
                      ...card(),
                      border: active ? `1px solid ${C.red}50` : `1px solid ${C.border}`,
                      opacity: active ? 1 : 0.6,
                      cursor:"pointer"
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                        {active && <span style={{ fontSize:10, fontWeight:800, color:C.red, background:C.redBg, padding:"2px 8px", borderRadius:6 }}>Condição identificada ✓</span>}
                        <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{condition.label}</span>
                      </div>
                      <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7, marginBottom:8 }}>{condition.goldStandard}</div>
                      {condition.escalas && (
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {condition.escalas.map(s => (
                            <span key={s} style={{ fontSize:10, color:C.red, background:C.redBg, border:`1px solid ${C.red}30`, borderRadius:6, padding:"2px 8px" }}>{s}</span>
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
