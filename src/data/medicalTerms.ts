// @ts-nocheck
const MEDICAL_TERMS = [
  // ── Comorbidades ────────────────────────────────────────────────────────
  { match: /\bHAS\b/i,                        label: "HAS",           category: "comorbid" },
  { match: /hipertensão|hipertenso|hipertensa|pressão\s*alta/i,
                                               label: "HAS",           category: "comorbid" },

  { match: /\bDM\b|\bDM2\b/,                  label: "DM2",           category: "comorbid" },
  { match: /diabetes|diabético|diabética|diabetes\s*mellitus/i,
                                               label: "DM2",           category: "comorbid" },

  { match: /obesidade|obeso|obesa|sobrepeso|IMC\s*(alto|elevado|[>\d])/i,
                                               label: "Obesidade",     category: "comorbid" },

  { match: /osteoporose|osteoporótico|osteoporotica|densidade\s*[oó]ssea\s*baixa/i,
                                               label: "Osteoporose",   category: "comorbid" },

  { match: /artrite\s*reumat[oó]ide|\bAR\b(?!\s*(joelho|gonalgia|artrose))/i,
                                               label: "Artrite/AR",    category: "comorbid" },

  { match: /fibromialgia|fibromi[aá]lgico/i,  label: "Fibromialgia",  category: "comorbid" },

  { match: /depress[aã]o|depressivo|depressiva|transtorno\s*depressivo/i,
                                               label: "Depressão",     category: "comorbid" },

  { match: /ansiedade|ansioso|ansiosa|transtorno\s*(de\s*)?ansiedade|p[aâ]nico|síndrome\s*do\s*p[aâ]nico/i,
                                               label: "Ansiedade",     category: "comorbid" },

  { match: /card[ií]aco|card[ií]aca|cardiopatia|insuficiência\s*card[ií]aca|cardiopata|infarto|\bIAM\b|AVC|acidente\s*vascular|doença\s*card[ií]aca/i,
                                               label: "Doença cardíaca", category: "comorbid" },

  { match: /\bDPOC\b|doença\s*pulmonar\s*obstrutiva|bronquite\s*cr[oô]nica|enfisema/i,
                                               label: "DPOC",          category: "comorbid" },

  { match: /neoplasia|c[aâ]ncer|c[aá]ncer|tumor\s*maligno|oncol[oó]gico|quimioterapia|radioterapia|met[aá]stase|melanoma|carcinoma|sarcoma|linfoma|leucemia/i,
                                               label: "Neoplasia",     category: "comorbid" },

  { match: /imunossupress[aã]o|imunossuprimido|imunodeficiência|\bHIV\b|AIDS|transplante/i,
                                               label: "Imunossupressão", category: "comorbid" },

  // ── Antecedentes ───────────────────────────────────────────────────────
  { match: /cirurgia\s*prévia|p[oó]s-operatorio|artroplastia|meniscectomia|reconstruç[aã]o\s*LCA|artrodese|submetido\s*[aà]\s*cirurgia|procedimento\s*cir[uú]rgico\s*prévio/i,
                                               label: "Cirurgia prévia (área)", category: "antec" },

  { match: /trauma\s*anterior|acidente|qued[ao]|pancada|contus[ãa]o|entorse\s*prévia|politrauma|traumatismo/i,
                                               label: "Trauma anterior", category: "antec" },

  { match: /fratura\s*[óo]ssea|fraturou|fratur[ao]|fratura\s*(de|do|da)\s*(f[eê]mur|t[ií]bia|[uú]mero|r[áa]dio|punho|quadril|coluna|vertebra|tornozelo|clav[ií]cula)/i,
                                               label: "Fratura óssea", category: "antec" },

  { match: /fisioterapia\s*anterior|tratamento\s*fisioterapêutico|reabilitaç[ãa]o\s*anterior|j[aá]\s*(fez|realizou)\s*fisioterapia/i,
                                               label: "Fisioterapia anterior", category: "antec" },

  { match: /infiltraç[ãa]o\s*(de\s*)?corticoide|corticoide|cortic[óo]ide|corticosteroide|bloqueio\s*anestésico|viscossuplementaç[ãa]o|injeç[ãa]o\s*intra-articular/i,
                                               label: "Infiltração corticoide", category: "antec" },

  { match: /imobilizaç[ãa]o|engessado|gesso|imobilizador|tala|órtese|imobilizaç[ãa]o\s*prolongada/i,
                                               label: "Imobilização prolongada", category: "antec" },
];

function scanQueixa(text) {
  if (!text || text.trim().length < 3) return { comorbid: [], antec: [] };

  const found = { comorbid: new Set(), antec: new Set() };

  for (const entry of MEDICAL_TERMS) {
    if (entry.match.test(text)) {
      const target = entry.category === "antec" ? found.antec : found.comorbid;
      target.add(entry.label);
    }
  }

  return {
    comorbid: [...found.comorbid],
    antec: [...found.antec],
  };
}

export { MEDICAL_TERMS, scanQueixa };
