import { useState } from "react";

// Mapa interativo do Assoalho Pélvico — vista sagital com anatomia realista
// Clicável: cada zona anatômica é selecionável e recebe graduação de sintoma
// Sexo-adaptativo: feminino (útero/vagina) ou masculino (próstata/pênis)

const SINTOMAS_F = [
  { v: "Nenhum", color: "#4ADE80" },
  { v: "Dor leve", color: "#FBBF24" },
  { v: "Dor moderada", color: "#F97316" },
  { v: "Dor intensa", color: "#F87171" },
  { v: "Incontinência", color: "#A78BFA" },
  { v: "Prolapso", color: "#60A5FA" },
  { v: "Dispareunia", color: "#EC4899" },
];

const SINTOMAS_M = [
  { v: "Nenhum", color: "#4ADE80" },
  { v: "Dor leve", color: "#FBBF24" },
  { v: "Dor moderada", color: "#F97316" },
  { v: "Dor intensa", color: "#F87171" },
  { v: "Incontinência", color: "#A78BFA" },
  { v: "Disfunção erétil", color: "#F59E0B" },
];

// Zonas anatômicas — cada uma com retângulo clicável sobreposto ao diagrama
const ZONES = {
  F: [
    { id: "bexiga",    label: "Bexiga",          rx: 62,  ry: 42,  rw: 26,  rh: 16 },
    { id: "uretra_f",  label: "Uretra",          rx: 68,  ry: 58,  rw: 14,  rh: 14 },
    { id: "utero",     label: "Útero",           rx: 82,  ry: 28,  rw: 22,  rh: 18 },
    { id: "vagina",    label: "Vagina",          rx: 84,  ry: 54,  rw: 14,  rh: 26 },
    { id: "reto",      label: "Reto",            rx: 108, ry: 40,  rw: 20,  rh: 40 },
    { id: "canal_anal",label: "Canal anal",      rx: 114, ry: 76,  rw: 12,  rh: 12 },
    { id: "elevador",  label: "Elevador do ânus",rx: 70,  ry: 72,  rw: 56,  rh: 12 },
    { id: "perineo",   label: "Corpo perineal",  rx: 86,  ry: 82,  rw: 26,  rh: 10 },
    { id: "sacro",     label: "Sacro / Cóccix",  rx: 138, ry: 18,  rw: 14,  rh: 44 },
  ],
  M: [
    { id: "bexiga",    label: "Bexiga",          rx: 60,  ry: 40,  rw: 26,  rh: 16 },
    { id: "prostata",  label: "Próstata",        rx: 78,  ry: 52,  rw: 18,  rh: 14 },
    { id: "penis",     label: "Pênis / Uretra",  rx: 72,  ry: 64,  rw: 16,  rh: 26 },
    { id: "reto",      label: "Reto",            rx: 110, ry: 38,  rw: 20,  rh: 42 },
    { id: "canal_anal",label: "Canal anal",      rx: 116, ry: 74,  rw: 12,  rh: 12 },
    { id: "elevador",  label: "Elevador do ânus",rx: 72,  ry: 70,  rw: 56,  rh: 12 },
    { id: "perineo",   label: "Corpo perineal",  rx: 86,  ry: 80,  rw: 26,  rh: 10 },
    { id: "sacro",     label: "Sacro / Cóccix",  rx: 140, ry: 16,  rw: 14,  rh: 46 },
  ],
};

export default function PelvicFloorMap({ value = [], onChange, sexo, colors }) {
  const C = colors || {};
  const accent = C.accent || "#FBBF24";
  const surface = C.surface || "#111822";
  const border = C.border || "#1F2E45";
  const cardAlt = C.cardAlt || "#162030";
  const text = C.text || "#DDE6F0";
  const textMuted = C.textMuted || "#5E7A96";
  const textDim = C.textDim || "#364D62";
  const font = C.font || "'Inter','Segoe UI',system-ui,sans-serif";

  const [activeZone, setActiveZone] = useState(null);

  const isMale = sexo === "Masculino";
  const zones = isMale ? ZONES.M : ZONES.F;
  const sintomas = isMale ? SINTOMAS_M : SINTOMAS_F;

  const getZone = (id) => value.find(e => e.zona === id);
  const setZone = (id, sintoma) => {
    const next = value.filter(e => e.zona !== id);
    if (sintoma) next.push({ zona: id, sintoma });
    onChange(next);
  };
  const activeData = activeZone ? getZone(activeZone) : null;
  const sc = (s) => sintomas.find(st => st.v === s)?.color || textDim;

  const zoneFill = (z) => {
    const d = getZone(z.id);
    return d ? `${sc(d.sintoma)}22` : "transparent";
  };
  const zoneStroke = (z) => {
    const d = getZone(z.id);
    if (activeZone === z.id) return accent;
    if (d) return sc(d.sintoma);
    return border;
  };
  const zoneStrokeW = (z) => activeZone === z.id ? 2 : (getZone(z.id) ? 1.5 : 1);

  const s = (id) => {
    const d = getZone(id);
    return d ? sc(d.sintoma) : textDim;
  };

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>
        Mapa do Assoalho Pélvico — {isMale ? "Masculino" : "Feminino"} (Vista Sagital)
      </div>

      {/* Diagrama anatômico principal */}
      <div style={{ background: cardAlt, border: `1px solid ${border}`, borderRadius: 8, padding: "8px", marginBottom: 8, textAlign: "center" }}>
        <svg viewBox="0 0 180 110" width="100%" height="190" style={{ maxWidth: 460 }}>
          {/* ── Fundo: silhueta pélvica ── */}
          {/* Púbis / sínfise púbica */}
          <path d="M54,58 L54,84 L66,84 L66,62 Z" fill={border} opacity="0.25" stroke={border} strokeWidth="1" />
          <text x="60" y="92" fontSize="5" fill={textDim} fontFamily={font} textAnchor="middle">Púbis</text>

          {/* Sacro + Cóccix */}
          <path d="M148,14 L154,10 L156,42 L150,58 L144,50 Z" fill={border} opacity="0.22" stroke={border} strokeWidth="1" rx="3" />
          <path d="M150,22 L154,18" stroke={border} strokeWidth="0.5" opacity="0.3" />
          <path d="M149,30 L155,26" stroke={border} strokeWidth="0.5" opacity="0.3" />

          {/* ── Órgãos ── */}
          {/* Bexiga */}
          <path d="M60,40 Q68,28 82,32 L84,48 Q80,58 66,58 Z" fill={zoneFill(zones[0])} stroke={zoneStroke(zones[0])} strokeWidth={zoneStrokeW(zones[0])} />
          <text x="73" y="47" fontSize="5" fill={s("bexiga")} fontFamily={font} textAnchor="middle">Bexiga</text>

          {/* Uretra (F) */}
          {!isMale && <>
            <path d="M72,58 L72,72" fill="none" stroke={zoneStroke(zones.find(z=>z.id==="uretra_f")||zones[1])} strokeWidth={zoneStrokeW(zones.find(z=>z.id==="uretra_f")||zones[1])} strokeDasharray={getZone("uretra_f") ? "none" : "3,2"} />
            <text x="64" y="68" fontSize="4" fill={s("uretra_f")} fontFamily={font}>Uretra</text>
          </>}

          {/* Útero (F) */}
          {!isMale && <>
            <ellipse cx="92" cy="38" rx="12" ry="9" fill={zoneFill(zones[2])} stroke={zoneStroke(zones[2])} strokeWidth={zoneStrokeW(zones[2])} />
            <text x="92" y="40" fontSize="5" fill={s("utero")} fontFamily={font} textAnchor="middle">Útero</text>
          </>}

          {/* Vagina (F) */}
          {!isMale && <>
            <path d="M90,46 Q88,62 90,76" fill="none" stroke={zoneStroke(zones[3])} strokeWidth={zoneStrokeW(zones[3]) === 1 ? 1.5 : zoneStrokeW(zones[3])} strokeDasharray={getZone("vagina") ? "none" : "4,2"} />
            <text x="100" y="62" fontSize="4" fill={s("vagina")} fontFamily={font}>Vagina</text>
          </>}

          {/* Próstata (M) */}
          {isMale && <>
            <circle cx="86" cy="60" r="8" fill={zoneFill(zones[1])} stroke={zoneStroke(zones[1])} strokeWidth={zoneStrokeW(zones[1])} />
            <text x="86" y="62" fontSize="5" fill={s("prostata")} fontFamily={font} textAnchor="middle">Próstata</text>
          </>}

          {/* Pênis (M) */}
          {isMale && <>
            <path d="M78,66 Q76,82 78,92" fill="none" stroke={zoneStroke(zones[2])} strokeWidth={zoneStrokeW(zones[2]) === 1 ? 2 : zoneStrokeW(zones[2])} strokeDasharray={getZone("penis") ? "none" : "4,2"} />
            <ellipse cx="78" cy="92" rx="5" ry="3" fill="none" stroke={zoneStroke(zones[2])} strokeWidth={zoneStrokeW(zones[2]) === 1 ? 1.5 : zoneStrokeW(zones[2])} />
            <text x="68" y="82" fontSize="4" fill={s("penis")} fontFamily={font}>Pênis</text>
          </>}

          {/* Reto */}
          <path d="M108,38 Q114,26 118,36 L118,50 Q122,66 116,78" fill={zoneFill(zones.find(z=>z.id==="reto")||zones[isMale?3:4])} stroke={zoneStroke(zones.find(z=>z.id==="reto")||zones[isMale?3:4])} strokeWidth={zoneStrokeW(zones.find(z=>z.id==="reto")||zones[isMale?3:4])} />
          <text x="112" y="56" fontSize="5" fill={s("reto")} fontFamily={font} textAnchor="middle">Reto</text>

          {/* Canal anal */}
          <ellipse cx="118" cy="84" rx="6" ry="4" fill={zoneFill(zones.find(z=>z.id==="canal_anal")||zones[isMale?4:5])} stroke={zoneStroke(zones.find(z=>z.id==="canal_anal")||zones[isMale?4:5])} strokeWidth={zoneStrokeW(zones.find(z=>z.id==="canal_anal")||zones[isMale?4:5])} />

          {/* Elevador do ânus */}
          <path d="M66,78 Q82,76 98,80 Q112,84 128,80"
            fill="none" stroke={zoneStroke(zones.find(z=>z.id==="elevador")||zones[isMale?5:6])}
            strokeWidth={zoneStrokeW(zones.find(z=>z.id==="elevador")||zones[isMale?5:6]) + 1}
            strokeDasharray={getZone("elevador") ? "none" : "5,3"} />
          <text x="94" y="76" fontSize="4" fill={s("elevador")} fontFamily={font} textAnchor="middle">Elevador do ânus</text>

          {/* Corpo perineal */}
          <ellipse cx="94" cy="87" rx="14" ry="5" fill={zoneFill(zones.find(z=>z.id==="perineo")||zones[isMale?6:7])} stroke={zoneStroke(zones.find(z=>z.id==="perineo")||zones[isMale?6:7])} strokeWidth={zoneStrokeW(zones.find(z=>z.id==="perineo")||zones[isMale?6:7])} />
          <text x="94" y="94" fontSize="4" fill={s("perineo")} fontFamily={font} textAnchor="middle">Períneo</text>

          {/* Rótulos de orientação */}
          <text x="6" y="12" fontSize="5" fill={textDim} fontFamily={font}>← Anterior (frente)</text>
          <text x="120" y="12" fontSize="5" fill={textDim} fontFamily={font}>Posterior (costas) →</text>

          {/* Zonas clicáveis — retângulos invisíveis sobrepostos */}
          {zones.map(z => (
            <rect key={z.id} x={z.rx} y={z.ry} width={z.rw} height={z.rh} rx="2"
              fill="transparent" stroke="transparent"
              style={{ cursor: "pointer" }}
              onClick={() => setActiveZone(activeZone === z.id ? null : z.id)} />
          ))}
        </svg>
      </div>

      {/* Botões de zona */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
        {zones.map(z => {
          const d = getZone(z.id);
          const col = d ? sc(d.sintoma) : textDim;
          const isA = activeZone === z.id;
          return (
            <button key={z.id} onClick={() => setActiveZone(isA ? null : z.id)}
              style={{
                background: d ? `${col}14` : surface,
                border: `1px solid ${isA ? accent : d ? col + "50" : border}`,
                color: d ? col : textMuted,
                borderRadius: 4, padding: "3px 8px", fontSize: 9, fontWeight: d ? 700 : 400,
                cursor: "pointer", fontFamily: font, transition: "all 0.1s",
              }}>
              {z.label}{d ? ` (${d.sintoma})` : ""}
            </button>
          );
        })}
      </div>

      {/* Painel de edição */}
      {activeZone && (
        <div style={{ background: cardAlt, border: `1px solid ${accent}30`, borderRadius: 6, padding: "8px 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: font }}>
              {zones.find(z => z.id === activeZone)?.label}
            </span>
            <button onClick={() => setActiveZone(null)}
              style={{ background: "none", border: "none", color: textMuted, cursor: "pointer", fontSize: 14, fontFamily: font, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {sintomas.map(st => {
              const cur = activeData?.sintoma;
              const isCur = cur === st.v;
              return (
                <button key={st.v} onClick={() => setZone(activeZone, isCur ? null : st.v)}
                  style={{
                    background: isCur ? `${st.color}18` : "transparent",
                    border: `1px solid ${isCur ? st.color : border}`,
                    color: isCur ? st.color : textMuted,
                    borderRadius: 4, padding: "3px 8px", fontSize: 9, fontWeight: isCur ? 700 : 400,
                    cursor: "pointer", fontFamily: font,
                  }}>
                  {isCur && "✓ "}{st.v}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Legenda */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8, fontSize: 8, color: textMuted, fontFamily: font }}>
        {sintomas.map(st => (
          <span key={st.v} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
            <span style={{ width: 6, height: 6, background: st.color, borderRadius: 1 }} /> {st.v}
          </span>
        ))}
        <span style={{ marginLeft: "auto" }}>{value.length} zona(s)</span>
      </div>
    </div>
  );
}
