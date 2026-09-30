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
      'Selamat menempuh hidup baru untuk Bayu dan Lilik. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
    attendance: 'Hadir',
    createdAt: '2026-09-16T10:15:00+07:00',
  },
  {
    id: 'seed-02',
    name: 'Prof. Dr. K.H. Ma\u2019ruf Amin',
    gender: 'L',
    message:
      'Barakallahu laka wa baraka alaika wa jamaa bainakuma fi khair. Selamat untuk kedua mempelai, semoga pernikahannya penuh berkah.',
    attendance: 'Hadir',
    createdAt: '2026-09-17T14:30:00+07:00',
  },
  {
    id: 'seed-03',
    name: 'H. Prabowo Subianto',
    gender: 'L',
    message:
      'Selamat berbahagia untuk Bayu dan Lilik. Semoga rumah tangga yang dibangun langgeng hingga ke anak cucu.',
    attendance: 'Hadir',
    createdAt: '2026-09-19T09:05:00+07:00',
  },
  {
    id: 'seed-04',
    name: 'Khofifah Indar Parawansa',
    gender: 'P',
    message:
      'Turut berbahagia atas pernikahan Bayu dan Lilik. Semoga Allah SWT memberkahi dan menjadikan keduanya pasangan yang saling menguatkan.',
    attendance: 'Hadir',
    createdAt: '2026-09-21T16:45:00+07:00',
  },
  {
    id: 'seed-05',
    name: 'Gibran Rakabuming Raka',
    gender: 'L',
    message:
      'Selamat untuk Bayu dan Lilik! Semoga acaranya lancar dan menjadi awal yang baik untuk perjalanan panjang ke depan.',
    attendance: 'Hadir',
    createdAt: '2026-09-22T11:20:00+07:00',
  },
  {
    id: 'seed-06',
    name: 'Rizky Pratama',
    gender: 'L',
    message:
      'Akhirnya hari yang ditunggu-tunggu tiba! Selamat bro Bayu dan Mbak Lilik, sampai ketemu di hari H ya!',
    attendance: 'Hadir',
    createdAt: '2026-09-24T19:10:00+07:00',
  },
  {
    id: 'seed-07',
    name: 'Dewi Anggraini',
    gender: 'P',
    message:
      'MasyaAllah, ikut senang banget dengar kabar bahagia ini. Selamat ya Lilik sayang, semoga lancar sampai hari H!',
    attendance: 'Hadir',
    createdAt: '2026-09-25T08:35:00+07:00',
  },
  {
    id: 'seed-08',
    name: 'Andi Saputra',
    gender: 'L',
    message:
      'Wah, selamat Bayu! Semoga jadi keluarga yang bahagia selalu. Kabari kalau butuh bantuan pas acara ya.',
    attendance: 'Hadir',
    createdAt: '2026-09-27T13:50:00+07:00',
  },
  {
    id: 'seed-09',
    name: 'Maya Putri',
    gender: 'P',
    message:
      'Selamat untuk kalian berdua! Pengen banget datang, tapi masih nunggu kepastian jadwal. Doaku yang terbaik untuk kalian!',
    attendance: 'Masih Ragu',
    createdAt: '2026-09-28T20:25:00+07:00',
  },
  {
    id: 'seed-10',
    name: 'Budi Santoso',
    gender: 'L',
    message:
      'Selamat menempuh hidup baru, Bayu dan Lilik! Semoga acaranya meriah dan berkesan. Masih usaha atur cuti biar bisa hadir.',
    attendance: 'Masih Ragu',
    createdAt: '2026-09-29T07:40:00+07:00',
  },
];
