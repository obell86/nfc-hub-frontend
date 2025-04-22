document.addEventListener('DOMContentLoaded', () => {
    // !!! METTI QUI L'URL CORRETTO DELLA TUA DISTRIBUZIONE SCRIPT AGGIORNATA !!!
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec';
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)';

    // Elementi DOM
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader'); // Contenitore
    const loaderTextElement = document.getElementById('loading-text-container');
    const loaderBarElement = loader ? loader.querySelector('.loader-bar') : null; // Barra

    async function loadData() {
        if (loadingMessage) loadingMessage.style.display = 'block';

        try {
            console.log("Tentativo fetch API:", apiUrl);
            const response = await fetch(apiUrl);
            console.log("Risposta API Status:", response.status);

            if (!response.ok) { /* ... gestione errore ... */ throw new Error(`Errore HTTP: ${response.status}`); }
            const result = await response.json();
            console.log("Dati JSON ricevuti:", result);

            if (!result.success || !result.data) { /* ... gestione errore API ... */ throw new Error("Formato dati API non valido. Ridistribuire script Google?"); }

            const data = result.data;
            console.log("Elaborazione dati:", data);

            // --- Applica Configurazione Visiva ---

            // Titolo (Testo, Dimensione) - Basato su script v1.1 fornito
            document.title = data.title || "Caricamento..."; // Usa titolo o fallback
            if (titleElement) {
                titleElement.textContent = data.title;
                if (data.titleSize) {
                    titleElement.style.fontSize = data.titleSize;
                    console.log("Applicata dimensione titolo:", data.titleSize);
                } else {
                     titleElement.style.fontSize = '';
                     console.log("Dimensione titolo non specificata.");
                }
                // Aggiungi qui la logica per data.titleFontFamily se usi quella versione dello script
            }

            // Loader (Visibilità, Testo, Colore, Dim Txt, LARGHEZZA CONTENITORE, VELOCITÀ BARRA)
            if (loader) {
                if (data.showLoader !== false) { // Mostra se checkbox spuntata (o non presente)
                    loader.style.display = 'flex';
                    console.log("Loader mostrato da configurazione.");

                    // Applica testo, colore barra, dimensione testo
                    if (loaderTextElement && data.loaderText) loaderTextElement.textContent = data.loaderText; else if (loaderTextElement) loaderTextElement.textContent = '';
                    if (loaderBarElement && data.loaderBarColor) loaderBarElement.style.background = data.loaderBarColor;
                    if (loaderTextElement && data.loaderTextSize) loaderTextElement.style.fontSize = data.loaderTextSize;

                    // Applica Larghezza Contenitore (da D11)
                    if (data.loaderWidth) {
                        loader.style.width = data.loaderWidth;
                        loader.style.maxWidth = 'none'; // Sovrascrive CSS max-width
                        console.log("Applicata larghezza loader:", data.loaderWidth);
                    } else {
                        loader.style.width = ''; // Reset
                        loader.style.maxWidth = ''; // Reset
                    }

                    // Applica Velocità Animazione Barra (da E11)
                    if (loaderBarElement && data.loaderBarSpeed && typeof data.loaderBarSpeed === 'number' && data.loaderBarSpeed > 0) {
                        loaderBarElement.style.animationDuration = data.loaderBarSpeed + 's';
                        console.log("Applicata velocità barra loader:", data.loaderBarSpeed + 's');
                    } else if (loaderBarElement) {
                        loaderBarElement.style.animationDuration = ''; // Reset a CSS
                        console.log("Velocità barra loader non specificata o non valida, usato CSS default.");
                    }

                } else { // Se showLoader è false
                    loader.style.display = 'none';
                    console.log("Loader nascosto da configurazione (showLoader: false).");
                }
            } else { console.warn("Elemento Loader non trovato."); }

            // Logo (Basato su script v1.1 fornito)
            logoContainer.innerHTML = '';
            if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
                 const logoFilename = data.logoUrl.trim();
                 const logoImg = document.createElement('img');
                 logoImg.src = logoFilename; logoImg.alt = 'Logo';
                 logoImg.onerror = () => { console.error("Errore logo:", logoFilename); logoContainer.innerHTML = '<p>Logo non trovato</p>'; };
                 logoContainer.appendChild(logoImg);
            } else { console.log("Nessun logo specificato."); }

            // Pulsanti Link (Basato su script v1.1 fornito - B13, B14)
            linkContainer.innerHTML = '';
            if (data.links && data.links.length > 0) {
                 data.links.forEach(link => {
                    const button = document.createElement('a');
                    button.href = link.url; button.textContent = link.label; button.className = 'link-button'; button.target = '_top';
                    button.style.background = link.color || defaultButtonColor;
                    // Applica stile pulsanti da B13, B14
                    if (data.buttonFontSize) button.style.fontSize = data.buttonFontSize; else button.style.fontSize = '';
                    if (data.buttonPadding) button.style.padding = data.buttonPadding; else button.style.padding = '';
                    linkContainer.appendChild(button);
                });
                console.log("Creati", data.links.length, "pulsanti link.");
            } else { linkContainer.innerHTML = '<p>Nessun link attivo.</p>'; }

            // Nascondi Messaggio Testo alla fine
            if (loadingMessage) loadingMessage.style.display = 'none';

            // Il loader rimane visibile o nascosto secondo data.showLoader, non viene più nascosto automaticamente qui

        } catch (error) {
             console.error('ERRORE FINALE nel caricamento dati:', error);
             if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare: ${error.message}</p>`;
             if (titleElement) titleElement.textContent = 'Errore'; document.title = 'Errore';
             if (loadingMessage) loadingMessage.style.display = 'none';
             if (loader) loader.style.display = 'none'; // Nascondi loader in caso di errore
             document.body.classList.add('error-page');
        }
    }

    loadData();
});
