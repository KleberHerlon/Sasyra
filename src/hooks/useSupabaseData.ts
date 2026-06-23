// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchPatients, savePatient, deletePatient as deletePatientService, findPatient,
  fetchAssessments, saveAssessment, deleteAssessment, fetchAssessmentsByPatient,
  fetchLogs, saveLog, deleteLog, fetchLogsByPatient,
  clearCache,
} from "../data/supabaseService";

const LOCAL_PATIENTS = "sasyra_patients";
const LOCAL_ASSESSMENTS = "sasyra_assessments";
const LOCAL_LOGS = "sasyra_logs";

function lsGet(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ── PATIENTS (paginated) ───────────────────────────────────

export function useSupabasePatients(userId) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);

  const load = useCallback(async (p, s) => {
    setLoading(true);
    try {
      const res = await fetchPatients(userId, { page: p, search: s });
      setPatients(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch {
      setPatients(lsGet(LOCAL_PATIENTS));
      setTotalPages(1);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    load(1, "");
  }, [userId, load]);

  useEffect(() => {
    if (!userId) return;
    const t = setTimeout(() => load(page, search), 300);
    return () => clearTimeout(t);
  }, [page, search, userId, load]);

  const addPatient = useCallback((p) => {
    const newP = { ...p, id: Date.now(), data: new Date().toISOString().slice(0, 10) };
    setPatients(prev => [newP, ...prev]);
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const list = lsGet(LOCAL_PATIENTS); list.push(newP); lsSet(LOCAL_PATIENTS, list);
    } else {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => savePatient(userId, newP).catch(console.error), 500);
    }
  }, [userId]);

  const updatePatient = useCallback((id, updates) => {
    setPatients(prev => prev.map(p => (p.id || p.nome) === id ? { ...p, ...updates } : p));
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const list = lsGet(LOCAL_PATIENTS);
      const idx = list.findIndex(p => (p.id || p.nome) === id);
      if (idx >= 0) { list[idx] = { ...list[idx], ...updates }; lsSet(LOCAL_PATIENTS, list); }
    } else {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        const p = await findPatient(userId, id);
        if (p) savePatient(userId, { ...p, ...updates }).catch(console.error);
      }, 500);
    }
  }, [userId]);

  const deleteP = useCallback((id) => {
    setPatients(prev => prev.filter(p => (p.id || p.nome) !== id));
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const list = lsGet(LOCAL_PATIENTS);
      lsSet(LOCAL_PATIENTS, list.filter(p => (p.id || p.nome) !== id));
    } else {
      deletePatientService(userId, id).catch(console.error);
    }
  }, [userId]);

  return { patients, setPatients, addPatient, updatePatient, deletePatient: deleteP, loading, page, setPage, totalPages, search, setSearch };
}

// ── ASSESSMENTS (paginated) ────────────────────────────────

export function useSupabaseAssessments(userId) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    fetchAssessments(userId, { page }).then(res => {
      setAssessments(res.data || []);
      setTotalPages(res.totalPages || 1);
      setLoading(false);
    }).catch(() => {
      setAssessments(lsGet(LOCAL_ASSESSMENTS));
      setLoading(false);
    });
  }, [userId, page]);

  const addAssessment = useCallback((a) => {
    setAssessments(prev => [a, ...prev]);
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const list = lsGet(LOCAL_ASSESSMENTS);
      list.unshift(a); lsSet(LOCAL_ASSESSMENTS, list);
    } else {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => saveAssessment(userId, a).catch(console.error), 500);
    }
  }, [userId]);

  const deleteA = useCallback((id) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const list = lsGet(LOCAL_ASSESSMENTS);
      lsSet(LOCAL_ASSESSMENTS, list.filter(a => a.id !== id));
    } else {
      deleteAssessment(userId, id).catch(console.error);
    }
  }, [userId]);

  return { assessments, setAssessments, addAssessment, deleteAssessment: deleteA, loading, page, setPage, totalPages };
}

// ── LOGS (paginated) ──────────────────────────────────────

export function useSupabaseLogs(userId) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    fetchLogs(userId, { page }).then(res => {
      setLogs(res.data || []);
      setTotalPages(res.totalPages || 1);
      setLoading(false);
    }).catch(() => {
      setLogs(lsGet(LOCAL_LOGS));
      setLoading(false);
    });
  }, [userId, page]);

  const addLog = useCallback((l) => {
    setLogs(prev => [l, ...prev]);
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const list = lsGet(LOCAL_LOGS);
      list.unshift(l); lsSet(LOCAL_LOGS, list);
    } else {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => saveLog(userId, l).catch(console.error), 500);
    }
  }, [userId]);

  const deleteL = useCallback((id) => {
    setLogs(prev => prev.filter(l => l.id !== id));
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const list = lsGet(LOCAL_LOGS);
      lsSet(LOCAL_LOGS, list.filter(l => l.id !== id));
    } else {
      deleteLog(userId, id).catch(console.error);
    }
  }, [userId]);

  return { logs, setLogs, addLog, deleteLog: deleteL, loading, page, setPage, totalPages };
}

// ── CACHE CONTROL ─────────────────────────────────────────

export function useClearCache() {
  return clearCache;
}
