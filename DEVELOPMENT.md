<!-- DEVELOPMENT.md -->

# Guia de Desenvolvimento - LastZ Help

Documento técnico para desenvolvedores que trabalham no projeto zcalendar.

## 📋 Índice

- [Setup Inicial](#setup-inicial)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Padrões de Código](#padrões-de-código)
- [Renderização](#renderização)
- [Internacionalização](#internacionalização)
- [Testes](#testes)
- [Performance](#performance)
- [Deploy](#deploy)

---

## 🚀 Setup Inicial

### Requisitos
- Node.js 16+ (recomendado 18 LTS)
- npm 8+
- Git

### Instalação

```bash
# Clonar repositório
git clone https://github.com/sambomb/zcalendar.git
cd zcalendar

# Instalar dependências
npm install

# Iniciar dev server com hot reload
npm run dev
# Abrir http://localhost:5173 no navegador

# Build para produção
npm run build

# Preview da build
npm run preview
```

### VS Code Extensions Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",        // ESLint
    "esbenp.prettier-vscode",        // Prettier formatting
    "bradlc.vscode-tailwindcss",     // Se usar Tailwind no futuro
    "ritwickdey.live-sass",          // Se expandir CSS
    "vitest.explorer"                 // Para testes futuros
  ]
}
```

---

## 📁 Estrutura de Arquivos

### Organização

```
src/
├── 🎯 CAMADA CONFIGURAÇÃO
│   ├── config.js           # Constantes centralizadas (URL, offset, breakpoints)
│   ├── routes.js           # Mapa de rotas e menu structures
│   ├── events.js           # Definição de tipos de eventos
│   └── points.js           # Lógica de pontuação
│
├── 🛡️ CAMADA SEGURANÇA
│   └── secure-utils.js     # Escape HTML, validação URL, sanitização
│
├── ⚙️ CAMADA LÓGICA
│   ├── calendar-helpers.js # Funções calendário (CONSOLIDADO)
│   ├── calctime.js         # (LEGADO - preferir calendar-helpers.js)
│   ├── mobile.js           # Detecção de breakpoints mobile
│   └── ui.js               # Orquestrador principal de UI
│
├── 🎨 CAMADA RENDERIZAÇÃO
│   ├── render-manager.js   # Facade de renderização
│   ├── text-renderer.js    # Renderiza texto
│   ├── calendar-renderer.js
│   ├── day-column-renderer.js
│   ├── menu-renderer.js
│   ├── score-table-renderer.js
│   └── guide-card-renderer.js
│
├── 🌍 CAMADA I18N
│   ├── translate.js        # Gerenciador de idiomas
│   ├── guide-helpers.js    # Helpers para guias e tradução
│   └── translations/
│       ├── en.js
│       ├── pt-br.js
│       ├── pt-pt.js
│       └── ... (18 mais idiomas)
│
├── 📚 CAMADA DADOS
│   ├── guides.js           # Índice/mapa de guias
│   └── guides-general.js   # Definição de ~100 guias
│
├── 🎨 ESTILO
│   └── styles.css          # Stylesheet unificado
│
└── 📄 ENTRY POINTS
    ├── main.js             # Entry point principal
    ├── index.js            # (LEGADO - preferir main.js)
    ├── page-main.js        # Lógica página calendário
    └── page-guides.js      # Lógica página guias
```

### Regras Organizacionais

**✅ FAÇA:**
- Coloque helper globais em `secure-utils.js` ou `calendar-helpers.js`
- Mantenha configurações em `config.js`
- Importe explicitamente de modules específicos
- Use `export { named }` para exports explícitos

**❌ NÃO FAÇA:**
- Não crie variáveis globais (usar `config.js`)
- Não duplique lógica (consolidar em helpers)
- Não use `import * as module from "..."` sem motivo
- Não adicione lógica de UI diretamente em arquivos de dados

---

## 📝 Padrões de Código

### JavaScript

#### 1. Imports & Exports

```javascript
// ❌ EVITE
import * as utils from "./utils.js"
utils.formatTime()

// ✅ FAÇA
import { formatTime, formatDate } from "./utils.js"
formatTime(hour, minute)
```

#### 2. Funções

```javascript
// ✅ Função bem documentada
/**
 * Formata hora em HH:MM ou H:MM AM/PM
 * 
 * @param {number} hour - Hora (0-23)
 * @param {number} minute - Minuto (0-59)
 * @param {boolean} use24h - Formato 24h (padrão: true)
 * @returns {string} Hora formatada "14:30" ou "2:30 PM"
 * 
 * @example
 * formatClockTime(14, 30, true)   // "14:30"
 * formatClockTime(14, 30, false)  // "2:30 PM"
 */
export function formatClockTime(hour, minute, use24h = true) {
  // implementation
}
```

#### 3. Tratamento de Erros

```javascript
// ✅ Sempre valide entrada
export function selectOption(value, options = []) {
  if (!Array.isArray(options)) return null
  if (value === null || value === undefined) return null
  
  const found = options.find(opt => opt.value === value)
  return found || options[0] || null
}
```

#### 4. Async/Await

```javascript
// ✅ Use async/await (mais legível que .then())
async function loadLang(code) {
  try {
    const mod = await import(`./translations/${code}.js`)
    return mod.default
  } catch (e) {
    console.warn(`Idioma ${code} não encontrado, usando EN`)
    return null
  }
}
```

#### 5. Null Coalescing & Optional Chaining

```javascript
// ✅ Use novos operadores
const lang = userChoice ?? localStorage.getItem("lang") ?? "en"
const name = user?.profile?.name ?? "Unnamed"
```

### CSS

#### 1. Variáveis CSS

```css
:root {
  --primary: #007bff;
  --bg-light: #f8f9fa;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
}

.button {
  background: var(--primary);
  padding: var(--spacing-md);
}
```

#### 2. Media Queries (Mobile First)

```css
/* Desktop por padrão */
.sidebar {
  width: 300px;
  position: fixed;
}

/* Mobile (≤720px) */
@media (max-width: 720px) {
  .sidebar {
    width: 100%;
  }
}
```

#### 3. Naming Convention (BEM)

```css
.calendar {}                       /* Bloco */
.calendar__header {}               /* Elemento */
.calendar__header--active {}       /* Modificador */
.calendar__day {}
.calendar__day--today {}
```

#### 4. Acessibilidade

```html
<!-- ✅ Sempre use labels e ARIA -->
<button id="lang-toggle" aria-label="Language selection">
  🌐
</button>

<input
  type="number"
  id="bonus-input"
  aria-label="Bonus multiplier"
  min="0"
  max="100"
>
```

---

## 🎨 Renderização

### RenderManager (Facade Pattern)

Todos os renders passam por `RenderManager` para consolidar lógica:

```javascript
// ✅ CORRETO
import { createRenderManager } from "./render-manager.js"

const renderManager = createRenderManager(config)
const html = renderManager.renderFullCalendarTable(dayGuideIds)
```

### Adicionando um Novo Renderer

1. Crie classe em arquivo separado:
```javascript
// src/my-custom-renderer.js
export class MyCustomRenderer {
  constructor(config) {
    this.config = config
  }
  
  render(data) {
    return `<div>${escapeHtml(data.title)}</div>`
  }
}
```

2. Registre em `render-manager.js`:
```javascript
import { MyCustomRenderer } from "./my-custom-renderer.js"

export function createRenderManager(config) {
  const myCustomRenderer = new MyCustomRenderer(config)
  
  return {
    renderMyCustom: (data) => myCustomRenderer.render(data)
  }
}
```

### Escape de HTML

Sempre escape conteúdo de usuário ou externo:

```javascript
// ❌ NUNCA
element.innerHTML = `<div>${userInput}</div>`

// ✅ SEMPRE
import { escapeHtml } from "./secure-utils.js"
element.innerHTML = `<div>${escapeHtml(userInput)}</div>`
```

---

## 🌍 Internacionalização

### Adicionando Novo Idioma

1. Crie arquivo `src/translations/xx.js`:
```javascript
// src/translations/pt-br.js
export default {
  appTitle: "LastZ Help",
  days: ["Segunda", "Terça", "Quarta", ...],
  events: {
    vehicle: "Duel de Veículo",
    hero: "Duel de Herói",
  },
  // ... mais chaves
}
```

2. Adicione ao mapa em `translate.js`:
```javascript
import * as xxMod from './translations/xx.js'

const modules = {
  './translations/xx.js': () => Promise.resolve(xxMod),
  // ... outros
}
```

3. Registre em `config.js`:
```javascript
export const LANGS_CONFIG = [
  { code: "xx", flag: "xx", name: "Lingua" },
  // ... outros
]
```

### Usando Tradução no Código

```javascript
import { T } from "./translate.js"

// ✅ Acesse chaves de tradução
const title = T.appTitle
const dayName = T.days[0]
const eventName = T.events.hero
```

### Interpolação de Strings

```javascript
// Em arquivo de tradução:
export default {
  welcomeMessage: "Welcome, {name}!"
}

// No código:
function interpolate(template, values) {
  return template.replace(/{(\w+)}/g, (_, key) => values[key] || "")
}

const msg = interpolate(T.welcomeMessage, { name: "Alice" })
```

---

## 🧪 Testes

### Setup de Testes (Recomendado: Vitest)

```bash
# Instalar dependências
npm install -D vitest @vitest/ui

# Adicionar script
npm test -- --ui
```

### Exemplo de Teste

```javascript
// src/__tests__/calendar-helpers.test.js
import { describe, it, expect } from "vitest"
import { formatClockTime, parseServerOffset } from "../calendar-helpers.js"

describe("calendar-helpers", () => {
  describe("formatClockTime", () => {
    it("formata hora em 24h", () => {
      expect(formatClockTime(14, 30, true)).toBe("14:30")
    })
    
    it("formata hora em 12h AM/PM", () => {
      expect(formatClockTime(14, 30, false)).toBe("2:30 PM")
    })
    
    it("retorna -- se hora inválida", () => {
      expect(formatClockTime(25, 0)).toBe("--:--")
    })
  })
  
  describe("parseServerOffset", () => {
    it("converte UTC-2 corretamente", () => {
      const ms = parseServerOffset("UTC-2")
      expect(ms).toBe(-7200000)
    })
  })
})
```

### Testing com Renderização

```javascript
// src/__tests__/secure-utils.test.js
import { describe, it, expect } from "vitest"
import { escapeHtml, createSafeLink } from "../secure-utils.js"

describe("secure-utils", () => {
  it("escapa caracteres HTML perigosos", () => {
    expect(escapeHtml("<script>alert('xss')</script>"))
      .toBe("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;")
  })
  
  it("cria link seguro com URL validada", () => {
    const link = createSafeLink("GitHub", "https://github.com/sambomb/zcalendar")
    expect(link).toContain("github.com")
  })
  
  it("retorna apenas texto se URL inválida", () => {
    const link = createSafeLink("Click", "javascript:alert('xss')")
    expect(link).toBe("Click")  // Apenas texto, sem link
  })
})
```

---

## ⚡ Performance

### Análise de Performance

```javascript
// Medir duração de função
function measurePerformance(name, fn) {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start
  console.log(`${name} took ${duration.toFixed(2)}ms`)
  return result
}

// Uso
const calendar = measurePerformance("Render Calendar", () => {
  return renderManager.renderFullCalendarTable(dayGuideIds)
})
```

### Otimizações Implementadas

1. **Debouncing de Resize**
```javascript
let resizeTimeout
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    updateLayout()
  }, 150)
})
```

2. **Lazy Rendering**
```javascript
// Renderiza apenas elementos visíveis
function renderVisibleOnly(items, containerHeight) {
  const viewport = {
    top: window.scrollY,
    bottom: window.scrollY + containerHeight
  }
  
  return items.filter((item, i) => {
    const itemTop = i * ITEM_HEIGHT
    return itemTop < viewport.bottom && (itemTop + ITEM_HEIGHT) > viewport.top
  })
}
```

3. **Memoização de Computados**
```javascript
const memoCache = new Map()

function memoize(key, computeFn) {
  if (memoCache.has(key)) {
    return memoCache.get(key)
  }
  
  const result = computeFn()
  memoCache.set(key, result)
  return result
}

// Uso
const formatted = memoize(`time_${hour}_${minute}_${use24h}`, () => {
  return formatClockTime(hour, minute, use24h)
})
```

### Checklist de Performance

- [ ] Usar `const`/`let` (não `var`)
- [ ] Evitar loops aninhados quando possível
- [ ] Usar `.map()` / `.filter()` ao invés de for loops
- [ ] Memoizar cálculos custosos
- [ ] Debounce eventos de resize/scroll
- [ ] Lazy load imagens
- [ ] Comprimir assets (Vite faz automaticamente)

---

## 🚀 Deploy

### Build para Produção

```bash
# Build
npm run build

# Verifica dist/
ls -la dist/

# Prevê build funcionando
npm run preview
```

### GitHub Pages

```bash
# Configurar package.json
{
  "homepage": "https://sambomb.github.io/zcalendar"
}

# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar scripts
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

### Self-Hosted

```bash
# Build
npm run build

# Copiar dist/* para servidor web
cp -r dist/* /var/www/html/zcalendar/

# Configurar reverse proxy nginx (opcional)
server {
  listen 80;
  server_name lastzhelp.com;
  
  location / {
    root /var/www/html/zcalendar;
    try_files $uri $uri/ /index.html;
  }
}
```

### Variáveis de Ambiente

Criar `.env` para desenvolvimento:

```bash
# .env
VITE_API_URL=http://localhost:3000
VITE_BASE_URL=/

# .env.production
VITE_API_URL=https://api.lastzhelp.com
VITE_BASE_URL=/zcalendar/
```

Usar em código:

```javascript
const apiUrl = import.meta.env.VITE_API_URL
const baseUrl = import.meta.env.VITE_BASE_URL
```

---

## 🐛 Debug

### Console Logging

```javascript
// Níveis de log
console.log("INFO", message)           // Informação
console.warn("WARNING", message)       // Aviso
console.error("ERROR", message)        // Erro
console.debug("DEBUG", message)        // Debug (dev only)

// Com contexto
console.log("📅 Calendar", { dayIndex, events, rendered })
```

### DevTools Tips

1. **Breakpoints**: F12 → Sources → Click line number
2. **Watch**: F12 → Sources → Watch → Add expression
3. **Console API**: `copy()`, `$0`, `$_`
4. **Performance**: F12 → Performance → Record
5. **Network**: F12 → Network → Filter por tipo

### Common Issues

**Issue**: Calendário não atualiza ao trocar idioma
```javascript
// ❌ PROBLEMA: evento de mudança não dispara re-render
// ✅ SOLUÇÃO: Chamar updateAll() após loadLang()
await loadLang(newLang)
updateAll()  // Força re-render
```

**Issue**: XSS em conteúdo renderizado
```javascript
// ❌ PROBLEMA
element.innerHTML = userText

// ✅ SOLUÇÃO
import { escapeHtml } from "./secure-utils.js"
element.innerHTML = escapeHtml(userText)
```

**Issue**: Estilo RTL não aplica
```javascript
// ✅ Adicionar dir attribute
element.dir = isRtl ? "rtl" : "ltr"
element.classList.toggle("is-rtl", isRtl)
```

---

## 📞 Suporte

- 📚 Leia [README.md](./README.md) para visão geral
- 🐛 Abra [Issues no GitHub](https://github.com/sambomb/zcalendar/issues)
- 💬 Crie [Discussions](https://github.com/sambomb/zcalendar/discussions)

---

**Última atualização**: Março 2026
