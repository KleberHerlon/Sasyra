import { CifItem } from "@/types";

interface CifEngineInput {
  evaMov: number | null;
  evaRep?: number | null;
  avds: string[];
  localDor?: string[];
  gonio?: any[];
  tests?: Record<string, string>;
  yellowFlags: string[];
  tempoDor?: string;
}

export function generateCIF({
  evaMov,
  avds,
  localDor,
  gonio,
  tests,
  yellowFlags,
  tempoDor
}: CifEngineInput): CifItem[] {
  void localDor;
  void gonio;
  void tests;
  void tempoDor;
  
  const result: CifItem[] = [];
  const valEva = evaMov !== null ? Number(evaMov) : 0;

  if (valEva >= 7) {
    result.push({ code: "b280", desc: "Sensação de dor intensa", qualifier: 3 });
  } else if (valEva >= 4) {
    result.push({ code: "b280", desc: "Sensação de dor moderada", qualifier: 2 });
  } else if (valEva >= 1) {
    result.push({ code: "b280", desc: "Sensação de dor leve", qualifier: 1 });
  }

  if (avds?.includes("Andar")) {
    result.push({ code: "d450", desc: "Andar", qualifier: valEva >= 7 ? 3 : 2 });
  }
  if (avds?.includes("Subir escadas")) {
    result.push({ code: "d4551", desc: "Subir/descer escadas", qualifier: 2 });
  }
  if (avds?.includes("Trabalho manual")) {
    result.push({ code: "d850", desc: "Trabalho remunerado", qualifier: 2 });
  }
  if (avds?.includes("Dormir")) {
    result.push({ code: "d4702", desc: "Usar transporte privado / dormir", qualifier: 1 });
  }
  if (avds?.includes("Esporte")) {
    result.push({ code: "d920", desc: "Recreação e lazer", qualifier: 2 });
  }
  if (yellowFlags?.length >= 2) {
    result.push({ code: "b1265", desc: "Otimismo / fatores psicossociais", qualifier: 2 });
  }

  return result;
}
