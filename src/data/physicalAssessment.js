export function calcPollock7Dobras(skinfolds, sexo, idade) {
  const { peitoral, abdominal, coxa, suprailiaca, subescapular, tricipital, axilarMedia } = skinfolds;
  const soma = peitoral + abdominal + coxa + suprailiaca + subescapular + tricipital + axilarMedia;
  let dc;
  if (sexo === "Masculino") {
    dc = 1.112 - 0.00043499 * soma + 0.00000055 * soma * soma - 0.00028826 * idade;
  } else {
    dc = 1.097 - 0.00046971 * soma + 0.00000056 * soma * soma - 0.00012828 * idade;
  }
  const bf = (4.95 / dc - 4.5) * 100;
  return {
    densidadeCorporal: +dc.toFixed(4),
    percentualGordura: +bf.toFixed(1),
    massaGorda: null,
    massaMagra: null,
    protocolo: "Pollock 7 Dobras",
    referencia: "Pollock ML, Schmidt DH, Jackson AS. Measurement of cardiorespiratory fitness and body composition in the clinical setting. Compr Ther. 1980;6(9):12-27.",
  };
}

export function calcPollock3Dobras(skinfolds, sexo, idade) {
  const { abdominal, coxa, peitoral } = skinfolds;
  const soma = abdominal + coxa + peitoral;
  let dc;
  if (sexo === "Masculino") {
    dc = 1.10938 - 0.0008267 * soma + 0.0000016 * soma * soma - 0.0002574 * idade;
  } else {
    dc = 1.089733 - 0.0009245 * soma + 0.0000025 * soma * soma - 0.0000979 * idade;
  }
  const bf = (4.95 / dc - 4.5) * 100;
  return {
    densidadeCorporal: +dc.toFixed(4),
    percentualGordura: +bf.toFixed(1),
    massaGorda: null,
    massaMagra: null,
    protocolo: "Pollock 3 Dobras",
    referencia: "Pollock ML, Jackson AS. Generalized equations for predicting body density of men. Br J Nutr. 1978;40(3):497-504.",
  };
}

export function calcVO2maxCooper(distanciaMetros, sexo, idade) {
  const vo2 = (distanciaMetros - 504.9) / 44.73;
  const tabela = TABELA_COOPER[sexo]?.[faixaEtaria(idade)];
  const classificacao = tabela ? Object.entries(tabela).find(([, range]) => vo2 >= range[0] && vo2 <= range[1])?.[0] || "Não classificado" : "—";
  return {
    vo2max: +vo2.toFixed(1),
    distancia: distanciaMetros,
    classificacao,
    referencia: "Cooper KH. A means of assessing maximal oxygen intake. JAMA. 1968;203(3):201-204.",
  };
}

export function calcVO2maxRockport(pesoKg, sexo, idade, tempoMinutos, frequenciaCardiaca) {
  const t = tempoMinutos;
  const vo2 = 132.853 - 0.0769 * pesoKg - 0.3877 * idade + 6.315 * (sexo === "Masculino" ? 1 : 0) - 3.2649 * t - 0.1565 * frequenciaCardiaca;
  const tabela = TABELA_VO2[sexo]?.[faixaEtaria(idade)];
  const classificacao = tabela ? Object.entries(tabela).find(([, range]) => vo2 >= range[0] && vo2 <= range[1])?.[0] || "Não classificado" : "—";
  return {
    vo2max: +vo2.toFixed(1),
    tempo: t,
    frequenciaCardiaca,
    classificacao,
    referencia: "Kline GM, Porcari JP, Hintermeister R, et al. Estimation of VO2max from a one-mile track walk. Med Sci Sports Exerc. 1987;19(3):253-259.",
  };
}

export function calc1RMPreditivo(carga, repeticoes) {
  if (repeticoes === 1) return { rm: carga, formula: "Direto", bloqueio: null };
  if (repeticoes > 10) {
    return {
      rm: null,
      rmEpley: null,
      rmBrzycki: null,
      rmLombardi: null,
      repeticoes,
      carga,
      classe: null,
      bloqueio: {
        tipo: "alerta",
        mensagem: `Com ${repeticoes} repetições o cálculo de 1RM não é preciso. As fórmulas funcionam melhor entre 2 e 10 repetições.`,
        alternativa: "Use uma carga maior e refaça o teste com 2 a 10 repetições. Ou utilize o teste de 10RM (carga máxima para 10 repetições).",
        referencia: "LeSuer DA, et al. J Strength Cond Res. 1997;11(1):25-29.",
      },
    };
  }
  const rmEpley = carga * (1 + repeticoes / 30);
  const rmBrzycki = carga * (36 / (37 - repeticoes));
  const rmLombardi = carga * repeticoes ** 0.1;
  const rm = +((rmEpley + rmBrzycki + rmLombardi) / 3).toFixed(1);
  let classe;
  if (repeticoes <= 1) classe = "Força Máxima (1RM)";
  else if (repeticoes <= 6) classe = "Força Máxima — Potência";
  else if (repeticoes <= 12) classe = "Hipertrofia";
  else if (repeticoes <= 15) classe = "Hipertrofia / Resistência";
  else classe = "Resistência Muscular";
  return {
    rm,
    rmEpley: +rmEpley.toFixed(1),
    rmBrzycki: +rmBrzycki.toFixed(1),
    rmLombardi: +rmLombardi.toFixed(1),
    repeticoes,
    carga,
    classe,
    bloqueio: null,
    referencia: "LeSuer DA, McCormick JH, Mayhew JL, Wasserstein RL, Arnold MD. The accuracy of prediction equations for estimating 1-RM performance. J Strength Cond Res. 1997;11(1):25-29.",
  };
}

export function calcPercentual1RM(rm, carga) {
  if (!rm || !carga) return null;
  return +((carga / rm) * 100).toFixed(0);
}

export function calcZonaTreino(rm, percentualInicial, percentualFinal) {
  if (!rm) return null;
  return {
    cargaMinima: +(rm * percentualInicial / 100).toFixed(1),
    cargaMaxima: +(rm * percentualFinal / 100).toFixed(1),
    percentualInicial,
    percentualFinal,
  };
}

function faixaEtaria(idade) {
  if (idade < 20) return "20-29";
  if (idade < 30) return "20-29";
  if (idade < 40) return "30-39";
  if (idade < 50) return "40-49";
  if (idade < 60) return "50-59";
  return "60+";
}

const TABELA_COOPER = {
  Masculino: {
    "20-29": { "Muito Ruim": [0, 32], "Ruim": [32.1, 37], "Regular": [37.1, 42], "Bom": [42.1, 46], "Excelente": [46.1, 52], "Superior": [52.1, 999] },
    "30-39": { "Muito Ruim": [0, 30], "Ruim": [30.1, 34], "Regular": [34.1, 39], "Bom": [39.1, 43], "Excelente": [43.1, 49], "Superior": [49.1, 999] },
    "40-49": { "Muito Ruim": [0, 26], "Ruim": [26.1, 31], "Regular": [31.1, 36], "Bom": [36.1, 40], "Excelente": [40.1, 44], "Superior": [44.1, 999] },
    "50-59": { "Muito Ruim": [0, 24], "Ruim": [24.1, 28], "Regular": [28.1, 33], "Bom": [33.1, 37], "Excelente": [37.1, 41], "Superior": [41.1, 999] },
    "60+": { "Muito Ruim": [0, 22], "Ruim": [22.1, 26], "Regular": [26.1, 31], "Bom": [31.1, 35], "Excelente": [35.1, 39], "Superior": [39.1, 999] },
  },
  Feminino: {
    "20-29": { "Muito Ruim": [0, 26], "Ruim": [26.1, 31], "Regular": [31.1, 36], "Bom": [36.1, 40], "Excelente": [40.1, 44], "Superior": [44.1, 999] },
    "30-39": { "Muito Ruim": [0, 24], "Ruim": [24.1, 29], "Regular": [29.1, 34], "Bom": [34.1, 38], "Excelente": [38.1, 42], "Superior": [42.1, 999] },
    "40-49": { "Muito Ruim": [0, 22], "Ruim": [22.1, 27], "Regular": [27.1, 32], "Bom": [32.1, 36], "Excelente": [36.1, 40], "Superior": [40.1, 999] },
    "50-59": { "Muito Ruim": [0, 20], "Ruim": [20.1, 25], "Regular": [25.1, 30], "Bom": [30.1, 34], "Excelente": [34.1, 38], "Superior": [38.1, 999] },
    "60+": { "Muito Ruim": [0, 18], "Ruim": [18.1, 23], "Regular": [23.1, 28], "Bom": [28.1, 32], "Excelente": [32.1, 36], "Superior": [36.1, 999] },
  },
};

const TABELA_VO2 = {
  Masculino: {
    "20-29": { "Muito Ruim": [0, 32], "Ruim": [32.1, 36], "Regular": [36.1, 40], "Bom": [40.1, 44], "Excelente": [44.1, 48], "Superior": [48.1, 999] },
    "30-39": { "Muito Ruim": [0, 30], "Ruim": [30.1, 34], "Regular": [34.1, 38], "Bom": [38.1, 42], "Excelente": [42.1, 46], "Superior": [46.1, 999] },
    "40-49": { "Muito Ruim": [0, 26], "Ruim": [26.1, 30], "Regular": [30.1, 35], "Bom": [35.1, 40], "Excelente": [40.1, 44], "Superior": [44.1, 999] },
  },
  Feminino: {
    "20-29": { "Muito Ruim": [0, 26], "Ruim": [26.1, 30], "Regular": [30.1, 34], "Bom": [34.1, 38], "Excelente": [38.1, 42], "Superior": [42.1, 999] },
    "30-39": { "Muito Ruim": [0, 24], "Ruim": [24.1, 28], "Regular": [28.1, 33], "Bom": [33.1, 37], "Excelente": [37.1, 41], "Superior": [41.1, 999] },
    "40-49": { "Muito Ruim": [0, 22], "Ruim": [22.1, 26], "Regular": [26.1, 31], "Bom": [31.1, 35], "Excelente": [35.1, 39], "Superior": [39.1, 999] },
  },
};

export function calcISAK6Dobras(skinfolds, sexo, idade, pesoKg) {
  const { tricipital, subescapular, suprailiaca, abdominal, coxa, panturrilha } = skinfolds;
  const soma = tricipital + subescapular + suprailiaca + abdominal + coxa + panturrilha;
  let dc;
  if (sexo === "Masculino") {
    dc = 1.112 - 0.00043499 * soma + 0.00000055 * soma * soma - 0.00028826 * idade;
  } else {
    dc = 1.097 - 0.00046971 * soma + 0.00000056 * soma * soma - 0.00012828 * idade;
  }
  const bf = (4.95 / dc - 4.5) * 100;
  const mg = pesoKg ? +(pesoKg * bf / 100).toFixed(1) : null;
  const mm = pesoKg ? +(pesoKg - mg).toFixed(1) : null;
  return {
    densidadeCorporal: +dc.toFixed(4),
    percentualGordura: +bf.toFixed(1),
    massaGorda: mg,
    massaMagra: mm,
    somatoriaDobras: +soma.toFixed(1),
    protocolo: "ISAK 6 Dobras",
    referencia: "ISAK. International Standards for Anthropometric Assessment. International Society for the Advancement of Kinanthropometry; 2023.",
  };
}

export function calcBioimpedancia(resistenciaOhm, reactanciaOhm, sexo, idade, pesoKg, alturaCm) {
  const h = alturaCm / 100;
  const imc = pesoKg / (h * h);
  const rc = resistenciaOhm;
  const xc = reactanciaOhm;
  const angFase = Math.atan(xc / rc) * (180 / Math.PI);
  let aguaTotal, massaMagra, percentualGordura;
  if (sexo === "Masculino") {
    aguaTotal = 0.396 * h * h / rc + 0.143 * pesoKg + 8.4;
    massaMagra = aguaTotal / 0.732;
  } else {
    aguaTotal = 0.382 * h * h / rc + 0.105 * pesoKg + 8.3;
    massaMagra = aguaTotal / 0.729;
  }
  percentualGordura = +((pesoKg - massaMagra) / pesoKg * 100).toFixed(1);
  return {
    percentualGordura,
    massaMagra: +massaMagra.toFixed(1),
    massaGorda: +(pesoKg - massaMagra).toFixed(1),
    aguaTotal: +aguaTotal.toFixed(1),
    anguloFase: +angFase.toFixed(1),
    imc: +imc.toFixed(1),
    protocolo: "Bioimpedância (BIA)",
    referencia: "Kyle UG, Bosaeus I, De Lorenzo AD, et al. Bioelectrical impedance analysis — part I: review of principles and methods. Clin Nutr. 2004;23(5):1226-1243.",
  };
}

function isSupabaseConfigured() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && url !== "https://sua-url-supabase.supabase.co" && key && key !== "sua-anon-key-aqui";
}

export function savePhysicalAssessment(studentId, assessment) {
  if (!studentId) return;
  const key = "pe_data";
  const raw = localStorage.getItem(key);
  const data = raw ? JSON.parse(raw) : {};
  if (!data[studentId]) data[studentId] = { assessments: [], treinos: [] };
  const idx = data[studentId].assessments.findIndex(a => a.id === assessment.id);
  if (idx >= 0) data[studentId].assessments[idx] = assessment;
  else data[studentId].assessments.push(assessment);
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadPhysicalAssessments(studentId) {
  if (!studentId) return [];
  const key = "pe_data";
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  const data = JSON.parse(raw);
  return data[studentId]?.assessments || [];
}

export function getBFEvolution(studentId) {
  const assessments = loadPhysicalAssessments(studentId);
  return assessments
    .filter(a => a.percentualGordura != null)
    .map(a => ({ data: a.data, percentualGordura: a.percentualGordura, protocolo: a.protocolo }))
    .sort((a, b) => a.data.localeCompare(b.data));
}

export function saveTreino(studentId, treino) {
  if (!studentId) return;
  const key = "pe_data";
  const raw = localStorage.getItem(key);
  const data = raw ? JSON.parse(raw) : {};
  if (!data[studentId]) data[studentId] = { assessments: [], treinos: [] };
  const idx = data[studentId].treinos.findIndex(t => t.id === treino.id);
  if (idx >= 0) data[studentId].treinos[idx] = treino;
  else data[studentId].treinos.push(treino);
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadTreinos(studentId) {
  if (!studentId) return [];
  const key = "pe_data";
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  const data = JSON.parse(raw);
  return data[studentId]?.treinos || [];
}

export function savePseSessions(studentId, sessoes) {
  if (!studentId) return;
  const key = "pe_data";
  const raw = localStorage.getItem(key);
  const data = raw ? JSON.parse(raw) : {};
  if (!data[studentId]) data[studentId] = { assessments: [], treinos: [], pse: [] };
  data[studentId].pse = sessoes;
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadPseSessions(studentId) {
  if (!studentId) return [];
  const key = "pe_data";
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  const data = JSON.parse(raw);
  return data[studentId]?.pse || [];
}

export function calcVolumeLoad(exercicios) {
  if (!exercicios || exercicios.length === 0) return 0;
  return exercicios.reduce((total, ex) => {
    const series = parseFloat(ex.series) || 0;
    const reps = parseFloat(ex.repeticoes) || 0;
    const carga = parseFloat(ex.carga) || 0;
    return total + series * reps * carga;
  }, 0);
}

export function calcWeeklyVolume(estruturaTreino) {
  if (!estruturaTreino || estruturaTreino.length === 0) return [];
  const grupos = {};
  estruturaTreino.forEach(grupo => {
    (grupo.exercicios || []).forEach(ex => {
      const musculo = ex.musculoPrimario || ex.nome;
      const series = parseFloat(ex.series) || 0;
      const reps = parseFloat(ex.repeticoes) || 0;
      const carga = parseFloat(ex.carga) || 0;
      if (!grupos[musculo]) grupos[musculo] = { seriesSemanais: 0, volumeLoad: 0, repeticoesSemanais: 0 };
      grupos[musculo].seriesSemanais += series;
      grupos[musculo].volumeLoad += series * reps * carga;
      grupos[musculo].repeticoesSemanais += series * reps;
    });
  });
  return Object.entries(grupos).map(([musculo, dados]) => ({ musculo, ...dados }));
}

export function calcProgression(ultimoTreino, nivel) {
  if (!ultimoTreino || !ultimoTreino.exercicios) return null;
  const fatores = { iniciante: 1.05, intermediario: 1.03, avancado: 1.02 };
  const fator = fatores[nivel] || 1.03;
  return ultimoTreino.exercicios.map(ex => ({
    ...ex,
    carga: ex.carga ? +(parseFloat(ex.carga) * fator).toFixed(1) : "",
    series: ex.series ? String(Math.min(Math.round(parseFloat(ex.series) * (1 + (fator - 1) * 0.5)), 6)) : "",
    progressao: `+${((fator - 1) * 100).toFixed(0)}% carga (${nivel})`,
  }));
}

export function suggestNextCycle(objetivo, nivel) {
  const ciclos = {
    hipertrofia: { semanas: 8, transicao: "forca", desc: "Após 8 semanas de hipertrofia, migrar para força por 4 semanas" },
    forca: { semanas: 6, transicao: "resistencia", desc: "Após 6 semanas de força, migrar para resistência por 3 semanas" },
    resistencia: { semanas: 4, transicao: "hipertrofia", desc: "Após 4 semanas de resistência, retornar à hipertrofia" },
    potencia: { semanas: 6, transicao: "forca", desc: "Após 6 semanas de potência, consolidar com força" },
    emagrecimento: { semanas: 12, transicao: "hipertrofia", desc: "Após 12 semanas de emagrecimento, migrar para hipertrofia" },
  };
  const ciclo = ciclos[objetivo] || ciclos.hipertrofia;
  return {
    objetivoAtual: objetivo,
    proximoObjetivo: ciclo.transicao,
    sugestaoPeriodizacao: `Manter ${objetivo} por ${ciclo.semanas} semanas, depois transicionar para ${ciclo.transicao}`,
    detalhe: ciclo.desc,
    semanasRecomendadas: ciclo.semanas,
  };
}

export const DOBRAS_LOCATIONS = [
  { id: "peitoral", label: "Peitoral", desc: "Linha axilar anterior, diagonalmente entre a prega axilar e o mamilo" },
  { id: "abdominal", label: "Abdominal", desc: "2 cm à direita da cicatriz umbilical, prega vertical" },
  { id: "coxa", label: "Coxa", desc: "Ponto médio entre a prega inguinal e a borda proximal da patela, prega vertical" },
  { id: "suprailiaca", label: "Supra-ilíaca", desc: "Acima da crista ilíaca, na linha axilar média, prega diagonal" },
  { id: "subescapular", label: "Subescapular", desc: "2 cm abaixo do ângulo inferior da escápula, prega diagonal (45°)" },
  { id: "tricipital", label: "Tricipital", desc: "Ponto médio entre acrômio e olécrano, face posterior do braço, prega vertical" },
  { id: "axilarMedia", label: "Axilar Média", desc: "Linha axilar média, na altura do processo xifoide, prega vertical" },
];

export const RM_TABLE = [
  { repeticoes: 1, percentual: 100 },
  { repeticoes: 2, percentual: 95 },
  { repeticoes: 3, percentual: 93 },
  { repeticoes: 4, percentual: 90 },
  { repeticoes: 5, percentual: 87 },
  { repeticoes: 6, percentual: 85 },
  { repeticoes: 7, percentual: 83 },
  { repeticoes: 8, percentual: 80 },
  { repeticoes: 9, percentual: 77 },
  { repeticoes: 10, percentual: 75 },
  { repeticoes: 11, percentual: 72 },
  { repeticoes: 12, percentual: 70 },
  { repeticoes: 13, percentual: 68 },
  { repeticoes: 14, percentual: 66 },
  { repeticoes: 15, percentual: 65 },
];
