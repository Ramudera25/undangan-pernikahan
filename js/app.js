document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 0. FALLBACK GAMBAR (tanpa hotlink ke situs luar) ---------- */
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

  // Cover background fallback jika file gambar cover tidak ditemukan
  (function () {
    const test = new Image();
    test.onerror = function () {
      const coverScreen = document.getElementById('cover-screen');
      if (coverScreen) {
        coverScreen.style.backgroundImage =
          'linear-gradient(180deg, rgba(27,23,22,.55) 0%, rgba(27,23,22,.86) 100%), linear-gradient(135deg, #3E2E22, #1B1716)';
      }
    };
    test.src = 'assets/images/cover.jpg';
  })();

  /* ---------- 1. TAMU DINAMIS (?to= / ?kpd= / ?untuk=) ---------- */
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

  /* ---------- 2. BUKA UNDANGAN & AUTOPLAY MUSIK ---------- */
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
      
      // Instant scroll ke atas saat dibuka
      window.scrollTo({ top: 0, behavior: 'instant' });

      if (bgMusic) {
        bgMusic.play().then(() => {
          isPlaying = true;
          if (musicBtn) musicBtn.classList.add('rotate-music');
        }).catch(err => console.log('Autoplay diblokir oleh browser:', err));
      }
      stopPetals();
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

  // Pengunci scroll saat sampul masih tampil
  document.body.style.overflow = 'hidden';

  /* ---------- 3. COUNTDOWN TIMER ---------- */
  const eventDate = new Date('October 24, 2026 08:00:00').getTime();
  const timerContainer = document.getElementById('timer-container');
  function pad(n) { return String(n).padStart(2, '0'); }
  let timerInterval;

  function tickTimer() {
    const diff = eventDate - Date.now();
    if (diff <= 0) {
      if (timerContainer) {
        timerContainer.innerHTML = '<p class="countdown-done">Hari bahagia telah tiba &#10084;</p>';
      }
      clearInterval(timerInterval);
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
  timerInterval = setInterval(tickTimer, 1000);

  /* ---------- 4. RSVP VIA WHATSAPP ---------- */
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value;
      const status = document.getElementById('rsvp-status').value;
      const count = document.getElementById('rsvp-count').value || 1;
      
      const phoneNumber = '628123456789'; // TODO: ganti dengan nomor WA aktif kamu
      const message = `Halo, saya ${name} mengonfirmasi ${status} untuk acara pernikahan Bayu & Winda (Jumlah: ${count} orang). Terima kasih!`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });
  }

  /* ---------- 5. BUKU TAMU ---------- */
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
  if (lightbox) {
    lightbox.addEventListener('click', function (e) { 
      if (e.target === lightbox) lightbox.classList.remove('show'); 
    });
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

  /* ---------- 8. CANVAS: KELOPAK BUNGA GUGUR ---------- */
  const canvas = document.getElementById('petal-canvas');
  if (canvas && coverScreen) {
    const ctx = canvas.getContext('2d');
    let petals = [];
    let petalAnimId = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      canvas.width = coverScreen.clientWidth;
      canvas.height = coverScreen.clientHeight;
    }

    function makePetal() {
      return {
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 60,
        r: 5 + Math.random() * 5,
        speed: 0.6 + Math.random() * 1.1,
        drift: Math.random() * 1.2 - 0.6,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04,
        opacity: 0.5 + Math.random() * 0.4
      };
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = '#E4D3B4';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function petalLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (p.y > canvas.height + 20) {
          Object.assign(p, makePetal(), { y: -20 });
        }
        drawPetal(p);
      });
      petalAnimId = requestAnimationFrame(petalLoop);
    }

    function startPetals() {
      if (reduceMotion) return;
      resizeCanvas();
      petals = Array.from({ length: 26 }, makePetal);
      petalLoop();
    }

    window.stopPetals = function() {
      if (petalAnimId) cancelAnimationFrame(petalAnimId);
    };

    window.addEventListener('resize', () => { 
      if (!coverScreen.classList.contains('hide')) resizeCanvas(); 
    });
    startPetals();
  }
});

/* ---------- 9. SALIN NO REKENING (Global Window Function) ---------- */
window.copyText = function (id) {
  const elem = document.getElementById(id);
  if (!elem) return;
  const text = elem.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Nomor rekening berhasil disalin: ' + text);
  }).catch(err => {
    console.error('Gagal menyalin:', err);
  });
};
