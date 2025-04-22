document.addEventListener('DOMContentLoaded', () => {
    // !!! METTI QUI L'URL CORRETTO DELLA TUA DISTRIBUZIONE SCRIPT AGGIORNATA !!!
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec';
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)';

    // Elementi DOM
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader');
    const loaderTextElement = document.getElementById('loading-text-container');
    const loaderBarElement = loader ? loader.querySelector('.loader-bar') : null;
    const footerImageContainer = document.getElementById('footer-image-container');

    async function loadData() {
        if (loadingMessage) loadingMessage.style.display = 'block';

        try {
            console.log("Tentativo fetch API:", apiUrl);
            const response = await fetch(apiUrl);
            console.log("Risposta API Status:", response.status);
            if (!response.ok) { throw new Error(`Errore HTTP: ${response.status}`); }
            const result = await response.json();
            console.log("Dati JSON ricevuti:", result);
            if (!result.success || !result.data) { throw new Error("Formato dati API non valido. Ridistribuire script Google?"); }
            const data = result.data;
            console.log("Elaborazione dati:", data);

            // --- Applica Configurazione Visiva ---

            // *** INIZIO MODIFICA: Applica Immagine di Sfondo (da B7) ***
            if (data.backgroundUrl && typeof data.backgroundUrl === 'string' && data.backgroundUrl.trim() !== '') {
                const bgImageUrl = data.backgroundUrl.trim();
                console.log("Applicando immagine di sfondo:", bgImageUrl);
                // Applica l'URL come immagine di sfondo al body
                document.body.style.backgroundImage = `url('${bgImageUrl}')`;

                // Stili aggiuntivi per una visualizzazione comune dello sfondo
                document.body.style.backgroundSize = 'cover';       // Scala per coprire l'intera area
                document.body.style.backgroundPosition = 'center center'; // Centra l'immagine
                document.body.style.backgroundRepeat = 'no-repeat';   // Non ripetere/tile l'immagine
                document.body.style.backgroundAttachment = 'fixed'; // Opzionale: rende lo sfondo fisso durante lo scroll
            } else {
                console.log("Nessuna immagine di sfondo specificata (B7 vuoto).");
                // Rimuovi eventuali immagini di sfondo precedenti se B7 è vuoto
                document.body.style.backgroundImage = 'none';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundAttachment = '';
            }
            // *** FINE MODIFICA SFONDO ***


            // Titolo
            document.title = data.title || "Link Hub";
            if (titleElement) {
                titleElement.textContent = data.title;
                if (data.titleSize) titleElement.style.fontSize = data.titleSize; else titleElement.style.fontSize = '';
                // if (data.titleFontFamily) titleElement.style.fontFamily = data.titleFontFamily; else titleElement.style.fontFamily = '';
            }

            // Loader
            if (loader) {
                if (data.showLoader !== false) {
                    loader.style.display = 'flex';
                    if (loaderTextElement && data.loaderText) loaderTextElement.textContent = data.loaderText; else if (loaderTextElement) loaderTextElement.textContent = '';
                    if (loaderBarElement && data.loaderBarColor) loaderBarElement.style.background = data.loaderBarColor;
                    if (loaderTextElement && data.loaderTextSize) loaderTextElement.style.fontSize = data.loaderTextSize;
                    if (data.loaderWidth) { loader.style.width = data.loaderWidth; loader.style.maxWidth = 'none'; } else { loader.style.width = ''; loader.style.maxWidth = ''; }
                    if (loaderBarElement && data.loaderBarSpeed && typeof data.loaderBarSpeed === 'number' && data.loaderBarSpeed > 0) { loaderBarElement.style.animationDuration = data.loaderBarSpeed + 's'; } else if (loaderBarElement) { loaderBarElement.style.animationDuration = ''; }
                } else { loader.style.display = 'none'; }
            } else { console.warn("Elemento Loader non trovato."); }

            // *** LOGO - CODICE CORRETTO PER NOMI FILE ***
            logoContainer.innerHTML = ''; // Pulisci prima
            if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
                const logoFilename = data.logoUrl.trim();
                console.log("Cerco logo:", logoFilename);
                const logoImg = document.createElement('img');
                logoImg.src = logoFilename;
                logoImg.alt = 'Logo';
                logoImg.onerror = () => {
                    console.error("Errore caricando logo:", logoFilename);
                    logoContainer.innerHTML = '<p style="font-size: 0.8em; color: #ffcc00;">Logo non trovato</p>';
                };
                logoContainer.appendChild(logoImg);
            } else {
                console.log("Nessun logo specificato (B6 vuoto).");
            }
            // *** FINE CODICE LOGO ***

            // Pulsanti Link
            linkContainer.innerHTML = ''; // Pulisci messaggio caricamento
            if (data.links && data.links.length > 0) {
                data.links.forEach(link => {
                    const button = document.createElement('a');
                    button.href = link.url; button.textContent = link.label; button.className = 'link-button'; button.target = '_top';
                    button.style.background = link.color || defaultButtonColor;
                    if (data.buttonFontSize) button.style.fontSize = data.buttonFontSize; else button.style.fontSize = '';
                    if (data.buttonPadding) button.style.padding = data.buttonPadding; else button.style.padding = '';
                    linkContainer.appendChild(button);
                });
                console.log("Creati", data.links.length, "pulsanti link.");
            } else { linkContainer.innerHTML = '<p>Nessun link attivo.</p>'; }

            // *** IMMAGINE FOOTER - CODICE CORRETTO PER NOMI FILE ***
            if (footerImageContainer) {
                footerImageContainer.innerHTML = '';
                if (data.footerImageUrl && typeof data.footerImageUrl === 'string' && data.footerImageUrl.trim() !== '') {
                    const imageUrl = data.footerImageUrl.trim();
                    const imageAlt = (data.footerImageAlt && typeof data.footerImageAlt === 'string' && data.footerImageAlt.trim() !== '') ? data.footerImageAlt.trim() : 'Immagine Footer';
                    console.log("Cerco immagine footer:", imageUrl, "Alt:", imageAlt);
                    const footerImg = document.createElement('img');
                    footerImg.src = imageUrl;
                    footerImg.alt = imageAlt;
                    footerImg.onerror = () => {
                        console.error("Errore img footer:", imageUrl);
                        footerImageContainer.innerHTML = '<p style="font-size: 0.8em; color: #ffcc00;">Immagine non trovata</p>';
                    };
                    footerImageContainer.appendChild(footerImg);
                } else { console.log("Nessun URL immagine footer specificato (D6 vuoto)."); }
            } else { console.warn("#footer-image-container non trovato."); }
            // *** FINE CODICE FOOTER ***

            // Nascondi Messaggio Testo alla fine
            if (loadingMessage) loadingMessage.style.display = 'none';

        } catch (error) {
             console.error('ERRORE FINALE:', error);
             if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare: ${error.message}</p>`;
             if (titleElement) titleElement.textContent = 'Errore'; document.title = 'Errore';
             if (loadingMessage) loadingMessage.style.display = 'none'; if (loader) loader.style.display = 'none';
             document.body.classList.add('error-page');
        }
    }

    loadData();
});
