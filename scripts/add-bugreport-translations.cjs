const fs = require("fs")
const path = require("path")

const dir = path.join("c:", "Git", "zcalendar", "src", "translations")

const labels = {
  "ar.js": "الإبلاغ عن خطأ",
  "bn.js": "ত্রুটি রিপোর্ট করুন",
  "de.js": "Fehler melden",
  "es.js": "Reportar un error",
  "fr.js": "Signaler un bug",
  "hi.js": "बग रिपोर्ट करें",
  "id.js": "Laporkan bug",
  "it.js": "Segnala un bug",
  "ja.js": "バグを報告",
  "ko.js": "버그 신고",
  "mr.js": "बग नोंदवा",
  "pl.js": "Zgłoś błąd",
  "pt-pt.js": "Reportar erro",
  "ru.js": "Сообщить об ошибке",
  "sw.js": "Ripoti hitilafu",
  "tr.js": "Hata bildir",
  "ur.js": "بگ رپورٹ کریں",
  "zh.js": "报告错误"
}

for(const [file, label] of Object.entries(labels)){
  const filePath = path.join(dir, file)
  let content = fs.readFileSync(filePath, "utf8")

  if(/bugReportCta\s*:/.test(content)) continue

  const nextDayPattern = /nextLabel:\s*"[^"]*",\s*\n\s*dayLabel:/
  if(nextDayPattern.test(content)){
    content = content.replace(nextDayPattern, (match) => (
      match.replace(/dayLabel:/, `bugReportCta: ${JSON.stringify(label)},\n  dayLabel:`)
    ))
  } else {
    content = content.replace(/\}\s*$/, `,\n  bugReportCta: ${JSON.stringify(label)}\n}\n`)
  }

  fs.writeFileSync(filePath, content, "utf8")
}

console.log("bugReportCta inserted where missing")
