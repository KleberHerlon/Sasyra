import { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import { calcPollock7Dobras, calcPollock3Dobras, calcVO2maxCooper, calcVO2maxRockport, calc1RMPreditivo, calcPercentual1RM, DOBRAS_LOCATIONS, RM_TABLE, calcISAK6Dobras, calcBioimpedancia, savePhysicalAssessment, loadPhysicalAssessments, getBFEvolution, saveTreino, loadTreinos, calcVolumeLoad, calcWeeklyVolume, calcProgression, suggestNextCycle } from "../data/physicalAssessment";
import { getDiretriz, OBJETIVOS, DIVISOES_TREINO, montarEstruturaTreino, sugerirCarga, EVIDENCIA_CARDS, getRestricoesClinicas } from "../data/exercisePrescription";
import { searchExercises, MUSCLE_GROUPS } from "../data/exercises";
import { detectMultipleKB } from "../utils/clinicalDetection";
import { detectPerformanceEntities, detectPerformanceGoals, detectRiskFactors, detectRestrictions } from "../utils/performanceDetection";
import { acsmRiskStrata, RISK_FACTOR_LABELS } from "../data/acsmRisk";
import { PSE_CR10, calcInternalLoad, calcMonotony, deloadSuggestion, PSE_COLORS } from "../data/pseFoster";
import { gerarMacrociclo, gerarMicrocicloSemanal, sugerirTransicao } from "../data/periodizacaoEngine";
import { calcIMC, calcRCQ, calcFCRegistro, FC_ZONA_CORES } from "../data/peScales";

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

function AudioField({ value, onChange, placeholder, rows }) {
  const [rec, setRec] = useState(false);
  const rRef = useState(null)[1];
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR(); r.lang = "pt-BR"; r.continuous = true; r.interimResults = false;
    r.onresult = e => { const t = Array.from(e.results).map(x => x[0].transcript).join(" "); onChange(p => (p ? p + " " + t : t)); };
    r.onend = () => setRec(false);
    rRef.current = r;
    return () => { try { r.stop(); } catch {} };
  }, [onChange, rRef]);
  const toggle = () => { if (!rRef.current) return; if (rec) { rRef.current.stop(); setRec(false); } else { rRef.current.start(); setRec(true); } };
  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  return (
    <div style={{ position:"relative" }}>
      <textarea rows={rows || 3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ ...inp({ resize:"vertical", lineHeight:1.6 }), paddingRight: supported ? 48 : 12 }} />
      {supported && (
        <button onClick={toggle} style={{
          position:"absolute", right:8, top:8, background: rec ? C.redBg : C.greenBg,
          border: `1px solid ${rec ? C.red : C.green}50`, borderRadius:8, padding:"6px 8px", cursor:"pointer",
          fontSize:12, color: rec ? C.red : C.green, fontFamily:F, fontWeight:700,
        }}>{rec ? "⏹" : "🎙"}</button>
      )}
    </div>
  );
}

function ExerciseSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(() => setResults(searchExercises(query)), 200);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ position:"relative" }}>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar exercício por nome, músculo ou grupo…"
        style={inp({ padding:"10px 14px" })} />
      {results.length > 0 && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:100, background:C.surface, border:`1px solid ${C.borderLight}`, borderRadius:10, marginTop:4, maxHeight:280, overflow:"auto", boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
          {results.map(ex => (
            <button key={ex.id} onClick={() => { onSelect(ex); setQuery(""); setResults([]); }}
              style={{ width:"100%", background:"none", border:"none", borderBottom:`1px solid ${C.border}`, padding:"10px 14px", cursor:"pointer", textAlign:"left", color:C.text, fontFamily:F, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{ex.nome}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{ex.musculoPrimario} · {ex.equipamento}</div>
              </div>
              <span style={{ fontSize:10, color:C.green, background:C.greenBg, border:`1px solid ${C.green}30`, borderRadius:6, padding:"2px 8px" }}>{ex.grupo}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseRow({ exercise, index, onRemove, onUpdate }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:10, fontWeight:800, color:C.textDim, minWidth:24, textAlign:"center" }}>{index}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{exercise.nome}</div>
          <div style={{ fontSize:10, color:C.textMuted, marginTop:1 }}>{exercise.musculoPrimario} · {exercise.equipamento}</div>
        </div>
        {onRemove && <button onClick={onRemove} style={{ background:"none", border:"none", color:C.red, fontSize:16, cursor:"pointer", padding:"0 4px" }}>×</button>}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginTop:10 }}>
        <div>
          <span style={{ fontSize:9, color:C.textDim, fontWeight:700, textTransform:"uppercase" }}>Séries</span>
          <input type="number" min="1" max="10" value={exercise.series || ""} onChange={e => onUpdate({ ...exercise, series: e.target.value })}
            style={{ ...inp({ padding:"6px 8px", fontSize:12 }), textAlign:"center" }} />
        </div>
        <div>
          <span style={{ fontSize:9, color:C.textDim, fontWeight:700, textTransform:"uppercase" }}>Repetições</span>
          <input type="text" value={exercise.repeticoes || ""} onChange={e => onUpdate({ ...exercise, repeticoes: e.target.value })}
            style={{ ...inp({ padding:"6px 8px", fontSize:12 }), textAlign:"center" }} placeholder="Ex: 8-12" />
        </div>
        <div>
          <span style={{ fontSize:9, color:C.textDim, fontWeight:700, textTransform:"uppercase" }}>Carga</span>
          <input type="text" value={exercise.carga || ""} onChange={e => onUpdate({ ...exercise, carga: e.target.value })}
            style={{ ...inp({ padding:"6px 8px", fontSize:12 }), textAlign:"center" }} placeholder="kg" />
        </div>
        <div>
          <span style={{ fontSize:9, color:C.textDim, fontWeight:700, textTransform:"uppercase" }}>Descanso</span>
          <input type="text" value={exercise.descanso || ""} onChange={e => onUpdate({ ...exercise, descanso: e.target.value })}
            style={{ ...inp({ padding:"6px 8px", fontSize:12 }), textAlign:"center" }} placeholder="seg" />
        </div>
      </div>
      {exercise.restricao && (
        <div style={{ marginTop:6, fontSize:11, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"4px 8px" }}>
          ⚠ {exercise.restricao}
        </div>
      )}
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

export default function PhysicalEducation({ student, students, onSelectStudent, onAddStudent, onUpdateStudent }) {
  const [studentListView, setStudentListView] = useState(!(student?.id || student?.nome));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const [tab, setTab] = useState("anamnese");
  const [objetivo, setObjetivo] = useState("");
  const [queixa, setQueixa] = useState("");
  const [condicoesDetectadas, setCondicoesDetectadas] = useState([]);
  const [restricoes, setRestricoes] = useState([]);
  const [nivel, setNivel] = useState("intermediario");
  const [divisao, setDivisao] = useState("ABC");

  const [dobras, setDobras] = useState({ peitoral:"", abdominal:"", coxa:"", suprailiaca:"", subescapular:"", tricipital:"", axilarMedia:"" });
  const [protocoloDobras, setProtocoloDobras] = useState("7");
  const [pollockResult, setPollockResult] = useState(null);

  const [cooperDistancia, setCooperDistancia] = useState("");
  const [cooperResult, setCooperResult] = useState(null);

  const [rockportPeso, setRockportPeso] = useState("");
  const [rockportSexo, setRockportSexo] = useState("");
  const [rockportIdade, setRockportIdade] = useState("");
  const [rockportTempo, setRockportTempo] = useState("");
  const [rockportFC, setRockportFC] = useState("");
  const [rockportResult, setRockportResult] = useState(null);

  const [rmCarga, setRmCarga] = useState("");
  const [rmRepeticoes, setRmRepeticoes] = useState("");
  const [rmResult, setRmResult] = useState(null);

  const [estruturaTreino, setEstruturaTreino] = useState([]);

  const [savedAssessments, setSavedAssessments] = useState([]);
  const [savedTreinos, setSavedTreinos] = useState([]);
  const [activeAssessmentId, setActiveAssessmentId] = useState(null);

  const [isakDobras, setIsakDobras] = useState({ tricipital:"", subescapular:"", suprailiaca:"", abdominal:"", coxa:"", panturrilha:"" });
  const [isakResult, setIsakResult] = useState(null);
  const [pesoIsak, setPesoIsak] = useState(student?.peso || "");

  const [biaResistencia, setBiaResistencia] = useState("");
  const [biaReactancia, setBiaReactancia] = useState("");
  const [biaResult, setBiaResult] = useState(null);

  const [bfEvolution, setBfEvolution] = useState([]);
  const [weeklyVolume, setWeeklyVolume] = useState([]);
  const [progressionResult, setProgressionResult] = useState(null);
  const [cycleSuggestion, setCycleSuggestion] = useState(null);

  const [perfEntities, setPerfEntities] = useState(null);
  const [acsmRisk, setAcsRisk] = useState(null);

  const [pseSessoes, setPseSessoes] = useState([]);
  const [pseAtual, setPseAtual] = useState("");
  const [pseDuracao, setPseDuracao] = useState("");
  const [pseAnalise, setPseAnalise] = useState(null);
  const [deloadSugs, setDeloadSugs] = useState([]);

  const [macrociclo, setMacrociclo] = useState(null);
  const [semanaAtual, setSemanaAtual] = useState(1);
  const [microDetalhe, setMicroDetalhe] = useState(null);
  const [transicao, setTransicao] = useState(null);

  const [imcVal, setImcVal] = useState(null);
  const [rcqVal, setRcqVal] = useState(null);
  const [fcZonas, setFcZonas] = useState(null);
  const [fcRepousoInput, setFcRepousoInput] = useState("");

  const [cintura, setCintura] = useState("");
  const [quadril, setQuadril] = useState("");

  useEffect(() => {
    if (student?.id || student?.nome) {
      const sid = student.id || student.nome;
      setSavedAssessments(loadPhysicalAssessments(sid));
      setSavedTreinos(loadTreinos(sid));
      setBfEvolution(getBFEvolution(sid));
    }
  }, [student?.id, student?.nome]);

  const handleSaveAssessment = (assessmentData) => {
    const sid = student.id || student.nome;
    const id = activeAssessmentId || `av-${Date.now()}`;
    const assessment = { id, data: new Date().toISOString().slice(0, 10), ...assessmentData };
    savePhysicalAssessment(sid, assessment);
    setActiveAssessmentId(id);
    setSavedAssessments(loadPhysicalAssessments(sid));
    setBfEvolution(getBFEvolution(sid));
  };

  const handleSaveTreino = () => {
    const sid = student.id || student.nome;
    if (!estruturaTreino.length) return;
    const treino = {
      id: `tr-${Date.now()}`,
      dataPrescricao: new Date().toISOString().slice(0, 10),
      objetivo,
      nivel,
      divisao,
      estrutura: estruturaTreino,
    };
    saveTreino(sid, treino);
    setSavedTreinos(loadTreinos(sid));
    const vol = calcWeeklyVolume(estruturaTreino);
    setWeeklyVolume(vol);
    setCycleSuggestion(suggestNextCycle(objetivo, nivel));
  };

  const handleQueixaChange = (v) => {
    const t = typeof v === "function" ? v(queixa) : v;
    setQueixa(t);
    const detected = detectMultipleKB(t);
    setCondicoesDetectadas(detected);
    const r = getRestricoesClinicas(detected);
    setRestricoes(r);

    const pe = detectPerformanceEntities(t);
    setPerfEntities(pe);
    const riskFactors = detectRiskFactors(t);
    const idade = calcIdade(student?.dataNasc);
    setAcsRisk(acsmRiskStrata(riskFactors, student?.sexo, idade));
    const pr = detectRestrictions(t);
    if (pr.length > 0) setRestricoes(prev => [...prev, ...pr]);

    const goals = detectPerformanceGoals(t);
    if (goals.length > 0) setObjetivo(goals[0]);
    else if (t.toLowerCase().includes("força") || t.toLowerCase().includes("forca")) setObjetivo("forca");
    else if (t.toLowerCase().includes("cardio") || t.toLowerCase().includes("aeróbico") || t.toLowerCase().includes("aerobico")) setObjetivo("aerobico_saude");
  };

  const calcPollock = () => {
    const vals = {};
    Object.entries(dobras).forEach(([k, v]) => { vals[k] = parseFloat(v) || 0; });
    if (protocoloDobras === "7") {
      setPollockResult(calcPollock7Dobras(vals, student.sexo, calcIdade(student.dataNasc)));
    } else {
      setPollockResult(calcPollock3Dobras(vals, student.sexo, calcIdade(student.dataNasc)));
    }
  };

  const calcCooper = () => {
    const dist = parseFloat(cooperDistancia);
    if (!dist) return;
    setCooperResult(calcVO2maxCooper(dist, student.sexo, calcIdade(student.dataNasc)));
  };

  const calcRockport = () => {
    const p = parseFloat(rockportPeso), idade = parseInt(rockportIdade), t = parseFloat(rockportTempo), fc = parseInt(rockportFC);
    if (!p || !idade || !t || !fc) return;
    setRockportResult(calcVO2maxRockport(p, rockportSexo, idade, t, fc));
  };

  const calcRM = () => {
    const carga = parseFloat(rmCarga), reps = parseInt(rmRepeticoes);
    if (!carga || !reps) return;
    setRmResult(calc1RMPreditivo(carga, reps));
  };

  const gerarTreino = () => {
    if (!objetivo) return;
    const estrutura = montarEstruturaTreino(divisao, objetivo, nivel);
    const diretriz = getDiretriz(objetivo);
    estrutura.forEach(grupo => {
      grupo.diretrizAplicada = diretriz;
      grupo.exercicios = [];
    });
    setEstruturaTreino(estrutura);
  };

  const addExercicio = (grupoKey, exercise) => {
    setEstruturaTreino(prev => prev.map(g => {
      if (g.key !== grupoKey) return g;
      const diretriz = getDiretriz(objetivo);
      return {
        ...g,
        exercicios: [...g.exercicios, {
          ...exercise,
          id: `${exercise.id}-${Date.now()}`,
          series: String(diretriz.series?.min || 3),
          repeticoes: diretriz.repeticoes ? `${diretriz.repeticoes.min}-${diretriz.repeticoes.max}` : "",
          descanso: diretriz.descanso ? `${diretriz.descanso.min}-${diretriz.descanso.max}s` : "",
        }],
      };
    }));
  };

  const updateExercicio = (grupoKey, exId, updated) => {
    setEstruturaTreino(prev => prev.map(g => {
      if (g.key !== grupoKey) return g;
      return { ...g, exercicios: g.exercicios.map(e => e.id === exId ? updated : e) };
    }));
  };

  const removeExercicio = (grupoKey, exId) => {
    setEstruturaTreino(prev => prev.map(g => {
      if (g.key !== grupoKey) return g;
      return { ...g, exercicios: g.exercicios.filter(e => e.id !== exId) };
    }));
  };

  if (studentListView) return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"0.05em" }}>🏋️ Educação Física / Performance</span>
          <button onClick={() => { localStorage.removeItem("sasyra_module"); window.location.reload(); }} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:6 }}>Selecione um aluno para iniciar o atendimento</div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Alunos {(students||[]).length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({(students||[]).length})</span>}</span>
          <button onClick={() => setShowForm(!showForm)} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : "+ Novo Aluno"}
          </button>
        </div>

        {showForm && (
          <div style={{ ...card(), marginBottom:16, border:`1px solid ${C.green}50` }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
              {[
                {k:"nome",l:"Nome completo",pl:"Nome do aluno"},
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
              onAddStudent({ ...f, id:Date.now(), data:new Date().toISOString().slice(0,10) });
              setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
              setShowForm(false);
            }} disabled={!f.nome.trim()} style={{...primaryBtn({width:"100%",justifyContent:"center",padding:"11px",fontSize:14}),opacity:f.nome.trim()?1:0.4,cursor:f.nome.trim()?"pointer":"not-allowed"}}>Cadastrar Aluno</button>
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
              <button onClick={() => setDeleteTarget(p)}
                style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer", width:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:C.textDim, fontFamily:F, flexShrink:0, transition:"all 0.12s" }}
                title="Excluir aluno">🗑</button>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000,
        }} onClick={() => setDeleteTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:"var(--surface)", border:"1px solid var(--red)", borderRadius:16, padding:"24px 28px",
            maxWidth:420, width:"90%", textAlign:"center", fontFamily:F,
          }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
            <div style={{ fontSize:16, fontWeight:800, color:"var(--red)", marginBottom:8 }}>Excluir aluno</div>
            <div style={{ fontSize:13, color:"var(--textSub)", marginBottom:4, lineHeight:1.6 }}>Tem certeza que deseja excluir permanentemente o aluno?</div>
            <div style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:16, padding:"8px 12px", background:"var(--card)", borderRadius:8, border:"1px solid var(--border)" }}>{deleteTarget.nome}</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setDeleteTarget(null)}
                style={{ background:"transparent", border:"1px solid var(--border)", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, color:"var(--textSub)", cursor:"pointer", fontFamily:F }}>Cancelar</button>
              <button onClick={() => { const p = [...(students||[])]; const idx = p.findIndex(x => (x.id||x.nome) === (deleteTarget.id||deleteTarget.nome)); if(idx>=0){p.splice(idx,1);} setDeleteTarget(null); }}
                style={{ background:"var(--red)", border:"none", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:F }}>Sim, excluir</button>
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
          <button onClick={() => setStudentListView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })}>← Alunos</button>
          <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>
            🏋️ Educação Física / Performance
          </span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["anamnese","📋","Anamnese"],["avaliacao","🔬","Avaliação Física"],["prescricao","📝","Prescrição"],["evidencias","🔬","Evidências"]].map(([k,ic,lb]) => (
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
          <button onClick={() => window.print()} style={ghostBtn({ padding:"5px 10px", fontSize:11 })}>🖨️ PDF</button>
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
          <Section title="Anamnese e Mapeamento de Objetivos" icon="📋">
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:14, lineHeight:1.6 }}>
              Descreva o objetivo principal, restrições clínicas e queixas do aluno. O sistema detectará automaticamente restrições e metas.
            </div>
            <div>
              <span style={lbl()}>Objetivo Principal / Queixa</span>
              <AudioField value={queixa} onChange={handleQueixaChange}
                placeholder="Ex: Aluno busca hipertrofia de MMSS, emagrecimento, relata condromalácia patelar no joelho E…" rows={3} />
            </div>

            {condicoesDetectadas.length > 0 && (
              <div style={{ marginTop:12, background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.blue, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
                  🔍 Condições identificadas na queixa
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {condicoesDetectadas.map(c => (
                    <span key={c} style={{ fontSize:11, color:C.blue, background:C.blueBg, border:`1px solid ${C.blue}30`, borderRadius:6, padding:"3px 10px" }}>
                      {c.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {restricoes.length > 0 && (
              <div style={{ marginTop:12 }}>
                {restricoes.map((r, i) => (
                  <div key={i} style={{ background: r.tipo === "alerta" ? C.redBg : C.amberBg, border:`1px solid ${r.tipo === "alerta" ? C.red : C.amber}40`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:14 }}>{r.tipo === "alerta" ? "🚫" : "⚠️"}</span>
                      <span style={{ fontWeight:700, fontSize:12, color: r.tipo === "alerta" ? C.red : C.amber }}>{r.local}</span>
                    </div>
                    <div style={{ fontSize:12, color:C.textSub, lineHeight:1.6 }}>{r.descricao || r.alerta}</div>
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:6, fontStyle:"italic" }}>{r.evidencia}</div>
                  </div>
                ))}
              </div>
            )}

            {acsmRisk && (
              <div style={{ marginTop:12, background: `${acsmRisk.cor}12`, border:`1px solid ${acsmRisk.cor}50`, borderRadius:10, padding:"12px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:16 }}>{acsmRisk.estagio === 3 ? "🔴" : acsmRisk.estagio === 2 ? "🟡" : "🟢"}</span>
                  <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", color: acsmRisk.cor }}>
                    Estratificação de Risco ACSM — {acsmRisk.label}
                  </span>
                </div>
                <div style={{ fontSize:12, color:C.textSub, lineHeight:1.6, marginBottom:6 }}>{acsmRisk.descricao}</div>
                <div style={{ fontSize:11, color: acsmRisk.cor, background:`${acsmRisk.cor}18`, borderRadius:6, padding:"6px 10px", lineHeight:1.5 }}>
                  📋 {acsmRisk.recomendacao}
                </div>
                {acsmRisk.fatoresIdentificados?.length > 0 && (
                  <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                    {acsmRisk.fatoresIdentificados.map(f => (
                      <span key={f} style={{ fontSize:10, color:C.textMuted, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"2px 8px" }}>
                        {RISK_FACTOR_LABELS[f] || f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop:16 }}>
              <span style={lbl()}>Objetivo do Treino</span>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:6 }}>
                {OBJETIVOS.map(o => (
                  <button key={o.id} onClick={() => setObjetivo(o.id)} style={iconBtn(objetivo === o.id, C.green)}>
                    {objetivo === o.id && <span style={{fontSize:10}}>✓ </span>}{o.icon} {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop:16 }}>
              <span style={lbl()}>Nível do Aluno</span>
              <SingleSelect options={[{ value:"iniciante", label:"Iniciante" }, { value:"intermediario", label:"Intermediário" }, { value:"avancado", label:"Avançado" }]}
                value={nivel} onChange={setNivel} />
            </div>
          </Section>
        )}

        {tab === "avaliacao" && (
          <>
            <Accordion title="Composição Corporal — Protocolo de Pollock" icon="📏" defaultOpen>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:12, lineHeight:1.6 }}>
                Protocolo de Pollock de {protocoloDobras === "7" ? "7" : "3"} dobras cutâneas. Selecione o protocolo e preencha as medidas em milímetros.
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={lbl()}>Protocolo</span>
                <SingleSelect options={[{ value:"7", label:"Pollock 7 Dobras (completo)" }, { value:"3", label:"Pollock 3 Dobras (abdominal, coxa, peitoral)" }]}
                  value={protocoloDobras} onChange={setProtocoloDobras} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:10 }}>
                {(protocoloDobras === "7" ? DOBRAS_LOCATIONS : DOBRAS_LOCATIONS.filter(d => ["peitoral","abdominal","coxa"].includes(d.id))).map(d => (
                  <NumericField key={d.id} label={d.label} value={dobras[d.id]} onChange={v => setDobras(p => ({ ...p, [d.id]: v }))} unit="mm" min={0} max={80} step={0.5} />
                ))}
              </div>
              {(protocoloDobras === "7" ? DOBRAS_LOCATIONS : DOBRAS_LOCATIONS.filter(d => ["peitoral","abdominal","coxa"].includes(d.id))).map(d => (
                <div key={`desc-${d.id}`} style={{ fontSize:10, color:C.textDim, marginTop:2, marginBottom:4 }}>{d.desc}</div>
              ))}
              <button onClick={calcPollock} style={{ ...primaryBtn(), marginTop:12 }}>Calcular % de Gordura</button>
              {pollockResult && (
                <div style={{ marginTop:12, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>% Gordura</div>
                      <div style={{ fontSize:28, fontWeight:900, color:C.green }}>{pollockResult.percentualGordura}<span style={{ fontSize:14, color:C.textMuted }}>%</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Densidade</div>
                      <div style={{ fontSize:20, fontWeight:700, color:C.blue }}>{pollockResult.densidadeCorporal}<span style={{ fontSize:12, color:C.textMuted }}> g/cm³</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Protocolo</div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.amber }}>{pollockResult.protocolo}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:10, color:C.textMuted, marginTop:10, fontStyle:"italic" }}>{pollockResult.referencia}</div>
                </div>
              )}
            </Accordion>

            <Accordion title="Composição Corporal — ISAK (6 Dobras)" icon="📏">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:12, lineHeight:1.6 }}>
                Protocolo ISAK de 6 dobras cutâneas. Preencha as medidas em milímetros e o peso do aluno.
              </div>
              <div style={{ marginBottom:10 }}>
                <NumericField label="Peso do Aluno" value={pesoIsak} onChange={setPesoIsak} unit="kg" min={30} max={300} step={0.1} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:10 }}>
                {[
                  { id:"tricipital", label:"Tricipital", desc:"Ponto médio entre acrômio e olécrano, face posterior" },
                  { id:"subescapular", label:"Subescapular", desc:"2 cm abaixo do ângulo inferior da escápula, diagonal 45°" },
                  { id:"suprailiaca", label:"Supra-ilíaca", desc:"Acima da crista ilíaca, linha axilar média, diagonal" },
                  { id:"abdominal", label:"Abdominal", desc:"2 cm à direita da cicatriz umbilical, vertical" },
                  { id:"coxa", label:"Coxa", desc:"Ponto médio entre prega inguinal e borda proximal da patela" },
                  { id:"panturrilha", label:"Panturrilha Medial", desc:"Maior perímetro da panturrilha, prega vertical, perna relaxada" },
                ].map(d => (
                  <div key={d.id}>
                    <NumericField label={d.label} value={isakDobras[d.id]} onChange={v => setIsakDobras(p => ({ ...p, [d.id]: v }))} unit="mm" min={0} max={80} step={0.5} />
                    <div style={{ fontSize:9, color:C.textDim, marginTop:1 }}>{d.desc}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                const vals = {};
                Object.entries(isakDobras).forEach(([k, v]) => { vals[k] = parseFloat(v) || 0; });
                const p = parseFloat(pesoIsak) || 0;
                if (p) setIsakResult(calcISAK6Dobras(vals, student.sexo, calcIdade(student.dataNasc), p));
              }} style={{ ...primaryBtn(), marginTop:12 }}>Calcular % Gordura (ISAK)</button>
              {isakResult && (
                <div style={{ marginTop:12, background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>% Gordura</div>
                      <div style={{ fontSize:24, fontWeight:900, color:C.blue }}>{isakResult.percentualGordura}<span style={{ fontSize:12, color:C.textMuted }}>%</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Massa Gorda</div>
                      <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{isakResult.massaGorda || "—"} <span style={{ fontSize:10, color:C.textMuted }}>kg</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Massa Magra</div>
                      <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{isakResult.massaMagra || "—"} <span style={{ fontSize:10, color:C.textMuted }}>kg</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Protocolo</div>
                      <div style={{ fontSize:12, fontWeight:700, color:C.amber }}>{isakResult.protocolo}</div>
                    </div>
                   </div>
                  <div style={{ fontSize:9, color:C.textMuted, marginTop:8, fontStyle:"italic" }}>{isakResult.referencia}</div>
                </div>
              )}
            </Accordion>

            <Accordion title="Composição Corporal — Bioimpedância (BIA)" icon="⚡">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:12, lineHeight:1.6 }}>
                Valores obtidos do aparelho de bioimpedância. Preencha resistência (R) e reactância (Xc) em ohms.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <NumericField label="Resistência (R)" value={biaResistencia} onChange={setBiaResistencia} unit="Ω" min={200} max={900} step={1} />
                <NumericField label="Reactância (Xc)" value={biaReactancia} onChange={setBiaReactancia} unit="Ω" min={10} max={200} step={1} />
              </div>
              <button onClick={() => {
                const r = parseFloat(biaResistencia), xc = parseFloat(biaReactancia);
                const p = parseFloat(student.peso) || 0;
                const alt = parseFloat(student.altura) || 0;
                if (r && xc && p && alt) setBiaResult(calcBioimpedancia(r, xc, student.sexo, calcIdade(student.dataNasc), p, alt));
              }} style={{ ...primaryBtn(), marginTop:12 }}>Calcular Composição (BIA)</button>
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
                  <div style={{ fontSize:9, color:C.textMuted, marginTop:8, fontStyle:"italic" }}>{biaResult.referencia}</div>
                </div>
              )}
            </Accordion>

            {bfEvolution.length > 0 && (
              <Accordion title={`Evolução do % de Gordura (${bfEvolution.length} avaliações)`} icon="📈" defaultOpen>
                <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:120, padding:"8px 4px" }}>
                  {bfEvolution.map((pt, i) => {
                    const h = (pt.percentualGordura / 50) * 100;
                    const c = pt.percentualGordura <= 15 ? C.green : pt.percentualGordura <= 25 ? C.amber : C.red;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                        <span style={{ fontSize:9, color:c, fontWeight:700 }}>{pt.percentualGordura}%</span>
                        <div style={{ width:"100%", height:Math.min(h, 100), background:c, borderRadius:"4px 4px 0 0", opacity:0.8, minHeight:6 }}
                          title={`${pt.data} — ${pt.protocolo}`} />
                        <span style={{ fontSize:8, color:C.textDim, writingMode:"vertical-lr", textOrientation:"mixed", fontSize:7 }}>{pt.data?.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textMuted, marginTop:6 }}>
                  <span>{bfEvolution[0].data} — {bfEvolution[0].percentualGordura}%</span>
                  <span>{bfEvolution[bfEvolution.length - 1].data} — {bfEvolution[bfEvolution.length - 1].percentualGordura}%</span>
                </div>
                {bfEvolution.length >= 2 && (
                  <div style={{ textAlign:"center", marginTop:6 }}>
                    <span style={{ fontSize:10, fontWeight:700, color: bfEvolution[bfEvolution.length - 1].percentualGordura < bfEvolution[0].percentualGordura ? C.green : C.red }}>
                      Δ {+(bfEvolution[bfEvolution.length - 1].percentualGordura - bfEvolution[0].percentualGordura).toFixed(1)} p.p.
                      {bfEvolution[bfEvolution.length - 1].percentualGordura < bfEvolution[0].percentualGordura ? " ↓ Redução" : " ↑ Aumento"}
                    </span>
                  </div>
                )}
              </Accordion>
            )}

            <div style={{ marginTop:12, display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={() => handleSaveAssessment({
                protocolo: "pollock",
                percentualGordura: pollockResult?.percentualGordura,
                densidadeCorporal: pollockResult?.densidadeCorporal,
                ...(isakResult ? { isak: isakResult } : {}),
                ...(biaResult ? { bia: biaResult } : {}),
                ...(cooperResult ? { cooper: cooperResult } : {}),
                ...(rockportResult ? { rockport: rockportResult } : {}),
                ...(rmResult ? { rm: rmResult } : {}),
              })} style={ghostBtn({ fontSize:11 })}>💾 Salvar Avaliação</button>
            </div>

            {savedAssessments.length > 0 && (
              <Accordion title={`Histórico de Avaliações (${savedAssessments.length})`} icon="📚">
                {[...savedAssessments].reverse().map((a, i) => (
                  <div key={a.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:C.green }}>{a.data}</span>
                      <span style={{ fontSize:10, color:C.textMuted }}>{a.protocolo}</span>
                    </div>
                    <div style={{ display:"flex", gap:12, fontSize:11, color:C.textSub }}>
                      {a.percentualGordura != null && <span>%BF: <strong style={{color:C.text}}>{a.percentualGordura}%</strong></span>}
                      {a.cooper?.vo2max && <span>VO₂máx: <strong style={{color:C.text}}>{a.cooper.vo2max}</strong></span>}
                      {a.rm?.rm && <span>1RM: <strong style={{color:C.text}}>{a.rm.rm} kg</strong></span>}
                    </div>
                  </div>
                ))}
              </Accordion>
            )}

            <Accordion title="Avaliação Cardiorrespiratória — VO₂ Máx" icon="❤️">
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:8 }}>Teste de Cooper (12 minutos)</div>
                <div style={{ fontSize:12, color:C.textMuted, marginBottom:10 }}>Correr a máxima distância possível em 12 minutos em superfície plana.</div>
                <NumericField label="Distância percorrida" value={cooperDistancia} onChange={setCooperDistancia} unit="metros" min={0} max={6000} step={10} />
                <button onClick={calcCooper} style={{ ...primaryBtn(), marginTop:8 }}>Calcular VO₂ Máx</button>
                {cooperResult && (
                  <div style={{ marginTop:10, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>VO₂ Máx Estimado</div>
                        <div style={{ fontSize:24, fontWeight:900, color:C.green }}>{cooperResult.vo2max} <span style={{ fontSize:12, color:C.textMuted }}>ml/kg/min</span></div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Classificação</div>
                        <div style={{
                          fontSize:16, fontWeight:800, padding:"4px 12px", borderRadius:8, marginTop:4,
                          background: cooperResult.classificacao === "Excelente" || cooperResult.classificacao === "Superior" ? C.greenBg :
                            cooperResult.classificacao === "Bom" ? C.blueBg : cooperResult.classificacao === "Regular" ? C.amberBg : C.redBg,
                          color: cooperResult.classificacao === "Excelente" || cooperResult.classificacao === "Superior" ? C.green :
                            cooperResult.classificacao === "Bom" ? C.blue : cooperResult.classificacao === "Regular" ? C.amber : C.red,
                        }}>{cooperResult.classificacao}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:8, fontStyle:"italic" }}>{cooperResult.referencia}</div>
                  </div>
                )}
              </div>

              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:8 }}>Teste de Rockport (1 milha / 1600m)</div>
                <div style={{ fontSize:12, color:C.textMuted, marginBottom:10 }}>Caminhar 1 milha (1600m) o mais rápido possível, registrar tempo e FC ao final.</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <NumericField label="Peso (kg)" value={rockportPeso} onChange={setRockportPeso} unit="kg" min={30} max={250} />
                  <div>
                    <span style={lbl()}>Sexo</span>
                    <SingleSelect options={["Masculino","Feminino"]} value={rockportSexo} onChange={setRockportSexo} />
                  </div>
                  <NumericField label="Idade" value={rockportIdade} onChange={setRockportIdade} unit="anos" min={10} max={100} />
                  <NumericField label="Tempo (min)" value={rockportTempo} onChange={setRockportTempo} unit="min" min={5} max={60} step={0.1} />
                  <NumericField label="FC Final (bpm)" value={rockportFC} onChange={setRockportFC} unit="bpm" min={60} max={220} />
                </div>
                <button onClick={calcRockport} style={{ ...primaryBtn(), marginTop:8 }}>Calcular VO₂ Máx (Rockport)</button>
                {rockportResult && (
                  <div style={{ marginTop:10, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>VO₂ Máx Estimado</div>
                        <div style={{ fontSize:24, fontWeight:900, color:C.green }}>{rockportResult.vo2max} <span style={{ fontSize:12, color:C.textMuted }}>ml/kg/min</span></div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Classificação</div>
                        <div style={{
                          fontSize:16, fontWeight:800, padding:"4px 12px", borderRadius:8, marginTop:4,
                          background: rockportResult.classificacao === "Excelente" || rockportResult.classificacao === "Superior" ? C.greenBg : C.blueBg,
                          color: rockportResult.classificacao === "Excelente" || rockportResult.classificacao === "Superior" ? C.green : C.blue,
                        }}>{rockportResult.classificacao}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:8, fontStyle:"italic" }}>{rockportResult.referencia}</div>
                  </div>
                )}
              </div>
            </Accordion>

            <Accordion title="Avaliação Neuromuscular — 1RM Preditivo" icon="💪">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:12, lineHeight:1.6 }}>
                Teste de Repetição Máxima (RM) preditivo. Realize o aquecimento adequado e escolha uma carga que permita entre 2-15 repetições máximas.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <NumericField label="Carga utilizada" value={rmCarga} onChange={setRmCarga} unit="kg" min={0} max={500} step={1} />
                <NumericField label="Repetições máximas" value={rmRepeticoes} onChange={setRmRepeticoes} unit="reps" min={1} max={15} />
              </div>
              <button onClick={calcRM} style={{ ...primaryBtn(), marginTop:8 }}>Calcular 1RM Estimado</button>
              {rmResult && (
                <div style={{ marginTop:12, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12, marginBottom:12 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>1RM Estimado</div>
                      <div style={{ fontSize:28, fontWeight:900, color:C.green }}>{rmResult.rm} <span style={{ fontSize:14, color:C.textMuted }}>kg</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Carga usada</div>
                      <div style={{ fontSize:20, fontWeight:700, color:C.blue }}>{rmResult.carga} kg × {rmResult.repeticoes} reps</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Zona de Treino</div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.amber }}>{rmResult.classe}</div>
                    </div>
                  </div>
                  <div style={{ background:C.surface, borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6, display:"block" }}>Comparação de Fórmulas</span>
                    <div style={{ display:"flex", gap:16, fontSize:12 }}>
                      <span>Epley: <strong>{rmResult.rmEpley} kg</strong></span>
                      <span>Brzycki: <strong>{rmResult.rmBrzycki} kg</strong></span>
                      <span>Lombardi: <strong>{rmResult.rmLombardi} kg</strong></span>
                    </div>
                  </div>
                  <div style={{ fontSize:10, color:C.textMuted, fontStyle:"italic" }}>{rmResult.referencia}</div>
                </div>
              )}
            </Accordion>

            <Accordion title="Avaliação Antropométrica — IMC e RCQ" icon="📐">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                <NumericField label="Cintura (cm)" value={cintura} onChange={setCintura} unit="cm" min={40} max={200} step={0.5} />
                <NumericField label="Quadril (cm)" value={quadril} onChange={setQuadril} unit="cm" min={40} max={200} step={0.5} />
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                <button onClick={() => {
                  const p = parseFloat(student.peso || 0);
                  const a = parseFloat(student.altura || 0);
                  if (p && a) setImcVal(calcIMC(p, a));
                }} style={{ ...primaryBtn({ fontSize:11 }) }}>Calcular IMC</button>
                <button onClick={() => {
                  const c = parseFloat(cintura);
                  const q = parseFloat(quadril);
                  if (c && q) setRcqVal(calcRCQ(c, q, student.sexo));
                }} style={{ ...ghostBtn({ fontSize:11 }) }}>Calcular RCQ</button>
              </div>
              {imcVal && (
                <div style={{ background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>IMC</div>
                  <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                    <span style={{ fontSize:24, fontWeight:900, color:C.text }}>{imcVal.imc}</span>
                    <span style={{ fontSize:13, fontWeight:700, color: imcVal.imc < 18.5 ? C.amber : imcVal.imc < 25 ? C.green : imcVal.imc < 30 ? C.amber : C.red }}>
                      {imcVal.classificacao}
                    </span>
                  </div>
                </div>
              )}
              {rcqVal && (
                <div style={{ background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.blue, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>RCQ</div>
                  <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                    <span style={{ fontSize:24, fontWeight:900, color:C.text }}>{rcqVal.rcq}</span>
                    <span style={{ fontSize:13, fontWeight:700, color: rcqVal.risco === "Baixo" ? C.green : rcqVal.risco === "Moderado" ? C.amber : C.red }}>
                      Risco {rcqVal.risco}
                    </span>
                  </div>
                </div>
              )}
            </Accordion>

            <Accordion title="Zonas de FC — Karvonen" icon="❤️">
              <NumericField label="FC Repouso (bpm)" value={fcRepousoInput} onChange={setFcRepousoInput} unit="bpm" min={30} max={120} />
              <button onClick={() => {
                const fc = parseInt(fcRepousoInput);
                if (fc) setFcZonas(calcFCRegistro(fc, calcIdade(student.dataNasc), student.sexo));
              }} style={{ ...primaryBtn({ fontSize:11, marginTop:8 }) }}>Calcular Zonas de FC</button>
              {fcZonas && (
                <div style={{ marginTop:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-around", marginBottom:10 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>FC Repouso</div>
                      <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{fcZonas.fcRepouso} <span style={{ fontSize:10, color:C.textMuted }}>bpm</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>FC Máx</div>
                      <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{fcZonas.fcMax} <span style={{ fontSize:10, color:C.textMuted }}>bpm</span></div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>FC Reserva</div>
                      <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{fcZonas.fcReserva} <span style={{ fontSize:10, color:C.textMuted }}>bpm</span></div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    {["moderado","intenso","maximo"].map(z => (
                      <div key={z} style={{ flex:1, background:`${FC_ZONA_CORES[z]}18`, border:`1px solid ${FC_ZONA_CORES[z]}40`, borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                        <div style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.05em", color:FC_ZONA_CORES[z] }}>{fcZonas.zonas[z].label}</div>
                        <div style={{ fontSize:16, fontWeight:900, color:C.text, marginTop:4 }}>{fcZonas.zonas[z].min}-{fcZonas.zonas[z].max} <span style={{ fontSize:9, color:C.textMuted }}>bpm</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Accordion>
          </>
        )}

        {tab === "prescricao" && (
          <>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:8 }}>Montagem do Treino</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                <div>
                  <span style={lbl()}>Divisão de Treino</span>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:6 }}>
                    {DIVISOES_TREINO.map(d => (
                      <button key={d.id} onClick={() => setDivisao(d.id)} style={iconBtn(divisao === d.id, C.green)}>
                        {divisao === d.id && "✓ "}{d.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={lbl()}>Objetivo</span>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:6 }}>
                    {OBJETIVOS.map(o => (
                      <button key={o.id} onClick={() => setObjetivo(o.id)} style={iconBtn(objetivo === o.id, C.green)}>
                        {objetivo === o.id && "✓ "}{o.icon} {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <span style={lbl()}>Nível</span>
                <SingleSelect options={[{ value:"iniciante", label:"Iniciante" }, { value:"intermediario", label:"Intermediário" }, { value:"avancado", label:"Avançado" }]}
                  value={nivel} onChange={setNivel} />
              </div>
              <button onClick={gerarTreino} disabled={!objetivo} style={{ ...primaryBtn(), opacity: !objetivo ? 0.4 : 1, cursor: !objetivo ? "not-allowed" : "pointer" }}>
                Gerar Estrutura de Treino
              </button>
            </div>

            {objetivo && (
              <div style={{ background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.blue, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>
                  📋 Diretriz Aplicada — {getDiretriz(objetivo).objetivo}
                </div>
                <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7 }}>
                  {getDiretriz(objetivo).repeticoes && <span>Repetições: <strong>{getDiretriz(objetivo).repeticoes.min}-{getDiretriz(objetivo).repeticoes.max}</strong> · </span>}
                  {getDiretriz(objetivo).series && <span>Séries: <strong>{getDiretriz(objetivo).series.min}-{getDiretriz(objetivo).series.max}</strong> · </span>}
                  {getDiretriz(objetivo).descanso && <span>Descanso: <strong>{getDiretriz(objetivo).descanso.min}-{getDiretriz(objetivo).descanso.max}{getDiretriz(objetivo).descanso.unidade}</strong> · </span>}
                  Intensidade: <strong>{getDiretriz(objetivo).intensidade.min}-{getDiretriz(objetivo).intensidade.max}% 1RM</strong>
                </div>
                <div style={{ fontSize:10, color:C.textMuted, marginTop:6, fontStyle:"italic" }}>
                  {getDiretriz(objetivo).referencia}
                </div>
              </div>
            )}

            {weeklyVolume.length > 0 && (
              <Accordion title="Volume Semanal por Grupo Muscular" icon="📊" defaultOpen>
                <div style={{ fontSize:11, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
                  Volume total da semana: <strong style={{ color: C.text }}>{weeklyVolume.reduce((s, g) => s + g.volumeLoad, 0).toLocaleString()} kg·rep</strong> · 
                  Média de séries/semana: <strong style={{ color: C.text }}>{(weeklyVolume.reduce((s, g) => s + g.seriesSemanais, 0)).toFixed(0)}</strong>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:6 }}>
                  {weeklyVolume.map(g => {
                    const maxVol = Math.max(...weeklyVolume.map(x => x.volumeLoad), 1);
                    const volPct = (g.volumeLoad / maxVol) * 100;
                    const intensity = g.volumeLoad > maxVol * 0.7 ? C.red : g.volumeLoad > maxVol * 0.4 ? C.amber : C.green;
                    return (
                      <div key={g.musculo} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px" }}>
                        <div style={{ fontSize:10, fontWeight:700, color:C.text, marginBottom:4 }}>{g.musculo}</div>
                        <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden", marginBottom:4 }}>
                          <div style={{ height:"100%", width:`${volPct}%`, background:intensity, borderRadius:3, minWidth:4 }} />
                        </div>
                        <div style={{ fontSize:9, color:C.textMuted, display:"flex", justifyContent:"space-between" }}>
                          <span>{g.seriesSemanais} séries</span>
                          <span style={{ fontWeight:700, color:intensity }}>{(g.volumeLoad / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Accordion>
            )}

            {estruturaTreino.length > 0 && (
              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                <button onClick={handleSaveTreino} style={primaryBtn({ fontSize:11 })}>💾 Salvar Prescrição</button>
                {estruturaTreino[0]?.exercicios?.length > 0 && (
                  <button onClick={() => {
                    const treinoAtual = estruturaTreino.find(g => g.exercicios?.length > 0);
                    if (treinoAtual) setProgressionResult(calcProgression(treinoAtual, nivel));
                  }} style={ghostBtn({ fontSize:11 })}>📈 Sugerir Progressão</button>
                )}
              </div>
            )}

            {progressionResult && (
              <div style={{ background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.amber, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
                  📈 Progressão Sugerida
                </div>
                <div style={{ fontSize:11, color:C.textSub, marginBottom:8 }}>Com base no nível <strong>{nivel}</strong>, sugere-se aumentar as cargas conforme abaixo:</div>
                <div style={{ display:"grid", gap:6 }}>
                  {progressionResult.map((ex, i) => (
                    ex.carga && <div key={i} style={{ display:"flex", justifyContent:"space-between", background:C.surface, borderRadius:6, padding:"6px 10px", fontSize:11 }}>
                      <span style={{ color:C.text }}>{ex.nome}</span>
                      <span style={{ color:C.amber, fontWeight:700 }}>{ex.carga} kg {ex.progressao}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cycleSuggestion && (
              <div style={{ background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.blue, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>
                  🔄 Sugestão de Ciclo
                </div>
                <div style={{ fontSize:12, color:C.textSub, lineHeight:1.6 }}>{cycleSuggestion.sugestaoPeriodizacao}</div>
                <div style={{ fontSize:10, color:C.textMuted, marginTop:4, fontStyle:"italic" }}>{cycleSuggestion.detalhe}</div>
              </div>
            )}

            {/* Periodização avançada */}
            {objetivo && (
              <Accordion title="Periodização — Macrociclo" icon="📅">
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  <button onClick={() => {
                    const mc = gerarMacrociclo(objetivo, nivel, 16);
                    setMacrociclo(mc);
                    setSemanaAtual(1);
                    setMicroDetalhe(gerarMicrocicloSemanal(mc, 1));
                  }} style={primaryBtn({ fontSize:11 })}>Gerar Macrociclo (16 semanas)</button>
                  {macrociclo && (
                    <button onClick={() => {
                      setTransicao(sugerirTransicao(objetivo, semanaAtual));
                    }} style={ghostBtn({ fontSize:11 })}>Verificar Transição</button>
                  )}
                </div>
                {macrociclo && (
                  <div>
                    <div style={{ fontSize:11, color:C.textMuted, marginBottom:8 }}>
                      <strong style={{color:C.text}}>{macrociclo.params.label}</strong> · {macrociclo.nivel} · {macrociclo.totalSemanas} semanas
                    </div>
                    <div style={{ display:"flex", gap:4, marginBottom:8 }}>
                      {Array.from({ length: macrociclo.totalSemanas }, (_, i) => i + 1).map(s => (
                        <button key={s} onClick={() => {
                          setSemanaAtual(s);
                          setMicroDetalhe(gerarMicrocicloSemanal(macrociclo, s));
                        }} style={{
                          width:28, height:28, borderRadius:6,
                          background: s === semanaAtual ? C.green : C.surface,
                          border: `1px solid ${s === semanaAtual ? C.green : C.border}`,
                          color: s === semanaAtual ? "#061A0C" : C.textMuted,
                          fontWeight: s === semanaAtual ? 800 : 400,
                          fontSize:10, cursor:"pointer", fontFamily:F,
                        }}>{s}</button>
                      ))}
                    </div>
                    {microDetalhe && (
                      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px" }}>
                        <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", color:C.green, letterSpacing:"0.1em", marginBottom:6 }}>
                          Semana {microDetalhe.semana} · {microDetalhe.tipo}
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8, fontSize:12 }}>
                          <div><span style={{color:C.textMuted}}>Séries:</span> <strong>{microDetalhe.series}</strong></div>
                          <div><span style={{color:C.textMuted}}>Repetições:</span> <strong>{microDetalhe.repeticoes}</strong></div>
                          <div><span style={{color:C.textMuted}}>Intensidade:</span> <strong>{microDetalhe.intensidade}%</strong></div>
                        </div>
                        {microDetalhe.tipo === "Deload" && (
                          <div style={{ marginTop:8, background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:6, padding:"6px 10px", fontSize:11, color:C.amber }}>
                            🔄 Semana de deload — reduzir volume para {microDetalhe.volumeRelativo} do normal
                          </div>
                        )}
                      </div>
                    )}
                    {transicao && (
                      <div style={{ marginTop:8, background: transicao.prontaParaTransicao ? C.greenBg : C.blueBg, border:`1px solid ${transicao.prontaParaTransicao ? C.green : C.blue}40`, borderRadius:8, padding:"8px 12px", fontSize:11, color:C.textSub }}>
                        {transicao.prontaParaTransicao ? `✅ Pronto para transição para ${transicao.transitarPara}. ${transicao.descricao}` : `⏳ Aguardando (${transicao.semanasRestantes} semanas restantes). ${transicao.descricao}`}
                      </div>
                    )}
                  </div>
                )}
              </Accordion>
            )}

            {/* PSE de Foster — Monitoramento */}
            <Accordion title="PSE de Foster — Monitoramento de Carga Interna" icon="📊">
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:12, lineHeight:1.6 }}>
                Escala CR-10 de Foster para registro da Percepção Subjetiva de Esforço (PSE) pós-sessão.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                <div>
                  <span style={lbl()}>PSE da Sessão (CR-10)</span>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:4 }}>
                    {PSE_CR10.filter(p => p.valor <= 10).map(p => (
                      <button key={p.valor} onClick={() => setPseAtual(String(p.valor))} style={iconBtn(pseAtual === String(p.valor), PSE_COLORS[p.valor] || C.green)}>
                        {p.valor}
                      </button>
                    ))}
                  </div>
                  {pseAtual && (
                    <div style={{ marginTop:4, fontSize:11, color:C.textSub }}>
                      {PSE_CR10.find(p => p.valor === parseInt(pseAtual))?.rotulo} — {PSE_CR10.find(p => p.valor === parseInt(pseAtual))?.desc}
                    </div>
                  )}
                </div>
                <NumericField label="Duração (min)" value={pseDuracao} onChange={setPseDuracao} unit="min" min={5} max={180} step={5} />
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                <button onClick={() => {
                  const pse = parseFloat(pseAtual);
                  const dur = parseFloat(pseDuracao);
                  if (pse > 0 && dur > 0) {
                    const carga = calcInternalLoad(pse, dur);
                    if (carga) {
                      const novaSessao = { ...carga, data: new Date().toISOString().slice(0, 10) };
                      const novas = [...pseSessoes, novaSessao];
                      setPseSessoes(novas);
                      setPseAnalise(carga);
                      setPseAtual("");
                      setPseDuracao("");
                      if (novas.length >= 2) {
                        const mono = calcMonotony(novas);
                        if (mono) {
                          setDeloadSugs(deloadSuggestion(mono, novas));
                        }
                      }
                    }
                  }
                }} style={primaryBtn({ fontSize:11 })}>Registrar Sessão</button>
                <button onClick={() => { setPseSessoes([]); setPseAnalise(null); setDeloadSugs([]); }} style={ghostBtn({ fontSize:11 })}>Limpar</button>
              </div>
              {pseAnalise && (
                <div style={{ background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:10, padding:"10px 12px", marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Carga Interna</div>
                  <div style={{ display:"flex", gap:16, fontSize:13 }}>
                    <span>PSE: <strong>{pseAnalise.pse}</strong> ({pseAnalise.pseLabel})</span>
                    <span>Duração: <strong>{pseAnalise.duracao} min</strong></span>
                    <span>Carga: <strong>{pseAnalise.cargaInternaUA} UA</strong></span>
                  </div>
                </div>
              )}
              {pseSessoes.length >= 2 && (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px", marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, marginBottom:6 }}>📈 Análise de Monotonia</div>
                  {(() => {
                    const mono = calcMonotony(pseSessoes);
                    if (!mono) return null;
                    return (
                      <>
                        <div style={{ display:"flex", gap:16, fontSize:11 }}>
                          <span>Carga semanal: <strong>{mono.cargaSemanalTotal} UA</strong></span>
                          <span>Média: <strong>{mono.media} UA</strong></span>
                          <span>DP: <strong>{mono.dp}</strong></span>
                          <span>Monotonia: <strong style={{color: mono.monotonia > 1.5 ? C.red : C.green}}>{mono.monotonia}</strong></span>
                          <span>Strain: <strong style={{color: mono.strain > 2500 ? C.red : mono.strain > 2000 ? C.amber : C.green}}>{mono.strain}</strong></span>
                        </div>
                        {deloadSugs.length > 0 && (
                          <div style={{ marginTop:8 }}>
                            {deloadSugs.map((d, i) => (
                              <div key={i} style={{
                                background: d.nivel === "alto" ? C.redBg : d.nivel === "medio" ? C.amberBg : C.blueBg,
                                border:`1px solid ${d.nivel === "alto" ? C.red : d.nivel === "medio" ? C.amber : C.blue}40`,
                                borderRadius:6, padding:"6px 10px", marginBottom:4, fontSize:11,
                                color: d.nivel === "alto" ? C.red : d.nivel === "medio" ? C.amber : C.textSub,
                              }}>
                                {d.nivel === "alto" ? "🔴 " : d.nivel === "medio" ? "🟡 " : "ℹ️ "}{d.mensagem}
                                <div style={{ marginTop:2, fontSize:10, opacity:0.8 }}>{d.acao}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
              {pseSessoes.length > 0 && (
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, marginBottom:6 }}>Histórico de Sessões</div>
                  <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:60, padding:"4px 0" }}>
                    {pseSessoes.map((s, i) => {
                      const h = (s.pse / 10) * 100;
                      return (
                        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                          <div style={{ width:"100%", height:Math.min(h, 60), background:PSE_COLORS[Math.round(s.pse)] || C.green, borderRadius:"3px 3px 0 0", opacity:0.8, minHeight:6 }} title={`PSE ${s.pse} · ${s.cargaInternaUA} UA`} />
                          <span style={{ fontSize:7, color:C.textDim }}>{s.data?.slice(5)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Accordion>

            {estruturaTreino.map(grupo => (
              <Accordion key={grupo.key} title={grupo.nome} icon="🏋️" badge={`${grupo.exercicios.length} ex.`} defaultOpen>
                <div style={{ fontSize:12, color:C.textMuted, marginBottom:10 }}>Foco: {grupo.foco}</div>
                {grupo.diretrizAplicada && (
                  <div style={{ background:C.surface, borderRadius:8, padding:"8px 12px", marginBottom:10, fontSize:11, color:C.textSub, lineHeight:1.6 }}>
                    <strong style={{ color:C.green }}>Séries:</strong> {grupo.diretrizAplicada.series?.min}-{grupo.diretrizAplicada.series?.max} · <strong style={{ color:C.green }}>Repetições:</strong> {grupo.diretrizAplicada.repeticoes?.min}-{grupo.diretrizAplicada.repeticoes?.max} · <strong style={{ color:C.green }}>Descanso:</strong> {grupo.diretrizAplicada.descanso?.min}-{grupo.diretrizAplicada.descanso?.max}s
                  </div>
                )}

                <ExerciseSearch onSelect={(ex) => addExercicio(grupo.key, ex)} />

                {grupo.exercicios.length > 0 && (
                  <div style={{ marginTop:12 }}>
                    {grupo.exercicios.map((ex, idx) => (
                      <ExerciseRow key={ex.id} exercise={ex} index={idx + 1}
                        onRemove={() => removeExercicio(grupo.key, ex.id)}
                        onUpdate={(updated) => updateExercicio(grupo.key, ex.id, updated)} />
                    ))}
                  </div>
                )}

                {grupo.exercicios.length === 0 && (
                  <div style={{ marginTop:10, textAlign:"center", padding:"16px", color:C.textDim, fontSize:12 }}>
                    Nenhum exercício adicionado. Use a busca acima para adicionar exercícios ao treino.
                  </div>
                )}
              </Accordion>
            ))}

            {savedTreinos.length > 0 && (
              <Accordion title={`Histórico de Prescrições (${savedTreinos.length})`} icon="📚">
                {[...savedTreinos].reverse().map((tr, i) => (
                  <div key={tr.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <span style={{ fontSize:11, color:C.green, fontWeight:700 }}>{tr.dataPrescricao} · {OBJETIVOS.find(o => o.id === tr.objetivo)?.label || tr.objetivo}</span>
                      <span style={{ fontSize:10, color:C.textMuted }}>{tr.divisao} · {tr.nivel} · {tr.estrutura?.reduce((s, g) => s + (g.exercicios?.length || 0), 0)} ex.</span>
                    </div>
                    <button onClick={() => {
                      if (tr.estrutura) setEstruturaTreino(tr.estrutura);
                      if (tr.objetivo) setObjetivo(tr.objetivo);
                      if (tr.divisao) setDivisao(tr.divisao);
                      if (tr.nivel) setNivel(tr.nivel);
                      const vol = calcWeeklyVolume(tr.estrutura);
                      setWeeklyVolume(vol);
                      setCycleSuggestion(suggestNextCycle(tr.objetivo, tr.nivel));
                    }} style={{ ...ghostBtn({ fontSize:10, padding:"4px 10px" }) }}>Carregar</button>
                  </div>
                ))}
              </Accordion>
            )}
          </>
        )}

        {tab === "evidencias" && (
          <>
            <div style={{ marginBottom:14, padding:"12px 16px", background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:12, fontSize:12, color:C.textSub, lineHeight:1.7 }}>
              📚 Base de evidências científicas para prescrição de treinamento — Diretrizes ACSM, NSCA e estudos randomizados. Atualizado conforme guidelines 2024-2025.
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:10 }}>Diretrizes para o Objetivo Atual</div>
              {objetivo ? (
                <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
                    {getDiretriz(objetivo).objetivo}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    {getDiretriz(objetivo).repeticoes && (
                      <div><span style={{ fontSize:10, color:C.textMuted }}>Repetições</span><div style={{ fontSize:16, fontWeight:700, color:C.text }}>{getDiretriz(objetivo).repeticoes.min}-{getDiretriz(objetivo).repeticoes.max}</div></div>
                    )}
                    {getDiretriz(objetivo).series && (
                      <div><span style={{ fontSize:10, color:C.textMuted }}>Séries</span><div style={{ fontSize:16, fontWeight:700, color:C.text }}>{getDiretriz(objetivo).series.min}-{getDiretriz(objetivo).series.max}</div></div>
                    )}
                    <div><span style={{ fontSize:10, color:C.textMuted }}>Intensidade</span><div style={{ fontSize:16, fontWeight:700, color:C.text }}>{getDiretriz(objetivo).intensidade.min}-{getDiretriz(objetivo).intensidade.max}% 1RM</div></div>
                    {getDiretriz(objetivo).descanso && (
                      <div><span style={{ fontSize:10, color:C.textMuted }}>Descanso</span><div style={{ fontSize:16, fontWeight:700, color:C.text }}>{getDiretriz(objetivo).descanso.min}-{getDiretriz(objetivo).descanso.max}s</div></div>
                    )}
                  </div>
                  <div style={{ fontSize:11, color:C.textMuted, lineHeight:1.6 }}>{getDiretriz(objetivo).progressao}</div>
                  <div style={{ fontSize:10, color:C.textMuted, marginTop:8, fontStyle:"italic" }}>{getDiretriz(objetivo).referencia}</div>
                </div>
              ) : (
                <div style={{ color:C.textDim, fontSize:12 }}>Selecione um objetivo na aba Anamnese para ver as diretrizes correspondentes.</div>
              )}
            </div>

            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:10 }}>Referências Científicas</div>
            {EVIDENCIA_CARDS.map(card => (
              <div key={card.id} style={{ background:C.card, border:`1px solid ${C.borderLight}`, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:4 }}>{card.titulo}</div>
                <div style={{ fontSize:12, color:C.textSub, lineHeight:1.6, marginBottom:6 }}>{card.conteudo}</div>
                <div style={{ fontSize:10, color:C.textMuted, fontStyle:"italic" }}>{card.referencia}</div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

function calcIdade(dataNasc) {
  if (!dataNasc) return 30;
  const nasc = new Date(dataNasc);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mes = hoje.getMonth() - nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}
