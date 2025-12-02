// 🚀 TOY feliz 50 XAVY 👨‍🚀
//
//  Lógica del Tablero de Control del Operador del VJ-MIX (BroadcastChannel, UI, scheduling)
//    :: operador.js
//    :: versión 8.3
//    :: 22 11 25
//    :: Javier Prior

const channel = new BroadcastChannel('strix_channel');
let showWindow = null;
let autoSchedule = true;
const SFX = {confirm: null, warning: null, error: null};
document.addEventListener('DOMContentLoaded', ()=>{
  SFX.confirm = document.getElementById('sfx-confirm');
  SFX.warning = document.getElementById('sfx-warning');
  SFX.error = document.getElementById('sfx-error');
});

// partyMoments data
const partyMoments = {
  recepcion: { title: 'Llamada a la Misión', start: '21:00', durationMin: 60, key:'recepcion' },
  disfraces: { title: 'Desfile de Juguetes', start: '22:00', durationMin: 60, key:'disfraces' },
  torta: { title: '¡Al Infinito y Más Allá!', start: '23:00', durationMin: 30, key:'torta' },
  karaoke: { title: 'Micrófono de Woody', start: '23:30', durationMin: 60, key:'karaoke' },
  coreo: { title: 'Despegue Estelar', start: '00:30', durationMin: 60, key:'coreo' },
  cotillon: { title: 'Descontrol de la Misión', start: '01:30', durationMin: 90, key:'cotillon' },
  despedida: { title: 'Misión Cumplida', start: '03:00', durationMin: 30, key:'despedida' }
};

// Helper: parse hh:mm in UTC-3 into Date object for today or next day if earlier than now
function nextOccurrenceHHMM(hhmm) {
  const [hh,mm] = hhmm.split(':').map(Number);
  const now = new Date();
  const utcNow = new Date(now.getTime() + now.getTimezoneOffset()*60000);
  const tzOffsetMs = -3 * 3600 * 1000;
  const local = new Date(utcNow.getTime() + tzOffsetMs);
  let target = new Date(local.getFullYear(), local.getMonth(), local.getDate(), hh, mm, 0);
  if (target <= local) target = new Date(target.getTime() + 24*3600*1000);
  const targetUtcMs = target.getTime() - tzOffsetMs;
  return new Date(targetUtcMs);
}

// UI initialization
function initUI() {
  const list = document.getElementById('momentsList');
  Object.values(partyMoments).forEach(m => {
    const div = document.createElement('div');
    div.className = 'momentItem';
    div.innerHTML = `<div class="momentMeta"><strong>${m.title}</strong><small>${m.start} • ${m.durationMin} min</small></div>
      <div class="momentActions">
        <button class="btn play" data-key="${m.key}">▶️</button>
        <button class="btn pause" data-key="${m.key}">⏸</button>
        <button class="btn next" data-key="${m.key}">⏭</button>
      </div>`;
    list.appendChild(div);
  });
}

// Clock UTC-3 display
function updateClock() {
  const now = new Date();
  const utcNow = new Date(now.getTime() + now.getTimezoneOffset()*60000);
  const tzOffsetMs = -3 * 3600 * 1000;
  const local = new Date(utcNow.getTime() + tzOffsetMs);
  const hh = String(local.getHours()).padStart(2,'0');
  const mm = String(local.getMinutes()).padStart(2,'0');
  const ss = String(local.getSeconds()).padStart(2,'0');
  document.getElementById('clock').textContent = `UTC-3 ${hh}:${mm}:${ss}`;
}

// BroadcastChannel handlers
channel.onmessage = (e) => {
  const msg = e.data;
  addLog('[IN] ' + JSON.stringify(msg));
  if (msg.status) {
    document.getElementById('connStatus').innerHTML = (msg.status === 'error') ? '<span class="indicator red">ERROR</span>' : '<span class="indicator green">OK</span>';
    if (msg.status === 'error') playSfx('error');
    if (msg.status === 'warning') playSfx('warning');
    if (msg.status === 'playing') playSfx('confirm');
  }
};

function playSfx(kind) {
  try {
    const a = SFX[kind];
    if (!a) return;
    a.currentTime = 0;
    a.play();
  } catch(e){console.warn(e)}
}

function addLog(msg) {
  const el = document.getElementById('logPanel');
  const p = document.createElement('div');
  p.textContent = new Date().toLocaleTimeString('es-AR') + ' ' + msg;
  el.prepend(p);
}

// Open show window
document.getElementById('openShowBtn').addEventListener('click', () => {
  showWindow = window.open('show.html', 'TOYShow', 'width=1280,height=720');
  if (showWindow) {
    document.getElementById('showWindowState').textContent = 'Abierta';
    addLog('[OUT] Show window abierta');
  } else { alert('Permitir popups para abrir la pantalla de salida'); }
});

// Controls for moments
document.getElementById('momentsList').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const key = btn.dataset.key;
  if (btn.classList.contains('play')) {
    channel.postMessage({ action: 'playMoment', key });
    addLog('[CMD] playMoment ' + key);
  } else if (btn.classList.contains('pause')) {
    channel.postMessage({ action: 'pauseMoment', key });
    addLog('[CMD] pauseMoment ' + key);
  } else if (btn.classList.contains('next')) {
    channel.postMessage({ action: 'nextMoment', key });
    addLog('[CMD] nextMoment ' + key);
  }
});

// tab switching
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click', (ev)=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  ev.target.classList.add('active');
  document.querySelectorAll('.tabcontent').forEach(tc=>tc.classList.add('hidden'));
  document.getElementById(ev.target.dataset.tab).classList.remove('hidden');
}));

// mute all
document.getElementById('muteAll').addEventListener('click', ()=>{
  channel.postMessage({ action:'muteAll' });
  addLog('[CMD] muteAll');
});

// master volume control
document.getElementById('masterVol').addEventListener('input', (e)=>{
  const v = Number(e.target.value);
  channel.postMessage({ action:'masterVol', value: v });
  document.getElementById('volA').textContent = v;
  document.getElementById('volB').textContent = v;
});

// Auto schedule toggler
document.getElementById('startAutoSchedule').addEventListener('click', (e)=>{
  autoSchedule = !autoSchedule;
  e.target.textContent = autoSchedule ? 'Auto-schedule ON' : 'Auto-schedule OFF';
  addLog('[SYS] AutoSchedule ' + autoSchedule);
});

// scheduling loop: suggest starting moments at their UTC-3 times
setInterval(()=>{
  updateClock();
  if (!autoSchedule) return;
  const now = new Date();
  const utcNow = new Date(now.getTime() + now.getTimezoneOffset()*60000);
  const tzOffsetMs = -3 * 3600 * 1000;
  const local = new Date(utcNow.getTime() + tzOffsetMs);
  const hhmm = String(local.getHours()).padStart(2,'0') + ':' + String(local.getMinutes()).padStart(2,'0');
  Object.values(partyMoments).forEach(m => {
    if (m.start === hhmm) {
      channel.postMessage({ action:'playMoment', key: m.key, auto: true });
      addLog('[AUTO] Solicitado playMoment ' + m.key + ' por horario');
      playSfx('confirm');
    }
  });
}, 1000);

// init ui and populate list
initUI();
addLog('[SYS] Panel listo (UTC-3)');
