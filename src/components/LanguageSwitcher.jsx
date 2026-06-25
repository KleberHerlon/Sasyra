import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ styles }) {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <div style={{ display:"flex", gap:4, alignItems:"center", ...styles }}>
      <button onClick={() => i18n.changeLanguage("pt-BR")}
        style={{
          background: current === "pt-BR" ? "var(--greenBg, rgba(74,222,128,0.12))" : "transparent",
          border: current === "pt-BR" ? "1px solid var(--green, #4ADE80)" : "1px solid var(--border, #1F2E45)",
          borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: current === "pt-BR" ? 700 : 400,
          color: current === "pt-BR" ? "var(--green, #4ADE80)" : "var(--textMuted, #5E7A96)",
          cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
        }}>
        🇧🇷 PT
      </button>
      <button onClick={() => i18n.changeLanguage("en")}
        style={{
          background: current === "en" ? "var(--greenBg, rgba(74,222,128,0.12))" : "transparent",
          border: current === "en" ? "1px solid var(--green, #4ADE80)" : "1px solid var(--border, #1F2E45)",
          borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: current === "en" ? 700 : 400,
          color: current === "en" ? "var(--green, #4ADE80)" : "var(--textMuted, #5E7A96)",
          cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
        }}>
        🇺🇸 EN
      </button>
    </div>
  );
}
