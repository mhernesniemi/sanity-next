import {defineType} from "sanity";

export default defineType({
  name: "article",
  type: "document",
  title: "Article",
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
      validation: (rule) => rule.required(),
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: "publishedAt",
      type: "datetime",
      title: "Published at",
    },
    {
      name: "excerpt",
      type: "text",
      title: "Excerpt",
      rows: 4,
    },
    {
      name: "mainImage",
      type: "image",
      title: "Main image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "content",
      type: "array",
      title: "Content",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
          fields: [
            {
              type: "text",
              name: "alt",
              title: "Alternative text",
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      publishedAt: "publishedAt",
    },
    prepare({title, media, publishedAt}) {
      return {
        title,
        media,
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : "No publish date",
      };
    },
  },
});
