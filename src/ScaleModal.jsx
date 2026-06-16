import { useState } from "react";

const F = "'Inter',-apple-system,BlinkMacSystemFont,sans-serif";

function calcScale(scale, answers) {
  if (scale.calculate) return scale.calculate(answers);
  const maxItems = scale.questions.length;
  const sum = scale.questions.reduce((t, q) => t + (answers[q.id] ?? 0), 0);
  const maxRaw = maxItems * scale.maxPerSection;
  const pct = Math.round((sum / maxRaw) * 100);
  return { raw: sum, pct };
}

export default function ScaleModal({ scale, open, onClose, onSave, initial }) {
  const [answers, setAnswers] = useState(initial || {});
  const [simpleVal, setSimpleVal] = useState(initial?.raw ?? 50);
  const [saved, setSaved] = useState(false);

  if (!open || !scale) return null;

  // ── Simple mode (numeric input) ──────────────────────────────────────
  if (scale.simple) {
    const [minR, maxR] = scale.range || [0, 100];
    const range = maxR - minR;
    const isHighGood = scale.goodDirection === "highIsGood";
    const raw = Math.max(minR, Math.min(maxR, simpleVal));
    const pct = Math.round(((raw - minR) / range) * 100);
    const displayScore = isHighGood ? pct : 100 - pct;
    const interpretation = scale.interpret(raw);
    const barColor = interpretation ? interpretation.color : "var(--border)";

    return (
      <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:F }}>
        <div style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:16, maxWidth:480, width:"100%", padding:"24px 28px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"var(--green)", letterSpacing:"0.05em" }}>ESCALA FUNCIONAL</div>
              <div style={{ fontSize:20, fontWeight:800, color:"var(--text)", marginTop:2 }}>{scale.name}</div>
              {saved && <div style={{ fontSize:12, color:"var(--green)", marginTop:4 }}>✓ Resultado salvo</div>}
            </div>
            <button onClick={onClose} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, color:"var(--textMuted)", width:32, height:32, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          </div>

          <div style={{ background:"var(--card)", borderRadius:10, padding:"16px 20px", marginBottom:18, textAlign:"center" }}>
            <div style={{ fontSize:11, color:"var(--textMuted)", marginBottom:8 }}>
              Informe o valor obtido na escala {scale.shortName} ({minR}–{maxR})
              {isHighGood ? " · Maior = melhor" : " · Maior = pior"}
            </div>

            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14 }}>
                <span style={{ fontSize:12, color:"var(--textMuted)", minWidth:30, textAlign:"right" }}>{minR}</span>
                <input type="range" min={minR} max={maxR} step={range <= 10 ? 0.1 : 1}
                  value={simpleVal}
                  onChange={e => setSimpleVal(Number(e.target.value))}
                  style={{ flex:1, accentColor:"var(--green)" }} />
                <span style={{ fontSize:12, color:"var(--textMuted)", minWidth:30 }}>{maxR}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginTop:10 }}>
                <input type="number" min={minR} max={maxR} step={range <= 10 ? 0.1 : 1}
                  value={simpleVal}
                  onChange={e => setSimpleVal(Number(e.target.value))}
                  style={{ width:100, textAlign:"center", fontSize:28, fontWeight:800, color:"var(--text)", background:"transparent", border:"none", outline:"none", fontFamily:F }} />
              </div>
            </div>

            <div style={{ height:8, background:"var(--border)", borderRadius:4, overflow:"hidden", marginBottom:8 }}>
              <div style={{ height:"100%", width:`${displayScore}%`, background:barColor, borderRadius:4, transition:"width 0.3s" }} />
            </div>
            {interpretation && (
              <div style={{ fontSize:12, color:interpretation.color, fontWeight:700 }}>
                {interpretation.level} — {interpretation.desc}
              </div>
            )}
            {scale.mcid !== undefined && (
              <div style={{ marginTop:6, fontSize:10, color:"var(--textMuted)", lineHeight:1.5 }}>
                MCID: ±{scale.mcid}{scale.range?.[1] <= 10 ? " pts" : " ppt"} &middot; MDC: ±{scale.mdc ?? Math.round(scale.mcid * 0.6)}{scale.range?.[1] <= 10 ? " pts" : " ppt"}
              </div>
            )}
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", borderTop:"1px solid var(--border)", paddingTop:16 }}>
            <button onClick={onClose} style={{ background:"transparent", border:"1px solid var(--border)", borderRadius:8, padding:"8px 18px", fontSize:12, color:"var(--textMuted)", cursor:"pointer" }}>Fechar</button>
            <button onClick={() => {
              onSave({
                scale: scale.id,
                shortName: scale.shortName,
                scaleName: scale.name,
                raw,
                pct: displayScore,
                interpretation: interpretation?.level || "",
                mcid: scale.mcid,
                mdc: scale.mdc ?? (scale.mcid ? Math.round(scale.mcid * 0.6) : undefined),
                answers: { value: raw },
                date: new Date().toISOString().slice(0,10),
              });
              setSaved(true);
            }} style={{ background:"var(--green)", border:"none", borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:700, color:"#0E141B", cursor:"pointer" }}>
              {saved ? "Salvo ✓" : "Salvar resultado"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Full mode (questions) ────────────────────────────────────────────
  const allAnswered = scale.questions.every(q => answers[q.id] !== undefined);
  const result = calcScale(scale, answers);
  const pct = result.pct;
  const interpretation = scale.interpret(result.raw ?? pct);

  const handleAnswer = (qId, val) => {
    setAnswers(p => ({ ...p, [qId]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave({
      scale: scale.id,
      shortName: scale.shortName,
      scaleName: scale.name,
      raw: result.raw,
      pct,
      interpretation: interpretation.level,
      mcid: scale.mcid,
      mdc: scale.mdc ?? (scale.mcid ? Math.round(scale.mcid * 0.6) : undefined),
      answers,
      date: new Date().toISOString().slice(0, 10),
    });
    setSaved(true);
  };

  const barColor = allAnswered ? interpretation.color : "var(--border)";

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:F }}>
      <div style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:16, maxWidth:700, width:"100%", maxHeight:"90vh", overflow:"auto", padding:"24px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"var(--green)", letterSpacing:"0.05em" }}>ESCALA FUNCIONAL</div>
            <div style={{ fontSize:20, fontWeight:800, color:"var(--text)", marginTop:2 }}>{scale.name}</div>
            {saved && <div style={{ fontSize:12, color:"var(--green)", marginTop:4 }}>✓ Resultado salvo</div>}
          </div>
          <button onClick={onClose} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, color:"var(--textMuted)", width:32, height:32, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        <div style={{ background:"var(--card)", borderRadius:10, padding:"12px 16px", marginBottom:18 }}>
          <div style={{ fontSize:11, color:"var(--textMuted)", marginBottom:8 }}>
            {scale.shortName}: {result.raw !== undefined ? `${result.raw}/${scale.questions.length * scale.maxPerSection} pts (${pct}%)` : `${pct}%`}
          </div>
          <div style={{ height:8, background:"var(--border)", borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:barColor, borderRadius:4, transition:"width 0.3s" }} />
          </div>
          {allAnswered && (
            <div style={{ marginTop:8, fontSize:12, color:interpretation.color, fontWeight:700 }}>
              {interpretation.level} — {interpretation.desc}
            </div>
          )}
          {allAnswered && scale.mcid !== undefined && (
            <div style={{ marginTop:6, fontSize:10, color:"var(--textMuted)", lineHeight:1.5 }}>
              MCID: ±{scale.mcid} ppt &middot; MDC: ±{scale.mdc ?? Math.round(scale.mcid * 0.6)} ppt
            </div>
          )}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {scale.questions.map((q, qi) => {
            const opts = q.o || [];
            return (
              <div key={q.id} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--text)", marginBottom:8 }}>
                  {qi + 1}. {q.label}
                  {answers[q.id] !== undefined && (
                    <span style={{ color:"var(--green)", marginLeft:6, fontSize:10 }}>
                      ({typeof answers[q.id] === "number" ? `${answers[q.id]}/${q.max ?? (opts.length - 1)}` : "✓"})
                    </span>
                  )}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {opts.length > 0 && typeof opts[0] === "string" ? (
                    opts.map((opt, oi) => (
                      <label key={oi} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", cursor:"pointer", fontSize:11, color:"var(--textSub)", lineHeight:1.4 }}>
                        <input type="radio" name={q.id} checked={answers[q.id] === oi} onChange={() => handleAnswer(q.id, oi)}
                          style={{ accentColor:"var(--green)", flexShrink:0 }} />
                        <span>{oi}. {opt}</span>
                      </label>
                    ))
                  ) : (
                    opts.map((opt, oi) => (
                      <label key={oi} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", cursor:"pointer", fontSize:11, color:"var(--textSub)", lineHeight:1.4 }}>
                        <input type="radio" name={q.id} checked={answers[q.id] === opt.s} onChange={() => handleAnswer(q.id, opt.s)}
                          style={{ accentColor:"var(--green)", flexShrink:0 }} />
                        <span>{opt.t}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display:"flex", gap:10, marginTop:18, justifyContent:"flex-end", borderTop:"1px solid var(--border)", paddingTop:16 }}>
          <button onClick={onClose} style={{ background:"transparent", border:"1px solid var(--border)", borderRadius:8, padding:"8px 18px", fontSize:12, color:"var(--textMuted)", cursor:"pointer" }}>Fechar</button>
          <button onClick={handleSave} disabled={!allAnswered}
            style={{ background:allAnswered?"var(--green)":"var(--border)", border:"none", borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:700, color:allAnswered?"#0E141B":"var(--textMuted)", cursor:allAnswered?"pointer":"not-allowed" }}>
            {saved ? "Salvo ✓" : "Salvar resultado"}
          </button>
        </div>
      </div>
    </div>
  );
}
