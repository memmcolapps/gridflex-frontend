import { useEffect, useState } from "react";
import { fetchAuthImage } from "@/lib/fetch-auth-image";

const imageCache = new Map<string, string>(); 

export function useAuthImage(imageUrl: string | null | undefined) {
  const [blobUrl, setBlobUrl] = useState<string | null>(
    imageUrl ? (imageCache.get(imageUrl) ?? null) : null 
  );
  const [loading, setLoading] = useState(!imageCache.has(imageUrl ?? ""));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    if (imageCache.has(imageUrl)) {
      setBlobUrl(imageCache.get(imageUrl)!);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const objectUrl = await fetchAuthImage(imageUrl);
        imageCache.set(imageUrl, objectUrl); // ← store in cache
        if (!cancelled) setBlobUrl(objectUrl);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load image");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [imageUrl]);

  return { blobUrl, loading, error };
}