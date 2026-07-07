import { CIF } from "../data/cif";

export default function CifSection({ cifSuggestions, autoCif, colors, canUseFeature, onUpgrade }) {
  const C = colors;
  if ((!cifSuggestions || cifSuggestions.length === 0) && (!autoCif || autoCif.length === 0)) return null;

  return (
    <div style={{ margin: "12px 0" }}>
      {cifSuggestions?.length > 0 && !canUseFeature?.("cif") ? (
        <div style={{ background: C.card, borderRadius: 8, padding: "12px" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>CIF sugeridos pela condição</div>
          <div style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 8 }}>
            🔒 Sugestão CIF disponível nos planos <strong style={{ color: C.green }}>Evidência</strong> e <strong style={{ color: C.green }}>Clínica</strong>.
            {onUpgrade && <button onClick={onUpgrade} style={{ background: "transparent", border: "none", color: C.green, fontWeight: 700, cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>Desbloquear</button>}
          </div>
        </div>
      ) : cifSuggestions?.length > 0 && (
        <div style={{ background: C.card, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>📋 CIF sugeridos pela condição</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {cifSuggestions.map(code => (
              <span key={code} style={{ fontSize: 11, color: C.blue, background: C.blueBg, border: `1px solid ${C.blue}30`, borderRadius: 6, padding: "3px 10px" }}>
                <strong>{code}</strong> — {CIF[code] || code}
              </span>
            ))}
          </div>
        </div>
      )}

      {autoCif?.length > 0 && !canUseFeature?.("cif") ? (
        <div style={{ background: C.surface, borderRadius: 8, padding: "12px" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>CIF identificados automaticamente</div>
          <div style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 8 }}>
            🔒 CIF automática com qualificadores disponível nos planos <strong style={{ color: C.green }}>Evidência</strong> e <strong style={{ color: C.green }}>Clínica</strong>.
            {onUpgrade && <button onClick={onUpgrade} style={{ background: "transparent", border: "none", color: C.green, fontWeight: 700, cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>Desbloquear</button>}
          </div>
        </div>
      ) : autoCif?.length > 0 && (
        <div style={{ background: C.surface, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>🤖 CIF identificados automaticamente</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {autoCif.map(item => (
              <span key={item.code} style={{ fontSize: 11, color: C.purple, background: C.purpleBg, border: `1px solid ${C.purple}30`, borderRadius: 6, padding: "3px 10px" }}>
                <strong>{item.code}</strong> — {item.desc} | Q:{item.qualifier}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
