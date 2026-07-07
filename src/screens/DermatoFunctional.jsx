import { useState, useEffect } from "react";
import { useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection } from "../components/ModuleEnhancer";
import CifAndHonorarios from "../components/CifAndHonorarios";
import CifSection from "../components/CifSection";
import { CIF } from "../data/cif";
import { AudioField, CollapsibleSection, CollapsibleSub, useMediaQuery } from "../components";
import ScaleSelector from "../components/ScaleSelector";
import AssignFromOtherModules from "../components/AssignFromOtherModules";
import GeneralAssessment from "../components/GeneralAssessment";
import LogoSVG from "../components/LogoSVG";
import { calcVancouver, calcEdema } from "../data/dermatoScales";

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
const primaryBtn = (e={}) => ({ background:C.amber, color:"#0E141B", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...e });
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

function saveDermatoData(studentId, data) {
  try { localStorage.setItem(`dermato_data_${studentId}`, JSON.stringify(data)); } catch { /* empty */ }
}
function loadDermatoData(studentId) {
  try { const d = localStorage.getItem(`dermato_data_${studentId}`); return d ? JSON.parse(d) : null; } catch { return null; }
}

const DERMATO_EVIDENCE = {
  cicatriz_hipertrofica: {
    cif:["s810","b810","b820","d510","d540"],
    label:"Cicatriz Hipertrófica / Queloide",
    goldStandard:"Massagem cicatricial progressiva (5-10 min/dia) com óleo de rosa mosqueta ou silicone. Placas de silicone (uso 12h/dia por 3-6 meses). Laserterapia de baixa potência para remodelagem. Crioterapia intralesional para queloide pequeno. Corticosteroides intralesionais (triancinolona 10-40 mg/mL a cada 4-6 semanas). Evitar exposição solar direta no primeiro ano. Evitar tensão excessiva sobre a cicatriz. Pressoterapia com malha compressiva se área extensa (20-30 mmHg). Tratamento precoce melhora resultado estético-funcional.",
    escalas:["Vancouver Scar Scale","POSAS (Patient and Observer Scar Assessment Scale)","Perimetria","Fotografia seriada","EVA dor/prurido"],
    referencias:[{ id:"Cochrane CD011464", title:"Interventions for hypertrophic scars (Cochrane 2022)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD011464/" }],
  },
  queimaduras: {
    cif:["s810","b810","b820","d510","d540","d5"],
    label:"Queimaduras",
    goldStandard:"Fase aguda: posicionamento antiedema, elevação de membros, talas de repouso para prevenir contraturas. Hidroterapia para desbridamento suave. Fase pós-enxerto: enxerto deve estar estável (≥14 dias) para iniciar mobilização. Cinesioterapia progressiva: ADM passiva → ativo-assistida → ativa. Órtese noturna para manutenção de ADM (especialmente pescoço, axila, cotovelo, mão). Pressoterapia compressiva sob medida (23-25 mmHg). Laser de baixa potência (GaAs 904nm) para redução de dor e prurido. Massagem cicatricial com creme hidratante. Silicone gel para aposição cicatricial. Reabilitação intensiva nos primeiros 6 meses pós-lesão.",
    escalas:["Vancouver Scar Scale (VSS)","Classificação de queimaduras (1ª a 4ª)","ABSI (Abbreviated Burn Severity Index)","Perimetria segmentar","EVA dor/prurido","HAQ"],
    referencias:[{ id:"Cochrane CD006887", title:"Rehabilitation for burns (Cochrane 2021)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006887/" }],
  },
  fibrose: {
    cif:["s810","s770","b710","b810","d445"],
    label:"Fibrose e Aderências",
    goldStandard:"Ultrassom terapêutico (1 MHz, 1-2 W/cm², modo contínuo, 5-7 min) para remodelagem tecidual. Liberação miofascial e mobilização de tecidos moles. Alongamento progressivo de estruturas aderidas. Cinesioterapia para deslizamento de planos teciduais. RPG (Reeducação Postural Global) para cadeias fibrosadas. Bandagem elástica funcional para facilitação de deslizamento. Laser de baixa intensidade (660-830nm) para modulação de fibrose. Crioterapia pós-sessão para controle inflamatório. Pomadas com ácido hialurônico e extrato de cebola para amolecimento cicatricial.",
    escalas:["Escala de fibrose (0-3 por área)","EVA dor","Perimetria","ADM goniométrica","Palpação de deslizamento tecidual"],
    referencias:[{ id:"JSCR 2022", title:"Manual therapy for fibrotic adhesions", url:"https://pubmed.ncbi.nlm.nih.gov/" }],
  },
  lipodistrofia: {
    cif:["s810","b810","b530","d510","d540"],
    label:"Lipodistrofia / Fibroedema Gelóide (Cellulite)",
    goldStandard:"Massagem modeladora e drenagem linfática manual para estímulo circulatório. Endermoterapia (vácuo+rolos) para quebra de septos fibróticos, 2x/semana por 10-12 sessões. Radiofrequência (433 MHz, 40-42°C) para estimulação de colágeno, 6-10 sessões. Ultrassom cavitacional de baixa frequência (40 kHz, 4-6 J/cm²) para lipólise focal. Carboxiterapia (CO2 medicinal, fluxo 2-5 L/min) para melhora da microcirculação. Laser de baixa intensidade associado à vacuoterapia. Exercício aeróbio (≥150min/semana) e fortalecimento local. Evitar sedentarismo, tabagismo e dieta hipercalórica. Resultados visíveis após 8-12 sessões combinadas.",
    escalas:["Escala de Nürnberger-Müller (grau I-IV)","Perimetria segmentar","Bioimpedância","EVA dor/sensação de peso","Fotografia seriada"],
    referencias:[{ id:"JCAD 2023", title:"Cellulite treatment: a comprehensive review", url:"https://pubmed.ncbi.nlm.nih.gov/" }],
  },
  linfedema: {
    cif:["s730","s740","b810","d445","d510"],
    label:"Linfedema",
    goldStandard:"Terapia Descongestiva Complexa (TDC): fase 1 (intensiva) com drenagem linfática manual (DLM), enfaixamento compressivo multicamadas (40-60 mmHg em MMII, 30-45 mmHg em MMSS), cuidados com a pele, cinesioterapia com bandagem. Fase 2 (manutenção): meia compressiva sob medida (classe II-III), DLM 1-2x/semana, automassagem diária, elevação do membro à noite. Contraindicações absolutas: insuficiência cardíaca descompensada, TVP ativa, infecção local ativa. Kinesio Taping pode complementar entre sessões. Exercício aquático em piscina aquecida para redução de volume. Laser de baixa potência (904nm) para redução de fibrose associada. Resultado depende de adesão ao uso de compressão contínua.",
    escalas:["Perimetria segmentar (6 pontos)","Bioimpedância","Volumetria por deslocamento de água","EVA dor/sensação de peso","Classificação ISL (0-III)"],
    referencias:[{ id:"Cochrane CD003994", title:"Compression therapy for lymphoedema (Cochrane 2021)", url:"https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003994/" }],
  },
  pos_operatorio_estetico: {
    cif:["s810","b810","b820","d510","d540"],
    label:"Pós-operatório Estético",
    goldStandard:"DLM precoce (48h pós-op) para redução de edema e hematoma: técnica suave, baixa pressão, evitando incisões. Ultrassom terapêutico pulsado a partir do 7º PO para remodelagem (1 MHz, 0,5-1 W/cm², 5 min). Laser de baixa potência (660nm, 4 J/ponto) para aceleração cicatricial a partir do 3º PO. Radiofrequência a partir da 3ª semana para estímulo de colágeno. Criolipólise não é recomendada na mesma área antes de 6 meses. Alongamentos suaves a partir da 2ª semana. Evitar:\n- Exercício intenso nas primeiras 4 semanas\n- Sol direto nas cicatrizes nos primeiros 6 meses\n- Massagem forte diretamente sobre incisões (< 30 dias)\n- Uso de cremes não prescritos antes da cicatrização completa",
    escalas:["EVA dor","Perimetria","Vancouver Scar Scale","Fotografia seriada","HAQ adaptado"],
    referencias:[{ id:"ASPS 2022", title:"Postoperative care in aesthetic surgery", url:"https://pubmed.ncbi.nlm.nih.gov/" }],
  },
};

function generateCIFDermato({ evaMov }) {
  const result = [];
  if (evaMov >= 7) result.push({ code:"b280", desc:"Sensação de dor intensa", qualifier:3 });
  else if (evaMov >= 4) result.push({ code:"b280", desc:"Sensação de dor moderada", qualifier:2 });
  else if (evaMov >= 1) result.push({ code:"b280", desc:"Sensação de dor leve", qualifier:1 });
  result.push({ code:"b810", desc:"Funções da pele", qualifier:2 });
  result.push({ code:"b820", desc:"Funções reparadoras da pele", qualifier:2 });
  return result;
}

export default function DermatoFunctional({ student, students, onSelectStudent, onAddStudent, onUpdateStudent, onUpdateStudentById, onDeleteStudent,
  plan, onUpgrade, canUseFeature, tryFeature, aiRemaining, aiLimit, hasExpansion, purchaseAIExpansion, currentModuleId, allPatients,
  onAgenda, onFinanceiro, onSubscription, planLabel }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");
  const [regiao, setRegiao] = useState("Centro-Oeste");

  const [queixaDermato, setQueixaDermato] = useState("");
  const [hdaDermato, setHdaDermato] = useState("");
  const [diagnosticoCinesioDermato, setDiagnosticoCinesioDermato] = useState("");
  const [tipoCirurgia, setTipoCirurgia] = useState("");
  const [dataCirurgia, setDataCirurgia] = useState("");
  const [queimaduraPrevia, setQueimaduraPrevia] = useState("");
  const [cicatrizesPrevias, setCicatrizesPrevias] = useState("");
  const [doencasDermato, setDoencasDermato] = useState([]);
  const [medicamentosDermato, setMedicamentosDermato] = useState("");
  const [alergiasDermato, setAlergiasDermato] = useState("");
  const [historicoTabagismo, setHistoricoTabagismo] = useState("");

  const [vancouverScores, setVancouverScores] = useState({ pigmentation:"", vascularity:"", pliability:"", height:"" });
  const [vancouverResult, setVancouverResult] = useState(null);

  const [perimetria, setPerimetria] = useState({ ponto1:"", ponto2:"", ponto3:"", ponto4:"", ponto5:"" });
  const [bioimpedancia, setBioimpedancia] = useState({ gordura:"", musculo:"", agua:"", metabolismo:"" });

  const [fibrose, setFibrose] = useState([]);
  const [fibroseSeveridade, setFibroseSeveridade] = useState({});
  const [tipoQueimadura, setTipoQueimadura] = useState("");
  const [superficieQueimada, setSuperficieQueimada] = useState("");
  const [edemaNivel, setEdemaNivel] = useState("");
  const [edemaResult, setEdemaResult] = useState(null);

  const [evolucaoDermato, setEvolucaoDermato] = useState("");

  const [expandedSections, setExpandedSections] = useState([]);
  const toggleSection = (id) => { setExpandedSections(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]); };
  const sid = student?.id || student?.nome;
  const enhancer = useEnhancer("dermatofuncional", sid, `dermato_enhancer_${sid}`);
  const [savedScales, setSavedScales] = useState(() => { try { const d = localStorage.getItem(`dermato_scales_${sid}`); return d ? JSON.parse(d) : []; } catch { return []; } });
  const handleScaleSave = (result) => {
    const next = [...savedScales, { ...result, savedAt: new Date().toISOString() }];
    setSavedScales(next);
    try { localStorage.setItem(`dermato_scales_${sid}`, JSON.stringify(next)); } catch {}
  };
  const dermatoColors = { ...C, accent: C.amber, font: F };
  const autoCifDermato = generateCIFDermato({ evaMov: enhancer.pain.evaMov });
  const matchedCif = Object.entries(DERMATO_EVIDENCE).find(([key]) =>
    (queixaDermato||"").toLowerCase().includes(key.replace(/_/g," ")) ||
    (doencasDermato||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
  );
  const cifSuggestionsDermato = matchedCif ? matchedCif[1].cif || [] : [];

  useEffect(() => {
    if (student?.id || student?.nome) {
      const saved = loadDermatoData(sid);
      if (saved) {
        setQueixaDermato(saved.queixaDermato || "");
        setHdaDermato(saved.hdaDermato || "");
        setDiagnosticoCinesioDermato(saved.diagnosticoCinesioDermato || "");
        setTipoCirurgia(saved.tipoCirurgia || "");
        setDataCirurgia(saved.dataCirurgia || "");
        setQueimaduraPrevia(saved.queimaduraPrevia || "");
        setCicatrizesPrevias(saved.cicatrizesPrevias || "");
        setDoencasDermato(saved.doencasDermato || []);
        setMedicamentosDermato(saved.medicamentosDermato || "");
        setAlergiasDermato(saved.alergiasDermato || "");
        setHistoricoTabagismo(saved.historicoTabagismo || "");
        setVancouverScores(saved.vancouverScores || { pigmentation:"", vascularity:"", pliability:"", height:"" });
        setVancouverResult(saved.vancouverResult || null);
        setPerimetria(saved.perimetria || { ponto1:"", ponto2:"", ponto3:"", ponto4:"", ponto5:"" });
        setBioimpedancia(saved.bioimpedancia || { gordura:"", musculo:"", agua:"", metabolismo:"" });
        setFibrose(saved.fibrose || []);
        setFibroseSeveridade(saved.fibroseSeveridade || {});
        setTipoQueimadura(saved.tipoQueimadura || "");
        setSuperficieQueimada(saved.superficieQueimada || "");
        setEdemaNivel(saved.edemaNivel || "");
        setEdemaResult(saved.edemaResult || null);
        setEvolucaoDermato(saved.evolucaoDermato || "");
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
    saveDermatoData(sid, {
      queixaDermato, hdaDermato, diagnosticoCinesioDermato, tipoCirurgia, dataCirurgia, queimaduraPrevia, cicatrizesPrevias,
      doencasDermato, medicamentosDermato, alergiasDermato, historicoTabagismo,
      vancouverScores, vancouverResult, perimetria, bioimpedancia,
      fibrose, fibroseSeveridade, tipoQueimadura, superficieQueimada, edemaNivel, edemaResult,
      evolucaoDermato,
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
                style={{ background:C.amber, border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#0E141B", cursor:"pointer", fontFamily:F }}>Continuar</button>
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
          {[["anamnese","📋","Anamnese"],["avaliacao","🔬","Avaliação"],["evolucao","📈","Evolução"],["sessoes","📅","Sessões"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{ background:tab === k ? C.amberBg : "transparent", border:`1px solid ${tab === k ? C.amber + "50" : "transparent"}`, borderRadius:8, padding:isMobile?"5px 10px":"7px 16px", fontSize:isMobile?11:13, fontWeight:tab === k ? 700 : 400, color:tab === k ? C.amber : C.textMuted, cursor:"pointer", fontFamily:F }}>{ic} {lb}</button>
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
              <span style={{ fontSize:12, color:C.textSub, maxWidth:isMobile?100:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.nome}</span></>
          )}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"20px 16px" }}>
        {tab === "anamnese" && (
          <>
            <Section title="Anamnese Dermatofuncional" icon="📋">
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Preencha os dados da avaliação dermatofuncional, queixa principal, histórico cirúrgico e condições de pele do paciente.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>Queixa principal dermatofuncional</span>
                  <AudioField value={queixaDermato} onChange={v => setQueixaDermato(typeof v === "function" ? v(queixaDermato) : v)} placeholder="Ex: Cicatriz hipertrófica pós-cirurgia, celulite, queimadura..." rows={2} />
                </div>
                <div>
                  <span style={lbl()}>Tipo de cirurgia (se aplicável)</span>
                  <input type="text" value={tipoCirurgia} onChange={e => setTipoCirurgia(e.target.value)} style={inp()} placeholder="Ex: Abdominoplastia, lipoaspiração, mamoplastia" />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>HDA — História da Doença Atual</span>
                <AudioField value={hdaDermato} onChange={v => setHdaDermato(typeof v === "function" ? v(hdaDermato) : v)} placeholder="Início, evolução, tratamentos anteriores, exames realizados…" rows={3} />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Diagnóstico Cinesioterapêutico (DCT)</span>
                <input type="text" value={diagnosticoCinesioDermato} onChange={e => setDiagnosticoCinesioDermato(e.target.value)} style={inp()} placeholder="Ex: Cicatriz hipertrófica com limitação funcional e alterações estéticas" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Data da cirurgia / Lesão</span>
                  <input type="date" value={dataCirurgia} onChange={e => setDataCirurgia(e.target.value)} style={inp()} />
                </div>
                <div>
                  <span style={lbl()}>Histórico de queimaduras</span>
                  <input type="text" value={queimaduraPrevia} onChange={e => setQueimaduraPrevia(e.target.value)} style={inp()} placeholder="Ex: Queimadura térmica MSD há 2 anos" />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Cicatrizes prévias (tipo, local, tempo)</span>
                <textarea value={cicatrizesPrevias} onChange={e => setCicatrizesPrevias(e.target.value)} rows={2}
                  style={{ ...inp({ resize:"vertical", lineHeight:1.3, fontSize:12 }) }}
                  placeholder="Descreva cicatrizes existentes: hipertróficas, queloides, atróficas, localização e idade da cicatriz..." />
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Doenças dermatológicas / Condições de pele</span>
                <TagSelect options={["Cicatriz hipertrófica","Queloide","Fibrose","Aderências","Lipodistrofia (celulite)","Linfedema","Queimadura","Psoríase","Eczema","Acne","Rosácea","Vitiligo","Melasma","Úlcera venosa","Úlcera por pressão"]}
                  value={doencasDermato} onChange={setDoencasDermato} activeColor={C.amber} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Medicamentos dermatológicos / Tópicos</span>
                  <input type="text" value={medicamentosDermato} onChange={e => setMedicamentosDermato(e.target.value)} style={inp()} placeholder="Ex: Silicone gel, corticoides, ácido hialurônico" />
                </div>
                <div>
                  <span style={lbl()}>Alergias (medicamentosas / tópicas)</span>
                  <input type="text" value={alergiasDermato} onChange={e => setAlergiasDermato(e.target.value)} style={inp()} placeholder="Ex: Esparadrapo, iodo, pomadas..." />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <span style={lbl()}>Histórico de tabagismo</span>
                <SingleSelect options={["Nunca fumou","Ex-tabagista (< 5 anos)","Ex-tabagista (> 5 anos)","Tabagista atual"]} value={historicoTabagismo} onChange={setHistoricoTabagismo} activeColor={C.amber} />
              </div>
            </Section>

            <GeneralAssessment storageKey="dermato" studentId={sid} colors={{ ...C, accent: C.amber }} />

            <CifSection cifSuggestions={cifSuggestionsDermato} autoCif={autoCifDermato} colors={{ ...C, green: C.green, blue: C.blue, blueBg: C.blueBg, purple: C.purple, purpleBg: C.purpleBg, surface: C.surface, card: C.card, textMuted: C.textMuted }} />

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Anamnese</button>
            </div>
          </>
        )}

        {tab === "avaliacao" && (
          <>
            <Section title="Escala de Vancouver (VSS)" icon="📏">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação de cicatrizes: Pigmentação (0-2), Vascularização (0-3), Flexibilidade (0-5), Altura (0-3). Máximo 13 pontos.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <div>
                  <span style={lbl()}>Pigmentação</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Normal" },
                    { value:"1", label:"1 - Hipo/hiprepigmentação" },
                    { value:"2", label:"2 - Hiperpigmentação" },
                  ]} value={vancouverScores.pigmentation} onChange={v => {
                    const next = { ...vancouverScores, pigmentation: v };
                    setVancouverScores(next);
                    setVancouverResult(calcVancouver(next));
                  }} activeColor={C.amber} />
                </div>
                <div>
                  <span style={lbl()}>Vascularização</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Normal" },
                    { value:"1", label:"1 - Rosa" },
                    { value:"2", label:"2 - Vermelho" },
                    { value:"3", label:"3 - Púrpura" },
                  ]} value={vancouverScores.vascularity} onChange={v => {
                    const next = { ...vancouverScores, vascularity: v };
                    setVancouverScores(next);
                    setVancouverResult(calcVancouver(next));
                  }} activeColor={C.amber} />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginTop:12 }}>
                <div>
                  <span style={lbl()}>Flexibilidade (Pliability)</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Normal" },
                    { value:"1", label:"1 - Flexível" },
                    { value:"2", label:"2 - Cedendo" },
                    { value:"3", label:"3 - Firme" },
                    { value:"4", label:"4 - Aderida" },
                    { value:"5", label:"5 - Contratura" },
                  ]} value={vancouverScores.pliability} onChange={v => {
                    const next = { ...vancouverScores, pliability: v };
                    setVancouverScores(next);
                    setVancouverResult(calcVancouver(next));
                  }} activeColor={C.amber} />
                </div>
                <div>
                  <span style={lbl()}>Altura (Height)</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Plana" },
                    { value:"1", label:"1 - < 2 mm" },
                    { value:"2", label:"2 - 2-5 mm" },
                    { value:"3", label:"3 - > 5 mm" },
                  ]} value={vancouverScores.height} onChange={v => {
                    const next = { ...vancouverScores, height: v };
                    setVancouverScores(next);
                    setVancouverResult(calcVancouver(next));
                  }} activeColor={C.amber} />
                </div>
              </div>
              {vancouverResult && (
                <div style={{ marginTop:12, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Vancouver Scar Scale</div>
                  <div style={{ fontSize:32, fontWeight:900, color:vancouverResult.color }}>{vancouverResult.total}/{vancouverResult.max}</div>
                  <div style={{ fontSize:13, color:C.textSub, marginTop:4 }}>
                    Pig: {vancouverResult.pigmentation} | Vas: {vancouverResult.vascularity} | Flex: {vancouverResult.pliability} | Alt: {vancouverResult.height}
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:vancouverResult.color, marginTop:4 }}>{vancouverResult.level}</div>
                </div>
              )}
            </Section>

            <Section title="Perimetria Segmentar" icon="📐">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Circunferência do membro em mm em diferentes pontos de referência para avaliação de edema e volumetria.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Ponto 1 (proximal)" value={perimetria.ponto1} onChange={v => setPerimetria(p => ({...p, ponto1: v}))} unit="mm" min={0} max={999} />
                <NumericField label="Ponto 2" value={perimetria.ponto2} onChange={v => setPerimetria(p => ({...p, ponto2: v}))} unit="mm" min={0} max={999} />
                <NumericField label="Ponto 3 (médio)" value={perimetria.ponto3} onChange={v => setPerimetria(p => ({...p, ponto3: v}))} unit="mm" min={0} max={999} />
                <NumericField label="Ponto 4" value={perimetria.ponto4} onChange={v => setPerimetria(p => ({...p, ponto4: v}))} unit="mm" min={0} max={999} />
                <NumericField label="Ponto 5 (distal)" value={perimetria.ponto5} onChange={v => setPerimetria(p => ({...p, ponto5: v}))} unit="mm" min={0} max={999} />
              </div>
              {Object.values(perimetria).some(v => v !== "") && (
                <div style={{ marginTop:12, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Volumetria Estimada</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.amber }}>
                    Soma: {Object.values(perimetria).reduce((a,b) => a + (Number(b)||0), 0)} mm
                  </div>
                </div>
              )}
            </Section>

            <Section title="Bioimpedância / Dobras Cutâneas" icon="⚡">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Dados de composição corporal para acompanhamento de resultados estéticos e funcionais.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"12px 16px" }}>
                <NumericField label="Gordura (%)" value={bioimpedancia.gordura} onChange={v => setBioimpedancia(p => ({...p, gordura: v}))} unit="%" min={0} max={99} step={0.1} />
                <NumericField label="Músculo (kg)" value={bioimpedancia.musculo} onChange={v => setBioimpedancia(p => ({...p, musculo: v}))} unit="kg" min={0} max={999} step={0.1} />
                <NumericField label="Água (%)" value={bioimpedancia.agua} onChange={v => setBioimpedancia(p => ({...p, agua: v}))} unit="%" min={0} max={100} step={0.1} />
                <NumericField label="Metabolismo basal" value={bioimpedancia.metabolismo} onChange={v => setBioimpedancia(p => ({...p, metabolismo: v}))} unit="kcal" min={0} max={5000} />
              </div>
            </Section>

            <Section title="Avaliação de Fibrose / Aderências" icon="🔗">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Selecione as áreas com fibrose e classifique a severidade (0 = ausente, 1 = leve, 2 = moderada, 3 = grave).
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Áreas com fibrose</span>
                <TagSelect options={["Abdome","Mamas","MMSS D","MMSS E","MMII D","MMII E","Dorso","Glúteos","Cicatriz cirúrgica","Cicatriz de queimadura"]}
                  value={fibrose} onChange={setFibrose} activeColor={C.amber} />
              </div>
              {fibrose.map(area => (
                <div key={area} style={{ marginBottom:8 }}>
                  <span style={lbl()}>Severidade — {area}</span>
                  <SingleSelect options={[
                    { value:"0", label:"0 - Ausente" },
                    { value:"1", label:"1 - Leve" },
                    { value:"2", label:"2 - Moderada" },
                    { value:"3", label:"3 - Grave" },
                  ]} value={fibroseSeveridade[area] || ""} onChange={v => setFibroseSeveridade(p => ({...p, [area]: v}))} activeColor={C.amber} />
                </div>
              ))}
            </Section>

            <Section title="Classificação de Queimaduras" icon="🔥">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Classificação da profundidade da queimadura e estimativa da superfície corporal atingida (regra dos 9).
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Grau da queimadura</span>
                <SingleSelect options={[
                  { value:"1o", label:"1º grau (epiderme)" },
                  { value:"2o_sup", label:"2º grau superficial (derme papilar)" },
                  { value:"2o_prof", label:"2º grau profundo (derme reticular)" },
                  { value:"3o", label:"3º grau (espessura total)" },
                  { value:"4o", label:"4º grau (musculo/ósseo)" },
                ]} value={tipoQueimadura} onChange={setTipoQueimadura} activeColor={C.amber} />
              </div>
              <div>
                <span style={lbl()}>Superfície corporal queimada (%)</span>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input type="number" min={0} max={100} value={superficieQueimada} onChange={e => setSuperficieQueimada(e.target.value)} style={{ ...inp({ maxWidth:100, textAlign:"center", fontSize:16, fontWeight:700 }) }} />
                  <span style={{ fontSize:13, color:C.textMuted }}>% (Regra dos 9)</span>
                </div>
              </div>
              {tipoQueimadura && (
                <div style={{ marginTop:10, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Regra dos 9 — Referência</div>
                  <div style={{ fontSize:12, color:C.textSub, lineHeight:1.8 }}>
                    Cabeça/pescoço: 9% | Tronco anterior: 18% | Tronco posterior: 18% | MMSS (cada): 9% | MMII (cada): 18% | Períneo: 1%
                  </div>
                </div>
              )}
            </Section>

            <Section title="Escala de Edema" icon="💧">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                Avaliação da intensidade do edema por digitopressão. 0 = ausente, 4 = grave (&gt;6mm).
              </div>
              <div>
                <span style={lbl()}>Nível de edema</span>
                <SingleSelect options={[
                  { value:"0", label:"0 - Ausente" },
                  { value:"1", label:"1 - Leve (< 2mm)" },
                  { value:"2", label:"2 - Moderado (2-4mm)" },
                  { value:"3", label:"3 - Acentuado (4-6mm)" },
                  { value:"4", label:"4 - Grave (> 6mm)" },
                ]} value={edemaNivel} onChange={v => {
                  setEdemaNivel(v);
                  setEdemaResult(v ? calcEdema(v) : null);
                }} activeColor={C.amber} />
              </div>
              {edemaResult && (
                <div style={{ marginTop:10, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:edemaResult.color }}>{edemaResult.description}</div>
                </div>
              )}
            </Section>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"10px 24px" })}>💾 Salvar Avaliação</button>
            </div>
            {/* 📊 Escalas Padronizadas */}
            <CollapsibleSection title="Escalas Padronizadas" icon="📊" expanded={expandedSections.includes("escalas")} onToggle={()=>toggleSection("escalas")}>
              <div style={{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.5}}>Selecione uma escala validada para aplicar ao paciente. Os resultados ficam salvos neste módulo.</div>
              <ScaleSelector scaleNames={["Vancouver Scar Scale (VSS)","POSAS (Patient and Observer Scar Assessment Scale)","LEFS (Lower Extremity Functional Scale)"]} onSave={handleScaleSave} savedResults={savedScales} />
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
              Registre a evolução do paciente dermatofuncional, resposta às intervenções estéticas e reparadoras e planejamento das próximas sessões.
            </div>
            <div style={{ marginBottom:14 }}>
              <span style={lbl()}>Evolução clínica / Observações</span>
              <textarea value={evolucaoDermato} onChange={e => setEvolucaoDermato(e.target.value)} rows={4}
                style={{ ...inp({ resize:"vertical", lineHeight:1.6 }) }}
                placeholder="Descreva a evolução desde a última sessão: melhora da cicatriz, redução de edema, ganho de ADM, aderência ao tratamento..." />
            </div>
            {vancouverResult && (
              <div style={{ background:C.cardAlt, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Última avaliação</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>
                  <strong>Vancouver:</strong> {vancouverResult.total}/13 ({vancouverResult.level}) · <strong>Edema:</strong> {edemaResult?.description || "—"} · <strong>Perimetria:</strong> {Object.values(perimetria).reduce((a,b) => a + (Number(b)||0), 0) || "—"} mm
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
            <PainSection pain={enhancer.pain} setPain={enhancer.setPain} colors={dermatoColors} />
            <RedFlagsSection redFlags={enhancer.redFlags} setRedFlags={enhancer.setRedFlags}
              flags={["Sangramento ativo","Infecção local (pus, calor, rubor)","Deiscência de sutura","Necrose tecidual","Trombose venosa profunda suspeita","Queimadura de 3º grau face/mãos/genitália","Síndrome compartimental"]}
              colors={dermatoColors} />
            <SessionLogSection logs={enhancer.logs} addLog={enhancer.addLog} colors={dermatoColors} />
            <AIAnalysisSection aiRes={enhancer.aiRes} runAI={enhancer.runAI}
              summaryText={`Paciente: ${student?.nome || "—"}\nQueixa: ${queixaDermato}\nTipo cirurgia: ${tipoCirurgia}\nData: ${dataCirurgia}\nDoenças: ${doencasDermato.join(", ")}\nVancouver: ${vancouverResult?.total || "—"}/13\nPerimetria: ${Object.values(perimetria).reduce((a,b) => a + (Number(b)||0), 0) || "—"} mm\nEdema: ${edemaResult?.description || "—"}\nFibrose: ${fibrose.join(", ")}\nEVA Mov: ${enhancer.pain.evaMov}/10\nEVA Rep: ${enhancer.pain.evaRep}/10\nDor local: ${enhancer.pain.localDor.join(", ")}\nEvolução: ${evolucaoDermato}`}
              colors={dermatoColors} />
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
              <button onClick={handleSave} style={primaryBtn({ padding:"11px 26px", fontSize:14 })}>💾 Salvar Tudo</button>
            </div>
          </>
        )}

        {tab === "relatorio" && (
          <>
            <CifAndHonorarios cifCodes={[]} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.amber} />
            <ReportSection pain={enhancer.pain} logs={enhancer.logs} redFlags={enhancer.redFlags}
              aiRes={enhancer.aiRes} patientName={student?.nome || "—"}
              moduleLabel="Fisioterapia Dermatofuncional" colors={dermatoColors} />
          </>
        )}

        {tab === "evidencias" && (() => {
          const matched = Object.entries(DERMATO_EVIDENCE).find(([key]) =>
            (queixaDermato||"").toLowerCase().includes(key.replace(/_/g," ")) ||
            (doencasDermato||[]).some(c => c.toLowerCase().includes(key.replace(/_/g," ")))
          );
          const cifCodes = matched ? matched[1].cif || [] : [];
          return (
            <>
              <CifAndHonorarios cifCodes={cifCodes} convenio={student?.convenio} regiao={regiao} setRegiao={setRegiao} sessoesAuth={student?.sessoesAuth} color={C.amber} />
              <Section title="Diretrizes e Evidências em Dermatofuncional" icon="🔬">
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
                  Diretrizes baseadas em evidências para reabilitação dermatofuncional, organizadas por condição.
                </div>
                {Object.entries(DERMATO_EVIDENCE).map(([key, condition]) => {
                  const active = queixaDermato.toLowerCase().includes(key.replace(/_/g," ")) || doencasDermato.some(c => c.toLowerCase().includes(key.replace(/_/g," ")));
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
                      <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7, marginBottom:8, whiteSpace:"pre-line" }}>{condition.goldStandard}</div>
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
