
export let T={};export let CURRENT_LANG="en";

export const LANGS=[
{code:"en",label:"🇺🇸 English"},
{code:"pt-br",label:"🇧🇷 Português (BR)"}
];

export async function loadLang(l){
 CURRENT_LANG=l;
 T=(await import("./translations/"+l+".js")).default;
}

export function detectLang(){return "en"}

export function buildLangSelect(){
 const s=document.getElementById("langSelect");
 s.innerHTML=LANGS.map(l=>`<option value="${l.code}">${l.label}</option>`).join("");
}
