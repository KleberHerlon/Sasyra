import "dotenv/config";
import express from "express";
import cors from "cors";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { saveAnalysis, listAnalyses, getTokenSummary } from "./memoryStore.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN?.split(",") || ["http://localhost:5173"];

const app = express();

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json({ limit: "200kb" }));

// ── Shared system prompt block (eligible for prompt caching) ────────────────
const SYSTEM_PROMPT_BLOCK = {
  type: "text",
  text: `Você é um profissional de saúde especialista em medicina baseada em evidências (PEDro, Cochrane, CPGs internacionais).
Responda estritamente em Português do Brasil (pt-BR).

REGRAS CLÍNICAS:
- Use terminologia clínica adotada no Brasil
- Quando citar estudos, informe: Autor (Ano). "Título". Periódico. Nível de evidência: X
- Priorize revisões sistemáticas e meta-análises (OCEBM 1A)
- Classifique nível de evidência: 1A (revisão sistemática de RCTs), 1B (RCT individual), 2A (revisão de coortes), 2B (coorte individual), etc.
- **REGRRA FUNDAMENTAL: Todas as referências citadas DEVEM ser de intervenções EXCLUSIVAMENTE fisioterapêuticas** — como cinesioterapia/exercício terapêutico, terapia manual, eletrotermofototerapia, hidroterapia, acupuntura seca, bandagem funcional, educação em dor, reeducação postural, etc.
- **NÃO cite nem recomende** cirurgias, medicamentos, infiltrações, bloqueios anestésicos, opioides, anti-inflamatórios, procedimentos invasivos, dietas restritivas ou qualquer intervenção fora do escopo da Fisioterapia.
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
- Ex: Smith et al. (2023). "Efeitos da terapia manual". J Orthop Sports Phys Ther. Nível de evidência: 1B`,
  cache_control: { type: "ephemeral" },
};

// ── Quota check helper ─────────────────────────────────────────────────────
function checkQuota(plan, aiAnalysesUsed, aiLimit) {
  if (!plan || plan === "avulso") return { allowed: true, overage: true, reason: "pay_per_use" };
  if (aiLimit <= 0) return { allowed: true, overage: true, reason: "no_included" };
  if (aiAnalysesUsed < aiLimit) return { allowed: true, overage: false, reason: "within_quota" };
  return { allowed: true, overage: true, reason: "over_quota_charge" };
}

// ── AI PROXY ────────────────────────────────────────────────────────────────
app.post("/api/anthropic", async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-placeholder") {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY não configurada no servidor." });
    }

    const { _plan, _aiAnalysesUsed, _aiLimit, _patientName, _queixa } = req.body;

    const quota = checkQuota(_plan, _aiAnalysesUsed, _aiLimit);
    if (!quota.allowed) {
      return res.status(403).json({ error: "Cota de análises excedida. Adquira mais créditos." });
    }

    const maxTokens = Math.min(req.body.max_tokens || 1000, 1800);

    const body = {
      model: req.body.model || "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: [SYSTEM_PROMPT_BLOCK, ...(Array.isArray(req.body.system) ? req.body.system : req.body.system ? [{ type: "text", text: req.body.system }] : [])],
      messages: req.body.messages || [],
    };

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "prompt-caching-2025-02-19",
      },
      body: JSON.stringify(body),
    });

    const data = await anthropicRes.json();

    if (anthropicRes.ok && data.usage) {
      const lastMsg = req.body.messages?.[req.body.messages.length - 1];
      const promptText = typeof lastMsg?.content === "string" ? lastMsg.content : "";
      const responseText = data.content?.map(c => c.text || "").join("\n") || "";
      saveAnalysis({
        patientName: _patientName,
        queixa: _queixa,
        prompt: promptText,
        response: responseText,
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        model: body.model,
        cachedInputTokens: data.usage.cache_creation_input_tokens || data.usage.cache_read_input_tokens || 0,
      });
    }

    res.status(anthropicRes.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(502).json({ error: "Erro ao comunicar com Anthropic API." });
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
  res.json({ status: "ok", keyConfigured: process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "sk-ant-placeholder" });
});

const distPath = join(__dirname, "..", "dist");
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((_req, res) => {
    res.sendFile(join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Sasyra proxy rodando em http://localhost:${PORT}`);
});
