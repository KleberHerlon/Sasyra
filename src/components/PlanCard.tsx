import React from "react";
import { COLORS } from "@/styles/theme";

interface Feature {
  label: string;
  value: string;
  note?: string;
  [key: string]: any; // Allow the index signature for plan mapping
}

interface Plan {
  key: string;
  name: string;
  tagline: string;
  highlight?: boolean;
  badge?: string;
  featuredNote?: string;
  monthly: number;
  yearlyMonth: number;
  yearly: number;
  features: Record<string, Feature>;
}

interface PlanCardProps {
  plan: Plan;
  isAnnual: boolean;
  onSelect?: (key: string) => void;
  isCurrent: boolean;
}

export default function PlanCard({ plan, isAnnual, onSelect, isCurrent }: PlanCardProps) {
  const isPremium = plan.key === "ia";
  const accent = isPremium ? COLORS.amber : COLORS.green;
  const accentBg = isPremium ? COLORS.amberBg : COLORS.greenBg;
  const allFeatures = Object.entries(plan.features);
  const unlocked = allFeatures.filter(([, f]) => f[plan.key]);
  const locked = allFeatures.filter(([, f]) => !f[plan.key]);

  return (
    <div
      style={{
        flex: 1,
        minWidth: 270,
        background: isPremium ? COLORS.card : plan.highlight ? COLORS.card : COLORS.surface,
        border: isPremium
          ? `2px solid ${COLORS.amber}99`
          : plan.highlight
            ? `1px solid ${COLORS.green}60`
            : `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: "28px 22px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        boxShadow: isPremium
          ? `0 0 40px ${COLORS.amber}25, inset 0 0 0 1px ${COLORS.amber}15`
          : plan.highlight
            ? `0 0 30px ${COLORS.green}15`
            : "none",
      }}
    >
      {plan.badge && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: -28,
            background: isPremium ? COLORS.amber : COLORS.green,
            color: "#061A0C",
            fontSize: 10,
            fontWeight: 800,
            padding: "4px 32px",
            transform: "rotate(45deg)",
            letterSpacing: "0.05em",
            fontFamily: "'Inter','Segoe UI',sans-serif",
          }}
        >
          {plan.badge}
        </div>
      )}
      {isPremium ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg,transparent,${COLORS.amber},transparent)`,
          }}
        />
      ) : plan.highlight ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg,transparent,${COLORS.green},transparent)`,
          }}
        />
      ) : null}
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: COLORS.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 4,
          fontFamily: "'Inter','Segoe UI',sans-serif",
        }}
      >
        {plan.name}
      </div>
      <div
        style={{
          fontSize: 13,
          color: COLORS.textMuted,
          marginBottom: 12,
          fontFamily: "'Inter','Segoe UI',sans-serif",
        }}
      >
        {plan.tagline}
      </div>

      {plan.featuredNote && (
        <div
          style={{
            fontSize: 11,
            color: COLORS.text,
            lineHeight: 1.5,
            marginBottom: 16,
            padding: "8px 10px",
            background: accentBg,
            borderRadius: 8,
            fontFamily: "'Inter','Segoe UI',sans-serif",
          }}
        >
          {plan.featuredNote}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        {isAnnual ? (
          <>
            <span
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: isPremium ? COLORS.amber : COLORS.text,
                fontFamily: "'Inter','Segoe UI',sans-serif",
              }}
            >
              R$ {plan.yearlyMonth.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: 13,
                color: COLORS.textMuted,
                marginLeft: 4,
                fontFamily: "'Inter','Segoe UI',sans-serif",
              }}
            >
              /mês
            </span>
            <div
              style={{
                fontSize: 11,
                color: COLORS.amber,
                marginTop: 4,
                fontFamily: "'Inter','Segoe UI',sans-serif",
              }}
            >
              <s style={{ color: COLORS.textMuted }}>R$ {plan.monthly.toFixed(2)}</s> — 20% de
              desconto
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textMuted,
                marginTop: 2,
                fontFamily: "'Inter','Segoe UI',sans-serif",
              }}
            >
              {" "}
              Cobrado R$ {plan.yearly.toFixed(2)}/ano
            </div>
          </>
        ) : (
          <>
            <span
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: isPremium ? COLORS.amber : COLORS.text,
                fontFamily: "'Inter','Segoe UI',sans-serif",
              }}
            >
              R$ {plan.monthly.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: 13,
                color: COLORS.textMuted,
                marginLeft: 4,
                fontFamily: "'Inter','Segoe UI',sans-serif",
              }}
            >
              /mês
            </span>
          </>
        )}
      </div>

      {/* Unlocked features */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 6,
            fontFamily: "'Inter','Segoe UI',sans-serif",
          }}
        >
          ✓ Incluso
        </div>
        {unlocked.map(([key, feat]) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 6,
              fontFamily: "'Inter','Segoe UI',sans-serif",
            }}
          >
            <span style={{ fontSize: 14, lineHeight: "1.3", flexShrink: 0, color: accent }}>
              ✅
            </span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{feat.label}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>{feat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Locked features */}
      {locked.length > 0 && (
        <div style={{ marginBottom: 8, padding: "8px 10px", background: COLORS.amberBg, borderRadius: 8 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: COLORS.amber,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 4,
              fontFamily: "'Inter','Segoe UI',sans-serif",
            }}
          >
            ⚠️ Não incluso
          </div>
          {locked.map(([key, feat]) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                marginBottom: 3,
                fontFamily: "'Inter','Segoe UI',sans-serif",
              }}
            >
              <span style={{ fontSize: 11, lineHeight: "1.5", color: COLORS.amber }}>✕</span>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                {feat.label}:{" "}
                <strong style={{ color: COLORS.amber }}>{feat.note || feat.value}</strong>
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => onSelect?.(plan.key)}
        type="button"
        style={{
          marginTop: "auto",
          width: "100%",
          background: isCurrent
            ? COLORS.border
            : isPremium
              ? COLORS.amber
              : plan.highlight
                ? COLORS.green
                : "transparent",
          color: isCurrent
            ? COLORS.textMuted
            : isPremium
              ? "#1a1400"
              : plan.highlight
                ? "#061A0C"
                : COLORS.green,
          border: `1px solid ${isCurrent ? COLORS.border : isPremium ? COLORS.amber : COLORS.green + "50"}`,
          borderRadius: 10,
          padding: "12px 16px",
          fontSize: 14,
          fontWeight: 800,
          cursor: isCurrent ? "default" : "pointer",
          fontFamily: "'Inter','Segoe UI',sans-serif",
          transition: "all 0.12s",
        }}
      >
        {isCurrent ? "✓ Plano Atual" : plan.key === "start" ? "Ativar Start" : "Adquirir Plano"}
      </button>
    </div>
  );
}
