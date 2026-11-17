"use client";

import { useState, useEffect } from "react";
import { SiteContent, defaultSiteContent } from "./types";

let cachedContent: SiteContent | null = null;
const listeners = new Set<(c: SiteContent) => void>();

export function useSiteContent(): { content: SiteContent; loading: boolean; refresh: () => Promise<void> } {
  const [content, setContent] = useState<SiteContent>(cachedContent || defaultSiteContent);
  const [loading, setLoading] = useState<boolean>(!cachedContent);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/cms");
      if (res.ok) {
        const data = await res.json();
        if (data && data.content) {
          const merged: SiteContent = { ...defaultSiteContent, ...data.content };
          cachedContent = merged;
          setContent(merged);
          listeners.forEach((l) => l(merged));
        }
      }
    } catch {
      // fallback to default
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const listener = (newContent: SiteContent) => setContent(newContent);
    listeners.add(listener);

    if (!cachedContent) {
      fetchContent();
    }

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { content, loading, refresh: fetchContent };
}
