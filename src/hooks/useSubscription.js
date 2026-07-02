import { useState, useCallback, useEffect, useMemo } from "react";
import { PLAN_LIMITS, PLAN_LABELS, AI_LIMITS, AI_OVERAGE } from "../data/plans";

const STORAGE_KEY = "sasyra_subscription";
const SUB_EVENT = "sasyra-sub-changed";

function today() { return new Date(); }

function monthKey(d) {
  const date = d || today();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function loadSub() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) {
      const parsed = JSON.parse(d);
      if (parsed.plan === "trial" || parsed.plan === "avulso") return parsed;
      return parsed;
    }
  } catch {}
  return {
    plan: "trial",
    startDate: today().toISOString(),
    nextBilling: null,
    billing: "monthly",
    invoices: [],
    extraUsers: [],
    aiAnalysesUsed: 0,
    aiPeriodStart: monthKey(),
    aiExpansion: null,
    clinicId: null,
  };
}

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
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.avulso;
  const label = PLAN_LABELS[plan] || "Avulso";
  const baseLimit = AI_LIMITS[plan] || 0;
  const overage = AI_OVERAGE[plan] || AI_OVERAGE.avulso;
  const expansionLimit = sub.aiExpansion?.analyses || 0;
  const aiLimit = baseLimit + expansionLimit;

  const currentMonth = monthKey();

  const aiPeriodStart = sub.aiPeriodStart || currentMonth;
  const needsReset = aiPeriodStart !== currentMonth;
  const aiAnalysesUsed = needsReset ? 0 : (sub.aiAnalysesUsed || 0);
  const aiRemaining = Math.max(0, aiLimit - aiAnalysesUsed);
  const hasQuota = aiLimit > 0;
  const isAvulso = plan === "avulso";
  const isTrial = plan === "trial";

  let daysUntilReset = 0;
  if (sub.startDate) {
    const start = new Date(sub.startDate);
    const now = today();
    const nextMonth = new Date(start);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    while (nextMonth <= now) nextMonth.setMonth(nextMonth.getMonth() + 1);
    daysUntilReset = Math.ceil((nextMonth - now) / 86400000);
  }

  const pctUsed = aiLimit > 0 ? Math.round((aiAnalysesUsed / aiLimit) * 100) : 0;

  const canAddPatient = useCallback((currentCount) => {
    if (plan === "avulso") return false;
    return currentCount < limits.maxPatients;
  }, [plan, limits]);

  const canUseFeature = useCallback((feature) => {
    if (plan === "avulso") return false;
    if (isTrial) return true;
    if (feature === "ai") {
      if (hasQuota && aiRemaining > 0) return true;
      return false;
    }
    if (feature === "cif") {
      return plan === "evidencia" || plan === "clinicas";
    }
    if (feature === "voiceUnlimited") return limits.voiceMinutes === Infinity;
    if (feature === "extraUsers") return plan === "clinicas";
    if (feature === "consolidatedFinance") return plan === "clinicas";
    if (feature === "financialTables") return plan !== "start" && plan !== "avulso";
    if (feature === "reportPremium") return plan === "evidencia" || plan === "clinicas";
    if (feature === "agenda") return plan !== "avulso";
    if (feature === "finance") return plan !== "avulso";
    return true;
  }, [plan, limits, hasQuota, aiRemaining, isTrial]);

  const useAI = useCallback((force = false) => {
    if (plan === "avulso") return false;
    if (force) {
      saveSub({ ...sub, aiAnalysesUsed: aiAnalysesUsed + 1, aiPeriodStart: currentMonth });
      return true;
    }
    if (aiRemaining <= 0) return false;
    saveSub({ ...sub, aiAnalysesUsed: aiAnalysesUsed + 1, aiPeriodStart: currentMonth });
    return true;
  }, [sub, saveSub, aiRemaining, aiAnalysesUsed, plan]);

  const setPlan = useCallback((newPlan, billing = "monthly") => {
    const newSub = {
      ...sub,
      plan: newPlan,
      billing,
      startDate: today().toISOString(),
      nextBilling: newPlan === "avulso" ? null : new Date(today().getTime() + (billing === "yearly" ? 365 : 30) * 86400000).toISOString(),
      aiAnalysesUsed: 0,
      aiPeriodStart: currentMonth,
      aiExpansion: null,
    };
    if (newPlan === "avulso") {
      newSub.extraUsers = [];
    }
    saveSub(newSub);
  }, [sub, saveSub]);

  const purchaseAIExpansion = useCallback((analyses = 1) => {
    if (plan === "avulso") {
      const amount = analyses * overage.pricePerAnalysis;
      saveSub({
        ...sub,
        aiExpansion: { analyses: (sub.aiExpansion?.analyses || 0) + analyses, purchasedAt: today().toISOString() },
        invoices: [...(sub.invoices || []), {
          amount, date: today().toISOString(), status: "Pago",
          desc: `${analyses} análise(s) avulsa(s) IA — R$ ${overage.pricePerAnalysis.toFixed(2)} cada`
        }],
      });
      return;
    }
    const amount = analyses * overage.pricePerAnalysis;
    saveSub({
      ...sub,
      aiExpansion: { analyses: (sub.aiExpansion?.analyses || 0) + analyses, purchasedAt: today().toISOString() },
      invoices: [...(sub.invoices || []), {
        amount, date: today().toISOString(), status: "Pago",
        desc: `${analyses} análise(s) extra(s) IA — R$ ${overage.pricePerAnalysis.toFixed(2)} cada`
      }],
    });
  }, [sub, saveSub, plan, overage]);

  const buyAndUseAI = useCallback(() => {
    if (plan === "avulso") {
      const amount = overage.pricePerAnalysis;
      const next = {
        ...sub,
        aiExpansion: { analyses: (sub.aiExpansion?.analyses || 0) + 1, purchasedAt: today().toISOString() },
        aiAnalysesUsed: 0,
        aiPeriodStart: currentMonth,
        invoices: [...(sub.invoices || []), {
          amount, date: today().toISOString(), status: "Pago",
          desc: `1 análise avulsa IA — R$ ${overage.pricePerAnalysis.toFixed(2)}`
        }],
      };
      saveSub(next);
      return true;
    }
    if (isTrial && aiRemaining <= 0) return false;
    if (hasQuota && aiRemaining > 0) {
      return useAI(false);
    }
    const amount = overage.pricePerAnalysis;
    const next = {
      ...sub,
      aiExpansion: { analyses: (sub.aiExpansion?.analyses || 0) + 1, purchasedAt: today().toISOString() },
      aiAnalysesUsed: aiAnalysesUsed + 1,
      aiPeriodStart: currentMonth,
      invoices: [...(sub.invoices || []), {
        amount, date: today().toISOString(), status: "Pago",
        desc: `1 análise extra IA — R$ ${overage.pricePerAnalysis.toFixed(2)}`
      }],
    };
    saveSub(next);
    return true;
  }, [sub, saveSub, plan, hasQuota, aiRemaining, useAI, aiAnalysesUsed, overage, isTrial]);

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
    saveSub({ ...sub, invoices: [...(sub.invoices || []), { ...invoice, date: today().toISOString() }] });
  }, [sub, saveSub]);

  const setClinicId = useCallback((id) => {
    saveSub({ ...sub, clinicId: id });
  }, [sub, saveSub]);

  return {
    sub, plan, label, limits, canAddPatient, canUseFeature, setPlan,
    addExtraUser, removeExtraUser, extraUsers: sub.extraUsers || [],
    addInvoice, invoices: sub.invoices || [],
    isAnnual: sub.billing === "yearly",
    aiRemaining, aiLimit, baseLimit, expansionLimit,
    aiAnalysesUsed, hasQuota, isAvulso,
    pctUsed, daysUntilReset,
    useAI, purchaseAIExpansion, buyAndUseAI, hasExpansion: !!sub.aiExpansion,
    overage,
    setClinicId,
  };
}
