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

function missing(base, obj, prefix = '') {
  let out = []
  for (const key of Object.keys(base)) {
    const dotted = prefix ? `${prefix}.${key}` : key
    if (!(key in obj)) {
      out.push(dotted)
      continue
    }

    const bv = base[key]
    const ov = obj[key]
    if (
      bv &&
      typeof bv === 'object' &&
      !Array.isArray(bv) &&
      ov &&
      typeof ov === 'object' &&
      !Array.isArray(ov)
    ) {
      out = out.concat(missing(bv, ov, dotted))
    }
  }
  return out
}

const en = load('en.js')
for (const file of files) {
  if (file === 'en.js') continue
  const m = missing(en, load(file))
  console.log(`${file}: ${m.length} missing`)
  if (m.length > 0) {
    console.log(`  sample: ${m.slice(0, 12).join(', ')}`)
  }
}
