// ===== TIME ENGINE PRO =====

// Config
const APOC_TIMES = [0,4,8,12,16,20]
const APOC_OFFSET_MINUTES = -120

// Get apocalypse time
function getApocNow(){
  const now = new Date()
  return new Date(now.getTime() + APOC_OFFSET_MINUTES*60000)
}

// Get current slot
function getCurrentSlot(){
  const apoc = getApocNow()
  const day = apoc.getDay()
  const hour = apoc.getHours()

  for(let i=0;i<APOC_TIMES.length;i++){
    let start = APOC_TIMES[i]
    let end = start + 4
    if(hour >= start && hour < end){
      return {day, index:i, start, end}
    }
  }
  return {day, index:0, start:0, end:4}
}

// Get next slot
function getNextSlot(){
  let slot = getCurrentSlot()
  let nextIndex = (slot.index + 1) % APOC_TIMES.length
  let nextDay = slot.day

  if(nextIndex === 0) nextDay = (slot.day + 1) % 7

  return {day: nextDay, index: nextIndex}
}

// Countdown to next event
function getCountdown(){
  const apoc = getApocNow()
  const slot = getCurrentSlot()

  let nextHour = slot.end
  let target = new Date(apoc)
  target.setHours(nextHour,0,0,0)

  if(nextHour >= 24){
    target.setDate(target.getDate()+1)
    target.setHours(0,0,0,0)
  }

  let diff = target - apoc

  let h = Math.floor(diff/3600000)
  let m = Math.floor((diff%3600000)/60000)
  let s = Math.floor((diff%60000)/1000)

  return {h,m,s}
}

// Format time
function formatTime(date, use24h=true){
  return date.toLocaleTimeString([],{
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit',
    hour12:!use24h
  })
}
