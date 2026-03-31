let selectedDay = new Date().getDay()
let initialized = false

function isMobile(){
  return window.innerWidth <= 720
}

function ensurePicker(){
  let picker = document.getElementById("mobileDayPicker")
  if(picker) return picker

  const tableWrap = document.querySelector(".table-wrap")
  if(!tableWrap || !tableWrap.parentElement) return null

  picker = document.createElement("div")
  picker.id = "mobileDayPicker"
  picker.className = "mobile-day-picker"
  tableWrap.parentElement.insertBefore(picker, tableWrap)
  return picker
}

function renderPicker(dayLabels = []){
  const picker = ensurePicker()
  if(!picker) return

  const labels = Array.isArray(dayLabels) && dayLabels.length === 7
    ? dayLabels
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  picker.innerHTML = labels.map((label, index) => {
    const activeClass = index === selectedDay ? " active" : ""
    return `<button type="button" class="mobile-day-chip${activeClass}" data-mobile-day="${index}">${label}</button>`
  }).join("")

  picker.querySelectorAll(".mobile-day-chip").forEach((button) => {
    button.onclick = () => {
      selectedDay = Number(button.dataset.mobileDay)
      renderPicker(labels)
      syncMobileCalendarVisibility()
    }
  })
}

function clearMobileHiddenColumns(){
  document.querySelectorAll(".hidden-mobile-column").forEach((cell) => {
    cell.classList.remove("hidden-mobile-column")
  })

  const tableWrap = document.querySelector(".table-wrap")
  if(tableWrap) tableWrap.classList.remove("mobile-single-day")
}

export function syncMobileCalendarVisibility(){
  const tableWrap = document.querySelector(".table-wrap")
  if(!tableWrap) return

  clearMobileHiddenColumns()
  if(!isMobile()) return

  tableWrap.classList.add("mobile-single-day")

  document.querySelectorAll("#tableHead th[data-day]").forEach((th) => {
    const day = Number(th.dataset.day)
    if(day !== selectedDay) th.classList.add("hidden-mobile-column")
  })

  document.querySelectorAll("#tableBody td.cell[data-day]").forEach((td) => {
    const day = Number(td.dataset.day)
    if(day !== selectedDay) td.classList.add("hidden-mobile-column")
  })
}

export function refreshMobileCalendarLabels(dayLabels = []){
  if(!initialized) return
  renderPicker(dayLabels)
  syncMobileCalendarVisibility()
}

export function initMobileCalendar(dayLabels = []){
  initialized = true
  renderPicker(dayLabels)
  syncMobileCalendarVisibility()

  window.addEventListener("resize", () => {
    syncMobileCalendarVisibility()
  })
}