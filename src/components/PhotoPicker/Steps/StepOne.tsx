import React, { useState, useRef } from "react";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import Button from "@/components/Button";
import Image from "next/image";
import { nanoid } from "nanoid";

interface SelectedImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

const ImagePicker = () => {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [mainImage, setMainImage] = useState<SelectedImage | null>(null);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPhotoPickerOpen, togglePhotoPicker } = usePhotoFlow();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const remainingSlots = 10 - selectedImages.length;
    const validFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remainingSlots);

    validFiles.forEach((file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const newImage = {
          id: nanoid(),
          src: e.target?.result as string,
          file: file,
          name: file.name,
        };

        setSelectedImages((prev) => [...prev, newImage]);

        if (!mainImage) {
          setMainImage(newImage);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const selectMainImage = (image: SelectedImage) => {
    setMainImage(image);
  };

  const removeImage = (imageId: string) => {
    setSelectedImages((prev) => {
      const updated = prev.filter((img) => img.id !== imageId);
      if (mainImage?.id === imageId) {
        setMainImage(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });
  };

  const handleNext = () => {
    // Here you would typically navigate to next step or save data
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-[var(--brand-bg)] px-6 flex flex-col justify-evenly transition-transform duration-300 min-h-screen ${
        isPhotoPickerOpen ? "translate-y-0" : "translate-y-full"
      } `}
    >
      <div>
        <div className="w-full flex justify-end my-3">
          <Image
            onClick={togglePhotoPicker}
            src="/images/X.svg"
            alt="Cancel Button"
            width={14}
            height={14}
          />
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold">Title</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm font-normal">
              You have {10 - selectedImages.length} photos left
            </span>
          </div>
        </div>
        <div className="pt-1">
          {mainImage ? (
            <div className="relative mb-4">
              <Image
                src={mainImage.src}
                alt="Selected"
                className="w-full h-80 object-cover rounded-lg"
                width={100}
                height={100}
              />
            </div>
          ) : (
            <div
              className="w-full h-100 border border-[#DFDFDF]  flex flex-col items-center justify-center mb-4 cursor-pointer "
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image
                src="/images/plus-black.svg"
                height={14.5}
                width={14.5}
                alt="Plus icon"
              />
            </div>
          )}

          <div className="flex justify-end items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="multiple"
              checked={allowMultiple}
              onChange={(e) => setAllowMultiple(e.target.checked)}
              className="w-4 h-4"
            />
            <label
              htmlFor="multiple"
              className="text-sm font-normal leading-[120%]"
            >
              Add multiple
            </label>
          </div>

          <div>
            <div className="flex gap-2 overflow-x-auto  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain touch-pan-x">
              {selectedImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative cursor-pointer flex-none w-20 h-28 overflow-hidden border-2 transition-all ${
                    mainImage?.id === image.id
                      ? "border-black ring-1 ring-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => selectMainImage(image)}
                >
                  <Image
                    src={image.src}
                    alt="Thumbnail"
                    className="w-full h-28 object-cover"
                    fill
                  />
                  <button
                    aria-label="Remove image"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute top-1 right-0 bg-white rounded-full p-1"
                  >
                    <Image
                      src="/images/X.svg"
                      alt="Cancel Button"
                      width={14}
                      height={14}
                    />
                  </button>
                </div>
              ))}
              {Array.from({ length: 10 - selectedImages.length }).map(
                (_, i) => (
                  <button
                    key={`add-btn-${i}`}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-none w-20 h-28 border border-[#DFDFDF] flex items-center justify-center"
                    aria-label="Add image"
                  >
                    <Image
                      src="/images/plus-black.svg"
                      height={14.5}
                      width={14.5}
                      alt="Plus icon"
                    />
                  </button>
                )
              )}
            </div>
          </div>
        </div>{" "}
      </div>

      <Button
        text="NEXT"
        onClick={handleNext}
        disabled={selectedImages.length === 0}
      />

      <label htmlFor="file-upload" className="hidden">
        Upload Images
      </label>
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        multiple={allowMultiple}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload Images"
        title="Upload Images"
      />
    </div>
  );
};

export default ImagePicker;
