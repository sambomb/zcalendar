
export let T={}

const LANGS=["en","pt-BR","es","fr","de","it","ru","ja","ko","zh","ar","hi","id","tr","pl"]

export async function loadLang(l){
 try{
  T=(await import(`./translations/${l}.js`)).default
 }catch{
  T=(await import(`./translations/en.js`)).default
 }
 localStorage.setItem("lang",l)
}

export function detectLang(){
 return localStorage.getItem("lang")||navigator.language||"en"
}

export function buildLangSelect(){
 const s=document.getElementById("langSelect")
 s.innerHTML=LANGS.map(l=>`<option value="${l}">${l}</option>`).join("")
 s.value=detectLang()
 s.onchange=async()=>{
  await loadLang(s.value)
  location.reload()
 }
}

export function t(path){
 return path.split(".").reduce((o,k)=>o?.[k],T)
}
