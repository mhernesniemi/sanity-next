import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {visionTool} from "@sanity/vision";
import {documentInternationalization} from "@sanity/document-internationalization";
import {schemaTypes} from "./schemaTypes";
import {structure} from "./structure";

export default defineConfig({
  name: "default",
  title: "Exove demo",

  projectId: "ga0hlsoj",
  dataset: "dev",

  plugins: [
    structureTool({structure}),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: "fi", title: "Finnish"},
        {id: "en", title: "English"},
      ],
      schemaTypes: ["article", "frontPage"],
      languageField: "language",
    }),
  ],

  document: {
    newDocumentOptions: (prev, context) => {
      if (context.creationContext.type === "global") {
        return prev.filter((templateItem) => templateItem.templateId !== "frontPage");
      }

      return prev;
    },
    actions: (prev, context) => {
      // Prevent deletion of frontPage singleton
      if (context.schemaType === "frontPage") {
        return prev.filter((action) => action.action !== "delete");
      }
      return prev;
    },
  },

  schema: {
    types: schemaTypes,
  },
});
