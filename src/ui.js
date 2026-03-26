import { EVENTS, ICONS, DAY_KEYS } from "./events.js"
import { getLocal, formatTime, formatDate, toggleFormat } from "./calctime.js"
import { T, CURRENT_LANG } from "./translate.js"

const SERVER_OFFSET = -2

let currentFilter = "all"

export function initUI(){

  document.getElementById("timeBtn").onclick = ()=>{
    toggleFormat()
    updateAll()
  }

  buildTable()
  fillCells()
  applyTranslations()
  hookFilters()

  setInterval(updateAll,1000)
}

function updateAll(){
  updateCurrent()
  updateAlert()
  highlightNow()
  updateNext()
}

//
// 🔥 CORE: APOCALYPSE TIME ENGINE
//
function getApocNow(){

  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset()*60000

  return new Date(utc + SERVER_OFFSET * 3600000)
}

function getApocDayStart(){

  const apoc = getApocNow()
  apoc.setHours(0,0,0,0)

  return apoc
}

//
// 📊 TABLE
//
function buildTable(){

  const head = document.getElementById("tableHead")
  const body = document.getElementById("tableBody")

  head.innerHTML = `
    <th>${T.time}</th>
    ${T.days.map((d,i)=>`
      <th data-day="${i}">
        ${d}
        <div class="day-title">${T.dayTitles[DAY_KEYS[i]]}</div>
      </th>
    `).join("")}
  `

  body.innerHTML = ""

  for(let r=0;r<6;r++){

    let row = `<tr><td>${String(r*4).padStart(2,"0")}:00</td>`

    for(let d=0;d<7;d++){
      row += `<td class="cell" data-day="${d}" data-hour="${r*4}"></td>`
    }

    row += "</tr>"
    body.innerHTML += row
  }
}

//
// 📅 CELLS (APOC BASED)
//
function fillCells(){

  const baseDate = getApocDayStart()

  document.querySelectorAll(".cell").forEach(cell=>{

    const day = +cell.dataset.day
    const hour = +cell.dataset.hour

    const ev = EVENTS[hour/4][day]

    const cellDate = new Date(baseDate)
    cellDate.setDate(baseDate.getDate() + day)

    cell.innerHTML = `
      <div class="cell-date">
        ${T.dayLabel} ${day} • ${formatDate(cellDate, CURRENT_LANG)}
      </div>

      <div class="cell-time">
        ${String(hour).padStart(2,"0")}:00
      </div>

      <img src="${getIcon(day,hour)}" class="radar-icon">

      <div class="cell-event">
        ${T.events[ev]}
      </div>
    `
  })
}

//
// 🎯 CURRENT EVENT (APOC)
//
function updateCurrent(){

  const now = getApocNow()

  const day = now.getDay()
  const row = Math.floor(now.getHours()/4)

  const ev = EVENTS[row][day]

  document.getElementById("currentEventBar").innerText =
    `${T.current}: ${T.events[ev]}`
}

//
// 📍 HIGHLIGHT (APOC)
//
function highlightNow(){

  const now = getApocNow()

  const day = now.getDay()
  const hour = now.getHours()
  const row = Math.floor(hour/4)*4

  document.querySelectorAll(".cell").forEach(c=>{
    c.classList.remove("active","today-col")
  })

  document.querySelectorAll(`[data-day="${day}"]`)
    .forEach(c=>c.classList.add("today-col"))

  const active = document.querySelector(`.cell[data-day="${day}"][data-hour="${row}"]`)

  if(active) active.classList.add("active")
}

//
// ⏱ NEXT EVENT (APOC)
//
function updateNext(){

  const now = getApocNow()

  const currentHour = now.getHours()
  const currentMin = now.getMinutes()

  let nextHour = Math.ceil((currentHour + currentMin/60)/4)*4

  if(nextHour === 24) nextHour = 0

  let diffHours = (nextHour - currentHour + 24) % 24
  let diffMinutes = (60 - currentMin) % 60

  if(diffMinutes !== 0) diffHours--

  if(diffHours < 0) diffHours = 23

  const local = getLocal()
  const localStr = formatTime(local, CURRENT_LANG)

  document.getElementById("timeInfo").innerText =
    `${T.localLabel}: ${localStr} | ${T.apocLabel}: ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")} | ${T.nextLabel}: ${String(diffHours).padStart(2,"0")}:${String(diffMinutes).padStart(2,"0")}`
}

//
// 🚨 ALERT (APOC)
//
function updateAlert(){

  const now = getApocNow()

  const d = now.getDay()
  const h = now.getHours()

  const isRed = getIcon(d,h) === ICONS.red

  const el = document.getElementById("alertBar")

  el.innerText = isRed ? T.alert : ""
  el.className = isRed ? "alert active" : "alert"
}

//
// 🎨 ICON RULES
//
function getIcon(day,hour){

  if(day===0) return ICONS.red
  if(day===3 && hour>=16) return ICONS.red
  if(day===4) return ICONS.red
  if(day===6 && hour>=16) return ICONS.red
  if(day===1 || day===5) return ICONS.gold

  return ICONS.white
}

//
// 🎛 FILTER
//
function hookFilters(){

  document.querySelectorAll("#eventFilters button").forEach(btn=>{

    btn.onclick = ()=>{

      currentFilter = btn.dataset.filter

      document.querySelectorAll("#eventFilters button")
        .forEach(b=>b.classList.remove("selected"))

      btn.classList.add("selected")

      applyFilter()
    }
  })
}

function applyFilter(){

  document.querySelectorAll(".cell").forEach(cell=>{

    const txt = cell.innerText.toLowerCase()

    if(currentFilter==="all"){
      cell.classList.remove("dim")
      return
    }

    if(txt.includes(currentFilter)){
      cell.classList.remove("dim")
    }else{
      cell.classList.add("dim")
    }
  })
}

//
// 🌍 TRANSLATIONS
//
function applyTranslations(){

  const f = T.filters

  document.querySelector('[data-filter="all"]').textContent = f.all
  document.querySelector('[data-filter="army"]').textContent = f.army
  document.querySelector('[data-filter="hero"]').textContent = f.hero
  document.querySelector('[data-filter="shelter"]').textContent = f.shelter
  document.querySelector('[data-filter="vehicle"]').textContent = f.vehicle
  document.querySelector('[data-filter="science"]').textContent = f.science
}