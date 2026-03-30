/**
 * Módulo de utilidades para calendário e tempo
 * Contém funções de parseamento de offset de servidor, cálculo de tempo apocalipse, etc
 */

import { is24h } from "./calctime.js"
import { ICONS } from "./events.js"

/**
 * Formatar como relógio 24h ou 12h
 */
export function formatClockParts(hour, minute) {
  const hh = String(hour).padStart(2, "0")
  const mm = String(minute).padStart(2, "0")

  if (is24h()) return `${hh}:${mm}`

  const h12 = hour % 12 === 0 ? 12 : hour % 12
  const suffix = hour >= 12 ? "PM" : "AM"
  return `${String(h12).padStart(2, "0")}:${mm} ${suffix}`
}

/**
 * Parse server offset string como "UTC-2" ou número
 */
export function parseServerOffset(offset) {
  if (typeof offset === "number") return offset * 3600000

  if (typeof offset === "string") {
    let normalized = offset.trim().toUpperCase()

    if (normalized.startsWith("UTC")) {
      normalized = normalized.substring(3)
    }

    const reHms = /^([+-])(\d{1,2})(?::?(\d{2}))?$/
    const m = normalized.match(reHms)
    if (m) {
      const sign = m[1] === "+" ? 1 : -1
      const hours = Number(m[2])
      const minutes = m[3] ? Number(m[3]) : 0
      return sign * (hours * 60 + minutes) * 60000
    }

    const asNum = Number(normalized)
    if (!Number.isNaN(asNum)) {
      return asNum * 3600000
    }
  }

  console.warn("Invalid SERVER_OFFSET", offset)
  return 0
}

/**
 * Get apocalypse time now (com offset do servidor)
 */
export function getApocNow(serverOffset = "UTC-2") {
  const now = new Date()
  const offsetMs = parseServerOffset(serverOffset)
  return new Date(now.getTime() + offsetMs)
}

/**
 * Get tipo de evento baseado no nome
 */
export function getEventType(eventName) {
  if (eventName.includes("Army")) return "army"
  if (eventName.includes("Vehicle")) return "vehicle"
  if (eventName.includes("Shelter")) return "shelter"
  if (eventName.includes("Science")) return "science"
  if (eventName.includes("Hero")) return "hero"
  return "all"
}

/**
 * Get ícone baseado no dia e hora
 */
export function getIcon(day, hour) {
  if (day === 0) return ICONS.red
  if (day === 3 && hour >= 16) return ICONS.red
  if (day === 4) return ICONS.red
  if (day === 6 && hour >= 16) return ICONS.red
  if (day === 1 || day === 5) return ICONS.gold

  return ICONS.white
}

/**
 * Verificar se é hoje
 */
export function isToday(dayIndex, serverOffset = "UTC-2") {
  const now = getApocNow(serverOffset)
  return now.getUTCDay() === dayIndex
}

/**
 * Verificar se já passou (dia ou horário)
 */
export function isPast(dayIndex, hour, serverOffset = "UTC-2") {
  const now = getApocNow(serverOffset)
  const nowDay = now.getUTCDay()
  const nowHour = now.getUTCHours()

  if (dayIndex < nowDay) return true
  if (dayIndex === nowDay && hour < nowHour) return true

  return false
}
