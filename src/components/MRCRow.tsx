import React from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import MRCSelect from "@/components/MRCSelect";
import { COLORS, microStyles } from "@/styles/theme";

export interface MRCRowType {
  id: number | string;
  muscle: string;
  value: string;
}

export const MUSCLES = [
  { id: "quadricepsD", label: "Quadríceps D" },
  { id: "quadricepsE", label: "Quadríceps E" },
  { id: "isquiotibialD", label: "Isquiotibiais D" },
  { id: "isquiotibialE", label: "Isquiotibiais E" },
  { id: "gluteoD", label: "Glúteo D" },
  { id: "gluteoE", label: "Glúteo E" },
  { id: "manguitoD", label: "Manguito Rotador D" },
  { id: "manguitoE", label: "Manguito Rotador E" },
  { id: "tibialAnterior", label: "Tibial Anterior" },
  { id: "gastrocnemio", label: "Gastrocnêmio" },
  { id: "bicepsD", label: "Bíceps Braquial D" },
  { id: "bicepsE", label: "Bíceps Braquial E" },
];

interface MRCRowProps {
  row: MRCRowType;
  onUpdate: (row: MRCRowType) => void;
  onRemove: () => void;
}

export default function MRCRow({ row, onUpdate, onRemove }: MRCRowProps) {
  const isMobile = useMediaQuery("(max-width:767px)");
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 100px 28px" : "2fr 200px 28px",
        gap: 8,
        alignItems: "center",
        padding: "9px 0",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <select
        value={row.muscle}
        onChange={(e) => onUpdate({ ...row, muscle: e.target.value })}
        style={microStyles.sel()}
      >
        <option value="">Músculo…</option>
        {MUSCLES.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
      <MRCSelect value={row.value} onChange={(v) => onUpdate({ ...row, value: v })} />
      <button
        onClick={onRemove}
        type="button"
        style={{
          background: "none",
          border: "none",
          color: COLORS.textDim,
          fontSize: 18,
          cursor: "pointer",
          padding: 0,
          justifySelf: "center",
        }}
      >
        ×
      </button>
    </div>
  );
}
