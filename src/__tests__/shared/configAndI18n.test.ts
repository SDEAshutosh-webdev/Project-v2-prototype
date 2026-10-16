import { describe, it, expect } from 'vitest';
import { APP_CONFIG } from '@/shared/config/app.config';
import { getDictionary } from '@/shared/i18n/config';

describe('Shared Config & i18n Suite', () => {
  it('should have standard enterprise app configuration', () => {
    expect(APP_CONFIG.supportedLocales).toContain('en');
    expect(APP_CONFIG.supportedLocales).toContain('mr');
    expect(APP_CONFIG.supportedLocales).toContain('hi');
    expect(APP_CONFIG.api.baseUrl).toBeDefined();
  });

  it('should resolve Marathi and English translation dictionaries properly', () => {
    const en = getDictionary('en');
    expect(en.ptis.apartmentRegister).toBe('Apartment Assessment Register');

    const mr = getDictionary('mr');
    expect(mr.ptis.apartmentRegister).toBe('इमारत कर आकारणी नोंदवही');
    expect(mr.common.refresh).toBe('ताजे करा');
  });

  it('should fallback gracefully to English if unknown locale passed', () => {
    // @ts-expect-error Testing invalid locale fallback
    const fallback = getDictionary('fr');
    expect(fallback.common.appName).toBe('NTIS 2.0 Municipal ERP');
  });
});
