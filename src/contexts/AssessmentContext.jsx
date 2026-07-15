import { createContext, useContext, useState, useCallback } from "react";

const AssessmentContext = createContext(null);

export function AssessmentProvider({ patient, onUpdate, children }) {
  const [pt, setPt] = useState(patient || {
    nome: "", dataNasc: "", sexo: "", lateralidade: "", estadoCivil: "",
    profissao: "", convenio: "", sessoesAuth: "", telefone: "",
    peso: "", altura: "", data: new Date().toISOString().slice(0, 10),
  });

  const up = useCallback((k, v) => {
    setPt(p => ({ ...p, [k]: v }));
    onUpdate?.(k, v);
  }, [onUpdate]);

  const [expandedSections, setExpandedSections] = useState([]);
  const toggleSection = useCallback((key) => setExpandedSections(p =>
    p.includes(key) ? p.filter(x => x !== key) : [...p, key]
  ), []);

  const [activeTab, setActiveTab] = useState("avaliacao");

  const value = {
    pt, up, expandedSections, toggleSection, activeTab, setActiveTab,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}

export default AssessmentContext;
