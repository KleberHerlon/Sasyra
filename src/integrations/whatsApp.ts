// @ts-nocheck
// ════════════════════════════════════════════════════════════
// WhatsApp Integration — Service Layer
// ════════════════════════════════════════════════════════════
// Para ativar:
//   1. Crie conta em https://business.whatsapp.com
//   2. Obtenha token de acesso permanente
//   3. Defina VITE_WHATSAPP_TOKEN e VITE_WHATSAPP_PHONE_ID no .env
//   4. Crie templates de mensagem no painel WABA
// ════════════════════════════════════════════════════════════

const API_VERSION = "v22.0";
const PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_ID || "";
const ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_TOKEN || "";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

export function isWhatsAppConfigured() {
  return !!(PHONE_NUMBER_ID && ACCESS_TOKEN);
}

function formatPhone(phone) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("55") ? d : `55${d}`;
}

async function sendTemplate(to, templateName, params = {}) {
  if (!isWhatsAppConfigured()) {
    console.info("[WhatsApp] Não configurado — mensagem não enviada:", { to, templateName });
    return null;
  }
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: formatPhone(to),
    type: "template",
    template: {
      name: templateName,
      language: { code: "pt_BR" },
      components: [
        {
          type: "body",
          parameters: Object.entries(params).map(([_, v]) => ({ type: "text", text: String(v) })),
        },
      ],
    },
  };
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`WhatsApp API error: ${res.status}`);
    return res.json();
  } catch (e) {
    console.error("[WhatsApp] Erro ao enviar:", e);
    return null;
  }
}

// ── Templates (devem ser criados no painel WABA) ──────────

export async function sendAppointmentReminder(phone, patientName, date, time, professional) {
  return sendTemplate(phone, "lembrete_consulta", {
    patient_name: patientName,
    date,
    time,
    professional: professional || "SASYRA",
  });
}

export async function sendEvaluationReminder(phone, patientName, date) {
  return sendTemplate(phone, "lembrete_avaliacao", {
    patient_name: patientName,
    date,
  });
}

export async function sendPaymentConfirmation(phone, patientName, amount) {
  return sendTemplate(phone, "confirmacao_pagamento", {
    patient_name: patientName,
    amount: `R$ ${amount.toFixed(2)}`,
  });
}

export async function sendPatientAccessCode(phone, patientName, code, url) {
  return sendTemplate(phone, "acesso_paciente", {
    patient_name: patientName,
    code,
    url: url || window.location.origin,
  });
}

// ── Mensagem direta (texto livre) ─────────────────────────

export async function sendTextMessage(phone, message) {
  if (!isWhatsAppConfigured()) {
    console.info("[WhatsApp] Não configurado — texto não enviado:", message);
    return null;
  }
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: formatPhone(phone),
    type: "text",
    text: { preview_url: true, body: message },
  };
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`WhatsApp API error: ${res.status}`);
    return res.json();
  } catch (e) {
    console.error("[WhatsApp] Erro ao enviar texto:", e);
    return null;
  }
}
