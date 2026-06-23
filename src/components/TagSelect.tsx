import { COLORS, microStyles } from "@/styles/theme";

interface Option {
  value: string;
  label: string;
}

interface TagSelectProps {
  options: (string | Option)[];
  value: string[];
  onChange: (val: string[]) => void;
  activeColor?: string;
}

export function TagSelect({ options, value, onChange, activeColor = COLORS.green }: TagSelectProps) {
  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        const active = value.includes(v);
        return (
          <button
            key={v}
            type="button"
            onClick={() => toggle(v)}
            style={microStyles.iconBtn(active, activeColor)}
          >
            {active && <span style={{ fontSize: 10 }}>✓ </span>}
            {l}
          </button>
        );
      })}
    </div>
  );
}

interface SingleSelectProps {
  options: (string | Option)[];
  value: string;
  onChange: (val: string) => void;
  activeColor?: string;
}

export function SingleSelect({ options, value, onChange, activeColor = COLORS.green }: SingleSelectProps) {
  const handleClick = (v: string) => {
    onChange(value === v ? "" : v);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => handleClick(v)}
            style={microStyles.iconBtn(active, activeColor)}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
