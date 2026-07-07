const G = "#4ADE80";
const GD = "#22C55E";
const A = "#FBBF24";
const R = "#F87171";

export function calcMinnesota(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total <= 5 ? "Impacto mínimo" : total <= 30 ? "Impacto leve" : total <= 60 ? "Impacto moderado" : total <= 90 ? "Impacto grave" : "Impacto muito grave";
  const color = total <= 5 ? G : total <= 30 ? GD : total <= 60 ? A : total <= 90 ? R : "#DC2626";
  return { total, level, color, max: 105 };
}
