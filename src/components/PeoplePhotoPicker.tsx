import React from "react";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import ImagePickerV2 from "./PhotoPicker/Steps/ImagePickerV2";

interface SelectedImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

export default function PeoplePhotoPicker() {
  const {
    targetMonth,
    targetYear,
    imagesByMonth,
    setimagesByMonth,
    isPhotoPickerOpen,
    activePicker,
    togglePhotoPicker,
  } = usePhotoFlow();

  const monthKey = `${targetYear}-${targetMonth}`;
  const monthImages = imagesByMonth[monthKey] || [];

  const handleSave = (images: SelectedImage[]) => {
    setimagesByMonth((prev) => ({
      ...prev,
      [monthKey]: images,
    }));
  };

  const config = {
    title: targetMonth || "Select Month",
    maxImages: 10,
    storageKey: `photoFlow-${targetYear}-${targetMonth}`,
    isOpen: activePicker === "people",
    onClose: togglePhotoPicker,
    onSave: handleSave,
    existingImages: monthImages,
  };

  return <ImagePickerV2 config={config} />;
}
