import { client } from "@/lib/sanity";
import type { Article } from "@studio/sanity.types";

async function getArticles(): Promise<Article[]> {
  const articles = await client.fetch<Article[]>(
    `*[_type == "article"] | order(publishedAt desc) {
      _id,
      _type,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      content
    }`
  );
  return articles;
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-zinc-50">
          Articles
        </h1>
        <ul className="space-y-4">
          {articles.map((article) => (
            <li
              key={article._id}
              className="text-lg text-black dark:text-zinc-50"
            >
              {article.title || "Untitled"}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
