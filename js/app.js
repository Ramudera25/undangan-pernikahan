document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 0. FALLBACK GAMBAR (SVG Placeholder Lokal) ---------- */
  function svgPlaceholder(label) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="#F0E9DA"/>
      <circle cx="150" cy="150" r="82" fill="none" stroke="#C5A880" stroke-width="2"/>
      <text x="150" y="160" font-family="Georgia,serif" font-size="22" fill="#8C6A45" text-anchor="middle">${label}</text>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  document.querySelectorAll('img[data-fallback-name]').forEach(img => {
    img.addEventListener('error', function () {
      this.onerror = null;
      this.src = svgPlaceholder(this.dataset.fallbackName);
    });
  });

  /* ---------- 1. TAMU DINAMIS VIA URL (?to= / ?kpd= / ?untuk=) ---------- */
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('kpd') || urlParams.get('untuk');
  if (guestName) {
    const cleanName = decodeURIComponent(guestName).replace(/\+/g, ' ');
    const guestElem = document.getElementById('guest-name');
    const rsvpElem = document.getElementById('rsvp-name');
    const wishElem = document.getElementById('wish-name');

    if (guestElem) guestElem.textContent = cleanName;
    if (rsvpElem) rsvpElem.value = cleanName;
    if (wishElem) wishElem.value = cleanName;
  }

  /* ---------- 2. BUKA UNDANGAN & CONTROL MUSIK ---------- */
  const bgMusic = document.getElementById('bg-music');
  const btnOpen = document.getElementById('btn-open-invitation');
  const coverScreen = document.getElementById('cover-screen');
  const musicBtn = document.getElementById('music-control');
  const musicIcon = document.getElementById('music-icon');
  let isPlaying = false;

  if (btnOpen) {
    btnOpen.addEventListener('click', function () {
      if (coverScreen) coverScreen.classList.add('hide');
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'instant' });

      if (bgMusic) {
        bgMusic.play().then(() => {
          isPlaying = true;
          if (musicBtn) musicBtn.classList.add('rotate-music');
        }).catch(err => console.log('Autoplay diblokir browser:', err));
      }
      if (window.stopPetals) window.stopPetals();
    });
  }

  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', function () {
      if (isPlaying) {
        bgMusic.pause();
        if (musicIcon) {
          musicIcon.innerHTML = '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><line x1="3" y1="3" x2="21" y2="21"/>';
        }
        musicBtn.classList.remove('rotate-music');
      } else {
        bgMusic.play().catch(() => {});
        if (musicIcon) {
          musicIcon.innerHTML = '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>';
        }
        musicBtn.classList.add('rotate-music');
      }
      isPlaying = !isPlaying;
    });
  }

  document.body.style.overflow = 'hidden';

  /* ---------- 3. COUNTDOWN TIMER ---------- */
  const eventDate = new Date('October 24, 2026 08:00:00').getTime();
  const timerContainer = document.getElementById('timer-container');
  function pad(n) { return String(n).padStart(2, '0'); }

  function tickTimer() {
    const diff = eventDate - Date.now();
    if (diff <= 0) {
      if (timerContainer) {
        timerContainer.innerHTML = '<p class="countdown-done">Hari bahagia telah tiba &#10084;</p>';
      }
      return;
    }
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = pad(Math.floor(diff / 86400000));
    if (hoursEl) hoursEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    if (minutesEl) minutesEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
    if (secondsEl) secondsEl.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tickTimer();
  setInterval(tickTimer, 1000);

  /* ---------- 4. RSVP VIA WHATSAPP ---------- */
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value;
      const status = document.getElementById('rsvp-status').value;
      const count = document.getElementById('rsvp-count').value || 1;
      
      const phoneNumber = '628123456789'; // Masukkan nomor WA aktif
      const message = `Halo, saya ${name} mengonfirmasi ${status} untuk acara pernikahan Bayu & Winda di Bojonegoro (Jumlah: ${count} orang). Terima kasih!`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });
  }

  /* ---------- 5. BUKU TAMU (DOM Client-side) ---------- */
  const wishForm = document.getElementById('wish-form');
  if (wishForm) {
    wishForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('wish-name').value;
      const msg = document.getElementById('wish-message').value;
      const container = document.getElementById('wishes-container');
      
      if (container) {
        const item = document.createElement('div');
        item.className = 'wish-item';
        const b = document.createElement('b');
        b.textContent = name;
        const p = document.createElement('p');
        p.textContent = msg;
        item.appendChild(b);
        item.appendChild(p);
        container.prepend(item);
      }
      document.getElementById('wish-message').value = '';
    });
  }

  /* ---------- 6. LIGHTBOX GALERI ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryGrid = document.getElementById('gallery-grid');
  const lightboxClose = document.getElementById('lightbox-close');

  if (galleryGrid) {
    galleryGrid.addEventListener('click', function (e) {
      if (e.target.tagName === 'IMG' && lightbox && lightboxImg) {
        lightboxImg.src = e.target.src;
        lightboxImg.alt = e.target.alt;
        lightbox.classList.add('show');
      }
    });
  }

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('show'));
  }

  /* ---------- 7. REVEAL ON SCROLL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));
});

/* ---------- 8. SALIN NO REKENING ---------- */
window.copyText = function (id) {
  const elem = document.getElementById(id);
  if (!elem) return;
  const text = elem.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Nomor rekening berhasil disalin: ' + text);
  });
};
