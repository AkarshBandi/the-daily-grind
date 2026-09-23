import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

// Keep static for blistering-fast CDN; island route stays dynamic
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'static',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  integrations: [mdx(), tina()],
  image: {
    layout: 'constrained',
    remotePatterns: [{ protocol: 'https', hostname: 'assets.tina.io' }],
  },
  vite: {
    plugins: [tinaAdminDevRedirect()],
    ssr: {
      noExternal: ['@tinacms/astro', '@tinacms/bridge'],
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
            warning.exporter === 'tinacms/dist/client'
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
