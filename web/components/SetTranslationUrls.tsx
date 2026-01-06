"use client";

import { useSetTranslationUrls } from "@/components/TranslationContext";

type Props = {
  urls: Record<string, string>;
};

export default function SetTranslationUrls({ urls }: Props) {
  useSetTranslationUrls(urls);
  return null;
}

