"use client";
import React, { useState, ChangeEvent } from "react";
import StepOne from "./Steps/StepOne";
import Image from "next/image";

export default function AlbumFlow() {
  const [selectedPhotos, setSelectedPhotos] = useState<
    Array<{ id: string; file: File; previewUrl: string }>
  >([]);
  const maxPhotos = 10;

  const handleBulkPhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const limitedFiles = files.slice(0, maxPhotos - selectedPhotos.length);

    const newPhotos = limitedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedPhotos((prev) => [...prev, ...newPhotos]);
  };

  const renderPhotoGrid = () => {
    const slots = [];

    selectedPhotos.forEach((photo, index) => {
      slots.push(
        <div
          key={photo.id}
          className="relative flex justify-center items-center"
        >
          <Image
            src={photo.previewUrl}
            alt={`Photo ${index + 1}`}
            fill
            // className="object-cover"
          />
        </div>
      );
    });

    const remainingSlots = maxPhotos - selectedPhotos.length;

    for (let i = 0; i < remainingSlots; i++) {
      slots.push(
        <div
          key={i}
          className="border border-[#DFDFDF] flex justify-center items-center"
        >
          <label
            key={`empty-${i}`}
            htmlFor="bulk-photo-input"
            className="photo-slot-empty"
          >
            <Image
              src="/images/plus-black.svg"
              height={14.5}
              width={14.5}
              alt="Plus icon"
            />
          </label>
        </div>
      );
    }

    return slots;
  };
  return (
    <div>
      <StepOne
        selectedPhotos={selectedPhotos}
        renderPhotoGrid={renderPhotoGrid}
        handleBulkPhotoSelect={handleBulkPhotoSelect}
      />
    </div>
  );
}
