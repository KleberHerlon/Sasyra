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

app.post("/api/anthropic", async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-placeholder") {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY não configurada no servidor." });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await anthropicRes.json();

    if (anthropicRes.ok && data.usage) {
      const lastMsg = req.body.messages?.[req.body.messages.length - 1];
      const promptText = typeof lastMsg?.content === "string" ? lastMsg.content : "";
      const responseText = data.content?.map(c => c.text || "").join("\n") || "";
      saveAnalysis({
        patientName: req.body._patientName,
        queixa: req.body._queixa,
        prompt: promptText,
        response: responseText,
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        model: req.body.model,
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
