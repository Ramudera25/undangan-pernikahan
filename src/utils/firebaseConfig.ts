/**
 * Konfigurasi Firebase (Realtime Database) untuk Pohon Doa.
 *
 * Nilai-nilai di bawah ini PUBLIC-BY-DESIGN — Firebase menaruhnya di kode
 * client yang dilihat semua pengunjung. Keamanan TIDAK bergantung pada
 * kerahasiaan nilai ini, melainkan pada Security Rules di Firebase Console
 * (baca publik, tulis hanya entri baru yang tervalidasi).
 *
 * Jangan wire getAnalytics: tidak dipakai fitur ini.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyC_pJ27jKoGYD5eDiJnWL3yk8PL_nVn1O8',
  authDomain: 'wish-tree-2f70a.firebaseapp.com',
  databaseURL: 'https://wish-tree-2f70a-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'wish-tree-2f70a',
  appId: '1:456524742422:web:724bcb699f237d7390da37',
} as const;

export type FirebaseConfig = typeof firebaseConfig;
