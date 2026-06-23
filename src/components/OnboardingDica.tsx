import { useState } from "react";
import { COLORS } from "@/styles/theme";

interface Dica {
  icon?: string;
  titulo: string;
  texto: string;
}

interface OnboardingDicaProps {
  dicas: Dica[];
  storageKey: string;
}

export default function OnboardingDica({ dicas, storageKey }: OnboardingDicaProps) {
  const [step, setStep] = useState<number>(() => {
    if (typeof window === "undefined") return -1;
    const done = localStorage.getItem("sasyra_onboarding_" + storageKey);
    return done ? -1 : 0;
  });

  if (step < 0 || step >= dicas.length) return null;
  const dica = dicas[step];

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${COLORS.greenBg}, ${COLORS.blueBg})`,
        border: `1px solid ${COLORS.green}30`,
        borderRadius: 10,
        padding: "10px 14px",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
      }}
    >
      <span style={{ fontSize: 16 }}>{dica.icon || "💡"}</span>
      <div style={{ flex: 1, color: COLORS.textSub, lineHeight: 1.5 }}>
        <strong style={{ color: COLORS.text }}>{dica.titulo}</strong>: {dica.texto}
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {step < dicas.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            type="button"
            style={{
              background: COLORS.green,
              border: "none",
              color: "#061A0C",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Próximo →
          </button>
        ) : (
          <button
            onClick={() => {
              localStorage.setItem("sasyra_onboarding_" + storageKey, "1");
              setStep(-1);
            }}
            type="button"
            style={{
              background: COLORS.green,
              border: "none",
              color: "#061A0C",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ✓ Entendi
          </button>
        )}
        <button
          onClick={() => {
            localStorage.setItem("sasyra_onboarding_" + storageKey, "1");
            setStep(-1);
          }}
          type="button"
          style={{
            background: "none",
            border: "none",
            color: COLORS.textMuted,
            fontSize: 10,
            cursor: "pointer",
            padding: "4px 6px",
          }}
        >
          Fechar ×
        </button>
      </div>
    </div>
  );
}
