# 🎀 For Devika — Birthday Sanctuary

A personalized, mobile-first birthday surprise website designed with a **soft coquette & rosé pastel** aesthetic. Created with love by **Vivek** for **Devika**.

---

## ✨ Features & Experiences

### 1. 🕯️ The Midnight Mistletoe Curtain (Intro)
- The site begins in a velvet midnight room with subtle floating fairy dust, keeping the surprise secret until opened.
- A golden hanging cord holds a festive **botanical mistletoe sprig** with winter pearl berries and a satin pink ribbon bow (`🎀`), ending in a golden pull bead.
- **On Mobile & PC**: Tap, click, or pull the cord down to trigger a tactile light-switch click sound, a warm golden expanding light burst, and confetti that dissolves the veil to unveil the surprise!

### 2. 💌 The Door (Landing)
- Glassmorphism landing card: *"For Devika — open your surprise 💌"*.
- Gentle cherry blossom petal rain drifting across the screen.

### 3. 🎂 The Coquette Sanctuary (Main Scene)
- **Victorian Lambeth Cake**: Three-tier ruffle birthday cake piped with *"Devika"*, strawberries, and flickering candle flames. Tap the cake to blow out the candles with sound and confetti!
- **Luxury Satin Love Letter Envelope**: Tap to open the birthday card.
- **Retro Pastel Instax Camera**: Tap to watch the photo film reel.
- **Floating Action Pills**:
  - `COMPLETE STICKER BOOK 📖✨`
  - `OPEN YOUR CARD 💌`

### 4. 📜 The Birthday Letter
- Types out letter with a typewriter effect and authentic paper sounds.
- Displays the custom message acknowledging being one day late with warmth, humor, and sincerity.
- Signed by *Vivek*.

### 5. 🎞️ The Photo Film Reel
- Cinematic photo roll with 3-second transitions per photo.
- Background music playback (`assets/videoplayback.m4a`).
- Film perforation borders, grain, and an end-credits roll starring Devika.

### 6. 📖 The Memory Sticker Book
- **10 Custom Stickers** across 5 themed story chapters:
  - Chapter 1 · Sweet Memories (Stickers #1 & #2)
  - Chapter 2 · Endless Smiles (Stickers #3 & #4)
  - Chapter 3 · Little Adventures (Stickers #5 & #6)
  - Chapter 4 · Golden Hours (Stickers #7 & #8)
  - Chapter 5 · Forever & Always (Stickers #9 & #10)
- **Interactive Gameplay**:
  - **One-Tap Placement**: Tap any sticker in the bottom carousel to automatically place it into its slot!
  - **Touch & Drag**: Supports touch-drag on mobile and native drag-and-drop on desktop.
  - **Live Love EXP Bar**: Tracks progress live (`1 / 10` up to `10 / 10`) with an animated gradient bar.
  - **Auto-Advance**: Pages automatically flip forward once both chapter stickers are placed.
  - **Auto-Scroll Carousel**: Sliders auto-scroll sideways so the next sticker to choose is always in front.
  - **Max Love Celebration**: Completion popup with confetti and a *"VIEW STICKER BOOK AGAIN 📖✨"* button to flip through the completed album anytime.

---

## 🚀 How to Run Locally

Because modern browsers block local audio and textures over `file://`, run a lightweight local server:

### Using Python:
```bash
# In the project directory:
python -m http.server 8000
```
Open **`http://localhost:8000`** in your browser.

---

## 🌐 Deploying to GitHub Pages (To Send to Devika)

Host for free on **GitHub Pages** so Devika can open the link directly on her phone:

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "Happy Birthday Devika 💕"
   ```

2. **Create a Repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name it `for-devika` (or any name you prefer).
   - Keep it **Public**.

3. **Push Code**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/for-devika.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repository **Settings** → **Pages**.
   - Under **Build and deployment** > **Branch**: select `main` and folder `/(root)`.
   - Click **Save**.
   - Your live website link will be: `https://<your-username>.github.io/for-devika/`

---

## 📁 File Structure

```
Birthday/
├── index.html            # Main markup (curtain, door, sanctuary, modals)
├── config.js             # Personalization: name, letter, photos, credits, speed
├── README.md             # Project documentation
│
├── assets/
│   ├── silk_bg.jpg             # Champagne-blush silk fabric background
│   ├── victorian_cake.png      # Victorian Lambeth cake centerpiece
│   ├── luxury_envelope.png     # Satin bow envelope
│   ├── instax_camera.png       # Retro pastel Instax camera
│   ├── videoplayback.m4a       # Film reel background music
│   ├── photos/                 # Devika's photo roll (01.jpg - 07.png)
│   └── stickers/               # 10 character stickers (sticker1.png - sticker10.png)
│
├── css/
│   ├── theme.css         # Color palettes (sakura coquette theme) & typography
│   ├── base.css          # Core layouts, buttons, confetti, petals
│   ├── curtain.css       # Midnight blackout veil, mistletoe rig & light flash
│   ├── table.css         # Coquette phone frame, archway & props
│   ├── card.css          # Typewriter letter card styles
│   ├── film.css          # Photo reel & credits styles
│   └── stickers.css      # Sticker book album, Love EXP bar, and carousel
│
└── js/
    ├── curtain.js        # Mistletoe pull string & click logic
    ├── stickers.js       # Live sticker book, tap-to-place, EXP bar & auto-advance
    ├── audio.js          # Web Audio API sound synthesis (chimes, clicks, puffs)
    ├── film.js           # Film photo player & audio sync
    ├── letter.js         # Typewriter text reveal
    ├── scene.js          # Cake lighting & fallback support
    └── main.js           # Scene transitions & event wiring
```

---

*Made with love for Devika 💕*
