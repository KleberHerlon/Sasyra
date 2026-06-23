import { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import { calcBioimpedancia, calcPollock7Dobras, calcISAK6Dobras } from "../data/physicalAssessment";
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

// ── SAVE / LOAD ──────────────────────────────────────────────────────────────
function saveNutriData(studentId, data) {
  try { localStorage.setItem(`nutri_data_${studentId}`, JSON.stringify(data)); } catch {}
}
function loadNutriData(studentId) {
  try { const d = localStorage.getItem(`nutri_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

// ── BMR EQUATIONS ────────────────────────────────────────────────────────────
function calcBMR(peso, altura, idade, sexo, formula) {
  const p = parseFloat(peso), a = parseFloat(altura), i = parseInt(idade);
  if (!p || !a || !i || !sexo) return null;
  const isM = sexo === "Masculino";
  if (formula === "harris") {
    return isM ? 88.362 + 13.397*p + 4.799*a - 5.677*i : 447.593 + 9.247*p + 3.098*a - 4.33*i;
  }
  if (formula === "mifflin") {
    return isM ? 10*p + 6.25*a - 5*i + 5 : 10*p + 6.25*a - 5*i - 161;
  }
  return null;
}

const FAO_PAL = [
  { value:"1.2", label:"Sedentário (1.2)" },
  { value:"1.375", label:"Leve (1.375)" },
  { value:"1.55", label:"Moderado (1.55)" },
  { value:"1.725", label:"Intenso (1.725)" },
  { value:"1.9", label:"Muito intenso (1.9)" },
];

// ── MUST ─────────────────────────────────────────────────────────────────────
const MUST_FIELDS = [
  { id:"bmi", label:"IMC (kg/m²)", scoreLabel: s => s >= 30 ? "0" : s >= 25 ? "1" : s >= 20 ? "2" : "3", score: v => v >= 30 ? 0 : v >= 25 ? 1 : v >= 20 ? 2 : 3 },
  { id:"perdaPeso", label:"Perda de peso involuntária nos últimos 3-6 meses", score: v => v === ">10" ? 3 : v === "5-10" ? 2 : v === "0-5" ? 1 : 0 },
  { id:"doencaAguda", label:"Doença aguda com ingestão reduzida > 5 dias", score: v => v === "sim" ? 2 : 0 },
];

function calcMUST(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const risk = total === 0 ? "Baixo risco" : total === 1 ? "Risco médio" : "Alto risco";
  const color = total === 0 ? C.green : total === 1 ? C.amber : C.red;
  return { total, risk, color };
}

// ── SARC-F ───────────────────────────────────────────────────────────────────
const SARC_F = [
  { id:"forca", label:"Força — Dificuldade para levantar/carregar 4,5 kg?", options:[{t:"Nenhuma",s:0},{t:"Alguma",s:1},{t:"Muita / Incapaz",s:2}] },
  { id:"caminhada", label:"Caminhada — Dificuldade para caminhar até uma sala?", options:[{t:"Nenhuma",s:0},{t:"Alguma",s:1},{t:"Muita / Incapaz",s:2}] },
  { id:"levantar", label:"Levantar da cadeira — Precisa de ajuda?", options:[{t:"Nenhuma",s:0},{t:"Alguma",s:1},{t:"Muita / Incapaz",s:2}] },
  { id:"subirEscadas", label:"Subir escadas — Dificuldade para subir 10 degraus?", options:[{t:"Nenhuma",s:0},{t:"Alguma",s:1},{t:"Muita / Incapaz",s:2}] },
  { id:"quedas", label:"Quedas — Quantas vezes caiu no último ano?", options:[{t:"Nenhuma",s:0},{t:"1-3 quedas",s:1},{t:"≥4 quedas",s:2}] },
];

// ── NUTRITIONAL EVIDENCE ────────────────────────────────────────────────────
const NUTRI_EVIDENCE = {
  obesidade: {
    label:"Obesidade / Sobrepeso",
    goldStandard:"Dieta hipocalórica (déficit de 500-1000 kcal/dia) com restrição de ultraprocessados. Abordagem comportamental intensiva (≥14 sessões em 6 meses). Atividade física aeróbia + resistida ≥150 min/semana. Fármacos antiobesidade como adjuvante (IBGE 2020, Diretriz ABESO 2022). Cirurgia bariátrica para IMC ≥40 ou ≥35 com comorbidades (Evidência A).",
    escalas:["IMC","RCQ","BIA","IPAQ","TFEQ-18 (Eating Behavior)"],
    referencias:[{ id:"ABESO 2022", title:"Diretriz Brasileira de Obesidade", url:"https://abeso.org.br/diretrizes/" }],
  },
  diabetes: {
    label:"Diabetes Mellitus Tipo 2",
    goldStandard:"Plano alimentar individualizado com foco em carboidratos integrais e baixo índice glicêmico. Redução de ≥5% do peso corporal melhora o controle glicêmico (Evidência A — Diretriz SBEM 2023). Monitoramento de HC e educação nutricional. Evitar bebidas açucaradas. Frutose e sacarose devem ser limitadas (<10% VET). Suplementação de vitamina D se deficiência.",
    escalas:["IMC","RCQ","BIA","Recordatório 24h","HOMA-IR (referência bioquímica)"],
    referencias:[{ id:"SBEM 2023", title:"Diretriz da Sociedade Brasileira de Endocrinologia", url:"https://www.sbem.org.br/" }],
  },
  desnutricao: {
    label:"Desnutrição / Risco Nutricional",
    goldStandard:"Triagem MUST ou NRS-2002 na primeira consulta. Suplementação oral com fórmula polimérica se ingestão <60% das necessidades (Evidência A — ASPEN 2021). Via enteral se TNE >7 dias. Monitoramento semanal de peso e ingestão. Causa base deve ser investigada e tratada. Equipe multidisciplinar é essencial.",
    escalas:["MUST","NRS-2002","MNA (Mini Nutritional Assessment)","BIA","Exames bioquímicos (albumina, transferrina)"],
    referencias:[{ id:"ASPEN 2021", title:"ASPEN Clinical Guidelines: Malnutrition", url:"https://aspenjournals.onlinelibrary.wiley.com/" }],
  },
  dislipidemia: {
    label:"Dislipidemia",
    goldStandard:"Redução de gordura saturada (<7% VET) e gordura trans (<1% VET). Ômega-3 (EPA+DHA ≥2 g/dia) para triglicerídeos elevados. Fibras solúveis (aveia, psyllium, leguminosas). Fitoesteróis (2 g/dia) como adjuvante (Evidência A — Diretriz SBC 2022). Dieta mediterrânea como padrão alimentar de escolha.",
    escalas:["IMC","RCQ","Recordatório 24h","IPAQ"],
    referencias:[{ id:"SBC 2022", title:"Diretriz Brasileira de Dislipidemias", url:"https://www.cardiol.br/" }],
  },
  hipertensao: {
    label:"Hipertensão Arterial",
    goldStandard:"Dieta DASH (Dietary Approaches to Stop Hypertension) — Evidência A. Redução de sódio <2 g/dia (<5 g sal). Aumento de potássio (frutas, verduras, leguminosas). Manter peso adequado (IMC <25). Álcool: ≤1 dose/dia mulheres, ≤2 doses/dia homens. Atividade física regular 150 min/sem.",
    escalas:["IMC","RCQ","Recordatório 24h","IPAQ"],
    referencias:[{ id:"DASH Trial", title:"NEJM 1997 — DASH Diet", url:"https://www.nejm.org/doi/full/10.1056/NEJM199704173361601" }],
  },
  doenca_renal: {
    label:"Doença Renal Crônica",
    goldStandard:"Restrição proteica (0.6-0.8 g/kg/dia) em DRC estágios 3-5 não dialítica. Controle de fósforo e potássio conforme estágio. Monitoramento de sódio e volume. Suplementação de bicarbonato se acidose metabólica. Acompanhamento com nutricionista especializado essencial (Evidência A — KDIGO 2021).",
    escalas:["MUST","BIA","Recordatório 24h","Exames bioquímicos (creatinina, ureia, K, P)"],
    referencias:[{ id:"KDIGO 2021", title:"KDIGO Clinical Practice Guideline for Diabetes Management in CKD", url:"https://kdigo.org/guidelines/" }],
  },
};

// ── FOOD GROUPS (24h recall helper) ──────────────────────────────────────────
const FOOD_GROUPS = [
  { label:"Café da manhã", items:["Pão","Leite","Café","Frutas","Cereais","Ovos","Queijo","Iogurte","Manteiga/Margarina","Suco natural","Outro"] },
  { label:"Lanche da manhã", items:["Frutas","Biscoitos","Barra de cereal","Iogurte","Suco","Café com leite","Outro"] },
  { label:"Almoço", items:["Arroz","Feijão","Carne bovina","Frango","Peixe","Ovo","Massa","Salada","Legumes","Batata/Mandioca","Suco natural","Refrigerante","Sobremesa"] },
  { label:"Lanche da tarde", items:["Pão","Café","Leite","Frutas","Biscoitos","Iogurte","Bolo","Suco natural","Café com leite","Outro"] },
  { label:"Jantar", items:["Arroz","Feijão","Carne bovina","Frango","Peixe","Sopa","Massa","Salada","Legumes","Ovo","Suco natural","Refrigerante"] },
  { label:"Ceia", items:["Leite","Chá","Frutas","Iogurte","Biscoitos","Outro"] },
];

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Nutrition({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");

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
  const [habitosVida, setHabitosVida] = useState([]);
  const [consumoAgua, setConsumoAgua] = useState("");
  const [sono, setSono] = useState("");

  // Anthropometry
  const [pesoAtual, setPesoAtual] = useState(student?.peso || "");
  const [alturaAtual, setAlturaAtual] = useState(student?.altura || "");
  const [cintura, setCintura] = useState("");
  const [quadril, setQuadril] = useState("");
  const [pescoco, setPescoco] = useState("");
  const [sexoRcq, setSexoRcq] = useState(student?.sexo || "");
  const [imcResult, setImcResult] = useState(null);
  const [rcqResult, setRcqResult] = useState(null);

  // BIA
  const [biaResistencia, setBiaResistencia] = useState("");
  const [biaReactancia, setBiaReactancia] = useState("");
  const [pesoBia, setPesoBia] = useState(student?.peso || "");
  const [alturaBia, setAlturaBia] = useState(student?.altura || "");
  const [biaResult, setBiaResult] = useState(null);

  // Dobras
  const [dobras, setDobras] = useState({ peitoral:"", abdominal:"", coxa:"", suprailiaca:"", subescapular:"", tricipital:"", axilarMedia:"" });
  const [isakDobras, setIsakDobras] = useState({ tricipital:"", subescapular:"", suprailiaca:"", abdominal:"", coxa:"", panturrilha:"" });
  const [protocoloDobras, setProtocoloDobras] = useState("7");
  const [pollockResult, setPollockResult] = useState(null);
  const [isakResult, setIsakResult] = useState(null);

  // BMR
  const [formulaBmr, setFormulaBmr] = useState("mifflin");
  const [pal, setPal] = useState("1.55");
  const [bmrResult, setBmrResult] = useState(null);
  const [getTotal, setGetTotal] = useState(null);

  // MUST
  const [mustScores, setMustScores] = useState({});
  const [mustResult, setMustResult] = useState(null);

  // SARC-F
  const [sarcfAnswers, setSarcfAnswers] = useState({});
  const [sarcfResult, setSarcfResult] = useState(null);

  // Dietary recall
  const [refeicoes, setRefeicoes] = useState({});

  // Biochemical
  const [bioquimica, setBioquimica] = useState({});

  // IPAQ
  const [ipaq, setIpaq] = useState("");

  // Evolução
  const [evolucao, setEvolucao] = useState("");
  const [condutaNutri, setCondutaNutri] = useState("");

  useEffect(() => {
    if (student?.sexo) setSexoRcq(student.sexo);
  }, [student?.sexo]);

  useEffect(() => {
    if (student?.id || student?.nome) {
      const sid = student.id || student.nome;
      const saved = loadNutriData(sid);
      if (saved) {
        setQueixaNutri(saved.queixaNutri || "");
        setHistoricoPeso(saved.historicoPeso || "");
        setAlergias(saved.alergias || []);
        setRestricoes(saved.restricoes || []);
        setSuplementos(saved.suplementos || "");
        setMedicamentos(saved.medicamentos || "");
        setCirurgias(saved.cirurgias || "");
        setDoencas(saved.doencas || []);
        setHistoricoFamiliar(saved.historicoFamiliar || []);
        setHabitosVida(saved.habitosVida || []);
        setConsumoAgua(saved.consumoAgua || "");
        setSono(saved.sono || "");
        setPesoAtual(saved.pesoAtual || student?.peso || "");
        setAlturaAtual(saved.alturaAtual || student?.altura || "");
        setCintura(saved.cintura || "");
        setQuadril(saved.quadril || "");
        setPescoco(saved.pescoco || "");
        setSexoRcq(saved.sexoRcq || student?.sexo || "");
        setFormulaBmr(saved.formulaBmr || "mifflin");
        setPal(saved.pal || "1.55");
        setMustScores(saved.mustScores || {});
        setMustResult(saved.mustResult || null);
        setSarcfAnswers(saved.sarcfAnswers || {});
        setSarcfResult(saved.sarcfResult || null);
        setRefeicoes(saved.refeicoes || {});
        setBioquimica(saved.bioquimica || {});
        setIpaq(saved.ipaq || "");
        setEvolucao(saved.evolucao || "");
        setCondutaNutri(saved.condutaNutri || "");
      }
    }
  }, [student?.id, student?.nome]);

  // Auto IMC
  useEffect(() => {
    const p = parseFloat(pesoAtual);
    const a = parseFloat(alturaAtual);
    if (p && a) {
      const r = calcIMC(p, a);
      setImcResult(r);
    } else setImcResult(null);
  }, [pesoAtual, alturaAtual]);

  // Auto RCQ
  useEffect(() => {
    const c = parseFloat(cintura);
    const q = parseFloat(quadril);
    if (c && q && sexoRcq) setRcqResult(calcRCQ(c, q, sexoRcq));
    else setRcqResult(null);
  }, [cintura, quadril, sexoRcq]);

  // Auto BIA
  useEffect(() => {
    const r = parseFloat(biaResistencia), xc = parseFloat(biaReactancia);
    const p = parseFloat(pesoBia), alt = parseFloat(alturaBia);
    if (!r || !xc || !p || !alt || !student?.sexo) { setBiaResult(null); return; }
    setBiaResult(calcBioimpedancia(r, xc, student.sexo, null, p, alt));
  }, [biaResistencia, biaReactancia, pesoBia, alturaBia, student?.sexo]);

  // Auto BMR + GET
  useEffect(() => {
    const idade = student?.dataNasc ? Math.floor((Date.now() - new Date(student.dataNasc).getTime()) / 31557600000) : null;
    const bmr = calcBMR(pesoAtual, alturaAtual, idade, student?.sexo, formulaBmr);
    setBmrResult(bmr ? Math.round(bmr) : null);
    if (bmr && pal) setGetTotal(Math.round(bmr * parseFloat(pal)));
    else setGetTotal(null);
  }, [pesoAtual, alturaAtual, student?.dataNasc, student?.sexo, formulaBmr, pal]);

  // Auto Pollock
  useEffect(() => {
    if (!student?.sexo) { setPollockResult(null); return; }
    const vals = {};
    const hasAny = Object.values(dobras).some(v => parseFloat(v));
    if (!hasAny) { setPollockResult(null); return; }
    Object.entries(dobras).forEach(([k, v]) => { vals[k] = parseFloat(v) || 0; });
    const idade = student?.dataNasc ? Math.floor((Date.now() - new Date(student.dataNasc).getTime()) / 31557600000) : null;
    if (protocoloDobras === "7") setPollockResult(calcPollock7Dobras(vals, student.sexo, idade));
    else setPollockResult(calcPollock3Dobras(vals, student.sexo, idade));
  }, [dobras, protocoloDobras, student?.sexo, student?.dataNasc]);

  // Auto ISAK
  useEffect(() => {
    const hasDobra = Object.values(isakDobras).some(v => parseFloat(v));
    const p = parseFloat(pesoBia);
    if (!hasDobra || !p || !student?.sexo) { setIsakResult(null); return; }
    const vals = {};
    Object.entries(isakDobras).forEach(([k, v]) => { vals[k] = parseFloat(v) || 0; });
    const idade = student?.dataNasc ? Math.floor((Date.now() - new Date(student.dataNasc).getTime()) / 31557600000) : null;
    setIsakResult(calcISAK6Dobras(vals, student.sexo, idade, p));
  }, [isakDobras, pesoBia, student?.sexo, student?.dataNasc]);

  const handleSave = () => {
    if (!student?.id && !student?.nome) return;
    const sid = student.id || student.nome;
    saveNutriData(sid, {
      queixaNutri, historicoPeso, alergias, restricoes, suplementos, medicamentos, cirurgias,
      doencas, historicoFamiliar, habitosVida, consumoAgua, sono,
      pesoAtual, alturaAtual, cintura, quadril, pescoco, sexoRcq,
      formulaBmr, pal,
      mustScores, mustResult, sarcfAnswers, sarcfResult,
      refeicoes, bioquimica, ipaq,
      evolucao, condutaNutri,
      data: new Date().toISOString().slice(0,10),
    });
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"0.05em" }}>🥗 Nutrição Clínica</span>
          <button onClick={() => { localStorage.removeItem("sasyra_module"); window.location.reload(); }} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um paciente para iniciar o atendimento</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Pacientes {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => { setShowForm(!showForm); setEditingStudent(null); if (!showForm) setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" }); }} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : editingStudent ? "✏️ Editando" : "+ Novo Paciente"}
          </button>
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
            <div style={{ fontSize:16, fontWeight:800, color:C.amber, marginBottom:8 }}>Editar dados do paciente</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Deseja editar os dados cadastrais de <strong>{editTarget.nome}</strong>?</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setEditTarget(null)}
                style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => {
                setF({ nome: editTarget.nome || "", dataNasc: editTarget.dataNasc || "", sexo: editTarget.sexo || "",
                  profissao: editTarget.profissao || "", convenio: editTarget.convenio || "", telefone: editTarget.telefone || "",
                  peso: editTarget.peso || "", altura: editTarget.altura || "" });
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
          <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>🥗 Nutrição Clínica</span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Anamnese"],["antropometria","📏","Antropometria"],["bioquimica","🔬","Bioquímica"],["recordatorio","🍽","Recordatório"],["evolucao","📈","Evolução"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.amberBg : "transparent",
              border: `1px solid ${tab === k ? C.amber + "50" : "transparent"}`,
              borderRadius: 8, padding: "7px 14px", fontSize: 12,
              fontWeight: tab === k ? 700 : 400,
              color: tab === k ? C.amber : C.textMuted, cursor: "pointer", fontFamily: F,
            }}>{ic} {lb}</button>
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
            <Section title="Anamnese Nutricional" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados da anamnese nutricional, histórico e hábitos do paciente.
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Queixa principal / Demanda nutricional</span>
                <textarea value={queixaNutri} onChange={e => setQueixaNutri(e.target.value)} rows={2}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.5 }) }}
                  placeholder="Ex: Desejo perder peso, Dificuldade para controlar glicemia, Ganho de peso recente..." />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Histórico de peso</span>
                  <textarea value={historicoPeso} onChange={e => setHistoricoPeso(e.target.value)} rows={2}
                    style={{ ...inp({ resize:"vertical", lineHeight:1.3, fontSize:12 }) }}
                    placeholder="Peso máximo, mínimo, variações recentes..." />
                </div>
                <div>
                  <span style={lbl()}>Consumo de água (copos/dia)</span>
                  <input type="number" value={consumoAgua} onChange={e => setConsumoAgua(e.target.value)} style={inp()} min={0} max={30} placeholder="Ex: 8" />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Alergias / Intolerâncias</span>
                <TagSelect options={["Lactose","Glúten","Ovo","Amendoim","Castanhas","Soja","Frutos do mar","Corantes","Adoçantes","Outro"]}
                  value={alergias} onChange={setAlergias} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Restrições alimentares / Preferências</span>
                <TagSelect options={["Vegetariano","Vegano","Sem glúten","Sem lactose","Dieta mediterrânea","Low-carb","Jejum intermitente","Sem restrições"]}
                  value={restricoes} onChange={setRestricoes} activeColor={C.amber} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Suplementos em uso</span>
                  <input type="text" value={suplementos} onChange={e => setSuplementos(e.target.value)} style={inp()} placeholder="Ex: Whey, Creatina, Ômega-3, Vit D..." />
                </div>
                <div>
                  <span style={lbl()}>Medicamentos em uso</span>
                  <input type="text" value={medicamentos} onChange={e => setMedicamentos(e.target.value)} style={inp()} placeholder="Ex: Metformina, Sinvastatina..." />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Cirurgias prévias / Comorbidades</span>
                <input type="text" value={cirurgias} onChange={e => setCirurgias(e.target.value)} style={inp()} placeholder="Ex: Bariátrica 2022, Colecistectomia..." />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Doenças diagnosticadas</span>
                <TagSelect options={["Diabetes tipo 2","Hipertensão","Dislipidemia","Obesidade","DOença renal","DOença hepática","DOença tireoidiana","DOença inflamatória intestinal","Transtorno alimentar","Osteoporose","Câncer"]}
                  value={doencas} onChange={setDoencas} activeColor={C.amber} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Histórico familiar</span>
                <TagSelect options={["Diabetes","Hipertensão","Obesidade","Dislipidemia","Câncer","DOença cardiovascular","DOença tireoidiana","Osteoporose"]}
                  value={historicoFamiliar} onChange={setHistoricoFamiliar} activeColor={C.amber} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Qualidade do sono</span>
                  <SingleSelect options={["Boa","Regular","Ruim"]} value={sono} onChange={setSono} activeColor={C.amber} />
                </div>
                <div>
                  <span style={lbl()}>Tabagismo / Etilismo</span>
                  <TagSelect options={["Tabagismo","Etilismo social","Etilismo frequente","Não tabagista","Não etilista"]}
                    value={habitosVida} onChange={setHabitosVida} activeColor={C.amber} />
                </div>
              </div>
            </Section>

            <Section title="Triagens Nutricionais" icon="🔍">
              <Accordion title="MUST (Malnutrition Universal Screening Tool)" icon="⚠️" defaultOpen>
                <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                  Triagem de risco de desnutrição. Some os pontos das três etapas.
                </div>
                <div style={{ marginBottom:10 }}>
                  <span style={lbl()}>IMC (kg/m²)</span>
                  {imcResult && <div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>IMC atual: {parseFloat(imcResult.imc || imcResult.value).toFixed(1)}</div>}
                  <SingleSelect options={[{ value:"0", label:`≥30 kg/m²` },{ value:"1", label:`25-30 kg/m²` },{ value:"2", label:`20-25 kg/m²` },{ value:"3", label:`<20 kg/m²` }]}
                    value={mustScores.bmi || ""} onChange={v => { const n = {...mustScores, bmi: v}; setMustScores(n); setMustResult(calcMUST(n)); }} activeColor={C.amber} />
                </div>
                <div style={{ marginBottom:10 }}>
                  <span style={lbl()}>Perda de peso involuntária (3-6 meses)</span>
                  <SingleSelect options={[{ value:"0", label:"< 5%" },{ value:"1", label:"5-10%" },{ value:"2", label:"> 10% (ou não sabe)" }]}
                    value={mustScores.perdaPeso || ""} onChange={v => { const n = {...mustScores, perdaPeso: v}; setMustScores(n); setMustResult(calcMUST(n)); }} activeColor={C.amber} />
                </div>
                <div style={{ marginBottom:10 }}>
                  <span style={lbl()}>Doença aguda com ingestão reduzida {">"} 5 dias</span>
                  <SingleSelect options={[{ value:"0", label:"Não" },{ value:"2", label:"Sim" }]}
                    value={mustScores.doencaAguda || ""} onChange={v => { const n = {...mustScores, doencaAguda: v}; setMustScores(n); setMustResult(calcMUST(n)); }} activeColor={C.amber} />
                </div>
                {mustResult && (
                  <div style={{ marginTop:12, background: `${mustResult.color}18`, border:`1px solid ${mustResult.color}50`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>MUST Score</div>
                    <div style={{ fontSize:32, fontWeight:900, color:mustResult.color }}>{mustResult.total}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:mustResult.color, marginTop:4 }}>{mustResult.risk}</div>
                  </div>
                )}
              </Accordion>

              <Accordion title="SARC-F (Sarcopenia Screening)" icon="💪">
                <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                  Triagem rápida para risco de sarcopenia. ≥4 pontos sugere sarcopenia.
                </div>
                {SARC_F.map(q => (
                  <div key={q.id} style={{ marginBottom:8 }}>
                    <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                    <SingleSelect options={q.options.map(o => ({ value:String(o.s), label:o.t }))} value={sarcfAnswers[q.id] || ""} onChange={v => {
                      const next = { ...sarcfAnswers, [q.id]: v };
                      setSarcfAnswers(next);
                      const total = Object.values(next).reduce((a, b) => a + (Number(b) || 0), 0);
                      setSarcfResult({ total, risk: total >= 4 ? "Alta probabilidade de sarcopenia" : "Baixa probabilidade", color: total >= 4 ? C.red : C.green });
                    }} activeColor={C.amber} />
                  </div>
                ))}
                {sarcfResult && (
                  <div style={{ marginTop:12, background: `${sarcfResult.color}18`, border:`1px solid ${sarcfResult.color}50`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>SARC-F</div>
                    <div style={{ fontSize:32, fontWeight:900, color:sarcfResult.color }}>{Object.values(sarcfAnswers).reduce((a,b) => a + (Number(b)||0), 0)}/10</div>
                    <div style={{ fontSize:14, fontWeight:700, color:sarcfResult.color, marginTop:4 }}>{sarcfResult.risk}</div>
                  </div>
                )}
              </Accordion>
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Anamnese</button>
            </div>
          </>
        )}

        {tab === "antropometria" && (
          <>
            <Section title="Medidas Antropométricas" icon="📏">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Peso atual (kg)" value={pesoAtual} onChange={v => { setPesoAtual(v); onUpdateStudent("peso", v); }} unit="kg" min={20} max={350} step={0.1} />
                <NumericField label="Altura (cm)" value={alturaAtual} onChange={v => { setAlturaAtual(v); onUpdateStudent("altura", v); }} unit="cm" min={50} max={250} step={0.5} />
                <NumericField label="Circ. cintura (cm)" value={cintura} onChange={setCintura} unit="cm" min={30} max={200} step={0.5} />
                <NumericField label="Circ. quadril (cm)" value={quadril} onChange={setQuadril} unit="cm" min={30} max={200} step={0.5} />
                <NumericField label="Circ. pescoço (cm)" value={pescoco} onChange={setPescoco} unit="cm" min={20} max={80} step={0.5} />
              </div>

              <div style={{ marginTop:12, marginBottom:14 }}>
                <span style={lbl()}>Sexo para RCQ</span>
                <SingleSelect options={["Feminino","Masculino"]} value={sexoRcq} onChange={setSexoRcq} activeColor={C.amber} />
              </div>

              {(imcResult || rcqResult) && (
                <div style={{ display:"grid", gridTemplateColumns: imcResult && rcqResult ? "1fr 1fr" : "1fr", gap:12, marginBottom:10 }}>
                  {imcResult && (
                    <div style={{ background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>IMC</div>
                      <div style={{ fontSize:28, fontWeight:900, color:C.amber }}>{imcResult.imc}<span style={{ fontSize:12, color:C.textMuted }}> kg/m²</span></div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text, marginTop:2 }}>{imcResult.classificacao}</div>
                    </div>
                  )}
                  {rcqResult && (
                    <div style={{ background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>RCQ</div>
                      <div style={{ fontSize:28, fontWeight:900, color:C.blue }}>{rcqResult.rcq}<span style={{ fontSize:12, color:C.textMuted }}></span></div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text, marginTop:2 }}>Risco: {rcqResult.risco}</div>
                    </div>
                  )}
                </div>
              )}

              {/* BMR */}
              <div style={{ marginTop:14 }}>
                <span style={lbl()}>Taxa Metabólica Basal (TMB) e GET</span>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                  <div>
                    <span style={{ fontSize:9, color:C.textDim }}>Fórmula</span>
                    <SingleSelect options={[{ value:"mifflin", label:"Mifflin-St Jeor" },{ value:"harris", label:"Harris-Benedict" }]} value={formulaBmr} onChange={setFormulaBmr} activeColor={C.amber} />
                  </div>
                  <div>
                    <span style={{ fontSize:9, color:C.textDim }}>Nível de atividade (PAL)</span>
                    <SingleSelect options={FAO_PAL} value={pal} onChange={setPal} activeColor={C.amber} />
                  </div>
                </div>
                {bmrResult && (
                  <div style={{ background:C.cardAlt, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ display:"flex", justifyContent:"space-around", textAlign:"center" }}>
                      <div>
                        <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>TMB</div>
                        <div style={{ fontSize:22, fontWeight:900, color:C.amber }}>{bmrResult} <span style={{ fontSize:11, color:C.textMuted }}>kcal</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>GET</div>
                        <div style={{ fontSize:22, fontWeight:900, color:C.green }}>{getTotal} <span style={{ fontSize:11, color:C.textMuted }}>kcal</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            <Section title="Bioimpedância (BIA)" icon="⚡">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <NumericField label="Peso (kg)" value={pesoBia} onChange={setPesoBia} unit="kg" min={20} max={300} step={0.1} />
                <NumericField label="Altura (cm)" value={alturaBia} onChange={setAlturaBia} unit="cm" min={50} max={250} step={0.5} />
                <NumericField label="Resistência (R)" value={biaResistencia} onChange={setBiaResistencia} unit="Ω" min={200} max={900} step={1} />
                <NumericField label="Reactância (Xc)" value={biaReactancia} onChange={setBiaReactancia} unit="Ω" min={10} max={200} step={1} />
              </div>
              {biaResult && (
                <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>% Gordura</div>
                      <div style={{ fontSize:24, fontWeight:900, color:C.purple }}>{biaResult.percentualGordura}<span style={{ fontSize:12, color:C.textMuted }}>%</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>M. Magra</div>
                      <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{biaResult.massaMagra} <span style={{ fontSize:10, color:C.textMuted }}>kg</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Ângulo de Fase</div>
                      <div style={{ fontSize:16, fontWeight:700, color:C.amber }}>{biaResult.anguloFase}°</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Água Total</div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.blue }}>{biaResult.aguaTotal} <span style={{ fontSize:10, color:C.textMuted }}>L</span></div>
                    </div>
                  </div>
                </div>
              )}
            </Section>

            <Section title="Dobras Cutâneas (Pollock / ISAK)" icon="📏">
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Protocolo</span>
                <SingleSelect options={[{ value:"7", label:"Pollock 7 Dobras" },{ value:"3", label:"Pollock 3 Dobras (abdominal, coxa, peitoral)" }]}
                  value={protocoloDobras} onChange={setProtocoloDobras} activeColor={C.amber} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:10 }}>
                {(protocoloDobras === "7" ? [
                  {id:"peitoral",label:"Peitoral"},{id:"abdominal",label:"Abdominal"},{id:"coxa",label:"Coxa"},
                  {id:"suprailiaca",label:"Suprailíaca"},{id:"subescapular",label:"Subescapular"},{id:"tricipital",label:"Tricipital"},{id:"axilarMedia",label:"Axilar Média"},
                ] : [
                  {id:"peitoral",label:"Peitoral"},{id:"abdominal",label:"Abdominal"},{id:"coxa",label:"Coxa"},
                ]).map(d => (
                  <NumericField key={d.id} label={d.label} value={dobras[d.id]} onChange={v => setDobras(p => ({...p, [d.id]: v}))} unit="mm" min={0} max={80} step={0.5} />
                ))}
              </div>
              {pollockResult && (
                <div style={{ marginTop:12, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, textAlign:"center" }}>
                    <div>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>% Gordura</div>
                      <div style={{ fontSize:24, fontWeight:900, color:C.green }}>{pollockResult.percentualGordura}<span style={{ fontSize:12, color:C.textMuted }}>%</span></div>
                    </div>
                    <div>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Densidade</div>
                      <div style={{ fontSize:18, fontWeight:700, color:C.blue }}>{pollockResult.densidadeCorporal}<span style={{ fontSize:10, color:C.textMuted }}> g/cm³</span></div>
                    </div>
                    <div>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Referência</div>
                      <div style={{ fontSize:11, fontWeight:700, color:C.amber }}>{pollockResult.referencia}</div>
                    </div>
                  </div>
                </div>
              )}
            </Section>
          </>
        )}

        {tab === "bioquimica" && (
          <Section title="Exames Bioquímicos (Referência)" icon="🔬">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.5 }}>
              Registre os valores dos exames laboratoriais mais recentes para acompanhamento.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px" }}>
              {[
                {k:"glicemiaJejum",l:"Glicemia em jejum",u:"mg/dL",ref:"< 100"},
                {k:"hbGlicada",l:"HbA1c",u:"%",ref:"< 5.7"},
                {k:"colesterolTotal",l:"Colesterol Total",u:"mg/dL",ref:"< 190"},
                {k:"hdl",l:"HDL-c",u:"mg/dL",ref:"> 40 (H) / > 50 (M)"},
                {k:"ldl",l:"LDL-c",u:"mg/dL",ref:"< 130 (óptimo < 100)"},
                {k:"triglicerides",l:"Triglicérides",u:"mg/dL",ref:"< 150"},
                {k:"creatinina",l:"Creatinina",u:"mg/dL",ref:"0.6-1.3"},
                {k:"ureia",l:"Uréia",u:"mg/dL",ref:"15-45"},
                {k:"tsh",l:"TSH",u:"mIU/L",ref:"0.5-4.5"},
                {k:"vitaminaD",l:"Vitamina D (25-OH)",u:"ng/mL",ref:"> 30"},
                {k:"ferritina",l:"Ferritina",u:"ng/mL",ref:"15-150 (M) / 30-400 (H)"},
                {k:"albumina",l:"Albumina",u:"g/dL",ref:"3.5-5.0"},
                {k:"tgp",l:"TGP / ALT",u:"U/L",ref:"< 41"},
                {k:"tgo",l:"TGO / AST",u:"U/L",ref:"< 40"},
                {k:"potassio",l:"Potássio (K+)",u:"mEq/L",ref:"3.5-5.0"},
              ].map(({k,l,u,ref}) => (
                <div key={k}>
                  <span style={lbl()}>{l}</span>
                  <div style={{ display:"flex", alignItems:"center", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" }}>
                    <input type="number" step="0.1" value={bioquimica[k] || ""} onChange={e => setBioquimica(p=>({...p,[k]:e.target.value}))}
                      style={{ ...inp({ border:"none", background:"transparent", textAlign:"center", padding:"9px 4px" }), flex:1 }} />
                    <span style={{ fontSize:10, color:C.textMuted, paddingRight:8, whiteSpace:"nowrap" }}>{u}</span>
                  </div>
                  <div style={{ fontSize:8, color:C.textDim, marginTop:2 }}>Ref: {ref}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "recordatorio" && (
          <>
            <Section title="Recordatório Alimentar 24h" icon="🍽">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:14, lineHeight:1.5 }}>
                Registre os alimentos consumidos pelo paciente no último dia. Marque os itens de cada refeição e adicione quantidades aproximadas.
              </div>
              {FOOD_GROUPS.map(grupo => (
                <Accordion key={grupo.label} title={grupo.label} icon="🍴">
                  <TagSelect options={grupo.items} value={refeicoes[grupo.label] || []} onChange={v => setRefeicoes(p => ({...p, [grupo.label]: v}))} activeColor={C.amber} />
                  <div style={{ marginTop:8 }}>
                    <span style={{ ...lbl({ fontSize:9 }) }}>Observações / Quantidades</span>
                    <input type="text" value={refeicoes[`${grupo.label}_obs`] || ""} onChange={e => setRefeicoes(p => ({...p, [`${grupo.label}_obs`]: e.target.value}))}
                      style={inp()} placeholder="Ex: 2 fatias de pão integral, 1 xícara de leite desnatado..." />
                  </div>
                </Accordion>
              ))}
            </Section>

            <Section title="Nível de Atividade Física" icon="🏃">
              <div style={{ marginBottom:10 }}>
                <span style={lbl()}>IPAQ — Nível de atividade física</span>
                <SingleSelect options={[
                  { value:"sedentario", label:"Sedentário" },
                  { value:"insuficientemente", label:"Insuficientemente ativo" },
                  { value:"ativo", label:"Ativo" },
                  { value:"muitoAtivo", label:"Muito ativo" },
                ]} value={ipaq} onChange={setIpaq} activeColor={C.amber} />
              </div>
              {ipaq && (
                <div style={{ background: ipaq === "sedentario" ? C.redBg : ipaq === "insuficientemente" ? C.amberBg : C.greenBg, border:`1px solid ${ipaq === "sedentario" ? C.red : ipaq === "insuficientemente" ? C.amber : C.green}40`, borderRadius:8, padding:"8px 12px", fontSize:12, color:C.textSub }}>
                  {ipaq === "sedentario" && "🔴 Recomendar início gradual de atividade física (≥150 min/semana de atividade aeróbica moderada)."}
                  {ipaq === "insuficientemente" && "🟡 Incentivar aumento da frequência semanal para ≥5 dias/semana."}
                  {ipaq === "ativo" && "🟢 Manter nível atual. Avaliar necessidade de variação de modalidades."}
                  {ipaq === "muitoAtivo" && "🟢 Excelente nível. Monitorar recuperação e prevenção de overtraining."}
                </div>
              )}
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Recordatório</button>
            </div>
          </>
        )}

        {tab === "evolucao" && (
          <Section title="Evolução e Conduta Nutricional" icon="📈">
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucao} onChange={e => setEvolucao(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução do paciente desde a última consulta, mudanças de hábitos, adesão ao plano alimentar, resultados de exames..." />
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Conduta / Plano alimentar</span>
              <textarea value={condutaNutri} onChange={e => setCondutaNutri(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Prescrição dietética: VET estimado, distribuição de macronutrientes, orientações específicas, suplementação se indicada..." />
            </div>

            {doencas.length > 0 && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Condições identificadas</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {doencas.map(d => (
                    <span key={d} style={{ fontSize:11, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"2px 8px" }}>{d}</span>
                  ))}
                </div>
              </div>
            )}

            {bmrResult && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Referência energética</div>
                <div style={{ fontSize:13, color:C.textSub }}>
                  TMB ({formulaBmr === "mifflin" ? "Mifflin-St Jeor" : "Harris-Benedict"}): <strong style={{color:C.text}}>{bmrResult} kcal/dia</strong> | GET: <strong style={{color:C.text}}>{getTotal} kcal/dia</strong>
                </div>
              </div>
            )}

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Evolução</button>
            </div>
          </Section>
        )}

        {tab === "evidencias" && (
          <Section title="Diretrizes Baseadas em Evidências" icon="🔬">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Diretrizes e recomendações baseadas nas condições identificadas do paciente.
            </div>
            {Object.entries(NUTRI_EVIDENCE).map(([key, condition]) => {
              const active = doencas.some(d => d.toLowerCase().includes(key)) || queixaNutri.toLowerCase().includes(key.replace(/_/g," "));
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
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {condition.escalas.map(s => (
                      <span key={s} style={{ fontSize:10, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"2px 8px" }}>{s}</span>
                    ))}
                  </div>
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
