export function calcYBalance(scores, legLength) {
  if (!scores) return null;
  const len = Number(legLength) || 1;
  const d = {
    anterior: Number(scores.anteriorD) || 0,
    posteromedial: Number(scores.posteromedialD) || 0,
    posterolateral: Number(scores.posterolateralD) || 0,
  };
  const e = {
    anterior: Number(scores.anteriorE) || 0,
    posteromedial: Number(scores.posteromedialE) || 0,
    posterolateral: Number(scores.posterolateralE) || 0,
  };
  const totalD = d.anterior + d.posteromedial + d.posterolateral;
  const totalE = e.anterior + e.posteromedial + e.posterolateral;
  const compositeD = len > 0 ? Math.round(totalD / (3 * len) * 100 * 10) / 10 : 0;
  const compositeE = len > 0 ? Math.round(totalE / (3 * len) * 100 * 10) / 10 : 0;
  return {
    d, e, totalD, totalE, compositeD, compositeE,
    lsi: totalE > 0 ? Math.round(totalD / totalE * 100) : 0,
  };
}

export function calcLSI(affected, unaffected) {
  const a = Number(affected) || 0;
  const u = Number(unaffected) || 0;
  if (!u || u === 0) return 0;
  if (a === 0) return 0;
  return Math.round(a / u * 100);
}

export function calcLSIBidirectional(direito, esquerdo, ladoAfetado) {
  const d = Number(direito) || 0;
  const e = Number(esquerdo) || 0;
  if (!d || !e) return 0;
  if (ladoAfetado === "Direito") return Math.round(d / e * 100);
  return Math.round(e / d * 100);
}

export function calcRTS(criteria) {
  if (!criteria || criteria.length === 0) return { total: 0, met: 0, pct: 0, status: "Sem critérios preenchidos", color: "#5E7A96" };
  const met = criteria.filter(c => c.met).length;
  const total = criteria.length;
  const pct = Math.round(met / total * 100);
  const status = pct >= 90 ? "Apto para retorno ao esporte" : pct >= 70 ? "Próximo do retorno — reforçar critérios pendentes" : "Continua em reabilitação — critérios insuficientes";
  const color = pct >= 90 ? "#4ADE80" : pct >= 70 ? "#FBBF24" : "#F87171";
  return { total, met, pct, status, color };
}
