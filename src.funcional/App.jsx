import { useState, useRef, useEffect } from "react";
import { EVIDENCE } from "./evidence";
import { CIF } from "./cif";
import { generateCIF } from "./cifEngine";      

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:          "#0E141B",
  surface:     "#111822",
  card:        "#19243A",   // slightly more blue-tinted for depth
  cardAlt:     "#162030",
  border:      "#1F2E45",
  borderLight: "#2A3F5C",
  green:       "#4ADE80",
  greenDim:    "#22C55E",
  greenDeep:   "#0D9E5C",
  greenBg:     "rgba(74,222,128,0.09)",
  greenBgHov:  "rgba(74,222,128,0.16)",
  amber:       "#FBBF24",
  amberBg:     "rgba(251,191,36,0.10)",
  red:         "#F87171",
  redBg:       "rgba(248,113,113,0.09)",
  blue:        "#60A5FA",
  blueBg:      "rgba(96,165,250,0.09)",
  text:        "#DDE6F0",
  textSub:     "#A8BECC",
  textMuted:   "#5E7A96",
  textDim:     "#364D62",
  white:       "#FFFFFF",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

// ── Shared micro-styles ───────────────────────────────────────────────────────
const inp = (extra={}) => ({
  width:"100%", boxSizing:"border-box", background:C.surface,
  border:`1px solid ${C.border}`, borderRadius:8, color:C.text,
  fontSize:13, padding:"9px 12px", outline:"none", fontFamily:F, ...extra,
});
const sel = (extra={}) => ({...inp(), cursor:"pointer", ...extra});
const lbl = (extra={}) => ({
  display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em",
  textTransform:"uppercase", color:C.textMuted, marginBottom:5, ...extra,
});
const cardStyle = (extra={}) => ({
  background:C.card, border:`1px solid ${C.border}`,
  borderRadius:14, padding:"20px 22px", marginBottom:14, ...extra,
});
const primaryBtn = (extra={}) => ({
  background:C.green, color:"#061A0C", border:"none", borderRadius:8,
  padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer",
  fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...extra,
});
const ghostBtn = (extra={}) => ({
  background:"transparent", color:C.green, border:`1px solid ${C.border}`,
  borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700,
  cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...extra,
});
const iconBtn = (active=false, activeColor=C.green, extra={}) => ({
  background: active ? `${activeColor}18` : C.surface,
  border:`1px solid ${active ? activeColor+"50" : C.border}`,
  color: active ? activeColor : C.textMuted,
  borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight: active ? 700 : 400,
  cursor:"pointer", fontFamily:F, transition:"all 0.12s", ...extra,
});

// ── BMI helper ────────────────────────────────────────────────────────────────
function calcIMC(peso, altura) {
  const p = parseFloat(peso), h = parseFloat(altura)/100;
  if (!p || !h || h <= 0) return null;
  const v = p / (h*h);
  const cat = v < 18.5 ? {l:"Baixo peso", c:C.blue}
    : v < 25 ? {l:"Peso normal", c:C.green}
    : v < 30 ? {l:"Sobrepeso", c:C.amber}
    : {l:"Obeso", c:C.red};
  return { value: v.toFixed(1), ...cat };
}

// ── Logo SVG (fora do componente para evitar recriar durante render) ─────────
// (LogoSVG is the only used logo component)
function LogoSVG({ fontFamily = F } = {}) {


  return (
    <svg viewBox="0 0 300 52" width="180" height="38" style={{ display: "block" }}>


      <g transform="translate(24,26)">
        <line x1="0" y1="-20" x2="0" y2="20" stroke={C.textDim} strokeWidth="1.5" strokeDasharray="2 5" />
        <path d="M -16 10 C -8 3,0 0,16 -10" fill="none" stroke={C.green} strokeWidth="4" strokeLinecap="round" />
        <path d="M -16 -4 C -4 0,4 3,16 12" fill="none" stroke={C.greenDim} strokeWidth="3" strokeLinecap="round" />
        <path d="M -9 18 C -3 9,3 -5,12 -18" fill="none" stroke={C.greenDeep} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="4.5" fill={C.amber} />
      </g>
      <text x="56" y="34" fill={C.white} fontSize="24" fontWeight="800" letterSpacing="6" fontFamily={fontFamily}>SASYRA</text>
      <text x="60" y="48" fill={C.green} fontSize="8" fontWeight="700" letterSpacing="4" fontFamily={fontFamily}>REABILITAÇÃO E EVIDÊNCIA</text>
    </svg>
  );
}


// ── NumericDrum — spin-drum for peso/altura ───────────────────────────────────
function NumericDrum({ value, onChange, min, max, step=1, unit, label: lbl2 }) {
  const inc = () => onChange(Math.min(max, (parseFloat(value)||min)+step));
  const dec = () => onChange(Math.max(min, (parseFloat(value)||min)-step));
  return (
    <div>
      <span style={lbl()}>{lbl2}</span>
      <div style={{ display:"flex", alignItems:"center", gap:0, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
        <button onClick={dec} style={{ background:"none", border:"none", color:C.textMuted, fontSize:18, padding:"0 14px", cursor:"pointer", height:44, display:"flex", alignItems:"center", borderRight:`1px solid ${C.border}` }}>−</button>
        <div style={{ flex:1, textAlign:"center", position:"relative" }}>
          <input type="number" value={value} min={min} max={max} step={step}
            onChange={e => onChange(e.target.value)}
            style={{ ...inp(), border:"none", background:"transparent", textAlign:"center", fontSize:18, fontWeight:800, color:C.text, padding:"10px 4px", width:"100%" }} />
        </div>
        <span style={{ fontSize:12, color:C.textMuted, paddingRight:10, paddingLeft:4 }}>{unit}</span>
        <button onClick={inc} style={{ background:"none", border:"none", color:C.green, fontSize:18, padding:"0 14px", cursor:"pointer", height:44, display:"flex", alignItems:"center", borderLeft:`1px solid ${C.border}` }}>+</button>
      </div>
    </div>
  );
}

// ── EvaSlider ─────────────────────────────────────────────────────────────────
function EvaSlider({ label: lbl2, value, onChange }) {
  // 1. Identifica se o usuário já interagiu com o slider
  const isDefined = value !== null && value !== "";
  
  // 2. Se não estiver definido, usamos 0 para as contas visuais não quebrarem
  const currentVal = isDefined ? value : 0;

  const pct = (currentVal / 10) * 100;
  const color = !isDefined ? C.textDim : currentVal <= 3 ? C.green : currentVal <= 6 ? C.amber : C.red;
  
  const faces = ["😌", "😐", "😟", "😣", "😭"];
  const face  = isDefined ? faces[Math.min(4, Math.floor(currentVal / 2.5))] : "⚪";
  const desc  = !isDefined ? "Não avaliado" : currentVal === 0 ? "Sem dor" : currentVal <= 3 ? "Leve" : currentVal <= 6 ? "Moderada" : currentVal <= 8 ? "Intensa" : "Máxima";

  return (
    <div style={{ opacity: isDefined ? 1 : 0.6, transition: "opacity 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={lbl()}>{lbl2}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>{face}</span>
          <span style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1 }}>
            {isDefined ? currentVal : "—"}
          </span>
          <span style={{ fontSize: 10, color: C.textMuted }}>
            {isDefined ? `/10 · ${desc}` : desc}
          </span>
        </div>
      </div>
      
      {/* Barra de progresso visual interna da EVA */}
      <div style={{ position: "relative", height: 8, background: C.surface, borderRadius: 99, border: `1px solid ${C.border}`, marginBottom: 4 }}>
        {isDefined && (
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.green}, ${color})`, borderRadius: 99, transition: "width 0.1s" }} />
        )}
      </div>
      
      {/* O Input Range nativo */}
      <input 
        type="range" 
        min="0" 
        max="10" 
        step="1" 
        value={currentVal}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: isDefined ? color : C.border, cursor: "pointer", marginBottom: 2 }} 
      />
      
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textDim }}>
        <span>0</span><span>5</span><span>10</span>
      </div>
    </div>
  );
}

// ── TagSelect (multi) ─────────────────────────────────────────────────────────
function TagSelect({ options, value, onChange, activeColor=C.green }) {
  const toggle = v => onChange(value.includes(v) ? value.filter(x=>x!==v) : [...value,v]);
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {options.map(o => {
        const v = o.value??o, l = o.label??o, active = value.includes(v);
        return (
          <button key={v} onClick={()=>toggle(v)}
            style={iconBtn(active, activeColor)}>
            {active && <span style={{ fontSize:10 }}>✓</span>}{l}
          </button>
        );
      })}
    </div>
  );
}

// ── SingleSelect (radio chips) ────────────────────────────────────────────────
function SingleSelect({ options, value, onChange, activeColor=C.green }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {options.map(o => {
        const v = o.value??o, l = o.label??o, active = value===v;
        return (
          <button key={v} onClick={()=>onChange(active?"":v)}
            style={iconBtn(active, activeColor)}>
            {l}
          </button>
        );
      })}
    </div>
  );
}

// ── SessionCounter ────────────────────────────────────────────────────────────
function SessionCounter({ value, onChange }) {
  const presets = [6,10,12,16,20,24];
  return (
    <div>
      <span style={lbl()}>Sessões autorizadas</span>
      <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
        {presets.map(n => (
          <button key={n} onClick={()=>onChange(String(n))}
            style={iconBtn(value===String(n), C.amber, { padding:"6px 12px" })}>
            {n}
          </button>
        ))}
        <input type="number" min="1" max="120" value={value}
          onChange={e=>onChange(e.target.value)}
          style={{ ...inp(), width:72, textAlign:"center", fontSize:14, fontWeight:700 }}
          placeholder="—" />
        <span style={{ fontSize:11, color:C.textMuted }}>sessões</span>
      </div>
    </div>
  );
}

// ── AudioField ────────────────────────────────────────────────────────────────
function AudioField({ value, onChange, placeholder, rows=3 }) {
  const [rec, setRec] = useState(false);
  const [supported, setSupported] = useState(false);
  // Keep this ref to avoid lint rule complaining about setState-in-effect.
  const supportedRef = useRef(false);

  const rRef = useRef(null);
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    supportedRef.current = !!SR;
    // Seta a UI apenas uma vez no mount
    if (!supportedRef.current) {
      setSupported(false);
      return;
    }

    setSupported(true);

    if (SR) {

      const r = new SR();
      r.lang = "pt-BR";
      r.continuous = true;
      r.interimResults = false;
      r.onresult = e => {
        const t = Array.from(e.results).map(x => x[0].transcript).join(" ");
        onChange(p => (p ? p + " " + t : t));
      };
      r.onend = () => setRec(false);
      rRef.current = r;
    }
  }, [onChange]);

  const toggle = () => {
    if (!rRef.current) return;
    if (rec) { rRef.current.stop(); setRec(false); }
    else { rRef.current.start(); setRec(true); }
  };
  return (
    <div style={{ position:"relative" }}>
      <textarea rows={rows} value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inp({ resize:"vertical", lineHeight:1.6 }), paddingRight: supported?48:12 }} />
      {supported && (
        <button onClick={toggle}
          title={rec?"Parar":"Ditar por voz"}
          style={{ position:"absolute", right:8, top:8,
            background: rec ? C.redBg : C.greenBg,
            border:`1px solid ${rec?C.red:C.green}50`,
            borderRadius:8, padding:"6px 8px", cursor:"pointer",
            display:"flex", alignItems:"center", gap:4, fontSize:12,
            color: rec?C.red:C.green, fontFamily:F, fontWeight:700 }}>
          {rec ? "⏹ Stop" : "🎙"}
        </button>
      )}
    </div>
  );
}

// ── MRCSelect ─────────────────────────────────────────────────────────────────
function MRCSelect({ value, onChange }) {
  const grades = ["0 – Sem contração","1 – Frêmito","2 – Sem gravidade","3 – Contra gravidade","4 – Resistência parcial","5 – Normal"];
  return (

    <select value={value} onChange={e=>onChange(e.target.value)} style={sel()}>
      <option value="">MRC…</option>
      {grades.map((g,i)=><option key={i} value={String(i)}>{g}</option>)}
    </select>
  );
}

// ── Goniometry ────────────────────────────────────────────────────────────────
const JOINTS = ["Coluna Cervical","Coluna Torácica","Coluna Lombar","Ombro D","Ombro E","Cotovelo D","Cotovelo E","Punho D","Punho E","Quadril D","Quadril E","Joelho D","Joelho E","Tornozelo D","Tornozelo E","ATM D","ATM E"];
const MVMT = {
  "Coluna Cervical":["Flexão","Extensão","Inclinação D","Inclinação E","Rotação D","Rotação E"],
  "Coluna Torácica":["Flexão","Extensão","Rotação D","Rotação E"],
  "Coluna Lombar":["Flexão","Extensão","Inclinação D","Inclinação E","Rotação D","Rotação E"],
  "Ombro D":["Flexão","Extensão","Abdução","Adução","RI","RE","Abdução Horiz."],
  "Ombro E":["Flexão","Extensão","Abdução","Adução","RI","RE","Abdução Horiz."],
  "Cotovelo D":["Flexão","Extensão","Pronação","Supinação"],
  "Cotovelo E":["Flexão","Extensão","Pronação","Supinação"],
  "Punho D":["Flexão","Extensão","Desvio Radial","Desvio Ulnar"],
  "Punho E":["Flexão","Extensão","Desvio Radial","Desvio Ulnar"],
  "Quadril D":["Flexão","Extensão","Abdução","Adução","RI","RE"],
  "Quadril E":["Flexão","Extensão","Abdução","Adução","RI","RE"],
  "Joelho D":["Flexão","Extensão"],
  "Joelho E":["Flexão","Extensão"],
  "Tornozelo D":["Dorsiflexão","Plantarflexão","Inversão","Eversão"],
  "Tornozelo E":["Dorsiflexão","Plantarflexão","Inversão","Eversão"],
  "ATM D":["Abertura","Protrusão","Desvio"],
  "ATM E":["Abertura","Protrusão","Desvio"],
};
const REF = {
  "Flexão|Coluna Cervical":"0–45","Extensão|Coluna Cervical":"0–45","Inclinação D|Coluna Cervical":"0–45","Inclinação E|Coluna Cervical":"0–45","Rotação D|Coluna Cervical":"0–60","Rotação E|Coluna Cervical":"0–60",
  "Flexão|Coluna Lombar":"0–60","Extensão|Coluna Lombar":"0–25","Inclinação D|Coluna Lombar":"0–25","Inclinação E|Coluna Lombar":"0–25",
  "Flexão|Ombro D":"0–180","Abdução|Ombro D":"0–180","RE|Ombro D":"0–90","RI|Ombro D":"0–70","Extensão|Ombro D":"0–60",
  "Flexão|Ombro E":"0–180","Abdução|Ombro E":"0–180","RE|Ombro E":"0–90","RI|Ombro E":"0–70","Extensão|Ombro E":"0–60",
  "Flexão|Cotovelo D":"0–145","Extensão|Cotovelo D":"0","Pronação|Cotovelo D":"0–80","Supinação|Cotovelo D":"0–80",
  "Flexão|Cotovelo E":"0–145","Extensão|Cotovelo E":"0","Pronação|Cotovelo E":"0–80","Supinação|Cotovelo E":"0–80",
  "Flexão|Quadril D":"0–120","Extensão|Quadril D":"0–30","Abdução|Quadril D":"0–45","RI|Quadril D":"0–45","RE|Quadril D":"0–45",
  "Flexão|Quadril E":"0–120","Extensão|Quadril E":"0–30","Abdução|Quadril E":"0–45","RI|Quadril E":"0–45","RE|Quadril E":"0–45",
  "Flexão|Joelho D":"0–135","Extensão|Joelho D":"0","Flexão|Joelho E":"0–135","Extensão|Joelho E":"0",
  "Dorsiflexão|Tornozelo D":"0–20","Plantarflexão|Tornozelo D":"0–50","Inversão|Tornozelo D":"0–35","Eversão|Tornozelo D":"0–15",
  "Dorsiflexão|Tornozelo E":"0–20","Plantarflexão|Tornozelo E":"0–50","Inversão|Tornozelo E":"0–35","Eversão|Tornozelo E":"0–15",
};

function getRef(mv, jt) {
  return REF[`${mv}|${jt}`] || "";
}
function isOutOfRange(val, refStr) {
  if (!refStr||!val) return false;
  const m = refStr.match(/(\d+)[–-](\d+)/);

  if (!m) return false;
  return Number(val) > Number(m[2]);
}

function GonioRow({ row, onUpdate, onRemove }) {
  const mvts = MVMT[row.joint]||[];
  const ref  = getRef(row.movement, row.joint);
  const oor  = isOutOfRange(row.value, ref);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1.8fr 1.8fr 76px 72px 28px", gap:8, alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
      <select value={row.joint} onChange={e=>onUpdate({...row,joint:e.target.value,movement:""})} style={sel()}>
        <option value="">Articulação…</option>
        {JOINTS.map(j=><option key={j} value={j}>{j}</option>)}
      </select>
      <select value={row.movement} onChange={e=>onUpdate({...row,movement:e.target.value})} style={sel()} disabled={!row.joint}>
        <option value="">Movimento…</option>
        {mvts.map(m=><option key={m} value={m}>{m}</option>)}
      </select>
      <input type="number" min="0" max="360" value={row.value}
        onChange={e=>onUpdate({...row,value:e.target.value})}
        style={{ ...inp({ textAlign:"center", border:`1.5px solid ${oor?C.red:C.border}`, fontWeight:700 }) }}
        placeholder="°" />
      <div style={{ fontSize:11, color: oor?C.red:C.textMuted, textAlign:"center", fontWeight: oor?700:400 }}>
        {ref ? `${ref}°` : "—"}{oor?" ⚠":""}
      </div>
      <button onClick={onRemove} style={{ background:"none", border:"none", color:C.textDim, fontSize:18, cursor:"pointer", padding:0, lineHeight:1 }}>×</button>
    </div>
  );
}

// ── TestCard ──────────────────────────────────────────────────────────────────
function TestCard({ test, result, onResult }) {
  const [open, setOpen] = useState(false);
  const borderColor = result==="Positivo"?`${C.red}60`:result==="Negativo"?`${C.green}50`:C.border;
  return (
    <div style={{ background:C.surface, border:`1px solid ${borderColor}`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{test.name}</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{test.desc}</div>
        </div>
        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
          {test.video && <a href={test.video} target="_blank" rel="noreferrer"
            style={{ background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:6, padding:"4px 10px", fontSize:11, color:C.green, textDecoration:"none", fontWeight:700 }}>▶ Vídeo</a>}
          <button onClick={()=>setOpen(o=>!o)}
            style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:16, padding:"0 4px" }}>
            {open?"▲":"▼"}
          </button>
        </div>
      </div>
      {open && (
        <div style={{ marginTop:10, background:C.card, borderRadius:8, padding:"10px 12px", fontSize:12, color:C.text, lineHeight:1.7 }}>
          <span style={{ color:C.green, fontWeight:700 }}>Como executar: </span>{test.how}
        </div>
      )}
      <div style={{ display:"flex", gap:6, marginTop:10 }}>
        {["Positivo","Negativo","Não realizado"].map(r=>{
          const ac = r==="Positivo"?C.red:r==="Negativo"?C.green:C.amber;
          return (
            <button key={r} onClick={()=>onResult(r)}
              style={{ flex:1, background:result===r?`${ac}15`:C.card, border:`1px solid ${result===r?ac:C.border}`,
                borderRadius:8, padding:"6px 4px", fontSize:11, fontWeight:result===r?700:400,
                color:result===r?ac:C.textMuted, cursor:"pointer", fontFamily:F }}>
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Knowledge base ────────────────────────────────────────────────────────────
const KB = {
  lombalgia:{
    label:"Lombalgia",
    tests:[
      {name:"Lasègue (SLR)",desc:"Radiculopatia L4-S1. Sens. ~80%.",how:"Paciente em DD. Elevar o membro passivamente com joelho estendido. Positivo: dor irradiada abaixo do joelho < 60°.",video:"https://www.youtube.com/watch?v=rzndCc1HiUk"},
      {name:"Teste de Schober",desc:"Mobilidade da coluna lombar.",how:"Marcar L5 e 10 cm acima em pé. Pedir flexão máxima. Normal: distância aumenta ≥ 5 cm.",video:"https://www.youtube.com/watch?v=iEOiAGoaxQM"},
      {name:"FABER / Patrick",desc:"Disfunção sacroilíaca vs coxofemoral.",how:"Tornozelo do lado testado sobre o joelho contralateral. Pressionar joelho ipsilateral suavemente.",video:"https://www.youtube.com/watch?v=gRvmXN4GSyo"},
      {name:"Gaenslen",desc:"Articulação sacroilíaca.",how:"Paciente na beira da maca. Uma perna em flexão máxima, outra em extensão sobre a maca. Estresse simultâneo.",video:"https://www.youtube.com/watch?v=eLnSdiUZCqY"},
      {name:"Teste de Waddell",desc:"Fatores psicossociais (yellow flags).",how:"Avalia 5 sinais: sensibilidade superficial, simulação, distração, regionalização, reação exagerada.",video:"https://www.youtube.com/watch?v=WOhfYdcj8Jk"},
    ],
    redFlags:["Déficit neurológico progressivo","Síndrome da cauda equina","Fratura/neoplasia suspeita","Febre + dor noturna intensa","Perda de controle esfincteriano"],
    goldStandard:"Exercício terapêutico ativo (McKenzie, estabilização segmentar, CFT). Educação em neurociência da dor (PNE). Terapia manual como adjuvante. Evitar repouso. (Evidência A – Cochrane 2021)",
    yellowFlags:["Catastrofização","Cinesiofobia","Baixa expectativa de recuperação","Insatisfação no trabalho","Depressão/ansiedade"],
  },
  cervicalgia:{
    label:"Cervicalgia",
    tests:[
      {name:"Spurling",desc:"Compressão foraminal / radiculopatia cervical.",how:"Rotacionar e inclinar a cabeça para o lado sintomático + compressão axial suave. Positivo: irradiação para o MS.",video:"https://www.youtube.com/watch?v=GMzS3VbScfc"},
      {name:"Distração Cervical",desc:"Alivia compressão foraminal.",how:"Tracionar levemente a cabeça em posição neutra. Positivo: alívio da dor ou da irradiação.",video:""},
      {name:"Flexion-Rotation Test",desc:"Disfunção C1-C2 / cefaleia cervicogênica.",how:"Paciente em DD, flexão máxima do pescoço + rotação passiva bilateral. Normal ≥ 44°.",video:"https://www.youtube.com/watch?v=RxLJHJG8KbQ"},
      {name:"ULTT (Neurodynamic)",desc:"Tensão neural do MS (mediano, radial, ulnar).",how:"ULTT1 (mediano): abdução 90° + cotovelo extensão + punho extensão + desvio ulnar + inclinação cervical contralateral.",video:""},
    ],
    redFlags:["Mielopatia (Babinski+, marcha atáxica)","Fratura instável","Dissecção de artéria vertebral","Tumor","Infecção"],
    goldStandard:"Terapia manual (manipulação/mobilização C1-C2 para cefaleia) + exercício de controle motor profundo (longo do pescoço, escalenos). Neurogliding para radiculopatia. (CPG JOSPT 2023)",
    yellowFlags:["Dor crônica >3 meses","Cefaleia associada","Tontura cervicogênica"],
  },
  gonalgia:{
    label:"Joelho",
    tests:[
      {name:"Lachman",desc:"LCA – Sens. 85%, Esp. 94%.",how:"Joelho 20-30° de flexão. Fixar fêmur, transladar tíbia anteriormente. Positivo: translação aumentada sem endpoint firme.",video:"https://www.youtube.com/watch?v=CSP3QWhlBDo"},
      {name:"McMurray",desc:"Menisco medial e lateral.",how:"Flex/ext do joelho + RI (menisco lateral) e RE (menisco medial). Positivo: clunk palpável + dor na linha articular.",video:"https://www.youtube.com/watch?v=PEdzdL3cniI"},
      {name:"Thessaly 20°",desc:"Lesão meniscal – mais específico.",how:"Paciente em monopé com 20° de flexão. Realiza rotação do corpo 3x. Positivo: dor ou instabilidade na linha articular.",video:""},
      {name:"Valgus/Varus Stress",desc:"LCM / LCL.",how:"A 0° e 30° de flexão. Aplicar força de valgus/varus. Abertura articular = positivo.",video:""},
      {name:"Clarke / Patelofemoral",desc:"Síndrome patelofemoral.",how:"Pressionar patela inferiormente enquanto o paciente contrai o quadríceps. Positivo: dor retropatelar.",video:""},
    ],
    redFlags:["Bloqueio mecânico do joelho","Hemartrose aguda pós-trauma","Fratura","Luxação patelar irredutível"],
    goldStandard:"LCA: fortalecimento neuromuscular (MOON Knee, ACL-RSI). Patelofemoral: glúteo médio + VMO, controle de alinhamento. Menisco degenerativo: exercício > cirurgia (ESCAPE trial, NEJM 2018).",
    yellowFlags:["Medo de re-lesão","Baixa autoeficácia","Sedentarismo prévio"],
  },
  ombralgia:{
    label:"Ombro",
    tests:[
      {name:"Neer",desc:"Impacto subacromial.",how:"Estabilizar escápula, elevar passivamente em flexão com RI máxima. Positivo: dor antes de 180°.",video:"https://www.youtube.com/watch?v=xFRpE6gS2V0"},
      {name:"Hawkins-Kennedy",desc:"Impacto subacromial – mais sensível.",how:"Flexão 90°, cotovelo 90°. Realizar rotação interna passiva forçada. Positivo: dor subacromial.",video:"https://www.youtube.com/watch?v=8jqvf9dP5f8"},
      {name:"Empty Can (Jobe)",desc:"Integridade do supraespinal.",how:"Abdução 90° no plano da escápula, RI máxima (lata vazia). Resistência manual para baixo. Positivo: fraqueza + dor.",video:""},
      {name:"O'Brien (SLAP)",desc:"Labrum superior (SLAP).",how:"Flexão 90°, adução 15°, RI máxima. Resistência. Repetir em supinação. Positivo: dor profunda que melhora na supinação.",video:""},
      {name:"Apreensão + Relocação",desc:"Instabilidade glenoumeral anterior.",how:"Abdução 90° + RE progressiva. Positivo: sensação de instabilidade. Relocação = alívio.",video:""},
    ],
    redFlags:["Fratura de úmero / clavícula","Luxação irredutível","Ruptura completa em atleta jovem","Tumor de Pancoast"],
    goldStandard:"Impacto sem ruptura: fortalecimento do manguito + escapular > cirurgia (CSAW trial, Lancet 2018). Ruptura completa sintomática: discutir com ortopedia.",
    yellowFlags:["Trabalho com MS elevado","Esportista overhead","Dor noturna persistente"],
  },
  tornozelo:{
    label:"Tornozelo / Pé",
    tests:[
      {name:"Anterior Drawer",desc:"LTFA – ligamento mais frequentemente lesado.",how:"Segurar o calcanhar, transladar o pé anteriormente com tornozelo em 10-20° de plantarflexão. Comparar bilateralmente.",video:""},
      {name:"Talar Tilt",desc:"LCF.",how:"Inversão forçada passiva do pé. Comparar lado a lado.",video:""},
      {name:"Ottawa Ankle Rules",desc:"Necessidade de radiografia.",how:"Dor na ponta do maléolo ou incapacidade de suportar peso (4 passos) → indicação de RX.",video:"https://www.youtube.com/watch?v=rBL1r0C4a9g"},
      {name:"Windlass Test",desc:"Fasciíte plantar.",how:"Dorsiflexão passiva dos dedos com o paciente em pé. Positivo: reprodução de dor no calcâneo/fáscia plantar.",video:""},
      {name:"Thompson",desc:"Ruptura do tendão de Aquiles.",how:"Paciente em DV com pé fora da maca. Apertar a panturrilha. Normal: plantarflexão passiva. Positivo: ausência de movimento.",video:""},
    ],
    redFlags:["Fratura (Ottawa+)","Ruptura de Aquiles","Síndrome compartimental","Luxação talar"],
    goldStandard:"Entorse lateral grau I-II: PEACE & LOVE protocol (2019) → exercício precoce. Fortalecimento fibular + propriocepção reduz recorrência (CPG JOSPT 2021). Fasciíte plantar: alongamento plantar + taloneiras + excêntrico (evidência A).",
    yellowFlags:["Entorses de repetição","Hipermobilidade","Instabilidade crônica"],
  },
  cotovelo:{
    label:"Cotovelo",
    tests:[
      {name:"Teste de Mills",desc:"Epicondilite lateral (Tendinopatia dos extensores).",how:"Cotovelo estendido, pronação de antebraço + flexão de punho passiva. Positivo: dor na epicôndilo lateral.",video:"https://www.youtube.com/watch?v=kJmQKO7YDLA"},
      {name:"Teste de Cozen",desc:"Epicondilite lateral – alta sensibilidade.",how:"Fixar o cotovelo, pedir extensão ativa de punho com resistência manual. Positivo: dor aguda no epicôndilo lateral.",video:"https://www.youtube.com/watch?v=kJmQKO7YDLA"},
      {name:"Teste de Golfer (Medial)",desc:"Epicondilite medial (Tendinopatia dos flexores).",how:"Cotovelo estendido, supinação de antebraço + extensão de punho passiva. Positivo: dor no epicôndilo medial.",video:""},
      {name:"Valgus Stress Test",desc:"Integridade do ligamento colateral ulnar (LCU).",how:"Cotovelo em 20-30° de flexão. Aplicar força em valgo. Positivo: dor medial ou frouxidão.",video:""},
      {name:"Moving Valgus Stress",desc:"LCU – mais específico para atletas arremessadores. Sens. 100%, Esp. 75%.",how:"Ombro abduzido 90°, cotovelo em flexão máxima. Aplicar valgo constante enquanto estende o cotovelo. Positivo: dor entre 70-120° (shear angle).",video:""},
      {name:"Milking Maneuver",desc:"Instabilidade posteromedial / LCU.",how:"Paciente traciona o próprio polegar com cotovelo flexionado >90° e ombro abduzido. Positivo: instabilidade ou dor medial.",video:""},
      {name:"Lateral Pivot Shift (Cotovelo)",desc:"Instabilidade rotatória lateral (IRL) – lassidão do LCR.",how:"Paciente em DD, MS elevado. Supinação + valgo + compressão axial enquanto flexiona o cotovelo. Positivo: subluxação da cabeça do rádio.",video:""},
      {name:"Teste de Compressão do Nervo Ulnar",desc:"Síndrome do canal cubital / neuropatia ulnar.",how:"Flexão máxima do cotovelo por 1 min (Elbow Flexion Test). Positivo: parestesia no 4º/5º dedo.",video:""},
    ],
    redFlags:["Fratura de olécrano / cabeça do rádio","Luxação de cotovelo","Lesão vascular (síndrome compartimental)","Paralisia nervosa completa (radial/ulnar/mediano)","Tumor ósseo"],
    goldStandard:"Epicondilite lateral: exercício excêntrico/isométrico de extensores > AINE (evidência A – Cochrane 2019). Ondas de choque como adjuvante. Evitar injeção de corticoide a longo prazo (recidiva >52 sem). Instabilidade LCU: cirurgia em atletas; conservador em sedentários com fortalecimento de flexores.",
    yellowFlags:["Atividade ocupacional repetitiva (pinça, digitação)","Esportista de raquete / arremessador","Baixa adesão ao repouso relativo","Uso excessivo de mouse/teclado"],
  },
};

const detectKB = txt => {
  const t = txt.toLowerCase();

  if (t.match(/lomb|costas/)) return "lombalgia";
  if (t.match(/cerv|pescoço/)) return "cervicalgia";
  if (t.match(/joelh|gon/)) return "gonalgia";
  if (t.match(/ombr/)) return "ombralgia";
  if (t.match(/tornoz|pé |pe |fasci|aquile/)) return "tornozelo";

  return "";
};

// ── Progress tracker (completeness) ──────────────────────────────────────────
function useProgress(patient, queixaPrincipal, evaMov, gonio, testResults, kb) {
  const steps = [
    { key:"ident",   label:"Identificação", done: !!(patient.nome && patient.dataNasc && patient.sexo) },
    { key:"queixa",  label:"Queixa",        done: queixaPrincipal.length > 5 },
    { key:"dor",     label:"EVA",           done: true },
    { key:"fisico",  label:"Exame físico",  done: !!(patient.peso && patient.altura) },
    { key:"gonio",   label:"Goniometria",   done: gonio.some(g=>g.value) },
    { key:"testes",  label:"Testes",        done: kb ? Object.values(testResults).some(v=>v&&v!=="Não realizado") : true },
  ];
  const pct = Math.round((steps.filter(s=>s.done).length / steps.length)*100);
  return { steps, pct };
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, icon, badge, children, accent }) {
  return (
    <div style={cardStyle({ borderLeft: accent ? `3px solid ${accent}` : undefined })}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.green, flex:1 }}>{title}</h3>
        {badge && <span style={{ fontSize:11, background:C.amberBg, color:C.amber, border:`1px solid ${C.amber}40`, borderRadius:20, padding:"2px 10px" }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Row({ children, cols="1fr 1fr", gap=14 }) {
  return <div style={{ display:"grid", gridTemplateColumns:cols, gap, marginBottom:14 }}>{children}</div>;
}
function Field({ l, children, span }) {
  return <div style={span?{gridColumn:`span ${span}`}:{}}><span style={lbl()}>{l}</span>{children}</div>;
}

// ── Separador visual entre sub-seções ──────────────────────────────────────────
function SubHeading({ children }) {
  return (
    <div style={{ fontSize:11, fontWeight:800, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase",
      borderBottom:`1px solid ${C.border}`, paddingBottom:6, marginBottom:12, marginTop:18 }}>
      {children}
    </div>
  );
}

let _gId = 20;

// ─────────────────────────────────────────────────────────────────────────────
export default function Sasyra() {

  const [tab, setTab] = useState("avaliacao");


  // ── Patient state ──────────────────────────────────────────────────────────
  const [pt, setPt] = useState({
    nome:"", dataNasc:"", sexo:"", lateralidade:"", estadoCivil:"",
    profissao:"", convenio:"", sessoesAuth:"", telefone:"",
    peso:"", altura:"", data:new Date().toISOString().slice(0,10),
  });
  const up = (k,v) => setPt(p=>({...p,[k]:v}));

  // ── Anamnese ───────────────────────────────────────────────────────────────
  const [queixa, setQueixa]           = useState("");
  const [queixaKey, setQueixaKey]     = useState("");
  const [localDor]       = useState([]);
  const [caraterDor]   = useState([]);
  const [tempoDor]       = useState("");
  const [melhora]         = useState([]);
  const [piora]             = useState([]);
  const [hda]                 = useState("");
  const [comorbid]       = useState([]);
  const [antec]             = useState([]);
  const [meds]               = useState("");
const [yellowFlags] = useState([]);



  // ── Funcional ──────────────────────────────────────────────────────────────
  const [evaMov, setEvaMov] = useState(null);
  const [evaRep, setEvaRep] = useState(null);
  const [avds, setAvds]         = useState([]);
  const [objTrat, setObjTrat]   = useState([]);
  const [nivelAti] = useState("");


  // ── Físico ─────────────────────────────────────────────────────────────────
  const [postura, setPostura]       = useState([]);
  const [marcha, setMarcha]         = useState("");
  const [edema, setEdema]           = useState("");
  const [palpacao, setPalpacao]     = useState("");
  const [sensib, setSensib]         = useState("");
  const [reflexos, setReflexos]     = useState("");
  const [forca, setForca]           = useState({
    quadricepsD:"",quadricepsE:"",isquiotibialD:"",isquiotibialE:"",
    gluteoD:"",gluteoE:"",manguitoD:"",manguitoE:"",
    tibialAnterior:"",gastrocnemio:"",bicepsD:"",bicepsE:"",
  });

  // ── Goniometria ────────────────────────────────────────────────────────────
  const [gonio, setGonio] = useState([{id:1,joint:"",movement:"",value:""}]);
  const addG  = () => setGonio(g=>[...g,{id:_gId++,joint:"",movement:"",value:""}]);
  const updG  = (id,row) => setGonio(g=>g.map(r=>r.id===id?row:r));
  const remG  = id => setGonio(g=>g.filter(r=>r.id!==id));

  // ── Testes especiais ───────────────────────────────────────────────────────
  const [tests, setTests] = useState({});

  // ── Observações / IA ───────────────────────────────────────────────────────
  const [obs, setObs]         = useState("");
  const [aiLoad, setAiLoad]   = useState(false);
  const [aiRes, setAiRes]     = useState("");

  // ── Diário state ─────────────────────────────────────────────────────────
  const [logs, setLogs] = useState([]);
  const [df, setDf] = useState({
    data: new Date().toISOString().slice(0,10),
    eva: 5,
    procedimentos: [],
    resposta: "",
    evolucao: "",
    metas: "",
  });

  const kb = KB[queixaKey];


const evidence = EVIDENCE[queixaKey];

const autoCIF = generateCIF({
   evaMov,
  evaRep,
  avds,
  localDor,
  gonio,
  tests,
  yellowFlags,
  tempoDor
});

const cifSuggestions = evidence?.cif || [];

const imc = calcIMC(pt.peso, pt.altura);

// Intercepta e calibra os dados para o cálculo correto da barra de progresso
// ── Filtro de segurança para forçar o progresso a começar em 0% ────────────────
const isEvaValid = evaMov !== null && evaMov !== undefined && evaMov !== "";
const cleanEva = isEvaValid ? evaMov : null;

// Só valida os testes se kb existir, o objeto tiver chaves e algum valor preenchido que não seja vazio ou "Não realizado"
const hasFilledTests = kb && 
  Object.keys(tests || {}).length > 0 && 
  Object.values(tests).some(v => v !== "" && v !== undefined && v !== null && v !== "Não realizado");
const cleanTests = hasFilledTests ? tests : {};

// Enviamos os dados limpos para a função original
const { steps: progSteps, pct: progPct } =
  useProgress(pt, queixa, cleanEva, gonio, cleanTests, kb);

  // ── AI call ────────────────────────────────────────────────────────────────
  const runAI = async () => {
    setAiLoad(true); setAiRes("");
    try {
      const summary = [
        `Paciente: ${pt.nome}, ${pt.sexo}, nasc. ${pt.dataNasc}, profissão: ${pt.profissao}`,

        `IMC: ${imc?.value||"—"} (${imc?.l||"—"}), Peso: ${pt.peso}kg, Altura: ${pt.altura}cm`,
        `Queixa: ${queixa}`,
        `Local: ${localDor.join(", ")} | Caráter: ${caraterDor.join(", ")} | Tempo: ${tempoDor}`,
        `Melhora: ${melhora.join(", ")} | Piora: ${piora.join(", ")}`,
        `HDA: ${hda}`,
        `EVA mov: ${evaMov}/10 | EVA rep: ${evaRep}/10`,
        `Nível atividade: ${nivelAti} | AVDs comprometidas: ${avds.join(", ")}`,
        `Postura: ${postura.join(", ")} | Marcha: ${marcha}`,
        `Edema: ${edema} | Sensibilidade: ${sensib} | Reflexos: ${reflexos}`,
        `Força muscular: ${Object.entries(forca).filter(([,v])=>v).map(([k,v])=>`${k}:${v}`).join(", ")}`,
        `Goniometria: ${gonio.filter(g=>g.value).map(g=>`${g.joint} ${g.movement}:${g.value}°`).join("; ")}`,
        `Testes especiais: ${Object.entries(tests).filter(([,v])=>v&&v!=="Não realizado").map(([k,v])=>`${k}:${v}`).join("; ")}`,
        `Comorbidades: ${comorbid.join(", ")} | Antecedentes: ${antec.join(", ")} | Medicamentos: ${meds}`,
        `Yellow flags: ${yellowFlags.join(", ")}`,
        `Observações: ${obs}`,
      ].join("\n");

      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:
`Você é fisioterapeuta ortopédico especialista em medicina baseada em evidências.
Com base nos dados clínicos abaixo, forneça uma análise estruturada:

1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)
2. OBJETIVOS TERAPÊUTICOS (curto / médio / longo prazo)
3. PLANO DE TRATAMENTO PADRÃO-OURO (cite ensaios clínicos e meta-análises com ano)
4. FREQUÊNCIA, DURAÇÃO E Nº DE SESSÕES SUGERIDAS
5. CRITÉRIOS DE PROGRESSÃO E ALTA
6. ALERTAS, CONTRAINDICAÇÕES E REFERÊNCIA MÉDICA (se indicada)
7. ESCALAS FUNCIONAIS RECOMENDADAS para acompanhamento

DADOS:
${summary}

Responda em português, em tópicos claros. Seja preciso e clínico.`
          }]
        })
      });
      const d = await res.json();
      setAiRes(d.content?.map(c=>c.text||"").join("\n")||"Sem resposta.");
    } catch { setAiRes("Erro ao consultar IA. Verifique a conexão."); }
    setAiLoad(false);
  };

  const addLog = () => {
    setLogs(l => [{ ...df, id: Date.now(), sessaoNum: l.length + 1 }, ...l]);
    setDf({ data: new Date().toISOString().slice(0, 10), eva: 5, procedimentos: [], resposta: "", evolucao: "", metas: "" });
  };


  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text}}>

      {/* ── Header ── */}
      <div style={{background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60}}>
        <LogoSVG/>

        <div style={{display:"flex",gap:4}}>
          {[["avaliacao","📋","Avaliação"],["diario","📅","Diário"],["relatorio","📊","Relatório"]].map(([k,ic,lb])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              background:tab===k?C.greenBg:"transparent",
              border:`1px solid ${tab===k?C.green+"50":"transparent"}`,
              borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:tab===k?700:400,
              color:tab===k?C.green:C.textMuted, cursor:"pointer", fontFamily:F
            }}>{ic} {lb}</button>
          ))}
        </div>
        {pt.nome && (
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,background:C.greenBg,border:`1px solid ${C.green}40`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:C.green}}>
              {pt.nome[0]?.toUpperCase()}
            </div>
            <span style={{fontSize:12,color:C.textSub,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pt.nome}</span>
          </div>
        )}
      </div>

      {/* ── Progress bar ── */}
      <div style={{background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"8px 24px"}}>

        <div style={{display:"flex",alignItems:"center",gap:10,maxWidth:860,margin:"0 auto"}}>
          <div style={{display:"flex",gap:4,flex:1}}>
            {progSteps.map(s=>(
              <div key={s.key} style={{flex:1}}>
                <div style={{height:3,background:s.done?C.green:C.border,borderRadius:99,transition:"background 0.2s"}}/>
                <div style={{fontSize:9,color:s.done?C.green:C.textDim,marginTop:3,textAlign:"center",letterSpacing:"0.06em"}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,fontWeight:800,color:progPct===100?C.green:C.textMuted,minWidth:36,textAlign:"right"}}>{progPct}%</div>
        </div>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"20px 16px"}}>

        {/* ══════════════════════ AVALIAÇÃO ══════════════════════════════════ */}
        {tab==="avaliacao" && <>

          {/* Identificação */}
          <Section title="Identificação do Paciente" icon="👤">
            <Row cols="1fr 1fr 1fr">
              <Field l="Nome completo" span={2}>
                <input value={pt.nome} onChange={e=>up("nome",e.target.value)} style={inp()} placeholder="Nome completo do paciente"/>
              </Field>
              <Field l="Data da avaliação">
                <input type="date" value={pt.data} onChange={e=>up("data",e.target.value)} style={inp()}/>
              </Field>
            </Row>
            <Row cols="1fr 1fr 1fr">
              <Field l="Data de nascimento">
                <input type="date" value={pt.dataNasc} onChange={e=>up("dataNasc",e.target.value)} style={inp()}/>
              </Field>
              <Field l="Sexo">
                <SingleSelect options={["Masculino","Feminino","Outro"]} value={pt.sexo} onChange={v=>up("sexo",v)}/>
              </Field>
              <Field l="Lateralidade">
                <SingleSelect options={["Destro","Canhoto","Ambidestro"]} value={pt.lateralidade} onChange={v=>up("lateralidade",v)}/>
              </Field>
            </Row>
            <Row cols="1fr 1fr 1fr">
              <Field l="Estado civil">
                <select value={pt.estadoCivil} onChange={e=>up("estadoCivil",e.target.value)} style={sel()}>
                  <option value="">Selecionar…</option>
                  {["Solteiro(a)","Casado(a)","Divorciado(a)","Viúvo(a)","União estável"].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field l="Profissão">
                <input value={pt.profissao} onChange={e=>up("profissao",e.target.value)} style={inp()} placeholder="Ocupação atual"/>
              </Field>
              <Field l="Telefone">
                <input value={pt.telefone} onChange={e=>up("telefone",e.target.value)} style={inp()} placeholder="(00) 00000-0000"/>
              </Field>
            </Row>

            <SubHeading>Dados clínicos e administrativos</SubHeading>
            <Row cols="1fr 1fr 1fr">
              <Field l="Convênio / Particular">
                <select value={pt.convenio} onChange={e=>up("convenio",e.target.value)} style={sel()}>
                  <option value="">Selecionar…</option>
                  {["Particular","Unimed","Bradesco Saúde","Amil","SulAmérica","Hapvida","NotreDame","IPSEMG","SUS / NASF","Outro"].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field l="Sessões autorizadas">
                <SessionCounter value={pt.sessoesAuth} onChange={v=>up("sessoesAuth",v)}/>
              </Field>
              <div/>
            </Row>

            <SubHeading>Antropometria</SubHeading>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14}}>
              <NumericDrum label="Peso" value={pt.peso} onChange={v=>up("peso",String(v))} min={30} max={250} step={0.5} unit="kg"/>
              <NumericDrum label="Altura" value={pt.altura} onChange={v=>up("altura",String(v))} min={100} max={220} step={1} unit="cm"/>
              <div>
                <span style={lbl()}>IMC calculado</span>
                <div style={{
                  background:C.surface, border:`1px solid ${imc?imc.c+"50":C.border}`,
                  borderRadius:10, height:44, display:"flex", alignItems:"center", justifyContent:"center",
                  gap:8
                }}>
                  {imc ? <>
                    <span style={{fontSize:22,fontWeight:900,color:imc.c}}>{imc.value}</span>
                    <span style={{fontSize:11,color:imc.c,fontWeight:700}}>{imc.l}</span>
                  </> : <span style={{fontSize:12,color:C.textDim}}>Preencha peso e altura</span>}
                </div>
              </div>
            </div>
          </Section>

 {/* Queixa e Anamnese */}
<Section title="Queixa Principal e Anamnese" icon="📝">
  <Field l="Queixa principal — digite ou use o microfone">
    <AudioField
      value={queixa}
      onChange={v => {
        const texto =
          typeof v === "function"
            ? v(queixa)
            : v;

        setQueixa(texto);
        setQueixaKey(detectKB(texto));
      }}
      placeholder="Ex: Lombalgia com irradiação para MMII há 3 semanas após queda…"
      rows={2}
    />
  </Field>

 {/* KB alert block */}
{kb && (
  <div
    style={{
      background: C.greenBg,
      border: `1px solid ${C.green}40`,
      borderRadius: 10,
      padding: "12px 14px",
      margin: "12px 0"
    }}
  >
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: C.green,
        marginBottom: 6
      }}
    >
      ✓ Condição identificada: <strong>{kb.label}</strong> — protocolos e testes carregados automaticamente
    </div>

    {cifSuggestions?.length > 0 && (
      <div
        style={{
          marginTop: 12,
          marginBottom: 12,
          background: "#F8FAFC",
          padding: "10px",
          borderRadius: "8px"
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: 8,
            color: "#0F6E56"
          }}
        >
          CIF sugeridos
        </div>

        {cifSuggestions.map((code) => (
          <div key={code}>
            <strong>{code}</strong> - {CIF[code]}
          </div>
        ))}
      </div>
    )}

    {autoCIF.length > 0 && (
  <div
    style={{
      marginTop: 12,
      background: "#EEFDF5",
      padding: 10,
      borderRadius: 8
    }}
  >
    <div
      style={{
        fontWeight: 700,
        marginBottom: 8
      }}
    >
      CIF identificados automaticamente
    </div>

    {autoCIF.map(item => (
      <div key={`${item.code}-${item.qualifier}`}>
        <strong>{item.code}</strong>
        {" - "}
        {item.desc}
        {" | Qualificador "}
        <strong>{item.qualifier}</strong>
      </div>
    ))}
  </div>
)}

    <div
      style={{
        background: C.redBg,
        border: `1px solid ${C.red}40`,
        borderRadius: 8,
        padding: "8px 12px",
        marginBottom: 8
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: C.red,
          letterSpacing: "0.1em",
          marginBottom: 5
        }}
      >
        🚩 RED FLAGS — INVESTIGAR ANTES DE PROSSEGUIR
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 5
        }}
      >
        {kb.redFlags.map((f) => (
          <span
            key={f}
            style={{
              fontSize: 11,
              color: C.red,
              background: C.redBg,
              border: `1px solid ${C.red}30`,
              borderRadius: 6,
              padding: "2px 10px"
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>

    <div
      style={{
        fontSize: 11,
        color: C.textSub,
        lineHeight: 1.6
      }}
    >
      <strong style={{ color: C.greenDim }}>
        Padrão-ouro:
      </strong>{" "}
      {kb.goldStandard}
    </div>
  </div>
)}
          </Section>

          {/* Dor e Funcionalidade */}
          <Section title="Dor e Funcionalidade" icon="⚡">
            <Row cols="1fr 1fr">
              <div>
                <EvaSlider label="EVA — Movimento" value={evaMov} onChange={setEvaMov}/>
                <div style={{marginTop:18}}>
                  <EvaSlider label="EVA — Repouso" value={evaRep} onChange={setEvaRep}/>
                </div>
              </div>
              <div>
                <Field l="Limitações nas AVDs">
                  <TagSelect options={["Andar","Subir escadas","Agachar","Sentar/levantar","Vestir-se","Higiene pessoal","Dormir","Dirigir","Trabalho manual","Esporte","Carregar peso","Vida sexual","Sem limitações"]}
                    value={avds} onChange={setAvds}/>
                </Field>
                <div style={{marginTop:14}}>
                  <Field l="Objetivo principal (expectativa do paciente)">
                    <TagSelect options={["Eliminar a dor","Retornar ao trabalho","Retornar ao esporte","Independência nas AVDs","Melhorar postura","Fortalecer","Prevenir recidiva","Melhorar qualidade de vida"]}
                      value={objTrat} onChange={setObjTrat}/>
                  </Field>
                </div>
              </div>
            </Row>
          </Section>

          {/* Exame Físico */}
          <Section title="Exame Físico" icon="🔬">
            <SubHeading>Inspeção e marcha</SubHeading>
            <Row cols="1fr 1fr">
              <Field l="Alterações posturais">
                <TagSelect options={["Anteriorização de cabeça","Protração de ombros","Hipercifose torácica","Hiperlordose lombar","Retificação lombar","Escoliose funcional","Escoliose estrutural","Pelve anteriorizada","Pelve posteriorizada","Joelho varo","Joelho valgo","Recurvatum","Pé plano","Pé cavo","Sem alterações"]}
                  value={postura} onChange={setPostura}/>
              </Field>
              <div>
                <Field l="Padrão de marcha">
                  <select value={marcha} onChange={e=>setMarcha(e.target.value)} style={sel()}>
                    <option value="">Selecionar…</option>
                    {["Normal","Antálgica","Trendelenburg","Equina","Hemiplégica","Atáxica","Claudicação intermitente","Não avaliado"].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <div style={{marginTop:12}}>
                  <Field l="Edema / Sinais flogísticos">
                    <select value={edema} onChange={e=>setEdema(e.target.value)} style={sel()}>
                      <option value="">Selecionar…</option>
                      {["Ausente","Edema leve (1+)","Edema moderado (2+)","Edema importante (3+)","Calor local","Rubor","Derrame articular","Crepitação"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={{marginTop:12}}>
                  <Field l="Sensibilidade">
                    <select value={sensib} onChange={e=>setSensib(e.target.value)} style={sel()}>
                      <option value="">Selecionar…</option>
                      {["Normal","Hipoestesia","Hiperestesia","Parestesia","Anestesia","Alodínia"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={{marginTop:12}}>
                  <Field l="Reflexos osteotendinosos">
                    <select value={reflexos} onChange={e=>setReflexos(e.target.value)} style={sel()}>
                      <option value="">Selecionar…</option>
                      {["Normais (2+)","Hiporreflexia (1+)","Arreflexia (0)","Hiperreflexia (3+/4+)","Assimétricos"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            </Row>

            <SubHeading>Palpação</SubHeading>
            <AudioField value={palpacao} onChange={v=>setPalpacao(typeof v==="function"?v(palpacao):v)}
              placeholder="Pontos gatilho, espasmo muscular, dor à palpação de processos espinhosos, hipersensibilidade local…" rows={2}/>

            <SubHeading>Força Muscular — Escala MRC (0–5)</SubHeading>
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10}}>
              {[
                ["quadricepsD","Quadríceps D"],["quadricepsE","Quadríceps E"],
                ["isquiotibialD","Isquiotib. D"],["isquiotibialE","Isquiotib. E"],
                ["gluteoD","Glúteo D"],["gluteoE","Glúteo E"],
                ["manguitoD","Manguito D"],["manguitoE","Manguito E"],
                ["tibialAnterior","Tibial Ant."],["gastrocnemio","Gastrocnêmio"],
                ["bicepsD","Bíceps D"],["bicepsE","Bíceps E"],
              ].map(([k,l2])=>(
                <div key={k}>
                  <span style={{...lbl(), fontSize:9}}>{l2}</span>
                  <MRCSelect value={forca[k]} onChange={v=>setForca(f=>({...f,[k]:v}))}/>
                </div>
              ))}
            </div>
          </Section>

          {/* Goniometria */}
          <Section title="Goniometria" icon="📐" badge={`${gonio.filter(g=>g.value).length} med.`}>
            <div style={{display:"grid",gridTemplateColumns:"1.8fr 1.8fr 76px 72px 28px",gap:8,paddingBottom:8,borderBottom:`1px solid ${C.border}`,marginBottom:4}}>
      {["Articulação","Movimento","Grau","Ref.",""].map((h,index)=>(
                <span key={index} style={{fontSize:9,fontWeight:700,color:C.textDim,letterSpacing:"0.08em",textTransform:"uppercase",textAlign:index>=2?"center":"left"}}>{h}</span>
              ))}

            </div>
            {gonio.map(row=>(
              <GonioRow key={row.id} row={row} onUpdate={u=>updG(row.id,u)} onRemove={()=>remG(row.id)}/>
            ))}
            <button onClick={addG} style={{...ghostBtn(), marginTop:12, fontSize:12}}>+ Adicionar medida</button>
          </Section>


          {/* Testes especiais */}
          {kb && (
            <Section title={`Testes Especiais — ${kb.label}`} icon="🔬">
              <p style={{fontSize:12,color:C.textMuted,margin:"0 0 14px"}}>
                Selecione o resultado. Clique em ▼ para ver a execução ou em ▶ Vídeo para demonstração em vídeo.
              </p>
              {kb.tests.map(t=>(
                <TestCard key={t.name} test={t} result={tests[t.name]||""} onResult={v=>setTests(tr=>({...tr,[t.name]:v}))}/>
              ))}
            </Section>
          )}

          {/* Observações */}
          <Section title="Observações Clínicas" icon="💬">
            <AudioField value={obs} onChange={v=>setObs(typeof v==="function"?v(obs):v)}
              placeholder="Comportamento do paciente, achados adicionais, exames de imagem relevantes, considerações clínicas…" rows={4}/>
          </Section>

          {/* IA */}
          <Section title="Análise por Inteligência Artificial" icon="🤖" accent={C.green}>
            <p style={{fontSize:12,color:C.textMuted,margin:"0 0 14px",lineHeight:1.7}}>
              Preencha os campos da avaliação e clique em analisar. A IA irá cruzar os dados clínicos com evidências científicas atualizadas e gerar um plano de tratamento personalizado.
            </p>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <button onClick={runAI} disabled={aiLoad||!queixa}
                style={{...primaryBtn(), opacity:aiLoad||!queixa?0.45:1}}>
                {aiLoad ? "⏳ Analisando…" : "🔍 Gerar análise clínica"}
              </button>
              <div style={{display:"flex",gap:6}}>
                {progSteps.filter(s=>!s.done).map(s=>(
                  <span key={s.key} style={{fontSize:10,color:C.amber,background:C.amberBg,border:`1px solid ${C.amber}30`,borderRadius:6,padding:"2px 8px"}}>
                    Pendente: {s.label}
                  </span>
                ))}
              </div>
            </div>
            {aiRes && (
              <div style={{marginTop:16,background:C.surface,border:`1px solid ${C.green}30`,borderRadius:10,padding:18}}>
                <div style={{fontSize:10,fontWeight:800,color:C.green,letterSpacing:"0.1em",marginBottom:12}}>ANÁLISE CLÍNICA — SASYRA IA</div>
                <pre style={{fontSize:13,color:C.text,whiteSpace:"pre-wrap",margin:0,lineHeight:1.85,fontFamily:F}}>{aiRes}</pre>
              </div>
            )}
          </Section>
        </>}

        {/* ══════════════════════ DIÁRIO ═══════════════════════════════════════ */}
        {tab==="diario" && <>

          {/* Indicadores de sessão */}
          {pt.sessoesAuth && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
              {[
                ["Sessões realizadas", logs.length, C.green],
                ["Autorizadas", pt.sessoesAuth, C.amber],
                ["Restantes", Math.max(0, Number(pt.sessoesAuth)-logs.length), logs.length>=Number(pt.sessoesAuth)?C.red:C.blue],
              ].map(([l2,v,c])=>(
                <div key={l2} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:C.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{l2}</div>
                  <div style={{fontSize:30,fontWeight:900,color:c,lineHeight:1}}>{v}</div>
                </div>
              ))}
            </div>
          )}

          <Section title="Registrar Nova Sessão" icon="📅">
            <Row cols="1fr 1fr">
              <Field l="Data">
                <input type="date" value={df.data} onChange={e=>setDf(f=>({...f,data:e.target.value}))} style={inp()}/>
              </Field>
              <EvaSlider label="EVA da sessão" value={df.eva} onChange={v=>setDf(f=>({...f,eva:v}))}/>
            </Row>

            <Field l="Procedimentos realizados">
              <TagSelect
                options={["TENS","FES","Ultrassom terapêutico","Laser de baixa potência","Magnetoterapia","Crioterapia","Termoterapia","Massagem terapêutica","Mobilização articular","Manipulação","Tração","Dry needling","Ventosaterapia","Bandagem funcional","Kinesio taping","RPG","Pilates clínico","Cinesioterapia","Treino de força","Treino proprioceptivo","Treino funcional","Exercício neuromotor","Liberação miofascial","Hidroterapia","Alongamento global"]}
                value={df.procedimentos} onChange={v=>setDf(f=>({...f,procedimentos:v}))}/>
            </Field>

            <Row cols="1fr 1fr">
              <Field l="Resposta ao tratamento">
                <SingleSelect options={["Excelente melhora","Boa melhora","Melhora parcial","Sem melhora","Piora","Intercorrência"]}
                  value={df.resposta} onChange={v=>setDf(f=>({...f,resposta:v}))} activeColor={C.green}/>
              </Field>
              <Field l="Meta para próxima sessão">
                <input value={df.metas} onChange={e=>setDf(f=>({...f,metas:e.target.value}))} style={inp()} placeholder="Progressão de carga, novo exercício…"/>
              </Field>
            </Row>

            <Field l="Evolução clínica / prontuário">
              <AudioField value={df.evolucao} onChange={v=>setDf(f=>({...f,evolucao:typeof v==="function"?v(f.evolucao):v}))} rows={3}
                placeholder="Paciente refere melhora de… Apresenta… Realizado… Tolerou bem o procedimento…"/>
            </Field>

            <button onClick={addLog} style={primaryBtn()}>+ Salvar sessão</button>
          </Section>

          {/* EVA trend mini chart */}
          {logs.length >= 2 && (
            <Section title="Evolução da Dor (EVA)" icon="📈">
              <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80,padding:"0 4px"}}>
                {[...logs].reverse().map((l,i)=>{


                  const h = (l.eva/10)*72;
                  const c = l.eva<=3?C.green:l.eva<=6?C.amber:C.red;
                  return (
                    <div key={l.id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <span style={{fontSize:9,color:c,fontWeight:700}}>{l.eva}</span>
                      <div style={{width:"100%",height:h,background:c,borderRadius:"4px 4px 0 0",opacity:0.8}}/>
                      <span style={{fontSize:8,color:C.textDim,transform:"rotate(-30deg)",transformOrigin:"top left",whiteSpace:"nowrap",marginTop:2}}>S{i+1}</span>


                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textMuted,marginTop:16}}>
                <span>S1 (inicial)</span>
                <span>S{logs.length} (última)</span>
              </div>
            </Section>
          )}

          {logs.length > 0 && (
            <Section title={`Histórico — ${logs.length} sessão(ões)`} icon="📋">
              {logs.map((log)=>{
                const ec = log.eva<=3?C.green:log.eva<=6?C.amber:C.red;
                return (
                  <div key={log.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:11,background:C.greenBg,color:C.green,border:`1px solid ${C.green}30`,borderRadius:6,padding:"2px 8px",fontWeight:700}}>Sessão {log.sessaoNum}</span>
                        <span style={{fontSize:12,color:C.textMuted}}>{log.data}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {log.resposta && <span style={{fontSize:11,color:C.textSub,background:C.cardAlt,borderRadius:6,padding:"2px 8px"}}>{log.resposta}</span>}
                        <span style={{fontSize:22,fontWeight:900,color:ec,lineHeight:1}}>{log.eva}<span style={{fontSize:11,fontWeight:400,color:C.textMuted}}>/10</span></span>
                      </div>
                    </div>
                    {log.procedimentos.length>0 && (
                      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
                        {log.procedimentos.map(p=>(
                          <span key={p} style={{fontSize:10,color:C.textMuted,background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"2px 7px"}}>{p}</span>
                        ))}
                      </div>
                    )}
                    {log.evolucao && <p style={{margin:"4px 0",fontSize:13,color:C.text,lineHeight:1.6}}>{log.evolucao}</p>}
                    {log.metas && <p style={{margin:"6px 0 0",fontSize:11,color:C.textMuted}}>→ Próxima: {log.metas}</p>}
                  </div>
                );
              })}
            </Section>
          )}
        </>}

        {/* ══════════════════════ RELATÓRIO ════════════════════════════════════ */}
        {tab==="relatorio" && (
          <Section title="Relatório Multidisciplinar" icon="📊">
            <div style={{background:"#fff",borderRadius:12,padding:28,color:"#1a202c",fontFamily:F}}>

              {/* Header relatório */}
              <div style={{display:"flex",alignItems:"center",gap:14,borderBottom:"3px solid #4ADE80",paddingBottom:14,marginBottom:22}}>
                <svg viewBox="0 0 220 50" width="140" height="36">
                  <g transform="translate(18,25)">
                    <path d="M -12 7 C -7 2,0 0,12 -7" fill="none" stroke="#4ADE80" strokeWidth="3.5" strokeLinecap="round"/>
                    <path d="M -12 -3 C -3 0,3 2,12 8" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="0" cy="0" r="4" fill="#FBBF24"/>
                  </g>
                  <text x="40" y="30" fill="#0E141B" fontSize="22" fontWeight="800" letterSpacing="5" fontFamily={F}>SASYRA</text>
                  <text x="42" y="44" fill="#4ADE80" fontSize="8" fontWeight="700" letterSpacing="4" fontFamily={F}>REABILITAÇÃO E EVIDÊNCIA</text>
                </svg>
                <div style={{borderLeft:"1px solid #E2E8F0",paddingLeft:14}}>
                  <div style={{fontWeight:800,fontSize:15,color:"#0E141B"}}>RELATÓRIO DE FISIOTERAPIA ORTOPÉDICA</div>
                  <div style={{fontSize:11,color:"#7C8FA6"}}>Gerado em {new Date().toLocaleDateString("pt-BR")} · Para equipe multidisciplinar</div>
                </div>
              </div>

              {/* Dados paciente */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
                {[
                  ["Paciente",pt.nome||"—"],["Nascimento",pt.dataNasc||"—"],
                  ["Sexo",pt.sexo||"—"],["Profissão",pt.profissao||"—"],
                  ["Convênio",pt.convenio||"—"],["Sessões auth.",pt.sessoesAuth||"—"],
                  ["Peso/Altura",pt.peso&&pt.altura?`${pt.peso}kg / ${pt.altura}cm`:"—"],
                  ["IMC",imc?`${imc.value} (${imc.l})`:"—"],
                ].map(([k,v])=>(
                  <div key={k} style={{background:"#F8FAFC",borderRadius:8,padding:"8px 12px"}}>
                    <div style={{fontSize:9,color:"#7C8FA6",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{k}</div>
                    <div style={{fontWeight:700,fontSize:13,color:"#0E141B",marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Queixa + HDA */}
              {queixa && <>
                <div style={{marginBottom:14}}>
                  <div style={{fontWeight:700,color:"#0F6E56",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5}}>Queixa principal</div>
                  <p style={{margin:0,fontSize:14,color:"#1a202c"}}>{queixa}</p>
                </div>
                {hda && <div style={{marginBottom:14}}>
                  <div style={{fontWeight:700,color:"#0F6E56",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5}}>HDA</div>
                  <p style={{margin:0,fontSize:13,color:"#374151",lineHeight:1.7}}>{hda}</p>
                </div>}
              </>}

              {/* EVA cards */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
                {[[evaMov,"EVA Movimento"],[evaRep,"EVA Repouso"]].map(([v,l2])=>{
                  const bc = v>=7?"#FEF2F2":v>=4?"#FFFBEB":"#F0FDF4";
                  const tc = v>=7?"#E24B4A":v>=4?"#BA7517":"#3B6D11";
                  return (
                    <div key={l2} style={{background:bc,borderRadius:8,padding:"12px 16px",textAlign:"center"}}>
                      <div style={{fontSize:9,color:"#7C8FA6",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l2}</div>
                      <div style={{fontSize:36,fontWeight:900,color:tc,lineHeight:1.1}}>{v}<span style={{fontSize:14,fontWeight:400}}>/10</span></div>
                      <div style={{fontSize:11,color:tc}}>{v===0?"Sem dor":v<=3?"Leve":v<=6?"Moderada":v<=8?"Intensa":"Máxima"}</div>
                    </div>
                  );
                })}
              </div>

              {/* Goniometria */}
              {gonio.filter(g=>g.value).length>0 && (
                <div style={{marginBottom:18}}>
                  <div style={{fontWeight:700,color:"#0F6E56",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Goniometria</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead><tr style={{background:"#F8FAFC"}}>
                      {["Articulação","Movimento","Medida","Referência","Status"].map(h=>(
                        <th key={h} style={{padding:"7px 10px",textAlign:"left",fontWeight:700,fontSize:10,color:"#7C8FA6",textTransform:"uppercase"}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {gonio.filter(g=>g.value).map(g=>{
                        const ref = getRef(g.movement,g.joint);
                        const oor = isOutOfRange(g.value,ref);
                        return (
                          <tr key={g.id} style={{borderBottom:"1px solid #F1F5F9"}}>
                            <td style={{padding:"6px 10px"}}>{g.joint}</td>
                            <td style={{padding:"6px 10px"}}>{g.movement}</td>
                            <td style={{padding:"6px 10px",fontWeight:800,color:oor?"#E24B4A":"#0F6E56"}}>{g.value}°</td>
                            <td style={{padding:"6px 10px",color:"#7C8FA6"}}>{ref?`${ref}°`:"—"}</td>
                            <td style={{padding:"6px 10px"}}>{oor?<span style={{fontSize:11,color:"#E24B4A",fontWeight:700}}>⚠ Acima do ref.</span>:<span style={{fontSize:11,color:"#3B6D11"}}>✓</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Testes */}
              {Object.entries(tests).filter(([,v])=>v&&v!=="Não realizado").length>0 && (
                <div style={{marginBottom:18}}>
                  <div style={{fontWeight:700,color:"#0F6E56",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Testes especiais</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {Object.entries(tests).filter(([,v])=>v&&v!=="Não realizado").map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",background:"#F8FAFC",borderRadius:8,padding:"6px 12px",fontSize:13}}>
                        <span style={{color:"#374151"}}>{k}</span>
                        <span style={{fontWeight:700,color:v==="Positivo"?"#E24B4A":"#3B6D11"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IA */}
              {aiRes && (
                <div style={{marginBottom:18}}>
                  <div style={{fontWeight:700,color:"#0F6E56",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Plano de tratamento — análise IA</div>
                  <pre style={{fontSize:12,whiteSpace:"pre-wrap",background:"#F8FAFC",borderRadius:8,padding:14,margin:0,fontFamily:F,lineHeight:1.8,color:"#1a202c"}}>{aiRes}</pre>
                </div>
              )}

              {/* Evolução */}
              {logs.length>0 && (
                <div style={{marginBottom:18}}>
                  <div style={{fontWeight:700,color:"#0F6E56",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Evolução — {logs.length} sessão(ões)</div>
                  {[...logs].reverse().map((l)=>(
                    <div key={l.id} style={{borderLeft:"3px solid #4ADE80",paddingLeft:12,marginBottom:10}}>
                      <div style={{fontSize:11,color:"#7C8FA6",marginBottom:2}}>
                        Sessão {l.sessaoNum} · {l.data} · EVA {l.eva}/10{l.resposta?` · ${l.resposta}`:""}
                      </div>
                      {l.evolucao && <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{l.evolucao}</div>}
                    </div>
                  ))}
                </div>
              )}

              <div style={{borderTop:"1px solid #E2E8F0",marginTop:20,paddingTop:12,fontSize:10,color:"#7C8FA6",textAlign:"center"}}>
                SASYRA · Reabilitação e Evidência · Documento gerado para equipe multidisciplinar
              </div>
            </div>
            <div style={{marginTop:14,display:"flex",gap:10}}>
              <button onClick={()=>window.print()} style={primaryBtn()}>🖨️ Imprimir / Salvar PDF</button>
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}
