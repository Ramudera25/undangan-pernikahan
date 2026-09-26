import { describe, expect, it } from 'vitest';
import { buildICS, calendarEvents, googleCalendarUrl, mapsUrl } from '../src/utils/calendar';
import {
  bankAccounts,
  calendarIdentity,
  couple,
  events,
  milestones,
  seo,
  storageKeys,
} from '../src/data/wedding';

describe('calendarEvents', () => {
  it('menyertakan acara terjadwal dan melewati yang belum punya tanggal', () => {
    const list = calendarEvents();
    expect(list.map((e) => e.id)).toEqual(['akad', 'resepsi']);
  });

  it('memakai identitas pasangan baru, bukan data lama', () => {
    const ics = buildICS(calendarEvents());
    expect(ics).toContain(`PRODID:${calendarIdentity.productId}`);
    expect(ics).toContain('Bayu & Lilik');
    expect(ics).not.toContain('Winda');
    expect(ics).toContain('Nglarangan');
    // Ngunduh mantu belum punya jadwal, jadi belum masuk file kalender.
    expect(ics).not.toContain('Dk. Butoh Lor');
  });

  it('menulis jam acara dalam UTC dasar ICS', () => {
    const list = calendarEvents();
    const akad = list.find((e) => e.id === 'akad')!;
    const resepsi = list.find((e) => e.id === 'resepsi')!;
    expect(akad.start).toBe('20261024T010000Z'); // 08.00 WIB
    expect(akad.end).toBe('20261024T030000Z'); // 10.00 WIB
    expect(resepsi.start).toBe('20261024T040000Z'); // 11.00 WIB
    expect(resepsi.end).toBe('20261024T070000Z'); // 14.00 WIB
  });

  it('memakai domain UID identitas baru', () => {
    const ics = buildICS(calendarEvents());
    expect(ics).toContain(`@${calendarIdentity.uidDomain}`);
    expect(ics).not.toContain('bayuwinda');
  });
});

describe('buildICS', () => {
  it('menghasilkan blok VEVENT per acara dengan baris CRLF', () => {
    const ics = buildICS(calendarEvents());
    const blocks = ics.split('BEGIN:VEVENT').length - 1;
    expect(blocks).toBe(2);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
    expect(ics).toContain('\r\n');
  });

  it('meng-escape karakter khusus pada teks', () => {
    const ics = buildICS([
      {
        id: 'uji',
        uid: 'uji',
        summary: 'A, B; C',
        description: 'baris1\nbaris2',
        location: 'Alamat',
        start: '20261024T010000Z',
        end: '20261024T030000Z',
      },
    ]);
    expect(ics).toContain('SUMMARY:A\\, B\\; C');
    expect(ics).toContain('DESCRIPTION:baris1\\nbaris2');
  });
});

describe('googleCalendarUrl & mapsUrl', () => {
  it('membuat satu tautan kalender per acara', () => {
    const url = googleCalendarUrl(calendarEvents()[0]);
    expect(url.startsWith('https://calendar.google.com/calendar/render?')).toBe(true);
    expect(url).toContain('Akad');
    expect(url).toContain('dates=20261024T010000Z%2F20261024T030000Z');
  });

  it('membuat tautan peta dari alamat acara, bukan pin karangan', () => {
    const akad = events[0];
    expect(mapsUrl(`${akad.venue}, ${akad.address}`)).toBe(
      `https://maps.google.com/?q=${encodeURIComponent(`${akad.venue}, ${akad.address}`)}`,
    );
  });
});

describe('data undangan', () => {
  it('memakai identitas mempelai yang baru', () => {
    expect(couple.shortName).toBe('Bayu & Lilik');
    expect(couple.groom.fullName).toBe('Lutva Nanda Bayu Setyawan, S. Sos');
    expect(couple.groom.father).toBe('Bapak Suratno');
    expect(couple.groom.mother).toBe('Ibu Siti Uswatun Hasanah');
    expect(couple.groom.relation).toBe('Putra dari');
    expect(couple.bride.fullName).toBe('Lilik Fajriyah, S. Si., M. Pd');
    expect(couple.bride.father).toBe('Bapak Harji');
    expect(couple.bride.mother).toBe('Ibu Murwati');
    expect(couple.bride.relation).toBe('Putri dari');
  });

  it('punya tiga acara dengan alamat yang benar', () => {
    expect(events).toHaveLength(3);
    expect(events.map((e) => e.id)).toEqual(['akad', 'resepsi', 'ngunduh-mantu']);
    expect(events[0].address).toBe(
      'Dk. Kepoh RT 01 RW 03, Desa Nglarangan, Kec. Kanor, Kab. Bojonegoro',
    );
    expect(events[2].address).toBe(
      'Dk. Butoh Lor RT 06 RW 03, Desa Butoh, Kecamatan Sumberrejo, Kab. Bojonegoro',
    );
    expect(events[2].startISO).toBeNull();
  });

  it('menyimpan semua ISO acara dengan zona waktu WIB eksplisit', () => {
    events.forEach((e) => {
      [e.startISO, e.endISO].forEach((iso) => {
        if (iso === null) return;
        expect(iso.endsWith('+07:00')).toBe(true);
      });
    });
  });

  it('menyajikan dua rekening baru tanpa rekening lama', () => {
    expect(bankAccounts.map((r) => r.number)).toEqual(['127001021403508', '901423216242']);
    expect(bankAccounts.map((r) => r.bank)).toEqual(['BRI', 'SeaBank']);
    expect(bankAccounts[0].holder).toBe('Lilik Fajriyah');
    expect(bankAccounts[1].holder).toBe('Lutva Nanda Bayu Setyawan');
    expect(JSON.stringify(bankAccounts)).not.toContain('8830123456');
  });

  it('memakai identitas penyimpanan & kalender yang baru', () => {
    expect(storageKeys.comments).toBe('undangan-bayu-lilik-ucapan');
    expect(storageKeys.legacyComments).toContain('undangan-bayu-winda-ucapan');
    expect(calendarIdentity.fileName).toBe('undangan-bayu-lilik.ics');
  });

  it('tidak menyisakan nama lama pada metadata', () => {
    expect(`${seo.title} ${seo.description}`).not.toContain('Winda');
    expect(seo.title).toBe('Undangan Pernikahan Bayu & Lilik');
  });

  it('memiliki empat bagian cerita, bukan lima', () => {
    expect(milestones).toHaveLength(4);
    expect(milestones.map((m) => m.year)).toEqual(['2017', '2022', '2025', '2026']);
    expect(milestones[0].text).toContain('Attanwir');
    expect(milestones[0].text).toContain('UIN Walisongo');
    expect(milestones[3].text).toContain('Bismillah');
  });
});
