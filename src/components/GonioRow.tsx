import { GonioRow as GonioRowType } from "@/types";
import { JOINTS, MVMT } from "@/data/joints";
import { getRef, isOutOfRange } from "@/utils/gonio";
import { COLORS, microStyles } from "@/styles/theme";

interface GonioRowProps {
  row: GonioRowType;
  onUpdate: (updatedRow: GonioRowType) => void;
  onRemove: () => void;
}

export default function GonioRow({ row, onUpdate, onRemove }: GonioRowProps) {
  const mvts = MVMT[row.joint] || [];
  const ref = getRef(row.movement, row.joint);
  const oor = isOutOfRange(row.value, ref);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.8fr 1.8fr 76px 72px 28px",
        gap: 8,
        alignItems: "center",
        padding: "9px 0",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <select
        value={row.joint}
        onChange={(e) => onUpdate({ ...row, joint: e.target.value, movement: "", value: "" })}
        style={microStyles.sel()}
      >
        <option value="">Articulação…</option>
        {JOINTS.map((j) => (
          <option key={j} value={j}>
            {j}
          </option>
        ))}
      </select>
      
      <select
        value={row.movement}
        onChange={(e) => onUpdate({ ...row, movement: e.target.value })}
        style={microStyles.sel()}
        disabled={!row.joint}
      >
        <option value="">Movimento…</option>
        {mvts.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="0"
        max="360"
        value={row.value}
        onChange={(e) => onUpdate({ ...row, value: e.target.value })}
        style={microStyles.inp({
          textAlign: "center",
          border: `1.5px solid ${oor ? COLORS.red : COLORS.border}`,
          fontWeight: 700,
        })}
        placeholder="°"
      />
      
      <div style={{ fontSize: 11, color: oor ? COLORS.red : COLORS.textMuted, textAlign: "center", fontWeight: oor ? 700 : 400 }}>
        {ref ? `${ref}°` : "—"}
        {oor ? " ⚠" : ""}
      </div>
      
      <button
        onClick={onRemove}
        type="button"
        style={{ background: "none", border: "none", color: COLORS.textDim, fontSize: 18, cursor: "pointer", padding: 0 }}
      >
        ×
      </button>
    </div>
  );
}
