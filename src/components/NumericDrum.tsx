import { COLORS, microStyles } from "@/styles/theme";

interface NumericDrumProps {
  value: string | number;
  onChange: (val: number | string) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  label: string;
}

export default function NumericDrum({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  label,
}: NumericDrumProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(value) || min;

  const inc = () => {
    const nextValue = Math.min(max, numericValue + step);
    onChange(nextValue);
  };

  const dec = () => {
    const nextValue = Math.max(min, numericValue - step);
    onChange(nextValue);
  };

  return (
    <div>
      <span style={microStyles.lbl()}>{label}</span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <button
          onClick={dec}
          type="button"
          style={{
            background: "none",
            border: "none",
            color: COLORS.textMuted,
            fontSize: 18,
            padding: "0 14px",
            cursor: "pointer",
            height: 44,
            display: "flex",
            alignItems: "center",
            borderRight: `1px solid ${COLORS.border}`,
          }}
        >
          −
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value)}
            style={{
              ...microStyles.inp(),
              border: "none",
              background: "transparent",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 800,
              color: COLORS.text,
              padding: "10px 4px",
            }}
          />
        </div>
        <span style={{ fontSize: 12, color: COLORS.textMuted, paddingRight: 10, paddingLeft: 4 }}>
          {unit}
        </span>
        <button
          onClick={inc}
          type="button"
          style={{
            background: "none",
            border: "none",
            color: COLORS.green,
            fontSize: 18,
            padding: "0 14px",
            cursor: "pointer",
            height: 44,
            display: "flex",
            alignItems: "center",
            borderLeft: `1px solid ${COLORS.border}`,
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
