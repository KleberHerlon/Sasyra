import React from "react";
import { microStyles } from "@/styles/theme";

interface SessionCounterProps {
  value: string | undefined;
  onChange: (val: string) => void;
}

export default function SessionCounter({ value, onChange }: SessionCounterProps) {
  return (
    <div>
      <span style={microStyles.lbl()}>Sessões autorizadas</span>
      <input
        type="number"
        min="1"
        max="120"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={microStyles.inp({
          width: "100%",
          textAlign: "center",
          fontSize: 16,
          fontWeight: 700,
          padding: "12px 14px",
        })}
        placeholder="Nº de sessões"
      />
    </div>
  );
}
