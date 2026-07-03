const MODULE_LABELS = {
  ortopedica: "Fisioterapia Ortopédica",
  neurologica: "Fisioterapia Neurológica",
  pediatrica: "Fisioterapia Pediátrica",
  cardioRespiratoria: "Fisioterapia Cardio-Respiratória",
  uroginecologica: "Fisioterapia Uro-Ginecológica",
  geriatria: "Fisioterapia Geriátrica",
  dermatoFuncional: "Fisioterapia Dermatofuncional",
  reumatologica: "Fisioterapia Reumatológica",
  esportiva: "Fisioterapia Esportiva",
  oncologica: "Fisioterapia Oncológica",
};

const ALL_MODULE_IDS = Object.keys(MODULE_LABELS);

function getAssignedModules(patient) {
  return patient?.assignedModules || [];
}

function isPatientAssignedToModule(patient, moduleId) {
  const assigned = getAssignedModules(patient);
  if (assigned.length === 0) return true;
  return assigned.includes(moduleId);
}

function filterPatientsByModule(patients, moduleId) {
  return (patients || []).filter(p => isPatientAssignedToModule(p, moduleId));
}

function getModuleLabel(moduleId) {
  return MODULE_LABELS[moduleId] || moduleId;
}

export {
  MODULE_LABELS,
  ALL_MODULE_IDS,
  getAssignedModules,
  isPatientAssignedToModule,
  filterPatientsByModule,
  getModuleLabel,
};
