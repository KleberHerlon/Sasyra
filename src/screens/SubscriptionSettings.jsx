import { useState, useEffect } from "react";
import { useSubscription } from "../hooks/useSubscription";
import { useTokens } from "../hooks/useTokens";
import { PLANS, PLAN_ORDER, PLAN_LABELS, AI_LIMITS, AI_OVERAGE } from "../data/plans";
import { saveAIConfig } from "../lib/aiClient";

const C = {
  bg:          "var(--bg)",
  surface:     "var(--surface)",
  card:        "var(--card)",
  cardAlt:     "var(--cardAlt)",
  border:      "var(--border)",
  borderLight: "var(--borderLight)",
  green:       "var(--green)",
  greenBg:     "var(--greenBg)",
  greenBgHov:  "var(--greenBgHov)",
  text:        "var(--text)",
  textSub:     "var(--textSub)",
  textMuted:   "var(--textMuted)",
  textDim:     "var(--textDim)",
  amber:       "var(--amber)",
  amberBg:     "var(--amberBg)",
  red:         "var(--red)",
  redBg:       "var(--redBg)",
  blue:        "var(--blue)",
  blueBg:      "var(--blueBg)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

const inp = (extra={}) => ({ width:"100%", boxSizing:"border-box", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, padding:"9px 12px", outline:"none", fontFamily:F, ...extra });
const sel = (extra={}) => ({...inp(), cursor:"pointer", ...extra});
const ghostBtn = (extra={}) => ({ background:"transparent", color:C.green, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...extra });
const primaryBtn = (extra={}) => ({ background:C.green, color:"#061A0C", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...extra });
const cardStyle = (extra={}) => ({ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", marginBottom:14, ...extra });

export default function SubscriptionSettings({ onNavigate }) {
  const { sub, plan, label, setPlan, extraUsers, addExtraUser, removeExtraUser, invoices, isAnnual, aiAnalysesUsed, aiLimit, aiRemaining, pctUsed, daysUntilReset, hasQuota, isAvulso } = useSubscription();
  const { summary: tokenSummary, loading: tokenLoading, fetchSummary } = useTokens();

  useEffect(() => { fetchSummary(); }, []);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sasyra_ai_config");
      if (raw) {
        const c = JSON.parse(raw);
        setDkKey(c.deepseekKey || "");
        setGmKey(c.geminiKey || "");
        setGcKey(c.googleClientId || "");
      }
    } catch {}
  }, []);
  const [newUser, setNewUser] = useState({ nome: "", crefito: "", email: "" });
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [dkKey, setDkKey] = useState("");
  const [gmKey, setGmKey] = useState("");
  const [gcKey, setGcKey] = useState("");
  const [keySaveMsg, setKeySaveMsg] = useState("");

  const nextBilling = new Date(sub.nextBilling).toLocaleDateString("pt-BR");
  const startDate = new Date(sub.startDate).toLocaleDateString("pt-BR");

  const handleAddUser = () => {
    if (!newUser.nome || !newUser.crefito) return;
    addExtraUser({ ...newUser });
    setNewUser({ nome: "", crefito: "", email: "" });
  };

  const handleChangePlan = (key) => {
    setPlan(key, isAnnual ? "yearly" : "monthly");
    setShowChangePlan(false);
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:60 }}>
        <span style={{ fontWeight:700, fontSize:16, color:C.text }}>SASYRA — Configurações da Assinatura</span>
        <button onClick={()=>onNavigate?.("back")} style={ghostBtn({ padding:"6px 12px", fontSize:12 })}>← Voltar</button>
      </div>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"24px 16px" }}>
        <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 20px", color:C.text }}>⚙️ Gerenciar Assinatura</h2>

        {/* Current Plan */}
        <div style={{ ...cardStyle(), display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Plano Atual</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.green }}>{label}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>
              {isAnnual ? "Cobrança anual" : "Cobrança mensal"} • Desde {startDate}
            </div>
          </div>
          <button onClick={()=>setShowChangePlan(p=>!p)} style={{ ...ghostBtn({ padding:"8px 16px" }) }}>
            {showChangePlan ? "Cancelar" : "Alterar Plano"}
          </button>
        </div>

        {/* AI Usage Dashboard */}
        {!isAvulso && (
          <div style={cardStyle()}>
            <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>
              🤖 Análises de IA — Uso do Mês
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div style={{ background:C.surface, borderRadius:8, padding:"10px 12px", border:`1px solid ${C.borderLight}` }}>
                <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Utilizadas</div>
                <div style={{ fontSize:22, fontWeight:800, color: aiRemaining <= 0 ? C.red : C.text }}>{aiAnalysesUsed}</div>
                <div style={{ fontSize:10, color:C.textDim }}>de {aiLimit} disponíveis</div>
              </div>
              <div style={{ background:C.surface, borderRadius:8, padding:"10px 12px", border:`1px solid ${C.borderLight}` }}>
                <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Disponíveis</div>
                <div style={{ fontSize:22, fontWeight:800, color: aiRemaining <= 0 ? C.red : C.green }}>{aiRemaining}</div>
                <div style={{ fontSize:10, color:C.textDim }}>{daysUntilReset} dias até o reset</div>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ background:C.surface, borderRadius:6, height:8, overflow:"hidden", marginBottom:10 }}>
              <div style={{ width:`${Math.min(pctUsed,100)}%`, height:"100%", background: pctUsed >= 80 ? C.amber : C.green, borderRadius:6, transition:"width 0.3s" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textDim, marginBottom:12 }}>
              <span>0%</span>
              <span>{pctUsed}% utilizado{(!hasQuota || pctUsed >= 80) ? " ⚠" : ""}</span>
              <span>100%</span>
            </div>
            {!hasQuota && (
              <div style={{ fontSize:11, color:C.amber, background:C.amberBg, borderRadius:8, padding:"8px 12px" }}>
                ⚡ Seu plano não inclui análises de IA. Use o modo avulso (R$ 5,90/análise) ou faça upgrade para Evidência (40 análises/mês inclusas).
              </div>
            )}
            {hasQuota && aiRemaining <= 5 && aiRemaining > 0 && (
              <div style={{ fontSize:11, color:C.amber, background:C.amberBg, borderRadius:8, padding:"8px 12px" }}>
                ⚠ Restam apenas {aiRemaining} análises. Considere fazer upgrade para o plano Clínica ou adquirir créditos avulsos.
              </div>
            )}
            {hasQuota && aiRemaining <= 0 && (
              <div style={{ fontSize:11, color:C.red, background:C.redBg, borderRadius:8, padding:"8px 12px" }}>
                🚫 Cota de análises esgotada. As próximas análises serão cobradas como excedente (R$ {AI_OVERAGE[plan]?.pricePerAnalysis.toFixed(2) || "2,90"}/análise).
              </div>
            )}
          </div>
        )}

        {/* Avulso usage info */}
        {isAvulso && (
          <div style={cardStyle()}>
            <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>
              🤖 Análises Avulsas
            </div>
            <div style={{ fontSize:12, color:C.textDim, lineHeight:1.6 }}>
              Modo avulso ativo. Cada análise de IA custa <strong style={{color:C.amber}}>R$ 5,90</strong> e é cobrada por uso.
              {!isAvulso && " Emita nota fiscal e acompanhe o histórico de faturas abaixo."}
            </div>
            <div style={{ marginTop:12, fontSize:11, color:C.textMuted }}>
              {aiAnalysesUsed > 0 ? `📊 ${aiAnalysesUsed} análise(s) realizada(s) neste ciclo.` : "Nenhuma análise realizada ainda."}
            </div>
          </div>
        )}

        {/* Change Plan */}
        {showChangePlan && (
          <div style={{ ...cardStyle() }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.textMuted, marginBottom:12 }}>Selecione o plano desejado:</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {PLAN_ORDER.map(key => {
                const p = PLANS[key];
                const price = isAnnual ? p.yearlyMonth : p.monthly;
                const isCurrent = key === plan;
                return (
                  <button key={key} onClick={()=>handleChangePlan(key)} disabled={isCurrent}
                    style={{
                      display:"flex", justifyContent:"space-between", alignItems:"center", gap:12,
                      background: isCurrent ? C.greenBg : "transparent",
                      border: `1px solid ${isCurrent ? C.green+"50" : C.border}`,
                      borderRadius:10, padding:"12px 16px", cursor: isCurrent ? "default" : "pointer",
                      fontFamily:F, textAlign:"left", width:"100%",
                    }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color: isCurrent ? C.green : C.text }}>{p.name}</div>
                      <div style={{ fontSize:11, color:C.textMuted }}>{p.tagline}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      {isCurrent ? (
                        <span style={{ fontSize:12, color:C.green, fontWeight:700 }}>Atual</span>
                      ) : (
                        <span style={{ fontSize:14, fontWeight:800, color:C.text }}>R$ {price.toFixed(2)}<span style={{ fontSize:11, fontWeight:400, color:C.textMuted }}>/mês</span></span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Extra Users (Clinicas only) */}
        {plan === "clinicas" && (
          <div style={cardStyle()}>
            <div style={{ fontSize:12, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>
              👥 Profissionais Adicionais (R$ 14,90/mês cada)
            </div>
            {extraUsers.length > 0 && (
              <div style={{ marginBottom:12, display:"flex", flexDirection:"column", gap:6 }}>
                {extraUsers.map((u, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.surface, borderRadius:8, padding:"8px 12px", border:`1px solid ${C.borderLight}` }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{u.nome}</div>
                      <div style={{ fontSize:11, color:C.textMuted }}>CREFITO: {u.crefito}{u.email ? ` • ${u.email}` : ""}</div>
                    </div>
                    <button onClick={()=>removeExtraUser(i)} style={{ background:"transparent", border:"none", color:C.red, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:F }}>Remover</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <input value={newUser.nome} onChange={e=>setNewUser(u=>({...u, nome:e.target.value}))} placeholder="Nome do profissional" style={{ ...inp({ flex:1, minWidth:140, fontSize:12 }) }} />
              <input value={newUser.crefito} onChange={e=>setNewUser(u=>({...u, crefito:e.target.value}))} placeholder="CREFITO" style={{ ...inp({ width:120, fontSize:12 }) }} />
              <input value={newUser.email} onChange={e=>setNewUser(u=>({...u, email:e.target.value}))} placeholder="E-mail" style={{ ...inp({ width:160, fontSize:12 }) }} />
              <button onClick={handleAddUser} disabled={!newUser.nome || !newUser.crefito} style={{ ...primaryBtn({ opacity: !newUser.nome || !newUser.crefito ? 0.45 : 1 }), fontSize:12, padding:"6px 14px" }}>Adicionar</button>
            </div>
          </div>
        )}

        {/* Next Billing */}
        <div style={cardStyle()}>
          <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Próxima Cobrança</div>
          <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{nextBilling}</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>
            {isAnnual ? "Cobrança anual" : "Cobrança mensal"} • Plano {label}
          </div>
        </div>

        {/* Token Usage */}
        <div style={cardStyle()}>
          <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>
            🤖 Uso de Tokens — IA
          </div>
          {tokenLoading ? (
            <div style={{ fontSize:12, color:C.textDim }}>Carregando...</div>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                <div style={{ background:C.surface, borderRadius:8, padding:"10px 12px", border:`1px solid ${C.borderLight}` }}>
                  <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Mês Atual</div>
                  <div style={{ fontSize:18, fontWeight:800, color:C.amber }}>{(tokenSummary.currentMonth.totalTokens || 0).toLocaleString()}</div>
                  <div style={{ fontSize:10, color:C.textDim }}>tokens ({tokenSummary.currentMonth.totalAnalyses || 0} análises)</div>
                </div>
                <div style={{ background:C.surface, borderRadius:8, padding:"10px 12px", border:`1px solid ${C.borderLight}` }}>
                  <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Total Acumulado</div>
                  <div style={{ fontSize:18, fontWeight:800, color:C.green }}>{(tokenSummary.allTime.totalTokens || 0).toLocaleString()}</div>
                  <div style={{ fontSize:10, color:C.textDim }}>tokens ({tokenSummary.allTime.totalAnalyses || 0} análises)</div>
                </div>
              </div>
              {tokenSummary.months && tokenSummary.months.length > 0 && (
                <div style={{ maxHeight:160, overflowY:"auto" }}>
                  {tokenSummary.months.map(m => {
                    const cost = (m.inputTokens / 1_000_000 * 3) + (m.outputTokens / 1_000_000 * 15);
                    return (
                      <div key={m.month} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${C.borderLight}`, fontSize:12 }}>
                        <span style={{ color:C.textMuted }}>{m.month}</span>
                        <div style={{ textAlign:"right" }}>
                          <span style={{ color:C.text, fontWeight:600 }}>{m.totalTokens.toLocaleString()} tok</span>
                          <span style={{ color:C.textDim, marginLeft:8 }}>R$ {cost.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ fontSize:10, color:C.textDim, marginTop:10 }}>
                Custo estimado: input ~R$ 3,00/milhão • output ~R$ 15,00/milhão
              </div>
            </>
          )}
        </div>

        {/* API Key Configuration */}
        <div style={cardStyle()}>
          <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>
            🔑 Chaves de API — IA Direta
          </div>
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:16, lineHeight:1.5 }}>
            Configure suas chaves para usar IA diretamente do navegador (funciona no site publicado sem proxy). As chaves ficam salvas apenas no seu dispositivo.
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:4 }}>DeepSeek (pago, ~R$ 0,0016/análise)</div>
              <div style={{ display:"flex", gap:8 }}>
                <input type="password" value={dkKey} onChange={e => setDkKey(e.target.value)} placeholder="sk-..." style={{ ...inp({ flex:1, fontSize:12 }) }} />
              </div>
              <div style={{ fontSize:9, color:C.textDim, marginTop:3 }}>
                <a href="https://platform.deepseek.com/" target="_blank" rel="noopener" style={{ color:C.green }}>Obter chave DeepSeek</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:4 }}>Gemini (gratuito)</div>
              <div style={{ display:"flex", gap:8 }}>
                <input type="password" value={gmKey} onChange={e => setGmKey(e.target.value)} placeholder="AIza..." style={{ ...inp({ flex:1, fontSize:12 }) }} />
              </div>
              <div style={{ fontSize:9, color:C.textDim, marginTop:3 }}>
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" style={{ color:C.green }}>Obter chave Gemini (grátis)</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:4 }}>Google Calendar — Client ID OAuth</div>
              <div style={{ display:"flex", gap:8 }}>
                <input type="password" value={gcKey} onChange={e => setGcKey(e.target.value)} placeholder="XXXX.apps.googleusercontent.com" style={{ ...inp({ flex:1, fontSize:12 }) }} />
              </div>
              <div style={{ fontSize:9, color:C.textDim, marginTop:3 }}>
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" style={{ color:C.green }}>Criar credencial OAuth 2.0</a> · Redirect: {typeof window !== "undefined" ? window.location.origin + "/Sasyra/oauth-callback.html" : ""}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:4 }}>
              <button onClick={() => {
                saveAIConfig({ deepseekKey: dkKey, geminiKey: gmKey, googleClientId: gcKey });
                setKeySaveMsg("Chaves salvas com sucesso!");
                setTimeout(() => setKeySaveMsg(""), 2500);
              }} style={{ ...primaryBtn({ fontSize:12, padding:"7px 16px" }) }}>Salvar Chaves</button>
              {keySaveMsg && <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>{keySaveMsg}</span>}
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div style={cardStyle()}>
          <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Histórico de Faturas</div>
          {invoices.length === 0 ? (
            <div style={{ fontSize:12, color:C.textDim }}>Nenhuma fatura encontrada. As faturas aparecerão aqui após o primeiro ciclo de cobrança.</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {invoices.map((inv, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.surface, borderRadius:8, padding:"8px 12px", border:`1px solid ${C.borderLight}` }}>
                  <div style={{ fontSize:12, color:C.text }}>{new Date(inv.date).toLocaleDateString("pt-BR")}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:C.green }}>R$ {inv.amount?.toFixed(2)}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>{inv.status || "Pago"}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Need Help */}
        <div style={{ textAlign:"center", marginTop:24 }}>
          <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 8px" }}>Precisa de ajuda com sua assinatura?</p>
          <a href="mailto:suporte@sasyra.app" style={{ color:C.green, fontSize:13, fontWeight:700, textDecoration:"none", fontFamily:F }}>suporte@sasyra.app</a>
        </div>
      </div>
    </div>
  );
}
