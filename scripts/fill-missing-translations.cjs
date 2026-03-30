const fs = require('fs')
const path = require('path')
const vm = require('vm')

const dir = path.join('c:', 'Git', 'zcalendar', 'src', 'translations')

function load(file) {
  const code = fs
    .readFileSync(path.join(dir, file), 'utf8')
    .replace(/^\uFEFF/, '')
    .replace(/export\s+default/, 'module.exports=')
  const sandbox = { module: { exports: {} }, exports: {} }
  vm.runInNewContext(code, sandbox)
  return sandbox.module.exports || {}
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const langMap = {
  'pt-pt': 'pt',
  'pt-br': 'pt',
  ar: 'ar',
  bn: 'bn',
  de: 'de',
  es: 'es',
  fr: 'fr',
  hi: 'hi',
  id: 'id',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  mr: 'mr',
  pl: 'pl',
  ru: 'ru',
  sw: 'sw',
  tr: 'tr',
  ur: 'ur',
  zh: 'zh-cn'
}

const cache = new Map()

async function translate(text, lang) {
  const raw = String(text || '').trim()
  if (!raw) return raw

  const key = `${lang}::${raw}`
  if (cache.has(key)) return cache.get(key)

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(lang)}&dt=t&q=${encodeURIComponent(raw)}`
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const data = await resp.json()
    const translated = data?.[0]?.map((chunk) => chunk?.[0] || '').join('').trim() || raw
    cache.set(key, translated)
    return translated
  } catch {
    cache.set(key, raw)
    return raw
  }
}

async function fillFromBase(baseValue, currentValue, lang) {
  if (isPlainObject(baseValue)) {
    const currentObj = isPlainObject(currentValue) ? currentValue : {}
    const result = { ...currentObj }
    for (const key of Object.keys(baseValue)) {
      if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
        result[key] = await fillFromBase(baseValue[key], currentObj[key], lang)
      } else {
        result[key] = await fillFromBase(baseValue[key], undefined, lang)
      }
    }
    return result
  }

  if (Array.isArray(baseValue)) {
    if (Array.isArray(currentValue)) return currentValue
    const out = []
    for (const item of baseValue) {
      if (typeof item === 'string') {
        out.push(await translate(item, lang))
      } else {
        out.push(item)
      }
    }
    return out
  }

  if (typeof baseValue === 'string') {
    if (typeof currentValue === 'string') return currentValue
    return translate(baseValue, lang)
  }

  return currentValue === undefined ? baseValue : currentValue
}

function toJsModule(obj) {
  return `export default ${JSON.stringify(obj, null, 2)}\n`
}

async function main() {
  const base = load('en.js')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'en.js')

  for (const file of files) {
    const langCode = file.replace(/\.js$/, '')
    const tl = langMap[langCode] || langCode
    console.log(`processing ${file} (${tl})`)
    const current = load(file)
    const completed = await fillFromBase(base, current, tl)
    fs.writeFileSync(path.join(dir, file), toJsModule(completed), 'utf8')
    console.log(`updated ${file}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
