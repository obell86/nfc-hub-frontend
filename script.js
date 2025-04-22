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
    const footerImageContainer = document.getElementById('footer-image-container'); // Contenitore Immagine Footer

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
            document.title = data.title || "Link Hub";
            if (titleElement) {
                titleElement.textContent = data.title;
                if (data.titleSize) titleElement.style.fontSize = data.titleSize; else titleElement.style.fontSize = '';
                // if (data.titleFontFamily) titleElement.style.fontFamily = data.titleFontFamily; else titleElement.style.fontFamily = ''; // Se usi font dedicato
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

            // Logo
            logoContainer.innerHTML = '';
            if (data.logoUrl) { /* ... crea immagine logo ... */ } else { console.log("Nessun logo."); }

            // Pulsanti Link
            linkContainer.innerHTML = '';
            if (data.links && data.links.length > 0) {
                data.links.forEach(link => { /* ... crea pulsanti ... */
                    const button = document.createElement('a'); /*...*/ button.href = link.url; button.textContent = link.label; button.className = 'link-button'; button.target = '_top'; button.style.background = link.color || defaultButtonColor;
                    if (data.buttonFontSize) button.style.fontSize = data.buttonFontSize; else button.style.fontSize = '';
                    if (data.buttonPadding) button.style.padding = data.buttonPadding; else button.style.padding = '';
                    linkContainer.appendChild(button); });
                console.log("Creati", data.links.length, "link.");
            } else { linkContainer.innerHTML = '<p>Nessun link attivo.</p>'; }

            // Immagine Footer (con Alt da D5, URL da D6)
            if (footerImageContainer) {
                footerImageContainer.innerHTML = '';
                if (data.footerImageUrl) { // Controlla solo l'URL
                    const imageUrl = data.footerImageUrl;
                    const imageAlt = data.footerImageAlt || 'Immagine Footer'; // Usa D5 o default
                    console.log("Cerco immagine footer:", imageUrl, "Alt:", imageAlt);
                    const footerImg = document.createElement('img');
                    footerImg.src = imageUrl; footerImg.alt = imageAlt;
                    footerImg.onerror = () => { console.error("Errore img footer:", imageUrl); footerImageContainer.innerHTML = '<p>Immagine non trovata</p>'; };
                    footerImageContainer.appendChild(footerImg);
                } else { console.log("Nessun URL immagine footer."); }
            } else { console.warn("#footer-image-container non trovato."); }

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
