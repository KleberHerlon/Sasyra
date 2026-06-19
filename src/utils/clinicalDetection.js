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
  { parts: ["Mão D", "Mão E"],          base: "Mão",   pat: /mão|mao|mãos|maos|dedo|quervain|carpo|metacarpo|punho|túnel\s*carpo|tunel\s*carpo|compressão\s*mediano|rizoartrose|tenossinovite/i },
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

export function detectKB(txt) {
  const t = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const conds = [
    ["lombalgia",            /ciatica|ciatalgia|dor\s*ciatica|isquialgia/],
    ["lombalgia",            /lomb[aeio]|costa|dor\s*lombar|lombalgia/],
    ["hernia-disco-lombar",  /hernia\s*(de\s*)?disco(?!.*cerv)/],
    ["cervicalgia",          /cerv|pescoco|cervicalgia/],
    ["gonalgia",             /joelho\s*(inchado|edema|entorse)/],
    ["ombralgia",            /bursite(?!.*olecran)/],
    ["fibromialgia",         /cansaco\s*cronico|fadiga\s*cronica|dor\s*generalizada/],
    ["tendinopatia-patelar", /joelho\s*(de\s*)?saltador/],
    ["gonalgia",             /\bjoelho\b/],
    ["coxartrose",           /\bquadril\b/],
    ["fascite-plantar",      /fascite\s*plantar|fasceite|windlass/],
    ["tendinopatia-aquiles", /tendinopatia\s*(de\s*)?aquiles|tendao\s*aquiles|aquileu/],
    ["entorse-tornozelo",    /entorse\s*(de\s*)?tornozelo|torcao\s*tornozelo|ltfa/],
    ["sindrome-patelo femoral", /dor\s*patelofemoral|sindrome\s*patelofemoral|patelofemoral/],
    ["tendinopatia-patelar", /tendinopatia\s*patelar|tendao\s*patelar/],
    ["lca",                  /lca|lesao\s*(do\s*)?lca|ruptura\s*lca|reconstrucao\s*lca|cruzado\s*anterior/],
    ["lesao-meniscal",       /lesao\s*meniscal|menisco|meniscectomia/],
    ["artrose-joelho",       /artrose\s*(de\s*)?joelho|osteoartrite\s*joelho|oa\s*joelho|gonartrose/],
    ["tendinopatia-gluteo",  /tendinopatia\s*(de\s*)?gluteo|bursite\s*trocanterica|sindrome\s*dolorosa\s*trocanter/],
    ["impacto-femoroacetabular", /impacto\s*femoroacetabular|pincer|cam\s*lesao/],
    ["coxartrose",           /artrose\s*(de\s*)?quadril|osteoartrite\s*quadril|coxartrose/],
    ["lombalgia",            /lomb|costa|dor\s*lombar|lombalgia/],
    ["hernia-disco-lombar",  /hernia\s*(de\s*)?disco\s*lombar|protrusao\s*discal\s*lombar/],
    ["estenose-lombar",      /estenose\s*(do\s*)?canal\s*lombar|estenose\s*lombar/],
    ["espondilolistese",     /espondilolistese|espondilolise/],
    ["cervicalgia",          /cerv|pescoco|cervicalgia/],
    ["hernia-disco-cervical",/hernia\s*(de\s*)?disco\s*cervical|protrusao\s*discal\s*cervical/],
    ["radiculopatia-cervical",/radiculopatia\s*cervical|foraminal|esporao\s*cervical/],
    ["impacto-ombro",        /sindrome\s*(do\s*)?impacto\s*(do\s*)?ombro|impacto\s*subacromial|pinzamento/],
    ["manguito-rotador",     /lesao\s*(do\s*)?manguito\s*rotador|manguito|ruptura\s*manguito|supraespinhal/],
    ["capsulite-adesiva",    /capsulite\s*adesiva|ombro\s*congelado|aderencia\s*articular/],
    ["instabilidade-ombro",  /instabilidade\s*anterior\s*(do\s*)?ombro|luxacao\s*glenoumeral|bankart/],
    ["ombralgia",            /ombr|ombralgia/],
    ["epicondilite-lateral", /epicondilite\s*lateral|cotovelo\s*(de\s*)?tenista|epicondilalgia\s*lateral/],
    ["epicondilite-medial",  /epicondilite\s*medial|cotovelo\s*(de\s*)?golfista|epicondilalgia\s*medial/],
    ["cotovelo",             /cotov|olecran/],
    ["tunel-carpo",          /sindrome\s*(do\s*)?tunel\s*(do\s*)?carpo|tunel\s*carpo|compressao\s*mediano/],
    ["de-quervain",          /tenossinovite\s*(de\s*)?quervain|de\s*quervain/],
    ["osteoartrite-mao",     /rizartrose|artrose\s*(de\s*)?mao|artrose\s*dodos/],
    ["dtm",                  /dtm|disfuncao\s*temporomandibular|atm\s*dor/],
    ["escoliose",            /escoliose\s*idiopatica|escoliose/],
    ["hipercifose",          /hipercifose\s*toracica|hipercifose|cifose/],
    ["canelite",             /canelite|sindrome\s*(do\s*)?estresse\s*tibial|shin\s*splint/],
    ["estiramento-isquiotibiais", /estiramento\s*(de\s*)?isquiotibiais|isquiotibiais|distensao\s*isquio|posterior\s*coxa/],
    ["distensao-gemeos",     /distensao\s*(de\s*)?gemeos|panturrilha|gastrocnemio\s*lesao/],
    ["pubalgia",             /pubalgia|osteite\s*pubica|dor\s*inguinal\s*esforco/],
    ["trato-iliotibial",     /sindrome\s*(do\s*)?trato\s*iliotibial|banda\s*iliotibial|tfl|iliotibial/],
    ["condromalacia",        /condromalacia\s*patelar|amolecimento\s*patela/],
    ["bursite-olecraniana",  /bursite\s*olecraniana/],
    ["dedo-gatilho",         /dedo\s*gatilho|dedos\s*gatilho|tenossinovite\s*flexor/],
    ["desfiladeiro-toracico",/desfiladeiro\s*toracico|sindrome\s*do\s*desfiladeiro/],
    ["fibromialgia",         /fibromialgia/],
    ["esporao-calcaneo",     /esporao\s*(de\s*)?calcaneo|calcaneo\s*dor/],
    ["artrite-reumatoide",   /artrite\s*reumatoide|ar\s*joelho/],
    ["pos-artroplastia-joelho", /artroplastia\s*(de\s*)?joelho|protese\s*(de\s*)?joelho|pos-operatorio\s*joelho/],
    ["pos-artroplastia-quadril", /artroplastia\s*(de\s*)?quadril|protese\s*(de\s*)?quadril|pos-operatorio\s*quadril/],
    ["fratura-colles",       /fratura\s*(de\s*)?colles|fratura\s*radio\s*distal|fratura\s*punho/],
    ["miosite-ossificante",  /miosite\s*ossificante/],
    ["tendinopatia-biceps",  /tendinopatia\s*(do\s*)?biceps\s*braquial|tendao\s*(da\s*)?cabeca\s*longa/],
    ["subluxacao-patelar",   /subluxacao\s*patelar|instabilidade\s*patelar/],
    ["metatarsalgia",        /metatarsalgia|dor\s*metatarso/],
    ["neuroma-morton",       /neuroma\s*(de\s*)?morton|neuroma/],
    ["tornozelo",            /tornoz|pe\s|fasci|aquile/],
  ];
  for (const [key, regex] of conds) {
    if (regex.test(t)) return key;
  }
  const muscMap = {
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
  const muscTerms = {
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
  for (const [mk, regex] of Object.entries(muscTerms)) {
    if (regex.test(t)) return muscMap[mk];
  }
  return "";
}

export { DOR_KEYWORDS };
