document.addEventListener('DOMContentLoaded', () => {
    // !!! METTI QUI L'URL CORRETTO DELLA TUA DISTRIBUZIONE SCRIPT AGGIORNATA !!!
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec'; // O il tuo URL API corretto
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
    // Elementi DOM per il Countdown
    const countdownContainer = document.getElementById('countdown-container'); // *** DA QUI IN GIÙ SONO PER IL TIMER ***
    const countdownLabelElement = document.getElementById('countdown-label');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const countdownMessageElement = document.getElementById('countdown-message');
    let countdownIntervalId = null; // Variabile per l'intervallo del timer

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

            // Sfondo (da B7)
            if (data.backgroundUrl && typeof data.backgroundUrl === 'string' && data.backgroundUrl.trim() !== '') {
                const bgImageUrl = data.backgroundUrl.trim();
                console.log("Applicando immagine di sfondo:", bgImageUrl);
                document.body.style.backgroundImage = `url('${bgImageUrl}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center center';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundAttachment = 'fixed';
            } else {
                console.log("Nessuna immagine di sfondo specificata (B7 vuoto).");
                document.body.style.backgroundImage = 'none';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundAttachment = '';
            }

            // Titolo (da B4, B5)
            document.title = data.title || "Link Hub";
            if (titleElement) {
                titleElement.textContent = data.title;
                if (data.titleSize) titleElement.style.fontSize = data.titleSize; else titleElement.style.fontSize = '';
                // if (data.titleFontFamily) titleElement.style.fontFamily = data.titleFontFamily; else titleElement.style.fontFamily = '';
            }

            // *** GESTIONE COUNTDOWN TIMER (LEGGE DA E3, E4, E5) ***
            // Pulisci stato timer precedente ad ogni caricamento
            if (countdownIntervalId) clearInterval(countdownIntervalId);
            if (countdownContainer) countdownContainer.style.display = 'none'; // Nascondi di default
            if (document.getElementById('countdown-timer')) document.getElementById('countdown-timer').style.display = 'block'; // Resetta visibilità numeri
            if (countdownLabelElement) countdownLabelElement.style.display = 'block'; // Resetta visibilità etichetta
            if (countdownMessageElement) countdownMessageElement.style.display = 'none'; // Nascondi messaggio finale

            // Controlla se attivare il timer (da E4) e se la data target (da E5) è valida
            if (countdownContainer && data.showCountdown === true && data.countdownTarget) {
                console.log("Avvio configurazione countdown...");
                const targetDateStr = data.countdownTarget;
                const targetDate = new Date(targetDateStr.replace(" ", "T")); // Prova a parsare data da E5

                if (!isNaN(targetDate)) {
                    console.log("Data target countdown valida:", targetDate);

                    // Imposta etichetta (da E3)
                    if (countdownLabelElement && data.countdownLabel) {
                        countdownLabelElement.textContent = data.countdownLabel;
                    } else if (countdownLabelElement) {
                        countdownLabelElement.textContent = '';
                    }

                    const updateCountdown = () => {
                        const now = new Date().getTime();
                        const distance = targetDate.getTime() - now;

                        if (distance < 0) {
                            clearInterval(countdownIntervalId);
                            if (document.getElementById('countdown-timer')) document.getElementById('countdown-timer').style.display = 'none';
                            if (countdownLabelElement) countdownLabelElement.style.display = 'none';
                            if (countdownMessageElement) {
                                countdownMessageElement.textContent = "Tempo Scaduto!"; // Messaggio di default alla fine
                                countdownMessageElement.style.display = 'block';
                            }
                            console.log("Countdown terminato.");
                            return;
                        }

                        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        // Aggiorna elementi HTML (assicurati che esistano)
                        if (daysElement) daysElement.textContent = days < 10 ? '0' + days : days;
                        if (hoursElement) hoursElement.textContent = hours < 10 ? '0' + hours : hours;
                        if (minutesElement) minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes;
                        if (secondsElement) secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds;

                        // Mostra il contenitore solo se non è già visibile
                        if (countdownContainer.style.display === 'none') {
                            countdownContainer.style.display = 'block';
                            console.log("Countdown container reso visibile.");
                        }
                    };

                    updateCountdown(); // Chiamata iniziale per evitare ritardo
                    countdownIntervalId = setInterval(updateCountdown, 1000); // Aggiorna ogni secondo

                } else {
                    console.error("Formato data/ora countdown (E5) non valido:", targetDateStr);
                }
            } else {
                console.log("Countdown non attivo (E4 non spuntato o E5 vuoto/non valido).");
            }
            // *** FINE BLOCCO COUNTDOWN ***


            // Loader (da B9, B10, B11, B12, D11, E11)
            // NOTA: Il loader viene gestito *dopo* il countdown, quindi apparirà sotto di esso se entrambi sono attivi
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

            // Logo (da B6)
            logoContainer.innerHTML = '';
            if (data.logoUrl && typeof data.logoUrl === 'string' && data.logoUrl.trim() !== '') {
                const logoFilename = data.logoUrl.trim();
                console.log("Cerco logo:", logoFilename);
                const logoImg = document.createElement('img');
                logoImg.src = logoFilename; logoImg.alt = 'Logo';
                logoImg.onerror = () => { console.error("Errore logo:", logoFilename); logoContainer.innerHTML = '<p>Logo non trovato</p>'; };
                logoContainer.appendChild(logoImg);
            } else { console.log("Nessun logo specificato (B6 vuoto)."); }

            // Pulsanti Link (da B17+, B14?, B15?)
            linkContainer.innerHTML = '';
            if (data.links && data.links.length > 0) {
                data.links.forEach(link => {
                    const button = document.createElement('a');
                    button.href = link.url; button.textContent = link.label; button.className = 'link-button'; button.target = '_top';
                    button.style.background = link.color || defaultButtonColor;
                    if (data.buttonFontSize) button.style.fontSize = data.buttonFontSize; else button.style.fontSize = '';
                    if (data.buttonPadding) button.style.padding = data.buttonPadding; else button.style.padding = '';
                    linkContainer.appendChild(button); });
                console.log("Creati", data.links.length, "link.");
            } else { linkContainer.innerHTML = '<p>Nessun link attivo.</p>'; }

            // Immagine Footer (da D5, D6)
            if (footerImageContainer) {
                footerImageContainer.innerHTML = '';
                if (data.footerImageUrl && typeof data.footerImageUrl === 'string' && data.footerImageUrl.trim() !== '') {
                    const imageUrl = data.footerImageUrl.trim();
                    const imageAlt = (data.footerImageAlt && typeof data.footerImageAlt === 'string' && data.footerImageAlt.trim() !== '') ? data.footerImageAlt.trim() : 'Immagine Footer';
                    console.log("Cerco immagine footer:", imageUrl, "Alt:", imageAlt);
                    const footerImg = document.createElement('img');
                    footerImg.src = imageUrl; footerImg.alt = imageAlt;
                    footerImg.onerror = () => { console.error("Errore img footer:", imageUrl); footerImageContainer.innerHTML = '<p>Immagine non trovata</p>'; };
                    footerImageContainer.appendChild(footerImg);
                } else { console.log("Nessun URL immagine footer."); }
            } else { console.warn("#footer-image-container non trovato."); }

            // Nascondi Messaggio Testo 'Caricamento...' alla fine
            if (loadingMessage) loadingMessage.style.display = 'none';

        } catch (error) {
             console.error('ERRORE FINALE:', error);
             if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare: ${error.message}</p>`;
             if (titleElement) titleElement.textContent = 'Errore'; document.title = 'Errore';
             if (loadingMessage) loadingMessage.style.display = 'none'; if (loader) loader.style.display = 'none';
             if (countdownIntervalId) clearInterval(countdownIntervalId); // Ferma timer in caso di errore
             if (countdownContainer) countdownContainer.style.display = 'none'; // Nascondi timer in caso di errore
             document.body.classList.add('error-page');
        }
    }

    loadData();
});
