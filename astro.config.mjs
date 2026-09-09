import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://ramudera25.github.io',
  base: '/undangan-pernikahan',
  integrations: [react(), tailwind()]
});
