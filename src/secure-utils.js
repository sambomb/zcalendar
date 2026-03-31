/**
 * @file secure-utils.js
 * @description Utilitários consolidados de segurança e validação
 * 
 * Centraliza funções de:
 * - Escape/sanitização HTML (prevenção XSS)
 * - Validação e normalização de URLs
 * - Tratamento seguro de texto
 * - Validação de entrada
 * 
 * Removes redundancy from guide-helpers.js, ui.js, page-main.js
 */

import { SECURITY_CONFIG } from "./config.js"

// ============================================================================
// SANITIZAÇÃO HTML - PREVENÇÃO XSS
// ============================================================================

/**
 * Mapa de entidades HTML para escape
 * @type {Object<string, string>}
 */
const HTML_ENTITY_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}

/**
 * Faz escape de caracteres perigosos em HTML
 * Previne XSS quando concatenado em innerHTML
 * 
 * @param {*} text - Texto ou valor a escapar (string, number, etc)
 * @returns {string} Texto escapado seguro para HTML
 * 
 * @example
 * escapeHtml("<script>alert('xss')</script>")
 * // → "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
 */
export function escapeHtml(text) {
  if (text == null) return ""
  return String(text).replace(/[&<>"']/g, (char) => HTML_ENTITY_MAP[char] || char)
}

/**
 * Remove tags HTML e retorna apenas texto
 * 
 * @param {string} html - HTML a limpar
 * @returns {string} Texto sem tags
 */
export function stripHtmlTags(html) {
  if (!html) return ""
  return String(html)
    .replace(/<[^>]*>/g, "")  // Remove tudo dentro de <>
    .replace(/&[a-z]+;/gi, "")  // Remove entidades HTML
    .trim()
}

/**
 * Sanitiza atributos de HTML (previne atributos maliciosos)
 * 
 * @param {string} attrValue - Valor do atributo
 * @returns {string} Valor sanitizado
 */
export function sanitizeHtmlAttribute(attrValue) {
  if (!attrValue) return ""
  
  // Bloqueia protocolos perigosos (javascript:, data:, vbscript:, etc)
  if (/^(javascript|data|vbscript|file):/i.test(String(attrValue))) {
    return ""
  }
  
  return escapeHtml(attrValue)
}

// ============================================================================
// VALIDAÇÃO E NORMALIZAÇÃO DE URLS
// ============================================================================

/**
 * Valida se uma URL é segura para usar em href/src
 * 
 * @param {string} url - URL a validar
 * @returns {boolean} true se URL é segura
 */
export function isSafeUrl(url) {
  if (!url || typeof url !== "string") return false
  
  const trimmed = url.trim()
  
  // URLs relativas e # são seguras
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return true
  
  // URLs absolutas https/http
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const urlObj = new URL(trimmed)
      // Verifica whitelist de domínios
      return SECURITY_CONFIG.WHITELIST_DOMAINS.some(domain => 
        urlObj.hostname.endsWith(domain)
      )
    } catch {
      return false
    }
  }
  
  return false
}

/**
 * Normaliza URL removendo caracteres perigosos
 * 
 * @param {string} url - URL a normalizar
 * @returns {string} URL normalizada ou string vazia se inválida
 */
export function normalizeUrl(url) {
  if (!isSafeUrl(url)) return ""
  return String(url).trim()
}

// ============================================================================
// TRATAMENTO SEGURO DE TEXTO
// ============================================================================

/**
 * Retorna valor ou fallback se vazio/nulo/undefined
 * Version consolidada: remove duplicação de textOr em 3 arquivos
 * 
 * @param {*} value - Valor a verificar
 * @param {string} fallback - Fallback se vazio (padrão: "")
 * @returns {string} Valor ou fallback
 */
export function textOr(value, fallback = "") {
  if (!value && value !== 0 && value !== false) return fallback
  return String(value)
}

/**
 * Remove informações de fonte/crédito de texto
 * Preserva apenas conteúdo da guia
 * 
 * @param {string} text - Texto potencialmente com atribuição
 * @returns {string} Texto limpo
 */
export function stripSourceAttribution(text) {
  if (!text) return ""
  
  // Remove padrões de "Source: ...", "[Fonte: ...]", "(from ...)"
  return String(text)
    .replace(/\n*\[?source:.*?]\s*/gi, "")
    .replace(/\n*\(?from:.*?\)?\s*/gi, "")
    .replace(/fonte:.*?[\n.]/gi, "")
    .trim()
}

/**
 * Trunca texto com elipsis se maior que limite
 * 
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Comprimento máximo
 * @param {string} ellipsis - String final (padrão: "...")
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 160, ellipsis = "...") {
  if (!text) return ""
  
  const str = String(text).trim()
  
  if (str.length <= maxLength) return str
  
  return str.substring(0, maxLength - ellipsis.length) + ellipsis
}

/**
 * Capitaliza primeira letra de uma string
 * 
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export function capitalize(text) {
  if (!text) return ""
  const str = String(text)
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// ============================================================================
// VALIDAÇÃO DE ENTRADA
// ============================================================================

/**
 * Valida email (básico)
 * 
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(String(email))
}

/**
 * Valida se é um número inteiro válido
 * 
 * @param {*} value - Valor a validar
 * @returns {boolean}
 */
export function isValidInteger(value) {
  const num = parseInt(value, 10)
  return !isNaN(num) && isFinite(num) && String(num) === String(value)
}

/**
 * Valida se é um número (incluindo decimais)
 * 
 * @param {*} value - Valor a validar
 * @returns {boolean}
 */
export function isValidNumber(value) {
  const num = parseFloat(value)
  return !isNaN(num) && isFinite(num)
}

/**
 * Valida comprimento de string
 * 
 * @param {string} text - Texto a validar
 * @param {number} minLength - Comprimento mínimo (padrão: 0)
 * @param {number} maxLength - Comprimento máximo (padrão: Infinity)
 * @returns {boolean}
 */
export function isValidLength(text, minLength = 0, maxLength = Infinity) {
  if (!text) return minLength === 0
  const len = String(text).length
  return len >= minLength && len <= maxLength
}

/**
 * Sanitiza entrada de número (remove caracteres não numéricos exceto .)
 * 
 * @param {*} value - Valor a sanitizar
 * @param {number} decimalPlaces - Casas decimais permitidas (padrão: 0)
 * @returns {number|null} Número sanitizado ou null
 */
export function sanitizeNumber(value, decimalPlaces = 0) {
  if (value === "" || value === null || value === undefined) return null
  
  const num = parseFloat(String(value).replace(/[^0-9.-]/g, ""))
  
  if (isNaN(num) || !isFinite(num)) return null
  
  if (decimalPlaces === 0) {
    return Math.round(num)
  }
  
  return parseFloat(num.toFixed(decimalPlaces))
}

// ============================================================================
// HELPERS PARA CONTEXTO HTML
// ============================================================================

/**
 * Cria atributo dir="" baseado em RTL
 * 
 * @param {boolean} isRtl - Se deve ser RTL
 * @returns {string} ' dir="rtl"' ou ' dir="ltr"' ou ""
 */
export function getDirAttribute(isRtl) {
  if (isRtl === true) return ' dir="rtl"'
  if (isRtl === false) return ' dir="ltr"'
  return ""
}

/**
 * Cria classe CSS para RTL
 * 
 * @param {boolean} isRtl - Se deve ser RTL
 * @param {string} rtlClass - Classe se RTL (padrão: "is-rtl")
 * @returns {string} Nome da classe ou string vazia
 */
export function getRtlClass(isRtl, rtlClass = "is-rtl") {
  return isRtl ? rtlClass : ""
}

/**
 * Cria atributo aria-label seguro
 * 
 * @param {string} label - Label desejado
 * @returns {string} Atributo completo ou string vazia
 */
export function getAriaLabel(label) {
  if (!label) return ""
  return ` aria-label="${sanitizeHtmlAttribute(label)}"`
}

// ============================================================================
// CONSOLIDAÇÃO DE PADRÕES COMUNS
// ============================================================================

/**
 * Retorna string com fallback baseado em uma função validadora
 * Útil para tradução + fallback + escape
 * 
 * @param {string} value - Valor primário
 * @param {string} fallback - Valor de fallback
 * @param {Function} transform - Função de transformação opcional
 * @returns {string}
 */
export function safeTransform(value, fallback = "", transform = null) {
  const result = textOr(value, fallback)
  return transform ? transform(result) : result
}

/**
 * Cria um span seguro com classe e dir attribute
 * 
 * @param {string} text - Texto do span
 * @param {Object} options - Opções
 * @param {string} options.className - Classe CSS
 * @param {boolean} options.isRtl - Se deve ser RTL
 * @param {string} options.id - ID do elemento
 * @returns {string} HTML do span
 */
export function createSafeSpan(text, options = {}) {
  const { className = "", isRtl = false, id = "" } = options
  
  const classAttr = className ? ` class="${escapeHtml(className)}"` : ""
  const idAttr = id ? ` id="${escapeHtml(id)}"` : ""
  const dirAttr = getDirAttribute(isRtl)
  const safeText = escapeHtml(text)
  
  return `<span${idAttr}${classAttr}${dirAttr}>${safeText}</span>`
}

/**
 * Cria um link seguro
 * 
 * @param {string} text - Texto do link
 * @param {string} href - URL do link
 * @param {Object} options - Opções
 * @param {string} options.className - Classe CSS
 * @param {string} options.title - Título (tooltip)
 * @returns {string} HTML do link ou apenas texto escapado se href inválido
 */
export function createSafeLink(text, href, options = {}) {
  const { className = "", title = "" } = options
  
  const safeHref = normalizeUrl(href)
  
  // Se URL não for segura, retorna apenas o texto escapado
  if (!safeHref) {
    return escapeHtml(text)
  }
  
  const classAttr = className ? ` class="${escapeHtml(className)}"` : ""
  const titleAttr = title ? ` title="${sanitizeHtmlAttribute(title)}"` : ""
  const safeText = escapeHtml(text)
  
  return `<a href="${escapeHtml(safeHref)}"${classAttr}${titleAttr}>${safeText}</a>`
}

export default {
  // HTML Security
  escapeHtml,
  stripHtmlTags,
  sanitizeHtmlAttribute,
  
  // URL Security
  isSafeUrl,
  normalizeUrl,
  
  // Text handling
  textOr,
  stripSourceAttribution,
  truncateText,
  capitalize,
  
  // Input validation
  isValidEmail,
  isValidInteger,
  isValidNumber,
  isValidLength,
  sanitizeNumber,
  
  // HTML helpers
  getDirAttribute,
  getRtlClass,
  getAriaLabel,
  
  // Consolidated patterns
  safeTransform,
  createSafeSpan,
  createSafeLink
}
