import React from "react";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import ImagePicker from "./ImagePicker";
import monthNameToNumber from "./MonthNameToIndex";

interface SelectedImage {
  id: string;
  src: string;
  // file: File;
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
    triggerRefresh,
  } = usePhotoFlow();

  const monthIndex = targetMonth ? monthNameToNumber(targetMonth) : "";
  const monthKey = `${targetYear}-${monthIndex}`;
  const monthImages = imagesByMonth[monthKey] || [];

  const handleSave = async (images: SelectedImage[]) => {
    try {
      setImagesByMonth((prev) => ({
        ...prev,
        [monthKey]: images,
      }));
      triggerRefresh();
    } catch (err) {
      console.log(err);
    }
  };

  //   const handleImageDelete = async (imageId: string) => {
  //   // Handle the deletion without triggering refresh
  //   setImagesByMonth((prev) => ({
  //     ...prev,
  //     [monthKey]: prev[monthKey]?.filter(img => img.id !== imageId) || [],
  //   }));
  //   // Don't call triggerRefresh() here
  // };

  const config = {
    title: targetMonth || "Select Month",
    maxImages: 10,
    storageKey: `photoFlow-${targetYear}-${monthIndex}`,
    isOpen: activePicker === "date",
    onClose: togglePhotoPicker,
    onSave: handleSave,
    existingImages: monthImages,
    targetYear: targetYear ?? 0,
    monthIndex: monthIndex,
    folderType: "month",
  };

  return <ImagePicker config={config} />;
}
