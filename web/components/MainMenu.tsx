"use client";

import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
  PopoverGroup,
} from "@headlessui/react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bars3Icon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SidePanel from "@/components/ui/SidePanel";
import type { MainMenuItemQueryResult } from "@/lib/mainMenu";
import { buildHref } from "@/lib/utils";

type MainMenuProps = {
  items: MainMenuItemQueryResult[];
};

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
      <PopoverBackdrop className="fixed inset-0 z-40" />
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

function MainMenuMobile({
  items,
  locale,
}: {
  items: MainMenuItemQueryResult[];
  locale: string;
}) {
  const [currentItems, setCurrentItems] =
    useState<MainMenuItemQueryResult[]>(items);
  const [navigationStack, setNavigationStack] = useState<
    { items: MainMenuItemQueryResult[]; title: string }[]
  >([]);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isFirstRender, setIsFirstRender] = useState(true);

  const handleClose = () => {
    setTimeout(() => {
      setCurrentItems(items);
      setNavigationStack([]);
      setDirection("forward");
      setIsFirstRender(true);
    }, 200);
  };

  const handleSubmenuClick = (
    submenuItems: MainMenuItemQueryResult[],
    title: string
  ) => {
    setIsFirstRender(false);
    setDirection("forward");
    setNavigationStack([...navigationStack, { items: currentItems, title }]);
    setCurrentItems(submenuItems);
  };

  const handleBack = () => {
    if (navigationStack.length > 0) {
      setIsFirstRender(false);
      setDirection("back");
      const previousState = navigationStack[navigationStack.length - 1];
      setCurrentItems(previousState.items);
      setNavigationStack(navigationStack.slice(0, -1));
    }
  };

  const title =
    navigationStack.length > 0
      ? navigationStack[navigationStack.length - 1].title
      : undefined;

  const getSublinks = (
    item: MainMenuItemQueryResult
  ): MainMenuItemQueryResult[] => {
    if (!item.sublinks || item.sublinks.length === 0) {
      return [];
    }
    return item.sublinks
      .map((sublink) => ({
        label: sublink.label,
        itemType: "link" as const,
        link: sublink.link,
        sublinks: undefined,
      }))
      .filter((item) => !!item.label) as MainMenuItemQueryResult[];
  };

  return (
    <SidePanel
      openLabel={
        <div className="flex items-center gap-2">
          <Bars3Icon className="h-6 w-6 stroke-2" />
          <span className="sr-only">Menu</span>
        </div>
      }
      position="left"
      showBackButton={navigationStack.length > 0}
      onBack={handleBack}
      onClose={handleClose}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={navigationStack.length}
          initial={
            isFirstRender
              ? false
              : { opacity: 0, x: direction === "forward" ? 300 : -300 }
          }
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        >
          <div className="flex w-full flex-col">
            {title && (
              <h2 className="my-6 text-2xl font-bold text-black">{title}</h2>
            )}

            <ul className="w-full divide-y divide-gray-200 overflow-scroll wrap-break-word border-y border-gray-200 text-lg text-gray-900">
              {currentItems?.map((item, index) => {
                if (!item.label) {
                  return null;
                }

                const sublinks = getSublinks(item);
                const hasSublinks = sublinks.length > 0;

                if (!hasSublinks) {
                  if (!item.link) {
                    return null;
                  }
                  const href = buildHref(item.link, locale);
                  return (
                    <li key={`${item.label}-${index}`}>
                      <Link
                        href={href}
                        className="block p-3 transition-all duration-200 hover:bg-gray-100"
                        onClick={handleClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={`${item.label}-${index}`}>
                    <button
                      onClick={() => handleSubmenuClick(sublinks, item.label!)}
                      className="flex w-full items-center justify-between p-3 text-lg text-gray-900 transition-all duration-200 hover:bg-gray-100"
                    >
                      {item.label}
                      <ChevronRightIcon className="h-6 w-6 stroke-2" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </SidePanel>
  );
}

export default function MainMenu({ items }: MainMenuProps) {
  const locale = useLocale();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop menu */}
      <nav className="hidden md:flex items-center">
        <PopoverGroup>
          <div className="flex items-center space-x-1">
            {items.map((item, index) => {
              if (!item) {
                return null;
              }

              const isDropdown =
                item.itemType === "dropdown" ||
                (item.sublinks && item.sublinks.length > 0);

              if (isDropdown) {
                return (
                  <MainMenuDropdownItem
                    key={index}
                    item={item}
                    locale={locale}
                  />
                );
              }

              return (
                <MainMenuLinkItem key={index} item={item} locale={locale} />
              );
            })}
          </div>
        </PopoverGroup>
      </nav>

      {/* Mobile menu */}
      <div className="md:hidden">
        <MainMenuMobile items={items} locale={locale} />
      </div>
    </>
  );
}
