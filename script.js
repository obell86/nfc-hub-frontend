document.addEventListener('DOMContentLoaded', () => {
    // API URL
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec'; 
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)'; // Fallback colore pulsante

    // Elementi DOM
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader'); 
    const percText = document.getElementById('percentage-text'); 

    // --- Funzione Loader Percentuale ---
    function startLoaderAnimation() {
        // L'animazione CSS della barra parte da sola. Questo gestisce solo la %
        if (percText && loader) {
             loader.style.display = 'block'; // Assicurati sia visibile
             let currentPercentage = 0;
             const intervalTime = 30; const increment = 1; 
             const intervalId = setInterval(() => {
                 currentPercentage = (currentPercentage + increment); 
                 if (currentPercentage > 100) { currentPercentage = 0; } 
                 percText.textContent = Math.floor(currentPercentage) + "%"; 
             }, intervalTime);
        } else { console.warn("Loader/Percentuale non trovati."); }
    }

    // --- Rimosso: Funzione Animazioni Ingresso con GSAP ---
    // function animateElementsIn() { ... } 
    // Le animazioni ora sono gestite principalmente dal CSS (flicker, logo-float, pulse su hover)

    // --- Funzione Caricamento Dati ---
    async function loadData() {
        startLoaderAnimation(); // Avvia percentuale loader
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

                // Titolo (viene popolato, l'animazione flicker è nel CSS)
                document.title = data.title || 'Magnolia 808 Hub';
                if (titleElement) titleElement.textContent = data.title || 'MAGNOLIA 808';

                // Logo (viene popolato, l'animazione float è nel CSS)
                logoContainer.innerHTML = ''; 
                if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
                    const logoFilename = data.logoUrl.trim(); 
                    console.log("Cerco logo:", logoFilename); 
                    const logoImg = document.createElement('img');
                    logoImg.src = logoFilename; 
                    logoImg.alt = 'Logo'; 
                    logoImg.onerror = () => { console.error("Errore caricando logo:", logoFilename); logoContainer.innerHTML = '<p style="font-size: 0.8em; color: #ffcc00;">Logo non trovato</p>'; };
                    logoContainer.appendChild(logoImg); 
                    // if (titleElement) titleElement.style.marginTop = '0.5em'; // Margine gestito da CSS
                } else { 
                     // if (titleElement) titleElement.style.marginTop = '0'; 
                     console.log("Nessun logo specificato.");
                }
                
                // Pulsanti Link (vengono popolati, l'animazione pulse è su hover nel CSS)
                linkContainer.innerHTML = ''; 
                if (data.links && data.links.length > 0) {
                    data.links.forEach(link => {
                        const button = document.createElement('a');
                        button.href = link.url; button.textContent = link.label; 
                        button.className = 'link-button'; button.target = '_top';
                        
                        // Applica background color letto dal foglio o default
                        button.style.background = link.color || defaultButtonColor; 
                        
                        linkContainer.appendChild(button); 
                    });
                } else { linkContainer.innerHTML = '<p>Nessun link attivo.</p>'; }
                
                if (loadingMessage) loadingMessage.style.display = 'none';

                // *** RIMOSSA CHIAMATA a animateElementsIn() ***

            } else { throw new Error(result.error || 'Errore API.'); }
        } catch (error) {
            console.error('Errore caricamento dati:', error);
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (loader) loader.style.display = 'none'; 
            document.body.classList.add('error-page'); 
            // Se errore, assicurati che gli elementi base siano visibili
             if (logoContainer) logoContainer.style.opacity = 1;
             if (titleElement) titleElement.style.opacity = 1;
             if (loader) loader.style.opacity = 1;
             document.querySelectorAll('.link-button').forEach(btn => btn.style.opacity = 1);
        }
    }
    
    // --- Inizializzazione particles.js (COMMENTATA - Non usata in questa versione) ---
    /*
    function initParticlesJS() {
        const particlesConfig = { ... };
        if (typeof particlesJS !== 'undefined') { particlesJS('particles-js', particlesConfig); } 
        else { console.error("particlesJS non caricato!"); }
    }
    */
    
    // Avvia tutto
    loadData(); 
    // initParticlesJS(); // Non chiamare
});
