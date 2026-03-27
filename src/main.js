
import {loadLang,detectLang,buildLangSelect} from "./translate.js";
import {initUI} from "./ui.js";

(async()=>{
 try {
   const preferredLang = localStorage.getItem("lang") || detectLang() || "en";
   await loadLang(preferredLang);
   
   buildLangSelect();
   initUI();
 } catch(err) {
   console.error("Erro crítico na inicialização:", err);
   // Garantir que pelo menos English está carregado
   await loadLang("en");
   initUI();
 }
})();
