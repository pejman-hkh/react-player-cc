import { fa } from './locales/fa'
import { en } from './locales/en'

const languages = {
    fa,
    en
}

export type LangCode = keyof typeof languages

let currentLang: LangCode = 'en'

export function setLanguage(lang: LangCode) {
    currentLang = lang
}

export function t(key: string): string {
    return languages[currentLang][key] || key
}

export function useTranslator(lang: LangCode) {
    return (key: string) => languages[lang]?.[key] || key
}