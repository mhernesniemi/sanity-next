import { groq } from "next-sanity";
import { client } from "./sanity";
import type { Article, FrontPage } from "@studio/sanity.types";

// Helper types for GROQ query results where internal references are resolved to full documents
type ResolvedInternalLink =
  | Pick<Article, "_type" | "slug">
  | Pick<FrontPage, "_type">;

type MainMenuLink = {
  type?: "internal" | "external";
  internal?: ResolvedInternalLink;
  external?: string;
};

type MainMenuSublink = {
  label?: string;
  link?: MainMenuLink;
};

type MainMenuItemQueryResult = {
  label?: string;
  itemType?: "link" | "dropdown";
  link?: MainMenuLink;
  sublinks?: MainMenuSublink[];
};

type MainMenuQueryResult = {
  _id: string;
  _type: "mainMenu";
  language?: string;
  items?: MainMenuItemQueryResult[];
};

export async function getMainMenu(
  locale: string
): Promise<MainMenuQueryResult | null> {
  try {
    const mainMenu = await client.fetch<MainMenuQueryResult | null>(
      groq`*[_type == "mainMenu" && language == $locale][0] {
        _id,
        _type,
        language,
        items[] {
          _key,
          label,
          itemType,
          link {
            type,
            internal-> {
              _type,
              slug
            },
            external
          },
          sublinks[] {
            _key,
            label,
            link {
              type,
              internal-> {
                _type,
                slug
              },
              external
            }
          }
        }
      }`,
      { locale }
    );

    return mainMenu;
  } catch (error) {
    console.error("Failed to fetch main menu:", error);
    return null;
  }
}

export type { MainMenuQueryResult, MainMenuItemQueryResult, MainMenuLink };
