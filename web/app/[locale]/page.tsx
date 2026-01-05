import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import type { Article } from "@studio/sanity.types";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

async function getArticles(locale: string): Promise<Article[]> {
  try {
    const articles = await client.fetch<Article[]>(
      groq`*[_type == "article" && language == $locale] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        publishedAt,
        excerpt,
        mainImage,
        content,
        language,
        "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
          _id,
          title,
          slug,
          language
        }
      }`,
      { locale }
    );
    return articles;
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    throw new Error("Failed to load articles");
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("frontPage");
  const articles = await getArticles(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-zinc-50">
          {t("articles")}
        </h1>
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article._id}>
              <Link
                href={`/${locale}/articles/${article.slug?.current || ""}`}
                className="text-lg text-black dark:text-zinc-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {article.title || "Untitled"}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
