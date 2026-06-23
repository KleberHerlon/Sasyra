import { PSE_CR10, calcInternalLoad, calcMonotony, deloadSuggestion } from "./pseFoster";

export { PSE_CR10, calcInternalLoad, calcMonotony, deloadSuggestion };

export function calcIMC(pesoKg, alturaCm) {
  if (!pesoKg || !alturaCm) return null;
  const h = alturaCm / 100;
  const imc = pesoKg / (h * h);
  let classificacao;
  if (imc < 18.5) classificacao = "Abaixo do peso";
  else if (imc < 25) classificacao = "Peso normal";
  else if (imc < 30) classificacao = "Sobrepeso";
  else if (imc < 35) classificacao = "Obesidade Grau I";
  else if (imc < 40) classificacao = "Obesidade Grau II";
  else classificacao = "Obesidade Grau III";
  return { imc: +imc.toFixed(1), classificacao };
}

const RCQ_TABLE = {
  Masculino: { baixo: 0.95, moderado: 1.0 },
  Feminino: { baixo: 0.80, moderado: 0.85 },
};

export function calcRCQ(cinturaCm, quadrilCm, sexo) {
  if (!cinturaCm || !quadrilCm) return null;
  const rcq = cinturaCm / quadrilCm;
  const ref = RCQ_TABLE[sexo] || RCQ_TABLE.Masculino;
  let risco;
  if (rcq <= ref.baixo) risco = "Baixo";
  else if (rcq <= ref.moderado) risco = "Moderado";
  else risco = "Alto";
  return { rcq: +rcq.toFixed(2), risco };
}

export function calcFCRegistro(fcRepouso, idade, sexo) {
  if (!fcRepouso || !idade) return null;
  const fcMax = sexo === "Feminino" ? 226 - idade : 220 - idade;
  const fcReserva = fcMax - fcRepouso;
  return {
    fcRepouso,
    fcMax,
    fcReserva,
    zonas: {
      moderado: { min: Math.round(fcReserva * 0.5 + fcRepouso), max: Math.round(fcReserva * 0.7 + fcRepouso), label: "Moderado (50-70% FCres)" },
      intenso: { min: Math.round(fcReserva * 0.7 + fcRepouso), max: Math.round(fcReserva * 0.85 + fcRepouso), label: "Intenso (70-85% FCres)" },
      maximo: { min: Math.round(fcReserva * 0.85 + fcRepouso), max: fcMax, label: "Máximo (85-100% FCres)" },
    },
  };
}

export const FC_ZONA_CORES = {
  moderado: "#4ADE80",
  intenso: "#FBBF24",
  maximo: "#F87171",
};
