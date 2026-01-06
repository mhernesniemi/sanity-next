import MainMenu from "@/components/MainMenu";
import { getMainMenu } from "@/lib/mainMenu";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

type HeaderProps = {
  locale: string;
};

export default async function Header({ locale }: HeaderProps) {
  const mainMenu = await getMainMenu(locale);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="text-xl font-bold text-gray-900 dark:text-gray-100"
        >
          Logo
        </Link>
        {mainMenu?.items && mainMenu.items.length > 0 && (
          <MainMenu items={mainMenu.items} />
        )}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
