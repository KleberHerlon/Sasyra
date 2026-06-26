import { useState } from "react";
import { Patient, User } from "@/types";
import LogoSVG from "@/components/LogoSVG";
import { PROF_LABELS } from "@/components/LoginScreen";
import { COLORS, FONTS, microStyles } from "@/styles/theme";

interface PatientListProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
  onAdd: (patient: Patient) => void;
  onLogout: () => void;
  user: User;
  onAgenda: () => void;
  onViewChange: (view: string) => void;
  onChangeModule: () => void;
  onDelete: (patient: Patient) => void;
  plan: string;
}

interface FormState {
  nome: string;
  dataNasc: string;
  sexo: string;
  profissao: string;
  convenio: string;
  telefone: string;
  peso: string;
  altura: string;
}

export default function PatientList({
  patients,
  onSelect,
  onAdd,
  onLogout,
  user,
  onAgenda,
  onViewChange,
  onChangeModule,
  onDelete,
  plan,
}: PatientListProps) {
  const [showForm, setShowForm] = useState(false);
  const [showClinicasUpsell, setShowClinicasUpsell] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);
  
  const [newPatientForm, setNewPatientForm] = useState<FormState>({
    nome: "",
    dataNasc: "",
    sexo: "",
    profissao: "",
    convenio: "",
    telefone: "",
    peso: "",
    altura: "",
  });

  const handleAdd = () => {
    if (!newPatientForm.nome.trim()) return;
    onAdd({
      ...newPatientForm,
      id: Date.now(),
      data: new Date().toISOString().slice(0, 10),
    });
    setNewPatientForm({
      nome: "",
      dataNasc: "",
      sexo: "",
      profissao: "",
      convenio: "",
      telefone: "",
      peso: "",
      altura: "",
    });
    setShowForm(false);
  };

  const setField = (key: keyof FormState, value: string) => {
    setNewPatientForm((prev) => ({ ...prev, [key]: value }));
  };

  const formFields = [
    { k: "nome" as const, l: "Nome completo", pl: "Nome do paciente" },
    { k: "dataNasc" as const, l: "Nascimento", pl: "", type: "date" },
    { k: "sexo" as const, l: "Sexo", type: "select", opts: ["", "Feminino", "Masculino", "Outro"] },
    { k: "profissao" as const, l: "Profissão", pl: "Profissão" },
    {
      k: "convenio" as const,
      l: "Convênio",
      type: "select",
      opts: [
        "",
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
      ],
    },
    { k: "telefone" as const, l: "Telefone", pl: "(99) 99999-9999" },
    { k: "peso" as const, l: "Peso (kg)", pl: "kg" },
    { k: "altura" as const, l: "Altura (cm)", pl: "cm" },
  ];

  return (
    <div
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${COLORS.card} 0%, ${COLORS.bg} 70%)`,
        minHeight: "100vh",
        fontFamily: FONTS,
        color: COLORS.text,
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header com Navegação */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <LogoSVG />
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={onChangeModule} style={microStyles.ghostBtn({ fontSize: 11, padding: "6px 10px" })} type="button" title="Trocar módulo de atendimento">
              🔄 Módulos
            </button>
            <button onClick={onAgenda} style={microStyles.ghostBtn({ fontSize: 11, padding: "6px 10px" })} type="button">
              📅 Agenda
            </button>
            <button onClick={() => onViewChange("financeiro")} style={microStyles.ghostBtn({ fontSize: 11, padding: "6px 10px" })} type="button">
              💰 Financeiro
            </button>
            <button onClick={() => onViewChange("integrations")} style={microStyles.ghostBtn({ fontSize: 11, padding: "6px 10px" })} type="button">
              🔗 Integrações
            </button>
            <button onClick={onLogout} style={microStyles.ghostBtn({ fontSize: 11, padding: "6px 10px" })} type="button">
              Sair
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.white, marginBottom: 2 }}>
            Olá, {user.nome}
          </div>
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>
            {PROF_LABELS[user.prof] || user.prof}
            {user.crefito ? ` · CREFITO ${user.crefito}` : ""}
          </div>
        </div>

        {/* Banner de Upsell do Clínicas */}
        {(plan === "start" || plan === "evidencia") && showClinicasUpsell && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(26,46,26,0.9) 0%, rgba(15,31,15,0.9) 100%)",
              border: `1px solid ${COLORS.green}40`,
              borderRadius: 14,
              padding: "16px 20px",
              marginBottom: 20,
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowClinicasUpsell(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 10,
                background: "transparent",
                border: "none",
                color: COLORS.textMuted,
                cursor: "pointer",
                fontSize: 16,
                lineHeight: 1,
              }}
              type="button"
            >
              ×
            </button>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ fontSize: 28 }}>🏥</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.green, marginBottom: 4 }}>
                  Migre para Clínicas & Equipes
                </div>
                <div style={{ fontSize: 12, color: COLORS.textSub, lineHeight: 1.5 }}>
                  Até <strong style={{ color: COLORS.text }}>3 CREFITOs</strong> inclusos · Financeiro consolidado por profissional · Margem de <strong style={{ color: COLORS.green }}>90%</strong> por assinante · Profissionais extras por apenas <strong style={{ color: COLORS.text }}>R$ 9,90/mês</strong>
                </div>
              </div>
              <button
                onClick={() => onViewChange("plans")}
                style={{
                  background: COLORS.green,
                  color: "#061A0C",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: FONTS,
                  whiteSpace: "nowrap",
                }}
                type="button"
              >
                Ver Planos →
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>
            Pacientes{" "}
            {patients.length > 0 && (
              <span style={{ color: COLORS.textMuted, fontWeight: 400, fontSize: 13 }}>
                ({patients.length})
              </span>
            )}
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            style={microStyles.primaryBtn({ padding: "9px 18px", fontSize: 13 })}
            type="button"
          >
            {showForm ? "Cancelar" : "+ Novo Paciente"}
          </button>
        </div>

        {showForm && (
          <div style={{ ...microStyles.cardStyle(), marginBottom: 16, border: `1px solid ${COLORS.green}50` }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 16px",
                marginBottom: 14,
              }}
            >
              {formFields.map(({ k, l, pl, type, opts }) => (
                <div key={k}>
                  <span style={microStyles.lbl()}>{l}</span>
                  {opts ? (
                    <select value={newPatientForm[k]} onChange={(e) => setField(k, e.target.value)} style={microStyles.sel()}>
                      {opts.map((o) => (
                        <option key={o} value={o}>
                          {o || "Selecionar…"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type || "text"}
                      value={newPatientForm[k]}
                      placeholder={pl || ""}
                      onChange={(e) => setField(k, e.target.value)}
                      style={microStyles.inp()}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!newPatientForm.nome.trim()}
              type="button"
              style={{
                ...microStyles.primaryBtn({ width: "100%", justifyContent: "center", padding: "11px", fontSize: 14 }),
                opacity: newPatientForm.nome.trim() ? 1 : 0.4,
                cursor: newPatientForm.nome.trim() ? "pointer" : "not-allowed",
              }}
            >
              Cadastrar Paciente
            </button>
          </div>
        )}

        {patients.length === 0 && !showForm && (
          <div style={{ ...microStyles.cardStyle(), textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🩺</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
              Nenhum paciente cadastrado
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 18 }}>
              Clique em "+ Novo Paciente" para começar
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...patients].reverse().map((p) => (
            <div key={p.id} style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
              <button
                onClick={() => onSelect(p)}
                type="button"
                style={{
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: "16px 18px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: FONTS,
                  color: COLORS.text,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flex: 1,
                  minWidth: 0,
                  transition: "all 0.12s",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: COLORS.greenBg,
                    border: `1px solid ${COLORS.green}40`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    color: COLORS.green,
                    flexShrink: 0,
                  }}
                >
                  {p.nome[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 2 }}>{p.nome}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {p.sexo && <span>{p.sexo}</span>}
                    {p.dataNasc && <span>Nasc: {p.dataNasc}</span>}
                    {p.profissao && <span>{p.profissao}</span>}
                    {p.convenio && <span>{p.convenio}</span>}
                  </div>
                </div>
                <span style={{ color: COLORS.green, fontSize: 16 }}>→</span>
              </button>
              
              <button
                onClick={() => setDeleteTarget(p)}
                type="button"
                style={{
                  background: "transparent",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  width: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: COLORS.textDim,
                  fontFamily: FONTS,
                  flexShrink: 0,
                  transition: "all 0.12s",
                }}
                title="Excluir paciente"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: "24px 28px",
              maxWidth: 420,
              width: "90%",
              textAlign: "center",
              fontFamily: FONTS,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>
              Excluir paciente
            </div>
            <div style={{ fontSize: 13, color: COLORS.textSub, marginBottom: 4, lineHeight: 1.6 }}>
              Tem certeza que deseja excluir permanentemente o paciente?
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.text,
                marginBottom: 16,
                padding: "8px 12px",
                background: COLORS.card,
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              {deleteTarget.nome}
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 18, lineHeight: 1.5 }}>
              Esta ação removerá todos os dados associados: avaliações, evoluções e relatórios. Esta operação não pode ser desfeita.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  background: "transparent",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  padding: "10px 24px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: COLORS.textSub,
                  cursor: "pointer",
                  fontFamily: FONTS,
                }}
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDelete(deleteTarget);
                  setDeleteTarget(null);
                }}
                style={{
                  background: "#EF4444",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 24px",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: FONTS,
                }}
                type="button"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
