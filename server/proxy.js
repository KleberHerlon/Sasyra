import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import { existsSync } from "fs";
import { saveAnalysis, listAnalyses, getTokenSummary } from "./memoryStore.js";
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN?.split(",") || ["http://localhost:5173"];

const app = express();

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json({ limit: "200kb" }));

const SYSTEM_PROMPT = `Você é um profissional de saúde especialista em medicina baseada em evidências (PEDro, Cochrane, CPGs internacionais).
Responda estritamente em Português do Brasil (pt-BR).

REGRAS CLÍNICAS:
- Use terminologia clínica adotada no Brasil
- Quando citar estudos, informe: Autor (Ano). "Título". Periódico. Nível de evidência: X
- Priorize revisões sistemáticas e meta-análises (OCEBM 1A)
- Classifique nível de evidência: 1A (revisão sistemática de RCTs), 1B (RCT individual), 2A (revisão de coortes), 2B (coorte individual), etc.
- REGRA FUNDAMENTAL: Todas as referências citadas DEVEM ser de intervenções EXCLUSIVAMENTE fisioterapêuticas — como cinesioterapia/exercício terapêutico, terapia manual, eletrotermofototerapia, hidroterapia, acupuntura seca, bandagem funcional, educação em dor, reeducação postural, etc.
- NÃO cite nem recomende cirurgias, medicamentos, infiltrações, bloqueios anestésicos, opioides, anti-inflamatórios, procedimentos invasivos, dietas restritivas ou qualquer intervenção fora do escopo da Fisioterapia.
- Se houver menção a tratamento médico (cirúrgico ou farmacológico), deve ser apenas como "recomendar encaminhamento ao médico" sem detalhamento.

ESTRUTURA CIF:
- Use classificadores: 0 (nenhuma deficiência), 1 (leve), 2 (moderada), 3 (grave), 4 (completa)
- Formato: código(qualificador) — ex: b28013(2), d4500(1)

ESTRUTURA DO PLANO DE TRATAMENTO — SIGA RIGOROSAMENTE ESTE FORMATO:

O plano deve ser dividido em FASES numeradas sequencialmente. Para cada fase, informe:
- Nome da fase (ex: Fase 1 — Analgesia e Proteção)
- Sessões: intervalo numérico (ex: Sessões 1-4)
- Frequência: número de vezes por semana (ex: 2x/semana)
- Duração: tempo total da fase em semanas
- Objetivos específicos da fase (2-3 marcadores)
- Intervenções detalhadas com dose, série, repetições, carga quando aplicável
- Evidência que suporta cada intervenção (Autor, Ano — Nível)

Ao final do plano, inclua:
- Número total de sessões previsto para o tratamento completo
- Intervalo ideal entre sessões
- Critérios de progressão entre fases (o que o paciente precisa atingir para avançar)
- Critérios de alta (RTS — Return to Sport / retorno à função)
- Prognóstico: expectativa realista de melhoria em semanas/meses
- Recomendações ao paciente: orientações domiciliares, modificações de atividade, sinais de alerta

Na Hipótese Diagnóstica Funcional, inclua:
- Diagnóstico fisioterapêutico principal
- Diagnósticos diferenciais relevantes
- Fatores contribuintes (biomecânicos, psicossociais, ocupacionais)
- Códigos CIF com qualificadores (mínimo 4 códigos)

FORMATO DE CITAÇÃO:
- Autor (Ano). "Título". Periódico. Nível de evidência: X
- Ex: Smith et al. (2023). "Efeitos da terapia manual". J Orthop Sports Phys Ther. Nível de evidência: 1B`;

function checkQuota(_plan, _aiAnalysesUsed, _aiLimit) {
  if (!_plan || _plan === "avulso") return { allowed: true, overage: true, reason: "pay_per_use" };
  if (_aiLimit <= 0) return { allowed: true, overage: true, reason: "no_included" };
  if (_aiAnalysesUsed < _aiLimit) return { allowed: true, overage: false, reason: "within_quota" };
  return { allowed: true, overage: true, reason: "over_quota_charge" };
}

function getProvider() {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (deepseekKey && deepseekKey !== "sk-placeholder") return { provider: "deepseek", key: deepseekKey };
  if (geminiKey && geminiKey !== "sk-placeholder") return { provider: "gemini", key: geminiKey };
  return { provider: null, key: null };
}

async function callDeepSeek(model, messages, maxTokens, patientInfo) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  const systemExtra = patientInfo.system
    ? (Array.isArray(patientInfo.system) ? patientInfo.system.join("\n") : patientInfo.system)
    : "";

  const fullSystem = SYSTEM_PROMPT + (systemExtra ? "\n\n" + systemExtra : "");

  const body = {
    model: model || "deepseek-chat",
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: fullSystem },
      ...(messages || [])
    ],
    temperature: 0.3,
  };

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`DeepSeek erro ${res.status}: ${JSON.stringify(data)}`);
  }

  return {
    text: data.choices?.[0]?.message?.content || "",
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
    model: body.model,
  };
}

async function callGemini(model, messages, maxTokens, patientInfo) {
  const apiKey = process.env.GEMINI_API_KEY;
  const geminiModel = model?.startsWith("gemini") ? model : "gemini-2.0-flash";

  const systemExtra = patientInfo.system
    ? (Array.isArray(patientInfo.system) ? patientInfo.system.join("\n") : patientInfo.system)
    : "";

  const fullSystem = SYSTEM_PROMPT + (systemExtra ? "\n\n" + systemExtra : "");

  const contents = (messages || []).map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }],
  }));

  const body = {
    systemInstruction: { parts: [{ text: fullSystem }] },
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.3,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Gemini erro ${res.status}: ${JSON.stringify(data)}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";

  return {
    text,
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
    model: geminiModel,
  };
}

app.post("/api/anthropic", async (req, res) => {
  try {
    const provider = getProvider();

    if (!provider.provider) {
      return res.status(500).json({
        error: "Nenhuma chave de IA configurada. Defina DEEPSEEK_API_KEY ou GEMINI_API_KEY no server/.env.\n\n" +
               "DeepSeek (pago, barato): https://platform.deepseek.com/\n" +
               "Gemini (gratuito): https://aistudio.google.com/apikey",
      });
    }

    const { _plan, _aiAnalysesUsed, _aiLimit, _patientName, _queixa } = req.body;

    const quota = checkQuota(_plan, _aiAnalysesUsed, _aiLimit);
    if (!quota.allowed) {
      return res.status(403).json({ error: "Cota de análises excedida. Adquira mais créditos." });
    }

    const maxTokens = Math.min(req.body.max_tokens || 2000, 4000);
    const model = req.body.model || (provider.provider === "gemini" ? "gemini-2.0-flash" : "deepseek-chat");
    const messages = (req.body.messages || []).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
    }));

    let result;
    if (provider.provider === "deepseek") {
      result = await callDeepSeek(model, messages, maxTokens, req.body);
    } else {
      result = await callGemini(model, messages, maxTokens, req.body);
    }

    const lastMsg = req.body.messages?.[req.body.messages.length - 1];
    const promptText = typeof lastMsg?.content === "string" ? lastMsg.content : "";
    saveAnalysis({
      patientName: _patientName,
      queixa: _queixa,
      prompt: promptText,
      response: result.text,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      model: result.model,
    });

    const responseData = {
      content: result.text ? [{ text: result.text }] : [],
      model: result.model,
      usage: {
        input_tokens: result.inputTokens,
        output_tokens: result.outputTokens,
      },
      stop_reason: "stop",
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(502).json({ error: err.message || "Erro ao comunicar com API de IA." });
  }
});

app.post("/api/memory/save", (req, res) => {
  const { patientName, queixa, prompt, response, inputTokens, outputTokens, model } = req.body;
  if (!prompt || !response) return res.status(400).json({ error: "prompt e response são obrigatórios." });
  const entry = saveAnalysis({ patientName, queixa, prompt, response, inputTokens, outputTokens, model });
  res.json({ ok: true, entry });
});

app.get("/api/memory", (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const analyses = listAnalyses(limit);
  res.json({ analyses });
});

app.get("/api/tokens", (_req, res) => {
  const summary = getTokenSummary();
  res.json(summary);
});

app.get("/api/health", (_req, res) => {
  const provider = getProvider();
  res.json({
    status: "ok",
    provider: provider.provider || "none",
    keyConfigured: !!provider.provider,
  });
});

const distPath = join(__dirname, "..", "dist");
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((_req, res) => {
    res.sendFile(join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  const provider = getProvider();
  console.log(`Sasyra proxy rodando em http://localhost:${PORT} (provedor: ${provider.provider || "nenhum configurado"})`);
});
