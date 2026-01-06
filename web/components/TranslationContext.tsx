"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type TranslationUrls = Record<string, string>;

type TranslationContextType = {
  urls: TranslationUrls;
  setUrls: (urls: TranslationUrls) => void;
};

const TranslationContext = createContext<TranslationContextType>({
  urls: {},
  setUrls: () => {},
});

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [urls, setUrls] = useState<TranslationUrls>({});

  return (
    <TranslationContext.Provider value={{ urls, setUrls }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationUrls() {
  const { urls } = useContext(TranslationContext);
  return urls;
}

export function useSetTranslationUrls(urls: TranslationUrls) {
  const { setUrls } = useContext(TranslationContext);
  useEffect(() => {
    setUrls(urls);
    return () => setUrls({});
  }, [urls, setUrls]);
}
