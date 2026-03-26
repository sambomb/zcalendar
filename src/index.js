import './styles.css'
import { loadLang, buildLangSelect } from './translate.js'
import { initUI } from './ui.js'

async function init(){
  try {
    // Always load English first to ensure T is populated
    await loadLang("en");
    
    // Then try to load saved language
    const savedLang = localStorage.getItem("lang");
    if(savedLang && savedLang !== "en") {
      try {
        await loadLang(savedLang);
      } catch(err) {
        console.warn("Error loading saved language, using English:", err);
        await loadLang("en");
      }
    }
    
    buildLangSelect();
    initUI();
  } catch(err) {
    console.error("Critical initialization error:", err);
    await loadLang("en");
    initUI();
  }
}

init()