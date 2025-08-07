declare const languages: {
    fa: Record<string, string>;
    en: Record<string, string>;
};
export type LangCode = keyof typeof languages;
export declare function setLanguage(lang: LangCode): void;
export declare function t(key: string): string;
export declare function useTranslator(lang: LangCode): (key: string) => string;
export {};
