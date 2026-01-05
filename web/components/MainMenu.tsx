"use client";

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverGroup,
} from "@headlessui/react";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { MainMenuLink, MainMenuItemQueryResult } from "@/lib/mainMenu";

type MainMenuProps = {
  items: MainMenuItemQueryResult[];
};

function buildHref(link: MainMenuLink, locale: string): string {
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

function MainMenuLinkItem({
  item,
  locale,
}: {
  item: MainMenuItemQueryResult;
  locale: string;
}) {
  if (!item.link || !item.label) {
    return null;
  }

  const href = buildHref(item.link, locale);

  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300 transition-colors"
    >
      {item.label}
    </Link>
  );
}

function MainMenuDropdownItem({
  item,
  locale,
}: {
  item: MainMenuItemQueryResult;
  locale: string;
}) {
  if (!item.sublinks || item.sublinks.length === 0 || !item.label) {
    return null;
  }

  return (
    <Popover className="relative">
      <PopoverButton className="px-4 py-2 text-sm font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300 transition-colors flex items-center gap-1 group">
        {item.label}
        <svg
          className="w-4 h-4 transition-transform group-data-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </PopoverButton>
      <PopoverPanel
        anchor="bottom start"
        className="mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      >
        <div className="py-1">
          {item.sublinks.map((sublink, index) => {
            if (!sublink.link || !sublink.label) {
              return null;
            }
            const href = buildHref(sublink.link, locale);
            return (
              <Link
                key={index}
                href={href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                {sublink.label}
              </Link>
            );
          })}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export default function MainMenu({ items }: MainMenuProps) {
  const locale = useLocale();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center">
      <PopoverGroup>
        <div className="flex items-center space-x-1">
          {items.map((item, index) => {
            if (!item) {
              return null;
            }

            const isDropdown = item.itemType === "dropdown" || (item.sublinks && item.sublinks.length > 0);

            if (isDropdown) {
              return (
                <MainMenuDropdownItem key={index} item={item} locale={locale} />
              );
            }

            return <MainMenuLinkItem key={index} item={item} locale={locale} />;
          })}
        </div>
      </PopoverGroup>
    </nav>
  );
}
