import {defineType} from 'sanity'

export default defineType({
  name: 'smallFeaturedPost',
  type: 'object',
  title: 'Small Featured Post',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 2,
    },
    {
      name: 'article',
      type: 'reference',
      title: 'Article',
      to: [{type: 'article'}],
      validation: (rule) => rule.required(),
    },
    {
      name: 'linkText',
      type: 'string',
      title: 'Link Text',
      validation: (rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      articleTitle: 'article.title',
      linkText: 'linkText',
    },
    prepare({title, articleTitle, linkText}) {
      return {
        title: title || 'Untitled',
        subtitle: `${linkText || 'Read more'} → ${articleTitle || 'No article'}`,
      }
    },
  },
})

