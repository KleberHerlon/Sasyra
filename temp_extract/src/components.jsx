import { useState, useRef, useEffect } from "react";

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
const BODY_POINTS = [
  { id:"Cervical",     label:"Cervical",     x:150, y:68,  lx:105, la:"end"   },
  { id:"Torácica",     label:"Torácica",     x:150, y:110, lx:195, la:"start" },
  { id:"Lombar",       label:"Lombar",       x:150, y:160, lx:105, la:"end"   },
  { id:"Sacroilíaca",  label:"Sacroilíaca",  x:150, y:210, lx:195, la:"start" },
  { id:"Ombro D",      label:"Ombro D",      x:92,  y:82,  lx:72,  la:"end"   },
  { id:"Ombro E",      label:"Ombro E",      x:208, y:82,  lx:228, la:"start" },
  { id:"Cotovelo D",   label:"Cotovelo D",   x:58,  y:162, lx:38,  la:"end"   },
  { id:"Cotovelo E",   label:"Cotovelo E",   x:242, y:162, lx:262, la:"start" },
  { id:"Punho/Mão D",  label:"Punho/Mão D",  x:52,  y:252, lx:32,  la:"end"   },
  { id:"Punho/Mão E",  label:"Punho/Mão E",  x:248, y:252, lx:268, la:"start" },
  { id:"Quadril D",    label:"Quadril D",    x:92,  y:250, lx:72,  la:"end"   },
  { id:"Quadril E",    label:"Quadril E",    x:208, y:250, lx:228, la:"start" },
  { id:"Joelho D",     label:"Joelho D",     x:84,  y:350, lx:64,  la:"end"   },
  { id:"Joelho E",     label:"Joelho E",     x:216, y:350, lx:236, la:"start" },
  { id:"Tornozelo D",  label:"Tornozelo D",  x:86,  y:456, lx:66,  la:"end"   },
  { id:"Tornozelo E",  label:"Tornozelo E",  x:214, y:456, lx:234, la:"start" },
  { id:"Pé D",         label:"Pé D",         x:86,  y:514, lx:66,  la:"end"   },
  { id:"Pé E",         label:"Pé E",         x:214, y:514, lx:234, la:"start" },
];

// ── Silhouettes ────────────────────────────────────────────────────────────
const SVGS = {
  // Masculino - Frente
  MF: [
    `<ellipse cx="150" cy="28" rx="16" ry="20"/>`,
    `<path d="M136,44 L136,56 Q136,60 140,60 L160,60 Q164,60 164,56 L164,44 Z"/>`,
    `<path d="M136,60 C112,62 82,68 72,84 C64,98 64,114 64,130 C64,152 68,172 68,188 C68,208 64,226 64,240 C64,256 74,262 88,264 L212,264 C226,262 236,256 236,240 C236,226 232,208 232,188 C232,172 236,152 236,130 C236,114 236,98 228,84 C218,68 188,62 164,60 Z"/>`,
    `<path d="M78,96 C64,108 48,136 40,174 C34,212 34,244 34,260 C34,268 40,272 48,272 C56,272 60,268 60,260 C60,232 62,204 66,172 C70,142 76,116 84,106"/>`,
    `<path d="M222,96 C236,108 252,136 260,174 C266,212 266,244 266,260 C266,268 260,272 252,272 C244,272 240,268 240,260 C240,232 238,204 234,172 C230,142 224,116 216,106"/>`,
    `<path d="M82,262 C78,278 72,306 72,332 C72,356 74,376 74,396 C74,416 72,440 72,462 C72,476 78,480 84,482 C90,482 92,478 92,472 C92,454 90,434 90,414 C90,394 88,374 88,354 C88,332 90,306 92,278 C94,268 94,264 96,262"/>`,
    `<path d="M218,262 C222,278 228,306 228,332 C228,356 226,376 226,396 C226,416 228,440 228,462 C228,476 222,480 216,482 C210,482 208,478 208,472 C208,454 210,434 210,414 C210,394 212,374 212,354 C212,332 210,306 208,278 C206,268 206,264 204,262"/>`,
    `<path d="M64,478 L98,478 C104,478 106,482 106,488 L106,492 C106,498 102,500 96,500 L64,500 C58,500 56,498 56,492 L56,488 C56,482 58,478 64,478 Z"/>`,
    `<path d="M202,478 L236,478 C242,478 244,482 244,488 L244,492 C244,498 240,500 234,500 L202,500 C196,500 194,498 194,492 L194,488 C194,482 196,478 202,478 Z"/>`,
  ],
  // Masculino - Costas
  MB: [
    `<ellipse cx="150" cy="28" rx="16" ry="20"/>`,
    `<path d="M136,44 L136,56 Q136,60 140,60 L160,60 Q164,60 164,56 L164,44 Z"/>`,
    `<path d="M136,60 C112,62 82,68 72,84 C64,98 64,114 64,130 C64,152 68,172 68,188 C68,208 64,226 64,240 C64,256 74,262 88,264 L212,264 C226,262 236,256 236,240 C236,226 232,208 232,188 C232,172 236,152 236,130 C236,114 236,98 228,84 C218,68 188,62 164,60 Z"/>`,
    `<path d="M78,96 C64,108 48,136 40,174 C34,212 34,244 34,260 C34,268 40,272 48,272 C56,272 60,268 60,260 C60,232 62,204 66,172 C70,142 76,116 84,106"/>`,
    `<path d="M222,96 C236,108 252,136 260,174 C266,212 266,244 266,260 C266,268 260,272 252,272 C244,272 240,268 240,260 C240,232 238,204 234,172 C230,142 224,116 216,106"/>`,
    `<path d="M82,262 C78,278 72,306 72,332 C72,356 74,376 74,396 C74,416 72,440 72,462 C72,476 78,480 84,482 C90,482 92,478 92,472 C92,454 90,434 90,414 C90,394 88,374 88,354 C88,332 90,306 92,278 C94,268 94,264 96,262"/>`,
    `<path d="M218,262 C222,278 228,306 228,332 C228,356 226,376 226,396 C226,416 228,440 228,462 C228,476 222,480 216,482 C210,482 208,478 208,472 C208,454 210,434 210,414 C210,394 212,374 212,354 C212,332 210,306 208,278 C206,268 206,264 204,262"/>`,
    `<path d="M64,478 L98,478 C104,478 106,482 106,488 L106,492 C106,498 102,500 96,500 L64,500 C58,500 56,498 56,492 L56,488 C56,482 58,478 64,478 Z"/>`,
    `<path d="M202,478 L236,478 C242,478 244,482 244,488 L244,492 C244,498 240,500 234,500 L202,500 C196,500 194,498 194,492 L194,488 C194,482 196,478 202,478 Z"/>`,
    // Costas: coluna + omoplatas + glúteos
    `<path d="M150,60 L150,256" stroke="#0E141B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>`,
    `<path d="M114,100 C118,108 120,116 118,124 C116,128 112,130 108,128" stroke="#0E141B" strokeWidth="1.2" fill="none" strokeLinecap="round"/>`,
    `<path d="M186,100 C182,108 180,116 182,124 C184,128 188,130 192,128" stroke="#0E141B" strokeWidth="1.2" fill="none" strokeLinecap="round"/>`,
    `<path d="M80,254 C76,268 80,272 88,274" stroke="#0E141B" strokeWidth="1" fill="none" strokeLinecap="round"/>`,
    `<path d="M220,254 C224,268 220,272 212,274" stroke="#0E141B" strokeWidth="1" fill="none" strokeLinecap="round"/>`,
  ],
  // Feminino - Frente
  FF: [
    `<ellipse cx="150" cy="28" rx="14" ry="18"/>`,
    `<path d="M138,44 L138,56 Q138,60 142,60 L158,60 Q162,60 162,56 L162,44 Z"/>`,
    `<path d="M138,60 C126,62 102,66 90,80 C80,94 78,110 78,126 C78,148 82,168 82,184 C82,204 76,222 76,236 C76,252 84,258 96,260 L204,260 C216,258 224,252 224,236 C224,222 218,204 218,184 C218,168 222,148 222,126 C222,110 220,94 210,80 C198,66 174,62 162,60 Z"/>`,
    // Seios
    `<path d="M94,112 C94,122 110,134 120,126 C120,114 108,104 94,112 Z" stroke="#0E141B" strokeWidth="0.8" fill="none" strokeLinecap="round"/>`,
    `<path d="M206,112 C206,122 190,134 180,126 C180,114 192,104 206,112 Z" stroke="#0E141B" strokeWidth="0.8" fill="none" strokeLinecap="round"/>`,
    `<path d="M80,96 C66,108 50,136 42,174 C36,212 36,244 36,260 C36,268 42,272 50,272 C58,272 62,268 62,260 C62,232 64,204 68,172 C72,142 78,116 86,106"/>`,
    `<path d="M220,96 C234,108 250,136 258,174 C264,212 264,244 264,260 C264,268 258,272 250,272 C242,272 238,268 238,260 C238,232 236,204 232,172 C228,142 222,116 214,106"/>`,
    `<path d="M84,258 C80,274 74,302 74,328 C74,352 76,372 76,392 C76,412 74,436 74,458 C74,472 80,476 86,478 C92,478 94,474 94,468 C94,450 92,430 92,410 C92,390 90,370 90,350 C90,328 92,302 94,274 C96,264 96,260 98,258"/>`,
    `<path d="M216,258 C220,274 226,302 226,328 C226,352 224,372 224,392 C224,412 226,436 226,458 C226,472 220,476 214,478 C208,478 206,474 206,468 C206,450 208,430 208,410 C208,390 210,370 210,350 C210,328 208,302 206,274 C204,264 204,260 202,258"/>`,
    `<path d="M66,474 L100,474 C104,474 106,478 106,484 L106,488 C106,494 102,496 98,496 L66,496 C62,496 60,494 60,488 L60,484 C60,478 62,474 66,474 Z"/>`,
    `<path d="M200,474 L234,474 C238,474 240,478 240,484 L240,488 C240,494 236,496 232,496 L200,496 C196,496 194,494 194,488 L194,484 C194,478 196,474 200,474 Z"/>`,
  ],
  // Feminino - Costas
  FB: [
    `<ellipse cx="150" cy="28" rx="14" ry="18"/>`,
    `<path d="M138,44 L138,56 Q138,60 142,60 L158,60 Q162,60 162,56 L162,44 Z"/>`,
    `<path d="M138,60 C126,62 102,66 90,80 C80,94 78,110 78,126 C78,148 82,168 82,184 C82,204 76,222 76,236 C76,252 84,258 96,260 L204,260 C216,258 224,252 224,236 C224,222 218,204 218,184 C218,168 222,148 222,126 C222,110 220,94 210,80 C198,66 174,62 162,60 Z"/>`,
    `<path d="M80,96 C66,108 50,136 42,174 C36,212 36,244 36,260 C36,268 42,272 50,272 C58,272 62,268 62,260 C62,232 64,204 68,172 C72,142 78,116 86,106"/>`,
    `<path d="M220,96 C234,108 250,136 258,174 C264,212 264,244 264,260 C264,268 258,272 250,272 C242,272 238,268 238,260 C238,232 236,204 232,172 C228,142 222,116 214,106"/>`,
    `<path d="M84,258 C80,274 74,302 74,328 C74,352 76,372 76,392 C76,412 74,436 74,458 C74,472 80,476 86,478 C92,478 94,474 94,468 C94,450 92,430 92,410 C92,390 90,370 90,350 C90,328 92,302 94,274 C96,264 96,260 98,258"/>`,
    `<path d="M216,258 C220,274 226,302 226,328 C226,352 224,372 224,392 C224,412 226,436 226,458 C226,472 220,476 214,478 C208,478 206,474 206,468 C206,450 208,430 208,410 C208,390 210,370 210,350 C210,328 208,302 206,274 C204,264 204,260 202,258"/>`,
    `<path d="M66,474 L100,474 C104,474 106,478 106,484 L106,488 C106,494 102,496 98,496 L66,496 C62,496 60,494 60,488 L60,484 C60,478 62,474 66,474 Z"/>`,
    `<path d="M200,474 L234,474 C238,474 240,478 240,484 L240,488 C240,494 236,496 234,496 L200,496 C196,496 194,494 194,488 L194,484 C194,478 196,474 200,474 Z"/>`,
    // Costas: coluna + cintura + glúteos
    `<path d="M150,60 L150,252" stroke="#0E141B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>`,
    `<path d="M148,160 C146,164 144,168 144,174 C144,178 146,180 150,180" stroke="#0E141B" strokeWidth="1.2" fill="none" strokeLinecap="round"/>`,
    `<path d="M152,160 C154,164 156,168 156,174 C156,178 154,180 150,180" stroke="#0E141B" strokeWidth="1.2" fill="none" strokeLinecap="round"/>`,
    `<path d="M84,252 C80,266 84,272 92,274" stroke="#0E141B" strokeWidth="1" fill="none" strokeLinecap="round"/>`,
    `<path d="M216,252 C220,266 216,272 208,274" stroke="#0E141B" strokeWidth="1" fill="none" strokeLinecap="round"/>`,
  ],
};

export function BodyMap({ value, onChange, sex }) {
  const [view, setView] = useState("front");
  const sel = v => value?.includes(v);
  const toggle = id => onChange?.(sel(id) ? value.filter(x=>x!==id) : [...(value||[]), id]);
  const isMale = sex !== "Feminino";
  const key = (isMale ? "M" : "F") + (view === "front" ? "F" : "B");
  const paths = SVGS[key];
  const tgl = (v) => ({
    background: view === v ? "#4ADE8020" : "transparent",
    border: view === v ? "1px solid #4ADE8060" : "1px solid #1F2E45",
    borderRadius: 6, padding: "4px 14px", fontSize: 11, fontWeight: view === v ? 700 : 400,
    color: view === v ? "#4ADE80" : "#5E7A96",
    cursor: "pointer", fontFamily: "'Inter','Segoe UI',sans-serif",
  });
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:6 }}>
        <button onClick={()=>setView("front")} style={tgl("front")}>Frente</button>
        <button onClick={()=>setView("back")} style={tgl("back")}>Costas</button>
      </div>
      <svg viewBox="0 0 300 580" style={{ width:"100%", maxWidth:300, height:"auto", display:"inline-block" }}>
        <g fill="#162030" stroke="#1F2E45" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          {paths.filter(d => !d.includes('stroke="#0E141B"')).map((d,i) => <g key={i} dangerouslySetInnerHTML={{__html:d}} />)}
        </g>
        <g>{paths.filter(d => d.includes('stroke="#0E141B"')).map((d,i) => <g key={`d${i}`} dangerouslySetInnerHTML={{__html:d}} />)}</g>
        {BODY_POINTS.map(p => {
          const selected = sel(p.id);
          const isCenter = p.x === 150;
          return (
            <g key={p.id} onClick={()=>toggle(p.id)} style={{ cursor:"pointer" }}>
              <circle cx={p.x} cy={p.y} r={isCenter?16:14} fill="transparent"/>
              {isCenter && (
                <line x1={p.x} y1={p.y} x2={p.lx} y2={p.y} stroke={selected?"#4ADE8030":"#1F2E4540"} strokeWidth="0.8" strokeDasharray="2 3"/>
              )}
              <circle cx={p.x} cy={p.y} r={selected ? 5 : 3.8}
                fill={selected?"#4ADE80":"#111822"}
                stroke={selected?"#4ADE80":"#2A3F5C"}
                strokeWidth={selected ? 1.8 : 1.2}
                opacity={selected ? 1 : 0.95}
              />
              {selected && (
                <circle cx={p.x} cy={p.y} r="9" fill="none" stroke="#4ADE80" strokeWidth="1" opacity="0.30">
                  <animate attributeName="r" values="9;14;9" dur="2.2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.30;0.08;0.30" dur="2.2s" repeatCount="indefinite"/>
                </circle>
              )}
              {!selected && (
                <circle cx={p.x} cy={p.y} r="3.8" fill="none" stroke="#2A3F5C" strokeWidth="1" opacity="0.35" />
              )}

              {/* Label discreto (apenas quando selecionado) */}
              {selected && (
                <text x={p.lx} y={p.y}
                  textAnchor={p.la}
                  fill="#4ADE80"
                  fontSize="9.5"
                  fontWeight={800}
                  fontFamily="'Inter','Segoe UI',sans-serif"
                  dominantBaseline="central"
                  style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.25))" }}
                >
                  {p.label}
                </text>
              )}

            </g>
          );
        })}
      </svg>
      <div style={{ fontSize:10, color:"#5E7A96", marginTop:6, lineHeight:1.4 }}>
        Clique nos pontos (articulações) para adicionar/remover
      </div>
    </div>
  );
}
