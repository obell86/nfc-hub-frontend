document.addEventListener('DOMContentLoaded', () => {
    // *** INCOLLA QUI IL NUOVO URL DELL'APP WEB DISTRIBUITA ***
    const apiUrl = '1GLq5c3G2-pkusXoCbAiDYNmaE1Zg4ZdXXYn4s-xfaoE';
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)'; // Fallback colore pulsante

    // Elementi DOM
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader');
    const loaderTextElement = document.getElementById('loading-text-container');
    const loaderBarElement = loader ? loader.querySelector('.loader-bar') : null; // Prendi la barra interna

    // --- Rimosso startLoaderAnimation --- (gestito dentro loadData)

    // --- Funzione Caricamento Dati ---
    async function loadData() {
        // Mostra il loader inizialmente (se esiste nel DOM)
        if (loader) loader.style.display = 'flex'; // Usa flex come da CSS
        if (loadingMessage) loadingMessage.style.display = 'block'; // Mostra messaggio testo

        try {
            console.log("Tentativo fetch API:", apiUrl);
            if (apiUrl === 'INCOLLA_QUI_IL_NUOVO_URL_SCRIPT') {
                 throw new Error("URL API non configurato in script.js!");
            }
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
            console.log("Dati JSON:", result);

            if (result.success && result.data) {
                const data = result.data;

                // --- Applica Configurazione Visiva ---

                // Titolo (Testo e Dimensione)
                document.title = data.title; // Usa sempre il titolo fornito (anche se è il default)
                if (titleElement) {
                    titleElement.textContent = data.title;
                    if (data.titleSize) { // Applica dimensione se fornita
                        titleElement.style.fontSize = data.titleSize;
                        console.log("Applicata dimensione titolo:", data.titleSize);
                    } else {
                         titleElement.style.fontSize = ''; // Rimuovi stile inline per usare CSS default (se esiste)
                    }
                }

                // Loader (Visibilità, Testo, Colore Barra, Dimensione Testo)
                if (loader) {
                    if (data.showLoader === false) { // Controlla se nascondere SUBITO
                        loader.style.display = 'none';
                        console.log("Loader nascosto da configurazione.");
                    } else {
                        // Assicurati sia visibile (potrebbe essere stato nascosto da errore precedente)
                        loader.style.display = 'flex';
                        // Applica personalizzazioni se il loader deve essere mostrato
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
                        button.target = '_top'; // O '_blank' se preferisci aprire in nuova scheda

                        // Applica background color letto dal foglio o default
                        button.style.background = link.color || defaultButtonColor;

                        // Applica dimensione font e padding dal foglio (se specificati)
                        if (data.buttonFontSize) {
                            button.style.fontSize = data.buttonFontSize;
                        } else {
                            button.style.fontSize = ''; // Rimuovi stile inline per usare CSS default (se esiste)
                        }
                        if (data.buttonPadding) {
                            button.style.padding = data.buttonPadding;
                        } else {
                           button.style.padding = ''; // Rimuovi stile inline per usare CSS default (se esiste)
                        }

                        // *** SUGGERIMENTO FUTURO: Applicare colore Neon a bordo/glow ***
                        // if (link.color) {
                        //    button.style.setProperty('--button-neon-color', link.color);
                        // } else {
                        //    button.style.removeProperty('--button-neon-color'); // Usa fallback CSS
                        // }

                        linkContainer.appendChild(button);
                    });
                    console.log("Creati", data.links.length, "pulsanti link.");
                } else {
                    linkContainer.innerHTML = '<p>Nessun link attivo.</p>';
                    console.log("Nessun link attivo trovato.");
                }

                // Nascondi messaggio di caricamento testuale alla fine
                if (loadingMessage) loadingMessage.style.display = 'none';

                // Nascondi il loader grafico alla fine del caricamento corretto
                if (loader) loader.style.display = 'none';


            } else {
                // Errore restituito dall'API nel formato JSON atteso
                throw new Error(result.error || 'Errore API sconosciuto.');
            }
        } catch (error) {
            console.error('Errore caricamento dati:', error);
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare i dati: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            // Nascondi elementi di caricamento in caso di errore
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (loader) loader.style.display = 'none'; // Nascondi anche il loader grafico in caso di errore
            document.body.classList.add('error-page');
            // Assicura visibilità elementi base (potrebbe non essere necessario se il loader è nascosto)
             if (logoContainer) logoContainer.style.opacity = 1;
             if (titleElement) titleElement.style.opacity = 1;
             document.querySelectorAll('.link-button').forEach(btn => btn.style.opacity = 1);
        }
    }

    // Avvia tutto
    loadData();
});
