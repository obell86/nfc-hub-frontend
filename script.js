document.addEventListener('DOMContentLoaded', () => {
    // *** URL FORNITO DALL'UTENTE ***
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec';
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)'; // Fallback colore pulsante

    // Elementi DOM
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader');
    const loaderTextElement = document.getElementById('loading-text-container');
    const loaderBarElement = loader ? loader.querySelector('.loader-bar') : null;

    // --- Funzione Caricamento Dati ---
    async function loadData() {
        // Mostra il loader inizialmente (verrà nascosto da JS se configurato o a fine caricamento)
        if (loader) loader.style.display = 'flex'; // Usa flex come da CSS, poi JS decide
        if (loadingMessage) loadingMessage.style.display = 'block';

        try {
            console.log("Tentativo fetch API:", apiUrl);
            const response = await fetch(apiUrl);
            console.log("Risposta API Status:", response.status);

            if (!response.ok) {
                let errorText = 'Errore Sconosciuto';
                try {
                    errorText = await response.text(); console.error("Testo errore API:", errorText);
                } catch (e) { console.error("Impossibile leggere testo errore API"); }
                throw new Error(`Errore HTTP: ${response.status}. Dettagli: ${errorText}`);
            }
            const result = await response.json();
            console.log("Dati JSON ricevuti:", result); // Log per debug

            // !!! CONTROLLO CRITICO !!!
            if (!result.success || !result.data) {
                 if (result.error) { throw new Error(result.error); }
                 // Se manca 'data' o 'success', probabilmente l'API URL sta eseguendo lo script VECCHIO
                 console.error("ERRORE: La risposta API non contiene 'success: true' o 'data'. L'URL API sta probabilmente eseguendo una versione vecchia dello script non aggiornata/ridistribuita correttamente!");
                 throw new Error("Formato dati API non valido. Assicurati che lo script Google Apps Script sia stato salvato E ridistribuito correttamente (Gestisci distribuzioni > Nuova versione).");
            }

            const data = result.data;
            console.log("Elaborazione dati:", data);

            // --- Applica Configurazione Visiva ---

            // Titolo (Testo e Dimensione)
            document.title = data.title; // Titolo scheda browser
            if (titleElement) {
                titleElement.textContent = data.title; // Titolo H1
                if (data.titleSize) { // Applica dimensione se fornita
                    titleElement.style.fontSize = data.titleSize;
                    console.log("Applicata dimensione titolo:", data.titleSize);
                } else {
                     titleElement.style.fontSize = ''; // Rimuovi stile inline per usare CSS default
                     console.log("Dimensione titolo non specificata, usato CSS default.");
                }
            }

            // Loader (Visibilità, Testo, Colore Barra, Dimensione Testo)
            if (loader) {
                // Controlla prima se deve essere NASCOSTO da configurazione
                if (data.showLoader === false) { // Legge il valore boolean dalla API
                    loader.style.display = 'none';
                    console.log("Loader nascosto da configurazione (showLoader: false).");
                } else {
                    // Se non deve essere nascosto, assicurati sia visibile e applica stili
                    loader.style.display = 'flex'; // Assicura visibilità
                    console.log("Loader mostrato da configurazione (showLoader: true o non specificato).");

                    if (loaderTextElement && data.loaderText) {
                        loaderTextElement.textContent = data.loaderText;
                        console.log("Applicato testo loader:", data.loaderText);
                    }
                    if (loaderBarElement && data.loaderBarColor) {
                        loaderBarElement.style.background = data.loaderBarColor;
                        console.log("Applicato colore barra loader:", data.loaderBarColor);
                    }
                    if (loaderTextElement && data.loaderTextSize) {
                        loaderTextElement.style.fontSize = data.loaderTextSize;
                        console.log("Applicata dimensione testo loader:", data.loaderTextSize);
                    }
                }
            } else {
                 console.warn("Elemento Loader non trovato nel DOM.");
            }


            // Logo
            logoContainer.innerHTML = '';
            if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
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

            // Pulsanti Link (con dimensione e padding dinamici)
            linkContainer.innerHTML = ''; // Pulisci prima di aggiungere
            if (data.links && data.links.length > 0) {
                data.links.forEach(link => {
                    const button = document.createElement('a');
                    button.href = link.url;
                    button.textContent = link.label;
                    button.className = 'link-button';
                    button.target = '_top';

                    // Applica background color letto dal foglio o default
                    button.style.background = link.color || defaultButtonColor;

                    // Applica dimensione font e padding dal foglio (se specificati)
                    if (data.buttonFontSize) {
                        button.style.fontSize = data.buttonFontSize;
                    } else {
                        button.style.fontSize = ''; // Usa CSS default
                    }
                    if (data.buttonPadding) {
                        button.style.padding = data.buttonPadding;
                    } else {
                       button.style.padding = ''; // Usa CSS default
                    }

                    linkContainer.appendChild(button);
                });
                console.log("Creati", data.links.length, "pulsanti link.");
                // Log applicazione stili pulsanti (esempio sul primo bottone)
                if (linkContainer.firstChild) {
                    console.log("Stile font size primo bottone:", linkContainer.firstChild.style.fontSize || "Default CSS");
                    console.log("Stile padding primo bottone:", linkContainer.firstChild.style.padding || "Default CSS");
                }

            } else {
                linkContainer.innerHTML = '<p>Nessun link attivo.</p>';
                console.log("Nessun link attivo trovato.");
            }

            // Nascondi messaggio di caricamento testuale alla fine
            if (loadingMessage) loadingMessage.style.display = 'none';

            // Nascondi il loader grafico ALLA FINE del caricamento CORRETTO (se non già nascosto da config)
            if (loader && data.showLoader !== false) {
                 // Aggiungiamo un piccolo delay per far vedere l'ultima animazione
                 setTimeout(() => {
                      if (loader) loader.style.display = 'none';
                      console.log("Loader nascosto dopo caricamento completato.");
                 }, 500); // Mezzo secondo di delay prima di nascondere
            }


        } catch (error) {
            console.error('ERRORE FINALE nel caricamento dati:', error);
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare i dati: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            // Nascondi elementi di caricamento in caso di errore
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (loader) loader.style.display = 'none';
            document.body.classList.add('error-page');
             // Assicura visibilità elementi base
             if (logoContainer) logoContainer.style.opacity = 1;
             if (titleElement) titleElement.style.opacity = 1;
             document.querySelectorAll('.link-button').forEach(btn => btn.style.opacity = 1);
        }
    }

    // Avvia tutto
    loadData();
});
