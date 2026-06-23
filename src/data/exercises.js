export const EXERCISES = [
  { id:"supino-reto", nome:"Supino Reto", musculoPrimario:"Peitoral Maior", musculoSecundario:["Tríceps Braquial", "Deltoide Anterior"], equipamento:"Barra / Halteres", grupo:"Peitoral", tipo:"Força" },
  { id:"supino-inclinado", nome:"Supino Inclinado", musculoPrimario:"Peitoral Maior (porção clavicular)", musculoSecundario:["Deltoide Anterior", "Tríceps Braquial"], equipamento:"Barra / Halteres", grupo:"Peitoral", tipo:"Força" },
  { id:"crucifixo-reto", nome:"Crucifixo Reto", musculoPrimario:"Peitoral Maior", musculoSecundario:["Deltoide Anterior"], equipamento:"Halteres", grupo:"Peitoral", tipo:"Isolamento" },
  { id:"crossover-polia", nome:"Crossover na Polia", musculoPrimario:"Peitoral Maior", musculoSecundario:["Deltoide Anterior"], equipamento:"Polia", grupo:"Peitoral", tipo:"Isolamento" },
  { id:"flexao-braco", nome:"Flexão de Braço", musculoPrimario:"Peitoral Maior", musculoSecundario:["Tríceps Braquial", "Deltoide Anterior", "Core"], equipamento:"Peso Corporal", grupo:"Peitoral", tipo:"Funcional" },
  { id:"puxada-frente", nome:"Puxada pela Frente (Pulldown)", musculoPrimario:"Latíssimo do Dorso", musculoSecundario:["Bíceps Braquial", "Romboides", "Trapézio"], equipamento:"Polia Alta", grupo:"Costas", tipo:"Força" },
  { id:"remada-curvada", nome:"Remada Curvada", musculoPrimario:"Latíssimo do Dorso", musculoSecundario:["Romboides", "Trapézio Médio", "Bíceps Braquial"], equipamento:"Barra / Halteres", grupo:"Costas", tipo:"Força" },
  { id:"remada-unilateral", nome:"Remada Unilateral (Serrote)", musculoPrimario:"Latíssimo do Dorso", musculoSecundario:["Romboides", "Bíceps Braquial", "Deltoide Posterior"], equipamento:"Haltere", grupo:"Costas", tipo:"Força" },
  { id:"remada-polia", nome:"Remada na Polia (Sentado)", musculoPrimario:"Latíssimo do Dorso", musculoSecundario:["Romboides", "Trapézio Médio", "Bíceps Braquial"], equipamento:"Polia Baixa", grupo:"Costas", tipo:"Força" },
  { id:"barra-fixa", nome:"Barra Fixa (Pull-up)", musculoPrimario:"Latíssimo do Dorso", musculoSecundario:["Bíceps Braquial", "Romboides", "Trapézio"], equipamento:"Barra Fixa", grupo:"Costas", tipo:"Força" },
  { id:"desenvolvimento", nome:"Desenvolvimento Militar", musculoPrimario:"Deltoide Anterior e Lateral", musculoSecundario:["Tríceps Braquial", "Trapézio Superior"], equipamento:"Barra / Halteres", grupo:"Ombro", tipo:"Força" },
  { id:"elevacao-lateral", nome:"Elevação Lateral", musculoPrimario:"Deltoide Lateral", musculoSecundario:["Trapézio Superior", "Serratil Anterior"], equipamento:"Halteres", grupo:"Ombro", tipo:"Isolamento" },
  { id:"elevacao-frontal", nome:"Elevação Frontal", musculoPrimario:"Deltoide Anterior", musculoSecundario:["Peitoral Maior (clavicular)"], equipamento:"Halteres / Polia", grupo:"Ombro", tipo:"Isolamento" },
  { id:"crucifixo-inverso", nome:"Crucifixo Inverso", musculoPrimario:"Deltoide Posterior", musculoSecundario:["Romboides", "Trapézio Médio"], equipamento:"Halteres", grupo:"Ombro", tipo:"Isolamento" },
  { id:"rosca-biceps", nome:"Rosca Bíceps", musculoPrimario:"Bíceps Braquial", musculoSecundario:["Braquial", "Braquiorradial"], equipamento:"Barra / Halteres", grupo:"Bíceps", tipo:"Isolamento" },
  { id:"rosca-martelo", nome:"Rosca Martelo", musculoPrimario:"Braquiorradial", musculoSecundario:["Bíceps Braquial", "Braquial"], equipamento:"Halteres", grupo:"Bíceps", tipo:"Isolamento" },
  { id:"rosca-polia", nome:"Rosca na Polia", musculoPrimario:"Bíceps Braquial", musculoSecundario:["Braquial"], equipamento:"Polia", grupo:"Bíceps", tipo:"Isolamento" },
  { id:"rosca-concentrada", nome:"Rosca Concentrada", musculoPrimario:"Bíceps Braquial", musculoSecundario:[], equipamento:"Haltere", grupo:"Bíceps", tipo:"Isolamento" },
  { id:"triceps-polia", nome:"Tríceps na Polia (Pulley)", musculoPrimario:"Tríceps Braquial", musculoSecundario:[], equipamento:"Polia Alta", grupo:"Tríceps", tipo:"Isolamento" },
  { id:"triceps-banco", nome:"Tríceps Banco (Mergulho)", musculoPrimario:"Tríceps Braquial", musculoSecundario:["Peitoral Maior", "Deltoide Anterior"], equipamento:"Banco / Barras Paralelas", grupo:"Tríceps", tipo:"Força" },
  { id:"triceps-frances", nome:"Tríceps Francês", musculoPrimario:"Tríceps Braquial (porção longa)", musculoSecundario:[], equipamento:"Haltere / Barra W", grupo:"Tríceps", tipo:"Isolamento" },
  { id:"triceps-testeira", nome:"Tríceps Testeira (Skull Crusher)", musculoPrimario:"Tríceps Braquial", musculoSecundario:[], equipamento:"Barra W / Halteres", grupo:"Tríceps", tipo:"Isolamento" },
  { id:"agachamento", nome:"Agachamento Livre", musculoPrimario:"Quadríceps Femoral", musculoSecundario:["Glúteo Máximo", "Posterior da Coxa", "Eretores Espinhais"], equipamento:"Barra", grupo:"Quadríceps", tipo:"Força" },
  { id:"agachamento-goblet", nome:"Agachamento Goblet", musculoPrimario:"Quadríceps Femoral", musculoSecundario:["Glúteo Máximo", "Core"], equipamento:"Kettlebell / Haltere", grupo:"Quadríceps", tipo:"Força" },
  { id:"cadeira-extensora", nome:"Cadeira Extensora", musculoPrimario:"Quadríceps Femoral", musculoSecundario:[], equipamento:"Máquina", grupo:"Quadríceps", tipo:"Isolamento" },
  { id:"agachamento-bulgaro", nome:"Agachamento Búlgaro", musculoPrimario:"Quadríceps Femoral", musculoSecundario:["Glúteo Máximo", "Posterior da Coxa", "Core"], equipamento:"Halteres / Barra", grupo:"Quadríceps", tipo:"Força", restricao:"Carga reduzida se condromalácia patelar" },
  { id:"leg-press", nome:"Leg Press 45°", musculoPrimario:"Quadríceps Femoral", musculoSecundario:["Glúteo Máximo", "Posterior da Coxa"], equipamento:"Máquina", grupo:"Quadríceps", tipo:"Força" },
  { id:"cadeira-flexora", nome:"Cadeira Flexora (Mesa)", musculoPrimario:"Posterior da Coxa (Isquiotibiais)", musculoSecundario:[], equipamento:"Máquina", grupo:"Posterior de Coxa", tipo:"Isolamento" },
  { id:"stiff", nome:"Stiff (Peso Morto Rígido)", musculoPrimario:"Posterior da Coxa", musculoSecundario:["Glúteo Máximo", "Eretores Espinhais"], equipamento:"Barra / Halteres", grupo:"Posterior de Coxa", tipo:"Força" },
  { id:"peso-morto", nome:"Levantamento Terra (Deadlift)", musculoPrimario:"Posterior da Coxa", musculoSecundario:["Glúteo Máximo", "Eretores Espinhais", "Trapézio", "Core"], equipamento:"Barra", grupo:"Posterior de Coxa", tipo:"Força" },
  { id:"gluteo-banco", nome:"Elevação Pélvica (Glúteo)", musculoPrimario:"Glúteo Máximo", musculoSecundario:["Posterior da Coxa", "Core"], equipamento:"Banco + barra", grupo:"Glúteo", tipo:"Força" },
  { id:"gluteo-4-apoios", nome:"Glúteo 4 Apoios (Coice)", musculoPrimario:"Glúteo Máximo", musculoSecundario:[], equipamento:"Peso Corporal / Tornozeleira", grupo:"Glúteo", tipo:"Isolamento" },
  { id:"abducao-maquina", nome:"Abdução na Máquina", musculoPrimario:"Glúteo Médio", musculoSecundario:[], equipamento:"Máquina", grupo:"Glúteo", tipo:"Isolamento" },
  { id:"panturrilha-em-pe", nome:"Panturrilha em Pé", musculoPrimario:"Gastrocnêmio", musculoSecundario:["Sóleo"], equipamento:"Máquina / Barra", grupo:"Panturrilha", tipo:"Isolamento" },
  { id:"panturrilha-sentado", nome:"Panturrilha Sentado", musculoPrimario:"Sóleo", musculoSecundario:["Gastrocnêmio"], equipamento:"Máquina", grupo:"Panturrilha", tipo:"Isolamento" },
  { id:"abdominal-crunch", nome:"Crunch Abdominal", musculoPrimario:"Reto Abdominal", musculoSecundario:[], equipamento:"Peso Corporal", grupo:"Core", tipo:"Isolamento" },
  { id:"prancha", nome:"Prancha (Plank)", musculoPrimario:"Core (Transverso Abdominal)", musculoSecundario:["Reto Abdominal", "Oblíquos", "Eretores Espinhais"], equipamento:"Peso Corporal", grupo:"Core", tipo:"Funcional" },
  { id:"elevacao-pernas", nome:"Elevação de Pernas", musculoPrimario:"Reto Abdominal (porção inferior)", musculoSecundario:["Flexores do Quadril"], equipamento:"Peso Corporal", grupo:"Core", tipo:"Isolamento" },
  { id:"remada-alta", nome:"Remada Alta (Upright Row)", musculoPrimario:"Trapézio Superior", musculoSecundario:["Deltoide Lateral", "Bíceps Braquial"], equipamento:"Barra / Halteres", grupo:"Trapézio", tipo:"Força", restricao:"Evitar em casos de impacto no ombro — usar elevação lateral como alternativa" },
  { id:"encolhimento", nome:"Encolhimento (Shrug)", musculoPrimario:"Trapézio Superior", musculoSecundario:["Elevador da Escápula"], equipamento:"Halteres / Barra", grupo:"Trapézio", tipo:"Isolamento" },
  { id:"rosca-inversa", nome:"Rosca Inversa de Punho", musculoPrimario:"Extensores do Punho", musculoSecundario:[], equipamento:"Barra / Halteres", grupo:"Antebraço", tipo:"Isolamento" },
  { id:"corrida-esteira", nome:"Corrida na Esteira", musculoPrimario:"Sistema Cardiovascular", musculoSecundario:["Quadríceps", "Posterior da Coxa", "Panturrilha"], equipamento:"Esteira", grupo:"Aeróbico", tipo:"Cardio" },
  { id:"bicicleta-erg", nome:"Bicicleta Ergométrica", musculoPrimario:"Sistema Cardiovascular", musculoSecundario:["Quadríceps", "Glúteo"], equipamento:"Bicicleta", grupo:"Aeróbico", tipo:"Cardio" },
  { id:"transporte", nome:"Transporte (Farmer's Walk)", musculoPrimario:"Core", musculoSecundario:["Antebraço", "Trapézio", "Glúteo", "Quadríceps"], equipamento:"Halteres / Kettlebells", grupo:"Funcional", tipo:"Funcional" },
  { id:"corda-pular", nome:"Corda (Pular)", musculoPrimario:"Sistema Cardiovascular", musculoSecundario:["Panturrilha", "Quadríceps", "Ombro"], equipamento:"Corda", grupo:"Aeróbico", tipo:"Cardio" },
  { id:"agachamento-afundo", nome:"Afundo (Lunges)", musculoPrimario:"Quadríceps Femoral", musculoSecundario:["Glúteo Máximo", "Posterior da Coxa"], equipamento:"Halteres / Barra", grupo:"Quadríceps", tipo:"Força" },
  { id:"elevacao-pelve-unilateral", nome:"Elevação Pélvica Unilateral", musculoPrimario:"Glúteo Máximo", musculoSecundario:["Core"], equipamento:"Peso Corporal", grupo:"Glúteo", tipo:"Funcional" },
];

export function searchExercises(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return EXERCISES.filter(e =>
    e.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) ||
    e.musculoPrimario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) ||
    e.grupo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q)
  ).slice(0, 10);
}

export function getExercisesByGroup(grupo) {
  return EXERCISES.filter(e => e.grupo === grupo);
}

export function getExercisesByMuscle(musculo) {
  const m = musculo.toLowerCase();
  return EXERCISES.filter(e =>
    e.musculoPrimario.toLowerCase() === m ||
    e.musculoSecundario.some(s => s.toLowerCase() === m)
  );
}

export const MUSCLE_GROUPS = [
  "Peitoral",
  "Costas",
  "Ombro",
  "Bíceps",
  "Tríceps",
  "Quadríceps",
  "Posterior de Coxa",
  "Glúteo",
  "Panturrilha",
  "Core",
  "Trapézio",
  "Antebraço",
  "Aeróbico",
  "Funcional",
];
