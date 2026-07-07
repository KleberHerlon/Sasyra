const G = "#4ADE80";
const A = "#FBBF24";
const R = "#F87171";
const P = "#A78BFA";

export function calcVancouver(scores) {
  const p = Math.min(Number(scores.pigmentation) || 0, 2);
  const v = Math.min(Number(scores.vascularity) || 0, 3);
  const pl = Math.min(Number(scores.pliability) || 0, 5);
  const h = Math.min(Number(scores.height) || 0, 3);
  const total = p + v + pl + h;
  const level = total === 0 ? "Cicatriz normal" : total <= 4 ? "Cicatriz leve" : total <= 8 ? "Cicatriz moderada" : "Cicatriz grave";
  const color = total === 0 ? G : total <= 4 ? A : total <= 8 ? P : R;
  return { total, max: 13, pigmentation: p, vascularity: v, pliability: pl, height: h, level, color };
}

export function calcEdema(level) {
  const v = Number(level);
  const desc = v === 0 ? "Ausente" : v === 1 ? "Leve (desaparece com digito)" : v === 2 ? "Moderado (2-4mm)" : v === 3 ? "Acentuado (4-6mm)" : "Grave (>6mm)";
  const color = v === 0 ? G : v <= 1 ? A : v <= 2 ? P : R;
  return { level: v, description: desc, color };
}
