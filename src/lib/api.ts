import { encryptPayload, decryptPayload, getDeviceId, getNextSequenceNumber } from './aeadClient';

// Ensure the API base URL ends with /v1
let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1';
if (rawApiUrl && !rawApiUrl.endsWith('/v1') && !rawApiUrl.endsWith('/v1/')) {
  rawApiUrl = rawApiUrl.replace(/\/$/, '') + '/v1';
}
const API_BASE_URL = rawApiUrl;

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  skipAead?: boolean; // Set to true for unencrypted endpoints (like /health or /v1/server-capabilities)
}

export class ApiError extends Error {
  status: number;
  code?: string;
  requestId?: string;

  constructor(message: string, status: number, code?: string, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

interface SuccessEnvelope<T> {
  data: T;
  requestId: string;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers: customHeaders, skipAead = false, body, ...rest } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const requestId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
  const timestamp = Math.floor(Date.now() / 1000);
  const seq = getNextSequenceNumber();
  const deviceId = getDeviceId();

  const headers = new Headers(customHeaders);
  headers.set('x-request-id', requestId);
  headers.set('x-seq', seq.toString());
  headers.set('x-timestamp', timestamp.toString());
  headers.set('x-device-id', deviceId);
  headers.set('x-idempotency-key', requestId);

  // Set Authorization header if we have a token stored
  const token = localStorage.getItem('tl_session_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let finalBody: BodyInit | undefined = undefined;

  if (body) {
    if (skipAead) {
      headers.set('Content-Type', 'application/json');
      finalBody = typeof body === 'string' ? body : JSON.stringify(body);
    } else {
      // Encrypt payload using AEAD transport client
      headers.set('Content-Type', 'application/json');
      const payloadObj = typeof body === 'string' ? JSON.parse(body) : body;
      const envelope = await encryptPayload(payloadObj, requestId, seq, timestamp);
      finalBody = JSON.stringify(envelope);
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers,
    body: finalBody,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || errorData.message || `Request failed with status ${response.status}`;
    const code = errorData.error?.code || errorData.code;
    const reqId = errorData.error?.request_id || errorData.requestId || response.headers.get('x-request-id') || undefined;
    throw new ApiError(message, response.status, code, reqId);
  }

  const jsonResult = await response.json();

  if (skipAead) {
    return jsonResult as T;
  }

  // Decrypt AEAD Response
  if (jsonResult && jsonResult.nonce && jsonResult.ciphertext) {
    const decryptedEnvelope = await decryptPayload<SuccessEnvelope<T>>(
      jsonResult,
      requestId,
      seq,
      timestamp
    );
    return decryptedEnvelope.data;
  }

  return jsonResult as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export interface ApiNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  icon: string;
  action_url?: string | null;
  read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  read_at?: string | null;
}

export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  security_alerts: boolean;
  heartbeat_reminders: boolean;
  guardian_signals: boolean;
  vault_updates: boolean;
  updated_at: string;
}

export const notificationApi = {
  list: (userId: string, unreadOnly = false) =>
    api.get<{ data?: { notifications: ApiNotification[]; unread_count: number }; notifications?: ApiNotification[]; unread_count?: number }>(
      '/notifications',
      {
        params: { user_id: userId, unread_only: unreadOnly ? 'true' : 'false' },
        skipAead: true,
      }
    ),

  markRead: (notificationId: string, userId: string) =>
    api.patch<boolean>(
      `/notifications/${notificationId}/read`,
      { user_id: userId },
      { skipAead: true }
    ),

  markAllRead: (userId: string) =>
    api.post<number>(
      '/notifications/read-all',
      { user_id: userId },
      { skipAead: true }
    ),

  delete: (notificationId: string, userId: string) =>
    api.delete<boolean>(
      `/notifications/${notificationId}`,
      {
        params: { user_id: userId },
        skipAead: true,
      }
    ),

  getPreferences: (userId: string) =>
    api.get<{ data?: NotificationPreferences } & NotificationPreferences>(
      '/notifications/preferences',
      {
        params: { user_id: userId },
        skipAead: true,
      }
    ),

  updatePreferences: (prefs: Partial<NotificationPreferences> & { user_id: string }) =>
    api.put<{ data?: NotificationPreferences } & NotificationPreferences>(
      '/notifications/preferences',
      prefs,
      { skipAead: true }
    ),

  testPush: (userId: string) =>
    api.post<{ in_app_created: boolean; push_dispatched: boolean; message: string }>(
      '/notifications/test-push',
      { user_id: userId },
      { skipAead: true }
    ),
};

