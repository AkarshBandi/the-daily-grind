import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

// Pages are prerendered and served from the ASSETS binding, so visitors still
// hit the edge cache. The Worker only wakes up for routes that opt out with
// `export const prerender = false` — currently /api/contact and the Tina island.
//
// This used to be output: 'static', which cannot host a server route at all.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'server',
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
