// @ts-nocheck
const BRIDGE_MAP = {
  condromalacia: {
    tipo: "alerta",
    local: "Joelho",
    descricao: "Evitar alta compressão patelar — cadeira extensora 0-30°, agachamento profundo > 90°",
    alternativa: "Preferir cadeira flexora, stiff, agachamento parcial (0-60°) e exercícios de cadeia cinética fechada",
    origem: "Fisioterapia",
    evidencia: "CPG JOSPT 2023 — Evidência A para modificação de carga em síndrome patelofemoral.",
  },
  "sindrome-patelo-femoral": {
    tipo: "alerta",
    local: "Joelho",
    descricao: "Evitar alta compressão patelar — cadeira extensora 0-30°, agachamento profundo > 90°",
    alternativa: "Preferir exercícios de cadeia cinética fechada com angulação reduzida",
    origem: "Fisioterapia",
    evidencia: "CPG JOSPT 2023 — Evidência A para modificação de carga em síndrome patelofemoral.",
  },
  gonartrose: {
    tipo: "modificacao",
    local: "Joelho",
    descricao: "Preferir exercícios de baixo impacto (bicicleta, natação). Evitar saltos e corrida em superfície rígida",
    alternativa: "Substituir corrida por bicicleta ou elíptico; evitar agachamento profundo",
    origem: "Fisioterapia",
    evidencia: "OARSI 2023 — Evidência A para exercício aeróbio de baixo impacto em osteoartrite de joelho.",
  },
  "tendinopatia-patelar": {
    tipo: "modificacao",
    local: "Joelho",
    descricao: "Evitar saltos e pliometria em fase aguda. Progressão isométrico → excêntrico em declive",
    alternativa: "Protocolo Purdam — agachamento excêntrico em declive a 25°",
    origem: "Fisioterapia",
    evidencia: "BJSM 2021 — Evidência A para excêntrico em declive na tendinopatia patelar.",
  },
  lombalgia: {
    tipo: "alerta",
    local: "Coluna Lombar",
    descricao: "Evitar compressão axial e flexão lombar sob carga — levantamento terra convencional, agachamento com barra baixa",
    alternativa: "Optar por agachamento goblet, levantamento terra sumô, exercícios unilaterais",
    origem: "Fisioterapia",
    evidencia: "CPG NICE 2023 — Evidência A para evitar movimentos de alta carga em coluna lombar sintomática.",
  },
  "hernia-disco-lombar": {
    tipo: "alerta",
    local: "Coluna Lombar",
    descricao: "Evitar flexão lombar sob carga. Contraindicado: terra convencional, agachamento com barra baixa, stiff com barra",
    alternativa: "Preferir exercícios em decúbito, hidroterapia, agachamento com suporte",
    origem: "Fisioterapia",
    evidencia: "CPG NICE 2023 — Evidência B para evitar flexão lombar carregada em hérnia discal.",
  },
  ombralgia: {
    tipo: "alerta",
    local: "Ombro",
    descricao: "Evitar exercícios acima da linha dos ombros com rotação interna — desenvolvimento atrás da nuca, upright row",
    alternativa: "Optar por desenvolvimento frontal, elevação lateral no plano da escápula, crucifixo na polia",
    origem: "Fisioterapia",
    evidencia: "CSAW Trial Lancet 2018 — Evidência A para evitar sobrecarga em impacto subacromial.",
  },
  "impacto-ombro": {
    tipo: "alerta",
    local: "Ombro",
    descricao: "Evitar exercícios acima de 90° de abdução com rotação interna. Contraindicado: desenvolvimento atrás da nuca, puxada pela frente alta",
    alternativa: "Exercícios no plano da escápula, rotação externa com elástico, fortalecimento de manguito rotador",
    origem: "Fisioterapia",
    evidencia: "CSAW Trial Lancet 2018 — Evidência A para impacto subacromial.",
  },
  cervicalgia: {
    tipo: "modificacao",
    local: "Cervical",
    descricao: "Evitar encolhimento com carga alta e exercícios que comprimam a coluna cervical",
    alternativa: "Evitar shrug com carga máxima. Preferir elevação escapular sem carga axial",
    origem: "Fisioterapia",
    evidencia: "ACSM — Evitar sobrecarga axial em condições cervicais.",
  },
  gonartose: {
    tipo: "modificacao",
    local: "Joelho",
    descricao: "Preferir exercícios de baixo impacto. Evitar saltos, corrida em superfície rígida e agachamento profundo",
    alternativa: "Bicicleta, natação, agachamento parcial (0-60°), cadeira extensora com amplitude reduzida",
    origem: "Fisioterapia",
    evidencia: "OARSI 2023 — Evidência A para exercício aeróbio de baixo impacto em osteoartrite.",
  },
};

const KEYWORD_PATTERNS = Object.entries(BRIDGE_MAP).reduce((acc, [key, value]) => {
  const pattern = key
    .replace(/-/g, "[\\s-]?")
    .replace(/nça/g, "n[çc]a")
    .replace(/[áàãâä]/g, "[aáàãâä]")
    .replace(/[éèêë]/g, "[eéèêë]")
    .replace(/[íìîï]/g, "[iíìîï]")
    .replace(/[óòõôö]/g, "[oóòõôö]")
    .replace(/[úùûü]/g, "[uúùûü]");
  acc.push({ key, pattern: new RegExp(pattern, "i"), ...value });
  return acc;
}, []);

export function readFisioterapiaRestrictions(studentId) {
  if (!studentId) return [];
  try {
    const raw = localStorage.getItem("sasyra_assessments");
    if (!raw) return [];
    const assessments = JSON.parse(raw);
    const studentAssessments = assessments.filter(
      a => a.patientId === studentId
    );
    if (studentAssessments.length === 0) return [];

    const latest = studentAssessments.sort((a, b) => (b.id || 0) - (a.id || 0))[0];
    const restrictions = [];

    const textsToScan = [
      latest.queixa || "",
      latest.diagnosticoCinesio || "",
      ...(latest.comorbid || []),
      ...(latest.localDor || []),
      latest.hda || "",
    ].filter(Boolean);

    const joined = textsToScan.join(" ").toLowerCase();

    const seen = new Set();
    for (const entry of KEYWORD_PATTERNS) {
      if (entry.pattern.test(joined) && !seen.has(entry.key)) {
        seen.add(entry.key);
        restrictions.push({
          key: entry.key,
          tipo: entry.tipo,
          local: entry.local,
          descricao: entry.descricao,
          alternativa: entry.alternativa,
          origem: entry.origem,
          evidencia: entry.evidencia,
          dataAvaliacao: latest.date,
        });
      }
    }

    if (latest.comorbid && latest.comorbid.length > 0) {
      const comorbidities = Array.isArray(latest.comorbid)
        ? latest.comorbid
        : typeof latest.comorbid === "string"
          ? latest.comorbid.split(",").map(s => s.trim())
          : [];
      if (comorbidities.length > 0) {
        restrictions.push({
          key: "comorbidades",
          tipo: "informativo",
          local: "Geral",
          descricao: `Comorbidades registradas na fisioterapia: ${comorbidities.join(", ")}`,
          alternativa: "Avaliar impacto de cada condição na prescrição do treino",
          origem: "Fisioterapia",
          evidencia: "ACSM Guidelines 2024 — Avaliação pré-participação deve considerar comorbidades.",
          dataAvaliacao: latest.date,
          comorbidades: comorbidities,
        });
      }
    }

    return restrictions;
  } catch {
    return [];
  }
}

export function getBridgeAlertCount(studentId) {
  return readFisioterapiaRestrictions(studentId).length;
}

const RESTRICTION_TO_EXERCISES = {
  condromalacia: ["cadeira-extensora", "leg-press", "agachamento", "agachamento-bulgaro", "agachamento-goblet"],
  "sindrome-patelo-femoral": ["cadeira-extensora", "leg-press", "agachamento", "agachamento-bulgaro"],
  gonartrose: ["leg-press", "agachamento", "corrida-esteira", "corda-pular"],
  "tendinopatia-patelar": ["corda-pular", "agachamento-bulgaro"],
  lombalgia: ["peso-morto", "agachamento", "stiff", "remada-curvada"],
  "hernia-disco-lombar": ["peso-morto", "agachamento", "stiff", "remada-curvada", "desenvolvimento"],
  ombralgia: ["desenvolvimento", "remada-alta", "puxada-frente"],
  "impacto-ombro": ["desenvolvimento", "remada-alta", "puxada-frente", "supino-inclinado"],
  cervicalgia: ["encolhimento", "desenvolvimento", "peso-morto"],
};

export function getBlockedExercises(restrictions) {
  const blocked = new Set();
  for (const r of restrictions) {
    const exs = RESTRICTION_TO_EXERCISES[r.key];
    if (exs) exs.forEach(id => blocked.add(id));
  }
  return blocked;
}

export function getRestrictionWarning(exerciseId, restrictions) {
  for (const r of restrictions) {
    const exs = RESTRICTION_TO_EXERCISES[r.key];
    if (exs && exs.includes(exerciseId)) {
      return {
        restricao: r.key,
        local: r.local,
        mensagem: r.descricao,
        alternativa: r.alternativa,
      };
    }
  }
  return null;
}

export const DIAS_LIMITE_AVALIACAO = 90;

export function isAvaliacaoDesatualizada(dataAvaliacao) {
  if (!dataAvaliacao) return false;
  const diff = (new Date() - new Date(dataAvaliacao)) / (1000 * 60 * 60 * 24);
  return diff > DIAS_LIMITE_AVALIACAO;
}
