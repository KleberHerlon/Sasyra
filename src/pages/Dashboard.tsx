import { useState, useEffect } from "react";
import { User, Patient, GonioRow, LogEntry } from "@/types";
import { COLORS, FONTS, microStyles } from "@/styles/theme";

// Components
import LogoSVG from "@/components/LogoSVG";
import LoginScreen, { PROF_LABELS } from "@/components/LoginScreen";
import PatientList from "@/pages/PatientList";
import { Section, Row, Field, SubHeading } from "@/components/Layout";
import NumericDrum from "@/components/NumericDrum";
import EvaSlider from "@/components/EvaSlider";
import { TagSelect, SingleSelect } from "@/components/TagSelect";
import SessionCounter from "@/components/SessionCounter";
import AudioField from "@/components/AudioField";
import MRCSelect from "@/components/MRCSelect";
import GonioRowComponent from "@/components/GonioRow";
import TestCard from "@/components/TestCard";
import PedroCard from "@/components/PedroCard";
import HonorariosCard, { CREFITO_REGIOES } from "@/components/HonorariosCard";

// Screens (Modules)
import Pediatria from "@/screens/Pediatria";
import CrossFit from "@/screens/CrossFit";
import Neuro from "@/screens/Neuro";
import PhysicalEducation from "@/screens/PhysicalEducation";
import Nutrition from "@/screens/Nutrition";
import OccupationalTherapy from "@/screens/OccupationalTherapy";
import Agenda from "@/screens/Agenda";
import Financeiro from "@/screens/Financeiro";
import Plans from "@/screens/Plans";
import SubscriptionSettings from "@/screens/SubscriptionSettings";
import Integrations from "@/screens/Integrations";
import PerformanceDashboard from "@/screens/PerformanceDashboard";
import ModuleSelector from "@/components/ModuleSelector";

// Hooks & Services & Utils & Data
import useProgress from "@/hooks/useProgress";
import { useSupabasePatients, useSupabaseAssessments, useSupabaseLogs } from "@/hooks/useSupabaseData";
import { useSubscription } from "@/hooks/useSubscription";
import { useIntegrations } from "@/hooks/useIntegrations";
import { calcIMC } from "@/utils/imc";
import { getRef, isOutOfRange } from "@/utils/gonio";
import { generateCIF } from "@/data/cifEngine";
import { CIF } from "@/data/cif";
import { EVIDENCE, KB, detectKB } from "@/data/evidence";
import { runClinicalAnalysis } from "@/services/aiService";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [patientView, setPatientView] = useState(true);
  const [tab, setTab] = useState("avaliacao");
  const [regiao, setRegiao] = useState("Centro-Oeste");
  
  const [theme, setTheme] = useState(() => localStorage.getItem("sasyra_theme") || "dark");
  const [appView, setAppView] = useState("patients");
  const [module, setModule] = useState<string | null>(() => {
    const saved = localStorage.getItem("sasyra_module");
    return (saved === "fisioterapia" || saved === "educacaoFisica" || saved === "terapiaOcupacional" || saved === "nutricao" || saved === "pediatria" || saved === "crossfit" || saved === "neuro") ? saved : null;
  });

  // Sync Theme dataset
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("sasyra_theme", theme);
  }, [theme]);

  const userId = user?.nome || "";

  // Data Hooks
  const patientsResult = useSupabasePatients(userId) as any;
  const patients = patientsResult.patients;
  const addPatient = patientsResult.addPatient;
  const updatePatientById = patientsResult.updatePatient;
  const deletePatientHook = patientsResult.deletePatient;

  const assessmentsResult = useSupabaseAssessments(userId) as any;
  const assessmentHistory = assessmentsResult.assessments;
  const saveAssessmentHook = assessmentsResult.addAssessment;
  const deleteAssessmentHook = assessmentsResult.deleteAssessment;

  const logsResult = useSupabaseLogs(userId) as any;
  const sessionLogs = logsResult.logs;
  const saveLogHook = logsResult.addLog;
  const deleteLogHook = logsResult.deleteLog;

  // Subscription & Integrations
  const subscriptionResult = useSubscription() as any;
  const plan = subscriptionResult.plan;
  const planLabel = subscriptionResult.label;
  const { googleCalendar, whatsApp } = useIntegrations() as any;

  // Patient State
  const [patient, setPatient] = useState<Patient>({
    id: 0,
    nome: "",
    dataNasc: "",
    sexo: "",
    profissao: "",
    convenio: "",
    telefone: "",
    peso: "",
    altura: "",
    lateralidade: "",
    estadoCivil: "",
    sessoesAuth: "",
    data: new Date().toISOString().slice(0, 10),
  });

  const updatePatientField = (k: keyof Patient, v: any) => setPatient((p) => ({ ...p, [k]: v }));

  const changeModule = () => {
    localStorage.removeItem("sasyra_module");
    setModule(null);
    setPatientView(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("sasyra_module");
    setUser(null);
    setModule(null);
    setPatientView(true);
    setAppView("patients");
  };

  const deletePatient = (p: Patient) => {
    const pid = p.id || p.nome;
    deletePatientHook(pid);
    const patientAssessments = assessmentHistory.filter((a: any) => a.patientId === pid);
    patientAssessments.forEach((a: any) => deleteAssessmentHook(a.id));
    const patientLogs = sessionLogs.filter((l: any) => l.patientId === pid);
    patientLogs.forEach((l: any) => deleteLogHook(l.id));
  };

  const navigateToPatientFromAgenda = (p: Patient, targetTab?: string) => {
    setPatient(prev => ({ ...prev, ...p }));
    setPatientView(false);
    setTab(targetTab || "avaliacao");
    setAppView("patients");
  };

  const selectPatient = (p: Patient) => {
    if (queixa || hda || localDor.length > 0) saveAssessment();
    setPatient((prev) => ({ ...prev, ...p }));
    const pid = p.id || p.nome;
    const patientAssessments = assessmentHistory.filter((a: any) => a.patientId === pid);
    if (patientAssessments.length > 0) {
      const sorted = [...patientAssessments].sort((a, b) => (b.id || 0) - (a.id || 0));
      loadAssessment(sorted[0]);
    } else {
      resetAssessment();
    }
    setPatientView(false);
  };

  // Anamnese State
  const [queixa, setQueixa] = useState("");
  const [queixaKey, setQueixaKey] = useState("");
  const [localDor, setLocalDor] = useState<string[]>([]);
  const [caraterDor, setCaraterDor] = useState<string[]>([]);
  const [tempoDor, setTempoDor] = useState("");
  const [melhora, setMelhora] = useState<string[]>([]);
  const [piora, setPiora] = useState<string[]>([]);
  const [hda, setHda] = useState("");
  const [comorbid, setComorbid] = useState<string[]>([]);
  const [antec, setAntec] = useState<string[]>([]);
  const [meds, setMeds] = useState("");
  const [yellowFlagsState, setYellowFlagsState] = useState<string[]>([]);

  // Funcional State
  const [evaMov, setEvaMov] = useState<number | null>(null);
  const [evaRep, setEvaRep] = useState<number | null>(null);
  const [avds, setAvds] = useState<string[]>([]);
  const [objTrat, setObjTrat] = useState<string[]>([]);
  const [nivelAti, setNivelAti] = useState("");

  // Físico State
  const [postura, setPostura] = useState<string[]>([]);
  const [marcha, setMarcha] = useState("");
  const [edema, setEdema] = useState("");
  const [palpacao, setPalpacao] = useState("");
  const [sensib, setSensib] = useState("");
  const [reflexos, setReflexos] = useState("");
  const [forca, setForca] = useState<Record<string, string>>({
    quadricepsD: "",
    quadricepsE: "",
    isquiotibialD: "",
    isquiotibialE: "",
    gluteoD: "",
    gluteoE: "",
    manguitoD: "",
    manguitoE: "",
    tibialAnterior: "",
    gastrocnemio: "",
    bicepsD: "",
    bicepsE: "",
  });

  // Goniometria State
  const [gonio, setGonio] = useState<GonioRow[]>([{ id: 1, joint: "", movement: "", value: "" }]);

  const addG = () => {
    setGonio((g) => [...g, { id: Date.now(), joint: "", movement: "", value: "" }]);
  };

  const updG = (id: number, row: GonioRow) => {
    setGonio((g) => g.map((r) => (r.id === id ? row : r)));
  };

  const remG = (id: number) => {
    setGonio((g) => g.filter((r) => r.id !== id));
  };

  // Testes State
  const [tests, setTests] = useState<Record<string, string>>({});

  // Obs / IA State
  const [obs, setObs] = useState("");
  const [aiLoad, setAiLoad] = useState(false);
  const [aiRes, setAiRes] = useState("");

  // Diário State
  const [newLogEntry, setNewLogEntry] = useState<LogEntry>({
    id: 0,
    data: new Date().toISOString().slice(0, 10),
    eva: 5,
    procedimentos: [],
    resposta: "",
    evolucao: "",
    metas: "",
    escalas: "",
  });

  const saveAssessment = () => {
    if (!patient.id && !patient.nome) return;
    const pid = patient.id || patient.nome;
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      patientId: pid,
      queixa,
      queixaKey,
      localDor,
      caraterDor,
      tempoDor,
      melhora,
      piora,
      hda,
      comorbid,
      antec,
      meds,
      yellowFlagsState,
      evaMov,
      evaRep,
      avds,
      objTrat,
      nivelAti,
      postura,
      marcha,
      edema,
      palpacao,
      sensib,
      reflexos,
      forca,
      gonio,
      tests,
      obs,
      regiao,
    };
    saveAssessmentHook(entry);
  };

  const loadAssessment = (a: any) => {
    setQueixa(a.queixa || "");
    setQueixaKey(a.queixaKey || "");
    setLocalDor(a.localDor || []);
    setCaraterDor(a.caraterDor || []);
    setTempoDor(a.tempoDor || "");
    setMelhora(a.melhora || []);
    setPiora(a.piora || []);
    setHda(a.hda || "");
    setComorbid(a.comorbid || []);
    setAntec(a.antec || []);
    setMeds(a.meds || "");
    setYellowFlagsState(a.yellowFlagsState || []);
    setEvaMov(a.evaMov ?? null);
    setEvaRep(a.evaRep ?? null);
    setAvds(a.avds || []);
    setObjTrat(a.objTrat || []);
    setNivelAti(a.nivelAti || "");
    setPostura(a.postura || []);
    setMarcha(a.marcha || "");
    setEdema(a.edema || "");
    setPalpacao(a.palpacao || "");
    setSensib(a.sensib || "");
    setReflexos(a.reflexos || "");
    setForca(a.forca || {
      quadricepsD: "",
      quadricepsE: "",
      isquiotibialD: "",
      isquiotibialE: "",
      gluteoD: "",
      gluteoE: "",
      manguitoD: "",
      manguitoE: "",
      tibialAnterior: "",
      gastrocnemio: "",
      bicepsD: "",
      bicepsE: "",
    });
    setGonio(a.gonio || [{ id: 1, joint: "", movement: "", value: "" }]);
    setTests(a.tests || {});
    setObs(a.obs || "");
    setRegiao(a.regiao || "Centro-Oeste");
  };

  const resetAssessment = () => {
    setQueixa("");
    setQueixaKey("");
    setLocalDor([]);
    setCaraterDor([]);
    setTempoDor("");
    setMelhora([]);
    setPiora([]);
    setHda("");
    setComorbid([]);
    setAntec([]);
    setMeds("");
    setYellowFlagsState([]);
    setEvaMov(null);
    setEvaRep(null);
    setAvds([]);
    setObjTrat([]);
    setNivelAti("");
    setPostura([]);
    setMarcha("");
    setEdema("");
    setPalpacao("");
    setSensib("");
    setReflexos("");
    setForca({
      quadricepsD: "",
      quadricepsE: "",
      isquiotibialD: "",
      isquiotibialE: "",
      gluteoD: "",
      gluteoE: "",
      manguitoD: "",
      manguitoE: "",
      tibialAnterior: "",
      gastrocnemio: "",
      bicepsD: "",
      bicepsE: "",
    });
    setGonio([{ id: 1, joint: "", movement: "", value: "" }]);
    setTests({});
    setObs("");
    setRegiao("Centro-Oeste");
  };

  const kb = KB[queixaKey];
  const evidence = EVIDENCE[queixaKey];
  const cifSuggestions = evidence?.cif || [];
  const autoCIF = generateCIF({
    evaMov,
    evaRep,
    avds,
    localDor,
    gonio,
    tests,
    yellowFlags: yellowFlagsState,
    tempoDor,
  });
  const imc = calcIMC(patient.peso, patient.altura);

  const isEvaValid = evaMov !== null && evaMov !== undefined;
  const hasFilledTests =
    kb &&
    Object.keys(tests || {}).length > 0 &&
    Object.values(tests).some(
      (v) => v !== "" && v !== undefined && v !== null && v !== "Não realizado"
    );
  
  const { steps: progSteps, pct: progPct } = useProgress(
    patient,
    queixa,
    isEvaValid ? evaMov : null,
    gonio,
    hasFilledTests ? tests : {},
    kb
  );

  // AI Call
  const runAI = async () => {
    setAiLoad(true);
    setAiRes("");
    try {
      const summary = [
        `Paciente: ${patient.nome}, ${patient.sexo}, nasc. ${patient.dataNasc}, profissão: ${patient.profissao}`,
        `IMC: ${imc?.value || "—"} (${imc?.l || "—"}), Peso: ${patient.peso}kg, Altura: ${patient.altura}cm`,
        `Queixa: ${queixa}`,
        `Local: ${localDor.join(", ")} | Caráter: ${caraterDor.join(", ")} | Tempo: ${tempoDor}`,
        `Melhora: ${melhora.join(", ")} | Piora: ${piora.join(", ")}`,
        `HDA: ${hda}`,
        `EVA mov: ${evaMov}/10 | EVA rep: ${evaRep}/10`,
        `Nível atividade: ${nivelAti} | AVDs comprometidas: ${avds.join(", ")}`,
        `Postura: ${postura.join(", ")} | Marcha: ${marcha}`,
        `Edema: ${edema} | Sensibilidade: ${sensib} | Reflexos: ${reflexos}`,
        `Força: ${Object.entries(forca)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}:${v}`)
          .join(", ")}`,
        `Goniometria: ${gonio
          .filter((g) => g.value)
          .map((g) => `${g.joint} ${g.movement}:${g.value}°`)
          .join("; ")}`,
        `Testes: ${Object.entries(tests)
          .filter(([, v]) => v && v !== "Não realizado")
          .map(([k, v]) => `${k}:${v}`)
          .join("; ")}`,
        `Comorbidades: ${comorbid.join(", ")} | Antecedentes: ${antec.join(", ")} | Medicamentos: ${meds}`,
        `Yellow flags: ${yellowFlagsState.join(", ")}`,
        `CIF auto: ${autoCIF.map((c) => `${c.code}(${c.qualifier})`).join(", ")}`,
        `Observações: ${obs}`,
      ].join("\n");

      const result = await runClinicalAnalysis(summary);
      setAiRes(result);
    } catch {
      setAiRes("Erro ao consultar IA. Verifique a conexão.");
    }
    setAiLoad(false);
  };

  const addLog = () => {
    if (!patient.id && !patient.nome) return;
    const pid = patient.id || patient.nome;
    const logEntry = {
      ...newLogEntry,
      id: Date.now(),
      patientId: pid,
      sessaoNum: currentLogs.length + 1,
    };
    saveLogHook(logEntry);
    setNewLogEntry({
      id: 0,
      data: new Date().toISOString().slice(0, 10),
      eva: 5,
      procedimentos: [],
      resposta: "",
      evolucao: "",
      metas: "",
      escalas: "",
    });
  };

  const currentLogs = sessionLogs.filter((l: any) => l.patientId === (patient.id || patient.nome));

  // Render Flows
  if (!user) return <LoginScreen onLogin={(userObj) => {
    setUser(userObj);
    let m: string | null = null;
    if (userObj.prof === "fisio") m = "fisioterapia";
    else if (userObj.prof === "to") m = "terapiaOcupacional";
    else if (userObj.prof === "educFisico") m = "educacaoFisica";
    else if (userObj.prof === "nutricionista") m = "nutricao";
    else if (userObj.prof === "pediatria") m = "pediatria";
    else if (userObj.prof === "crossfit") m = "crossfit";
    else if (userObj.prof === "neurofuncional") m = "neuro";
    else m = "em_desenvolvimento";
    localStorage.setItem("sasyra_module", m);
    setModule(m);
    setPatientView(m === "fisioterapia");
  }} />;

  if (!module) return (
    <ModuleSelector
      user={user}
      onSelect={(m) => {
        setModule(m);
        setPatientView(m === "fisioterapia");
        localStorage.setItem("sasyra_module", m);
      }}
      onLogout={handleLogout}
    />
  );

  if (module === "educacaoFisica") return (
    <PhysicalEducation
      students={patients}
      student={patient}
      onSelectStudent={selectPatient}
      onAddStudent={addPatient}
      onUpdateStudent={updatePatientField}
      onDeleteStudent={deletePatient}
      onUpdateStudentById={updatePatientById}
    />
  );

  if (module === "terapiaOcupacional") return (
    <OccupationalTherapy
      students={patients}
      student={patient}
      onSelectStudent={selectPatient}
      onAddStudent={addPatient}
      onUpdateStudent={updatePatientField}
      onDeleteStudent={deletePatient}
      onUpdateStudentById={updatePatientById}
    />
  );

  if (module === "nutricao") return (
    <Nutrition
      students={patients}
      student={patient}
      onSelectStudent={selectPatient}
      onAddStudent={addPatient}
      onUpdateStudent={updatePatientField}
      onDeleteStudent={deletePatient}
      onUpdateStudentById={updatePatientById}
    />
  );

  if (module === "pediatria") return (
    <Pediatria
      students={patients}
      student={patient}
      onSelectStudent={selectPatient}
      onAddStudent={addPatient}
      onUpdateStudent={updatePatientField}
      onDeleteStudent={deletePatient}
      onUpdateStudentById={updatePatientById}
    />
  );

  if (module === "crossfit") return (
    <CrossFit
      students={patients}
      student={patient}
      onSelectStudent={selectPatient}
      onAddStudent={addPatient}
      onUpdateStudent={updatePatientField}
      onDeleteStudent={deletePatient}
      onUpdateStudentById={updatePatientById}
    />
  );

  if (module === "neuro") return (
    <Neuro
      students={patients}
      student={patient}
      onSelectStudent={selectPatient}
      onAddStudent={addPatient}
      onUpdateStudent={updatePatientField}
      onDeleteStudent={deletePatient}
      onUpdateStudentById={updatePatientById}
    />
  );

  if (module === "em_desenvolvimento") return (
    <div style={{ background: `radial-gradient(ellipse at 50% 0%, ${COLORS.card} 0%, ${COLORS.bg} 70%)`, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONTS, padding: 24 }}>
      <div style={{ maxWidth: 460, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🚧</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, margin: 0, marginBottom: 8 }}>Módulo em Desenvolvimento</h2>
        <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          O módulo para <strong>{PROF_LABELS[user.prof] || user.prof}</strong> está em fase de desenvolvimento.
          Em breve você terá acesso a ferramentas específicas para sua prática clínica.
        </p>
        <button onClick={handleLogout} style={microStyles.ghostBtn({ padding: "10px 24px", fontSize: 13 })}>
          Sair
        </button>
      </div>
    </div>
  );

  // Secondary views
  if (appView === "agenda") return (
    <Agenda patients={patients} onNavigateToPatient={navigateToPatientFromAgenda} onNavigate={(v: any) => setAppView(v)} />
  );
  if (appView === "financeiro") return (
    <Financeiro onNavigateToPatient={navigateToPatientFromAgenda} onNavigate={(v: any) => setAppView(v)} />
  );
  if (appView === "plans") return <Plans onNavigate={(v: any) => v === "back" ? setAppView("patients") : setAppView(v)} />;
  if (appView === "subscription") return <SubscriptionSettings onNavigate={(v: any) => v === "back" ? setAppView("patients") : setAppView(v)} />;
  if (appView === "integrations") return <Integrations onNavigate={(v: any) => v === "back" ? setAppView("patients") : setAppView(v)} />;

  if (patientView) {
    return (
      <PatientList
        patients={patients}
        onSelect={selectPatient}
        onAdd={addPatient}
        onLogout={handleLogout}
        user={user}
        onAgenda={() => setAppView("agenda")}
        onViewChange={(v: any) => setAppView(v)}
        onChangeModule={changeModule}
        onDelete={deletePatient}
        plan={plan}
      />
    );
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: FONTS, color: COLORS.text }}>
      {/* Header */}
      <div
        style={{
          background: COLORS.surface,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <LogoSVG />
          <button
            onClick={() => {
              saveAssessment();
              setPatientView(true);
            }}
            style={microStyles.ghostBtn({ padding: "5px 10px", fontSize: 11 })}
            title="Trocar paciente"
            type="button"
          >
            👥 Pacientes
          </button>
          <button onClick={changeModule} style={microStyles.ghostBtn({ padding: "5px 10px", fontSize: 11 })} type="button" title="Trocar módulo de atendimento">
            🔄 Módulos
          </button>
          <button onClick={() => setAppView("agenda")} style={microStyles.ghostBtn({ padding: "5px 10px", fontSize: 11 })} type="button">
            📅 Agenda
          </button>
          <button onClick={() => setAppView("financeiro")} style={microStyles.ghostBtn({ padding: "5px 10px", fontSize: 11 })} type="button">
            💰 Financeiro
          </button>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            ["avaliacao", "📋", "Avaliação"],
            ["diario", "📅", "Diário"],
            ["relatorio", "📊", "Relatório"],
            ["evidencias", "🔬", "Evidências"],
          ].map(([k, ic, lb]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              type="button"
              style={{
                background: tab === k ? COLORS.greenBg : "transparent",
                border: `1px solid ${tab === k ? COLORS.green + "50" : "transparent"}`,
                borderRadius: 8,
                padding: "7px 16px",
                fontSize: 13,
                fontWeight: tab === k ? 700 : 400,
                color: tab === k ? COLORS.green : COLORS.textMuted,
                cursor: "pointer",
                fontFamily: FONTS,
              }}
            >
              {ic} {lb}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => setAppView("subscription")}
            style={{
              background: plan === "start" ? `${COLORS.amber}15` : "transparent",
              border: `1px solid ${plan === "start" ? COLORS.amber + "50" : COLORS.border}`,
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 700,
              color: plan === "start" ? COLORS.amber : COLORS.green,
              cursor: "pointer",
              fontFamily: FONTS,
              whiteSpace: "nowrap"
            }}
            type="button"
          >
            {plan === "start" ? "⭐ Start" : `⭐ ${planLabel}`}
          </button>
          {patient.nome && (
            <>
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: COLORS.greenBg,
                  border: `1px solid ${COLORS.green}40`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: COLORS.green,
                }}
              >
                {patient.nome[0]?.toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: COLORS.textSub,
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {patient.nome}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "8px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 4, flex: 1 }}>
            {progSteps.map((s) => (
              <div key={s.key} style={{ flex: 1 }}>
                <div
                  style={{
                    height: 3,
                    background: s.done ? COLORS.green : COLORS.border,
                    borderRadius: 99,
                    transition: "background 0.2s",
                  }}
                />
                <div
                  style={{
                    fontSize: 9,
                    color: s.done ? COLORS.green : COLORS.textDim,
                    marginTop: 3,
                    textAlign: "center",
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: progPct === 100 ? COLORS.green : COLORS.textMuted,
              minWidth: 36,
              textAlign: "right",
            }}
          >
            {progPct}%
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
        {/* ══════════════ AVALIAÇÃO ══════════════════════════════════════════ */}
        {tab === "avaliacao" && (
          <>
            {/* Identificação */}
            <Section title="Identificação do Paciente" icon="👤">
              <Row cols="1fr 1fr 1fr">
                <Field l="Nome completo" span={2}>
                  <input
                    value={patient.nome}
                    onChange={(e) => updatePatientField("nome", e.target.value)}
                    style={microStyles.inp()}
                    placeholder="Nome completo do paciente"
                  />
                </Field>
                <Field l="Data da avaliação">
                  <input
                    type="date"
                    value={patient.data}
                    onChange={(e) => updatePatientField("data", e.target.value)}
                    style={microStyles.inp()}
                  />
                </Field>
              </Row>
              <Row cols="1fr 1fr 1fr">
                <Field l="Data de nascimento">
                  <input
                    type="date"
                    value={patient.dataNasc}
                    onChange={(e) => updatePatientField("dataNasc", e.target.value)}
                    style={microStyles.inp()}
                  />
                </Field>
                <Field l="Sexo">
                  <SingleSelect
                    options={["Masculino", "Feminino", "Outro"]}
                    value={patient.sexo}
                    onChange={(v) => updatePatientField("sexo", v)}
                  />
                </Field>
                <Field l="Lateralidade">
                  <SingleSelect
                    options={["Destro", "Canhoto", "Ambidestro"]}
                    value={patient.lateralidade || ""}
                    onChange={(v) => updatePatientField("lateralidade", v)}
                  />
                </Field>
              </Row>
              <Row cols="1fr 1fr 1fr">
                <Field l="Estado civil">
                  <select
                    value={patient.estadoCivil || ""}
                    onChange={(e) => updatePatientField("estadoCivil", e.target.value)}
                    style={microStyles.sel()}
                  >
                    <option value="">Selecionar…</option>
                    {["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União estável"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field l="Profissão">
                  <input
                    value={patient.profissao}
                    onChange={(e) => updatePatientField("profissao", e.target.value)}
                    style={microStyles.inp()}
                    placeholder="Ocupação atual"
                  />
                </Field>
                <Field l="Telefone">
                  <input
                    value={patient.telefone || ""}
                    onChange={(e) => updatePatientField("telefone", e.target.value)}
                    style={microStyles.inp()}
                    placeholder="(00) 00000-0000"
                  />
                </Field>
              </Row>

              <SubHeading>Dados administrativos e financeiros</SubHeading>
              <Row cols="1fr 1fr 1fr">
                <Field l="Convênio / Particular">
                  <select
                    value={patient.convenio}
                    onChange={(e) => updatePatientField("convenio", e.target.value)}
                    style={microStyles.sel()}
                  >
                    <option value="">Selecionar…</option>
                    {[
                      "Particular",
                      "Unimed",
                      "Bradesco Saúde",
                      "Amil",
                      "SulAmérica",
                      "Hapvida",
                      "NotreDame",
                      "IPSEMG",
                      "SUS / NASF",
                      "Outro",
                    ].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
                <div>
                  <SessionCounter value={patient.sessoesAuth} onChange={(v) => updatePatientField("sessoesAuth", v)} />
                </div>
                {patient.convenio === "Particular" && (
                  <Field l="Região CREFITO">
                    <select
                      value={regiao}
                      onChange={(e) => setRegiao(e.target.value)}
                      style={microStyles.sel()}
                    >
                      {Object.keys(CREFITO_REGIOES).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </Row>
              <HonorariosCard convenio={patient.convenio} regiao={regiao} sessoesAuth={patient.sessoesAuth} />

              <SubHeading>Antropometria</SubHeading>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <NumericDrum
                  label="Peso"
                  value={patient.peso || ""}
                  onChange={(v) => updatePatientField("peso", String(v))}
                  min={30}
                  max={250}
                  step={0.5}
                  unit="kg"
                />
                <NumericDrum
                  label="Altura"
                  value={patient.altura || ""}
                  onChange={(v) => updatePatientField("altura", String(v))}
                  min={100}
                  max={220}
                  step={1}
                  unit="cm"
                />
                <div>
                  <span style={microStyles.lbl()}>IMC calculado</span>
                  <div
                    style={{
                      background: COLORS.surface,
                      border: `1px solid ${imc ? imc.c + "50" : COLORS.border}`,
                      borderRadius: 10,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {imc ? (
                      <>
                        <span style={{ fontSize: 22, fontWeight: 900, color: imc.c }}>{imc.value}</span>
                        <span style={{ fontSize: 11, color: imc.c, fontWeight: 700 }}>{imc.l}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 12, color: COLORS.textDim }}>Preencha peso e altura</span>
                    )}
                  </div>
                </div>
              </div>
            </Section>

            {/* Queixa e Anamnese */}
            <Section title="Queixa Principal e Anamnese" icon="📝">
              <Field l="Queixa principal — digite ou use o microfone">
                <AudioField
                  value={queixa}
                  onChange={(v) => {
                    const t = typeof v === "function" ? v(queixa) : v;
                    setQueixa(t);
                    setQueixaKey(detectKB(t));
                  }}
                  placeholder="Ex: Lombalgia com irradiação para MMII há 3 semanas após queda…"
                  rows={2}
                />
              </Field>

              {kb && (
                <div
                  style={{
                    background: COLORS.greenBg,
                    border: `1px solid ${COLORS.green}40`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    margin: "12px 0",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.green, marginBottom: 10 }}>
                    ✓ Condição identificada: <strong>{kb.label}</strong> — protocolos carregados
                    automaticamente
                  </div>

                  {cifSuggestions.length > 0 && (
                    <div style={{ background: COLORS.card, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: COLORS.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 8,
                        }}
                      >
                        CIF sugeridos pela condição
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {cifSuggestions.map((code) => (
                          <span
                            key={code}
                            style={{
                              fontSize: 11,
                              color: COLORS.blue,
                              background: COLORS.blueBg,
                              border: `1px solid ${COLORS.blue}30`,
                              borderRadius: 6,
                              padding: "3px 10px",
                            }}
                          >
                            <strong>{code}</strong> — {CIF[code]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {autoCIF.length > 0 && (
                    <div style={{ background: COLORS.surface, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: COLORS.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 8,
                        }}
                      >
                        CIF identificados automaticamente (baseados nos dados preenchidos)
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {autoCIF.map((item) => (
                          <span
                            key={`${item.code}-${item.qualifier}`}
                            style={{
                              fontSize: 11,
                              color: COLORS.purple,
                              background: COLORS.purpleBg,
                              border: `1px solid ${COLORS.purple}30`,
                              borderRadius: 6,
                              padding: "3px 10px",
                            }}
                          >
                            <strong>{item.code}</strong> — {item.desc} | Q:{item.qualifier}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ background: COLORS.redBg, border: `1px solid ${COLORS.red}40`, borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: COLORS.red, letterSpacing: "0.1em", marginBottom: 6 }}>
                      🚩 RED FLAGS — INVESTIGAR ANTES DE PROSSEGUIR
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {kb.redFlags.map((f) => (
                        <span
                          key={f}
                          style={{
                            fontSize: 11,
                            color: COLORS.red,
                            background: COLORS.redBg,
                            border: `1px solid ${COLORS.red}30`,
                            borderRadius: 6,
                            padding: "2px 10px",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: COLORS.textSub, lineHeight: 1.7 }}>
                    <strong style={{ color: COLORS.greenDim }}>Padrão-ouro: </strong>
                    {kb.goldStandard}
                  </div>

                  {kb.escalas?.length > 0 && (
                    <div style={{ marginTop: 10, background: COLORS.card, borderRadius: 8, padding: "8px 12px" }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: COLORS.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 6,
                        }}
                      >
                        📏 Escalas recomendadas para esta condição
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {kb.escalas.map((e) => (
                          <span
                            key={e}
                            style={{
                              fontSize: 11,
                              color: COLORS.amber,
                              background: COLORS.amberBg,
                              border: `1px solid ${COLORS.amber}30`,
                              borderRadius: 6,
                              padding: "2px 8px",
                            }}
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <SubHeading>Caracterização da dor</SubHeading>
              <Row cols="1fr 1fr">
                <Field l="Localização da dor">
                  <TagSelect
                    options={[
                      "Cervical",
                      "Torácica",
                      "Lombar",
                      "Sacroilíaca",
                      "Ombro D",
                      "Ombro E",
                      "Cotovelo D",
                      "Cotovelo E",
                      "Punho/Mão D",
                      "Punho/Mão E",
                      "Quadril D",
                      "Quadril E",
                      "Joelho D",
                      "Joelho E",
                      "Tornozelo D",
                      "Tornozelo E",
                      "Pé D",
                      "Pé E",
                      "Irradiação MMSS",
                      "Irradiação MMII",
                    ]}
                    value={localDor}
                    onChange={setLocalDor}
                  />
                </Field>
                <Field l="Caráter da dor">
                  <TagSelect
                    options={[
                      "Latejante",
                      "Queimação",
                      "Pontada",
                      "Pressão",
                      "Facada",
                      "Formigamento",
                      "Peso",
                      "Cãibra",
                      "Choques",
                      "Mecânica",
                      "Inflamatória",
                      "Neuropática",
                    ]}
                    value={caraterDor}
                    onChange={setCaraterDor}
                  />
                </Field>
              </Row>
              <Row cols="1fr 1fr 1fr">
                <Field l="Duração / tempo de dor">
                  <select
                    value={tempoDor}
                    onChange={(e) => setTempoDor(e.target.value)}
                    style={microStyles.sel()}
                  >
                    <option value="">Selecionar…</option>
                    {[
                      "< 2 semanas (aguda)",
                      "2–6 semanas (subaguda)",
                      "6 sem – 3 meses (subcrônica)",
                      "3–6 meses (crônica)",
                      "6–12 meses",
                      "1–2 anos",
                      "> 2 anos (crônica complexa)",
                    ].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field l="Fatores de melhora">
                  <TagSelect
                    options={[
                      "Repouso",
                      "Calor",
                      "Frio",
                      "Movimento/aquecimento",
                      "Analgésico",
                      "Posição específica",
                      "Fisioterapia",
                      "Sono",
                    ]}
                    value={melhora}
                    onChange={setMelhora}
                  />
                </Field>
                <Field l="Fatores de piora">
                  <TagSelect
                    options={[
                      "Movimento",
                      "Carga",
                      "Postura estática",
                      "Frio",
                      "Stress emocional",
                      "Noite/repouso",
                      "Trabalho",
                      "Após atividade",
                    ]}
                    value={piora}
                    onChange={setPiora}
                  />
                </Field>
              </Row>

              <Field l="HDA — História da Doença Atual">
                <AudioField
                  value={hda}
                  onChange={(v) => setHda(typeof v === "function" ? v(hda) : v)}
                  placeholder="Início, mecanismo de lesão, evolução, tratamentos anteriores, exames realizados…"
                  rows={3}
                />
              </Field>

              <SubHeading>Histórico e comorbidades</SubHeading>
              <Row cols="1fr 1fr">
                <Field l="Comorbidades">
                  <TagSelect
                    options={[
                      "HAS",
                      "DM2",
                      "Obesidade",
                      "Osteoporose",
                      "Artrite/AR",
                      "Fibromialgia",
                      "Depressão",
                      "Ansiedade",
                      "Doença cardíaca",
                      "DPOC",
                      "Neoplasia",
                      "Imunossupressão",
                      "Nenhuma",
                    ]}
                    value={comorbid}
                    onChange={setComorbid}
                  />
                </Field>
                <Field l="Antecedentes / cirurgias">
                  <TagSelect
                    options={[
                      "Cirurgia prévia (área)",
                      "Trauma anterior",
                      "Fratura óssea",
                      "Imobilização prolongada",
                      "Fisioterapia anterior",
                      "Infiltração corticoide",
                      "Nenhum relevante",
                    ]}
                    value={antec}
                    onChange={setAntec}
                  />
                </Field>
              </Row>
              <Field l="Medicamentos em uso">
                <input
                  value={meds}
                  onChange={(e) => setMeds(e.target.value)}
                  style={microStyles.inp()}
                  placeholder="Anti-inflamatório, analgésico, relaxante muscular, antidepressivo…"
                />
              </Field>

              <SubHeading>Yellow Flags — Fatores Psicossociais</SubHeading>
              <TagSelect
                options={[
                  "Catastrofização",
                  "Cinesiofobia",
                  "Baixa autoeficácia",
                  "Insatisfação no trabalho",
                  "Depressão/ansiedade",
                  "Baixa expectativa de recuperação",
                  "Comportamento de doença",
                  "Conflitos familiares",
                  "Litígio / afastamento laboral",
                  "Trabalho sedentário",
                ]}
                value={yellowFlagsState}
                onChange={setYellowFlagsState}
                activeColor={COLORS.amber}
              />
              {yellowFlagsState.length >= 3 && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 12px",
                    background: COLORS.amberBg,
                    border: `1px solid ${COLORS.amber}40`,
                    borderRadius: 8,
                    fontSize: 11,
                    color: COLORS.amber,
                  }}
                >
                  ⚠️ <strong>{yellowFlagsState.length} yellow flags identificados.</strong> Considerar abordagem
                  biopsicossocial (CFT, PNE) e avaliação psicológica.
                </div>
              )}
            </Section>

            {/* Dor e Funcionalidade */}
            <Section title="Dor e Funcionalidade" icon="⚡">
              <Row cols="1fr 1fr">
                <div>
                  <EvaSlider label="EVA — Movimento" value={evaMov} onChange={setEvaMov} />
                  <div style={{ marginTop: 18 }}>
                    <EvaSlider label="EVA — Repouso" value={evaRep} onChange={setEvaRep} />
                  </div>
                </div>
                <div>
                  <Field l="Nível de atividade física">
                    <SingleSelect
                      options={["Sedentário", "Levemente ativo", "Moderadamente ativo", "Muito ativo", "Atleta"]}
                      value={nivelAti}
                      onChange={setNivelAti}
                    />
                  </Field>
                  <div style={{ marginTop: 14 }}>
                    <Field l="Limitações nas AVDs">
                      <TagSelect
                        options={[
                          "Andar",
                          "Subir escadas",
                          "Agachar",
                          "Sentar/levantar",
                          "Vestir-se",
                          "Higiene pessoal",
                          "Dormir",
                          "Dirigir",
                          "Trabalho manual",
                          "Esporte",
                          "Carregar peso",
                          "Vida sexual",
                          "Sem limitações",
                        ]}
                        value={avds}
                        onChange={setAvds}
                      />
                    </Field>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <Field l="Objetivo principal (expectativa do paciente)">
                      <TagSelect
                        options={[
                          "Eliminar a dor",
                          "Retornar ao trabalho",
                          "Retornar ao esporte",
                          "Independência nas AVDs",
                          "Melhorar postura",
                          "Fortalecer",
                          "Prevenir recidiva",
                          "Melhorar qualidade de vida",
                        ]}
                        value={objTrat}
                        onChange={setObjTrat}
                      />
                    </Field>
                  </div>
                </div>
              </Row>
            </Section>

            {/* Exame Físico */}
            <Section title="Exame Físico" icon="🔬">
              <SubHeading>Inspeção e marcha</SubHeading>
              <Row cols="1fr 1fr">
                <Field l="Alterações posturais">
                  <TagSelect
                    options={[
                      "Anteriorização de cabeça",
                      "Protração de ombros",
                      "Hipercifose torácica",
                      "Hiperlordose lombar",
                      "Retificação lombar",
                      "Escoliose funcional",
                      "Escoliose estrutural",
                      "Pelve anteriorizada",
                      "Pelve posteriorizada",
                      "Joelho varo",
                      "Joelho valgo",
                      "Recurvatum",
                      "Pé plano",
                      "Pé cavo",
                      "Sem alterações",
                    ]}
                    value={postura}
                    onChange={setPostura}
                  />
                </Field>
                <div>
                  <Field l="Padrão de marcha">
                    <select
                      value={marcha}
                      onChange={(e) => setMarcha(e.target.value)}
                      style={microStyles.sel()}
                    >
                      <option value="">Selecionar…</option>
                      {[
                        "Normal",
                        "Antálgica",
                        "Trendelenburg",
                        "Equina",
                        "Hemiplégica",
                        "Atáxica",
                        "Claudicação intermitente",
                        "Não avaliado",
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </Field>
                  <div style={{ marginTop: 12 }}>
                    <Field l="Edema / Sinais flogísticos">
                      <select
                        value={edema}
                        onChange={(e) => setEdema(e.target.value)}
                        style={microStyles.sel()}
                      >
                        <option value="">Selecionar…</option>
                        {[
                          "Ausente",
                          "Edema leve (1+)",
                          "Edema moderado (2+)",
                          "Edema importante (3+)",
                          "Calor local",
                          "Rubor",
                          "Derrame articular",
                          "Crepitação",
                        ].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Field l="Sensibilidade">
                      <select
                        value={sensib}
                        onChange={(e) => setSensib(e.target.value)}
                        style={microStyles.sel()}
                      >
                        <option value="">Selecionar…</option>
                        {["Normal", "Hipoestesia", "Hiperestesia", "Parestesia", "Anestesia", "Alodínia"].map(
                          (v) => (
                            <option key={v}>{v}</option>
                          )
                        )}
                      </select>
                    </Field>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Field l="Reflexos osteotendinosos">
                      <select
                        value={reflexos}
                        onChange={(e) => setReflexos(e.target.value)}
                        style={microStyles.sel()}
                      >
                        <option value="">Selecionar…</option>
                        {["Normais (2+)", "Hiporreflexia (1+)", "Arreflexia (0)", "Hiperreflexia (3+/4+)", "Assimétricos"].map(
                          (v) => (
                            <option key={v}>{v}</option>
                          )
                        )}
                      </select>
                    </Field>
                  </div>
                </div>
              </Row>

              <SubHeading>Palpação</SubHeading>
              <AudioField
                value={palpacao}
                onChange={(v) => setPalpacao(typeof v === "function" ? v(palpacao) : v)}
                placeholder="Pontos gatilho, espasmo muscular, dor à palpação de processos espinhosos, hipersensibilidade local…"
                rows={2}
              />

              <SubHeading>Força Muscular — Escala MRC (0–5)</SubHeading>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[
                  ["quadricepsD", "Quadríceps D"],
                  ["quadricepsE", "Quadríceps E"],
                  ["isquiotibialD", "Isquiotib. D"],
                  ["isquiotibialE", "Isquiotib. E"],
                  ["gluteoD", "Glúteo D"],
                  ["gluteoE", "Glúteo E"],
                  ["manguitoD", "Manguito D"],
                  ["manguitoE", "Manguito E"],
                  ["tibialAnterior", "Tibial Ant."],
                  ["gastrocnemio", "Gastrocnêmio"],
                  ["bicepsD", "Bíceps D"],
                  ["bicepsE", "Bíceps E"],
                ].map(([k, l2]) => (
                  <div key={k}>
                    <span style={{ ...microStyles.lbl(), fontSize: 9 }}>{l2}</span>
                    <MRCSelect
                      value={forca[k]}
                      onChange={(v) => setForca((f) => ({ ...f, [k]: v }))}
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Goniometria */}
            <Section
              title="Goniometria"
              icon="📐"
              badge={`${gonio.filter((g) => g.value).length} med.`}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1.8fr 76px 72px 28px",
                  gap: 8,
                  paddingBottom: 8,
                  borderBottom: `1px solid ${COLORS.border}`,
                  marginBottom: 4,
                }}
              >
                {["Articulação", "Movimento", "Grau", "Ref.", ""].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: COLORS.textDim,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      textAlign: i >= 2 ? "center" : "left",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              {gonio.map((row) => (
                <GonioRowComponent
                  key={row.id}
                  row={row}
                  onUpdate={(u) => updG(row.id, u)}
                  onRemove={() => remG(row.id)}
                />
              ))}
              <button
                onClick={addG}
                style={microStyles.ghostBtn({ marginTop: 12, fontSize: 12 })}
                type="button"
              >
                + Adicionar medida
              </button>
            </Section>

            {/* Testes especiais */}
            {kb && (
              <Section title={`Testes Especiais — ${kb.label}`} icon="🧪">
                <p style={{ fontSize: 12, color: COLORS.textMuted, margin: "0 0 14px" }}>
                  Selecione o resultado de cada teste. Clique em ▼ para ver a execução detalhada ou ▶
                  Vídeo para demonstração.
                </p>
                {kb.tests.map((t) => (
                  <TestCard
                    key={t.name}
                    test={t}
                    result={tests[t.name] || ""}
                    onResult={(v) => setTests((tr) => ({ ...tr, [t.name]: v }))}
                  />
                ))}
              </Section>
            )}

            {/* Observações */}
            <Section title="Observações Clínicas" icon="💬">
              <AudioField
                value={obs}
                onChange={(v) => setObs(typeof v === "function" ? v(obs) : v)}
                placeholder="Comportamento do paciente, achados adicionais, exames de imagem relevantes, considerações clínicas…"
                rows={4}
              />
            </Section>

            {/* IA */}
            <Section
              title="Análise por Inteligência Artificial — Baseada em Evidências"
              icon="🤖"
              accent={COLORS.green}
            >
              <p style={{ fontSize: 12, color: COLORS.textMuted, margin: "0 0 14px", lineHeight: 1.7 }}>
                Preencha os campos da avaliação e clique em analisar. A IA cruzará os dados com
                evidências científicas atualizadas (PEDro, Cochrane, CPGs) e gerará um plano de
                tratamento personalizado e baseado em evidências.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={runAI}
                  disabled={aiLoad || !queixa}
                  style={microStyles.primaryBtn({ opacity: aiLoad || !queixa ? 0.45 : 1 })}
                  type="button"
                >
                  {aiLoad ? "⏳ Analisando…" : "🔍 Gerar análise clínica"}
                </button>
                <div style={{ display: "flex", gap: 6 }}>
                  {progSteps
                    .filter((s) => !s.done)
                    .map((s) => (
                      <span
                        key={s.key}
                        style={{
                          fontSize: 10,
                          color: COLORS.amber,
                          background: COLORS.amberBg,
                          border: `1px solid ${COLORS.amber}30`,
                          borderRadius: 6,
                          padding: "2px 8px",
                        }}
                      >
                        Pendente: {s.label}
                      </span>
                    ))}
                </div>
              </div>
              {aiRes && (
                <div
                  style={{
                    marginTop: 16,
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.green}30`,
                    borderRadius: 10,
                    padding: 18,
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, color: COLORS.green, letterSpacing: "0.1em", marginBottom: 12 }}>
                    ANÁLISE CLÍNICA — SASYRA IA
                  </div>
                  <pre
                    style={{
                      fontSize: 13,
                      color: COLORS.text,
                      whiteSpace: "pre-wrap",
                      margin: 0,
                      lineHeight: 1.85,
                      fontFamily: FONTS,
                    }}
                  >
                    {aiRes}
                  </pre>
                </div>
              )}
            </Section>
          </>
        )}

        {/* ══════════════ EVIDÊNCIAS ══════════════════════════════════════════ */}
        {tab === "evidencias" && (
          <>
            <div
              style={{
                marginBottom: 14,
                padding: "12px 16px",
                background: COLORS.blueBg,
                border: `1px solid ${COLORS.blue}40`,
                borderRadius: 12,
                fontSize: 12,
                color: COLORS.textSub,
                lineHeight: 1.7,
              }}
            >
              📚 Base de evidências do SASYRA — estudos PEDro ≥ 7, meta-análises Cochrane e CPGs
              internacionais (JOSPT, NICE, EuroPain). Atualizado conforme guidelines 2023–2024.
            </div>
            {Object.entries(KB).map(([key, kb2]) => (
              <Section
                key={key}
                title={kb2.label}
                icon="🔬"
                badge={`${EVIDENCE[key]?.pedro?.length || 0} estudos PEDro`}
              >
                <SubHeading>Estudos PEDro — Ensaios Clínicos</SubHeading>
                {EVIDENCE[key]?.pedro?.map((study) => (
                  <PedroCard key={study.id} study={study} />
                ))}
                <SubHeading>Padrão-ouro atual</SubHeading>
                <div style={{ fontSize: 12, color: COLORS.textSub, lineHeight: 1.7, marginBottom: 10 }}>
                  {kb2.goldStandard}
                </div>
                <SubHeading>Escalas de desfecho recomendadas</SubHeading>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {kb2.escalas?.map((e) => (
                    <span
                      key={e}
                      style={{
                        fontSize: 11,
                        color: COLORS.amber,
                        background: COLORS.amberBg,
                        border: `1px solid ${COLORS.amber}30`,
                        borderRadius: 6,
                        padding: "3px 10px",
                      }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
                <SubHeading>Yellow flags desta condição</SubHeading>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {kb2.yellowFlags?.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: 11,
                        color: COLORS.amber,
                        background: COLORS.amberBg,
                        border: `1px solid ${COLORS.amber}30`,
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 8, fontSize: 10, color: COLORS.textMuted }}>
                  Atualização: {EVIDENCE[key]?.atualizacao}
                </div>
              </Section>
            ))}
          </>
        )}

        {/* ══════════════ DIÁRIO ══════════════════════════════════════════════ */}
        {tab === "diario" && (
          <>
            {patient.sessoesAuth && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 14 }}>
                {[
                  ["Sessões realizadas", currentLogs.length, COLORS.green],
                  ["Autorizadas", patient.sessoesAuth, COLORS.amber],
                  ["Restantes", Math.max(0, Number(patient.sessoesAuth) - currentLogs.length), currentLogs.length >= Number(patient.sessoesAuth) ? COLORS.red : COLORS.blue],
                ].map(([l2, v, c]) => (
                  <div
                    key={l2 as string}
                    style={{
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 12,
                      padding: "14px 16px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: COLORS.textMuted,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {l2}
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: c as string, lineHeight: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            <Section title="Registrar Nova Sessão" icon="📅">
              <Row cols="1fr 1fr">
                <Field l="Data">
                  <input
                    type="date"
                    value={newLogEntry.data}
                    onChange={(e) => setNewLogEntry((f) => ({ ...f, data: e.target.value }))}
                    style={microStyles.inp()}
                  />
                </Field>
                <EvaSlider
                  label="EVA da sessão"
                  value={newLogEntry.eva}
                  onChange={(v) => setNewLogEntry((f) => ({ ...f, eva: v }))}
                />
              </Row>
              <Field l="Procedimentos realizados">
                <TagSelect
                  options={[
                    "TENS",
                    "FES",
                    "Ultrassom terapêutico",
                    "Laser de baixa potência",
                    "Magnetoterapia",
                    "Crioterapia",
                    "Termoterapia",
                    "Massagem terapêutica",
                    "Mobilização articular",
                    "Manipulação",
                    "Tração",
                    "Dry needling",
                    "Ventosaterapia",
                    "Bandagem funcional",
                    "Kinesio taping",
                    "RPG",
                    "Pilates clínico",
                    "Cinesioterapia",
                    "Treino de força",
                    "Treino proprioceptivo",
                    "Treino funcional",
                    "Exercício neuromotor",
                    "Liberação miofascial",
                    "Hidroterapia",
                    "Alongamento global",
                    "PNE – Educação em Dor",
                    "Graded Exposure",
                    "CFT – Terapia Funcional Cognitiva",
                  ]}
                  value={newLogEntry.procedimentos}
                  onChange={(v) => setNewLogEntry((f) => ({ ...f, procedimentos: v }))}
                />
              </Field>
              <Row cols="1fr 1fr">
                <Field l="Resposta ao tratamento">
                  <SingleSelect
                    options={[
                      "Excelente melhora",
                      "Boa melhora",
                      "Melhora parcial",
                      "Sem melhora",
                      "Piora",
                      "Intercorrência",
                    ]}
                    value={newLogEntry.resposta}
                    onChange={(v) => setNewLogEntry((f) => ({ ...f, resposta: v }))}
                    activeColor={COLORS.green}
                  />
                </Field>
                <Field l="Escala aplicada nesta sessão">
                  <input
                    value={newLogEntry.escalas}
                    onChange={(e) => setNewLogEntry((f) => ({ ...f, escalas: e.target.value }))}
                    style={microStyles.inp()}
                    placeholder="Ex: ODI=32%, KOOS=58, NDI=24%…"
                  />
                </Field>
              </Row>
              <Field l="Meta para próxima sessão">
                <input
                  value={newLogEntry.metas}
                  onChange={(e) => setNewLogEntry((f) => ({ ...f, metas: e.target.value }))}
                  style={microStyles.inp()}
                  placeholder="Progressão de carga, novo exercício, critério de progressão…"
                />
              </Field>
              <Field l="Evolução clínica / prontuário">
                <AudioField
                  value={newLogEntry.evolucao}
                  onChange={(v) => setNewLogEntry((f) => ({ ...f, evolucao: typeof v === "function" ? v(f.evolucao) : v }))}
                  rows={3}
                  placeholder="Paciente refere melhora de… Apresenta… Realizado… Tolerou bem…"
                />
              </Field>
              <button onClick={addLog} style={microStyles.primaryBtn()} type="button">
                + Salvar sessão
              </button>
            </Section>

            {currentLogs.length >= 2 && (
              <Section title="Evolução da Dor (EVA)" icon="📈">
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80, padding: "0 4px" }}>
                  {[...currentLogs].reverse().map((l: any, i: number) => {
                    const h = (l.eva / 10) * 72;
                    const c = l.eva <= 3 ? COLORS.green : l.eva <= 6 ? COLORS.amber : COLORS.red;
                    return (
                      <div
                        key={l.id}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <span style={{ fontSize: 9, color: c, fontWeight: 700 }}>{l.eva}</span>
                        <div style={{ width: "100%", height: h, background: c, borderRadius: "4px 4px 0 0", opacity: 0.8 }} />
                        <span style={{ fontSize: 8, color: COLORS.textDim }}>S{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: COLORS.textMuted,
                    marginTop: 16,
                  }}
                >
                  <span>S1 (inicial)</span>
                  <span>S{currentLogs.length} (última)</span>
                </div>
              </Section>
            )}

            {currentLogs.length > 0 && (
              <Section title={`Histórico — ${currentLogs.length} sessão(ões)`} icon="📋">
                {currentLogs.map((log: any) => {
                  const ec = log.eva <= 3 ? COLORS.green : log.eva <= 6 ? COLORS.amber : COLORS.red;
                  return (
                    <div
                      key={log.id}
                      style={{
                        padding: "14px 16px",
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.textSub }}>
                          Sessão {log.sessaoNum} · {log.data}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: ec,
                            background: `${ec}10`,
                            padding: "3px 8px",
                            borderRadius: 6,
                            border: `1px solid ${ec}30`,
                          }}
                        >
                          EVA: {log.eva}/10
                        </span>
                      </div>

                      {log.resposta && (
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase", fontWeight: 700 }}>
                            Resposta
                          </span>
                          <div style={{ fontSize: 12, color: COLORS.green, fontWeight: 700 }}>
                            {log.resposta}
                          </div>
                        </div>
                      )}

                      {log.procedimentos.length > 0 && (
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase", fontWeight: 700 }}>
                            Condutas
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 3 }}>
                            {log.procedimentos.map((p: any) => (
                              <span
                                key={p}
                                style={{
                                  fontSize: 10,
                                  color: COLORS.textSub,
                                  background: COLORS.card,
                                  border: `1px solid ${COLORS.border}`,
                                  borderRadius: 5,
                                  padding: "2px 6px",
                                }}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {log.escalas && (
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase", fontWeight: 700 }}>
                            Métricas/Escalas
                          </span>
                          <div style={{ fontSize: 12, color: COLORS.purple, fontWeight: 700 }}>
                            {log.escalas}
                          </div>
                        </div>
                      )}

                      {log.evolucao && (
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase", fontWeight: 700 }}>
                            Evolução clínica
                          </span>
                          <div style={{ fontSize: 12, color: COLORS.textSub, lineHeight: 1.5, marginTop: 2 }}>
                            {log.evolucao}
                          </div>
                        </div>
                      )}

                      {log.metas && (
                        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 6, marginTop: 8 }}>
                          <span style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase", fontWeight: 700 }}>
                            Meta próxima sessão
                          </span>
                          <div style={{ fontSize: 12, color: COLORS.text, fontWeight: 700, marginTop: 2 }}>
                            → {log.metas}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Section>
            )}
          </>
        )}

        {/* ══════════════ RELATÓRIO ════════════════════════════════════════════ */}
        {tab === "relatorio" && (
          <Section title="Relatório Multiprofissional" icon="📊">
            <div
              id="relatorio-impressao"
              style={{
                background: "#FFFFFF",
                color: "#1E293B",
                padding: "28px 32px",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontFamily: FONTS,
                lineHeight: 1.7,
              }}
            >
              {/* Header Relatorio */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid #E2E8F0",
                  paddingBottom: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#0F6E56" }}>
                    LAUDO DE AVALIAÇÃO FISIOTERAPÊUTICA
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: "0.05em" }}>
                    SASYRA CLINICAL ASSISTANT · DOCUMENTO OFICIAL
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#1E293B" }}>
                    Dr(a). {user.nome}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>
                    {PROF_LABELS[user.prof] || user.prof}
                    {user.crefito ? ` · CREFITO ${user.crefito}` : ""}
                  </div>
                </div>
              </div>

              {/* Paciente Relatorio */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginBottom: 20 }}>
                {[
                  ["Paciente", patient.nome],
                  ["Nascimento", patient.dataNasc],
                  ["Sexo", patient.sexo],
                  ["Data avaliação", patient.data],
                  ["Profissão", patient.profissao],
                  ["Convênio", patient.convenio],
                  ["Contato/Telefone", patient.telefone || "Não informado"],
                  ["IMC", imc ? `${imc.value} (${imc.l})` : "—"],
                ].map(([label2, val]) => (
                  <div
                    key={label2 as string}
                    style={{ fontSize: 13, display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 4 }}
                  >
                    <span style={{ fontWeight: 700, color: "#64748B" }}>{label2}:</span>
                    <span style={{ color: "#1E293B", fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>

              {queixa && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: "#0F6E56", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    Queixa Principal
                  </div>
                  <div style={{ fontSize: 14, color: "#334155", background: "#F8FAFC", padding: 12, borderRadius: 8, borderLeft: "4px solid #0F6E56" }}>
                    {queixa}
                  </div>
                </div>
              )}

              {hda && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: "#0F6E56", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    Histórico da Doença Atual (HDA)
                  </div>
                  <div style={{ fontSize: 13, color: "#334155" }}>{hda}</div>
                </div>
              )}

              {localDor.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: "#0F6E56", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    Quadro Algológico (Dor)
                  </div>
                  <div style={{ fontSize: 13, color: "#334155" }}>
                    <strong>Localização:</strong> {localDor.join(", ")} <br />
                    <strong>Caráter:</strong> {caraterDor.join(", ")} <br />
                    <strong>Duração/Tempo:</strong> {tempoDor || "Não informado"} <br />
                    <strong>Intensidade (EVA):</strong> Movimento {evaMov}/10 · Repouso {evaRep}/10
                  </div>
                </div>
              )}

              {autoCIF.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: "#0F6E56", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    Classificação Internacional de Funcionalidade (CIF)
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC" }}>
                        {["Código", "Descrição", "Qualificador", "Gravidade"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "7px 10px",
                              textAlign: "left",
                              fontWeight: 700,
                              fontSize: 10,
                              color: "#7C8FA6",
                              textTransform: "uppercase",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {autoCIF.map((item) => (
                        <tr key={item.code} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "6px 10px", fontWeight: 700, color: "#0F6E56" }}>{item.code}</td>
                          <td style={{ padding: "6px 10px" }}>{item.desc}</td>
                          <td style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>
                            {item.qualifier}
                          </td>
                          <td style={{ padding: "6px 10px" }}>
                            {item.qualifier === 1
                              ? "Dificuldade Leve"
                              : item.qualifier === 2
                                ? "Dificuldade Moderada"
                                : "Dificuldade Grave"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gonio.filter((g) => g.value).length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: "#0F6E56", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    Goniometria
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC" }}>
                        {["Articulação", "Movimento", "Medida", "Referência", "Status"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "7px 10px",
                              textAlign: "left",
                              fontWeight: 700,
                              fontSize: 10,
                              color: "#7C8FA6",
                              textTransform: "uppercase",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {gonio
                        .filter((g) => g.value)
                        .map((g) => {
                          const ref = getRef(g.movement, g.joint);
                          const oor = isOutOfRange(g.value, ref);
                          return (
                            <tr key={g.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                              <td style={{ padding: "6px 10px" }}>{g.joint}</td>
                              <td style={{ padding: "6px 10px" }}>{g.movement}</td>
                              <td style={{ padding: "6px 10px", fontWeight: 800, color: oor ? "#E24B4A" : "#0F6E56" }}>
                                {g.value}°
                              </td>
                              <td style={{ padding: "6px 10px", color: "#7C8FA6" }}>{ref ? `${ref}°` : "—"}</td>
                              <td style={{ padding: "6px 10px" }}>
                                {oor ? (
                                  <span style={{ fontSize: 11, color: "#E24B4A", fontWeight: 700 }}>
                                    ⚠ Acima do ref.
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 11, color: "#3B6D11" }}>✓</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

              {Object.entries(tests).filter(([, v]) => v && v !== "Não realizado").length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: "#0F6E56", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    Testes especiais
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {Object.entries(tests)
                      .filter(([, v]) => v && v !== "Não realizado")
                      .map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            background: "#F8FAFC",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 13,
                          }}
                        >
                          <span style={{ color: "#374151" }}>{k}</span>
                          <span style={{ fontWeight: 700, color: v === "Positivo" ? "#E24B4A" : "#3B6D11" }}>
                            {v}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {patient.convenio === "Particular" && (
                <div style={{ marginBottom: 18, background: "#F5F3FF", borderRadius: 8, padding: "12px 16px", border: "1px solid #DDD6FE" }}>
                  <div style={{ fontWeight: 700, color: "#5B21B6", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    Honorários CREFITO — Referência para atendimento particular
                  </div>
                  <div style={{ fontSize: 12, color: "#374151" }}>
                    Região: {regiao} | Sessão: R${" "}
                    {(CREFITO_REGIOES[regiao] || CREFITO_REGIOES["Centro-Oeste"]).sessao.toFixed(2)} | Avaliação: R${" "}
                    {(CREFITO_REGIOES[regiao] || CREFITO_REGIOES["Centro-Oeste"]).avaliacao.toFixed(2)} | Relatório:
                    R$ {(CREFITO_REGIOES[regiao] || CREFITO_REGIOES["Centro-Oeste"]).relatorio.toFixed(2)}
                    {patient.sessoesAuth
                      ? ` | Total (${patient.sessoesAuth} sessões): R$ ${(
                          (CREFITO_REGIOES[regiao] || CREFITO_REGIOES["Centro-Oeste"]).avaliacao +
                          (CREFITO_REGIOES[regiao] || CREFITO_REGIOES["Centro-Oeste"]).sessao *
                            parseInt(patient.sessoesAuth) +
                          (CREFITO_REGIOES[regiao] || CREFITO_REGIOES["Centro-Oeste"]).relatorio
                        ).toFixed(2)}`
                      : ""}
                  </div>
                </div>
              )}

              {aiRes && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: "#0F6E56", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    Plano de tratamento — análise IA baseada em evidências
                  </div>
                  <pre
                    style={{
                      fontSize: 12,
                      whiteSpace: "pre-wrap",
                      background: "#F8FAFC",
                      borderRadius: 8,
                      padding: 14,
                      margin: 0,
                      fontFamily: FONTS,
                      lineHeight: 1.8,
                      color: "#1a202c",
                    }}
                  >
                    {aiRes}
                  </pre>
                </div>
              )}

              {currentLogs.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: "#0F6E56", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                    Evolução — {currentLogs.length} sessão(ões)
                  </div>
                  {[...currentLogs].reverse().map((l) => (
                    <div key={l.id} style={{ borderLeft: "3px solid #4ADE80", paddingLeft: 12, marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "#7C8FA6", marginBottom: 2 }}>
                        Sessão {l.sessaoNum} · {l.data} · EVA {l.eva}/10
                        {l.resposta ? ` · ${l.resposta}` : ""}
                      </div>
                      {l.escalas && <div style={{ fontSize: 11, color: "#6B46C1", marginBottom: 2 }}>📏 {l.escalas}</div>}
                      {l.evolucao && <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{l.evolucao}</div>}
                      {l.metas && <div style={{ fontSize: 11, color: "#7C8FA6", marginTop: 2 }}>→ {l.metas}</div>}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: "1px solid #E2E8F0", marginTop: 20, paddingTop: 12, fontSize: 10, color: "#7C8FA6", textAlign: "center" }}>
                SASYRA · Reabilitação e Evidência · Documento gerado para equipe multidisciplinar
              </div>
            </div>
            
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <button
                onClick={() => window.print()}
                style={microStyles.primaryBtn()}
                type="button"
              >
                🖨️ Imprimir / Salvar PDF
              </button>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
