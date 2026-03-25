const LANGS=[
"en","pt","es","it","ru","ko","ja","hi",
"zh","ar","bn","ur","id","de","sw","mr"
]

let LANG=localStorage.getItem("lang")||detectLang()
let T={}

function detectLang(){
let l=navigator.language.toLowerCase()
if(l.includes("-")) l=l.split("-")[0]
return LANGS.includes(l)?l:"en"
}

async function loadLang(lang){
return new Promise(res=>{
let s=document.createElement("script")
s.src=`translations/${lang}.js`
s.onload=()=>{
T=window[`TRANSLATIONS_${lang.toUpperCase()}`]||{}
res()
}
s.onerror=()=>{T={};res()}
document.body.appendChild(s)
})
}

// dropdown
function buildLangSelect(){

let select=document.getElementById("langSelect")
select.innerHTML=""

LANGS.forEach(l=>{
let opt=document.createElement("option")
opt.value=l
opt.text=l.toUpperCase()
if(l===LANG)opt.selected=true
select.appendChild(opt)
})

select.onchange=async()=>{
LANG=select.value
localStorage.setItem("lang",LANG)
await loadLang(LANG)
updateCalendar()
}
}
