import React from "react";
import { COLORS } from "@/styles/theme";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  featureName: string;
  featureDesc: string;
  onUpgrade?: () => void;
}

export default function PaywallModal({
  open,
  onClose,
  featureName,
  featureDesc,
  onUpgrade,
}: PaywallModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: "32px 28px",
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🔒</div>
        <h2
          style={{
            margin: "0 0 4px",
            fontSize: 20,
            fontWeight: 800,
            color: COLORS.text,
            fontFamily: "'Inter','Segoe UI',sans-serif",
          }}
        >
          {featureName} disponível apenas no <span style={{ color: COLORS.green }}>Plano IA Premium</span>
        </h2>
        {featureDesc && (
          <p
            style={{
              fontSize: 13,
              color: COLORS.textMuted,
              lineHeight: 1.6,
              margin: "12px 0 20px",
              fontFamily: "'Inter','Segoe UI',sans-serif",
            }}
          >
            {featureDesc}
          </p>
        )}
        <div
          style={{
            fontSize: 11,
            color: COLORS.textMuted,
            lineHeight: 1.5,
            margin: "0 0 16px",
            fontFamily: "'Inter','Segoe UI',sans-serif",
          }}
        >
          🔹 Assine o <strong>IA Premium (R$ 79,90/mês)</strong> — 300 análises/mês inclusas
          <br />
          🔹 Ou pague <strong>R$ 4,90 por análise avulsa</strong> no seu plano atual
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => {
              onUpgrade?.();
              onClose?.();
            }}
            type="button"
            style={{
              background: COLORS.green,
              color: "#061A0C",
              border: "none",
              borderRadius: 10,
              padding: "12px 24px",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "'Inter','Segoe UI',sans-serif",
            }}
          >
            🔓 Ver Opções com IA
          </button>
          <button
            onClick={onClose}
            type="button"
            style={{
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.textMuted,
              cursor: "pointer",
              fontFamily: "'Inter','Segoe UI',sans-serif",
            }}
          >
            Continuar sem IA
          </button>
        </div>
      </div>
    </div>
  );
}
