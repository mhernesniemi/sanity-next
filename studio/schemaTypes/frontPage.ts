import {defineType} from "sanity";

export default defineType({
  name: "frontPage",
  type: "document",
  title: "Front Page",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Page Title",
      initialValue: "Front Page",
      readOnly: true,
    },
    {
      name: "components",
      type: "array",
      title: "Page Components",
      description: "Add and rearrange components for the front page",
      of: [
        {
          type: "largeFeaturedPost",
        },
        {
          type: "smallFeaturedPosts",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare() {
      return {
        title: "Front Page",
      };
    },
  },
});
