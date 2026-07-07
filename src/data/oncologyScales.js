export function calcECOG(value) {
  const labels = [
    "0 — Atividade normal, sem restrições",
    "1 — Restrito para atividade física intensa, deambula",
    "2 — Deambula, capaz de autocuidado, incapaz para trabalhar",
    "3 — Autocuidado limitado, confinado ao leito >50% do dia",
    "4 — Incapacidade completa, confinado ao leito",
    "5 — Óbito",
  ];
  const colors = ["#4ADE80", "#4ADE80", "#FBBF24", "#FBBF24", "#F87171", "#F87171"];
  return { value: Number(value), label: labels[value] || "", color: colors[value] || "#5E7A96" };
}

export function calcKPS(value) {
  const v = Number(value);
  let label, color;
  if (v >= 80) { label = "Atividade normal, sem queixas"; color = "#4ADE80"; }
  else if (v >= 60) { label = "Autocuidado, incapaz para trabalho"; color = "#FBBF24"; }
  else if (v >= 40) { label = "Incapaz para atividade, necessita cuidados"; color = "#F87171"; }
  else if (v >= 10) { label = "Confinado ao leito, doença progressiva"; color = "#F87171"; }
  else { label = "Óbito"; color = "#364D62"; }
  return { value: v, label, color };
}

export function calcEORTC(scores) {
  const functionalItems = ["physical", "role", "emotional", "cognitive", "social"];
  const symptomItems = ["fatigue", "nauseaVomiting", "pain", "dyspnea", "insomnia", "appetiteLoss", "constipation", "diarrhea"];
  const functional = {};
  let fSum = 0, fCount = 0;
  functionalItems.forEach(k => {
    const raw = Number(scores[k]) || 0;
    const transformed = raw === 0 ? 100 : 100 - (raw - 1) * 100 / 3;
    functional[k] = { raw, transformed: Math.round(transformed) };
    if (scores[k] !== undefined && scores[k] !== "") { fSum += Math.round(transformed); fCount++; }
  });
  const symptom = {};
  let sSum = 0, sCount = 0;
  symptomItems.forEach(k => {
    const raw = Number(scores[k]) || 0;
    const transformed = raw === 0 ? 0 : (raw - 1) * 100 / 3;
    symptom[k] = { raw, transformed: Math.round(transformed) };
    if (scores[k] !== undefined && scores[k] !== "") { sSum += Math.round(transformed); sCount++; }
  });
  const globalRaw = Number(scores.global) || 0;
  const global = globalRaw === 0 ? 0 : Math.round((globalRaw - 1) * 100 / 6);
  const functionalAvg = fCount > 0 ? Math.round(fSum / fCount) : 0;
  const symptomAvg = sCount > 0 ? Math.round(sSum / sCount) : 0;
  return { functional, functionalAvg, symptom, symptomAvg, global };
}

export function calcESAS(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total <= 10 ? "Sintomas leves" : total <= 30 ? "Sintomas moderados" : "Sintomas graves";
  const color = total <= 10 ? "#4ADE80" : total <= 30 ? "#FBBF24" : "#F87171";
  return { total, level, color };
}
