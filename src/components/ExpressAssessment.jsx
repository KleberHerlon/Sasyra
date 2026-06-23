import { useState, useEffect } from "react";
import { AudioField, BodyMap, useMediaQuery } from "../components";
import { REGIAO_CIF, PATOLOGIA_ESCALAS, HONORARIO_DEFAULT } from "../data/expressDefaults";
import { EVIDENCE } from "../data/evidence";
import { detectKB, detectLocalDor } from "../utils/clinicalDetection";

const C = {
  bg:"var(--bg)",surface:"var(--surface)",card:"var(--card)",cardAlt:"var(--cardAlt)",
  border:"var(--border)",borderLight:"var(--borderLight)",green:"var(--green)",greenDim:"var(--greenDim)",
  greenDeep:"var(--greenDeep)",greenBg:"var(--greenBg)",greenBgHov:"var(--greenBgHov)",
  amber:"var(--amber)",amberBg:"var(--amberBg)",red:"var(--red)",redBg:"var(--redBg)",
  blue:"var(--blue)",blueBg:"var(--blueBg)",purple:"var(--purple)",purpleBg:"var(--purpleBg)",
  text:"var(--text)",textSub:"var(--textSub)",textMuted:"var(--textMuted)",textDim:"var(--textDim)",white:"var(--white)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";
const inp = (e={})=>({width:"100%",boxSizing:"border-box",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:"9px 12px",outline:"none",fontFamily:F,...e});
const lbl = (e={})=>({display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:5,...e});
const card = (e={})=>({background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14,...e});

const REGIOES = ["Cabeça","Cervical","Torácica","Lombar","Sacroilíaca","Ombro","Braço","Antebraço","Mão","Quadril","Joelho","Perna","Tornozelo","Pé"];
const RED_FLAGS_LIST = [
  "Parestesia em sela (anestesia perineal)",
  "Perda de controle esfincteriano (bexiga/intestinal)",
  "Perda de força súbita em MMSS ou MMII",
  "Dor noturna que acorda o paciente (não mecânica)",
  "Febre associada / suspeita de infecção",
  "Perda de peso inexplicada",
  "Fraturas por estresse / osteoporose suspeita",
  "Sinais de cauda equina (bexiga neurogênica)",
];

export default function ExpressAssessment({
  pt, up, queixa, setQueixa, setQueixaKey,
  localDor, setLocalDor, setRegiao,
  impressaoClinica, setImpressaoClinica,
  onSave, onCancel,
}) {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [vital, setVital] = useState({ spo2:"", glucose:"", heartRate:"", bpSystolic:"", bpDiastolic:"" });
  const [redFlags, setRedFlags] = useState([]);
  const [laterality, setLaterality] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showVitalAlert, setShowVitalAlert] = useState(false);

  const toggleRedFlag = (f) => setRedFlags(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]);

  const updateVital = (k, v) => {
    setVital(p => ({ ...p, [k]: v }));
  };

  useEffect(() => {
    const spo2 = parseFloat(vital.spo2);
    const glucose = parseFloat(vital.glucose);
    if ((spo2 && spo2 < 92) || (glucose && (glucose < 70 || glucose > 250))) {
      setShowVitalAlert(true);
    } else {
      setShowVitalAlert(false);
    }
  }, [vital.spo2, vital.glucose]);

  const handleBodyMapChange = (regions) => {
    setLocalDor(regions);
  };

  // ── Auto-detection from queixa text ─────────────────────────────────────
  const handleQueixaChange = (v) => {
    const t = typeof v === "function" ? v(queixa) : v;
    setQueixa(t);
    setQueixaKey(t);
    // Auto-detect body regions from text and update BodyMap
    const detected = detectLocalDor(t);
    if (detected.length > 0) setLocalDor(detected);
  };

  // ── Derive metadata from queixa for save ────────────────────────────────
  const patologiaSlug = queixa ? detectKB(queixa) : null;
  const evidenceBlock = patologiaSlug ? EVIDENCE[patologiaSlug] : null;
  const cifSuggestions = evidenceBlock?.cif || [];
  const recommendedScales = patologiaSlug ? (PATOLOGIA_ESCALAS[patologiaSlug] || evidenceBlock?.escalas || []) : [];

  const handleSave = () => {
    const regiaoBase = REGIOES.find(r => localDor.some(d => d.includes(r))) || null;
    const cifCodes = [];
    if (patologiaSlug && evidenceBlock) {
      cifCodes.push(...evidenceBlock.cif);
    }
    if (regiaoBase && REGIAO_CIF[regiaoBase]) {
      for (const code of REGIAO_CIF[regiaoBase]) {
        if (!cifCodes.includes(code)) cifCodes.push(code);
      }
    }
    onSave({
      queixa,
      localDor,
      regiao: regiaoBase,
      laterality,
      vitalSigns: vital,
      redFlags,
      impressaoClinica,
      patologiaSlug,
      autoCIF: cifCodes.map(code => ({ code, qualifier: null, status: "rascunho" })),
      recommendedScales,
      honorario: HONORARIO_DEFAULT,
      isExpress: true,
      status: "Incompleto/Triagem",
    });
  };

  const canSave = queixa.trim().length > 0;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "8px" : "12px 16px 40px" }}>

      {/* Header badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <span style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amber}50`, borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: 5 }}>
          ⚡ MODO EXPRESS
        </span>
        <span style={{ fontSize: 12, color: C.textMuted }}>Atendimento rápido · campos essenciais</span>
      </div>

      {/* ── 1. Basic ID ─────────────────────────────────────────────────── */}
      <div style={card()}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: "0.1em", marginBottom: 12 }}>📋 IDENTIFICAÇÃO</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          <div>
            <span style={lbl()}>Nome completo</span>
            <input value={pt.nome} onChange={e => up("nome", e.target.value)} placeholder="Nome do paciente" style={inp()} />
          </div>
          <div>
            <span style={lbl()}>Telefone</span>
            <input value={pt.telefone} onChange={e => up("telefone", e.target.value)} placeholder="(00) 00000-0000" style={inp()} />
          </div>
        </div>
      </div>

      {/* ── 2. Main Complaint ─────────────────────────────────────────────*/}
      <div style={card()}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: "0.1em", marginBottom: 8 }}>📝 QUEIXA PRINCIPAL</div>
        <AudioField value={queixa} onChange={handleQueixaChange} placeholder="Ditado por voz: 'Lombalgia com irradiação para perna direita há 2 dias...'" rows={2} />
        {patologiaSlug && (
          <div style={{ marginTop: 8, background: C.greenBg, border: `1px solid ${C.green}30`, borderRadius: 8, padding: "8px 12px" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.green }}>✓ Patologia detectada: <strong>{patologiaSlug}</strong></span>
            {recommendedScales.length > 0 && (
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>
                Escalas sugeridas: {recommendedScales.join(", ")}
              </div>
            )}
            {cifSuggestions.length > 0 && (
              <div style={{ fontSize: 10, color: C.textSub, marginTop: 2 }}>
                CIF: {cifSuggestions.join(" · ")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. Vital Signs Panel ──────────────────────────────────────────*/}
      <div style={card()}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: "0.1em", marginBottom: 12 }}>❤️ SINAIS VITAIS / MONITORIZAÇÃO RÁPIDA</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10 }}>
          <div>
            <span style={lbl()}>Oximetria (SpO₂ %)</span>
            <input type="number" min="0" max="100" value={vital.spo2} onChange={e => updateVital("spo2", e.target.value)} placeholder="%" style={{...inp(), ...(vital.spo2 && parseFloat(vital.spo2) < 92 ? {borderColor:C.red, color:C.red} : {})}} />
          </div>
          <div>
            <span style={lbl()}>Glicemia (mg/dL)</span>
            <input type="number" min="0" max="600" value={vital.glucose} onChange={e => updateVital("glucose", e.target.value)} placeholder="mg/dL" style={{...inp(), ...(vital.glucose && (parseFloat(vital.glucose) < 70 || parseFloat(vital.glucose) > 250) ? {borderColor:C.red, color:C.red} : {})}} />
          </div>
          <div>
            <span style={lbl()}>Frequência cardíaca (BPM)</span>
            <input type="number" min="0" max="250" value={vital.heartRate} onChange={e => updateVital("heartRate", e.target.value)} placeholder="BPM" style={inp()} />
          </div>
          <div>
            <span style={lbl()}>PA Sistólica (mmHg)</span>
            <input type="number" min="0" max="300" value={vital.bpSystolic} onChange={e => updateVital("bpSystolic", e.target.value)} placeholder="Ex: 120" style={inp()} />
          </div>
          <div>
            <span style={lbl()}>PA Diastólica (mmHg)</span>
            <input type="number" min="0" max="200" value={vital.bpDiastolic} onChange={e => updateVital("bpDiastolic", e.target.value)} placeholder="Ex: 80" style={inp()} />
          </div>
        </div>

        {showVitalAlert && (
          <div style={{ marginTop: 12, background: C.redBg, border: `1.5px solid ${C.red}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🚨</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.red }}>Atenção: Valores clínicos fora da faixa de segurança para exercício físico</div>
              <ul style={{ margin: "4px 0 0 16px", fontSize: 12, color: C.red, lineHeight: 1.6 }}>
                {vital.spo2 && parseFloat(vital.spo2) < 92 && <li>SpO₂ {vital.spo2}% — abaixo de 92% (risco de hipoxemia)</li>}
                {vital.glucose && parseFloat(vital.glucose) < 70 && <li>Glicemia {vital.glucose} mg/dL — abaixo de 70 mg/dL (risco de hipoglicemia)</li>}
                {vital.glucose && parseFloat(vital.glucose) > 250 && <li>Glicemia {vital.glucose} mg/dL — acima de 250 mg/dL (risco de hiperglicemia)</li>}
              </ul>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Reavalie antes de iniciar qualquer intervenção ativa. Considere encaminhamento médico se persistir.</div>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. Simplified BodyMap ─────────────────────────────────────────*/}
      <div style={card()}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: "0.1em", marginBottom: 8 }}>🦵 LOCAL DA DOR (BodyMap)</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>Clique nas regiões anatômicas no mapa abaixo</div>

        {/* Auto-detected region tags */}
        {localDor.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
            {localDor.map(r => (
              <span key={r} style={{ fontSize:10, color:C.green, background:C.greenBg, border:`1px solid ${C.green}30`, borderRadius:4, padding:"1px 8px", fontWeight:700 }}>
                ✓ {r}
              </span>
            ))}
          </div>
        )}

        <BodyMap value={localDor} onChange={handleBodyMapChange} sex={pt.sexo} />
        {localDor.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <span style={lbl()}>Lateralidade</span>
            <div style={{ display: "flex", gap: 6 }}>
              {["Direito","Esquerdo","Bilateral","Não se aplica"].map(opt => (
                <button key={opt} onClick={() => setLaterality(opt)}
                  style={{ background: laterality === opt ? C.greenBg : C.surface, border: `1px solid ${laterality === opt ? C.green+"50" : C.border}`, borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: laterality === opt ? 700 : 400, color: laterality === opt ? C.green : C.textMuted, cursor: "pointer", fontFamily: F }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
        {cifSuggestions.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 10, color: C.textDim }}>
            CIFs associados: {cifSuggestions.join(" · ")}
          </div>
        )}
      </div>

      {/* ── 5. Critical Safety Card (Red Flags) ───────────────────────────*/}
      <div style={card()}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 16 }}>🚩</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: C.red, letterSpacing: "0.1em", textTransform: "uppercase" }}>Card de Segurança Crítica — Red Flags</span>
          <span style={{ fontSize: 9, background: C.redBg, color: C.red, border: `1px solid ${C.red}30`, borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>OBRIGATÓRIO</span>
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10, lineHeight: 1.5 }}>
            {showVitalAlert && (
              <div style={{ background: C.redBg, border: `1px solid ${C.red}`, borderRadius: 8, padding: "8px 10px", marginBottom: 10, fontSize: 12, color: C.red, fontWeight: 600 }}>
                🚨 Alerta de segurança: Verifique os sinais vitais antes de prosseguir
              </div>
            )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {RED_FLAGS_LIST.map(f => (
            <label key={f} onClick={() => toggleRedFlag(f)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: redFlags.includes(f) ? C.redBg : C.surface, border: `1px solid ${redFlags.includes(f) ? C.red+"50" : C.borderLight}`, borderRadius: 6, cursor: "pointer", fontSize: 12, color: redFlags.includes(f) ? C.red : C.text, userSelect: "none" }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${redFlags.includes(f) ? C.red : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: redFlags.includes(f) ? "#fff" : "transparent", background: redFlags.includes(f) ? C.red : "transparent" }}>
                {redFlags.includes(f) && "✓"}
              </span>
              {f}
            </label>
          ))}
        </div>
        {redFlags.length > 0 && (
          <div style={{ marginTop: 10, background: C.redBg, border: `1px solid ${C.red}`, borderRadius: 8, padding: "8px 12px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.red }}>⚠ {redFlags.length} red flag(s) selecionada(s) — incluídas no relatório.</span>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Encaminhamento médico recomendado antes de iniciar terapia manual ou exercícios ativos.</div>
          </div>
        )}
      </div>

      {/* ── 6. Clinical Impression / Conduct ──────────────────────────────*/}
      <div style={card()}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: "0.1em", marginBottom: 8 }}>💊 IMPRESSÃO CLÍNICA E CONDUTA IMEDIATA</div>
        <AudioField value={impressaoClinica} onChange={setImpressaoClinica} placeholder="Ex: Paciente orientado, sem red flags. Realizado alongamento de isquiotibiais e orientação postural. Retorno em 7 dias para reavaliação." rows={3} />
      </div>

      {/* ── Background processing info ────────────────────────────────────*/}
      <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.textMuted }}>
          <span>⚙️</span>
          <span>Ao salvar, o sistema processará em segundo plano: classificação CIF automática (rascunho), sugestão de escalas funcionais e vínculo com tabela de honorários CREFITO.</span>
        </div>
      </div>

      {/* ── Buttons ───────────────────────────────────────────────────────*/}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleSave} disabled={!canSave}
          style={{ flex: 1, background: canSave ? C.green : C.border, color: canSave ? "#061A0C" : C.textDim, border: "none", borderRadius: 8, padding: "13px 20px", fontSize: 14, fontWeight: 800, cursor: canSave ? "pointer" : "not-allowed", fontFamily: F, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          ⚡ Salvar Atendimento Express
        </button>
        <button onClick={onCancel}
          style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: C.textMuted, cursor: "pointer", fontFamily: F }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
