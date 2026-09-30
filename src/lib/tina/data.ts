import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../../tina/__generated__/client';

export const getHome = () =>
  requestWithMetadata(client.queries.home({ relativePath: 'home.yaml' }), {
    priority: 'primary',
  });

export const getConfig = () =>
  requestWithMetadata(client.queries.config({ relativePath: 'config.json' }));


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
