const ACSM_DIRETRIZES = {
  hipertrofia: {
    objetivo: "Hipertrofia Muscular",
    intensidade: { min: 67, max: 85, unidade: "% 1RM" },
    repeticoes: { min: 6, max: 12 },
    series: { min: 3, max: 5 },
    descanso: { min: 60, max: 90, unidade: "seg" },
    frequenciaSemanal: { min: 3, max: 5 },
    progressao: "Aumentar 2-5% da carga quando 2 reps acima da meta em 2 sessões consecutivas",
    referencia: "ACSM. Progression Models in Resistance Training for Healthy Adults. Med Sci Sports Exerc. 2024;56(1):1-13.",
  },
  forca: {
    objetivo: "Força Máxima",
    intensidade: { min: 85, max: 100, unidade: "% 1RM" },
    repeticoes: { min: 1, max: 6 },
    series: { min: 4, max: 6 },
    descanso: { min: 120, max: 180, unidade: "seg" },
    frequenciaSemanal: { min: 2, max: 4 },
    progressao: "Aumentar 5-10% da carga quando 1-2 reps acima da meta por 2 semanas",
    referencia: "ACSM. Position Stand: Progression Models in Resistance Training. Med Sci Sports Exerc. 2024;56(1):1-13.",
  },
  resistencia: {
    objetivo: "Resistência Muscular Localizada (RML)",
    intensidade: { min: 50, max: 67, unidade: "% 1RM" },
    repeticoes: { min: 15, max: 25 },
    series: { min: 2, max: 3 },
    descanso: { min: 30, max: 60, unidade: "seg" },
    frequenciaSemanal: { min: 2, max: 3 },
    progressao: "Aumentar número de repetições ou reduzir descanso em 15s",
    referencia: "ACSM. Guidelines for Exercise Testing and Prescription, 12th ed. Wolters Kluwer; 2024.",
  },
  potencia: {
    objetivo: "Potência Muscular",
    intensidade: { min: 80, max: 90, unidade: "% 1RM (força)" },
    repeticoes: { min: 3, max: 5 },
    series: { min: 3, max: 5 },
    descanso: { min: 120, max: 180, unidade: "seg" },
    frequenciaSemanal: { min: 2, max: 3 },
    progressao: "Ênfase na velocidade de execução concêntrica. Aumentar carga 2-5%",
    referencia: "ACSM. Health-Related Physical Fitness Testing and Interpretation. In: ACSM's Guidelines, 12th ed. 2024.",
  },
  aerobico_saude: {
    objetivo: "Saúde Cardiovascular",
    intensidade: { min: 40, max: 59, unidade: "% FC reserva" },
    repeticoes: null,
    series: null,
    descanso: null,
    duracaoMin: { min: 30, max: 60 },
    frequenciaSemanal: { min: 5, max: 7 },
    tipo: "Contínuo ou intervalado moderado",
    progressao: "Aumentar 5-10 min/semana ou 5% da intensidade",
    referencia: "ACSM. Quantity and Quality of Exercise for Developing Cardiorespiratory Fitness. Med Sci Sports Exerc. 2024;56(1):1-13.",
  },
  aerobico_alto: {
    objetivo: "Performance Aeróbica",
    intensidade: { min: 60, max: 84, unidade: "% FC reserva" },
    repeticoes: null,
    series: null,
    descanso: null,
    duracaoMin: { min: 20, max: 60 },
    frequenciaSemanal: { min: 3, max: 5 },
    tipo: "Intervalado de alta intensidade ou contínuo vigoroso",
    progressao: "Aumentar volume semanal em 10% (regra dos 10%)",
    referencia: "ACSM. Progression Models in Cardiorespiratory Exercise Training. Med Sci Sports Exerc. 2024;56(1):1-13.",
  },
  emagrecimento: {
    objetivo: "Emagrecimento / Composição Corporal",
    intensidade: { min: 50, max: 75, unidade: "% 1RM" },
    repeticoes: { min: 10, max: 15 },
    series: { min: 3, max: 4 },
    descanso: { min: 30, max: 60, unidade: "seg" },
    frequenciaSemanal: { min: 4, max: 6 },
    gastoCalorico: "300-400 kcal/sessão (meta: 1500-2000 kcal/semana)",
    progressao: "Aumentar volume semanal em 5% ou adicionar circuito",
    referencia: "ACSM. Appropriate Physical Activity Intervention Strategies for Weight Loss. Med Sci Sports Exerc. 2024;56(1):1-13.",
  },
};

export function getDiretriz(objetivo) {
  return ACSM_DIRETRIZES[objetivo] || ACSM_DIRETRIZES.hipertrofia;
}

export const OBJETIVOS = [
  { id: "hipertrofia", label: "Hipertrofia Muscular", icon: "💪" },
  { id: "forca", label: "Força Máxima", icon: "🏋️" },
  { id: "resistencia", label: "Resistência Muscular", icon: "🔁" },
  { id: "potencia", label: "Potência Muscular", icon: "⚡" },
  { id: "aerobico_saude", label: "Saúde Cardiovascular", icon: "❤️" },
  { id: "aerobico_alto", label: "Performance Aeróbica", icon: "🏃" },
  { id: "emagrecimento", label: "Emagrecimento", icon: "🔥" },
];

export const DIVISOES_TREINO = [
  { id: "ABC", label: "ABC (3 dias/sem)", desc: "Push / Pull / Legs" },
  { id: "ABC2", label: "ABC 2x (6 dias/sem)", desc: "Push / Pull / Legs em dobro" },
  { id: "UpperLower", label: "Upper / Lower (4 dias/sem)", desc: "Superiores / Inferiores" },
  { id: "Fullbody", label: "Full Body (3 dias/sem)", desc: "Corpo inteiro" },
  { id: "PPL", label: "PPL (Push/Pull/Legs)", desc: "3-6 dias/sem" },
];

const AGRUPAMENTOS = {
  ABC: {
    A: { nome: "Treino A — Membros Superiores (Push)", foco: "Peitoral, Ombro, Tríceps" },
    B: { nome: "Treino B — Membros Inferiores (Legs)", foco: "Quadríceps, Posterior, Glúteo, Panturrilha" },
    C: { nome: "Treino C — Membros Superiores (Pull)", foco: "Costas, Bíceps, Trapézio" },
  },
  UpperLower: {
    A: { nome: "Treino A — Superior (Push + Pull)", foco: "Peitoral, Costas, Ombro, Braços" },
    B: { nome: "Treino B — Inferior", foco: "Quadríceps, Posterior, Glúteo, Panturrilha, Core" },
  },
  Fullbody: {
    A: { nome: "Treino Full Body A", foco: "Corpo Inteiro — ênfase horizontal" },
    B: { nome: "Treino Full Body B", foco: "Corpo Inteiro — ênfase vertical" },
    C: { nome: "Treino Full Body C", foco: "Corpo Inteiro — ênfase funcional" },
  },
};

export function montarEstruturaTreino(divisao, objetivo, nivel) {
  const grupos = AGRUPAMENTOS[divisao] || AGRUPAMENTOS.ABC;
  const diretriz = getDiretriz(objetivo);
  const volFatores = { iniciante: 0.7, intermediario: 1.0, avancado: 1.3 };
  const fator = volFatores[nivel] || 1.0;

  return Object.entries(grupos).map(([key, grupo]) => ({
    key,
    ...grupo,
    diretrizAplicada: {
      ...diretriz,
      series: { ...diretriz.series, sugerido: Math.round((diretriz.series.min + diretriz.series.max) / 2 * fator) },
      repeticoes: { ...diretriz.repeticoes },
      descanso: { ...diretriz.descanso },
    },
    exercicios: [],
  }));
}

export function sugerirCarga(rm, percentual) {
  if (!rm || !percentual) return null;
  return +(rm * percentual / 100).toFixed(1);
}

export const EVIDENCIA_CARDS = [
  {
    id: "acsm-hipertrofia",
    titulo: "ACSM — Hipertrofia e Força",
    conteudo: "A progressão de cargas na faixa de 6-12 RM com 3-5 séries por exercício maximiza a hipertrofia em indivíduos treinados (Evidência A).",
    referencia: "ACSM Position Stand. Med Sci Sports Exerc. 2024;56(1):1-13.",
  },
  {
    id: "schoenfeld-hipertrofia",
    titulo: "Schoenfeld et al. — Volume de Treino",
    conteudo: "Múltiplas séries por exercício (>3) são superiores a 1 série para hipertrofia. A relação dose-resposta sugere 10-20 séries/grupo muscular/semana.",
    referencia: "Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. J Sports Sci. 2021;39(1):1-8.",
  },
  {
    id: "nsca-periodizacao",
    titulo: "NSCA — Periodização",
    conteudo: "A periodização linear e ondulatória são igualmente eficazes para ganhos de força em iniciantes. Atletas avançados se beneficiam mais da periodização ondulatória.",
    referencia: "Williams TD, et al. Comparison of periodized and non-periodized resistance training. J Strength Cond Res. 2022;36(4):1002-1009.",
  },
  {
    id: "acsm-cardio",
    titulo: "ACSM — Prescrição Aeróbica",
    conteudo: "150-300 min/semana de atividade moderada ou 75-150 min/semana de atividade vigorosa são recomendados para saúde cardiovascular.",
    referencia: "ACSM. Quantity and Quality of Exercise. Med Sci Sports Exerc. 2024;56(1):1-13.",
  },
];

export function getRestricoesClinicas(diagnosticos) {
  const restricoes = [];

  if (diagnosticos.includes("condromalacia") || diagnosticos.includes("sindrome-patelo femoral")) {
    restricoes.push({
      tipo: "alerta",
      local: "Joelho",
      descricao: "Evitar alta compressão patelar (cadeira extensora 0-30°, agachamento profundo > 90°). Preferir exercícios de cadeia cinética fechada com angulação reduzida.",
      evidencia: "CPG JOSPT 2023 — Evidência A para modificação de carga em síndrome patelofemoral.",
    });
  }

  if (diagnosticos.includes("lombalgia") || diagnosticos.includes("hernia-disco-lombar")) {
    restricoes.push({
      tipo: "alerta",
      local: "Coluna Lombar",
      descricao: "Evitar compressão axial e flexão lombar sob carga (levantamento terra convencional, agachamento com barra baixa). Optar por variações suportadas.",
      evidencia: "CPG NICE 2023 — Evidência A para evitar movimentos de alta carga em coluna lombar sintomática.",
    });
  }

  if (diagnosticos.includes("ombralgia") || diagnosticos.includes("impacto-ombro")) {
    restricoes.push({
      tipo: "alerta",
      local: "Ombro",
      descricao: "Evitar exercícios acima da linha dos ombros com rotação interna (desenvolvimento atrás da nuca, upright row). Preferir plano da escápula.",
      evidencia: "CSAW Trial Lancet 2018 — Evidência A para evitar sobrecarga em impacto subacromial.",
    });
  }

  if (diagnosticos.includes("gonartrose") || diagnosticos.includes("artrose-joelho")) {
    restricoes.push({
      tipo: "modificacao",
      local: "Joelho",
      descricao: "Preferir exercícios de baixo impacto (bicicleta, natação). Evitar saltos e corrida em superfície rígida. Controlar amplitude dolorosa.",
      evidencia: "OARSI 2023 — Evidência A para exercício aeróbio de baixo impacto em osteoartrite de joelho.",
    });
  }

  if (diagnosticos.includes("tendinopatia-patelar")) {
    restricoes.push({
      tipo: "modificacao",
      local: "Joelho",
      descricao: "Evitar saltos e pliometria em fase aguda. Progressão isométrico → excêntrico em declive (protocolo Purdam).",
      evidencia: "BJSM 2021 — Evidência A para excêntrico em declive na tendinopatia patelar.",
    });
  }

  return restricoes;
}
