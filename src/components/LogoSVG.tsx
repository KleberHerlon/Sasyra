import { COLORS, FONTS } from "@/styles/theme";

export default function LogoSVG() {
  return (
    <svg viewBox="0 0 320 56" width="195" height="44" style={{ display: "block" }}>
      <g transform="translate(26,28)">
        <line x1="0" y1="-22" x2="0" y2="22" stroke={COLORS.textDim} strokeWidth="1.5" strokeDasharray="2 5" />
        <path d="M -17 11 C -9 3,0 0,17 -11" fill="none" stroke={COLORS.green} strokeWidth="4" strokeLinecap="round" />
        <path d="M -17 -4 C -4 0,4 3,17 12" fill="none" stroke={COLORS.greenDim} strokeWidth="3" strokeLinecap="round" />
        <path d="M -10 19 C -3 10,3 -5,13 -19" fill="none" stroke={COLORS.greenDeep} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="4.8" fill={COLORS.amber} />
      </g>
      <text x="58" y="40" fill={COLORS.white} fontSize="30" fontWeight="900" letterSpacing="7" fontFamily={FONTS}>
        SASYRA
      </text>
      <text x="40" y="52" fill={COLORS.green} fontSize="11" fontWeight="800" letterSpacing="5" fontFamily={FONTS}>
        REABILITAÇÃO E EVIDÊNCIA
      </text>
    </svg>
  );
}
