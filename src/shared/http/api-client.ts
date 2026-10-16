import axios, { AxiosError } from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.ntis.gov.in';

export class ApiError extends Error {
  public status?: number;
  public data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables HttpOnly cookies for SSR / CSR session syncing
});

// Helper to read CSRF token from document cookies
function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// REQUEST INTERCEPTOR: Auth, CSRF, and Government Audit Headers
apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    // 1. Attach Bearer Token (if using LocalStorage token)
    const token = localStorage.getItem('ntis_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = 'Bearer ' + token;
    }

    // 2. Attach Anti-CSRF Protection Header
    const csrfToken = getCsrfToken();
    if (csrfToken && !config.headers['X-CSRF-Token']) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }

  // 3. Government Audit & Traceability Metadata Headers
  config.headers['X-Correlation-Id'] = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'req-' + Date.now();
  config.headers['X-Request-Timestamp'] = new Date().toISOString();
  config.headers['X-Client-App'] = 'NTIS-V2-Enterprise';

  return config;
});

// RESPONSE INTERCEPTOR: Handle 401 Unauthorized & Normalize Errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      
      // Auto-handle session expiration
      if (status === 401) {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          console.warn('[HTTP Client] Session expired (401). Redirecting to login...');
          localStorage.removeItem('ntis_token');
          window.location.href = '/login?expired=true';
        }
      }

      const responseData = error.response.data as any;
      const message = responseData?.message || responseData?.title || error.message || 'Server Request Failed';
      return Promise.reject(new ApiError(message, status, responseData));
    }

    return Promise.reject(new ApiError(error.message || 'Network / Connectivity Failure'));
  }
);
