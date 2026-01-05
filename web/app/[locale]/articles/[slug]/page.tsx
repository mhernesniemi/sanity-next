import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import type { Article } from "@studio/sanity.types";
import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import Heading from "@/components/ui/Heading";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { notFound } from "next/navigation";

async function getArticle(
  slug: string,
  locale: string
): Promise<Article | null> {
  try {
    const article = await client.fetch<Article | null>(
      groq`*[_type == "article" && slug.current == $slug && language == $locale][0] {
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
      { slug, locale }
    );
    return article;
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }
}

const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({
      value,
    }: {
      value: { asset?: { _ref: string }; alt?: string };
    }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      const imageUrl = urlFor(value).width(800).height(600).url();
      return (
        <div className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || "Article image"}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg"
          />
          {value.alt && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
              {value.alt}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <Heading level="h1" size="lg" className="mt-12 mb-6">
        {String(children)}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading level="h2" size="md" className="mt-10 mb-4">
        {String(children)}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading level="h3" size="sm" className="mt-8 mb-3">
        {String(children)}
      </Heading>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-black dark:text-zinc-50 leading-relaxed">
        {children}
      </p>
    ),
  },
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticle(slug, locale);

  if (!article) {
    notFound();
  }

  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1200).height(600).url()
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col py-32 px-16 bg-white dark:bg-black">
        <article>
          {imageUrl && (
            <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={article.title || "Article image"}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <Heading level="h1" size="lg" className="mb-4">
            {article.title || "Untitled"}
          </Heading>

          {article.excerpt && (
            <p className="mb-8 text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {article.publishedAt && (
            <time
              dateTime={article.publishedAt}
              className="mb-8 block text-sm text-gray-600 dark:text-gray-400"
            >
              {new Date(article.publishedAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}

          {article.content && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText
                value={article.content}
                components={portableTextComponents}
              />
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
