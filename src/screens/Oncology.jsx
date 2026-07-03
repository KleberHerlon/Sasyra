import { useState, useEffect } from "react";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import CifAndHonorarios from "../components/CifAndHonorarios";
import { CollapsibleSection, CollapsibleSub } from "../components";
import ScaleSelector from "../components/ScaleSelector";
import AssignFromOtherModules from "../components/AssignFromOtherModules";

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

function saveOncoData(studentId, data) {
  try { localStorage.setItem(`onco_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadOncoData(studentId) {
  try { const d = localStorage.getItem(`onco_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

function calcECOG(value) {
  const labels = [
    "0 — Atividade normal, sem restrições",
    "1 — Restrito para atividade física intensa, deambula",
    "2 — Deambula, capaz de autocuidado, incapaz para trabalhar",
    "3 — Autocuidado limitado, confinado ao leito >50% do dia",
    "4 — Incapacidade completa, confinado ao leito",
    "5 — Óbito",
  ];
  const colors = [C.green, C.green, C.amber, C.amber, C.red, C.red];
  return { value: Number(value), label: labels[value] || "", color: colors[value] || C.textMuted };
}

function calcKPS(value) {
  const v = Number(value);
  let label, color;
  if (v >= 80) { label = "Atividade normal, sem queixas"; color = C.green; }
  else if (v >= 60) { label = "Autocuidado, incapaz para trabalho"; color = C.amber; }
  else if (v >= 40) { label = "Incapaz para atividade, necessita cuidados"; color = C.red; }
  else if (v >= 10) { label = "Confinado ao leito, doença progressiva"; color = C.red; }
  else { label = "Óbito"; color = C.textDim; }
  return { value: v, label, color };
}

function calcEORTC(scores) {
  const functionalItems = ["physical","role","emotional","cognitive","social"];
  const symptomItems = ["fatigue","nauseaVomiting","pain","dyspnea","insomnia","appetiteLoss","constipation","diarrhea"];
  const functional = {};
  let fSum = 0, fCount = 0;
  functionalItems.forEach(k => {
    const raw = Number(scores[k]) || 0;
    const transformed = raw === 0 ? 100 : 100 - (raw - 1) * 100 / 3;
    functional[k] = { raw, transformed: Math.round(transformed) };
    if (scores[k] !== undefined && scores[k] !== "") { fSum += Math.round(transformed); fCount++; }
  });
  const symptom = {};
  let sSum = 0, sCount = 0;
  symptomItems.forEach(k => {
    const raw = Number(scores[k]) || 0;
    const transformed = raw === 0 ? 0 : (raw - 1) * 100 / 3;
    symptom[k] = { raw, transformed: Math.round(transformed) };
    if (scores[k] !== undefined && scores[k] !== "") { sSum += Math.round(transformed); sCount++; }
  });
  const globalRaw = Number(scores.global) || 0;
  const global = globalRaw === 0 ? 0 : Math.round((globalRaw - 1) * 100 / 6);
  const functionalAvg = fCount > 0 ? Math.round(fSum / fCount) : 0;
  const symptomAvg = sCount > 0 ? Math.round(sSum / sCount) : 0;
  return { functional, functionalAvg, symptom, symptomAvg, global };
}

function calcESAS(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total <= 10 ? "Sintomas leves" : total <= 30 ? "Sintomas moderados" : "Sintomas graves";
  const color = total <= 10 ? C.green : total <= 30 ? C.amber : C.red;
  return { total, level, color };
}

const ONCO_EVIDENCE = {
  cancer_mama: {
    cif:["s730","b130","b152","d510","d540","d850"],
    label:"Câncer de Mama",
    goldStandard:"Cinesioterapia precoce preserva ADM e previne linfedema. DLM + exercícios ativos reduzem volume do linfedema (Evidência A). Fortalecimento progressivo de MMSS seguro após 6 semanas. Mobilização precoce reduz tempo de dreno. Evitar excêntricos intensos nos primeiros 3 meses. Aeróbio moderado melhora fadiga e QV (ASCO 2023).",
    escalas:["EORTC QLQ-C30","FACT-F","DASH","ECOG","KPS","Perimetria de membros"],
    referencias:[{ id:"ASCO 2023", title:"Exercise and rehabilitation for breast cancer survivors", url:"https://ascopubs.org/" }],
  },
  cancer_prostata: {
    cif:["b620","b640","b130","d530","d770","d850"],
    label:"Câncer de Próstata",
    goldStandard:"Treino de assoalho pélvico pré e pós-prostatectomia reduz incontinência (Evidência A — IUGA 2022). Aeróbio + resistido preserva densidade óssea em hormonioterapia. Treino de equilíbrio reduz risco de queda em ADT. Fortalecimento MMII/core melhora funcionalidade. Exercício regular reduz fadiga (Cochrane 2021).",
    escalas:["EORTC QLQ-C30","FACT-F","IPSS","ECOG","KPS"],
    referencias:[{ id:"IUGA 2022", title:"Pelvic floor training for prostate cancer", url:"https://www.yourjournal.com/" }],
  },
  linfedema: {
    cif:["s730","s740","b810","d445","d510","d540"],
    label:"Linfedema Pós-Tratamento",
    goldStandard:"TDC: DLM + enfaixamento multicamadas + exercícios + cuidados com a pele (Evidência A — ISL 2020). Enfaixamento noturno reduz volume. Exercícios com enfaixamento potencializa drenagem. Laser de baixa potência reduz fibrose. Contraindicado: calor local, ventosas, agulhamento seco na área afetada. Bioimpedância e perimetria seriada monitoram progressão.",
    escalas:["Perimetria segmentar","Bioimpedância (L-Dex)","EORTC QLQ-C30","DASH"],
    referencias:[{ id:"ISL 2020", title:"International Society of Lymphology consensus", url:"https://journals.lww.com/" }],
  },
  fadiga_oncologica: {
    cif:["b130","b152","b455","d570","d850","d920"],
    label:"Fadiga Oncológica",
    goldStandard:"Aeróbio moderado (30 min, 5x/sem) reduz fadiga (Evidência A — NCCN 2023). Resistido progressivo 2x/sem melhora força. Técnicas de conservação de energia. Yoga/mindfulness melhoram sono. Evitar repouso >24h. Avaliar causas reversíveis: anemia, dor, depressão.",
    escalas:["FACT-F (0-52)","Escala Numérica de Fadiga (0-10)","EORTC QLQ-C30","Piper Fatigue Scale"],
    referencias:[{ id:"NCCN 2023", title:"Cancer-related fatigue guidelines", url:"https://www.nccn.org/" }],
  },
  dor_oncologica: {
    cif:["b280","b152","d240","d570","d850"],
    label:"Dor Oncológica",
    goldStandard:"Analgesia escalonada OMS + terapias não farmacológicas. Exercício reduz dor musculoesquelética. TENS contraindicado em tumor ativo ou metástase óssea. Massagem em áreas não tumorais reduz ansiedade/dor. Acupuntura para dor neuropática induzida por QT. Crioterapia para neuropatia. Avaliar compressão medular ou fratura patológica.",
    escalas:["EVA (0-10)","DN4 (dor neuropática)","EORTC QLQ-C30","Brief Pain Inventory"],
    referencias:[{ id:"OMS 2021", title:"WHO analgesic ladder for cancer pain", url:"https://www.who.int/" }],
  },
  cuidados_paliativos: {
    cif:["b130","b152","b280","d240","d570","e410"],
    label:"Cuidados Paliativos",
    goldStandard:"Abordagem centrada no conforto. Posicionamento a cada 2h previne úlceras. Cinesioterapia passiva mantém ADM. Relaxamento e massagem suave para conforto. Controle de dispneia com posicionamento. Suporte emocional e comunicação terapêutica. Orientação aos cuidadores. Evitar procedimentos invasivos sem benefício claro.",
    escalas:["ESAS (Edmonton Symptom Assessment)","PALLIA-10","ECOG","KPS"],
    referencias:[{ id:"WHO 2022", title:"Palliative care guidelines", url:"https://www.who.int/" }],
  },
  caquexia: {
    cif:["b530","b130","b455","d550","d560","d570"],
    label:"Caquexia Tumoral",
    goldStandard:"Resistido progressivo preserva massa/função (Evidência B — ESPEN 2021). Aeróbio leve melhora apetite. Suplementação proteica + leucina potencializa ganho. Evitar extenuante — priorizar tolerância. EENM em acamados preserva massa. Avaliação nutricional obrigatória: MNA/MUST. Abordagem multi-disciplinar.",
    escalas:["FACT-F","MUST","ECOG","KPS","Força muscular (MRC)","Bioimpedância"],
    referencias:[{ id:"ESPEN 2021", title:"Cancer cachexia guidelines", url:"https://www.espen.org/" }],
  },
};

export default function Oncology({ student, students, allPatients, currentModuleId, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");
  const [regiao, setRegiao] = useState("Centro-Oeste");

  const [queixaOnco, setQueixaOnco] = useState("");
  const [diagnosticoOnco, setDiagnosticoOnco] = useState("");
  const [tipoCancer, setTipoCancer] = useState("");
  const [estadiamento, setEstadiamento] = useState("");
  const [dataDiagnostico, setDataDiagnostico] = useState("");
  const [tratamentosRealizados, setTratamentosRealizados] = useState([]);
  const [dataCirurgia, setDataCirurgia] = useState("");
  const [quimioterapiaCiclos, setQuimioterapiaCiclos] = useState("");
  const [radioterapiaSessoes, setRadioterapiaSessoes] = useState("");

  const [perimetriaMembros, setPerimetriaMembros] = useState({ bracoD1:"", bracoD2:"", bracoD3:"", bracoD4:"", bracoD5:"", bracoD6:"", bracoE1:"", bracoE2:"", bracoE3:"", bracoE4:"", bracoE5:"", bracoE6:"" });
  const [bioimpedancia, setBioimpedancia] = useState("");
  const [sensacaoPeso, setSensacaoPeso] = useState("");
  const [sinalGodet, setSinalGodet] = useState("");
  const [classificacaoLinfedema, setClassificacaoLinfedema] = useState("");

  const [factFScore, setFactFScore] = useState("");
  const [escalaFadigaNumeric, setEscalaFadigaNumeric] = useState("");
  const [impactoFadiga, setImpactoFadiga] = useState([]);

  const [ecog, setEcog] = useState("");
  const [kps, setKps] = useState("");

  const [dorEVA, setDorEVA] = useState("");
  const [tipoDor, setTipoDor] = useState([]);
  const [escalaDorNeuropatica, setEscalaDorNeuropatica] = useState("");
  const [adms, setAdms] = useState({ ombroFlexaoD:"", ombroFlexaoE:"", ombroAducaoD:"", ombroAducaoE:"", cotoveloFlexaoD:"", cotoveloFlexaoE:"", cotoveloExtensaoD:"", cotoveloExtensaoE:"" });
  const [forcaMuscular, setForcaMuscular] = useState({ deltoideD:"", deltoideE:"", bicepsD:"", bicepsE:"", tricepsD:"", tricepsE:"", quadricepsD:"", quadricepsE:"" });

  const [eortc, setEortc] = useState({ physical:"", role:"", emotional:"", cognitive:"", social:"", fatigue:"", nauseaVomiting:"", pain:"", dyspnea:"", insomnia:"", appetiteLoss:"", constipation:"", diarrhea:"", global:"" });
  const [eortcResult, setEortcResult] = useState(null);

  const [esas, setEsas] = useState({ dor:"", fadiga:"", nausea:"", depressao:"", ansiedade:"", sonolencia:"", apetite:"", bemEstar:"", faltaAr:"" });
  const [esasResult, setEsasResult] = useState(null);
  const [pallia10, setPallia10] = useState("");

  const [evolucaoOnco, setEvolucaoOnco] = useState("");

  const [expandedSections, setExpandedSections] = useState([]);
  const toggleSection = (id) => { setExpandedSections(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]); };
  const sid = student?.id || student?.nome;
  const enhancer = useEnhancer("oncologia", sid, `onco_enhancer_${sid}`);
  const [savedScales, setSavedScales] = useState(() => { try { const d = localStorage.getItem(`onco_scales_${sid}`); return d ? JSON.parse(d) : []; } catch { return []; } });
  const handleScaleSave = (result) => {
    const next = [...savedScales, { ...result, savedAt: new Date().toISOString() }];
    setSavedScales(next);
    try { localStorage.setItem(`onco_scales_${sid}`, JSON.stringify(next)); } catch {}
  };
  const oncoColors = { ...C, accent: C.amber, font: F };

  useEffect(() => {
    if (student?.id || student?.nome) {
      const saved = loadOncoData(sid);
      if (saved) {
        setQueixaOnco(saved.queixaOnco||""); setDiagnosticoOnco(saved.diagnosticoOnco||""); setTipoCancer(saved.tipoCancer||""); setEstadiamento(saved.estadiamento||"");
        setDataDiagnostico(saved.dataDiagnostico||""); setTratamentosRealizados(saved.tratamentosRealizados||[]); setDataCirurgia(saved.dataCirurgia||"");
        setQuimioterapiaCiclos(saved.quimioterapiaCiclos||""); setRadioterapiaSessoes(saved.radioterapiaSessoes||"");
        setPerimetriaMembros(saved.perimetriaMembros||{});
        setBioimpedancia(saved.bioimpedancia||""); setSensacaoPeso(saved.sensacaoPeso||""); setSinalGodet(saved.sinalGodet||""); setClassificacaoLinfedema(saved.classificacaoLinfedema||"");
        setFactFScore(saved.factFScore||""); setEscalaFadigaNumeric(saved.escalaFadigaNumeric||""); setImpactoFadiga(saved.impactoFadiga||[]);
        setEcog(saved.ecog||""); setKps(saved.kps||"");
        setDorEVA(saved.dorEVA||""); setTipoDor(saved.tipoDor||[]); setEscalaDorNeuropatica(saved.escalaDorNeuropatica||"");
        setAdms(saved.adms||{}); setForcaMuscular(saved.forcaMuscular||{});
        setEortc(saved.eortc||{}); setEortcResult(saved.eortcResult||null);
        setEsas(saved.esas||{}); setEsasResult(saved.esasResult||null); setPallia10(saved.pallia10||"");
        setEvolucaoOnco(saved.evolucaoOnco||"");
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
    saveOncoData(sid, {
      queixaOnco,diagnosticoOnco,tipoCancer,estadiamento,dataDiagnostico,tratamentosRealizados,
      dataCirurgia,quimioterapiaCiclos,radioterapiaSessoes,
      perimetriaMembros,bioimpedancia,sensacaoPeso,sinalGodet,classificacaoLinfedema,
      factFScore,escalaFadigaNumeric,impactoFadiga,ecog,kps,
      dorEVA,tipoDor,escalaDorNeuropatica,adms,forcaMuscular,
      eortc,eortcResult,esas,esasResult,pallia10,evolucaoOnco,
      pain:enhancer.pain,logs:enhancer.logs,redFlags:enhancer.redFlags,aiRes:enhancer.aiRes,
      data:new Date().toISOString().slice(0,10),
    });
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"0.05em" }}>🎗️ Fisioterapia Oncológica</span>
          <button onClick={() => { localStorage.removeItem("sasyra_module"); window.location.reload(); }} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um paciente para iniciar o atendimento</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Pacientes {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Novo Paciente"}
          </button>
        </div>
        <div style={{ marginTop:8 }}>
          <AssignFromOtherModules allPatients={allPatients} currentModuleId={currentModuleId} onUpdateStudentById={onUpdateStudentById} accentColor={C.amber} />
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.amber}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.amber, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
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
              <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => setDeleteStep(2)} style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
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
              Todos os dados de <strong>{deleteTarget.nome}</strong> serão perdidos permanentemente. <strong style={{color:C.red}}>Não pode ser desfeita</strong>.
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => { onDeleteStudent(deleteTarget); setDeleteTarget(null); setDeleteStep(1); }} style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => setEditTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.amber}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.amber, marginBottom:8 }}>Editar dados do paciente</div>
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
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })}>← Pacientes</button>
          <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>🎗️ Oncológica</span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Anamnese"],["avaliacao","🔬","Avaliação"],["evolucao","📈","Evolução"],["sessoes","📅","Sessões"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{background:tab===k?C.amberBg:"transparent",border:`1px solid ${tab===k?C.amber+"50":"transparent"}`,borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:tab===k?700:400,color:tab===k?C.amber:C.textMuted,cursor:"pointer",fontFamily:F}}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {student?.nome && (
            <>
              <div style={{ width:30, height:30, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.amber }}>
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
            <Section title="Anamnese Oncológica" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados da avaliação oncológica, tipo de câncer, estadiamento e tratamentos realizados.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div><span style={lbl()}>Queixa principal</span><input type="text" value={queixaOnco} onChange={e=>setQueixaOnco(e.target.value)} style={inp()} placeholder="Dor pós-cirurgia, fraqueza..." /></div>
                <div><span style={lbl()}>Diagnóstico oncológico</span><input type="text" value={diagnosticoOnco} onChange={e=>setDiagnosticoOnco(e.target.value)} style={inp()} placeholder="Carcinoma ductal invasivo..." /></div>
                <div><span style={lbl()}>Tipo de câncer</span><input type="text" value={tipoCancer} onChange={e=>setTipoCancer(e.target.value)} style={inp()} placeholder="Mama, Próstata, Pulmão..." /></div>
                <div><span style={lbl()}>Estadiamento (TNM/Grupo)</span><input type="text" value={estadiamento} onChange={e=>setEstadiamento(e.target.value)} style={inp()} placeholder="T2N1M0, Estádio IIB" /></div>
                <div><span style={lbl()}>Data do diagnóstico</span><input type="date" value={dataDiagnostico} onChange={e=>setDataDiagnostico(e.target.value)} style={inp()} /></div>
                <div><span style={lbl()}>Data da cirurgia</span><input type="date" value={dataCirurgia} onChange={e=>setDataCirurgia(e.target.value)} style={inp()} /></div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Tratamentos realizados</span>
                <TagSelect options={["cirurgia","QT","RT","hormonioterapia","imunoterapia"]} value={tratamentosRealizados} onChange={setTratamentosRealizados} activeColor={C.amber} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div><span style={lbl()}>QT — Ciclos</span><input type="text" value={quimioterapiaCiclos} onChange={e=>setQuimioterapiaCiclos(e.target.value)} style={inp()} placeholder="6 ciclos, em andamento" /></div>
                <div><span style={lbl()}>RT — Sessões</span><input type="text" value={radioterapiaSessoes} onChange={e=>setRadioterapiaSessoes(e.target.value)} style={inp()} placeholder="25 sessões" /></div>
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Anamnese</button>
            </div>
          </>
        )}

        {tab === "avaliacao" && (
          <>
            <Section title="Performance Status" icon="🏃">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>ECOG (0-5)</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Atividade normal" },
                    { value:"1", label:"1 - Restrição para esforço intenso" },
                    { value:"2", label:"2 - Autocuidado, incapaz trabalho" },
                    { value:"3", label:"3 - Autocuidado limitado" },
                    { value:"4", label:"4 - Incapacidade completa" },
                    { value:"5", label:"5 - Óbito" },
                  ]} value={ecog} onChange={setEcog} activeColor={C.amber} />
                  {ecog !== "" && (
                    <div style={{ marginTop:8, padding:"8px 12px", background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:8, fontSize:11, color:C.amber }}>
                      {calcECOG(ecog).label}
                    </div>
                  )}
                </div>
                <div>
                  <span style={lbl()}>KPS — Karnofsky (0-100)</span>
                  <input type="number" value={kps} onChange={e => setKps(e.target.value)} min={0} max={100} step={10} style={inp()} placeholder="Ex: 70" />
                  {kps !== "" && (
                    <div style={{ marginTop:8, padding:"8px 12px", background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:8, fontSize:11, color:calcKPS(kps).color }}>
                      {calcKPS(kps).value} — {calcKPS(kps).label}
                    </div>
                  )}
                </div>
              </div>
            </Section>

            <Section title="Avaliação de Linfedema" icon="💧">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Perimetria de membros superiores (cm). Medidas seriadas para monitoramento de linfedema.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 16px", marginBottom:12 }}>
                {["bracoD1","bracoD2","bracoD3","bracoD4","bracoD5","bracoD6","bracoE1","bracoE2","bracoE3","bracoE4","bracoE5","bracoE6"].map(k => (
                  <NumericField key={k} label={`${k.includes("D")?"Braço D":"Braço E"} — Nível ${k.slice(-1)} (cm)`} value={perimetriaMembros[k]} onChange={v => setPerimetriaMembros(p => ({...p,[k]:v}))} min={0} max={80} step={0.1} unit="cm" />
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>Sensação de peso no membro</span>
                  <SingleSelect options={["Ausente","Leve","Moderado","Intenso"]} value={sensacaoPeso} onChange={setSensacaoPeso} activeColor={C.amber} />
                </div>
                <div>
                  <span style={lbl()}>Sinal de Godet (cacifo)</span>
                  <SingleSelect options={["Ausente","+ (leve)","++ (moderado)","+++ (intenso)"]} value={sinalGodet} onChange={setSinalGodet} activeColor={C.amber} />
                </div>
                <div>
                  <span style={lbl()}>Classificação do linfedema</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Subclínico" },
                    { value:"1", label:"1 - Reversível" },
                    { value:"2", label:"2 - Espontaneamente irreversível" },
                    { value:"3", label:"3 - Elefantíase" },
                  ]} value={classificacaoLinfedema} onChange={setClassificacaoLinfedema} activeColor={C.amber} />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Bioimpedância (L-Dex / % água)</span>
                <input type="text" value={bioimpedancia} onChange={e => setBioimpedancia(e.target.value)} style={inp()} placeholder="Ex: L-Dex +7.2, Água: 42%" />
              </div>
            </Section>

            <Section title="Avaliação de Fadiga Oncológica" icon="😴">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:12 }}>
                <NumericField label="FACT-F (0-52)" value={factFScore} onChange={setFactFScore} min={0} max={52} step={1} unit="pts" />
                <NumericField label="Escala Numérica de Fadiga (0-10)" value={escalaFadigaNumeric} onChange={setEscalaFadigaNumeric} min={0} max={10} step={1} unit="/10" />
              </div>
              {factFScore !== "" && (
                <div style={{ background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"10px 14px", marginBottom:12, textAlign:"center" }}>
                  <span style={{ fontSize:11, color:C.textMuted }}>FACT-F: </span>
                  <span style={{ fontSize:20, fontWeight:900, color:C.amber }}>{factFScore}</span>
                  <span style={{ fontSize:11, color:C.textMuted }}>/52 — </span>
                  <span style={{ fontSize:12, fontWeight:700, color:Number(factFScore) >= 34 ? C.green : C.red }}>
                    {Number(factFScore) >= 34 ? "Fadiga leve/ausente" : "Fadiga significativa"}
                  </span>
                </div>
              )}
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Impacto funcional da fadiga</span>
                <TagSelect options={["Trabalho","AVDs","Vida social","Sono","Concentração","Humor","Atividade física","Relações familiares"]}
                  value={impactoFadiga} onChange={setImpactoFadiga} activeColor={C.amber} />
              </div>
            </Section>

            <Section title="Avaliação de Dor Oncológica" icon="💊">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:12 }}>
                <NumericField label="EVA — Dor (0-10)" value={dorEVA} onChange={setDorEVA} min={0} max={10} step={1} unit="/10" />
                <NumericField label="Escala de Dor Neuropática (DN4)" value={escalaDorNeuropatica} onChange={setEscalaDorNeuropatica} min={0} max={10} step={1} unit="pts" />
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Tipo de dor</span>
                <TagSelect options={["nociceptiva","neuropática","mista","irruptiva"]}
                  value={tipoDor} onChange={setTipoDor} activeColor={C.amber} />
              </div>

              <span style={{ ...lbl({ marginTop:12 }) }}>ADM — Articulações afetadas (graus)</span>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 16px", marginTop:6, marginBottom:12 }}>
                {[
                  {k:"ombroFlexaoD",l:"Ombro flexão D°"},{k:"ombroFlexaoE",l:"Ombro flexão E°"},{k:"ombroAducaoD",l:"Ombro abdução D°"},{k:"ombroAducaoE",l:"Ombro abdução E°"},
                  {k:"cotoveloFlexaoD",l:"Cotovelo flexão D°"},{k:"cotoveloFlexaoE",l:"Cotovelo flexão E°"},{k:"cotoveloExtensaoD",l:"Cotovelo extensão D°"},{k:"cotoveloExtensaoE",l:"Cotovelo extensão E°"},
                ].map(({k,l}) => <NumericField key={k} label={l} value={adms[k]} onChange={v => setAdms(p=>({...p,[k]:v}))} min={0} max={180} step={1} unit="°" />)}
              </div>

              <span style={lbl()}>Força muscular (MRC 0-5)</span>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 16px", marginTop:6 }}>
                {["deltoideD","deltoideE","bicepsD","bicepsE","tricepsD","tricepsE","quadricepsD","quadricepsE"].map(k =>
                  <NumericField key={k} label={`${k} (MRC)`} value={forcaMuscular[k]} onChange={v => setForcaMuscular(p=>({...p,[k]:v}))} min={0} max={5} step={1} />
                )}
              </div>
            </Section>

            <Section title="Qualidade de Vida — EORTC QLQ-C30" icon="📊">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Funcionais (1-4) e sintomas (1-4). Saúde global (1-7).
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px 16px" }}>
                {["physical","role","emotional","cognitive","social"].map(k => <NumericField key={k} label={`${k} (1-4)`} value={eortc[k]} onChange={v => setEortc(p=>({...p,[k]:v}))} min={1} max={4} step={1} />)}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"10px 16px", marginTop:8 }}>
                {["fatigue","nauseaVomiting","pain","dyspnea","insomnia","appetiteLoss","constipation","diarrhea"].map(k => <NumericField key={k} label={`${k} (1-4)`} value={eortc[k]} onChange={v => setEortc(p=>({...p,[k]:v}))} min={1} max={4} step={1} />)}
              </div>
              <NumericField label="Saúde global/QV (1-7)" value={eortc.global} onChange={v => setEortc(p=>({...p,global:v}))} min={1} max={7} step={1} />
              <button onClick={() => setEortcResult(calcEORTC(eortc))} style={{ ...primaryBtn({ padding:"9px 20px", fontSize:12, marginTop:8 }) }}>📊 Calcular EORTC</button>
              {eortcResult && (
                <div style={{ marginTop:12, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>EORTC QLQ-C30</div>
                  <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:8 }}>
                    <span style={{ fontSize:13, color:C.textSub }}>Global: <strong style={{ color:C.amber }}>{eortcResult.global}</strong>/100</span>
                    <span style={{ fontSize:13, color:C.textSub }}>Funcional: <strong style={{ color:eortcResult.functionalAvg >= 66 ? C.green : C.amber }}>{eortcResult.functionalAvg}</strong>/100</span>
                    <span style={{ fontSize:13, color:C.textSub }}>Sintomas: <strong style={{ color:eortcResult.symptomAvg <= 33 ? C.green : C.red }}>{eortcResult.symptomAvg}</strong>/100</span>
                  </div>
                </div>
              )}
            </Section>

            <Section title="Cuidados Paliativos" icon="🕊️">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                ESAS — Edmonton Symptom Assessment (0-10). PALLIA-10 (0-30).
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px 16px" }}>
                {["dor","fadiga","nausea","depressao","ansiedade","sonolencia","apetite","bemEstar","faltaAr"].map(k =>
                  <NumericField key={k} label={`${k} (0-10)`} value={esas[k]} onChange={v => setEsas(p=>({...p,[k]:v}))} min={0} max={10} step={1} unit="/10" />
                )}
              </div>
              <button onClick={() => setEsasResult(calcESAS(esas))} style={{ ...primaryBtn({ padding:"9px 20px", fontSize:12, marginTop:8 }) }}>📊 Calcular ESAS</button>
              {esasResult && (
                <div style={{ marginTop:12, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"10px 14px", textAlign:"center" }}>
                  <span style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>ESAS Total</span>
                  <div style={{ fontSize:28, fontWeight:900, color:esasResult.color }}>{esasResult.total}/90</div>
                  <div style={{ fontSize:13, fontWeight:700, color:esasResult.color }}>{esasResult.level}</div>
                </div>
              )}
              <div style={{ marginTop:14 }}>
                <span style={lbl()}>PALLIA-10 (0-30)</span>
                <input type="number" value={pallia10} onChange={e => setPallia10(e.target.value)} min={0} max={30} step={1} style={inp()} placeholder="0-30" />
                {pallia10 !== "" && (
                  <div style={{ marginTop:6, padding:"8px 12px", background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:8, fontSize:11 }}>
                    <span style={{ color:C.textSub }}>PALLIA-10: </span>
                    <span style={{ fontWeight:700, color:Number(pallia10) >= 20 ? C.red : Number(pallia10) >= 10 ? C.amber : C.green }}>{pallia10}/30</span>
                    <span style={{ color:C.textMuted }}> — {Number(pallia10) >= 20 ? "Alta" : Number(pallia10) >= 10 ? "Moderada" : "Baixa"} necessidade paliativa</span>
                  </div>
                )}
              </div>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
            </div>
            {/* 📊 Escalas Padronizadas */}
            <CollapsibleSection title="Escalas Padronizadas" icon="📊" expanded={expandedSections.includes("escalas")} onToggle={()=>toggleSection("escalas")}>
              <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.5}}>Selecione uma escala validada para aplicar ao paciente. Os resultados ficam salvos neste módulo.</div>
              <ScaleSelector scaleNames={["ECOG Performance Status","Karnofsky Performance Status (KPS)","ESAS (Edmonton Symptom Assessment System)","DN4 (Douleur Neuropathique 4)","FACT-F (Functional Assessment of Cancer Therapy - Fatigue)","PALLIA-10"]} onSave={handleScaleSave} savedResults={savedScales} />
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
              Registre a evolução do paciente oncológico, resposta às intervenções, tolerância ao exercício e planejamento.
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucaoOnco} onChange={e => setEvolucaoOnco(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução desde a última sessão, resposta às intervenções, tolerância ao exercício, intercorrências..." />
            </div>
            {(ecog !== "" || kps !== "") && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Últimos indicadores</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>
                  {ecog !== "" && <><strong>ECOG:</strong> {calcECOG(ecog).value} · </>}
                  {kps !== "" && <><strong>KPS:</strong> {calcKPS(kps).value} · </>}
                  <strong>Fadiga:</strong> {factFScore || "—"}/52 · <strong>Dor EVA:</strong> {dorEVA || "—"}/10
                  {esasResult && <span> · <strong>ESAS:</strong> {esasResult.total}/90</span>}
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
            <PainSection pain={enhancer.pain} setPain={enhancer.setPain} colors={oncoColors} />
            <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
              flags={["Febre neutropênica","TEP suspeito","Sangramento ativo","Fratura patológica","Compressão medular","Síndrome da veia cava superior","Hipercalcemia sintomática","Linfangite/ erisipela"]}
              colors={oncoColors} />
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={oncoColors} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nDiagnóstico: ${diagnosticoOnco}\nTipo câncer: ${tipoCancer}\nEstadiamento: ${estadiamento}\nTratamentos: ${tratamentosRealizados.join(", ")}\nECOG: ${ecog || "—"}\nKPS: ${kps || "—"}\nFACT-F: ${factFScore || "—"}/52\nEVA Dor: ${dorEVA || "—"}/10\nESAS: ${esasResult?.total || "—"}/90\nEvolução: ${evolucaoOnco}`}
              colors={oncoColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="Fisioterapia Oncológica" colors={oncoColors} />
        )}

        {tab === "evidencias" && (() => {
          const matched = Object.entries(ONCO_EVIDENCE).find(([key]) =>
            (queixaOnco||"").toLowerCase().includes(key.replace(/_/g," ")) ||
            (tipoCancer||"").toLowerCase().includes(key.replace(/_/g," "))
          );
          const cifCodes = matched ? matched[1].cif || [] : [];
          return (
            <>
              <CifAndHonorarios cifCodes={cifCodes} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.amber} />
              <Section title="Diretrizes e Evidências em Fisioterapia Oncológica" icon="🔬">
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                  Diretrizes baseadas em evidências para reabilitação oncológica, organizadas por condição.
                </div>
                {Object.entries(ONCO_EVIDENCE).map(([key, condition]) => {
                  const active = diagnosticoOnco.toLowerCase().includes(key.replace(/_/g," ")) || tipoCancer.toLowerCase().includes(key.replace(/_/g," "));
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
