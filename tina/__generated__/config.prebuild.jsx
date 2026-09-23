// tina/config.ts
import { defineConfig } from "tinacms";

// src/components/blocks/hero.template.ts
var heroBlockSchema = {
  name: "hero",
  label: "Hero",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Headline", name: "headline" },
    { type: "string", label: "Tagline", name: "tagline", ui: { component: "textarea" } },
    {
      type: "object",
      label: "Primary action",
      name: "primaryAction",
      fields: [
        { type: "string", label: "Label", name: "label" },
        { type: "string", label: "Link", name: "link" }
      ]
    },
    {
      type: "object",
      label: "Secondary action",
      name: "secondaryAction",
      fields: [
        { type: "string", label: "Label", name: "label" },
        { type: "string", label: "Link", name: "link" }
      ]
    },
    {
      type: "object",
      label: "Image",
      name: "image",
      fields: [
        { name: "src", label: "Image source", type: "image" },
        { name: "alt", label: "Alt text", type: "string" }
      ]
    }
  ],
  ui: {
    defaultItem: {
      eyebrow: "Welcome",
      headline: "Headline goes here",
      tagline: "Tagline that explains the value prop in one sentence.",
      primaryAction: { label: "Get started", link: "/" }
    }
  }
};

// src/components/blocks/richText.template.ts
var richTextBlockSchema = {
  name: "richText",
  label: "Rich text",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Headline", name: "headline" },
    { type: "rich-text", label: "Body", name: "body" }
  ],
  ui: {
    defaultItem: {
      eyebrow: "Section label",
      headline: "Rich text headline",
      body: "Body content with **markdown** support."
    }
  }
};

// src/components/blocks/media.template.ts
var mediaBlockSchema = {
  name: "media",
  label: "Media",
  fields: [
    {
      type: "object",
      label: "Image",
      name: "image",
      fields: [
        { name: "src", label: "Image source", type: "image" },
        { name: "alt", label: "Alt text", type: "string" },
        { name: "caption", label: "Caption", type: "string" }
      ]
    },
    {
      type: "string",
      label: "Aspect",
      name: "aspect",
      options: [
        { label: "16:9", value: "16/9" },
        { label: "4:3", value: "4/3" },
        { label: "1:1", value: "1/1" }
      ]
    }
  ]
};

// src/components/blocks/cta.template.ts
var ctaBlockSchema = {
  name: "cta",
  label: "Call to action",
  fields: [
    { type: "string", label: "Headline", name: "headline" },
    { type: "string", label: "Text", name: "text", ui: { component: "textarea" } },
    { type: "string", label: "Primary label", name: "primaryLabel" },
    { type: "string", label: "Primary link", name: "primaryLink" },
    { type: "string", label: "Secondary label", name: "secondaryLabel" },
    { type: "string", label: "Secondary link", name: "secondaryLink" }
  ],
  ui: {
    defaultItem: {
      headline: "Ready to get started?",
      text: "A short, persuasive line that drives action.",
      primaryLabel: "Primary action",
      primaryLink: "/"
    }
  }
};

// src/components/blocks/gallery.template.ts
var galleryBlockSchema = {
  name: "gallery",
  label: "Gallery",
  fields: [
    { type: "string", label: "Headline", name: "headline" },
    {
      type: "object",
      label: "Images",
      name: "images",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.alt ?? "Image" })
      },
      fields: [
        { name: "src", label: "Image source", type: "image" },
        { name: "alt", label: "Alt text", type: "string" },
        { name: "caption", label: "Caption", type: "string" }
      ]
    }
  ]
};

// src/components/blocks/accordion.template.ts
var accordionBlockSchema = {
  name: "accordion",
  label: "Accordion",
  fields: [
    { type: "string", label: "Headline", name: "headline" },
    {
      type: "object",
      label: "Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title ?? "Item" })
      },
      fields: [
        { type: "string", label: "Title", name: "title" },
        { type: "rich-text", label: "Content", name: "content" }
      ]
    }
  ]
};

// src/components/blocks/stats.template.ts
var statsBlockSchema = {
  name: "stats",
  label: "Stats",
  fields: [
    { type: "string", label: "Headline", name: "headline" },
    {
      type: "object",
      label: "Stats",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.value ? `${item.value} \u2014 ${item.label ?? ""}` : "Stat"
        })
      },
      fields: [
        { type: "string", label: "Value", name: "value" },
        { type: "string", label: "Label", name: "label" }
      ]
    }
  ],
  ui: {
    defaultItem: {
      headline: "By the numbers",
      items: [
        { value: "99%", label: "Uptime" },
        { value: "24/7", label: "Support" }
      ]
    }
  }
};

// src/components/blocks/testimonial.template.ts
var testimonialBlockSchema = {
  name: "testimonial",
  label: "Testimonial",
  fields: [
    { type: "string", label: "Quote", name: "quote", ui: { component: "textarea" } },
    { type: "string", label: "Author", name: "author" },
    { type: "string", label: "Role", name: "role" },
    {
      type: "object",
      label: "Avatar",
      name: "avatar",
      fields: [
        { name: "src", label: "Image source", type: "image" },
        { name: "alt", label: "Alt text", type: "string" }
      ]
    }
  ],
  ui: {
    defaultItem: {
      quote: "This product changed how we work.",
      author: "Jane Doe",
      role: "CEO, Example Co."
    }
  }
};

// tina/collections/page.ts
var PageCollection = {
  name: "page",
  label: "Pages",
  path: "src/content/page",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") return "/";
      return `/${document._sys.filename}`;
    }
  },
  fields: [
    {
      name: "seoTitle",
      label: "Meta title (SEO)",
      type: "string",
      isTitle: true,
      required: true
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Page sections",
      ui: { visualSelector: true },
      templates: [
        heroBlockSchema,
        richTextBlockSchema,
        mediaBlockSchema,
        ctaBlockSchema,
        galleryBlockSchema,
        accordionBlockSchema,
        statsBlockSchema,
        testimonialBlockSchema
      ]
    }
  ]
};

// tina/collections/blog.ts
var BlogCollection = {
  name: "blog",
  label: "Blog",
  path: "src/content/blog",
  format: "mdx",
  ui: {
    router: ({ document }) => `/blog/${document._sys.filename}`
  },
  fields: [
    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
    { name: "description", label: "Description", type: "string", ui: { component: "textarea" } },
    { name: "pubDate", label: "Publication date", type: "datetime" },
    { name: "heroImage", label: "Hero image", type: "image" },
    { type: "rich-text", name: "body", label: "Body", isBody: true }
  ]
};

// tina/collections/global.ts
var GlobalCollection = {
  name: "config",
  label: "Global config",
  path: "src/content/config",
  format: "json",
  ui: { global: true },
  fields: [
    {
      name: "seo",
      label: "Site identity & SEO",
      type: "object",
      fields: [
        { name: "title", label: "Site name", type: "string", required: true },
        { name: "description", label: "Default meta description", type: "string", required: true }
      ]
    },
    {
      name: "nav",
      label: "Navigation menu",
      type: "object",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title ?? "Link" }) },
      fields: [
        { name: "title", label: "Title", type: "string", required: true },
        { name: "link", label: "Link", type: "string", required: true }
      ]
    },
    {
      name: "footerNote",
      label: "Footer note",
      type: "string",
      ui: { component: "textarea" }
    }
  ]
};

// tina/config.ts
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.WORKERS_CI_BRANCH || process.env.CF_PAGES_BRANCH || process.env.HEAD || "master";
var config_default = defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [PageCollection, BlogCollection, GlobalCollection]
  }
});
export {
  config_default as default
};
