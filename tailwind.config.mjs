/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        /* Biru muda lembut — palet utama undangan.
           Nilai memakai CSS variable (lihat :root / html.dark di theme.css)
           supaya mode malam bisa menukar seluruh palet tanpa mengubah komponen. */
        wedding: {
          50: 'rgb(var(--w-50) / <alpha-value>)', // latar utama
          100: 'rgb(var(--w-100) / <alpha-value>)',
          200: 'rgb(var(--w-200) / <alpha-value>)', // biru pastel dominan
          300: 'rgb(var(--w-300) / <alpha-value>)', // garis & bingkai
          400: 'rgb(var(--w-400) / <alpha-value>)',
          500: 'rgb(var(--w-500) / <alpha-value>)',
          600: 'rgb(var(--w-600) / <alpha-value>)', // aksen tombol
          700: 'rgb(var(--w-700) / <alpha-value>)',
          800: 'rgb(var(--w-800) / <alpha-value>)', // teks utama / section gelap
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
        },
        /* Emas — aksen hemat di atas dasar biru muda (tetap sama di mode malam) */
        gold: {
          DEFAULT: 'rgb(var(--gold) / <alpha-value>)',
          light: 'rgb(var(--gold-light) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['Sacramento', '"Segoe Script"', 'cursive'],
      },
    },
  },
  plugins: [],
};
