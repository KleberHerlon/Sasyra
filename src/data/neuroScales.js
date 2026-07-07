export function calcMAS(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total === 0 ? "Sem espasticidade" : total <= 6 ? "Espasticidade leve" : total <= 12 ? "Espasticidade moderada" : "Espasticidade grave";
  const color = total === 0 ? "#4ADE80" : total <= 6 ? "#FBBF24" : total <= 12 ? "#A78BFA" : "#F87171";
  return { total, level, color };
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
