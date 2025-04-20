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

                // Logo 
                logoContainer.innerHTML = ''; 
                if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
                    const logoFilename = data.logoUrl.trim(); 
                    const logoImg = document.createElement('img');
                    logoImg.src = logoFilename; 
                    logoImg.alt = 'Logo'; 
                    logoImg.onerror = () => { console.error("Errore caricando logo:", logoFilename); logoContainer.innerHTML = '<p style="font-size: 0.8em; color: #ffcc00;">Logo non trovato</p>'; };
                    logoContainer.appendChild(logoImg); 
                    if (titleElement) titleElement.style.marginTop = '0.5em'; 
                } else {
                     if (titleElement) titleElement.style.marginTop = '0'; 
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

    // --- Inizializzazione particles.js (TEMPORANEAMENTE COMMENTATA) ---
    /* 
    const particlesConfig = {
      // ... (tutta la configurazione JSON di particles.js che avevamo prima) ...
      "particles": { 
         // ...
         "shape": {
             "type": "image",
             "image": {
                 "src": ["lips.png", "lollipop.png", "eye.png", "star-pop.png", "lightning.png"], // NOMI FILE
                 "width": 100,
                 "height": 100
             }
             // ...
         }
         // ...
      }
      // ...
    };

    if (typeof particlesJS !== 'undefined') {
         particlesJS('particles-js', particlesConfig);
         console.log("particles.js inizializzato.");
    } else {
         console.error("La libreria particlesJS non è stata caricata!");
         // Potresti mostrare un messaggio di fallback o non fare nulla
    }
    */

    // Avvia solo il caricamento dei dati per ora
    loadData(); 
    // Non chiamiamo initParticles() qui per il test
});
