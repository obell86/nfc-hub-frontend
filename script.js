document.addEventListener('DOMContentLoaded', () => {
    // API URL
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec'; 
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)'; 

    // Elementi DOM
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader'); 
    const percText = document.getElementById('percentage-text'); 

    // --- Funzione Loader ---
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
            console.log("Tentativo fetch API:", apiUrl); 
            const response = await fetch(apiUrl);
            console.log("Risposta API Status:", response.status); 
            
            if (!response.ok) { 
                const errorText = await response.text(); console.error("Testo errore API:", errorText);
                throw new Error(`Errore HTTP: ${response.status}`); 
            }
            const result = await response.json();
            console.log("Dati JSON:", result); 

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
                    logoImg.src = logoFilename; // URL RELATIVO!
                    logoImg.alt = 'Logo'; 
                    logoImg.onerror = () => { console.error("Errore caricando logo:", logoFilename); logoContainer.innerHTML = '<p style="font-size: 0.8em; color: #ffcc00;">Logo non trovato</p>'; };
                    logoContainer.appendChild(logoImg); 
                    if (titleElement) titleElement.style.marginTop = '0.5em'; 
                } else {
                     if (titleElement) titleElement.style.marginTop = '0'; 
                     console.log("Nessun logo specificato (B6).");
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
                    linkContainer.innerHTML = '<p>Nessun link attivo.</p>';
                }
                
                if (loadingMessage) loadingMessage.style.display = 'none';

                // Chiamiamo particles.js SOLO DOPO che il resto è caricato
                initParticlesJS(); 

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
    function initParticlesJS() {
        // Definisci la configurazione
        const particlesConfig = {
          "particles": {
            "number": { "value": 25, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ffffff" }, // Inutile per immagini
            "shape": {
              "type": "image",
              "stroke": { "width": 0 },
              "polygon": { "nb_sides": 5 },
              "image": { 
                // !!! USA I NOMI FILE ESATTI CARICATI SU GITHUB !!!
                "src": ["lips.png", "lollipop.png", "eye.png", "star-pop.png", "lightning.png"], 
                "width": 100, "height": 100 
              }
            },
            "opacity": { "value": 0.7, "random": true, "anim": { "enable": true, "speed": 0.8, "opacity_min": 0.2, "sync": false } },
            "size": { "value": 40, "random": true, "anim": { "enable": true, "speed": 3, "size_min": 20, "sync": false } },
            "line_linked": { "enable": false }, // No linee
            "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false } }
            // Aggiungere qui 'rotate', 'tilt', 'wobble' NON è standard in particles.js v2.0.0 originale.
            // Il movimento base è più semplice.
          },
          "interactivity": { 
            "detect_on": "canvas",
            "events": { "onhover": { "enable": false }, "onclick": { "enable": false }, "resize": true }
          },
          "retina_detect": true
        };

        // Chiama la funzione globale della libreria
        if (typeof particlesJS !== 'undefined') {
             particlesJS('particles-js', particlesConfig); // Usa l'ID corretto!
             console.log("particles.js inizializzato.");
        } else {
             console.error("Libreria particlesJS non trovata!");
             if (loadingMessage) loadingMessage.textContent += " (Errore effetti sfondo)";
        }
    }

    // Avvia il caricamento dei dati (che poi avvierà particles.js)
    loadData(); 
});
