const APOC_TIMES=[0,4,8,12,16,20]
const OFFSET=-120

function getApocNow(){
  return new Date(Date.now()+OFFSET*60000)
}

function getCurrentSlot(){
  let apoc=getApocNow()
  let h=apoc.getHours()

  for(let i=0;i<APOC_TIMES.length;i++){
    if(h>=APOC_TIMES[i] && h<APOC_TIMES[i]+4){
      return {day:apoc.getDay(),index:i,start:APOC_TIMES[i]}
    }
  }
}

function getCountdown(){
  let apoc=getApocNow()
  let slot=getCurrentSlot()

  let next=slot.start+4
  let target=new Date(apoc)
  target.setHours(next,0,0,0)

  let diff=target-apoc

  return {
    h:Math.floor(diff/3600000),
    m:Math.floor((diff%3600000)/60000),
    s:Math.floor((diff%60000)/1000)
  }
}

function formatTime(d,use24h){
  return new Date(d).toLocaleTimeString([],{
    hour:'2-digit',
    minute:'2-digit',
    hour12:!use24h
  })
}
