/* ═══════════════════════════════════════════════════════════════════
   BIRTHDAY TEMPLATE — config
   ───────────────────────────────────────────────────────────────────
   This is the ONLY file you edit to make this site about someone else.
   Change: name, from, title, letter, photos, credits, theme.
   Everything else can stay exactly as it is.
   ═══════════════════════════════════════════════════════════════════ */

window.BIRTHDAY = {

  /* ── who it's for ─────────────────────────────────────────────── */
  name:  "Devika",
  from:  "Vivek",
  title: "For Devika",
  kicker: "a small thing, made for you",

  /* ── the card ─────────────────────────────────────────────────── */
  // Shown at the top of the letter.
  letterTop: "a little late, but made with love",

  // The letter itself. Plain text. Blank lines become paragraph breaks.
  letter:
`I know, I know — I'm a little late. But a plain "happy birthday" text felt way too small for someone like you anyway.

So I built you this whole little corner of the internet instead. There's your cake waiting for a wish, a little photo album filled with your memories, and a sticker book for you to fill up piece by piece. Tap around and explore everything — nothing here breaks.

It's funny how eight years can pass, and somehow we still have plenty to talk about. I'm glad we've kept in touch all this time, and I hope there are plenty more conversations, laughs, and random moments ahead.

I hope this new year of your life brings you good things, unexpected adventures, and plenty of reasons to smile. And whatever it is you're wishing for, I hope you get a little closer to it this year.

Happy birthday, Devika! ❤️

Now go make a proper wish and blow out those candles. No shortcuts — I did put in the effort to make the cake, after all.`,

  /* ── the film ─────────────────────────────────────────────────── */
  // Order matters. Add or remove freely.
  photos: [
    { src: "assets/photos/01.jpg", caption: "" },
    { src: "assets/photos/02.jpg", caption: "" },
    { src: "assets/photos/03.jpg", caption: "" },
    { src: "assets/photos/04.jpg", caption: "" },
    { src: "assets/photos/05.jpg", caption: "" },
    { src: "assets/photos/06.jpg", caption: "" },
    { src: "assets/photos/07.png", caption: "" }
  ],
  // Seconds each photo stays on screen.
  filmSpeed: 3,

  // Credits roll. [role, name] pairs.
  credits: [
    ["Lead role",              "Devika"],
    ["Best supporting friend",  "Vivek"],
    ["Cinematography",          "whoever held the phone"],
    ["Wardrobe",                "Devika"],
    ["Special thanks",          "everyone lucky enough to know her"]
  ],
  creditsKicker: "the end — or maybe just the beginning",

  /* ── the table ────────────────────────────────────────────────── */
  cake: "assets/cake.glb",   // set to null to use the drawn cake
  candles: 9,
  theme: "sakura",           // sakura | amber | plum | mint | rose

  /* ── every word on the page ───────────────────────────────────── */
  // Change these to change the template's personality.
  copy: {
    beginLabel:  "open your surprise 💌",
    tableKicker: "",
    posterKicker: "a little party, just for you",
    posterTitle:  "Happy Birthday",
    cardLabel:   "the card",
    cakeLabel:   "",
    cameraLabel: "our film",
    hint:        "tap anything to explore ✨",

    skip:        "skip",
    close:       "put it back",

    cakePopKicker: "one slice, kept aside",
    cakePopTitle:  "here's your birthday cake…",
    cakePopLine:   "Paper, strawberry cream and candles on top. The real one is waiting — and it is all yours.",

    filmHeader:  "original footage",
    exitFilm:    "exit",
    replay:      "watch again",
    wishLabel:   "blow out the candles",

    wishKicker:  "one last thing",
    wishTitle:   "Make a wish, Devika.",
    blowLabel:   "blow out the candles ✨",
    endLine:     "Happy birthday, Devika 💕",
    restart:     "close"
  }

};
