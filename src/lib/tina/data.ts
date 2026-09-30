import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../../tina/__generated__/client';
import { load as yamlLoad } from 'js-yaml';

// Bundle the content at build time. When TinaCloud has not indexed the
// branch yet, client.queries resolves with empty data rather than throwing,
// and the page renders with no content at all — which silently drops the
// footer, the CTA buttons and every block. Reading the same file off disk
// keeps the build honest while the index catches up.
import homeRaw from '../../content/pages/home.yaml?raw';
import configRaw from '../../content/config/config.json';

function localHome() {
  try {
    const parsed = yamlLoad(homeRaw) as any;
    return {
      ...parsed,
      _sys: { filename: 'home', relativePath: 'home.yaml', path: 'src/content/pages/home.yaml', extension: '.yaml' },
    };
  } catch (e) {
    console.warn('local home.yaml parse failed', e);
    return null;
  }
}

export const getHome = async () => {
  try {
    const r = await requestWithMetadata(client.queries.home({ relativePath: 'home.yaml' }), {
      priority: 'primary',
    });
    if (r?.data?.home) return r;
  } catch {}
  const home = localHome();
  return requestWithMetadata(
    Promise.resolve({ data: { home }, query: '', variables: { relativePath: 'home.yaml' } } as any),
    { priority: 'primary' },
  );
};

export const getConfig = async () => {
  try {
    const r = await requestWithMetadata(client.queries.config({ relativePath: 'config.json' }));
    if (r?.data?.config) return r;
  } catch {}
  return requestWithMetadata(
    Promise.resolve({ data: { config: configRaw }, query: '', variables: {} } as any),
  );
};


export async function listBlogs() {
  const r = await client.queries.blogConnection();
  return (r.data.blogConnection.edges ?? [])
    .flatMap((e) => (e?.node ? [e.node] : []))
    .sort((a, b) => {
      const ad = (a as any)?.date ? new Date((a as any).date).valueOf() : 0;
      const bd = (b as any)?.date ? new Date((b as any).date).valueOf() : 0;
      return bd - ad;
    });
}

export type CmsHome = Awaited<ReturnType<typeof getHome>>['data']['home'];
export type CmsConfig = Awaited<ReturnType<typeof getConfig>>['data']['config'];
