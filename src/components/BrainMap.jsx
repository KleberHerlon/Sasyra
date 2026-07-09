import { useState } from "react";

const BRAIN_ZONES = [
  { id: "frontal",    label: "Lobo Frontal",      desc: "Funções executivas, movimento voluntário, fala (Broca)" },
  { id: "parietal",   label: "Lobo Parietal",     desc: "Sensibilidade tátil, propriocepção, orientação espacial" },
  { id: "temporal",   label: "Lobo Temporal",     desc: "Audição, memória, compreensão da linguagem (Wernicke)" },
  { id: "occipital",  label: "Lobo Occipital",    desc: "Processamento visual primário" },
  { id: "cerebelo",   label: "Cerebelo",          desc: "Coordenação motora, equilíbrio, tônus postural" },
  { id: "tronco",     label: "Tronco Encefálico", desc: "Funções vitais (respiração, FC), nervos cranianos" },
  { id: "motor_ctx",  label: "Córtex Motor (M1)",  desc: "Controle motor voluntário — giro pré-central" },
  { id: "sens_ctx",   label: "Córtex Sensorial",  desc: "Sensibilidade somática — giro pós-central" },
  { id: "broca",      label: "Área de Broca",     desc: "Produção da fala (hemisfério dominante)" },
  { id: "wernicke",   label: "Área de Wernicke",  desc: "Compreensão da linguagem (hemisfério dominante)" },
  { id: "caloso",     label: "Corpo Caloso",      desc: "Conexão inter-hemisférica — fibras comissurais" },
  { id: "talamo",     label: "Tálamo",            desc: "Estação de retransmissão sensorial e motora" },
];

export default function BrainMap({ value = [], onChange, colors }) {
  const C = colors || {};
  const surface = C.surface || "#111822";
  const border = C.border || "#1F2E45";
  const text = C.text || "#DDE6F0";
  const textMuted = C.textMuted || "#5E7A96";
  const textDim = C.textDim || "#364D62";
  const accent = C.accent || "#A78BFA";
  const green = C.green || "#4ADE80";
  const red = C.red || "#F87171";
  const font = C.font || "'Inter','Segoe UI',system-ui,sans-serif";

  const [zoomed, setZoomed] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [iframeReady, setIframeReady] = useState(false);

  const getZoneState = (id) => value.find(e => e.zona === id) || null;
  const toggleZone = (id) => {
    const exists = value.find(e => e.zona === id);
    onChange(exists ? value.filter(e => e.zona !== id) : [...value, { zona: id, afetado: true }]);
  };
  const zoneColor = (id) => {
    const s = getZoneState(id);
    return !s ? textDim : s.afetado === false ? green : red;
  };

  const iframeH = zoomed ? 520 : 380;

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>
          Mapeamento Cerebral
        </span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button onClick={() => setZoomed(!zoomed)}
            style={{
              background: zoomed ? `${accent}22` : "transparent",
              border: `1px solid ${zoomed ? accent : border}`,
              color: zoomed ? accent : textMuted,
              borderRadius: 6, width: 26, height: 26, fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: font, lineHeight: 1, padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{zoomed ? "−" : "+"}</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: zoomed ? "column" : "row", alignItems: "flex-start" }}>
        {/* Modelo 3D BrainFacts */}
        <div style={{ position: "relative", flexShrink: 0, width: zoomed ? "100%" : 400 }}>
          <div style={{
            width: "100%", height: iframeH,
            borderRadius: 10, border: `1px solid ${border}40`,
            overflow: "hidden", background: "#0A1018",
            position: "relative",
          }}>
            {!iframeReady && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: textMuted, fontSize: 12, fontFamily: font, zIndex: 1,
              }}>
                Carregando modelo 3D...
              </div>
            )}
            <iframe
              src="https://www.z-anatomy.com/"
              title="Modelo 3D do Cérebro — Z-Anatomy"
              style={{
                width: "100%", height: "100%", border: "none",
                opacity: iframeReady ? 1 : 0, transition: "opacity 0.3s",
              }}
              loading="lazy"
              onLoad={() => setIframeReady(true)}
            />
          </div>
          <div style={{ fontSize: 9, color: textDim, marginTop: 4, textAlign: "center", fontFamily: font }}>
            Modelo 3D interativo — Z-Anatomy (CC BY-SA 4.0)
          </div>
        </div>

        {/* Menu lateral de zonas */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, minWidth: 190 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: textMuted, marginBottom: 4 }}>
            Zonas Cerebrais — clique para marcar
          </div>
          {BRAIN_ZONES.map(z => {
            const s = getZoneState(z.id);
            const col = zoneColor(z.id);
            return (
              <button key={z.id} onClick={() => toggleZone(z.id)}
                onMouseEnter={() => setHovered(z.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: s ? `${col}10` : "transparent",
                  border: `1px solid ${s ? col : "transparent"}`,
                  color: s ? col : textMuted,
                  borderRadius: 6, padding: "5px 10px", fontSize: 11,
                  fontWeight: s ? 700 : 400,
                  cursor: "pointer", fontFamily: font, transition: "all 0.12s",
                  textAlign: "left", lineHeight: 1.4,
                }}>
                <span style={{ minWidth: 16, fontWeight: 800, fontSize: 12, color: s ? col : textDim }}>
                  {s ? (s.afetado === false ? "✓" : "✗") : "○"}
                </span>
                <span style={{ fontWeight: 600 }}>{z.label}</span>
                <span style={{ color: textDim, fontSize: 10, marginLeft: "auto", opacity: 0.7 }}>{z.desc}</span>
              </button>
            );
          })}
          {value.length > 0 && (
            <div style={{ marginTop: 6, fontSize: 10, color: textMuted, fontFamily: font }}>
              {value.filter(v => v.afetado !== false).length} afetada(s) · {value.filter(v => v.afetado === false).length} preservada(s)
            </div>
          )}
          <div style={{ marginTop: 4, display: "flex", gap: 8, fontSize: 9, color: textDim, fontFamily: font }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 8, height: 8, background: red, borderRadius: 1 }} /> Afetada
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 8, height: 8, background: green, borderRadius: 1 }} /> Preservada
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
