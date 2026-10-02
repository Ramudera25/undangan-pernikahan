# 💒 Undangan Pernikahan Digital — Bayu & Lilik

Undangan pernikahan digital untuk **Lutva Nanda Bayu Setyawan, S. Sos** & **Lilik Fajriyah, S. Si., M. Pd**.
Dibangun dengan **Astro 4** + **React 18** + **Tailwind CSS** (teknologi website modern yang
menghasilkan halaman super cepat), dengan fitur **realtime** — ucapan dan doa tamu tersimpan di
**Firebase** dan langsung terlihat oleh semua pengunjung tanpa perlu me-refresh halaman.

> **Untuk yang bukan programmer:** file terpenting di repo ini adalah `src/data/wedding.ts`.
> Semua teks undangan (nama, tanggal, alamat, rekening, cerita) diambil dari satu file itu —
> jadi untuk mengubah isi undangan, cukup ubah file tersebut (lihat tabel di
> [Mengubah data undangan](#-mengubah-data-undangan)).

## 🌐 Alamat website

| Keterangan | URL |
|---|---|
| **Utama** (Netlify) | https://mykisah-bayulilik.netlify.app/ |
| Cadangan (GitHub Pages) | https://ramudera25.github.io/undangan-pernikahan/ |

Kedua alamat menampilkan situs yang sama. Setiap ada perubahan kode yang di-push ke branch
`main`, keduanya diperbarui otomatis (lihat [Deployment](#-deployment)).

---

## ✨ Fitur

### 💌 Cover — layar pembuka
- Foto mempelai dengan bingkai emas, tanpa gambar amplop.
- Menyapa tamu secara personal: *"Kepada Yth. Bapak/Ibu/Saudara/i"* + nama tamu
  (diambil dari link, lihat [Link tamu personal](#-link-tamu-personal)).
- Tombol **BUKA UNDANGAN** — saat diklik, musik mulai berbunyi dan konfeti emas meledak. 🎊

### 🤵👰 Mempelai
- Foto, nama lengkap, dan nama orang tua kedua mempelai.
- Foto masuk dengan animasi halus dari kiri/kanan saat pertama terlihat di layar.

### ⏳ Hitung mundur (countdown)
- Menghitung mundur ke **Rabu, 21 Oktober 2026 pukul 08.00 WIB**.
- Otomatis berganti status: *menjelang acara* → *sedang berlangsung* → *acara selesai*.

### 🌳 Kisah Kami — "Pohon Kisah"
- Timeline berbentuk **pohon**: batang emas vertikal dengan kartu cerita zigzag kiri-kanan
  (di HP menjadi timeline rapi di sisi kiri).
- 4 babak perjalanan: **2017** *"Awal yang Telah Dituliskan"*, **2022** *"Bertumbuh dalam Doa"*,
  **2025** *"Menemukan Jalan Pulang"*, **2026** *"Menuju Ridha-Nya"* — total **12 foto**.
- **Klik foto mana pun untuk memperbesar** (lightbox): bisa digeser, pakai tombol
  panah/keyboard, tutup dengan tombol ✕ atau tombol ESC.

### 📅 Detail acara (2 acara)
| Acara | Hari/Tanggal | Jam | Tempat |
|---|---|---|---|
| Akad & Resepsi | Rabu, 21 Oktober 2026 | 08.00 – Selesai | Kediaman Mempelai Wanita |
| Ngunduh Mantu | Minggu, 25 Oktober 2026 | 09.00 – Selesai | Kediaman Mempelai Pria |

- Tiap kartu acara punya tombol **Simpan ke Kalender** (unduh file `.ics` / Google Calendar)
  dan **Petunjuk Jalan** (Google Maps).
- RSVP/konfirmasi kehadiran via **WhatsApp** — pesannya terisi otomatis.

### 🧾 Info tamu
Kartu **Dress Code**, **Rundown Acara**, dan **Denah & Parkir** — teks rata tengah
dengan bahasa yang hangat.

### 🖼️ Galeri
- 6 foto dengan lightbox (klik untuk memperbesar, navigasi panah/keyboard).

### 💬 Buku Tamu — Ucapan (realtime 🔥)
- Tamu menulis nama, memilih **Hadir / Tidak Hadir / Masih Ragu**, lalu mengirim ucapan.
- **Tersimpan di Firebase** dan langsung muncul di layar semua pengunjung — ada penanda
  *"realtime"* saat terhubung (atau *"mode lokal"* bila database belum terjangkau).
- Avatar otomatis menyesuaikan pilihan jenis kelamin.
- 10 ucapan contoh bawaan selalu tampil di bawah sebagai pemanis (tidak tersimpan ke database).

### 🙏 Pohon Doa (realtime 🔥)
- Tamu menulis doa, doanya **mekar menjadi bunga di pohon** — juga realtime via Firebase.
- Menampilkan ±300 doa terakhir + 10 doa contoh bawaan.

### 🎁 Hadiah
- **Amplop digital**: rekening **BRI** (a.n. Lilik Fajriyah) dan **SeaBank**
  (a.n. Lutva Nanda Bayu Setyawan), masing-masing dengan tombol **salin nomor**.
- **Kado fisik**: nama penerima + alamat lengkap + tombol **Salin Alamat**.

### 🎵 Musik latar
- Backsound MP3 mulai otomatis begitu tamu membuka undangan; bisa dijeda/diputar ulang
  lewat tombol melayang.

### 🌙 Mode malam & navigasi
- Tombol **mode malam** (tema navy + emas) melayang di atas tombol musik.
- **Navigasi bawah** 6 menu: Home, Mempelai, Tanggal, Galeri, Ucapan, Hadiah —
  menu aktif mengikuti posisi scroll.

### 📣 Bagikan undangan
- Tombol **WhatsApp**, **Telegram**, dan **Salin Link** — link yang dibagikan otomatis
  menyertakan nama tamu yang sedang tampil (`?to=...`).

### 🎨 Ornamen khas Jawa
Mega mendung, gunungan wayang, motif batik kawung, sulur pembatas, dan bunga hias di tiap
section — plus kelopak bunga berjatuhan dan siluet merpati yang mengikuti scroll.

---

## 🔗 Link tamu personal

Tambahkan `?to=Nama+Tamu` di akhir URL agar cover menyapa tamu dengan namanya:

```
https://mykisah-bayulilik.netlify.app/?to=Budi+Santoso
```

Aturan main:
- Spasi ditulis `+` (atau `%20`).
- Alias yang juga bisa dipakai: `?nama=`, `?kpd=`, `?untuk=`.
- Maksimal 60 karakter. Bila tidak diisi, tampil *"Tamu Undangan"*.
- **Keamanan**: nama dibersihkan otomatis dari kode HTML berbahaya
  (`src/utils/getGuestName.ts`) — jadi aman meski link diutak-atik.

> Punya ratusan nama? Minta AI (Gemini/ChatGPT) membuatkan link-nya sekaligus:
> beri daftar nama + instruksi *"buatkan link `https://mykisah-bayulilik.netlify.app/?to=NAMA`
> untuk setiap nama, ganti spasi dengan `+`, tampilkan dalam tabel No | Nama | Link"*.

---

## 🧭 Mengubah data undangan

**Semua data terpusat di `src/data/wedding.ts`** (sumber data tunggal). Ubah di sana,
maka cover, kartu acara, kalender, SEO, dan RSVP ikut berubah otomatis — tidak perlu
mengubah file lain.

| Ingin mengubah… | Ubah di `src/data/wedding.ts` |
|---|---|
| Nama panggilan ("Bayu & Lilik"), inisial | `couple.shortName`, `couple.initials` |
| Nama lengkap & nama orang tua | `couple.groom` / `couple.bride` |
| Tanggal, jam, tempat, alamat acara | `events` (lihat juga `brideHomeAddress` / `groomHomeAddress`) |
| Alamat kediaman mempelai wanita / pria | `brideHomeAddress` / `groomHomeAddress` |
| Nomor rekening & nama pemilik | `bankAccounts` |
| Nomor WhatsApp RSVP | `rsvpWhatsApp` |
| Dress code, rundown, info parkir | `guestInfo` |
| Cerita & foto "Kisah Kami" | milestone di bagian love story (file foto di `public/love-story/`) |
| Foto galeri + caption | `gallery` (file foto di `public/gallery-*.jpg`) |
| Foto mempelai & foto cover | `public/bride.jpg`, `public/groom.jpg`, `public/cover.jpg` |
| Musik latar | `public/music.mp3` (judul di `music`) |
| Judul & deskripsi saat link di-share (WhatsApp) | `seo` (+ `public/og-image.jpg` untuk gambar preview) |

> **Catatan zona waktu:** jadwal memakai format ISO dengan WIB eksplisit,
> mis. `2026-10-21T08:00:00+07:00`. `endISO: null` artinya acara bersifat terbuka
> ("Selesai") — jam selesai tidak ditetapkan.

---

## 🔥 Firebase (database realtime)

Dua fitur memakai Firebase Realtime Database agar data tersimpan permanen dan
terlihat semua tamu secara langsung:

| Fitur | Path database |
|---|---|
| 🙏 Pohon Doa | `doa/undangan-bayu-lilik` |
| 💬 Buku Tamu / Ucapan | `ucapan/undangan-bayu-lilik` |

- **Project:** `wish-tree-2f70a` — region `asia-southeast1`
  (`https://wish-tree-2f70a-default-rtdb.asia-southeast1.firebasedatabase.app`)
- **Aturan keamanan** (`firebase-rules-ucapan.json`), secara konsep:
  - Siapa pun boleh **membaca**.
  - Siapa pun boleh **menambah entri baru** selama isinya valid
    (nama 1–60 karakter, pesan 1–500 karakter, `createdAt` angka,
    pilihan kehadiran & jenis kelamin sesuai daftar, tanpa field tambahan).
  - **Tidak bisa** mengubah atau menghapus entri lewat website
    (penghapusan hanya bisa dari Firebase Console).
- Konfigurasi client ada di `src/utils/firebaseConfig.ts` — ini memang dirancang
  publik (aman dibagikan), yang dijaga adalah **rules** di atas, bukan kuncinya.

### Bila repo ini di-fork untuk undangan lain
1. Buat project baru di [Firebase Console](https://console.firebase.google.com),
   aktifkan **Realtime Database**.
2. Salin konfigurasi project-mu ke `src/utils/firebaseConfig.ts`.
3. Di menu **Rules**, tempel isi `firebase-rules-ucapan.json`
   (ganti `undangan-bayu-lilik` dengan kunci milikmu), lalu **Publish**.
4. Samakan kunci path di `src/utils/firebaseBlessingAdapter.ts`
   (`BLESSING_DB_PATH`) dan `src/utils/firebaseUcapanAdapter.ts`
   (`UCAPAN_DB_PATH`).

---

## 📁 Struktur proyek

```
undangan-pernikahan/
├── public/                  # File statis (foto, musik) — disalin apa adanya
│   ├── bride.jpg / groom.jpg / cover.jpg   # Foto mempelai & cover
│   ├── gallery-1..3.jpg     # Foto galeri
│   ├── love-story/          # 12 foto Kisah Kami (3 foto × 4 tahun)
│   ├── music.mp3            # Backsound undangan
│   └── og-image.jpg         # Gambar preview saat link di-share
├── src/
│   ├── data/
│   │   ├── wedding.ts       # ⭐ SUMBER DATA TUNGGAL (lihat tabel di atas)
│   │   └── seedComments.ts  # 10 ucapan/doa contoh bawaan
│   ├── components/          # Komponen tampilan
│   │   ├── Cover.astro      # Layar pembuka + nama tamu + tombol buka
│   │   ├── Hero.astro       # Nama & foto mempelai
│   │   ├── Countdown.tsx    # Hitung mundur (React)
│   │   ├── LoveStory.astro  # Pohon Kisah + lightbox foto
│   │   ├── EventDetail.astro# Kartu 2 acara + kalender + Maps + RSVP
│   │   ├── GuestInfo.astro  # Dress code, rundown, parkir
│   │   ├── Gallery.astro    # Galeri foto + lightbox
│   │   ├── GuestBook.tsx    # Buku Tamu realtime (React + Firebase)
│   │   ├── PrayerTree.tsx   # Pohon Doa realtime (React + Firebase)
│   │   ├── GiftInfo.astro   # Amplop digital + kado fisik
│   │   ├── Footer.astro     # Penutup + tombol bagikan
│   │   ├── BottomNav.tsx    # Navigasi bawah 6 menu (React)
│   │   ├── MusicPlayer.tsx  # Pemutar backsound (React)
│   │   ├── ThemeToggle.tsx  # Saklar mode malam (React)
│   │   ├── ShareButtons.astro # Bagikan WA/Telegram/salin link
│   │   ├── PetalsAnimation.astro # Kelopak bunga berjatuhan
│   │   ├── GoldConfetti.astro    # Konfeti emas saat undangan dibuka
│   │   ├── DoveFollow.astro      # Merpati mengikuti scroll
│   │   ├── Preloader.astro  # Layar loading monogram
│   │   ├── RevealOnScroll.astro  # Animasi muncul saat scroll
│   │   ├── ScrollHint.astro # Petunjuk scroll
│   │   ├── Avatar.tsx       # Avatar siluet sesuai jenis kelamin
│   │   └── ornaments/       # Ornamen Jawa (SVG garis tipis):
│   │       ├── MegaMendung.astro  # Awan batik Cirebon
│   │       ├── Gunungan.astro     # Siluet kayon wayang
│   │       ├── JavaneseBatik.astro# Motif kawung + batik geometris
│   │       ├── BungaHias.astro / FlowerOrnament.tsx # Rangkaian bunga
│   │       ├── SulurDivider.astro # Pembatas sulur + gunungan kecil
│   │       └── CornerSulur.astro  # Sulur sudut pembingkai kartu
│   ├── layouts/Layout.astro # Kerangka HTML + font + SEO/Open Graph
│   ├── pages/
│   │   ├── index.astro      # Halaman utama (urutan section)
│   │   └── 404.astro        # Halaman "tidak ditemukan"
│   ├── styles/theme.css     # Palet warna, font, animasi, mode malam
│   └── utils/
│       ├── firebaseConfig.ts        # Konfigurasi Firebase client
│       ├── firebaseBlessingAdapter.ts # Baca/tulis Pohon Doa
│       ├── firebaseUcapanAdapter.ts  # Baca/tulis Buku Tamu
│       ├── blessingAdapter.ts / commentStore.ts # Adapter & tipe data
│       ├── getGuestName.ts  # Nama tamu dari `?to=` + sanitasi
│       ├── calendar.ts      # File .ics & link Google Calendar
│       └── schedule.ts      # Status acara (menjelang/berlangsung/selesai)
├── tests/                   # 71 test otomatis (Vitest)
├── netlify.toml             # Konfigurasi deploy Netlify
├── firebase-rules-ucapan.json # Rules keamanan Firebase (siap tempel)
└── .github/workflows/deploy.yml # Deploy otomatis ke GitHub Pages
```

---

## 🧑‍💻 Perintah

**Prasyarat:** Node.js 20 (cek dengan `node -v`), lalu install dependensi sekali:

```bash
npm install
```

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan website di komputer sendiri untuk dicoba-coba (`http://localhost:4321`) |
| `npm run build` | Bangun versi final siap tayang (hasilnya di folder `dist/`) |
| `npm run preview` | Pratinjau hasil `build` secara lokal |
| `npm run check` | Periksa kesalahan TypeScript/templating (`astro check`) |
| `npm test` | Jalankan 71 test otomatis (Vitest) |

---

## 🎨 Tema

- **Mode siang:** biru muda lembut sebagai warna utama —
  latar `#F5FAFE`, biru pastel dominan, teks utama biru-tua keabuan `#243E50`.
- **Mode malam:** navy gelap (`#09111C`) dengan aksen **emas** (`#C9A24B`).
- **Aksen emas** dipakai hemat: teks gradasi emas, garis pemisah, bingkai foto
  model *arch* (jendela klasik) di Kisah Kami, dan konfeti.
- **Font:** *Playfair Display* untuk judul/nama (serif elegan),
  *Plus Jakarta Sans* untuk teks isi (mudah dibaca),
  *Sacramento* untuk aksen tulisan tangan (script).
- Motif **kawung** sebagai tekstur latar yang sangat tipis.

---

## 🚀 Deployment

Ada **dua** tujuan deploy yang aktif — keduanya diperbarui otomatis setiap ada push
ke branch `main`:

| | GitHub Pages (cadangan) | Netlify (utama) |
|---|---|---|
| URL | `https://ramudera25.github.io/undangan-pernikahan/` | https://mykisah-bayulilik.netlify.app/ |
| Konfigurasi | `.github/workflows/deploy.yml` | `netlify.toml` |
| Base path | `/undangan-pernikahan` (subpath) | `/` (root domain) |
| Cara kerja | GitHub Actions: `npm ci` → `npm run build` → publish `dist/` | Build otomatis dari repo: `npm run build`, publish `dist/` |

Perbedaan base path diatasi tanpa mengubah kode: `astro.config.mjs` membaca
environment variable —
`ASTRO_BASE_URL` (default `/undangan-pernikahan`) dan
`ASTRO_SITE_URL` (default `https://ramudera25.github.io`).
Netlify menyetel keduanya lewat `netlify.toml`:

```toml
[build.environment]
  NODE_VERSION = "20"
  ASTRO_BASE_URL = "/"
  ASTRO_SITE_URL = "https://mykisah-bayulilik.netlify.app"
```

`ASTRO_SITE_URL` penting agar gambar preview WhatsApp (`og:image`) dan canonical
menunjuk ke domain yang benar di masing-masing deploy.

---

## 🧪 Testing

**71 test** Vitest (`tests/`) — semuanya harus hijau sebelum push:

- `firebaseBlessingAdapter.test.ts` / `firebaseUcapanAdapter.test.ts` —
  validasi bentuk data & aturan tulis Firebase.
- `blessingAdapter.test.ts` / `commentStore.test.ts` — logika gabungan
  data tamu + seed, anti-duplikat, urutan terbaru.
- `calendar.test.ts` — format file `.ics` & link Google Calendar sesuai data acara.
- `schedule.test.ts` — status acara (menjelang / berlangsung / selesai).

```bash
npm test        # sekali jalan
npm run check   # astro check — 0 error, 0 warning
```

---

*Dibuat dengan ♥ untuk pernikahan Bayu & Lilik — 21 & 25 Oktober 2026.*
