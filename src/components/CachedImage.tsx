"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface CachedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  priority?: boolean;
  fill?: boolean;
}

const imagePreloadCache = new Set<string>();

export default function CachedImage({
  src,
  alt,
  width,
  height,
  className,
  onClick,
  priority = false,
  fill = false,
}: CachedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (imagePreloadCache.has(src)) {
      setIsLoading(false);
      return;
    }

    const img = new window.Image();

    img.onload = () => {
      imagePreloadCache.add(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };

    img.src = src;
  }, [src]);

  if (error) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <span className="text-gray-400 text-xs">Failed to load</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`${className} animate-pulse flex items-center justify-center`}
      >
        <Image
          src="/images/spinner-black.svg"
          width={16}
          height={16}
          alt="Loading..."
          className="animate-spin opacity-50"
        />
      </div>
    );
  }

  const imageProps = {
    src: src,
    alt,
    className,
    onClick,
    priority,
    ...(fill ? { fill: true } : { width, height }),
    unoptimized: false,
  };

  return <Image {...imageProps} />;
}

export const useImageCache = () => {
  const clearCache = () => {
    imagePreloadCache.clear();
  };

  const getCacheSize = () => imagePreloadCache.size;

  const preloadImages = async (urls: string[]) => {
    const promises = urls.map((url) => {
      return new Promise<void>((resolve) => {
        if (imagePreloadCache.has(url)) {
          resolve();
          return;
        }

        const img = new window.Image();
        img.onload = () => {
          imagePreloadCache.add(url);
          resolve();
        };

        img.onerror = () => resolve();
        img.src = url;
      });
    });

    await Promise.all(promises);
  };

  return { clearCache, getCacheSize, preloadImages };
};
