"use client";

import AlbumFlow from "@/components/AlbumFlow/AlbumFlow";
import PhotoPickerFlow from "@/components/PhotoPicker/PhotoPickerFlow";
import { createContext, useContext, useState } from "react";

interface SelectedImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

type PhotoFlowContext = {
  isAlbumFlowOpen: boolean;
  toggleAlbumFlow: () => void;
  isPhotoPickerOpen: boolean;
  togglePhotoPicker: () => void;
  targetMonth: string | null;
  targetYear: number | null;
  setTargetMonth: (month: string | null) => void;
  setTargetYear: (year: number | null) => void;
  imagesByMonth: Record<string, SelectedImage[]>;
  setImagesByMonth: React.Dispatch<
    React.SetStateAction<Record<string, SelectedImage[]>>
  >;
};

const PhotoFlowContext = createContext<PhotoFlowContext>({
  isAlbumFlowOpen: false,
  toggleAlbumFlow: () => {},
  isPhotoPickerOpen: false,
  togglePhotoPicker: () => {},
  targetMonth: null,
  targetYear: null,
  setTargetMonth: () => {},
  setTargetYear: () => {},
  imagesByMonth: {},
  setImagesByMonth: () => {},
});

export default function AlbumFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAlbumFlowOpen, setIsAlbumFlowOpen] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [targetMonth, setTargetMonth] = useState<string | null>(null);
  const [targetYear, setTargetYear] = useState<number | null>(
    new Date().getFullYear()
  );
  const [imagesByMonth, setImagesByMonth] = useState({});

  const toggleAlbumFlow = () => {
    setIsAlbumFlowOpen((prev) => !prev);
  };

  const togglePhotoPicker = () => {
    setIsPhotoPickerOpen((prev) => !prev);
  };

  return (
    <PhotoFlowContext.Provider
      value={{
        isAlbumFlowOpen,
        toggleAlbumFlow,
        isPhotoPickerOpen,
        togglePhotoPicker,
        targetMonth,
        targetYear,
        setTargetMonth,
        setTargetYear,
        imagesByMonth,
        setImagesByMonth,
      }}
    >
      {children}
      <AlbumFlow />
      <PhotoPickerFlow />
    </PhotoFlowContext.Provider>
  );
}

export const usePhotoFlow = () => {
  const context = useContext(PhotoFlowContext);
  if (!context) {
    throw new Error("usePhotoFlow must be used within an AlbumFlowProvider");
  }
  return context;
};
