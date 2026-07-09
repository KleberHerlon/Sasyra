// ── Escala de Coma de Glasgow (GCS) ─────────────────────────────────────────
// 3 componentes: Abertura Ocular (1-4), Resposta Verbal (1-5), Resposta Motora (1-6)
// Total: 3-15. >=13 Trauma leve / 9-12 Moderado / 4-8 Grave / <4 Coma
export function calcGlasgow(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total >= 13 ? "Trauma leve" : total >= 9 ? "Trauma moderado" : total >= 4 ? "Trauma grave" : "Coma";
  const color = total >= 13 ? "#4ADE80" : total >= 9 ? "#FBBF24" : total >= 4 ? "#F87171" : "#BE185D";
  return { total, level, color, max: 15 };
}

// ── Trunk Impairment Scale (TIS) — Controle de Tronco ───────────────────────
// 3 sub-itens: Sentado estático (0-7), Sentado dinâmico (0-10), Transferências (0-6)
// Total: 0-23. Maior = melhor controle de tronco.
export function calcTIS(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total >= 20 ? "Controle de tronco preservado" : total >= 14 ? "Déficit leve" : total >= 7 ? "Déficit moderado" : "Déficit grave";
  const color = total >= 20 ? "#4ADE80" : total >= 14 ? "#FBBF24" : total >= 7 ? "#A78BFA" : "#F87171";
  return { total, level, color, max: 23 };
}

export function calcMAS(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  // 12 itens (6 grupos × 2 lados), max 48. Cutoffs recalibrados para 12 itens.
  const level = total === 0 ? "Sem espasticidade" : total <= 12 ? "Espasticidade leve" : total <= 24 ? "Espasticidade moderada" : "Espasticidade grave";
  const color = total === 0 ? "#4ADE80" : total <= 12 ? "#FBBF24" : total <= 24 ? "#A78BFA" : "#F87171";
  return { total, level, color, max: 48 };
}

export function calcBBS(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total >= 16 ? "Baixo risco de queda" : total >= 10 ? "Médio risco de queda" : "Alto risco de queda";
  const color = total >= 16 ? "#4ADE80" : total >= 10 ? "#FBBF24" : "#F87171";
  return { total, level, color, max: 20 };
}

export function calcMIF(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total >= 36 ? "Independência modificada" : total >= 24 ? "Dependência moderada" : total >= 12 ? "Dependência grave" : "Dependência total";
  const color = total >= 36 ? "#4ADE80" : total >= 24 ? "#FBBF24" : "#F87171";
  return { total, level, max: 42, color };
}
