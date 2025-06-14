"use client";

import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/Button";
import Image from "next/image";
import { nanoid } from "nanoid";
import Input from "@/components/Input";

interface SelectedImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

interface ImagePickerConfig {
  title: string;
  setTitle?: (value: string) => void;
  maxImages: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (images: SelectedImage[]) => void;
  existingImages?: SelectedImage[];
  needsTitleInput?: boolean;
}

interface ImagePickerProps {
  config: ImagePickerConfig;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ config }) => {
  const {
    title,
    setTitle,
    maxImages,
    isOpen,
    onClose,
    onSave,
    existingImages = [],
    needsTitleInput = false,
  } = config;

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [mainImage, setMainImage] = useState<SelectedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFiles = (files: File[]) => {
    const remainingSlots =
      maxImages - existingImages.length - selectedImages.length;
    const validFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remainingSlots);

    validFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const newImage = {
          id: nanoid(),
          src: e.target?.result as string,
          file: file,
          name: file.name,
        };

        setSelectedImages((prev) => [...prev, newImage]);

        setMainImage(newImage);
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
    const isExistingImage = existingImages.some((img) => img.id === imageId);

    if (isExistingImage) {
      const updatedExisting = existingImages.filter(
        (img) => img.id !== imageId
      );
      onSave(updatedExisting);
    } else {
      setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
    }

    if (mainImage?.id === imageId) {
      const allImages = [...existingImages, ...selectedImages].filter(
        (img) => img.id !== imageId
      );
      setMainImage(allImages.length > 0 ? allImages[0] : null);
    }
  };

  const handleSave = () => {
    if (selectedImages.length > 0) {
      const allImages = [...selectedImages, ...existingImages];
      onSave(allImages);
      setSelectedImages([]);
      setMainImage(null);
    }
    onClose();
  };

  const handleClose = () => {
    setSelectedImages([]);
    setMainImage(null);
    onClose();
  };

  // Enhanced save handler for Firefox Mobile compatibility
  const handleNextClick = () => {
    // Add small delay to ensure event is processed
    setTimeout(() => {
      handleSave();
    }, 10);
  };

  // Touch event handlers for better mobile compatibility
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleSave();
  };

  useEffect(() => {
    if (isOpen && !mainImage) {
      const allImages = [...existingImages, ...selectedImages];
      if (allImages.length > 0) {
        setMainImage(allImages[0]);
      }
    }
  }, [isOpen, mainImage, existingImages, selectedImages]);

  // Prevent body scroll when modal is open (helps with Firefox Mobile)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  const allImages = [...existingImages, ...selectedImages];
  const totalCount = allImages.length;
  const isButtonDisabled =
    existingImages.length === 0 && selectedImages.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--brand-bg)]">
      <div className="flex flex-col h-full px-6 py-4">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-row justify-between items-center mb-4">
            {needsTitleInput ? (
              <div className="font-medium text-lg leading-[120%]">Title</div>
            ) : (
              <div className="font-medium text-[28px] leading-[120%]">
                {title}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="p-2 touch-manipulation"
                aria-label="Close"
              >
                <Image
                  src="/images/X.svg"
                  alt="Close Button"
                  width={14}
                  height={14}
                />
              </button>
            </div>
          </div>

          {needsTitleInput && (
            <div className="mb-4">
              <Input
                id="places"
                type="text"
                placeholder="Enter place title"
                value={title}
                onChange={(e) => setTitle?.(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-start items-center my-2 mb-1 gap-2">
            <h2 className="text-sm font-semibold">Add Photos</h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm font-normal">
                {totalCount.toString().padStart(2, "0")} / {maxImages}
              </span>
            </div>
          </div>

          <div className="pt-1">
            {mainImage ? (
              <div className="relative mb-4">
                <Image
                  src={mainImage.src}
                  alt="Selected"
                  className="w-full h-100 object-cover rounded-lg"
                  width={100}
                  height={100}
                />
              </div>
            ) : (
              <div
                className="w-full h-100 border rounded-lg border-[#DFDFDF] flex flex-col items-center justify-center mb-4 cursor-pointer touch-manipulation"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image
                  src="/images/file-add.svg"
                  height={32}
                  width={32}
                  alt="Plus icon"
                />
              </div>
            )}

            <div>
              <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain touch-pan-x">
                {allImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative cursor-pointer flex-none w-20 h-28 rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
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
                      className="absolute top-1 right-0 bg-white rounded-full p-1 touch-manipulation"
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
                {Array.from({
                  length: maxImages - totalCount,
                }).map((_, i) => (
                  <button
                    key={`add-btn-${i}`}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-none w-20 h-28 rounded-lg border border-[#DFDFDF] flex items-center justify-center touch-manipulation"
                    aria-label="Add image"
                  >
                    <Image
                      src="/images/file-add.svg"
                      height={20}
                      width={20}
                      alt="Plus icon"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed button container at bottom */}
        <div className="flex-shrink-0 pt-4 pb-safe">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: "manipulation" }}
          >
            <Button
              text="NEXT"
              onClick={handleNextClick}
              disabled={isButtonDisabled}
            />
          </div>{" "}
        </div>

        <label htmlFor="file-upload" className="hidden">
          Upload Images
        </label>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          multiple={true}
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload Images"
          title="Upload Images"
        />
      </div>
    </div>
  );
};

export default ImagePicker;
