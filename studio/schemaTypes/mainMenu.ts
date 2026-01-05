import {defineType} from "sanity";

export default defineType({
  name: "mainMenu",
  type: "document",
  title: "Main Menu",
  fields: [
    {
      name: "language",
      type: "string",
      title: "Language",
      readOnly: true,
      hidden: true,
    },
    {
      name: "title",
      type: "string",
      title: "Title",
      initialValue: "Main Menu",
      readOnly: true,
      hidden: true,
    },
    {
      name: "items",
      type: "array",
      title: "Menu Items",
      description: "Add menu items. Items with sublinks will show as dropdowns.",
      of: [
        {
          type: "mainMenuItem",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
    },
    prepare({title, language}) {
      return {
        title: `${title} (${language || "unknown"})`,
      };
    },
  },
});

export const mainMenuItem = defineType({
  name: "mainMenuItem",
  type: "object",
  title: "Menu Item",
  fields: [
    {
      name: "label",
      type: "string",
      title: "Label",
      validation: (rule) => rule.required(),
    },
    {
      name: "itemType",
      type: "string",
      title: "Item Type",
      description: "Choose whether this is a direct link or a dropdown menu",
      options: {
        list: [
          {title: "Direct Link", value: "link"},
          {title: "Dropdown Menu", value: "dropdown"},
        ],
        layout: "radio",
      },
      initialValue: "link",
      validation: (rule) => rule.required(),
    },
    {
      name: "link",
      type: "object",
      title: "Link",
      description: "Configure the link destination",
      fields: [
        {
          name: "type",
          type: "string",
          title: "Link Type",
          options: {
            list: [
              {title: "Internal", value: "internal"},
              {title: "External", value: "external"},
            ],
            layout: "radio",
          },
          initialValue: "internal",
        },
        {
          name: "internal",
          type: "reference",
          title: "Internal Link",
          to: [{type: "article"}, {type: "frontPage"}],
          hidden: ({parent}) => parent?.type !== "internal",
        },
        {
          name: "external",
          type: "url",
          title: "External URL",
          hidden: ({parent}) => parent?.type !== "external",
        },
      ],
      hidden: ({parent}) => parent?.itemType !== "link",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {itemType?: string};
          if (parent?.itemType === "link" && !value) {
            return "Link is required for direct link items";
          }
          return true;
        }),
    },
    {
      name: "sublinks",
      type: "array",
      title: "Sublinks",
      description: "Add sublinks to create a dropdown menu",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              type: "string",
              title: "Label",
              validation: (rule) => rule.required(),
            },
            {
              name: "link",
              type: "object",
              title: "Link",
              fields: [
                {
                  name: "type",
                  type: "string",
                  title: "Link Type",
                  options: {
                    list: [
                      {title: "Internal", value: "internal"},
                      {title: "External", value: "external"},
                    ],
                    layout: "radio",
                  },
                  initialValue: "internal",
                },
                {
                  name: "internal",
                  type: "reference",
                  title: "Internal Link",
                  to: [{type: "article"}, {type: "frontPage"}],
                  hidden: ({parent}) => parent?.type !== "internal",
                },
                {
                  name: "external",
                  type: "url",
                  title: "External URL",
                  hidden: ({parent}) => parent?.type !== "external",
                },
              ],
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
      hidden: ({parent}) => parent?.itemType !== "dropdown",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {itemType?: string};
          if (parent?.itemType === "dropdown") {
            if (!value || !Array.isArray(value) || value.length === 0) {
              return "At least one sublink is required for dropdown items";
            }
          }
          return true;
        }),
    },
  ],
  preview: {
    select: {
      label: "label",
      itemType: "itemType",
      hasSublinks: "sublinks",
    },
    prepare({label, itemType, hasSublinks}) {
      const sublinkCount = Array.isArray(hasSublinks) ? hasSublinks.length : 0;
      const typeLabel = itemType === "dropdown" ? "Dropdown" : "Direct link";
      return {
        title: label,
        subtitle:
          itemType === "dropdown"
            ? `${typeLabel} (${sublinkCount} sublink${sublinkCount !== 1 ? "s" : ""})`
            : typeLabel,
      };
    },
  },
});
