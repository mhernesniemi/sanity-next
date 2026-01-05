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

  schema: {
    types: schemaTypes,
  },
});
