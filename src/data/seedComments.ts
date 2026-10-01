/**
 * Komentar/ucapan awal untuk buku tamu.
 *
 * Dipakai sebagai isi awal GuestBook sebelum ada ucapan dari tamu asli.
 * Catatan: ini data dummy / placeholder — ganti atau kosongkan sebelum
 * undangan disebar ke tamu sungguhan.
 */

import type { GuestComment } from '../utils/commentStore';

export const seedComments: GuestComment[] = [
  {
    id: 'seed-01',
    name: 'Ir. H. Joko Widodo',
    gender: 'L',
    message:
      'Selamat untuk Bayu dan Lilik! Pesan saya sederhana: dalam rumah tangga itu yang penting kerja, kerja, kerja... sama-sama. Semoga sakinah, mawaddah, warahmah!',
    attendance: 'Hadir',
    createdAt: '2026-09-16T10:15:00+07:00',
  },
  {
    id: 'seed-02',
    name: 'Prof. Dr. K.H. Ma’ruf Amin',
    gender: 'L',
    message:
      'Barakallahu laka wa baraka alaika wa jamaa bainakuma fi khair. Saya sudah hitung: hari ini adalah hari paling berkah untuk menikah. Selamat untuk kedua mempelai!',
    attendance: 'Hadir',
    createdAt: '2026-09-17T14:30:00+07:00',
  },
  {
    id: 'seed-03',
    name: 'H. Prabowo Subianto',
    gender: 'L',
    message:
      'Selamat Bayu dan Lilik! Ingat, dalam rumah tangga tidak ada oposisi — semuanya harus koalisi. Semoga langgeng sampai kakek-nenek!',
    attendance: 'Hadir',
    createdAt: '2026-09-19T09:05:00+07:00',
  },
  {
    id: 'seed-04',
    name: 'Khofifah Indar Parawansa',
    gender: 'P',
    message:
      'Turut berbahagia! Semoga pernikahannya seadem hawa Malang dan sehangat sambutan arek Suroboyo. Jawa Timur siap menyambut keluarga baru!',
    attendance: 'Hadir',
    createdAt: '2026-09-21T16:45:00+07:00',
  },
  {
    id: 'seed-05',
    name: 'Gibran Rakabuming Raka',
    gender: 'L',
    message:
      'Selamat Mas Bayu dan Mbak Lilik! Tips dari saya: kalau berantem, yang ngalah duluan itu yang paling sayang. Sudah saya coba sendiri, works 100%.',
    attendance: 'Hadir',
    createdAt: '2026-09-22T11:20:00+07:00',
  },
  {
    id: 'seed-06',
    name: 'Rizky Pratama',
    gender: 'L',
    message:
      'AKHIRNYA! Setelah bertahun-tahun jadi tim hore di kondangan orang, sekarang giliran kita kondangan ke kamu, bro! Selamat Bayu dan Lilik!',
    attendance: 'Hadir',
    createdAt: '2026-09-24T19:10:00+07:00',
  },
  {
    id: 'seed-07',
    name: 'Dewi Anggraini',
    gender: 'P',
    message:
      'Lilik sayang, selamat! Ingat janji kita: yang nikah duluan traktir yang belum. Tagihannya saya kirim via WA ya. Bercanda... atau tidak. Lancar sampai hari H!',
    attendance: 'Hadir',
    createdAt: '2026-09-25T08:35:00+07:00',
  },
  {
    id: 'seed-08',
    name: 'Andi Saputra',
    gender: 'L',
    message:
      'Selamat Bayu! Resmi lulus dari status "tanya mama dulu". Semoga jadi imam yang baik dan tidak lupa jadwal futsal. Sampai jumpa di hari H!',
    attendance: 'Hadir',
    createdAt: '2026-09-27T13:50:00+07:00',
  },
  {
    id: 'seed-09',
    name: 'Maya Putri',
    gender: 'P',
    message:
      'Selamat kalian berdua! Aku sudah siapkan outfit terbaik dan perut kosong khusus untuk prasmanan. Doa terbaik, semoga acaranya semeriah antusiasmeku!',
    attendance: 'Masih Ragu',
    createdAt: '2026-09-28T20:25:00+07:00',
  },
  {
    id: 'seed-10',
    name: 'Budi Santoso',
    gender: 'L',
    message:
      'Bayu, Lilik, selamat! Cuti sudah di-approve bos (doakan tidak di-cancel). Siap jadi tim dokumentasi dadakan — gratis, yang penting makan.',
    attendance: 'Masih Ragu',
    createdAt: '2026-09-29T07:40:00+07:00',
  },
];
