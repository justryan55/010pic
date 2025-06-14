"use client";

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

  isPhotoPickerOpen: boolean;
  togglePhotoPicker: () => void;
  targetMonth: string | null;
  targetYear: number | null;
  setTargetMonth: (month: string | null) => void;
  setTargetYear: (year: number | null) => void;

  targetPlace: string | null;
  setTargetPlace: (place: string | null) => void;

  targetPerson: string | null;
  setTargetPerson: (person: string | null) => void;

  imagesByMonth: Record<string, SelectedImage[]>;
  setImagesByMonth: React.Dispatch<
    React.SetStateAction<Record<string, SelectedImage[]>>
  >;
  imagesByPlace: Record<string, SelectedImage[]>;
  setImagesByPlace: React.Dispatch<
    React.SetStateAction<Record<string, SelectedImage[]>>
  >;

  imagesByPerson: Record<string, SelectedImage[]>;
  setImagesByPerson: React.Dispatch<
    React.SetStateAction<Record<string, SelectedImage[]>>
  >;
};

const PhotoFlowContext = createContext<PhotoFlowContext>({
  activePicker: null,
  togglePicker: () => {},

  isPhotoPickerOpen: false,
  togglePhotoPicker: () => {},
  targetMonth: null,
  targetYear: null,
  setTargetMonth: () => {},
  setTargetYear: () => {},
  targetPlace: null,
  setTargetPlace: () => {},
  imagesByMonth: {},
  setImagesByMonth: () => {},
  imagesByPlace: {},
  setImagesByPlace: () => {},
  imagesByPerson: {},
  setImagesByPerson: () => {},
  targetPerson: null,
  setTargetPerson: () => {},
});

export default function PhotoFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const [imagesByPerson, setImagesByPerson] = useState<
    Record<string, SelectedImage[]>
  >({});

  const [targetPlace, setTargetPlace] = useState<string | null>(null);
  const [targetPerson, setTargetPerson] = useState<string | null>(null);

  const togglePicker = (picker: PhotoPickerType) => {
    setActivePicker((current) => (current === picker ? null : picker));
  };

  useEffect(() => {
    const monthImages: Record<string, SelectedImage[]> = {};
    const placeImages: Record<string, SelectedImage[]> = {};
    const personImages: Record<string, SelectedImage[]> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("photoFlow-")) continue;

      try {
        const data = JSON.parse(localStorage.getItem(key)!);
        const cleanedKey = key.replace("photoFlow-", "");

        if (cleanedKey.includes("-place-")) {
          placeImages[cleanedKey] = data;
        } else if (cleanedKey.includes("-person-")) {
          personImages[cleanedKey] = data;
        } else {
          monthImages[cleanedKey] = data;
        }
      } catch (e) {
        console.error("Failed to parse stored images", e);
      }
    }

    setImagesByMonth(monthImages);
    setImagesByPlace(placeImages);
    setImagesByPerson(personImages);
  }, []);

  const togglePhotoPicker = () => {
    setIsPhotoPickerOpen((prev) => !prev);
    setActivePicker(null);
  };

  return (
    <PhotoFlowContext.Provider
      value={{
        activePicker,
        togglePicker,
        isPhotoPickerOpen,
        togglePhotoPicker,
        targetMonth,
        targetYear,
        setTargetMonth,
        setTargetYear,
        targetPlace,
        setTargetPlace,
        imagesByMonth,
        setImagesByMonth,
        imagesByPlace,
        setImagesByPlace,
        imagesByPerson,
        setImagesByPerson,
        targetPerson,
        setTargetPerson,
      }}
    >
      {children}
      <DatePhotoPicker />
      <PeoplePhotoPicker />
      <PlacesPhotoPicker />
    </PhotoFlowContext.Provider>
  );
}

export const usePhotoFlow = () => {
  const context = useContext(PhotoFlowContext);
  if (!context) {
    throw new Error("usePhotoFlow must be used within an PhotoFlowProvider");
  }
  return context;
};
