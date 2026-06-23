import React, { useState } from "react";
import { COLORS, FONTS } from "@/styles/theme";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ text, children, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const positions = {
    top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 6 },
    bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 6 },
    left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 6 },
    right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 6 },
  };

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            ...positions[position],
            zIndex: 9999,
            background: COLORS.textSub,
            color: COLORS.bg,
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            fontFamily: FONTS,
            lineHeight: 1.4,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
