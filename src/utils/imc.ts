import { COLORS } from "@/styles/theme";

export function calcIMC(peso: string | undefined, altura: string | undefined) {
  const p = parseFloat(peso || ""), h = parseFloat(altura || "") / 100;
  if (!p || !h || h <= 0) return null;
  const v = p / (h * h);
  const cat = v < 18.5 
    ? { l: "Baixo peso", c: COLORS.blue } 
    : v < 25 
      ? { l: "Peso normal", c: COLORS.green } 
      : v < 30 
        ? { l: "Sobrepeso", c: COLORS.amber } 
        : { l: "Obeso", c: COLORS.red };
  return { value: v.toFixed(1), ...cat };
}
