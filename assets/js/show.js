// 🚀 TOY feliz 50 XAVY 👨‍🚀
//
//  Lógica de recepción de comandos del Operador y controles del show VJ-MIX
//    :: show.js
//    :: versión 8.3
//    :: 22 11 25
//    :: Javier Prior

const channel = new BroadcastChannel('strix_channel');

channel.onmessage = (e) => {
  const msg = e.data;
  console.log('[SHOW] Recibido', msg);
  if (msg.action === 'playMoment') {
    try {
      if (typeof startMoment === 'function') {
        startMoment(msg.key);
        window.emitShowStatus?.('playing', { currentMoment: msg.key });
      } else {
        window.emitShowStatus?.('error', { error: 'startMoment undefined' });
      }
    } catch (err) {
      console.error(err);
      window.emitShowStatus?.('error', { error: String(err) });
    }
  } else if (msg.action === 'pauseMoment') {
    try { typeof pauseMoment === 'function' && pauseMoment(msg.key); window.emitShowStatus?.('paused', { currentMoment: msg.key }); }
    catch (e){ window.emitShowStatus?.('error', { error: String(e) }); }
  } else if (msg.action === 'nextMoment') {
    try { typeof nextMoment === 'function' && nextMoment(msg.key); window.emitShowStatus?.('next', { currentMoment: msg.key }); }
    catch (e){ window.emitShowStatus?.('error', { error: String(e) }); }
  } else if (msg.action === 'muteAll') {
    try { typeof setMasterVolume === 'function' && setMasterVolume(0); window.emitShowStatus?.('muted'); }
    catch(e){ window.emitShowStatus?.('error', { error: String(e) }); }
  } else if (msg.action === 'masterVol') {
    try { typeof setMasterVolume === 'function' && setMasterVolume(msg.value); window.emitShowStatus?.('vol', { value: msg.value }); }
    catch(e){ window.emitShowStatus?.('error', { error: String(e) }); }
  }
};
