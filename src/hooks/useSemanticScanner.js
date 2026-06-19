import { useEffect, useRef, useCallback, useMemo } from "react";
import { scanQueixa } from "../data/medicalTerms";

export function useSemanticScanner(queixa, { setComorbid, setAntec }) {
  const overridesRef = useRef(new Set());

  const detected = useMemo(() => scanQueixa(queixa), [queixa]);

  useEffect(() => {
    if (!detected.comorbid.length && !detected.antec.length) return;

    setComorbid(prev => {
      const toAdd = detected.comorbid.filter(
        item => !prev.includes(item) && !overridesRef.current.has(item)
      );
      return toAdd.length ? [...prev, ...toAdd] : prev;
    });

    setAntec(prev => {
      const toAdd = detected.antec.filter(
        item => !prev.includes(item) && !overridesRef.current.has(item)
      );
      return toAdd.length ? [...prev, ...toAdd] : prev;
    });
  }, [detected, setComorbid, setAntec]);

  const trackOverride = useCallback((prev, next) => {
    const toggled = [...prev, ...next].filter(
      x => prev.includes(x) !== next.includes(x)
    );
    toggled.forEach(item => overridesRef.current.add(item));
  }, []);

  const createHandler = useCallback((setter) => {
    return (nextOrFn) => {
      setter(prev => {
        const next = typeof nextOrFn === "function" ? nextOrFn(prev) : nextOrFn;
        trackOverride(prev, next);
        return next;
      });
    };
  }, [trackOverride]);

  const handleComorbidChange = useMemo(
    () => createHandler(setComorbid),
    [createHandler, setComorbid]
  );

  const handleAntecChange = useMemo(
    () => createHandler(setAntec),
    [createHandler, setAntec]
  );

  const clearOverrides = useCallback(() => {
    overridesRef.current = new Set();
  }, []);

  return {
    handleComorbidChange,
    handleAntecChange,
    detected,
    clearOverrides,
  };
}
