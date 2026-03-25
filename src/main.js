import { updateCalendar } from './ui.js'
import { renderMobile } from './mobile.js'

export function startLoop(){

  updateCalendar()
  renderMobile()

  setInterval(()=>{
    updateCalendar()
    renderMobile()
  },1000)
}