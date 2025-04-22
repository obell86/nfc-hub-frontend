document.addEventListener('DOMContentLoaded', () => {
    // !!! URL API e defaultButtonColor invariati !!!
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJu8vr_L9oqqh4GdNMEPjcEyumyC0rRi3oq0XdGMq7wDCnYLQCBZmuLw3qzvCEiHBQ/exec';
    const defaultButtonColor = 'linear-gradient(45deg, #ff00ff, #00ffff)';

    // Elementi DOM (invariati)
    const titleElement = document.getElementById('page-title');
    const logoContainer = document.getElementById('logo-container');
    const linkContainer = document.getElementById('link-container');
    const loadingMessage = document.getElementById('loading-message');
    const loader = document.getElementById('loader');
    const loaderTextElement = document.getElementById('loading-text-container');
    const loaderBarElement = loader ? loader.querySelector('.loader-bar') : null;
    const footerImageContainer = document.getElementById('footer-image-container');
    const countdownContainer = document.getElementById('countdown-container');
    const countdownLabelElement = document.getElementById('countdown-label');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const countdownMessageElement = document.getElementById('countdown-message');
    let countdownIntervalId = null;

    async function loadData() {
        if (loadingMessage) loadingMessage.style.display = 'block';

        try {
            // ... (fetch, controlli API, result, data) ...
            const response = await fetch(apiUrl); const result = await response.json(); if (!result.success || !result.data) { throw new Error("..."); } const data = result.data; console.log("Elaborazione dati:", data);


            // --- Applica Configurazione Visiva ---
            // ... (Sfondo, Titolo) ...
             if (data.backgroundUrl && typeof data.backgroundUrl === 'string' && data.backgroundUrl.trim() !== '') { /*...*/ document.body.style.backgroundImage = `url('${data.backgroundUrl.trim()}')`; /*...*/ } else { /*...*/ document.body.style.backgroundImage = 'none'; /*...*/ }
             if (titleElement) { /*...*/ titleElement.textContent = data.title; /*...*/ }


            // *** GESTIONE COUNTDOWN TIMER - MODIFICATO ***
            console.log("Inizio gestione Countdown...");
            if (countdownIntervalId) clearInterval(countdownIntervalId);
            if (countdownContainer) countdownContainer.style.display = 'none';
            if (document.getElementById('countdown-timer')) document.getElementById('countdown-timer').style.display = 'block';
            if (countdownLabelElement) countdownLabelElement.style.display = 'block';
            if (countdownMessageElement) countdownMessageElement.style.display = 'none';

            console.log("Controllo showCountdown:", data.showCountdown, "Target:", data.countdownTarget);
            if (countdownContainer && data.showCountdown === true && data.countdownTarget) {
                const targetDateStr = data.countdownTarget;
                const targetDate = new Date(targetDateStr.replace(" ", "T"));

                if (!isNaN(targetDate)) {
                    console.log("Data target countdown valida:", targetDate);

                    if (countdownLabelElement && data.countdownLabel) {
                        countdownLabelElement.textContent = data.countdownLabel;
                    } else if (countdownLabelElement) {
                        countdownLabelElement.textContent = '';
                    }

                    // *** MODIFICA: Mostra il contenitore QUI, fuori dall'update ***
                    countdownContainer.style.display = 'block';
                    console.log("Countdown container reso visibile.");

                    const updateCountdown = () => {
                        try { // Aggiunto try/catch interno per sicurezza
                            const now = new Date().getTime();
                            const distance = targetDate.getTime() - now;

                            if (distance < 0) {
                                clearInterval(countdownIntervalId);
                                if (document.getElementById('countdown-timer')) document.getElementById('countdown-timer').style.display = 'none';
                                if (countdownLabelElement) countdownLabelElement.style.display = 'none';
                                if (countdownMessageElement) {
                                    countdownMessageElement.textContent = "Tempo Scaduto!";
                                    countdownMessageElement.style.display = 'block';
                                }
                                console.log("Countdown terminato.");
                                return;
                            }

                            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                            // Aggiorna elementi HTML
                            if (daysElement) daysElement.textContent = days < 10 ? '0' + days : String(days); // Converti in String esplicitamente
                            if (hoursElement) hoursElement.textContent = hours < 10 ? '0' + hours : String(hours);
                            if (minutesElement) minutesElement.textContent = minutes < 10 ? '0' + minutes : String(minutes);
                            if (secondsElement) secondsElement.textContent = seconds < 10 ? '0' + seconds : String(seconds);

                        } catch (updateError) {
                            console.error("Errore durante updateCountdown:", updateError);
                            clearInterval(countdownIntervalId); // Ferma in caso di errore nell'update
                        }
                    };

                    updateCountdown(); // Chiamata iniziale
                    countdownIntervalId = setInterval(updateCountdown, 1000); // Aggiorna ogni secondo
                    console.log("Intervallo countdown avviato.");

                } else {
                    console.error("Formato data/ora countdown (E5) non valido:", targetDateStr);
                     if(countdownContainer) countdownContainer.style.display = 'none'; // Nascondi se data non valida
                }
            } else {
                console.log("Countdown non attivo (E4 non spuntato o E5 vuoto/non valido).");
                 if(countdownContainer) countdownContainer.style.display = 'none'; // Assicura sia nascosto
            }
            // *** FINE BLOCCO COUNTDOWN ***


            // Loader (viene dopo, apparirà sotto il timer se attivo)
             if (loader) { /* ... (logica loader invariata) ... */ }

            // Logo
            if (data.logoUrl) { /* ... (logica logo invariata) ... */ }

            // Pulsanti Link
             if (data.links && data.links.length > 0) { /* ... (logica pulsanti invariata) ... */ } else { linkContainer.innerHTML = '<p>Nessun link attivo.</p>'; }

            // Immagine Footer
            if (footerImageContainer) { /* ... (logica footer invariata) ... */ }

            // Nascondi Messaggio 'Caricamento...'
            if (loadingMessage) loadingMessage.style.display = 'none';

        } catch (error) {
             console.error('ERRORE FINALE:', error);
             /* ... gestione errore generale ... */
             if (countdownIntervalId) clearInterval(countdownIntervalId);
             if (countdownContainer) countdownContainer.style.display = 'none';
        }
    }

    loadData();
});
