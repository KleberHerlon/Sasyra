import { useState, useEffect } from "react";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import CifAndHonorarios from "../components/CifAndHonorarios";
import CifSection from "../components/CifSection";
import { CIF } from "../data/cif";
import { AudioField, CollapsibleSection, CollapsibleSub, SessionCounter, HonorariosCard } from "../components";
import ScaleSelector from "../components/ScaleSelector";
import AssignFromOtherModules from "../components/AssignFromOtherModules";
import GeneralAssessment from "../components/GeneralAssessment";
import { detectLocalDor } from "../utils/clinicalDetection.js";
import { useClinicalScan } from "../hooks/useClinicalScan.js";
import { useSemanticScanner } from "../hooks/useSemanticScanner.js";
import { extractClinicalEntities } from "../utils/clinicalDetection.js";
import LogoSVG from "../components/LogoSVG";
import { calcOxford, calcPERFECT } from "../data/uroScales";
import BristolStoolScale from "../components/BristolStoolScale";
import ErectionRigidityScale from "../components/ErectionRigidityScale";
import PelvicFloorMap from "../components/PelvicFloorMap";

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

function saveUroData(studentId, data) {
  try { localStorage.setItem(`uro_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadUroData(studentId) {
  try { const d = localStorage.getItem(`uro_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

const URO_EVIDENCE = {
  incontinencia_urinaria: {
    cif:["b620","b630","d530","d770","s750"],
    label:"Incontinência Urinária de Esforço",
    goldStandard:"Treino da musculatura do assoalho pélvico (TMAP) com contrações rápidas e lentas — Evidência A. Biofeedback + eletroestimulação para casos refratários. Treino funcional com cones vaginais e exercícios de impacto progressivo. Orientação de estratégias de contrapressão uretral durante esforço. Programa domiciliar com 3 séries de 8-12 contrações rápidas + 8-12 lentas, 2x/dia. Evitar manobra de Valsalva e esforços repetitivos. Resultados em 12-16 semanas (IUGA 2022 - Evidência A).",
    escalas:["ICIQ-SF","Pad Test (1h)","Diário Miccional","PERFECT","Oxford","Urinary Distress Inventory (UDI-6)"],
    referencias:[{ id:"IUGA 2022", title:"Conservative management of female stress urinary incontinence", url:"https://www.iuga.org/" }],
  },
  bexiga_hiperativa: {
    cif:["b620","b630","d530","d240","b152"],
    label:"Bexiga Hiperativa",
    goldStandard:"Treino vesical (retreinamento miccional) com intervalo progressivo de 2h para 4h — Evidência A. TMAP para relaxamento do assoalho pélvico durante urgência. Técnicas de supressão de urgência (contração rápida do MAP). Biofeedback + eletroestimulação do tibial posterior. Orientação hídrica (1.5-2L/dia) e dietética (evitar cafeína, álcool, citricos). Bloqueadores muscarínicos se necessário. Resultados em 8-12 semanas (NICE Guidelines 2021 - Evidência A).",
    escalas:["ICIQ-SF","Diário Miccional (frequência/nictúria)","Overactive Bladder Questionnaire (OAB-q)","UDI-6","PERFECT"],
    referencias:[{ id:"NICE 2021", title:"Urinary incontinence and pelvic organ prolapse in women", url:"https://www.nice.org.uk/guidance/ng210" }],
  },
  prolapso: {
    cif:["b630","b660","d530","d770","s750"],
    label:"Prolapso de Órgão Pélvico",
    goldStandard:"TMAP com ênfase em contração sustentada (endurance) — Evidência B. Biofeedback para recrutamento adequado sem Valsalva. Orientação de proteção do assoalho pélvico em atividades diárias (levantar peso, tosse, espirro). Pessário vaginal se POP-Q estágio II-III e contraindicação cirúrgica. Correção cirúrgica com fisioterapia pré e pós-operatória. Evitar levantamento de peso >5kg e impactos repetitivos. Acompanhamento a cada 6 meses (POP-Q). Resultados em 6 meses de TMAP regular (Cochrane 2021 - Evidência A).",
    escalas:["POP-Q (Ba, Bp, C, D, Gh, Pb, TVL)","PFDI-20","PFIQ-7","PERFECT","Oxford"],
    referencias:[{ id:"Cochrane 2021", title:"Pelvic floor muscle training for prolapse", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD012407/" }],
  },
  disfuncao_sexual: {
    cif:["b640","b660","d770","b152","d710"],
    label:"Disfunção Sexual Feminina",
    goldStandard:"TMAP para consciência perineal e fortalecimento — Evidência A. Biofeedback para coordenação MAP durante atividade sexual. Técnicas de relaxamento do assoalho pélvico para dispareunia superficial. Liberação miofascial de pontos gatilho em elevador do ânus e obturador interno. Orientação postural e lubrificação. Alongamento de cadeia posterior e respiração diafragmática. Abordagem multidisciplinar com ginecologista e psicólogo/sexóloga. Resultados em 12-16 semanas (Female Pelvic Med Reconstr Surg 2022 - Evidência B).",
    escalas:["FSFI (Female Sexual Function Index)","PERFECT","Oxford","EVA Dor durante relação","PFDI-20"],
    referencias:[{ id:"FSFI 2022", title:"Pelvic floor function and female sexual dysfunction", url:"https://pubmed.ncbi.nlm.nih.gov/" }],
  },
  gestacao_pos_parto: {
    cif:["b660","b620","d530","d770","d640"],
    label:"Gestação e Pós-Parto",
    goldStandard:"TMAP preventivo a partir da 20a semana gestacional — Evidência A. Biofeedback + eletroestimulação pós-parto (após 6 semanas). Treino de diástase abdominal associado (contraтура transverso abdominal). Orientação de proteção perineal em parto e pós-parto imediato. Reeducação postural e respiração. Exercícios hipopressivos após 6 semanas pós-parto. Retorno gradual a atividades de impacto após 3-4 meses. Resultados: redução de 30% de IU pós-parto (BJOG 2020 - Evidência A).",
    escalas:["PERFECT","Oxford","Diário Miccional","EVA Dor perineal","PFDI-20","Diástase abdominal"],
    referencias:[{ id:"BJOG 2020", title:"Antenatal pelvic floor muscle training for prevention of postpartum incontinence", url:"https://pubmed.ncbi.nlm.nih.gov/" }],
  },
  incontinencia_anal: {
    cif:["b525","b620","b630","d530","d770"],
    label:"Incontinência Anal",
    goldStandard:"TMAP com ênfase em endurance e contração sustentada — Evidência A. Biofeedback retal com balão para sensibilidade e coordenação. Eletroestimulação do assoalho pélvico. Treino de esfíncter anal (contrações rápidas 50% + lentas 50%). Orientação dietética (fibras 25-30g/dia, evitar lactose/cafeína). Uso de biofeedback manométrico se disponível. Reabilitação em 8-12 sessões, 1-2x/semana. Resultados em 12 semanas (Cochrane 2022 - Evidência A).",
    escalas:["Cleveland Clinic Incontinence Score (CCIS 0-20)","PERFECT","Oxford","Diário de perdas anais","Wexner Score"],
    referencias:[{ id:"Cochrane 2022", title:"Biofeedback for fecal incontinence", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD009755/" }],
  },
  dor_pelvica: {
    cif:["b280","b630","b640","d770","d240"],
    label:"Dor Pélvica Crônica",
    goldStandard:"Liberação miofascial de pontos gatilho em assoalho pélvico — Evidência A. Biofeedback para relaxamento MAP (redução de tônus de base). Eletroestimulação para analgesia (TENS transcutâneo e intravaginal). Treino respiratório diafragmático e relaxamento progressivo. Alongamento de cadeia posterior, adutores e quadril. Mobilização articular de sacro, cóccix e ilíacos. Abordagem biopsicossocial + terapia manual + exercício terapêutico. Evitar TMAP de fortalecimento (pode piorar). Resultados em 10-12 sessões (Pain 2021 - Evidência A).",
    escalas:["EVA (0-10)","PFDI-20","FSFI","PERFECT (relaxamento)","SF-36","Central Sensitization Inventory"],
    referencias:[{ id:"Pain 2021", title:"Pelvic floor physical therapy for chronic pelvic pain", url:"https://pubmed.ncbi.nlm.nih.gov/" }],
  },
};

function generateCIFUro({ evaMov, sintomas, limitacoes }) {
  const result = [];
  if (evaMov >= 7) result.push({ code:"b280", desc:"Sensação de dor intensa", qualifier:3 });
  else if (evaMov >= 4) result.push({ code:"b280", desc:"Sensação de dor moderada", qualifier:2 });
  else if (evaMov >= 1) result.push({ code:"b280", desc:"Sensação de dor leve", qualifier:1 });
  if (sintomas?.length > 0) { result.push({ code:"b620", desc:"Função urinária", qualifier:2 }); result.push({ code:"b630", desc:"Sensação relacionada à micção", qualifier:2 }); }
  if (limitacoes?.includes("Deambular") || limitacoes?.includes("Andar")) result.push({ code:"d450", desc:"Andar", qualifier:2 });
  if (limitacoes?.includes("AVDs domésticas")) result.push({ code:"d640", desc:"Realizar tarefas domésticas", qualifier:2 });
  return result;
}

export default function UroGynecology({ student, students, allPatients, currentModuleId, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById, plan, onAgenda, onFinanceiro, onSubscription, planLabel }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("avaliacao");
  const [regiao, setRegiao] = useState("Centro-Oeste");

  const [queixaUro, setQueixaUro] = useState("");
  const [hdaUro, setHdaUro] = useState("");
  const [diagnosticoCinesioUro, setDiagnosticoCinesioUro] = useState("");
  const [localDor, setLocalDor] = useState([]);
  const [gesta, setGesta] = useState("");
  const [para, setPara] = useState("");
  const [partosNormais, setPartosNormais] = useState("");
  const [partosCesarios, setPartosCesarios] = useState("");
  const [abortos, setAbortos] = useState("");
  const [menopausa, setMenopausa] = useState("");
  const [cirurgiasPelvicas, setCirurgiasPelvicas] = useState([]);
  const [doencasUro, setDoencasUro] = useState([]);
  const [medicamentosUro, setMedicamentosUro] = useState("");
  const [historicoFamiliarUro, setHistoricoFamiliarUro] = useState("");

  const [perdaUrina, setPerdaUrina] = useState([]);
  const [frequenciaUrinaria, setFrequenciaUrinaria] = useState([]);
  const [urgenciaMiccional, setUrgenciaMiccional] = useState([]);
  const [nicturia, setNicturia] = useState([]);
  const [sensacaoEsvaziamento, setSensacaoEsvaziamento] = useState([]);
  const [dorMiccao, setDorMiccao] = useState([]);
  const [constipacao, setConstipacao] = useState([]);
  const [dispareunia, setDispareunia] = useState([]);

  const [diureseDia, setDiureseDia] = useState("");
  const [diureseNoite, setDiureseNoite] = useState("");
  const [perdasDia, setPerdasDia] = useState("");
  const [perdasNoite, setPerdasNoite] = useState("");
  const [ingestaoHidrica, setIngestaoHidrica] = useState("");

  const [oxford, setOxford] = useState("");
  const [perfect, setPerfect] = useState({ power:"", endurance:"", repetitions:"", fast:"" });
  const [pelvicFloorMap, setPelvicFloorMap] = useState([]);
  const [bristolStool, setBristolStool] = useState(null);
  const [erectionRigidity, setErectionRigidity] = useState(null);
  const [popQ, setPopQ] = useState({ ba:"", bp:"", c:"", d:"", gh:"", pb:"", tvl:"" });
  const [perineometria, setPerineometria] = useState("");

  const [iciqSF, setIciqSF] = useState("");
  const [pfdi20, setPfdi20] = useState("");
  const [fsfi, setFsfi] = useState("");

  const [evolucaoUro, setEvolucaoUro] = useState("");

  const [expandedSections, setExpandedSections] = useState([]);
  const toggleSection = (id) => { setExpandedSections(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]); };
  const sid = student?.id || student?.nome;
  const enhancer = useEnhancer("uroginecologia", sid, `uro_enhancer_${sid}`);
  const [savedScales, setSavedScales] = useState(() => { try { const d = localStorage.getItem(`uro_scales_${sid}`); return d ? JSON.parse(d) : []; } catch { return []; } });
  const handleScaleSave = (result) => {
    const next = [...savedScales, { ...result, savedAt: new Date().toISOString() }];
    setSavedScales(next);
    try { localStorage.setItem(`uro_scales_${sid}`, JSON.stringify(next)); } catch {}
  };
  const uroColors = { ...C, accent: C.amber, font: F };
  const autoCifUro = generateCIFUro({ evaMov: enhancer.pain.evaMov, sintomas: doencasUro, limitacoes: [] });
  const matchedCif = Object.entries(URO_EVIDENCE).find(([key]) =>
    (queixaUro||"").toLowerCase().includes(key.replace(/_/g," ")) ||
    (doencasUro||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
  );
  const cifSuggestionsUro = matchedCif ? matchedCif[1].cif || [] : [];

  useEffect(() => {
    if (student?.id || student?.nome) {
      const saved = loadUroData(sid);
      if (saved) {
        setQueixaUro(saved.queixaUro || "");
        setHdaUro(saved.hdaUro || "");
        setDiagnosticoCinesioUro(saved.diagnosticoCinesioUro || "");
        setGesta(saved.gesta || "");
        setPara(saved.para || "");
        setPartosNormais(saved.partosNormais || "");
        setPartosCesarios(saved.partosCesarios || "");
        setAbortos(saved.abortos || "");
        setMenopausa(saved.menopausa || "");
        setCirurgiasPelvicas(saved.cirurgiasPelvicas || []);
        setDoencasUro(saved.doencasUro || []);
        setMedicamentosUro(saved.medicamentosUro || "");
        setHistoricoFamiliarUro(saved.historicoFamiliarUro || "");
        setPerdaUrina(saved.perdaUrina || []);
        setFrequenciaUrinaria(saved.frequenciaUrinaria || []);
        setUrgenciaMiccional(saved.urgenciaMiccional || []);
        setNicturia(saved.nicturia || []);
        setSensacaoEsvaziamento(saved.sensacaoEsvaziamento || []);
        setDorMiccao(saved.dorMiccao || []);
        setConstipacao(saved.constipacao || []);
        setDispareunia(saved.dispareunia || []);
        setDiureseDia(saved.diureseDia || "");
        setDiureseNoite(saved.diureseNoite || "");
        setPerdasDia(saved.perdasDia || "");
        setPerdasNoite(saved.perdasNoite || "");
        setIngestaoHidrica(saved.ingestaoHidrica || "");
        setOxford(saved.oxford || "");
        setPerfect(saved.perfect || { power:"", endurance:"", repetitions:"", fast:"" });
        setPopQ(saved.popQ || { ba:"", bp:"", c:"", d:"", gh:"", pb:"", tvl:"" });
        setPerineometria(saved.perineometria || "");
        setIciqSF(saved.iciqSF || "");
        setPfdi20(saved.pfdi20 || "");
        setFsfi(saved.fsfi || "");
        setEvolucaoUro(saved.evolucaoUro || "");
        setLocalDor(saved.localDor || []);
        setPelvicFloorMap(saved.pelvicFloorMap || []);
        setBristolStool(saved.bristolStool ?? null);
        setErectionRigidity(saved.erectionRigidity ?? null);
        if (saved.pain) enhancer.setPain(saved.pain);
        if (saved.logs) enhancer.setLogs(saved.logs);
        if (saved.redFlags) enhancer.setRedFlags(saved.redFlags);
        if (saved.aiRes) enhancer.setAiRes(saved.aiRes);
      }
    }
  }, [student?.id, student?.nome]);

  const { entities } = useClinicalScan(queixaUro);
  const { detected } = useSemanticScanner(queixaUro, {});

  useEffect(() => {
    const regions = detectLocalDor(queixaUro);
    if (regions.length > 0) setLocalDor(prev => [...new Set([...prev, ...regions])]);
  }, [queixaUro]);

  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    const sid = student.id || student.nome;
    saveUroData(sid, {
      queixaUro, hdaUro, diagnosticoCinesioUro, gesta, para, partosNormais, partosCesarios, abortos, menopausa,
      cirurgiasPelvicas, doencasUro, medicamentosUro, historicoFamiliarUro,
      perdaUrina, frequenciaUrinaria, urgenciaMiccional, nicturia, sensacaoEsvaziamento,
      dorMiccao, constipacao, dispareunia,
      diureseDia, diureseNoite, perdasDia, perdasNoite, ingestaoHidrica,
      oxford, perfect, popQ, perineometria,
      iciqSF, pfdi20, fsfi,
      evolucaoUro, localDor,
      pelvicFloorMap, bristolStool, erectionRigidity,
      pain: enhancer.pain, logs: enhancer.logs, redFlags: enhancer.redFlags, aiRes: enhancer.aiRes,
      data: new Date().toISOString().slice(0,10),
    });
  };

  const oxfordResult = calcOxford(oxford);
  const perfectResult = calcPERFECT(perfect);

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione uma paciente para iniciar o atendimento</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Pacientes {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Nova Paciente"}
          </button>
        </div>
        <div style={{ marginTop:8 }}>
          <AssignFromOtherModules allPatients={allPatients} currentModuleId={currentModuleId} onUpdateStudentById={onUpdateStudentById} accentColor={C.amber} />
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.amber}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.amber, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              {editingStudent ? "✏️ Editar Paciente" : "➕ Nova Paciente"}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
              {[
                {k:"nome",l:"Nome completo",pl:"Nome da paciente"},
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
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.amber}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.amber, marginBottom:8 }}>Editar dados da paciente</div>
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
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", minHeight:60, gap:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <LogoSVG C={C} F={F}/>
          <button onClick={()=>setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Trocar paciente">👥 Pacientes</button>
          {onAgenda && <button onClick={onAgenda} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Agenda">📅 Agenda</button>}
          {onFinanceiro && <button onClick={onFinanceiro} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Financeiro">💰 Financeiro</button>}
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {[["avaliacao","🔬","Avaliação"],["evolucao","📈","Evolução"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{ background:tab === k ? C.amberBg : "transparent", border:`1px solid ${tab === k ? C.amber + "50" : "transparent"}`, borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:tab === k ? 700 : 400, color:tab === k ? C.amber : C.textMuted, cursor:"pointer", fontFamily:F }}>{ic} {lb}</button>
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
            <><div style={{ width:30, height:30, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.amber }}>{student.nome[0]?.toUpperCase()}</div>
              <span style={{ fontSize:12, color:C.textSub, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.nome}</span></>
          )}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"20px 16px" }}>
        {tab === "avaliacao" && (
          <>
            <Section title="Anamnese Uro-Ginecológica" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados da avaliação uro-ginecológica, história obstétrica, cirurgias e condições associadas.
              </div>
              <div style={{ background:C.redBg, border:`1.5px solid ${C.red}`, borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:C.red }}>Queixa principal</span>
                    <span style={{ fontSize:9, fontWeight:800, color:"#fff", background:C.red, borderRadius:6, padding:"2px 8px", letterSpacing:"0.05em", textTransform:"uppercase" }}>OBRIGATÓRIO</span>
                  </div>
                  <span style={{ fontSize:10, color:C.red, opacity:0.7 }}>— digite ou use o microfone</span>
                </div>
                <AudioField value={queixaUro} onChange={v=>setQueixaUro(typeof v==="function"?v(queixaUro):v)} placeholder="Ex: Incontinência urinária de esforço há 2 anos, 3 partos normais..." rows={2} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:"9px 12px",fontFamily:F,lineHeight:1.5}} />
              </div>
              {queixaUro && entities && (entities.muscles?.length>0||entities.laterality||entities.painChars?.length>0) && (
                <div style={{ background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"10px 14px", margin:"12px 0" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.blue, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>🔍 Varredura Semântica</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, fontSize:12 }}>
                    {entities.muscles?.length>0 && <span style={{color:C.textSub}}>Músculos: <strong style={{color:C.text}}>{entities.muscles.join(", ")}</strong></span>}
                    {entities.laterality && <span style={{color:C.textSub}}>Lateralidade: <strong style={{color:C.text}}>{entities.laterality}</strong></span>}
                    {entities.painChars?.length>0 && <span style={{color:C.textSub}}>Caráter: <strong style={{color:C.text}}>{entities.painChars.join(", ")}</strong></span>}
                  </div>
                </div>
              )}
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>História da Doença Atual (HDA)</span>
                <AudioField value={hdaUro} onChange={v=>setHdaUro(typeof v==="function"?v(hdaUro):v)}
                  placeholder="Início, mecanismo de lesão, evolução, tratamentos anteriores, exames realizados..." rows={3} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Diagnóstico Cinesioterapêutico (DCT)</span>
                <input type="text" value={diagnosticoCinesioUro} onChange={e=>setDiagnosticoCinesioUro(e.target.value)} style={inp()} placeholder="Ex: Disfunção do assoalho pélvico com incontinência urinária de esforço" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Gesta" value={gesta} onChange={setGesta} min={0} max={20} />
                <NumericField label="Para" value={para} onChange={setPara} min={0} max={20} />
                <NumericField label="Partos normais" value={partosNormais} onChange={setPartosNormais} min={0} max={20} />
                <NumericField label="Partos cesários" value={partosCesarios} onChange={setPartosCesarios} min={0} max={20} />
                <NumericField label="Abortos" value={abortos} onChange={setAbortos} min={0} max={20} />
                <NumericField label="Menopausa (anos)" value={menopausa} onChange={setMenopausa} min={0} max={60} unit="anos" />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Cirurgias pélvicas prévias</span>
                <TagSelect options={["Histerectomia","Ooforectomia","Colpoplastia anterior","Colpoplastia posterior","Cirurgia de Burch","Sling suburetral","Correção de prolapso","Cirurgia de incontinência","Perineoplastia","Laparoscopia pélvica"]}
                  value={cirurgiasPelvicas} onChange={setCirurgiasPelvicas} activeColor={C.amber} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Doenças / Condições associadas</span>
                <TagSelect options={["Diabetes","Hipertensão","Obesidade","Hipotireoidismo","Ansiedade/Depressão","Endometriose","SOP","Fibromialgia","Doença inflamatória pélvica","Constipação crônica","Tosse crônica"]}
                  value={doencasUro} onChange={setDoencasUro} activeColor={C.amber} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Medicações em uso</span>
                  <input type="text" value={medicamentosUro} onChange={e => setMedicamentosUro(e.target.value)} style={inp()} placeholder="Ex: Anticoncepcional, antidepressivo, anti-hipertensivo..." />
                </div>
                <div>
                  <span style={lbl()}>Histórico familiar</span>
                  <input type="text" value={historicoFamiliarUro} onChange={e => setHistoricoFamiliarUro(e.target.value)} style={inp()} placeholder="Incontinência, prolapso, câncer ginecológico..." />
                </div>
              </div>
            </Section>

            <GeneralAssessment storageKey="uro" studentId={sid} colors={{ ...C, accent: C.amber }} initialBodyPain={localDor} />

            <PelvicFloorMap value={pelvicFloorMap} onChange={setPelvicFloorMap} sexo={student?.sexo} colors={{ ...C, accent: C.amber, font: F }} />

            <CifSection cifSuggestions={cifSuggestionsUro} autoCif={autoCifUro} colors={{ ...C, green: C.green, blue: C.blue, blueBg: C.blueBg, purple: C.purple, purpleBg: C.purpleBg, surface: C.surface, card: C.card, textMuted: C.textMuted }} />

            <Section title="Sintomas Miccionais" icon="🚽">
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Perda de urina</span>
                <TagSelect options={["Aos esforços","Aos espirros/tosse","Ao levantar peso","Ao correr/pular","Sem perda","Em gotejamento","Em jato","Em grande quantidade"]}
                  value={perdaUrina} onChange={setPerdaUrina} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Frequência urinária</span>
                <TagSelect options={["Normal (5-8x/dia)","Aumentada (>8x/dia)","Diminuída (<5x/dia)","Polaciúria (muitas vezes)","Micção noturna 1x","Micção noturna 2x","Micção noturna 3x+"]}
                  value={frequenciaUrinaria} onChange={setFrequenciaUrinaria} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Urgência miccional</span>
                <TagSelect options={["Sem urgência","Urgência leve","Urgência moderada","Urgência intensa","Urgência com perda","Incontinência de urgência","Sensação de bexiga cheia repentina"]}
                  value={urgenciaMiccional} onChange={setUrgenciaMiccional} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Nictúria</span>
                <TagSelect options={["Não acorda p/ urinar","1x/noite","2x/noite","3x/noite","4x+ /noite","Acorda e não consegue voltar a dormir"]}
                  value={nicturia} onChange={setNicturia} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Sensação de esvaziamento</span>
                <TagSelect options={["Esvaziamento completo","Sensação de esvaziamento incompleto","Esforço para urinar","Jato fraco","Jato interrompido","Gotejamento pós-miccional"]}
                  value={sensacaoEsvaziamento} onChange={setSensacaoEsvaziamento} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Dor à micção</span>
                <TagSelect options={["Sem dor","Dor no início","Dor no final","Dor durante toda micção","Dor suprapúbica","Ardência","Cólica vesical"]}
                  value={dorMiccao} onChange={setDorMiccao} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Constipação intestinal</span>
                <TagSelect options={["Normal","Constipação leve","Constipação moderada","Constipação grave","Uso regular de laxantes","Fezes ressecadas","Esvaziamento incompleto","Esforço evacuatório"]}
                  value={constipacao} onChange={setConstipacao} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Dispareunia (dor durante relação sexual)</span>
                <TagSelect options={["Sem dor","Dor superficial","Dor profunda","Dor na penetração","Dor pós-relação","Impossibilidade de penetração","Dor há mais de 6 meses"]}
                  value={dispareunia} onChange={setDispareunia} activeColor={C.amber} />
              </div>
            </Section>

            <BristolStoolScale value={bristolStool} onChange={setBristolStool} colors={{ ...C, accent: C.amber, font: F }} />
            {student?.sexo === "Masculino" && (
              <ErectionRigidityScale value={erectionRigidity} onChange={setErectionRigidity} colors={{ ...C, accent: C.amber, font: F }} />
            )}

            <Section title="Diário Miccional" icon="📝">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Preencha os dados do diário miccional das últimas 24-72h.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Diurese dia (ml)" value={diureseDia} onChange={setDiureseDia} min={0} max={5000} unit="ml" />
                <NumericField label="Diurese noite (ml)" value={diureseNoite} onChange={setDiureseNoite} min={0} max={5000} unit="ml" />
                <NumericField label="Perdas dia (n)" value={perdasDia} onChange={setPerdasDia} min={0} max={50} />
                <NumericField label="Perdas noite (n)" value={perdasNoite} onChange={setPerdasNoite} min={0} max={50} />
                <NumericField label="Ingestão hídrica (ml)" value={ingestaoHidrica} onChange={setIngestaoHidrica} min={0} max={8000} unit="ml" />
              </div>
            </Section>

            <Section title="Avaliação do Assoalho Pélvico" icon="🔍">
              <CollapsibleSub title="Escala de Oxford">
                <div style={{ marginBottom:10 }}>
                  <span style={lbl()}>Contração voluntária do MAP</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 — Sem contração" },
                    { value:"1", label:"1 — Esboço de contração" },
                    { value:"2", label:"2 — Contração fraca" },
                    { value:"3", label:"3 — Contração moderada" },
                    { value:"4", label:"4 — Contração boa" },
                    { value:"5", label:"5 — Contração forte" },
                  ]} value={oxford} onChange={setOxford} activeColor={C.amber} />
                </div>
                {oxford && (
                  <div style={{ background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Oxford</div>
                    <div style={{ fontSize:28, fontWeight:900, color:oxfordResult.color }}>{oxfordResult.grade} — {oxfordResult.level}</div>
                  </div>
                )}
              </CollapsibleSub>
              <CollapsibleSub title="Esquema PERFECT">
                <div style={{ fontSize:11, color:C.textMuted, marginBottom:8, lineHeight:1.4 }}>
                  P (Power/Força 0-5) · E (Endurance/Resistência em segundos) · R (Repetitions/Repetições 0-10+) · F (Fast/Contrações rápidas por 10s)
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"10px" }}>
                  <NumericField label="Power (0-5)" value={perfect.power} onChange={v => setPerfect(p=>({...p, power:v}))} min={0} max={5} step={1} />
                  <NumericField label="Endurance (seg)" value={perfect.endurance} onChange={v => setPerfect(p=>({...p, endurance:v}))} min={0} max={120} step={1} />
                  <NumericField label="Repetições" value={perfect.repetitions} onChange={v => setPerfect(p=>({...p, repetitions:v}))} min={0} max={50} step={1} />
                  <NumericField label="Rápidas (10s)" value={perfect.fast} onChange={v => setPerfect(p=>({...p, fast:v}))} min={0} max={50} step={1} />
                </div>
                {(perfect.power || perfect.endurance || perfect.repetitions || perfect.fast) && (
                  <div style={{ marginTop:10, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>PERFECT Score</div>
                    <div style={{ fontSize:28, fontWeight:900, color:perfectResult.color }}>{perfectResult.total}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:perfectResult.color }}>{perfectResult.level}</div>
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>P{perfect.power||0} · E{perfect.endurance||0} · R{perfect.repetitions||0} · F{perfect.fast||0}</div>
                  </div>
                )}
              </CollapsibleSub>
              <CollapsibleSub title="Perineometria">
                <NumericField label="Pressão perineal" value={perineometria} onChange={setPerineometria} min={0} max={200} unit="cmH₂O" />
              </CollapsibleSub>
            </Section>

            <Section title="POP-Q (Prolapso de Órgão Pélvico)" icon="📏">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Medidas do POP-Q em cm. Valores negativos = acima do hímen, positivos = abaixo.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr 1fr", gap:"10px" }}>
                <NumericField label="Ba" value={popQ.ba} onChange={v => setPopQ(p=>({...p, ba:v}))} min={-10} max={15} step={0.5} unit="cm" />
                <NumericField label="Bp" value={popQ.bp} onChange={v => setPopQ(p=>({...p, bp:v}))} min={-10} max={15} step={0.5} unit="cm" />
                <NumericField label="C" value={popQ.c} onChange={v => setPopQ(p=>({...p, c:v}))} min={-15} max={15} step={0.5} unit="cm" />
                <NumericField label="D" value={popQ.d} onChange={v => setPopQ(p=>({...p, d:v}))} min={-15} max={15} step={0.5} unit="cm" />
                <NumericField label="Gh" value={popQ.gh} onChange={v => setPopQ(p=>({...p, gh:v}))} min={0} max={15} step={0.5} unit="cm" />
                <NumericField label="Pb" value={popQ.pb} onChange={v => setPopQ(p=>({...p, pb:v}))} min={0} max={15} step={0.5} unit="cm" />
                <NumericField label="TVL" value={popQ.tvl} onChange={v => setPopQ(p=>({...p, tvl:v}))} min={0} max={25} step={0.5} unit="cm" />
              </div>
            </Section>

            <Section title="Questionários Validados" icon="📊">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>ICIQ-SF (0-21)</span>
                  <input type="number" value={iciqSF} onChange={e => setIciqSF(e.target.value)} min={0} max={21}
                    style={{ ...inp({ textAlign:"center", fontSize:16, fontWeight:700 })}}
                    placeholder="0-21" />
                  {iciqSF && (
                    <div style={{ marginTop:6, fontSize:11, color:C.textMuted, textAlign:"center" }}>
                      {Number(iciqSF) <= 5 ? <span style={{color:C.green}}>Impacto leve</span> :
                       Number(iciqSF) <= 10 ? <span style={{color:C.amber}}>Impacto moderado</span> :
                       Number(iciqSF) <= 15 ? <span style={{color:C.red}}>Impacto severo</span> :
                       <span style={{color:C.red}}>Impacto muito severo</span>}
                    </div>
                  )}
                </div>
                <div>
                  <span style={lbl()}>PFDI-20 (0-100)</span>
                  <input type="number" value={pfdi20} onChange={e => setPfdi20(e.target.value)} min={0} max={100}
                    style={{ ...inp({ textAlign:"center", fontSize:16, fontWeight:700 })}}
                    placeholder="0-100" />
                  {pfdi20 && (
                    <div style={{ marginTop:6, fontSize:11, color:C.textMuted, textAlign:"center" }}>
                      {Number(pfdi20) <= 30 ? <span style={{color:C.green}}>Sintomas leves</span> :
                       Number(pfdi20) <= 60 ? <span style={{color:C.amber}}>Sintomas moderados</span> :
                       <span style={{color:C.red}}>Sintomas severos</span>}
                    </div>
                  )}
                </div>
                <div>
                  <span style={lbl()}>FSFI (0-36)</span>
                  <input type="number" value={fsfi} onChange={e => setFsfi(e.target.value)} min={0} max={36}
                    style={{ ...inp({ textAlign:"center", fontSize:16, fontWeight:700 })}}
                    placeholder="0-36" />
                  {fsfi && (
                    <div style={{ marginTop:6, fontSize:11, color:C.textMuted, textAlign:"center" }}>
                      {Number(fsfi) >= 26.55 ? <span style={{color:C.green}}>Função normal</span> :
                       Number(fsfi) >= 20 ? <span style={{color:C.amber}}>Disfunção leve</span> :
                       Number(fsfi) >= 10 ? <span style={{color:C.red}}>Disfunção moderada</span> :
                       <span style={{color:C.red}}>Disfunção severa</span>}
                    </div>
                  )}
                </div>
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
            </div>
            {/* 📊 Escalas Padronizadas */}
            <CollapsibleSection title="Escalas Padronizadas" icon="📊" expanded={expandedSections.includes("escalas")} onToggle={()=>toggleSection("escalas")}>
              <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.5}}>Selecione uma escala validada para aplicar ao paciente. Os resultados ficam salvos neste módulo.</div>
              <ScaleSelector scaleNames={["Oxford Grading System (Assoalho Pélvico)","ICIQ-SF (International Consultation on Incontinence)","ICIQ-OAB (Overactive Bladder)","PFIQ-7 (Pelvic Floor Impact Questionnaire)"]} onSave={handleScaleSave} savedResults={savedScales} />
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

            <CollapsibleSection title="Dados Administrativos e Financeiros" icon="💰" expanded={expandedSections.includes("admin")} onToggle={()=>toggleSection("admin")}>
              <CollapsibleSub title="Honorários e CIFs">
                <HonorariosCard convenio={student?.convenio} regiao={regiao} sessoesAuth={student?.sessoesAuth} />
              </CollapsibleSub>
              <CollapsibleSub title="Sessões Autorizadas">
                <SessionCounter value={student?.sessoesAuth || ""} onChange={v => onUpdateStudent?.("sessoesAuth", v)} />
              </CollapsibleSub>
            </CollapsibleSection>
          </>
        )}

        {tab === "evolucao" && (
          <>
            <Section title="Evolução e Reavaliação" icon="📈">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Registre a evolução da paciente, resposta às intervenções e planejamento das próximas sessões.
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucaoUro} onChange={e => setEvolucaoUro(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução desde a última sessão, resposta às intervenções, adesão ao programa domiciliar..." />
            </div>
            {(oxford || perfect.power || iciqSF) && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Última avaliação</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>
                  <strong>Oxford:</strong> {oxfordResult.level} · <strong>PERFECT:</strong> {perfectResult.total} ({perfectResult.level}) · <strong>ICIQ-SF:</strong> {iciqSF || "—"}/21 · <strong>PFDI-20:</strong> {pfdi20 || "—"}/100 · <strong>FSFI:</strong> {fsfi || "—"}/36
                </div>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Evolução</button>
            </div>
          </Section>
            {enhancer.redFlags.length > 0 && (
              <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags} flags={["Sangramento vaginal anormal pós-menopausa","Dor pélvica aguda intensa","Retenção urinária aguda","Prolapso de órgão pélvico irredutível","Massa pélvica palpável","Fístula urinária/fecal","Sinais de infecção urinária grave (febre, calafrios, dor lombar)"]} colors={uroColors} />
            )}
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={uroColors} sessionLabel="Evolução" specialty="uroginecologia" defaultExpanded={true} pain={enhancer.pain} setPain={enhancer.setPain} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nQueixa: ${queixaUro}\nG/P: ${gesta}/${para}\nCirurgias: ${cirurgiasPelvicas.join(", ")}\nPerda urina: ${perdaUrina.join(", ")}\nUrgência: ${urgenciaMiccional.join(", ")}\nOxford: ${oxfordResult.grade}\nPERFECT: ${perfectResult.total}\nICIQ-SF: ${iciqSF || "—"}/21\nPFDI-20: ${pfdi20 || "—"}/100\nFSFI: ${fsfi || "—"}/36\nEVA Dor: ${enhancer.pain.evaRep}/10\nEvolução: ${evolucaoUro}`}
              colors={uroColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="Uro-Ginecológica" colors={uroColors} />
        )}

        {tab === "evidencias" && (() => {
          const matched = Object.entries(URO_EVIDENCE).find(([key]) =>
            (queixaUro||"").toLowerCase().includes(key.replace(/_/g," ")) ||
            (doencasUro||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
          );
          const cifCodes = matched ? matched[1].cif || [] : [];
          return (
            <>
              <CifAndHonorarios cifCodes={cifCodes} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.amber} />
              <Section title="Diretrizes e Evidências em Uro-Ginecologia" icon="🔬">
            {Object.entries(URO_EVIDENCE).map(([key, condition]) => {
              const active = queixaUro.toLowerCase().includes(key.replace(/_/g," ")) || doencasUro.some(c => c.toLowerCase().includes(key.replace(/_/g," ")));
              return (
                <div key={key} style={{
                  ...card(),
                  border: active ? `1px solid ${C.amber}50` : `1px solid ${C.border}`,
                  opacity: active ? 1 : 0.6,
                  cursor:"pointer"
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
            </>
          );
        })()}
      </div>
    </div>
  );
}
