document.addEventListener('DOMContentLoaded', () => {
    // !!! INCOLLA QUI L'URL /exec DELLA TUA API GOOGLE APPS SCRIPT !!!
    const apiUrl = 'YOUR_APPS_SCRIPT_API_URL_HERE'; 
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)'; // Fallback

    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader'); // ID del loader
    const percText = document.getElementById('percentage-text'); // ID del testo percentuale

    // --- Funzione per aggiornare la percentuale (se loader esiste) ---
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
            // Nota: Questo intervallo continua all'infinito. 
            // In un'app reale potresti fermarlo dopo il caricamento.
        }
         if (loader) {
            loader.style.display = 'block'; // Mostra il loader
        }
    }

    // --- Funzione per caricare e mostrare i dati ---
    async function loadData() {
        startLoaderAnimation(); // Avvia animazione loader e percentuale
        if (loadingMessage) loadingMessage.style.display = 'block'; // Mostra messaggio caricamento

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            const result = await response.json();

            if (result.success && result.data) {
                const data = result.data;

                // 1. Imposta Titolo Pagina e Titolo H1
                document.title = data.title || 'Magnolia 808 Hub';
                if (titleElement) titleElement.textContent = data.title || 'MAGNOLIA 808';
                 // Se vuoi l'effetto flicker sul titolo H1, assicurati che la classe/stile CSS lo applichi

                // 2. Mostra Logo (se URL presente) -> QUI FUNZIONERA'!
                logoContainer.innerHTML = ''; // Pulisci precedente
                if (data.logoUrl) {
                    const logoImg = document.createElement('img');
                    logoImg.src = data.logoUrl;
                    logoImg.alt = 'Logo'; 
                    // Lo stile verrà applicato dal CSS tramite #logo-container img
                    logoContainer.appendChild(logoImg);
                }
                 // Ajusta margine H1 se c'è il logo
                 if (titleElement && data.logoUrl) titleElement.style.marginTop = '0.5em';
                 else if (titleElement) titleElement.style.marginTop = '0';


                // 3. Imposta Sfondo (se URL presente) -> QUI FUNZIONERA'!
                 if (data.backgroundUrl) {
                    // Combina immagine e gradiente (come nel CSS precedente)
                    document.body.style.backgroundImage = `url("${data.backgroundUrl}"), linear-gradient(135deg, #1a001a, #001a1a, #1a001a)`;
                    document.body.style.backgroundBlendMode = 'overlay'; // O altro blend mode
                    document.body.style.backgroundSize = 'cover, 200% 200%';
                    document.body.style.backgroundPosition = 'center center, 0% 50%';
                    document.body.style.backgroundRepeat = 'no-repeat, repeat';
                } else {
                     // Solo gradiente se non c'è URL sfondo
                    document.body.style.backgroundImage = `linear-gradient(135deg, #1a001a, #001a1a, #1a001a)`;
                    document.body.style.backgroundSize = '200% 200%';
                    document.body.style.backgroundPosition = '0% 50%';
                 }
                 // Riapplica animazione gradiente che potrebbe essere sovrascritta da style.backgroundImage
                 document.body.style.animation = 'animated-gradient 15s ease infinite';


                // 4. Crea Pulsanti Link Attivi
                linkContainer.innerHTML = ''; // Pulisci messaggio "Caricamento..." o vecchi pulsanti
                if (data.links && data.links.length > 0) {
                    data.links.forEach(link => {
                        const button = document.createElement('a');
                        button.href = link.url;
                        button.textContent = link.label;
                        button.className = 'link-button'; // Applica classe CSS
                        button.target = '_top';
                        
                        // Applica colore specifico o gradiente di default
                        button.style.background = link.color || defaultButtonColor; 
                        
                        linkContainer.appendChild(button);
                    });
                } else {
                    linkContainer.innerHTML = '<p>Nessun link attivo al momento.</p>';
                }
                
                // Nascondi messaggio caricamento e loader se tutto ok
                if (loadingMessage) loadingMessage.style.display = 'none';
                // Potresti nascondere il loader qui o lasciarlo in loop:
                // if (loader) loader.style.display = 'none'; 

            } else {
                // Errore restituito dall'API Script
                throw new Error(result.error || 'Errore sconosciuto dallo script API.');
            }

        } catch (error) {
            console.error('Errore nel caricamento dati:', error);
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Errore nel caricamento dei link: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            // Nascondi loader e messaggio in caso di errore
            if (loadingMessage) loadingMessage.style.display = 'none';
             if (loader) loader.style.display = 'none'; 
        }
    }

    // Carica i dati quando la pagina è pronta
    loadData(); 
});