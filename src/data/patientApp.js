const PATIENT_APP_KEY = "sasyra_patient_access";

function getPatientAccessMap() {
  try {
    const d = localStorage.getItem(PATIENT_APP_KEY);
    return d ? JSON.parse(d) : {};
  } catch { return {}; }
}

function savePatientAccessMap(map) {
  try { localStorage.setItem(PATIENT_APP_KEY, JSON.stringify(map)); } catch { /* empty */ }
}

export function generatePatientCode(studentId) {
  const map = getPatientAccessMap();
  if (map[studentId]) return map[studentId].code;
  const code = "PAT-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  map[studentId] = { code, createdAt: new Date().toISOString(), views: 0 };
  savePatientAccessMap(map);
  return code;
}

export function getPatientCode(studentId) {
  const map = getPatientAccessMap();
  return map[studentId]?.code || null;
}

export function regeneratePatientCode(studentId) {
  const map = getPatientAccessMap();
  const code = "PAT-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  map[studentId] = { code, createdAt: new Date().toISOString(), views: 0 };
  savePatientAccessMap(map);
  return code;
}

export function verifyPatientCode(code) {
  const map = getPatientAccessMap();
  for (const [studentId, data] of Object.entries(map)) {
    if (data.code === code) return studentId;
  }
  return null;
}

export function recordPatientView(studentId) {
  const map = getPatientAccessMap();
  if (map[studentId]) {
    map[studentId].views = (map[studentId].views || 0) + 1;
    map[studentId].lastView = new Date().toISOString();
    savePatientAccessMap(map);
  }
}

export function getPatientAccessList() {
  return getPatientAccessMap();
}

export function getPatientAppData(studentId, studentData) {
  const peData = loadPEPatientData(studentId);
  const code = getPatientCode(studentId);
  return {
    code,
    student: studentData,
    treinos: peData.treinos || [],
    assessments: peData.assessments || [],
    pse: peData.pse || [],
  };
}

function loadPEPatientData(studentId) {
  try {
    const raw = localStorage.getItem("pe_data");
    if (!raw) return { assessments: [], treinos: [], pse: [] };
    const data = JSON.parse(raw);
    return data[studentId] || { assessments: [], treinos: [], pse: [] };
  } catch { return { assessments: [], treinos: [], pse: [] }; }
}

export function getPatientTreinosAtivos(studentId) {
  const peData = loadPEPatientData(studentId);
  const treinos = peData.treinos || [];
  if (treinos.length === 0) return [];
  const sorted = [...treinos].sort((a, b) => (b.id || "").localeCompare(a.id || ""));
  return [sorted[0]];
}

export function getUltimaAvaliacao(studentId) {
  const peData = loadPEPatientData(studentId);
  const assessments = peData.assessments || [];
  if (assessments.length === 0) return null;
  return [...assessments].sort((a, b) => (b.id || "").localeCompare(a.id || ""))[0];
}

export function getEvolucaoPeso(studentId) {
  const peData = loadPEPatientData(studentId);
  const assessments = peData.assessments || [];
  return assessments
    .filter(a => a.percentualGordura || a.peso)
    .map(a => ({ data: a.data, percentualGordura: a.percentualGordura, peso: a.peso }))
    .sort((a, b) => (a.data || "").localeCompare(b.data || ""));
}

export function getPseHistory(studentId) {
  const peData = loadPEPatientData(studentId);
  return (peData.pse || []).sort((a, b) => (a.data || "").localeCompare(b.data || ""));
}

export function getPatientPlanStatus(studentId) {
  try {
    const raw = localStorage.getItem("sasyra_patient_plans");
    if (!raw) return { active: false };
    const plans = JSON.parse(raw);
    return plans[studentId] || { active: false };
  } catch { return { active: false }; }
}

export function activatePatientPlan(studentId, planType = "mensal") {
  const raw = localStorage.getItem("sasyra_patient_plans");
  const plans = raw ? JSON.parse(raw) : {};
  const now = new Date();
  const expires = new Date(now);
  if (planType === "mensal") expires.setMonth(expires.getMonth() + 1);
  else if (planType === "trimestral") expires.setMonth(expires.getMonth() + 3);
  else if (planType === "anual") expires.setFullYear(expires.getFullYear() + 1);
  plans[studentId] = {
    active: true,
    planType,
    activatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    price: planType === "mensal" ? 4.90 : planType === "trimestral" ? 12.90 : 39.90,
  };
  localStorage.setItem("sasyra_patient_plans", JSON.stringify(plans));
  return plans[studentId];
}

export function deactivatePatientPlan(studentId) {
  const raw = localStorage.getItem("sasyra_patient_plans");
  if (!raw) return;
  const plans = JSON.parse(raw);
  if (plans[studentId]) {
    plans[studentId].active = false;
    localStorage.setItem("sasyra_patient_plans", JSON.stringify(plans));
  }
}
