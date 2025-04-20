document.addEventListener('DOMContentLoaded', () => {
    // !!! URL /exec DELLA TUA API GOOGLE APPS SCRIPT !!!
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec'; 
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)'; // Fallback colore pulsante

    // Elementi della pagina da manipolare
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader'); 
    const percText = document.getElementById('percentage-text'); 

    // --- Funzione per avviare l'animazione del loader e della percentuale ---
    function startLoaderAnimation() {
        if (percText) {
            let currentPercentage = 0;
            const intervalTime = 30; 
            const increment = 1; 
            const intervalId = setInterval(() => {
                currentPercentage = (currentPercentage + increment); 
                if (currentPercentage > 100) { 
                    currentPercentage = 0; // Loop
                } 
                percText.textContent = Math.floor(currentPercentage) + "%"; 
            }, intervalTime);
        }
        if (loader) {
            loader.style.display = 'block'; 
        }
    }

    // --- Funzione asincrona per caricare i dati dall'API e popolare la pagina ---
    async function loadData() {
        startLoaderAnimation(); 
        if (loadingMessage) loadingMessage.style.display = 'block'; 

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();

            if (result.success && result.data) {
                const data = result.data;

                // 1. Imposta Titolo Pagina e Titolo H1
                document.title = data.title || 'Magnolia 808 Hub';
                if (titleElement) titleElement.textContent = data.title || 'MAGNOLIA 808';

                // --- 2. Mostra Logo (se FILENAME presente in B6) ---
                logoContainer.innerHTML = ''; 
                if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
                    const logoFilename = data.logoUrl.trim(); 
                    console.log("Trovato filename logo nel foglio:", logoFilename); 

                    const logoImg = document.createElement('img');
                    logoImg.src = logoFilename; // Usa filename come URL relativo
                    logoImg.alt = 'Logo'; 

                    logoImg.onerror = function() {
                        console.error("Errore caricando l'immagine:", logoFilename, "- Controlla che il file esista nel repository GitHub e il nome sia corretto.");
                        logoContainer.innerHTML = '<p style="font-size: 0.8em; color: #ffcc00;">Logo non trovato ('+logoFilename+')</p>'; 
                    };
                    
                    logoContainer.appendChild(logoImg); 
                    if (titleElement) titleElement.style.marginTop = '0.5em'; 
                } else {
                    if (titleElement) titleElement.style.marginTop = '0'; 
                    console.log("Nessun filename logo specificato nella cella B6.");
                }
                
                // 3. Imposta Sfondo (Rimosso riferimento a data.backgroundUrl - ora è solo CSS)
                // Assicura che animazione gradiente CSS sia attiva
                document.body.style.animation = 'animated-gradient-overlay 10s ease infinite'; 

                // 4. Crea i Pulsanti per i link attivi ricevuti
                linkContainer.innerHTML = ''; 
                if (data.links && data.links.length > 0) {
                    data.links.forEach(link => {
                        const button = document.createElement('a');
                        button.href = link.url; 
                        button.textContent = link.label; 
                        button.className = 'link-button'; 
                        button.target = '_top';
                        
                        button.style.background = link.color || defaultButtonColor; 
                        
                        linkContainer.appendChild(button); 
                    });
                } else {
                    linkContainer.innerHTML = '<p>Nessun link attivo al momento.</p>';
                }
                
                if (loadingMessage) loadingMessage.style.display = 'none';
                // if (loader) loader.style.display = 'none'; // Lascia il loader in loop

            } else {
                throw new Error(result.error || 'Errore sconosciuto ricevuto dallo script API.');
            }

        } catch (error) {
            console.error('Errore nel caricamento o processamento dati:', error);
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare i dati: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (loader) loader.style.display = 'none'; 
            document.body.classList.add('error-page'); 
        }
    }

    // Avvia il caricamento dei dati
    loadData(); 
});
