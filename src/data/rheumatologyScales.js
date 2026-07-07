export function calcDAS28(tender28, swollen28, esr, globalHealth) {
  const t = Number(tender28) || 0;
  const s = Number(swollen28) || 0;
  const e = Number(esr) || 0;
  const g = Number(globalHealth) || 0;
  if (!t && !s && !e && !g) return null;
  const das = 0.56 * Math.sqrt(t) + 0.28 * Math.sqrt(s) + 0.70 * Math.log(e + 1) + 0.014 * g;
  const rounded = Math.round(das * 100) / 100;
  const level = rounded <= 2.6 ? "Remissão" : rounded <= 3.2 ? "Baixa atividade" : rounded <= 5.1 ? "Moderada atividade" : "Alta atividade";
  const color = rounded <= 2.6 ? "#4ADE80" : rounded <= 3.2 ? "#FBBF24" : rounded <= 5.1 ? "#A78BFA" : "#F87171";
  return { total: rounded, level, color };
}

export function calcBASDAI(scores) {
  const vals = Object.values(scores).map(v => Number(v) || 0);
  if (vals.length < 6) return null;
  const fatigue = vals[0];
  const spinalPain = vals[1];
  const jointPain = vals[2];
  const tenderness = vals[3];
  const severity = vals[4];
  const duration = vals[5];
  const total = (fatigue + spinalPain + jointPain + tenderness + ((severity + duration) / 2)) / 5;
  const rounded = Math.round(total * 100) / 100;
  const level = rounded <= 2 ? "Baixa atividade" : rounded <= 4 ? "Moderada atividade" : "Alta atividade";
  const color = rounded <= 2 ? "#4ADE80" : rounded <= 4 ? "#FBBF24" : "#F87171";
  return { total: rounded, level, color };
}

export function calcHAQ(scores) {
  const vals = Object.values(scores).map(v => Number(v) || 0);
  const total = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100 : 0;
  const level = total <= 0.5 ? "Sem incapacidade" : total <= 1.0 ? "Incapacidade leve" : total <= 2.0 ? "Incapacidade moderada" : "Incapacidade grave";
  const color = total <= 0.5 ? "#4ADE80" : total <= 1.0 ? "#FBBF24" : total <= 2.0 ? "#A78BFA" : "#F87171";
  return { total, level, color };
}

export function calcWOMAC(pain, stiffness, function_) {
  const painVals = Object.values(pain).map(v => Number(v) || 0);
  const stiffVals = Object.values(stiffness).map(v => Number(v) || 0);
  const funcVals = Object.values(function_).map(v => Number(v) || 0);
  const painTotal = painVals.reduce((a, b) => a + b, 0);
  const stiffTotal = stiffVals.reduce((a, b) => a + b, 0);
  const funcTotal = funcVals.reduce((a, b) => a + b, 0);
  const grandTotal = painTotal + stiffTotal + funcTotal;
  const level = grandTotal <= 20 ? "Leve" : grandTotal <= 48 ? "Moderada" : "Grave";
  const color = grandTotal <= 20 ? "#4ADE80" : grandTotal <= 48 ? "#FBBF24" : "#F87171";
  return { painTotal, stiffTotal, funcTotal, grandTotal, level, color };
}

export function calcWPI(wpiValue) {
  const v = Number(wpiValue) || 0;
  const level = v <= 4 ? "Baixa dor generalizada" : v <= 8 ? "Moderada" : "Alta dor generalizada";
  const color = v <= 4 ? "#4ADE80" : v <= 8 ? "#FBBF24" : "#F87171";
  return { total: v, level, color };
}
