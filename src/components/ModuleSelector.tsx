import React, { useState } from "react";
import { User } from "@/types";
import { COLORS, FONTS, microStyles } from "@/styles/theme";

interface ModuleSelectorProps {
  user: User;
  onSelect: (module: string) => void;
  onLogout: () => void;
}

export default function ModuleSelector({ user, onSelect, onLogout }: ModuleSelectorProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(() => {
    if (user.prof === "fisio") return "fisioterapia";
    if (user.prof === "to") return "terapiaOcupacional";
    if (user.prof === "educFisico") return "educacaoFisica";
    if (user.prof === "nutricionista") return "nutricao";
    if (user.prof === "pediatria") return "pediatria";
    if (user.prof === "crossfit") return "crossfit";
    if (user.prof === "neurofuncional") return "neuro";
    return null;
  });

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
      <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
        <div style={{ marginBottom: 8 }}>
          <svg viewBox="0 0 400 70" width="280" height="54" style={{ display: "block", margin: "0 auto" }}>
            <g transform="translate(78,36)">
              <line x1="0" y1="-28" x2="0" y2="28" stroke={COLORS.textDim} strokeWidth="1.5" strokeDasharray="2 5" />
              <path d="M -20 14 C -10 4,0 0,20 -14" fill="none" stroke={COLORS.green} strokeWidth="5" strokeLinecap="round" />
              <path d="M -20 -5 C -5 0,5 4,20 15" fill="none" stroke={COLORS.greenDim} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M -12 24 C -4 13,4 -6,15 -24" fill="none" stroke={COLORS.greenDeep} strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="0" r="6" fill={COLORS.amber} />
            </g>
            <text x="200" y="50" fill={COLORS.text} fontSize="32" fontWeight="900" letterSpacing="8" fontFamily={FONTS} textAnchor="middle">
              SASYRA
            </text>
          </svg>
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>Olá, {user.nome}</div>
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>
            {user.prof}
            {user.crefito ? ` · ${user.crefito}` : ""}
          </div>
        </div>
        <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          Selecione o módulo de atendimento:
        </p>
        {[
          {
            id: "fisioterapia",
            icon: "🦵",
            title: "Fisioterapia",
            desc: "Avaliação ortopédica, escalas funcionais, CIF, diário de evolução e prescrição baseada em evidências",
            color: COLORS.green,
          },
          {
            id: "terapiaOcupacional",
            icon: "🤲",
            title: "Terapia Ocupacional",
            desc: "Avaliação de AVDs/AIVDs, COPM, MIF, função manual, cognição e reabilitação baseada em evidências",
            color: COLORS.purple,
          },
          {
            id: "educacaoFisica",
            icon: "🏃",
            title: "Educação Física / Performance",
            desc: "Avaliação física (Pollock, VO₂máx, 1RM), prescrição automatizada de treino e periodização baseada no ACSM",
            color: COLORS.blue,
          },
          {
            id: "nutricao",
            icon: "🥗",
            title: "Nutrição Clínica",
            desc: "Avaliação antropométrica, BIA, recordatório alimentar, gasto energético, exames bioquímicos e plano alimentar baseado em evidências",
            color: COLORS.amber,
          },
          {
            id: "pediatria",
            icon: "👶",
            title: "Pediatria",
            desc: "Fisioterapia pediátrica: desenvolvimento motor, escalas GMFCS/AIMS/M-CHAT, marcos motores e plano terapêutico infantil",
            color: COLORS.blue,
          },
          {
            id: "crossfit",
            icon: "💪",
            title: "CrossFit",
            desc: "Treinamento e performance: WODs, benchmarks, 1RM olímpico, RPE, periodização e prevenção de lesões em atletas",
            color: COLORS.amber,
          },
          {
            id: "neuro",
            icon: "🧠",
            title: "Neurofuncional",
            desc: "Reabilitação neurológica: escalas (MAS, BBS, MIF), avaliação de marcha, tônus, coordenação e treino funcional",
            color: COLORS.purple,
          },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedModule(m.id)}
            type="button"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 16,
              textAlign: "left",
              padding: "18px 20px",
              marginBottom: 12,
              background: selectedModule === m.id ? `${m.color}18` : COLORS.card,
              border: selectedModule === m.id ? `2px solid ${m.color}70` : `1px solid ${COLORS.border}`,
              borderRadius: 14,
              cursor: "pointer",
              fontFamily: FONTS,
              color: COLORS.text,
              transition: "all 0.12s",
            }}
          >
            <div style={{ fontSize: 28, flexShrink: 0 }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: selectedModule === m.id ? m.color : COLORS.text,
                  marginBottom: 3,
                }}
              >
                {m.title}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{m.desc}</div>
            </div>
            {selectedModule === m.id && <span style={{ fontSize: 18, color: m.color }}>✓</span>}
          </button>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            onClick={onLogout}
            type="button"
            style={{
              ...microStyles.ghostBtn(),
              flex: 1,
              justifyContent: "center",
              padding: "12px",
            }}
          >
            Sair
          </button>
          <button
            onClick={() => selectedModule && onSelect(selectedModule)}
            disabled={!selectedModule}
            type="button"
            style={{
              ...microStyles.primaryBtn(),
              flex: 1,
              justifyContent: "center",
              padding: "12px",
              fontSize: 14,
              opacity: !selectedModule ? 0.4 : 1,
              cursor: !selectedModule ? "not-allowed" : "pointer",
            }}
          >
            Acessar Módulo →
          </button>
        </div>
      </div>
    </div>
  );
}
