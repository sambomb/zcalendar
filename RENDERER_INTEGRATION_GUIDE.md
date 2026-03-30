/**
 * GUIA DE INTEGRAÇÃO DOS NOVOS RENDERERS
 * 
 * Este arquivo documenta como usar os novos módulos de renderização
 * para refatorar ui.js e page-main.js
 */

// ============================================================================
// 1. IMPORTAÇÃO DO RENDER MANAGER
// ============================================================================

// No topo de ui.js ou page-main.js:
import { createRenderManager } from "./render-manager.js"

// ============================================================================
// 2. CRIAÇÃO DO GERENCIADOR DE RENDERERS
// ============================================================================

// Em initUI():
const renderManager = createRenderManager({
  // Configuração de tradução
  translations: T,  // Objeto T da translate.js
  
  // Configuração de funções
  linkifyFn: (text) => sharedLinkifyText(text, GUIDE_MAP, getGuidePath),
  getGuidePath: getGuidePath,  // Função do routes.js
  
  // Configuração de linguagem e localização
  currentLang: CURRENT_LANG || localStorage.getItem("lang") || "en",
  baseUrl: BASE_URL,
  
  // Configuração de calendário
  events: EVENTS,  // Do events.js
  getEventType: getEventType,  // Função que já existe em ui.js
  getIcon: getIcon,  // Função que já existe em ui.js
  serverOffset: SERVER_OFFSET,  // "UTC-2"
  dayLabel: T.dayLabel || "Day",
  dayNames: T.days,  // Array de nomes dos dias
  dayTitles: T.dayTitles,  // Objeto com titles dos dias
  
  // Configuração de menu
  guideMap: GUIDE_MAP,  // Do guides.js
  menuGroups: MENU_GROUPS,  // Do routes.js
  heroFactionMenu: HERO_FACTION_MENU,  // Do routes.js
})

// ============================================================================
// 3. USO DO RENDER MANAGER PARA RENDERIZAR CALENDÁRIO
// ============================================================================

// Substituir buildTable() e fillCells() com:
function buildTable() {
  const head = document.getElementById("tableHead")
  const body = document.getElementById("tableBody")
  
  const calendar = renderManager.calendar.renderFullCalendarTable(DAY_IDS_BY_INDEX)
  renderManager.calendar.updateCalendarDOM(head, body, calendar)
}

function fillCells() {
  // Neste caso, DayColumnRenderer já renderiza as células
  // Não precisa de fillCells separado se usar DayColumnRenderer
}

// ============================================================================
// 4. USO DO RENDER MANAGER PARA RENDERIZAR MENU
// ============================================================================

// Substituir renderTopMenu() com:
function renderTopMenu() {
  const menuRoot = document.getElementById("siteMenu")
  renderManager.menu.updateMenuDOM(menuRoot, "") // activeGuideId vazio para home
}

// ============================================================================
// 5. USO DO RENDER MANAGER PARA RENDERIZAR SCORE TABLE (em page-main.js)
// ============================================================================

// Em renderGuidePage():
async function renderGuidePage(guideId) {
  const scoreSection = SCORE_TABLE[guideId]
  
  if (scoreSection) {
    const scoreHtml = renderManager.scoreTable.renderFullTable({
      title: safeText(T.scoreSectionTitle, "Score table"),
      entries: scoreSection.entries,
      enableBonusInput: scoreSection.enableBonusInput,
      bonusInputId: "bonusPercentInputMain"
    })
    
    // Adicionar scoreHtml ao conteúdo da página
    content.innerHTML += scoreHtml
    
    // Hook do calculador de bonus
    renderManager.scoreTable.hookBonusCalculator("bonusPercentInputMain")
  }
}

// ============================================================================
// 6. USO DO RENDER MANAGER PARA RENDERIZAR GUIDE CARDS
// ============================================================================

// Substituir renderGuideCard() com:
function renderGuideCard(guide) {
  return renderManager.guideCard.renderGuideCard(guide)
}

// Substituir renderGuideCollection() com:
function renderGuideCollection(group) {
  const guides = GUIDE_SETS[group.id]
  
  return `
    <section class="guide-collection">
      <div class="collection-heading">
        <div>
          <p class="section-kicker">${escapeHtml(T.guideKicker)}</p>
          <h3>${escapeHtml(group.title)}</h3>
        </div>
        <p>${escapeHtml(group.description)}</p>
      </div>
      <div class="guide-card-grid">
        ${guides.map((guide) => renderManager.guideCard.renderGuideCard(guide)).join("")}
      </div>
    </section>
  `
}

// ============================================================================
// 7. ATUALIZAR LINGUAGEM QUANDO A LINGUAGEM MUDAR
// ============================================================================

// Em loadLang() ou applyTranslations():
function applyTranslations() {
  // ... código existente ...
  
  // Atualizar render manager com nova linguagem
  renderManager.updateLanguage(CURRENT_LANG)
  
  // Re-renderizar elementos que dependem de tradução
  buildTable()
  renderTopMenu()
  // ... chamadas a outras funções que dependem de traduções
}

// ============================================================================
// 8. USAR TEXTRENDERER DIRETAMENTE PARA TEXTOS COM RTL
// ============================================================================

// Para texto com suporte a RTL e fontes específicas:
const textRenderer = renderManager.text

// Renderizar parágrafo com RTL automático
const html = textRenderer.renderParagraph("Your text here", { useLinks: true })

// Renderizar seção de guia
const sectionHtml = textRenderer.renderGuideSectionCard(section, { useLinks: true })

// ============================================================================
// 9. USAR DAYCOLUMNRENDERER PARA CALENDÁRIO SIMPLIFICADO (em page-main.js)
// ============================================================================

// Em renderGuidePage() para calendário simplificado de um dia:
function renderSingleDayCalendar(dayIndex, guideId) {
  const calendar = renderManager.dayColumn.renderSingleDayCalendar(dayIndex, guideId)
  
  const head = document.getElementById("dayTableHead")
  const body = document.getElementById("dayTableBody")
  
  if (head) head.innerHTML = calendar.head
  if (body) body.innerHTML = calendar.body
}

// ============================================================================
// 10. CRIAR NOVOS RENDERERS COM CONFIGURAÇÃO CUSTOMIZADA
// ============================================================================

// Se precisar de um renderer com configuração específica:
import { TextRenderer } from "./text-renderer.js"

const customTextRenderer = new TextRenderer({
  translations: T,
  linkifyFn: myCustomLinkifyFn,
  currentLang: "ar",  // Força árabe (RTL)
  baseUrl: BASE_URL
})

// Renderizar com CSS RTL automático
const arabicText = customTextRenderer.renderParagraph("مرحبا", { useLinks: false })

// ============================================================================
// BENEFÍCIOS DA MIGRAÇÃO
// ============================================================================

// 1. Suporte automático para RTL em qualquer linguagem
// 2. Fonte específica para cada linguagem (árabe, urdu, hindi, etc)
// 3. Reutilização de code entre ui.js e page-main.js
// 4. Renderização consistente de calendário em múltiplos contextos
// 5. Score table com bonus calculator integrado
// 6. Menu centralizado com tradução dinâmica
// 7. Fácil adicionar suporte a novas linguagens com fontes

// ============================================================================
// CLASSE DISPONÍVEIS NO RENDER MANAGER
// ============================================================================

/**
 * renderManager.calendar - CalendarRenderer
 *   .renderFullCalendarTable(dayGuideIds)
 *   .renderSingleDayCalendar(dayIndex, dayGuideLinkId)
 *   .updateCalendarDOM(headElement, bodyElement, calendar)
 *   .highlightCurrentDayAndHour(currentDay, currentHour)
 *
 * renderManager.menu - MenuRenderer
 *   .renderFullMenu(activeGuideId)
 *   .updateMenuDOM(menuElement, activeGuideId)
 *   .renderMenuGroup(group, activeGuideId)
 *   .renderGroupItems(group, activeGuideId)
 *   .renderMenuItem(item, activeGuideId)
 *
 * renderManager.scoreTable - ScoreTableRenderer
 *   .renderFullTable(options)  // { title, entries, bonus, enableBonusInput }
 *   .renderTableHead()
 *   .renderTableBody(entries, bonus)
 *   .renderTableRow(entry, bonus)
 *   .hookBonusCalculator(bonusInputId, onBonusChange)
 *
 * renderManager.guideCard - GuideCardRenderer
 *   .renderGuideCard(guide)
 *   .renderDetailPortrait(guide)
 *   .renderDetailHeader(guide)
 *   .renderRelatedSection(relatedIds)
 *   .renderGuideLink(guideId)
 *   .renderPortrait(guide)
 *
 * renderManager.dayColumn - DayColumnRenderer
 *   .renderFullCalendar(dayGuideIds)
 *   .renderSingleDayCalendar(dayIndex, dayGuideLinkId)
 *   .renderDayRow(hour, dayGuideIds, daysToRender)
 *   .renderDayCell(dayIndex, hour, dayGuideLinkId)
 *   .renderDayHeader(dayIndex, dayGuideLinkId)
 *
 * renderManager.text - TextRenderer
 *   .renderText(text)
 *   .renderTextWithLinks(text)
 *   .renderSpan(text, options)
 *   .renderParagraph(text, options)
 *   .renderList(items, options)
 *   .renderHeading(text, level, options)
 *   .renderGuideSectionCard(section, options)
 *   .renderScoreTable(entries, options)
 *   .renderLink(text, href, options)
 *   .getText(key, fallback)
 */

// ============================================================================
// EXEMPLOS DE USO
// ============================================================================

// Exemplo 1: Renderizar seção de guia
const section = { title: "Tips", items: ["Tip 1", "Tip 2", "Tip 3"] }
const sectionHtml = renderManager.text.renderGuideSectionCard(section, { useLinks: true })

// Exemplo 2: Renderizar tabela de pontos com bonus
const scoreHtml = renderManager.scoreTable.renderFullTable({
  title: "Day 1 Points",
  entries: [
    { action: "Consume 1 Blueprint", basePoints: 20 },
    { action: "Consume 1 Wrench", basePoints: 4977 }
  ],
  enableBonusInput: true,
  bonusInputId: "bonus-day-1"
})

// Exemplo 3: Renderizar calendário para múltiplos dias
const dayIds = ["day-vehicle", "day-shelter", "day-science", "day-hero", "day-growth", "day-peace", "day-final"]
const calendar = renderManager.calendar.renderFullCalendarTable(dayIds)
document.getElementById("tableHead").innerHTML = calendar.head
document.getElementById("tableBody").innerHTML = calendar.body

// Exemplo 4: Renderizar com RTL automático para árabe
renderManager.updateLanguage("ar")
const arabicCardHtml = renderManager.text.renderGuideSectionCard(section, { useLinks: true })
// HTML será gerado com dir="rtl" e font-arabic
