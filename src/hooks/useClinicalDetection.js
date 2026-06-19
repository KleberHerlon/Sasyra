import { useMemo } from "react";
import { detectKB, detectLocalDor } from "../utils/clinicalDetection";

export function useClinicalDetection(queixa) {
  const queixaKey = useMemo(() => detectKB(queixa), [queixa]);
  const localDor = useMemo(() => detectLocalDor(queixa), [queixa]);
  return { queixaKey, localDor };
}
