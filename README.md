# 💒 Digital Wedding Invitation - Bayu & Winda

Undangan pernikahan digital berbasis web modern yang dibangun menggunakan **Astro**, **React**, dan **Tailwind CSS**. Proyek ini menggunakan pendekatan Single Page Application (SPA) dengan performa Static Site Generation (SSG) super cepat dan sudah dilengkapi pipeline otomatis deployment ke GitHub Pages.

---

## ✨ Fitur Utama

- **Cover & Guest Name**: Menampilkan nama tamu undangan secara dinamis via query URL (`?to=Nama+Tamu`).
- **Interactive Audio Player**: Musik latar otomatis menyala saat tombol "Buka Undangan" diklik.
- **Visual Petals Animation**: Animasi daun/kelopak bunga emas berjatuhan menggunakan Canvas 2D.
- **Reveal-on-Scroll Animation**: Animasi *fade-in* + *slide-up* yang mulus saat elemen masuk viewport.
- **Love Story Timeline**: Linimasa "Perjalanan Kasih" dengan ikon khusus — dari pertama bertemu hingga pernikahan.
- **Foto Prewedding**: Galeri & potret mempelai menggunakan foto *dummy* prewedding yang hangat dan elegan.
- **Real-time Countdown Timer**: Fitur hitung mundur menuju tanggal acara pernikahan.
- **RSVP via WhatsApp**: Form konfirmasi kehadiran terintegrasi langsung ke WhatsApp.
- **Digital Guestbook**: Form ucapan dan doa interaktif dari para tamu.
- **Digital Envelope & Copy Account**: Informasi nomor rekening dengan tombol *copy-to-clipboard*.
- **CI/CD Auto-Deploy**: Deployment otomatis ke GitHub Pages via GitHub Actions.

---

## 📁 Struktur Folder Proyek

```text
wedding-invitation/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline otomatis GitHub Actions untuk build & deploy
├── public/
│   ├── favicon.svg             # Favicon website
│   └── music.mp3               # Audio musik latar undangan
├── src/
│   ├── components/             # Komponen UI (Astro & React)
│   │   ├── Countdown.tsx       # Hitung mundur acara (Client-side)
│   │   ├── Cover.astro         # Tampilan pembuka / cover depan
│   │   ├── EventDetail.astro   # Detail waktu & lokasi (Akad & Resepsi)
│   │   ├── Gallery.astro       # Galeri foto pasangan
│   │   ├── GiftInfo.astro      # Informasi amplop digital & rekening
│   │   ├── GuestBook.tsx       # Form ucapan & RSVP WhatsApp
│   │   ├── Hero.astro          # Informasi utama kedua mempelai
│   │   ├── LoveStory.astro     # Linimasa "Perjalanan Kasih"
│   │   ├── MusicPlayer.tsx     # Floating player audio latar
│   │   ├── PetalsAnimation.astro # Animasi canvas kelopak bunga berjatuhan
│   │   └── RevealOnScroll.astro # Utilitas animasi reveal-on-scroll
│   ├── layouts/
│   │   └── Layout.astro        # Layout utama, fonts, & metadata HTML
│   ├── pages/
│   │   ├── 404.astro           # Halaman fallback 404
│   │   └── index.astro         # Halaman utama undangan
│   └── utils/
│       └── getGuestName.ts     # Utility membaca parameter nama tamu (?to=)
├── astro.config.mjs
├── package.json
└── README.md
