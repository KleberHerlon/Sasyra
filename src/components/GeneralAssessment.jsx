import { useState, useEffect } from "react";
import { BodyMap, TagSelect, SingleSelect } from "../components";

const YELLOW_FLAGS = [
  "Catastrofização", "Cinesiofobia", "Baixa autoeficácia", "Depressão/ansiedade",
  "Insatisfação no trabalho", "Baixa expectativa de recuperação",
  "Comportamento de doença", "Conflitos familiares", "Litígio/afastamento laboral",
  "Isolamento social", "Fadiga crônica", "Sobrecarga do cuidador",
];

export default function GeneralAssessment({ storageKey, studentId, colors, onSave }) {
  const [bodyPain, setBodyPain] = useState([]);
  const [caraterDor, setCaraterDor] = useState([]);
  const [tempoDor, setTempoDor] = useState("");
  const [melhora, setMelhora] = useState([]);
  const [piora, setPiora] = useState([]);
  const [yellowFlags, setYellowFlags] = useState([]);

  const sid = studentId;
  const storageKeyFull = `${storageKey}_general_${sid}`;
  const accent = colors.accent || colors.green || "#4ADE80";

  useEffect(() => {
    if (!sid) return;
    try {
      const raw = localStorage.getItem(storageKeyFull);
      if (raw) {
        const d = JSON.parse(raw);
        setBodyPain(d.bodyPain || []);
        setCaraterDor(d.caraterDor || []);
        setTempoDor(d.tempoDor || "");
        setMelhora(d.melhora || []);
        setPiora(d.piora || []);
        setYellowFlags(d.yellowFlags || []);
      }
    } catch {}
  }, [sid]);

  const persist = () => {
    const data = { bodyPain, caraterDor, tempoDor, melhora, piora, yellowFlags };
    try { localStorage.setItem(storageKeyFull, JSON.stringify(data)); } catch {}
    onSave?.();
  };

  const renderLabel = (text) => (
    <span style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:colors.textMuted, marginBottom:5 }}>{text}</span>
  );

  return (
    <div style={{ background:colors.card, border:`1px solid ${colors.border}`, borderRadius:14, padding:"20px 22px", marginBottom:14 }}>
      <h3 style={{ margin:"0 0 16px", fontSize:14, fontWeight:700, color:colors.text, display:"flex", alignItems:"center", gap:8 }}>
        <span>📋</span> Avaliação Geral
      </h3>

      <div style={{ marginBottom:14 }}>
        {renderLabel("Localização da dor")}
        <BodyMap value={bodyPain} onChange={setBodyPain} colors={{ mark:accent, ...colors }} />
      </div>

      <div style={{ marginBottom:12 }}>
        {renderLabel("Caráter da dor")}
        <TagSelect options={["Latejante","Queimação","Pontada","Pressão","Facada","Formigamento","Peso","Cãibra","Choques","Mecânica","Inflamatória","Neuropática"]}
          value={caraterDor} onChange={setCaraterDor} activeColor={accent} />
      </div>

      <div style={{ marginBottom:12 }}>
        {renderLabel("Duração / tempo de dor")}
        <SingleSelect options={[
          { value:"aguda", label:"<2 semanas (aguda)" },
          { value:"subaguda", label:"2-6 semanas (subaguda)" },
          { value:"subcronica", label:"6sem-3meses (subcrônica)" },
          { value:"cronica", label:"3-6 meses (crônica)" },
          { value:"cronica6_12", label:"6-12 meses" },
          { value:"cronica1_2", label:"1-2 anos" },
          { value:"cronica2+", label:">2 anos" },
        ]} value={tempoDor} onChange={setTempoDor} activeColor={accent} />
      </div>

      <div style={{ marginBottom:12, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div>
          {renderLabel("Fatores de melhora")}
          <TagSelect options={["Repouso","Calor","Frio","Movimento","Analgésico","Posição específica","Fisioterapia","Sono"]}
            value={melhora} onChange={setMelhora} activeColor={accent} />
        </div>
        <div>
          {renderLabel("Fatores de piora")}
          <TagSelect options={["Movimento","Carga","Postura estática","Frio","Stress emocional","Noite/repouso","Trabalho","Após atividade"]}
            value={piora} onChange={setPiora} activeColor={accent} />
        </div>
      </div>

      <div style={{ marginBottom:12 }}>
        {renderLabel("Yellow Flags (Fatores Psicossociais)")}
        <TagSelect options={YELLOW_FLAGS} value={yellowFlags} onChange={setYellowFlags} activeColor={colors.amber || "#FBBF24"} />
        {yellowFlags.length >= 3 && (
          <div style={{ background:colors.amberBg || "rgba(251,191,36,0.10)", borderRadius:8, padding:"8px 12px", fontSize:11, color:colors.amber || "#FBBF24", lineHeight:1.6, marginTop:6 }}>
            ⚠️ {yellowFlags.length} yellow flags. Considerar abordagem biopsicossocial (CFT, PNE).
          </div>
        )}
      </div>

      <button type="button" onClick={persist}
        style={{ background:accent, color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
        💾 Salvar Avaliação Geral
      </button>
    </div>
  );
}
