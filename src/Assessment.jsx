import { useState, useEffect, Fragment } from "react";
import { AudioField, NumericDrum, EvaSlider, TagSelect, SingleSelect, GonioRow, MRCRow, TestCard, SessionCounter, HonorariosCard, Section, Row, Field, BodyMap, useMediaQuery } from "./components";
import { useClinicalScan } from "./hooks/useClinicalScan";
import { useSemanticScanner } from "./hooks/useSemanticScanner";
import { detectLocalDor, extractClinicalEntities } from "./utils/clinicalDetection";

const C = {
  bg: "var(--bg)", surface: "var(--surface)", card: "var(--card)", cardAlt: "var(--cardAlt)",
  border: "var(--border)", borderLight: "var(--borderLight)", green: "var(--green)", greenDim: "var(--greenDim)",
  greenDeep: "var(--greenDeep)", greenBg: "var(--greenBg)", greenBgHov: "var(--greenBgHov)",
  amber: "var(--amber)", amberBg: "var(--amberBg)", red: "var(--red)", redBg: "var(--redBg)",
  blue: "var(--blue)", blueBg: "var(--blueBg)", purple: "var(--purple)", purpleBg: "var(--purpleBg)",
  text: "var(--text)", textSub: "var(--textSub)", textMuted: "var(--textMuted)", textDim: "var(--textDim)", white: "var(--white)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";
const inp = (extra = {}) => ({ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 12px", outline: "none", fontFamily: F, ...extra });
const sel = (extra = {}) => ({ ...inp(), cursor: "pointer", ...extra });
const lbl = (extra = {}) => ({ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMuted, marginBottom: 5, ...extra });
const primaryBtn = (extra = {}) => ({ background: C.green, color: "#061A0C", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...extra });

import CREFITO_REGIOES from "./data/crefito";

const CIF = {
  b280: "Sensação de dor", b28010: "Dor em cabeça e pescoço", b28013: "Dor nas costas",
  b28014: "Dor em membro superior", b28015: "Dor em membro inferior",
  b7300: "Força de grupos musculares isolados", b7350: "Tônus de grupos musculares isolados",
  b7400: "Resistência de grupos musculares isolados", b710: "Mobilidade das articulações",
  b715: "Estabilidade das articulações", b730: "Força muscular",
  b770: "Padrão de marcha", b780: "Sensações relacionadas aos músculos e funções do movimento",
  d410: "Mudar posição corporal básica", d415: "Manter posição corporal",
  d430: "Levantar e transportar objetos", d445: "Uso da mão e do braço",
  d450: "Andar", d455: "Deslocar-se", d4551: "Subir/descer escadas",
  d640: "Realizar tarefas domésticas", d850: "Trabalho remunerado",
  d4401: "Uso fino da mão (preensão de precisão)", d920: "Recreação e lazer",
  e1101: "Medicamentos", e355: "Profissionais de saúde",
};

const cardStyle = (extra = {}) => ({ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14, ...extra });

function CollapsibleSection({ title, icon, badge, expanded, onToggle, children }) {
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ ...cardStyle(), padding: isMobile ? "14px 12px" : "20px 22px" }}>
      <div onClick={onToggle}
        style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", paddingBottom:expanded?12:0, borderBottom:expanded?`1px solid ${C.border}`:"none", marginBottom:expanded?isMobile?14:18:0 }}>
        <span style={{ fontSize:10, color:C.textMuted, transition:"transform 0.15s", transform:expanded?"rotate(90deg)":"rotate(0deg)" }}>▶</span>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:isMobile?10:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.green, flex:1 }}>{title}</h3>
        {badge && <span style={{ fontSize:11, background:C.amberBg, color:C.amber, border:`1px solid ${C.amber}40`, borderRadius:20, padding:"2px 10px" }}>{badge}</span>}
      </div>
      {expanded && <div>{children}</div>}
    </div>
  );
}

function CollapsibleSub({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div style={{ marginBottom: 14, background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: isMobile ? "8px 10px" : "10px 14px" }}>
      <div onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none", paddingBottom: open ? 8 : 0, borderBottom: open ? `1px solid ${C.border}` : "none", marginBottom: open ? 10 : 0 }}>
        <span style={{ fontSize: 10, color: C.textMuted, transition: "transform 0.15s", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", flex: 1 }}>{title}</span>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}

export default function Assessment({
  pt, up, regiao, setRegiao,
  queixa, setQueixa, setQueixaKey,
  localDor, setLocalDor, caraterDor, setCaraterDor, tempoDor, setTempoDor,
  melhora, setMelhora, piora, setPiora,
  hda, setHda, comorbid, setComorbid, antec, setAntec, meds, setMeds,
  yellowFlagsState, setYellowFlagsState,
  selectedRedFlags, setSelectedRedFlags,
  evaMov, setEvaMov, evaRep, setEvaRep,
  avds, setAvds, objTrat, setObjTrat, nivelAti, setNivelAti,
  postura, setPostura, marcha, setMarcha, edema, setEdema,
  palpacao, setPalpacao, sensib, setSensib, reflexos, setReflexos,
  forca, addF, updF, remF,
  gonio, addG, updG, remG,
  tests, setTests,
  obs, setObs,
  aiLoad, runAI, aiRes,
  kb, kbList, queixaKeys, cifSuggestions, autoCIF, imc,
  mergedRedFlags, mergedEscalas,
  progSteps, detectKB,
  assessmentHistory, saveAssessment, loadAssessment, resetAssessment, patientId,
  tryFeature, plan, onUpgrade, aiRemaining, aiLimit, hasExpansion, purchaseAIExpansion, canUseFeature,
  diagnosticoCinesio, setDiagnosticoCinesio,
}) {
  const { entities, dcSuggestion } = useClinicalScan(queixa);
  const { handleComorbidChange, handleAntecChange, detected: medicalDetected } = useSemanticScanner(queixa, { setComorbid, setAntec });
  const patientAssessments = assessmentHistory
    .filter(a => a.patientId === patientId)
    .sort((a, b) => (b.id || 0) - (a.id || 0));
  const [expandedSections, setExpandedSections] = useState([]);
  const toggleSection = (key) => setExpandedSections(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);
  const isMobile = useMediaQuery("(max-width:767px)");

  // Neuro periférico
  const [neuroDermatomos, setNeuroDermatomos] = useState({});
  const [neuroMiotomos, setNeuroMiotomos] = useState({});
  const [neuroReflexos, setNeuroReflexos] = useState({});
  const [neuroPatologicos, setNeuroPatologicos] = useState({});

  const nSel = (key, state, setter, options) => {
    const value = state[key] || "";
    return (
      <select value={value} onChange={e => setter({...state, [key]: e.target.value})} style={{...sel(), fontSize:11, padding:"4px 8px", flex:1}}>
        <option value="">—</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  };

  useEffect(() => {
    if (kbList.length > 0) {
      const firstKey = "testes-" + (queixaKeys[0] || "0");
      setExpandedSections(p => p.includes(firstKey) ? p : [...p, firstKey]);
    }
  }, [kbList, queixaKeys]);
  return (
    <>
      {/* Histórico de Avaliações */}
      <Section title="Histórico de Avaliações" icon="📂">
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <select
            value=""
            onChange={e => { const idx = Number(e.target.value); if (idx >= 0) loadAssessment(assessmentHistory[idx]); }}
            style={sel({ maxWidth:260, fontSize:12 })}
          >
            <option value="">Selecionar avaliação anterior…</option>
            {patientAssessments.map(a => (
              <option key={a.id} value={assessmentHistory.indexOf(a)}>
                {a.date} — {a.queixa?.slice(0,50) || "Sem queixa"}
              </option>
            ))}
          </select>
          <button onClick={saveAssessment} style={{ ...primaryBtn({ padding:"8px 16px", fontSize:12 }) }}>💾 Salvar avaliação</button>
          <button onClick={resetAssessment} style={{ background:"transparent", color:C.amber, border:`1px solid ${C.amber}40`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6 }}>🔄 Nova avaliação</button>
        </div>
        {patientAssessments.length > 0 && (
          <div style={{ fontSize:11, color:C.textMuted, marginTop:8 }}>
            {patientAssessments.length} avaliação(ões) salva(s) para este paciente
          </div>
        )}
      </Section>
      {/* Identificação */}
      <CollapsibleSection title="Identificação do Paciente" icon="👤" expanded={expandedSections.includes("identificacao")} onToggle={()=>toggleSection("identificacao")}>
        <Row cols="1fr 1fr 1fr">
          <Field l="Nome completo" span={2}><input value={pt.nome} onChange={e => up("nome", e.target.value)} style={inp()} placeholder="Nome completo do paciente" /></Field>
          <Field l="Data da avaliação"><input type="date" value={pt.data} onChange={e => up("data", e.target.value)} style={inp()} /></Field>
        </Row>
        <Row cols="1fr 1fr 1fr">
          <Field l="Data de nascimento"><input type="date" value={pt.dataNasc} onChange={e => up("dataNasc", e.target.value)} style={inp()} /></Field>
          <Field l="Sexo"><SingleSelect options={["Masculino", "Feminino", "Outro"]} value={pt.sexo} onChange={v => up("sexo", v)} /></Field>
          <Field l="Lateralidade"><SingleSelect options={["Destro", "Canhoto", "Ambidestro"]} value={pt.lateralidade} onChange={v => up("lateralidade", v)} /></Field>
        </Row>
        <Row cols="1fr 1fr 1fr">
          <Field l="Estado civil">
            <select value={pt.estadoCivil} onChange={e => up("estadoCivil", e.target.value)} style={sel()}>
              <option value="">Selecionar…</option>
              {["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União estável"].map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field l="Profissão"><input value={pt.profissao} onChange={e => up("profissao", e.target.value)} style={inp()} placeholder="Ocupação atual" /></Field>
          <Field l="Telefone"><input value={pt.telefone} onChange={e => up("telefone", e.target.value)} style={inp()} placeholder="(00) 00000-0000" /></Field>
        </Row>

        <CollapsibleSub title="Dados administrativos e financeiros">
          <Row cols="1fr 1fr 1fr" mobileCols="1fr">
            <Field l="Convênio / Particular">
              <select value={pt.convenio} onChange={e => up("convenio", e.target.value)} style={sel()}>
                <option value="">Selecionar…</option>
                {["Particular", "Unimed", "Bradesco Saúde", "Amil", "SulAmérica", "Hapvida", "NotreDame", "IPSEMG", "SUS / NASF", "Outro"].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <div>
              <SessionCounter value={pt.sessoesAuth} onChange={v => up("sessoesAuth", v)} />
            </div>
            {pt.convenio === "Particular" && (
              <Field l="Região CREFITO">
                <select value={regiao} onChange={e => setRegiao(e.target.value)} style={sel()}>
                  {Object.keys(CREFITO_REGIOES).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
            )}
          </Row>
          <HonorariosCard convenio={pt.convenio} regiao={regiao} sessoesAuth={pt.sessoesAuth} />
        </CollapsibleSub>

        <CollapsibleSub title="Antropometria">
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
            <NumericDrum label="Peso" value={pt.peso} onChange={v => up("peso", String(v))} min={30} max={250} step={0.5} unit="kg" />
            <NumericDrum label="Altura" value={pt.altura} onChange={v => up("altura", String(v))} min={100} max={220} step={1} unit="cm" />
            <div>
              <span style={lbl()}>IMC calculado</span>
              <div style={{ background: C.surface, border: `1px solid ${imc ? imc.c + "50" : C.border}`, borderRadius: 10, height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {imc ? <><span style={{ fontSize: 22, fontWeight: 900, color: imc.c }}>{imc.value}</span><span style={{ fontSize: 11, color: imc.c, fontWeight: 700 }}>{imc.l}</span></> : <span style={{ fontSize: 12, color: C.textDim }}>Preencha peso e altura</span>}
              </div>
            </div>
          </div>
        </CollapsibleSub>
      </CollapsibleSection>

      {/* Queixa e Anamnese */}
      <CollapsibleSection title="Queixa Principal e Anamnese" icon="📝" expanded={expandedSections.includes("queixa")} onToggle={()=>toggleSection("queixa")}>
        <div style={{ background:"var(--redBg)", border:"1.5px solid var(--red)", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
            <span style={{ background:"var(--red)", color:"#fff", fontSize:9, fontWeight:900, letterSpacing:"0.08em", padding:"2px 10px", borderRadius:4, lineHeight:"18px" }}>OBRIGATÓRIO</span>
            <span style={{ fontSize:11, fontWeight:800, color:"var(--red)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Queixa principal</span>
            <span style={{ fontSize:11, color:"var(--textSub)", fontWeight:400 }}>— digite ou use o microfone</span>
          </div>
          <AudioField value={queixa} onChange={v => { const t = typeof v === "function" ? v(queixa) : v; setQueixa(t); setQueixaKey(detectKB(t)); const regions = detectLocalDor(t); if (regions.length > 0) setLocalDor(regions); const { painChars } = extractClinicalEntities(t); if (painChars.length > 0) setCaraterDor(prev => { const toAdd = painChars.filter(c => !prev.includes(c)); return toAdd.length > 0 ? [...prev, ...toAdd] : prev; }); }} placeholder="Ex: Lombalgia com irradiação para MMII há 3 semanas após queda…" rows={2} />
        </div>

        {queixa && (entities.muscles.length > 0 || entities.laterality || entities.painChars.length > 0) && (
          <div style={{ background: C.blueBg, border: `1px solid ${C.blue}40`, borderRadius: 10, padding: "10px 14px", margin: "12px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: C.blue, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>🔍 Varredura Semântica</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 12 }}>
              {entities.muscles.length > 0 && (
                <span style={{ color: C.textSub }}>Músculos: <strong style={{ color: C.text }}>{entities.muscles.join(", ")}</strong></span>
              )}
              {entities.laterality && (
                <span style={{ color: C.textSub }}>Lateralidade: <strong style={{ color: C.text }}>{entities.laterality}</strong></span>
              )}
              {entities.painChars.length > 0 && (
                <span style={{ color: C.textSub }}>Caráter: <strong style={{ color: C.text }}>{entities.painChars.join(", ")}</strong></span>
              )}
            </div>
          </div>
        )}

        {kb && (
          <div style={{ background: C.greenBg, border: `1px solid ${C.green}40`, borderRadius: 10, padding: "12px 14px", margin: "12px 0" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 10 }}>
              ✓ Condição{queixaKeys.length > 1 ? "ões" : ""} identificada{queixaKeys.length > 1 ? "s" : ""}: {kbList.slice(0,2).map((k,i) => <strong key={i}>{k.label}{i < kbList.slice(0,2).length-1 ? " + " : ""}</strong>)}{kbList.length > 2 && <span style={{fontSize:10,color:C.textMuted}}> e +{kbList.length-2}</span>} — protocolos carregados automaticamente
            </div>

            {!canUseFeature?.("cif") ? (
              <div style={{ background: C.card, borderRadius: 8, padding: "12px", marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>CIF sugeridos pela condição</div>
                <div style={{ fontSize: 12, color: C.textMuted, display:"flex", alignItems:"center", gap:8 }}>
                  🔒 Sugestão CIF disponível nos planos <strong style={{color:C.green}}>Evidência</strong> e <strong style={{color:C.green}}>Clínica</strong>.
                  <button onClick={() => onUpgrade?.()}
                    style={{ background:"transparent", border:"none", color:C.green, fontWeight:700, cursor:"pointer", fontSize:12, fontFamily:F, textDecoration:"underline" }}>
                    Desbloquear
                  </button>
                </div>
              </div>
            ) : cifSuggestions.length > 0 && (
              <div style={{ background: C.card, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>CIF sugeridos pela condição</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {cifSuggestions.map(code => (
                    <span key={code} style={{ fontSize: 11, color: C.blue, background: C.blueBg, border: `1px solid ${C.blue}30`, borderRadius: 6, padding: "3px 10px" }}>
                      <strong>{code}</strong> — {CIF[code]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!canUseFeature?.("cif") ? (
              <div style={{ background: C.surface, borderRadius: 8, padding: "12px", marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>CIF identificados automaticamente (baseados nos dados preenchidos)</div>
                <div style={{ fontSize: 12, color: C.textMuted, display:"flex", alignItems:"center", gap:8 }}>
                  🔒 CIF automática com qualificadores disponível nos planos <strong style={{color:C.green}}>Evidência</strong> e <strong style={{color:C.green}}>Clínica</strong>.
                  <button onClick={() => onUpgrade?.()}
                    style={{ background:"transparent", border:"none", color:C.green, fontWeight:700, cursor:"pointer", fontSize:12, fontFamily:F, textDecoration:"underline" }}>
                    Desbloquear
                  </button>
                </div>
              </div>
            ) : autoCIF.length > 0 && (
              <div style={{ background: C.surface, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>CIF identificados automaticamente (baseados nos dados preenchidos)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {autoCIF.map(item => (
                    <span key={`${item.code}-${item.qualifier}`} style={{ fontSize: 11, color: C.purple, background: C.purpleBg, border: `1px solid ${C.purple}30`, borderRadius: 6, padding: "3px 10px" }}>
                      <strong>{item.code}</strong> — {item.desc} | Q:{item.qualifier}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: C.redBg, border: `1px solid ${C.red}40`, borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.red, letterSpacing: "0.1em", marginBottom: 6 }}>🚩 RED FLAGS — INVESTIGAR ANTES DE PROSSEGUIR</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {mergedRedFlags.map(f => {
                  const active = selectedRedFlags?.includes(f);
                  return (
                    <button key={f} onClick={() => setSelectedRedFlags(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                      style={{ fontSize: 11, color: active ? "#fff" : C.red, background: active ? C.red : C.redBg, border: `1px solid ${C.red}50`, borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontFamily: F, fontWeight: active ? 700 : 400, transition: "all 0.12s" }}>
                      {active && "✓ "}{f}
                    </button>
                  );
                })}
              </div>
              {selectedRedFlags?.length > 0 && (
                <div style={{ marginTop: 6, fontSize: 10, color: C.red, fontWeight: 600 }}>
                  ⚠ {selectedRedFlags.length} red flag(s) selecionada(s) — serão incluídas no Relatório e na Evolução do paciente
                </div>
              )}
            </div>

            <div style={{ fontSize: 11, color: C.textSub, lineHeight: 1.7 }}>
              <strong style={{ color: C.greenDim }}>Padrão-ouro: </strong>{kb.goldStandard}
            </div>

            {mergedEscalas?.length > 0 && (
              <div style={{ marginTop: 10, background: C.card, borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>📏 Escalas recomendadas para esta(s) condição(ões)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {mergedEscalas.map(e => (
                    <span key={e} style={{ fontSize: 11, color: C.amber, background: C.amberBg, border: `1px solid ${C.amber}30`, borderRadius: 6, padding: "2px 8px" }}>{e}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <CollapsibleSub title="Caracterização da dor">
          <Row cols="1fr 1fr">
            <Field l="Localização da dor — clique nas áreas do corpo">
              {localDor.length > 0 && (
                <div style={{ fontSize: 10, color: C.green, marginBottom: 6, fontWeight: 600, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <span>✓ Detectado:</span>
                  {localDor.map(p => <span key={p} style={{ background: C.greenBg, border: `1px solid ${C.green}30`, borderRadius: 4, padding: "1px 7px", fontWeight: 700 }}>{p}</span>)}
                </div>
              )}
              <BodyMap value={localDor} onChange={setLocalDor} sex={pt.sexo} />
            </Field>
            <Field l="Caráter da dor">
              <TagSelect options={["Latejante", "Queimação", "Pontada", "Pressão", "Facada", "Formigamento", "Peso", "Cãibra", "Choques", "Mecânica", "Inflamatória", "Neuropática"]}
                value={caraterDor} onChange={setCaraterDor} />
            </Field>
          </Row>
          <Row cols="1fr 1fr 1fr">
            <Field l="Duração / tempo de dor">
              <select value={tempoDor} onChange={e => setTempoDor(e.target.value)} style={sel()}>
                <option value="">Selecionar…</option>
                {["< 2 semanas (aguda)", "2–6 semanas (subaguda)", "6 sem – 3 meses (subcrônica)", "3–6 meses (crônica)", "6–12 meses", "1–2 anos", "> 2 anos (crônica complexa)"].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field l="Fatores de melhora">
              <TagSelect options={["Repouso", "Calor", "Frio", "Movimento/aquecimento", "Analgésico", "Posição específica", "Fisioterapia", "Sono"]} value={melhora} onChange={setMelhora} />
            </Field>
            <Field l="Fatores de piora">
              <TagSelect options={["Movimento", "Carga", "Postura estática", "Frio", "Stress emocional", "Noite/repouso", "Trabalho", "Após atividade"]} value={piora} onChange={setPiora} />
            </Field>
          </Row>
        </CollapsibleSub>

        <Field l="HDA — História da Doença Atual">
          <AudioField value={hda} onChange={v => setHda(typeof v === "function" ? v(hda) : v)} placeholder="Início, mecanismo de lesão, evolução, tratamentos anteriores, exames realizados…" rows={3} />
        </Field>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Diagnóstico Cinesioterapêutico (DCT)</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <input value={diagnosticoCinesio} onChange={e => setDiagnosticoCinesio(e.target.value)}
              style={{ ...inp(), flex: 1 }} placeholder="Ex: Lombalgia mecânica com disfunção de controle motor e fraqueza de glúteo médio D" />
            {dcSuggestion && !diagnosticoCinesio && (
              <button onClick={() => setDiagnosticoCinesio(dcSuggestion)}
                style={{ background: C.blueBg, border: `1px solid ${C.blue}40`, borderRadius: 8, padding: "9px 14px", fontSize: 11, fontWeight: 700, color: C.blue, cursor: "pointer", fontFamily: F, whiteSpace: "nowrap" }}>
                ← Sugestão
              </button>
            )}
          </div>
          {dcSuggestion && !diagnosticoCinesio && (
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, fontStyle: "italic" }}>
              Baseado na queixa: <strong>{dcSuggestion}</strong>
            </div>
          )}
        </div>

        <CollapsibleSub title="Histórico e comorbidades">
          <Row cols="1fr 1fr">
            <Field l="Comorbidades">
              <TagSelect options={["HAS", "DM2", "Obesidade", "Osteoporose", "Artrite/AR", "Fibromialgia", "Depressão", "Ansiedade", "Doença cardíaca", "DPOC", "Neoplasia", "Imunossupressão", "Nenhuma"]}
                value={comorbid} onChange={handleComorbidChange} />
              {medicalDetected.comorbid.length > 0 && (
                <div style={{ fontSize: 9, color: C.textDim, marginTop: 4, display: "flex", gap: 4 }}>
                  <span>🧬 Detectado:</span>
                  {medicalDetected.comorbid.map(d => <span key={d} style={{ color: C.green, fontWeight: 600 }}>{d}</span>)}
                </div>
              )}
            </Field>
            <Field l="Antecedentes / cirurgias">
              <TagSelect options={["Cirurgia prévia (área)", "Trauma anterior", "Fratura óssea", "Imobilização prolongada", "Fisioterapia anterior", "Infiltração corticoide", "Nenhum relevante"]}
                value={antec} onChange={handleAntecChange} />
              {medicalDetected.antec.length > 0 && (
                <div style={{ fontSize: 9, color: C.textDim, marginTop: 4, display: "flex", gap: 4 }}>
                  <span>📋 Detectado:</span>
                  {medicalDetected.antec.map(d => <span key={d} style={{ color: C.green, fontWeight: 600 }}>{d}</span>)}
                </div>
              )}
            </Field>
          </Row>
          <Field l="Medicamentos em uso">
            <input value={meds} onChange={e => setMeds(e.target.value)} style={inp()} placeholder="Anti-inflamatório, analgésico, relaxante muscular, antidepressivo…" />
          </Field>
        </CollapsibleSub>

        <CollapsibleSub title="Yellow Flags — Fatores Psicossociais">
          <TagSelect options={["Catastrofização", "Cinesiofobia", "Baixa autoeficácia", "Insatisfação no trabalho", "Depressão/ansiedade", "Baixa expectativa de recuperação", "Comportamento de doença", "Conflitos familiares", "Litígio / afastamento laboral", "Trabalho sedentário"]}
            value={yellowFlagsState} onChange={setYellowFlagsState} activeColor={C.amber} />
          {yellowFlagsState.length >= 3 && (
            <div style={{ marginTop: 8, padding: "8px 12px", background: C.amberBg, border: `1px solid ${C.amber}40`, borderRadius: 8, fontSize: 11, color: C.amber }}>
              ⚠️ <strong>{yellowFlagsState.length} yellow flags identificados.</strong> Considerar abordagem biopsicossocial (CFT, PNE) e avaliação psicológica.
            </div>
          )}
        </CollapsibleSub>
      </CollapsibleSection>

      {/* Dor e Funcionalidade */}
      <CollapsibleSection title="Dor e Funcionalidade" icon="⚡" expanded={expandedSections.includes("dor")} onToggle={()=>toggleSection("dor")}>
        <Row cols="1fr 1fr">
          <CollapsibleSub title="Escala de Dor (EVA)">
            <EvaSlider label="EVA — Movimento" value={evaMov} onChange={setEvaMov} />
            <div style={{ marginTop: 18 }}>
              <EvaSlider label="EVA — Repouso" value={evaRep} onChange={setEvaRep} />
            </div>
          </CollapsibleSub>
          <CollapsibleSub title="Função e Atividades">
            <Field l="Nível de atividade física">
              <SingleSelect options={["Sedentário", "Levemente ativo", "Moderadamente ativo", "Muito ativo", "Atleta"]} value={nivelAti} onChange={setNivelAti} />
            </Field>
            <div style={{ marginTop: 14 }}>
              <Field l="Limitações nas AVDs">
                <TagSelect options={["Andar", "Subir escadas", "Agachar", "Sentar/levantar", "Vestir-se", "Higiene pessoal", "Dormir", "Dirigir", "Trabalho manual", "Esporte", "Carregar peso", "Vida sexual", "Sem limitações"]}
                  value={avds} onChange={setAvds} />
              </Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field l="Objetivo principal (expectativa do paciente)">
                <TagSelect options={["Eliminar a dor", "Retornar ao trabalho", "Retornar ao esporte", "Independência nas AVDs", "Melhorar postura", "Fortalecer", "Prevenir recidiva", "Melhorar qualidade de vida"]}
                  value={objTrat} onChange={setObjTrat} />
              </Field>
            </div>
          </CollapsibleSub>
        </Row>
      </CollapsibleSection>

      {/* Exame Físico */}
      <CollapsibleSection title="Exame Físico" icon="🔬" expanded={expandedSections.includes("exame")} onToggle={()=>toggleSection("exame")}>
        <CollapsibleSub title="Inspeção e marcha">
          <Row cols="1fr 1fr">
            <Field l="Alterações posturais">
              <TagSelect options={["Anteriorização de cabeça", "Protração de ombros", "Hipercifose torácica", "Hiperlordose lombar", "Retificação lombar", "Escoliose funcional", "Escoliose estrutural", "Pelve anteriorizada", "Pelve posteriorizada", "Joelho varo", "Joelho valgo", "Recurvatum", "Pé plano", "Pé cavo", "Sem alterações"]}
                value={postura} onChange={setPostura} />
            </Field>
            <div>
              <Field l="Padrão de marcha">
                <select value={marcha} onChange={e => setMarcha(e.target.value)} style={sel()}>
                  <option value="">Selecionar…</option>
                  {["Normal", "Antálgica", "Trendelenburg", "Equina", "Hemiplégica", "Atáxica", "Claudicação intermitente", "Não avaliado"].map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <div style={{ marginTop: 12 }}>
                <Field l="Edema / Sinais flogísticos">
                  <select value={edema} onChange={e => setEdema(e.target.value)} style={sel()}>
                    <option value="">Selecionar…</option>
                    {["Ausente", "Edema leve (1+)", "Edema moderado (2+)", "Edema importante (3+)", "Calor local", "Rubor", "Derrame articular", "Crepitação"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ marginTop: 12 }}>
                <Field l="Sensibilidade">
                  <select value={sensib} onChange={e => setSensib(e.target.value)} style={sel()}>
                    <option value="">Selecionar…</option>
                    {["Normal", "Hipoestesia", "Hiperestesia", "Parestesia", "Anestesia", "Alodínia"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ marginTop: 12 }}>
                <Field l="Reflexos osteotendinosos">
                  <select value={reflexos} onChange={e => setReflexos(e.target.value)} style={sel()}>
                    <option value="">Selecionar…</option>
                    {["Normais (2+)", "Hiporreflexia (1+)", "Arreflexia (0)", "Hiperreflexia (3+/4+)", "Assimétricos"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </Row>
        </CollapsibleSub>

        <CollapsibleSub title="Palpação">
          <AudioField value={palpacao} onChange={v => setPalpacao(typeof v === "function" ? v(palpacao) : v)}
            placeholder="Pontos gatilho, espasmo muscular, dor à palpação de processos espinhosos, hipersensibilidade local…" rows={2} />
        </CollapsibleSub>

        <CollapsibleSub title="Força Muscular — Escala MRC (0–5)">
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 100px" : "2fr 200px", gap: 8, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
            {["Músculo", "Grau"].map((h, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 700, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: i >= 1 ? "center" : "left" }}>{h}</span>
            ))}
          </div>
          {forca.map(row => (
            <MRCRow key={row.id} row={row} onUpdate={u => updF(row.id, u)} onRemove={() => remF(row.id)} />
          ))}
          <button onClick={addF} style={{ background:"transparent", color:C.green, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, marginTop:12 }}>+ Adicionar músculo</button>
        </CollapsibleSub>
      </CollapsibleSection>

      {/* Goniometria */}
      <CollapsibleSection title="Goniometria" icon="📐" badge={`${gonio.filter(g => g.value).length} med.`} expanded={expandedSections.includes("gonio")} onToggle={()=>toggleSection("gonio")}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr 50px" : "1.8fr 1.8fr 76px 72px 28px", gap: 8, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
          {(isMobile ? ["Articulação", "Movimento", "Grau"] : ["Articulação", "Movimento", "Grau", "Ref.", ""]).map((h, i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: 700, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: i >= 2 ? "center" : "left" }}>{h}</span>
          ))}
        </div>
        {gonio.map(row => (
          <GonioRow key={row.id} row={row} onUpdate={u => updG(row.id, u)} onRemove={() => remG(row.id)} />
        ))}
        <button onClick={addG} style={{ ...primaryBtn({ background: "transparent", color: C.green, border: `1px solid ${C.border}`, padding: "8px 16px", fontSize: 12 }), marginTop: 12 }}>+ Adicionar medida</button>
      </CollapsibleSection>

      {/* Avaliação Neurológica Periférica */}
      <CollapsibleSection title="Avaliação Neurológica Periférica" icon="🧠" expanded={expandedSections.includes("neuro")} onToggle={()=>toggleSection("neuro")}>

        <CollapsibleSub title="Dermátomos — MMSS (C5–T1) e MMII (L1–S2)">
          <div style={{display:"grid", gridTemplateColumns:"minmax(80px,auto) 1fr 1fr", gap:"3px 8px", alignItems:"center"}}>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}}>Raiz</span>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center"}}>Direito</span>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center"}}>Esquerdo</span>
            {["C5","C6","C7","C8","T1","L1","L2","L3","L4","L5","S1","S2"].map(d => (
              <Fragment key={d}>
                <span style={{fontSize:12, fontWeight:700, color:C.text, padding:"4px 0"}}>{d}</span>
                {nSel(`${d}_D`, neuroDermatomos, setNeuroDermatomos, ["Normal","Hipoestesia","Hiperestesia","Parestesia","Anestesia","Alodínia"])}
                {nSel(`${d}_E`, neuroDermatomos, setNeuroDermatomos, ["Normal","Hipoestesia","Hiperestesia","Parestesia","Anestesia","Alodínia"])}
              </Fragment>
            ))}
          </div>
        </CollapsibleSub>

        <CollapsibleSub title="Miótomos — Escala MRC (0–5)">
          <div style={{display:"grid", gridTemplateColumns:"minmax(120px,auto) 1fr 1fr", gap:"3px 8px", alignItems:"center"}}>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}}>Raiz / Movimento</span>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center"}}>Direito</span>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center"}}>Esquerdo</span>
            {[
              {k:"C5",m:"Abdução de ombro"},{k:"C6",m:"Flexão de cotovelo"},{k:"C7",m:"Extensão de cotovelo"},
              {k:"C8",m:"Extensão do polegar"},{k:"T1",m:"Abdução dos dedos"},{k:"L2",m:"Flexão de quadril"},
              {k:"L3",m:"Extensão de joelho"},{k:"L4",m:"Dorsiflexão de tornozelo"},{k:"L5",m:"Extensão do hálux"},
              {k:"S1",m:"Flexão plantar / Extensão de quadril"},
            ].map(({k,m}) => (
              <Fragment key={k}>
                <span style={{fontSize:11, color:C.text, padding:"4px 0"}}><strong>{k}</strong> <span style={{color:C.textSub,fontSize:10}}>— {m}</span></span>
                {nSel(`${k}_D`, neuroMiotomos, setNeuroMiotomos, ["0","1","2","3","4","5"])}
                {nSel(`${k}_E`, neuroMiotomos, setNeuroMiotomos, ["0","1","2","3","4","5"])}
              </Fragment>
            ))}
          </div>
        </CollapsibleSub>

        <CollapsibleSub title="Reflexos Osteotendinosos — ROTs (0–4+)">
          <div style={{display:"grid", gridTemplateColumns:"minmax(100px,auto) 1fr 1fr", gap:"3px 8px", alignItems:"center"}}>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}}>Reflexo</span>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center"}}>Direito</span>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center"}}>Esquerdo</span>
            {[
              {k:"Bicipital",l:"C5–C6"},{k:"Estilorradial",l:"C6"},{k:"Tricipital",l:"C7"},
              {k:"Patelar",l:"L3–L4"},{k:"Aquileu",l:"S1"},
            ].map(({k,l}) => (
              <Fragment key={k}>
                <span style={{fontSize:11, color:C.text, padding:"4px 0"}}><strong>{k}</strong> <span style={{color:C.textSub,fontSize:10}}>({l})</span></span>
                {nSel(`${k}_D`, neuroReflexos, setNeuroReflexos, ["0","1+","2+","3+","4+"])}
                {nSel(`${k}_E`, neuroReflexos, setNeuroReflexos, ["0","1+","2+","3+","4+"])}
              </Fragment>
            ))}
          </div>
        </CollapsibleSub>

        <CollapsibleSub title="Reflexos Patológicos">
          <div style={{display:"grid", gridTemplateColumns:"minmax(80px,auto) 1fr 1fr", gap:"3px 8px", alignItems:"center"}}>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}}>Reflexo</span>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center"}}>Direito</span>
            <span style={{fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center"}}>Esquerdo</span>
            {["Babinski","Hoffman"].map(r => (
              <Fragment key={r}>
                <span style={{fontSize:11, fontWeight:700, color:C.text, padding:"4px 0"}}>{r}</span>
                {nSel(`${r}_D`, neuroPatologicos, setNeuroPatologicos, ["Ausente","Presente"])}
                {nSel(`${r}_E`, neuroPatologicos, setNeuroPatologicos, ["Ausente","Presente"])}
              </Fragment>
            ))}
          </div>
        </CollapsibleSub>

      </CollapsibleSection>

      {/* Testes especiais */}
      {kbList.length > 0 && (
        <>
          <style>{`
            @keyframes fadeSlideDown { from { opacity:0; max-height:0; transform:translateY(-6px) } to { opacity:1; max-height:2000px; transform:translateY(0) } }
            @keyframes fadeSlideUp { from { opacity:1; max-height:2000px; transform:translateY(0) } to { opacity:0; max-height:0; transform:translateY(-6px) } }
            .teste-accordion-content { overflow:hidden; transition:all 0.3s ease; }
            .teste-accordion-content.open { animation:fadeSlideDown 0.3s ease forwards; }
            .teste-accordion-content.closed { animation:fadeSlideUp 0.2s ease forwards; }
          `}</style>
          {kbList.map((kbItem, idx) => {
            const condKey = queixaKeys[idx] || kbItem.label;
            const isExpanded = expandedSections.includes("testes-" + condKey);
            return (
              <div key={condKey} style={{ ...cardStyle(), padding: isMobile?"14px 12px":"20px 22px", marginBottom:10 }}>
                <div onClick={() => toggleSection("testes-" + condKey)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", userSelect:"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:16 }}>🧪</span>
                    <span style={{ fontWeight:700, fontSize:14, color:C.text }}>
                      Testes Especiais — {kbItem.label}
                    </span>
                    <span style={{ fontSize:10, color:C.textMuted, background:C.surface, borderRadius:4, padding:"1px 6px" }}>
                      {kbItem.tests?.length || 0} testes
                    </span>
                  </div>
                  <span style={{ fontSize:18, color:C.textMuted, transition:"transform 0.25s ease", transform:isExpanded?"rotate(180deg)":"rotate(0deg)" }}>
                    ▼
                  </span>
                </div>
                <div className={`teste-accordion-content ${isExpanded ? "open" : "closed"}`} style={isExpanded ? {} : { maxHeight:0, opacity:0 }}>
                  {isExpanded && (
                    <div style={{ marginTop:14 }}>
                      {kbItem.tests?.length > 0 && (
                        <>
                          <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 14px" }}>
                            Selecione o resultado de cada teste. Clique em ▼ para ver a execução detalhada ou ▶ Vídeo para demonstração.
                          </p>
                          {kbItem.tests.map(t => {
                            const testKey = condKey + "|" + t.name;
                            return (
                              <TestCard key={testKey} test={t} result={tests[testKey] || ""} onResult={v => setTests(tr => ({ ...tr, [testKey]: v }))} />
                            );
                          })}
                        </>
                      )}
                      {(!kbItem.tests || kbItem.tests.length === 0) && (
                        <p style={{ fontSize: 12, color: C.textMuted, fontStyle:"italic" }}>Nenhum teste específico cadastrado para esta condição.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Observações */}
      <CollapsibleSection title="Observações Clínicas" icon="💬" expanded={expandedSections.includes("obs")} onToggle={()=>toggleSection("obs")}>
        <AudioField value={obs} onChange={v => setObs(typeof v === "function" ? v(obs) : v)}
          placeholder="Comportamento do paciente, achados adicionais, exames de imagem relevantes, considerações clínicas…" rows={4} />
      </CollapsibleSection>

      {/* IA */}
      <CollapsibleSection title="Análise por Inteligência Artificial — Baseada em Evidências" icon="🤖" expanded={expandedSections.includes("ia")} onToggle={()=>toggleSection("ia")}>
        <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 14px", lineHeight: 1.7 }}>
          Preencha os campos da avaliação e clique em analisar. A IA cruzará os dados com evidências científicas atualizadas (PEDro, Cochrane, CPGs) e gerará um plano de tratamento personalizado e baseado em evidências.
        </p>
        <div style={{ display: "flex", flexDirection:"column", gap:8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => {
              if (aiRemaining <= 0 && !canUseFeature?.("ai")) {
                if (plan === "trial") { onUpgrade?.(); return; }
                runAI(true); return;
              }
              runAI();
            }} disabled={aiLoad || !queixa} style={{ ...primaryBtn({ background: C.green, color: "#061A0C" }), opacity: aiLoad || !queixa ? 0.45 : 1 }}>
              {aiLoad ? "⏳ Analisando…" : "🔍"} Gerar análise clínica
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              {progSteps.filter(s => !s.done).map(s => (
                <span key={s.key} style={{ fontSize: 10, color: C.amber, background: C.amberBg, border: `1px solid ${C.amber}30`, borderRadius: 6, padding: "2px 8px" }}>Pendente: {s.label}</span>
              ))}
            </div>
          </div>
          {canUseFeature?.("ai") && (
            <div style={{ fontSize: 11, color: aiRemaining < 10 ? C.amber : C.textMuted, fontFamily:F }}>
              📊 {aiRemaining}/{aiLimit} análises restantes neste mês
            </div>
          )}
          {!canUseFeature?.("ai") && (
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily:F, display:"flex", alignItems:"center", gap:6 }}>
              {hasExpansion && aiRemaining > 0 ? (
                <span style={{ color:C.green }}>✅ {aiRemaining} crédito(s) restante(s)</span>
              ) : plan === "trial" ? (
                <span style={{ color:C.amber, fontWeight:600 }}>🎯 Fim do teste gratuito. <button onClick={() => onUpgrade?.()} style={{ background:"none", border:"none", color:C.green, fontWeight:700, cursor:"pointer", fontSize:11, fontFamily:F, textDecoration:"underline", padding:0 }}>Escolher plano</button></span>
              ) : (
                <span>Ao clicar em <strong>Gerar análise clínica</strong>, você será cobrado <strong>R$ 5,90</strong> por esta análise avulsa.</span>
              )}
            </div>
          )}
        </div>
        {aiRes && (
          <div style={{ marginTop: 16, background: C.surface, border: `1px solid ${C.green}30`, borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: C.green, letterSpacing: "0.1em", marginBottom: 12 }}>ANÁLISE CLÍNICA — SASYRA IA</div>
            <pre style={{ fontSize: 13, color: C.text, whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.85, fontFamily: F }}>{aiRes}</pre>
          </div>
        )}
      </CollapsibleSection>
    </>
  );
}
