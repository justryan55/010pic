"use client";

import React, { useEffect, useState } from "react";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import ImagePicker from "./ImagePicker";

interface SelectedImage {
  id: string;
  src: string;
  // file: File;
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

  const formattedTitle = personTitle.trim().replace(/\s+/g, "_") || "Untitled";
  const personKey = `${targetYear}-person-${formattedTitle}`;
  const peopleImages = imagesByPerson[targetPerson ?? ""] || [];

  const handleSave = (images: SelectedImage[]) => {
    try {
      const key = `photoFlow-${personKey}`;
      const serialized = JSON.stringify(images);

      localStorage.setItem(key, serialized);

      setImagesByPerson((prev) => ({
        ...prev,
        [personKey]: [...images],
      }));

      setTargetPerson(personKey);
    } catch (err) {
      console.log(err);
    }
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
