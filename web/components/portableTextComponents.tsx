import { type PortableTextReactComponents } from "@portabletext/react";
import Heading from "@/components/ui/Heading";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export const portableTextComponents: Partial<PortableTextReactComponents> = {
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
