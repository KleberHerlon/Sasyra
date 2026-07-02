import { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import CifAndHonorarios from "../components/CifAndHonorarios";

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
const primaryBtn = (e={}) => ({ background:C.green, color:"#061A0C", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const ghostBtn = (e={}) => ({ background:"transparent", color:C.green, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
const iconBtn = (active=false, activeColor=C.green, e={}) => ({ background:active ? `${activeColor}18` : C.surface, border:`1px solid ${active ? activeColor+"50" : C.border}`, color:active ? activeColor : C.textMuted, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:active ? 700 : 400, cursor:"pointer", fontFamily:F, transition:"all 0.12s", ...e });

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
        return <button key={v} onClick={() => onChange(active ? "" : v)} style={iconBtn(active, activeColor || C.green)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
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
        return <button key={v} onClick={() => toggle(v)} style={iconBtn(active, activeColor || C.green)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
      })}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={card()}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.green, flex:1 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function saveGeriatriaData(studentId, data) {
  try { localStorage.setItem(`geriatria_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadGeriatriaData(studentId) {
  try { const d = localStorage.getItem(`geriatria_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

function calcMEEM(score) {
  const total = Math.min(30, Math.max(0, Number(score) || 0));
  const level = total >= 24 ? "Normal / Sem déficit" : total >= 18 ? "Déficit leve" : total >= 10 ? "Déficit moderado" : "Déficit grave";
  const color = total >= 24 ? C.green : total >= 18 ? C.amber : total >= 10 ? C.purple : C.red;
  return { total, level, color };
}

function calcGDS15(score) {
  const total = Math.min(15, Math.max(0, Number(score) || 0));
  const level = total <= 5 ? "Normal" : total <= 10 ? "Depressão leve" : "Depressão grave";
  const color = total <= 5 ? C.green : total <= 10 ? C.amber : C.red;
  return { total, level, color };
}

function calcSarcF(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const risk = total >= 4 ? "Alto risco de sarcopenia" : "Baixo risco de sarcopenia";
  const color = total >= 4 ? C.red : C.green;
  return { total, risk, color };
}

function calcKatz(katz) {
  const indep = Object.values(katz).filter(v => v === "Independente").length;
  const level = indep === 6 ? "A - Independência total" : indep >= 4 ? "B-D - Dependência parcial" : indep >= 2 ? "E-F - Dependência moderada" : "G - Dependência total";
  return { indep, total: indep, level };
}

function calcLawton(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total >= 24 ? "Independência completa" : total >= 16 ? "Dependência leve/moderada" : total >= 8 ? "Dependência moderada/grave" : "Dependência grave";
  const color = total >= 24 ? C.green : total >= 16 ? C.amber : C.red;
  return { total, max: 27, level, color };
}

function calcTinetti(balanceScores, gaitScores) {
  const bal = Object.values(balanceScores).reduce((a, b) => a + (Number(b) || 0), 0);
  const ga = Object.values(gaitScores).reduce((a, b) => a + (Number(b) || 0), 0);
  const total = bal + ga;
  const level = total >= 24 ? "Baixo risco de queda" : total >= 19 ? "Médio risco de queda" : "Alto risco de queda";
  const color = total >= 24 ? C.green : total >= 19 ? C.amber : C.red;
  return { total, balance: bal, gait: ga, level, color };
}

function calcFragilidade(indicators) {
  const count = Object.values(indicators).filter(v => v).length;
  const level = count === 0 ? "Não frágil" : count <= 2 ? "Pré-frágil" : "Frágil";
  const color = count === 0 ? C.green : count <= 2 ? C.amber : C.red;
  return { count, level, color };
}

const SARC_F_QUESTIONS = [
  { id:"forca", label:"Força — Dificuldade para levantar/carregar 5 kg?" },
  { id:"caminhada", label:"Caminhada — Dificuldade para atravessar um quarto?" },
  { id:"levantar", label:"Levantar — Dificuldade para levantar da cama/cadeira?" },
  { id:"subirEscadas", label:"Subir escadas — Dificuldade para subir 10 degraus?" },
  { id:"quedas", label:"Quedas — Quantas quedas no último ano?" },
];

const SARC_F_OPTIONS = [
  { value:"0", label:"0 — Nenhuma" },
  { value:"1", label:"1 — Alguma dificuldade" },
  { value:"2", label:"2 — Muita dificuldade / incapaz" },
];

const KATZ_ITEMS = [
  { id:"banho", label:"Banho" },
  { id:"vestir", label:"Vestir-se" },
  { id:"banheiro", label:"Ir ao banheiro" },
  { id:"transferencia", label:"Transferência" },
  { id:"continencia", label:"Continência" },
  { id:"alimentacao", label:"Alimentação" },
];

const LAWTON_ITEMS = [
  { id:"telephone", label:"Usar telefone" },
  { id:"shopping", label:"Fazer compras" },
  { id:"foodPrep", label:"Preparar alimentos" },
  { id:"housekeeping", label:"Tarefas domésticas" },
  { id:"laundry", label:"Lavar roupa" },
  { id:"transport", label:"Transporte / sair de casa" },
  { id:"medications", label:"Medicamentos (controle)" },
  { id:"finances", label:"Finanças (administrar)" },
];

const TINETTI_BALANCE_ITEMS = [
  { id:"sentaEquilibrio", label:"Equilíbrio sentado" },
  { id:"levantaCadeira", label:"Levantar da cadeira" },
  { id:"tentaLevantar", label:"Tentativa de levantar" },
  { id:"peImediato", label:"Equilíbrio imediato ao levantar" },
  { id:"peOlhosAbertos", label:"Em pé com olhos abertos" },
  { id:"peOlhosFechados", label:"Em pé com olhos fechados" },
  { id:"torno", label:"Torno 360°" },
  { id:"estimulo", label:"Estímulo no esterno" },
  { id:"pescoco", label:"Rotação cervical" },
];

const TINETTI_GAIT_ITEMS = [
  { id:"inicioMarcha", label:"Início da marcha" },
  { id:"comprimentoPasso", label:"Comprimento do passo" },
  { id:"elevacaoPe", label:"Elevação do pé" },
  { id:"simetriaPasso", label:"Simetria do passo" },
  { id:"continuidade", label:"Continuidade da marcha" },
  { id:"desvioTrajeto", label:"Desvio do trajeto" },
  { id:"tronco", label:"Estabilidade do tronco" },
];

const GERIATRIA_EVIDENCE = {
  sarcopenia: {
    cif:["b730","b740","d450","d410","e115"],
    label:"Sarcopenia",
    goldStandard:"Treino de força (60-80% 1RM) 2-3x/sem. Suplementação proteica (1.2-1.5 g/kg/dia). Vitamina D 800-2000 UI/dia. Exercícios de potência e equilíbrio. EWGSOP2 (2019): força reduzida + massa reduzida + baixo desempenho. Cut-off: dinamometria <27kg(H)/<16kg(M); marcha <0.8m/s.",
    escalas:["SARC-F","Dinamometria manual","Velocidade de marcha","Circunferência da panturrilha","BIA","DEXA"],
    referencias:[{ id:"EWGSOP2 2019", title:"Sarcopenia: revised European consensus", url:"https://academic.oup.com/ageing/article/48/1/16/5123743" }],
  },
  fragilidade: {
    cif:["b130","b730","d410","d450","d465"],
    label:"Fragilidade (Síndrome)",
    goldStandard:"Identificar fenótipos de Fried (perda de peso, fadiga, força reduzida, velocidade reduzida, baixa atividade). Exercício multicomponente: aeróbio + força + equilíbrio. Otimização nutricional (proteína + vitamina D). Evitar polifarmácia. Programas como 'Vivifrail' — Evidência A.",
    escalas:["Fenótipo de Fried","Índice de Fragilidade (Rockwood)","SARC-F","SPPB"],
    referencias:[{ id:"Fried 2001", title:"Frailty in older adults (J Gerontol)", url:"https://academic.oup.com/biomedgerontology/article/56/3/M146/599042" }],
  },
  quedas: {
    cif:["b770","b755","d410","d415","d450","e115"],
    label:"Risco de Quedas",
    goldStandard:"Triagem Multifatorial (Tinetti, TUG, Berg). Treino de equilíbrio e marcha — 3h/sem, 12 semanas. Fortalecimento de MMII. Dupla tarefa. Adaptações ambientais. Revisão de medicações sedativas. Redução do medo de cair (autoeficácia). NICE CG161: avaliação multifatorial + intervenção personalizada.",
    escalas:["Tinetti POMA","Berg Balance Scale","Timed Up and Go (TUG)","Morse Fall Scale","FES-I"],
    referencias:[{ id:"NICE CG161", title:"Falls in older people (NICE 2023)", url:"https://www.nice.org.uk/guidance/cg161" }],
  },
  demencia: {
    cif:["b164","b130","d510","d540","d550","d570"],
    label:"Demência / Deterioração Cognitiva",
    goldStandard:"Exercício aeróbio (caminhada 30min, 5x/sem) retarda declínio — Evidência A. Dupla tarefa cognitivo-motora. Estimulação cognitiva. Orientação do cuidador. Musicoterapia. Prevenção de quedas. MEEM/MoCA regulares. Atividade física reduz risco de progressão em até 30% (Lancet 2020).",
    escalas:["MEEM","MoCA","GDS-15","CDR","Índice de Katz / Lawton"],
    referencias:[{ id:"Lancet 2020", title:"Dementia prevention (Lancet 2020)", url:"https://www.thelancet.com/article/S0140-6736(20)30367-6/" }],
  },
  parkinson_idoso: {
    cif:["b735","b750","b755","d410","d450","d465"],
    label:"Parkinson no Idoso",
    goldStandard:"LSVT BIG (amplitude ampla) — Evidência A. Pistas rítmicas para marcha. Treino de equilíbrio e prevenção de quedas. Dupla tarefa para freezing. Fortalecimento de extensores posturais. Alongamento para rigidez. Dança (tango) melhora coordenação.",
    escalas:["UPDRS","Hoehn & Yahr","TUG","Berg Balance Scale","GDS-15"],
    referencias:[{ id:"LSVT Global", title:"LSVT BIG evidence-based protocol", url:"https://www.lsvtglobal.com/" }],
  },
  osteoporose: {
    cif:["b710","b730","d410","d415","d450"],
    label:"Osteoporose",
    goldStandard:"Exercício de impacto controlado + resistido para DMO — Evidência A. Evitar flexão/extensão forçada da coluna. Fortalecimento de extensores da coluna e MMII. Vitamina D + Cálcio. Osteoporose + sarcopenia = 'Osteossarcopenia' — intervenções combinadas.",
    escalas:["DEXA / T-score","FRAX","SARC-F","Berg Balance Scale"],
    referencias:[{ id:"NOF 2024", title:"Clinician's Guide to Osteoporosis (NOF)", url:"https://www.nof.org/" }],
  },
};

export default function Geriatria({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onUpdateStudentById, onDeleteStudent }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");
  const [regiao, setRegiao] = useState("Centro-Oeste");

  const [queixaGeriatria, setQueixaGeriatria] = useState("");
  const [comorbidadesGeriatria, setComorbidadesGeriatria] = useState([]);
  const [medicamentosGeriatria, setMedicamentosGeriatria] = useState("");
  const [historicoQuedas, setHistoricoQuedas] = useState("");
  const [fraturaPrevia, setFraturaPrevia] = useState("");
  const [usoDispositivoAuxilio, setUsoDispositivoAuxilio] = useState("");
  const [moradiaSozinho, setMoradiaSozinho] = useState("");
  const [suporteFamiliar, setSuporteFamiliar] = useState("");
  const [atividadesDiarias, setAtividadesDiarias] = useState([]);

  const [meemScore, setMeemScore] = useState("");
  const [gds15Score, setGds15Score] = useState("");
  const [meemResult, setMeemResult] = useState(null);
  const [gds15Result, setGds15Result] = useState(null);

  const [katzScores, setKatzScores] = useState({});
  const [katzResult, setKatzResult] = useState(null);

  const [lawtonScores, setLawtonScores] = useState({});
  const [lawtonResult, setLawtonResult] = useState(null);

  const [sarcFScores, setSarcFScores] = useState({});
  const [sarcFResult, setSarcFResult] = useState(null);
  const [dinamometria, setDinamometria] = useState("");
  const [circunferenciaPanturrilha, setCircunferenciaPanturrilha] = useState("");
  const [velocidadeMarcha, setVelocidadeMarcha] = useState("");

  const [tinettiBalanceScores, setTinettiBalanceScores] = useState({});
  const [tinettiGaitScores, setTinettiGaitScores] = useState({});
  const [tinettiResult, setTinettiResult] = useState(null);
  const [tugSegundos, setTugSegundos] = useState("");

  const [fragilidadeIndicators, setFragilidadeIndicators] = useState({});
  const [fragilidadeResult, setFragilidadeResult] = useState(null);

  const [evolucaoGeriatria, setEvolucaoGeriatria] = useState("");

  const sid = student?.id || student?.nome;
  const enhancer = useEnhancer("geriatria", sid, `geriatria_enhancer_${sid}`);
  const geriatriaColors = { ...C, accent: C.green, font: F };

  useEffect(() => {
    if (student?.id || student?.nome) {
      const saved = loadGeriatriaData(sid);
      if (saved) {
        setQueixaGeriatria(saved.queixaGeriatria || "");
        setComorbidadesGeriatria(saved.comorbidadesGeriatria || []);
        setMedicamentosGeriatria(saved.medicamentosGeriatria || "");
        setHistoricoQuedas(saved.historicoQuedas || "");
        setFraturaPrevia(saved.fraturaPrevia || "");
        setUsoDispositivoAuxilio(saved.usoDispositivoAuxilio || "");
        setMoradiaSozinho(saved.moradiaSozinho || "");
        setSuporteFamiliar(saved.suporteFamiliar || "");
        setAtividadesDiarias(saved.atividadesDiarias || []);
        setMeemScore(saved.meemScore || "");
        setGds15Score(saved.gds15Score || "");
        setMeemResult(saved.meemResult || null);
        setGds15Result(saved.gds15Result || null);
        setKatzScores(saved.katzScores || {});
        setKatzResult(saved.katzResult || null);
        setLawtonScores(saved.lawtonScores || {});
        setLawtonResult(saved.lawtonResult || null);
        setSarcFScores(saved.sarcFScores || {});
        setSarcFResult(saved.sarcFResult || null);
        setDinamometria(saved.dinamometria || "");
        setCircunferenciaPanturrilha(saved.circunferenciaPanturrilha || "");
        setVelocidadeMarcha(saved.velocidadeMarcha || "");
        setTinettiBalanceScores(saved.tinettiBalanceScores || {});
        setTinettiGaitScores(saved.tinettiGaitScores || {});
        setTinettiResult(saved.tinettiResult || null);
        setTugSegundos(saved.tugSegundos || "");
        setFragilidadeIndicators(saved.fragilidadeIndicators || {});
        setFragilidadeResult(saved.fragilidadeResult || null);
        setEvolucaoGeriatria(saved.evolucaoGeriatria || "");
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
    saveGeriatriaData(sid, {
      queixaGeriatria, comorbidadesGeriatria, medicamentosGeriatria, historicoQuedas,
      fraturaPrevia, usoDispositivoAuxilio, moradiaSozinho, suporteFamiliar, atividadesDiarias,
      meemScore, gds15Score, meemResult, gds15Result,
      katzScores, katzResult, lawtonScores, lawtonResult,
      sarcFScores, sarcFResult, dinamometria, circunferenciaPanturrilha, velocidadeMarcha,
      tinettiBalanceScores, tinettiGaitScores, tinettiResult, tugSegundos,
      fragilidadeIndicators, fragilidadeResult,
      evolucaoGeriatria,
      pain: enhancer.pain, logs: enhancer.logs, redFlags: enhancer.redFlags, aiRes: enhancer.aiRes,
      data: new Date().toISOString().slice(0,10),
    });
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"0.05em" }}>👴 Fisioterapia Geriátrica</span>
          <button onClick={() => { localStorage.removeItem("sasyra_module"); window.location.reload(); }} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um paciente</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Pacientes {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Novo Paciente"}
          </button>
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.green}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.green, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
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
                <div style={{ width:40, height:40, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:C.green, flexShrink:0 }}>
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
                <span style={{ color:C.green, fontSize:16 }}>→</span>
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
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.green}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.green, marginBottom:8 }}>Editar dados do paciente</div>
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
                style={{ background:C.green, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#061A0C", cursor:"pointer", fontFamily:F }}>Continuar</button>
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
          <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>👴 Geriátrica</span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Anamnese"],["avaliacao","🔬","Avaliação"],["evolucao","📈","Evolução"],["sessoes","📅","Sessões"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.greenBg : "transparent",
              border: `1px solid ${tab === k ? C.green + "50" : "transparent"}`,
              borderRadius: 8, padding: "7px 14px", fontSize: 12,
              fontWeight: tab === k ? 700 : 400,
              color: tab === k ? C.green : C.textMuted, cursor: "pointer", fontFamily: F,
            }}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {student?.nome && (
            <>
              <div style={{ width:30, height:30, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.green }}>
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
            <Section title="Anamnese Geriátrica" icon="📋">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:12 }}>História clínica, comorbidades, medicações e condições funcionais e sociais.</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>Queixa principal / Motivo da consulta</span>
                  <input type="text" value={queixaGeriatria} onChange={e => setQueixaGeriatria(e.target.value)} style={inp()} placeholder="Ex: Dificuldade para andar, quedas frequentes, fraqueza..." />
                </div>
                <div>
                  <span style={lbl()}>Número de quedas no último ano</span>
                  <input type="number" value={historicoQuedas} onChange={e => setHistoricoQuedas(e.target.value)} style={inp()} placeholder="0" min={0} />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Medicações em uso</span>
                <input type="text" value={medicamentosGeriatria} onChange={e => setMedicamentosGeriatria(e.target.value)} style={inp()} placeholder="Ex: Losartana, Omeprazol, Vitamina D, Sinvastatina..." />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Comorbidades</span>
                <TagSelect options={["HAS","DM Tipo 2","Osteoporose","Osteoartrite","Hipotensão postural","DPOC","IC","DAC","AVC prévio","Demência","Parkinson","Depressão","Incontinência urinária","TVP","Hipotireoidismo"]}
                  value={comorbidadesGeriatria} onChange={setComorbidadesGeriatria} activeColor={C.green} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Fratura prévia</span>
                <SingleSelect options={["Sim","Não","Fratura de fêmur","Fratura de rádio","Fratura vertebral"]} value={fraturaPrevia} onChange={setFraturaPrevia} activeColor={C.green} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Uso de dispositivo de auxílio</span>
                <SingleSelect options={["Nenhum","Bengala","Muleta","Andador (standard)","Andador com rodas","Cadeira de rodas","Órtese de MMII"]} value={usoDispositivoAuxilio} onChange={setUsoDispositivoAuxilio} activeColor={C.green} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Mora sozinho?</span>
                  <SingleSelect options={["Sim","Não","Com cônjuge","Com familiares","ILPI (Instituição)"]} value={moradiaSozinho} onChange={setMoradiaSozinho} activeColor={C.green} />
                </div>
                <div>
                  <span style={lbl()}>Suporte familiar</span>
                  <SingleSelect options={["Presente","Parcial","Ausente","Cuidador formal"]} value={suporteFamiliar} onChange={setSuporteFamiliar} activeColor={C.green} />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Dificuldades em AVDs</span>
                <TagSelect options={["Banho","Vestir","Alimentação","Higiene","Transferências","Deambulação","Subir escadas","Uso do banheiro","Preparar refeições","Administrar finanças"]}
                  value={atividadesDiarias} onChange={setAtividadesDiarias} activeColor={C.green} />
              </div>
            </Section>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Anamnese</button>
            </div>
          </>
        )}

        {tab === "avaliacao" && (
          <>
            <Section title="Avaliação Cognitiva" icon="🧠">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div>
                  <NumericField label="MEEM — Mini-Exame do Estado Mental (0-30)" value={meemScore} onChange={v => {
                    setMeemScore(v);
                    if (v) setMeemResult(calcMEEM(v));
                    else setMeemResult(null);
                  }} min={0} max={30} step={1} />
                  {meemResult && (
                    <div style={{ marginTop:8, background:C.greenBg, border:`1px solid ${meemResult.color}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                      <div style={{ fontSize:24, fontWeight:900, color:meemResult.color }}>{meemResult.total}/30</div>
                      <div style={{ fontSize:13, fontWeight:700, color:meemResult.color }}>{meemResult.level}</div>
                    </div>
                  )}
                </div>
                <div>
                  <NumericField label="GDS-15 — Escala de Depressão Geriátrica (0-15)" value={gds15Score} onChange={v => {
                    setGds15Score(v);
                    if (v) setGds15Result(calcGDS15(v));
                    else setGds15Result(null);
                  }} min={0} max={15} step={1} />
                  {gds15Result && (
                    <div style={{ marginTop:8, background:C.greenBg, border:`1px solid ${gds15Result.color}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                      <div style={{ fontSize:24, fontWeight:900, color:gds15Result.color }}>{gds15Result.total}/15</div>
                      <div style={{ fontSize:13, fontWeight:700, color:gds15Result.color }}>{gds15Result.level}</div>
                    </div>
                  )}
                </div>
              </div>
            </Section>

            <Section title="Capacidade Funcional" icon="💪">
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:10, letterSpacing:"0.05em" }}>Índice de Katz — Independência em AVDs</div>
                {KATZ_ITEMS.map(item => (
                  <div key={item.id} style={{ marginBottom:8 }}>
                    <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{item.label}</span>
                    <SingleSelect options={["Independente","Dependente"]} value={katzScores[item.id] || ""} onChange={v => {
                      const next = { ...katzScores, [item.id]: v };
                      setKatzScores(next);
                      setKatzResult(calcKatz(next));
                    }} activeColor={C.green} />
                  </div>
                ))}
                {katzResult && (
                  <div style={{ marginTop:10, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Katz</div>
                    <div style={{ fontSize:22, fontWeight:900, color:C.green }}>{katzResult.indep}/6 independentes</div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.green }}>{katzResult.level}</div>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:10, letterSpacing:"0.05em" }}>Índice de Lawton — AVDs Instrumentais (0-3 cada, max 27)</div>
                {LAWTON_ITEMS.map(item => (
                  <div key={item.id} style={{ marginBottom:8 }}>
                    <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{item.label}</span>
                    <SingleSelect options={[
                      { value:"0", label:"0 — Não consegue" },
                      { value:"1", label:"1 — Com ajuda" },
                      { value:"2", label:"2 — Com dificuldade" },
                      { value:"3", label:"3 — Independente" },
                    ]} value={lawtonScores[item.id] || ""} onChange={v => {
                      const next = { ...lawtonScores, [item.id]: v };
                      setLawtonScores(next);
                      setLawtonResult(calcLawton(next));
                    }} activeColor={C.green} />
                  </div>
                ))}
                {lawtonResult && (
                  <div style={{ marginTop:10, background:C.greenBg, border:`1px solid ${lawtonResult.color}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Lawton</div>
                    <div style={{ fontSize:22, fontWeight:900, color:lawtonResult.color }}>{lawtonResult.total}/{lawtonResult.max}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:lawtonResult.color }}>{lawtonResult.level}</div>
                  </div>
                )}
              </div>
            </Section>

            <Section title="Triagem de Sarcopenia" icon="🦴">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10 }}>SARC-F: 5 questões (0-2 cada). Total ≥ 4 = sarcopenia.</div>
              {SARC_F_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom:8 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                  <SingleSelect options={SARC_F_OPTIONS} value={sarcFScores[q.id] || ""} onChange={v => {
                    const next = { ...sarcFScores, [q.id]: v };
                    setSarcFScores(next);
                    setSarcFResult(calcSarcF(next));
                  }} activeColor={C.green} />
                </div>
              ))}
              {sarcFResult && (
                <div style={{ marginTop:10, background:C.greenBg, border:`1px solid ${sarcFResult.color}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>SARC-F</div>
                  <div style={{ fontSize:24, fontWeight:900, color:sarcFResult.color }}>{sarcFResult.total}/10</div>
                  <div style={{ fontSize:13, fontWeight:700, color:sarcFResult.color }}>{sarcFResult.risk}</div>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginTop:16 }}>
                <NumericField label="Dinamometria (kg)" value={dinamometria} onChange={setDinamometria} unit="kg" min={0} max={100} step={0.1} />
                <NumericField label="Circ. panturrilha (cm)" value={circunferenciaPanturrilha} onChange={setCircunferenciaPanturrilha} unit="cm" min={0} max={60} step={0.1} />
                <NumericField label="Velocidade marcha (m/s)" value={velocidadeMarcha} onChange={setVelocidadeMarcha} unit="m/s" min={0} max={3} step={0.1} />
              </div>
            </Section>

            <Section title="Equilíbrio e Marcha" icon="⚖️">
              <div style={{ marginBottom:14 }}>
                <NumericField label="TUG — Timed Up and Go (segundos)" value={tugSegundos} onChange={setTugSegundos} unit="s" min={0} max={60} step={0.1} />
              </div>
              <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:8, letterSpacing:"0.05em" }}>Tinetti — Equilíbrio (0-2 cada, max 16)</div>
              {TINETTI_BALANCE_ITEMS.map(item => (
                <div key={item.id} style={{ marginBottom:6 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:2 }) }}>{item.label}</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Instável" },
                    { value:"1", label:"1 - Adaptativo" },
                    { value:"2", label:"2 - Normal" },
                  ]} value={tinettiBalanceScores[item.id] || ""} onChange={v => {
                    const next = { ...tinettiBalanceScores, [item.id]: v };
                    setTinettiBalanceScores(next);
                    setTinettiResult(calcTinetti(next, tinettiGaitScores));
                  }} activeColor={C.green} />
                </div>
              ))}
              <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:8, marginTop:14, letterSpacing:"0.05em" }}>Tinetti — Marcha (0-2 cada, max 12)</div>
              {TINETTI_GAIT_ITEMS.map(item => (
                <div key={item.id} style={{ marginBottom:6 }}>
                  <span style={{ ...lbl({ fontSize:10, marginBottom:2 }) }}>{item.label}</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Anormal" },
                    { value:"1", label:"1 - Adaptativo" },
                    { value:"2", label:"2 - Normal" },
                  ]} value={tinettiGaitScores[item.id] || ""} onChange={v => {
                    const next = { ...tinettiGaitScores, [item.id]: v };
                    setTinettiGaitScores(next);
                    setTinettiResult(calcTinetti(tinettiBalanceScores, next));
                  }} activeColor={C.green} />
                </div>
              ))}
              {tinettiResult && (
                <div style={{ marginTop:10, background:C.greenBg, border:`1px solid ${tinettiResult.color}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Tinetti POMA</div>
                  <div style={{ fontSize:24, fontWeight:900, color:tinettiResult.color }}>{tinettiResult.total}/28</div>
                  <div style={{ fontSize:12, color:C.textSub }}>Equilíbrio: {tinettiResult.balance}/16 · Marcha: {tinettiResult.gait}/12</div>
                  <div style={{ fontSize:13, fontWeight:700, color:tinettiResult.color, marginTop:4 }}>{tinettiResult.level}</div>
                </div>
              )}
            </Section>

            <Section title="Síndrome de Fragilidade (Fried Criteria)" icon="📉">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10 }}>0 = Não frágil, 1-2 = Pré-frágil, ≥3 = Frágil.</div>
              <TagSelect options={["Perda de peso >5% no último ano","Fadiga autorreferida","Força de preensão reduzida","Velocidade de marcha reduzida","Baixo nível de atividade física"]}
                value={Object.keys(fragilidadeIndicators).filter(k => fragilidadeIndicators[k])} onChange={v => {
                  const next = { perdaPeso:false, fadiga:false, forcaReduzida:false, velocidadeReduzida:false, atividadeReduzida:false };
                  v.forEach(item => {
                    if (item.includes("peso")) next.perdaPeso = true;
                    if (item === "Fadiga autorreferida") next.fadiga = true;
                    if (item.includes("preensão")) next.forcaReduzida = true;
                    if (item.includes("marcha")) next.velocidadeReduzida = true;
                    if (item.includes("atividade")) next.atividadeReduzida = true;
                  });
                  setFragilidadeIndicators(next);
                  setFragilidadeResult(calcFragilidade(next));
                }} activeColor={C.green} />
              {fragilidadeResult && (
                <div style={{ marginTop:12, background:C.greenBg, border:`1px solid ${fragilidadeResult.color}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Fried</div>
                  <div style={{ fontSize:24, fontWeight:900, color:fragilidadeResult.color }}>{fragilidadeResult.count}/5</div>
                  <div style={{ fontSize:13, fontWeight:700, color:fragilidadeResult.color }}>{fragilidadeResult.level}</div>
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
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:12 }}>Registre a evolução, resposta às intervenções e planejamento.</div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucaoGeriatria} onChange={e => setEvolucaoGeriatria(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução desde a última sessão, resposta às intervenções, mudanças na funcionalidade..." />
            </div>
            {(meemResult || gds15Result || sarcFResult || tinettiResult || fragilidadeResult) && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.green, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Última avaliação</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>
                  {meemResult && <span><strong>MEEM:</strong> {meemResult.total}/30 ({meemResult.level}) · </span>}
                  {gds15Result && <span><strong>GDS-15:</strong> {gds15Result.total}/15 ({gds15Result.level}) · </span>}
                  {sarcFResult && <span><strong>SARC-F:</strong> {sarcFResult.total}/10 ({sarcFResult.risk}) · </span>}
                  {tinettiResult && <span><strong>Tinetti:</strong> {tinettiResult.total}/28 ({tinettiResult.level}) · </span>}
                  {fragilidadeResult && <span><strong>Fried:</strong> {fragilidadeResult.count}/5 ({fragilidadeResult.level})</span>}
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
            <PainSection pain={enhancer.pain} setPain={enhancer.setPain} colors={geriatriaColors} />
            <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
              flags={["Queda recente com trauma","Confusão mental súbita","Síncope","Perda de peso >5% em 1 mês","Imobilização súbita","Febre no idoso","Déficit focal agudo"]}
              colors={geriatriaColors} />
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={geriatriaColors} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nQueixa: ${queixaGeriatria}\nQuedas (1 ano): ${historicoQuedas}\nComorbidades: ${comorbidadesGeriatria.join(", ")}\nDispositivo: ${usoDispositivoAuxilio}\nMEEM: ${meemResult?.total || "—"}\nGDS-15: ${gds15Result?.total || "—"}\nKatz: ${katzResult?.indep || "—"}/6\nLawton: ${lawtonResult?.total || "—"}/27\nSARC-F: ${sarcFResult?.total || "—"}\nTinetti: ${tinettiResult?.total || "—"}/28\nTUG: ${tugSegundos || "—"}s\nFried: ${fragilidadeResult?.count || "—"}/5\nEVA Mov: ${enhancer.pain.evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep}/10\nEvolução: ${evolucaoGeriatria}`}
              colors={geriatriaColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="Fisioterapia Geriátrica" colors={geriatriaColors} />
        )}

        {tab === "evidencias" && (() => {
          const matched = Object.entries(GERIATRIA_EVIDENCE).find(([key]) =>
            (queixaGeriatria||"").toLowerCase().includes(key.replace(/_/g," ")) ||
            (comorbidadesGeriatria||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
          );
          const cifCodes = matched ? matched[1].cif || [] : [];
          return (
            <>
              <CifAndHonorarios cifCodes={cifCodes} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.green} />
              <Section title="Diretrizes e Evidências em Geriatria" icon="🔬">
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:12 }}>Diretrizes baseadas em evidências para reabilitação geriátrica.</div>
            {Object.entries(GERIATRIA_EVIDENCE).map(([key, condition]) => {
              const active = queixaGeriatria.toLowerCase().includes(key.replace(/_/g," ")) || comorbidadesGeriatria.some(c => c.toLowerCase().includes(key.replace(/_/g," ")));
              return (
                <div key={key} style={{
                  ...card(),
                  border: active ? `1px solid ${C.green}50` : `1px solid ${C.border}`,
                  opacity: active ? 1 : 0.6,
                  cursor:"pointer"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    {active && <span style={{ fontSize:10, fontWeight:800, color:C.green, background:C.greenBg, padding:"2px 8px", borderRadius:6 }}>Condição identificada ✓</span>}
                    <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{condition.label}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7, marginBottom:8 }}>{condition.goldStandard}</div>
                  {condition.escalas && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {condition.escalas.map(s => (
                        <span key={s} style={{ fontSize:10, color:C.green, background:C.greenBg, border:`1px solid ${C.green}30`, borderRadius:6, padding:"2px 8px" }}>{s}</span>
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
