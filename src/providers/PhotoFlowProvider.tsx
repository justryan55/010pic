"use client";

import AlbumFlow from "@/components/AlbumFlow/AlbumFlow";
import DatePhotoPicker from "@/components/DatePhotoPicker";
import PeoplePhotoPicker from "@/components/PeoplePhotoPicker";
import PlacesPhotoPicker from "@/components/PlacesPhotoPicker";
import { createContext, useContext, useEffect, useState } from "react";

type PhotoPickerType = "date" | "people" | "places" | null;
interface SelectedImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

type PhotoFlowContext = {
  activePicker: PhotoPickerType;
  togglePicker: (picker: PhotoPickerType) => void;

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
  imagesByPlace: Record<string, SelectedImage[]>;
  setImagesByPlace: React.Dispatch<
    React.SetStateAction<Record<string, SelectedImage[]>>
  >;
};

const PhotoFlowContext = createContext<PhotoFlowContext>({
  activePicker: null,
  togglePicker: () => {},

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
  imagesByPlace: {},
  setImagesByPlace: () => {},
});

export default function PhotoFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAlbumFlowOpen, setIsAlbumFlowOpen] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [activePicker, setActivePicker] = useState<PhotoPickerType>(null);

  const [targetMonth, setTargetMonth] = useState<string | null>(
    new Date().toLocaleString("default", { month: "2-digit" })
  );
  const [targetYear, setTargetYear] = useState<number | null>(
    new Date().getFullYear()
  );

  const [imagesByPlace, setImagesByPlace] = useState<
    Record<string, SelectedImage[]>
  >({});

  const [imagesByMonth, setImagesByMonth] = useState<
    Record<string, SelectedImage[]>
  >({});

  const togglePicker = (picker: PhotoPickerType) => {
    setActivePicker((current) => (current === picker ? null : picker));
    console.log(picker);
  };

  useEffect(() => {
    const stored: Record<string, SelectedImage[]> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("photoFlow-")) {
        try {
          const images = JSON.parse(localStorage.getItem(key)!);
          stored[key.replace("photoFlow-", "")] = images;
        } catch (e) {
          console.error("Failed to parse stored images", e);
        }
      }
    }
    setImagesByMonth(stored);
  }, []);

  const toggleAlbumFlow = () => {
    setIsAlbumFlowOpen((prev) => !prev);
  };

  const togglePhotoPicker = () => {
    setIsPhotoPickerOpen((prev) => !prev);
    setActivePicker(null);
  };

  return (
    <PhotoFlowContext.Provider
      value={{
        activePicker,
        togglePicker,
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
        imagesByPlace,
        setImagesByPlace,
      }}
    >
      {children}
      {isAlbumFlowOpen && <AlbumFlow />}
      {activePicker === "date" && <DatePhotoPicker />}
      {activePicker === "people" && <PeoplePhotoPicker />}
      {activePicker === "places" && <PlacesPhotoPicker />}
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
