"use client";

import React, { useEffect, useState } from "react";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import ImagePickerV2 from "./PhotoPicker/Steps/ImagePickerV2";
import Input from "./Input";

interface SelectedImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

export default function PlacesPhotoPicker() {
  const {
    targetYear,
    imagesByPlace,
    setImagesByPlace,
    activePicker,
    togglePhotoPicker,
  } = usePhotoFlow();

  const [placeTitle, setPlaceTitle] = useState("");
  const formattedTitle = placeTitle.trim().replace(/\s+/g, "_") || "untitled";
  const placesKey = `${targetYear}-place-${formattedTitle}`;
  const placesImages = imagesByPlace[placesKey] || [];

  const handleSave = (images: SelectedImage[]) => {
    setImagesByPlace((prev) => ({
      ...prev,
      [placesKey]: images,
    }));
  };


  const config = {
    title: placeTitle,
    setTitle: setPlaceTitle,
    maxImages: 10,
    storageKey: `photoFlow-places-${targetYear}-${formattedTitle}`,
    isOpen: activePicker === "places",
    onClose: togglePhotoPicker,
    onSave: handleSave,
    existingImages: placesImages,
    needsTitleInput: true,
  };

  return (
    <>
      <ImagePickerV2 config={config} />
    </>
  );
}
