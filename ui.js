let use24h=true
let currentFilter="all"

const ICONS={
white:"https://cdn.jsdelivr.net/gh/sambomb/zcalendar@main/white.png",
red:"https://cdn.jsdelivr.net/gh/sambomb/zcalendar@main/red.png",
gold:"https://cdn.jsdelivr.net/gh/sambomb/zcalendar@main/gold.png"
}

// FILTER
function filterEvents(type){
currentFilter=type

document.querySelectorAll("#eventFilters button").forEach(b=>b.classList.remove("active"))
document.getElementById("btn"+type.charAt(0).toUpperCase()+type.slice(1)).classList.add("active")

document.querySelectorAll(".timeCell").forEach(c=>{
if(type==="all"){c.style.opacity=1;return}
c.style.opacity=c.innerText.toLowerCase().includes(type.toLowerCase())?1:0.2
})
}

// BUILD TABLE
function buildTable(){

let body=document.getElementById("tableBody")
body.innerHTML=""

for(let r=0;r<6;r++){

let tr=document.createElement("tr")
tr.innerHTML=`<td>${APOC_TIMES[r]}:00</td>`

for(let c=0;c<7;c++){
let td=document.createElement("td")
td.className="timeCell"
tr.appendChild(td)
}

body.appendChild(tr)
}
}

// UPDATE
async function updateCalendar(){

let now=new Date()
let apoc=getApocNow()
let slot=getCurrentSlot()
let cd=getCountdown()

let cells=document.querySelectorAll(".timeCell")
let index=0
let alert=false

for(let r=0;r<6;r++){
for(let c=0;c<7;c++){

let hour=APOC_TIMES[r]

// ICON RULES
let icon="white"
if(c===0)icon="red"
else if(c===1)icon="gold"
else if(c===3 && hour>=16)icon="red"
else if(c===4)icon="red"
else if(c===5)icon="gold"
else if(c===6 && hour>=16)icon="red"

let base=new Date()
base.setHours(hour,0,0,0)

let raw=EVENTS[c][r]
let event=(T.events && T.events[raw])||raw

cells[index].innerHTML=`
<img src="${ICONS[icon]}" style="width:16px"><br>
${formatTime(base,use24h)}<br>
${event}
`

// highlight column
if(c===slot.day)cells[index].classList.add("currentColumn")

// highlight current
if(c===slot.day && r===slot.index){
cells[index].classList.add("activeEvent")
if(icon==="red")alert=true
}

if(icon==="red")cells[index].classList.add("redEvent")

index++
}}

document.getElementById("currentEventBar").innerText=
`${T.current||"Current"}: ${(T.events && T.events[EVENTS[slot.day][slot.index]])||EVENTS[slot.day][slot.index]}`

document.getElementById("timeInfo").innerText=
`Local ${formatTime(now,use24h)} | Apoc ${formatTime(apoc,use24h)} | ${cd.h}h ${cd.m}m`

document.getElementById("alertBar").innerText=
alert ? (T.alert||"Do not claim radar missions") : ""
}

// INIT
async function init(){

await loadLang(LANG)

buildLangSelect()
buildTable()

setInterval(updateCalendar,1000)
updateCalendar()
}

init()
