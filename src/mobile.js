export function renderMobile(){

  const mobile = document.getElementById("mobileDay")

  if(window.innerWidth > 768){
    mobile.innerHTML = ""
    return
  }

  mobile.innerHTML = "Mobile View Active"
}