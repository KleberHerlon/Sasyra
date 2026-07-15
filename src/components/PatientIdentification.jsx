import { useState, useEffect } from "react";
import { SessionCounter, HonorariosCard, SingleSelect } from "../components";
import CREFITO_REGIOES from "../data/crefito";

const CONVENIOS = ["", "Particular", "Unimed", "Bradesco Saúde", "Amil", "SulAmérica", "Hapvida", "NotreDame", "IPSEMG", "SUS / NASF", "Outro"];

const C = {
  bg: "var(--bg)", surface: "var(--surface)", card: "var(--card)",
  border: "var(--border)", borderLight: "var(--borderLight)",
  green: "var(--green)", amber: "var(--amber)", red: "var(--red)", blue: "var(--blue)",
  text: "var(--text)", textSub: "var(--textSub)", textMuted: "var(--textMuted)", textDim: "var(--textDim)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";
const inp = (extra = {}) => ({ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 12px", outline: "none", fontFamily: F, ...extra });
const sel = (extra = {}) => ({ ...inp(), cursor: "pointer", ...extra });
const lbl = (extra = {}) => ({ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMuted, marginBottom: 5, ...extra });

function loadConvenioValores() {
  try { const d = localStorage.getItem("sasyra_convenio_valores"); return d ? JSON.parse(d) : {}; } catch { return {}; }
}
function saveConvenioValores(v) { localStorage.setItem("sasyra_convenio_valores", JSON.stringify(v)); }

function useMediaQuery(q) {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => { const mq = window.matchMedia(q), fn = e => setM(e.matches); mq.addEventListener("change", fn); return () => mq.removeEventListener("change", fn); }, [q]);
  return m;
}

export default function PatientIdentification({ student, onUpdate, regiao, setRegiao, hideAntropometria, expanded, onToggle }) {
  const pt = student || {};
  const up = (field, value) => onUpdate && onUpdate(field, value);
  const isMobile = useMediaQuery("(max-width:767px)");

  const peso = parseFloat(pt.peso) || 0;
  const altura = parseFloat(pt.altura) || 0;
  const imc = peso > 0 && altura > 0 ? (peso / ((altura / 100) ** 2)).toFixed(1) : null;
  const imcColor = imc ? (imc < 18.5 ? C.amber : imc < 25 ? C.green : imc < 30 ? C.amber : C.red) : C.textDim;

  return (
    <div style={{ fontFamily: F, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: isMobile ? "14px 12px" : "20px 22px", marginBottom: 14 }}>
      <div onClick={onToggle}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                 paddingBottom: expanded ? 12 : 0,
                 borderBottom: expanded ? `1px solid var(--border)` : "none",
                 marginBottom: expanded ? (isMobile ? 14 : 18) : 0 }}>
        <span style={{ fontSize: 10, color: "var(--textMuted)",
                       transition: "transform 0.15s",
                       transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
        <span style={{ fontSize: 16 }}>👤</span>
        <h3 style={{ margin: 0, fontSize: isMobile ? 10 : 11, fontWeight: 800,
                     letterSpacing: "0.11em", textTransform: "uppercase",
                     color: "var(--green)", flex: 1 }}>Identificação do Paciente</h3>
      </div>
      {expanded && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={lbl()}>Nome completo</span>
              <input value={pt.nome || ""} onChange={e => up("nome", e.target.value)} style={inp()} placeholder="Nome completo do paciente" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <span style={lbl()}>Data de nascimento</span>
              <input type="date" value={pt.dataNasc || ""} onChange={e => up("dataNasc", e.target.value)} style={inp()} />
            </div>
            <div>
              <span style={lbl()}>Sexo</span>
              <SingleSelect options={["Masculino", "Feminino", "Outro"]} value={pt.sexo || ""} onChange={v => up("sexo", v)} />
            </div>
            <div>
              <span style={lbl()}>Lateralidade</span>
              <SingleSelect options={["Destro", "Canhoto", "Ambidestro"]} value={pt.lateralidade || ""} onChange={v => up("lateralidade", v)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <span style={lbl()}>Estado civil</span>
              <select value={pt.estadoCivil || ""} onChange={e => up("estadoCivil", e.target.value)} style={sel()}>
                <option value="">Selecionar…</option>
                {["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União estável"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <span style={lbl()}>Profissão</span>
              <input value={pt.profissao || ""} onChange={e => up("profissao", e.target.value)} style={inp()} placeholder="Ocupação atual" />
            </div>
            <div>
              <span style={lbl()}>Telefone</span>
              <input value={pt.telefone || ""} onChange={e => up("telefone", e.target.value)} style={inp()} placeholder="(00) 00000-0000" />
            </div>
          </div>

          {!hideAntropometria && (
            <div style={{ background: "var(--cardAlt)", border: `1px solid var(--border)`, borderRadius: 10, padding: isMobile ? "8px 10px" : "10px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--textMuted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>📏 Antropometria</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <span style={lbl()}>Peso (kg)</span>
                  <input type="number" min="20" max="300" step="0.1" value={pt.peso || ""} onChange={e => up("peso", e.target.value)} style={inp()} placeholder="Ex: 70" />
                </div>
                <div>
                  <span style={lbl()}>Altura (cm)</span>
                  <input type="number" min="50" max="250" step="1" value={pt.altura || ""} onChange={e => up("altura", e.target.value)} style={inp()} placeholder="Ex: 170" />
                </div>
                <div>
                  <span style={lbl()}>IMC</span>
                  <div style={{ background: C.surface, border: `1px solid ${imc ? imcColor + "40" : C.border}`, borderRadius: 8, height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {imc ? (
                      <>
                        <span style={{ fontSize: 22, fontWeight: 900, color: imcColor }}>{imc}</span>
                        <span style={{ fontSize: 11, color: imcColor, fontWeight: 700 }}>
                          {imc < 18.5 ? "Abaixo" : imc < 25 ? "Normal" : imc < 30 ? "Sobrepeso" : imc < 35 ? "Obesidade I" : "Obesidade II+"}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: 12, color: C.textDim }}>Preencha peso e altura</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: "var(--cardAlt)", border: `1px solid var(--border)`, borderRadius: 10, padding: isMobile ? "8px 10px" : "10px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--textMuted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              💰 Dados Administrativos e Financeiros
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div>
                <span style={lbl()}>Convênio / Particular</span>
                <select value={pt.convenio || ""} onChange={e => up("convenio", e.target.value)} style={sel()}>
                  {CONVENIOS.map(v => <option key={v} value={v}>{v || "Selecionar…"}</option>)}
                </select>
              </div>
              <div>
                <SessionCounter value={pt.sessoesAuth} onChange={v => up("sessoesAuth", v)} />
              </div>
              {pt.convenio === "Particular" && regiao !== undefined && setRegiao && (
                <div>
                  <span style={lbl()}>Região CREFITO</span>
                  <select value={regiao} onChange={e => setRegiao(e.target.value)} style={sel()}>
                    {Object.keys(CREFITO_REGIOES).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              )}
            </div>
            {pt.convenio && pt.convenio !== "Particular" && (() => {
              const cv = loadConvenioValores();
              const key = pt.id || pt.nome;
              const saved = cv[key] || {};
              return (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                  <div>
                    <span style={lbl()}>Valor a Receber (R$)</span>
                    <input type="number" min="0" step="0.01" defaultValue={saved.valor || ""}
                      onChange={e => {
                        const all = loadConvenioValores();
                        all[key] = { ...(all[key] || {}), valor: e.target.value ? parseFloat(e.target.value) : null };
                        saveConvenioValores(all);
                      }} style={inp()} placeholder="Ex: 120,00" />
                  </div>
                  <div>
                    <span style={lbl()}>Data Prevista de Recebimento</span>
                    <input type="date" defaultValue={saved.dataPrevista || ""}
                      onChange={e => {
                        const all = loadConvenioValores();
                        all[key] = { ...(all[key] || {}), dataPrevista: e.target.value };
                        saveConvenioValores(all);
                      }} style={inp()} />
                  </div>
                </div>
              );
            })()}
            {(pt.convenio === "Particular" || pt.convenio) && (
              <div style={{ marginTop: 10 }}>
                <HonorariosCard convenio={pt.convenio} regiao={regiao} sessoesAuth={pt.sessoesAuth} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
