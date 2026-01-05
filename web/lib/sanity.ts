import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2025-02-19",
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
});
