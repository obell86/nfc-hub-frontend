document.addEventListener('DOMContentLoaded', () => {
    // API URL (Invariato)
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec'; 
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)'; 

    // Elementi DOM
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader'); 
    const percText = document.getElementById('percentage-text'); 

    // --- Funzione Loader Percentuale ---
    function startLoaderAnimation() {
        if (percText && loader) {
             loader.style.display = 'block';
             let currentPercentage = 0;
             const intervalTime = 30; const increment = 1; 
             const intervalId = setInterval(() => {
                 currentPercentage = (currentPercentage + increment); 
                 if (currentPercentage > 100) { currentPercentage = 0; } 
                 percText.textContent = Math.floor(currentPercentage) + "%"; 
             }, intervalTime);
        } else { console.warn("Loader/Percentuale non trovati."); }
    }

    // --- Funzione Caricamento Dati ---
    async function loadData() {
        startLoaderAnimation(); 
        if (loadingMessage) loadingMessage.style.display = 'block'; 

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) { throw new Error(`Errore HTTP: ${response.status}`); }
            const result = await response.json();

            if (result.success && result.data) {
                const data = result.data;

                // Titolo
                document.title = data.title || 'Magnolia 808 Hub';
                if (titleElement) titleElement.textContent = data.title || 'MAGNOLIA 808';

                // Logo (da filename relativo)
                logoContainer.innerHTML = ''; 
                if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
                    const logoFilename = data.logoUrl.trim(); 
                    console.log("Cerco logo:", logoFilename); 
                    const logoImg = document.createElement('img');
                    logoImg.src = logoFilename; 
                    logoImg.alt = 'Logo'; 
                    logoImg.onerror = () => { console.error("Errore caricando logo:", logoFilename); logoContainer.innerHTML = '<p style="font-size: 0.8em; color: #ffcc00;">Logo non trovato</p>'; };
                    logoContainer.appendChild(logoImg); 
                    if (titleElement) titleElement.style.marginTop = '0.5em'; 
                } else {
                     if (titleElement) titleElement.style.marginTop = '0'; 
                     console.log("Nessun logo specificato nel foglio (B6).");
                }
                
                // Pulsanti Link
                linkContainer.innerHTML = ''; 
                if (data.links && data.links.length > 0) {
                    data.links.forEach(link => {
                        const button = document.createElement('a');
                        button.href = link.url; button.textContent = link.label; 
                        button.className = 'link-button'; button.target = '_top';
                        button.style.background = link.color || defaultButtonColor; 
                        linkContainer.appendChild(button); 
                    });
                } else {
                    linkContainer.innerHTML = '<p>Nessun link attivo al momento.</p>';
                }
                
                if (loadingMessage) loadingMessage.style.display = 'none';

            } else {
                throw new Error(result.error || 'Errore API.');
            }

        } catch (error) {
            console.error('Errore caricamento dati:', error);
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (loader) loader.style.display = 'none'; 
            document.body.classList.add('error-page'); 
        }
    }

    // --- Inizializzazione particles.js (v2.0.0) ---
    // Questa funzione viene chiamata globalmente dalla libreria particles.min.js
    // Usa l'ID 'particles-js' che abbiamo messo nell'HTML
    
    // Definisci la configurazione in formato JSON per particles.js v2
    const particlesConfig = {
      "particles": {
        "number": {
          "value": 25, // Meno particelle se sono immagini
          "density": {
            "enable": true,
            "value_area": 800 // Area più grande per meno densità
          }
        },
        "color": {
          "value": "#ffffff" // Non usato per immagini, ma richiesto
        },
        "shape": {
          "type": "image", // Tipo immagine
          "stroke": { // Nessun bordo sulle particelle
            "width": 0,
            "color": "#000000"
          },
          "polygon": { // Non usato per immagini
            "nb_sides": 5
          },
          "image": { 
            // !!! ARRAY DI IMMAGINI LOCALI - Assicurati che esistano nel repo! !!!
            "src": ["lips.png", "lollipop.png", "eye.png", "star-pop.png", "lightning.png"], 
            "width": 100, // Larghezza originale (la libreria scala)
            "height": 100 // Altezza originale
          }
        },
        "opacity": {
          "value": 0.7, // Opacità base
          "random": true, // Variazione casuale
          "anim": { // Animazione opacità
            "enable": true,
            "speed": 0.8,
            "opacity_min": 0.2,
            "sync": false
          }
        },
        "size": {
          "value": 40, // Dimensione base (in px)
          "random": true, // Dimensione casuale (tra min e value)
          "anim": { // Animazione dimensione
            "enable": true,
            "speed": 3,
            "size_min": 20, // Dimensione minima
            "sync": false
          }
        },
        "line_linked": { // Nessuna linea tra le particelle
          "enable": false,
        },
        "move": {
          "enable": true,
          "speed": 1.5, // Velocità movimento
          "direction": "none", // Casuale
          "random": true,
          "straight": false,
          "out_mode": "out", // Escono dallo schermo
          "bounce": false, // Non rimbalzano tra loro
          "attract": { // Non si attraggono
            "enable": false,
          }
        }
      },
      "interactivity": { // Nessuna interattività mouse
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": false },
          "onclick": { "enable": false },
          "resize": true // Si adatta al resize finestra
        }
      },
      "retina_detect": true // Migliora qualità su schermi retina
    };

    // Chiama la funzione globale `particlesJS` per inizializzare
    // Passa l'ID del div e l'oggetto di configurazione
    if (typeof particlesJS !== 'undefined') {
         particlesJS('particles-js', particlesConfig);
         console.log("particles.js inizializzato.");
    } else {
         console.error("La libreria particlesJS non è stata caricata correttamente! Controlla il tag <script> in index.html.");
         if (loadingMessage) loadingMessage.textContent = "Errore caricamento effetti.";
         if (loader) loader.style.display = 'none';
    }


    // Avvia il caricamento dei dati dal foglio Google
    loadData(); 
});
