import { merkePartnerLink } from './partnerCode.js'
import { merkeHerkunft } from './herkunft.js'
import { rueckkehrHoeren } from './appAnmeldung.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Einwilligung from './Einwilligung.jsx'
import { merkeEinladung } from './rangliste.js'
import { starteLernzeit } from './lernzeit.js'
import { klicktoeneStarten } from './erfolgston.js'

merkeHerkunft()
starteLernzeit()
klicktoeneStarten() // weicher „Watte“-Klick auf allen Knöpfen
rueckkehrHoeren()
merkePartnerLink()

// Steht ein ?einladung=name in der Adresse, wird der Name gemerkt und
// aus der Adresse genommen. Eingelöst wird er erst, wenn es ein Konto
// mit Benutzernamen gibt – wer über den Link kommt, ist in der Regel
// noch nicht angemeldet.
merkeEinladung()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* Neben der App, nicht darin: Der Hinweis muss auch auf der
        Startseite erscheinen, und die liegt in App hinter einer
        vorzeitigen Rückgabe. Deshalb meldet er sich über ein
        Fenster-Ereignis, wenn jemand auf die Datenschutzerklärung
        tippt – eine Prop bekäme er dort nicht. */}
    <Einwilligung onRecht={(s) => { window.dispatchEvent(new CustomEvent('recht', { detail: s })) }} />
  </StrictMode>,
)

// Start-Logo (index.html) sanft ausblenden – frühestens nach 0,9 s,
// damit es auch bei schnellem Laden einmal kurz aufploppt.
const startLogo = document.getElementById('start-logo')
if (startLogo) {
  setTimeout(() => {
    startLogo.classList.add('weg')
    setTimeout(() => startLogo.remove(), 500)
  }, Math.max(0, 900 - performance.now()))
}
