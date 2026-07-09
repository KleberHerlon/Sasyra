import { useState, useRef, useEffect } from "react";

// Cronômetro para testes cronometrados (TUG, 10m walk, etc).
// Valor em segundos (1 casa decimal) via onChange. Botões Iniciar/Parar/Reset.
// Input numérico manual alternativo para preenchimento rápido.
export default function StopwatchField({ value, onChange, label = "Tempo", unit = "s", colors, decimals = 1 }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // ms acumulado nesta sessão
  const startRef = useRef(0);
  const rafRef = useRef(null);
  const intervalRef = useRef(null);

  const C = colors || {};
  const accent = C.accent || C.green || "#4ADE80";
  const surface = C.surface || "#111822";
  const border = C.border || "#1F2E45";
  const text = C.text || "#DDE6F0";
  const textMuted = C.textMuted || "#5E7A96";
  const red = C.red || "#F87171";
  const font = C.font || "'Inter','Segoe UI',system-ui,sans-serif";

  const fmt = (ms) => {
    const totalSec = ms / 1000;
    const m = Math.floor(totalSec / 60);
    const s = totalSec - m * 60;
    return m > 0 ? `${m}:${s.toFixed(decimals).padStart(4, "0")}` : `${s.toFixed(decimals)}s`;
  };

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - elapsed;
    const tick = () => {
      const now = performance.now() - startRef.current;
      setElapsed(now);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const start = () => { setRunning(true); };
  const stop = () => {
    setRunning(false);
    const sec = Math.round((elapsed / 1000) * Math.pow(10, decimals)) / Math.pow(10, decimals);
    onChange(String(sec));
  };
  const reset = () => { setRunning(false); setElapsed(0); onChange(""); };

  const btn = (bg, fg, title, onClick, disabled) => ({
    background: bg, color: fg, border: `1px solid ${fg}50`, borderRadius: 8,
    padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: font, opacity: disabled ? 0.4 : 1,
  });

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: running ? accent : text, fontFamily: "monospace", lineHeight: 1, minWidth: 90 }}>
          {running ? fmt(elapsed) : (value ? `${value}${unit}` : `0.0${unit}`)}
        </div>
        {!running ? (
          <button onClick={start} style={btn(`${accent}18`, accent, "Iniciar", start)}>▶ Iniciar</button>
        ) : (
          <button onClick={stop} style={btn(`${red}18`, red, "Parar", stop)}>⏸ Parar</button>
        )}
        <button onClick={reset} style={btn("transparent", textMuted, "Reset", reset)} disabled={!elapsed && !value}>🔄 Zerar</button>
      </div>
      <div style={{ marginTop: 10, fontSize: 10, color: textMuted, marginBottom: 4 }}>Ou preencha manualmente:</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, maxWidth: 180 }}>
        <input
          type="number" min="0" max="300" step="0.1" value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.0"
          style={{ width: "100%", boxSizing: "border-box", background: surface, border: `1px solid ${border}`, borderRadius: 8, color: text, fontSize: 14, fontWeight: 700, padding: "8px 10px", outline: "none", fontFamily: font, textAlign: "center" }}
        />
        <span style={{ fontSize: 12, color: textMuted }}>{unit}</span>
      </div>
    </div>
  );
}
