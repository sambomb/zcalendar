
import {EVENTS} from './events.js'
import {getApoc} from './calctime.js'
import {T,t} from './translate.js'

export function initUI(){
 build()
 applyTranslations()
 setInterval(update,1000)
}

function build(){
 const head=document.getElementById("tableHead")
 const body=document.getElementById("tableBody")

 head.innerHTML="<th>"+t("time")+"</th>"+T.days.map(d=>"<th>"+d+"</th>").join("")

 for(let r=0;r<6;r++){
  let tr="<tr><td>"+(r*4)+":00</td>"
  for(let d=0;d<7;d++){
    const ev=EVENTS[r][d]
    tr+=`<td>${T.events[ev]||ev}</td>`
  }
  tr+="</tr>"
  body.innerHTML+=tr
 }
}

function applyTranslations(){
 document.querySelector('[data-filter="all"]').textContent=T.filters.all
 document.querySelector('[data-filter="army"]').textContent=T.filters.army
 document.querySelector('[data-filter="hero"]').textContent=T.filters.hero
 document.querySelector('[data-filter="shelter"]').textContent=T.filters.shelter
 document.querySelector('[data-filter="vehicle"]').textContent=T.filters.vehicle
 document.querySelector('[data-filter="science"]').textContent=T.filters.science
}

function update(){
 const {h}=getApoc()
 const row=Math.floor(h/4)
 document.querySelectorAll("#tableBody tr").forEach((tr,i)=>{
  tr.classList.toggle("active",i===row)
 })
}
