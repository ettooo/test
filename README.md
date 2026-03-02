# 🚀 ViralClippy - AI Shorts Generator

![ViralClippy Banner](https://via.placeholder.com/1200x400/1e2025/d0bcff?text=ViralClippy+-+Auto+Clip+Generator+with+AI)

**ViralClippy** è l'ultimo ritrovato per creator e agenzie. Un'applicazione full-stack per trasformare ore di video YouTube in potenti clip verticali pronte per TikTok, Instagram Reels e YouTube Shorts.

Propulso dalla logica dell'Intelligenza Artificiale (Google Gemini 1.5), identifica gli `hook` migliori, taglia perfettamente la clip e persino vi imprime i sottotitoli "Viral Style" (es. Hormozi) automaticamente grazie ad un solido motore FFmpeg backend.

---

## ⚡ Caratteristiche (Features)

- **🧠 Auto AI-Curation**: Gemini individua le parti del video di maggiore impatto narrativo ed emotivo. Nessun lavoro manuale.
- **🌐 Sottotitoli Automatici Multi-language**: Scrive hook e ragioni generati automaticamente in lingua originale e "brucia" (hard-code) sul video i sottotitoli in stile virale. Nessun plugin extra.
- **✨ Hormozi-Style Captions**: Sottotitoli Gialli, Testo Enorme (Bebas/Arial Bold), Bordo Nero Spesso massiccio. Altissimo Engagement.
- **📲 Social Share Diretto**: Condivisione one-click su WhatsApp, Telegram, Twitter e Native Mobile Share.
- **🎨 Design Material 3**: Tema Scuro "Midnight Elegance" premium, UI fluida con _Framer Motion_ e icone vettoriali perfette. Pagine Complete incluse: Dashboard, Auth, Landing.

---

## 🛠️ Stack Tecnologico

- **Frontend**: React (Vite), Framer Motion, Material Design 3 UI, Lucide React (Icone).
- **Backend**: Node.js, Express, formidabile motore video basato su `fluent-ffmpeg` e `ffmpeg-static`. Estrazione del tubo con `youtube-dl-exec` e Fetching del testo con `youtube-transcript`.
- **Intelligenza**: Google Generative AI (Gemini Flash).

---

## 📦 Installazione (Local Setup)

Clone del repo o avvio locale passo-passo della Codebase.

### 1. Prerequisiti
- **Node.js** (v18+ altamente consigliato)
- Un Account Google Gemini per la `GEMINI_API_KEY`.

### 2. Configura il Server

```bash
cd server
npm install
```

Crea un file `.env` dentro la cartella `server` con la tua API key AI:
```env
GEMINI_API_KEY=inserisci_qui_la_tua_key
PORT=5000
```

### 3. Configura il Frontend

```bash
cd client
npm install
```

### 4. Avvia Tutto (Start)

Dal percorso principale (root del progetto), avvia l'intero sistema in contemporanea:

```bash
npm start
```

Il Frontend ti attenderà su `http://localhost:5173`. L'API ascolterà su `http://localhost:5000`.

---

## 🕹️ Utilizzo Rapido

1. Apri la piattaforma dal browser all'avvio.
2. Incolla l'URL di un video YouTube *che disponga di sottotitoli chiusi (CC) manuali o automatici*.
3. Assicurati che lo switch `Sottotitoli Virali` sia attivo.
4. Clicca su **Estrai Momenti**. L'AI valuterà tutto.
5. Nella dashboard, scorri le clip. Ciascuna visualizzerà il proprio **Virality Score** stimato.
6. Clicca su **Genera & Scarica** per vedere FFmpeg montare in tempo reale e sfornarti l'MP4 sul tuo PC!

---

## 👨‍💻 Contribuire
Ogni Pull Request è ben accetta! Essendo in fase early Access, sentitevi liberi di migliorare lo stile, l'effettiva cattura degli hook o la palette dei sottotitoli.

## 📄 Licenza
Rilasciato sotto licenza MIT. Libero di essere ampliato e venduto.
