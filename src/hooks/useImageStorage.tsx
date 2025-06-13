import { useState, useEffect } from "react";

interface SelectedImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

export default function useImageStorage(storageKey: string) {
  const [images, setImages] = useState<SelectedImage[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setImages(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load from localStorage", err);
    }
  }, [storageKey]);

  const saveImages = (newImages: SelectedImage[]) => {
    setImages(newImages);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newImages));
    } catch (err) {
      console.error("Failed to save to localStorage", err);
    }
  };

  return { images, saveImages };
}
