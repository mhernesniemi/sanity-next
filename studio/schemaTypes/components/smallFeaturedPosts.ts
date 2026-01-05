import {defineType} from 'sanity'

export default defineType({
  name: 'smallFeaturedPosts',
  type: 'object',
  title: 'Small Featured Posts Container',
  fields: [
    {
      name: 'posts',
      type: 'array',
      title: 'Featured Posts',
      description: 'Add multiple small featured posts to this container',
      of: [
        {
          type: 'smallFeaturedPost',
        },
      ],
      validation: (rule) => rule.min(1),
    },
  ],
  preview: {
    select: {
      posts: 'posts',
    },
    prepare({posts}) {
      const count = posts?.length || 0
      return {
        title: 'Small Featured Posts Container',
        subtitle: `${count} post${count !== 1 ? 's' : ''}`,
      }
    },
  },
})

