import { useState, useEffect, useRef, MouseEvent } from "react";
import { COLORS, FONTS, microStyles } from "@/styles/theme";

interface AudioFieldProps {
  value: string;
  onChange: (val: string | ((prev: string) => string)) => void;
  placeholder?: string;
  rows?: number;
}

export default function AudioField({ value, onChange, placeholder, rows = 3 }: AudioFieldProps) {
  const [rec, setRec] = useState(false);
  const [supported, setSupported] = useState(false);
  const rRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const r = new SpeechRecognition();
    r.lang = "pt-BR";
    r.continuous = true;
    r.interimResults = false;

    r.onresult = (e: any) => {
      const t = Array.from(e.results)
        .slice(e.resultIndex)
        .map((x: any) => x[0].transcript)
        .join(" ");
      onChange((p) => (p ? p + " " + t : t));
    };

    r.onend = () => setRec(false);
    rRef.current = r;
  }, [onChange]);

  const toggle = (e: MouseEvent) => {
    if (!rRef.current) return;
    if (rec) {
      rRef.current.stop();
      setRec(false);
    } else {
      rRef.current.start();
      setRec(true);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...microStyles.inp({ resize: "vertical", lineHeight: 1.6 }),
          paddingRight: supported ? 96 : 12,
        }}
      />
      {supported && (
        <button
          onClick={toggle}
          title={rec ? "Parar ditação" : "Ditar por voz"}
          type="button"
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            background: rec ? COLORS.redBg : COLORS.greenBg,
            border: `1px solid ${rec ? COLORS.red : COLORS.green}50`,
            borderRadius: 8,
            padding: "6px 8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            color: rec ? COLORS.red : COLORS.green,
            fontFamily: FONTS,
            fontWeight: 700,
          }}
        >
          {rec ? "⏹ Stop" : "🎙 Ditar"}
        </button>
      )}
    </div>
  );
}
