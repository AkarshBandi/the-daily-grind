import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { HomeQuery, ConfigQuery } from '../../../tina/__generated__/types';
import type { CmsHome, CmsConfig } from './data';
import Landing from '../../components/Landing.astro';
import { getHome, getConfig } from './data';

export const islands: IslandRegistry = {
  home: {
    fetch: () => getHome(),
    component: Landing as any,
    wrapper: { tag: 'div' },
    propsFromData: (data) => ({
      d: (data as QueryResult<HomeQuery>).data?.home as any,
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
