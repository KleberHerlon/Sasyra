const G = "#4ADE80";
const A = "#FBBF24";
const O = "#F59E0B";
const R = "#F87171";
const P = "#A78BFA";

export function calcGMFCS(value) {
  const level = {
    I: { label: "Nível I — Deambula sem limitações", desc: "Marcha independente sem restrições.", color: G },
    II: { label: "Nível II — Deambula com limitações", desc: "Marcha independente com limitações em longas distâncias/equilíbrio.", color: A },
    III: { label: "Nível III — Deambula com auxílio", desc: "Usa dispositivo de mobilidade para deambular.", color: O },
    IV: { label: "Nível IV — Mobilidade limitada", desc: "Mobilidade autônoma limitada. Usa cadeira de rodas.", color: R },
    V: { label: "Nível V — Transportado em cadeira de rodas", desc: "Severamente limitado. Necessita transporte.", color: P },
  };
  return level[value] || { label: "N/A", desc: "Selecione um nível GMFCS", color: "#5E7A96" };
}

export function calcAIMS(score) {
  const s = Math.min(58, Math.max(0, Number(score) || 0));
  const level = s >= 45 ? "Desenvolvimento motor adequado" : s >= 30 ? "Atraso motor leve" : s >= 15 ? "Atraso motor moderado" : "Atraso motor grave";
  const color = s >= 45 ? G : s >= 30 ? A : s >= 15 ? O : R;
  return { total: s, max: 58, level, color };
}

export function calcMCHAT(items) {
  const count = Array.isArray(items) ? items.length : 0;
  const level = count >= 3 ? "Risco elevado" : count >= 2 ? "Risco moderado" : "Baixo risco";
  const color = count >= 3 ? R : count >= 2 ? A : G;
  return { count, level, color };
}

export function calcPEDI(score) {
  const total = Math.min(100, Math.max(0, Number(score) || 0));
  const level = total >= 80 ? "Função preservada" : total >= 50 ? "Limitação funcional moderada" : total >= 20 ? "Limitação funcional grave" : "Limitação funcional severa";
  const color = total >= 80 ? G : total >= 50 ? A : total >= 20 ? O : R;
  return { total, max: 100, level, color };
}
