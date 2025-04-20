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
        // SOLO la logica della percentuale qui. L'animazione CSS della barra parte da sola.
        // L'apparizione del loader sarà gestita da GSAP.
        if (percText && loader) { 
             let currentPercentage = 0;
             const intervalTime = 30; const increment = 1; 
             const intervalId = setInterval(() => {
                 currentPercentage = (currentPercentage + increment); 
                 if (currentPercentage > 100) { currentPercentage = 0; } 
                 percText.textContent = Math.floor(currentPercentage) + "%"; 
             }, intervalTime);
        } else { console.warn("Loader/Percentuale non trovati."); }
    }

    // --- Funzione Animazioni Ingresso con GSAP ---
    function animateElementsIn() {
        console.log("Avvio animazioni GSAP...");
        // Controlla se gsap è caricato
        if (typeof gsap === 'undefined') {
            console.error("GSAP non caricato!");
            // Rendi elementi visibili senza animazione come fallback
             if (logoContainer) logoContainer.style.opacity = 1;
             if (titleElement) titleElement.style.opacity = 1;
             if (loader) loader.style.opacity = 1;
             document.querySelectorAll('.link-button').forEach(btn => btn.style.opacity = 1);
             // Riattiva animazione flicker CSS
             if (titleElement) titleElement.style.animation = 'flicker-intense 1.2s linear infinite';
            return;
        }

        // Imposta stato iniziale (invisibile e leggermente spostato in basso)
        // Lo facciamo qui invece che solo nel CSS per sicurezza
        gsap.set([logoContainer, titleElement, loader, ".link-button"], { opacity: 0, y: 20 }); 

        const tl = gsap.timeline({ 
             defaults: { duration: 0.6, ease: "power2.out" },
             onComplete: () => {
                 // Riattiva l'animazione flicker CSS DOPO l'ingresso del titolo
                 if (titleElement) {
                     titleElement.style.animation = 'flicker-intense 1.2s linear infinite';
                 }
                 console.log("Animazioni GSAP completate.");
             } 
        });

        tl.to(logoContainer, { opacity: 1, y: 0, delay: 0.1 }) // Logo appare per primo
          .to(titleElement, { opacity: 1, y: 0 }, "-=0.4")    // Titolo subito dopo
          .to(loader, { opacity: 1, y: 0 }, "-=0.4")        // Loader
          .to(".link-button", { opacity: 1, y: 0, stagger: 0.1 }, "-=0.3"); // Pulsanti in sequenza
    }


    // --- Funzione Caricamento Dati ---
    async function loadData() {
        // Avvia solo la percentuale, l'apparizione del loader è gestita da GSAP
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
                    logoImg.onerror = () => { /* Gestione errore */ };
                    logoContainer.appendChild(logoImg); 
                    // Non impostiamo margini qui, lasciamo fare al CSS
                } else {
                    // Se non c'è logo, potremmo voler aggiungere un margine sopra il titolo
                    if (titleElement) titleElement.style.marginTop = '1.5em'; 
                }
                
                // Pulsanti Link
                linkContainer.innerHTML = ''; 
                if (data.links && data.links.length > 0) {
                    data.links.forEach(link => {
                        const button = document.createElement('a');
                        button.href = link.url; button.textContent = link.label; 
                        button.className = 'link-button'; button.target = '_top';
                        button.style.background = link.color || defaultButtonColor; 
                        // Imposta opacità iniziale a 0 per GSAP stagger
                        button.style.opacity = 0; 
                        linkContainer.appendChild(button); 
                    });
                } else {
                    linkContainer.innerHTML = '<p>Nessun link attivo.</p>';
                }
                
                if (loadingMessage) loadingMessage.style.display = 'none';

                // *** CHIAMA L'ANIMAZIONE GSAP DOPO AVER CREATO GLI ELEMENTI ***
                animateElementsIn(); 

            } else {
                throw new Error(result.error || 'Errore API.');
            }

        } catch (error) {
            console.error('Errore caricamento dati:', error);
            // ... gestione errore ...
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (loader) loader.style.display = 'none'; 
            document.body.classList.add('error-page'); 
        }
    }
    
    // --- Esecuzione Iniziale ---
    // NON avviare l'animazione loader CSS subito, lo fa GSAP
    loadData(); 
});
