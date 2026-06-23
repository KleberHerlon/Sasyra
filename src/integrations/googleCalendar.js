// ════════════════════════════════════════════════════════════
// Google Calendar Integration — Service Layer
// ════════════════════════════════════════════════════════════
// Para ativar:
//   1. Crie um projeto em https://console.cloud.google.com
//   2. Ative Google Calendar API
//   3. Crie credenciais OAuth 2.0 (Web Application)
//   4. Defina VITE_GOOGLE_CLIENT_ID no .env
//   5. Adicione ORIGEM/oauth-callback.html como redirect autorizado (ex: http://localhost:5173/oauth-callback.html)
// ════════════════════════════════════════════════════════════

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

// Estado do token (persistido em localStorage)
function getToken() {
  try { return JSON.parse(localStorage.getItem("sasyra_google_token")); }
  catch { return null; }
}
function setToken(t) { localStorage.setItem("sasyra_google_token", JSON.stringify(t)); }
function clearToken() { localStorage.removeItem("sasyra_google_token"); }

export function isGoogleCalendarConfigured() {
  return !!GOOGLE_CLIENT_ID;
}

export function getGoogleAuthUrl() {
  const redirect = `${window.location.origin}/oauth-callback.html`;
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirect,
    response_type: "token",
    scope: SCOPES,
    include_granted_scopes: "true",
    state: "sasyra_calendar",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export function isGoogleCalendarConnected() {
  const token = getToken();
  if (!token) return false;
  return token.expires_at > Date.now();
}

export function disconnectGoogleCalendar() {
  clearToken();
}

async function refreshToken() {
  // Nota: Refresh token flow requer backend com client_secret
  // Por simplicidade, redireciona para oauth novamente
  clearToken();
  return null;
}

// ── Event CRUD ────────────────────────────────────────────

async function request(method, path, body = null) {
  const token = getToken();
  if (!token) throw new Error("Google Calendar não conectado");
  if (token.expires_at < Date.now()) {
    await refreshToken();
    return request(method, path, body);
  }
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    if (res.status === 401) { clearToken(); throw new Error("Token expirado"); }
    throw new Error(`Google Calendar API error: ${res.status}`);
  }
  return res.json();
}

function toGoogleEvent(appointment) {
  const date = appointment.date;
  const startTime = appointment.start_time || appointment.start || "08:00";
  const endTime = appointment.end_time || appointment.end || "09:00";
  return {
    summary: `${appointment.patient_name} — ${appointment.type === "avaliacao" ? "Avaliação" : appointment.type === "sessao" ? "Sessão" : "Bloqueio"}`,
    description: `Paciente: ${appointment.patient_name}\nConvênio: ${appointment.convenio || "—"}\nTelefone: ${appointment.phone || "—"}`,
    start: { dateTime: `${date}T${startTime}:00`, timeZone: "America/Sao_Paulo" },
    end: { dateTime: `${date}T${endTime}:00`, timeZone: "America/Sao_Paulo" },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 30 },
        { method: "email", minutes: 1440 },
      ],
    },
  };
}

export async function syncAppointmentToGoogle(appointment) {
  if (!isGoogleCalendarConnected()) return null;
  const event = toGoogleEvent(appointment);

  if (appointment.googleEventId) {
    return request("PUT", `/calendars/primary/events/${appointment.googleEventId}`, event);
  }
  const result = await request("POST", "/calendars/primary/events", event);
  return result.id; // googleEventId para persistir
}

export async function deleteGoogleEvent(googleEventId) {
  if (!isGoogleCalendarConnected() || !googleEventId) return;
  await request("DELETE", `/calendars/primary/events/${googleEventId}`);
}

export async function listGoogleEvents(fromDate, toDate) {
  if (!isGoogleCalendarConnected()) return [];
  const params = new URLSearchParams({
    timeMin: new Date(fromDate).toISOString(),
    timeMax: new Date(toDate).toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
  });
  const result = await request("GET", `/calendars/primary/events?${params}`);
  return result.items || [];
}
