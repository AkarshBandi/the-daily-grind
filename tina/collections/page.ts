import type { Collection } from 'tinacms';
import { heroBlockSchema } from '../../src/components/blocks/hero.template';
import { richTextBlockSchema } from '../../src/components/blocks/richText.template';
import { mediaBlockSchema } from '../../src/components/blocks/media.template';
import { ctaBlockSchema } from '../../src/components/blocks/cta.template';
import { galleryBlockSchema } from '../../src/components/blocks/gallery.template';
import { accordionBlockSchema } from '../../src/components/blocks/accordion.template';
import { statsBlockSchema } from '../../src/components/blocks/stats.template';
import { testimonialBlockSchema } from '../../src/components/blocks/testimonial.template';
import { menuTabsBlockSchema } from '../../src/components/blocks/menuTabs.template';

export const PageCollection: Collection = {
  name: 'page',
  label: 'Pages',
  path: 'src/content/page',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === 'home') return '/';
      return `/${document._sys.filename}`;
    },
  },
  fields: [
    {
      name: 'seoTitle',
      label: 'Meta title (SEO)',
      type: 'string',
      isTitle: true,
      required: true,
    },
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Page sections',
      ui: { visualSelector: true },
      templates: [
        heroBlockSchema,
        richTextBlockSchema,
        mediaBlockSchema,
        ctaBlockSchema,
        galleryBlockSchema,
        accordionBlockSchema,
        statsBlockSchema,
        testimonialBlockSchema,
        menuTabsBlockSchema,
      ],
    },
  ],
};
