import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import en from '../../i18n/en.json';
import fr from '../../i18n/fr.json';
import es from '../../i18n/es.json';
import de from '../../i18n/de.json';

export type Locale = 'en' | 'fr' | 'es' | 'de';

export interface LocaleConfig {
    code: Locale;
    label: string;
    flag: string;
    currency: string;
    currencySymbol: string;
    region: string;
}

export const LOCALES: LocaleConfig[] = [
    { code: 'en', label: 'English', flag: '🇺🇸', currency: 'USD', currencySymbol: '$', region: 'US' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', currency: 'EUR', currencySymbol: '€', region: 'FR' },
    { code: 'es', label: 'Español', flag: '🇪🇸', currency: 'EUR', currencySymbol: '€', region: 'ES' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪', currency: 'EUR', currencySymbol: '€', region: 'DE' },
];

const translations: Record<Locale, any> = { en, fr, es, de };

// Currency conversion rates (approximate, relative to USD)
const RATES: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
};

interface I18nContextType {
    locale: Locale;
    localeConfig: LocaleConfig;
    t: (key: string) => string;
    setLocale: (locale: Locale) => void;
    formatPrice: (usdPrice: string | number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) || path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const saved = localStorage.getItem('collector-locale');
        return (saved as Locale) || 'en';
    });

    const localeConfig = LOCALES.find(l => l.code === locale) || LOCALES[0];

    const t = useCallback((key: string): string => {
        const value = getNestedValue(translations[locale], key);
        if (value === key) {
            return getNestedValue(translations.en, key);
        }
        return value;
    }, [locale]);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('collector-locale', newLocale);
    }, []);

    const formatPrice = useCallback((usdPrice: string | number): string => {
        let numericValue: number;
        if (typeof usdPrice === 'string') {
            numericValue = parseFloat(usdPrice.replace(/[^0-9.]/g, ''));
        } else {
            numericValue = usdPrice;
        }
        if (isNaN(numericValue)) return `${localeConfig.currencySymbol}0`;

        const rate = RATES[localeConfig.currency] || 1;
        const converted = numericValue * rate;

        return `${localeConfig.currencySymbol}${converted.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }, [locale, localeConfig]);

    return (
        <I18nContext.Provider value={{ locale, localeConfig, t, setLocale, formatPrice }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}
