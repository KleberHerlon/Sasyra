import { useState, useCallback, useEffect } from "react";
import { PLAN_LIMITS, PLAN_LABELS, AI_LIMITS, AI_EXPANSION } from "../data/plans";

const STORAGE_KEY = "sasyra_subscription";
const SUB_EVENT = "sasyra-sub-changed";

function loadSub() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) return JSON.parse(d);
  } catch {}
  return {
    plan: "start", startDate: new Date().toISOString(),
    nextBilling: new Date(Date.now() + 30*86400000).toISOString(),
    billing: "monthly", invoices: [], extraUsers: [],
    aiAnalysesUsed: 0, aiPeriodStart: new Date().toISOString().slice(0,7),
    aiExpansion: null,
  };
}

function monthKey() { return new Date().toISOString().slice(0,7); }

export function useSubscription() {
  const [sub, setSubState] = useState(loadSub);

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setSubState(JSON.parse(raw));
      } catch {}
    };
    window.addEventListener(SUB_EVENT, handler);
    return () => window.removeEventListener(SUB_EVENT, handler);
  }, []);

  const saveSub = useCallback((next) => {
    setSubState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    window.dispatchEvent(new CustomEvent(SUB_EVENT));
  }, []);

  const plan = sub.plan;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.start;
  const label = PLAN_LABELS[plan] || "Start";
  const baseLimit = AI_LIMITS[plan] || 0;
  const expansionLimit = sub.aiExpansion?.analyses || 0;
  const aiLimit = baseLimit + expansionLimit;

  // Reset usage counter if month changed
  const currentMonth = monthKey();
  if (sub.aiPeriodStart !== currentMonth) {
    saveSub({ ...sub, aiAnalysesUsed: 0, aiPeriodStart: currentMonth });
  }

  const aiRemaining = Math.max(0, aiLimit - sub.aiAnalysesUsed);

  const canAddPatient = useCallback((currentCount) => {
    return currentCount < limits.maxPatients;
  }, [limits]);

  const canUseFeature = useCallback((feature) => {
    if (feature === "ai" || feature === "cif") {
      if (plan === "ia" && aiRemaining > 0) return true;
      if (expansionLimit > 0 && aiRemaining > 0) return true;
      return false;
    }
    if (feature === "voiceUnlimited") return limits.voiceMinutes === Infinity;
    if (feature === "extraUsers") return plan === "clinicas";
    if (feature === "consolidatedFinance") return plan === "clinicas";
    if (feature === "financialTables") return plan !== "start";
    return true;
  }, [plan, limits, aiRemaining, expansionLimit]);

  const useAI = useCallback((force = false) => {
    if (force) {
      saveSub({ ...sub, aiAnalysesUsed: sub.aiAnalysesUsed + 1, aiPeriodStart: currentMonth });
      return true;
    }
    if (aiRemaining <= 0) return false;
    saveSub({ ...sub, aiAnalysesUsed: sub.aiAnalysesUsed + 1, aiPeriodStart: currentMonth });
    return true;
  }, [sub, saveSub, aiRemaining]);

  const setPlan = useCallback((newPlan, billing = "monthly") => {
    saveSub({
      ...sub,
      plan: newPlan,
      billing,
      nextBilling: new Date(Date.now() + (billing === "yearly" ? 365 : 30) * 86400000).toISOString(),
      aiAnalysesUsed: 0, aiPeriodStart: currentMonth,
      aiExpansion: null,
    });
  }, [sub, saveSub]);

  const purchaseAIExpansion = useCallback((analyses = 1) => {
    if (plan === "ia") return;
    const amount = analyses * AI_EXPANSION.pricePerAnalysis;
    saveSub({
      ...sub,
      aiExpansion: { analyses: (sub.aiExpansion?.analyses || 0) + analyses, purchasedAt: new Date().toISOString() },
      invoices: [...(sub.invoices || []), {
        amount, date: new Date().toISOString(), status: "Pago",
        desc: `${analyses} análise(s) avulsa(s) IA — R$ ${AI_EXPANSION.pricePerAnalysis.toFixed(2)} cada`
      }],
    });
  }, [sub, saveSub, plan]);

  const buyAndUseAI = useCallback(() => {
    if (plan === "ia") return useAI(true);
    const amount = AI_EXPANSION.pricePerAnalysis;
    const next = {
      ...sub,
      aiExpansion: { analyses: (sub.aiExpansion?.analyses || 0) + 1, purchasedAt: new Date().toISOString() },
      aiAnalysesUsed: sub.aiAnalysesUsed + 1,
      aiPeriodStart: currentMonth,
      invoices: [...(sub.invoices || []), {
        amount, date: new Date().toISOString(), status: "Pago",
        desc: `1 análise avulsa IA — R$ ${AI_EXPANSION.pricePerAnalysis.toFixed(2)}`
      }],
    };
    saveSub(next);
    return true;
  }, [sub, saveSub, plan]);

  const addExtraUser = useCallback((user) => {
    if (plan !== "clinicas") return;
    saveSub({ ...sub, extraUsers: [...(sub.extraUsers || []), user] });
  }, [sub, saveSub, plan]);

  const removeExtraUser = useCallback((index) => {
    const list = [...(sub.extraUsers || [])];
    list.splice(index, 1);
    saveSub({ ...sub, extraUsers: list });
  }, [sub, saveSub]);

  const addInvoice = useCallback((invoice) => {
    saveSub({ ...sub, invoices: [...(sub.invoices || []), { ...invoice, date: new Date().toISOString() }] });
  }, [sub, saveSub]);

  return {
    sub, plan, label, limits, canAddPatient, canUseFeature, setPlan,
    addExtraUser, removeExtraUser, extraUsers: sub.extraUsers || [],
    addInvoice, invoices: sub.invoices || [],
    isAnnual: sub.billing === "yearly",
    aiRemaining, aiLimit, baseLimit, expansionLimit,
    useAI, purchaseAIExpansion, buyAndUseAI, hasExpansion: !!sub.aiExpansion,
  };
}
