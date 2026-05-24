const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8787';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.error || `Erro ${response.status}`);
  }

  return response.json();
}

export interface ApiStatus {
  ok: boolean;
  whatsappConfigured: boolean;
  openAiConfigured: boolean;
}

export interface WhatsAppInboxMessage {
  id: string;
  from: string;
  contactName?: string;
  text: string;
  timestamp: string;
  status: 'received' | 'read' | 'answered';
  analysis?: unknown;
}

export const api = {
  health: () => request<ApiStatus>('/api/health'),
  analyze: <T>(message: string) => request<T>('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
  getWhatsAppMessages: () => request<WhatsAppInboxMessage[]>('/api/whatsapp/messages'),
  markWhatsAppRead: (id: string) => request<WhatsAppInboxMessage>(`/api/whatsapp/messages/${id}/read`, {
    method: 'POST',
  }),
  sendWhatsApp: (to: string, body: string) => request('/api/whatsapp/send', {
    method: 'POST',
    body: JSON.stringify({ to, body }),
  }),
};
