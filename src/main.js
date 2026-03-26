
import {loadLang,detectLang,buildLangSelect} from "./translate.js";
import {initUI} from "./ui.js";

(async()=>{
 const lang=detectLang();
 await loadLang(lang);
 buildLangSelect();
 initUI();
})();
