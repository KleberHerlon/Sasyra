import { COLORS, microStyles } from "@/styles/theme";

interface EvaSliderProps {
  label: string;
  value: number | null | string;
  onChange: (val: number) => void;
}

export default function EvaSlider({ label, value, onChange }: EvaSliderProps) {
  const isDefined = value !== null && value !== undefined && value !== "";
  const currentVal = isDefined ? Number(value) : 0;
  const pct = (currentVal / 10) * 100;
  const color = !isDefined
    ? COLORS.textDim
    : currentVal <= 3
      ? COLORS.green
      : currentVal <= 6
        ? COLORS.amber
        : COLORS.red;
  const faces = ["😌", "😐", "😟", "😣", "😭"];
  const face = isDefined ? faces[Math.min(4, Math.floor(currentVal / 2.5))] : "⚪";
  const desc = !isDefined
    ? "Não avaliado"
    : currentVal === 0
      ? "Sem dor"
      : currentVal <= 3
        ? "Leve"
        : currentVal <= 6
          ? "Moderada"
          : currentVal <= 8
            ? "Intensa"
            : "Máxima";

  return (
    <div style={{ opacity: isDefined ? 1 : 0.6, transition: "opacity 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={microStyles.lbl()}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>{face}</span>
          <span style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1 }}>
            {isDefined ? currentVal : "—"}
          </span>
          <span style={{ fontSize: 10, color: COLORS.textMuted }}>
            {isDefined ? `/10 · ${desc}` : desc}
          </span>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          height: 8,
          background: COLORS.surface,
          borderRadius: 99,
          border: `1px solid ${COLORS.border}`,
          marginBottom: 4,
        }}
      >
        {isDefined && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${COLORS.green}, ${color})`,
              borderRadius: 99,
              transition: "width 0.1s",
            }}
          />
        )}
      </div>
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={currentVal}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: isDefined ? color : COLORS.border,
          cursor: "pointer",
          marginBottom: 2,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.textDim }}>
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}
