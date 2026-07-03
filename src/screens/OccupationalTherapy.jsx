import { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import { AudioField, BodyMap, EvaSlider, TagSelect, SingleSelect, GonioRow, MRCRow, TestCard, Row, HonorariosCard } from "../components";
import { useMediaQuery } from "../components";
import AssignFromOtherModules from "../components/AssignFromOtherModules";
import { useClinicalScan } from "../hooks/useClinicalScan.js";
import { useSemanticScanner } from "../hooks/useSemanticScanner.js";
import { detectLocalDor, extractClinicalEntities } from "../utils/clinicalDetection.js";
import { CIF } from "../data/cif.js";
import { calcBioimpedancia } from "../data/physicalAssessment";

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

function CollapsibleSection({ title, icon, badge, expanded, onToggle, children }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ ...card(), padding: isMobile ? "14px 12px" : "20px 22px", cursor:"pointer" }} onClick={onToggle}>
      <div style={{ display:"flex", alignItems:"center", gap:8, paddingBottom:expanded?12:0, borderBottom:expanded?`1px solid ${C.border}`:"none", marginBottom:expanded?isMobile?14:18:0 }}>
        <span style={{ fontSize:10, color:C.textMuted, transition:"transform 0.15s", transform:expanded?"rotate(90deg)":"rotate(0deg)" }}>▶</span>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:isMobile?11:12, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:C.purple, flex:1 }}>{title}</h3>
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

// ── SAVE / LOAD HELPERS ──────────────────────────────────────────────────────
function saveTOData(studentId, data) {
  try { localStorage.setItem(`to_data_${studentId}`, JSON.stringify(data)); } catch { }
}
function loadTOData(studentId) {
  try { const d = localStorage.getItem(`to_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

// ── ASSESSMENT HISTORY ──────────────────────────────────────────────────────
const TO_HISTORY_KEY = "to_history_";
function loadHistory(sid) {
  try { const d = localStorage.getItem(TO_HISTORY_KEY + sid); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveHistory(sid, history) {
  try { localStorage.setItem(TO_HISTORY_KEY + sid, JSON.stringify(history)); } catch { }
}

// ── TO GONIOMETRY (hand-focused) ────────────────────────────────────────────
const TO_GONIO_DEFAULT = [
  { joint:"Polegar — Flexão MCF", ref:"50° (40-60)", l:"", r:"" },
  { joint:"Polegar — Extensão MCF", ref:"0° (-10-0)", l:"", r:"" },
  { joint:"Polegar — Abdução palmar", ref:"70° (60-80)", l:"", r:"" },
  { joint:"Punho — Flexão", ref:"80° (70-90)", l:"", r:"" },
  { joint:"Punho — Extensão", ref:"70° (60-80)", l:"", r:"" },
  { joint:"Cotovelo — Flexão", ref:"145° (130-160)", l:"", r:"" },
  { joint:"Cotovelo — Extensão", ref:"0° (-5-0)", l:"", r:"" },
  { joint:"Ombro — Flexão", ref:"180° (170-190)", l:"", r:"" },
  { joint:"Ombro — Abdução", ref:"180° (170-190)", l:"", r:"" },
  { joint:"Ombro — Rotação externa", ref:"90° (80-100)", l:"", r:"" },
  { joint:"Ombro — Rotação interna", ref:"70° (60-80)", l:"", r:"" },
];

// ── TO MRC (hand/upper limb) ────────────────────────────────────────────────
const TO_MRC_DEFAULT = [
  { muscle:"Flexores de dedos (C8-T1)", value:5 },
  { muscle:"Extensores de dedos (C7-C8)", value:5 },
  { muscle:"Flexores de punho (C6-C7)", value:5 },
  { muscle:"Extensores de punho (C6-C7)", value:5 },
  { muscle:"Oponente do polegar (C8-T1)", value:5 },
  { muscle:"Abdutor curto polegar (C8-T1)", value:5 },
  { muscle:"Flexores de cotovelo (C5-C6)", value:5 },
  { muscle:"Extensores de cotovelo (C7-C8)", value:5 },
  { muscle:"Flexores de ombro (C5-C6)", value:5 },
  { muscle:"Abdutores de ombro (C5-C6)", value:5 },
];

// ── TO SPECIAL TESTS ─────────────────────────────────────────────────────────
const TO_TESTES = [
  { id:"jebsen_taylor", name:"Jebsen-Taylor Hand Function Test", area:"Função Manual", desc:"7 subtestes cronometrados (escrita, virar cartas, pegar objetos, simular alimentação, empilhar, mover objetos grandes leves/pesados). Normas por idade e sexo.", video:"https://www.youtube.com/watch?v=example1" },
  { id:"nine_hole", name:"Nine-Hole Peg Test", area:"Destreza Fina", desc:"Cronometra a colocação e remoção de 9 pinos. Norma 16-20s para adultos. Referência para destreza digital.", video:"https://www.youtube.com/watch?v=example2" },
  { id:"sollerman", name:"Sollerman Hand Function Test", area:"Função Manual", desc:"20 tarefas de preensão (punho, pinça, gancho, cilíndrica, esférica). Escore 0-80. Norma ≥72 para adultos saudáveis.", video:"https://www.youtube.com/watch?v=example3" },
  { id:"minnesota", name:"Minnesota Rate of Manipulation", area:"Destreza", desc:"5 subtestes de colocação, virada e deslocamento de objetos. Norma ≥60 peças/min para adultos.", video:"https://www.youtube.com/watch?v=example4" },
  { id:"box_block", name:"Box & Block Test", area:"Destreza Grossa", desc:"Transferir cubos 2.5cm de um lado para outro em 60s. Norma 50-70 blocos para adultos 20-50a.", video:"https://www.youtube.com/watch?v=example5" },
  { id:"purdue_pegboard", name:"Purdue Pegboard", area:"Coordenação Bilateral", desc:"4 subtestes: mão D, mão E, ambas mãos, montagem. Avalia destreza fina e coordenação bilateral.", video:"https://www.youtube.com/watch?v=example6" },
  { id:"copm", name:"COPM (Canadian Occupational Performance Measure)", area:"Desempenho Ocupacional", desc:"Identifica problemas de desempenho em autocuidado, produtividade e lazer. Autoavalia desempenho e satisfação de 1-10.", video:"https://www.youtube.com/watch?v=example7" },
  { id:"amputee", name:"ACT (Amputee Confidence & Capability Test)", area:"Pessoa Amputada", desc:"Avalia confiança e capacidade funcional em AVDs com e sem prótese. Adapta tarefas de mobilidade e autocuidado.", video:"https://www.youtube.com/watch?v=example8" },
  { id:"cognitive_assessment", name:"Allen Cognitive Level (ACL)", area:"Cognitivo/Função", desc:"Teste de costura em couro. Níveis 1-6 (Allen). Correlaciona com capacidade para AVDs independentes. Referência nível ≥5 para vida independente.", video:"https://www.youtube.com/watch?v=example9" },
];

// ── EVIDÊNCIAS TO ────────────────────────────────────────────────────────────
const TO_EVIDENCE = {
  avc: {
    label:"Acidente Vascular Cerebral",
    goldStandard:"Terapia orientada à tarefa repetitiva (200-600 reps/sessão) — Evidência A. Uso de CIMT (Constraint-Induced Movement Therapy) para membro superior. Treino de marcha com suporte parcial de peso. Acomodação ambiental e órteses para prevenção de deformidades.",
    escalas:["MIF","Barthel Index","DASH","Berg Balance Scale","HAQ"],
    referencias:[{ id:"Cochrane CD008349", title:"CIMT after stroke (Cochrane 2021)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD008349/" }],
    redFlags:["Perda súbita de força/fala","Dor torácica + dispneia","Cefaleia intensa súbita","Disfagia com broncoaspiração","Queda com TCE"],
  },
  paralisia_cerebral: {
    label:"Paralisia Cerebral",
    goldStandard:"Abordagem centrada na família. Treino de AVDs com adaptações. Órteses para posicionamento e prevenção de deformidades. Tecnologia assistiva (CAA, switches). Mobilidade funcional (GMFCS como prognóstico). Evidência A para terapia orientada a metas.",
    escalas:["MIF","GMFCS","MACS","HAQ"],
    redFlags:["Irritabilidade sem causa","Dificuldade alimentar progressiva","Postura assimétrica persistente","Convulsão de difícil controle","Hipotonia com desconforto respiratório"],
  },
  demencia: {
    label:"Demência / Doença de Alzheimer",
    goldStandard:"Estimulação cognitiva (CST — Cognitive Stimulation Therapy) — Evidência A. Adaptação ambiental para redução de quedas. Treino de AVDs com pistas e rotinas. Abordagem centrada na pessoa. Terapia de orientação para realidade (ROT) em estágios iniciais.",
    escalas:["MEEM / Mini-Mental","MIF","Barthel Index","Lawton IADL","HAQ"],
    referencias:[{ id:"Cochrane CD005562", title:"Cognitive stimulation therapy for dementia (Cochrane 2023)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD005562/" }],
    redFlags:["Agitação psicomotora grave","Deambulação noturna / fuga","Alucinações com risco ao paciente","Recusa alimentar total","Queda frequente com fratura"],
  },
  tea: {
    label:"Transtorno do Espectro Autista",
    goldStandard:"Integração sensorial (Ayres) — Evidência moderada. Estratégias visuais e TEACCH para rotinas. Intervenção precoce (modelo ESDM). Treino de habilidades sociais. TO com foco em regulação sensorial e AVDs.",
    escalas:["MIF","MACS","PEDI"],
    redFlags:["Autoagressão / heteroagressão","Crise de agitação prolongada","Recusa alimentar total","Regressão de habilidades","Fuga / risco de segurança"],
  },
  lesao_medular: {
    label:"Lesão Medular",
    goldStandard:"Reabilitação funcional intensiva. Treino de transferências e mobilidade funcional. Órteses e adaptações para AVDs. Tecnologia assistiva (cadeira de rodas, CAA). Estimulação elétrica funcional (FES) para membro superior em lesão C6-C7. Cuidados com integridade cutânea.",
    escalas:["MIF","HAQ","DASH","SCIM"],
    referencias:[{ id:"Cochrane CD006768", title:"FES for upper limb in SCI (Cochrane 2022)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006768/" }],
    redFlags:["Febre + sinais de infecção urinária","Lesão de pele / úlcera por pressão","Dispneia súbita (TVP/TEP)","Hipertensão autonômica refratária","Piora súbita de força em MMSS"],
  },
  osteoartrite: {
    label:"Osteoartrite",
    goldStandard:"Treino de AVDs com conservação de energia. Órteses para descarga articular. Adaptações para higiene pessoal e vestuário. Exercício terapêutico supervisionado. Evitar órtese de repouso prolongado. Evidência A para exercício + educação.",
    escalas:["HAQ","DASH","WOMAC","AUSCAN","COPM"],
    redFlags:["Deformidade articular progressiva","Dor noturna intensa","Sinais flogísticos articulares","Dificuldade para deambular","Perda funcional abrupta"],
  },
};

// ── BARTHEL INDEX (embedded) ─────────────────────────────────────────────────
const BARTHEL_QUESTIONS = [
  { id:"alimentacao", label:"Alimentação", options:[{t:"Independente",s:10},{t:"Precisa de ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"banho", label:"Banho", options:[{t:"Independente",s:5},{t:"Dependente",s:0}] },
  { id:"vestir", label:"Vestuário", options:[{t:"Independente",s:10},{t:"Precisa de ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"higiene", label:"Higiene pessoal", options:[{t:"Independente",s:5},{t:"Dependente",s:0}] },
  { id:"uso_banheiro", label:"Uso do banheiro", options:[{t:"Independente",s:10},{t:"Precisa de ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"transferencia", label:"Transferência (cama/sofá)", options:[{t:"Independente",s:15},{t:"Mínima ajuda",s:10},{t:"Grande ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"deambulacao", label:"Deambulação", options:[{t:"Independente > 50m",s:15},{t:"Independente < 50m",s:10},{t:"Cadeira de rodas",s:5},{t:"Imóvel",s:0}] },
  { id:"escadas", label:"Escadas", options:[{t:"Independente",s:10},{t:"Precisa de ajuda",s:5},{t:"Dependente",s:0}] },
  { id:"controle_bexiga", label:"Controle da bexiga", options:[{t:"Continente",s:10},{t:"Incontinência ocasional",s:5},{t:"Incontinente / Sonda",s:0}] },
  { id:"controle_intestino", label:"Controle do intestino", options:[{t:"Continente",s:10},{t:"Incontinência ocasional",s:5},{t:"Incontinente",s:0}] },
];

function calcBarthel(answers) {
  const total = BARTHEL_QUESTIONS.reduce((sum, q) => sum + (Number(answers[q.id]) || 0), 0);
  const level = total >= 100 ? "Independente" : total >= 91 ? "Leve dependência" : total >= 61 ? "Moderada dependência" : total >= 21 ? "Grave dependência" : "Total dependência";
  return { total, level, color: total >= 91 ? C.green : total >= 61 ? C.amber : C.red };
}

// ── LAWTON IADL (embedded) ──────────────────────────────────────────────────
const LAWTON_QUESTIONS = [
  { id:"telefone", label:"Usar telefone", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"compras", label:"Fazer compras", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"alimentos", label:"Preparar alimentos", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"casa", label:"Cuidados domésticos", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"lavanderia", label:"Lavar roupa", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"transporte", label:"Meio de transporte", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"medicamentos", label:"Responsabilidade medicamentos", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
  { id:"financas", label:"Lidar com finanças", options:[{t:"Independente",s:3},{t:"Precisa de ajuda",s:2},{t:"Incapaz",s:1}] },
];

function calcLawton(answers) {
  const total = LAWTON_QUESTIONS.reduce((sum, q) => sum + (Number(answers[q.id]) || 0), 0);
  const level = total === 24 ? "Independente" : total >= 16 ? "Dependência leve/moderada" : "Dependência grave";
  return { total, level, max: 24, color: total === 24 ? C.green : total >= 16 ? C.amber : C.red };
}

// ── KB CONDITIONS ────────────────────────────────────────────────────────────
function detectKBList(diagnosticoMedico, queixaTO, condicoesAssociadas) {
  const text = [diagnosticoMedico, queixaTO, ...condicoesAssociadas].join(" ").toLowerCase();
  return Object.entries(TO_EVIDENCE)
    .filter(([key]) => text.includes(key.replace(/_/g, " ")) || condicoesAssociadas.some(c => c.toLowerCase().includes(key.replace(/_/g, " "))))
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

// ── CIF AUTO KEYS ────────────────────────────────────────────────────────────
function autoCIFKeys({ barthelResult, lawtonResult, avds, aivds, barreiras, miniMental, manipulacaoFina, sensibilidade, condicoesAssociadas, queixaTO, diagnosticoMedico, pain }) {
  const keys = [];
  if (barthelResult?.total < 61) keys.push("d510", "d540");
  if (barthelResult?.total < 91) keys.push("d530", "d550");
  if (avds.length > 3) keys.push("d5");
  if (aivds.length > 2 || lawtonResult?.total < 16) keys.push("d640", "d630");
  if (barreiras.length > 0) keys.push("e150", "e155");
  if (miniMental && Number(miniMental) < 24) keys.push("b164", "b144");
  if (manipulacaoFina.length > 0) keys.push("d440");
  if (sensibilidade.some(s => s.includes("Hipoestesia") || s.includes("Ausência"))) keys.push("b265");
  if (condicoesAssociadas.some(c => c.toLowerCase().includes("avc"))) keys.push("b730", "d445");
  if (condicoesAssociadas.some(c => c.toLowerCase().includes("lesao medular") || c.toLowerCase().includes("lesão medular"))) keys.push("b730", "d465");
  if (pain?.evaRep > 0 || pain?.evaMov > 0) keys.push("b280");
  return [...new Set(keys)];
}

// ── SUGGEST DCT ──────────────────────────────────────────────────────────────
function suggestDCT(condicoesAssociadas, diagnosticoMedico, barthelResult, copmCount) {
  const text = [diagnosticoMedico, ...condicoesAssociadas].join(" ").toLowerCase();
  if (text.includes("avc")) return "Hemiparesia/hemiplegia D/E com limitação em AVDs, necessitando de treino de tarefa orientada, adaptações ambientais e órtese para MS espástico.";
  if (text.includes("lesao medular") || text.includes("lesão medular")) return "Tetraplegia/paraplegia nível " + (text.includes("cervical") ? "cervical" : "torácico/lombar") + " com dependência para AVDs e transferências, necessitando de treino funcional e tecnologia assistiva.";
  if (text.includes("demencia") || text.includes("alzheimer")) return "Declínio cognitivo com comprometimento funcional progressivo, necessitando de adaptação ambiental, pistas visuais e supervisão em AVDs para manutenção de autonomia.";
  if (text.includes("osteoartrite") || text.includes("artrose")) return "Limitação funcional por osteoartrite em MMSS/MMII, necessitando de conservação de energia, órteses para descarga e adaptações para AVDs.";
  if (barthelResult?.total < 100) return "Dependência funcional em AVDs/AIVDs com necessidade de treino ocupacional, adaptações e tecnologia assistiva para ganho de autonomia.";
  return "";
}

// ── YELLOW FLAGS ─────────────────────────────────────────────────────────────
const YELLOW_FLAGS_TO = [
  { id:"superprotecao", label:"Superproteção familiar / cuidador" },
  { id:"sedentarismo", label:"Sedentarismo / descondicionamento severo" },
  { id:"depressao", label:"Sinais de depressão/ansiedade" },
  { id:"adesao", label:"Baixa adesão ao tratamento" },
  { id:"expectativa", label:"Expectativas irreais de recuperação funcional" },
  { id:"litigio", label:"Litígio / processo judicial" },
  { id:"isolamento", label:"Isolamento social / baixa rede de apoio" },
  { id:"medo_movimento", label:"Medo de movimento / cinesiofobia" },
];

// ── MERGED RED FLAGS ─────────────────────────────────────────────────────────
function getMergedRedFlags(kbList) {
  const base = [
    "Dor súbita + perda de função","Parestesia progressiva",
    "Ferida/úlcera com sinais de infecção","Queda recente + fratura suspeita",
    "Disfagia + tosse/engasgo","Agitação psicomotora grave",
    "Ideação suicida relatada","Alucinações visuais/auditivas recentes",
  ];
  const fromKB = kbList.flatMap(k => k.redFlags || []);
  return [...new Set([...base, ...fromKB])];
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function OccupationalTherapy({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onUpdateStudentById, plan, onUpgrade, canUseFeature, tryFeature, aiRemaining, aiLimit, hasExpansion, purchaseAIExpansion, currentModuleId, allPatients }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("avaliacao");

  // Anamnese
  const [diagnosticoMedico, setDiagnosticoMedico] = useState("");
  const [queixaTO, setQueixaTO] = useState("");
  const [ocupacao, setOcupacao] = useState("");
  const [rotina, setRotina] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [acompanhante, setAcompanhante] = useState("");
  const [tecnologiaAssistiva, setTecnologiaAssistiva] = useState([]);
  const [adaptacoes, setAdaptacoes] = useState([]);
  const [condicoesAssociadas, setCondicoesAssociadas] = useState([]);

  // Domínios de desempenho
  const [avds, setAvds] = useState([]);
  const [aivds, setAivds] = useState([]);
  const [lazer, setLazer] = useState([]);
  const [trabalhoProd, setTrabalhoProd] = useState([]);

  // COPM-style goals
  const [copmGoals, setCopmGoals] = useState([]);

  // Barthel
  const [barthelAnswers, setBarthelAnswers] = useState({});
  const [barthelResult, setBarthelResult] = useState(null);

  // Lawton
  const [lawtonAnswers, setLawtonAnswers] = useState({});
  const [lawtonResult, setLawtonResult] = useState(null);

  // Função manual
  const [forcaPinça, setForcaPinça] = useState({ D:"", E:"" });
  const [forcaPreensao, setForcaPreensao] = useState({ D:"", E:"" });
  const [jebsenTime, setJebsenTime] = useState({ D:"", E:"" });
  const [manipulacaoFina, setManipulacaoFina] = useState([]);

  // Sensorial
  const [sensibilidade, setSensibilidade] = useState([]);
  const [estereognosia, setEstereognosia] = useState("");

  // Cognitivo
  const [miniMental, setMiniMental] = useState("");
  const [memoria, setMemoria] = useState([]);
  const [atencao, setAtencao] = useState([]);
  const [funcaoExecutiva, setFuncaoExecutiva] = useState([]);

  // Ambiental
  const [barreiras, setBarreiras] = useState([]);
  const [riscoQueda, setRiscoQueda] = useState("");

  // Evolução
  const [evolucao, setEvolucao] = useState("");
  const [metas, setMetas] = useState("");

  // BIA
  const [biaResistencia, setBiaResistencia] = useState("");
  const [biaReactancia, setBiaReactancia] = useState("");
  const [pesoBia, setPesoBia] = useState(student?.peso || "");
  const [alturaBia, setAlturaBia] = useState(student?.altura || "");
  const [biaResult, setBiaResult] = useState(null);

  // Advanced features
  const [diagnosticoCinesio, setDiagnosticoCinesio] = useState("");
  const [yellowFlags, setYellowFlags] = useState([]);
  const [evaMov, setEvaMov] = useState(0);
  const [evaRep, setEvaRep] = useState(0);
  const [localDor, setLocalDor] = useState([]);
  const [bodyPain, setBodyPain] = useState([]);
  const [gonioRows, setGonioRows] = useState(JSON.parse(JSON.stringify(TO_GONIO_DEFAULT)));
  const [mrcRows, setMrcRows] = useState(JSON.parse(JSON.stringify(TO_MRC_DEFAULT)));
  const [testResults, setTestResults] = useState([]);
  const [regiao, setRegiao] = useState("");
  const [expandedSections, setExpandedSections] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const sid = student?.id || student?.nome;
  const isMobile = useMediaQuery("(max-width:767px)");
  const enhancer = useEnhancer("terapia_ocupacional", sid, `to_enhancer_${sid}`);
  const toColors = { ...C, accent: C.purple, font: F };
  const { scan } = useClinicalScan();
  const { semanticScan } = useSemanticScanner();
  const kbList = detectKBList(diagnosticoMedico, queixaTO, condicoesAssociadas);
  const cifKeys = autoCIFKeys({ barthelResult, lawtonResult, avds, aivds, barreiras, miniMental, manipulacaoFina, sensibilidade, condicoesAssociadas, queixaTO, diagnosticoMedico, pain: enhancer.pain });
  const cifEntries = CIF.filter(c => cifKeys.includes(c.code));
  const mergedRedFlags = getMergedRedFlags(kbList);
  const dctSuggestion = suggestDCT(condicoesAssociadas, diagnosticoMedico, barthelResult, copmGoals.filter(g=>g.desc).length);

  const toggleSection = (id) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
    );
  };

  // Auto BIA
  useEffect(() => {
    const r = parseFloat(biaResistencia), xc = parseFloat(biaReactancia);
    const p = parseFloat(pesoBia), alt = parseFloat(alturaBia);
    if (!r || !xc || !p || !alt || !student?.sexo) { setBiaResult(null); return; }
    setBiaResult(calcBioimpedancia(r, xc, student.sexo, null, p, alt));
  }, [biaResistencia, biaReactancia, pesoBia, alturaBia, student?.sexo]);

  // Barthel auto-update
  useEffect(() => {
    const hasAnswers = Object.keys(barthelAnswers).length > 0;
    if (hasAnswers) setBarthelResult(calcBarthel(barthelAnswers));
  }, [barthelAnswers]);

  // Lawton auto-update
  useEffect(() => {
    const hasAnswers = Object.keys(lawtonAnswers).length > 0;
    if (hasAnswers) setLawtonResult(calcLawton(lawtonAnswers));
  }, [lawtonAnswers]);

  useEffect(() => {
    if (student?.id || student?.nome) {
      const sid = student.id || student.nome;
      const saved = loadTOData(sid);
      if (saved) {
        setDiagnosticoMedico(saved.diagnosticoMedico || "");
        setQueixaTO(saved.queixaTO || "");
        setOcupacao(saved.ocupacao || "");
        setRotina(saved.rotina || "");
        setDomicilio(saved.domicilio || "");
        setAcompanhante(saved.acompanhante || "");
        setTecnologiaAssistiva(saved.tecnologiaAssistiva || []);
        setAdaptacoes(saved.adaptacoes || []);
        setCondicoesAssociadas(saved.condicoesAssociadas || []);
        setAvds(saved.avds || []);
        setAivds(saved.aivds || []);
        setLazer(saved.lazer || []);
        setTrabalhoProd(saved.trabalhoProd || []);
        setCopmGoals(saved.copmGoals || []);
        setBarthelAnswers(saved.barthelAnswers || {});
        if (saved.barthelResult) setBarthelResult(saved.barthelResult);
        setLawtonAnswers(saved.lawtonAnswers || {});
        if (saved.lawtonResult) setLawtonResult(saved.lawtonResult);
        setForcaPinça(saved.forcaPinça || { D:"", E:"" });
        setForcaPreensao(saved.forcaPreensao || { D:"", E:"" });
        setJebsenTime(saved.jebsenTime || { D:"", E:"" });
        setManipulacaoFina(saved.manipulacaoFina || []);
        setSensibilidade(saved.sensibilidade || []);
        setEstereognosia(saved.estereognosia || "");
        setMiniMental(saved.miniMental || "");
        setMemoria(saved.memoria || []);
        setAtencao(saved.atencao || []);
        setFuncaoExecutiva(saved.funcaoExecutiva || []);
        setBarreiras(saved.barreiras || []);
        setRiscoQueda(saved.riscoQueda || "");
        setEvolucao(saved.evolucao || "");
        setMetas(saved.metas || "");
        setDiagnosticoCinesio(saved.diagnosticoCinesio || "");
        setYellowFlags(saved.yellowFlags || []);
        setEvaMov(saved.evaMov || 0);
        setEvaRep(saved.evaRep || 0);
        setLocalDor(saved.localDor || []);
        setBodyPain(saved.bodyPain || []);
        setGonioRows(saved.gonioRows || JSON.parse(JSON.stringify(TO_GONIO_DEFAULT)));
        setMrcRows(saved.mrcRows || JSON.parse(JSON.stringify(TO_MRC_DEFAULT)));
        setTestResults(saved.testResults || []);
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
    const sid = student.id || student.nome;
    saveTOData(sid, {
      diagnosticoMedico, queixaTO, ocupacao, rotina, domicilio, acompanhante,
      tecnologiaAssistiva, adaptacoes, condicoesAssociadas, avds, aivds, lazer, trabalhoProd,
      copmGoals, barthelAnswers, barthelResult, lawtonAnswers, lawtonResult,
      forcaPinça, forcaPreensao, jebsenTime, manipulacaoFina,
      sensibilidade, estereognosia, miniMental, memoria, atencao, funcaoExecutiva,
      barreiras, riscoQueda, evolucao, metas, diagnosticoCinesio, yellowFlags,
      evaMov, evaRep, localDor, bodyPain, gonioRows, mrcRows, testResults, expandedSections,
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
      diagnostico: diagnosticoMedico, queixa: queixaTO,
      barthel: barthelResult?.total, lawton: lawtonResult?.total,
      miniMental, avds: [...avds], aivds: [...aivds],
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
    setDiagnosticoMedico(entry.diagnostico || "");
    setQueixaTO(entry.queixa || "");
    setMiniMental(entry.miniMental || "");
    setAvds(entry.avds || []);
    setAivds(entry.aivds || []);
    setGonioRows(entry.gonioRows || JSON.parse(JSON.stringify(TO_GONIO_DEFAULT)));
    setMrcRows(entry.mrcRows || JSON.parse(JSON.stringify(TO_MRC_DEFAULT)));
    setTestResults(entry.testResults || []);
    setYellowFlags(entry.yellowFlags || []);
    setShowHistory(false);
  };

  const handleReset = () => {
    if (!window.confirm("Tem certeza? Todos os dados atuais serão perdidos.")) return;
    localStorage.removeItem(`to_data_${sid}`);
    window.location.reload();
  };

  const toggleTest = (testId) => {
    setTestResults(prev => {
      if (prev.includes(testId)) return prev.filter(x => x !== testId);
      const newTest = { ...TO_TESTES.find(t => t.id === testId), result:"+", notes:"" };
      return [...prev, newTest];
    });
  };

  // ── PATIENT LIST VIEW ─────────────────────────────────────────────────────
  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding: isMobile ? 12 : 24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"0.05em" }}>🤲 Terapia Ocupacional</span>
          <button onClick={() => { localStorage.removeItem("sasyra_module"); window.location.reload(); }} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um paciente para iniciar o atendimento</div>

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
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.purple}50` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.purple, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
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
                onAddStudent({ ...f, id:Date.now(), data:new Date().toISOString().slice(0,10), assignedModules:[currentModuleId] });
              }
              setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
              setShowForm(false);
            }} disabled={!f.nome.trim()} style={{...primaryBtn({width:"100%",justifyContent:"center",padding:"11px",fontSize:14}),opacity:f.nome.trim()?1:0.4,cursor:f.nome.trim()?"pointer":"not-allowed"}}>{editingStudent ? "Salvar Alterações" : "Cadastrar Paciente"}</button>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[...(students||[])].reverse().map(p => (
            <div key={p.id} style={{ display:"flex", gap:8, alignItems:"stretch" }}>
              <button onClick={() => { onSelectStudent(p); setStudentListView(false); }} style={{
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
                <button onClick={() => setEditTarget(p)}
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0 }}
                  title="Editar paciente">✏️</button>
                <button onClick={() => { setDeleteTarget(p); setDeleteStep(1); }}
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:40, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textDim, fontFamily:F, flexShrink:0 }}
                  title="Excluir paciente">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.red}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>{deleteStep === 1 ? "⚠️" : "🔴"}</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.red, marginBottom:8 }}>{deleteStep === 1 ? "Excluir paciente" : "Confirmação final"}</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16, padding:"8px 12px", background:C.card, borderRadius:8, border:`1px solid ${C.border}` }}>{deleteTarget.nome}</div>
            {deleteStep === 1 ? (
              <>
                <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Deseja realmente excluir <strong>{deleteTarget.nome}</strong>?</div>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}
                    style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
                  <button onClick={() => setDeleteStep(2)}
                    style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>
                  Todos os dados de avaliação de <strong>{deleteTarget.nome}</strong> serão perdidos permanentemente. <strong style={{color:C.red}}>Não pode ser desfeito</strong>.
                </div>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  <button onClick={() => { setDeleteTarget(null); setDeleteStep(1); }}
                    style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
                  <button onClick={() => { onDeleteStudent(deleteTarget); setDeleteTarget(null); setDeleteStep(1); }}
                    style={{ background:C.red, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Sim, excluir</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {editTarget && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => setEditTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.purple}`, borderRadius:16, padding:"24px 28px", maxWidth:420, width:"90%", textAlign:"center", fontFamily:F }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✏️</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.purple, marginBottom:8 }}>Editar dados do paciente</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:18, lineHeight:1.6 }}>Deseja editar os dados cadastrais de <strong>{editTarget.nome}</strong>?</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setEditTarget(null)}
                style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.textSub, cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => {
                setF({ nome:editTarget.nome||"", dataNasc:editTarget.dataNasc||"", sexo:editTarget.sexo||"", profissao:editTarget.profissao||"", convenio:editTarget.convenio||"", telefone:editTarget.telefone||"", peso:editTarget.peso||"", altura:editTarget.altura||"" });
                setEditingStudent(editTarget);
                setEditTarget(null);
                setShowForm(true);
              }} style={{ background:C.purple, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── MAIN SCREEN ───────────────────────────────────────────────────────────
  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding: isMobile ? "0 10px" : "0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height: isMobile ? 50 : 60 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })}>← Pacientes</button>
          <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>🤲 Terapia Ocupacional</span>
        </div>
        <div style={{ display:"flex", gap:4, overflowX: isMobile ? "auto" : "visible", flexShrink:1, msOverflowStyle:"none", scrollbarWidth:"none" }}>
          {[["avaliacao","📋",isMobile?"":"Avaliação"],["sessoes","📅",isMobile?"":"Sessões"],["relatorio","📊",isMobile?"":"Relatório"],["evidencias","🔬",isMobile?"":"Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? C.purpleBg : "transparent",
              border: `1px solid ${tab === k ? C.purple + "50" : "transparent"}`,
              borderRadius: 8, padding: isMobile ? "6px 10px" : "7px 14px", fontSize: isMobile ? 10 : 12,
              fontWeight: tab === k ? 700 : 400,
              whiteSpace:"nowrap",
              color: tab === k ? C.purple : C.textMuted, cursor: "pointer", fontFamily: F,
            }}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {student?.nome && (
            <>
              <div style={{ width: isMobile ? 24 : 30, height: isMobile ? 24 : 30, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile ? 10 : 13, fontWeight:800, color:C.purple }}>
                {student.nome[0]?.toUpperCase()}
              </div>
              {!isMobile && <span style={{ fontSize:12, color:C.textSub, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.nome}</span>}
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding: isMobile ? "12px 10px" : "20px 16px" }}>
        {/* ════════ TAB: AVALIAÇÃO ════════ */}
        {tab === "avaliacao" && (
          <>
            {/* 📂 Histórico de Avaliações */}
            <Section title="Histórico de Avaliações" icon="📂">
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <select value="" onChange={e=>{const idx=Number(e.target.value);if(idx>=0&&assessmentHistory[idx])handleLoadAssessment(assessmentHistory[idx])}} style={{...sel({maxWidth:260,fontSize:12})}}>
                  <option value="">Selecionar avaliação anterior...</option>
                  {assessmentHistory.map((a,i)=><option key={a.id} value={i}>{a.data} — {(a.queixa||"").slice(0,50)}</option>)}
                </select>
                <button onClick={handleSaveAssessment} style={primaryBtn({padding:"7px 16px",fontSize:12})}>💾 Salvar avaliação</button>
                <button onClick={handleReset} style={{...ghostBtn({padding:"7px 16px",fontSize:12}),color:C.amber,borderColor:`${C.amber}50`}}>🔄 Nova avaliação</button>
                {assessmentHistory.length > 0 && <span style={{fontSize:10,color:C.textMuted}}>{assessmentHistory.length} avaliação(ões) salva(s)</span>}
              </div>
            </Section>

            {/* 👤 Identificação do Paciente */}
            <CollapsibleSection title="Identificação do Paciente" icon="👤" expanded={expandedSections.includes("identificacao")} onToggle={()=>toggleSection("identificacao")}>
              <Row cols={isMobile?"1fr":"1fr 1fr 1fr"} gap="12px 16px">
                <div style={{gridColumn:isMobile?"1":"span 2"}}>
                  <span style={lbl()}>Nome completo</span>
                  <input type="text" value={student?.nome||""} style={inp()} readOnly />
                </div>
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
              <Row cols={isMobile ? "1fr" : "1fr 1fr"} gap="12px 16px">
                <div>
                  <span style={lbl()}>Diagnóstico médico / Condição principal</span>
                  <input type="text" value={diagnosticoMedico} onChange={e=>setDiagnosticoMedico(e.target.value)} style={inp()} placeholder="Ex: AVC isquêmico hemisfério E" />
                </div>
                <div>
                  <span style={lbl()}>Ocupação / Papéis ocupacionais</span>
                  <input type="text" value={ocupacao} onChange={e=>setOcupacao(e.target.value)} style={inp()} placeholder="Ex: Estudante, trabalhador, cuidador" />
                </div>
              </Row>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Queixa principal / Demanda do paciente</span>
                <AudioField value={queixaTO} onChange={v=>{const t=typeof v==="function"?v(queixaTO):v;setQueixaTO(t)}}
                  placeholder="Ex: Dificuldade para vestir-se, tomar banho e alimentar-se com independência" rows={2}
                  style={{background:C.surface,border:`1px solid ${C.purple}40`,borderRadius:8,color:C.text,fontSize:13,padding:"9px 12px",fontFamily:F,lineHeight:1.5}} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Rotina diária</span>
                <textarea value={rotina} onChange={e=>setRotina(e.target.value)} rows={2} style={{...inp({resize:"vertical",lineHeight:1.5})}} placeholder="Descreva a rotina típica do paciente (horários, atividades, suporte necessário)" />
              </div>
              <Row cols={isMobile ? "1fr" : "1fr 1fr"} gap="12px 16px" style={{marginTop:12}}>
                <div>
                  <span style={lbl()}>Tipo de domicílio</span>
                  <input type="text" value={domicilio} onChange={e=>setDomicilio(e.target.value)} style={inp()} placeholder="Casa, apartamento, escadas?" />
                </div>
                <div>
                  <span style={lbl()}>Acompanhante / Cuidador</span>
                  <input type="text" value={acompanhante} onChange={e=>setAcompanhante(e.target.value)} style={inp()} placeholder="Ex: Mãe, cuidador 24h" />
                </div>
              </Row>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Tecnologia assistiva / Adaptações em uso</span>
                <TagSelect options={["Cadeira de rodas","Andador","Bengala","Muleta","Órtese de MMSS","Órtese de MMII","Prótese","CAA","Adaptação para banho","Adaptação para alimentação"]}
                  value={tecnologiaAssistiva} onChange={setTecnologiaAssistiva} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Adaptações necessárias</span>
                <TagSelect options={["Barra de apoio","Assento sanitário elevado","Cadeira de banho","Rampa","Alargador de porta","Cama hospitalar","Cadeira para box","Tapete antiderrapante"]}
                  value={adaptacoes} onChange={setAdaptacoes} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Condições associadas</span>
                <TagSelect options={["AVC","Paralisia Cerebral","Demência","TEA","Lesão Medular","Osteoartrite","Parkinson","Esclerose Múltipla","TCE","Síndrome de Down","Amputação","Queimaduras"]}
                  value={condicoesAssociadas} onChange={setCondicoesAssociadas} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>CIF — Classificação Internacional de Funcionalidade</span>
                {cifKeys.length > 0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:4 }}>
                    {cifEntries.slice(0, 10).map(c => (
                      <span key={c.code} style={{ fontSize:11, color:C.purple, background:C.purpleBg, border:`1px solid ${C.purple}30`, borderRadius:6, padding:"3px 10px", lineHeight:1.6 }}>
                        <strong>{c.code}</strong>: {c.desc}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ marginTop:8 }}>
                  <span style={lbl()}>Diagnóstico Cinesioterapêutico (DCT)</span>
                  <input type="text" value={diagnosticoCinesio} onChange={e=>setDiagnosticoCinesio(e.target.value)} style={inp()} placeholder="Ex: Dependência em AVDs secundária a AVE com hemiparesia D" />
                  {!diagnosticoCinesio && dctSuggestion && (
                    <button onClick={()=>setDiagnosticoCinesio(dctSuggestion)}
                      style={{...ghostBtn({fontSize:10,marginTop:6}),borderStyle:"dashed"}}>
                      💡 Sugerir DCT
                    </button>
                  )}
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={{...lbl({color:C.red})}}>🚩 RED FLAGS — INVESTIGAR ANTES DE PROSSEGUIR</span>
                <TagSelect options={mergedRedFlags} value={enhancer.redFlags} onChange={enhancer.setRedFlags} activeColor={C.red} />
                {enhancer.redFlags.length > 0 && <div style={{fontSize:11,color:C.red,marginTop:4}}>⚠ {enhancer.redFlags.length} red flag(s) selecionada(s)</div>}
              </div>
            </CollapsibleSection>

            {/* ⚡ Dor e Funcionalidade */}
            <CollapsibleSection title="Dor e Funcionalidade" icon="⚡" expanded={expandedSections.includes("dor")} onToggle={()=>toggleSection("dor")}>
              <Row cols={isMobile ? "1fr" : "1fr 1fr"} gap="12px 16px">
                <div>
                  <span style={lbl()}>EVA Movimento</span>
                  <EvaSlider value={evaMov} onChange={setEvaMov} color={C.purple} />
                </div>
                <div>
                  <span style={lbl()}>EVA Repouso</span>
                  <EvaSlider value={evaRep} onChange={setEvaRep} color={C.purple} />
                </div>
              </Row>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Local da dor</span>
                <SingleSelect options={["Cabeça","Pescoço","Tronco","MMSS D","MMSS E","MMII D","MMII E","Generalizada"]}
                  value={localDor} onChange={setLocalDor} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Bandeiras Amarelas</span>
                <TagSelect options={YELLOW_FLAGS_TO.map(f => f.label)}
                  value={yellowFlags} onChange={setYellowFlags} activeColor={C.amber} />
              </div>
              <CollapsibleSub title="BodyMap — Mapa Corporal de Dor">
                <BodyMap value={bodyPain} onChange={setBodyPain} colors={{ mark:C.purple, ...C }} />
              </CollapsibleSub>
              {kbList.length > 0 && (
                <div style={{ marginTop:12, background:C.cardAlt, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.purple, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Condições identificadas pelo KB</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {kbList.map(k => (
                      <span key={k.key} style={{ fontSize:10, background:C.purpleBg, color:C.purple, border:`1px solid ${C.purple}30`, borderRadius:6, padding:"2px 8px" }}>{k.label}</span>
                    ))}
                  </div>
                </div>
              )}
            </CollapsibleSection>

            {/* 🔬 Exame Físico */}
            <CollapsibleSection title="Exame Físico" icon="🔬" expanded={expandedSections.includes("exame")} onToggle={()=>toggleSection("exame")}>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>AVDs (Atividades de Vida Diária) comprometidas</span>
                <TagSelect options={["Banho","Vestuário","Alimentação","Higiene íntima","Transferências","Mobilidade na cama","Deambulação","Uso do banheiro"]}
                  value={avds} onChange={setAvds} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>AIVDs (Atividades Instrumentais) comprometidas</span>
                <TagSelect options={["Preparar refeições","Lavar roupa","Limpeza doméstica","Compras","Uso de transporte","Gestão de finanças","Uso de telefone","Gestão de medicamentos"]}
                  value={aivds} onChange={setAivds} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Lazer e participação social comprometidos</span>
                <TagSelect options={["Hobbies / Passatempos","Esportes","Atividades religiosas","Eventos sociais","Visitas a amigos/família","Atividades ao ar livre"]}
                  value={lazer} onChange={setLazer} activeColor={C.purple} />
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Trabalho / Produtividade comprometidos</span>
                <TagSelect options={["Trabalho formal","Trabalho informal","Estudos","Voluntariado","Atividades domésticas","Cuidado de dependentes"]}
                  value={trabalhoProd} onChange={setTrabalhoProd} activeColor={C.purple} />
              </div>

              <Section title="Metas Funcionais (COPM)" icon="🎯">
                <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                  Defina até 5 metas funcionais priorizadas pelo paciente.
                </div>
                {copmGoals.map((g, i) => (
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px" }}>
                    <span style={{ fontSize:10, fontWeight:800, color:C.textDim, minWidth:20 }}>{i+1}.</span>
                    <div style={{ flex:1 }}>
                      <input type="text" value={g.desc} onChange={e => { const next = [...copmGoals]; next[i] = { ...next[i], desc: e.target.value }; setCopmGoals(next); }}
                        style={{ ...inp({ padding:"6px 10px", fontSize:12 }), marginBottom:4 }} placeholder="Descrição da meta..." />
                      <div style={{ display:"flex", gap:8 }}>
                        <div style={{ flex:1 }}><span style={{ fontSize:9, color:C.textDim }}>Desempenho (1-10)</span>
                          <input type="number" min="1" max="10" value={g.desempenho || ""} onChange={e => { const next = [...copmGoals]; next[i] = { ...next[i], desempenho: e.target.value }; setCopmGoals(next); }}
                            style={{ ...inp({ padding:"4px 8px", fontSize:11 }), textAlign:"center" }} />
                        </div>
                        <div style={{ flex:1 }}><span style={{ fontSize:9, color:C.textDim }}>Satisfação (1-10)</span>
                          <input type="number" min="1" max="10" value={g.satisfacao || ""} onChange={e => { const next = [...copmGoals]; next[i] = { ...next[i], satisfacao: e.target.value }; setCopmGoals(next); }}
                            style={{ ...inp({ padding:"4px 8px", fontSize:11 }), textAlign:"center" }} />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setCopmGoals(copmGoals.filter((_, j) => j !== i))}
                      style={{ background:"none", border:"none", color:C.red, fontSize:16, cursor:"pointer", padding:"0 4px" }}>×</button>
                  </div>
                ))}
                {copmGoals.length < 5 && (
                  <button onClick={() => setCopmGoals([...copmGoals, { desc:"", desempenho:"", satisfacao:"" }])}
                    style={{ background:"transparent", border:`1px dashed ${C.border}`, borderRadius:8, padding:"8px 12px", fontSize:12, color:C.textMuted, cursor:"pointer", width:"100%", fontFamily:F }}>
                    + Adicionar meta
                  </button>
                )}
                {copmGoals.filter(g => g.desempenho).length > 0 && (
                  <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.purple }}>
                      COPM — Desempenho: {(copmGoals.filter(g=>g.desempenho).reduce((a,g)=>a+Number(g.desempenho),0)/copmGoals.filter(g=>g.desempenho).length).toFixed(1)} | Satisfação: {(copmGoals.filter(g=>g.satisfacao).reduce((a,g)=>a+Number(g.satisfacao),0)/copmGoals.filter(g=>g.satisfacao).length).toFixed(1)}
                    </div>
                  </div>
                )}
              </Section>

              <Accordion title="Índice de Barthel (AVDs)" icon="🛁" defaultOpen>
                {BARTHEL_QUESTIONS.map(q => (
                  <div key={q.id} style={{ marginBottom:8 }}>
                    <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                    <SingleSelect options={q.options.map(o => ({ value:String(o.s), label:o.t }))} value={barthelAnswers[q.id] || ""} onChange={v => {
                      const next = { ...barthelAnswers, [q.id]: v };
                      setBarthelAnswers(next);
                    }} activeColor={C.purple} />
                  </div>
                ))}
                {barthelResult && (
                  <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Índice de Barthel</div>
                    <div style={{ fontSize:32, fontWeight:900, color:barthelResult.color }}>{barthelResult.total}/100</div>
                    <div style={{ fontSize:14, fontWeight:700, color:barthelResult.color, marginTop:4 }}>{barthelResult.level}</div>
                  </div>
                )}
              </Accordion>
              <Accordion title="Escala Lawton & Brody (AIVDs)" icon="🏠">
                {LAWTON_QUESTIONS.map(q => (
                  <div key={q.id} style={{ marginBottom:8 }}>
                    <span style={{ ...lbl({ fontSize:10, marginBottom:3 }) }}>{q.label}</span>
                    <SingleSelect options={q.options.map(o => ({ value:String(o.s), label:o.t }))} value={lawtonAnswers[q.id] || ""} onChange={v => {
                      const next = { ...lawtonAnswers, [q.id]: v };
                      setLawtonAnswers(next);
                    }} activeColor={C.purple} />
                  </div>
                ))}
                {lawtonResult && (
                  <div style={{ marginTop:12, background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Lawton & Brody</div>
                    <div style={{ fontSize:32, fontWeight:900, color:lawtonResult.color }}>{lawtonResult.total}/{lawtonResult.max}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:lawtonResult.color, marginTop:4 }}>{lawtonResult.level}</div>
                  </div>
                )}
              </Accordion>

              <Row cols={isMobile ? "1fr" : "1fr 1fr"} gap="12px 16px" style={{marginTop:14}}>
                <NumericField label="Preensão palmar D (kgf)" value={forcaPreensao.D} onChange={v => setForcaPreensao(p=>({...p,D:v}))} unit="kgf" min={0} max={80} step={0.5} />
                <NumericField label="Preensão palmar E (kgf)" value={forcaPreensao.E} onChange={v => setForcaPreensao(p=>({...p,E:v}))} unit="kgf" min={0} max={80} step={0.5} />
                <NumericField label="Pinça polpa-polegar D (kgf)" value={forcaPinça.D} onChange={v => setForcaPinça(p=>({...p,D:v}))} unit="kgf" min={0} max={20} step={0.1} />
                <NumericField label="Pinça polpa-polegar E (kgf)" value={forcaPinça.E} onChange={v => setForcaPinça(p=>({...p,E:v}))} unit="kgf" min={0} max={20} step={0.1} />
              </Row>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Sensibilidade / Estereognosia</span>
                <TagSelect options={["Tátil normal","Hipoestesia","Hiperestesia","Alodinia","Estereognosia preservada","Estereognosia prejudicada","Ausência de sensibilidade"]}
                  value={sensibilidade} onChange={setSensibilidade} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Manipulação fina comprometida</span>
                <TagSelect options={["Abrir/fechar botões","Amarrar cadarços","Escrever","Usar talheres","Pegar moedas","Enfiar agulha","Usar chave","Recortar"]}
                  value={manipulacaoFina} onChange={setManipulacaoFina} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:14 }}>
                <span style={lbl()}>MEEM / Mini-Mental (0-30)</span>
                <Row cols={isMobile ? "1fr" : "1fr 1fr"} gap="12px 16px">
                  <NumericField label="" value={miniMental} onChange={setMiniMental} min={0} max={30} />
                </Row>
                {miniMental && (
                  <div style={{ background: Number(miniMental) >= 24 ? C.greenBg : Number(miniMental) >= 18 ? C.amberBg : C.redBg, border:`1px solid ${Number(miniMental) >= 24 ? C.green : Number(miniMental) >= 18 ? C.amber : C.red}40`, borderRadius:8, padding:"8px 12px", marginTop:8 }}>
                    <span style={{ fontSize:12, fontWeight:700, color: Number(miniMental) >= 24 ? C.green : Number(miniMental) >= 18 ? C.amber : C.red }}>
                      {Number(miniMental) >= 24 ? "🟢 Normal (≥24)" : Number(miniMental) >= 18 ? "🟡 Leve comprometimento (18-23)" : "🔴 Comprometimento significativo (<18)"}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Domínios cognitivos comprometidos</span>
                <TagSelect options={["Memória recente","Memória remota","Atenção sustentada","Atenção seletiva","Função executiva","Linguagem","Orientação","Praxia","Gnosia"]}
                  value={[...memoria, ...atencao, ...funcaoExecutiva]} onChange={v => {
                    setMemoria(v.filter(x => ["Memória recente","Memória remota"].includes(x)));
                    setAtencao(v.filter(x => ["Atenção sustentada","Atenção seletiva","Orientação"].includes(x)));
                    setFuncaoExecutiva(v.filter(x => ["Função executiva","Linguagem","Praxia","Gnosia"].includes(x)));
                  }} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:14 }}>
                <span style={lbl()}>Barreiras ambientais identificadas</span>
                <TagSelect options={["Degraus / escadas sem corrimão","Banheiro sem adaptação","Portas estreitas","Tapetes soltos","Iluminação inadequada","Móveis inadequados","Acesso externo difícil","Piso escorregadio"]}
                  value={barreiras} onChange={setBarreiras} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Risco de quedas</span>
                <SingleSelect options={["Baixo","Moderado","Alto","Muito alto"]} value={riscoQueda} onChange={setRiscoQueda} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Tecnologia assistiva / Adaptações em uso</span>
                <TagSelect options={["Cadeira de rodas","Andador","Bengala","Muleta","Órtese de MMSS","Órtese de MMII","Prótese","CAA","Adaptação para banho","Adaptação para alimentação"]}
                  value={tecnologiaAssistiva} onChange={setTecnologiaAssistiva} activeColor={C.purple} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Adaptações necessárias</span>
                <TagSelect options={["Barra de apoio","Assento sanitário elevado","Cadeira de banho","Rampa","Alargador de porta","Cama hospitalar","Cadeira para box","Tapete antiderrapante"]}
                  value={adaptacoes} onChange={setAdaptacoes} activeColor={C.purple} />
              </div>
            </CollapsibleSection>

            {/* 📐 Goniometria */}
            <CollapsibleSection title="Goniometria" icon="📐" expanded={expandedSections.includes("goniometria")} onToggle={()=>toggleSection("goniometria")}>
              <Section title="Goniometria (MMSS)" icon="📐">
                {gonioRows.map((row, i) => (
                  <GonioRow key={i} joint={row.joint} ref={row.ref} l={row.l} r={row.r} index={i}
                    onChange={(idx, side, val) => setGonioRows(prev => { const p=[...prev]; p[idx]={...p[idx],[side]:val}; return p; })}
                    style={{ marginBottom:4 }} />
                ))}
              </Section>
              <Section title="Força Muscular (MRC 0-5)" icon="💪">
                {mrcRows.map((row, i) => (
                  <MRCRow key={i} muscle={row.muscle} value={row.value} index={i}
                    onChange={(idx, val) => setMrcRows(prev => { const p=[...prev]; p[idx]={...p[idx],value:val}; return p; })}
                    style={{ marginBottom:4 }} />
                ))}
              </Section>
              <Section title="Testes Especiais em TO" icon="🔬">
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {TO_TESTES.map(test => {
                    const active = testResults.some(t => t.id === test.id);
                    return (
                      <TestCard key={test.id} test={test} active={active}
                        onToggle={() => toggleTest(test.id)}
                        onNotes={(id, notes) => setTestResults(prev => prev.map(t => t.id===id?{...t,notes}:t))}
                        colors={{ accent:C.purple, ...C }} />
                    );
                  })}
                </div>
              </Section>
            </CollapsibleSection>

            {/* 💬 Observações Clínicas */}
            <CollapsibleSection title="Observações Clínicas" icon="💬" expanded={expandedSections.includes("observacoes")} onToggle={()=>toggleSection("observacoes")}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucao} onChange={e=>setEvolucao(e.target.value)} rows={4}
                style={{...inp({resize:"vertical",lineHeight:1.6})}}
                placeholder="Descreva a evolução desde a última sessão, resposta às intervenções, mudanças no desempenho ocupacional..." />
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Metas para próximas sessões</span>
                <textarea value={metas} onChange={e=>setMetas(e.target.value)} rows={3}
                  style={{...inp({resize:"vertical",lineHeight:1.6})}}
                  placeholder="Plano de tratamento, adaptações a serem implementadas, orientações para o paciente/cuidador..." />
              </div>
              {kbList.length > 0 && (
                <div style={{background:C.cardAlt,borderRadius:10,padding:"14px 16px",marginTop:12}}>
                  <div style={{fontSize:10,fontWeight:800,color:C.purple,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Condições identificadas</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {kbList.map(k => (
                      <span key={k.key} style={{fontSize:11,color:C.purple,background:C.purpleBg,border:`1px solid ${C.purple}30`,borderRadius:6,padding:"2px 8px"}}>{k.label}</span>
                    ))}
                  </div>
                </div>
              )}
              {barthelResult && (
                <div style={{background:C.cardAlt,borderRadius:10,padding:"14px 16px",marginTop:12}}>
                  <div style={{fontSize:10,fontWeight:800,color:C.purple,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Última avaliação</div>
                  <div style={{fontSize:13,color:C.textSub,lineHeight:1.7}}>
                    Barthel: <strong style={{color:barthelResult.color}}>{barthelResult.total}/100</strong> · Lawton: <strong style={{color:lawtonResult?.color}}>{lawtonResult?.total || "—"}/{lawtonResult?.max || "—"}</strong> · MEEM: <strong style={{color:Number(miniMental)>=24?C.green:Number(miniMental)>=18?C.amber:C.red}}>{miniMental || "—"}/30</strong>
                  </div>
                </div>
              )}
            </CollapsibleSection>

            {/* 🤖 Análise por IA */}
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nDiagnóstico: ${diagnosticoMedico}\nQueixa: ${queixaTO}\nOcupação: ${ocupacao}\nAVDs: ${avds.join(", ")}\nAIVDs: ${aivds.join(", ")}\nTecnologia assistiva: ${tecnologiaAssistiva.join(", ")}\nBarreiras: ${barreiras.join(", ")}\nBarthel: ${barthelResult?.total || "—"}/100\nLawton: ${lawtonResult?.total || "—"}/24\nMEEM: ${miniMental || "—"}/30\nEVA Mov: ${evaMov}/10\nEVA Rep: ${evaRep}/10\nDor local: ${localDor}\nYellow Flags: ${yellowFlags.join(", ")}\nDCT: ${diagnosticoCinesio}\nEvolução: ${evolucao}`}
              colors={toColors} />

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleReset} style={ghostBtn({ color:C.red, borderColor:C.red+"50", padding:"10px 20px" })}>🔄 Resetar</button>
              <button onClick={handleSaveAssessment} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar</button>
            </div>
          </>
        )}

        {/* ════════ TAB: SESSÕES ════════ */}
        {tab === "sessoes" && (
          <>
            <PainSection pain={enhancer.pain} setPain={enhancer.setPain} colors={toColors} />
            <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
              flags={mergedRedFlags} colors={toColors} />
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={toColors} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nDiagnóstico: ${diagnosticoMedico}\nQueixa: ${queixaTO}\nOcupação: ${ocupacao}\nAVDs: ${avds.join(", ")}\nAIVDs: ${aivds.join(", ")}\nTecnologia assistiva: ${tecnologiaAssistiva.join(", ")}\nBarreiras: ${barreiras.join(", ")}\nBarthel: ${barthelResult?.total || "—"}/100\nLawton: ${lawtonResult?.total || "—"}/24\nMEEM: ${miniMental || "—"}/30\nEVA Mov: ${enhancer.pain.evaMov || evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep || evaRep}/10\nDor local: ${enhancer.pain.localDor || localDor}\nYellow Flags: ${yellowFlags.join(", ")}\nDCT: ${diagnosticoCinesio}\nEvolução: ${evolucao}`}
              colors={toColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {/* ════════ TAB: RELATÓRIO ════════ */}
        {tab === "relatorio" && (
          <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
            aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
            moduleLabel="Terapia Ocupacional" colors={toColors} />
        )}

        {/* ════════ TAB: EVIDÊNCIAS ════════ */}
        {tab === "evidencias" && (
          <Section title="Evidências em Terapia Ocupacional" icon="🔬">
            {Object.entries(TO_EVIDENCE).map(([key, condition]) => {
              const active = condicoesAssociadas.some(c => c.toLowerCase().includes(key.replace(/_/g," "))) || diagnosticoMedico.toLowerCase().includes(key.replace(/_/g," ")) || queixaTO.toLowerCase().includes(key.replace(/_/g," "));
              return (
                <div key={key} style={{ ...card({ marginBottom:8 }), border: active ? `1px solid ${C.purple}50` : `1px solid ${C.border}`, opacity: active ? 1 : 0.6 }}>
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
        )}
      </div>
    </div>
  );
}
