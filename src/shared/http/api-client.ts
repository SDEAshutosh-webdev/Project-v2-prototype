import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.ntis.gov.in';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ntis_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = 'Bearer ' + token;
    }
  }

  config.headers['X-Request-Timestamp'] = new Date().toISOString();
  config.headers['X-Client-App'] = 'NTIS-V2-Enterprise';

  return config;
});
