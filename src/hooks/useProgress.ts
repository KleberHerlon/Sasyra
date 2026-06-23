import { Patient, GonioRow, KbEntry } from "@/types";

export interface ProgressStep {
  key: string;
  label: string;
  done: boolean;
}

export function useProgress(
  patient: Patient,
  queixa: string,
  evaMov: number | null | string,
  gonio: GonioRow[],
  testResults: Record<string, string>,
  kb: KbEntry | undefined
) {
  const isMeaningfulGonioRow = (g: GonioRow) => {
    const v = g?.value;
    const num = v === "" || v === null || v === undefined ? NaN : Number(v);
    return Boolean(g?.joint && g?.movement) && Number.isFinite(num) && num > 0;
  };

  const steps: ProgressStep[] = [
    {
      key: "ident",
      label: "Identificação",
      done: !!(patient.nome && patient.dataNasc && patient.sexo),
    },
    {
      key: "queixa",
      label: "Queixa",
      done: queixa.length > 5,
    },
    {
      key: "dor",
      label: "EVA",
      done: evaMov !== null && evaMov !== undefined && evaMov !== "",
    },
    {
      key: "fisico",
      label: "Exame físico",
      done: !!(patient.peso && patient.altura),
    },
    {
      key: "gonio",
      label: "Goniometria",
      done: gonio?.some(isMeaningfulGonioRow),
    },
    {
      key: "testes",
      label: "Testes",
      done: kb
        ? Object.values(testResults || {}).some(
            (v) => v && v !== "Não realizado"
          )
        : false,
    },
  ];

  const pct = Math.round((steps.filter((s) => s.done).length / steps.length) * 100);

  return { steps, pct };
}
export default useProgress;
