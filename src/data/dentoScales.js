const G = "#4ADE80";
const A = "#FBBF24";
const O = "#F59E0B";
const R = "#F87171";
const P = "#A78BFA";
const M = "#BE185D";

export function calcFonseca(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const max = 20;
  const pct = max > 0 ? (total / max) * 100 : 0;
  const level = total === 0 ? "Sem disfunção" : pct <= 15 ? "Disfunção leve" : pct <= 45 ? "Disfunção leve a moderada" : pct <= 70 ? "Disfunção moderada" : pct <= 85 ? "Disfunção severa" : "Disfunção muito severa";
  const color = total === 0 ? G : pct <= 45 ? A : pct <= 70 ? O : pct <= 85 ? R : M;
  return { total, max, pct: Math.round(pct), level, color };
}

export function calcRDCTMD(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const max = 48;
  const level = total <= 10 ? "Sem disfunção" : total <= 20 ? "Disfunção leve" : total <= 30 ? "Disfunção moderada" : "Disfunção severa";
  const color = total <= 10 ? G : total <= 20 ? A : total <= 30 ? O : R;
  return { total, max, level, color };
}
