import { useState } from "react";

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

const ZONES_F = [
  { id: "clitoris",    label: "Clitóris",              x: 44, y: 19, w: 12, h: 10 },
  { id: "uretra_f",    label: "Uretra",                x: 41, y: 29, w: 18, h: 10 },
  { id: "vagina",      label: "Vagina",                x: 36, y: 40, w: 28, h: 16 },
  { id: "perineo_f",   label: "Corpo perineal",        x: 38, y: 56, w: 24, h: 8 },
  { id: "anus_f",      label: "Ânus / Esfíncter anal", x: 40, y: 64, w: 20, h: 10 },
  { id: "isquio_f",    label: "Isquiocavernoso",       x: 22, y: 18, w: 18, h: 28 },
  { id: "bulbo_f",     label: "Bulboesponjoso",        x: 30, y: 36, w: 20, h: 24 },
  { id: "transv_f",    label: "Transverso perineal",   x: 24, y: 54, w: 26, h: 8 },
  { id: "elevador_f",  label: "Elevador do ânus",      x: 10, y: 44, w: 20, h: 36 },
  { id: "gluteo_f",    label: "Glúteo máximo",         x: 2,  y: 6,  w: 16, h: 30 },
];

const ZONES_M = [
  { id: "penis_m",     label: "Pênis / Bulbo",         x: 38, y: 12, w: 24, h: 18 },
  { id: "uretra_m",    label: "Uretra",                x: 40, y: 30, w: 20, h: 10 },
  { id: "perineo_m",   label: "Corpo perineal",        x: 36, y: 50, w: 28, h: 10 },
  { id: "anus_m",      label: "Ânus / Esfíncter anal", x: 38, y: 60, w: 24, h: 12 },
  { id: "isquio_m",    label: "Isquiocavernoso",       x: 18, y: 14, w: 18, h: 30 },
  { id: "bulbo_m",     label: "Bulboesponjoso",        x: 24, y: 30, w: 26, h: 24 },
  { id: "transv_m",    label: "Transverso perineal",   x: 20, y: 48, w: 30, h: 10 },
  { id: "elevador_m",  label: "Elevador do ânus",      x: 8,  y: 40, w: 22, h: 40 },
  { id: "gluteo_m",    label: "Glúteo máximo",         x: 2,  y: 2,  w: 18, h: 32 },
];

export default function PelvicFloorMap({ value = [], onChange, sexo, colors }) {
  const C = colors || {};
  const accent = C.accent || "#FBBF24";
  const surface = C.surface || "#111822";
  const border = C.border || "#1F2E45";
  const card = C.card || "#19243A";
  const text = C.text || "#DDE6F0";
  const textMuted = C.textMuted || "#5E7A96";
  const textDim = C.textDim || "#364D62";
  const font = C.font || "'Inter','Segoe UI',system-ui,sans-serif";

  const [activeZone, setActiveZone] = useState(null);
  const [hovered, setHovered] = useState(null);

  const isMale = sexo === "Masculino";
  const zones = isMale ? ZONES_M : ZONES_F;
  const sintomas = isMale ? SINTOMAS_M : SINTOMAS_F;

  const getZone = (id) => value.find(e => e.zona === id);
  const setZone = (id, sintoma) => {
    const next = value.filter(e => e.zona !== id);
    if (sintoma) next.push({ zona: id, sintoma });
    onChange(next);
  };
  const activeData = activeZone ? getZone(activeZone) : null;
  const sc = (s) => sintomas.find(st => st.v === s)?.color || textDim;

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>
        Mapa do Assoalho Pélvico — {isMale ? "Masculino" : "Feminino"}
      </div>

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Imagem anatômica à esquerda */}
        <div style={{ position: "relative", background: "#fff", borderRadius: 8, border: `1px solid ${border}`, overflow: "hidden", width: 180, flexShrink: 0 }}>
          <img
            src={isMale ? "/pelvic-floor-male.png" : "/pelvic-floor-female.png"}
            alt={`Assoalho Pélvico — ${isMale ? "Masculino" : "Feminino"}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          {/* Zonas clicáveis */}
          {zones.map(z => {
            const active = value?.some(e => e.zona === z.id);
            const d = getZone(z.id);
            const hov = hovered === z.id;
            const col = d ? sc(d.sintoma) : accent;
            return (
              <div key={z.id}
                onClick={() => setActiveZone(activeZone === z.id ? null : z.id)}
                onMouseEnter={() => setHovered(z.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "absolute",
                  left: `${z.x}%`, top: `${z.y}%`,
                  width: `${z.w}%`, height: `${z.h}%`,
                  cursor: "pointer",
                  background: active
                    ? `${col}20`
                    : hov ? `${col}08` : "transparent",
                  border: active
                    ? `1.5px solid ${col}`
                    : hov ? `1px dashed ${col}50` : "1px solid transparent",
                  borderRadius: 4,
                  transition: "all 0.12s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxSizing: "border-box",
                }}>
                {active && (
                  <span style={{
                    background: col, color: "#fff",
                    borderRadius: "50%", width: 16, height: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)", lineHeight: 1,
                  }}>✓</span>
                )}
                {hov && !active && (
                  <span style={{ fontSize: 8, color: col, fontWeight: 600, opacity: 0.8, background: "rgba(255,255,255,0.7)", borderRadius: 3, padding: "1px 4px" }}>
                    {z.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Lista de zonas + sintomas à direita */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Botões de zona */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {zones.map(z => {
              const d = getZone(z.id);
              const col = d ? sc(d.sintoma) : textDim;
              const isA = activeZone === z.id;
              return (
                <button key={z.id} onClick={() => setActiveZone(isA ? null : z.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: d ? `${col}10` : "transparent",
                    border: `1px solid ${isA ? accent : d ? col + "30" : "transparent"}`,
                    color: d ? col : textMuted,
                    borderRadius: 6, padding: "5px 10px", fontSize: 11,
                    fontWeight: d ? 700 : 400,
                    cursor: "pointer", fontFamily: font, transition: "all 0.12s",
                    textAlign: "left",
                  }}>
                  <span style={{ minWidth: 16, fontWeight: 800, fontSize: 11, color: d ? col : textDim }}>
                    {d ? "✓" : "○"}
                  </span>
                  <span>{z.label}</span>
                  {d && (
                    <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.8 }}>
                      {d.sintoma}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Painel de edição de sintoma */}
          {activeZone && (
            <div style={{ background: card, border: `1px solid ${accent}30`, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: accent, fontFamily: font }}>
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
                        borderRadius: 4, padding: "3px 8px", fontSize: 10, fontWeight: isCur ? 700 : 400,
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
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4, fontSize: 9, color: textMuted, fontFamily: font }}>
            {sintomas.map(st => (
              <span key={st.v} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                <span style={{ width: 7, height: 7, background: st.color, borderRadius: 1 }} /> {st.v}
              </span>
            ))}
            <span style={{ marginLeft: "auto" }}>{value.length} zona(s)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
