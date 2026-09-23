// tina/config.ts
import { defineConfig } from "tinacms";

// tina/collections/home.ts
var HomeCollection = {
  name: "home",
  label: "Home (Hearth)",
  path: "src/content/pages",
  format: "yaml",
  match: { include: "home" },
  ui: { router: () => "/" },
  fields: [
    { name: "seo_title", label: "SEO title", type: "string" },
    {
      name: "banner",
      label: "Banner",
      type: "object",
      fields: [
        { name: "enabled", label: "Enabled", type: "boolean" },
        { name: "heading", label: "Heading", type: "string" },
        { name: "text", label: "Text", type: "string", ui: { component: "textarea" } },
        { name: "placeholder", label: "Placeholder", type: "string" },
        { name: "button", label: "Button", type: "string" }
      ]
    },
    {
      name: "navbar",
      label: "Navbar",
      type: "object",
      fields: [
        { name: "logo", label: "Logo", type: "string" },
        { name: "cta_label", label: "CTA label", type: "string" },
        { name: "cta_href", label: "CTA href", type: "string" }
      ]
    },
    { name: "hero_background", label: "Hero background image", type: "image" },
    { name: "hero_heading", label: "Hero heading", type: "string", ui: { component: "textarea" } },
    { name: "hero_text", label: "Hero text", type: "string", ui: { component: "textarea" } },
    {
      name: "hero_buttons",
      label: "Hero buttons",
      type: "object",
      list: true,
      fields: [
        { name: "label", label: "Label", type: "string" },
        { name: "href", label: "Href", type: "string" }
      ]
    },
    {
      name: "navbar_links",
      label: "Navbar links",
      type: "object",
      list: true,
      fields: [
        { name: "label", label: "Label", type: "string" },
        { name: "href", label: "Href", type: "string" },
        { name: "dropdown", label: "Dropdown", type: "string", list: true }
      ]
    },
    {
      name: "about",
      label: "About",
      type: "object",
      fields: [
        { name: "tagline", label: "Tagline", type: "string" },
        { name: "heading", label: "Heading", type: "string", ui: { component: "textarea" } },
        { name: "text", label: "Text", type: "string", ui: { component: "textarea" } },
        { name: "image", label: "Image", type: "image" },
        {
          name: "buttons",
          label: "Buttons",
          type: "object",
          list: true,
          fields: [
            { name: "label", label: "Label", type: "string" },
            { name: "href", label: "Href", type: "string" }
          ]
        }
      ]
    },
    {
      name: "menu",
      label: "Menu",
      type: "object",
      fields: [
        { name: "tag", label: "Tag", type: "string" },
        { name: "heading", label: "Heading", type: "string" },
        { name: "text", label: "Text", type: "string", ui: { component: "textarea" } },
        {
          name: "tabs",
          label: "Tabs",
          type: "object",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.label ?? "Tab" }) },
          fields: [
            { name: "id", label: "ID", type: "string" },
            { name: "label", label: "Label", type: "string" },
            { name: "tag", label: "Tag", type: "string" },
            { name: "heading", label: "Heading", type: "string" },
            { name: "text", label: "Text", type: "string", ui: { component: "textarea" } },
            { name: "image", label: "Image", type: "image" }
          ]
        }
      ]
    },
    {
      name: "testimonials",
      label: "Testimonials",
      type: "object",
      fields: [
        { name: "heading", label: "Heading", type: "string" },
        { name: "text", label: "Text", type: "string" },
        {
          name: "items",
          label: "Items",
          type: "object",
          list: true,
          fields: [
            { name: "quote", label: "Quote", type: "string", ui: { component: "textarea" } },
            { name: "stars", label: "Stars", type: "number" },
            { name: "avatar", label: "Avatar", type: "image" },
            { name: "name", label: "Name", type: "string" },
            { name: "role", label: "Role", type: "string" }
          ]
        }
      ]
    },
    {
      name: "faq",
      label: "FAQ",
      type: "object",
      fields: [
        { name: "heading", label: "Heading", type: "string" },
        { name: "text", label: "Text", type: "string" },
        {
          name: "items",
          label: "Items",
          type: "object",
          list: true,
          fields: [
            { name: "q", label: "Question", type: "string" },
            { name: "a", label: "Answer", type: "string", ui: { component: "textarea" } }
          ]
        },
        { name: "still_heading", label: "Still heading", type: "string" },
        { name: "still_text", label: "Still text", type: "string" },
        { name: "still_button", label: "Still button", type: "string" }
      ]
    },
    {
      name: "contact",
      label: "Contact",
      type: "object",
      fields: [
        { name: "tagline", label: "Tagline", type: "string" },
        { name: "heading", label: "Heading", type: "string" },
        { name: "text", label: "Text", type: "string", ui: { component: "textarea" } },
        { name: "email", label: "Email", type: "string" },
        { name: "phone", label: "Phone", type: "string" }
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
    collections: [HomeCollection, BlogCollection, GlobalCollection]
  }
});
export {
  config_default as default
};
