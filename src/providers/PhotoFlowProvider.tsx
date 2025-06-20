"use client";

import DatePhotoPicker from "@/components/DatePhotoPicker";
import monthNameToNumber from "@/components/MonthNameToIndex";
import PeoplePhotoPicker from "@/components/PeoplePhotoPicker";
import PlacesPhotoPicker from "@/components/PlacesPhotoPicker";
import {
  fetchUserImagesByMonth,
  fetchUserImagesByPersonYear,
  fetchUserImagesByPlaceYear,
} from "@/lib/imageManager";
import { createContext, useContext, useEffect, useState } from "react";

type PhotoPickerType = "date" | "people" | "places" | null;
interface SelectedImage {
  id: string;
  src: string;
  // file: File;
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
  isLoadingImages: boolean;
  setIsLoadingImages: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  refreshToggle: boolean;
  triggerRefresh: () => void;
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
  isLoadingImages: false,
  setIsLoadingImages: () => {},
  activeTab: "",
  setActiveTab: () => {},
  refreshToggle: false,
  triggerRefresh: () => {},
});

export default function PhotoFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [activePicker, setActivePicker] = useState<PhotoPickerType>(null);

  const [targetMonth, setTargetMonth] = useState<string | null>(
    new Date().toLocaleString("default", { month: "long" })
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
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("date");
  const [refreshToggle, setRefreshToggle] = useState(false);

  const togglePicker = (picker: PhotoPickerType) => {
    setActivePicker((current) => (current === picker ? null : picker));
  };

  function triggerRefresh() {
    setRefreshToggle((prev) => !prev);
  }

  // useEffect(() => {
  //   const loadImages = async () => {
  //     if (!targetMonth || !targetYear) return;

  //     const monthIndex = monthNameToNumber(targetMonth);
  //     const monthKey = `${targetYear}-${monthIndex}`;

  //     const images = await fetchUserImagesByMonth(
  //       targetYear.toString(),
  //       monthIndex
  //     );

  //     const filteredImages = images.filter(
  //       (img): img is SelectedImage => img !== null && typeof img === 'object'
  //     );

  //     setImagesByMonth((prev) => ({
  //       ...prev,
  //       [monthKey]: filteredImages,
  //     }));
  //   };

  //   loadImages();
  // }, [targetMonth, targetYear]);

  useEffect(() => {
    const loadImages = async () => {
      if (!targetMonth || !targetYear) return;
      const monthIndex = monthNameToNumber(targetMonth);
      const monthKey = `${targetYear}-${monthIndex}`;
      const imagesByMonth = await fetchUserImagesByMonth(
        targetYear.toString(),
        [monthIndex]
      );

      const imagesForMonth = imagesByMonth[monthKey] || [];

      const filteredImages = imagesForMonth.filter(
        (img): img is SelectedImage => img !== null
      );

      setImagesByMonth((prev) => ({
        ...prev,
        [monthKey]: filteredImages,
      }));
    };
    loadImages();
  }, [targetMonth, targetYear]);

  useEffect(() => {
    const loadPeopleForYear = async () => {
      if (!targetYear) return;

      const peopleImages = await fetchUserImagesByPersonYear(
        targetYear.toString()
      );

      if (Object.keys(peopleImages).length > 0) {
        setImagesByPerson((prev) => {
          return Object.assign({}, prev, peopleImages);
        });
      }
    };

    loadPeopleForYear();
  }, [targetYear]);

  useEffect(() => {
    const loadPlacesForYear = async () => {
      if (!targetYear) return;

      const placesImages = await fetchUserImagesByPlaceYear(
        targetYear.toString()
      );

      if (Object.keys(placesImages).length > 0) {
        setImagesByPlace((prev) => {
          return Object.assign({}, prev, placesImages);
        });
      }
    };

    loadPlacesForYear();
  }, [targetYear]);

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
        isLoadingImages,
        setIsLoadingImages,
        activeTab,
        setActiveTab,
        refreshToggle,
        triggerRefresh,
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
