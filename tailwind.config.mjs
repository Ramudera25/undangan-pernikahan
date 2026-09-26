/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        /* Biru muda lembut — palet utama undangan */
        wedding: {
          50: '#F5FAFE', // latar utama
          100: '#EAF4FB',
          200: '#DCEEF8', // biru pastel dominan
          300: '#BDD7E8', // garis & bingkai
          400: '#8FB6CE',
          500: '#5E8FAE',
          600: '#426B87', // aksen tombol
          700: '#33546C',
          800: '#243E50', // teks utama
        },
        ink: {
          DEFAULT: '#243E50',
          soft: '#55708A',
          muted: '#8296A8',
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
