import { APP_CONFIG, SupportedLocale } from '../config/app.config';

export const i18nConfig = {
  locales: APP_CONFIG.supportedLocales,
  defaultLocale: APP_CONFIG.defaultLocale,
};

export interface Dictionary {
  common: {
    appName: string;
    refresh: string;
    loading: string;
    save: string;
    cancel: string;
    filters: string;
    search: string;
  };
  ptis: {
    apartmentRegister: string;
    unitNo: string;
    floor: string;
    owner: string;
    usageType: string;
    builtUpArea: string;
    capitalValue: string;
    status: string;
  };
}

export const dictionaries: Record<SupportedLocale, Dictionary> = {
  en: {
    common: {
      appName: 'NTIS 2.0 Municipal ERP',
      refresh: 'Refresh',
      loading: 'Loading...',
      save: 'Save Changes',
      cancel: 'Cancel',
      filters: 'Filters',
      search: 'Search records...',
    },
    ptis: {
      apartmentRegister: 'Apartment Assessment Register',
      unitNo: 'Unit / Flat',
      floor: 'Floor',
      owner: 'Owner / Occupant',
      usageType: 'Usage Type',
      builtUpArea: 'Built-Up Area',
      capitalValue: 'Capital Value',
      status: 'Status',
    },
  },
  mr: {
    common: {
      appName: 'एनटीआयएस २.० नगरपालिका ईआरपी',
      refresh: 'ताजे करा',
      loading: 'लोड होत आहे...',
      save: 'बदल जतन करा',
      cancel: 'रद्द करा',
      filters: 'फिल्टर',
      search: 'नोंदी शोधा...',
    },
    ptis: {
      apartmentRegister: 'इमारत कर आकारणी नोंदवही',
      unitNo: 'सदनिका क्र.',
      floor: 'मजला',
      owner: 'मालकाचे नाव',
      usageType: 'वापर प्रकार',
      builtUpArea: 'बांधकाम क्षेत्रफळ',
      capitalValue: 'भांडवली मूल्य',
      status: 'स्थिती',
    },
  },
  hi: {
    common: {
      appName: 'एनटीआईएस २.० नगर निगम ईआरपी',
      refresh: 'रीफ्रेश करें',
      loading: 'लोड हो रहा है...',
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      filters: 'फिल्टर',
      search: 'रिकॉर्ड खोजें...',
    },
    ptis: {
      apartmentRegister: 'अपार्टमेंट कर निर्धारण रजिस्टर',
      unitNo: 'इकाई / फ्लैट',
      floor: 'मंजिल',
      owner: 'मालिक का नाम',
      usageType: 'उपयोग प्रकार',
      builtUpArea: 'निर्मित क्षेत्र',
      capitalValue: 'पूंजीगत मूल्य',
      status: 'स्थिति',
    },
  },
};

export function getDictionary(locale: SupportedLocale = 'en'): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}
