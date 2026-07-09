// Matrix interativa de reflexos neurológicos: ROTs (0-4) por segmento D/E
// + Babinski + Hoffman como toggles (Presente/Ausente).
// Estado: { bicipitalD, bicipitalE, tricipitalD, tricipitalE, patelarD, patelarE,
//           aquileuD, aquileuE, babinskiD, babinskiE, hoffmanD, hoffmanE }
// Babinski/Hoffman: 0=Ausente, 1=Presente (ou false/true)

const ROT_SEGMENTS = [
  { id: "bicipital",     label: "Bicipital (C5-C6)" },
  { id: "tricipital",    label: "Tricipital (C6-C7)" },
  { id: "patelar",       label: "Patelar (L3-L4)" },
  { id: "aquileu",       label: "Aquileu (S1-S2)" },
];

const ROT_GRADES = [
  { v: "0", label: "0",    desc: "Arreflexia" },
  { v: "1", label: "1",    desc: "Hiporreflexia" },
  { v: "2", label: "2",    desc: "Normal" },
  { v: "3", label: "3",    desc: "Hiperreflexia" },
  { v: "4", label: "4",    desc: "Clônus" },
];

const PATHOLOGICOS = [
  { id: "babinski",  label: "Babinski" },
  { id: "hoffman",   label: "Hoffman" },
];

export default function ReflexMatrix({ reflexos = {}, onChange, colors }) {
  const C = colors || {};
  const accent = C.accent || C.green || "#4ADE80";
  const surface = C.surface || "#111822";
  const border = C.border || "#1F2E45";
  const card = C.card || "#19243A";
  const text = C.text || "#DDE6F0";
  const textMuted = C.textMuted || "#5E7A96";
  const green = C.green || "#4ADE80";
  const red = C.red || "#F87171";
  const amber = C.amber || "#FBBF24";
  const font = C.font || "'Inter','Segoe UI',system-ui,sans-serif";

  const set = (k, v) => {
    const next = { ...reflexos };
    if (v === "" || v === undefined || v === null) delete next[k];
    else next[k] = v;
    onChange(next);
  };

  const gradeColor = (g) => {
    if (g === "0") return green;
    if (g === "1") return amber;
    if (g === "2") return accent;
    if (g === "3") return amber;
    if (g === "4") return red;
    return textMuted;
  };

  const isActive = (k, v) => reflexos[k] === v;

  const activeColorBg = (g, active) => {
    const c = gradeColor(g);
    return active ? `${c}18` : "transparent";
  };

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>
        Reflexos Osteotendíneos (ROT)
      </div>

      {/* ROT header */}
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr", gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 9, color: textMuted, fontWeight: 700 }}>Reflexo</span>
        <span style={{ fontSize: 9, color: textMuted, fontWeight: 700, textAlign: "center" }}>Direito</span>
        <span style={{ fontSize: 9, color: textMuted, fontWeight: 700, textAlign: "center" }}>Esquerdo</span>
      </div>

      {ROT_SEGMENTS.map((seg) => (
        <div key={seg.id} style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr", gap: 4, marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: textMuted, alignSelf: "center", fontWeight: 600 }}>{seg.label}</span>
          {["D", "E"].map((lado) => {
            const k = `${seg.id}${lado}`;
            return (
              <div key={k} style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                {ROT_GRADES.map((g) => {
                  const active = isActive(k, g.v);
                  return (
                    <button
                      key={g.v}
                      title={g.desc}
                      onClick={() => set(k, active ? "" : g.v)}
                      style={{
                        background: activeColorBg(g.v, active),
                        border: `1px solid ${active ? gradeColor(g.v) + "70" : border}`,
                        color: active ? gradeColor(g.v) : textMuted,
                        borderRadius: 6,
                        width: 28, height: 28,
                        fontSize: 11, fontWeight: active ? 800 : 400,
                        cursor: "pointer", fontFamily: font,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.1s",
                        opacity: active ? 1 : 0.6,
                      }}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}

      {/* Reflexos Patológicos */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginTop: 14, marginBottom: 8 }}>
        Reflexos Patológicos
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr", gap: 4 }}>
        {PATHOLOGICOS.map((pat) => (
          <div key={pat.id} style={{ display: "contents" }}>
            <span style={{ fontSize: 10, color: textMuted, alignSelf: "center", fontWeight: 600, padding: "4px 0" }}>{pat.label}</span>
            {["D", "E"].map((lado) => {
              const k = `${pat.id}${lado}`;
              const present = reflexos[k] === "1" || reflexos[k] === true;
              return (
                <button
                  key={k}
                  onClick={() => set(k, present ? "" : "1")}
                  style={{
                    background: present ? `${red}18` : "transparent",
                    border: `1px solid ${present ? red + "70" : border}`,
                    color: present ? red : textMuted,
                    borderRadius: 6, padding: "4px 8px", fontSize: 10,
                    fontWeight: present ? 700 : 400, cursor: "pointer", fontFamily: font,
                    transition: "all 0.1s",
                  }}
                >
                  {present ? "⊕ Presente" : "⊖ Ausente"}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Resumo */}
      {Object.values(reflexos).filter((v) => v).length > 0 && (
        <div style={{ marginTop: 10, fontSize: 9, color: textMuted, lineHeight: 1.5 }}>
          {Object.values(reflexos).filter((v) => Number(v) >= 3).length > 0 && (
            <span style={{ color: red, fontWeight: 700 }}>⚠ {Object.values(reflexos).filter((v) => Number(v) >= 3).length} reflexo(s) exacerbado(s). </span>
          )}
          {Object.values(reflexos).filter((v) => v === "1" || v === true).length > 0 && (
            <span style={{ color: amber, fontWeight: 700 }}>{Object.entries(reflexos).filter(([, v]) => v === "1" || v === true).length} patológico(s).</span>
          )}
          {Object.values(reflexos).every((v) => !v) && <span style={{ color: green }}>✓ Nenhuma alteração registrada.</span>}
        </div>
      )}
    </div>
  );
}
