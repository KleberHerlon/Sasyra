// ── Body region → CIF code mapping ──────────────────────────────────────────
export const REGIAO_CIF = {
  "Cabeça":      ["b28010"],
  "Cervical":    ["b28010","s76000"],
  "Torácica":    ["b28013","s76010"],
  "Lombar":      ["b28013","s76020"],
  "Sacroilíaca": ["b28013","s740"],
  "Ombro":       ["b28014","s720"],
  "Braço":       ["b28014","s7300"],
  "Antebraço":   ["b28014","s7301"],
  "Mão":         ["b28014","s7302"],
  "Quadril":     ["b28015","s7500"],
  "Joelho":      ["b28015","s7501"],
  "Perna":       ["b28015","s7502"],
  "Tornozelo":   ["b28015","s7502"],
  "Pé":          ["b28015","s7502"],
};

// ── Pathology slug → recommended scales ─────────────────────────────────────
export const PATOLOGIA_ESCALAS = {
  lombalgia:       ["Oswestry Disability Index (ODI)", "Escala de Tampa para Cinesiofobia", "HAD (Ansiedade e Depressão)"],
  cervicalgia:     ["Neck Disability Index (NDI)", "Escala de Tampa para Cinesiofobia"],
  gonalgia:        ["KOOS (Joelho)", "WOMAC", "Lower Extremity Functional Scale (LEFS)"],
  ombralgia:       ["DASH (Ombro)", "UCLA Shoulder Score", "ASES Shoulder Score"],
  tornozelo:       ["Lower Extremity Functional Scale (LEFS)", "Foot and Ankle Ability Measure (FAAM)"],
  cotovelo:        ["DASH (Ombro)", "Patient-Rated Tennis Elbow Evaluation (PRTEE)"],
  quadril:         ["Harris Hip Score", "WOMAC", "Lower Extremity Functional Scale (LEFS)"],
  joelho:          ["KOOS (Joelho)", "WOMAC", "Lower Extremity Functional Scale (LEFS)"],
  punho:           ["DASH (Ombro)", "Patient-Rated Wrist Evaluation (PRWE)"],
};

// ── Keyword → pathology slug mapping ────────────────────────────────────────
export const KEYWORD_PATOLOGIA = {
  lombalgia: ["lombalgia","lombar","lombociática","lombociatalgia","hérnia de disco lombar","estenose lombar"],
  cervicalgia: ["cervicalgia","cervical","cervicobraquialgia","hérnia de disco cervical","torcicolo"],
  gonalgia: ["gonalgia","joelho","lca","ligamento cruzado anterior","menisco","patelar","joelh"],
  ombralgia: ["ombralgia","ombro","manguito rotador","luxação de ombro","capsulite adesiva","ombro congelado","impacto subacromial"],
  tornozelo: ["tornozelo","entorse","tornoz","fratura de tornozelo"],
  cotovelo: ["cotovelo","epicondilite","cotovelo de tenista","cotovelo de golfista"],
  quadril: ["quadril","coxalgia","bursite trocantérica","artrose de quadril"],
  punho: ["punho","síndrome do túnel do carpo","tenossinovite de de quervain"],
};

export function detectPatologia(texto) {
  if (!texto) return null;
  const lower = texto.toLowerCase();
  for (const [slug, keywords] of Object.entries(KEYWORD_PATOLOGIA)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return slug;
    }
  }
  return null;
}

// ── Honorarios defaults (fallback) ──────────────────────────────────────────
export const HONORARIO_DEFAULT = {
  consulta: 180,
  sessao: 160,
};
