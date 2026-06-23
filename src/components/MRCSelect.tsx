import React from "react";
import { microStyles } from "@/styles/theme";

interface MRCSelectProps {
  value: string;
  onChange: (val: string) => void;
}

export default function MRCSelect({ value, onChange }: MRCSelectProps) {
  const grades = [
    "0 – Sem contração",
    "1 – Frêmito",
    "2 – Sem gravidade",
    "3 – Contra gravidade",
    "4 – Resistência parcial",
    "5 – Normal",
  ];

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={microStyles.sel()}>
      <option value="">MRC…</option>
      {grades.map((g, i) => (
        <option key={i} value={String(i)}>
          {g}
        </option>
      ))}
    </select>
  );
}
