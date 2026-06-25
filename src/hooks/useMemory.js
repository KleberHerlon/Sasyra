import { useState, useCallback, useEffect } from "react";

const API_BASE = "";

export function useMemory() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async (limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/memory?limit=${limit}`);
      if (!res.ok) throw new Error("Erro ao carregar histórico");
      const data = await res.json();
      setAnalyses(data.analyses || []);
    } catch (err) {
      setError(err.message);
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAnalysis = useCallback(async ({ patientName, queixa, prompt, response, inputTokens, outputTokens, model }) => {
    try {
      const res = await fetch(`${API_BASE}/api/memory/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientName, queixa, prompt, response, inputTokens, outputTokens, model }),
      });
      if (!res.ok) throw new Error("Erro ao salvar análise");
      const data = await res.json();
      setAnalyses(prev => [data.entry, ...prev]);
      return data.entry;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  useEffect(() => { fetchHistory(10); }, []);

  return { analyses, loading, error, fetchHistory, saveAnalysis };
}
