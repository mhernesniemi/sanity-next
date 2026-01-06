import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MainMenuLink } from "@/lib/mainMenu"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildHref(link: MainMenuLink, locale: string): string {
  if (link.type === "external" && link.external) {
    return link.external;
  }

  if (link.type === "internal" && link.internal) {
    const { _type } = link.internal;

    if (_type === "frontPage") {
      return `/${locale}`;
    }

    if (_type === "article") {
      const article = link.internal as {
        _type: "article";
        slug?: { current?: string };
      };
      if (article.slug?.current) {
        return `/${locale}/articles/${article.slug.current}`;
      }
    }
  }

  return "#";
}
