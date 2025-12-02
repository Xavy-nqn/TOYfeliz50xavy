// 🚀 TOY feliz 50 XAVY 👨‍🚀
//
//  Lógica de las Alertas Sonoras del Tablero de Control del Operador del VJ-MIX
//    :: audio-alerts.js
//    :: versión 8.3
//    :: 22 11 25
//    :: Javier Prior

document.addEventListener("click", function enableSoundOnce(){ 
  document.querySelectorAll("#sfx-confirm, #sfx-warning, #sfx-error").forEach(a => {
    a.play().then(()=>{ a.pause(); a.currentTime=0; }).catch(()=>{});
  });
  document.removeEventListener("click", enableSoundOnce);
}, {once:true});