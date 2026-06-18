export function generateCIF({
  evaMov,
  avds,
  localDor
}) {
  // localDor ainda não é usado (mantido para assinatura compatível)
  void localDor;
  const result = [];



  // Dor
  if (evaMov >= 7) {
    result.push({
      code: "b280",
      desc: "Sensação de dor",
      qualifier: 3
    });
  }
  else if (evaMov >= 4) {
    result.push({
      code: "b280",
      desc: "Sensação de dor",
      qualifier: 2
    });
  }

  // Marcha
  if (avds?.includes("Andar")) {
    result.push({
      code: "d450",
      desc: "Andar",
      qualifier: evaMov >= 7 ? 3 : 2
    });
  }

  // Escadas
  if (avds?.includes("Subir escadas")) {
    result.push({
      code: "d4551",
      desc: "Subir escadas",
      qualifier: 2
    });
  }

  // Trabalho
  if (avds?.includes("Trabalho manual")) {
    result.push({
      code: "d850",
      desc: "Trabalho remunerado",
      qualifier: 2
    });
  }

  return result;
}