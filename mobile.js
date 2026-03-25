// ---------- MOBILE ENGINE ----------

let currentMobileDay = new Date().getDay()
let startX = 0
let currentTranslate = 0

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

function renderMobileDay(animated=false){

let container=document.getElementById("mobileDay")
if(!container) return

container.innerHTML=""

let wrapper=document.createElement("div")
wrapper.style.transition = animated ? "transform 0.25s ease" : "none"

// DAY TITLE
let title=document.createElement("div")
title.className="dayTitle"

let dayName = DAY_NAMES[currentMobileDay]
if(window.T && T.days && T.days[currentMobileDay]){
dayName = T.days[currentMobileDay]
}

if(currentMobileDay === new Date().getDay()){
dayName += " • TODAY"
}

title.innerText = dayName
wrapper.appendChild(title)

// NEXT EVENT
let slot = getCurrentSlot()
let nextEvent = EVENTS[currentMobileDay][(slot.index+1)%6]

let preview=document.createElement("div")
preview.style.textAlign="center"
preview.style.fontSize="12px"
preview.style.opacity="0.7"
preview.innerText = "Next: " + ((T?.events?.[nextEvent])||nextEvent)

wrapper.appendChild(preview)

// EVENTS
for(let r=0;r<6;r++){

let hour=APOC_TIMES[r]
let base=new Date()
base.setHours(hour,0,0,0)

let raw=EVENTS[currentMobileDay][r]
let event=(T?.events?.[raw])||raw

let div=document.createElement("div")
div.className="mobileCell"

// ICON RULES
let icon="white"
if(currentMobileDay===0)icon="red"
else if(currentMobileDay===1)icon="gold"
else if(currentMobileDay===4)icon="red"
else if(currentMobileDay===5)icon="gold"

div.innerHTML=`
<img src="https://cdn.jsdelivr.net/gh/sambomb/zcalendar@main/${icon}.png" width="18"><br>
${formatTime(base,use24h)}<br>
<div class="event">${event}</div>
`

// ACTIVE
let slotCheck=getCurrentSlot()
if(currentMobileDay===slotCheck.day && r===slotCheck.index){
div.classList.add("active")
}

wrapper.appendChild(div)
}

// ANIMATION
wrapper.style.transform = `translateX(${currentTranslate}px)`
container.appendChild(wrapper)

setTimeout(()=>{
wrapper.style.transform="translateX(0)"
},10)
}

// ---------- SWIPE ----------
function initMobileSwipe(){

document.addEventListener("touchstart",e=>{
startX=e.touches[0].clientX
})

document.addEventListener("touchend",e=>{
let endX=e.changedTouches[0].clientX
let delta = startX - endX

if(Math.abs(delta) < 40) return

if(navigator.vibrate) navigator.vibrate(10)

currentTranslate = delta > 0 ? -100 : 100

if(delta > 0){
currentMobileDay = (currentMobileDay + 1) % 7
}else{
currentMobileDay = (currentMobileDay + 6) % 7
}

renderMobileDay(true)
})

}

// ---------- HOOK ----------
function hookMobile(){

const originalUpdate = window.updateCalendar

window.updateCalendar = async function(){
await originalUpdate()
renderMobileDay()
}

initMobileSwipe()
}
