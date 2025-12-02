// 🚀 TOY feliz 50 XAVY 👨‍🚀
//
// Lógica del sitio para invitados de la fiesta "Bitácora de la Misión"
// :: bitacora.js
// :: versión 8.3
// :: 01 12 25
// :: Javier Prior

// tab switching
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click', (ev)=>{
    // 1. Elimina la clase 'active' de todos los botones de pestaña
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    
    // 2. Añade la clase 'active' al botón que fue clickeado
    ev.target.classList.add('active');
    
    // 3. Oculta todo el contenido de las pestañas
    document.querySelectorAll('.tabcontent').forEach(tc=>tc.classList.add('hidden'));
    
    // 4. Muestra el contenido de la pestaña correspondiente (usando el atributo data-tab)
    document.getElementById(ev.target.dataset.tab).classList.remove('hidden');
}));