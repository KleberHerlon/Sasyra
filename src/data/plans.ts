// @ts-nocheck
const calcYearly = (m) => ({ yearly: Math.round(m * 12 * 0.8 * 100) / 100, yearlyMonth: Math.round(m * 12 * 0.8 / 12 * 100) / 100 });

const s = calcYearly(9.90);
const e = calcYearly(14.90);
const c = calcYearly(49.90);
const ia = calcYearly(79.90);

const PLANS = {
  start: {
    key: "start",
    name: "Start",
    tagline: "Para conhecer a ferramenta",
    monthly: 9.90,
    ...s,
    badge: null,
    highlight: false,
    features: {
      patients:   { label: "Pacientes",         value: "Até 20 pacientes", start: true, evidencia: true, clinicas: true, ia: true, note: "Planos pagos: ilimitado" },
      users:      { label: "Profissional",       value: "1 CREFITO", start: true, evidencia: true, clinicas: true, ia: true, note: "Clínicas: até 3 CREFITOs" },
      extraUser:  { label: "CREFITO extra",      value: "Indisponível", start: false, evidencia: false, clinicas: true, ia: false, note: "Apenas Clínicas · R$ 9,90/mês cada" },
      voice:      { label: "Transcrição por voz",value: "60 min/mês", start: true, evidencia: true, clinicas: true, ia: true, note: "Planos pagos: ilimitado" },
      ai:         { label: "Análise por IA",     value: "Não disponível", start: false, evidencia: false, clinicas: false, ia: true, note: "Exclusivo do Plano IA Premium" },
      cif:        { label: "CIF Automatizada",   value: "Não disponível", start: false, evidencia: false, clinicas: false, ia: true, note: "Exclusivo do Plano IA Premium" },
      report:     { label: "Relatório",          value: "Apenas básico", start: true, evidencia: true, clinicas: true, ia: true, note: "Planos pagos: relatório premium" },
      finance:    { label: "Financeiro",         value: "Controle básico", start: true, evidencia: true, clinicas: true, ia: true, note: "Evidência: tabelas CREFITO · Clínicas: consolidado" },
      evidence:   { label: "Base de evidências", value: "Disponível", start: true, evidencia: true, clinicas: true, ia: true, note: null },
      tests:      { label: "Testes com vídeo",   value: "36 testes", start: true, evidencia: true, clinicas: true, ia: true, note: null },
      scales:     { label: "Escalas validadas",  value: "36 instrumentos", start: true, evidencia: true, clinicas: true, ia: true, note: null },
      agenda:     { label: "Agenda",             value: "Disponível", start: true, evidencia: true, clinicas: true, ia: true, note: null },
    },
    featuredNote: "Ideal para estudantes e profissionais que querem experimentar o SASYRA sem compromisso.",
  },
  evidencia: {
    key: "evidencia",
    name: "Consultório Evidência",
    tagline: "O plano que se paga sozinho",
    monthly: 14.90,
    ...e,
    badge: "Mais Escolhido",
    highlight: true,
    features: {
      patients:   { label: "Pacientes",         value: "Ilimitado", start: false, evidencia: true, clinicas: true, ia: true, note: "Start: limite de 20 pacientes" },
      users:      { label: "Profissional",       value: "1 CREFITO", start: false, evidencia: true, clinicas: true, ia: true, note: "Clínicas: até 3 CREFITOs" },
      extraUser:  { label: "CREFITO extra",      value: "Indisponível", start: false, evidencia: false, clinicas: true, ia: false, note: "Apenas Clínicas" },
      voice:      { label: "Transcrição por voz",value: "Ilimitado", start: false, evidencia: true, clinicas: true, ia: true, note: "Start: 60 min/mês" },
      ai:         { label: "Análise por IA",     value: "30 análises/mês", start: false, evidencia: true, clinicas: true, ia: true, note: "Clínicas: 50 análises · IA Premium: 300" },
      cif:        { label: "CIF Automatizada",   value: "Não disponível", start: false, evidencia: false, clinicas: false, ia: true, note: "Exclusivo do Plano IA Premium" },
      report:     { label: "Relatório",          value: "Premium (PDF)", start: false, evidencia: true, clinicas: true, ia: true, note: "Start: apenas básico" },
      finance:    { label: "Financeiro",         value: "Tabelas CREFITO", start: false, evidencia: true, clinicas: true, ia: true, note: "Start: controle básico · Clínicas: consolidado" },
      evidence:   { label: "Base de evidências", value: "Disponível", start: false, evidencia: true, clinicas: true, ia: true, note: null },
      tests:      { label: "Testes com vídeo",   value: "36 testes", start: false, evidencia: true, clinicas: true, ia: true, note: null },
      scales:     { label: "Escalas validadas",  value: "36 instrumentos", start: false, evidencia: true, clinicas: true, ia: true, note: null },
      agenda:     { label: "Agenda",             value: "Disponível", start: false, evidencia: true, clinicas: true, ia: true, note: null },
    },
    featuredNote: "Custa menos de 1 café por dia e libera pacientes ilimitados, transcrição por voz, 30 análises de IA/mês, relatório premium e tabelas CREFITO.",
  },
  clinicas: {
    key: "clinicas",
    name: "Clínicas & Equipes",
    tagline: "Para crescer em grupo",
    monthly: 49.90,
    ...c,
    badge: "Para Equipes",
    highlight: false,
    features: {
      patients:   { label: "Pacientes",         value: "Ilimitado", start: false, evidencia: false, clinicas: true, ia: true, note: "Start: 20 pacientes" },
      users:      { label: "Profissional",       value: "Até 3 CREFITOs", start: false, evidencia: false, clinicas: true, ia: true, note: "Inclusos. Adicionais: R$ 9,90/mês" },
      extraUser:  { label: "CREFITO extra",      value: "R$ 9,90/mês", start: false, evidencia: false, clinicas: true, ia: false, note: "Apenas no Clínicas" },
      voice:      { label: "Transcrição por voz",value: "Ilimitado", start: false, evidencia: false, clinicas: true, ia: true, note: null },
      ai:         { label: "Análise por IA",     value: "50 análises/mês", start: false, evidencia: false, clinicas: true, ia: true, note: "Evidência: 30 · IA Premium: 300" },
      cif:        { label: "CIF Automatizada",   value: "Não disponível", start: false, evidencia: false, clinicas: false, ia: true, note: "Exclusivo do Plano IA Premium" },
      report:     { label: "Relatório",          value: "Premium (PDF)", start: false, evidencia: false, clinicas: true, ia: true, note: null },
      finance:    { label: "Financeiro",         value: "Consolidado por prof.", start: false, evidencia: false, clinicas: true, ia: true, note: "Evidência: individual · Clínicas: consolidado" },
      evidence:   { label: "Base de evidências", value: "Disponível", start: false, evidencia: false, clinicas: true, ia: true, note: null },
      tests:      { label: "Testes com vídeo",   value: "36 testes", start: false, evidencia: false, clinicas: true, ia: true, note: null },
      scales:     { label: "Escalas validadas",  value: "36 instrumentos", start: false, evidencia: false, clinicas: true, ia: true, note: null },
      agenda:     { label: "Agenda",             value: "Disponível", start: false, evidencia: false, clinicas: true, ia: true, note: null },
    },
    featuredNote: "Para clínicas com até 3 fisioterapeutas. Profissionais extras R$ 9,90/mês. Inclui 50 análises de IA/mês.",
  },
  ia: {
    key: "ia",
    name: "IA Premium",
    tagline: "O poder da Inteligência Artificial na sua prática",
    monthly: 79.90,
    ...ia,
    badge: "⭐ MAIS COMPLETO",
    highlight: true,
    features: {
      patients:   { label: "Pacientes",         value: "Ilimitado", start: false, evidencia: false, clinicas: false, ia: true, note: null },
      users:      { label: "Profissional",       value: "1 CREFITO", start: false, evidencia: false, clinicas: false, ia: true, note: null },
      extraUser:  { label: "CREFITO extra",      value: "Indisponível", start: false, evidencia: false, clinicas: true, ia: false, note: "Apenas Clínicas" },
      voice:      { label: "Transcrição por voz",value: "Ilimitado", start: false, evidencia: false, clinicas: false, ia: true, note: null },
      ai:         { label: "Análise por IA",     value: "300 análises/mês", start: false, evidencia: false, clinicas: false, ia: true, note: "Limite justo para uso profissional intenso" },
      cif:        { label: "CIF Automatizada",   value: "Com qualificadores", start: false, evidencia: false, clinicas: false, ia: true, note: "Incluso neste plano" },
      report:     { label: "Relatório",          value: "Premium (PDF)", start: false, evidencia: false, clinicas: false, ia: true, note: null },
      finance:    { label: "Financeiro",         value: "Tabelas CREFITO", start: false, evidencia: false, clinicas: false, ia: true, note: null },
      evidence:   { label: "Base de evidências", value: "Disponível", start: false, evidencia: false, clinicas: false, ia: true, note: null },
      tests:      { label: "Testes com vídeo",   value: "36 testes", start: false, evidencia: false, clinicas: false, ia: true, note: null },
      scales:     { label: "Escalas validadas",  value: "36 instrumentos", start: false, evidencia: false, clinicas: false, ia: true, note: null },
      agenda:     { label: "Agenda",             value: "Disponível", start: false, evidencia: false, clinicas: false, ia: true, note: null },
    },
    featuredNote: "🤖 300 análises por IA/mês · 🏥 CIF Automatizada com qualificadores · 📋 Relatório Premium PDF — tudo incluso. Limite justo para uso profissional intenso, sem surpresas.",
  },
};

const PLAN_ORDER = ["start", "evidencia", "clinicas", "ia"];

const PLAN_LIMITS = {
  start: { maxPatients: 20, maxUsers: 1, voiceMinutes: 60 },
  evidencia: { maxPatients: Infinity, maxUsers: 1, voiceMinutes: Infinity },
  clinicas: { maxPatients: Infinity, maxUsers: 3, voiceMinutes: Infinity },
  ia: { maxPatients: Infinity, maxUsers: 1, voiceMinutes: Infinity },
};

const PLAN_LABELS = {
  start: "Start",
  evidencia: "Consultório Evidência",
  clinicas: "Clínicas & Equipes",
  ia: "IA Premium",
};

const AI_LIMITS = {
  start: 0,
  evidencia: 30,
  clinicas: 50,
  ia: 300,
};

const AI_EXPANSION = {
  pricePerAnalysis: 4.90,
  label: "R$ 4,90/análise",
};

export { PLANS, PLAN_ORDER, PLAN_LIMITS, PLAN_LABELS, AI_LIMITS, AI_EXPANSION };
