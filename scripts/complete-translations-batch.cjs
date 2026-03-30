const fs = require('fs')
const path = require('path')
const vm = require('vm')

const dir = path.join('c:', 'Git', 'zcalendar', 'src', 'translations')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'))

function load(file) {
  const code = fs
    .readFileSync(path.join(dir, file), 'utf8')
    .replace(/^\uFEFF/, '')
    .replace(/export\s+default/, 'module.exports=')
  const sandbox = { module: { exports: {} }, exports: {} }
  vm.runInNewContext(code, sandbox)
  return sandbox.module.exports || {}
}

function isPlainObject(v) {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v)
}

function clone(v) {
  return JSON.parse(JSON.stringify(v))
}

function getAt(obj, pathArr) {
  let cur = obj
  for (const part of pathArr) {
    if (cur == null) return undefined
    cur = cur[part]
  }
  return cur
}

function setAt(obj, pathArr, value) {
  let cur = obj
  for (let i = 0; i < pathArr.length - 1; i++) {
    const key = pathArr[i]
    if (!isPlainObject(cur[key]) && !Array.isArray(cur[key])) {
      cur[key] = typeof pathArr[i + 1] === 'number' ? [] : {}
    }
    cur = cur[key]
  }
  cur[pathArr[pathArr.length - 1]] = value
}

function collectMissing(base, current, prefix = []) {
  const out = []

  if (isPlainObject(base)) {
    const curObj = isPlainObject(current) ? current : {}
    for (const key of Object.keys(base)) {
      const has = Object.prototype.hasOwnProperty.call(curObj, key)
      if (!has) {
        out.push(...collectMissing(base[key], undefined, [...prefix, key]))
      } else {
        out.push(...collectMissing(base[key], curObj[key], [...prefix, key]))
      }
    }
    return out
  }

  if (Array.isArray(base)) {
    if (Array.isArray(current)) return out
    for (let i = 0; i < base.length; i++) {
      out.push(...collectMissing(base[i], undefined, [...prefix, i]))
    }
    return out
  }

  out.push({ path: prefix, value: base })
  return out
}

const langMap = {
  'pt-pt': 'pt',
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

async function translateBatch(values, lang) {
  if (values.length === 0) return []
  const SEP = '\n<<<SEP_9f0f>>>\n'
  const joined = values.join(SEP)
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(lang)}&dt=t&q=${encodeURIComponent(joined)}`

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(10000) })
    const data = await resp.json()
    const translated = data?.[0]?.map((c) => c?.[0] || '').join('') || joined
    const parts = translated.split(SEP)
    if (parts.length === values.length) return parts
  } catch {}

  // fallback: preserve original if batch translation fails
  return values
}

function toModule(obj) {
  return `export default ${JSON.stringify(obj, null, 2)}\n`
}

async function main() {
  const base = load('en.js')

  for (const file of files) {
    if (file === 'en.js' || file === 'pt-br.js') continue

    const code = file.replace(/\.js$/, '')
    const tl = langMap[code] || code
    const current = load(file)
    const result = clone(current)

    const missing = collectMissing(base, current)
    const stringMissing = missing.filter((m) => typeof m.value === 'string')
    const nonStringMissing = missing.filter((m) => typeof m.value !== 'string')

    const translated = await translateBatch(stringMissing.map((m) => m.value), tl)

    stringMissing.forEach((m, idx) => {
      setAt(result, m.path, translated[idx])
    })

    nonStringMissing.forEach((m) => {
      setAt(result, m.path, m.value)
    })

    fs.writeFileSync(path.join(dir, file), toModule(result), 'utf8')
    console.log(`completed ${file}: added ${missing.length} keys`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
