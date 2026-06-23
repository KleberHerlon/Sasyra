import { useState } from "react";
import { TestItem } from "@/types";
import { COLORS, FONTS } from "@/styles/theme";

interface TestCardProps {
  test: TestItem;
  result: string;
  onResult: (res: string) => void;
}

export default function TestCard({ test, result, onResult }: TestCardProps) {
  const [open, setOpen] = useState(false);
  const borderColor =
    result === "Positivo"
      ? `${COLORS.red}60`
      : result === "Negativo"
        ? `${COLORS.green}50`
        : COLORS.border;

  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${borderColor}`,
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{test.name}</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{test.desc}</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {test.video && (
            <a
              href={test.video}
              target="_blank"
              rel="noreferrer"
              style={{
                background: COLORS.greenBg,
                border: `1px solid ${COLORS.green}40`,
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 11,
                color: COLORS.green,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              ▶ Vídeo
            </a>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            type="button"
            style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 16, padding: "0 4px" }}
          >
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>
      
      {open && (
        <div
          style={{
            marginTop: 10,
            background: COLORS.card,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 12,
            color: COLORS.text,
            lineHeight: 1.7,
          }}
        >
          <span style={{ color: COLORS.green, fontWeight: 700 }}>Como executar: </span>
          {test.how}
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {["Positivo", "Negativo", "Não realizado"].map((r) => {
          const ac = r === "Positivo" ? COLORS.red : r === "Negativo" ? COLORS.green : COLORS.amber;
          return (
            <button
              key={r}
              type="button"
              onClick={() => onResult(r)}
              style={{
                flex: 1,
                background: result === r ? `${ac}15` : COLORS.card,
                border: `1px solid ${result === r ? ac : COLORS.border}`,
                borderRadius: 8,
                padding: "6px 4px",
                fontSize: 11,
                fontWeight: result === r ? 700 : 400,
                color: result === r ? ac : COLORS.textMuted,
                cursor: "pointer",
                fontFamily: FONTS,
              }}
            >
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
}
