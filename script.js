document.addEventListener('DOMContentLoaded', () => {
    // !!! URL /exec DELLA TUA API GOOGLE APPS SCRIPT INSERITO !!!
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
        // Animazione percentuale (se l'elemento esiste)
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
        }
        // Mostra il contenitore del loader (se esiste)
        if (loader) {
            loader.style.display = 'block'; 
        }
    }

    // --- Funzione asincrona per caricare i dati dall'API e popolare la pagina ---
    async function loadData() {
        startLoaderAnimation(); // Avvia animazioni iniziali
        if (loadingMessage) loadingMessage.style.display = 'block'; // Mostra "Caricamento..."

        try {
            // Chiama l'API Google Apps Script
            const response = await fetch(apiUrl);
            
            // Controlla se la risposta HTTP è andata a buon fine (es. status 200 OK)
            if (!response.ok) {
                // Se la risposta non è OK, genera un errore con lo status HTTP
                throw new Error(`Errore HTTP: ${response.status} ${response.statusText}`);
            }
            
            // Tenta di interpretare la risposta come JSON
            const result = await response.json();

            // Controlla se il JSON indica successo e contiene i dati attesi
            if (result.success && result.data) {
                const data = result.data;

                // 1. Imposta Titolo Pagina e Titolo H1
                document.title = data.title || 'Magnolia 808 Hub'; // Titolo tab browser
                if (titleElement) titleElement.textContent = data.title || 'MAGNOLIA 808'; // Titolo visibile H1

                // 2. Mostra Logo se l'URL è fornito nei dati
                logoContainer.innerHTML = ''; // Pulisci eventuali contenuti precedenti
                if (data.logoUrl) {
                    const logoImg = document.createElement('img');
                    logoImg.src = data.logoUrl; // L'URL letto dal foglio
                    logoImg.alt = 'Logo'; // Testo alternativo
                    // Lo stile (dimensioni, animazione) verrà applicato dal CSS tramite #logo-container img
                    logoContainer.appendChild(logoImg);
                    // Aggiusta margine titolo se c'è il logo
                    if (titleElement) titleElement.style.marginTop = '0.5em'; 
                } else {
                     if (titleElement) titleElement.style.marginTop = '0'; // Nessun margine extra se non c'è logo
                }

                // 3. Imposta Sfondo se l'URL è fornito nei dati
                 if (data.backgroundUrl) {
                    // Combina immagine esterna e gradiente CSS
                    document.body.style.backgroundImage = `url("${data.backgroundUrl}"), linear-gradient(135deg, #1a001a, #001a1a, #1a001a)`;
                    document.body.style.backgroundBlendMode = 'overlay'; // Prova altri blend modes se vuoi
                    document.body.style.backgroundSize = 'cover, 200% 200%';
                    document.body.style.backgroundPosition = 'center center, 0% 50%';
                    document.body.style.backgroundRepeat = 'no-repeat, repeat';
                } else {
                     // Se non c'è URL sfondo, usa solo il gradiente definito nel body {} CSS
                    document.body.style.backgroundImage = ''; // Rimuovi eventuali stili inline precedenti
                 }
                 // Assicura che l'animazione del gradiente definita nel CSS sia attiva
                 // (potrebbe essere sovrascritta da style.backgroundImage, anche se spesso non serve riapplicarla)
                 document.body.style.animation = 'animated-gradient 15s ease infinite';

                // 4. Crea i Pulsanti per i link attivi ricevuti
                linkContainer.innerHTML = ''; // Rimuovi il messaggio "Caricamento..."
                if (data.links && data.links.length > 0) {
                    data.links.forEach(link => {
                        const button = document.createElement('a');
                        button.href = link.url; // URL di destinazione
                        button.textContent = link.label; // Testo sul pulsante
                        button.className = 'link-button'; // Applica la classe per lo stile CSS
                        button.target = '_top'; // Apre nello stesso tab/finestra

                        // Applica colore specifico o gradiente di default come sfondo inline
                        button.style.background = link.color || defaultButtonColor; 
                        
                        linkContainer.appendChild(button); // Aggiungi il pulsante creato al contenitore
                    });
                } else {
                    // Se non ci sono link attivi, mostra un messaggio
                    linkContainer.innerHTML = '<p>Nessun link attivo al momento.</p>';
                }
                
                // Nascondi il messaggio di caricamento iniziale se tutto è andato bene
                if (loadingMessage) loadingMessage.style.display = 'none';
                
                // Puoi decidere se nascondere il loader qui o lasciarlo animato:
                // if (loader) loader.style.display = 'none'; 

            } else {
                // Errore logico restituito dall'API Script (es. success: false)
                throw new Error(result.error || 'Errore sconosciuto ricevuto dallo script API.');
            }

        } catch (error) {
            // Gestisce errori di rete (fetch fallito) o errori JSON
            console.error('Errore nel caricamento o processamento dati:', error);
            // Mostra un messaggio di errore all'utente
            if (linkContainer) linkContainer.innerHTML = `<p class="error-message">Impossibile caricare i dati: ${error.message}</p>`;
            if (titleElement) titleElement.textContent = 'Errore';
            document.title = 'Errore';
            // Nascondi loader e messaggio di caricamento in caso di errore
            if (loadingMessage) loadingMessage.style.display = 'none';
             if (loader) loader.style.display = 'none'; 
             document.body.classList.add('error-page'); // Applica stile errore al body
        }
    }

    // Avvia il caricamento dei dati quando il DOM è pronto
    loadData(); 
});