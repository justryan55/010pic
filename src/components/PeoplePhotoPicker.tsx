"use client";
import React, { useEffect, useState, useMemo } from "react";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import ImagePicker from "./ImagePicker";

interface SelectedImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

export default function PeoplePhotoPicker() {
  const {
    targetYear,
    targetPerson,
    setTargetPerson,
    imagesByPerson,
    setImagesByPerson,
    activePicker,
    togglePhotoPicker,
  } = usePhotoFlow();

  const initialTitle =
    targetPerson?.replace(`${targetYear}-person-`, "").replace(/_/g, " ") ?? "";

  const [personTitle, setPersonTitle] = useState(initialTitle);

  // Memoize the current person key to prevent it from changing during the session
  const currentPersonKey = useMemo(() => {
    return targetPerson || `${targetYear}-person-new`;
  }, [targetPerson, targetYear]);

  // Get existing images using the stable currentPersonKey
  const peopleImages = imagesByPerson[currentPersonKey] || [];

  const handleSave = (images: SelectedImage[]) => {
    // Generate the final key based on the current title
    const formattedTitle =
      personTitle.trim().replace(/\s+/g, "_") || "Untitled";
    const finalPersonKey = `${targetYear}-person-${formattedTitle}`;

    // Save to localStorage
    const key = `photoFlow-${finalPersonKey}`;
    const serialized = JSON.stringify(images);
    localStorage.setItem(key, serialized);

    // Update state - handle key change if needed
    setImagesByPerson((prev) => {
      const newState = { ...prev };

      // If the key changed, remove old entry and add new one
      if (currentPersonKey !== finalPersonKey && currentPersonKey in newState) {
        delete newState[currentPersonKey];
        // Also remove from localStorage
        localStorage.removeItem(`photoFlow-${currentPersonKey}`);
      }

      newState[finalPersonKey] = [...images];
      return newState;
    });

    // Update the target person to the final key
    setTargetPerson(finalPersonKey);
  };

  const onClose = () => {
    togglePhotoPicker();
    setTargetPerson(null);
  };

  useEffect(() => {
    setPersonTitle(initialTitle);
  }, [initialTitle]);

  const config = {
    title: personTitle,
    setTitle: setPersonTitle,
    maxImages: 10,
    isOpen: activePicker === "people",
    onClose: onClose,
    onSave: handleSave,
    existingImages: peopleImages,
    needsTitleInput: initialTitle === "",
  };

  return <ImagePicker config={config} />;
}
