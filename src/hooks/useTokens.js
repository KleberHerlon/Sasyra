import { useState, useCallback, useEffect } from "react";

const API_BASE = "";

export function useTokens() {
  const [summary, setSummary] = useState({ currentMonth: {}, allTime: {}, months: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/tokens`);
      if (!res.ok) throw new Error("Erro ao carregar uso de tokens");
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setError(err.message);
      setSummary({ currentMonth: {}, allTime: {}, months: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSummary(); }, []);

  const estimatedCost = useCallback((inputTokens, outputTokens) => {
    const INPUT_COST_PER_M = 0.27;
    const OUTPUT_COST_PER_M = 1.10;
    return (inputTokens / 1_000_000 * INPUT_COST_PER_M) + (outputTokens / 1_000_000 * OUTPUT_COST_PER_M);
  }, []);

  return { summary, loading, error, fetchSummary, estimatedCost };
}
