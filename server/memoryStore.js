import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const MEMORY_FILE = join(DATA_DIR, "memory-store.json");
const TOKEN_FILE = join(DATA_DIR, "token-tracker.json");

function readJSON(file, fallback) {
  try {
    if (existsSync(file)) return JSON.parse(readFileSync(file, "utf-8"));
  } catch {}
  return fallback;
}

function writeJSON(file, data) {
  try { writeFileSync(file, JSON.stringify(data, null, 2), "utf-8"); } catch {}
}

export function saveAnalysis({ patientName, queixa, prompt, response, inputTokens, outputTokens, model, cachedInputTokens }) {
  const store = readJSON(MEMORY_FILE, { analyses: [] });
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    patientName: patientName || "—",
    queixa: queixa || "—",
    promptLength: prompt?.length || 0,
    responseLength: response?.length || 0,
    inputTokens: inputTokens || 0,
    outputTokens: outputTokens || 0,
    cachedInputTokens: cachedInputTokens || 0,
    model: model || "claude-sonnet-4-6",
  };
  store.analyses.push(entry);
  if (store.analyses.length > 500) store.analyses = store.analyses.slice(-500);
  writeJSON(MEMORY_FILE, store);

  trackTokens(inputTokens || 0, outputTokens || 0);
  return entry;
}

export function listAnalyses(limit = 50) {
  const store = readJSON(MEMORY_FILE, { analyses: [] });
  return store.analyses.slice(-limit).reverse();
}

function trackTokens(input, output) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const tracker = readJSON(TOKEN_FILE, { months: {} });
  if (!tracker.months[monthKey]) tracker.months[monthKey] = { inputTokens: 0, outputTokens: 0, totalAnalyses: 0 };
  tracker.months[monthKey].inputTokens += input;
  tracker.months[monthKey].outputTokens += output;
  tracker.months[monthKey].totalAnalyses += 1;
  writeJSON(TOKEN_FILE, tracker);
}

export function getTokenSummary() {
  const tracker = readJSON(TOKEN_FILE, { months: {} });
  const months = Object.entries(tracker.months)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12)
    .map(([month, data]) => ({
      month,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      totalTokens: data.inputTokens + data.outputTokens,
      totalAnalyses: data.totalAnalyses,
    }));

  const currentMonth = months[0] || { inputTokens: 0, outputTokens: 0, totalTokens: 0, totalAnalyses: 0 };
  const allTime = months.reduce((acc, m) => ({
    inputTokens: acc.inputTokens + m.inputTokens,
    outputTokens: acc.outputTokens + m.outputTokens,
    totalTokens: acc.totalTokens + m.totalTokens,
    totalAnalyses: acc.totalAnalyses + m.totalAnalyses,
  }), { inputTokens: 0, outputTokens: 0, totalTokens: 0, totalAnalyses: 0 });

  return { currentMonth, allTime, months };
}
