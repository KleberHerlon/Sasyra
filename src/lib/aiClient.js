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

function getAIConfig() {
  try {
    const raw = localStorage.getItem("sasyra_ai_config");
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveAIConfig(config) {
  const current = getAIConfig();
  const merged = { ...current, ...config };
  localStorage.setItem("sasyra_ai_config", JSON.stringify(merged));
  return merged;
}

const DEFAULT_DEEPSEEK_KEY = "sk-f0c0c6329c824a62a1e3d78c48ee3ec5";

async function callGeminiDirect(messages, maxTokens, systemExtra) {
  const config = getAIConfig();
  const apiKey = config.geminiKey;
  if (!apiKey) throw new Error("GEMINI_KEY_MISSING");

  const fullSystem = SYSTEM_PROMPT + (systemExtra ? "\n\n" + systemExtra : "");

  const contents = (messages || []).map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: fullSystem }] },
        contents,
        generationConfig: { maxOutputTokens: Math.min(maxTokens, 4000), temperature: 0.3 },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini erro ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";

  return {
    text,
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
    model: "gemini-2.0-flash",
  };
}

async function callDeepSeekDirect(messages, maxTokens, systemExtra) {
  const config = getAIConfig();
  const apiKey = config.deepseekKey || DEFAULT_DEEPSEEK_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_KEY_MISSING");

  const fullSystem = SYSTEM_PROMPT + (systemExtra ? "\n\n" + systemExtra : "");

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: Math.min(maxTokens, 4000),
      messages: [
        { role: "system", content: fullSystem },
        ...(messages || []),
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`DeepSeek erro ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();

  return {
    text: data.choices?.[0]?.message?.content || "",
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
    model: "deepseek-chat",
  };
}

async function callProxy(payload, signal) {
  const res = await fetch("/api/anthropic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Proxy erro ${res.status}: ${JSON.stringify(err)}`);
  }

  const d = await res.json();
  return {
    text: d.content?.map(c => c.text || "").join("\n") || "",
    inputTokens: d.usage?.input_tokens || 0,
    outputTokens: d.usage?.output_tokens || 0,
    model: d.model || "proxy",
  };
}

export async function runAIAnalysis(payload, signal) {
  const m = (payload.messages || []).map(msg => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content),
  }));
  const maxTokens = Math.min(payload.max_tokens || 2800, 4000);
  const systemExtra = payload.system || "";

  const proxyPayload = {
    ...payload,
    model: payload.model || "deepseek-chat",
    max_tokens: maxTokens,
    messages: m,
  };

  try {
    return await callProxy(proxyPayload, signal);
  } catch (proxyErr) {
    if (proxyErr.name === "AbortError") throw proxyErr;
    console.warn("Proxy indisponível, tentando APIs diretas:", proxyErr.message);
  }

  const config = getAIConfig();

  if (config.deepseekKey) {
    try {
      return await callDeepSeekDirect(m, maxTokens, systemExtra);
    } catch (dsErr) {
      if (dsErr.name === "AbortError") throw dsErr;
      if (dsErr.message === "DEEPSEEK_KEY_MISSING") {}
      else console.warn("DeepSeek direto falhou:", dsErr.message);
    }
  }

  if (config.geminiKey) {
    try {
      return await callGeminiDirect(m, maxTokens, systemExtra);
    } catch (gmErr) {
      if (gmErr.name === "AbortError") throw gmErr;
      if (gmErr.message === "GEMINI_KEY_MISSING") {}
      else console.warn("Gemini direto falhou:", gmErr.message);
    }
  }

  throw new Error(
    "Nenhum provedor de IA disponível.\n\n" +
    "Em ambiente local: execute 'npm run server' para ativar o proxy.\n" +
    "No site publicado: configure uma chave de API nas Configurações.\n\n" +
    "Opções gratuitas:\n" +
    "- Gemini (Google): https://aistudio.google.com/apikey\n\n" +
    "Opções pagas (mais barato):\n" +
    "- DeepSeek: https://platform.deepseek.com/"
  );
}
