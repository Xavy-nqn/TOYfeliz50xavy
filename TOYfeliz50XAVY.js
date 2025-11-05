// --- VARIABLES GLOBALES ---
let player;
let currentMomentKey = null;
let partyStarted = false; // Bandera para controlar que la fiesta solo inicie una vez

// Video de 1 segundo para obtener permiso de Autoplay (ID de YouTube muy corto)
const DUMMY_VIDEO_ID = '9bZkp7q19f0'; // PSY - GANGNAM STYLE

// --- ¡LISTAS DE VIDEOS ASIGNADAS A CADA MOMENTO! ---
// Los momentos interactivos (Karaoke, Coreo) deben tener la estructura { title, id }

const partyMoments = {
    'recepcion': {  // Tecla 1: El momento que inicia y reproduce una lista automática
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
    'disfraces': {  // Tecla 2: Momento de lista (vacío)
        title: "Desfile de Juguetes", 
        videos: [] 
    },
    'karaoke': {  // Tecla 3: Momento INTERACTIVO de Concurso Karaoke
        title: "Micrófono de Woody", 
        videos: [
            { title: "(Karaoke 1) Toy Story - Yo soy tu amigo fiel", id: "tpokwJUUGaA" },
            { title: "(Karaoke 2) Los Palmera - Bombón Asesino", id: "t_WzCfsgkG0" }, // elegido por Ro
            { title: "(Karaoke 3 - Dúo) Shakira y Alejandro Sans - La Tortura", id: "FynXV_rvm6M" }, // elegido por Sil
            { title: "(Karaoke 4) Luis Miguel - Ahora Te Puedes Marchar", id: "cCvwZVKXu1g" }, // elegido por Pao
            { title: "(Karaoke 5) Los Auténticos Decadentes - La Guitarra", id: "iqizT6ZrkkQ" },
            { title: "(Karaoke 6) Soda Stereo - Persiana Americana", id: "OkuMgOdVwUk" },
            { title: "(Karaoke 7) Celia Cruz - La vida es un carnaval", id: "t6x1twY6gdc" }, // elegido por Ro
            { title: "(Karaoke 8) Miranda - Don (si, el de la guitarra de Lolo)", id: "IcWN02o4ul4" },
            { title: "(Karaoke 9) Rafaga - Una Cerveza", id: "pZpG7ysTreU" }, // elegido por Ro
            { title: "(Karaoke 10) Los Abuelos de la Nada - Mil Horas", id: "9CT7_sdf17I" },
        ]
    },
    'torta': {  // Tecla 4: Momento de soplar velas y brindis
        title: "¡Al Infinito y Más Allá!", 
        videos: ['D7UU6wNTzCU', 'DQd_Ivrt7u4'] 
    },
    'coreo': {  // Tecla 5: Momento INTERACTIVO de Concurso Coreo
        title: "Despegue Estelar", 
        videos: [
            { title: "(Coreo 1) PSY - Gangman Style", id: "9bZkp7q19f0" }, // elegido por Sil
            { title: "(Córeo 2) Las Ketchup - Aserejé", id: "arZZw8NyPq8" }, // elegido por Mumy
            { title: "(Córeo 3) Chayanne - Provócame", id: "sOVQwlI_cks" },
            { title: "(Córeo 4) Don Omar - Danza Kuduro", id: "yRl4hJopuwU" },
            { title: "(Córeo 5) Los Del Río - Macarena", id: "0xv8z2tevxA" }, // elegido por Pao
            { title: "(Córeo 6) Village People - YMCA", id: "CS9OO0S5w2k" },
            { title: "(Córeo 7) Beyoncé - Crazy In Love", id: "JptwkEhdNfY" }, // elegido por Mumy
            { title: "(Córeo 8) Henry Mendez - El Tiburón", id: "8QUOftzki2Y" },
            { title: "(Córeo 9) Chocolate - Mayonesa", id: "T6NhuWYnxW0" }, // elegido por Mumy
            { title: "(Córeo 10) Luis Miguel - Será Que No Me Amas", id: "PJTYAtrnXKs" },
        ] 
    },
    'cotillon': {  // Tecla 6: Momento de Fiesta Carioca
        title: "Descontrol de la Misión", 
        videos: [
            'XNnKMt0EynA', 'Y4zJkOirldI', 'Oc40w_LiZRc', '3eqsSoPPz4g', 'ktxJZE-F5xs',
            '-_D1TMxDbDE', 'e_OIqQo58y8', '5-EuMi9-nSw', 'KFJu1m7gjKc',
            '1rmwV8EZGng', 'U6SdrI6tzxY',
        ]
    },
    'despedida': {  // Tecla 7
        title: "Misión Cumplida", 
        videos: ['CSySKnDKDuw'] 
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
    // La lógica de inicio se maneja en el listener de 'click' en el DOM
}

// 3. Controla el estado del reproductor (CLAVE DE LA SINCRONIZACIÓN)
function onPlayerStateChange(event) {
    // Si el estado es PLAYING (1) o BUFFERING (3), el video está cargado y listo.
    if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING) {
        player.unMute();
    }
    
    // Si el estado es ENDED (0) y estamos en Karaoke o Coreo, volvemos al menú.
    if (event.data === YT.PlayerState.ENDED) {
        if (currentMomentKey === 'karaoke' || currentMomentKey === 'coreo') {
            player.stopVideo();
            // ¡Llamamos al menú interactivo!
            displaySelectionMenu(partyMoments[currentMomentKey]);
            document.body.focus(); 
        }
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
        callback(); 
    }, 300);
    
    setTimeout(() => {
        warpOverlay.classList.remove('active');
    }, 1000);
}

// 6. Función principal para Cargar Momentos
function loadMoment(key) {
    if (!partyMoments[key] || key === currentMomentKey) return; 

    showMomentTitle(partyMoments[key].title);
    
    // CORRECCIÓN FINAL DE FOCO: Programamos el foco para después de la transición
    // y antes de la acción del teclado para garantizar que funcione.
    setTimeout(() => {
        document.body.focus(); 
    }, 1100); 

    applyTransitionEffect(() => {
        currentMomentKey = key;
        const moment = partyMoments[key];
        const menuElement = document.getElementById('selector-menu');

        // Lógica de FIN
        if (key === 'fin') {
            player.stopVideo();
            document.getElementById('player').style.display = 'none';
            menuElement.classList.remove('active');
            return;
        }

        // Lógica de KARAOKE/COREO (INTERACTIVO)
        if (key === 'karaoke' || key === 'coreo') {
            player.stopVideo();
            displaySelectionMenu(moment); // Muestra el menú y detiene el código aquí
            return;
        }
        
        // Si no es interactivo, ocultamos el menú
        menuElement.classList.remove('active');


        // Lógica de RECEPCIÓN/LISTA AUTOMÁTICA
        if (moment.videos && moment.videos.length > 0) {
            document.getElementById('player').style.display = 'block';
            
            // Carga la lista de videos (automática)
            player.loadPlaylist({
                playlist: moment.videos,
                index: 0,
                suggestedQuality: 'hd1080'
            });
            
            player.playVideo(); 
            
        } else {
            // Si la lista está vacía
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

// 8. FUNCIÓN NUEVA: Genera el menú interactivo para Karaoke/Coreo
function displaySelectionMenu(moment) {
    document.getElementById('player').style.display = 'none';
    const menuElement = document.getElementById('selector-menu');
    const container = document.getElementById('video-list-container');
    
    // Limpia el menú anterior
    container.innerHTML = ''; 
    menuElement.querySelector('h2').textContent = `Selecciona tu Misión: ${moment.title}`;
    
    moment.videos.forEach(video => {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = video.title;
        
        // El clic del botón llama a la reproducción individual y oculta el menú
        button.onclick = () => {
            loadSingleVideo(video.id); // Llama a la nueva función
            menuElement.classList.remove('active');
        };
        container.appendChild(button);
    });

    menuElement.classList.add('active');
}

// 9. FUNCIÓN NUEVA: Reproduce un video individual (sin lista)
function loadSingleVideo(videoId) {
    document.getElementById('player').style.display = 'block';
    player.unMute();
    // Usamos loadVideoById porque es un solo video, no una playlist
    player.loadVideoById(videoId, 0, 'hd1080');
}


// --- INICIO DE LA APLICACIÓN ---
window.addEventListener('load', () => {
    // 1. Inicializa el botón de inicio
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


// --- LÓGICA CENTRAL DE INICIO DE LA FIESTA (Disparada por el clic) ---
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
        partyStarted = true; 
        document.body.focus(); 
        loadMoment('recepcion');
    }, 100); 
}


// --- EFECTOS VISUALES ---

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