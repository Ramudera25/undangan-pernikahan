document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true
    });

    // 2. Ambil Parameter Nama Tamu dari URL (Contoh: domain.com/?to=Mas+Dery)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestElement = document.getElementById('guest-name');

    if (guestName) {
        guestElement.textContent = decodeURIComponent(guestName);
    } else {
        guestElement.textContent = "Tamu Undangan";
    }

    // 3. Elemen Kontrol Modal & Musik
    const openingModal = document.getElementById('opening-modal');
    const btnOpen = document.getElementById('btn-open');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicControl = document.getElementById('music-control');
    let isPlaying = false;

    // Kunci Scroll Layar Saat Pertama Kali Dibuka
    document.body.classList.add('no-scroll');

    // 4. Fungsi Klik "Buka Undangan"
    btnOpen.addEventListener('click', () => {
        // Hilangkan Modal secara Smooth
        openingModal.classList.add('fade-out');
        
        // Tampilkan Konten Utama & Buka Akses Scroll
        mainContent.classList.remove('content-hidden');
        document.body.classList.remove('no-scroll');

        // Refresh Animasi AOS setelah konten muncul
        AOS.refresh();

        // Putar Musik Latar
        playAudio();

        // Tampilkan Tombol Floating Audio
        musicControl.classList.remove('hide');
    });

    // 5. Fungsi Putar / Pause Musik
    function playAudio() {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicControl.innerHTML = '<i class="fa-solid fa-disc-linecap fa-spin"></i>';
        }).catch(error => {
            console.log("Autoplay diblokir browser, pengguna harus interaksi dulu:", error);
        });
    }

    function pauseAudio() {
        bgMusic.pause();
        isPlaying = false;
        musicControl.innerHTML = '<i class="fa-solid fa-compact-disc"></i>';
    }

    // Toggle Musik saat Tombol Floating Diklik
    musicControl.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });
});
// Animasi Kelopak Bunga Gugur (Falling Petals Canvas)
(function initPetals() {
    const canvas = document.getElementById('petal-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const petals = Array.from({ length: 25 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 5 + 4,
        speedY: Math.random() * 1 + 0.8,
        speedX: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.6 + 0.2,
        angle: Math.random() * 360
    }));

    function draw() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.angle * Math.PI) / 180);
            ctx.fillStyle = `rgba(197, 168, 128, ${p.opacity})`; // Warna Emas Halus
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();

            p.y += p.speedY;
            p.x += p.speedX;
            p.angle += 0.5;

            if (p.y > height) {
                p.y = -10;
                p.x = Math.random() * width;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
})();
