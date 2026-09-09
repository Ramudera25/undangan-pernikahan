import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Base URL default mengarah ke GitHub Pages (subpath repo).
// Untuk live preview lokal bisa di-override via env ASTRO_BASE_URL (mis. "/").
const base = process.env.ASTRO_BASE_URL || '/undangan-pernikahan';

export default defineConfig({
  site: 'https://ramudera25.github.io',
  base,
  integrations: [react(), tailwind()],
  vite: {
    server: {
      // Izinkan host preview sandbox (live preview Arena).
      allowedHosts: ['.e2b.app'],
    },
  },
});
