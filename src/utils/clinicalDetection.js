// ── Special compound region expansions ───────────────────────────────────────
const LEFT_REGIONS = ["Ombro E", "Braço E", "Antebraço E", "Mão E", "Quadril E", "Joelho E", "Perna E", "Tornozelo E", "Pé E", "Adutores E"];
const RIGHT_REGIONS = ["Ombro D", "Braço D", "Antebraço D", "Mão D", "Quadril D", "Joelho D", "Perna D", "Tornozelo D", "Pé D", "Adutores D"];
const MMSS_REGIONS = ["Ombro D", "Ombro E", "Braço D", "Braço E", "Antebraço D", "Antebraço E", "Mão D", "Mão E"];
const MMII_REGIONS = ["Quadril D", "Quadril E", "Joelho D", "Joelho E", "Perna D", "Perna E", "Tornozelo D", "Tornozelo E", "Pé D", "Pé E", "Adutores D", "Adutores E"];

function expandLaterality(t) {
  const d = (t.match(/direit[ao]|d\b(?!\s+[aáàâãeéêiíoóôõuú])/gi) || []).length;
  const e = (t.match(/esquerd[ao]/gi) || []).length;
  if (/bilateral|ambos|dos\s*dois\s*lados|simétrico|simetrico/i.test(t) || (d > 0 && e > 0)) return "Bilateral";
  if (e > 0) return "Esquerdo";
  if (d > 0) return "Direito";
  return "";
}

// ── DOR_KEYWORDS: mapeia texto da queixa a regiões anatômicas ────────────────
const DOR_KEYWORDS = [
  { parts: ["Cabeça"],      pat: /cabeça|cefal[eé]ia|cefaleia|cranio|crânio|atm|mandibular|temporal|occipital|parietal|cefaleia|face|facial|hemiface|paralisia\s*facial/i },
  { parts: ["Cervical"],    pat: /cervical|pescoço|pescoco|nuca|cervicalgia|radiculopatia\s*cervical|cervicobraquialgia|cervicobraquial/i },
  { parts: ["Trapézio"],    pat: /trapézio|trapezio|trapécio|trapacio/i },
  { parts: ["Torácica"],    pat: /torácica|toracica|dorsal|coluna\s*tor[aá]cica|torácica\s*alta|dorsalgia|desfiladeiro|precordial|dor\s*tor[aá]cica|aperto\s*no\s*peito/i },
  { parts: ["Lombar"],      pat: /lombar|lombalgia|lomb|costa|ciatica|ciatalgia|isquialgia|lombociatalgia|lombociática/i },
  { parts: ["Sacroilíaca"], pat: /sacroil[ií]aca|sacro|il[ií]aca|sacroiliaca|sacroilíaca|crista\s*il[ií]aca|sacro/i },
  { parts: ["Glúteos"],     pat: /glúte|gluteo|gluteal|nádegas|nadegas/i },
  { parts: ["Peitoral"],    pat: /peitoral|peito|esterno|costela|intercostal/i },
  { parts: ["Abdômen"],     pat: /abdômen|abdomen|abdominal|barriga|ventre|reto\s*abdominal|obl[ií]quo/i },

  { parts: ["Ombro D"],      base: "Ombro", pat: /ombro\s*(d[íi]reito|d\b)/i },
  { parts: ["Ombro E"],      base: "Ombro", pat: /ombro\s*esquerdo|ombro\s*e\b/i },
  { parts: ["Braço D"],      base: "Braço", pat: /bra[çc]o\s*(d[íi]reito|d\b)|braço\s*d\b/i },
  { parts: ["Braço E"],      base: "Braço", pat: /bra[çc]o\s*esquerdo|braço\s*e\b/i },
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

  { parts: ["Ombro D", "Ombro E"],      base: "Ombro", pat: /ombro|ombralgia|deltoide|supraespinhal|manguito|subacromial|impacto.*ombro|capsulite|bursite(?!.*olecran)|desfiladeiro/i },
  { parts: ["Braço D", "Braço E"],      base: "Braço", pat: /braço|braco|b[ií]ceps\s*braquial|tr[ií]ceps\s*braquial|umero|úmero|braquial/i },
  { parts: ["Antebraço D", "Antebraço E"], base: "Antebraço", pat: /antebraço|antebraco|cotovelo|epicondil|olecran|cotov/i },
  { parts: ["Mão D", "Mão E"],          base: "Mão",   pat: /mão|mao|mãos|maos|dedo|polegar|pinca|quervain|carpo|metacarpo|punho|túnel\s*carpo|tunel\s*carpo|compressão\s*mediano|rizoartrose|tenossinovite|base\s*(do\s*)?polegar/i },
  { parts: ["Quadril D", "Quadril E"],   base: "Quadril", pat: /quadril|coxartrose|trocanter|femoroacetabular|anca|psoas|iliopsoas|artrose\s*quadril|sindrome\s*dolorosa\s*trocanter/i },
  { parts: ["Adutores D", "Adutores E"], base: "Adutores", pat: /adutor|virilha|pubalgia|inguinal|pub[ií]s/i },
  { parts: ["Joelho D", "Joelho E"],    base: "Joelho", pat: /joelho|gon[áa]lgia|gonalgia|patel[ao]|menisco|femoro|f[eê]mur|t[ií]bia|popl[ií]teo|artrose\s*joelho|gonartrose|tendinopatia\s*patelar|joelho\s*saltador|condromalacia|bursite.*patelar|síndrome\s*patelofemoral|sindrome\s*patelofemoral|LCA|cruzado\s*anterior|cruzado\s*posterior|joelho/i },
  { parts: ["Perna D", "Perna E"],      base: "Perna",  pat: /perna|t[ií]bia|canelite|panturrilha|gastrocn[eê]mio|g[eê]meos|s[oó]leo|isquiotibiais|fibular|tibial\s*anterior|soleo|popliteo|quadrado\s*plantar|tensor\s*da\s*f[áa]scia\s*lata|tfl|trato\s*iliotibial|banda\s*iliotibial|coxa|posterior\s*da\s*coxa/i },
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

  // ── Compound region expansions ──────────────────────────────────────────
  const hasHemiparesia = /hemiparesi[ea]|hemiplegi[ea]|hemi-?corpo|hemiparético|hemiparetic[ao]|hemi\s*esquerdo|hemi\s*direito|paralisia\s*(de\s*)?(bell|face|facial)/i.test(t);
  const hasMMSS = /\bmmss\b|membro\s*superior|membros\s*superiores/i.test(t);
  const hasMMII = /\bmmii\b|membro\s*inferior|membros\s*inferiores/i.test(t);

  if (hasHemiparesia) {
    const lat = expandLaterality(t);
    if (lat === "Direito" || !lat) RIGHT_REGIONS.forEach(r => found.add(r));
    if (lat === "Esquerdo" || !lat) LEFT_REGIONS.forEach(r => found.add(r));
    if (lat === "Bilateral") {
      RIGHT_REGIONS.forEach(r => found.add(r));
      LEFT_REGIONS.forEach(r => found.add(r));
    }
  }

  if (hasMMSS) {
    MMSS_REGIONS.forEach(r => found.add(r));
  }

  if (hasMMII) {
    MMII_REGIONS.forEach(r => found.add(r));
  }

  return [...found];
}

// ── Shared detection constants ──────────────────────────────────────────────
const KB_CONDS = [
  // ── Neurological conditions ───────────────────────────────────
  ["avc",                  /avc|acidente\s*vascular\s*cerebral|derrame|isquemia\s*cerebral|hemorragia\s*cerebral|hemiparesi[ea]|hemiplegi[ea]/i],
  ["parkinson",            /parkinson|doença\s*de\s*parkinson|mal\s*de\s*parkinson|lsvt|rigidez\s*plástica|roda\s*denteada/i],
  ["esclerose-multipla",   /esclerose\s*múltipla|esclerose\s*multipla|neurite\s*óptica|desmielinizante|em\s*(?!.*paciente)/i],
  ["ela",                  /ela\b|esclerose\s*lateral\s*amiotrófica|esclerose\s*lateral\s*amiotrofica|doença\s*do\s*neurônio\s*motor|doenca\s*do\s*neuronio\s*motor/i],
  ["tce",                  /tce|traumatismo\s*cranioencefálico|traumatismo\s*cranioencefalico|trauma\s*craniano|concussão|concussao|lesão\s*cerebral\s*traumática|lesao\s*cerebral\s*traumatica/i],
  ["ataxia",               /ataxia|cerebelar|dismetria|disfunção\s*cerebelar|disfuncao\s*cerebelar|frenkel|diadococinesia/i],
  ["neuropatia-periferica",/neuropatia\s*periférica|polineuropatia|desmielinizante|charcot.*marie|monofilamento/i],
  ["distrofia-muscular",   /distrofia\s*muscular|duchenne|becker|dmd\b/i],
  ["paralisia-facial",     /paralisia\s*facial|paralisia\s*de\s*bell|paresia\s*facial|bell\b/i],
  ["lesao-medular",        /lesão\s*medular|lesao\s*medular|paraplégi[ao]|tetraplégi[ao]|paraplegi[ao]|tetraplegi[ao]|trauma\s*raquimedular/i],
  ["hernia-disco-cervical",/hernia\s*(de\s*)?disco\s*cervical|protrusao\s*discal\s*cervical|hérnia\s*de\s*disco\s*cervical/i],
  ["radiculopatia-cervical",/radiculopatia\s*cervical|foraminal|esporao\s*cervical|estenose\s*de\s*canal\s*cervical|estenose\s*cervical/i],

  // ── Specific pathologies (checked before generic regions) ───
  ["estenose-lombar",      /estenose\s*(do\s*)?canal\s*lombar|estenose\s*lombar|piora.*andar.*melhora.*sentar/i],
  ["hernia-disco-lombar",  /hernia\s*(de\s*)?disco(?!.*cerv)/i],
  ["hernia-disco-lombar",  /hernia\s*(de\s*)?disco\s*lombar|protrusao\s*discal\s*lombar/i],
  ["espondilolistese",     /espondilolistese|espondilolise/i],
  ["cervicalgia",          /cerv|pescoco|cervicalgia/i],
  ["capsulite-adesiva",    /capsulite\s*adesiva|ombro\s*congelado|aderencia\s*articular|rigidez.*capsular|capsular.*rigidez|perda.*movimento.*ombro/i],
  ["instabilidade-ombro",  /instabilidade\s*anterior\s*(do\s*)?ombro|luxacao\s*glenoumeral|bankart|saiu\s*do\s*lugar|frouxidao/i],
  ["manguito-rotador",     /lesao\s*(do\s*)?manguito\s*rotador|manguito|ruptura\s*manguito|supraespinhal/i],
  ["impacto-ombro",        /sindrome\s*(do\s*)?impacto\s*(do\s*)?ombro|impacto\s*subacromial|pinzamento|impacto.*ombro/i],
  ["lca",                  /lca|lesao\s*(do\s*)?lca|ruptura\s*lca|reconstrucao\s*lca|cruzado\s*anterior/i],
  ["lesao-meniscal",       /lesao\s*meniscal|menisco|meniscectomia|travamento.*(mecanico|joelho)/i],
  ["artrose-joelho",       /artrose\s*(de\s*)?joelho|osteoartrite\s*joelho|oa\s*joelho|gonartrose/i],
  ["sindrome-patelo femoral", /dor\s*patelofemoral|sindrome\s*patelofemoral|patelofemoral/i],
  ["tendinopatia-patelar", /tendinopatia\s*patelar|tendao\s*patelar/i],
  ["tendinopatia-patelar", /joelho\s*(de\s*)?saltador/i],
  ["condromalacia",        /condromalacia\s*patelar|amolecimento\s*patela/i],
  ["subluxacao-patelar",   /subluxacao\s*patelar|instabilidade\s*patelar/i],
  ["tendinopatia-gluteo",  /tendinopatia\s*(de\s*)?gluteo|bursite\s*trocanterica|sindrome\s*dolorosa\s*trocanter/i],
  ["impacto-femoroacetabular", /impacto\s*femoroacetabular|pincer|cam\s*lesao|pincamento/i],
  ["coxartrose",           /artrose\s*(de\s*)?quadril|osteoartrite\s*quadril|coxartrose/i],
  ["coxartrose",           /\bquadril\b/i],
  ["tendinopatia-aquiles", /tendinopatia\s*(de\s*)?aquiles|tendao\s*(de\s*)?aquiles|aquileu/i],
  ["entorse-tornozelo",    /entorse\s*(de\s*)?tornozelo|torcao\s*tornozelo|ltfa/i],
  ["fascite-plantar",      /fascite\s*plantar|fasceite|windlass|sola.*pe.*primeiros.*passos|dor.*sola.*pe/i],
  ["fratura-colles",       /fratura\s*(de\s*)?colles|fratura\s*radio\s*distal|fratura\s*punho/i],
  ["epicondilite-lateral", /epicondilite\s*lateral|cotovelo\s*(de\s*)?tenista|epicondilalgia\s*lateral|lateral\s*(do\s*)?cotovelo/i],
  ["epicondilite-medial",  /epicondilite\s*medial|cotovelo\s*(de\s*)?golfista|epicondilalgia\s*medial|interna\s*(do\s*)?cotovelo/i],
  ["bursite-olecraniana",  /bursite\s*olecraniana/i],
  ["tunel-carpo",          /sindrome\s*(do\s*)?tunel\s*(do\s*)?carpo|tunel\s*carpo|compressao\s*mediano|formigamento.*(dedo|mao|palma)/i],
  ["de-quervain",          /tenossinovite\s*(de\s*)?quervain|de\s*quervain|base\s*(do\s*)?polegar/i],
  ["osteoartrite-mao",     /rizartrose|artrose\s*(de\s*)?mao|artrose\s*dodos/i],
  ["dedo-gatilho",         /dedo\s*gatilho|dedos\s*gatilho|tenossinovite\s*flexor/i],
  ["desfiladeiro-toracico",/desfiladeiro\s*toracico|sindrome\s*do\s*desfiladeiro/i],
  ["pos-artroplastia-joelho", /artroplastia\s*(de\s*)?joelho|protese\s*(de\s*)?joelho|pos-operatorio\s*joelho/i],
  ["pos-artroplastia-quadril", /artroplastia\s*(de\s*)?quadril|protese\s*(de\s*)?quadril|pos-operatorio\s*quadril/i],
  ["estiramento-isquiotibiais", /estiramento\s*(de\s*)?isquiotibiais|isquiotibiais|distensao\s*isquio|posterior\s*coxa/i],
  ["distensao-gemeos",     /distensao\s*(de\s*)?gemeos|panturrilha|gastrocnemio\s*lesao/i],
  ["trato-iliotibial",     /sindrome\s*(do\s*)?trato\s*iliotibial|banda\s*iliotibial|tfl|iliotibial/i],
  ["pubalgia",             /pubalgia|osteite\s*pubica|dor\s*inguinal\s*esforco/i],
  ["canelite",             /canelite|sindrome\s*(do\s*)?estresse\s*tibial|shin\s*splint/i],
  ["miosite-ossificante",  /miosite\s*ossificante/i],
  ["tendinopatia-biceps",  /tendinopatia\s*(do\s*)?biceps\s*braquial|tendao\s*(da\s*)?cabeca\s*longa/i],
  ["metatarsalgia",        /metatarsalgia|dor\s*metatarso/i],
  ["neuroma-morton",       /neuroma\s*(de\s*)?morton|neuroma/i],
  ["esporao-calcaneo",     /esporao\s*(de\s*)?calcaneo|calcaneo\s*dor/i],
  ["artrite-reumatoide",   /artrite\s*reumatoide|ar\s*joelho/i],
  // ── Cardiorespiratory conditions ──────────────────────────────
  ["insuficiencia-cardiaca", /insuficiência\s*cardíaca|insuficiencia\s*cardiaca|icc|dispneia\s*esforço|ortopneia/i],
  ["dpoc",                 /dpoc|doença\s*pulmonar\s*obstrutiva\s*crônica|doenca\s*pulmonar\s*obstrutiva\s*cronica|enfisema|bronquite\s*crônica|bronquite\s*cronica/i],
  ["asma",                 /asma|sibilo|chiado|broncoespasmo|crise\s*asmática|crise\s*asmatica/i],
  ["pos-covid",            /pós\s*covid|pos\s*covid|covid-19|covid\s*longo|sequela\s*covid|sindrome\s*pós\s*covid|sindrome\s*pos\s*covid/i],
  // ── Pediatric conditions ──────────────────────────────────────
  ["paralisia-cerebral",   /paralisia\s*cerebral|pc\s*(?!.*computador)|encefalopatia\s*crônica|encefalopatia\s*cronica|pc.*infantil/i],
  ["torcicolo-congenito",  /torcicolo\s*muscular|torcicolo\s*congênito|torcicolo\s*congenito|torcicolo\s*infantil/i],
  ["atraso-motor",         /atraso\s*motor|atraso\s*do\s*desenvolvimento|desenvolvimento\s*neuropsicomotor|dnpm|marco\s*motor/i],
  ["mielomeningocele",     /mielomeningocele|espinha\s*bífida|espinha\s*bifida|mielo/i],
  // ── Generic / broad regions (checked last) ────────────────────
  ["lombalgia",            /ciatica|ciatalgia|dor\s*ciatica|isquialgia/i],
  ["lombalgia",            /lomb[aeio]|costa|dor\s*lombar|lombalgia|lomb|costa/i],
  ["cervicalgia",          /cerv|pescoco|cervicalgia/i],
  ["gonalgia",             /joelho\s*(inchado|edema|entorse)/i],
  ["gonalgia",             /\bjoelho\b/i],
  ["ombralgia",            /bursite(?!.*olecran)/i],
  ["ombralgia",            /ombr|ombralgia/i],
  ["cotovelo",             /cotov|olecran/i],
  ["tornozelo",            /tornoz|pe\s/i],
  ["fibromialgia",         /cansaco\s*cronico|fadiga\s*cronica|dor\s*generalizada/i],
  ["fibromialgia",         /fibromialgia/i],
  ["escoliose",            /escoliose\s*idiopatica|escoliose/i],
  ["hipercifose",          /hipercifose\s*toracica|hipercifose|cifose/i],
  ["dtm",                  /dtm|disfuncao\s*temporomandibular|atm\s*dor/i],
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
      avc:"AVC / Hemiparesia", parkinson:"Doença de Parkinson",
      "esclerose-multipla":"Esclerose Múltipla", ela:"ELA",
      tce:"TCE", ataxia:"Ataxia",
      "neuropatia-periferica":"Neuropatia Periférica",
      "distrofia-muscular":"Distrofia Muscular",
      "paralisia-facial":"Paralisia Facial",
      "lesao-medular":"Lesão Medular",
      "paralisia-cerebral":"Paralisia Cerebral",
      "torcicolo-congenito":"Torcicolo Congênito",
      "atraso-motor":"Atraso Motor",
      mielomeningocele:"Mielomeningocele",
      dpoc:"DPOC", asma:"Asma",
      "insuficiencia-cardiaca":"Insuficiência Cardíaca",
      "pos-covid":"Pós-COVID",
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
