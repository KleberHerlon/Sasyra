// @ts-nocheck
// ── DOR_KEYWORDS: mapeia texto da queixa a regiões anatômicas ────────────────
const DOR_KEYWORDS = [
  { parts: ["Cabeça"],      pat: /cabeça|cefal[eé]ia|cefaleia|cranio|crânio|atm|mandibular|temporal|occipital|parietal|cefaleia/i },
  { parts: ["Cervical"],    pat: /cervical|pescoço|pescoco|nuca|cervicalgia|radiculopatia\s*cervical/i },
  { parts: ["Trapézio"],    pat: /trapézio|trapezio/i },
  { parts: ["Torácica"],    pat: /torácica|toracica|dorsal|coluna\s*tor[aá]cica|torácica\s*alta|dorsalgia|desfiladeiro/i },
  { parts: ["Lombar"],      pat: /lombar|lombalgia|lomb|costa|ciatica|ciatalgia|isquialgia/i },
  { parts: ["Sacroilíaca"], pat: /sacroil[ií]aca|sacro|il[ií]aca|sacroiliaca|sacroilíaca/i },
  { parts: ["Glúteos"],     pat: /glúte|gluteo/i },
  { parts: ["Peitoral"],    pat: /peitoral|peito|esterno|costela|intercostal/i },
  { parts: ["Abdômen"],     pat: /abdômen|abdomen|abdominal|barriga|ventre|reto\s*abdominal|obl[ií]quo/i },

  { parts: ["Ombro D"],      base: "Ombro", pat: /ombro\s*(d[íi]reito|d\b)/i },
  { parts: ["Ombro E"],      base: "Ombro", pat: /ombro\s*esquerdo/i },
  { parts: ["Braço D"],      base: "Braço", pat: /bra[çc]o\s*(d[íi]reito|d\b)/i },
  { parts: ["Braço E"],      base: "Braço", pat: /bra[çc]o\s*esquerdo/i },
  { parts: ["Antebraço D"],  base: "Antebraço", pat: /antebra[çc]o\s*(d[íi]reito|d\b)|cotovelo\s*(d[íi]reito|d\b)/i },
  { parts: ["Antebraço E"],  base: "Antebraço", pat: /antebra[çc]o\s*esquerdo|cotovelo\s*esquerdo/i },
  { parts: ["Mão D"],        base: "Mão",   pat: /m[ãa]o\s*(d[íi]reit[ao]|d\b)|dedo\s*(d[íi]reito|d\b)|punho\s*(d[íi]reito|d\b)/i },
  { parts: ["Mão E"],        base: "Mão",   pat: /m[ãa]o\s*esquerda|dedo\s*esquerdo|punho\s*esquerdo/i },
  { parts: ["Quadril D"],    base: "Quadril", pat: /quadril\s*(d[íi]reito|d\b)/i },
  { parts: ["Quadril E"],    base: "Quadril", pat: /quadril\s*esquerdo/i },
  { parts: ["Adutores D"],   base: "Adutores", pat: /adutor\s*(d[íi]reito|d\b)/i },
  { parts: ["Adutores E"],   base: "Adutores", pat: /adutor\s*esquerdo/i },
  { parts: ["Joelho D"],     base: "Joelho", pat: /joelho\s*(d[íi]reito|d\b)|patel[ao]\s*(d[íi]reito|d\b)|menisco\s*(d[íi]reito|d\b)/i },
  { parts: ["Joelho E"],     base: "Joelho", pat: /joelho\s*esquerdo|patel[ao]\s*esquerdo|menisco\s*esquerdo/i },
  { parts: ["Perna D"],      base: "Perna",  pat: /perna\s*(d[íi]reit[ao]|d\b)|t[ií]bia\s*(d[íi]reit[ao]|d\b)/i },
  { parts: ["Perna E"],      base: "Perna",  pat: /perna\s*esquerda|t[ií]bia\s*esquerda/i },
  { parts: ["Tornozelo D"],  base: "Tornozelo", pat: /tornozelo\s*(d[íi]reito|d\b)|aquiles\s*(d[íi]reito|d\b)/i },
  { parts: ["Tornozelo E"],  base: "Tornozelo", pat: /tornozelo\s*esquerdo|aquiles\s*esquerdo/i },
  { parts: ["Pé D"],         base: "Pé",    pat: /p[ée]\s*(d[íi]reito|d\b)/i },
  { parts: ["Pé E"],         base: "Pé",    pat: /p[ée]\s*esquerdo/i },

  { parts: ["Ombro D", "Ombro E"],      base: "Ombro", pat: /ombro|ombralgia|deltoide|supraespinhal|manguito|subacromial|impacto.*ombro|capsulite|bursite(?!.*olecran)/i },
  { parts: ["Braço D", "Braço E"],      base: "Braço", pat: /braço|braco|b[ií]ceps\s*braquial|tr[ií]ceps\s*braquial|umero|úmero|braquial/i },
  { parts: ["Antebraço D", "Antebraço E"], base: "Antebraço", pat: /antebraço|antebraco|cotovelo|epicondil|olecran|cotov/i },
  { parts: ["Mão D", "Mão E"],          base: "Mão",   pat: /mão|mao|mãos|maos|dedo|polegar|pinca|quervain|carpo|metacarpo|punho|túnel\s*carpo|tunel\s*carpo|compressão\s*mediano|rizoartrose|tenossinovite|base\s*(do\s*)?polegar/i },
  { parts: ["Quadril D", "Quadril E"],   base: "Quadril", pat: /quadril|coxartrose|trocanter|femoroacetabular|anca|psoas|iliopsoas|artrose\s*quadril|sindrome\s*dolorosa\s*trocanter/i },
  { parts: ["Adutores D", "Adutores E"], base: "Adutores", pat: /adutor|virilha|pubalgia|inguinal|pub[ií]s/i },
  { parts: ["Joelho D", "Joelho E"],    base: "Joelho", pat: /joelho|gon[áa]lgia|gonalgia|patel[ao]|menisco|femoro|f[eê]mur|t[ií]bia|popl[ií]teo|artrose\s*joelho|gonartrose|tendinopatia\s*patelar|joelho\s*saltador|condromalacia|bursite.*patelar|síndrome\s*patelofemoral|sindrome\s*patelofemoral|LCA|cruzado\s*anterior|cruzado\s*posterior|joelho/i },
  { parts: ["Perna D", "Perna E"],      base: "Perna",  pat: /perna|t[ií]bia|canelite|panturrilha|gastrocn[eê]mio|g[eê]meos|s[oó]leo|isquiotibiais|fibular|tibial\s*anterior|soleo|popliteo|quadrado\s*plantar|tensor\s*da\s*f[áa]scia\s*lata|tfl|trato\s*iliotibial|banda\s*iliotibial/i },
  { parts: ["Tornozelo D", "Tornozelo E"], base: "Tornozelo", pat: /tornozelo|tornoz|entorse|ltfa|aquiles|aquileu|calc[âa]neo|talo|retrop[eé]|mediop[eé]|s[íi]ndrome\s*do\s*trato\s*iliotibial|fibular|fibulares/i },
  { parts: ["Pé D", "Pé E"],            base: "Pé",    pat: /p[ée]\b|fascite|fascia|fasceite|metatarso|morton|espor[ãa]o|calc[âa]neo|dedo.*gatilho|h[áa]lux|hallux|podod[aá]ctilo|metatarsalgia|neuroma|artrite\s*reumatoide/i },
];

export function detectLocalDor(txt) {
  if (!txt) return [];
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const found = new Set();
  const resolvedBases = new Set();
  DOR_KEYWORDS.forEach(({ parts, pat, base }) => {
    if (base && parts.length === 1 && pat.test(t)) {
      parts.forEach(p => found.add(p));
      resolvedBases.add(base);
    }
  });
  DOR_KEYWORDS.forEach(({ parts, pat, base }) => {
    if (!base) {
      if (pat.test(t)) parts.forEach(p => found.add(p));
    } else if (!resolvedBases.has(base)) {
      if (pat.test(t)) parts.forEach(p => found.add(p));
    }
  });
  return [...found];
}

// ── Shared detection constants ──────────────────────────────────────────────
const KB_CONDS = [
  // ── Specific pathologies (checked before generic regions) ───
  ["estenose-lombar",      /estenose\s*(do\s*)?canal\s*lombar|estenose\s*lombar|piora.*andar.*melhora.*sentar/],
  ["hernia-disco-lombar",  /hernia\s*(de\s*)?disco(?!.*cerv)/],
  ["hernia-disco-lombar",  /hernia\s*(de\s*)?disco\s*lombar|protrusao\s*discal\s*lombar/],
  ["espondilolistese",     /espondilolistese|espondilolise/],
  ["cervicalgia",          /cerv|pescoco|cervicalgia/],
  ["hernia-disco-cervical",/hernia\s*(de\s*)?disco\s*cervical|protrusao\s*discal\s*cervical/],
  ["radiculopatia-cervical",/radiculopatia\s*cervical|foraminal|esporao\s*cervical/],
  ["capsulite-adesiva",    /capsulite\s*adesiva|ombro\s*congelado|aderencia\s*articular|rigidez.*capsular|capsular.*rigidez|perda.*movimento.*ombro/],
  ["instabilidade-ombro",  /instabilidade\s*anterior\s*(do\s*)?ombro|luxacao\s*glenoumeral|bankart|saiu\s*do\s*lugar|frouxidao/],
  ["manguito-rotador",     /lesao\s*(do\s*)?manguito\s*rotador|manguito|ruptura\s*manguito|supraespinhal/],
  ["impacto-ombro",        /sindrome\s*(do\s*)?impacto\s*(do\s*)?ombro|impacto\s*subacromial|pinzamento|impacto.*ombro/],
  ["lca",                  /lca|lesao\s*(do\s*)?lca|ruptura\s*lca|reconstrucao\s*lca|cruzado\s*anterior/],
  ["lesao-meniscal",       /lesao\s*meniscal|menisco|meniscectomia|travamento.*(mecanico|joelho)/],
  ["artrose-joelho",       /artrose\s*(de\s*)?joelho|osteoartrite\s*joelho|oa\s*joelho|gonartrose/],
  ["sindrome-patelo femoral", /dor\s*patelofemoral|sindrome\s*patelofemoral|patelofemoral/],
  ["tendinopatia-patelar", /tendinopatia\s*patelar|tendao\s*patelar/],
  ["tendinopatia-patelar", /joelho\s*(de\s*)?saltador/],
  ["condromalacia",        /condromalacia\s*patelar|amolecimento\s*patela/],
  ["subluxacao-patelar",   /subluxacao\s*patelar|instabilidade\s*patelar/],
  ["tendinopatia-gluteo",  /tendinopatia\s*(de\s*)?gluteo|bursite\s*trocanterica|sindrome\s*dolorosa\s*trocanter/],
  ["impacto-femoroacetabular", /impacto\s*femoroacetabular|pincer|cam\s*lesao|pincamento/],
  ["coxartrose",           /artrose\s*(de\s*)?quadril|osteoartrite\s*quadril|coxartrose/],
  ["coxartrose",           /\bquadril\b/],
  ["tendinopatia-aquiles", /tendinopatia\s*(de\s*)?aquiles|tendao\s*(de\s*)?aquiles|aquileu/],
  ["entorse-tornozelo",    /entorse\s*(de\s*)?tornozelo|torcao\s*tornozelo|ltfa/],
  ["fascite-plantar",      /fascite\s*plantar|fasceite|windlass|sola.*pe.*primeiros.*passos|dor.*sola.*pe/],
  ["fratura-colles",       /fratura\s*(de\s*)?colles|fratura\s*radio\s*distal|fratura\s*punho/],
  ["epicondilite-lateral", /epicondilite\s*lateral|cotovelo\s*(de\s*)?tenista|epicondilalgia\s*lateral|lateral\s*(do\s*)?cotovelo/],
  ["epicondilite-medial",  /epicondilite\s*medial|cotovelo\s*(de\s*)?golfista|epicondilalgia\s*medial|interna\s*(do\s*)?cotovelo/],
  ["bursite-olecraniana",  /bursite\s*olecraniana/],
  ["tunel-carpo",          /sindrome\s*(do\s*)?tunel\s*(do\s*)?carpo|tunel\s*carpo|compressao\s*mediano|formigamento.*(dedo|mao|palma)/],
  ["de-quervain",          /tenossinovite\s*(de\s*)?quervain|de\s*quervain|base\s*(do\s*)?polegar/],
  ["osteoartrite-mao",     /rizartrose|artrose\s*(de\s*)?mao|artrose\s*dodos/],
  ["dedo-gatilho",         /dedo\s*gatilho|dedos\s*gatilho|tenossinovite\s*flexor/],
  ["desfiladeiro-toracico",/desfiladeiro\s*toracico|sindrome\s*do\s*desfiladeiro/],
  ["pos-artroplastia-joelho", /artroplastia\s*(de\s*)?joelho|protese\s*(de\s*)?joelho|pos-operatorio\s*joelho/],
  ["pos-artroplastia-quadril", /artroplastia\s*(de\s*)?quadril|protese\s*(de\s*)?quadril|pos-operatorio\s*quadril/],
  ["estiramento-isquiotibiais", /estiramento\s*(de\s*)?isquiotibiais|isquiotibiais|distensao\s*isquio|posterior\s*coxa/],
  ["distensao-gemeos",     /distensao\s*(de\s*)?gemeos|panturrilha|gastrocnemio\s*lesao/],
  ["trato-iliotibial",     /sindrome\s*(do\s*)?trato\s*iliotibial|banda\s*iliotibial|tfl|iliotibial/],
  ["pubalgia",             /pubalgia|osteite\s*pubica|dor\s*inguinal\s*esforco/],
  ["canelite",             /canelite|sindrome\s*(do\s*)?estresse\s*tibial|shin\s*splint/],
  ["miosite-ossificante",  /miosite\s*ossificante/],
  ["tendinopatia-biceps",  /tendinopatia\s*(do\s*)?biceps\s*braquial|tendao\s*(da\s*)?cabeca\s*longa/],
  ["metatarsalgia",        /metatarsalgia|dor\s*metatarso/],
  ["neuroma-morton",       /neuroma\s*(de\s*)?morton|neuroma/],
  ["esporao-calcaneo",     /esporao\s*(de\s*)?calcaneo|calcaneo\s*dor/],
  ["artrite-reumatoide",   /artrite\s*reumatoide|ar\s*joelho/],
  // ── Generic / broad regions (checked last) ────────────────────
  ["lombalgia",            /ciatica|ciatalgia|dor\s*ciatica|isquialgia/],
  ["lombalgia",            /lomb[aeio]|costa|dor\s*lombar|lombalgia|lomb|costa/],
  ["cervicalgia",          /cerv|pescoco|cervicalgia/],
  ["gonalgia",             /joelho\s*(inchado|edema|entorse)/],
  ["gonalgia",             /\bjoelho\b/],
  ["ombralgia",            /bursite(?!.*olecran)/],
  ["ombralgia",            /ombr|ombralgia/],
  ["cotovelo",             /cotov|olecran/],
  ["tornozelo",            /tornoz|pe\s/],
  ["fibromialgia",         /cansaco\s*cronico|fadiga\s*cronica|dor\s*generalizada/],
  ["fibromialgia",         /fibromialgia/],
  ["escoliose",            /escoliose\s*idiopatica|escoliose/],
  ["hipercifose",          /hipercifose\s*toracica|hipercifose|cifose/],
  ["dtm",                  /dtm|disfuncao\s*temporomandibular|atm\s*dor/],
];

const KB_MUSCLE_MAP = {
  "trapezio":"cervicalgia", "quadriceps":"gonalgia", "isquiotibiais":"gonalgia",
  "gluteo":"lombalgia", "adutores":"coxartrose", "biceps-braquial":"ombralgia",
  "triceps-braquial":"cotovelo", "gastrocnemio":"tornozelo", "soleo":"tornozelo",
  "tibial-anterior":"tornozelo", "fibulares":"tornozelo", "peitoral":"ombralgia",
  "grande-dorsal":"ombralgia", "romboides":"cervicalgia", "serratil-anterior":"ombralgia",
  "tensor-fascia-lata":"coxartrose", "piriforme":"lombalgia", "iliopsoas":"lombalgia",
  "reto-abdominal":"lombalgia", "obliquo":"lombalgia", "multifidos":"lombalgia",
  "quadrado-lombar":"lombalgia", "esternocleidomastoideo":"cervicalgia",
  "escalenos":"cervicalgia", "popliteo":"gonalgia", "quadrado-plantar":"tornozelo",
};

const KB_MUSCLE_TERMS = {
  "trapezio":/trapezio/, "quadriceps":/quadriceps/,
  "isquiotibiais":/isquiotibiais|isquio/, "gluteo":/gluteo/,
  "adutores":/adutores/, "biceps-braquial":/biceps\s*braquial/,
  "triceps-braquial":/triceps\s*braquial/, "gastrocnemio":/gastrocnemio|gemeos/,
  "soleo":/soleo/, "tibial-anterior":/tibial\s*anterior/,
  "fibulares":/fibulares|fibular/, "peitoral":/peitoral/,
  "grande-dorsal":/grande\s*dorsal|latissimo\s*do\s*dorso/, "romboides":/romboides/,
  "serratil-anterior":/serratil/, "tensor-fascia-lata":/tensor\s*da\s*fascia\s*lata|tfl/,
  "piriforme":/piriforme/, "iliopsoas":/iliopsoas/,
  "reto-abdominal":/reto\s*abdominal|abdominal|abdomen/,
  "obliquo":/obliquo/, "multifidos":/multifidos/,
  "quadrado-lombar":/quadrado\s*lombar/, "esternocleidomastoideo":/esternocleidomastoideo/,
  "escalenos":/escalenos/, "popliteo":/popliteo/,
  "quadrado-plantar":/quadrado\s*plantar/,
};

export function detectKB(txt) {
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, regex] of KB_CONDS) {
    if (regex.test(t)) return key;
  }
  for (const [mk, regex] of Object.entries(KB_MUSCLE_TERMS)) {
    if (regex.test(t)) return KB_MUSCLE_MAP[mk];
  }
  return "";
}

export function detectMultipleKB(txt) {
  if (!txt) return [];
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const found = [];
  const seen = new Set();
  for (const [key, regex] of KB_CONDS) {
    if (regex.test(t) && !seen.has(key)) {
      found.push(key);
      seen.add(key);
    }
  }
  for (const [mk, regex] of Object.entries(KB_MUSCLE_TERMS)) {
    if (regex.test(t)) {
      const key = KB_MUSCLE_MAP[mk];
      if (!seen.has(key)) {
        found.push(key);
        seen.add(key);
      }
    }
  }
  return found;
}

// ── Muscle → body region mapping (for detailed entity detection) ──────────
const MUSCLE_TO_REGION = {
  gastrocnemio:"Perna", gastrocnêmio:"Perna", gemeos:"Perna", gêmeos:"Perna",
  soleo:"Perna", sóleo:"Perna", soleus:"Perna",
  tibial_anterior:"Perna", fibulares:"Perna", fibular:"Perna",
  quadriceps:"Perna", isquiotibiais:"Perna", isquiotibial:"Perna",
  popliteo:"Perna", poplíteo:"Perna",
  biceps_braquial:"Braço", triceps_braquial:"Braço", braquial:"Braço",
  deltoide:"Ombro", deltóide:"Ombro", supraespinhal:"Ombro", infraespinhal:"Ombro",
  subescapular:"Ombro", manguito:"Ombro",
  trapezio:"Trapézio", trapézio:"Trapézio",
  peitoral:"Peitoral", grande_dorsal:"Torácica", latissimo:"Torácica",
  gluteo:"Glúteos", glúteo:"Glúteos", gluteo_medio:"Glúteos",
  piriforme:"Glúteos", iliopsoas:"Lombar", psoas:"Lombar",
  reto_abdominal:"Abdômen", obliquo:"Abdômen", oblíquo:"Abdômen",
  quadrado_lombar:"Lombar", multifidos:"Lombar",
  escalenos:"Cervical", esternocleidomastoideo:"Cervical", ecm:"Cervical",
  adutores:"Adutores", adutor:"Adutores",
  tensor_fascia_lata:"Quadril", tfl:"Quadril",
  sartorio:"Quadril", sartório:"Quadril",
  redondo_maior:"Ombro", redondo_menor:"Ombro",
  romboides:"Torácica", rombóides:"Torácica",
  serratil:"Torácica",
};

// ── Pain character keywords ─────────────────────────────────────────────────
const PAIN_CHAR_KEYWORDS = [
  { chars:["Aguda"],      pat:/aguda|agudo|s[iú]bita|repentina|recente|in[ií]cio\s*repentino/i },
  { chars:["Crônica"],    pat:/crônica|cronica|cr[oô]nica|persistente|h[aá] \d+\s*(meses|anos)|recorrente/i },
  { chars:["Mecânica"],   pat:/mec[âa]nica|movimento|esfor[çc]o|sobrecarga|postura|atividade/i },
  { chars:["Inflamatória"], pat:/inflama[tóo]ria|edema|calor|rubor|incha[çc]o|derrame|sinovite|bursite/i },
  { chars:["Neuropática"], pat:/neurop[aá]tica|queima[çc][ãa]o|formigamento|choque|agulhada|dorm[êe]ncia|parestesia|radiculopatia/i },
  { chars:["Referida"],   pat:/referida|irradia[çc][ãa]o|projetada|dist[aâ]ncia|difusa/i },
];

// ── Laterality detection ────────────────────────────────────────────────────
const LAT_PAT = {
  direito: /d[íi]reit[ao]/i,
  esquerdo: /esquerd[ao]/i,
  bilateral: /bilateral|ambos|dos\s*dois\s*lados|sim[eé]trico/i,
};

// ── Extract laterality from normalized text ─────────────────────────────────
function detectLaterality(t) {
  if (LAT_PAT.bilateral.test(t)) return "Bilateral";
  const d = (t.match(LAT_PAT.direito)||[]).length;
  const e = (t.match(LAT_PAT.esquerdo)||[]).length;
  if (d > 0 && e > 0) return "Bilateral";
  if (d > 0) return "Direito";
  if (e > 0) return "Esquerdo";
  return "";
}

// ── Extract pain characteristics from raw text ──────────────────────────────
function detectPainChars(txt) {
  if (!txt) return [];
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const found = new Set();
  PAIN_CHAR_KEYWORDS.forEach(({ chars, pat }) => {
    if (pat.test(t)) chars.forEach(c => found.add(c));
  });
  return [...found];
}

// ── Extract specific muscle names mentioned ─────────────────────────────────
function detectMuscles(txt) {
  if (!txt) return [];
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const found = [];
  for (const [slug, _region] of Object.entries(MUSCLE_TO_REGION)) {
    const display = slug.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    if (new RegExp(slug.replace(/_/g, "[\\s-]?"), "i").test(t)) {
      if (!found.includes(display)) found.push(display);
    }
  }
  return found;
}

// ── Generate Diagnóstico Cinesioterapêutico suggestion ─────────────────────
function genDCSuggestion({ regions, muscles, laterality, conditionKey }) {
  const parts = [];
  if (conditionKey) {
    const nameMap = {
      lombalgia:"Lombalgia", cervicalgia:"Cervicalgia", gonalgia:"Gonalgia",
      ombralgia:"Ombralgia", coxartrose:"Coxartrose",
      "tendinopatia-patelar":"Tendinopatia Patelar",
      "entorse-tornozelo":"Entorse de Tornozelo",
      "fascite-plantar":"Fascite Plantar",
      "tendinopatia-aquiles":"Tendinopatia de Aquiles",
    };
    parts.push(nameMap[conditionKey] || conditionKey.replace(/-/g, " "));
  }
  if (muscles.length > 0) {
    parts.push(`envolvendo ${muscles.join(" e ")}`);
  }
  if (regions.length > 0) {
    const regStr = regions.map(r => laterality === "Bilateral"
      ? r.replace(/ [DE]$/, "") : r).join(", ");
    parts.push(`em ${regStr}`);
  }
  if (laterality && laterality !== "Bilateral") {
    parts.push(`(${laterality})`);
  }
  return parts.length > 0 ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + (parts.length > 1 ? ", " + parts.slice(1).join(" ") : "") : "";
}

// ── Main entity extraction function ─────────────────────────────────────────
export function extractClinicalEntities(txt) {
  if (!txt) return { regions:[], laterality:"", muscles:[], painChars:[], conditionKey:"" };
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return {
    regions: detectLocalDor(txt),
    laterality: detectLaterality(t),
    muscles: detectMuscles(txt),
    painChars: detectPainChars(txt),
    conditionKey: detectKB(txt),
  };
}

export { DOR_KEYWORDS, MUSCLE_TO_REGION, genDCSuggestion };
