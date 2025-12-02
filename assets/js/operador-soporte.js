// 🚀 TOY feliz 50 XAVY 👨‍🚀
//
//  Lógica de comunicación entre Panel de Control y Show VJ-MIX
//    :: operator-support.js
//    :: versión 8.3
//    :: 22 11 25
//    :: Javier Prior

const __strix_channel = new BroadcastChannel('strix_channel');

function emitShowStatus(status, data={}){
  const payload = Object.assign({ status }, data);
  try { __strix_channel.postMessage(payload); } catch(e){ console.warn('emit failed',e); }
}

window.emitShowStatus = emitShowStatus;
