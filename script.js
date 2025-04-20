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
        if (percText && loader) {
             // Non mostrare subito il loader, lo fa GSAP
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
        if (typeof gsap === 'undefined') {
            console.error("GSAP non caricato!");
             // Fallback senza animazione
             gsap.set([logoContainer, titleElement, loader, ".link-button"], { opacity: 1, y: 0 });
             if (titleElement) titleElement.style.animation = 'flicker-intense 1.2s linear infinite';
            return;
        }

        // Imposta stato iniziale (nascosto e spostato)
        gsap.set([logoContainer, titleElement, loader, ".link-button"], { opacity: 0, y: 20 }); 

        const tl = gsap.timeline({ 
             defaults: { duration: 0.6, ease: "power2.out" },
             onComplete: () => {
                 // Riattiva animazione flicker CSS DOPO l'ingresso
                 if (titleElement) titleElement.style.animation = 'flicker-intense 1.2s linear infinite';
                 console.log("Animazioni GSAP completate.");
             } 
        });

        tl.to(logoContainer, { opacity: 1, y: 0, delay: 0.1 }) 
          .to(titleElement, { opacity: 1, y: 0 }, "-=0.4")    
          .to(loader, { opacity: 1, y: 0 }, "-=0.4") // Fa apparire il loader        
          .to(".link-button", { opacity: 1, y: 0, stagger: 0.15 }, "-=0.3"); // Pulsanti in sequenza
    }


    // --- Funzione Caricamento Dati ---
    async function loadData() {
        startLoaderAnimation(); // Avvia solo percentuale subito
        if (loadingMessage) loadingMessage.style.display = 'block'; 

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) { throw new Error(`Errore HTTP: ${response.status}`); }
            const result = await response.json();

            if (result.success && result.data) {
                const data = result.data;

                document.title = data.title || 'Magnolia 808 Hub';
                if (titleElement) titleElement.textContent = data.title || 'MAGNOLIA 808';

                logoContainer.innerHTML = ''; 
                if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
                    const logoFilename = data.logoUrl.trim(); 
                    const logoImg = document.createElement('img');
                    logoImg.src = logoFilename; logoImg.alt = 'Logo'; 
                    logoImg.onerror = () => { console.error("Errore caricando logo:", logoFilename); logoContainer.innerHTML = '<p style="font-size: 0.8em; color: #ffcc00;">Logo non trovato</p>'; };
                    logoContainer.appendChild(logoImg); 
                    // if (titleElement) titleElement.style.marginTop = '0.5em'; // Margine gestito da CSS se logo c'è
                } else { 
                     if (titleElement) titleElement.style.marginTop = '0'; // Nessun margine extra
                     console.log("Nessun logo specificato.");
                }
                
                linkContainer.innerHTML = ''; 
                if (data.links && data.links.length > 0) {
                    data.links.forEach(link => {
                        const button = document.createElement('a');
                        button.href = link.url; button.textContent = link.label; 
                        button.className = 'link-button'; button.target = '_top';
                        
                        // Applica background color letto dal foglio o default
                        button.style.background = link.color || defaultButtonColor; 
                        
                        // Imposta opacità iniziale per GSAP stagger
                        // GSAP la gestirà, non serve metterla a 0 qui se usiamo gsap.set sopra
                        // button.style.opacity = 0; 
                        linkContainer.appendChild(button); 
                    });
                } else { linkContainer.innerHTML = '<p>Nessun link attivo.</p>'; }
                
                if (loadingMessage) loadingMessage.style.display = 'none';

                // Avvia animazioni GSAP dopo aver creato gli elementi
                animateElementsIn(); 

            } else { throw new Error(result.error || 'Errore API.'); }
        } catch (error) {
            console.error('Errore caricamento dati:', error);
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (loader) loader.style.display = 'none'; 
            document.body.classList.add('error-page'); 
             // Se c'è errore, mostra subito gli elementi senza animazione per fallback
             gsap.set([logoContainer, titleElement, loader, ".link-button"], { opacity: 1, y: 0 });
             if (titleElement) titleElement.style.animation = 'flicker-intense 1.2s linear infinite'; // Prova a riattivare flicker anche su errore
        }
    }
    
    // Avvia tutto
    loadData(); 
});
