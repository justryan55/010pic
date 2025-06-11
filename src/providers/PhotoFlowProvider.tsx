"use client";

import AlbumFlow from "@/components/AlbumFlow/AlbumFlow";
import PhotoPickerFlow from "@/components/PhotoPicker/PhotoPickerFlow";
import { createContext, useContext, useState } from "react";

type PhotoFlowContext = {
  isAlbumFlowOpen: boolean;
  toggleAlbumFlow: () => void;
  isPhotoPickerOpen: boolean;
  togglePhotoPicker: () => void;
};

const PhotoFlowContext = createContext<PhotoFlowContext>({
  isAlbumFlowOpen: false,
  toggleAlbumFlow: () => {},
  isPhotoPickerOpen: false,
  togglePhotoPicker: () => {},
});

export default function AlbumFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAlbumFlowOpen, setIsAlbumFlowOpen] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);

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
