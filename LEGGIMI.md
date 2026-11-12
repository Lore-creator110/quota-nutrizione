# Quota · build 1 (versione di prova)

App per piani nutrizionali: il nutrizionista fissa macronutrienti, sale e acqua e li distribuisce sui pasti; il cliente segna i pasti; il nutrizionista monitora giorno per giorno.

Il nome «Quota» è provvisorio: si cambia nella costante `APP_NAME` in cima allo script (e in `manifest.json`).

## Come metterla online (GitHub Pages)

1. Crea un repo (anche privato) e carica questi file nella radice: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Apri l'indirizzo dal telefono e aggiungi alla schermata Home (iPhone: Condividi → Aggiungi alla schermata Home; Android: menu → Installa app).

Ad ogni nuova build: ricarica `index.html` e, se cambia, `sw.js` (alza `CACHE = 'quota-vN'` per forzare l'aggiornamento).

## Cosa c'è in questa build

- Due ruoli sullo stesso telefono (Impostazioni → Cliente / Nutrizionista). Nessun account: tutto resta sul telefono (localStorage). Esporta/Importa in Impostazioni.
- Dati demo: un cliente «Marco B. (demo)» con piano e 7 giorni di diario, e «Tu (questo telefono)» collegato alla parte Cliente, con lo stesso piano già inviato.
- **Nutrizionista**: Clienti (riga di stato di oggi, giorni in linea) → cliente: Monitoraggio (giornata pasto per pasto, previsto a quest'ora, sale, acqua, tabella 7 giorni), Piano (obiettivi P/C/G/sale/acqua, tipi di giornata con giorni della settimana, distribuzione per percentuale o grammi a mano, pasti d'esempio con controllo «in quota» e «Adatta le quantità alla quota», note, anteprima, Invia), Dati. Alimenti: 160 alimenti di base, ricerca, nuovi alimenti, codice a barre (Open Food Facts; fotocamera su Android/Chrome, cifre a mano altrove).
- **Cliente**: Oggi (macro, kcal, acqua +250 ml, sale aggiunto +0,5 g, pasti: «Ho mangiato l'esempio» / «Ho mangiato altro» / «Saltato», quota adattata del pasto successivo con gli scarti dei precedenti, striscia dei 7 giorni, cambio tipo di giornata), Segna il pasto (ricerca, porzioni rapide, +/− grammi, recenti, nota), Piano, Progressi.

## Regole decise (si cambiano in cima allo script)

- Tolleranza sul singolo pasto: 10% per macro, minimo 5 g (`TOL_MEAL`, `TOL_MEAL_MIN_G`).
- Tolleranza sulla giornata: 5%, minimo 3 g; calorie 5% (`TOL`, `TOL_MIN_G`).
- Sale: somma del sale contenuto negli alimenti segnati + quello che il cliente dichiara di aggiungere.
- «Giorni in linea»: giornate chiuse (tutti i pasti segnati) con kcal, P, C, G entro tolleranza, sale non oltre il 110% e acqua non sotto il 90%.
- Modalità «Segue i pasti esatti»: la quota di ogni pasto è il suo primo esempio.

## Cosa testare

1. Lato cliente: segna una giornata intera, anche con un pasto «altro» e uno saltato. Il pasto dopo deve mostrare la quota adattata.
2. Passa a Nutrizionista → «Tu (questo telefono)» → Monitoraggio: deve mostrare esattamente quello che hai segnato.
3. Piano: cambia un obiettivo, invia, torna Cliente: il piano deve essere cambiato (Oggi e Piano).
4. Codice a barre su un prodotto vero (Android/Chrome: fotocamera; iPhone: cifre a mano).
5. Chiudi e riapri l'app installata: i dati devono esserci; prova anche in modalità aereo.
6. Esporta, azzera, importa: tutto torna.

## Prossima build (v2)

Firebase: account nutrizionista/cliente, collegamento con codice, piano e diario sincronizzati, regole di accesso, promemoria push. La struttura dei dati è già quella (clients, plans[clientId].draft/active, logs[clientId][data]).
