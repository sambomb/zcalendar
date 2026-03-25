
const SERVER_OFFSET=-2
export function getApoc(){
 const now=new Date()
 const utc=now.getTime()+now.getTimezoneOffset()*60000
 const s=new Date(utc+SERVER_OFFSET*3600000)
 return {h:s.getHours(),m:s.getMinutes()}
}
