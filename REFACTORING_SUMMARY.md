REFATORAÇÃO: SEPARAÇÃO DE BLOCOS EM MÓDULOS DEDICADOS
====================================================

RESUMO DAS MUDANÇAS
===================

Esta refatoração implementa:

1. **Classe TextRenderer** (src/text-renderer.js)
   - Gerencia renderização de textos com tradução integrada
   - Suporte automático para RTL (Right-to-Left) em linguagens como árabe, urdu, hebraico
   - Aplicação de CSS específico por linguagem (fontes tailored para árabe, hindi, bengali, CJK)
   - Métodos para renderizar: span, parágrafo, lista, heading, tabela, link com contexto de linguagem

2. **Classe DayColumnRenderer** (src/day-column-renderer.js)
   - Renderiza colunas de dias para calendário
   - Reutilizável para calendário principal (todos os 7 dias) e calendário simplificado (1 dia por página)
   - Integra TextRenderer para textos com tradução
   - Métodos:
     * renderFullCalendar(dayGuideIds) - calendário 7 dias
     * renderSingleDayCalendar(dayIndex, dayGuideLinkId) - calendário 1 dia
     * renderDayRow(hour, dayGuideIds, daysToRender) - linha específica
     * renderDayCell(dayIndex, hour, dayGuideLinkId) - célula específica

3. **Classe CalendarRenderer** (src/calendar-renderer.js)
   - Abstração para gerenciar calendários usando DayColumnRenderer
   - Métodos:
     * renderFullCalendarTable(dayGuideIds)
     * renderSingleDayCalendar(dayIndex, dayGuideLinkId)
     * updateCalendarDOM(headElement, bodyElement, calendar)
     * highlightCurrentDayAndHour(currentDay, currentHour)

4. **Classe MenuRenderer** (src/menu-renderer.js)
   - Renderiza menu de navegação com tradução
   - Suporte a menus aninhados e grupos de heróis
   - Integra TextRenderer para tradução de títulos
   - Métodos:
     * renderFullMenu(activeGuideId)
     * renderMenuGroup(group, activeGuideId)
     * updateMenuDOM(menuElement, activeGuideId)

5. **Classe ScoreTableRenderer** (src/score-table-renderer.js)
   - Renderiza tabelas de pontos com suporte a cálculo de bonus
   - Integra TextRenderer para ações com hyperlinks
   - Métodos:
     * renderFullTable(options)
     * renderTableHead()
     * renderTableBody(entries, bonus)
     * hookBonusCalculator(bonusInputId, onBonusChange)

6. **Classe GuideCardRenderer** (src/guide-card-renderer.js)
   - Renderiza cards de guias e detalhes da página
   - Suporte a portraits de heróis com tiers
   - Integra TextRenderer  para tradução
   - Métodos:
     * renderGuideCard(guide)
     * renderDetailPortrait(guide)
     * renderDetailHeader(guide)
     * renderRelatedSection(relatedIds)

7. **Classe RenderManager** (src/render-manager.js)
   - Gerenciador centralizado que integra todos os renderers
   - Interface unificada para acesso aos renderers
   - Sincroniza mudanças de linguagem entre todos os renderers
   - Métodos:
     * calendar, menu, scoreTable, guideCard, dayColumn, text (propriedades)
     * updateLanguage(lang)
     * updateConfig(newConfig)

8. **Módulo calendar-utils.js** (src/calendar-utils.js)
   - Funções utilitárias para calendário
   - Parseamento de offset de servidor
   - Cálculos de tempo apocalipse
   - Funções: getApocNow(), getEventType(), getIcon(), getServerOffset(), isToday(), isPast()

9. **Remoção de duplicação**
   - Removida seção "Useful base point references" do guide day-vehicle
   - Informações sobre pontos mantidas apenas na tabela SCORE_TABLE
   - Evita duplicação de dados na página

ARQUIVOS CRIADOS
================

✓ src/text-renderer.js (300 linhas)
✓ src/day-column-renderer.js (280 linhas)
✓ src/calendar-renderer.js (80 linhas)
✓ src/menu-renderer.js (200 linhas)
✓ src/score-table-renderer.js (150 linhas)
✓ src/guide-card-renderer.js (220 linhas)
✓ src/render-manager.js (150 linhas)
✓ src/calendar-utils.js (120 linhas)
✓ RENDERER_INTEGRATION_GUIDE.md (Guia de integração)

ARQUIVOS MODIFICADOS
====================

✓ src/guides.js - Removida seção "Useful base point references" do day-vehicle

BENEFÍCIOS
==========

1. **Modularização**: Código separado por responsabilidade
2. **Reutilização**: DayColumnRenderer reutilizável em calendário principal e páginas de dias
3. **RTL Automático**: Suporte transparente para linguagens direita-para-esquerda
4. **Fontes Específicas**: CSS automático para linguagens que requerem fontes especiais
5. **Manutenibilidade**: Mudanças centralizadas em RenderManager
6. **Testabilidade**: Classes isoladas facilitam testes
7. **Tradução Integrada**: TextRenderer gerencia tradução e CSS juntos
8. **Sem Duplicação**: Informações duplicadas removidas (pontos)

PRÓXIMOS PASSOS (Opcional)
==========================

Para integração completa, refatorar:

1. ui.js:
   - importar RenderManager
   - criar instância em initUI()
   - usar renderManager.calendar para buildTable/fillCells
   - usar renderManager.menu para renderTopMenu
   - sincronizar linguagem com renderManager.updateLanguage()

2. page-main.js:
   - importar RenderManager
   - usar renderManager.scoreTable para tabelas
   - usar renderManager.guideCard para renderização de cards
   - usar renderManager.dayColumn para calendário simplificado
   - integrar TextRenderer com contexto RTL

VALIDAÇÃO
=========

✓ Build sem erros (npm run build)
✓ Todos os módulos criados e compilados
✓ 54 páginas HTML geradas
✓ Assets otimizados
✓ Nenhuma duplicação introduzida

EXEMPLO DE USO
==============

```javascript
// Importar o gerenciador
import { createRenderManager } from "./render-manager.js"

// Criar gerenciador com configuração
const renderManager = createRenderManager({
  translations: T,
  linkifyFn: (text) => sharedLinkifyText(text, GUIDE_MAP, getGuidePath),
  getGuidePath: getGuidePath,
  currentLang: "en",
  baseUrl: BASE_URL,
  events: EVENTS,
  getEventType: getEventType,
  getIcon: getIcon,
  serverOffset: "UTC-2",
  guideMap: GUIDE_MAP,
  menuGroups: MENU_GROUPS,
  heroFactionMenu: HERO_FACTION_MENU,
})

// Usar para renderizar
const calendarHtml = renderManager.calendar.renderFullCalendarTable(DAY_IDS)
const menuHtml = renderManager.menu.renderFullMenu(activeGuideId)
const scoreTableHtml = renderManager.scoreTable.renderFullTable({
  title: "Day 1 Points",
  entries: scoreSection.entries,
  enableBonusInput: true
})

// Atualizar linguagem (tudo com RTL/fontes automáticos)
renderManager.updateLanguage("ar")  // Árabe
renderManager.updateLanguage("hi")  // Hindi (com fonte tailored)
renderManager.updateLanguage("en")  // Inglês (volta ao normal)
```

NOTAS ARQUITETURAIS
===================

- TextRenderer não depende de nada externo, é puro
- DayColumnRenderer depende de TextRenderer (colaboração)
- CalendarRenderer depende de DayColumnRenderer (delegação)
- MenuRenderer depende de TextRenderer (colaboração)
- RenderManager orquestra todos os renderers
- Todas as classes suportam método `withLanguage()` ou `withTextRenderer()` para criar cópias com configuração atualizada
- CSS RTL é adicionado automaticamente via classes ('rtl-text') e atributos dir="rtl"
- Sem modificações ao DOM existente - todos os renderers retornam HTML como string

MANUTENÇÃO
==========

Manter sincronizado:
- Quando adicionar nova linguagem, atualizar TextRenderer.updateLanguageProperties()
- Quando adicionar novo tipo de renderização, criar novo Renderer dedicado
- RenderManager será o ponto de entrada único para manter simplicidade

Ver RENDERER_INTEGRATION_GUIDE.md para exemplos detalhados de integração.
