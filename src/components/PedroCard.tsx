import { Study } from "@/types";
import { COLORS } from "@/styles/theme";

interface PedroCardProps {
  study: Study;
}

export default function PedroCard({ study }: PedroCardProps) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.borderLight}`,
        borderRadius: 8,
        padding: "10px 14px",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 3 }}>
            {study.titulo}
          </div>
          <div style={{ fontSize: 11, color: COLORS.textSub, lineHeight: 1.5 }}>
            {study.conclusao}
          </div>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.green }}>{study.pontuacao}</div>
          <div style={{ fontSize: 9, color: COLORS.textMuted, fontWeight: 700 }}>/10 PEDro</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 10,
            color: COLORS.amber,
            background: COLORS.amberBg,
            border: `1px solid ${COLORS.amber}30`,
            borderRadius: 6,
            padding: "2px 8px",
          }}
        >
          {study.id}
        </span>
        <span
          style={{
            fontSize: 10,
            color: COLORS.textMuted,
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            padding: "2px 8px",
          }}
        >
          {study.fonte}
        </span>
      </div>
    </div>
  );
}
