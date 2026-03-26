
import {EVENTS,ICONS,DAY_KEYS} from "./events.js";
import {getLocal,formatTime,formatDate,toggleFormat} from "./calctime.js";
import {T,CURRENT_LANG} from "./translate.js";

export function initUI(){

document.getElementById("timeBtn").onclick=()=>{toggleFormat();update()};

build();
fill();
apply();

setInterval(update,1000);
}

function build(){
const head=document.getElementById("tableHead");
head.innerHTML="<th>"+T.time+"</th>"+T.days.map((d,i)=>`<th>${d}<div>${T.dayTitles[DAY_KEYS[i]]}</div></th>`).join("");

const body=document.getElementById("tableBody");
body.innerHTML="";

for(let r=0;r<6;r++){
 let row="<tr><td>"+(r*4).toString().padStart(2,"0")+":00</td>";
 for(let d=0;d<7;d++){
  row+=`<td class="cell" data-day="${d}" data-hour="${r*4}"></td>`;
 }
 row+="</tr>";
 body.innerHTML+=row;
}
}

function fill(){
const today=new Date();

document.querySelectorAll(".cell").forEach(c=>{
 const d=+c.dataset.day;
 const h=+c.dataset.hour;
 const ev=EVENTS[h/4][d];

 const date=new Date(today);
 date.setDate(today.getDate()+d);

 c.innerHTML=`
 <div>${T.dayLabel} ${d} • ${formatDate(date,CURRENT_LANG)}</div>
 <div>${h.toString().padStart(2,"0")}:00</div>
 <img src="${ICONS.white}" class="radar-icon">
 <div>${T.events[ev]}</div>`;
});
}

function update(){
const now=getLocal();
const d=now.getDay();
const h=Math.floor(now.getHours()/4)*4;

document.querySelectorAll(".cell").forEach(c=>c.classList.remove("active","today-col"));

document.querySelectorAll(`[data-day="${d}"]`).forEach(c=>c.classList.add("today-col"));

const active=document.querySelector(`.cell[data-day="${d}"][data-hour="${h}"]`);
if(active)active.classList.add("active");

document.getElementById("timeInfo").innerText=
T.localLabel+": "+formatTime(now,CURRENT_LANG);
}

function apply(){
const f=T.filters;
document.querySelector('[data-filter="all"]').textContent=f.all;
document.querySelector('[data-filter="army"]').textContent=f.army;
document.querySelector('[data-filter="hero"]').textContent=f.hero;
document.querySelector('[data-filter="shelter"]').textContent=f.shelter;
document.querySelector('[data-filter="vehicle"]').textContent=f.vehicle;
document.querySelector('[data-filter="science"]').textContent=f.science;
}
