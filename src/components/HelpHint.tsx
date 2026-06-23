import { useState } from "react";
import { COLORS, FONTS } from "@/styles/theme";

interface HelpHintProps {
  text: string;
  icon?: string;
}

export default function HelpHint({ text, icon = "💡" }: HelpHintProps) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", cursor: "pointer" }}
      onClick={() => setShow((s) => !s)}
    >
      <span style={{ fontSize: 11, opacity: 0.6 }}>{icon}</span>
      {show && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 9999,
            marginTop: 4,
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 11,
            color: COLORS.textSub,
            lineHeight: 1.5,
            minWidth: 200,
            maxWidth: 280,
            fontWeight: 400,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            fontFamily: FONTS,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {text}
        </div>
      )}
    </span>
  );
}
