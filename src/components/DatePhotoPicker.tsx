import React from "react";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import ImagePicker from "./ImagePicker";

interface SelectedImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

export default function DatePhotoPicker() {
  const {
    activePicker,
    targetMonth,
    targetYear,
    imagesByMonth,
    setImagesByMonth,
    togglePhotoPicker,
  } = usePhotoFlow();

  const monthKey = `${targetYear}-${targetMonth}`;
  const monthImages = imagesByMonth[monthKey] || [];

  const handleSave = (images: SelectedImage[]) => {
    const serialized = JSON.stringify(images);

    const storageKey = `photoFlow-${targetYear}-${targetMonth}`;

    localStorage.setItem(storageKey, serialized);

    setImagesByMonth((prev) => ({
      ...prev,
      [monthKey]: images,
    }));
  };

  const config = {
    title: targetMonth || "Select Month",
    maxImages: 10,
    storageKey: `photoFlow-${targetYear}-${targetMonth}`,
    isOpen: activePicker === "date",
    onClose: togglePhotoPicker,
    onSave: handleSave,
    existingImages: monthImages,
  };

  return <ImagePicker config={config} />;
}
