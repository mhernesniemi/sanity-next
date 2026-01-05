import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Front Page')
        .id('homepage')
        .child(S.document().schemaType('frontPage').documentId('homepage')),
      S.listItem()
        .title('Main Menu')
        .id('mainmenu')
        .child(S.document().schemaType('mainMenu').documentId('mainmenu')),
      ...S.documentTypeListItems().filter(
        (listItem) => !['frontPage', 'mainMenu'].includes(listItem.getId() || ''),
      ),
    ])
