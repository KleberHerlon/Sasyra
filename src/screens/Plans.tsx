// @ts-nocheck
import { useState } from "react";
import PlanCard from "../components/PlanCard";
import { PLANS, PLAN_ORDER, AI_LIMITS, AI_EXPANSION } from "../data/plans";
import { useSubscription } from "../hooks/useSubscription";

const C = {
  bg:          "var(--bg)",
  surface:     "var(--surface)",
  card:        "var(--card)",
  border:      "var(--border)",
  green:       "var(--green)",
  greenBg:     "var(--greenBg)",
  text:        "var(--text)",
  textMuted:   "var(--textMuted)",
  amber:       "var(--amber)",
  amberBg:     "var(--amberBg)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

const ghostBtn = (extra={}) => ({ background:"transparent", color:C.green, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...extra });

export default function Plans({ onNavigate }) {
  const { sub, plan: currentPlan, setPlan } = useSubscription();
  const [annual, setAnnual] = useState(sub.billing === "yearly");
  const [justBought, setJustBought] = useState(null);

  const handleSelect = (key) => {
    if (key === currentPlan) {
      onNavigate?.("back");
      return;
    }
    setPlan(key, annual ? "yearly" : "monthly");
    setJustBought(key);
    setTimeout(() => onNavigate?.("back"), 600);
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:60 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>onNavigate?.("back")} style={ghostBtn({ padding:"6px 10px", fontSize:11 })}>← Voltar</button>
          <span style={{ fontWeight:700, fontSize:14, color:C.textMuted }}>Planos</span>
        </div>
        <span style={{ fontWeight:700, fontSize:14, color:C.text }}>⭐ {PLANS[currentPlan].name}</span>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <h1 style={{ fontSize:24, fontWeight:800, margin:"0 0 6px", color:C.text }}>Escolha seu plano</h1>
          <p style={{ fontSize:13, color:C.textMuted, margin:0, lineHeight:1.6 }}>
            Do básico ao IA Premium — encontre o plano ideal para sua clínica.
          </p>
        </div>

        <div style={{ display:"flex", justifyContent:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", background:C.surface, border:`1px solid ${C.border}`, borderRadius:99, padding:3 }}>
            <button onClick={()=>setAnnual(false)}
              style={{ padding:"7px 18px", borderRadius:99, fontSize:12, fontWeight:700, border:"none", cursor:"pointer", background:!annual?C.green:"transparent", color:!annual?"#061A0C":C.textMuted, fontFamily:F, transition:"all 0.15s" }}>
              Mensal
            </button>
            <button onClick={()=>setAnnual(true)}
              style={{ padding:"7px 18px", borderRadius:99, fontSize:12, fontWeight:700, border:"none", cursor:"pointer", background:annual?C.green:"transparent", color:annual?"#061A0C":C.textMuted, fontFamily:F, transition:"all 0.15s" }}>
              Anual <span style={{ fontSize:10, background:annual?`${C.amber}30`:"transparent", color:annual?C.amber:C.textMuted, borderRadius:4, padding:"1px 5px", marginLeft:4 }}>−20%</span>
            </button>
          </div>
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center", alignItems:"stretch" }}>
          {PLAN_ORDER.map(key => {
            const plan = PLANS[key];
            const isCurrent = key === currentPlan;
            const aiLimit = AI_LIMITS[key] || 0;
            return (
              <div key={key} style={{ flex:1, minWidth:250, position:"relative" }}>
                {justBought === key && (
                  <div style={{ position:"absolute", inset:0, zIndex:10, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(2px)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ fontSize:16, fontWeight:800, color:C.green, fontFamily:F }}>✅ Adquirido!</div>
                  </div>
                )}
                <PlanCard plan={plan} isAnnual={annual} isCurrent={isCurrent} onSelect={handleSelect} aiLimit={aiLimit} aiExpansion={AI_EXPANSION} />

                {/* Show AI limit badge */}
                <div style={{ fontSize:10, color:C.textMuted, textAlign:"center", marginTop:6, fontFamily:F }}>
                  {key === "ia" ? `🤖 ${aiLimit} análises/mês inclusas` : key === "evidencia" ? `🤖 ${aiLimit} análises IA/mês inclusas` : key === "clinicas" ? `🤖 ${aiLimit} análises IA/mês inclusas` : "🔹 IA avulsa: R$ 4,90/análise"}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop:32, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px", maxWidth:700, marginLeft:"auto", marginRight:"auto", textAlign:"center" }}>
          <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6, margin:0 }}>
            💡 <strong style={{ color:C.green }}>Evidência</strong> inclui <strong>30 análises de IA/mês</strong> · <strong style={{ color:C.green }}>Clínicas</strong> inclui <strong>50 análises/mês</strong> · <strong style={{ color:C.green }}>IA Premium</strong> (R$ 79,90) inclui <strong>300 análises/mês</strong> + CIF Automatizada.
            Acima do limite: <strong>R$ {AI_EXPANSION.pricePerAnalysis.toFixed(2)}/análise avulsa</strong> — paga só quando usar.
          </p>
        </div>
      </div>
    </div>
  );
}
