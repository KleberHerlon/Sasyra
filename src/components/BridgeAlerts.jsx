import { useState, useEffect } from "react";
import { readFisioterapiaRestrictions, isAvaliacaoDesatualizada } from "../data/transitionBridge";

export default function BridgeAlerts({ studentId }) {
  const [restrictions, setRestrictions] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    const r = readFisioterapiaRestrictions(studentId);
    setRestrictions(r);
    if (r.length > 0) setExpanded(true);
  }, [studentId]);

  if (!restrictions.length) return null;

  const alertas = restrictions.filter(r => r.tipo === "alerta");
  const modificacoes = restrictions.filter(r => r.tipo === "modificacao");
  const informativos = restrictions.filter(r => r.tipo === "informativo");

  return (
    <div style={{
      background: "var(--amberBg)", border: "1px solid var(--amber)", borderRadius: 12,
      padding: "12px 16px", marginBottom: 14, fontFamily: "'Inter','Segoe UI',sans-serif"
    }}>
      <div onClick={() => setExpanded(!expanded)} style={{
        display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none"
      }}>
        <span style={{ fontSize: 14 }}>🔗</span>
        <span style={{ flex: 1, fontSize: 11, fontWeight: 800, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Ponte de Transição — {restrictions.length} restrição{restrictions.length > 1 ? "ões" : ""} detectada{restrictions.length > 1 ? "s" : ""}
        </span>
        <span style={{ fontSize: 10, color: "var(--textMuted)", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
      </div>

      {expanded && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {alertas.map((r, i) => (
            <div key={i} style={{
              background: "var(--redBg)", border: "1px solid var(--red)", borderRadius: 8,
              padding: "8px 12px", fontSize: 11, color: "var(--text)", lineHeight: 1.5
            }}>
              <div style={{ fontWeight: 700, color: "var(--red)", marginBottom: 2 }}>🚫 ALERTA — {r.local}</div>
              <div>{r.descricao}</div>
              {r.alternativa && <div style={{ color: "var(--green)", marginTop: 4 }}>✓ Alternativa: {r.alternativa}</div>}
              <div style={{ fontSize: 9, color: "var(--textMuted)", marginTop: 4 }}>{r.evidencia}</div>
            </div>
          ))}
          {modificacoes.map((r, i) => (
            <div key={i} style={{
              background: "var(--amberBg)", border: "1px solid var(--amber)", borderRadius: 8,
              padding: "8px 12px", fontSize: 11, color: "var(--text)", lineHeight: 1.5
            }}>
              <div style={{ fontWeight: 700, color: "var(--amber)", marginBottom: 2 }}>⚠️ MODIFICAÇÃO — {r.local}</div>
              <div>{r.descricao}</div>
              {r.alternativa && <div style={{ color: "var(--green)", marginTop: 4 }}>✓ Alternativa: {r.alternativa}</div>}
              <div style={{ fontSize: 9, color: "var(--textMuted)", marginTop: 4 }}>{r.evidencia}</div>
            </div>
          ))}
          {informativos.map((r, i) => (
            <div key={i} style={{
              background: "var(--blueBg)", border: "1px solid var(--blue)", borderRadius: 8,
              padding: "8px 12px", fontSize: 11, color: "var(--text)", lineHeight: 1.5
            }}>
              <div style={{ fontWeight: 700, color: "var(--blue)", marginBottom: 2 }}>ℹ️ INFO — {r.local}</div>
              <div>{r.descricao}</div>
              {r.comorbidades && <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {r.comorbidades.map((c, j) => <span key={j} style={{ background: "var(--blue)", color: "#fff", borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>{c}</span>)}
              </div>}
              <div style={{ fontSize: 9, color: "var(--textMuted)", marginTop: 4 }}>{r.evidencia}</div>
            </div>
          ))}
          {restrictions.some(r => r.dataAvaliacao && isAvaliacaoDesatualizada(r.dataAvaliacao)) && (
            <div style={{ fontSize: 10, color: "var(--amber)", fontWeight: 600, textAlign: "center" }}>
              ⚠️ Avaliação de origem com mais de 90 dias — considere reavaliar.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
