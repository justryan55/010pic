"use client";

import React, { useState } from "react";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import ImagePicker from "./PhotoPicker/Steps/ImagePicker";

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
    targetPlace,
    setTargetPlace,
  } = usePhotoFlow();

  const initialTitle =
    targetPlace?.replace(`${targetYear}-place-`, "").replace(/_/g, " ") ?? "";
  const [placeTitle, setPlaceTitle] = useState(initialTitle);

  const formattedTitle = placeTitle.trim().replace(/\s+/g, "_") || "Untitled";
  const placesKey = `${targetYear}-place-${formattedTitle}`;
  const placesImages = imagesByPlace[targetPlace ?? ""] || [];

  const handleSave = (images: SelectedImage[]) => {
    const key = `photoFlow-${placesKey}`;
    const serialized = JSON.stringify(images);

    localStorage.setItem(key, serialized);

    setImagesByPlace((prev) => ({
      ...prev,
      [placesKey]: [...images],
    }));

    setTargetPlace(placesKey);
  };

  const onClose = () => {
    togglePhotoPicker();
    setTargetPlace(null);
  };

  const config = {
    // title: "Title",
    title: placeTitle,
    setTitle: setPlaceTitle,
    maxImages: 10,
    isOpen: activePicker === "places",
    onClose: onClose,
    onSave: handleSave,
    existingImages: placesImages,
    needsTitleInput: initialTitle === "",
  };

  return (
    <>
      <ImagePicker config={config} />
    </>
  );
}
