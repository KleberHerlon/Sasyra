import { COLORS, FONTS } from "@/styles/theme";

interface MoneyCellProps {
  label: string;
  suggested: number;
  value: string | null;
  onChange: (val: string | null) => void;
}

const btnStyle = {
  background: "transparent",
  border: `1px solid ${COLORS.purple}44`,
  borderRadius: 6,
  padding: "6px 0",
  flex: "0 0 auto",
  width: 36,
  fontSize: 13,
  fontWeight: 700,
  color: COLORS.purple,
  cursor: "pointer",
  fontFamily: FONTS,
};

export default function MoneyCell({ label, suggested, value, onChange }: MoneyCellProps) {
  const current = value != null ? Number(value) : suggested;
  
  const adjust = (delta: number) => {
    const next = Math.round((current + delta) * 10) / 10;
    if (next < 0) return;
    onChange(String(next));
  };

  return (
    <div
      style={{
        background: COLORS.card,
        borderRadius: 8,
        padding: "8px 10px",
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: COLORS.textMuted,
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button type="button" style={btnStyle} onClick={() => adjust(-50)} title="-50">
          −50
        </button>
        <button type="button" style={btnStyle} onClick={() => adjust(-10)} title="-10">
          −10
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value == null ? "" : value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || /^0$|^[1-9]\d*$|^[1-9]\d*\.\d*$|^0\.\d*$/.test(v)) {
              onChange(v === "" ? null : v);
            }
          }}
          onFocus={(e) => e.target.select()}
          style={{
            flex: 1,
            minWidth: 0,
            boxSizing: "border-box",
            background: "transparent",
            border: `1px solid ${COLORS.purple}55`,
            borderRadius: 8,
            padding: "8px 6px",
            color: COLORS.purple,
            fontWeight: 900,
            fontSize: 14,
            outline: "none",
            textAlign: "center",
          }}
          placeholder={`R$ ${suggested.toFixed(2)}`}
        />
        <button type="button" style={btnStyle} onClick={() => adjust(10)} title="+10">
          +10
        </button>
        <button type="button" style={btnStyle} onClick={() => adjust(50)} title="+50">
          +50
        </button>
      </div>
      {value == null && (
        <div style={{ fontSize: 10, marginTop: 4, color: COLORS.textMuted }}>
          Sugerido: <strong>R$ {suggested.toFixed(2)}</strong>
        </div>
      )}
    </div>
  );
}
