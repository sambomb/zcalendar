/**
 * @file config.js
 * @description Configurações centralizadas da aplicação
 * 
 * Consolidação de todas as constantes hardcoded em arquivos dispersos.
 * Facilita manutenção, testing e alterações de ambiente.
 */

// ============================================================================
// CONFIGURAÇÕES DE SERVIDOR/CALENDÁRIO
// ============================================================================

export const SERVER_CONFIG = {
  /** Offset UTC do servidor do Last Z */
  OFFSET: "UTC-2",
  /** Hora do servidor em ms (usado para cálculos de tempo real) */
  OFFSET_MS: -2 * 60 * 60 * 1000,
  /** Intervalo de atualização do timer em ms */
  UPDATE_INTERVAL_MS: 1000,
  /** Intervalo de animação eficiente (em ms) */
  ANIMATION_INTERVAL_MS: 500
}

// ============================================================================
// CONFIGURAÇÕES DE UI
// ============================================================================

export const UI_CONFIG = {
  /** Modo 24h defaults true */
  DEFAULT_24H: true,
  /** Idioma padrão (fallback) */
  DEFAULT_LANG: "en",
  /** Máximo de caracteres para resume de guia */
  GUIDE_SUMMARY_MAX_LENGTH: 160,
  /** Delay para debounce de resize em ms */
  RESIZE_DEBOUNCE_MS: 150,
  /** Threshold para viewport mobile breakpoint */
  MOBILE_BREAKPOINT_PX: 720
}

// ============================================================================
// CONFIGURAÇÕES DE SEGURANÇA
// ============================================================================

export const SECURITY_CONFIG = {
  /** Caracteres que disparam sanitização HTML */
  XSS_DANGER_CHARS: /[<>\"']/g,
  /** Pattern para validar URLs seguras */
  SAFE_URL_PATTERN: /^(https?:\/\/|\/|#)/i,
  /** URLs externas permitidas */
  WHITELIST_DOMAINS: [
    "github.com",
    "paypal.com",
    "lastzhelp.com",
    "www.lastzhelp.com"
  ],
  /** Máximo de profundidade em merge recursivo (evita stack overflow) */
  MAX_MERGE_DEPTH: 10,
  /** Timeout para operações assíncronas (ms) */
  ASYNC_TIMEOUT_MS: 5000
}

// ============================================================================
// CONFIGURAÇÕES DE URLS E PATHS
// ============================================================================

export const URLs = {
  /** URL de doação PayPal */
  DONATE: "https://www.paypal.com/donate/?hosted_button_id=EQ4XU8W5PWUBA",
  /** URL para reportar issues no GitHub */
  ISSUES: "https://github.com/sambomb/zcalendar/issues",
  /** URL base da aplicação (detectado em runtime) */
  BASE_URL: (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL)
    ? import.meta.env.BASE_URL
    : "/"
}

// ============================================================================
// CONFIGURAÇÕES DE STORAGE
// ============================================================================

export const STORAGE_CONFIG = {
  /** Chave para armazenar preferência de idioma */
  LANG_KEY: "lang",
  /** Chave para armazenar preferência de formato 24h */
  TIME_FORMAT_KEY: "time-format",
  /** TTL para cache em localStorage (ms, 0 = sem expiração) */
  CACHE_TTL_MS: 0
}

// ============================================================================
// CONFIGURAÇÕES DE IDIOMAS
// ============================================================================

export const LANGS_CONFIG = [
  { code: "en", flag: "gb", name: "English" },
  { code: "pt-br", flag: "br", name: "Português (BR)" },
  { code: "pt-pt", flag: "pt", name: "Português (PT)" },
  { code: "es", flag: "es", name: "Español" },
  { code: "fr", flag: "fr", name: "Français" },
  { code: "de", flag: "de", name: "Deutsch" },
  { code: "it", flag: "it", name: "Italiano" },
  { code: "ru", flag: "ru", name: "Русский" },
  { code: "zh", flag: "cn", name: "中文" },
  { code: "ja", flag: "jp", name: "日本語" },
  { code: "ko", flag: "kr", name: "한국어" },
  { code: "hi", flag: "in", name: "हिन्दी" },
  { code: "bn", flag: "bd", name: "বাংলা" },
  { code: "mr", flag: "in", name: "मराठी" },
  { code: "ar", flag: "ae", name: "العربية" },
  { code: "ur", flag: "pk", name: "اردو" },
  { code: "id", flag: "id", name: "Bahasa Indonesia" },
  { code: "tr", flag: "tr", name: "Türkçe" },
  { code: "pl", flag: "pl", name: "Polski" },
  { code: "sw", flag: "tz", name: "Kiswahili" }
]

// ============================================================================
// IDIOMAS COM SUPORTE RTL (Right-to-Left)
// ============================================================================

export const RTL_LANGS = ["ar", "ur"]

// ============================================================================
// CONFIGURAÇÕES DE FONTES POR IDIOMA
// ============================================================================

export const LANG_FONTS = {
  hi: { fontFamily: "'Noto Sans Devanagari', sans-serif", fontWeight: "400" },
  bn: { fontFamily: "'Noto Sans Bengali', sans-serif", fontWeight: "400" },
  mr: { fontFamily: "'Noto Sans Devanagari', sans-serif", fontWeight: "400" },
  zh: { fontFamily: "'Noto Sans CJK SC', sans-serif", fontWeight: "400" },
  ja: { fontFamily: "'Noto Sans CJK JP', sans-serif", fontWeight: "400" },
  ko: { fontFamily: "'Noto Sans CJK KR', sans-serif", fontWeight: "400" },
  ar: { fontFamily: "'Noto Sans Arabic', sans-serif", fontWeight: "400" },
  ur: { fontFamily: "'Noto Sans Arabic', sans-serif", fontWeight: "400" }
}

// ============================================================================
// CONFIGURAÇÕES DE VALIDAÇÃO
// ============================================================================

export const VALIDATION = {
  /** Minuto válido para entrada de hora: 0-59 */
  VALID_MINUTES: { min: 0, max: 59 },
  /** Hora válida em formato 24h: 0-23 */
  VALID_HOURS_24: { min: 0, max: 23 },
  /** Hora válida em formato 12h: 1-12 */
  VALID_HOURS_12: { min: 1, max: 12 },
  /** Dia válido: 0-6 (segunda a domingo) */
  VALID_DAYS: { min: 0, max: 6 }
}

// ============================================================================
// MÉTODOS HELPER PARA CONFIGURAÇÃO
// ============================================================================

/**
 * Obtém config de font para um idioma específico
 * @param {string} lang - Código do idioma (ex: "zh", "hi")
 * @returns {object|null} Objeto com fontFamily e fontWeight, ou null se não customizado
 */
export function getFontConfigForLang(lang) {
  return LANG_FONTS[lang] || null
}

/**
 * Verifica se um idioma é RTL
 * @param {string} lang - Código do idioma
 * @returns {boolean}
 */
export function isRtlLang(lang) {
  return RTL_LANGS.includes(lang)
}

/**
 * Obtém informações de idioma por código
 * @param {string} code - Código do idioma
 * @returns {object|null} Objeto {code, flag, name} ou null
 */
export function getLangInfo(code) {
  return LANGS_CONFIG.find(lang => lang.code === code) || null
}

/**
 * Valida hora em formato 24h
 * @param {number} hour - Hora (0-23)
 * @returns {boolean}
 */
export function isValidHour24(hour) {
  const val = parseInt(hour, 10)
  return val >= VALIDATION.VALID_HOURS_24.min && val <= VALIDATION.VALID_HOURS_24.max
}

/**
 * Valida hora em formato 12h
 * @param {number} hour - Hora (1-12)
 * @returns {boolean}
 */
export function isValidHour12(hour) {
  const val = parseInt(hour, 10)
  return val >= VALIDATION.VALID_HOURS_12.min && val <= VALIDATION.VALID_HOURS_12.max
}

/**
 * Valida minuto
 * @param {number} minute - Minuto (0-59)
 * @returns {boolean}
 */
export function isValidMinute(minute) {
  const val = parseInt(minute, 10)
  return val >= VALIDATION.VALID_MINUTES.min && val <= VALIDATION.VALID_MINUTES.max
}

/**
 * Valida dia da semana
 * @param {number} day - Dia (0-6)
 * @returns {boolean}
 */
export function isValidDay(day) {
  const val = parseInt(day, 10)
  return val >= VALIDATION.VALID_DAYS.min && val <= VALIDATION.VALID_DAYS.max
}
