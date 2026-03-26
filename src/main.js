
import {loadLang,detectLang,buildLangSelect} from "./translate.js";
import {initUI} from "./ui.js";

(async()=>{
 try {
   // Sempre carregar inglês primeiro para garantir que T está preenchido
   await loadLang("en");
   
   // Depois detectar idioma salvo e tentar carregar
   const savedLang = localStorage.getItem("lang");
   if(savedLang && savedLang !== "en") {
     try {
       await loadLang(savedLang);
     } catch(err) {
       console.warn("Erro ao carregar idioma salvo, usando inglês:", err);
       await loadLang("en");
     }
   }
   
   buildLangSelect();
   initUI();
 } catch(err) {
   console.error("Erro crítico na inicialização:", err);
   // Garantir que pelo menos English está carregado
   await loadLang("en");
   initUI();
 }
})();
