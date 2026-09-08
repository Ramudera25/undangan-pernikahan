# Undangan Pernikahan — Bayu & Winda

Undangan pernikahan digital satu-file (HTML/CSS/JS polos), gratis untuk di-hosting di GitHub Pages, Netlify, atau Cloudflare Pages.

## Cara pakai
1. Ganti nama, tanggal, alamat, dan nomor WA (`phoneNumber` di dalam `index.html`) sesuai data asli.
2. Ganti foto di folder `images/` (nama file: `cover.jpg`, `groom.jpg`, `bride.jpg`, `gallery-1.jpg`, `gallery-2.jpg`, `gallery-3.jpg`).
3. Ganti `music.mp3` dengan musik instrumental bebas royalti pilihanmu.
4. Bagikan link dengan `?kpd=Nama+Tamu` di akhir URL supaya nama tamu otomatis tampil di sampul.

## Perubahan pada revisi ini
- **Bug foto tidak muncul**: folder gambar sebelumnya bernama `Images` (huruf besar) dan nama file mengandung spasi (`foto galeri1.jpg`, `mempelai pria.jpg`), tidak sinkron dengan kode yang memanggil `images/galeri1.jpg` dst. GitHub Pages bersifat case-sensitive sehingga foto selalu gagal tampil. Sudah dirapikan jadi folder `images/` dengan nama file konsisten.
- **Galeri 4 foto vs 3 file**: kode sebelumnya memanggil 4 foto galeri padahal hanya ada 3 file — sudah disesuaikan.
- **Celah keamanan kecil**: ucapan buku tamu sebelumnya dimasukkan ke halaman lewat `innerHTML` (bisa disalahgunakan menyisipkan kode). Sekarang memakai `textContent` yang aman.
- **Fallback gambar**: sebelumnya kalau foto gagal dimuat, situs menarik foto acak dari Unsplash. Sekarang fallback-nya adalah placeholder buatan sendiri (SVG lokal), jadi tidak bergantung pada situs luar.
- **Hitung mundur**: sekarang angka selalu dua digit (misalnya `05` bukan `5`), dan otomatis berganti pesan "Hari bahagia telah tiba" saat tanggal acara terlewati.
- Tambahan: efek transisi & reveal-on-scroll, lightbox galeri (klik foto untuk perbesar), meta tag Open Graph supaya preview link di WhatsApp lebih rapi, favicon monogram, dan desain ulang (palet wine & gold, tipografi diperhalus, tidak lagi kartu putih seragam di tiap section).

## Keterbatasan yang masih ada
Buku tamu ("Kirim Ucapan") hanya tersimpan selama sesi kunjungan di browser masing-masing tamu — belum ada penyimpanan terpusat yang terlihat oleh semua pengunjung, karena situs ini murni statis tanpa server. Kalau mau buku tamu benar-benar tersimpan dan terlihat semua orang, perlu tambahan backend gratis seperti Google Apps Script + Google Sheets.
