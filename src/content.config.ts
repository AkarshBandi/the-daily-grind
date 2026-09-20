import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    publishDate: z.date().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    heroImage: z.string().optional(),
    description: z.string().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    order: z.coerce.number().int().min(1).max(20).default(1),
    featured: z.boolean().default(false),
    url_stub: z.string(),
    image: z.string(),
    image_alt: z.string(),
    excerpt: z.string(),
    cta_label: z.string().default('Enquire →'),
    cta_link: z.string().default('/contact'),
    style: z.object({
      tall: z.boolean().default(true),
      badge: z.string().optional(),
    }).optional(),
  }).passthrough(),
});

const figma = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/figma" }),
  schema: z.object({
    seo_title: z.string(),
    hero_heading: z.string(),
    hero_text: z.string(),
    hero_buttons: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
    navbar_links: z.array(z.any()).optional(),
    about_heading: z.string().optional(),
    about_text: z.string().optional(),
  }).passthrough(),
});

export const collections = { pages, blog, work, figma };
