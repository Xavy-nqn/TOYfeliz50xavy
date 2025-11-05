// --- VARIABLES GLOBALES ---
let player;
let currentMomentKey = null;
let partyStarted = false; // Bandera para controlar que la fiesta solo inicie una vez

// Video de 1 segundo para obtener permiso de Autoplay (ID de YouTube muy corto)
const DUMMY_VIDEO_ID = '9bZkp7q19f0'; 

// --- ¡LISTAS DE VIDEOS ASIGNADAS A CADA MOMENTO! ---
const partyMoments = {
    'recepcion': {  // Tecla 1: Contiene todos los videos
        title: "Llamada a la Misión", 
        videos: [
            'Xq-eunLqtfU', '0CjSIG-E0-s', 'ODYOJpIkx3c', 'zhqqcNafowU', 'GEDPLm5xX6s', '5wnPbzUL65Q',
            'ky5saDqSFiE', 'vd2YM9Yj8Es', 'JJ6-ueXa4hY', '6tOp4IIm6Pw', 'OJzsNxOCbgA', '_BmpBym4gzs',
            'w1CYnJMbT9w', 'drX9GpNn99s', 'RSJnSTjhGg0', '9W3nZVUV-68', 'GUaltRgMaMA', 'dt0s2IGHYJk',
            'w2pm2GR_aAY', 'Gww3zUy6UTE', 'RmEDXb-KfGk', '-wgwrBYBczI', 'gFghRmFYM3A', 'ty8aM8ATbHA',
            'zGO142zWkIs', 'xCnuf_kyyho', 'qvFxRk7B8rQ', '0XSfLsABRdo', 'c0D2h71bFFI', 'RCYhV1DGy1k',
            '3qmjx664FeM', '15gNhUUOiCI', 'M9RBIRWMjqU', '2tkhX5eJZdg', 'ymgIkOXp6Ds', '0IHbz4e3BO8',
            'RyP8hGuyknA', 'J2YA8OO3Ba4', 'vp8qL6kfjQs', '5WHaV1w-gbk', 'dqKpx51vKLc', 'qCrWEwqR2ak',
            'JecFxU07Qiw'
        ] 
    },
    'disfraces': {  // Tecla 2
        title: "Desfile de Juguetes", 
        videos: [] 
    },
    'karaoke': {  // Tecla 3
        title: "Micrófono de Woody", 
        videos: [] 
    },
    'torta': {  // Tecla 4
        title: "¡Al Infinito y Más Allá!", 
        videos: [] 
    },
    'coreo': {  // Tecla 5
        title: "Despegue Estelar", 
        videos: [] 
    },
    'cotillon': {  // Tecla 6
        title: "Descontrol de la Misión", 
        videos: [] 
    },
    'despedida': {  // Tecla 7
        title: "Misión Cumplida", 
        videos: [] 
    },
    'fin': {  // Tecla 8
        title: "Estación Cerrada", 
        videos: [] 
    }
};

// 1. Carga la API de YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%', 
        width: '100%', 
        playerVars: {
            'autoplay': 1, 
            'controls': 0, 
            'modestbranding': 1, 
            'loop': 0, 
            'rel': 0, 
            'showinfo': 0, 
            'iv_load_policy': 3,
            'disablekb': 1, 
        },
        events: {  
            'onReady': onPlayerReady,  
            'onStateChange': onPlayerStateChange 
        }
    });
}

// 2. Se llama cuando el reproductor está listo
function onPlayerReady(event) {
    event.target.mute(); // Silencia en espera del clic
    // La lógica del clic se maneja en el listener de 'load'
}

// 3. Controla el estado del reproductor (CLAVE DE LA SINCRONIZACIÓN)
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING) {
        player.unMute();
    }
}


// 4. Gestor de Teclado (Tu "Cabina de DJ")
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '1' && key <= '8') {
        event.preventDefault(); // Detiene cualquier acción por defecto del navegador
        
        const keys = ['recepcion', 'disfraces', 'karaoke', 'torta', 'coreo', 'cotillon', 'despedida', 'fin'];
        const momentKey = keys[parseInt(key) - 1];
        loadMoment(momentKey);
    }
});


// 5. Lógica de la transición "Warp"
function applyTransitionEffect(callback) {
    const warpOverlay = document.getElementById('warp-overlay');
    warpOverlay.classList.add('active');
    
    setTimeout(() => {
        callback(); // Carga el nuevo contenido
    }, 300);
    
    setTimeout(() => {
        warpOverlay.classList.remove('active');
    }, 1000);
}


// 6. Función principal para Cargar Momentos
function loadMoment(key) {
    // Si el momento es el mismo o no existe, salimos.
    if (!partyMoments[key] || key === currentMomentKey) return; 

    showMomentTitle(partyMoments[key].title);
    
    setTimeout(() => {
        document.body.focus(); 
        console.log("Foco devuelto al cuerpo del documento. Teclas numéricas activas.");
    }, 1100); 

    
    applyTransitionEffect(() => {
        currentMomentKey = key;
        const moment = partyMoments[key];

        if (key === 'fin') {
            // Lógica de FIN
            player.stopVideo();
            document.getElementById('player').style.display = 'none';
            return;
        }

        // ¡VERIFICACIÓN DE LA LISTA CORREGIDA!
        if (moment.videos && moment.videos.length > 0) {
            document.getElementById('player').style.display = 'block';
            
            player.loadPlaylist({
                playlist: moment.videos,
                index: 0,
                suggestedQuality: 'hd1080'
            });
            
            player.playVideo(); 
            
        } else {
            // Si la lista está vacía, detenemos el reproductor.
            player.stopVideo();
            document.getElementById('player').style.display = 'none';
            console.warn(`AVISO: La lista de videos para el momento "${moment.title}" está vacía.`);
        }
    });
}


// 7. Función para mostrar el Título del Momento
function showMomentTitle(title) {
    const titleElement = document.getElementById('moment-title');
    if (titleElement) {
        const titleParts = title.split(' ');
        if (titleParts.length > 2) {
             titleElement.innerHTML = titleParts.slice(0, 2).join(' ') + '<br>' + titleParts.slice(2).join(' ');
        } else {
            titleElement.innerHTML = title.replace(" ", "<br>");
        }

        titleElement.classList.add('visible');
        setTimeout(() => {
            titleElement.classList.remove('visible');
        }, 4000); // 4 segundos en pantalla
    }
}


// --- LÓGICA CENTRAL DE INICIO DE LA FIESTA ---
// Separada para ser llamada solo tras el clic y asegurar el permiso de play.
function startThePartyLogic(overlay) {
    if (partyStarted) return; 
    
    // 1. TRUCO DE PERMISO: Forzamos la reproducción y pausa inmediata
    player.unMute();
    player.loadVideoById(DUMMY_VIDEO_ID);
    player.playVideo(); 
    player.pauseVideo(); 
    
    // 2. Quitamos el overlay
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 500);

    // 3. Cargamos el contenido real con un pequeño retraso
    setTimeout(() => {
        partyStarted = true; // Establecer bandera DESPUÉS de dar el permiso
        document.body.focus(); // Aseguramos el foco para el teclado
        loadMoment('recepcion');
    }, 100); 
}


// 8. EJECUCIÓN DEL SCRIPT
window.addEventListener('load', () => {
    // 1. Inicializa el botón de inicio (ahora llama a la lógica de forma robusta)
    const overlay = document.getElementById('start-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            // ¡Verificación crítica antes de iniciar!
            if (typeof player !== 'undefined' && player.playVideo) {
                startThePartyLogic(overlay);
            }
        });
    }

    // 2. Inicializa el visualizador 
    createVisualizerBars();
});


// --- EFECTOS VISUALES (Optimizados) ---

// Generar barras del visualizador
const visualizerContainer = document.querySelector('.visualizer-container');
const numberOfBars = 50; // Cantidad de barras

function createVisualizerBars() {
    for (let i = 0; i < numberOfBars; i++) {
        const bar = document.createElement('div');
        bar.classList.add('visualizer-bar');
        bar.style.animationDelay = `${Math.random() * 0.5}s`; 
        bar.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
        visualizerContainer.appendChild(bar);
    }
}