# Arquitetura - LastZ Help

Documentação técnica detalhada da arquitetura do projeto zcalendar.

## 🏗️ Visão de Alto Nível

```
┌─────────────────────────────────────────────────┐
│             USER INTERFACE (HTML/CSS)            │
├─────────────────────────────────────────────────┤
│  Header | Menu | Calendar | Guides | Footer    │
├─────────────────────────────────────────────────┤
│          RENDER LAYER (RenderManager)           │
│                                                  │
│  TextRenderer | CalendarRenderer | DayColumn  │
│  MenuRenderer | ScoreTableRenderer | Guide    │
├─────────────────────────────────────────────────┤
│          BUSINESS LOGIC LAYER                   │
│                                                  │
│  ui.js | translate.js | mobile.js             │
│  calendar-helpers.js | event handlers          │
├─────────────────────────────────────────────────┤
│      UTILITIES & SECURITY LAYER                 │
│                                                  │
│  secure-utils.js | calendar-helpers.js        │
│  config.js                                      │
├─────────────────────────────────────────────────┤
│           DATA LAYER                            │
│                                                  │
│  guides.js | events.js | points.js            │
│  translations/ | routes.js                      │
└─────────────────────────────────────────────────┘
```

## 📦 Estrutura de Módulos

### 1. Entry Points
```
index.html
    ↓
main.js (preferred)
    ↓
ui.js (initUI)
    ↓
loadLang() → renderFullUI()
```

### 2. Data Flow

```
User Action (click, change)
    ↓
Event Handler (ui.js)
    ↓
Update Model (state variables)
    ↓
Call RenderManager
    ↓
RenderManager dispatches to Renderers
    ↓
Renderers call secure-utils & calendar-helpers
    ↓
Update DOM
    ↓
Apply CSS
    ↓
UI Updated ✓
```

## 🎯 Componentes Principais

### Config.js
**Responsabilidade**: Single source of truth para configurações

```javascript
// Acesso de configurações
SERVER_CONFIG.OFFSET_MS → Offset do servidor
UI_CONFIG.MOBILE_BREAKPOINT_PX → Breakpoint mobile
SECURITY_CONFIG.WHITELIST_DOMAINS → Domínios permitidos
URLs.ISSUES → URL de issues
```

**Uso**:
```javascript
import { SERVER_CONFIG, isRtlLang } from "./config.js"

const offsetMs = SERVER_CONFIG.OFFSET_MS
const isRtl = isRtlLang("ar")
```

### Calendar-Helpers.js
**Responsabilidade**: Todos os cálculos de tempo/calendário

```javascript
parseServerOffset("UTC-2")  → -7200000ms
formatClockTime(14, 30, true)  → "14:30"
getApocNow(offset)  → Date com offset aplicado
isToday(dayIndex, offset)  → boolean
isPast(dayIndex, hour, offset)  → boolean
msUntil(dayIndex, hour, offset)  → milliseconds
```

**Benefício**: Remove duplicação que tinha em 3 arquivos

### Secure-Utils.js
**Responsabilidade**: Todas as funções de segurança e sanitização

```javascript
// HTML Security
escapeHtml(text)  → HTML-escapado
stripHtmlTags(html)  → Apenas texto
sanitizeHtmlAttribute(value)  → Atributo seguro

// URL Security
isSafeUrl(url)  → boolean (whitelist)
normalizeUrl(url)  → URL segura ou ""

// Input Validation
isValidEmail(email)  → boolean
isValidNumber(value)  → boolean
sanitizeNumber(value, decimals)  → number|null

// HTML Building
createSafeSpan(text, options)  → HTML string
createSafeLink(text, href, options)  → HTML string
```

**Benefício**: Centraliza prevenção XSS, remove duplicação de `textOr()`, `escapeHtml()`

### RenderManager (Facade)
**Responsabilidade**: Interface unificada para renderização

```javascript
const renderManager = createRenderManager(config)

// Calendar
renderManager.renderFullCalendarTable(dayGuideIds)
renderManager.highlightCurrentDayAndHour(day, hour)

// Menu
renderManager.renderFullMenu(activeId)

// Text
renderManager.renderText(text)
renderManager.renderTextWithLinks(text)

// Scores
renderManager.renderFullTable(options)

// Guides
renderManager.renderGuideCard(guide)
```

### Translate.js
**Responsabilidade**: Internacionalização e tradução

```javascript
// Globais
T  →  Objeto de tradução atual
CURRENT_LANG  →  Código idioma atual
LANGS_CONFIG  →  Array de {code, flag, name}

// Funções
await loadLang(code)  →  Carrega arquivo tradução
detectLang()  →  Detecta locale do browser
buildLangSelect()  →  Renderiza <select>
isRtl()  →  boolean para RTL
getDirAttr()  →  Retorna dir="rtl" ou ""
```

## 🔗 Dependências de Módulo

```
main.js
├─→ ui.js (orquestração)
│   ├─→ translate.js (i18n)
│   │   ├─→ translations/*.js (idiomas)
│   │   └─→ config.js (LANGS_CONFIG)
│   ├─→ render-manager.js (renderização)
│   │   ├─→ text-renderer.js
│   │   ├─→ calendar-renderer.js
│   │   ├─→ day-column-renderer.js
│   │   ├─→ menu-renderer.js
│   │   ├─→ score-table-renderer.js
│   │   └─→ guide-card-renderer.js
│   ├─→ calendar-helpers.js (lógica tempo)
│   │   └─→ config.js
│   ├─→ secure-utils.js (segurança)
│   │   └─→ config.js
│   ├─→ events.js (dados eventos)
│   ├─→ routes.js (mapa rotas)
│   ├─→ points.js (pontuação)
│   ├─→ guides.js (índice guias)
│   │   └─→ guides-general.js (~1800L dados)
│   ├─→ calctime.js (legado)
│   └─→ mobile.js (mobile sync)
│
└─→ styles.css (UI)
```

## 🔄 Fluxo de Aplicação

### Inicialização

```
1. index.html carregado
2. main.js importado
3. loadLang() → detecta idioma
4. await buildLangSelect() → HTML <select>
5. await initUI() → setupRenderManager()
6. renderFullCalendar() → populaTabela
7. setupEventHandlers() → listeners
8. setInterval(updateAll, 1000) → timer
```

### Atualização em Tempo Real

```
Cada 1 segundo (setInterval):
1. updateAll()
2. updateTimer() → atualiza #timeInfo
3. updateCalendarHighlight() → marca hora atual
4. checkEventFilters() → re-renderiza se necesário
```

### Mudança de Idioma

```
1. Usuário seleciona idioma em <select>
2. onChange → handleLangChange()
3. loadLang(newCode) → import arquivo
4. localStorage.setItem("lang", newCode)
5. Reload página (ou updateAll())
```

### Mudança de Filtro

```
1. Usuário clica botão filtro
2. onClick → currentFilter = filtro
3. updateCalendar()
4. renderFullCalendarTable() com filtro aplicado
```

## 🎨 Renderização

### Padrão RenderManager

```javascript
// ANTES (Renderer direto)
function renderCalendar() {
  return htmlString  // Direto
}

// DEPOIS (Via RenderManager)
const renderManager = createRenderManager(config)
const html = renderManager.renderFullCalendarTable(days)
```

**Benefícios**:
- Configuração centralizada
- Fácil de testar
- Isolamento de dependências
- Reutilizáveis em múltiplas páginas

### Sequência de Render

```
renderManager.renderFullCalendarTable()
  └─→ calendarRenderer.render()
      └─→ dayColumnRenderer.render() × 7 dias
          └─→ textRenderer.render() × 24 horas
              └─→ escapeHtml() para cada célula
```

## 🌍 Internacionalização (i18n)

### Estrutura de Tradução

```javascript
// Em translations/pt-br.js
export default {
  appTitle: "LastZ Help",
  days: ["Segunda", "Terça", ...],
  events: {
    vehicle: "Duel de Veículo",
    hero: "Duel de Herói",
    // ...
  },
  // ... +100 mais chaves
}
```

### Hierarquia de Fallback

```
1. localStorage.getItem("lang")
2. navigator.language (browser detection)
3. navigator.languages[0]
4. "en" (hardcoded default)
```

### RTL Support

```javascript
if (isRtl(CURRENT_LANG)) {
  element.dir = "rtl"
  element.classList.add("is-rtl")
}
```

**Idiomas RTL**:
- ar (Árabe)
- ur (Urdu)
- he (Hebraico - futuro)

## 🔒 Segurança em Camadas

```
CAMADA 1: Input Validation
  └─→ sanitizeNumber()
  └─→ isValidEmail()
  └─→ isValidLength()

CAMADA 2: URL Validation
  └─→ isSafeUrl()
  └─→ normalizeUrl()

CAMADA 3: HTML Escaping
  └─→ escapeHtml()
  └─→ sanitizeHtmlAttribute()

CAMADA 4: Safe Builders
  └─→ createSafeLink()
  └─→ createSafeSpan()

CAMADA 5: DOM Injection
  └─→ element.textContent = text  (preferível)
  └─→ element.innerHTML = safeHtml  (com escape)
```

## 📊 Gerenciamento de Estado

### State Variables (em ui.js)

```javascript
let currentFilter = "all"  // Filtro ativo
let currentPage = "calendar"  // Página ativa
let is24h = true  // Formato hora
let renderManager = null  // Instância
let guideMap = null  // Cache de guias
```

**Nota**: Sem framework de state management (Redux, Vuex) = simples, direto ao DOM

### LocalStorage Persistência

```javascript
// Time Format
localStorage.setItem("timeFormat", is24h ? "24" : "12")
is24h = localStorage.getItem("timeFormat") === "24"

// Language
localStorage.setItem("lang", CURRENT_LANG)
const lang = localStorage.getItem("lang") || "en"

// Bonus (opcional, seria em page-guides.js)
localStorage.setItem("bonusMultiplier", bonus)
const bonus = parseInt(localStorage.getItem("bonusMultiplier")) || 1
```

## 🎯 Use Cases

### Use Case 1: Usuário Troca de Idioma

```
1. Clica em <select id="langSelect">
2. evento "change" dispara handleLangChange()
3. loadLang("pt-br") → import tradução
4. T = { novo objeto com chaves PT-BR }
5. CURRENT_LANG = "pt-br"
6. updateAll() → re-renderiza tudo
7. localStorage.setItem("lang", "pt-br")
8. dia/hora labels mudam, calendário atualizado ✓
```

### Use Case 2: Usuário Filtra por Tipo Evento

```
1. Clica botão "Hero"
2. evento "click" → currentFilter = "hero"
3. updateCalendar()
4. getCalendarData() filtra por tipo
5. renderFullCalendarTable() com dados filtrados
6. DOM atualizado, células Vehicle/Army/Science escondidas ✓
```

### Use Case 3: Timer em Tempo Real

```
setInterval(updateAll, 1000):
1. getApocNow(offset) → horário servidor atualizado
2. highlightCurrentDayAndHour() → marca célula atual
3. updateTimer() → atualiza Local Time + Apocalypse Time
4. checkEventSequence() → próximo evento
5. DOM mínimamente alterado ✓
```

## 📈 Escalabilidade

### Para Adicionar Nova Feature

1. **Dados**: Adicionar a `events.js` ou `guides.js`
2. **Config**: Atualizar `config.js` se nova const
3. **Lógica**: Criar função em `ui.js` ou helper novo
4. **Render**: Adicionar método a `RenderManager`
5. **Segurança**: Passar por `secure-utils.js`
6. **i18n**: Adicionar chave em `translations/*.js`

### Para Adicionar Novo Idioma

1. Criar `src/translations/xx.js`
2. Adicionar ao mapa em `translate.js`
3. Adicionar a `LANGS_CONFIG` em `config.js`
4. Testar RTL se aplicável

### Para Refatorar Módulo

1. Criar arquivo novo consolidado
2. Move código de origem para novo
3. Update imports em 1 lugar (RenderManager)
4. Build & test
5. Remove arquivo antigo
6. Commit

## 🚀 Performance Optimization

### Já Implementadas

- Consolidação de imports (reduz bundle)
- Memoização de computados (evita recalc)
- Debouncing de resize (reduz re-render)
- Lazy load de idiomas (init mais rápido)

### Futuras

- Lazy load de guias grandes
- Service Worker para cache
- Code splitting por página
- Image optimization (WebP)
- CSS-in-JS para dynamic styles

---

**Última atualização**: Março 2026
