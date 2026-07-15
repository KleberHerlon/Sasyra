const G = "#4ADE80";
const A = "#FBBF24";
const R = "#F87171";
const P = "#A78BFA";

export function calcMEEM(score) {
  const total = Math.min(30, Math.max(0, Number(score) || 0));
  const level = total >= 24 ? "Normal / Sem déficit" : total >= 18 ? "Déficit leve" : total >= 10 ? "Déficit moderado" : "Déficit grave";
  const color = total >= 24 ? G : total >= 18 ? A : total >= 10 ? P : R;
  return { total, level, color };
}

export function calcGDS15(score) {
  const total = Math.min(15, Math.max(0, Number(score) || 0));
  const level = total <= 5 ? "Normal" : total <= 10 ? "Depressão leve" : "Depressão grave";
  const color = total <= 5 ? G : total <= 10 ? A : R;
  return { total, level, color };
}

export function calcSarcF(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const risk = total >= 4 ? "Alto risco de sarcopenia" : "Baixo risco de sarcopenia";
  const color = total >= 4 ? R : G;
  return { total, risk, color };
}

export function calcKatz(katz) {
  const indep = Object.values(katz).filter(v => v === "Independente").length;
  const level = indep === 6 ? "A - Independência total" : indep >= 4 ? "B-D - Dependência parcial" : indep >= 2 ? "E-F - Dependência moderada" : "G - Dependência total";
  return { indep, total: indep, level };
}

export function calcLawton(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total >= 20 ? "Independência completa" : total >= 13 ? "Dependência leve/moderada" : total >= 7 ? "Dependência moderada/grave" : "Dependência grave";
  const color = total >= 20 ? G : total >= 13 ? A : R;
  return { total, max: 24, level, color };
}

export function calcTinetti(balanceScores, gaitScores) {
  const bal = Object.values(balanceScores).reduce((a, b) => a + (Number(b) || 0), 0);
  const ga = Object.values(gaitScores).reduce((a, b) => a + (Number(b) || 0), 0);
  const total = bal + ga;
  const level = total >= 24 ? "Baixo risco de queda" : total >= 19 ? "Médio risco de queda" : "Alto risco de queda";
  const color = total >= 24 ? G : total >= 19 ? A : R;
  return { total, balance: bal, gait: ga, level, color };
}

export function calcBBS(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total <= 20 ? "Alto risco de queda" : total <= 40 ? "Médio risco de queda" : "Baixo risco de queda";
  const color = total <= 20 ? R : total <= 40 ? A : G;
  return { total, max: 56, level, color };
}

export function calcFragilidade(indicators) {
  const count = Object.values(indicators).filter(v => v).length;
  const level = count === 0 ? "Não frágil" : count <= 2 ? "Pré-frágil" : "Frágil";
  const color = count === 0 ? G : count <= 2 ? A : R;
  return { count, level, color };
}

export function calcSPPB(scores) {
  const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const level = total >= 10 ? "Bom desempenho" : total >= 7 ? "Desempenho moderado" : total >= 4 ? "Desempenho baixo" : "Desempenho muito baixo";
  const color = total >= 10 ? G : total >= 7 ? A : total >= 4 ? P : R;
  return { total, max: 12, level, color };
}
