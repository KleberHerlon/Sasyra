export const COLORS = {
  bg:          "#0E141B",
  surface:     "#111822",
  card:        "#19243A",
  cardAlt:     "#162030",
  border:      "#1F2E45",
  borderLight: "#2A3F5C",
  green:       "#4ADE80",
  greenDim:    "#22C55E",
  greenDeep:   "#0D9E5C",
  greenBg:     "rgba(74,222,128,0.09)",
  greenBgHov:  "rgba(74,222,128,0.16)",
  amber:       "#FBBF24",
  amberBg:     "rgba(251,191,36,0.10)",
  red:         "#F87171",
  redBg:       "rgba(248,113,113,0.09)",
  blue:        "#60A5FA",
  blueBg:      "rgba(96,165,250,0.09)",
  purple:      "#A78BFA",
  purpleBg:    "rgba(167,139,250,0.09)",
  text:        "#DDE6F0",
  textSub:     "#A8BECC",
  textMuted:   "#5E7A96",
  textDim:     "#364D62",
  white:       "#FFFFFF",
};

export const FONTS = "'Inter','Segoe UI',system-ui,sans-serif";

export const microStyles = {
  inp: (extra = {}) => ({
    width: "100%",
    boxSizing: "border-box" as const,
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    color: COLORS.text,
    fontSize: 13,
    padding: "9px 12px",
    outline: "none",
    fontFamily: FONTS,
    ...extra
  }),
  sel: (extra = {}) => ({
    ...microStyles.inp(),
    cursor: "pointer",
    ...extra
  }),
  lbl: (extra = {}) => ({
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: COLORS.textMuted,
    marginBottom: 5,
    ...extra
  }),
  cardStyle: (extra = {}) => ({
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: "20px 22px",
    marginBottom: 14,
    ...extra
  }),
  primaryBtn: (extra = {}) => ({
    background: COLORS.green,
    color: "#061A0C",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: FONTS,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    ...extra
  }),
  ghostBtn: (extra = {}) => ({
    background: "transparent",
    color: COLORS.green,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONTS,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    ...extra
  }),
  iconBtn: (active = false, activeColor = COLORS.green, extra = {}) => ({
    background: active ? `${activeColor}18` : COLORS.surface,
    border: `1px solid ${active ? activeColor + "50" : COLORS.border}`,
    color: active ? activeColor : COLORS.textMuted,
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    fontFamily: FONTS,
    transition: "all 0.12s",
    ...extra
  })
};
