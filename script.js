document.addEventListener('DOMContentLoaded', () => {
    // API URL
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec'; 
    // Colore Neon di Default per Bordo/Glow Pulsanti (se non specificato nel foglio)
    const defaultButtonNeonColor = '#00ffff'; // Ciano di default

    // Elementi DOM
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader'); 
    // const percText = document.getElementById('percentage-text'); // Non più usato

    // --- Rimosso startLoaderAnimation ---

    // --- Funzione Animazioni Ingresso con GSAP ---
    function animateElementsIn() {
        console.log("Avvio animazioni GSAP...");
        if (typeof gsap === 'undefined') {
            console.error("GSAP non caricato!");
             if (logoContainer) logoContainer.style.opacity = 1;
             if (titleElement) titleElement.style.opacity = 1;
             if (loader) loader.style.opacity = 1;
             document.querySelectorAll('.link-button').forEach(btn => btn.style.opacity = 1);
             if (titleElement) titleElement.style.animation = 'flicker-intense 1.2s linear infinite';
            return;
        }

        // Imposta stato iniziale 
        gsap.set([logoContainer, titleElement, loader, ".link-button"], { opacity: 0, y: 20 }); 
        // Imposta stato iniziale per il testo del loader
        gsap.set("#loading-text-container", { opacity: 0 });

        const tl = gsap.timeline({ 
             defaults: { duration: 0.6, ease: "power2.out" },
             onComplete: () => {
                 if (titleElement) titleElement.style.animation = 'flicker-intense 1.2s linear infinite';
                 // Avvia animazione testo loader CSS DOPO l'ingresso base
                 document.getElementById('loading-text-container')?.style.animation = 'loading-text-reveal 5s linear infinite';
                 console.log("Animazioni GSAP completate.");
             } 
        });

        tl.to(logoContainer, { opacity: 1, y: 0, delay: 0.1 }) 
          .to(titleElement, { opacity: 1, y: 0 }, "-=0.4")    
          .to(loader, { opacity: 1, y: 0 }, "-=0.4") // Fa apparire il contenitore loader (il testo si anima via CSS)
          .to(".link-button", { opacity: 1, y: 0, stagger: 0.1 }, "-=0.3"); 
    }

    // --- Funzione Caricamento Dati ---
    async function loadData() {
        // startLoaderAnimation(); // Rimosso
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
                    logoImg.onerror = () => { /*...*/ };
                    logoContainer.appendChild(logoImg); 
                    if (titleElement) titleElement.style.marginTop = '0.5em'; 
                } else { if (titleElement) titleElement.style.marginTop = '0'; }
                
                linkContainer.innerHTML = ''; 
                if (data.links && data.links.length > 0) {
                    data.links.forEach(link => {
                        const button = document.createElement('a');
                        button.href = link.url; button.textContent = link.label; 
                        button.className = 'link-button'; button.target = '_top';
                        
                        // Imposta il COLORE NEON letto dal foglio (o default) come variabile CSS
                        const neonColor = (link.color && typeof link.color === 'string' && link.color.trim() !== "") 
                                           ? link.color.trim() 
                                           : defaultButtonNeonColor; // Usa default ciano
                        
                        // Applica la variabile CSS allo stile inline del pulsante
                        button.style.setProperty('--button-neon-color', neonColor);
                        // Lo sfondo è definito nel CSS generale, non qui

                        // Definisce le ombre glow usando la variabile (per animazione pulse)
                        // Nota: questo sovrascrive l'ombra base definita nel CSS, 
                        // potremmo doverla ridefinire qui o nel CSS usare le variabili
                        button.style.setProperty('--button-glow-shadow-start', `0 0 8px ${neonColor}, inset 0 0 3px 1px rgba(0,0,0,0.5)`);
                        button.style.setProperty('--button-glow-shadow-end', `0 0 15px ${neonColor}, 0 0 25px ${neonColor}, inset 0 0 4px 1px rgba(0,0,0,0.4)`);

                        button.style.opacity = 0; // Per animazione GSAP
                        linkContainer.appendChild(button); 
                    });
                } else { linkContainer.innerHTML = '<p>Nessun link attivo.</p>'; }
                
                if (loadingMessage) loadingMessage.style.display = 'none';
                animateElementsIn(); // Avvia animazioni dopo aver creato gli elementi

            } else { throw new Error(result.error || 'Errore API.'); }
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
    
    // Avvia tutto
    loadData(); 
});
