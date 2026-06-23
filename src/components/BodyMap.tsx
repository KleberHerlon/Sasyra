import React, { useState, useMemo } from "react";
// @ts-ignore
import Body from "react-muscle-highlighter";
import useMediaQuery from "@/hooks/useMediaQuery";

interface BodyMapProps {
  value: string[];
  onChange: (val: string[]) => void;
  sex?: string;
}

const C_BODY = {
  green: "var(--green)",
  surface: "var(--surface)",
  card: "var(--card)",
  border: "var(--border)",
  textMuted: "var(--textMuted)",
};

const SVG_W = 724;
const SVG_H = 1448;

const PART_SLUG: Record<string, { F?: string; B?: string; side?: string }> = {
  "Cabeça":      { F: "head",        B: "head" },
  "Cervical":    { F: "neck",        B: "neck" },
  "Trapézio":    { F: "trapezius",   B: "trapezius" },
  "Torácica":    { B: "upper-back" },
  "Peitoral":    { F: "chest" },
  "Abdômen":     { F: "abs" },
  "Lombar":      { B: "lower-back" },
  "Sacroilíaca": { F: "obliques" },
  "Glúteos":     { B: "gluteal" },
  "Ombro D":     { F: "deltoids",    B: "deltoids",    side: "right" },
  "Ombro E":     { F: "deltoids",    B: "deltoids",    side: "left" },
  "Braço D":     { F: "biceps",      B: "triceps",     side: "right" },
  "Braço E":     { F: "biceps",      B: "triceps",     side: "left" },
  "Antebraço D": { F: "forearm",     B: "forearm",     side: "right" },
  "Antebraço E": { F: "forearm",     B: "forearm",     side: "left" },
  "Mão D":       { F: "hands",       B: "hands",       side: "right" },
  "Mão E":       { F: "hands",       B: "hands",       side: "left" },
  "Quadril D":   { F: "quadriceps",  B: "hamstring",   side: "right" },
  "Quadril E":   { F: "quadriceps",  B: "hamstring",   side: "left" },
  "Adutores D":  { F: "adductors",   B: "adductors",   side: "right" },
  "Adutores E":  { F: "adductors",   B: "adductors",   side: "left" },
  "Joelho D":    { F: "knees",       B: "calves",      side: "right" },
  "Joelho E":    { F: "knees",       B: "calves",      side: "left" },
  "Perna D":     { F: "tibialis",                    side: "right" },
  "Perna E":     { F: "tibialis",                    side: "left" },
  "Tornozelo D": { F: "ankles",      B: "ankles",      side: "right" },
  "Tornozelo E": { F: "ankles",      B: "ankles",      side: "left" },
  "Pé D":        { F: "feet",        B: "feet",        side: "right" },
  "Pé E":        { F: "feet",        B: "feet",        side: "left" },
};

const LABEL_POS: Record<string, { F?: [number, number]; B?: [number, number] }> = {
  "Cabeça":      { F: [362, 180], B: [1086, 180] },
  "Cervical":    { F: [362, 270], B: [1086, 270] },
  "Trapézio":    { F: [362, 305], B: [1086, 305] },
  "Torácica":    { B: [1086, 420] },
  "Peitoral":    { F: [362, 355] },
  "Abdômen":     { F: [362, 510] },
  "Lombar":      { B: [1086, 550] },
  "Sacroilíaca": { F: [362, 460] },
  "Glúteos":     { B: [1086, 720] },
  "Ombro D":     { F: [450, 340], B: [1228, 340] },
  "Ombro E":     { F: [275, 340], B: [980, 340] },
  "Braço D":     { F: [525, 490], B: [1210, 500] },
  "Braço E":     { F: [200, 490], B: [930, 500] },
  "Antebraço D": { F: [595, 680], B: [1318, 650] },
  "Antebraço E": { F: [130, 680], B: [878, 650] },
  "Mão D":       { F: [670, 720], B: [1400, 690] },
  "Mão E":       { F: [55, 720],  B: [790, 690]  },
  "Quadril D":   { F: [425, 840], B: [1160, 850] },
  "Quadril E":   { F: [300, 840], B: [1000, 850] },
  "Adutores D":  { F: [425, 920], B: [1160, 950] },
  "Adutores E":  { F: [300, 920], B: [1000, 950] },
  "Joelho D":    { F: [435, 1008], B: [1170, 1100] },
  "Joelho E":    { F: [290, 1008], B: [990, 1100] },
  "Perna D":     { F: [435, 1130] },
  "Perna E":     { F: [290, 1130] },
  "Tornozelo D": { F: [430, 1250], B: [1150, 1260] },
  "Tornozelo E": { F: [295, 1250], B: [998, 1260] },
  "Pé D":        { F: [450, 1340], B: [1155, 1340] },
  "Pé E":        { F: [275, 1340], B: [970, 1340] },
};

const BODY_DETAILS: Record<string, { joint: string; muscles: string }> = {
  "Cabeça":      { joint: "Crânio, Articulação Temporomandibular (ATM)", muscles: "Músculos da mastigação (Masseter, Temporal, Pterigóideos), Músculos da face, Músculos do crânio" },
  "Cervical":    { joint: "Coluna Cervical (C1-C7)", muscles: "Esternocleidomastóideo, Trapézio descendente, Escalenos, Esplênios, Paravertebrais cervicais" },
  "Trapézio":    { joint: "Cintura escapular (escápula e clavícula)", muscles: "Trapézio (descendente, transverso e ascendente)" },
  "Torácica":    { joint: "Coluna Torácica (T1-T12)", muscles: "Paravertebrais torácicos, Romboides, Latíssimo do dorso, Intercostais" },
  "Peitoral":    { joint: "Articulação Esternocostal, Costovertebral", muscles: "Peitoral maior, Peitoral menor, Serrátil anterior" },
  "Abdômen":     { joint: "Parede abdominal", muscles: "Reto abdominal, Oblíquo externo, Oblíquo interno, Transverso abdominal" },
  "Lombar":      { joint: "Coluna Lombar (L1-L5)", muscles: "Paravertebrais lombares, Quadrado lombar, Multífidos, Iliopsoas" },
  "Sacroilíaca": { joint: "Articulação Sacroilíaca", muscles: "Glúteo máximo, Piriforme, Iliopsoas, Obturadores, Gêmeos" },
  "Glúteos":     { joint: "Articulação Coxofemoral (posterior)", muscles: "Glúteo máximo, Glúteo médio, Glúteo mínimo, Piriforme" },
  "Ombro D":     { joint: "Glenoumeral, Acromioclavicular, Esternoclavicular", muscles: "Supraespinhal, Infraespinhal, Subescapular, Redondo menor (Manguito Rotador), Deltoide, Bíceps braquial" },
  "Ombro E":     { joint: "Glenoumeral, Acromioclavicular, Esternoclavicular", muscles: "Supraespinhal, Infraespinhal, Subescapular, Redondo menor (Manguito Rotador), Deltoide, Bíceps braquial" },
  "Braço D":     { joint: "Articulação Úmero-Ulnar, Úmero-Radial (Cotovelo)", muscles: "Bíceps braquial, Tríceps braquial, Braquial, Braquiorradial" },
  "Braço E":     { joint: "Articulação Úmero-Ulnar, Úmero-Radial (Cotovelo)", muscles: "Bíceps braquial, Tríceps braquial, Braquial, Braquiorradial" },
  "Antebraço D": { joint: "Articulação Radiocárpica, Médio-cárpica (Punho)", muscles: "Flexores radial/ulnar do carpo, Extensores radial/ulnar do carpo, Palmar longo, Pronadores, Supinadores" },
  "Antebraço E": { joint: "Articulação Radiocárpica, Médio-cárpica (Punho)", muscles: "Flexores radial/ulnar do carpo, Extensores radial/ulnar do carpo, Palmar longo, Pronadores, Supinadores" },
  "Mão D":       { joint: "Articulações Carpometacárpicas, Metacarpo-falângicas, Interfalângicas", muscles: "Tenares, Hipotenares, Interósseos, Lombricais, Flexores/extensores dos dedos" },
  "Mão E":       { joint: "Articulações Carpometacárpicas, Metacarpo-falângicas, Interfalângicas", muscles: "Tenares, Hipotenares, Interósseos, Lombricais, Flexores/extensores dos dedos" },
  "Quadril D":   { joint: "Articulação Coxofemoral", muscles: "Iliopsoas, Glúteo máximo, Glúteo médio, Glúteo mínimo, Piriforme, Obturadores, Quadrado femoral, Tensor da fáscia lata" },
  "Quadril E":   { joint: "Articulação Coxofemoral", muscles: "Iliopsoas, Glúteo máximo, Glúteo médio, Glúteo mínimo, Piriforme, Obturadores, Quadrado femoral, Tensor da fáscia lata" },
  "Adutores D":  { joint: "Articulação Coxofemoral (compartimento medial)", muscles: "Adutor longo, Adutor curto, Adutor magno, Pectíneo, Grácil" },
  "Adutores E":  { joint: "Articulação Coxofemoral (compartimento medial)", muscles: "Adutor longo, Adutor curto, Adutor magno, Pectíneo, Grácil" },
  "Joelho D":    { joint: "Articulação Tibiofemoral, Patelofemoral", muscles: "Quadríceps femoral, Isquiotibiais (Semitendíneo, Semimembranáceo, Bíceps femoral), Pata de Ganso, Gastrocnêmio, Poplíteo" },
  "Joelho E":    { joint: "Articulação Tibiofemoral, Patelofemoral", muscles: "Quadríceps femoral, Isquiotibiais (Semitendíneo, Semimembranáceo, Bíceps femoral), Pata de Ganso, Gastrocnêmio, Poplíteo" },
  "Perna D":     { joint: "Articulação Talocrural, Tibiofibular", muscles: "Tibial anterior, Extensor longo dos dedos, Fibular longo, Fibular curto, Sóleo" },
  "Perna E":     { joint: "Articulação Talocrural, Tibiofibular", muscles: "Tibial anterior, Extensor longo dos dedos, Fibular longo, Fibular curto, Sóleo" },
  "Tornozelo D": { joint: "Articulação Talocrural, Subtalar", muscles: "Tibial anterior, Fibulares, Gastrocnêmio, Sóleo, Tibial posterior, Flexor longo dos dedos" },
  "Tornozelo E": { joint: "Articulação Talocrural, Subtalar", muscles: "Tibial anterior, Fibulares, Gastrocnêmio, Sóleo, Tibial posterior, Flexor longo dos dedos" },
  "Pé D":        { joint: "Subtalar, Mediotársicas, Metatarsofalângicas, Interfalângicas", muscles: "Flexor curto dos dedos, Extensor curto dos dedos, Abdutor do hálux, Adutor do hálux, Interósseos, Lombricais, Quadrado plantar" },
  "Pé E":        { joint: "Subtalar, Mediotársicas, Metatarsofalângicas, Interfalângicas", muscles: "Flexor curto dos dedos, Extensor curto dos dedos, Abdutor do hálux, Adutor do hálux, Interósseos, Lombricais, Quadrado plantar" },
};

const SLUG_REV: Record<string, string> = {};
Object.entries(PART_SLUG).forEach(([id, m]) => {
  if (m.F) SLUG_REV[`${m.F}|${m.side || ""}|F`] = id;
  if (m.B) SLUG_REV[`${m.B}|${m.side || ""}|B`] = id;
});

export default function BodyMap({ value = [], onChange, sex }: BodyMapProps) {
  const [view, setView] = useState<"front" | "back">("front");
  const kv = view === "front" ? "F" : "B";
  const isMobile = useMediaQuery("(max-width:767px)");
  const bodyScale = isMobile ? 0.9 : 1.4;

  const selectedData = useMemo(() => {
    const groups: Record<string, { sides: Set<string> }> = {};
    value.forEach((id) => {
      const m = PART_SLUG[id];
      if (!m) return;
      const slug = kv === "F" ? m.F : m.B;
      if (!slug) return;
      if (!groups[slug]) groups[slug] = { sides: new Set() };
      if (m.side) groups[slug].sides.add(m.side);
    });
    return Object.entries(groups).map(([slug, g]) => ({
      slug,
      color: C_BODY.green,
      ...(g.sides.size === 1 ? { side: [...g.sides][0] } : {}),
    }));
  }, [value, kv]);

  const handlePartPress = (_part: any, side: string) => {
    const slug = _part?.slug;
    if (!slug) return;
    let key = `${slug}|${side || ""}|${kv}`;
    let id = SLUG_REV[key];
    if (!id) {
      key = `${slug}||${kv}`;
      id = SLUG_REV[key];
    }
    if (id) {
      const sel = value.includes(id);
      onChange(sel ? value.filter((x) => x !== id) : [...value, id]);
    }
  };

  const tglStyle = (v: "front" | "back") => ({
    background: view === v ? "rgba(var(--green-rgb), 0.125)" : "transparent",
    border: view === v ? "1px solid rgba(var(--green-rgb), 0.375)" : `1px solid ${C_BODY.border}`,
    borderRadius: 6,
    padding: "4px 14px",
    fontSize: 11,
    fontWeight: view === v ? 700 : 400,
    color: view === v ? "var(--green)" : C_BODY.textMuted,
    cursor: "pointer",
    fontFamily: "'Inter','Segoe UI',sans-serif",
  });

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    transform: "translate(-50%,-50%)",
    background: "rgba(0,0,0,0.8)",
    color: "var(--green)",
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 4,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    fontFamily: "'Inter','Segoe UI',sans-serif",
    zIndex: 10,
    border: "1px solid rgba(var(--green-rgb), 0.3)",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 6 }}>
        <button onClick={() => setView("front")} style={tglStyle("front")} type="button">
          Frente
        </button>
        <button onClick={() => setView("back")} style={tglStyle("back")} type="button">
          Costas
        </button>
      </div>
      <div style={{ position: "relative", display: "inline-block" }}>
        <Body
          data={selectedData}
          side={view}
          gender={sex === "Feminino" ? "female" : "male"}
          onBodyPartPress={handlePartPress}
          defaultFill="var(--bodyFill)"
          defaultStroke="var(--bodyStroke)"
          defaultStrokeWidth={0.5}
          scale={bodyScale}
          border="#3D5675"
        />
        {value.map((id) => {
          const pos = LABEL_POS[id];
          if (!pos) return null;
          const xy = kv === "F" ? pos.F : pos.B;
          if (!xy) return null;
          const [sx, sy] = xy;
          const left = kv === "F" ? (sx / SVG_W) * 100 : ((sx - SVG_W) / SVG_W) * 100;
          const top = (sy / SVG_H) * 100;
          return (
            <div key={id} style={{ ...labelStyle, left: left + "%", top: top + "%" }}>
              {id}
            </div>
          );
        })}
      </div>
      {value.length > 0 && (
        <div
          style={{
            marginTop: 10,
            textAlign: "left",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: "var(--textMuted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            Áreas selecionadas — articulação e músculos
          </div>
          {value.map((id) => {
            const d = BODY_DETAILS[id];
            if (!d) return null;
            return (
              <div
                key={id}
                style={{
                  marginBottom: 6,
                  padding: "6px 8px",
                  background: "var(--surface)",
                  borderRadius: 6,
                  border: "1px solid var(--borderLight)",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)" }}>{id}</div>
                <div style={{ fontSize: 10, color: "var(--textSub)", marginTop: 2 }}>
                  Articulação: {d.joint}
                </div>
                <div style={{ fontSize: 10, color: "var(--textMuted)", marginTop: 1 }}>
                  Músculos: {d.muscles}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ fontSize: 10, color: C_BODY.textMuted, marginTop: 6, lineHeight: 1.4 }}>
        Clique nas áreas do corpo para adicionar/remover
      </div>
    </div>
  );
}
