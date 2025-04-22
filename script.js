document.addEventListener('DOMContentLoaded', () => {
    // URL API (Assicurati sia quello giusto e che la distribuzione sia aggiornata!)
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec';
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)';

    // Elementi DOM
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message'); // Messaggio testuale "Caricamento link..."
    const loader = document.getElementById('loader'); // Contenitore grafico del loader
    const loaderTextElement = document.getElementById('loading-text-container');
    const loaderBarElement = loader ? loader.querySelector('.loader-bar') : null;

    async function loadData() {
        // NON mostrare il loader grafico qui subito
        if (loadingMessage) loadingMessage.style.display = 'block'; // Mostra solo il messaggio testo

        try {
            console.log("Tentativo fetch API:", apiUrl);
            const response = await fetch(apiUrl);
            console.log("Risposta API Status:", response.status);

            if (!response.ok) {
                let errorText = 'Errore Sconosciuto';
                try { errorText = await response.text(); } catch (e) {}
                throw new Error(`Errore HTTP: ${response.status}. Dettagli: ${errorText}`);
            }
            const result = await response.json();
            console.log("Dati JSON ricevuti:", result);

            if (!result.success || !result.data) {
                 if (result.error) { throw new Error(result.error); }
                 console.error("ERRORE: Risposta API non valida. Script Google non distribuito correttamente?");
                 throw new Error("Formato dati API non valido. Aggiorna la distribuzione dello script Google.");
            }

            const data = result.data;
            console.log("Elaborazione dati:", data);

            // --- Applica Configurazione Visiva ---

            // Titolo (Testo e Dimensione) - Assumendo che l'Apps Script sia corretto ora
            document.title = data.title;
            if (titleElement) {
                titleElement.textContent = data.title;
                if (data.titleSize) {
                    titleElement.style.fontSize = data.titleSize;
                    console.log("Applicata dimensione titolo:", data.titleSize);
                } else {
                     titleElement.style.fontSize = '';
                     console.log("Dimensione titolo non specificata.");
                }
            }

            // Loader (Visibilità, Testo, Colore Barra, Dimensione Testo)
            if (loader) {
                // *** MODIFICA CHIAVE: Mostra il loader SOLO ORA, se richiesto ***
                if (data.showLoader !== false) {
                    loader.style.display = 'flex'; // Mostra il loader grafico
                    console.log("Loader mostrato da configurazione.");

                    // Applica personalizzazioni ORA che è visibile
                    if (loaderTextElement && data.loaderText) {
                        loaderTextElement.textContent = data.loaderText;
                        console.log("Applicato testo loader:", data.loaderText);
                    } else if (loaderTextElement) {
                        loaderTextElement.textContent = ''; // Assicura sia vuoto se non specificato
                    }
                    if (loaderBarElement && data.loaderBarColor) {
                        loaderBarElement.style.background = data.loaderBarColor;
                        console.log("Applicato colore barra loader:", data.loaderBarColor);
                    }
                    if (loaderTextElement && data.loaderTextSize) {
                        loaderTextElement.style.fontSize = data.loaderTextSize;
                        console.log("Applicata dimensione testo loader:", data.loaderTextSize);
                    }
                } else {
                    loader.style.display = 'none'; // Assicurati sia nascosto se showLoader è false
                    console.log("Loader nascosto da configurazione (showLoader: false).");
                }
            } else {
                 console.warn("Elemento Loader non trovato nel DOM.");
            }

            // Logo
            logoContainer.innerHTML = '';
            if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
                // ... (codice logo invariato) ...
                 const logoFilename = data.logoUrl.trim();
                 console.log("Cerco logo:", logoFilename);
                 const logoImg = document.createElement('img');
                 logoImg.src = logoFilename;
                 logoImg.alt = 'Logo';
                 logoImg.onerror = () => { console.error("Errore caricando logo:", logoFilename); logoContainer.innerHTML = '<p style="font-size: 0.8em; color: #ffcc00;">Logo non trovato</p>'; };
                 logoContainer.appendChild(logoImg);
            } else {
                console.log("Nessun logo specificato.");
            }

            // Pulsanti Link
            linkContainer.innerHTML = '';
            if (data.links && data.links.length > 0) {
                // ... (codice creazione pulsanti invariato) ...
                 data.links.forEach(link => {
                    const button = document.createElement('a');
                    button.href = link.url;
                    button.textContent = link.label;
                    button.className = 'link-button';
                    button.target = '_top';
                    button.style.background = link.color || defaultButtonColor;
                    if (data.buttonFontSize) button.style.fontSize = data.buttonFontSize;
                    else button.style.fontSize = '';
                    if (data.buttonPadding) button.style.padding = data.buttonPadding;
                    else button.style.padding = '';
                    linkContainer.appendChild(button);
                });
                console.log("Creati", data.links.length, "pulsanti link.");
            } else {
                linkContainer.innerHTML = '<p>Nessun link attivo.</p>';
                console.log("Nessun link attivo trovato.");
            }

            // Nascondi messaggio di caricamento testuale ALLA FINE
            if (loadingMessage) loadingMessage.style.display = 'none';

            // Nascondi il loader grafico alla fine (se era stato mostrato)
            // La logica del setTimeout rimane valida per nasconderlo DOPO il caricamento
            if (loader && data.showLoader !== false) {
                 setTimeout(() => {
                      if (loader) loader.style.display = 'none';
                      console.log("Loader nascosto dopo caricamento completato.");
                 }, 500); // Delay per far vedere l'ultimo stato
            }

        } catch (error) {
            console.error('ERRORE FINALE nel caricamento dati:', error);
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (loader) loader.style.display = 'none'; // Nascondi loader in caso di errore
            document.body.classList.add('error-page');
            if (logoContainer) logoContainer.style.opacity = 1;
            if (titleElement) titleElement.style.opacity = 1;
        }
    }

    loadData();
});
