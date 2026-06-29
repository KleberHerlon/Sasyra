const calcYearly = (m) => ({ yearly: Math.round(m * 12 * 0.8 * 100) / 100, yearlyMonth: Math.round(m * 12 * 0.8 / 12 * 100) / 100 });

const av = calcYearly(0);
const s = calcYearly(29.90);
const e = calcYearly(59.90);
const c = calcYearly(149.90);

const PLANS = {
  trial: {
    key: "trial",
    name: "Teste Gratuito",
    tagline: "10 análises completas para testar",
    monthly: 0,
    ...calcYearly(0),
    badge: "GRÁTIS",
    highlight: true,
    hidden: true,
    features: {
      patients:   { label: "Pacientes",         value: "Ilimitado", trial: true, avulso: true, start: true, evidencia: true, clinicas: true },
      users:      { label: "Profissional",       value: "1 CREFITO", trial: true, avulso: false, start: true, evidencia: true, clinicas: true },
      voice:      { label: "Transcrição por voz",value: "Ilimitado", trial: true, avulso: false, start: true, evidencia: true, clinicas: true },
      ai:         { label: "Análise por IA",     value: "10 análises grátis", trial: true, avulso: false, start: false, evidencia: false, clinicas: false, note: "Planos pagos: a partir de R$ 29,90/mês" },
      cif:        { label: "CIF Automatizada",   value: "Com qualificadores", trial: true, avulso: false, start: false, evidencia: true, clinicas: true },
      report:     { label: "Relatório",          value: "Completo (PDF)", trial: true, avulso: false, start: false, evidencia: true, clinicas: true },
      finance:    { label: "Financeiro",         value: "Controle completo", trial: true, avulso: false, start: true, evidencia: true, clinicas: true },
      agenda:     { label: "Agenda",             value: "Disponível", trial: true, avulso: false, start: true, evidencia: true, clinicas: true },
      evidence:   { label: "Base de evidências", value: "Disponível", trial: true, avulso: false, start: true, evidencia: true, clinicas: true },
      tests:      { label: "Testes com vídeo",   value: "36 testes", trial: true, avulso: false, start: true, evidencia: true, clinicas: true },
      scales:     { label: "Escalas validadas",  value: "36 instrumentos", trial: true, avulso: false, start: true, evidencia: true, clinicas: true },
      bodyMap:    { label: "BodyMap",            value: "Disponível", trial: true, avulso: false, start: true, evidencia: true, clinicas: true },
    },
    featuredNote: "🎁 10 análises de IA gratuitas + todos os recursos liberados por tempo limitado. Ao final, escolha o plano ideal para você.",
  },
  avulso: {
    key: "avulso",
    name: "Avulso",
    tagline: "Pague por análise, sem compromisso",
    monthly: 0,
    ...av,
    badge: null,
    highlight: false,
    features: {
      patients:   { label: "Pacientes",         value: "Sem prontuário", avulso: true, start: true, evidencia: true, clinicas: true },
      users:      { label: "Profissional",       value: "—", avulso: false, start: true, evidencia: true, clinicas: true },
      ai:         { label: "Análise por IA",     value: "R$ 5,90/análise", avulso: true, start: false, evidencia: false, clinicas: false, note: "Planos pagos: análises inclusas + excedente com desconto" },
      report:     { label: "Relatório",          value: "Apenas análise IA", avulso: true, start: false, evidencia: true, clinicas: true, note: "Avulso: sem prontuário nem agenda" },
      cif:        { label: "CIF Automatizada",   value: "Indisponível", avulso: false, start: false, evidencia: true, clinicas: true, note: "Incluso no Evidência e Clínica" },
      voice:      { label: "Transcrição por voz",value: "Indisponível", avulso: false, start: true, evidencia: true, clinicas: true, note: null },
      finance:    { label: "Financeiro",         value: "Indisponível", avulso: false, start: true, evidencia: true, clinicas: true, note: "Clínicas: consolidado multi-profissional" },
      agenda:     { label: "Agenda",             value: "Indisponível", avulso: false, start: true, evidencia: true, clinicas: true, note: "Clínicas: agenda compartilhada" },
      evidence:   { label: "Base de evidências", value: "Indisponível", avulso: false, start: true, evidencia: true, clinicas: true, note: null },
      scales:     { label: "Escalas validadas",  value: "Indisponível", avulso: false, start: true, evidencia: true, clinicas: true, note: null },
    },
    featuredNote: "Ideal para uso esporádico: gere análises avulsas sem precisar de assinatura.",
  },
  start: {
    key: "start",
    name: "Start",
    tagline: "Para começar com tudo",
    monthly: 29.90,
    ...s,
    badge: null,
    highlight: false,
    features: {
      patients:   { label: "Pacientes",         value: "Ilimitado", avulso: false, start: true, evidencia: true, clinicas: true, note: null },
      users:      { label: "Profissional",       value: "1 CREFITO", avulso: false, start: true, evidencia: true, clinicas: true, note: "Clínicas: até 5 profissionais" },
      extraUser:  { label: "CREFITO extra",      value: "Indisponível", avulso: false, start: false, evidencia: false, clinicas: true, note: "Apenas Clínica" },
      voice:      { label: "Transcrição por voz",value: "60 min/mês", avulso: false, start: true, evidencia: true, clinicas: true, note: "Evidência e Clínica: ilimitado" },
      ai:         { label: "Análise por IA",     value: "0 análises/mês", avulso: false, start: true, evidencia: true, clinicas: true, note: "Evidência: 40/mês · Clínica: 150/mês (compartilhada)" },
      cif:        { label: "CIF Automatizada",   value: "Indisponível", avulso: false, start: false, evidencia: true, clinicas: true, note: "Incluso no Evidência e Clínica" },
      report:     { label: "Relatório",          value: "Básico", avulso: false, start: true, evidencia: true, clinicas: true, note: "Evidência e Clínica: relatório multidisciplinar para impressão" },
      finance:    { label: "Financeiro",         value: "Controle básico", avulso: false, start: true, evidencia: true, clinicas: true, note: "Evidência: completo · Clínica: consolidado multi-profissional" },
      agenda:     { label: "Agenda",             value: "Individual", avulso: false, start: true, evidencia: true, clinicas: true, note: "Clínicas: agenda compartilhada" },
      evidence:   { label: "Base de evidências", value: "Disponível", avulso: false, start: true, evidencia: true, clinicas: true, note: null },
      tests:      { label: "Testes com vídeo",   value: "36 testes", avulso: false, start: true, evidencia: true, clinicas: true, note: null },
      scales:     { label: "Escalas validadas",  value: "36 instrumentos", avulso: false, start: true, evidencia: true, clinicas: true, note: null },
      bodyMap:    { label: "BodyMap",            value: "Disponível", avulso: false, start: true, evidencia: true, clinicas: true, note: null },
    },
    featuredNote: "Prontuário completo, BodyMap, escalas, agenda e financeiro — sem análises de IA inclusas. Paga R$ 5,90 por análise avulsa se precisar.",
  },
  evidencia: {
    key: "evidencia",
    name: "Evidência",
    tagline: "O plano que mais cresce",
    monthly: 59.90,
    ...e,
    badge: "Mais Escolhido",
    highlight: true,
    features: {
      patients:   { label: "Pacientes",         value: "Ilimitado", avulso: false, start: false, evidencia: true, clinicas: true, note: null },
      users:      { label: "Profissional",       value: "1 CREFITO", avulso: false, start: false, evidencia: true, clinicas: true, note: "Clínicas: até 5 profissionais" },
      extraUser:  { label: "CREFITO extra",      value: "Indisponível", avulso: false, start: false, evidencia: false, clinicas: true, note: "Apenas Clínica" },
      voice:      { label: "Transcrição por voz",value: "Ilimitado", avulso: false, start: false, evidencia: true, clinicas: true, note: null },
      ai:         { label: "Análise por IA",     value: "40 análises/mês", avulso: false, start: false, evidencia: true, clinicas: true, note: "Excedente: R$ 2,90/análise · Clínica: 150/mês compartilhada" },
      cif:        { label: "CIF Automatizada",   value: "Com qualificadores", avulso: false, start: false, evidencia: true, clinicas: true, note: null },
      report:     { label: "Relatório",          value: "Multidisciplinar (PDF)", avulso: false, start: false, evidencia: true, clinicas: true, note: "Pronto para impressão" },
      finance:    { label: "Financeiro",         value: "Controle completo", avulso: false, start: false, evidencia: true, clinicas: true, note: "Clínicas: consolidado multi-profissional" },
      agenda:     { label: "Agenda",             value: "Individual", avulso: false, start: false, evidencia: true, clinicas: true, note: "Clínicas: agenda compartilhada" },
      evidence:   { label: "Base de evidências", value: "Disponível", avulso: false, start: false, evidencia: true, clinicas: true, note: null },
      tests:      { label: "Testes com vídeo",   value: "36 testes", avulso: false, start: false, evidencia: true, clinicas: true, note: null },
      scales:     { label: "Escalas validadas",  value: "36 instrumentos", avulso: false, start: false, evidencia: true, clinicas: true, note: null },
      bodyMap:    { label: "BodyMap",            value: "Disponível", avulso: false, start: false, evidencia: true, clinicas: true, note: null },
    },
    featuredNote: "40 análises de IA/mês inclusas + CIF automatizada + relatório multidisciplinar para impressão. Excedente a R$ 2,90/análise.",
  },
  clinicas: {
    key: "clinicas",
    name: "Clínica",
    tagline: "Para equipes que crescem juntas",
    monthly: 149.90,
    ...c,
    badge: "Para Equipes",
    highlight: false,
    features: {
      patients:   { label: "Pacientes",         value: "Ilimitado", avulso: false, start: false, evidencia: false, clinicas: true, note: null },
      users:      { label: "Profissional",       value: "Até 5 CREFITOs", avulso: false, start: false, evidencia: false, clinicas: true, note: "Inclusos. Adicionais: R$ 14,90/mês" },
      extraUser:  { label: "CREFITO extra",      value: "R$ 14,90/mês", avulso: false, start: false, evidencia: false, clinicas: true, note: "Após o 5º profissional" },
      voice:      { label: "Transcrição por voz",value: "Ilimitado", avulso: false, start: false, evidencia: false, clinicas: true, note: null },
      ai:         { label: "Análise por IA",     value: "150 análises/mês", avulso: false, start: false, evidencia: false, clinicas: true, note: "Cota compartilhada entre profissionais · Excedente: R$ 2,50/análise" },
      cif:        { label: "CIF Automatizada",   value: "Com qualificadores", avulso: false, start: false, evidencia: false, clinicas: true, note: null },
      report:     { label: "Relatório",          value: "Multidisciplinar (PDF)", avulso: false, start: false, evidencia: false, clinicas: true, note: "Pronto para impressão" },
      finance:    { label: "Financeiro",         value: "Consolidado multi-profissional", avulso: false, start: false, evidencia: false, clinicas: true, note: "Visão por profissional + consolidado da clínica" },
      agenda:     { label: "Agenda",             value: "Compartilhada", avulso: false, start: false, evidencia: false, clinicas: true, note: "Visão de todos os profissionais" },
      evidence:   { label: "Base de evidências", value: "Disponível", avulso: false, start: false, evidencia: false, clinicas: true, note: null },
      tests:      { label: "Testes com vídeo",   value: "36 testes", avulso: false, start: false, evidencia: false, clinicas: true, note: null },
      scales:     { label: "Escalas validadas",  value: "36 instrumentos", avulso: false, start: false, evidencia: false, clinicas: true, note: null },
      bodyMap:    { label: "BodyMap",            value: "Disponível", avulso: false, start: false, evidencia: false, clinicas: true, note: null },
    },
    featuredNote: "150 análises de IA/mês compartilhadas entre até 5 profissionais. Financeiro consolidado multi-profissional. Agenda compartilhada.",
  },
};

const PLAN_ORDER = ["avulso", "start", "evidencia", "clinicas"];

const PLAN_LIMITS = {
  trial: { maxPatients: Infinity, maxUsers: 1, voiceMinutes: Infinity },
  avulso: { maxPatients: 0, maxUsers: 0, voiceMinutes: 0 },
  start: { maxPatients: Infinity, maxUsers: 1, voiceMinutes: 60 },
  evidencia: { maxPatients: Infinity, maxUsers: 1, voiceMinutes: Infinity },
  clinicas: { maxPatients: Infinity, maxUsers: 5, voiceMinutes: Infinity },
};

const PLAN_LABELS = {
  trial: "Teste Gratuito",
  avulso: "Avulso",
  start: "Start",
  evidencia: "Evidência",
  clinicas: "Clínica",
};

const AI_LIMITS = {
  trial: 10,
  avulso: 0,
  start: 0,
  evidencia: 40,
  clinicas: 150,
};

const AI_OVERAGE = {
  trial: { pricePerAnalysis: 5.90, label: "Fim do teste: escolha um plano" },
  avulso: { pricePerAnalysis: 5.90, label: "R$ 5,90/análise" },
  start: { pricePerAnalysis: 5.90, label: "R$ 5,90/análise" },
  evidencia: { pricePerAnalysis: 2.90, label: "R$ 2,90/análise" },
  clinicas: { pricePerAnalysis: 2.50, label: "R$ 2,50/análise" },
};

export { PLANS, PLAN_ORDER, PLAN_LIMITS, PLAN_LABELS, AI_LIMITS, AI_OVERAGE };
