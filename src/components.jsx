/* eslint-disable react-refresh/only-export-components */
import { useState, useRef, useEffect, useMemo } from "react";
import Body from "react-muscle-highlighter";

const C = {
  bg:          "#0E141B",
  surface:     "#111822",
  card:        "#19243A",
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
  purple:      "#A78BFA",
  purpleBg:    "rgba(167,139,250,0.09)",
  text:        "#DDE6F0",
  textSub:     "#A8BECC",
  textMuted:   "#5E7A96",
  textDim:     "#364D62",
  white:       "#FFFFFF",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

const inp = (extra={}) => ({ width:"100%", boxSizing:"border-box", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, padding:"9px 12px", outline:"none", fontFamily:F, ...extra });
const sel = (extra={}) => ({...inp(), cursor:"pointer", ...extra});
const lbl = (extra={}) => ({ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:5, ...extra });
const cardStyle = (extra={}) => ({ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", marginBottom:14, ...extra });

const iconBtn = (active=false, activeColor=C.green, extra={}) => ({ background: active ? `${activeColor}18` : C.surface, border:`1px solid ${active ? activeColor+"50" : C.border}`, color: active ? activeColor : C.textMuted, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight: active ? 700 : 400, cursor:"pointer", fontFamily:F, transition:"all 0.12s", ...extra });

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
function getRef(mv, jt) { return REF[`${mv}|${jt}`] || ""; }
function isOutOfRange(val, refStr) {
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
  const supported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  useEffect(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR(); r.lang="pt-BR"; r.continuous=true; r.interimResults=false;
    r.onresult = e => { const t=Array.from(e.results).map(x=>x[0].transcript).join(" "); onChange(p=>(p?p+" "+t:t)); };
    r.onend = () => setRec(false);
    rRef.current = r;
    return () => { try { r.stop(); } catch { /* ignore */ } };
  }, [onChange, supported]);
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

export function MRCSelect({ value, onChange }) {
  const grades = ["0 – Sem contração","1 – Frêmito","2 – Sem gravidade","3 – Contra gravidade","4 – Resistência parcial","5 – Normal"];
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={sel()}>
      <option value="">MRC…</option>
      {grades.map((g,i)=><option key={i} value={String(i)}>{g}</option>)}
    </select>
  );
}

export function GonioRow({ row, onUpdate, onRemove }) {
  const mvts = MVMT[row.joint]||[];
  const ref = getRef(row.movement, row.joint);
  const oor = isOutOfRange(row.value, ref);
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
      <input type="number" min="0" max="360" value={row.value} onChange={e=>onUpdate({...row,value:e.target.value})}
        style={{...inp({textAlign:"center",border:`1.5px solid ${oor?C.red:C.border}`,fontWeight:700})}} placeholder="°"/>
      <div style={{ fontSize:11, color:oor?C.red:C.textMuted, textAlign:"center", fontWeight:oor?700:400 }}>{ref?`${ref}°`:"—"}{oor?" ⚠":""}</div>
      <button onClick={onRemove} style={{ background:"none", border:"none", color:C.textDim, fontSize:18, cursor:"pointer", padding:0 }}>×</button>
    </div>
  );
}

export function TestCard({ test, result, onResult }) {
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
          <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:16, padding:"0 4px" }}>{open?"▲":"▼"}</button>
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

export function Row({ children, cols="1fr 1fr", gap=14 }) {
  return <div style={{ display:"grid", gridTemplateColumns:cols, gap, marginBottom:14 }}>{children}</div>;
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
const C_BODY = {
  green: "#4ADE80",
  surface: "#111822",
  card: "#19243A",
  border: "#1F2E45",
  textMuted: "#5E7A96",
};

// Mapeia IDs do SASYRA → slugs da biblioteca react-muscle-highlighter
// Cada parte especifica o slug para vista frontal (F) e posterior (B)
const PART_SLUG = {
  "Cervical":    { F:"neck",        B:"neck" },
  "Torácica":    { F:"trapezius",   B:"upper-back" },
  "Lombar":      { F:"abs",         B:"lower-back" },
  "Sacroilíaca": { F:"obliques",    B:"gluteal" },
  "Ombro D":     { F:"deltoids",    B:"deltoids",    side:"right" },
  "Ombro E":     { F:"deltoids",    B:"deltoids",    side:"left" },
  "Cotovelo D":  { F:"biceps",      B:"triceps",     side:"right" },
  "Cotovelo E":  { F:"biceps",      B:"triceps",     side:"left" },
  "Punho/Mão D": { F:"forearm",     B:"forearm",     side:"right" },
  "Punho/Mão E": { F:"forearm",     B:"forearm",     side:"left" },
  "Quadril D":   { F:"quadriceps",  B:"hamstring",   side:"right" },
  "Quadril E":   { F:"quadriceps",  B:"hamstring",   side:"left" },
  "Joelho D":    { F:"knees",       B:"calves",      side:"right" },
  "Joelho E":    { F:"knees",       B:"calves",      side:"left" },
  "Tornozelo D": { F:"ankles",      B:"ankles",      side:"right" },
  "Tornozelo E": { F:"ankles",      B:"ankles",      side:"left" },
  "Pé D":        { F:"feet",        B:"feet",        side:"right" },
  "Pé E":        { F:"feet",        B:"feet",        side:"left" },
};

// Reverse map: slug|side|view → partId
const SLUG_REV = {};
Object.entries(PART_SLUG).forEach(([id, m]) => {
  ["F","B"].forEach(v => {
    SLUG_REV[`${m[v]}|${m.side||""}|${v}`] = id;
  });
});

export function BodyMap({ value, onChange, sex }) {
  const [view, setView] = useState("front");
  const kv = view === "front" ? "F" : "B";

  const selectedData = useMemo(() => {
    const groups = {};
    (value||[]).forEach(id => {
      const m = PART_SLUG[id];
      if (!m) return;
      const slug = m[kv];
      if (!slug) return;
      if (!groups[slug]) groups[slug] = { sides: new Set() };
      if (m.side) groups[slug].sides.add(m.side);
    });
    return Object.entries(groups).map(([slug, g]) => ({
      slug,
      color: C_BODY.green,
      ...(g.sides.size === 1 ? { side: [...g.sides][0] } : {}),
    }));
  }, [value, kv]);

  const handlePartPress = (_part, side) => {
    const slug = _part?.slug;
    if (!slug) return;
    const key = `${slug}|${side||""}|${kv}`;
    const id = SLUG_REV[key];
    if (id) {
      const sel = value?.includes(id);
      onChange?.(sel ? value.filter(x => x !== id) : [...(value || []), id]);
    }
  };

  const tglStyle = (v) => ({
    background: view === v ? "#4ADE8020" : "transparent",
    border: view === v ? "1px solid #4ADE8060" : `1px solid ${C_BODY.border}`,
    borderRadius: 6, padding: "4px 14px", fontSize: 11, fontWeight: view === v ? 700 : 400,
    color: view === v ? "#4ADE80" : C_BODY.textMuted,
    cursor: "pointer", fontFamily: "'Inter','Segoe UI',sans-serif",
  });

  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:6 }}>
        <button onClick={() => setView("front")} style={tglStyle("front")}>Frente</button>
        <button onClick={() => setView("back")} style={tglStyle("back")}>Costas</button>
      </div>
      <Body
        data={selectedData}
        side={view}
        gender={sex === "Feminino" ? "female" : "male"}
        onBodyPartPress={handlePartPress}
        defaultFill="#2A3F5C"
        defaultStroke={C_BODY.border}
        defaultStrokeWidth={0.5}
        scale={1}
        border="#3D5675"
      />
      <div style={{ fontSize:10, color: C_BODY.textMuted, marginTop:6, lineHeight:1.4 }}>
        Clique nas áreas do corpo para adicionar/remover
      </div>
    </div>
  );
}
