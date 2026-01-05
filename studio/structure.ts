import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Front Page')
        .id('frontPage')
        .child(S.document().schemaType('frontPage').documentId('frontPage')),
      ...S.documentTypeListItems().filter(
        (listItem) => !['frontPage'].includes(listItem.getId() || ''),
      ),
    ])
