# Undangan Pernikahan — Bayu & Winda (LuxeVow — Jawa Etnik Modern)

Undangan pernikahan digital, dibangun dengan HTML/CSS/JS murni (tanpa framework), tema Jawa Etnik Modern (off-white, charcoal, gold), siap di-hosting gratis di GitHub Pages, Netlify, atau Cloudflare Pages.

## Struktur folder

```text
undangan-pernikahan/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── assets/
    ├── audio/
    │   └── music.mp3       ← belum ada, tambahkan file musikmu di sini
    ├── images/
    │   ├── cover.jpg
    │   ├── groom.jpg
    │   ├── bride.jpg
    │   ├── gallery-1.jpg
    │   ├── gallery-2.jpg
    │   └── gallery-3.jpg
    └── svg/
        └── gunungan.svg
```

## Apa yang diperbaiki pada revisi ini

1. **Bug foto tidak muncul (penyebab utama tampilan sebelumnya "kosong")** — repo sebelumnya punya dua folder gambar yang berbeda: `Images/` (huruf besar, isi lama) dan kode yang memanggil `images/...` (huruf kecil). GitHub Pages itu *case-sensitive*, jadi semua foto gagal tampil. Sekarang seluruh path memakai `assets/images/...` (huruf kecil, konsisten) — **hapus folder `Images/` yang lama dari repo** supaya tidak membingungkan.
2. **Restrukturisasi sesuai dokumentasi (MD)** — sebelumnya semuanya dalam satu `index.html`. Sekarang dipecah jadi `css/style.css` dan `js/app.js`, sesuai arsitektur yang kamu dokumentasikan.
3. **Desain diganti ke tema Jawa Etnik Modern** — palet off-white `#F8F6F0`, charcoal `#2B2625`, gold `#C5A880`; tipografi *Cinzel* (label/aksen) + *Playfair Display* (judul & isi); motif batik halus di layar sampul; ornamen gunungan sebagai aksen; ikon dibuat custom (SVG), tidak lagi bergantung pada FontAwesome dari CDN luar.
4. **Animasi kelopak bunga gugur** ditambahkan di layar sampul memakai `<canvas>`, otomatis nonaktif kalau perangkat pengguna mengaktifkan "reduce motion".
5. **Parameter nama tamu** sekarang mendukung tiga variasi sekaligus: `?to=`, `?kpd=`, dan `?untuk=`.
6. **Fallback gambar aman** — kalau file foto belum diganti/hilang, situs menampilkan placeholder buatan sendiri (bukan menarik dari Unsplash/situs luar).
7. **Keamanan buku tamu** — ucapan tamu dimasukkan lewat `textContent`, bukan `innerHTML`, jadi tidak bisa disalahgunakan untuk menyisipkan kode.
8. **Hitung mundur** dua digit otomatis, dan berganti pesan "Hari bahagia telah tiba" begitu tanggal acara terlewati.
9. Placeholder foto (`cover.jpg`, `groom.jpg`, `bride.jpg`, `gallery-1/2/3.jpg`) sudah disertakan bergaya minimal senada tema, supaya situs tetap tampil rapi sebelum kamu mengganti dengan foto asli.

## Cara pakai / cara upload ke GitHub-mu

1. Buka repo `undangan-pernikahan` di GitHub, **hapus** file `index.html` lama dan folder `Images/` lama.
2. Upload semua file dari paket ini (`index.html`, folder `css/`, `js/`, `assets/`) ke root repo, sambil mempertahankan strukturnya persis seperti di atas (gunakan "Add file → Upload files" lalu drag seluruh folder, atau lewat git di komputer/GitHub Desktop).
3. Ganti foto di `assets/images/` dengan foto asli (nama file harus tetap sama: `cover.jpg`, `groom.jpg`, `bride.jpg`, `gallery-1.jpg`, `gallery-2.jpg`, `gallery-3.jpg`).
4. Tambahkan file musik instrumental bebas royalti ke `assets/audio/music.mp3`.
5. Buka `js/app.js`, cari baris `const phoneNumber = '628123456789';` dan ganti dengan nomor WhatsApp aktif (format `62xxxxxxxxxx`, tanpa tanda `+`).
6. Ganti nama, tanggal, alamat, dan nomor rekening di `index.html` sesuai data asli kalian.
7. Bagikan link dengan `?to=Nama+Tamu` (atau `?kpd=`/`?untuk=`) di akhir URL supaya nama tamu otomatis tampil di sampul.

## Keterbatasan yang masih ada

Buku tamu ("Kirim Ucapan") hanya tersimpan selama sesi kunjungan di browser masing-masing tamu — belum ada penyimpanan terpusat yang terlihat oleh semua pengunjung, karena situs ini murni statis tanpa server. Kalau mau buku tamu benar-benar tersimpan dan terlihat semua orang, perlu tambahan backend gratis seperti Google Apps Script + Google Sheets — beri tahu aku kalau kamu mau ini ditambahkan.
