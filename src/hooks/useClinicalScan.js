import { useMemo, useRef, useEffect, useCallback } from "react";
import { extractClinicalEntities, genDCSuggestion } from "../utils/clinicalDetection";

export function useClinicalScan(queixa) {
  const entities = useMemo(() => extractClinicalEntities(queixa), [queixa]);
  const dcSuggestion = useMemo(() => genDCSuggestion(entities), [entities]);

  return { entities, dcSuggestion };
}

export function useClinicalScanSync(queixa, {
  setLocalDor, setCaraterDor, setQueixaKey, setDCSuggestion,
}) {
  const { entities, dcSuggestion } = useClinicalScan(queixa);
  const lastRef = useRef("");

  const sync = useCallback(() => {
    if (!queixa || queixa === lastRef.current) return;
    lastRef.current = queixa;

    if (setLocalDor && entities.regions.length > 0) {
      setLocalDor(entities.regions);
    }
    if (setQueixaKey && entities.conditionKey) {
      setQueixaKey(entities.conditionKey);
    }
    if (setCaraterDor && entities.painChars.length > 0) {
      setCaraterDor(prev => {
        const toAdd = entities.painChars.filter(c => !prev.includes(c));
        return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
      });
    }
    if (setDCSuggestion && dcSuggestion) {
      setDCSuggestion(dcSuggestion);
    }
  }, [queixa, entities, dcSuggestion,
    setLocalDor, setCaraterDor, setQueixaKey, setDCSuggestion]);

  useEffect(() => {
    sync();
  }, [sync]);

  return { entities, dcSuggestion };
}
