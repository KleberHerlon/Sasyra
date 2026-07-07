const G = "#4ADE80";
const A = "#FBBF24";
const R = "#F87171";
const P = "#A78BFA";
const M = "#5E7A96";

export function calcOxford(value) {
  const v = Number(value) || 0;
  const grades = [
    { grade: "0", level: "Sem contração", color: R },
    { grade: "1", level: "Esboço de contração", color: R },
    { grade: "2", level: "Contração fraca", color: A },
    { grade: "3", level: "Contração moderada", color: A },
    { grade: "4", level: "Contração boa", color: G },
    { grade: "5", level: "Contração forte", color: G },
  ];
  return grades[v] || { grade: "—", level: "Não avaliado", color: M };
}

export function calcPERFECT(perfect) {
  const p = Number(perfect.power) || 0;
  const e = Number(perfect.endurance) || 0;
  const r = Number(perfect.repetitions) || 0;
  const f = Number(perfect.fast) || 0;
  const total = p + e + r + f;
  const level = total >= 15 ? "Função excelente" : total >= 10 ? "Função boa" : total >= 5 ? "Função moderada" : "Função fraca";
  const color = total >= 15 ? G : total >= 10 ? A : total >= 5 ? P : R;
  return { total, level, color };
}
