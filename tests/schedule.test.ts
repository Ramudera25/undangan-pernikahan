import { describe, expect, it } from 'vitest';
import {
  formatEventDate,
  formatEventRange,
  getScheduleStatus,
  getTimeLeft,
  icsTimestamp,
  toTimestamp,
} from '../src/utils/schedule';

const AKAH = '2026-10-24T08:00:00+07:00';
const AKAH_END = '2026-10-24T10:00:00+07:00';
const RESEPSI_END = '2026-10-24T14:00:00+07:00';

describe('toTimestamp', () => {
  it('menghitung waktu absolut dari ISO ber-zona WIB', () => {
    // 08.00 WIB == 01.00 UTC
    expect(toTimestamp(AKAH)).toBe(Date.UTC(2026, 9, 24, 1, 0, 0));
  });

  it('mengembalikan null untuk jadwal kosong atau rusak', () => {
    expect(toTimestamp(null)).toBeNull();
    expect(toTimestamp('bukan-tanggal')).toBeNull();
  });
});

describe('getScheduleStatus', () => {
  it('upcoming sebelum acara dimulai', () => {
    const now = Date.UTC(2026, 9, 23, 23, 0, 0);
    expect(getScheduleStatus(AKAH, RESEPSI_END, now)).toBe('upcoming');
  });

  it('ongoing saat berada di antara mulai acara pertama dan selesai acara terakhir', () => {
    expect(getScheduleStatus(AKAH, RESEPSI_END, Date.UTC(2026, 9, 24, 5, 0, 0))).toBe('ongoing');
    // Jeda antar acara (antara akad selesai 03.00 UTC dan resepsi mulai 04.00 UTC)
    expect(getScheduleStatus(AKAH, RESEPSI_END, Date.UTC(2026, 9, 24, 3, 30, 0))).toBe('ongoing');
  });

  it('finished setelah seluruh rangkaian selesai', () => {
    expect(getScheduleStatus(AKAH, RESEPSI_END, Date.UTC(2026, 9, 24, 8, 0, 0))).toBe('finished');
  });

  it('memakai akhir acara itu sendiri saat endISO kosong', () => {
    expect(getScheduleStatus(AKAH, null, Date.UTC(2026, 9, 24, 2, 30, 0))).toBe('finished');
  });

  it('unscheduled bila tidak ada jadwal sama sekali', () => {
    expect(getScheduleStatus(null, null, Date.now())).toBe('unscheduled');
  });
});

describe('getTimeLeft', () => {
  it('memecah selisih waktu menjadi hari/jam/menit/detik', () => {
    const target = Date.UTC(2026, 9, 24, 1, 0, 0);
    const now = target - ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000;
    expect(getTimeLeft(target, now)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
  });

  it('tidak pernah bernilai negatif', () => {
    expect(getTimeLeft(Date.UTC(2020, 0, 1), Date.UTC(2026, 0, 1))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});

describe('icsTimestamp', () => {
  it('mengubah jam WIB menjadi UTC dasar ICS', () => {
    expect(icsTimestamp(AKAH)).toBe('20261024T010000Z');
    expect(icsTimestamp(AKAH_END)).toBe('20261024T030000Z');
    expect(icsTimestamp(RESEPSI_END)).toBe('20261024T070000Z');
  });

  it('menolak tanggal yang tidak valid', () => {
    expect(() => icsTimestamp('2026-13-45T99:00:00+07:00')).toThrow(/tidak valid/);
  });
});

describe('formatEventDate & formatEventRange', () => {
  it('menyajikan tanggal dalam WIB apa pun zona perangkat', () => {
    expect(formatEventDate(AKAH)).toBe('Sabtu, 24 Oktober 2026');
  });

  it('menyajikan rentang jam WIB', () => {
    expect(formatEventRange(AKAH, AKAH_END)).toBe('08.00 – 10.00 WIB');
  });

  it('memakai teks pengganti bila jadwal belum ditetapkan', () => {
    expect(formatEventRange(null, null, 'Menyusul')).toBe('Menyusul');
  });
});
