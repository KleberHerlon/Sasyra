export async function runClinicalAnalysis(summary: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Você é fisioterapeuta ortopédico especialista em medicina baseada em evidências (PEDro, Cochrane, CPGs internacionais).
Com base nos dados clínicos abaixo, forneça análise estruturada e atualizada:

1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF — lista códigos com qualificadores)
2. OBJETIVOS TERAPÊUTICOS (curto ≤4 sem / médio 4–12 sem / longo prazo)
3. PLANO DE TRATAMENTO PADRÃO-OURO (cite ensaios RCT/meta-análise com autor, ano e nível de evidência)
4. FREQUÊNCIA, DURAÇÃO E Nº DE SESSÕES SUGERIDAS (baseado em evidência)
5. PROGRESSÃO DO TRATAMENTO (critérios de avanço de fase)
6. CRITÉRIOS DE ALTA FISIOTERAPÊUTICA
7. ESCALAS FUNCIONAIS RECOMENDADAS (para mensuração de desfecho)
8. ALERTAS, CONTRAINDICAÇÕES E QUANDO ENCAMINHAR (médico, psicólogo, nutricionista)
9. ESTIMATIVA DE PROGNÓSTICO (favorável / reservado — justifique com fatores de risco)

DADOS CLÍNICOS:
${summary}

Responda em português, tópicos claros e objetivos. Seja preciso, clínico e baseado em evidências. Quando citar estudos, informe: Autor (Ano) – Nível de evidência.`,
        },
      ],
    }),
  });
  const d = await res.json();
  return d.content?.map((c: any) => c.text || "").join("\n") || "Sem resposta.";
}
