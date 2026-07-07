import { useState, useEffect, useCallback } from "react";
import {
  isGoogleCalendarConfigured,
  isGoogleCalendarConnected,
  getGoogleAuthUrl,
  disconnectGoogleCalendar,
  syncAppointmentToGoogle,
  deleteGoogleEvent,
} from "../integrations/googleCalendar";
import {
  isWhatsAppConfigured,
  sendAppointmentReminder,
  sendEvaluationReminder,
  sendPaymentConfirmation,
  sendPatientAccessCode,
  sendTextMessage,
} from "../integrations/whatsApp";

export function useIntegrations() {
  const [googleConnected, setGoogleConnected] = useState(false);

  useEffect(() => {
    setGoogleConnected(isGoogleCalendarConnected());

    function onMessage(e) {
      if (e.data === "sasyra_google_connected") {
        setGoogleConnected(true);
      }
    }
    function onStorage(e) {
      if (e.key === "sasyra_google_token") {
        setGoogleConnected(isGoogleCalendarConnected());
      }
    }
    window.addEventListener("message", onMessage);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const connectGoogle = useCallback(() => {
    if (!isGoogleCalendarConfigured()) return;
    window.open(getGoogleAuthUrl(), "_blank", "width=600,height=700");
  }, []);

  const disconnectGoogle = useCallback(() => {
    disconnectGoogleCalendar();
    setGoogleConnected(false);
  }, []);

  return {
    googleCalendar: {
      configured: isGoogleCalendarConfigured(),
      connected: googleConnected,
      connect: connectGoogle,
      disconnect: disconnectGoogle,
      syncAppointment: syncAppointmentToGoogle,
      deleteEvent: deleteGoogleEvent,
    },
    whatsApp: {
      configured: isWhatsAppConfigured(),
      sendReminder: sendAppointmentReminder,
      sendEvaluationReminder: sendEvaluationReminder,
      sendPaymentConfirmation: sendPaymentConfirmation,
      sendAccessCode: sendPatientAccessCode,
      sendTextMessage: sendTextMessage,
    },
  };
}
