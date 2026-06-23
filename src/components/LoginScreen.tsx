import { useState } from "react";
import { User } from "@/types";
import { COLORS, FONTS, microStyles } from "@/styles/theme";

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const PROF_LABELS: Record<string, string> = {
  fisio: "Fisioterapeuta",
  to: "Terapeuta Ocupacional",
  educFisico: "Educador Físico",
  outro: "Profissional da Saúde",
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [prof, setProf] = useState("");
  const [nome, setNome] = useState("");
  const [crefito, setCrefito] = useState("");

  const profOptions = [
    { value: "fisio", label: "Fisioterapeuta", icon: "🦵" },
    { value: "to", label: "Terapeuta Ocupacional", icon: "🤲" },
    { value: "educFisico", label: "Educador Físico", icon: "🏃" },
    { value: "outro", label: "Outro profissional da saúde", icon: "💚" },
  ];

  const handleEnter = () => {
    if (!prof || !nome.trim()) return;
    onLogin({ prof, nome: nome.trim(), crefito: crefito.trim() });
  };

  return (
    <div
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${COLORS.card} 0%, ${COLORS.bg} 70%)`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTS,
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        {/* Logo grande */}
        <div style={{ marginBottom: 8 }}>
          <svg viewBox="0 0 400 70" width="320" height="62" style={{ display: "block", margin: "0 auto" }}>
            <g transform="translate(78,36)">
              <line x1="0" y1="-28" x2="0" y2="28" stroke={COLORS.textDim} strokeWidth="1.5" strokeDasharray="2 5" />
              <path d="M -20 14 C -10 4,0 0,20 -14" fill="none" stroke={COLORS.green} strokeWidth="5" strokeLinecap="round" />
              <path d="M -20 -5 C -5 0,5 4,20 15" fill="none" stroke={COLORS.greenDim} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M -12 24 C -4 13,4 -6,15 -24" fill="none" stroke={COLORS.greenDeep} strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="0" r="6" fill={COLORS.amber} />
            </g>
            <text x="200" y="50" fill={COLORS.white} fontSize="36" fontWeight="900" letterSpacing="8" fontFamily={FONTS} textAnchor="middle">
              SASYRA
            </text>
            <text x="200" y="66" fill={COLORS.green} fontSize="13" fontWeight="800" letterSpacing="6" fontFamily={FONTS} textAnchor="middle">
              REABILITAÇÃO E EVIDÊNCIA
            </text>
          </svg>
        </div>

        <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: "8px 0 28px" }}>
          Sistema de apoio à decisão clínica para avaliação, documentação e tratamento ortopédico baseado em evidências
        </p>

        {/* Profissão */}
        <div style={{ textAlign: "left", marginBottom: 18 }}>
          <span style={microStyles.lbl()}>Sou profissional de</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {profOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setProf(opt.value)}
                type="button"
                style={{
                  ...microStyles.iconBtn(prof === opt.value, COLORS.green),
                  width: "100%",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  padding: "12px 16px",
                  border: prof === opt.value ? `1px solid ${COLORS.green}70` : `1px solid ${COLORS.border}`,
                  background: prof === opt.value ? COLORS.greenBg : COLORS.surface,
                  borderRadius: 10,
                  gap: 10,
                  fontSize: 14,
                }}
              >
                <span style={{ fontSize: 18 }}>{opt.icon}</span>
                <span
                  style={{
                    fontWeight: prof === opt.value ? 700 : 400,
                    color: prof === opt.value ? COLORS.green : COLORS.text,
                  }}
                >
                  {opt.label}
                </span>
                {prof === opt.value && <span style={{ marginLeft: "auto", color: COLORS.green, fontSize: 16 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Nome */}
        <div style={{ textAlign: "left", marginBottom: 14 }}>
          <span style={microStyles.lbl()}>Nome completo</span>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            style={microStyles.inp({ padding: "11px 14px", fontSize: 14 })}
          />
        </div>

        {/* CREFITO (opcional) */}
        <div style={{ textAlign: "left", marginBottom: 24 }}>
          <span style={microStyles.lbl()}>
            CREFITO / registro profissional{" "}
            <span style={{ color: COLORS.textDim, fontWeight: 400, textTransform: "none" }}>(opcional)</span>
          </span>
          <input
            type="text"
            value={crefito}
            onChange={(e) => setCrefito(e.target.value)}
            placeholder="Ex: 12345-F"
            style={microStyles.inp({ padding: "11px 14px", fontSize: 14 })}
          />
        </div>

        {/* Entrar */}
        <button
          onClick={handleEnter}
          disabled={!prof || !nome.trim()}
          type="button"
          style={{
            ...microStyles.primaryBtn(),
            width: "100%",
            justifyContent: "center",
            padding: "14px",
            fontSize: 15,
            fontWeight: 800,
            opacity: !prof || !nome.trim() ? 0.4 : 1,
            cursor: !prof || !nome.trim() ? "not-allowed" : "pointer",
          }}
        >
          Entrar no SASYRA →
        </button>

        <p style={{ color: COLORS.textDim, fontSize: 11, marginTop: 24 }}>
          Ao entrar, você declara ser profissional de saúde habilitado
        </p>
      </div>
    </div>
  );
}

export { PROF_LABELS };
