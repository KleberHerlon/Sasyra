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

export function calcLCADL(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const pct = Math.round((total / 75) * 100);
  const level = pct < 20 ? "Leve" : pct < 50 ? "Moderada" : pct < 80 ? "Grave" : "Muito grave";
  const color = pct < 20 ? G : pct < 50 ? GD : pct < 80 ? A : R;
  return { total, level, color, max: 75, pct };
}

export function calcDASI(scores) {
  const weights = {
    dasi_1: 2.75, dasi_2: 1.75, dasi_3: 2.75, dasi_4: 5.50,
    dasi_5: 8.00, dasi_6: 8.00, dasi_7: 8.00, dasi_8: 2.70,
    dasi_9: 3.50, dasi_10: 8.00, dasi_11: 4.50, dasi_12: 5.25,
  };
  const max = 58.2;
  let total = 0;
  for (const [key, val] of Object.entries(scores)) {
    total += (Number(val) && weights[key]) ? weights[key] : 0;
  }
  const pct = Math.round((total / max) * 100);
  const level = pct >= 80 ? "Excelente" : pct >= 60 ? "Moderado" : pct >= 40 ? "Reduzido" : "Muito reduzido";
  const color = pct >= 80 ? G : pct >= 60 ? GD : pct >= 40 ? A : R;
  return { total, level, color, max, pct };
}
