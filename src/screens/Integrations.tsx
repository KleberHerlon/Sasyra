// @ts-nocheck
import { useState } from "react";
import { useIntegrations } from "../hooks/useIntegrations";

const C = {
  bg: "var(--bg)", surface: "var(--surface)", card: "var(--card)", cardAlt: "var(--cardAlt)",
  border: "var(--border)", green: "var(--green)", greenBg: "var(--greenBg)",
  text: "var(--text)", textSub: "var(--textSub)", textMuted: "var(--textMuted)",
  amber: "var(--amber)", amberBg: "var(--amberBg)", red: "var(--red)", redBg: "var(--redBg)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";
const ghostBtn = (e = {}) => ({ background: "transparent", color: C.green, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 6, ...e });
const cardStyle = (e = {}) => ({ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14, ...e });

export default function Integrations({ onNavigate }) {
  const { googleCalendar, whatsApp } = useIntegrations();

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: F, color: C.text }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 60 }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>SASYRA — Integrações</span>
        <button onClick={() => onNavigate?.("back")} style={ghostBtn({ padding: "6px 12px", fontSize: 12 })}>← Voltar</button>
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px", color: C.text }}>🔗 Integrações</h2>
        <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 24px", lineHeight: 1.6 }}>
          Conecte ferramentas externas para automatizar lembretes, sincronizar agenda e notificar pacientes.
        </p>

        {/* Google Calendar */}
        <div style={cardStyle()}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <span style={{ fontSize: 32 }}>📅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Google Calendar</div>
              <div style={{ fontSize: 12, color: C.textSub }}>Sincronize consultas automaticamente com sua agenda Google</div>
            </div>
            {!googleCalendar.configured ? (
              <span style={{ fontSize: 11, color: C.amber, background: C.amberBg, borderRadius: 6, padding: "4px 10px", fontWeight: 700 }}>
                ⚙️ Configurar
              </span>
            ) : googleCalendar.connected ? (
              <button onClick={googleCalendar.disconnect} style={{ ...ghostBtn({ padding: "6px 14px", fontSize: 11, color: C.red, borderColor: C.red + "40" }) }}>
                Desconectar
              </button>
            ) : (
              <button onClick={googleCalendar.connect} style={{ ...ghostBtn({ padding: "6px 14px", fontSize: 11 }) }}>
                Conectar
              </button>
            )}
          </div>
          {!googleCalendar.configured && (
            <div style={{ fontSize: 11, color: C.textMuted, background: C.cardAlt, borderRadius: 8, padding: "12px", lineHeight: 1.5 }}>
              Para ativar: crie um projeto no Google Cloud Console, ative a Calendar API,
              {' '}adicione <code style={{ background: C.bg, padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>{window.location.origin}/oauth-callback.html</code> como redirect autorizado
              {' '}e defina <code style={{ background: C.bg, padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>VITE_GOOGLE_CLIENT_ID</code> no .env.
            </div>
          )}
        </div>

        {/* WhatsApp */}
        <div style={cardStyle()}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <span style={{ fontSize: 32 }}>💬</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>WhatsApp</div>
              <div style={{ fontSize: 12, color: C.textSub }}>Envie lembretes de consulta e código de acesso automaticamente</div>
            </div>
            {whatsApp.configured ? (
              <span style={{ fontSize: 11, color: C.green, background: C.greenBg, borderRadius: 6, padding: "4px 10px", fontWeight: 700 }}>
                ✅ Conectado
              </span>
            ) : (
              <span style={{ fontSize: 11, color: C.amber, background: C.amberBg, borderRadius: 6, padding: "4px 10px", fontWeight: 700 }}>
                ⚙️ Configurar
              </span>
            )}
          </div>
          {!whatsApp.configured && (
            <div style={{ fontSize: 11, color: C.textMuted, background: C.cardAlt, borderRadius: 8, padding: "12px", lineHeight: 1.5 }}>
              Para ativar: crie uma conta WhatsApp Business API, crie os templates de mensagem e defina
              {' '}<code style={{ background: C.bg, padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>VITE_WHATSAPP_TOKEN</code> e
              {' '}<code style={{ background: C.bg, padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>VITE_WHATSAPP_PHONE_ID</code> no .env.
            </div>
          )}
        </div>

        {/* Patient App */}
        <div style={cardStyle()}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>📱</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>App do Paciente</div>
              <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>
                Seus pacientes podem acompanhar treinos, avaliações e evolução pelo celular.
                <br />
                <span style={{ fontSize: 11, color: C.textMuted }}>Compartilhe o código de acesso pelo módulo de treino → "Compartilhar"</span>
              </div>
            </div>
            <span style={{ fontSize: 11, color: C.green, background: C.greenBg, borderRadius: 6, padding: "4px 10px", fontWeight: 700 }}>
              ✅ Ativo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
