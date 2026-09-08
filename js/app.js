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