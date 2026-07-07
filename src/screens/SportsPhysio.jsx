import { useState, useEffect } from "react";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import LogoSVG from "../components/LogoSVG";
import CifAndHonorarios from "../components/CifAndHonorarios";
import CifSection from "../components/CifSection";
import { CIF } from "../data/cif";
import { CollapsibleSection, CollapsibleSub, AudioField } from "../components";
import ScaleSelector from "../components/ScaleSelector";
import AssignFromOtherModules from "../components/AssignFromOtherModules";
import GeneralAssessment from "../components/GeneralAssessment";
import { calcYBalance, calcLSI, calcLSIBidirectional, calcRTS } from "../data/sportsScales";

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
const primaryBtn = (e={}) => ({ background:C.blue, color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const ghostBtn = (e={}) => ({ background:"transparent", color:C.blue, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const iconBtn = (active=false, activeColor=C.blue, e={}) => ({ background:active ? `${activeColor}18` : C.surface, border:`1px solid ${active ? activeColor+"50" : C.border}`, color:active ? activeColor : C.textMuted, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:active ? 700 : 400, cursor:"pointer", fontFamily:F, transition:"all 0.12s", ...e });

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
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.blue, flex:1 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function saveSportsData(studentId, data) {
  try { localStorage.setItem(`esportiva_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadSportsData(studentId) {
  try { const d = localStorage.getItem(`esportiva_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

// moved to src/data/sportsScales.js

const SPORTS_EVIDENCE = {
  lca: {
    cif: ["b710","b715","b730","d450","d455","d920"],
    label:"Reconstrução de LCA",
    goldStandard:"Fase 1 (0-2 sem): extensão completa ativa, controle de edema, mobilização patelar, CPM se necessário. Fase 2 (2-6 sem): carga progressiva, cadeia cinética fechada, fortalecimento de quadríceps sem extensão terminal. Fase 3 (6-12 sem): treino proprioceptivo, agachamento 0-60°, bike. Fase 4 (12-20 sem): corrida em linha reta, fortalecimento excêntrico, pliometria leve. Fase 5 (>20 sem): retorno ao esporte com critérios RTS (LSI >90%, Y-Balance >90%, hop test). Critérios de retorno: ausência de dor, ADM completa, força quadríceps LSI >90%, hop test LSI >90%, teste funcional esportivo. Evidência A (JOSPT 2022).",
    escalas:["IKDC (International Knee Documentation Committee)","Lysholm","Tegner Activity Scale","ACL-RSI (Return to Sport after Injury)","Hop Test Battery","Y-Balance Test"],
    referencias:[{ id:"JOSPT 2022", title:"Clinical Practice Guidelines for ACL Rehabilitation (JOSPT 2022)", url:"https://www.jospt.org/" }],
  },
  ombro_atleta: {
    cif: ["b710","b715","b730","d445","d430","d920"],
    label:"Ombro do Atleta",
    goldStandard:"Fase aguda: controle de dor e edema, ADM passiva preservada. Fase subaguda: fortalecimento de CORE e cintura escapular, exercícios de Cozen, rotadores externos com elástico. Fase de retorno: treino de arremesso progressivo (interval throwing program), pliometria, CKC para instabilidade. Para arremessadores: fortalecimento excêntrico de rotadores externos, protocolo de Jobe, scapular stabilization drills. Evitar: retorno precoce a arremessos de alta velocidade. Evidência A (JSES 2021).",
    escalas:["DASH","WORC (Western Ontario Rotator Cuff Index)","Constant-Murley","ASES (American Shoulder and Elbow Surgeons)","UCLA Shoulder Score"],
    referencias:[{ id:"JSES 2021", title:"Rehabilitation after shoulder injury in athletes (JSES 2021)", url:"https://www.jses.org/" }],
  },
  tendinopatia_patelar: {
    cif: ["b710","b730","b28015","d450","d455","d920"],
    label:"Tendinopatia Patelar (Joelho do Saltador)",
    goldStandard:"Exercício excêntrico em declínio (protocolo Purdam) é padrão-ouro. Carga progressiva: isométrico → excêntrico → pliométrico → esportivo. Evitar anti-inflamatórios (tendinopatia é degenerativa, não inflamatória). Fortalecimento excêntrico do quadríceps em superfície inclinada (25°). Controle de carga de treino: periodização com dias de descanso. Evitar: estiramento passivo exacerbado, injeção de corticosteroide (risco de ruptura). Evidência A (BJSM 2020).",
    escalas:["VISA-P (Victorian Institute of Sport Assessment — Patellar)","VAS para dor","Algofunctional Score"],
    referencias:[{ id:"BJSM 2020", title:"Eccentric decline squat for patellar tendinopathy (BJSM 2020)", url:"https://bjsm.bmj.com/" }],
  },
  lesao_muscular: {
    cif: ["b710","b730","b780","d450","d410","d920"],
    label:"Lesão Muscular",
    goldStandard:"Fase 1 (0-5 dias): proteção, carga controlada, compressão, eletroterapia analgésica. Fase 2 (5-14 dias): exercício isométrico submax, contração concêntrica leve sem dor, alongamento suave. Fase 3 (14-28 dias): fortalecimento concêntrico/excêntrico progressivo, pliometria, corrida progressiva. Fase 4 (>28 dias): retorno ao esporte com critérios clínicos. Protocolo PEACE & LOVE (BJSM 2020). Evitar: repouso absoluto prolongado, AINEs nas primeiras 48h (inibem regeneração), alongamento agressivo. Evidência A (BJSM 2020, Lancet 2022).",
    escalas:["EVA","Graduação da lesão (I, II, III)","Functional Movement Screen (FMS)","LSI para retorno"],
    referencias:[{ id:"Lancet 2022", title:"PEACE & LOVE protocol for soft tissue injuries (Lancet 2022)", url:"https://www.thelancet.com/" }],
  },
  entorse_tornozelo: {
    cif: ["b710","b715","b730","d450","d455","d920"],
    label:"Entorse de Tornozelo",
    goldStandard:"Fase aguda: protocolo POLICE (Protection, Optimal Loading, Ice, Compression, Elevation). Após 72h: fortalecimento de fibulares, treino proprioceptivo (Board de equilíbrio, BOSU), exercícios em superfície instável. Fase de retorno: corrida em 8, pliometria unilateral, saltos laterais. Evitar: mobilização precoce excessiva, retorno ao esporte sem critérios de estabilidade (70% evoluem para instabilidade crônica se mal tratado). Reabilitação neuromuscular reduz em 47% recidiva. Evidência A (JAT 2021).",
    escalas:["FAAM (Foot and Ankle Ability Measure)","FAOS (Foot and Ankle Outcome Score)","Cumberland Ankle Instability Tool (CAIT)","Star Excursion Balance Test (SEBT)"],
    referencias:[{ id:"JAT 2021", title:"Neuromuscular training to prevent ankle sprain recurrence (JAT 2021)", url:"https://journals.lww.com/jat/" }],
  },
  fratura_estresse: {
    cif: ["b710","b730","b28015","d450","d455","d850"],
    label:"Fratura por Estresse",
    goldStandard:"Identificar e corrigir fatores de risco: tríade da mulher atleta (dismenorreia, baixa DMO, DE), overtraining, déficit calórico, alteração biomecânica. Repouso relativo com manutenção de condicionamento cardiovascular (bike/natação se fratura em MMII). Fortalecimento do membro contralateral. Correção de desequilíbrios musculares. Retorno progressivo: caminhada → corrida leve → corrida em pista → esporte. Protocolo de retorno em 3:1 dias de carga/descanso. Evitar: retorno antes de 6-8 semanas, salto precoce, superfície irregular. Evidência B (AJSM 2022).",
    escalas:["EVA","Graduação da fratura (I-IV)","Radiografia/RM controle","LEFS (Lower Extremity Functional Scale)"],
    referencias:[{ id:"AJSM 2022", title:"Stress fracture management in athletes (AJSM 2022)", url:"https://journals.sagepub.com/home/ajs" }],
  },
  sindrome_patelofemoral: {
    cif: ["b710","b730","b28015","d450","d455","d920"],
    label:"Síndrome Patelofemoral",
    goldStandard:"Fortalecimento de quadríceps (vastus medialis oblíquo — VMO) é padrão-ouro. Treino de agachamento com carga progressiva (0-60°). Fortalecimento de quadril (glúteo médio e máximo) reduz estresse patelofemoral em 30%. Bandagem patelar (McConnell) como adjuvante. Evitar: agachamento profundo doloroso, step down exacerbado. Correção de pronação excessiva com palmilhas se indicado. Evidência A (BJSM 2022, JOSPT 2021).",
    escalas:["AKPS (Anterior Knee Pain Scale) / Kujala","VAS","LSI","Y-Balance Test (anterior reach asymmetry)"],
    referencias:[{ id:"BJSM 2022", title:"Hip and knee strengthening for patellofemoral pain (BJSM 2022)", url:"https://bjsm.bmj.com/" }],
  },
};

function generateCIFSports({ evaMov, avds }) {
  const result = [];
  if (evaMov >= 7) result.push({ code:"b280", desc:"Sensação de dor intensa", qualifier:3 });
  else if (evaMov >= 4) result.push({ code:"b280", desc:"Sensação de dor moderada", qualifier:2 });
  else if (evaMov >= 1) result.push({ code:"b280", desc:"Sensação de dor leve", qualifier:1 });
  result.push({ code:"b730", desc:"Força muscular", qualifier:2 });
  result.push({ code:"b710", desc:"Mobilidade das articulações", qualifier:2 });
  if (avds?.some(c => c.includes("Andar")) || avds?.some(c => c.includes("Correr"))) result.push({ code:"d450", desc:"Andar", qualifier:2 });
  if (avds?.some(c => c.includes("Esport")) || avds?.some(c => c.includes("Jogar")) || avds?.some(c => c.includes("Treinar"))) result.push({ code:"d920", desc:"Recreação e lazer", qualifier:2 });
  return result;
}

export default function SportsPhysio({ student, students, allPatients, currentModuleId, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById,
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

  const [nomeAtleta, setNomeAtleta] = useState("");
  const [idadeAtleta, setIdadeAtleta] = useState("");
  const [sexoAtleta, setSexoAtleta] = useState("");
  const [modalidadeEsporte, setModalidadeEsporte] = useState("");
  const [tempoPratica, setTempoPratica] = useState("");
  const [nivelCompetitivo, setNivelCompetitivo] = useState("");
  const [faseTemporada, setFaseTemporada] = useState("");
  const [lesoesPrevias, setLesoesPrevias] = useState([]);
  const [cirurgiasPrevias, setCirurgiasPrevias] = useState("");

  const [queixaEsportiva, setQueixaEsportiva] = useState("");
  const [hdaSports, setHdaSports] = useState("");
  const [diagnosticoCinesioSports, setDiagnosticoCinesioSports] = useState("");
  const [mecanismoLesao, setMecanismoLesao] = useState("");
  const [dataLesao, setDataLesao] = useState("");
  const [tratamentoRealizado, setTratamentoRealizado] = useState("");
  const [retornoAtividades, setRetornoAtividades] = useState("");

  const [comprimentoPerna, setComprimentoPerna] = useState("");
  const [ladoAfetado, setLadoAfetado] = useState("");
  const [yBalance, setYBalance] = useState({ anteriorD:"", posteromedialD:"", posterolateralD:"", anteriorE:"", posteromedialE:"", posterolateralE:"" });
  const [yBalanceResult, setYBalanceResult] = useState(null);

  const [hopTest, setHopTest] = useState({ singleD:"", tripleD:"", crossoverD:"", singleE:"", tripleE:"", crossoverE:"" });

  const [plank, setPlank] = useState("");
  const [sidePlank, setSidePlank] = useState("");

  const [admEsportiva, setAdmEsportiva] = useState({ flexaoJoelhoD:"", extensaoJoelhoD:"", flexaoJoelhoE:"", extensaoJoelhoE:"", flexaoOmbroD:"", abducaoOmbroD:"", flexaoOmbroE:"", abducaoOmbroE:"" });

  const [forcaEsportiva, setForcaEsportiva] = useState({ quadricepsD:"", quadricepsE:"", isquiotibiaisD:"", isquiotibiaisE:"", gluteoD:"", gluteoE:"", adutoresD:"", adutoresE:"", rotacaoExternaOmbroD:"", rotacaoExternaOmbroE:"" });

  const [rtsCriteria, setRtsCriteria] = useState([
    { id:"adm_total", label:"ADM completa sem dor", met:false },
    { id:"sem_dor", label:"Ausência de dor ao movimento (EVA 0/10)", met:false },
    { id:"forca_lsi", label:"Força muscular LSI > 90%", met:false },
    { id:"hop_lsi", label:"Hop test LSI > 90% (single/triple/crossover)", met:false },
    { id:"ybalance_lsi", label:"Y-Balance Test LSI > 90%", met:false },
    { id:"core_adequado", label:"CORE estável (plank > 60s, side plank > 45s)", met:false },
    { id:"teste_esportivo", label:"Teste específico do esporte (gesto esportivo sem dor)", met:false },
    { id:"psicologico", label:"Prontidão psicológica (escala de medo / confiança OK)", met:false },
    { id:"carga_progressiva", label:"Completou periodização de carga progressiva sem dor", met:false },
    { id:"assimetria_zero", label:"Assimetria funcional < 10% em todos os testes", met:false },
  ]);
  const [rtsResult, setRtsResult] = useState(null);

  const [testesEspeciais, setTestesEspeciais] = useState([]);

  const [faseReabilitacao, setFaseReabilitacao] = useState("");
  const [objetivosFase, setObjetivosFase] = useState("");
  const [exerciciosPrescritos, setExerciciosPrescritos] = useState("");
  const [progressaoCarga, setProgressaoCarga] = useState("");

  const [evolucaoEsportiva, setEvolucaoEsportiva] = useState("");

  const [expandedSections, setExpandedSections] = useState([]);
  const toggleSection = (id) => { setExpandedSections(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]); };
  const sid = student?.id || student?.nome;
  const enhancer = useEnhancer("esportiva", sid, `esportiva_enhancer_${sid}`);
  const [savedScales, setSavedScales] = useState(() => { try { const d = localStorage.getItem(`esportiva_scales_${sid}`); return d ? JSON.parse(d) : []; } catch { return []; } });
  const handleScaleSave = (result) => {
    const next = [...savedScales, { ...result, savedAt: new Date().toISOString() }];
    setSavedScales(next);
    try { localStorage.setItem(`esportiva_scales_${sid}`, JSON.stringify(next)); } catch {}
  };
  const sportColors = { ...C, accent: C.blue, font: F };
  const autoCifSports = generateCIFSports({ evaMov: enhancer.pain.evaMov, avds: [] });
  const matchedCif = Object.entries(SPORTS_EVIDENCE).find(([key]) =>
    (queixaEsportiva||"").toLowerCase().includes(key.replace(/_/g," ")) ||
    (lesoesPrevias||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
  );
  const cifSuggestionsSports = matchedCif ? matchedCif[1].cif || [] : [];

  useEffect(() => {
    if (student?.id || student?.nome) {
      const saved = loadSportsData(sid);
      if (saved) {
        setNomeAtleta(saved.nomeAtleta || "");
        setIdadeAtleta(saved.idadeAtleta || "");
        setSexoAtleta(saved.sexoAtleta || "");
        setModalidadeEsporte(saved.modalidadeEsporte || "");
        setTempoPratica(saved.tempoPratica || "");
        setNivelCompetitivo(saved.nivelCompetitivo || "");
        setFaseTemporada(saved.faseTemporada || "");
        setLesoesPrevias(saved.lesoesPrevias || []);
        setCirurgiasPrevias(saved.cirurgiasPrevias || "");
        setQueixaEsportiva(saved.queixaEsportiva || "");
        setHdaSports(saved.hdaSports || "");
        setDiagnosticoCinesioSports(saved.diagnosticoCinesioSports || "");
        setMecanismoLesao(saved.mecanismoLesao || "");
        setDataLesao(saved.dataLesao || "");
        setTratamentoRealizado(saved.tratamentoRealizado || "");
        setRetornoAtividades(saved.retornoAtividades || "");
        setComprimentoPerna(saved.comprimentoPerna || "");
        setLadoAfetado(saved.ladoAfetado || "");
        setYBalance(saved.yBalance || { anteriorD:"", posteromedialD:"", posterolateralD:"", anteriorE:"", posteromedialE:"", posterolateralE:"" });
        setYBalanceResult(saved.yBalanceResult || null);
        setHopTest(saved.hopTest || { singleD:"", tripleD:"", crossoverD:"", singleE:"", tripleE:"", crossoverE:"" });
        setPlank(saved.plank || "");
        setSidePlank(saved.sidePlank || "");
        setAdmEsportiva(saved.admEsportiva || { flexaoJoelhoD:"", extensaoJoelhoD:"", flexaoJoelhoE:"", extensaoJoelhoE:"", flexaoOmbroD:"", abducaoOmbroD:"", flexaoOmbroE:"", abducaoOmbroE:"" });
        setForcaEsportiva(saved.forcaEsportiva || { quadricepsD:"", quadricepsE:"", isquiotibiaisD:"", isquiotibiaisE:"", gluteoD:"", gluteoE:"", adutoresD:"", adutoresE:"", rotacaoExternaOmbroD:"", rotacaoExternaOmbroE:"" });
        setRtsCriteria(saved.rtsCriteria || [
          { id:"adm_total", label:"ADM completa sem dor", met:false },
          { id:"sem_dor", label:"Ausência de dor ao movimento (EVA 0/10)", met:false },
          { id:"forca_lsi", label:"Força muscular LSI > 90%", met:false },
          { id:"hop_lsi", label:"Hop test LSI > 90% (single/triple/crossover)", met:false },
          { id:"ybalance_lsi", label:"Y-Balance Test LSI > 90%", met:false },
          { id:"core_adequado", label:"CORE estável (plank > 60s, side plank > 45s)", met:false },
          { id:"teste_esportivo", label:"Teste específico do esporte (gesto esportivo sem dor)", met:false },
          { id:"psicologico", label:"Prontidão psicológica (escala de medo / confiança OK)", met:false },
          { id:"carga_progressiva", label:"Completou periodização de carga progressiva sem dor", met:false },
          { id:"assimetria_zero", label:"Assimetria funcional < 10% em todos os testes", met:false },
        ]);
        setRtsResult(saved.rtsResult || null);
        setTestesEspeciais(saved.testesEspeciais || []);
        setFaseReabilitacao(saved.faseReabilitacao || "");
        setObjetivosFase(saved.objetivosFase || "");
        setExerciciosPrescritos(saved.exerciciosPrescritos || "");
        setProgressaoCarga(saved.progressaoCarga || "");
        setEvolucaoEsportiva(saved.evolucaoEsportiva || "");
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
    saveSportsData(sid, {
      nomeAtleta, idadeAtleta, sexoAtleta, modalidadeEsporte, tempoPratica, nivelCompetitivo, faseTemporada, lesoesPrevias, cirurgiasPrevias,
      queixaEsportiva, hdaSports, diagnosticoCinesioSports, mecanismoLesao, dataLesao, tratamentoRealizado, retornoAtividades,
      comprimentoPerna, ladoAfetado, yBalance, yBalanceResult, hopTest, plank, sidePlank, admEsportiva, forcaEsportiva,
      rtsCriteria, rtsResult, testesEspeciais,
      faseReabilitacao, objetivosFase, exerciciosPrescritos, progressaoCarga,
      evolucaoEsportiva,
      pain: enhancer.pain, logs: enhancer.logs, redFlags: enhancer.redFlags, aiRes: enhancer.aiRes,
      data: new Date().toISOString().slice(0,10),
    });
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um atleta para iniciar o atendimento</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Atletas {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Novo Atleta"}
          </button>
        </div>
        <div style={{ marginTop:8 }}>
          <AssignFromOtherModules allPatients={allPatients} currentModuleId={currentModuleId} onUpdateStudentById={onUpdateStudentById} accentColor={C.blue} />
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.blue}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.blue, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              {editingStudent ? "✏️ Editar Atleta" : "➕ Novo Atleta"}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
              {[
                {k:"nome",l:"Nome completo",pl:"Nome do atleta"},
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
            }} disabled={!f.nome.trim()} style={{...primaryBtn({width:"100%",justifyContent:"center",padding:"11px",fontSize:14}),opacity:f.nome.trim()?1:0.4,cursor:f.nome.trim()?"pointer":"not-allowed"}}>{editingStudent ? "Salvar Alterações" : "Cadastrar Atleta"}</button>
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
                <div style={{ width:40, height:40, background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:C.blue, flexShrink:0 }}>
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
                <span style={{ color:C.blue, fontSize:16 }}>→</span>
              </button>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={() => { setEditTarget(p); }}
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0, transition:"all 0.12s" }}
                  title="Editar atleta">✏️</button>
                <button onClick={() => { setDeleteTarget(p); setDeleteStep(1); }}
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0, transition:"all 0.12s" }}
                  title="Excluir atleta">🗑</button>
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
            <div style={{ fontSize:16, fontWeight:800, color:C.red, marginBottom:8 }}>Excluir atleta</div>
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
              Todos os dados de <strong>{deleteTarget.nome}</strong> serão perdidos permanentemente. Esta operação <strong style={{color:C.red}}>não pode ser desfeita</strong>.
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
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.blue}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.blue, marginBottom:8 }}>Editar dados do atleta</div>
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
                style={{ background:C.blue, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
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
          <LogoSVG C={C} F={F}/>
          <button onClick={()=>setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Trocar paciente">👥 Pacientes</button>
          {onAgenda && <button onClick={onAgenda} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Agenda">📅 Agenda</button>}
          {onFinanceiro && <button onClick={onFinanceiro} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Financeiro">💰 Financeiro</button>}
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Anamnese"],["avaliacao","🔬","Avaliação"],["evolucao","📈","Evolução"],["sessoes","📅","Sessões"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.blueBg : "transparent",
              border: `1px solid ${tab === k ? C.blue + "50" : "transparent"}`,
              borderRadius: 8, padding: "7px 14px", fontSize: 12,
              fontWeight: tab === k ? 700 : 400,
              color: tab === k ? C.blue : C.textMuted, cursor: "pointer", fontFamily: F,
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
            <Section title="Perfil do Atleta" icon="⚽">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados do atleta, modalidade esportiva, histórico de lesões e queixa atual.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>Nome do atleta</span>
                  <input type="text" value={nomeAtleta} onChange={e => setNomeAtleta(e.target.value)} style={inp()} placeholder="Nome completo" />
                </div>
                <div>
                  <span style={lbl()}>Idade</span>
                  <input type="number" value={idadeAtleta} onChange={e => setIdadeAtleta(e.target.value)} style={inp()} placeholder="Anos" min={0} max={120} />
                </div>
                <div>
                  <span style={lbl()}>Sexo</span>
                  <SingleSelect options={["Feminino","Masculino","Outro"]} value={sexoAtleta} onChange={setSexoAtleta} activeColor={C.blue} />
                </div>
                <div>
                  <span style={lbl()}>Modalidade esportiva</span>
                  <input type="text" value={modalidadeEsporte} onChange={e => setModalidadeEsporte(e.target.value)} style={inp()} placeholder="Ex: Futebol, CrossFit, Atletismo..." />
                </div>
                <div>
                  <span style={lbl()}>Tempo de prática (anos)</span>
                  <input type="text" value={tempoPratica} onChange={e => setTempoPratica(e.target.value)} style={inp()} placeholder="Ex: 3 anos, 6 meses" />
                </div>
                <div>
                  <span style={lbl()}>Nível competitivo</span>
                  <SingleSelect options={["Amador","Regional","Estadual","Nacional","Internacional","Profissional"]} value={nivelCompetitivo} onChange={setNivelCompetitivo} activeColor={C.blue} />
                </div>
                <div>
                  <span style={lbl()}>Fase da temporada</span>
                  <SingleSelect options={["Pré-temporada","Temporada regular","Pós-temporada","Off-season","Lesão (fora de temporada)"]} value={faseTemporada} onChange={setFaseTemporada} activeColor={C.blue} />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Lesões prévias</span>
                <TagSelect options={["Entorse de tornozelo","Lesão muscular","LCA","Lutembocada","Tendinopatia patelar","Ombro (luxação/tendinite)","Fratura por estresse","Síndrome patelofemoral","Pubalgia","Estiramento muscular","Cervicalgia","Lombalgia","Síndrome do impacto","Tendinite de Aquiles","Cãibra muscular"]}
                  value={lesoesPrevias} onChange={setLesoesPrevias} activeColor={C.blue} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Cirurgias prévias</span>
                <input type="text" value={cirurgiasPrevias} onChange={e => setCirurgiasPrevias(e.target.value)} style={inp()} placeholder="Descreva cirurgias prévias relacionadas ao esporte..." />
              </div>
            </Section>

            <Section title="História da Lesão" icon="📝">
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Queixa esportiva / Motivo da consulta</span>
                <AudioField value={queixaEsportiva} onChange={v => setQueixaEsportiva(typeof v === "function" ? v(queixaEsportiva) : v)} placeholder="Ex: Dor no joelho direito ao agachar e correr, com sensação de falseio..." rows={2} />
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>HDA — História da Doença Atual</span>
                <AudioField value={hdaSports} onChange={v => setHdaSports(typeof v === "function" ? v(hdaSports) : v)} placeholder="Início, evolução, tratamentos prévios, exames realizados…" rows={3} />
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Diagnóstico Cinesioterapêutico (DCT)</span>
                <input type="text" value={diagnosticoCinesioSports} onChange={e => setDiagnosticoCinesioSports(e.target.value)} style={inp()} placeholder="Ex: Disfunção de ombro no overhead, joelho do saltador, tendinopatia patelar" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>Mecanismo da lesão</span>
                  <input type="text" value={mecanismoLesao} onChange={e => setMecanismoLesao(e.target.value)} style={inp()} placeholder="Ex: Trauma direto, entorse, overuse..." />
                </div>
                <div>
                  <span style={lbl()}>Data da lesão</span>
                  <input type="date" value={dataLesao} onChange={e => setDataLesao(e.target.value)} style={inp()} />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Tratamento realizado até o momento</span>
                <textarea value={tratamentoRealizado} onChange={e => setTratamentoRealizado(e.target.value)} rows={2}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.3, fontSize:12 }) }}
                  placeholder="Fisioterapia, medicamentos, cirurgias, tempo de imobilização..." />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Retorno às atividades</span>
                <SingleSelect options={["Não retornou","Retorno parcial","Retorno total mas com limitação","Retorno total sem limitação"]} value={retornoAtividades} onChange={setRetornoAtividades} activeColor={C.blue} />
              </div>
            </Section>

            <GeneralAssessment storageKey="sports" studentId={sid} colors={{ ...C, accent: C.blue }} />

            <CifSection cifSuggestions={cifSuggestionsSports} autoCif={autoCifSports} colors={{ ...C, green: C.green, blue: C.blue, blueBg: C.blueBg, purple: C.purple, purpleBg: C.purpleBg, surface: C.surface, card: C.card, textMuted: C.textMuted }} />

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Anamnese</button>
            </div>
          </>
        )}

        {tab === "avaliacao" && (
          <>
            <Section title="Y-Balance Test (SEBT)" icon="🦶">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Teste de equilíbrio e propriocepção em apoio unipodal. Valores em cm. Assimetria {'>'} 4 cm ou LSI {'<'} 90% = risco elevado de lesão.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px", marginBottom:12 }}>
                <NumericField label="Comp. da perna (cm)" value={comprimentoPerna} onChange={v => { setComprimentoPerna(v); if (yBalance) setYBalanceResult(calcYBalance(yBalance, v)); }} min={0} max={120} step={0.5} unit="cm" />
                <div>
                  <span style={lbl()}>Lado afetado</span>
                  <SingleSelect options={["Direito","Esquerdo","Nenhum"]} value={ladoAfetado} onChange={v => setLadoAfetado(v)} activeColor={C.blue} />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Anterior D (cm)" value={yBalance.anteriorD} onChange={v => { const n={...yBalance,anteriorD:v}; setYBalance(n); setYBalanceResult(calcYBalance(n, comprimentoPerna)); }} min={0} max={150} step={0.5} />
                <NumericField label="Anterior E (cm)" value={yBalance.anteriorE} onChange={v => { const n={...yBalance,anteriorE:v}; setYBalance(n); setYBalanceResult(calcYBalance(n, comprimentoPerna)); }} min={0} max={150} step={0.5} />
                <NumericField label="Póstero-medial D (cm)" value={yBalance.posteromedialD} onChange={v => { const n={...yBalance,posteromedialD:v}; setYBalance(n); setYBalanceResult(calcYBalance(n, comprimentoPerna)); }} min={0} max={150} step={0.5} />
                <NumericField label="Póstero-medial E (cm)" value={yBalance.posteromedialE} onChange={v => { const n={...yBalance,posteromedialE:v}; setYBalance(n); setYBalanceResult(calcYBalance(n, comprimentoPerna)); }} min={0} max={150} step={0.5} />
                <NumericField label="Póstero-lateral D (cm)" value={yBalance.posterolateralD} onChange={v => { const n={...yBalance,posterolateralD:v}; setYBalance(n); setYBalanceResult(calcYBalance(n, comprimentoPerna)); }} min={0} max={150} step={0.5} />
                <NumericField label="Póstero-lateral E (cm)" value={yBalance.posterolateralE} onChange={v => { const n={...yBalance,posterolateralE:v}; setYBalance(n); setYBalanceResult(calcYBalance(n, comprimentoPerna)); }} min={0} max={150} step={0.5} />
              </div>
              {yBalanceResult && (
                <div style={{ marginTop:12, background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Resultados Y-Balance</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, fontSize:12, color:C.textSub }}>
                    <div><strong>Anterior D:</strong> {yBalanceResult.d.anterior}cm</div>
                    <div><strong>PM D:</strong> {yBalanceResult.d.posteromedial}cm</div>
                    <div><strong>PL D:</strong> {yBalanceResult.d.posterolateral}cm</div>
                    <div><strong>Anterior E:</strong> {yBalanceResult.e.anterior}cm</div>
                    <div><strong>PM E:</strong> {yBalanceResult.e.posteromedial}cm</div>
                    <div><strong>PL E:</strong> {yBalanceResult.e.posterolateral}cm</div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8, fontSize:13, color:C.textSub }}>
                    <div>Composite D: <strong>{yBalanceResult.compositeD}%</strong></div>
                    <div>Composite E: <strong>{yBalanceResult.compositeE}%</strong></div>
                  </div>
                  <div style={{ marginTop:8, fontSize:14, fontWeight:700, color: yBalanceResult.lsi >= 90 ? C.green : C.amber }}>
                    LSI: {yBalanceResult.lsi}% {yBalanceResult.lsi >= 90 ? "✅" : "⚠️"}
                  </div>
                </div>
              )}
            </Section>

            <Section title="Hop Tests" icon="🏃">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Testes de salto unilateral. Valores em cm. LSI (Limb Symmetry Index) {'>'} 90% é critério de retorno ao esporte.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Single hop D (cm)" value={hopTest.singleD} onChange={v => setHopTest(p=>({...p,singleD:v}))} min={0} max={300} step={0.5} />
                <NumericField label="Single hop E (cm)" value={hopTest.singleE} onChange={v => setHopTest(p=>({...p,singleE:v}))} min={0} max={300} step={0.5} />
                <NumericField label="Triple hop D (cm)" value={hopTest.tripleD} onChange={v => setHopTest(p=>({...p,tripleD:v}))} min={0} max={900} step={0.5} />
                <NumericField label="Triple hop E (cm)" value={hopTest.tripleE} onChange={v => setHopTest(p=>({...p,tripleE:v}))} min={0} max={900} step={0.5} />
                <NumericField label="Crossover hop D (cm)" value={hopTest.crossoverD} onChange={v => setHopTest(p=>({...p,crossoverD:v}))} min={0} max={900} step={0.5} />
                <NumericField label="Crossover hop E (cm)" value={hopTest.crossoverE} onChange={v => setHopTest(p=>({...p,crossoverE:v}))} min={0} max={900} step={0.5} />
              </div>
              {(hopTest.singleD && hopTest.singleE) ? (
                <div style={{ marginTop:12, background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>LSI — Hop Tests</div>
                  <div style={{ fontSize:13, color:C.textSub, lineHeight:1.8 }}>
                    Single hop: <strong style={{color:calcLSIBidirectional(hopTest.singleD,hopTest.singleE,ladoAfetado)>=90?C.green:C.amber}}>{calcLSIBidirectional(hopTest.singleD,hopTest.singleE,ladoAfetado)}%</strong>
                    {hopTest.tripleD && hopTest.tripleE ? <> · Triple hop: <strong style={{color:calcLSIBidirectional(hopTest.tripleD,hopTest.tripleE,ladoAfetado)>=90?C.green:C.amber}}>{calcLSIBidirectional(hopTest.tripleD,hopTest.tripleE,ladoAfetado)}%</strong></> : ""}
                    {hopTest.crossoverD && hopTest.crossoverE ? <> · Crossover: <strong style={{color:calcLSIBidirectional(hopTest.crossoverD,hopTest.crossoverE,ladoAfetado)>=90?C.green:C.amber}}>{calcLSIBidirectional(hopTest.crossoverD,hopTest.crossoverE,ladoAfetado)}%</strong></> : ""}
                  </div>
                </div>
              ) : null}
            </Section>

            <Section title="CORE Stability" icon="💪">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação de resistência do CORE. Plank {'>'} 60s e side plank {'>'} 45s são referências para atletas.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Plank (segundos)" value={plank} onChange={setPlank} min={0} max={600} step={1} unit="s" />
                <NumericField label="Side plank (segundos)" value={sidePlank} onChange={setSidePlank} min={0} max={600} step={1} unit="s" />
              </div>
              {(plank || sidePlank) ? (
                <div style={{ marginTop:8, fontSize:12, color:C.textSub }}>
                  {plank > 60 ? <span style={{color:C.green}}>✅ Plank adequado</span> : plank ? <span style={{color:C.amber}}>⚠️ Plank abaixo do ideal</span> : null}
                  {plank && sidePlank ? " · " : null}
                  {sidePlank > 45 ? <span style={{color:C.green}}>✅ Side plank adequado</span> : sidePlank ? <span style={{color:C.amber}}>⚠️ Side plank abaixo do ideal</span> : null}
                </div>
              ) : null}
            </Section>

            <Section title="ADM Articular" icon="🔄">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Amplitude de movimento dos principais segmentos relevantes para o esporte.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 16px", marginBottom:10 }}>
                <NumericField label="Flexão joelho D (°)" value={admEsportiva.flexaoJoelhoD} onChange={v => setAdmEsportiva(p=>({...p,flexaoJoelhoD:v}))} min={0} max={160} step={1} unit="°" />
                <NumericField label="Flexão joelho E (°)" value={admEsportiva.flexaoJoelhoE} onChange={v => setAdmEsportiva(p=>({...p,flexaoJoelhoE:v}))} min={0} max={160} step={1} unit="°" />
                <NumericField label="Extensão joelho D (°)" value={admEsportiva.extensaoJoelhoD} onChange={v => setAdmEsportiva(p=>({...p,extensaoJoelhoD:v}))} min={-20} max={0} step={1} unit="°" />
                <NumericField label="Extensão joelho E (°)" value={admEsportiva.extensaoJoelhoE} onChange={v => setAdmEsportiva(p=>({...p,extensaoJoelhoE:v}))} min={-20} max={0} step={1} unit="°" />
                <NumericField label="Flexão ombro D (°)" value={admEsportiva.flexaoOmbroD} onChange={v => setAdmEsportiva(p=>({...p,flexaoOmbroD:v}))} min={0} max={180} step={1} unit="°" />
                <NumericField label="Flexão ombro E (°)" value={admEsportiva.flexaoOmbroE} onChange={v => setAdmEsportiva(p=>({...p,flexaoOmbroE:v}))} min={0} max={180} step={1} unit="°" />
                <NumericField label="Abdução ombro D (°)" value={admEsportiva.abducaoOmbroD} onChange={v => setAdmEsportiva(p=>({...p,abducaoOmbroD:v}))} min={0} max={180} step={1} unit="°" />
                <NumericField label="Abdução ombro E (°)" value={admEsportiva.abducaoOmbroE} onChange={v => setAdmEsportiva(p=>({...p,abducaoOmbroE:v}))} min={0} max={180} step={1} unit="°" />
              </div>
            </Section>

            <Section title="Força Muscular" icon="🏋️">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação de força isométrica ou 1RM para grupos musculares chave. Valores em kg.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 16px" }}>
                <NumericField label="Quadríceps D (kg)" value={forcaEsportiva.quadricepsD} onChange={v => setForcaEsportiva(p=>({...p,quadricepsD:v}))} min={0} max={300} step={0.5} unit="kg" />
                <NumericField label="Quadríceps E (kg)" value={forcaEsportiva.quadricepsE} onChange={v => setForcaEsportiva(p=>({...p,quadricepsE:v}))} min={0} max={300} step={0.5} unit="kg" />
                <NumericField label="Isquiotibiais D (kg)" value={forcaEsportiva.isquiotibiaisD} onChange={v => setForcaEsportiva(p=>({...p,isquiotibiaisD:v}))} min={0} max={200} step={0.5} unit="kg" />
                <NumericField label="Isquiotibiais E (kg)" value={forcaEsportiva.isquiotibiaisE} onChange={v => setForcaEsportiva(p=>({...p,isquiotibiaisE:v}))} min={0} max={200} step={0.5} unit="kg" />
                <NumericField label="Glúteo D (kg)" value={forcaEsportiva.gluteoD} onChange={v => setForcaEsportiva(p=>({...p,gluteoD:v}))} min={0} max={200} step={0.5} unit="kg" />
                <NumericField label="Glúteo E (kg)" value={forcaEsportiva.gluteoE} onChange={v => setForcaEsportiva(p=>({...p,gluteoE:v}))} min={0} max={200} step={0.5} unit="kg" />
                <NumericField label="Adutores D (kg)" value={forcaEsportiva.adutoresD} onChange={v => setForcaEsportiva(p=>({...p,adutoresD:v}))} min={0} max={150} step={0.5} unit="kg" />
                <NumericField label="Adutores E (kg)" value={forcaEsportiva.adutoresE} onChange={v => setForcaEsportiva(p=>({...p,adutoresE:v}))} min={0} max={150} step={0.5} unit="kg" />
                <NumericField label="Rot. externa ombro D (kg)" value={forcaEsportiva.rotacaoExternaOmbroD} onChange={v => setForcaEsportiva(p=>({...p,rotacaoExternaOmbroD:v}))} min={0} max={100} step={0.5} unit="kg" />
                <NumericField label="Rot. externa ombro E (kg)" value={forcaEsportiva.rotacaoExternaOmbroE} onChange={v => setForcaEsportiva(p=>({...p,rotacaoExternaOmbroE:v}))} min={0} max={100} step={0.5} unit="kg" />
              </div>
              {(forcaEsportiva.quadricepsD && forcaEsportiva.quadricepsE) ? (
                <div style={{ marginTop:12, background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"10px 14px" }}>
                  <span style={{ fontSize:12, color:C.textSub }}>LSI Quadríceps: <strong style={{color:calcLSIBidirectional(forcaEsportiva.quadricepsD,forcaEsportiva.quadricepsE,ladoAfetado)>=90?C.green:C.amber}}>{calcLSIBidirectional(forcaEsportiva.quadricepsD,forcaEsportiva.quadricepsE,ladoAfetado)}%</strong></span>
                  {(forcaEsportiva.isquiotibiaisD && forcaEsportiva.isquiotibiaisE) ? <span style={{ fontSize:12, color:C.textSub, marginLeft:16 }}>LSI Isquiotibiais: <strong style={{color:calcLSIBidirectional(forcaEsportiva.isquiotibiaisD,forcaEsportiva.isquiotibiaisE,ladoAfetado)>=90?C.green:C.amber}}>{calcLSIBidirectional(forcaEsportiva.isquiotibiaisD,forcaEsportiva.isquiotibiaisE,ladoAfetado)}%</strong></span> : null}
                </div>
              ) : null}
            </Section>

            <Section title="Testes Especiais" icon="🔬">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Selecione os testes especiais com resultado positivo. Use como referência para diagnóstico diferencial.
              </div>
              <TagSelect options={["Lachman (+)","Pivot Shift (+)","Gaveta Anterior (+)","Apprehension (+)","Neer (+)","Hawkins (+)","Ober (+)","Trendelenburg (+)","Patellar Grind (+)","Noble (+)","McMurray (+)","Drop Arm (+)","Yergason (+)","Speed (+)","Fabelere (+)", "Compressão de Apley (+)", "Distração de Apley (+)", "Thompson (+)", "Tornozelo — Gaveta anterior (+)"]}
                value={testesEspeciais} onChange={setTestesEspeciais} activeColor={C.blue} />
            </Section>

            <Section title="Critérios de Retorno ao Esporte (RTS)" icon="✅">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Checklist de critérios objetivos para liberação do atleta ao esporte. Mínimo 90% de critérios atendidos para retorno seguro.
              </div>
              {rtsCriteria.map((item) => (
                <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:`1px solid ${C.border}30` }}>
                  <button onClick={() => {
                    const next = rtsCriteria.map(c => c.id === item.id ? { ...c, met: !c.met } : c);
                    setRtsCriteria(next);
                    setRtsResult(calcRTS(next));
                  }} style={{
                    width:24, height:24, borderRadius:6, border:`2px solid ${item.met ? C.green : C.border}`,
                    background: item.met ? C.green : "transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, color: item.met ? "#fff" : "transparent", fontFamily:F, flexShrink:0, transition:"all 0.12s",
                  }}>{item.met ? "✓" : ""}</button>
                  <span style={{ fontSize:13, color: item.met ? C.green : C.textSub, flex:1, lineHeight:1.4 }}>{item.label}</span>
                </div>
              ))}
              {rtsResult && (
                <div style={{ marginTop:14, background:`${rtsResult.color}15`, border:`1px solid ${rtsResult.color}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Critérios RTS</div>
                  <div style={{ fontSize:32, fontWeight:900, color:rtsResult.color }}>{rtsResult.met}/{rtsResult.total} ({rtsResult.pct}%)</div>
                  <div style={{ fontSize:14, fontWeight:700, color:rtsResult.color, marginTop:4 }}>{rtsResult.status}</div>
                </div>
              )}
            </Section>

            <Section title="Periodização da Reabilitação" icon="📅">
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Fase da reabilitação</span>
                <SingleSelect options={["Fase 1 — Proteção / Controle da dor","Fase 2 — Carga controlada / ADM","Fase 3 — Fortalecimento progressivo","Fase 4 — Pliometria / Gestos esportivos","Fase 5 — Retorno ao esporte"]} value={faseReabilitacao} onChange={setFaseReabilitacao} activeColor={C.blue} />
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Objetivos da fase</span>
                <textarea value={objetivosFase} onChange={e => setObjetivosFase(e.target.value)} rows={2}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.3 }) }}
                  placeholder="Descreva os objetivos específicos para esta fase da reabilitação..." />
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Exercícios prescritos</span>
                <textarea value={exerciciosPrescritos} onChange={e => setExerciciosPrescritos(e.target.value)} rows={3}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.3 }) }}
                  placeholder="Liste os exercícios, séries, repetições e frequência..." />
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Progressão de carga</span>
                <textarea value={progressaoCarga} onChange={e => setProgressaoCarga(e.target.value)} rows={2}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.3 }) }}
                  placeholder="Critérios para progressão: ausência de dor, controle motor, força → próxima fase..." />
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
            </div>
            {/* 📊 Escalas Padronizadas */}
            <CollapsibleSection title="Escalas Padronizadas" icon="📊" expanded={expandedSections.includes("escalas")} onToggle={()=>toggleSection("escalas")}>
              <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.5}}>Selecione uma escala validada para aplicar ao paciente. Os resultados ficam salvos neste módulo.</div>
              <ScaleSelector scaleNames={["IKDC","Lysholm","Tegner Activity Scale","ACL-RSI","Y-Balance Test (SEBT) Composite","HAGOS","VISA-P","VISA-A","FAAM","Return to Sport Criteria (RTS)","LSI"]} onSave={handleScaleSave} savedResults={savedScales} />
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
              Registre a evolução do atleta, resposta às intervenções, progressão nas fases de reabilitação e planejamento das próximas etapas.
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução esportiva / Observações</span>
              <textarea value={evolucaoEsportiva} onChange={e => setEvolucaoEsportiva(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução desde a última sessão, resposta às intervenções, mudanças na funcionalidade esportiva..." />
            </div>
            {yBalanceResult && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.blue, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Últimos indicadores</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>
                  <strong>Y-Balance LSI:</strong> {yBalanceResult.lsi}% · <strong>Hop LSI:</strong> {calcLSIBidirectional(hopTest.singleD,hopTest.singleE,ladoAfetado)}% · <strong>Plank:</strong> {plank || "—"}s · <strong>RTS:</strong> {rtsResult?.pct || "—"}%
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
            <PainSection pain={enhancer.pain} setPain={enhancer.setPain} colors={sportColors} />
            <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
              flags={["Dor súbita intensa durante atividade","Edema significativo pós-exercício","Instabilidade articular","Falseio/ giving way","Sintomas neurológicos (formigamento, fraqueza)","Sinais de fratura por estresse","Recidiva de lesão"]}
              colors={sportColors} />
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={sportColors} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Atleta: ${student?.nome || "—"}\nModalidade: ${modalidadeEsporte}\nNível: ${nivelCompetitivo}\nFase temporada: ${faseTemporada}\nQueixa: ${queixaEsportiva}\nHDA: ${hdaSports}\nDCT: ${diagnosticoCinesioSports}\nMecanismo: ${mecanismoLesao}\nLesões prévias: ${lesoesPrevias.join(", ")}\nY-Balance LSI: ${yBalanceResult?.lsi || "—"}%\nHop LSI: ${calcLSIBidirectional(hopTest.singleD,hopTest.singleE,ladoAfetado)}%\nRTS: ${rtsResult?.pct || "—"}%\nPlank: ${plank || "—"}s\nFase reabilitação: ${faseReabilitacao}\nEVA Mov: ${enhancer.pain.evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep}/10\nDor local: ${enhancer.pain.localDor.join(", ")}\nTestes especiais (+): ${testesEspeciais.join(", ")}\nEvolução: ${evolucaoEsportiva}`}
              colors={sportColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {tab === "relatorio" && (() => {
          const matched = Object.entries(SPORTS_EVIDENCE).find(([key]) =>
            (queixaEsportiva||"").toLowerCase().includes(key.replace(/_/g," ")) ||
            (lesoesPrevias||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
          );
          const cifCodes = matched ? matched[1].cif || [] : [];
          return (
            <>
              <CifAndHonorarios cifCodes={cifCodes} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.blue} />
              <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
                aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
                moduleLabel="Fisioterapia Esportiva" colors={sportColors} />
            </>
          );
        })()}

        {tab === "evidencias" && (() => {
          const matched = Object.entries(SPORTS_EVIDENCE).find(([key]) =>
            (queixaEsportiva||"").toLowerCase().includes(key.replace(/_/g," ")) ||
            (lesoesPrevias||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
          );
          const cifCodes = matched ? matched[1].cif || [] : [];
          return (
            <>
              <CifAndHonorarios cifCodes={cifCodes} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.blue} />
              <Section title="Diretrizes e Evidências em Fisioterapia Esportiva" icon="🔬">
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                  Diretrizes baseadas em evidências para reabilitação esportiva, organizadas por condição clínica.
                </div>
                {Object.entries(SPORTS_EVIDENCE).map(([key, condition]) => {
                  const active = queixaEsportiva.toLowerCase().includes(key.replace(/_/g," ")) || lesoesPrevias.some(c => c.toLowerCase().includes(key.replace(/_/g," ")));
                  return (
                    <div key={key} style={{
                      ...card(),
                      border: active ? `1px solid ${C.blue}50` : `1px solid ${C.border}`,
                      opacity: active ? 1 : 0.6,
                      cursor:"pointer"
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
