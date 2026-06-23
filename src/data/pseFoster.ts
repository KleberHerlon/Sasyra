// @ts-nocheck
const PSE_CR10 = [
  { valor: 0, rotulo: "Repouso", desc: "Nenhum esforço" },
  { valor: 1, rotulo: "Muito, muito leve", desc: "Esforço mínimo" },
  { valor: 2, rotulo: "Muito leve", desc: "Atividade leve, perceptível" },
  { valor: 3, rotulo: "Leve", desc: "Esforço leve, sensação confortável" },
  { valor: 4, rotulo: "Moderado", desc: "Esforço moderado, respiração mais profunda" },
  { valor: 5, rotulo: "Um pouco pesado", desc: "Esforço alto, começa a cansar" },
  { valor: 6, rotulo: "Pesado", desc: "Esforço pesado, desconforto" },
  { valor: 7, rotulo: "Muito pesado", desc: "Esforço intenso, respiração ofegante" },
  { valor: 8, rotulo: "Muito pesado+", desc: "Esforço muito intenso" },
  { valor: 9, rotulo: "Extremamente pesado", desc: "Quase máximo, dificuldade extrema" },
  { valor: 10, rotulo: "Máximo", desc: "Exaustão total, não consegue continuar" },
];

export { PSE_CR10 };

export function calcInternalLoad(pse, duracaoMinutos) {
  const ps = parseFloat(pse) || 0;
  const dur = parseFloat(duracaoMinutos) || 0;
  if (ps <= 0 || dur <= 0) return null;
  return {
    pse: ps,
    duracao: dur,
    cargaInternaUA: +(ps * dur).toFixed(0),
    pseLabel: PSE_CR10.find(p => p.valor === Math.round(ps))?.rotulo || "",
  };
}

export function calcMonotony(sessoesSemana) {
  if (!sessoesSemana || sessoesSemana.length < 2) return null;
  const cargas = sessoesSemana.map(s => s.cargaInternaUA || calcInternalLoad(s.pse, s.duracaoMinutos)?.cargaInternaUA || 0);
  const media = cargas.reduce((a, b) => a + b, 0) / cargas.length;
  const dp = Math.sqrt(cargas.reduce((sq, v) => sq + (v - media) ** 2, 0) / cargas.length);
  if (dp === 0) return { monotonia: 1, strain: media * 1, cargaSemanalTotal: cargas.reduce((a, b) => a + b, 0), media, dp };
  return {
    monotonia: +(media / dp).toFixed(2),
    strain: +((media / dp) * cargas.reduce((a, b) => a + b, 0)).toFixed(0),
    cargaSemanalTotal: cargas.reduce((a, b) => a + b, 0),
    media: +media.toFixed(0),
    dp: +dp.toFixed(1),
  };
}

export function deloadSuggestion(monotonyResult, ultimasSessoes) {
  const sugestoes = [];
  if (!monotonyResult) return sugestoes;

  if (monotonyResult.strain > 3000) {
    sugestoes.push({
      nivel: "alto",
      mensagem: `Strain muito alto (${monotonyResult.strain}). Risco de overreaching. Recomenda-se deload por 5-7 dias.`,
      acao: "Reduzir volume em 50-60% e intensidade em 20-30%.",
    });
  } else if (monotonyResult.strain > 2500) {
    sugestoes.push({
      nivel: "medio",
      mensagem: `Strain elevado (${monotonyResult.strain}). Limiar próximo.`,
      acao: "Considerar deload leve ou redução de volume em 30% na próxima sessão.",
    });
  }

  if (ultimasSessoes && ultimasSessoes.length >= 3) {
    const ultimosPSE = ultimasSessoes.slice(-3).map(s => parseFloat(s.pse) || 0);
    if (ultimosPSE.every(p => p >= 8)) {
      sugestoes.push({
        nivel: "alto",
        mensagem: "3+ sessões consecutivas com PSE ≥ 8 (muito pesado).",
        acao: "Deload obrigatório na próxima sessão. Reduzir volume em 50%.",
      });
    }
    const pseMedio3 = ultimosPSE.reduce((a, b) => a + b, 0) / ultimosPSE.length;
    if (pseMedio3 <= 3 && ultimasSessoes.length >= 6) {
      sugestoes.push({
        nivel: "informativo",
        mensagem: `PSE médio das últimas 3 sessões = ${pseMedio3.toFixed(1)} (leve). Aluno pode estar subtreinando.`,
        acao: "Considerar aumentar intensidade ou volume na próxima semana.",
      });
    }
  }

  return sugestoes;
}

export const PSE_COLORS = [
  "#4ADE80", "#4ADE80", "#A3E635", "#A3E635",
  "#FBBF24", "#FBBF24", "#FB923C", "#FB923C",
  "#F87171", "#F87171", "#EF4444",
];
