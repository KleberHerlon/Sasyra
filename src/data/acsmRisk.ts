// @ts-nocheck
const RISK_FACTORS = {
  idade: { masculino: 45, feminino: 55 },
  hf_cardiaca: true,
  tabagismo: true,
  sedentarismo: true,
  obesidade: true,
  hipertensao: true,
  dislipidemia: true,
  diabetes: true,
  sintomas_cardiacos: true,
};

export function acsmRiskStrata(detectedRiscos, sexo, idade) {
  if (!detectedRiscos || detectedRiscos.length === 0) {
    return {
      estagio: 1,
      label: "Baixo Risco",
      cor: "#4ADE80",
      descricao: "Assintomático e sem fatores de risco. Liberação total para treino.",
      recomendacao: "Teste máximo liberado sem supervisão médica. Prescrição conforme objetivo.",
    };
  }

  const sintomasCardiacos = detectedRiscos.includes("sintomas_cardiacos");
  const doencaConhecida = detectedRiscos.includes("diabetes") && (
    detectedRiscos.includes("hipertensao") || detectedRiscos.includes("obesidade")
  );
  const limitesIdade = RISK_FACTORS.idade;
  const idadeRisco = sexo === "Masculino"
    ? idade >= limitesIdade.masculino
    : idade >= limitesIdade.feminino;
  const fatorCount = detectedRiscos.filter(r => r !== "sintomas_cardiacos").length;
  const idadeFator = idadeRisco ? 1 : 0;
  const totalFatores = fatorCount + idadeFator;

  if (sintomasCardiacos || doencaConhecida) {
    return {
      estagio: 3,
      label: "Alto Risco",
      cor: "#F87171",
      descricao: "Sinais/sintomas cardiovasculares, pulmonares ou metabólicos conhecidos.",
      recomendacao: "Exigir liberação médica antes de qualquer teste ou prescrição. Prescrição apenas submáxima (< 60% VO₂R ou FC reserva). Preferir exercícios leves a moderados (RPE < 5).",
      fatoresIdentificados: detectedRiscos,
      totalFatores,
    };
  }

  if (totalFatores >= 2) {
    return {
      estagio: 2,
      label: "Risco Moderado",
      cor: "#FBBF24",
      descricao: `${totalFatores} fatores de risco presentes${idadeRisco ? " (incluindo idade)" : ""}.`,
      recomendacao: "Recomendar avaliação médica pré-participação. Teste máximo apenas com supervisão. Iniciar com intensidade moderada (40-60% FC reserva) e progredir gradualmente.",
      fatoresIdentificados: detectedRiscos,
      totalFatores,
    };
  }

  return {
    estagio: 1,
    label: "Baixo Risco",
    cor: "#4ADE80",
    descricao: `${totalFatores} fator(es) de risco. Assintomático.`,
    recomendacao: "Teste máximo liberado. Prescrição conforme objetivo e nível do aluno.",
    fatoresIdentificados: detectedRiscos,
    totalFatores,
  };
}

export const RISK_FACTOR_LABELS = {
  idade: "Idade avançada",
  hf_cardiaca: "Histórico familiar de doença cardíaca",
  tabagismo: "Tabagismo",
  sedentarismo: "Sedentarismo",
  obesidade: "Obesidade (IMC ≥ 30)",
  hipertensao: "Hipertensão Arterial Sistêmica",
  dislipidemia: "Dislipidemia",
  diabetes: "Diabetes Mellitus",
  sintomas_cardiacos: "Sinais/Sintomas cardiovasculares",
};
