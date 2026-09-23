import type { Template } from 'tinacms';

export const menuTabsBlockSchema: Template = {
  name: 'menuTabs',
  label: 'Menu tabs',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline', name: 'headline' },
    { type: 'string', label: 'Description', name: 'description', ui: { component: 'textarea' } },
    {
      type: 'object',
      label: 'Tabs',
      name: 'tabs',
      list: true,
      ui: {
        itemProps: (item: { label?: string }) => ({ label: item?.label ?? 'Tab' }),
      },
      fields: [
        { type: 'string', label: 'ID', name: 'id' },
        { type: 'string', label: 'Label', name: 'label' },
        { type: 'string', label: 'Tag', name: 'tag' },
        { type: 'string', label: 'Heading', name: 'heading' },
        { type: 'string', label: 'Text', name: 'text', ui: { component: 'textarea' } },
        { name: 'image', label: 'Image', type: 'image' },
      ],
    },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'Menu',
      headline: 'What we do well',
      description: 'A few things we make every day. They are simple and they are good.',
      tabs: [
        { id: 'coffee', label: 'Coffee', tag: 'Coffee', heading: 'The flat white is true and strong', text: 'We pull shots from beans roasted two miles away.', image: '/shots/figma-2.png' },
      ],
    },
  },
};
