/**
 * @file calendar-helpers.js
 * @description Utilitários consolidados para cálculos de calendário
 * 
 * Consolida e remove redundâncias entre:
 * - calctime.js (formatTime, formatClockParts, getLocal)
 * - calendar-utils.js (parseServerOffset, getApocNow, getEventType, etc)
 * - day-column-renderer.js (parseServerOffset duplicado)
 * 
 * Único source of truth para lógica de tempo/calendário
 */

import { SERVER_CONFIG, isValidHour24, isValidMinute } from "./config.js"

// ============================================================================
// SERVER OFFSET PARSING - CONSOLIDADO (REMOVE DUPLICAÇÃO)
// ============================================================================

/**
 * Parse de offset UTC em milliseconds
 * Ex: "UTC-2" → -7200000 ms
 * 
 * Removeu parcialmente a redundância de calctime.js e day-column-renderer.js
 * que tinham parseServerOffset idênticos
 * 
 * @param {string} offset - String no formato "UTC±X" ou "UTC±X:Y"
 * @returns {number} Offset em milliseconds
 * 
 * @example
 * parseServerOffset("UTC-2")     // → -7200000
 * parseServerOffset("UTC+5:30")  // → 19800000
 * parseServerOffset("UTC±0")     // → 0
 */
export function parseServerOffset(offset) {
  if (!offset || typeof offset !== "string") return 0
  
  // Remove espaços
  const trimmed = offset.trim().toUpperCase()
  
  // Match "UTC" ou "GMT" com ±H ou ±H:M
  const match = trimmed.match(/^(?:UTC|GMT)\s*([+-])(\d{1,2})(?::(\d{2}))?$/)
  
  if (!match) return 0
  
  const sign = match[1] === "+" ? 1 : -1
  const hours = parseInt(match[2], 10)
  const minutes = match[3] ? parseInt(match[3], 10) : 0
  
  // Calcular offset em ms: (horas + minutos/60) × 3600000 ms/hora
  const totalMinutes = hours * 60 + minutes
  return sign * totalMinutes * 60 * 1000
}

/**
 * Obtém timestamp atual com offset de servidor aplicado
 * 
 * @param {number|string} serverOffset - Offset em ms ou string "UTC-2"
 * @returns {Date} Data/hora do servidor
 * 
 * @example
 * getApocNow(SERVER_CONFIG.OFFSET_MS)  // → Date com UTC-2 aplicado
 * getApocNow("UTC-2")  // → Date com UTC-2 aplicado
 */
export function getApocNow(serverOffset) {
  const offsetMs = typeof serverOffset === "string" 
    ? parseServerOffset(serverOffset)
    : serverOffset || 0
  
  return new Date(Date.now() + offsetMs)
}

/**
 * Obtém data de servidor com offset aplicado (sem conversão para Date obj)
 * Mantém como milliseconds para performance
 * 
 * @param {number|string} serverOffset - Offset
 * @returns {number} Timestamp em ms com offset aplicado
 */
export function getApocNowMs(serverOffset) {
  const offsetMs = typeof serverOffset === "string"
    ? parseServerOffset(serverOffset)
    : serverOffset || 0
  
  return Date.now() + offsetMs
}

// ============================================================================
// FORMATAÇÃO DE HORA - CONSOLIDADO
// ============================================================================

/**
 * Formata hora em HH:MM ou H:MM AM/PM
 * Version consolidada: substitui formatTime() de calctime.js
 * 
 * @param {number} hour - Hora (0-23)
 * @param {number} minute - Minuto (0-59)
 * @param {boolean} use24h - Se true: formato 24h, if false: 12h AM/PM
 * @returns {string} Hora formatada
 * 
 * @example
 * formatClockTime(14, 30, true)   // "14:30"
 * formatClockTime(14, 30, false)  // "2:30 PM"
 * formatClockTime(0, 5, true)     // "00:05"
 * formatClockTime(0, 5, false)    // "12:05 AM"
 */
export function formatClockTime(hour, minute, use24h = true) {
  // Validação
  if (!isValidHour24(hour) || !isValidMinute(minute)) {
    return "--:--"
  }
  
  const h = Math.floor(hour)
  const m = Math.floor(minute)
  
  // Pad com zero à esquerda
  const padZero = (n) => String(n).padStart(2, "0")
  
  if (use24h) {
    return `${padZero(h)}:${padZero(m)}`
  }
  
  // Formato 12h AM/PM
  let h12 = h % 12
  if (h12 === 0) h12 = 12  // Midnight/Noon
  
  const ampm = h >= 12 ? "PM" : "AM"
  
  return `${h12}:${padZero(m)} ${ampm}`
}

/**
 * Alias para backward compatibility
 * @deprecated Use formatClockTime() instead
 */
export function formatTime(hour, minute, use24h) {
  return formatClockTime(hour, minute, use24h)
}

/**
 * Alias para backward compatibility com calctime.js
 * @deprecated Use formatClockTime() instead
 */
export function formatClockParts(hour, minute) {
  return formatClockTime(hour, minute, true)
}

/**
 * Retorna hora local em {hour, minute, display}
 * Substitui textOr fallback do calctime.js
 * 
 * @param {boolean} use24h - Formato
 * @returns {Object} {hour, minute, display}
 */
export function getLocalTime(use24h = true) {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const display = formatClockTime(hour, minute, use24h)
  
  return { hour, minute, display }
}

/**
 * Formata intervalo de tempo em string legível
 * Ex: "2h 30m", "45m", "3d 4h"
 * 
 * @param {number} ms - Milliseconds
 * @returns {string} Tempo formatado
 */
export function formatTimeDuration(ms) {
  if (ms <= 0) return "0m"
  
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  if (minutes > 0) {
    return `${minutes}m`
  }
  return `${seconds}s`
}

// ============================================================================
// UTILITÁRIOS DE EVENTO/CALENDÁRIO
// ============================================================================

/**
 * Determina tipo de evento baseado no nome
 * 
 * @param {string} eventName - Nome do evento (ex: "Vehicle Alliance Duel")
 * @returns {string} Tipo: "vehicle", "hero", "army", "shelter", "science", ou "unknown"
 */
export function getEventType(eventName) {
  if (!eventName || typeof eventName !== "string") return "unknown"
  
  const lower = eventName.toLowerCase()
  
  if (lower.includes("vehicle")) return "vehicle"
  if (lower.includes("hero")) return "hero"
  if (lower.includes("army")) return "army"
  if (lower.includes("shelter")) return "shelter"
  if (lower.includes("science")) return "science"
  
  return "unknown"
}

/**
 * Obtém caminho/URL de ícone para um tipo de evento
 * 
 * @param {string} day - Chave de dia (ex: "day-peace", "day-vehicle")
 * @param {string} hour - Hora (ex: "14:30")
 * @param {Object} iconMap - Mapa de {tipo → URL de ícone}
 * @returns {string} URL de ícone ou caminho relativo
 */
export function getEventIcon(day, hour, iconMap = {}) {
  if (!iconMap || !day) return ""
  return iconMap[day] || ""
}

/**
 * Verifica se um horário é hoje
 * 
 * @param {number} dayIndex - Índice de dia (0-6, segunda-domingo)
 * @param {number|string} serverOffset - Offset UTC
 * @returns {boolean}
 */
export function isToday(dayIndex, serverOffset = SERVER_CONFIG.OFFSET_MS) {
  if (dayIndex < 0 || dayIndex > 6) return false
  
  const now = getApocNow(serverOffset)
  const dayOfWeek = now.getDay()
  
  // Ajusta para segunda=0, terça=1, etc (ao invés de domingo=0)
  const adjustedToday = (dayOfWeek + 6) % 7
  
  return dayIndex === adjustedToday
}

/**
 * Verifica se um horário é no passado (relativo a servidor)
 * 
 * @param {number} dayIndex - Índice de dia
 * @param {number} hour - Hora (0-23)
 * @param {number|string} serverOffset - Offset UTC
 * @returns {boolean}
 */
export function isPast(dayIndex, hour, serverOffset = SERVER_CONFIG.OFFSET_MS) {
  const now = getApocNow(serverOffset)
  const currentDay = (now.getDay() + 6) % 7
  const currentHour = now.getHours()
  
  if (dayIndex > currentDay) return false
  if (dayIndex < currentDay) return true
  
  return hour < currentHour
}

/**
 * Calcula diferença de tempo até um horário futuro
 * 
 * @param {number} dayIndex - Índice de dia
 * @param {number} hour - Hora
 * @param {number|string} serverOffset - Offset UTC
 * @returns {number} Milliseconds até o horário (negativo se passado)
 */
export function msUntil(dayIndex, hour, serverOffset = SERVER_CONFIG.OFFSET_MS) {
  const now = getApocNow(serverOffset)
  const currentDayIndex = (now.getDay() + 6) % 7
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // Calcula quantos dias faltam
  let daysAhead = dayIndex - currentDayIndex
  if (daysAhead < 0) daysAhead += 7  // Se passou essa semana, vai ser semana que vem
  
  // Target time às 00:00 do dia e hora desejada
  const target = new Date(now)
  target.setDate(target.getDate() + daysAhead)
  target.setHours(hour, 0, 0, 0)
  
  return target.getTime() - now.getTime()
}

/**
 * Obtém próximo horário de evento (dia + hora)
 * 
 * @param {Array<number>} scheduledDays - Array de índices de dias com evento
 * @param {Array<number>} scheduledHours - Array de horas com evento
 * @param {number|string} serverOffset - Offset UTC
 * @returns {Object|null} {dayIndex, hour, msUntil} ou null se nenhum agendado
 */
export function getNextEventTime(scheduledDays = [], scheduledHours = [], serverOffset = SERVER_CONFIG.OFFSET_MS) {
  if (!scheduledDays.length || !scheduledHours.length) return null
  
  let nearestMs = Infinity
  let nearestEvent = null
  
  for (const day of scheduledDays) {
    for (const hour of scheduledHours) {
      const ms = msUntil(day, hour, serverOffset)
      
      // Só considera eventos futuros
      if (ms > 0 && ms < nearestMs) {
        nearestMs = ms
        nearestEvent = { dayIndex: day, hour, msUntil: ms }
      }
    }
  }
  
  return nearestEvent
}

// ============================================================================
// VALIDAÇÃO E CONVERSÃO
// ============================================================================

/**
 * Valida horário em intervalo válido
 * 
 * @param {number} hour - Hora
 * @param {number} minute - Minuto
 * @returns {boolean}
 */
export function isValidClockTime(hour, minute) {
  return isValidHour24(hour) && isValidMinute(minute)
}

/**
 * Converte hora em minutos desde meia-noite
 * 
 * @param {number} hour - Hora
 * @param {number} minute - Minuto
 * @returns {number} Total de minutos desde 00:00
 */
export function clockToTotalMinutes(hour, minute) {
  if (!isValidClockTime(hour, minute)) return 0
  return hour * 60 + minute
}

/**
 * Converte minutos em {hour, minute}
 * 
 * @param {number} totalMinutes - Minutos desde 00:00
 * @returns {Object} {hour, minute}
 */
export function totalMinutesToClock(totalMinutes) {
  const mins = Math.max(0, Math.min(1439, Math.floor(totalMinutes)))  // 0-1439
  return {
    hour: Math.floor(mins / 60),
    minute: mins % 60
  }
}

// ============================================================================
// CONSOLIDAÇÃO DEFAULT EXPORT
// ============================================================================

export default {
  // Server offset
  parseServerOffset,
  getApocNow,
  getApocNowMs,
  
  // Time formatting
  formatClockTime,
  formatTime,
  formatClockParts,
  getLocalTime,
  formatTimeDuration,
  
  // Event utilities
  getEventType,
  getEventIcon,
  isToday,
  isPast,
  msUntil,
  getNextEventTime,
  
  // Validation & conversion
  isValidClockTime,
  clockToTotalMinutes,
  totalMinutesToClock
}
