const GOAL_KEYWORDS = [
  { objetivo: "hipertrofia", pat: /hipertrofia|crescer|ganhar\s*massa|aumentar\s*m[úu]sculo|bulk|volume\s*muscular|massa\s*magra|musculatura|defini[cç][ãa]o\s*muscular/i },
  { objetivo: "forca", pat: /for[cç]a|forca|pot[eê]ncia|explos[aã]o|levantamento|força.*máxima|forca.*maxima|maximo|máximo/i },
  { objetivo: "emagrecimento", pat: /emagrecimento|perder\s*peso|secar|definir|perder\s*gordura|reduzir\s*[bB]f|cortar\s*peso|perda\s*de\s*peso|emagrecer|low\s*carb|d[ée]ficit|perder\s*barriga|redução\s*de\s*gordura|queimar\s*gordura|perder\s*medidas|emagrec/i },
  { objetivo: "resistencia", pat: /resist[eê]ncia|endurance|resistencia\s*muscular|condicionamento|longa\s*dura[cç][ãa]o|aguentar|aguentar|ficar\s*mais\s*tempo|n[aã]o\s*cansar|alta\s*repeti[cç][ãa]o|repetições\s*altas|resistance/i },
  { objetivo: "aerobico_saude", pat: /cardio|aer[oó]bico|condicionamento\s*cardio|sa[úu]de\s*cardiovascular|f[oó]lego|melhorar\s*cardio|emagrecer\s*cardio|fôlego|resistencia\s*cardio|respira[cç][ãa]o/i },
  { objetivo: "potencia", pat: /pot[eê]ncia|explos[aã]o|pliom[eé]trico|saltar|correr\s*r[áa]pido|sprint|potência|explosão|pliométrico|saltos/i },
];

const RISK_KEYWORDS = [
  { fator: "idade", pat: /\b(6[0-9]|[7-9][0-9]|1[0-9]{2})\s*anos|\bidos[oa]|terceira\s*idade/i },
  { fator: "tabagismo", pat: /fumante|tabagista|fuma|cigarro|cigarro|fumo/i },
  { fator: "sedentarismo", pat: /sedent[aá]rio|inaptid[aã]o|n[aã]o\s*pratica\s*exerc[ií]cio|vida\s*sedent[aá]ria|parado|inatividade/i },
  { fator: "obesidade", pat: /obes[oa]|imc.*(3[0-9]|[45][0-9])|obesidade\s*m[óo]rbida|sobrepeso\s*grave/i },
  { fator: "hipertensao", pat: /hipertens[aã]o|press[aã]o\s*alta|has|pa\s*alta|pressão\s*alta/i },
  { fator: "dislipidemia", pat: /dislipidemia|colesterol\s*alto|triglicer[ií]deos\s*alto|ldl\s*alto|hdl\s*baixo|colesterol/i },
  { fator: "diabetes", pat: /diabetes|diab[eé]tico|dm\s*tipo|glicemia\s*alta|a[cç][uú]car\s*no\s*sangue|açúcar\s*no\s*sangue|insulina/i },
  { fator: "hf_cardiaca", pat: /hist[óo]rico\s*familiar.*(cardíaco|cardiaco|infarto|ava|morte\s*s[úu]bita|coronariana|cardiovascular)/i },
  { fator: "sintomas_cardiacos", pat: /dor\s*no\s*peito|palpita[cç][ãa]o|tontura\s*.*exerc[ií]cio|falta\s*(de\s*)?ar\s*.*repouso|desmaio|sincope|dispneia|angina|precordialgia/i },
];

const RESTRICTION_KEYWORDS = [
  { local: "Joelho", alerta: "Evitar agachamento profundo e leg press com amplitude total",
    pat: /joelho|condromal[aá]cia|patel[ao]|menisco|lca|lcp|gonartrose|patela|plica/i,
    evidencia: "ACSM contraindica ADM completa em condições patelofemorais" },
  { local: "Lombar", alerta: "Evitar compressão axial (agachamento com barra alta, terra convencional)",
    pat: /lombar|h[eé]rnia\s*discal|lombalgia|coluna|hérnia\s*discal\s*lombar|espondilolistese|estenose.*lombar|ci[aá]tica/i,
    evidencia: "NSCA recomenda alternativas unilaterais para hérnia discal" },
  { local: "Ombro", alert: "Evitar desenvolvimento por trás da nuca e supino com pegada muito aberta",
    pat: /ombro|manguito|impacto|bursite\s*ombro|capsulite|supraespinhal|ombralgia/i,
    evidencia: "ACSM contraindica exercícios acima de 90° de abdução em lesões do manguito" },
  { local: "Cervical", alerta: "Evitar encolhimento com carga alta e contato de contato",
    pat: /cervical|pescoço|nuca|cervicalgia|pescoco/i,
    evidencia: "Evitar sobrecarga axial em condições cervicais" },
  { local: "Quadril", alerta: "Evitar agachamento profundo e afundo com rotação",
    pat: /quadril|coxartrose|impacto\s*femoroacetabular|pincer|cam|artrose\s*quadril/i,
    evidencia: "Evitar ADM completa em impacto femoroacetabular" },
];

export function detectPerformanceGoals(txt) {
  if (!txt) return [];
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const found = [];
  const seen = new Set();
  for (const { objetivo, pat } of GOAL_KEYWORDS) {
    if (pat.test(t) && !seen.has(objetivo)) {
      found.push(objetivo);
      seen.add(objetivo);
    }
  }
  return found;
}

export function detectRiskFactors(txt) {
  if (!txt) return [];
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const found = [];
  const seen = new Set();
  for (const { fator, pat } of RISK_KEYWORDS) {
    if (pat.test(t) && !seen.has(fator)) {
      found.push(fator);
      seen.add(fator);
    }
  }
  return found;
}

export function detectRestrictions(txt) {
  if (!txt) return [];
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const found = [];
  const seen = new Set();
  for (const r of RESTRICTION_KEYWORDS) {
    if (patTest(r.pat, t) && !seen.has(r.local)) {
      found.push({
        local: r.local,
        alerta: r.alerta,
        descricao: r.alerta,
        evidencia: r.evidencia,
        tipo: "alerta",
      });
      seen.add(r.local);
    }
  }
  return found;
}

function patTest(pat, t) {
  return pat.test(t);
}

export function detectPerformanceEntities(txt) {
  if (!txt) return { objetivos: [], riscos: [], restricoes: [], condicoesPreExistentes: [] };
  return {
    objetivos: detectPerformanceGoals(txt),
    riscos: detectRiskFactors(txt),
    restricoes: detectRestrictions(txt),
    condicoesPreExistentes: [],
  };
}
