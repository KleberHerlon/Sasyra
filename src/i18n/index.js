import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json";

const savedLang = localStorage.getItem("sasyra_lang");
const browserLang = navigator.language?.startsWith("pt") ? "pt-BR" : "en";

i18n.use(initReactI18next).init({
  resources: { "pt-BR": { translation: ptBR }, en: { translation: en } },
  lng: savedLang || browserLang || "pt-BR",
  fallbackLng: "pt-BR",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("sasyra_lang", lng);
  document.documentElement.lang = lng;
});

export default i18n;
