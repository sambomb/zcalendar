import { EVENTS, ICONS, DAY_KEYS } from "./events.js"
import { getApoc } from "./calctime.js"
import { T } from "./translate.js"

let currentFilter = "all"

export function initUI(){
  buildTable()
  fillCells()
  applyTranslations()
  hookFilters()

  setInterval(updateAll, 1000)
}

function updateAll(){
  updateCurrent()
  updateAlert()
  highlightNow()
  updateNextEvent()
}

function buildTable(){

  const head = document.getElementById("tableHead")
  const body = document.getElementById("tableBody")

  head.innerHTML = `
    <th>${T.time}</th>
    ${T.days.map((d,i)=>`
      <th class="day-col" data-day="${i}">
        ${d}
        <div class="day-title">${T.dayTitles[DAY_KEYS[i]]}</div>
      </th>
    `).join("")}
  `

  body.innerHTML = ""

  for(let r=0;r<6;r++){
    let tr = `<tr><td>${formatHour(r*4)}</td>`

    for(let d=0;d<7;d++){
      tr += `<td class="cell" data-day="${d}" data-hour="${r*4}"></td>`
    }

    tr += "</tr>"
    body.innerHTML += tr
  }
}

function fillCells(){

  document.querySelectorAll(".cell").forEach(cell=>{

    const day = +cell.dataset.day
    const hour = +cell.dataset.hour
    const ev = EVENTS[hour/4][day]

    cell.innerHTML = `
      <div class="cell-time">${formatHour(hour)}</div>
      <img src="${getIcon(day,hour)}" class="radar-icon">
      <div class="cell-event">${T.events[ev]}</div>
    `
  })
}

function getIcon(day,hour){

  if(day===0) return ICONS.red
  if(day===3 && hour>=16) return ICONS.red
  if(day===4) return ICONS.red
  if(day===6 && hour>=16) return ICONS.red
  if(day===1 || day===5) return ICONS.gold

  return ICONS.white
}

function highlightNow(){

  const { h } = getApoc()
  const day = new Date().getDay()
  const row = Math.floor(h/4)

  document.querySelectorAll(".cell").forEach(c=>{
    c.classList.remove("active")
  })

  document.querySelectorAll(".day-col").forEach(c=>{
    c.classList.remove("today")
  })

  const cell = document.querySelector(`.cell[data-day="${day}"][data-hour="${row*4}"]`)
  const col = document.querySelector(`.day-col[data-day="${day}"]`)

  if(cell) cell.classList.add("active")
  if(col) col.classList.add("today")
}

function updateCurrent(){

  const { h } = getApoc()
  const day = new Date().getDay()
  const row = Math.floor(h/4)

  const ev = EVENTS[row][day]

  document.getElementById("currentEventBar").innerText =
    `${T.current}: ${T.events[ev]}`
}

function updateNextEvent(){

  const { h, m } = getApoc()
  const nextHour = Math.ceil((h+0.01)/4)*4 % 24

  let diff = (nextHour - h + 24) % 24
  let mins = diff*60 - m

  if(mins < 0) mins += 1440

  document.getElementById("timeInfo").innerText =
    `Local ${new Date().toLocaleTimeString()} | Apoc ${formatHour(h)}:${String(m).padStart(2,"0")} | Next ${mins}m`
}

function updateAlert(){

  const { h } = getApoc()
  const d = new Date().getDay()

  const isRed = getIcon(d,h) === ICONS.red

  const el = document.getElementById("alertBar")

  el.innerText = isRed ? T.alert : ""
  el.className = isRed ? "alert active" : "alert"
}

function hookFilters(){

  document.querySelectorAll("#eventFilters button").forEach(btn=>{
    btn.onclick = ()=>{
      currentFilter = btn.dataset.filter

      document.querySelectorAll("#eventFilters button").forEach(b=>b.classList.remove("selected"))
      btn.classList.add("selected")

      applyFilter()
    }
  })
}

function applyFilter(){

  document.querySelectorAll(".cell").forEach(cell=>{

    const text = cell.innerText.toLowerCase()

    if(currentFilter==="all"){
      cell.classList.remove("dim")
      return
    }

    if(text.includes(currentFilter)){
      cell.classList.remove("dim")
    }else{
      cell.classList.add("dim")
    }
  })
}

function applyTranslations(){

  const f = T.filters

  document.querySelector('[data-filter="all"]').textContent = f.all
  document.querySelector('[data-filter="army"]').textContent = f.army
  document.querySelector('[data-filter="hero"]').textContent = f.hero
  document.querySelector('[data-filter="shelter"]').textContent = f.shelter
  document.querySelector('[data-filter="vehicle"]').textContent = f.vehicle
  document.querySelector('[data-filter="science"]').textContent = f.science
}

function formatHour(h){
  return `${String(h).padStart(2,"0")}:00`
}