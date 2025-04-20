/* =================================== */
/* STYLE.CSS - Party Style v8.3      */
/* Fix Logo Transparency Background    */
/* =================================== */

/* --- Keyframes --- */
@keyframes loading-loop { 0% { width: 0%; } 50% { width: 100%; } 100% { width: 0%; } } 
@keyframes pulse-intense { 0% { transform: scale(1); box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, inset 0 0 3px 1px rgba(0,0,0,0.3); } 50% { transform: scale(1.05); box-shadow: 0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #00ffff, inset 0 0 4px 1px rgba(0,0,0,0.25); } 100% { transform: scale(1); box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, inset 0 0 3px 1px rgba(0,0,0,0.3); } }
@keyframes animated-gradient-base { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } 
@keyframes flicker-intense { 0%, 19%, 23%, 27%, 54%, 60%, 100% { text-shadow: 0 0 4px #fff, 0 0 10px #fff, 0 0 18px #fff, 0 0 40px #0ff, 0 0 70px #0ff, 0 0 80px #0ff, 0 0 100px #0ff, 0 0 150px #0ff; opacity: 1; } 21%, 25%, 57% { text-shadow: 0 0 2px #fff, 0 0 5px #0ff, 0 0 10px #0ff; opacity: 0.6; } 30%, 40% { text-shadow: none; opacity: 0.3; } }
@keyframes logo-float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } } 
@keyframes float-glow { 0% { transform: translate(0, 0) scale(1); opacity: 0.5; } 50% { transform: translate(15px, 10px) scale(1.1); opacity: 0.9; } 100% { transform: translate(0, 0) scale(1); opacity: 0.5; } }

/* --- Stili Generali --- */
html { font-size: 16px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } 
body { 
  position: relative; font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
  box-sizing: border-box; padding: 5vw; text-align: center; color: white; 
  display: flex; flex-direction: column; justify-content: center; align-items: center; 
  min-height: 100vh; margin: 0; overflow: hidden; 
  background-color: black; /* Base nera */
  background-image: linear-gradient(135deg, #3a003a, #003a3a, #3a003a); 
  background-size: 250% 250%; 
  animation: animated-gradient-base 10s ease infinite; 
} 

/* --- Effetti Sfondo --- */
.glow-orb { 
  content: ""; position: fixed; 
  z-index: -1; /* Dietro contenuto */
  border-radius: 50%; 
  filter: blur(60px); 
  animation: float-glow 12s ease-in-out infinite alternate; 
}
.orb1 { 
  width: 40vw; height: 40vw; max-width: 400px; max-height: 400px;
  background: radial-gradient(circle, rgba(0,255,255,0.3) 0%, rgba(0,255,255,0) 70%); 
  top: -10%; left: -10%; animation-duration: 14s; 
}
.orb2 { 
  width: 30vw; height: 30vw; max-width: 300px; max-height: 300px;
  background: radial-gradient(circle, rgba(255,0,255,0.3) 0%, rgba(255,0,255,0) 70%); 
  bottom: -5%; right: -5%; animation-delay: -6s; animation-duration: 10s; 
}

/* --- Contenuto Principale --- */
.main-content { 
  position: relative; z-index: 1; /* Sopra gli effetti di sfondo */
  display: flex; flex-direction: column; align-items: center; 
  width: 100%; 
  background-color: transparent; /* *** TENTATIVO 2: Forza layer trasparente *** */
}

/* Logo */
#logo-container {
  line-height: 0; 
  z-index: 1; 
  position: relative; 
  background-color: transparent; /* *** TENTATIVO 1: Sfondo trasparente esplicito *** */
}
#logo-container img { 
  display: block; max-width: 120px; height: auto; 
  margin-left: auto; margin-right: auto; margin-bottom: 1.5em; 
  animation: logo-float 3s ease-in-out infinite; 
  background-color: transparent; /* *** TENTATIVO 1: Sfondo trasparente esplicito *** */
}

/* Titolo */
h1 { 
  font-size: 8vw; max-width: 95%; line-height: 1.1; color: #ffffff; 
  margin-top: 0; margin-bottom: 1.5em; 
  animation: flicker-intense 1.2s linear infinite; 
  word-wrap: break-word; 
} 

/* Loader */
.loader-container { position: relative; width: 90%; max-width: 500px; height: 2em; background-color: rgba(51, 51, 51, 0.8); border-radius: 1.2em; overflow: hidden; margin-bottom: 2.5em; border: 1px solid #444; display: block; }
.loader-bar { height: 100%; width: 0%; background: linear-gradient(90deg, #ff00ff, #00ffff); border-radius: 1.2em; animation: loading-loop 3s linear infinite; }
#percentage-text { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 0.9em; text-shadow: 1px 1px 2px rgba(0,0,0,0.9); z-index: 2; pointer-events: none; }

/* Contenitore Pulsanti */
.link-container { display: flex; flex-direction: column; align-items: center; gap: 1.2em; margin-top: 1em; width: 100%; max-width: 450px; }
#loading-message, .link-container p { font-size: 1.2em; opacity: 0.7; }

/* Pulsante */
.link-button { position: relative; display: block; width: 100%; padding: 0.7em 1em; color: white; text-decoration: none; font-size: 1.3em; border-radius: 0.5em; font-weight: bold; border: 1px solid rgba(255, 255, 255, 0.3); cursor: pointer; transition: transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease; box-shadow: 0 0 5px rgba(255, 255, 255, 0.2), inset 0 0 3px 1px rgba(0,0,0,0.4); line-height: 1.3; backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); text-shadow: 1px 1px 2px rgba(0,0,0,0.5); } 
.link-button:hover, .link-button:active { transform: scale(1.03); box-shadow: 0 0 18px #ff00ff, 0 0 35px #ff00ff, 0 0 45px #00ffff, inset 0 0 4px 1px rgba(0,0,0,0.25); animation: pulse-intense 0.8s infinite; border-color: rgba(255, 255, 255, 0.6); } 

/* Stili Errore Frontend */
.error-message { color: #ff4444; font-weight: bold; margin-top: 2em; border: 1px solid #ff4444; padding: 1em; background-color: rgba(255, 0, 0, 0.1); border-radius: 0.5em; }
body.error-page .glow-orb { display: none; } 
body.error-page h1 { animation: none; text-shadow: none; color: #ff4444; }
