import { useState } from "react";

const BRAIN_ZONES = [
  { id: "frontal",    label: "Lobo Frontal",      desc: "Função executiva, movimento voluntário, linguagem (Broca)", views: ["lateral","superior","sagital"] },
  { id: "parietal",   label: "Lobo Parietal",     desc: "Sensibilidade tátil, propriocepção, orientação espacial", views: ["lateral","superior"] },
  { id: "temporal",   label: "Lobo Temporal",     desc: "Audição, memória, compreensão da linguagem (Wernicke)", views: ["lateral"] },
  { id: "occipital",  label: "Lobo Occipital",    desc: "Processamento visual primário", views: ["lateral"] },
  { id: "cerebelo",   label: "Cerebelo",          desc: "Coordenação motora, equilíbrio, tônus postural", views: ["lateral","sagital"] },
  { id: "tronco",     label: "Tronco Encefálico", desc: "Funções vitais (respiração, FC), nervos cranianos", views: ["lateral","sagital"] },
  { id: "motor_ctx",  label: "Córtex Motor (M1)", desc: "Controle motor voluntário — homúnculo motor", views: ["lateral"] },
  { id: "sens_ctx",   label: "Córtex Sensorial",  desc: "Sensibilidade somática — homúnculo sensorial", views: ["lateral"] },
  { id: "broca",      label: "Área de Broca",     desc: "Produção da fala (hemisfério dominante)", views: ["lateral"] },
  { id: "wernicke",   label: "Área de Wernicke",  desc: "Compreensão da linguagem (hemisfério dominante)", views: ["lateral"] },
  { id: "caloso",     label: "Corpo Caloso",      desc: "Conexão inter-hemisférica — transferência de informação", views: ["sagital"] },
  { id: "talamo",     label: "Tálamo",            desc: "Estação de retransmissão sensorial e motora", views: ["sagital"] },
];

const VIEWS = ["lateral", "superior", "sagital"];
const VIEW_LABELS = { lateral: "Vista Lateral", superior: "Vista Superior", sagital: "Corte Sagital" };

export default function BrainMap({ value = [], onChange, colors }) {
  const C = colors || {};
  const surface = C.surface || "#111822";
  const border = C.border || "#1F2E45";
  const card = C.card || "#19243A";
  const text = C.text || "#DDE6F0";
  const textMuted = C.textMuted || "#5E7A96";
  const textDim = C.textDim || "#364D62";
  const accent = C.accent || "#FBBF24";
  const green = C.green || "#4ADE80";
  const red = C.red || "#F87171";
  const blue = C.blue || "#60A5FA";
  const font = C.font || "'Inter','Segoe UI',system-ui,sans-serif";

  const [activeView, setActiveView] = useState("lateral");
  const [zoomed, setZoomed] = useState(false);
  const [hovered, setHovered] = useState(null);

  const getZoneState = (id) => {
    const entry = value.find(e => e.zona === id);
    return entry || null;
  };

  const toggleZone = (id) => {
    const exists = value.find(e => e.zona === id);
    if (exists) {
      onChange(value.filter(e => e.zona !== id));
    } else {
      onChange([...value, { zona: id, afetado: true }]);
    }
  };

  const zoneColor = (id) => {
    const s = getZoneState(id);
    if (!s) return textDim;
    return s.afetado === false ? green : red;
  };

  const visibleZones = BRAIN_ZONES.filter(z => z.views.includes(activeView));

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>
          Mapeamento Cerebral
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {VIEWS.map(v => (
            <button key={v} onClick={() => setActiveView(v)}
              style={{
                background: activeView === v ? `${accent}18` : "transparent",
                border: `1px solid ${activeView === v ? accent : border}`,
                color: activeView === v ? accent : textMuted,
                borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: activeView === v ? 700 : 400,
                cursor: "pointer", fontFamily: font, transition: "all 0.12s",
              }}>
              {VIEW_LABELS[v]}
            </button>
          ))}
          <button onClick={() => setZoomed(!zoomed)} title={zoomed ? "Reduzir" : "Ampliar"}
            style={{
              background: zoomed ? `${accent}22` : "transparent",
              border: `1px solid ${zoommed ? accent : border}`,
              color: zoomed ? accent : textMuted,
              borderRadius: 6, width: 28, height: 28, fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: font, lineHeight: 1, padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            {zoomed ? "−" : "+"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: zoomed ? "column" : "row", alignItems: "flex-start" }}>
        {/* Diagrama cerebral */}
        <div style={{ position: "relative", flexShrink: 0, width: zoomed ? "100%" : 320 }}>
          <svg viewBox="0 0 320 280" width="100%" height={zoomed ? 420 : 280} style={{ display: "block", background: `${border}20`, borderRadius: 8, border: `1px solid ${border}` }}>
            {/* ===== VISTA LATERAL ===== */}
            {activeView === "lateral" && <>
              {/* Cérebro — contorno lateral direito */}
              <path d="M60,40 Q90,16 150,20 Q200,18 240,40 Q270,60 270,110 Q272,160 250,190 Q220,220 180,220 L100,220 Q70,220 60,190 Q48,160 50,110 Q48,70 60,40Z"
                fill="#334155" stroke="#475569" strokeWidth="1.5" opacity="0.7"/>

              {/* Cerebelo */}
              <path d="M100,210 Q120,240 140,250 Q170,260 190,250 Q200,240 190,220 Q170,215 140,210 Q110,208 100,210Z"
                fill="#3B4A63" stroke="#475569" strokeWidth="1.2" opacity="0.65"/>

              {/* Tronco encefálico */}
              <path d="M140,230 Q145,250 142,265 Q140,275 138,280 L148,280 Q152,270 150,255 Q148,240 145,230Z"
                fill="#2D3A50" stroke="#475569" strokeWidth="1.2" opacity="0.6"/>

              {/* Fissura central (Rolando) — separa frontal do parietal */}
              <path d="M150,50 Q155,100 165,140 Q175,170 200,200" fill="none" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>

              {/* Sulco lateral (Sylvius) — separa temporal */}
              <path d="M180,120 Q220,130 250,150" fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="4,3" opacity="0.6"/>

              {/* Linha parieto-occipital */}
              <path d="M240,160 Q250,190 240,210" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>

              {/* Rótulos de lobos */}
              <text x="100" y="62" fontSize="10" fontWeight="700" fill="#94A3B8" fontFamily={font}>FRONTAL</text>
              <text x="185" y="80" fontSize="10" fontWeight="700" fill="#94A3B8" fontFamily={font}>PARIETAL</text>
              <text x="200" y="185" fontSize="10" fontWeight="700" fill="#94A3B8" fontFamily={font}>TEMPORAL</text>
              <text x="238" y="132" fontSize="10" fontWeight="700" fill="#94A3B8" fontFamily={font}>OCCIPITAL</text>
              <text x="148" y="248" fontSize="9" fontWeight="600" fill="#94A3B8" fontFamily={font}>Cerebelo</text>
              <text x="115" y="272" fontSize="8" fontWeight="600" fill="#94A3B8" fontFamily={font}>Tronco</text>

              {/* Área de Broca */}
              <ellipse cx="148" cy="130" rx="10" ry="7" fill={zoneColor("broca")} opacity="0.3" stroke={zoneColor("broca")} strokeWidth="1.5"/>
              <text x="148" y="133" fontSize="6" fontWeight="700" fill={zoneColor("broca")} fontFamily={font} textAnchor="middle">Broca</text>

              {/* Área de Wernicke */}
              <ellipse cx="210" cy="155" rx="10" ry="7" fill={zoneColor("wernicke")} opacity="0.3" stroke={zoneColor("wernicke")} strokeWidth="1.5"/>
              <text x="210" y="158" fontSize="6" fontWeight="700" fill={zoneColor("wernicke")} fontFamily={font} textAnchor="middle">Wernicke</text>

              {/* Córtex Motor */}
              <ellipse cx="142" cy="85" rx="12" ry="16" fill={zoneColor("motor_ctx")} opacity="0.25" stroke={zoneColor("motor_ctx")} strokeWidth="1.5"/>
              <text x="142" y="88" fontSize="6" fontWeight="700" fill={zoneColor("motor_ctx")} fontFamily={font} textAnchor="middle">M1</text>

              {/* Córtex Sensorial */}
              <ellipse cx="160" cy="98" rx="10" ry="14" fill={zoneColor("sens_ctx")} opacity="0.25" stroke={zoneColor("sens_ctx")} strokeWidth="1.5"/>
              <text x="160" y="101" fontSize="6" fontWeight="700" fill={zoneColor("sens_ctx")} fontFamily={font} textAnchor="middle">S1</text>

              {/* Zonas clicáveis */}
              {[
                { id:"frontal",    x:70,  y:48,  w:70,  h:55  },
                { id:"parietal",   x:155, y:65,  w:70,  h:65  },
                { id:"temporal",   x:180, y:145, w:65,  h:40  },
                { id:"occipital",  x:235, y:70,  w:30,  h:80  },
                { id:"cerebelo",   x:100, y:210, w:90,  h:40  },
                { id:"tronco",     x:135, y:240, w:20,  h:35  },
                { id:"motor_ctx",  x:130, y:70,  w:25,  h:30  },
                { id:"sens_ctx",   x:150, y:85,  w:25,  h:30  },
                { id:"broca",      x:138, y:123, w:20,  h:15  },
                { id:"wernicke",   x:200, y:148, w:20,  h:15  },
              ].map(z => {
                const s = getZoneState(z.id);
                const hov = hovered === z.id;
                const col = zoneColor(z.id);
                return (
                  <g key={z.id} style={{ cursor:"pointer" }}
                    onClick={() => toggleZone(z.id)}
                    onMouseEnter={() => setHovered(z.id)}
                    onMouseLeave={() => setHovered(null)}>
                    <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="4"
                      fill={s ? `${col}15` : (hov ? `${accent}08` : "transparent")}
                      stroke={s ? col : (hov ? `${accent}50` : "transparent")}
                      strokeWidth={s ? 1.5 : 1} />
                    {s && (
                      <text x={z.x + z.w/2} y={z.y + z.h/2 + 3} textAnchor="middle" fontSize="12" fontWeight="800"
                        fill={col}>{s.afetado === false ? "✓" : "✗"}</text>
                    )}
                  </g>
                );
              })}

              {/* Indicador de orientação */}
              <text x="10" y="20" fontSize="7" fill={textDim} fontFamily={font}>← Anterior</text>
              <text x="235" y="20" fontSize="7" fill={textDim} fontFamily={font}>Posterior →</text>
            </>}

            {/* ===== VISTA SUPERIOR ===== */}
            {activeView === "superior" && <>
              {/* Hemisférios vistos de cima */}
              <path d="M40,130 Q60,60 160,50 Q260,60 280,130 Q260,200 160,210 Q60,200 40,130Z"
                fill="#334155" stroke="#475569" strokeWidth="1.5" opacity="0.7"/>
              {/* Fissura longitudinal (inter-hemisférica) */}
              <line x1="160" y1="48" x2="160" y2="210" stroke="#64748B" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.6"/>

              {/* Sulco central */}
              <path d="M140,50 Q145,100 150,150 Q155,200 160,210" fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="4,3" opacity="0.5"/>
              <path d="M180,50 Q175,100 170,150 Q165,200 160,210" fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="4,3" opacity="0.5"/>

              <text x="90" y="100" fontSize="10" fontWeight="700" fill="#94A3B8" fontFamily={font} textAnchor="middle">FRONTAL</text>
              <text x="230" y="100" fontSize="10" fontWeight="700" fill="#94A3B8" fontFamily={font} textAnchor="middle">FRONTAL</text>
              <text x="90" y="165" fontSize="10" fontWeight="700" fill="#94A3B8" fontFamily={font} textAnchor="middle">PARIETAL</text>
              <text x="230" y="165" fontSize="10" fontWeight="700" fill="#94A3B8" fontFamily={font} textAnchor="middle">PARIETAL</text>

              <text x="10" y="20" fontSize="7" fill={textDim} fontFamily={font}>← Anterior</text>
              <text x="245" y="20" fontSize="7" fill={textDim} fontFamily={font}>Posterior →</text>

              {/* Zonas clicáveis */}
              {[
                { id:"frontal",  x:50,  y:55,  w:95,  h:80  },
                { id:"frontal",  x:175, y:55,  w:95,  h:80  },
                { id:"parietal", x:50,  y:140, w:95,  h:65  },
                { id:"parietal", x:175, y:140, w:95,  h:65  },
              ].map(z => {
                const s = getZoneState(z.id);
                const hov = hovered === z.id;
                const col = zoneColor(z.id);
                return (
                  <g key={`${z.id}-${z.x}`} style={{ cursor:"pointer" }}
                    onClick={() => toggleZone(z.id)}
                    onMouseEnter={() => setHovered(z.id)}
                    onMouseLeave={() => setHovered(null)}>
                    <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="4"
                      fill={s ? `${col}15` : (hov ? `${accent}08` : "transparent")}
                      stroke={s ? col : (hov ? `${accent}50` : "transparent")}
                      strokeWidth={s ? 1.5 : 1} />
                  </g>
                );
              })}
            </>}

            {/* ===== CORTE SAGITAL ===== */}
            {activeView === "sagital" && <>
              {/* Hemisfério cerebral (metade direita) */}
              <path d="M60,40 Q90,20 150,22 Q200,20 230,40 Q250,60 250,90 Q255,130 240,160 Q220,190 190,200 L130,210 Q100,210 80,200 Q60,185 55,160 Q48,130 50,90 Q52,60 60,40Z"
                fill="#334155" stroke="#475569" strokeWidth="1.5" opacity="0.7"/>

              {/* Corpo caloso (arco central) */}
              <path d="M110,78 Q160,60 200,80 Q230,92 250,100" fill="none" stroke="#94A3B8" strokeWidth="3" opacity="0.6"/>
              <text x="170" y="70" fontSize="7" fontWeight="700" fill="#94A3B8" fontFamily={font} textAnchor="middle">Corpo Caloso</text>

              {/* Tálamo */}
              <ellipse cx="170" cy="115" rx="18" ry="12" fill={zoneColor("talamo")} opacity="0.25" stroke={zoneColor("talamo")} strokeWidth="1.5"/>
              <text x="170" y="118" fontSize="7" fontWeight="700" fill={zoneColor("talamo")} fontFamily={font} textAnchor="middle">Tálamo</text>

              {/* Tronco encefálico (mesencéfalo + ponte + bulbo) */}
              <path d="M170,195 L168,210 Q164,240 160,270 Q158,280 156,285 L174,285 Q172,270 166,240 Q162,210 168,195Z"
                fill="#2D3A50" stroke="#475569" strokeWidth="1.2" opacity="0.6"/>

              {/* Cerebelo (corte sagital — árvore da vida) */}
              <path d="M130,200 Q120,220 125,240 Q132,255 145,258 Q158,255 162,240 Q160,220 155,200 Q140,195 130,200Z"
                fill="#3B4A63" stroke="#475569" strokeWidth="1.2" opacity="0.65"/>
              {/* Árvore da vida (folia do cerebelo) */}
              <path d="M145,210 L135,235 M145,210 L150,240 M145,215 L138,225" fill="none" stroke="#64748B" strokeWidth="0.8" opacity="0.5"/>

              {/* Ventrículos */}
              <path d="M150,100 L165,105 L170,120 L155,135 Z" fill="none" stroke="#64748B" strokeWidth="1" opacity="0.35"/>

              <text x="90" y="55" fontSize="10" fontWeight="700" fill="#94A3B8" fontFamily={font}>FRONTAL</text>
              <text x="195" y="90" fontSize="9" fontWeight="700" fill="#94A3B8" fontFamily={font}>PARIETAL</text>
              <text x="220" y="145" fontSize="9" fontWeight="700" fill="#94A3B8" fontFamily={font}>OCCIPITAL</text>
              <text x="145" y="252" fontSize="9" fontWeight="600" fill="#94A3B8" fontFamily={font}>Cerebelo</text>
              <text x="140" y="278" fontSize="8" fontWeight="600" fill="#94A3B8" fontFamily={font}>Tronco</text>

              <text x="10" y="20" fontSize="7" fill={textDim} fontFamily={font}>← Anterior</text>
              <text x="235" y="20" fontSize="7" fill={textDim} fontFamily={font}>Posterior →</text>

              {/* Zonas clicáveis sagital */}
              {[
                { id:"frontal",    x:60,  y:45,  w:80,  h:45  },
                { id:"parietal",   x:145, y:55,  w:70,  h:45  },
                { id:"occipital",  x:210, y:95,  w:35,  h:70  },
                { id:"cerebelo",   x:125, y:200, w:40,  h:50  },
                { id:"tronco",     x:155, y:200, w:25,  h:80  },
                { id:"caloso",     x:115, y:68,  w:125, h:22  },
                { id:"talamo",     x:152, y:105, w:35,  h:25  },
              ].map(z => {
                const s = getZoneState(z.id);
                const hov = hovered === z.id;
                const col = zoneColor(z.id);
                return (
                  <g key={z.id} style={{ cursor:"pointer" }}
                    onClick={() => toggleZone(z.id)}
                    onMouseEnter={() => setHovered(z.id)}
                    onMouseLeave={() => setHovered(null)}>
                    <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="4"
                      fill={s ? `${col}15` : (hov ? `${accent}08` : "transparent")}
                      stroke={s ? col : (hov ? `${accent}50` : "transparent")}
                      strokeWidth={s ? 1.5 : 1} />
                    {s && (
                      <text x={z.x + z.w/2} y={z.y + z.h/2 + 3} textAnchor="middle" fontSize="12" fontWeight="800"
                        fill={col}>{s.afetado === false ? "✓" : "✗"}</text>
                    )}
                  </g>
                );
              })}
            </>}
          </svg>
        </div>

        {/* Lista de zonas à direita */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: textMuted, marginBottom: 2 }}>
            Zonas visíveis ({activeView}) — clique para marcar afetada
          </div>
          {visibleZones.map(z => {
            const s = getZoneState(z.id);
            const col = zoneColor(z.id);
            const hov = hovered === z.id;
            return (
              <button key={z.id} onClick={() => toggleZone(z.id)}
                onMouseEnter={() => setHovered(z.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: s ? `${col}10` : (hov ? `${accent}06` : "transparent"),
                  border: `1px solid ${s ? col : (hov ? `${accent}30` : "transparent")}`,
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
              {value.filter(v => v.afetado !== false).length} região(ões) afetada(s) |{" "}
              {value.filter(v => v.afetado === false).length} preservada(s)
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
