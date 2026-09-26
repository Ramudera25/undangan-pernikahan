# 💒 Undangan Pernikahan Digital — Bayu & Lilik

Undangan pernikahan digital berbasis **Astro**, **React**, dan **Tailwind CSS**. Static Site
Generation (SSG), tema biru muda dengan ornamen Jawa bergaris tipis, dan pipeline otomatis
deployment ke GitHub Pages.

---

## ✨ Fitur

- **Cover & nama tamu** — nama tamu dinamis lewat query URL (`?to=Nama+Tamu`).
- **Tema biru muda + ornamen Jawa** — motif *kawung* sebagai tekstur tipis, siluet *gunungan*,
  dan *sulur* sebagai pembatas serta sudut.
- **Tiga acara** — Akad Nikah, Resepsi, dan Ngunduh Mantu, masing-masing dengan alamat,
  petunjuk peta, dan tautan Google Calendar sendiri.
- **Hitung mundur ber-zona waktu** — memakai WIB eksplisit (`+07:00`) dengan tiga status:
  menjelang, sedang berlangsung, dan selesai.
- **Simpan ke kalender** — unduh `.ics` berisi semua acara yang sudah punya jadwal.
- **Animasi foto mempelai** — foto mempelai pria masuk dari kanan, mempelai wanita dari kiri
  (sekali saat masuk layar, nonaktif pada `prefers-reduced-motion`).
- **Kolom komentar tanpa login** — avatar menyesuaikan jenis kelamin yang dipilih (siluet
  laki-laki / perempuan), lalu nama dan isi komentar tampil di bawahnya.
- **Amplop digital** — dua rekening (BRI & SeaBank) dengan tombol salin masing-masing.
- **Toolbar bawah 5 menu** — Home, Mempelai, Tanggal, Galeri, Ucapan, dengan penanda menu
  aktif mengikuti posisi gulir dan ruang aman ponsel.
- **Galeri + lightbox** — navigasi panah/keyboard, caption & `alt` tersinkron, fokus
  dikembalikan ke tombol pemicu saat ditutup.
- **SEO & social preview** — Open Graph, Twitter Card, dan JSON-LD `Event`.
- **CI/CD** — deploy otomatis ke GitHub Pages via GitHub Actions.

---

## 🧭 Mengubah data undangan

**Semua data terpusat di satu file: [`src/data/wedding.ts`](src/data/wedding.ts).**

Cover, halaman utama, kartu acara, file `.ics`, tautan Google Calendar, metadata SEO,
amplop digital, dan RSVP semuanya membaca dari file tersebut, sehingga tidak mungkin
berbeda satu sama lain.

| Ingin mengubah | Ubah di `src/data/wedding.ts` |
| --- | --- |
| Nama panggilan / nama lengkap / orang tua | `couple` |
| Tanggal, jam, tempat, alamat acara | `events` |
| Menandai jadwal sudah resmi | `scheduleConfirmed = true` |
| Nomor rekening | `bankAccounts` |
| Nomor WhatsApp RSVP | `rsvpWhatsApp` |
| Cerita perjalanan | `milestones` |
| Foto galeri | `gallery` |
| Backsound | `music.src` |
| Teks judul & deskripsi SEO | `seo` |

### Data yang masih menunggu kepastian

| Data | Kondisi sekarang |
| --- | --- |
| Tanggal & jam acara | Masih **data contoh** (24 Oktober 2026). Selama `scheduleConfirmed = false`, halaman menampilkan penanda "jadwal contoh / belum dikonfirmasi". |
| Jadwal Ngunduh Mantu | `startISO`/`endISO` masih `null`. Kartu acara menampilkan "Menyusul" dan acara ini belum masuk file `.ics`. Isi kedua field itu agar otomatis ikut masuk kalender. |
| Nomor WhatsApp RSVP | `rsvpWhatsApp = ''`, sehingga tombol kirim RSVP **dinonaktifkan** agar tamu tidak diarahkan ke nomor dummy. |
| Foto mempelai & galeri | Masih foto placeholder. Ganti file di `public/` atau ubah nama file pada `couple.*.photo` dan `gallery`. |
| Backsound | Masih `music.mp3`. Taruh hasil ekstraksi audio dari *Backsound Undangan Digital.mp4* di `public/` lalu ubah `music.src`. Video tidak dimuat sebagai audio agar hemat kuota tamu. |
| Narasi cerita | Disusun dari kerangka yang diberikan (MTs/MA Attanwir, UIN Walisongo, dst.). Ganti teksnya di `milestones` bila ingin memakai kalimat persisnya. |

> **Catatan buku tamu:** tanpa backend, komentar disimpan di `localStorage` perangkat
> pengirim — bukan buku tamu bersama yang terlihat semua tamu. Fitur seperti balasan,
> jumlah suka, dan rekap kehadiran lintas perangkat memerlukan layanan penyimpanan.

---

## 📁 Struktur

```text
undangan-pernikahan/
├── .github/workflows/deploy.yml       # Pipeline build & deploy GitHub Pages
├── public/                            # Foto, musik (disalin apa adanya)
├── src/
│   ├── data/
│   │   └── wedding.ts                 # ⭐ SUMBER DATA TUNGGAL undangan
│   ├── components/
│   │   ├── ornaments/                 # Ornamen Jawa (gunungan, sulur, sudut)
│   │   ├── Avatar.tsx                 # Avatar tamu laki-laki / perempuan
│   │   ├── BottomNav.tsx              # Toolbar bawah 5 menu
│   │   ├── Countdown.tsx              # Hitung mundur 3 status
│   │   ├── Cover.astro                # Sampul undangan
│   │   ├── EventDetail.astro          # Akad, resepsi, ngunduh mantu
│   │   ├── Footer.astro               # Penutup & hak cipta
│   │   ├── Gallery.astro              # Galeri + lightbox
│   │   ├── GiftInfo.astro             # Amplop digital (2 rekening)
│   │   ├── GuestBook.tsx              # RSVP + kolom komentar tanpa login
│   │   ├── Hero.astro                 # Profil kedua mempelai
│   │   ├── LoveStory.astro            # Linimasa perjalanan kasih
│   │   ├── MusicPlayer.tsx            # Pemutar backsound
│   │   ├── PetalsAnimation.astro      # Kelopak biru pucat (canvas)
│   │   └── RevealOnScroll.astro       # Animasi masuk saat digulir
│   ├── layouts/Layout.astro           # Metadata, font, tekstur latar
│   ├── pages/{index,404}.astro
│   ├── styles/theme.css               # Palet, kawung, bingkai foto, arah animasi
│   └── utils/
│       ├── calendar.ts                # Pembuat .ics & tautan Google Calendar
│       ├── commentStore.ts            # Validasi & penyimpanan komentar
│       ├── getGuestName.ts            # Baca `?to=`
│       └── schedule.ts                # Status jadwal, sisa waktu, format WIB
└── tests/                             # Uji perilaku (vitest)
```

---

## 🧑‍💻 Perintah

```bash
npm install
npm run dev         # server pengembangan
npm run build       # build produksi ke dist/
npm run preview     # pratinjau hasil build
npm run check       # pemeriksaan tipe (astro check)
npm test            # uji perilaku (vitest)
```

`npm run check` memeriksa tipe seluruh file `.astro`, `.ts`, dan `.tsx`. `npm test` menjalankan
uji untuk logika jadwal, pembuatan kalender, penyimpanan komentar, dan keutuhan data undangan.

---

## 🎨 Palet tema

| Peran | Warna |
| --- | --- |
| Latar utama | `#F5FAFE` |
| Biru pastel dominan | `#DCEEF8` |
| Permukaan kartu | `#FFFFFF` |
| Garis & bingkai | `#BDD7E8` |
| Aksen tombol | `#426B87` |
| Teks utama | `#243E50` |

Font: **Sacramento** untuk nama panggilan, **Playfair Display** untuk nama lengkap & judul,
**Plus Jakarta Sans** untuk teks isi.

---

## 🔗 Deployment

GitHub Actions membangun dan menerbitkan ke GitHub Pages pada subpath `/undangan-pernikahan`.
Base URL dibaca dari `ASTRO_BASE_URL` (default `/undangan-pernikahan`); untuk pratinjau lokal
di root gunakan `ASTRO_BASE_URL=/ npm run dev`.
