import { supabase } from "../lib/supabase";

// ── Config ────────────────────────────────────────────────
const IS_CONFIGURED = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && url !== "https://sua-url-supabase.supabase.co" && key && key !== "sua-anon-key-aqui");
};
const PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

// ── In-memory cache (request-level, cleared on each refresh) ─
const cache = new Map();
function cacheGet(key) { const v = cache.get(key); if (v && v.expires > Date.now()) return v.data; return undefined; }
function cacheSet(key, data, ttlMs = 5000) { cache.set(key, { data, expires: Date.now() + ttlMs }); }

// ── localStorage fallback ──────────────────────────────────
function lsGet(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ── Helpers ────────────────────────────────────────────────
function paginate(page = 1, perPage = PAGE_SIZE) {
  const limit = Math.min(perPage, MAX_PAGE_SIZE);
  const offset = (Math.max(page, 1) - 1) * limit;
  return { limit, offset, page, perPage: limit };
}

function buildPaginatedResponse(data, count, page, perPage) {
  return {
    data,
    total: count,
    page,
    perPage,
    totalPages: Math.ceil(count / perPage),
  };
}

// ════════════════════════════════════════════════════════════
// PATIENTS
// ════════════════════════════════════════════════════════════

const PATIENT_FIELDS = "id, user_id, nome, data_nasc, sexo, lateralidade, estado_civil, profissao, convenio, sessoes_auth, telefone, peso, altura, data_cadastro, has_express, express_date";

async function _fetchPatients(userId, { page = 1, search = "" } = {}) {
  const { limit, offset } = paginate(page);
  let query = supabase.from("patients").select(PATIENT_FIELDS, { count: "exact" }).eq("user_id", userId);
  if (search) query = query.textSearch("search_vector", search, { config: "portuguese" });
  const { data, count, error } = await query.order("nome", { ascending: true }).range(offset, offset + limit - 1);
  if (error) throw error;
  return buildPaginatedResponse(data.map(mapPatientFromDB), count, page, limit);
}

export async function fetchPatients(userId, opts = {}) {
  if (!IS_CONFIGURED()) return buildPaginatedResponse(lsGet("sasyra_patients") || [], 0, 1, 1000);
  return _fetchPatients(userId, opts);
}

export async function findPatient(userId, patientId) {
  if (!IS_CONFIGURED()) {
    const list = lsGet("sasyra_patients") || [];
    return list.find(p => (p.id || p.nome) === patientId) || null;
  }
  const { data, error } = await supabase.from("patients").select(PATIENT_FIELDS).eq("user_id", userId).eq("id", patientId).single();
  if (error && error.code === "PGRST116") return null;
  if (error) throw error;
  return data ? mapPatientFromDB(data) : null;
}

export async function savePatient(userId, patient) {
  if (!IS_CONFIGURED()) {
    const list = lsGet("sasyra_patients") || [];
    const idx = list.findIndex(p => (p.id || p.nome) === (patient.id || patient.nome));
    if (idx >= 0) list[idx] = { ...list[idx], ...patient };
    else list.push(patient);
    lsSet("sasyra_patients", list);
    return patient;
  }
  const db = mapPatientToDB(patient, userId);
  if (patient.id && !patient._tempId && typeof patient.id === "number") {
    const { error } = await supabase.from("patients").update(db).eq("id", patient.id).eq("user_id", userId);
    if (error) throw error;
    return patient;
  }
  const { data, error } = await supabase.from("patients").insert(db).select().single();
  if (error) throw error;
  return mapPatientFromDB(data);
}

export async function deletePatient(userId, patientId) {
  if (!IS_CONFIGURED()) {
    const list = lsGet("sasyra_patients") || [];
    lsSet("sasyra_patients", list.filter(p => (p.id || p.nome) !== patientId));
    return;
  }
  const { error } = await supabase.from("patients").delete().eq("id", patientId).eq("user_id", userId);
  if (error) throw error;
}

function mapPatientFromDB(row) {
  return {
    id: row.id,
    nome: row.nome,
    dataNasc: row.data_nasc,
    sexo: row.sexo,
    lateralidade: row.lateralidade,
    estadoCivil: row.estado_civil,
    profissao: row.profissao,
    convenio: row.convenio,
    sessoesAuth: row.sessoes_auth,
    telefone: row.telefone,
    peso: row.peso,
    altura: row.altura,
    data: row.data_cadastro?.slice(0, 10),
    hasExpress: row.has_express,
    expressDate: row.express_date,
  };
}

function mapPatientToDB(p, userId) {
  return {
    user_id: userId,
    nome: p.nome,
    data_nasc: p.dataNasc || null,
    sexo: p.sexo || null,
    lateralidade: p.lateralidade || null,
    estado_civil: p.estadoCivil || null,
    profissao: p.profissao || null,
    convenio: p.convenio || null,
    sessoes_auth: p.sessoesAuth || null,
    telefone: p.telefone || null,
    peso: p.peso || null,
    altura: p.altura || null,
    has_express: p.hasExpress || false,
    express_date: p.expressDate || null,
  };
}

// ════════════════════════════════════════════════════════════
// ASSESSMENTS (com normalized sub-tables)
// ════════════════════════════════════════════════════════════

const ASSESSMENT_FIELDS = `
  id, user_id, patient_id, data, queixa, queixa_key, local_dor, carater_dor,
  tempo_dor, melhora, piora, hda, comorbid, antec, meds,
  yellow_flags, selected_red_flags, eva_mov, eva_rep, avds, obj_trat,
  nivel_ati, postura, marcha, edema, palpacao, sensib, reflexos,
  obs, regiao, diagnostico_cinesio, vital_signs, impressao_clinica,
  auto_cif, recommended_scales, honorario, is_express, status, created_at
`;

async function _fetchFullAssessment(userId, assessmentId) {
  const cacheKey = `full_assessment_${assessmentId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const [main, muscle, gonio, tests] = await Promise.all([
    supabase.from("assessments").select(ASSESSMENT_FIELDS).eq("user_id", userId).eq("id", assessmentId).single(),
    supabase.from("assessment_muscle_tests").select("muscle, value").eq("assessment_id", assessmentId).eq("user_id", userId),
    supabase.from("assessment_goniometry").select("joint, movement, value").eq("assessment_id", assessmentId).eq("user_id", userId),
    supabase.from("assessment_special_tests").select("test_name, result, notes").eq("assessment_id", assessmentId).eq("user_id", userId),
  ]);

  if (main.error) throw main.error;
  if (!main.data) return null;

  const result = {
    ...mapAssessmentFromDB(main.data),
    forca: (muscle.data || []).map(m => ({ id: m.muscle, muscle: m.muscle, value: m.value })),
    gonio: (gonio.data || []).map(g => ({ id: `${g.joint}_${g.movement}`, joint: g.joint, movement: g.movement, value: g.value })),
    tests: (tests.data || []).reduce((acc, t) => { acc[t.test_name] = [t.result || ""]; return acc; }, {}),
  };

  cacheSet(cacheKey, result, 10000);
  return result;
}

async function _fetchAssessments(userId, patientId, { page = 1, fromDate, toDate } = {}) {
  const { limit, offset } = paginate(page);
  let query = supabase.from("assessments").select(ASSESSMENT_FIELDS, { count: "exact" }).eq("user_id", userId);
  if (patientId) query = query.eq("patient_id", patientId);
  if (fromDate) query = query.gte("data", fromDate);
  if (toDate) query = query.lte("data", toDate);
  const { data, count, error } = await query.order("data", { ascending: false }).range(offset, offset + limit - 1);
  if (error) throw error;
  return buildPaginatedResponse(data.map(mapAssessmentFromDB), count, page, limit);
}

export async function fetchAssessments(userId, opts = {}) {
  if (!IS_CONFIGURED()) return buildPaginatedResponse(lsGet("sasyra_assessments") || [], 0, 1, 1000);
  return _fetchAssessments(userId, null, opts);
}

export async function fetchAssessmentsByPatient(userId, patientId, opts = {}) {
  if (!IS_CONFIGURED()) {
    const all = lsGet("sasyra_assessments") || [];
    return buildPaginatedResponse(all.filter(a => a.patientId === patientId), 0, 1, 1000);
  }
  return _fetchAssessments(userId, patientId, opts);
}

export async function getFullAssessment(userId, assessmentId) {
  if (!IS_CONFIGURED()) {
    const all = lsGet("sasyra_assessments") || [];
    return all.find(a => a.id === assessmentId) || null;
  }
  return _fetchFullAssessment(userId, assessmentId);
}

export async function saveAssessment(userId, assessment) {
  if (!IS_CONFIGURED()) {
    const list = lsGet("sasyra_assessments") || [];
    const idx = list.findIndex(a => a.id === assessment.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...assessment };
    else list.push(assessment);
    lsSet("sasyra_assessments", list);
    return assessment;
  }
  // Extract normalized data
  const muscleTests = (assessment.forca || []).map(m => ({ muscle: m.muscle || m.id, value: m.value }));
  const gonio = (assessment.gonio || []).map(g => ({ joint: g.joint, movement: g.movement, value: g.value }));
  const specialTests = (assessment.tests || {});

  // Use the SECURITY DEFINER function for batch insert
  const { data, error } = await supabase.rpc("sasyra_batch_insert_assessment", {
    p_user_id: userId,
    p_patient_id: assessment.patientId,
    p_assessment: JSON.parse(JSON.stringify(assessment)),
    p_muscle_tests: JSON.parse(JSON.stringify(muscleTests)),
    p_goniometry: JSON.parse(JSON.stringify(gonio)),
    p_special_tests: JSON.parse(JSON.stringify(specialTests)),
  });
  if (error) throw error;
  return { ...assessment, id: data };
}

export async function deleteAssessment(userId, assessmentId) {
  if (!IS_CONFIGURED()) {
    const list = lsGet("sasyra_assessments") || [];
    lsSet("sasyra_assessments", list.filter(a => a.id !== assessmentId));
    return;
  }
  // Cascade deletes via FK
  await supabase.from("assessments").delete().eq("id", assessmentId).eq("user_id", userId);
}

function mapAssessmentFromDB(row) {
  return {
    id: row.id,
    patientId: row.patient_id,
    data: row.data,
    date: row.data,
    queixa: row.queixa,
    queixaKey: row.queixa_key,
    localDor: row.local_dor || [],
    caraterDor: row.carater_dor || [],
    tempoDor: row.tempo_dor,
    melhora: row.melhora || [],
    piora: row.piora || [],
    hda: row.hda,
    comorbid: row.comorbid || [],
    antec: row.antec || [],
    meds: row.meds,
    yellowFlagsState: row.yellow_flags || [],
    selectedRedFlags: row.selected_red_flags || [],
    evaMov: row.eva_mov,
    evaRep: row.eva_rep,
    avds: row.avds || [],
    objTrat: row.obj_trat || [],
    nivelAti: row.nivel_ati,
    postura: row.postura || [],
    marcha: row.marcha,
    edema: row.edema,
    palpacao: row.palpacao,
    sensib: row.sensib,
    reflexos: row.reflexos,
    obs: row.obs,
    regiao: row.regiao,
    diagnosticoCinesio: row.diagnostico_cinesio,
    vitalSigns: row.vital_signs || {},
    impressaoClinica: row.impressao_clinica,
    autoCIF: row.auto_cif || [],
    recommendedScales: row.recommended_scales || [],
    honorario: row.honorario,
    isExpress: row.is_express || false,
    status: row.status || "complete",
  };
}

// ════════════════════════════════════════════════════════════
// LOGS (paginated)
// ════════════════════════════════════════════════════════════

const LOG_FIELDS = `id, user_id, patient_id, data, eva, procedimentos, resposta, evolucao, metas, escalas, escala_data, pa, adms, mrcs, sessao_num, spo2, glucose, heart_rate, is_express_vital`;

async function _fetchLogs(userId, patientId, { page = 1, fromDate, toDate } = {}) {
  const { limit, offset } = paginate(page);
  let query = supabase.from("logs").select(LOG_FIELDS, { count: "exact" }).eq("user_id", userId);
  if (patientId) query = query.eq("patient_id", patientId);
  if (fromDate) query = query.gte("data", fromDate);
  if (toDate) query = query.lte("data", toDate);
  const { data, count, error } = await query.order("data", { ascending: false }).range(offset, offset + limit - 1);
  if (error) throw error;
  return buildPaginatedResponse(data.map(mapLogFromDB), count, page, limit);
}

export async function fetchLogs(userId, opts = {}) {
  if (!IS_CONFIGURED()) return buildPaginatedResponse(lsGet("sasyra_logs") || [], 0, 1, 1000);
  return _fetchLogs(userId, null, opts);
}

export async function fetchLogsByPatient(userId, patientId, opts = {}) {
  if (!IS_CONFIGURED()) {
    const all = lsGet("sasyra_logs") || [];
    return buildPaginatedResponse(all.filter(l => l.patientId === patientId), 0, 1, 1000);
  }
  return _fetchLogs(userId, patientId, opts);
}

export async function saveLog(userId, log) {
  if (!IS_CONFIGURED()) {
    const list = lsGet("sasyra_logs") || [];
    const idx = list.findIndex(l => l.id === log.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...log };
    else list.push(log);
    lsSet("sasyra_logs", list);
    return log;
  }
  const db = mapLogToDB(log, userId);
  if (log.id && !log._tempId) {
    const { error } = await supabase.from("logs").update(db).eq("id", log.id).eq("user_id", userId);
    if (error) throw error;
    return log;
  }
  const { data, error } = await supabase.from("logs").insert(db).select().single();
  if (error) throw error;
  return mapLogFromDB(data);
}

export async function deleteLog(userId, logId) {
  if (!IS_CONFIGURED()) {
    const list = lsGet("sasyra_logs") || [];
    lsSet("sasyra_logs", list.filter(l => l.id !== logId));
    return;
  }
  await supabase.from("logs").delete().eq("id", logId).eq("user_id", userId);
}

function mapLogFromDB(row) {
  return {
    id: row.id,
    patientId: row.patient_id,
    data: row.data,
    eva: row.eva,
    procedimentos: row.procedimentos || [],
    resposta: row.resposta,
    evolucao: row.evolucao,
    metas: row.metas,
    escalas: row.escalas,
    escalaData: row.escala_data || null,
    pa: row.pa,
    adms: row.adms || [],
    mrcs: row.mrcs || [],
    sessaoNum: row.sessao_num,
    spo2: row.spo2,
    glucose: row.glucose,
    heartRate: row.heart_rate,
    isExpressVital: row.is_express_vital || false,
  };
}

function mapLogToDB(l, userId) {
  return {
    user_id: userId,
    patient_id: l.patientId,
    data: l.data,
    eva: l.eva ?? null,
    procedimentos: l.procedimentos || [],
    resposta: l.resposta || null,
    evolucao: l.evolucao || null,
    metas: l.metas || null,
    escalas: l.escalas || null,
    escala_data: l.escalaData || null,
    pa: l.pa || null,
    adms: l.adms || [],
    mrcs: l.mrcs || [],
    sessao_num: l.sessaoNum ?? null,
    spo2: l.spo2 || null,
    glucose: l.glucose || null,
    heart_rate: l.heartRate || null,
    is_express_vital: l.isExpressVital || false,
  };
}

// ════════════════════════════════════════════════════════════
// APPOINTMENTS (paginated, filtered)
// ════════════════════════════════════════════════════════════

export async function fetchAppointments(userId, { page = 1, fromDate, toDate, status } = {}) {
  if (!IS_CONFIGURED()) return buildPaginatedResponse(lsGet("sasyra_appointments") || [], 0, 1, 1000);
  const { limit, offset } = paginate(page);
  let query = supabase.from("appointments").select("*", { count: "exact" }).eq("user_id", userId);
  if (fromDate) query = query.gte("date", fromDate);
  if (toDate) query = query.lte("date", toDate);
  if (status) query = query.eq("status", status);
  const { data, count, error } = await query.order("date", { ascending: true }).order("start_time", { ascending: true }).range(offset, offset + limit - 1);
  if (error) throw error;
  return buildPaginatedResponse(data, count, page, limit);
}

export async function saveAppointment(userId, apt) {
  if (!IS_CONFIGURED()) {
    const list = lsGet("sasyra_appointments") || [];
    const idx = list.findIndex(a => a.id === apt.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...apt };
    else list.push(apt);
    lsSet("sasyra_appointments", list);
    return apt;
  }
  const db = { user_id: userId, ...apt };
  delete db.id;
  if (apt.id && !apt._tempId) {
    await supabase.from("appointments").update(db).eq("id", apt.id).eq("user_id", userId);
    return apt;
  }
  const { data, error } = await supabase.from("appointments").insert(db).select().single();
  if (error) throw error;
  return data;
}

// ════════════════════════════════════════════════════════════
// SUBSCRIPTION (cached)
// ════════════════════════════════════════════════════════════

export async function fetchSubscription(userId) {
  if (!IS_CONFIGURED()) return lsGet("sasyra_subscription");

  const cacheKey = `sub_${userId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).single();
  if (error && error.code === "PGRST116") return null;
  if (error) throw error;
  const result = data ? {
    plan: data.plan,
    startDate: data.start_date,
    nextBilling: data.next_billing,
    billing: data.billing,
    invoices: [],
    extraUsers: data.extra_users || [],
    aiAnalysesUsed: data.ai_analyses_used,
    aiPeriodStart: data.ai_period_start,
    aiExpansion: data.ai_expansion || null,
  } : null;

  cacheSet(cacheKey, result, 30000);
  return result;
}

export async function upsertSubscription(userId, sub) {
  if (!IS_CONFIGURED()) { lsSet("sasyra_subscription", sub); return; }
  cache.delete(`sub_${userId}`);
  const { error } = await supabase.from("subscriptions").upsert({
    user_id: userId, plan: sub.plan, billing: sub.billing,
    start_date: sub.startDate, next_billing: sub.nextBilling,
    ai_analyses_used: sub.aiAnalysesUsed || 0, ai_period_start: sub.aiPeriodStart,
    ai_expansion: sub.aiExpansion || null, extra_users: sub.extraUsers || [],
  }, { onConflict: "user_id" });
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════
// MODULE DATA (per-module typed tables)
// ════════════════════════════════════════════════════════════

const MODULE_TABLES = {
  neuro: "neuro_data",
  pediatria: "ped_data",
  crossfit: "cf_data",
  nutricao: "nutri_data",
  terapiaOcupacional: "to_data",
};

export async function fetchModuleData(userId, patientId, module) {
  const table = MODULE_TABLES[module];
  if (!table) {
    // Fallback: localStorage for unknown modules
    const key = `${module}_data_${patientId}`;
    return lsGet(key) || {};
  }
  if (!IS_CONFIGURED()) {
    const key = `${module}_data_${patientId}`;
    return lsGet(key) || {};
  }
  const { data, error } = await supabase.from(table).select("*").eq("user_id", userId).eq("patient_id", patientId).single();
  if (error && error.code === "PGRST116") return {};
  if (error) throw error;
  return data || {};
}

export async function saveModuleData(userId, patientId, module, data) {
  const table = MODULE_TABLES[module];
  if (!table) {
    const key = `${module}_data_${patientId}`;
    lsSet(key, data);
    return;
  }
  if (!IS_CONFIGURED()) {
    const key = `${module}_data_${patientId}`;
    lsSet(key, data);
    return;
  }
  const { error } = await supabase.from(table).upsert({
    user_id: userId,
    patient_id: patientId,
    ...data,
  }, { onConflict: "user_id,patient_id" });
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════
// PE DATA (specific tables: pe_assessments, pe_treinos, pe_pse_sessions)
// ════════════════════════════════════════════════════════════

export async function fetchPeAssessments(userId, patientId, { page = 1 } = {}) {
  if (!IS_CONFIGURED()) {
    const all = lsGet("pe_data") || {};
    return buildPaginatedResponse((all[patientId]?.assessments || []).sort((a, b) => b.data?.localeCompare(a.data)), 0, 1, 1000);
  }
  const { limit, offset } = paginate(page);
  const { data, count, error } = await supabase.from("pe_assessments")
    .select("*", { count: "exact" }).eq("user_id", userId).eq("patient_id", patientId)
    .order("data", { ascending: false }).range(offset, offset + limit - 1);
  if (error) throw error;
  return buildPaginatedResponse(data, count, page, limit);
}

export async function fetchPeTreinos(userId, patientId, { page = 1 } = {}) {
  if (!IS_CONFIGURED()) {
    const all = lsGet("pe_data") || {};
    return buildPaginatedResponse((all[patientId]?.treinos || []).sort((a, b) => b.dataPrescricao?.localeCompare(a.dataPrescricao)), 0, 1, 1000);
  }
  const { limit, offset } = paginate(page);
  const { data, count, error } = await supabase.from("pe_treinos")
    .select("*", { count: "exact" }).eq("user_id", userId).eq("patient_id", patientId)
    .order("data_prescricao", { ascending: false }).range(offset, offset + limit - 1);
  if (error) throw error;
  return buildPaginatedResponse(data, count, page, limit);
}

export async function fetchPePseSessions(userId, patientId) {
  if (!IS_CONFIGURED()) {
    const all = lsGet("pe_data") || {};
    return all[patientId]?.pse || [];
  }
  const { data, error } = await supabase.from("pe_pse_sessions")
    .select("*").eq("user_id", userId).eq("patient_id", patientId).order("data", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ════════════════════════════════════════════════════════════
// PATIENT ACCESS & PLANS
// ════════════════════════════════════════════════════════════

export async function fetchPatientAccess(userId) {
  if (!IS_CONFIGURED()) return lsGet("sasyra_patient_access") || {};
  const { data, error } = await supabase.from("patient_access").select("*").eq("user_id", userId);
  if (error) throw error;
  const map = {};
  for (const row of data || []) map[row.patient_id] = { code: row.code, createdAt: row.created_at, views: row.views, lastView: row.last_view };
  return map;
}

export async function savePatientAccess(userId, patientId, accessData) {
  if (!IS_CONFIGURED()) {
    const map = lsGet("sasyra_patient_access") || {};
    map[patientId] = accessData;
    lsSet("sasyra_patient_access", map);
    return;
  }
  await supabase.from("patient_access").upsert({
    user_id: userId, patient_id: patientId,
    code: accessData.code, views: accessData.views || 0,
    last_view: accessData.lastView || null,
  }, { onConflict: "user_id,patient_id" });
}

// ════════════════════════════════════════════════════════════
// TRANSACOES (paginated)
// ════════════════════════════════════════════════════════════

export async function fetchTransacoes(userId, { page = 1, fromDate, toDate, type } = {}) {
  if (!IS_CONFIGURED()) {
    return {
      pagamentos: lsGet("sasyra_pagamentos") || {},
      valoresPaciente: lsGet("sasyra_valores_paciente") || {},
      despesas: lsGet("sasyra_despesas") || [],
    };
  }
  const { limit, offset } = paginate(page);
  let query = supabase.from("transacoes").select("*", { count: "exact" }).eq("user_id", userId);
  if (fromDate) query = query.gte("data", fromDate);
  if (toDate) query = query.lte("data", toDate);
  if (type) query = query.eq("type", type);
  const { data, count, error } = await query.order("data", { ascending: false }).range(offset, offset + limit - 1);
  if (error) throw error;
  return buildPaginatedResponse(data, count, page, limit);
}

// ════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════

export async function signUp(email, password, profile) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id, nome: profile.nome, email, prof: profile.prof, crefito: profile.crefito || null,
    });
    await supabase.from("subscriptions").insert({ user_id: data.user.id, plan: "start", billing: "monthly" });
  }
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() { await supabase.auth.signOut(); }

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) return null;
  return data ? { nome: data.nome, email: data.email, prof: data.prof, crefito: data.crefito } : null;
}

// ════════════════════════════════════════════════════════════
// SYNC localStorage → Supabase
// ════════════════════════════════════════════════════════════

export async function syncLocalToSupabase(userId) {
  if (!IS_CONFIGURED()) return { ok: false, reason: "Supabase not configured" };

  const result = await supabase.rpc("sasyra_migrate_from_localstorage", {
    p_user_id: userId,
    p_data: JSON.parse(JSON.stringify({
      patients: lsGet("sasyra_patients") || [],
      assessments: lsGet("sasyra_assessments") || [],
      logs: lsGet("sasyra_logs") || [],
    })),
  });

  return result.data || { ok: true, message: "Migration triggered" };
}

// ════════════════════════════════════════════════════════════
// IN-MEMORY CACHE CLEAR
// ════════════════════════════════════════════════════════════

export function clearCache() { cache.clear(); }
