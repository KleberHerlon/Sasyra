// @ts-nocheck
const OBJETIVO_PARAMS = {
  hipertrofia: {
    label: "Hipertrofia",
    series: { min: 3, max: 5 },
    repeticoes: { min: 6, max: 12 },
    intensidade: { min: 67, max: 85 },
    descanso: { min: 60, max: 90, unidade: "s" },
    progressaoMensal: 0.05,
  },
  forca: {
    label: "Força",
    series: { min: 3, max: 5 },
    repeticoes: { min: 1, max: 6 },
    intensidade: { min: 85, max: 100 },
    descanso: { min: 120, max: 300, unidade: "s" },
    progressaoMensal: 0.03,
  },
  resistencia: {
    label: "Resistência Muscular",
    series: { min: 2, max: 4 },
    repeticoes: { min: 12, max: 20 },
    intensidade: { min: 50, max: 67 },
    descanso: { min: 30, max: 60, unidade: "s" },
    progressaoMensal: 0.04,
  },
  potencia: {
    label: "Potência",
    series: { min: 3, max: 5 },
    repeticoes: { min: 1, max: 5 },
    intensidade: { min: 80, max: 90 },
    descanso: { min: 180, max: 360, unidade: "s" },
    progressaoMensal: 0.02,
  },
  emagrecimento: {
    label: "Emagrecimento / Condicionamento",
    series: { min: 2, max: 4 },
    repeticoes: { min: 12, max: 15 },
    intensidade: { min: 50, max: 70 },
    descanso: { min: 30, max: 60, unidade: "s" },
    progressaoMensal: 0.05,
  },
  aerobico_saude: {
    label: "Saúde Cardiovascular",
    series: { min: 1, max: 1 },
    repeticoes: { min: 1, max: 1 },
    intensidade: { min: 40, max: 60 },
    descanso: { min: 0, max: 0, unidade: "s" },
    progressaoMensal: 0.03,
  },
};

const TRANSICOES_CICLO = {
  hipertrofia: { duracaoSemanas: 8, proximo: "forca", desc: "Após hipertrofia, consolidar ganhos com fase de força (4-6 semanas)" },
  forca: { duracaoSemanas: 6, proximo: "potencia", desc: "Após força, migrar para potência ou retornar à hipertrofia" },
  potencia: { duracaoSemanas: 4, proximo: "forca", desc: "Após potência, consolidar com força ou iniciar novo ciclo de hipertrofia" },
  resistencia: { duracaoSemanas: 4, proximo: "hipertrofia", desc: "Após resistência, retornar à hipertrofia para ganho de massa" },
  emagrecimento: { duracaoSemanas: 8, proximo: "hipertrofia", desc: "Após emagrecimento, priorizar recomposição com hipertrofia" },
  aerobico_saude: { duracaoSemanas: 12, proximo: "hipertrofia", desc: "Após condicionamento aeróbico, iniciar treino resistido" },
};

export function gerarMacrociclo(objetivo, nivel, totalSemanas) {
  const params = OBJETIVO_PARAMS[objetivo];
  if (!params) return null;

  const niveis = { iniciante: 1, intermediario: 0.85, avancado: 0.7 };
  const fatorNivel = niveis[nivel] || 0.85;
  const semanasMesociclo = Math.max(4, Math.round(8 * fatorNivel));

  const mesociclos = [];
  let semanaInicio = 1;
  let intensidadeAtual = params.intensidade.min;
  const intensidadeRange = params.intensidade.max - params.intensidade.min;

  while (semanaInicio <= totalSemanas) {
    const semanasRestantes = totalSemanas - semanaInicio + 1;
    const duracao = Math.min(semanasMesociclo, semanasRestantes);
    const ehDeload = mesociclos.length > 0 && mesociclos.length % 2 === 0;
    const semanaFim = semanaInicio + duracao - 1;

    const semanas = [];
    for (let s = 0; s < duracao; s++) {
      const sem = semanaInicio + s;
      const progressao = s / (duracao - 1 || 1);
      const seriesBoost = ehDeload ? -1 : Math.round(progressao * (params.series.max - params.series.min));
      const repRange = params.repeticoes.max - params.repeticoes.min;
      const reps = ehDeload
        ? Math.round(params.repeticoes.min + repRange * 0.5)
        : Math.round(params.repeticoes.max - progressao * repRange);
      const int = ehDeload
        ? intensidadeAtual - 10
        : Math.round(intensidadeAtual + progressao * intensidadeRange * 0.6);

      semanas.push({
        semana: sem,
        series: Math.min(params.series.min + seriesBoost, params.series.max),
        repeticoes: reps,
        intensidade: Math.max(int, params.intensidade.min - 10),
        tipo: ehDeload ? "Deload" : "Normal",
        volumeRelativo: ehDeload ? "60%" : "100%",
      });
    }

    mesociclos.push({
      nome: ehDeload ? `Mesociclo ${mesociclos.length + 1} — Regenerativo` : `Mesociclo ${mesociclos.length + 1} — ${params.label}`,
      semanas: `Semanas ${semanaInicio}-${semanaFim}`,
      objetivo: ehDeload ? "Deload / Recuperação" : params.label,
      duracaoSemanas: duracao,
      ehDeload,
      semanasDetalhe: semanas,
    });

    semanaInicio = semanaFim + 1;
    intensidadeAtual += intensidadeRange * 0.15;
    intensidadeAtual = Math.min(intensidadeAtual, params.intensidade.max);
  }

  return {
    objetivo,
    nivel,
    totalSemanas,
    params,
    mesociclos,
  };
}

export function gerarMicrocicloSemanal(macrociclo, semanaAtual) {
  if (!macrociclo) return null;
  for (const meso of macrociclo.mesociclos) {
    const sem = meso.semanasDetalhe.find(s => s.semana === semanaAtual);
    if (sem) return { mesociclo: meso.nome, ...sem };
  }
  return null;
}

export function sugerirTransicao(objetivoAtual, semanasCompletadas) {
  const transicao = TRANSICOES_CICLO[objetivoAtual];
  if (!transicao) return null;
  if (semanasCompletadas >= transicao.duracaoSemanas) {
    return {
      transitarPara: transicao.proximo,
      descricao: transicao.desc,
      semanasCompletadas,
      semanasMinimas: transicao.duracaoSemanas,
      prontaParaTransicao: true,
    };
  }
  return {
    transitarPara: transicao.proximo,
    descricao: transicao.desc,
    semanasCompletadas,
    semanasMinimas: transicao.duracaoSemanas,
    prontaParaTransicao: false,
    semanasRestantes: transicao.duracaoSemanas - semanasCompletadas,
  };
}

export { OBJETIVO_PARAMS, TRANSICOES_CICLO };
