/**
 * SUMBER DATA TUNGGAL (single source of truth) undangan.
 *
 * Semua teks identitas, acara, rekening, cerita, galeri, dan metadata
 * diambil dari file ini supaya cover, halaman utama, kalender (.ics),
 * metadata SEO, dan RSVP tidak bisa berbeda satu sama lain.
 *
 * Cara memperbarui undangan: ubah nilai di file ini saja.
 */

/** Pasangan & identitas */
export const couple = {
  /** Nama panggilan yang tampil besar di cover / footer / judul tab. */
  shortName: 'Bayu & Lilik',
  /** Dipakai untuk nama file, kunci penyimpanan, dan identitas kalender. */
  slug: 'bayu-lilik',
  initials: 'BL',

  groom: {
    nickname: 'Bayu',
    fullName: 'Lutva Nanda Bayu Setyawan, S. Sos',
    /** "Putra dari" — urutan anak sengaja tidak diisi karena belum ada datanya. */
    relation: 'Putra dari',
    father: 'Bapak Suratno',
    mother: 'Ibu Siti Uswatun Hasanah',
    photo: 'groom.jpg',
  },

  bride: {
    nickname: 'Lilik',
    fullName: 'Lilik Fajriyah, S. Si., M. Pd',
    relation: 'Putri dari',
    father: 'Bapak Harji',
    mother: 'Ibu Murwati',
    photo: 'bride.jpg',
  },
} as const;

export type WeddingEvent = {
  id: string;
  label: string;
  icon: 'ring' | 'party' | 'home';
  venue: string;
  address: string;
  /** Teks tanggal yang tampil di kartu acara. */
  dateLabel: string;
  /** Teks jam yang tampil di kartu acara. */
  timeLabel: string;
  /**
   * ISO 8601 dengan zona waktu eksplisit WIB (+07:00).
   * `endISO: null` berarti acara bersifat TERBUKA ("Selesai") — jam selesai
   * tidak ditetapkan, tetapi acara tetap masuk kalender (lihat calendar.ts).
   * `startISO: null` berarti jadwal belum ditetapkan -> acara tidak dimasukkan
   * ke file .ics maupun tautan Google Calendar sampai datanya diisi.
   */
  startISO: string | null;
  endISO: string | null;
};

/**
 * Alamat kediaman mempelai WANITA (Lilik) — lokasi Akad & Resepsi
 * sekaligus alamat pengiriman kado fisik.
 */
export const brideHomeAddress =
  'Dk. Kepoh RT 01 RW 03, Desa Nglarangan, Kec. Kanor, Kab. Bojonegoro, Jawa Timur';

/**
 * Alamat kediaman mempelai PRIA (Bayu) — lokasi Ngunduh Mantu.
 * Catatan: masih memakai alamat lama Butoh; menunggu konfirmasi alamat baru.
 */
export const groomHomeAddress =
  'Dk. Butoh Lor RT 06 RW 03, Desa Butoh, Kecamatan Sumberrejo, Kab. Bojonegoro, Jawa Timur';

export const events: WeddingEvent[] = [
  {
    id: 'akad-resepsi',
    label: 'Akad & Resepsi',
    icon: 'ring',
    venue: 'Kediaman Mempelai Wanita',
    address: brideHomeAddress,
    dateLabel: 'Rabu, 21 Oktober 2026',
    timeLabel: '08.00 – Selesai',
    startISO: '2026-10-21T08:00:00+07:00',
    endISO: null,
  },
  {
    id: 'ngunduh-mantu',
    label: 'Ngunduh Mantu',
    icon: 'home',
    venue: 'Kediaman Mempelai Pria',
    address: groomHomeAddress,
    dateLabel: 'Minggu, 25 Oktober 2026',
    timeLabel: '09.00 – Selesai',
    startISO: '2026-10-25T09:00:00+07:00',
    endISO: null,
  },
];

/** Acara yang dipakai sebagai target hitung mundur (acara terjadwal paling awal). */
export const countdownEvent =
  events.find((e) => e.startISO !== null) ?? events[0];

/** Acara terakhir yang punya jam — dipakai untuk status "sedang berlangsung". */
export const lastScheduledEvent = [...events]
  .filter((e) => e.endISO !== null)
  .pop();

/** Amplop digital — satu tombol salin per rekening. */
export const bankAccounts = [
  {
    bank: 'BRI',
    number: '127001021403508',
    holder: couple.bride.fullName.split(',')[0].trim(),
  },
  {
    bank: 'SeaBank',
    number: '901423216242',
    holder: couple.groom.fullName.split(',')[0].trim(),
  },
] as const;

/**
 * Nomor WhatsApp untuk RSVP, format internasional tanpa tanda "+".
 * Konfirmasi kehadiran dibuka via wa.me dengan pesan terisi otomatis;
 * bila dikosongkan lagi, konfirmasi disimpan di localStorage perangkat tamu.
 */
export const rsvpWhatsApp = '6288215645161';

/** Pilihan acara yang bisa disebut pada pesan WhatsApp RSVP. */
export const rsvpEventChoices = events.map((e) => e.label);

/** Info praktis untuk tamu: dress code, rundown, dan parkir. */
export const guestInfo = {
  dressCode: {
    title: 'Dress Code',
    text: 'Tampil terbaik dengan batik atau busana muslim yang sopan dan rapi — kami tak sabar menyambut kehadiran Anda dengan penuh sukacita.',
  },
  /** Rundown diturunkan otomatis dari jam acara di atas. */
  rundown: {
    title: 'Rundown Acara',
    items: events
      .filter((e) => e.startISO !== null)
      .map((e) => ({ time: e.timeLabel, label: e.label })),
  },
  parking: {
    title: 'Denah & Parkir',
    text: 'Tak perlu khawatir soal kendaraan — area parkir tersedia di sekitar lokasi acara, dan tim panitia kami yang ramah akan dengan senang hati mengarahkan Anda setibanya di sana.',
  },
};

/** Linimasa "Perjalanan Kasih" — 4 bagian, tiap bagian memakai foto asli pasangan. */
export const milestones = [
  {
    year: '2017',
    title: 'Awal yang Telah Dituliskan',
    photos: [
      { src: 'love-story/2017-1-koridor-sekolah.jpg', alt: 'Bayu dan Lilik berpapasan di koridor sekolah' },
      { src: 'love-story/2017-2-tangga-sekolah.jpg', alt: 'Bayu dan Lilik menuruni tangga sekolah' },
      { src: 'love-story/2017-3-kelas.jpg', alt: 'Bayu dan Lilik belajar di kelas yang sama' },
    ],
    text: 'Semua bermula dari halaman yang sama. Dari bangku MTs Attanwir hingga MA Attanwir, langkah kami pernah berpapasan tanpa benar-benar saling menyadari — tumbuh di tempat yang sama, pada waktu yang sama. Perjalanan kemudian membawa kami menempuh ilmu di UIN Walisongo, menata mimpi masing-masing di jalan yang sempat berbeda. Namun di antara sekian banyak nama yang datang lalu pergi, ada dua hati yang Tuhan dekatkan perlahan, hingga akhirnya kami dipertemukan.',
  },
  {
    year: '2022',
    title: 'Bertumbuh dalam Doa',
    photos: [
      { src: 'love-story/2022-1-perpustakaan-almamater.jpg', alt: 'Bayu dan Lilik beralmamater kuning-hijau duduk bersama di perpustakaan UIN Walisongo' },
      { src: 'love-story/2022-2-perpustakaan-tatap.jpg', alt: 'Bayu dan Lilik bertatap muka di perpustakaan kampus' },
      { src: 'love-story/2022-3-perpustakaan-tawa.jpg', alt: 'Bayu dan Lilik tertawa bersama di perpustakaan' },
    ],
    text: 'Tahun-tahun berikutnya adalah tentang memantaskan diri. Kami sibuk dengan karier dan tanggung jawab masing-masing, menjalani hari yang panjang, dan belajar menjadi pribadi yang lebih dewasa. Meski jarang bertegur sapa, nama itu tidak pernah benar-benar hilang — ia tetap tinggal, hadir diam-diam di sela doa yang kami panjatkan setiap malam.',
  },
  {
    year: '2025',
    title: 'Menemukan Jalan Pulang',
    photos: [
      { src: 'love-story/2025-1-jalan-raya-malam.jpg', alt: 'Bayu dan Lilik berjalan di jalan raya pada malam hari' },
      { src: 'love-story/2025-2-perjalanan-terpisah.jpg', alt: 'Bayu dan Lilik menempuh perjalanan masing-masing' },
      { src: 'love-story/2025-3-lembur-malam.jpg', alt: 'Lilik bekerja lembur di malam hari' },
    ],
    text: 'Setelah sekian lama menempuh jalan sendiri, kami dipertemukan kembali. Dan kali ini tidak ada yang terasa asing: kami menemukan rumah pada satu sama lain. Dua jiwa yang telah lebih dewasa, lebih tenang, dan lebih siap — akhirnya bersatu bukan karena kebetulan, melainkan karena waktu yang memang sudah tepat.',
  },
  {
    year: '2026',
    title: 'Menuju Ridha-Nya',
    photos: [
      { src: 'love-story/2026-1-doa-bayu.jpg', alt: 'Bayu berdoa dengan khusyuk' },
      { src: 'love-story/2026-2-doa-lilik.jpg', alt: 'Lilik berdoa dengan khusyuk' },
      { src: 'love-story/2026-3-pintu-rumah.jpg', alt: 'Bayu dan Lilik dalam busana Jawa di depan pintu rumah' },
    ],
    text: 'Kini perjalanan itu kami lanjutkan dalam ikatan yang lebih suci: pernikahan. Bukan sebagai akhir dari sebuah kisah, melainkan awal dari ibadah yang panjang. Bismillah, semoga setiap langkah kami senantiasa berada dalam ridha-Nya, dan rumah tangga kami menjadi keluarga yang sakinah, mawaddah, warahmah.',
  },
];

/** Galeri foto — foto asli pasangan (foto prewedding). */
export const gallery = [
  { photo: 'gallery-1.jpg', caption: 'Momen mesra berdua', width: 799, height: 1200 },
  { photo: 'gallery-2.jpg', caption: 'Tawa & cerita kita', width: 800, height: 1200 },
  { photo: 'groom.jpg', caption: couple.groom.fullName, width: 1080, height: 1080 },
  { photo: 'bride.jpg', caption: couple.bride.fullName, width: 1080, height: 1080 },
  { photo: 'gallery-3.jpg', caption: 'Syukur menuju bahagia', width: 800, height: 1200 },
  { photo: 'cover.jpg', caption: 'Menuju hari bahagia', width: 1080, height: 1623 },
];

/**
 * Backsound undangan.
 *
 * File: `public/music.mp3` — "Backsound Undangan Digital" (MP3 128 kbps,
 * durasi ±3:09, ±3 MB — cukup ringan untuk web, diputar berulang/loop).
 */
export const music = {
  src: 'music.mp3',
  title: 'Backsound Undangan Digital',
};

/** Metadata halaman & berbagi sosial. */
export const seo = {
  title: `Undangan Pernikahan ${couple.shortName}`,
  description: `Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada pernikahan ${couple.groom.fullName} & ${couple.bride.fullName}, di Kediaman Mempelai Wanita, Dk. Kepoh RT 01 RW 03, Desa Nglarangan, Kec. Kanor, Kab. Bojonegoro.`,
  coverImage: 'cover.jpg',
  coverWidth: 1080,
  coverHeight: 1623,
};

/** Kunci penyimpanan ucapan di browser + kunci lama yang perlu dimigrasi. */
export const storageKeys = {
  comments: `undangan-${couple.slug}-ucapan`,
  legacyComments: ['undangan-bayu-winda-ucapan'],
  /** Kunci penyimpanan konfirmasi kehadiran (RSVP) lokal di browser tamu. */
  rsvp: 'undangan-bayu-lilik-rsvp',
};

/** Identitas kalender (.ics). */
export const calendarIdentity = {
  fileName: `undangan-${couple.slug}.ics`,
  productId: `-${couple.shortName} Wedding//ID`,
  uidDomain: `${couple.slug.replace(/-/g, '')}-undangan`,
};
