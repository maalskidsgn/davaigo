# Werte für den App-Build (Android/iOS), nicht für die Website.
#
# In der Store-App liegt die Seite im eigenen Paket, nicht auf
# davaigo.de. Ein Pfad wie "/api/transcript" zeigt dort ins Leere –
# deshalb MUSS die volle Serveradresse eingebacken sein.
#
#     npm run build -- --mode app
#
# Enthält keine Geheimnisse und darf ins Git.
VITE_API_URL=https://api.davaigo.de
