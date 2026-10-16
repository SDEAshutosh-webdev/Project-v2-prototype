export const APP_CONFIG = {
  appName: 'NTIS 2.0 Municipal Enterprise',
  version: '2.0.0',
  defaultLocale: 'en',
  supportedLocales: ['en', 'mr', 'hi'] as const,
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.ntis.gov.in',
    timeoutMs: 30000,
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  features: {
    enableVirtualization: true,
    enableDifferenceEngine: true,
    enableGisWayback: true,
  },
};

export type SupportedLocale = typeof APP_CONFIG.supportedLocales[number];
