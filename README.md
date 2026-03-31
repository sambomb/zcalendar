# LastZ Help - Calendário de Eventos

**LastZ Help** é uma aplicação web moderna e responsiva que fornece um calendário de eventos sincronizado com o servidor do jogo mobile **Last Z**, além de uma base de conhecimento multilíngue com 100+ guias sobre heróis, recursos, estruturas e estratégias.

## 📋 Índice

- [Características](#características)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Guia de Desenvolvimento](#guia-de-desenvolvimento)
- [Segurança](#segurança)
- [Performance](#performance)
- [Contribuição](#contribuição)

---

## ✨ Características

### 🗓️ Calendário de Eventos
- **Rotação Semanal**: Visualiza os 7 eventos diários (Alliance Duel) sincronizados com o servidor UTC-2
- **Filtros**: Filtra por tipo de evento (Vehicle, Hero, Army, Shelter, Science)
- **Modo 24/12h**: Alterna entre formato 24h e 12h AM/PM
- **Responsivo**: Otimizado para desktop (≥980px) e mobile (≤720px)

### 🌍 Suporte Multilíngue
- **21 Idiomas**: English, Português (BR/PT), Español, Français, Deutsch, Italiano, Русский, 中文, 日本語, 한국어, हिन्दी, বাংলা, मराठी, العربية, اردو, Bahasa Indonesia, Türkçe, Polski, Kiswahili
- **RTL Support**: Árabe e Urdu com layout right-to-left
- **Fonts Otimizadas**: Noto Sans para CJK, Devanagari, Bengali, Arabic

### 📚 Base de Conhecimento
- **~100+ Guias**: Heróis (27), Itens, Estruturas, Inimigos, Eventos, Modo Campanha
- **Busca e Navegação**: Menu estruturado com 9 grupos principais
- **Tradução Dinâmica**: Todos os guias traduzidos em todos os 21 idiomas
- **Linkificação**: Links automáticos entre guias relacionados

### 💰 Calculadora de Pontos
- **Pontuação Automática**: Calcula recompensas diárias com bonus customizável
- **Fórmula Apocalipse**: Conversão entre pontos base e valores em jogo (×2.17)
- **Bonus em Tempo Real**: Atualiza cálculos conforme altera bonus

### ⏱️ Informações de Tempo Real
- **Local Time**: Horário do navegador
- **Apocalypse Time**: Horário sincronizado com servidor (UTC-2)
- **Next Event**: Conta regressiva para próximo evento
- **Radar Bonus**: Próximo dia com bonus de Radar

---

## 🏗️ Arquitetura

### Diagrama de Dependências

```
index.html
    ↓
main.js (entry point)
    ├→ ui.js (orquestração principal)
    ├→ translate.js (i18n)
    ├→ render-manager.js (renderização centralizada)
    ├→ config.js (configurações)
    ├→ calendar-helpers.js (lógica de calendário)
    ├→ secure-utils.js (segurança & validação)
    ├→ guides.js (base de dados de guias)
    │   └→ guides-general.js (definição de guias)
    ├→ events.js (dados de eventos)
    ├→ points.js (cálculo de pontuação)
    ├→ routes.js (mapa de rotas)
    └→ mobile.js (detecção e sync mobile)
```

### Padrões de Design

#### 1. **RenderManager (Facade Pattern)**
Centraliza toda renderização HTML através de 6 classes especializadas:
- `TextRenderer`: Escape XSS, tradução, linkificação
- `CalendarRenderer`: Tabela de calendário
- `DayColumnRenderer`: Colunas de dia
- `MenuRenderer`: Menu navegação
- `ScoreTableRenderer`: Tabela pontuação
- `GuideCardRenderer`: Cards de guias

**Benefício**: Isolamento de lógica de renderização, facilita testes unitários

#### 2. **Config Centralized (Single Source of Truth)**
Arquivo `config.js` consolida todas as constantes:
- URLs, offsets de servidor, breakpoints
- Nomes de IDLs de armazenamento
- Whitelists de segurança
- Validação de entrada

**Benefício**: Alterações em um único local, sem hardcoding espalhado

#### 3. **Secure-Utils (Security Layer)**
Camada consolidada de segurança:
- Escape HTML (prevenção XSS)
- Validação e sanitização de URLs
- Validação de entrada
- Builders de HTML seguros

**Benefício**: Defesa em profundidade contra XSS

#### 4. **Calendar-Helpers (Utility Consolidation)**
Funções de calendário e tempo centralizadas:
- Parse de offset servidor (removeu duplicação)
- Formatação de relógio (removeu duplicação)
- Cálculos de dia/hora passada/futura
- Conversões de tempo

**Benefício**: Sem redundância, single source of truth

#### 5. **Module Pattern**
Cada arquivo é um módulo ES6 com exports nomeados:
```javascript
export { functionName, ClassName }
export default { /* consolidated interface */ }
```

**Benefício**: Imports explícitos, fácil refatoração

---

## 📁 Estrutura do Projeto

```
zcalendar/
├── index.html                      # Entry point HTML
├── package.json                    # Dependências
├── vite.config.js                  # Configuração Vite
├── README.md                       # Este arquivo
├── DEVELOPMENT.md                  # Guia de desenvolvimento
│
└── src/
    ├── main.js                     # Entry point JavaScript
    ├── ui.js                       # Orquestrador de UI (520 linhas)
    │
    ├── 📋 CAMADA DE CONFIGURAÇÃO
    ├── config.js                   # Configurações centralizadas ✨ NOVO
    ├── routes.js                   # Mapa de rotas e IDs
    ├── events.js                   # Dados de eventos
    ├── points.js                   # Lógica de pontuação
    │
    ├── 🔒 CAMADA DE SEGURANÇA
    ├── secure-utils.js             # Utilitários segurança ✨ NOVO
    │
    ├── ⏰ CAMADA DE LÓGICA
    ├── calendar-helpers.js         # Funções calendário ✨ NOVO (consolidado)
    ├── calctime.js                 # (LEGADO - usar calendar-helpers)
    ├── mobile.js                   # Detecção mobile
    │
    ├── 🎨 CAMADA DE RENDERIZAÇÃO
    ├── render-manager.js           # Facade de renderização
    ├── text-renderer.js            # Renderiza texto com escape
    ├── calendar-renderer.js        # Renderiza calendário
    ├── day-column-renderer.js      # Renderiza colunas de dia
    ├── menu-renderer.js            # Renderiza menu
    ├── score-table-renderer.js     # Renderiza tabela pontos
    ├── guide-card-renderer.js      # Renderiza cards de guia
    │
    ├── 🌍 CAMADA DE I18N
    ├── translate.js                # Gerenciador i18n (380 linhas)
    ├── guide-helpers.js            # Helpers de guias
    ├── translations/
    │   ├── en.js                   # English
    │   ├── pt-br.js                # Português Brasil
    │   ├── pt-pt.js                # Português Portugal
    │   ├── es.js                   # Español
    │   ├── fr.js                   # Français
    │   ├── de.js                   # Deutsch
    │   ├── it.js                   # Italiano
    │   ├── ru.js                   # Русский
    │   ├── zh.js                   # 中文
    │   ├── ja.js                   # 日本語
    │   ├── ko.js                   # 한국어
    │   ├── hi.js                   # हिन्दी
    │   ├── bn.js                   # বাংলা
    │   ├── mr.js                   # मराठी
    │   ├── ar.js                   # العربية
    │   ├── ur.js                   # اردو
    │   ├── id.js                   # Bahasa Indonesia
    │   ├── tr.js                   # Türkçe
    │   ├── pl.js                   # Polski
    │   └── sw.js                   # Kiswahili
    │
    ├── 📚 CAMADA DE DADOS
    ├── guides.js                   # Índice de guias
    ├── guides-general.js           # Definição de guias (~1800 linhas)
    │
    ├── 🎨 CAMADA DE ESTILO
    ├── styles.css                  # Stylesheet unificado
    │
    └── 📄 PÁGINAS
        ├── page-main.js            # Lógica página calendário
        ├── page-guides.js          # Lógica página guias
        └── ... (outras páginas)

└── public/                         # Assets estáticos
    └── images/
```

### Camadas da Arquitetura

```
┌─────────────────────────────────────────┐
│         UI: HTML/CSS/DOM                │
├─────────────────────────────────────────┤
│ RenderManager (Facade)                  │
├─────────────────────────────────────────┤
│ TextRenderer | CalendarRenderer | ...   │
├─────────────────────────────────────────┤
│ Translate | Calendar-Helpers | Secure   │
├─────────────────────────────────────────┤
│ Config | Routes | Events | Data         │
└─────────────────────────────────────────┘
```

---

## 🔧 Funcionalidades Principais

### 1. Calendário Responsivo

**Arquivo**: `day-column-renderer.js`, `calendar-renderer.js`

- Renderiza tabela 7 dias × 24 horas
- Destaca dia/hora atual
- Aplica classe `.active` no horário atual
- Suporta múltiplos idiomas

```javascript
const calendar = renderManager.renderFullCalendarTable(dayGuideIds)
renderManager.highlightCurrentDayAndHour(currentDay, currentHour)
```

### 2. Sistema de Filtros

**Arquivo**: `ui.js`

- 6 filtros: all, army, hero, shelter, vehicle, science
- Re-renderiza calendário ao clicar
- Persiste em memória durante sessão

```javascript
function setupFilterHandlers() {
  document.getElementById("eventFilters").addEventListener("click", (e) => {
    if (e.target.dataset.filter) {
      currentFilter = e.target.dataset.filter
      updateCalendar()
    }
  })
}
```

### 3. Seletor de Idioma

**Arquivo**: `translate.js`

- Dropdown com 21 idiomas
- Detection automática de localidade
- Salva preferência em localStorage
- Recarrega página com novo idioma

```javascript
const langCode = localStorage.getItem("lang") || detectLang() || "en"
await loadLang(langCode)
```

### 4. Modo 24h/12h

**Arquivo**: `ui.js`, `calendar-helpers.js`

- Botão toggle no header
- Persiste em localStorage
- Reformata todo calendário

```javascript
function toggleTimeFormat() {
  is24h = !is24h
  localStorage.setItem("timeFormat", is24h ? "24" : "12")
  updateAll()  // Re-renderiza
}
```

### 5. Calculadora de Pontos

**Arquivo**: `points.js`, `score-table-renderer.js`

- Tabela com 7 dias × pontos de evento
- Input de bonus em tempo real
- Fórmula: pontosExibidos = pontosBase × 2.17

```javascript
const basePoints = displayedToBasePoints(400)  // Converte para base
const displayed = withDisplayedEstimate(basePoints)  // Converte para exibição
```

### 6. Navegação de Guias

**Arquivo**: `routes.js`, `menu-renderer.js`

- 9 grupos de menu (Calendário, Alliance Duel, Missões, Heróis, etc)
- Links dinâmicos baseados em guideId
- Highlight de página ativa

```javascript
const path = getGuidePath(guideId)  // "/guide/hero-katrina"
const menu = renderManager.renderFullMenu(currentPageId)
```

---

## 🛠️ Guia de Desenvolvimento

Veja [DEVELOPMENT.md](./DEVELOPMENT.md) para informações detalhadas sobre:
- Setup local
- Scripts de build
- Estrutura de arquivos
- Padrões de código
- Testing
- Deploy

### Quick Start

```bash
# Instalar dependências
npm install

# Dev server com hot reload
npm run dev

# Build para produção
npm run build
```

---

## 🔒 Segurança

### Prevenção XSS
Todos os inputs de usuário são passados por `escapeHtml()` antes de `innerHTML`:

```javascript
// ❌ NUNCA faça:
element.innerHTML = userInput

// ✅ SEMPRE faça:
const safe = escapeHtml(userInput)
element.innerHTML = `<div>${safe}</div>`
```

### Validação de URLs
URLs externas são validadas contra whitelist:

```javascript
const isSafe = isSafeUrl(url)  // Retorna false se não em whitelist
const normalizedUrl = normalizeUrl(url)  // Retorna "" se inválida
```

### LocalStorage Seguro
Valores inicializados de localStorage são validados:

```javascript
const lang = cleanStoredLang(localStorage.getItem("lang"))  // Com fallback
```

### Sanitização de Inputs
Números de usuário são sanitizados:

```javascript
const bonus = sanitizeNumber(userInput, 2)  // Máx 2 casas decimais
```

---

## ⚡ Performance

### Otimizações Implementadas

1. **Debouncing de Resize**: Evita re-render excessivo
2. **Memoização de Computados**: Armazena resultados custosos
3. **Lazy Loading de Idiomas**: Carrega apenas idioma selecionado
4. **CSS Minificado**: Tamanho reduzido em produção
5. **Build Vite**: Bundling otimizado com tree-shaking

### Benchmarks

- **First Paint**: ~300-500ms (dependente da rede)
- **Calendário Render**: ~50-100ms
- **Atualização Timer**: <10ms (otimizado)
- **Mudança Idioma**: ~100-200ms (carregamento arquivo + re-render)

---

## 📊 Redundâncias Removidas

| Função | Antes | Depois |
|--------|-------|--------|
| `parseServerOffset()` | Duplicada em 2 arquivos | Centralizada em `calendar-helpers.js` |
| `formatTime()` | Duplicada em `calctime.js` + `calendar-helpers.js` | Consolidada em `calendar-helpers.js` |
| `textOr()` | Implementada 3x | Centralizada em `secure-utils.js` |
| Constants (URL, offset, etc) | Espalhadas em 5+ arquivos | Centralizadas em `config.js` |
| `escapeHtml()` | Duplicada em `guide-helpers.js` | Consolidada em `secure-utils.js` |

---

## 🐛 Relatório de Issues

Para reportar bugs ou sugerir features:
1. Abra uma [Issue no GitHub](https://github.com/sambomb/zcalendar/issues)
2. Inclua navegador, dispositivo e passos para reproduzir
3. Forneça screenshots se for problema visual

---

## 💝 Suporte

Se gostou, considere:
- ⭐ Dar star no [GitHub](https://github.com/sambomb/zcalendar)
- 📢 Compartilhar com outros jogadores
- 💰 [Fazer uma doação via PayPal](https://www.paypal.com/donate/?hosted_button_id=EQ4XU8W5PWUBA)

---

## 📄 Licença

MIT - Veja `LICENSE` para detalhes

---

## 🤝 Contribução

Contribuições são bem-vindas! Por favor:
1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Última atualização**: Março 2026 | **Versão**: 1.0.0
