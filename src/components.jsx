/* eslint-disable react-refresh/only-export-components */
import { useState, useRef, useEffect, useMemo } from "react";
import YouTube from "react-youtube";

export function useMediaQuery(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = (e) => setMatch(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [query]);
  return match;
}
const C = {
  bg:          "var(--bg)",
  surface:     "var(--surface)",
  card:        "var(--card)",
  cardAlt:     "var(--cardAlt)",
  border:      "var(--border)",
  borderLight: "var(--borderLight)",
  green:       "var(--green)",
  greenDim:    "var(--greenDim)",
  greenDeep:   "var(--greenDeep)",
  greenBg:     "var(--greenBg)",
  greenBgHov:  "var(--greenBgHov)",
  amber:       "var(--amber)",
  amberBg:     "var(--amberBg)",
  red:         "var(--red)",
  redBg:       "var(--redBg)",
  blue:        "var(--blue)",
  blueBg:      "var(--blueBg)",
  purple:      "var(--purple)",
  purpleBg:    "var(--purpleBg)",
  text:        "var(--text)",
  textSub:     "var(--textSub)",
  textMuted:   "var(--textMuted)",
  textDim:     "var(--textDim)",
  white:       "var(--white)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

const inp = (extra={}) => ({ width:"100%", boxSizing:"border-box", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, padding:"9px 12px", outline:"none", fontFamily:F, ...extra });
const sel = (extra={}) => ({...inp(), cursor:"pointer", ...extra});
const lbl = (extra={}) => ({ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:5, ...extra });
const cardStyle = (extra={}) => ({ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", marginBottom:14, ...extra });

const iconBtn = (active=false, activeColor=C.green, extra={}) => ({ background: active ? `${activeColor}18` : C.surface, border:`1px solid ${active ? activeColor+"50" : C.border}`, color: active ? activeColor : C.textMuted, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight: active ? 700 : 400, cursor:"pointer", fontFamily:F, transition:"all 0.12s", ...extra });
export const JOINTS = ["Coluna Cervical","Coluna Torácica","Coluna Lombar","Ombro D","Ombro E","Cotovelo D","Cotovelo E","Punho D","Punho E","Quadril D","Quadril E","Joelho D","Joelho E","Tornozelo D","Tornozelo E","ATM D","ATM E"];

export const MVMT = {
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
  "Joelho D":["Flexão","Extensão"],"Joelho E":["Flexão","Extensão"],
  "Tornozelo D":["Dorsiflexão","Plantarflexão","Inversão","Eversão"],
  "Tornozelo E":["Dorsiflexão","Plantarflexão","Inversão","Eversão"],
  "ATM D":["Abertura","Protrusão","Desvio"],"ATM E":["Abertura","Protrusão","Desvio"],
};
const REF = {
  "Flexão|Coluna Cervical":"0–45","Extensão|Coluna Cervical":"0–45","Inclinação D|Coluna Cervical":"0–45","Inclinação E|Coluna Cervical":"0–45","Rotação D|Coluna Cervical":"0–60","Rotação E|Coluna Cervical":"0–60",
  "Flexão|Coluna Lombar":"0–60","Extensão|Coluna Lombar":"0–25","Inclinação D|Coluna Lombar":"0–25","Inclinação E|Coluna Lombar":"0–25",
  "Flexão|Ombro D":"0–180","Abdução|Ombro D":"0–180","RE|Ombro D":"0–90","RI|Ombro D":"0–70","Extensão|Ombro D":"0–60",
  "Flexão|Ombro E":"0–180","Abdução|Ombro E":"0–180","RE|Ombro E":"0–90","RI|Ombro E":"0–70","Extensão|Ombro E":"0–60",
  "Flexão|Cotovelo D":"0–145","Pronação|Cotovelo D":"0–80","Supinação|Cotovelo D":"0–80",
  "Flexão|Cotovelo E":"0–145","Pronação|Cotovelo E":"0–80","Supinação|Cotovelo E":"0–80",
  "Flexão|Quadril D":"0–120","Extensão|Quadril D":"0–30","Abdução|Quadril D":"0–45","RI|Quadril D":"0–45","RE|Quadril D":"0–45",
  "Flexão|Quadril E":"0–120","Extensão|Quadril E":"0–30","Abdução|Quadril E":"0–45","RI|Quadril E":"0–45","RE|Quadril E":"0–45",
  "Flexão|Joelho D":"0–135","Flexão|Joelho E":"0–135",
  "Dorsiflexão|Tornozelo D":"0–20","Plantarflexão|Tornozelo D":"0–50","Inversão|Tornozelo D":"0–35","Eversão|Tornozelo D":"0–15",
  "Dorsiflexão|Tornozelo E":"0–20","Plantarflexão|Tornozelo E":"0–50","Inversão|Tornozelo E":"0–35","Eversão|Tornozelo E":"0–15",
};
export function getRef(mv, jt) { return REF[`${mv}|${jt}`] || ""; }
export function isOutOfRange(val, refStr) {
  if (!refStr||!val) return false;
  const m = refStr.match(/(\d+)[–-](\d+)/);
  if (!m) return false;
  return Number(val) > Number(m[2]);
}

export function NumericDrum({ value, onChange, min, max, step=1, unit, label: lbl2 }) {
  const inc = () => onChange(Math.min(max, (parseFloat(value)||min)+step));
  const dec = () => onChange(Math.max(min, (parseFloat(value)||min)-step));
  return (
    <div>
      <span style={lbl()}>{lbl2}</span>
      <div style={{ display:"flex", alignItems:"center", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
        <button onClick={dec} style={{ background:"none", border:"none", color:C.textMuted, fontSize:18, padding:"0 14px", cursor:"pointer", height:44, display:"flex", alignItems:"center", borderRight:`1px solid ${C.border}` }}>−</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <input type="number" value={value} min={min} max={max} step={step} onChange={e=>onChange(e.target.value)}
            style={{ ...inp(), border:"none", background:"transparent", textAlign:"center", fontSize:18, fontWeight:800, color:C.text, padding:"10px 4px" }}/>
        </div>
        <span style={{ fontSize:12, color:C.textMuted, paddingRight:10, paddingLeft:4 }}>{unit}</span>
        <button onClick={inc} style={{ background:"none", border:"none", color:C.green, fontSize:18, padding:"0 14px", cursor:"pointer", height:44, display:"flex", alignItems:"center", borderLeft:`1px solid ${C.border}` }}>+</button>
      </div>
    </div>
  );
}

export function EvaSlider({ label: lbl2, value, onChange }) {
  const isDefined = value !== null && value !== "";
  const currentVal = isDefined ? value : 0;
  const pct = (currentVal / 10) * 100;
  const color = !isDefined ? C.textDim : currentVal <= 3 ? C.green : currentVal <= 6 ? C.amber : C.red;
  const faces = ["😌","😐","😟","😣","😭"];
  const face = isDefined ? faces[Math.min(4, Math.floor(currentVal / 2.5))] : "⚪";
  const desc = !isDefined ? "Não avaliado" : currentVal === 0 ? "Sem dor" : currentVal <= 3 ? "Leve" : currentVal <= 6 ? "Moderada" : currentVal <= 8 ? "Intensa" : "Máxima";
  return (
    <div style={{ opacity: isDefined ? 1 : 0.6, transition:"opacity 0.2s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={lbl()}>{lbl2}</span>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:20 }}>{face}</span>
          <span style={{ fontSize:24, fontWeight:900, color, lineHeight:1 }}>{isDefined ? currentVal : "—"}</span>
          <span style={{ fontSize:10, color:C.textMuted }}>{isDefined ? `/10 · ${desc}` : desc}</span>
        </div>
      </div>
      <div style={{ position:"relative", height:8, background:C.surface, borderRadius:99, border:`1px solid ${C.border}`, marginBottom:4 }}>
        {isDefined && <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:`linear-gradient(90deg, ${C.green}, ${color})`, borderRadius:99, transition:"width 0.1s" }}/>}
      </div>
      <input type="range" min="0" max="10" step="1" value={currentVal} onChange={e=>onChange(Number(e.target.value))}
        style={{ width:"100%", accentColor: isDefined ? color : C.border, cursor:"pointer", marginBottom:2 }}/>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textDim }}>
        <span>0</span><span>5</span><span>10</span>
      </div>
    </div>
  );
}

export function TagSelect({ options, value, onChange, activeColor=C.green }) {
  const toggle = v => onChange(value.includes(v) ? value.filter(x=>x!==v) : [...value,v]);
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {options.map(o => {
        const v=o.value??o, l=o.label??o, active=value.includes(v);
        return <button key={v} onClick={()=>toggle(v)} style={iconBtn(active,activeColor)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
      })}
    </div>
  );
}

export function SingleSelect({ options, value, onChange, activeColor=C.green }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {options.map(o => {
        const v=o.value??o, l=o.label??o, active=value===v;
        return <button key={v} onClick={()=>onChange(active?"":v)} style={iconBtn(active,activeColor)}>{l}</button>;
      })}
    </div>
  );
}

export function SessionCounter({ value, onChange }) {
  return (
    <div>
      <span style={lbl()}>Sessões autorizadas</span>
      <input type="number" min="1" max="120" value={value} onChange={e=>onChange(e.target.value)}
        style={{...inp({width:"100%",textAlign:"center",fontSize:16,fontWeight:700,padding:"12px 14px"})}} placeholder="Nº de sessões"/>
    </div>
  );
}

export function AudioField({ value, onChange, placeholder, rows=3 }) {
  const [rec, setRec] = useState(false);
  const rRef = useRef(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });
  const supported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  useEffect(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR(); r.lang="pt-BR"; r.continuous=true; r.interimResults=false;
    r.onresult = e => { const t=Array.from(e.results).map(x=>x[0].transcript).join(" "); onChangeRef.current(p=>(p?p+" "+t:t)); };
    r.onend = () => setRec(false);
    rRef.current = r;
    return () => { try { r.stop(); } catch { /* ignore */ } };
  }, [supported]);
  const toggle = () => { if (!rRef.current) return; if(rec){rRef.current.stop();setRec(false);}else{rRef.current.start();setRec(true);} };
  return (
    <div style={{ position:"relative" }}>
      <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{...inp({resize:"vertical",lineHeight:1.6}), paddingRight:supported?48:12}}/>
      {supported && (
        <button onClick={toggle} title={rec?"Parar":"Ditar por voz"}
          style={{ position:"absolute", right:8, top:8, background:rec?C.redBg:C.greenBg, border:`1px solid ${rec?C.red:C.green}50`, borderRadius:8, padding:"6px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:12, color:rec?C.red:C.green, fontFamily:F, fontWeight:700 }}>
          {rec ? "⏹ Stop" : "🎙"}
        </button>
      )}
    </div>
  );
}

export const MUSCLES = [
  { id:"quadricepsD", label:"Quadríceps D" },
  { id:"quadricepsE", label:"Quadríceps E" },
  { id:"isquiotibialD", label:"Isquiotibiais D" },
  { id:"isquiotibialE", label:"Isquiotibiais E" },
  { id:"gluteoD", label:"Glúteo D" },
  { id:"gluteoE", label:"Glúteo E" },
  { id:"manguitoD", label:"Manguito Rotador D" },
  { id:"manguitoE", label:"Manguito Rotador E" },
  { id:"tibialAnterior", label:"Tibial Anterior" },
  { id:"gastrocnemio", label:"Gastrocnêmio" },
  { id:"bicepsD", label:"Bíceps Braquial D" },
  { id:"bicepsE", label:"Bíceps Braquial E" },
];

export function MRCSelect({ value, onChange }) {
  const grades = ["0 – Sem contração","1 – Frêmito","2 – Sem gravidade","3 – Contra gravidade","4 – Resistência parcial","5 – Normal"];
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={sel()}>
      <option value="">MRC…</option>
      {grades.map((g,i)=><option key={i} value={String(i)}>{g}</option>)}
    </select>
  );
}

export function MRCRow({ row, onUpdate, onRemove }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr 100px 28px" : "2fr 200px 28px", gap:8, alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
      <select value={row.muscle} onChange={e=>onUpdate({...row,muscle:e.target.value})} style={sel()}>
        <option value="">Músculo…</option>
        {MUSCLES.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
      </select>
      <MRCSelect value={row.value} onChange={v=>onUpdate({...row,value:v})} />
      <button onClick={onRemove} style={{ background:"none", border:"none", color:C.textDim, fontSize:18, cursor:"pointer", padding:0, justifySelf:"center" }}>×</button>
    </div>
  );
}

export function GonioRow({ row, onUpdate, onRemove }) {
  const mvts = MVMT[row.joint]||[];
  const ref = getRef(row.movement, row.joint);
  const oor = isOutOfRange(row.value, ref);
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr 1fr 100px 28px" : "1.8fr 1.8fr 76px 72px 28px", gap:8, alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
      <select value={row.joint} onChange={e=>onUpdate({...row,joint:e.target.value,movement:""})} style={sel()}>
        <option value="">Articulação…</option>
        {JOINTS.map(j=><option key={j} value={j}>{j}</option>)}
      </select>
      <select value={row.movement} onChange={e=>onUpdate({...row,movement:e.target.value})} style={sel()} disabled={!row.joint}>
        <option value="">Movimento…</option>
        {mvts.map(m=><option key={m} value={m}>{m}</option>)}
      </select>
      <input type="number" min="0" max="360" value={row.value} onChange={e=>onUpdate({...row,value:e.target.value})}
        style={{...inp({textAlign:"center",border:`1.5px solid ${oor?C.red:C.border}`,fontWeight:700})}} placeholder="°"/>
      <div style={{ fontSize:11, color:oor?C.red:C.textMuted, textAlign:"center", fontWeight:oor?700:400 }}>{ref?`${ref}°`:"—"}{oor?" ⚠":""}</div>
      <button onClick={onRemove} style={{ background:"none", border:"none", color:C.textDim, fontSize:18, cursor:"pointer", padding:0 }}>×</button>
    </div>
  );
}

export function TestCard({ test, result, onResult }) {
  const [open, setOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const playerRef = useRef(null);
  const borderColor = result==="Positivo"?`${C.red}60`:result==="Negativo"?`${C.green}50`:C.border;
  const videoId = test.video ? test.video.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] : null;
  useEffect(()=>()=>{try{playerRef.current?.pauseVideo?.()}catch{}},[playerRef]);
  return (
    <div style={{ background:C.surface, border:`1px solid ${borderColor}`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{test.name}</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{test.desc}</div>
        </div>
        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
          {videoId && <button onClick={()=>setShowVideo(s=>!s)}
            style={{ background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:6, padding:"4px 10px", fontSize:11, color:C.green, cursor:"pointer", fontWeight:700 }}>{showVideo?"▽ Fechar":"▶ Vídeo"}</button>}
          <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:16, padding:"0 4px" }}>{open?"▲":"▼"}</button>
        </div>
      </div>
      {showVideo && videoId && (
        <div onClick={e=>e.stopPropagation()} style={{ marginTop:10, aspectRatio:"16/9", maxWidth:320 }}>
          <YouTube videoId={videoId} opts={{ height:"100%", width:"100%", playerVars:{ rel:0, modestbranding:1 } }}
            onReady={e=>{playerRef.current=e.target}} />
        </div>
      )}
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
              style={{ flex:1, background:result===r?`${ac}15`:C.card, border:`1px solid ${result===r?ac:C.border}`, borderRadius:8, padding:"6px 4px", fontSize:11, fontWeight:result===r?700:400, color:result===r?ac:C.textMuted, cursor:"pointer", fontFamily:F }}>
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MoneyCell({ label, suggested, value, onChange, btnStyle }) {
  const current = value != null ? Number(value) : suggested;
  const adjust = (delta) => {
    const next = Math.round((current + delta) * 10) / 10;
    if (next < 0) return;
    onChange(String(next));
  };
  const bs = btnStyle || { background:"transparent", border:`1px solid ${C.purple}44`, borderRadius:6, padding:"6px 0", flex:"0 0 auto", width:36, fontSize:13, fontWeight:700, color:C.purple, cursor:"pointer", fontFamily:F };
  return (
    <div style={{ background:C.card, borderRadius:8, padding:"8px 10px", border:`1px solid ${C.border}` }}>
      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>{label}</div>
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        <button style={bs} onClick={() => adjust(-50)} title="-50">−50</button>
        <button style={bs} onClick={() => adjust(-10)} title="-10">−10</button>
        <input type="text" inputMode="numeric" value={value == null ? "" : value}
          onChange={(e) => { const v = e.target.value;
            if (v === "" || /^0$|^[1-9]\d*$|^[1-9]\d*\.\d*$|^0\.\d*$/.test(v)) onChange(v === "" ? null : v);
          }}
          onFocus={(e) => e.target.select()}
          style={{ flex:1, minWidth:0, boxSizing:"border-box", background:"transparent", border:`1px solid ${C.purple}55`, borderRadius:8, padding:"8px 6px", color:C.purple, fontWeight:900, fontSize:14, outline:"none", textAlign:"center" }}
          placeholder={`R$ ${suggested.toFixed(2)}`}
        />
        <button style={bs} onClick={() => adjust(10)} title="+10">+10</button>
        <button style={bs} onClick={() => adjust(50)} title="+50">+50</button>
      </div>
      {value == null && <div style={{ fontSize:10, marginTop:4, color:C.textMuted }}>Sugerido: <strong>R$ {suggested.toFixed(2)}</strong></div>}
    </div>
  );
}

export function useProgress(patient, queixa, evaMov, gonio, testResults, kb) {
  const isMeaningfulGonioRow = (g) => {
    const v = g?.value;
    const num = v === "" || v === null || v === undefined ? NaN : Number(v);
    return Boolean(g?.joint && g?.movement) && Number.isFinite(num) && num > 0;
  };

  const steps = [
    { key:"ident",  label:"Identificação", done: !!(patient.nome && patient.dataNasc && patient.sexo) },
    { key:"queixa", label:"Queixa",        done: queixa.length > 5 },
    { key:"dor",    label:"EVA",           done: evaMov !== null && evaMov !== "" },
    { key:"fisico", label:"Exame físico",  done: !!(patient.peso && patient.altura) },
    { key:"gonio",  label:"Goniometria",   done: gonio?.some(isMeaningfulGonioRow) },
    { key:"testes", label:"Testes",        done: kb ? Object.values(testResults||{}).some(v=>v && v!=="Não realizado") : false },
  ];
  const pct = Math.round((steps.filter(s=>s.done).length / steps.length)*100);
  return { steps, pct };
}

export function Section({ title, icon, badge, children, accent }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={cardStyle({ padding: isMobile ? "14px 12px" : "20px 22px", borderLeft: accent ? `3px solid ${accent}` : undefined })}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:isMobile?12:18, paddingBottom:isMobile?10:12, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:isMobile?10:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.green, flex:1 }}>{title}</h3>
        {badge && <span style={{ fontSize:11, background:C.amberBg, color:C.amber, border:`1px solid ${C.amber}40`, borderRadius:20, padding:"2px 10px" }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

export function Row({ children, cols="1fr 1fr", gap=14, mobileCols }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  const nc = isMobile ? (mobileCols || "1fr") : cols;
  return <div style={{ display:"grid", gridTemplateColumns:nc, gap, marginBottom:isMobile?10:14 }}>{children}</div>;
}

export function Field({ l, children, span }) {
  return <div style={span?{gridColumn:`span ${span}`}:{}}><span style={lbl()}>{l}</span>{children}</div>;
}

export function SubHeading({ children }) {
  return (
    <div style={{ fontSize:11, fontWeight:800, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, paddingBottom:6, marginBottom:12, marginTop:18 }}>
      {children}
    </div>
  );
}

export const CREFITO_REGIOES = {
  "Sul (RS/SC/PR)":         { consulta: 180, sessao: 160, avaliacao: 250, relatorio: 120 },
  "Sudeste SP":             { consulta: 220, sessao: 200, avaliacao: 320, relatorio: 150 },
  "Sudeste RJ/ES/MG":       { consulta: 190, sessao: 170, avaliacao: 280, relatorio: 130 },
  "Centro-Oeste":           { consulta: 170, sessao: 150, avaliacao: 240, relatorio: 110 },
  "Nordeste":               { consulta: 150, sessao: 140, avaliacao: 220, relatorio: 100 },
  "Norte":                  { consulta: 140, sessao: 130, avaliacao: 210, relatorio: 95  },
};

export function HonorariosCard({ convenio, regiao, sessoesAuth }) {
  const [custom, setCustom] = useState({ avaliacao: null, sessao: null, consulta: null, relatorio: null });
  if (convenio !== "Particular") return null;
  const tabela = CREFITO_REGIOES[regiao] || CREFITO_REGIOES["Centro-Oeste"];
  const sessoes = parseInt(sessoesAuth) || 10;
  const eff = {
    avaliacao: custom.avaliacao != null ? Number(custom.avaliacao) : tabela.avaliacao,
    sessao: custom.sessao != null ? Number(custom.sessao) : tabela.sessao,
    consulta: custom.consulta != null ? Number(custom.consulta) : tabela.consulta,
    relatorio: custom.relatorio != null ? Number(custom.relatorio) : tabela.relatorio,
  };
  const totalSessoes = eff.sessao * sessoes;
  const totalEstimado = eff.avaliacao + totalSessoes + eff.relatorio + eff.consulta;
  const btnStyle = { background:"transparent", border:`1px solid ${C.purple}44`, borderRadius:6, padding:"6px 0", flex:"0 0 auto", width:36, fontSize:13, fontWeight:700, color:C.purple, cursor:"pointer", fontFamily:F };
  return (
    <div style={{ background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:12, padding:"16px 18px", marginTop:12 }}>
      <div style={{ fontSize:10, fontWeight:800, color:C.purple, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>💰 HONORÁRIOS CREFITO — REFERÊNCIA PARA ATENDIMENTO PARTICULAR</div>
      <div style={{ fontSize:10, color:C.textMuted, marginBottom:10 }}>Baseado na Tabela de Honorários do COFFITO (Res. 424/2013) e reajustes regionais. Valores em R$ (referência 2024).</div>
      <div style={{ background:C.card, borderRadius:8, padding:"10px 14px", border:`1px solid ${C.purple}30`, marginBottom:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Valor por sessão</span>
          <span style={{ fontSize:18, fontWeight:900, color:C.purple }}>R$ {eff.sessao.toFixed(2)}</span>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8, marginBottom:10 }}>
        <MoneyCell label="Avaliação / Triagem" suggested={tabela.avaliacao} value={custom.avaliacao} onChange={(v)=>setCustom(c=>({...c, avaliacao:v}))} btnStyle={btnStyle}/>
        <MoneyCell label="Sessão de Fisioterapia" suggested={tabela.sessao} value={custom.sessao} onChange={(v)=>setCustom(c=>({...c, sessao:v}))} btnStyle={btnStyle}/>
        <MoneyCell label="Consulta de Retorno" suggested={tabela.consulta} value={custom.consulta} onChange={(v)=>setCustom(c=>({...c, consulta:v}))} btnStyle={btnStyle}/>
        <MoneyCell label="Relatório / Laudo" suggested={tabela.relatorio} value={custom.relatorio} onChange={(v)=>setCustom(c=>({...c, relatorio:v}))} btnStyle={btnStyle}/>
      </div>
      <div style={{ background:C.card, borderRadius:8, padding:"10px 14px", border:`1px solid ${C.purple}30` }}>
        <div style={{ fontSize:10, color:C.textMuted, lineHeight:1.6, marginBottom:8 }}>
          <div>Avaliação / Triagem: R$ {eff.avaliacao.toFixed(2)}</div>
          <div>{sessoes} sessões × R$ {eff.sessao.toFixed(2)}: R$ {totalSessoes.toFixed(2)}</div>
          <div>Consulta de Retorno: R$ {eff.consulta.toFixed(2)}</div>
          <div>Relatório / Laudo: R$ {eff.relatorio.toFixed(2)}</div>
        </div>
        <div style={{ height:1, background:`${C.purple}20`, marginBottom:8 }} />
        <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Valor total</div>
        <div style={{ fontSize:22, fontWeight:900, color:C.purple }}>R$ {totalEstimado.toFixed(2)}</div>
      </div>
      <div style={{ fontSize:10, color:C.textMuted, marginTop:8, lineHeight:1.5 }}>
        ⚠️ Estes valores são <strong>referências mínimas</strong> sugeridas pelo CREFITO. O profissional pode definir seus honorários acima destes valores com base em especialização, experiência e localidade. Consulte sempre a tabela vigente do seu CREFITO regional.
      </div>
    </div>
  );
}

// ── BodyMap ─────────────────────────────────────────────────────────────────
import Body from "react-muscle-highlighter";

const C_BODY = {
  green: "var(--green)",
  surface: "var(--surface)",
  card: "var(--card)",
  border: "var(--border)",
  textMuted: "var(--textMuted)",
};

const SVG_W = 724;
const SVG_H = 1448;

const PART_SLUG = {
  "Cabeça":      { F:"head",        B:"head" },
  "Cervical":    { F:"neck",        B:"neck" },
  "Trapézio":    { F:"trapezius",   B:"trapezius" },
  "Torácica":    { B:"upper-back" },
  "Peitoral":    { F:"chest" },
  "Abdômen":     { F:"abs" },
  "Lombar":      { B:"lower-back" },
  "Sacroilíaca": { F:"obliques" },
  "Glúteos":     { B:"gluteal" },
  "Ombro D":     { F:"deltoids",    B:"deltoids",    side:"right" },
  "Ombro E":     { F:"deltoids",    B:"deltoids",    side:"left" },
  "Braço D":     { F:"biceps",      B:"triceps",     side:"right" },
  "Braço E":     { F:"biceps",      B:"triceps",     side:"left" },
  "Antebraço D": { F:"forearm",     B:"forearm",     side:"right" },
  "Antebraço E": { F:"forearm",     B:"forearm",     side:"left" },
  "Mão D":       { F:"hands",       B:"hands",       side:"right" },
  "Mão E":       { F:"hands",       B:"hands",       side:"left" },
  "Quadril D":   { F:"quadriceps",  B:"hamstring",   side:"right" },
  "Quadril E":   { F:"quadriceps",  B:"hamstring",   side:"left" },
  "Adutores D":  { F:"adductors",   B:"adductors",   side:"right" },
  "Adutores E":  { F:"adductors",   B:"adductors",   side:"left" },
  "Joelho D":    { F:"knees",       B:"calves",      side:"right" },
  "Joelho E":    { F:"knees",       B:"calves",      side:"left" },
  "Perna D":     { F:"tibialis",                    side:"right" },
  "Perna E":     { F:"tibialis",                    side:"left" },
  "Tornozelo D": { F:"ankles",      B:"ankles",      side:"right" },
  "Tornozelo E": { F:"ankles",      B:"ankles",      side:"left" },
  "Pé D":        { F:"feet",        B:"feet",        side:"right" },
  "Pé E":        { F:"feet",        B:"feet",        side:"left" },
};

// Coordenadas SVG aproximadas (centro da região) para cada parte
const LABEL_POS = {
  "Cabeça":      { F:[362,180], B:[1086,180] },
  "Cervical":    { F:[362,270], B:[1086,270] },
  "Trapézio":    { F:[362,305], B:[1086,305] },
  "Torácica":    { B:[1086,420] },
  "Peitoral":    { F:[362,355] },
  "Abdômen":     { F:[362,510] },
  "Lombar":      { B:[1086,550] },
  "Sacroilíaca": { F:[362,460] },
  "Glúteos":     { B:[1086,720] },
  // Front view (F) x-coordinates are mirrored from visual to anatomical:
  // visual left = anatomical right, visual right = anatomical left.
  // y-coordinates and back view (B) are unchanged.
  "Ombro D":     { F:[275,340], B:[1228,340] },
  "Ombro E":     { F:[450,340], B:[980,340] },
  "Braço D":     { F:[200,490], B:[1210,500] },
  "Braço E":     { F:[525,490], B:[930,500] },
  "Antebraço D": { F:[130,680], B:[1318,650] },
  "Antebraço E": { F:[595,680], B:[878,650] },
  "Mão D":       { F:[55,720],  B:[1400,690] },
  "Mão E":       { F:[670,720],  B:[790,690]  },
  "Quadril D":   { F:[300,840], B:[1160,850] },
  "Quadril E":   { F:[425,840], B:[1000,850] },
  "Adutores D":  { F:[300,920], B:[1160,950] },
  "Adutores E":  { F:[425,920], B:[1000,950] },
  "Joelho D":    { F:[290,1008], B:[1170,1100] },
  "Joelho E":    { F:[435,1008], B:[990,1100] },
  "Perna D":     { F:[290,1130] },
  "Perna E":     { F:[435,1130] },
  "Tornozelo D": { F:[295,1250], B:[1150,1260] },
  "Tornozelo E": { F:[430,1250], B:[998,1260] },
  "Pé D":        { F:[275,1340], B:[1155,1340] },
  "Pé E":        { F:[450,1340], B:[970,1340] },
};

const SLUG_REV = {};
Object.entries(PART_SLUG).forEach(([id, m]) => {
  ["F","B"].forEach(v => {
    if (!m[v]) return;
    SLUG_REV[`${m[v]}|${m.side||""}|${v}`] = id;
  });
});

const BODY_DETAILS = {
  "Cabeça":      { joint:"Crânio, Articulação Temporomandibular (ATM)", muscles:"Músculos da mastigação (Masseter, Temporal, Pterigóideos), Músculos da face, Músculos do crânio" },
  "Cervical":    { joint:"Coluna Cervical (C1-C7)", muscles:"Esternocleidomastóideo, Trapézio descendente, Escalenos, Esplênios, Paravertebrais cervicais" },
  "Trapézio":    { joint:"Cintura escapular (escápula e clavícula)", muscles:"Trapézio (descendente, transverso e ascendente)" },
  "Torácica":    { joint:"Coluna Torácica (T1-T12)", muscles:"Paravertebrais torácicos, Romboides, Latíssimo do dorso, Intercostais" },
  "Peitoral":    { joint:"Articulação Esternocostal, Costovertebral", muscles:"Peitoral maior, Peitoral menor, Serrátil anterior" },
  "Abdômen":     { joint:"Parede abdominal", muscles:"Reto abdominal, Oblíquo externo, Oblíquo interno, Transverso abdominal" },
  "Lombar":      { joint:"Coluna Lombar (L1-L5)", muscles:"Paravertebrais lombares, Quadrado lombar, Multífidos, Iliopsoas" },
  "Sacroilíaca": { joint:"Articulação Sacroilíaca", muscles:"Glúteo máximo, Piriforme, Iliopsoas, Obturadores, Gêmeos" },
  "Glúteos":     { joint:"Articulação Coxofemoral (posterior)", muscles:"Glúteo máximo, Glúteo médio, Glúteo mínimo, Piriforme" },
  "Ombro D":     { joint:"Glenoumeral, Acromioclavicular, Esternoclavicular", muscles:"Supraespinhal, Infraespinhal, Subescapular, Redondo menor (Manguito Rotador), Deltoide, Bíceps braquial" },
  "Ombro E":     { joint:"Glenoumeral, Acromioclavicular, Esternoclavicular", muscles:"Supraespinhal, Infraespinhal, Subescapular, Redondo menor (Manguito Rotador), Deltoide, Bíceps braquial" },
  "Braço D":     { joint:"Articulação Úmero-Ulnar, Úmero-Radial (Cotovelo)", muscles:"Bíceps braquial, Tríceps braquial, Braquial, Braquiorradial" },
  "Braço E":     { joint:"Articulação Úmero-Ulnar, Úmero-Radial (Cotovelo)", muscles:"Bíceps braquial, Tríceps braquial, Braquial, Braquiorradial" },
  "Antebraço D": { joint:"Articulação Radiocárpica, Médio-cárpica (Punho)", muscles:"Flexores radial/ulnar do carpo, Extensores radial/ulnar do carpo, Palmar longo, Pronadores, Supinadores" },
  "Antebraço E": { joint:"Articulação Radiocárpica, Médio-cárpica (Punho)", muscles:"Flexores radial/ulnar do carpo, Extensores radial/ulnar do carpo, Palmar longo, Pronadores, Supinadores" },
  "Mão D":       { joint:"Articulações Carpometacárpicas, Metacarpo-falângicas, Interfalângicas", muscles:"Tenares, Hipotenares, Interósseos, Lombricais, Flexores/extensores dos dedos" },
  "Mão E":       { joint:"Articulações Carpometacárpicas, Metacarpo-falângicas, Interfalângicas", muscles:"Tenares, Hipotenares, Interósseos, Lombricais, Flexores/extensores dos dedos" },
  "Quadril D":   { joint:"Articulação Coxofemoral", muscles:"Iliopsoas, Glúteo máximo, Glúteo médio, Glúteo mínimo, Piriforme, Obturadores, Quadrado femoral, Tensor da fáscia lata" },
  "Quadril E":   { joint:"Articulação Coxofemoral", muscles:"Iliopsoas, Glúteo máximo, Glúteo médio, Glúteo mínimo, Piriforme, Obturadores, Quadrado femoral, Tensor da fáscia lata" },
  "Adutores D":  { joint:"Articulação Coxofemoral (compartimento medial)", muscles:"Adutor longo, Adutor curto, Adutor magno, Pectíneo, Grácil" },
  "Adutores E":  { joint:"Articulação Coxofemoral (compartimento medial)", muscles:"Adutor longo, Adutor curto, Adutor magno, Pectíneo, Grácil" },
  "Joelho D":    { joint:"Articulação Tibiofemoral, Patelofemoral", muscles:"Quadríceps femoral, Isquiotibiais (Semitendíneo, Semimembranáceo, Bíceps femoral), Pata de Ganso, Gastrocnêmio, Poplíteo" },
  "Joelho E":    { joint:"Articulação Tibiofemoral, Patelofemoral", muscles:"Quadríceps femoral, Isquiotibiais (Semitendíneo, Semimembranáceo, Bíceps femoral), Pata de Ganso, Gastrocnêmio, Poplíteo" },
  "Perna D":     { joint:"Articulação Talocrural, Tibiofibular", muscles:"Tibial anterior, Extensor longo dos dedos, Fibular longo, Fibular curto, Sóleo" },
  "Perna E":     { joint:"Articulação Talocrural, Tibiofibular", muscles:"Tibial anterior, Extensor longo dos dedos, Fibular longo, Fibular curto, Sóleo" },
  "Tornozelo D": { joint:"Articulação Talocrural, Subtalar", muscles:"Tibial anterior, Fibulares, Gastrocnêmio, Sóleo, Tibial posterior, Flexor longo dos dedos" },
  "Tornozelo E": { joint:"Articulação Talocrural, Subtalar", muscles:"Tibial anterior, Fibulares, Gastrocnêmio, Sóleo, Tibial posterior, Flexor longo dos dedos" },
  "Pé D":        { joint:"Subtalar, Mediotársicas, Metatarsofalângicas, Interfalângicas", muscles:"Flexor curto dos dedos, Extensor curto dos dedos, Abdutor do hálux, Adutor do hálux, Interósseos, Lombricais, Quadrado plantar" },
  "Pé E":        { joint:"Subtalar, Mediotársicas, Metatarsofalângicas, Interfalângicas", muscles:"Flexor curto dos dedos, Extensor curto dos dedos, Abdutor do hálux, Adutor do hálux, Interósseos, Lombricais, Quadrado plantar" },
};

const PEDIATRIC_PARTS = [
  "Cabeça","Cervical","Ombro D","Ombro E","Braço D","Braço E",
  "Mão D","Mão E","Torácica","Lombar","Quadril D","Quadril E",
  "Joelho D","Joelho E","Pé D","Pé E","Abdômen",
];

const PEDIATRIC_BODY_DETAILS = {
  "Cabeça":      { joint:"Crânio", muscles:"Músculos da face e pescoço" },
  "Cervical":    { joint:"Coluna Cervical", muscles:"Músculos do pescoço" },
  "Torácica":    { joint:"Coluna Torácica", muscles:"Costas" },
  "Lombar":      { joint:"Coluna Lombar", muscles:"Músculos da lombar" },
  "Abdômen":     { joint:"Abdômen", muscles:"Barriga" },
  "Ombro D":     { joint:"Ombro Direito", muscles:"Músculos do ombro" },
  "Ombro E":     { joint:"Ombro Esquerdo", muscles:"Músculos do ombro" },
  "Braço D":     { joint:"Cotovelo Direito", muscles:"Músculos do braço" },
  "Braço E":     { joint:"Cotovelo Esquerdo", muscles:"Músculos do braço" },
  "Mão D":       { joint:"Punho e Mão Direitos", muscles:"Músculos da mão" },
  "Mão E":       { joint:"Punho e Mão Esquerdos", muscles:"Músculos da mão" },
  "Quadril D":   { joint:"Quadril Direito", muscles:"Músculos do quadril" },
  "Quadril E":   { joint:"Quadril Esquerdo", muscles:"Músculos do quadril" },
  "Joelho D":    { joint:"Joelho Direito", muscles:"Músculos da perna" },
  "Joelho E":    { joint:"Joelho Esquerdo", muscles:"Músculos da perna" },
  "Pé D":        { joint:"Tornozelo e Pé Direitos", muscles:"Músculos do pé" },
  "Pé E":        { joint:"Tornozelo e Pé Esquerdos", muscles:"Músculos do pé" },
};

const PEDIATRIC_LABEL_POS = {
  "Cabeça":      { F:[362,160], B:[1086,160] },
  "Cervical":    { F:[362,245], B:[1086,245] },
  "Torácica":    { B:[1086,400] },
  "Lombar":      { B:[1086,530] },
  "Abdômen":     { F:[362,480] },
  "Ombro D":     { F:[275,320], B:[1228,320] },
  "Ombro E":     { F:[450,320], B:[980,320] },
  "Braço D":     { F:[200,470], B:[1210,480] },
  "Braço E":     { F:[525,470], B:[930,480] },
  "Mão D":       { F:[55,700],  B:[1400,670] },
  "Mão E":       { F:[670,700],  B:[790,670]  },
  "Quadril D":   { F:[300,820], B:[1160,830] },
  "Quadril E":   { F:[425,820], B:[1000,830] },
  "Joelho D":    { F:[290,980], B:[1170,1070] },
  "Joelho E":    { F:[435,980], B:[990,1070] },
  "Pé D":        { F:[275,1310], B:[1155,1310] },
  "Pé E":        { F:[450,1310], B:[970,1310] },
};

export function BodyMap({ value, onChange, sex, pediatric }) {
  const [view, setView] = useState("front");
  const kv = view === "front" ? "F" : "B";
  const isMobile = useMediaQuery("(max-width:767px)");
  const bodyScale = pediatric ? (isMobile ? 1.0 : 1.5) : (isMobile ? 0.9 : 1.4);
  const activeParts = pediatric ? PEDIATRIC_PARTS : Object.keys(PART_SLUG);
  const activeSlug = pediatric ? (() => {
    const map = {};
    PEDIATRIC_PARTS.forEach(id => { if (PART_SLUG[id]) map[id] = PART_SLUG[id]; });
    return map;
  })() : PART_SLUG;
  const activeLabelPos = pediatric ? PEDIATRIC_LABEL_POS : LABEL_POS;
  const activeDetails = pediatric ? PEDIATRIC_BODY_DETAILS : BODY_DETAILS;

  const activeSlugRev = useMemo(() => {
    const rev = {};
    Object.entries(activeSlug).forEach(([id, m]) => {
      ["F","B"].forEach(v2 => {
        if (!m[v2]) return;
        rev[`${m[v2]}|${m.side||""}|${v2}`] = id;
      });
    });
    return rev;
  }, [pediatric]);

  const selectedData = useMemo(() => {
    const groups = {};
    (value||[]).forEach(id => {
      const m = activeSlug[id];
      if (!m) return;
      const slug = m[kv];
      if (!slug) return;
      if (!groups[slug]) groups[slug] = { sides: new Set() };
      if (m.side) {
        const adjSide = kv === "F"
          ? (m.side === "left" ? "right" : m.side === "right" ? "left" : m.side)
          : m.side;
        groups[slug].sides.add(adjSide);
      }
    });
    return Object.entries(groups).map(([slug, g]) => ({
      slug,
      color: C_BODY.green,
      ...(g.sides.size === 1 ? { side: [...g.sides][0] } : {}),
    }));
  }, [value, kv, pediatric]);

  const handlePartPress = (_part, side) => {
    const slug = _part?.slug;
    if (!slug) return;
    const adjustedSide = kv === "F"
      ? (side === "left" ? "right" : side === "right" ? "left" : side)
      : side;
    let key = `${slug}|${adjustedSide||""}|${kv}`;
    let id = activeSlugRev[key];
    if (!id) {
      key = `${slug}||${kv}`;
      id = activeSlugRev[key];
    }
    if (id) {
      const sel = value?.includes(id);
      onChange?.(sel ? value.filter(x => x !== id) : [...(value || []), id]);
    }
  };

  const tglStyle = (v) => ({
    background: view === v ? "rgba(var(--green-rgb), 0.125)" : "transparent",
    border: view === v ? "1px solid rgba(var(--green-rgb), 0.375)" : `1px solid ${C_BODY.border}`,
    borderRadius: 6, padding: "4px 14px", fontSize: 11, fontWeight: view === v ? 700 : 400,
    color: view === v ? "var(--green)" : C_BODY.textMuted,
    cursor: "pointer", fontFamily: "'Inter','Segoe UI',sans-serif",
  });

  const labelStyle = {
    position: "absolute",
    transform: "translate(-50%,-50%)",
    background: "rgba(0,0,0,0.8)",
    color: "var(--green)",
    fontSize: pediatric ? 9 : 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 4,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    fontFamily: "'Inter','Segoe UI',sans-serif",
    zIndex: 10,
    border: "1px solid rgba(var(--green-rgb), 0.3)",
  };

  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:6 }}>
        {pediatric && <span style={{ fontSize:10, color:C_BODY.textMuted, marginRight:4, alignSelf:"center" }}>🧸</span>}
        <button onClick={() => setView("front")} style={tglStyle("front")}>Frente</button>
        <button onClick={() => setView("back")} style={tglStyle("back")}>Costas</button>
      </div>
      <div style={{ position:"relative", display:"inline-block" }}>
        <Body
          data={selectedData}
          side={view}
          gender={sex === "Feminino" ? "female" : "male"}
          onBodyPartPress={handlePartPress}
          defaultFill="var(--bodyFill)"
          defaultStroke="var(--bodyStroke)"
          defaultStrokeWidth={0.5}
          scale={bodyScale}
          border="#3D5675"
        />
        {(value||[]).map(id => {
          const pos = activeLabelPos[id];
          if (!pos) return null;
          const xy = pos[kv];
          if (!xy) return null;
          const [sx, sy] = xy;
          const left = kv === "F" ? (sx / SVG_W) * 100 : ((sx - SVG_W) / SVG_W) * 100;
          const top = (sy / SVG_H) * 100;
          return (
            <div key={id} style={{ ...labelStyle, left: left + "%", top: top + "%" }}>
              {id}
            </div>
          );
        })}
      </div>
      {(value||[]).length > 0 && (
        <div style={{ marginTop:10, textAlign:"left", background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:800, color:"var(--textMuted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
            {pediatric ? "Áreas selecionadas" : "Áreas selecionadas — articulação e músculos"}
          </div>
          {(value||[]).map(id => {
            const d = activeDetails[id];
            if (!d) return null;
            return (
              <div key={id} style={{ marginBottom:6, padding:"6px 8px", background:"var(--surface)", borderRadius:6, border:"1px solid var(--borderLight)" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--green)" }}>{id}</div>
                {d.joint && <div style={{ fontSize:10, color:"var(--textSub)", marginTop:2 }}>{d.joint}</div>}
                {d.muscles && <div style={{ fontSize:10, color:"var(--textMuted)", marginTop:1 }}>{d.muscles}</div>}
              </div>
            );
          })}
        </div>
      )}
      <div style={{ fontSize:10, color: C_BODY.textMuted, marginTop:6, lineHeight:1.4 }}>
        {pediatric ? "Toque nas áreas para marcar onde a criança sente dor" : "Clique nas áreas do corpo para adicionar/remover"}
      </div>
    </div>
  );
}

// ── PaywallModal ──────────────────────────────────────────────────────────────
export function PaywallModal({ open, onClose, featureName, featureDesc, onUpgrade }) {
  if (!open) return null;
  const C2 = {
    bg:          "var(--bg)",
    surface:     "var(--surface)",
    card:        "var(--card)",
    border:      "var(--border)",
    green:       "var(--green)",
    greenBg:     "var(--greenBg)",
    greenBgHov:  "var(--greenBgHov)",
    text:        "var(--text)",
    textMuted:   "var(--textMuted)",
  };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)", padding:16 }}
      onClick={onClose}>
      <div style={{ background:C2.surface, border:`1px solid ${C2.border}`, borderRadius:16, padding:"32px 28px", maxWidth:440, width:"100%", textAlign:"center" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ fontSize:48, marginBottom:8 }}>🔒</div>
        <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:800, color:C2.text, fontFamily:"'Inter','Segoe UI',sans-serif" }}>
          {featureName} disponível nos planos <span style={{ color:C2.green }}>Evidência</span> e <span style={{ color:C2.green }}>Clínica</span>
        </h2>
        {featureDesc && (
          <p style={{ fontSize:13, color:C2.textMuted, lineHeight:1.6, margin:"12px 0 20px", fontFamily:"'Inter','Segoe UI',sans-serif" }}>
            {featureDesc}
          </p>
        )}
        <div style={{ fontSize:11, color:C2.textMuted, lineHeight:1.5, margin:"0 0 16px", fontFamily:"'Inter','Segoe UI',sans-serif" }}>
          🔹 Assine <strong>Evidência (R$ 59,90/mês)</strong> — 40 análises IA/mês + CIF + relatório completo<br/>
          🔹 Ou <strong>Clínica (R$ 149,90/mês)</strong> — 150 análises/mês (equipe) + agenda compartilhada
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <button onClick={()=>{onUpgrade?.(); onClose?.();}}
            style={{ background:C2.green, color:"#061A0C", border:"none", borderRadius:10, padding:"12px 24px", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"'Inter','Segoe UI',sans-serif" }}>
            🔓 Ver Opções com IA
          </button>
          <button onClick={onClose}
            style={{ background:"transparent", border:`1px solid ${C2.border}`, borderRadius:10, padding:"10px 20px", fontSize:13, fontWeight:600, color:C2.textMuted, cursor:"pointer", fontFamily:"'Inter','Segoe UI',sans-serif" }}>
            Continuar sem IA
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PlanCard ──────────────────────────────────────────────────────────────────
export function PlanCard({ plan, isAnnual, onSelect, isCurrent }) {
  const isHighlight = plan.highlight;
  const C3 = {
    surface:     "var(--surface)",
    card:        "var(--card)",
    border:      "var(--border)",
    green:       "var(--green)",
    greenBg:     "var(--greenBg)",
    text:        "var(--text)",
    textMuted:   "var(--textMuted)",
    amber:       "var(--amber)",
    amberBg:     "var(--amberBg)",
  };
  const accent = isHighlight ? C3.green : C3.textMuted;
  const accentBg = isHighlight ? C3.greenBg : "transparent";
  const price = isAnnual ? plan.yearlyMonth : plan.monthly;
  const allFeatures = Object.entries(plan.features);
  const unlocked = allFeatures.filter(([, f]) => f[plan.key]);
  const locked = allFeatures.filter(([, f]) => !f[plan.key]);
  return (
    <div style={{
      flex:1, minWidth:270,
      background: plan.highlight ? C3.card : C3.surface,
      border: plan.highlight ? `2px solid ${C3.green}99` : `1px solid ${C3.border}`,
      borderRadius:16, padding:"28px 22px", display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden",
      boxShadow: plan.highlight ? `0 0 30px ${C3.green}15` : "none",
    }}>
      {plan.badge && (
        <div style={{
          position:"absolute", top:12, right:-28, background:C3.green, color:"#061A0C",
          fontSize:10, fontWeight:800, padding:"4px 32px", transform:"rotate(45deg)",
          letterSpacing:"0.05em", fontFamily:"'Inter','Segoe UI',sans-serif",
        }}>
          {plan.badge}
        </div>
      )}
      {plan.highlight ? (
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C3.green},transparent)` }} />
      ) : null}
      <div style={{ fontSize:11, fontWeight:700, color:C3.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4, fontFamily:"'Inter','Segoe UI',sans-serif" }}>{plan.name}</div>
      <div style={{ fontSize:13, color:C3.textMuted, marginBottom:12, fontFamily:"'Inter','Segoe UI',sans-serif" }}>{plan.tagline}</div>

      {plan.featuredNote && (
        <div style={{ fontSize:11, color:C3.text, lineHeight:1.5, marginBottom:16, padding:"8px 10px", background:accentBg, borderRadius:8, fontFamily:"'Inter','Segoe UI',sans-serif" }}>
          {plan.featuredNote}
        </div>
      )}

      <div style={{ marginBottom:16 }}>
        {isAnnual ? (
          <>
            <span style={{ fontSize:30, fontWeight:800, color:C3.text, fontFamily:"'Inter','Segoe UI',sans-serif" }}>R$ {plan.yearlyMonth.toFixed(2)}</span>
            <span style={{ fontSize:13, color:C3.textMuted, marginLeft:4, fontFamily:"'Inter','Segoe UI',sans-serif" }}>/mês</span>
            <div style={{ fontSize:11, color:C3.amber, marginTop:4, fontFamily:"'Inter','Segoe UI',sans-serif" }}>
              <s style={{ color:C3.textMuted }}>R$ {plan.monthly.toFixed(2)}</s> — 20% de desconto
            </div>
            <div style={{ fontSize:11, color:C3.textMuted, marginTop:2, fontFamily:"'Inter','Segoe UI',sans-serif" }}> Cobrado R$ {plan.yearly.toFixed(2)}/ano</div>
          </>
        ) : (
          <>
            <span style={{ fontSize:30, fontWeight:800, color:C3.text, fontFamily:"'Inter','Segoe UI',sans-serif" }}>R$ {plan.monthly.toFixed(2)}</span>
            <span style={{ fontSize:13, color:C3.textMuted, marginLeft:4, fontFamily:"'Inter','Segoe UI',sans-serif" }}>/mês</span>
          </>
        )}
      </div>

      {/* Unlocked features */}
      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:10, fontWeight:700, color:accent, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6, fontFamily:"'Inter','Segoe UI',sans-serif" }}>✓ Incluso</div>
        {unlocked.map(([key, feat]) => (
          <div key={key} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:6, fontFamily:"'Inter','Segoe UI',sans-serif" }}>
            <span style={{ fontSize:14, lineHeight:"1.3", flexShrink:0, color:accent }}>✅</span>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:C3.text }}>{feat.label}</div>
              <div style={{ fontSize:11, color:C3.textMuted }}>{feat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Locked features */}
      {locked.length > 0 && (
        <div style={{ marginBottom:8, padding:"8px 10px", background:C3.amberBg, borderRadius:8 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C3.amber, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4, fontFamily:"'Inter','Segoe UI',sans-serif" }}>⚠ Não incluso</div>
          {locked.map(([key, feat]) => (
            <div key={key} style={{ display:"flex", alignItems:"flex-start", gap:6, marginBottom:3, fontFamily:"'Inter','Segoe UI',sans-serif" }}>
              <span style={{ fontSize:11, lineHeight:"1.5", color:C3.amber }}>✕</span>
              <span style={{ fontSize:11, color:C3.textMuted }}>{feat.label}: <strong style={{color:C3.amber}}>{feat.note || feat.value}</strong></span>
            </div>
          ))}
        </div>
      )}

      <button onClick={()=>onSelect?.(plan.key)}
        style={{
          marginTop:"auto", width:"100%",
          background: isCurrent ? C3.border : (plan.highlight ? C3.green : "transparent"),
          color: isCurrent ? C3.textMuted : (plan.highlight ? "#061A0C" : C3.green),
          border: `1px solid ${isCurrent ? C3.border : (plan.highlight ? C3.green : C3.green+"50")}`,
          borderRadius:10, padding:"12px 16px", fontSize:14, fontWeight:800,
          cursor: isCurrent ? "default" : "pointer",
          fontFamily:"'Inter','Segoe UI',sans-serif",
          transition:"all 0.12s",
        }}>
        {isCurrent ? "✓ Plano Atual" : (plan.key === "avulso" ? "Usar Avulso" : plan.key === "start" ? "Ativar Start" : "Adquirir Plano")}
      </button>
    </div>
  );
}

export function Tooltip({ text, children, position = "top" }) {
  const [show, setShow] = useState(false);
  const positions = {
    top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 6 },
    bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 6 },
    left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 6 },
    right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 6 },
  };
  return (
    <div style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: "absolute", ...positions[position], zIndex: 9999,
          background: C.textSub, color: C.bg, fontSize: 11, fontWeight: 600,
          padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap",
          pointerEvents: "none", fontFamily: F, lineHeight: 1.4,
        }}>
          {text}
        </div>
      )}
    </div>
  );
}

export function HelpHint({ text, icon = "💡" }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", cursor: "pointer" }}
      onClick={() => setShow(s => !s)}>
      <span style={{ fontSize: 11, opacity: 0.6 }}>{icon}</span>
      {show && (
        <div style={{
          position: "absolute", top: "100%", left: 0, zIndex: 9999, marginTop: 4,
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: "8px 12px", fontSize: 11, color: C.textSub, lineHeight: 1.5,
          minWidth: 200, maxWidth: 280, fontWeight: 400,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)", fontFamily: F,
        }} onClick={(e) => e.stopPropagation()}>
          {text}
        </div>
      )}
    </span>
  );
}

export function OnboardingDica({ dicas, storageKey }) {
  const [step, setStep] = useState(() => {
    const done = localStorage.getItem("sasyra_onboarding_" + storageKey);
    return done ? -1 : 0;
  });
  if (step < 0 || step >= dicas.length) return null;
  const dica = dicas[step];
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.greenBg}, ${C.blueBg})`,
      border: `1px solid ${C.green}30`, borderRadius: 10,
      padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 12,
    }}>
      <span style={{ fontSize: 16 }}>{dica.icon || "💡"}</span>
      <div style={{ flex: 1, color: C.textSub, lineHeight: 1.5 }}>
        <strong style={{ color: C.text }}>{dica.titulo}</strong>: {dica.texto}
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {step < dicas.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)}
            style={{ background: C.green, border: "none", color: "#061A0C", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            Próximo →</button>
        ) : (
          <button onClick={() => { localStorage.setItem("sasyra_onboarding_" + storageKey, "1"); setStep(-1); }}
            style={{ background: C.green, border: "none", color: "#061A0C", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            ✓ Entendi</button>
        )}
        <button onClick={() => { localStorage.setItem("sasyra_onboarding_" + storageKey, "1"); setStep(-1); }}
          style={{ background: "none", border: "none", color: C.textMuted, fontSize: 10, cursor: "pointer", padding: "4px 6px" }}>
          Fechar ×</button>
      </div>
    </div>
  );
}

export function CollapsibleSection({ title, icon, badge, expanded, onToggle, children }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ ...cardStyle(), padding: isMobile ? "14px 12px" : "20px 22px" }}>
      <div onClick={onToggle}
        style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", paddingBottom:expanded?12:0, borderBottom:expanded?`1px solid ${C.border}`:"none", marginBottom:expanded?isMobile?14:18:0 }}>
        <span style={{ fontSize:10, color:C.textMuted, transition:"transform 0.15s", transform:expanded?"rotate(90deg)":"rotate(0deg)" }}>▶</span>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:isMobile?10:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.green, flex:1 }}>{title}</h3>
        {badge && <span style={{ fontSize:11, background:C.amberBg, color:C.amber, border:`1px solid ${C.amber}40`, borderRadius:20, padding:"2px 10px" }}>{badge}</span>}
      </div>
      {expanded && <div>{children}</div>}
    </div>
  );
}

export function CollapsibleSub({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ marginBottom: 14, background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: isMobile ? "8px 10px" : "10px 14px" }}>
      <div onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none", paddingBottom: open ? 8 : 0, borderBottom: open ? `1px solid ${C.border}` : "none", marginBottom: open ? 10 : 0 }}>
        <span style={{ fontSize: 10, color: C.textMuted, transition: "transform 0.15s", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", flex: 1 }}>{title}</span>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}
