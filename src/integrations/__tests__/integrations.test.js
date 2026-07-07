import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

// ── Mock localStorage ──────────────────────────────────────
const mockStore = {};
const mockLocalStorage = {
  getItem: (key) => mockStore[key] ?? null,
  setItem: (key, val) => { mockStore[key] = String(val); },
  removeItem: (key) => { delete mockStore[key]; },
  clear: () => { Object.keys(mockStore).forEach(k => delete mockStore[k]); },
  get length() { return Object.keys(mockStore).length; },
  key: (i) => Object.keys(mockStore)[i] ?? null,
};
vi.stubGlobal('localStorage', mockLocalStorage);

// ── Mock window ────────────────────────────────────────────
vi.stubGlobal('window', { location: { origin: 'http://localhost:5173' } });

// ── Mock fetch ─────────────────────────────────────────────
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// ── Google Calendar ────────────────────────────────────────

describe('googleCalendar', () => {
  let mod;

  beforeAll(async () => {
    mod = await import('../googleCalendar');
  });

  beforeEach(() => {
    localStorage.clear();
    mockFetch.mockReset();
    localStorage.setItem('sasyra_google_token', JSON.stringify({
      access_token: 'ya29.test-token',
      expires_at: Date.now() + 3600000,
    }));
  });

  describe('isGoogleCalendarConfigured', () => {
    it('retorna false quando VITE_GOOGLE_CLIENT_ID não está definido', () => {
      expect(mod.isGoogleCalendarConfigured()).toBe(false);
    });
  });

  describe('isGoogleCalendarConnected', () => {
    it('retorna true com token válido', () => {
      expect(mod.isGoogleCalendarConnected()).toBe(true);
    });

    it('retorna false com token expirado', () => {
      localStorage.setItem('sasyra_google_token', JSON.stringify({
        access_token: 'expired',
        expires_at: Date.now() - 1000,
      }));
      expect(mod.isGoogleCalendarConnected()).toBe(false);
    });

    it('retorna false sem token', () => {
      localStorage.removeItem('sasyra_google_token');
      expect(mod.isGoogleCalendarConnected()).toBe(false);
    });
  });

  describe('disconnectGoogleCalendar', () => {
    it('remove o token do localStorage', () => {
      expect(localStorage.getItem('sasyra_google_token')).not.toBeNull();
      mod.disconnectGoogleCalendar();
      expect(localStorage.getItem('sasyra_google_token')).toBeNull();
    });
  });

  describe('syncAppointmentToGoogle', () => {
    it('retorna null quando não conectado', async () => {
      localStorage.removeItem('sasyra_google_token');
      const result = await mod.syncAppointmentToGoogle({ id: 1 });
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('cria evento via POST e retorna eventId para novo agendamento', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'google-event-abc' }),
      });

      const result = await mod.syncAppointmentToGoogle({
        id: 123,
        patientName: 'Maria Oliveira',
        date: '2026-07-08',
        start: '14:00',
        end: '15:00',
        type: 'avaliacao',
        phone: '11988887777',
        convenio: 'Unimed',
      });

      expect(result).toBe('google-event-abc');
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toBe('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      expect(opts.method).toBe('POST');

      const body = JSON.parse(opts.body);
      expect(body.summary).toContain('Maria Oliveira');
      expect(body.summary).toContain('Avaliação');
      expect(body.start.dateTime).toBe('2026-07-08T14:00:00');
      expect(body.end.dateTime).toBe('2026-07-08T15:00:00');
      expect(body.description).toContain('Unimed');
      expect(body.description).toContain('11988887777');
      expect(body.reminders.overrides[0].minutes).toBe(30);
    });

    it('atualiza evento via PUT quando googleEventId existe', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'event-existing-123' }),
      });

      const result = await mod.syncAppointmentToGoogle({
        id: 123,
        patientName: 'Carlos Souza',
        date: '2026-07-10',
        start: '10:00',
        end: '11:00',
        type: 'sessao',
        googleEventId: 'event-existing-123',
      });

      expect(result).toBe('event-existing-123');
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe('https://www.googleapis.com/calendar/v3/calendars/primary/events/event-existing-123');
      expect(mockFetch.mock.calls[0][1].method).toBe('PUT');
    });

    it('usa snake_case patient_name se camelCase não existir', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'event-456' }),
      });

      await mod.syncAppointmentToGoogle({
        id: 456,
        patient_name: 'Ana Costa',
        date: '2026-07-12',
        start: '08:00',
        end: '09:00',
        type: 'sessao',
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.summary).toContain('Ana Costa');
    });

    it('usa fallback "Paciente" quando nome não existe', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'event-789' }),
      });

      await mod.syncAppointmentToGoogle({
        id: 789,
        date: '2026-07-15',
        start: '08:00',
        end: '09:00',
        type: 'bloqueio',
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.summary).toContain('Paciente');
      expect(body.summary).toContain('Bloqueio');
    });

    it('usa start/end como fallback sem start_time/end_time', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'event-111' }),
      });

      await mod.syncAppointmentToGoogle({
        id: 111,
        patientName: 'Teste',
        date: '2026-07-20',
        start: '09:30',
        end: '10:30',
        type: 'sessao',
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.start.dateTime).toBe('2026-07-20T09:30:00');
      expect(body.end.dateTime).toBe('2026-07-20T10:30:00');
    });

    it('usa "08:00"/"09:00" como fallback sem horário algum', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'event-222' }),
      });

      await mod.syncAppointmentToGoogle({
        id: 222,
        patientName: 'Fallback',
        date: '2026-07-25',
        type: 'sessao',
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.start.dateTime).toBe('2026-07-25T08:00:00');
      expect(body.end.dateTime).toBe('2026-07-25T09:00:00');
    });
  });

  describe('deleteGoogleEvent', () => {
    it('não chama fetch sem googleEventId', async () => {
      await mod.deleteGoogleEvent(null);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('não chama fetch quando não conectado', async () => {
      localStorage.removeItem('sasyra_google_token');
      await mod.deleteGoogleEvent('event-abc');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('chama DELETE com googleEventId', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => ({}) });

      await mod.deleteGoogleEvent('event-to-delete');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toBe('https://www.googleapis.com/calendar/v3/calendars/primary/events/event-to-delete');
      expect(opts.method).toBe('DELETE');
    });
  });

  describe('getGoogleAuthUrl', () => {
    it('retorna URL com client_id e redirect_uri', () => {
      const url = mod.getGoogleAuthUrl();
      expect(url).toContain('accounts.google.com/o/oauth2/v2/auth');
      expect(url).toContain('response_type=token');
      expect(url).toContain(encodeURIComponent('https://www.googleapis.com/auth/calendar.events'));
    });
  });
});

// ── WhatsApp ────────────────────────────────────────────────

describe('whatsApp', () => {
  let mod;

  beforeAll(async () => {
    mod = await import('../whatsApp');
  });

  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('isWhatsAppConfigured', () => {
    it('retorna false quando VITE_WHATSAPP_TOKEN/PHONE_ID não definidos', () => {
      expect(mod.isWhatsAppConfigured()).toBe(false);
    });
  });

  describe('sendAppointmentReminder', () => {
    it('não chama fetch quando não configurado (log info)', async () => {
      const result = await mod.sendAppointmentReminder('11999999999', 'João', '2026-07-10', '09:00', 'Dr. Silva');
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('sendPatientAccessCode', () => {
    it('não chama fetch quando não configurado', async () => {
      const result = await mod.sendPatientAccessCode('11999999999', 'Maria', 'ABC123', 'https://app.sasyra.com');
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('sendEvaluationReminder', () => {
    it('não chama fetch quando não configurado', async () => {
      const result = await mod.sendEvaluationReminder('11999999999', 'Pedro', '2026-07-15');
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('sendPaymentConfirmation', () => {
    it('não chama fetch quando não configurado', async () => {
      const result = await mod.sendPaymentConfirmation('11999999999', 'Ana', 150.00);
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('sendTextMessage', () => {
    it('não chama fetch quando não configurado', async () => {
      const result = await mod.sendTextMessage('11999999999', 'Olá, tudo bem?');
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
