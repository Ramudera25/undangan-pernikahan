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

/** Penanda apakah jadwal di bawah sudah dikonfirmasi pemilik undangan. */
export const scheduleConfirmed = false;

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
   * `null` berarti jadwal belum ditetapkan -> acara tidak dimasukkan ke
   * file .ics maupun tautan Google Calendar sampai datanya diisi.
   */
  startISO: string | null;
  endISO: string | null;
};

export const events: WeddingEvent[] = [
  {
    id: 'akad',
    label: 'Akad Nikah',
    icon: 'ring',
    venue: 'Kediaman Mempelai Wanita',
    address: 'Dk. Kepoh RT 01 RW 03, Desa Nglarangan, Kec. Kanor, Kab. Bojonegoro',
    dateLabel: 'Sabtu, 24 Oktober 2026',
    timeLabel: '08.00 – 10.00 WIB',
    startISO: '2026-10-24T08:00:00+07:00',
    endISO: '2026-10-24T10:00:00+07:00',
  },
  {
    id: 'resepsi',
    label: 'Resepsi Pernikahan',
    icon: 'party',
    venue: 'Kediaman Mempelai Wanita',
    address: 'Dk. Kepoh RT 01 RW 03, Desa Nglarangan, Kec. Kanor, Kab. Bojonegoro',
    dateLabel: 'Sabtu, 24 Oktober 2026',
    timeLabel: '11.00 – 14.00 WIB',
    startISO: '2026-10-24T11:00:00+07:00',
    endISO: '2026-10-24T14:00:00+07:00',
  },
  {
    id: 'ngunduh-mantu',
    label: 'Ngunduh Mantu',
    icon: 'home',
    venue: 'Kediaman Mempelai Pria',
    address: 'Dk. Butoh Lor RT 06 RW 03, Desa Butoh, Kecamatan Sumberrejo, Kab. Bojonegoro',
    dateLabel: 'Menyusul',
    timeLabel: 'Menyusul',
    startISO: null,
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
 * Nomor WhatsApp untuk RSVP, format internasional tanpa tanda "+" (contoh: '6281234567890').
 *
 * Dibiarkan kosong karena nomor aslinya belum diberikan. Selama kosong, tombol
 * kirim RSVP dinonaktifkan agar tamu tidak diarahkan ke nomor dummy.
 */
export const rsvpWhatsApp = '';

/** Pilihan acara yang bisa disebut pada pesan WhatsApp RSVP. */
export const rsvpEventChoices = events.map((e) => e.label);

/** Linimasa "Perjalanan Kasih" — 4 bagian. */
export const milestones = [
  {
    year: '2017',
    title: 'Awal yang Telah Dituliskan',
    icon: 'sparkles',
    text: 'Semua bermula dari halaman yang sama. Dari bangku MTs Attanwir hingga MA Attanwir, langkah kami pernah berpapasan tanpa benar-benar saling menyadari — tumbuh di tempat yang sama, pada waktu yang sama. Perjalanan kemudian membawa kami menempuh ilmu di UIN Walisongo, menata mimpi masing-masing di jalan yang sempat berbeda. Namun di antara sekian banyak nama yang datang lalu pergi, ada dua hati yang Tuhan dekatkan perlahan, hingga akhirnya kami dipertemukan.',
  },
  {
    year: '2022',
    title: 'Bertumbuh dalam Doa',
    icon: 'chat',
    text: 'Tahun-tahun berikutnya adalah tentang memantaskan diri. Kami sibuk dengan karier dan tanggung jawab masing-masing, menjalani hari yang panjang, dan belajar menjadi pribadi yang lebih dewasa. Meski jarang bertegur sapa, nama itu tidak pernah benar-benar hilang — ia tetap tinggal, hadir diam-diam di sela doa yang kami panjatkan setiap malam.',
  },
  {
    year: '2025',
    title: 'Menemukan Jalan Pulang',
    icon: 'heart',
    text: 'Setelah sekian lama menempuh jalan sendiri, kami dipertemukan kembali. Dan kali ini tidak ada yang terasa asing: kami menemukan rumah pada satu sama lain. Dua jiwa yang telah lebih dewasa, lebih tenang, dan lebih siap — akhirnya bersatu bukan karena kebetulan, melainkan karena waktu yang memang sudah tepat.',
  },
  {
    year: '2026',
    title: 'Menuju Ridha-Nya',
    icon: 'rings',
    text: 'Kini perjalanan itu kami lanjutkan dalam ikatan yang lebih suci: pernikahan. Bukan sebagai akhir dari sebuah kisah, melainkan awal dari ibadah yang panjang. Bismillah, semoga setiap langkah kami senantiasa berada dalam ridha-Nya, dan rumah tangga kami menjadi keluarga yang sakinah, mawaddah, warahmah.',
  },
];

/** Galeri foto. Ganti `photo` dengan nama file asli saat foto tersedia. */
export const gallery = [
  { photo: 'gallery-1.jpg', caption: 'Kebersamaan yang hangat', width: 1537, height: 1023 },
  { photo: 'gallery-2.jpg', caption: 'Tawa & cerita kita', width: 1536, height: 1024 },
  { photo: 'groom.jpg', caption: couple.groom.fullName, width: 1254, height: 1254 },
  { photo: 'bride.jpg', caption: couple.bride.fullName, width: 1254, height: 1254 },
  { photo: 'gallery-3.jpg', caption: 'Janji untuk ke depan', width: 1024, height: 1536 },
  { photo: 'cover.jpg', caption: 'Menuju hari bahagia', width: 941, height: 1672 },
];

/**
 * Backsound undangan.
 *
 * Ganti `src` dengan file audio hasil ekstraksi dari "Backsound Undangan Digital.mp4"
 * (mis. `backsound.mp3` / `backsound.m4a`) lalu taruh filenya di `public/`.
 * File video tidak dimuat sebagai audio agar hemat kuota tamu.
 */
export const music = {
  src: 'music.mp3',
  title: 'Backsound Undangan',
};

/** Metadata halaman & berbagi sosial. */
export const seo = {
  title: `Undangan Pernikahan ${couple.shortName}`,
  description: `Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada pernikahan ${couple.groom.fullName} & ${couple.bride.fullName}, di Kediaman Mempelai Wanita, Dk. Kepoh, Desa Nglarangan, Kec. Kanor, Kab. Bojonegoro.`,
  coverImage: 'cover.jpg',
  coverWidth: 941,
  coverHeight: 1672,
};

/** Kunci penyimpanan ucapan di browser + kunci lama yang perlu dimigrasi. */
export const storageKeys = {
  comments: `undangan-${couple.slug}-ucapan`,
  legacyComments: ['undangan-bayu-winda-ucapan'],
};

/** Identitas kalender (.ics). */
export const calendarIdentity = {
  fileName: `undangan-${couple.slug}.ics`,
  productId: `-${couple.shortName} Wedding//ID`,
  uidDomain: `${couple.slug.replace(/-/g, '')}-undangan`,
};
