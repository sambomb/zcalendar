export let T = {}

const LANGS = [
  {code:"en",label:"🇺🇸 English"},
  {code:"pt-BR",label:"🇧🇷 Português"},
  {code:"es",label:"🇪🇸 Español"},
  {code:"fr",label:"🇫🇷 Français"},
  {code:"de",label:"🇩🇪 Deutsch"},
  {code:"ru",label:"🇷🇺 Русский"},
  {code:"zh",label:"🇨🇳 中文"},
  {code:"ja",label:"🇯🇵 日本語"},
  {code:"ko",label:"🇰🇷 한국어"},
  {code:"hi",label:"🇮🇳 हिन्दी"},
  {code:"ar",label:"🇸🇦 العربية"},
  {code:"id",label:"🇮🇩 Bahasa"},
  {code:"tr",label:"🇹🇷 Türkçe"},
  {code:"it",label:"🇮🇹 Italiano"},
  {code:"pl",label:"🇵🇱 Polski"}
]

export async function loadLang(lang){
  try{
    T = (await import(`./translations/${lang}.js`)).default
  }catch{
    T = (await import(`./translations/en.js`)).default
  }
  localStorage.setItem("lang", lang)
}

export function detectLang(){
  return localStorage.getItem("lang") || navigator.language || "en"
}

export function buildLangSelect(){

  const sel = document.getElementById("langSelect")

  sel.innerHTML = LANGS.map(l=>
    `<option value="${l.code}">${l.label}</option>`
  ).join("")

  sel.value = detectLang()

  sel.onchange = async ()=>{
    await loadLang(sel.value)
    location.reload()
  }
}