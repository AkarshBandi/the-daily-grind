import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { HomeQuery, BlogQuery, ConfigQuery } from '../../../tina/__generated__/types';
import type { CmsHome, CmsBlog, CmsConfig } from './data';
import Landing from '../../components/Landing.astro';
import BlogBody from '../../components/islands/BlogBody.astro';
import { getHome, getBlog, getConfig } from './data';

export const islands: IslandRegistry = {
  home: {
    fetch: () => getHome(),
    component: Landing as any,
    wrapper: { tag: 'div' },
    propsFromData: (data) => ({
      d: (data as QueryResult<HomeQuery>).data?.home as any,
    }),
  },
  blog: {
    fetch: (_req, params) => getBlog(params.get('slug') ?? ''),
    component: BlogBody as any,
    wrapper: { tag: 'article' },
    propsFromData: (data) => ({
      data: (data as QueryResult<BlogQuery>).data?.blog as CmsBlog | undefined,
    }),
  },
  global: {
    fetch: () => getConfig(),
    component: Landing as any,
    wrapper: { tag: 'div' },
    propsFromData: (data) => ({
      d: (data as QueryResult<ConfigQuery>).data?.config as any,
    }),
  },
};
