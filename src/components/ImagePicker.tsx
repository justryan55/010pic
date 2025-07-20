"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { nanoid } from "nanoid";
import Input from "@/components/Input";
import Button from "./Button";
import { softDeleteImage, uploadImagesToSupabase } from "@/lib/imageManager";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase/createSupabaseClient";

interface SelectedImage {
  id: string;
  src: string;
  name: string;
  isUploading?: boolean;
  file?: File;
}

interface ImagePickerConfig {
  title: string;
  setTitle?: (value: string) => void;
  maxImages: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (images: SelectedImage[]) => void;
  targetYear: number;
  existingImages?: SelectedImage[];
  needsTitleInput?: boolean;
  monthIndex?: string;
  folderType?: string;
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
    targetYear,
    existingImages = [],
    needsTitleInput = false,
    monthIndex,
    folderType,
  } = config;

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [mainImage, setMainImage] = useState<SelectedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const slideVariants = {
    hidden: { y: "100%", opacity: 1 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 1 },
  };

  const isMobile = () => {
    return Capacitor.isNativePlatform();
  };

  const isPhotoAccessAvailable = () => {
    return Capacitor.isPluginAvailable("Camera");
  };

  useEffect(() => {
    const checkPermissionsOnMount = async () => {
      if (isOpen && isMobile() && isPhotoAccessAvailable()) {
        try {
          const currentStatus = await Camera.checkPermissions();
          if (
            currentStatus.photos !== "granted" &&
            currentStatus.photos !== "limited"
          ) {
            setError(
              "Photo library access is required. Please enable it in your device settings."
            );
          } else {
            setError("");
          }
        } catch (error) {
          console.error("Error checking permissions on mount:", error);
        }
      }
    };

    checkPermissionsOnMount();
  }, [isOpen]);

  const pickImages = async () => {
    if (isMobile() && isPhotoAccessAvailable()) {
      try {
        const currentStatus = await Camera.checkPermissions();

        if (
          currentStatus.photos !== "granted" &&
          currentStatus.photos !== "limited"
        ) {
          setError(
            "Photo library access is required. Please enable it in your device settings and restart the app."
          );
          return;
        }

        if (Camera.pickImages) {
          const result = await Camera.pickImages({
            quality: 90,
            limit: maxImages - existingImages.length - pendingFiles.length,
          });

          const files: File[] = [];

          for (const photo of result.photos) {
            const response = await fetch(photo.webPath!);
            const blob = await response.blob();
            const file = new File([blob], `image_${nanoid()}.jpeg`, {
              type: blob.type,
            });
            files.push(file);
          }

          processFiles(files);
        } else {
          const remainingSlots =
            maxImages - existingImages.length - pendingFiles.length;
          const promises = [];

          for (let i = 0; i < Math.min(remainingSlots, 5); i++) {
            promises.push(
              Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Photos,
              })
            );
          }

          try {
            const results = await Promise.allSettled(promises);
            const files: File[] = [];

            for (const result of results) {
              if (result.status === "fulfilled" && result.value.webPath) {
                const response = await fetch(result.value.webPath);
                const blob = await response.blob();
                const file = new File([blob], `image_${nanoid()}.jpeg`, {
                  type: blob.type,
                });
                files.push(file);
              }
            }

            if (files.length > 0) {
              processFiles(files);
            }
          } catch (error) {
            console.error("Error with fallback method:", error);
            if (isMobile()) {
              setError(
                "Unable to access photos. Please check your permissions in device settings."
              );
            } else {
              fileInputRef.current?.click();
            }
          }
        }
      } catch (error) {
        console.error("Error picking images:", error);
        if (isMobile()) {
          setError(
            "Unable to access photos. Please check your permissions in device settings."
          );
        } else {
          fileInputRef.current?.click();
        }
      }
    } else {
      fileInputRef.current?.click();
    }
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(event.target.files || []);
      processFiles(files);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.log(err);
    }
  };

  const processFiles = async (files: File[]) => {
    try {
      const remainingSlots =
        maxImages - existingImages.length - pendingFiles.length;
      const validFiles = files
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, remainingSlots);

      setPendingFiles((prev) => [...prev, ...validFiles]);

      for (const file of validFiles) {
        const tempId = nanoid();

        const tempImage: SelectedImage = {
          id: tempId,
          src: "",
          name: file.name,
          isUploading: true,
          file: file,
        };

        setSelectedImages((prev) => [...prev, tempImage]);

        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImages((prev) =>
            prev.map((img) =>
              img.id === tempId
                ? {
                    ...img,
                    src: e.target?.result as string,
                    isUploading: false,
                  }
                : img
            )
          );
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.log(err);
    }
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
    if (!image.isUploading) {
      setMainImage(image);
    }
  };

  const removeImage = async (imageId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      console.error("User not authenticated.");
      return [];
    }

    const isExistingImage = existingImages.some((img) => img.id === imageId);

    if (isExistingImage) {
      const res = await softDeleteImage(imageId);

      if (!res.success || !res.data) {
        console.error("Failed to soft delete image");
        return;
      }

      const r2Key = res?.data.path;
      const fullR2Key = r2Key.startsWith("images/") ? r2Key : `images/${r2Key}`;

      if (r2Key) {
        try {
          const response = await fetch(
            `https://supabase-r2-handler.app010pic.workers.dev/api/delete-image/${encodeURIComponent(
              fullR2Key
            )}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to delete image from R2:", errorData.error);
          } else {
            console.log("Successfully deleted image from R2");
          }
        } catch (err) {
          console.error("Failed to delete image from R2:", err);
        }
      }

      const updatedExisting = existingImages.filter(
        (img) => img.id !== imageId
      );
      onSave(updatedExisting);
    } else {
      const imageToRemove = selectedImages.find((img) => img.id === imageId);

      if (imageToRemove) {
        setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));

        if (imageToRemove.file) {
          setPendingFiles((prev) =>
            prev.filter((file) => file !== imageToRemove.file)
          );
        }
      }
    }

    if (mainImage?.id === imageId) {
      const allImages = [...existingImages, ...selectedImages].filter(
        (img) => img.id !== imageId
      );
      setMainImage(allImages.length > 0 ? allImages[0] : null);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      if (pendingFiles.length > 0) {
        const cleanTitle = title?.trim() || "untitled";

        const storagePath =
          monthIndex !== undefined
            ? `photos/${targetYear}/${folderType}/${monthIndex}`
            : `photos/${targetYear}/${folderType}/${cleanTitle.replace(
                /\s+/g,
                "_"
              )}`;

        const uploadedImages = await uploadImagesToSupabase(
          pendingFiles,
          storagePath
        );

        const allImages = [...existingImages, ...uploadedImages];
        onSave(allImages);
      } else {
        onSave(existingImages);
      }

      setPendingFiles([]);
      setSelectedImages([]);
      setMainImage(null);
      setTitle?.("");
    } catch (error) {
      console.error("Error saving images:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedImages([]);
    setMainImage(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen && !mainImage) {
      const allImages = [...existingImages, ...selectedImages];
      const availableImages = allImages.filter((img) => !img.isUploading);
      if (availableImages.length > 0) {
        setMainImage(availableImages[0]);
      }
    }
  }, [isOpen, mainImage, existingImages, selectedImages]);

  const allImages = [...existingImages, ...selectedImages];
  const totalCount = allImages.length;
  const hasUploadingImages = selectedImages.some((img) => img.isUploading);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 flex items-end"
        >
          <div
            className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-[var(--brand-bg)] px-6 flex flex-col justify-around min-h-screen`}
          >
            <div>
              <div className="flex flex-row justify-between items-center">
                {needsTitleInput ? (
                  <div className="font-medium text-lg leading-[120%]">
                    Title
                  </div>
                ) : (
                  <div className="font-medium text-[28px] leading-[120%]">
                    {title}
                  </div>
                )}

                <div className=" flex justify-end my-3">
                  <Image
                    onClick={handleClose}
                    src="/images/X.svg"
                    alt="Close Button"
                    width={14}
                    height={14}
                  />
                </div>
              </div>
              {needsTitleInput && (
                <div>
                  <Input
                    id="places"
                    type="text"
                    placeholder="Enter collection title"
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
                    {mainImage.isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src="/images/spinner-black.svg"
                          height={32}
                          width={32}
                          alt="Uploading..."
                          className="animate-spin"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="w-full h-100 border rounded-lg border-[#DFDFDF] flex flex-col items-center justify-center mb-4 cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={pickImages}
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
                        className={`relative cursor-pointer flex-none w-20 h-28 rounded-lg overflow-hidden border-2 transition-all ${
                          mainImage?.id === image.id
                            ? "border-black ring-1 ring-black"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        onClick={() => selectMainImage(image)}
                      >
                        {image.src && (
                          <Image
                            src={image.src}
                            alt="Thumbnail"
                            className="w-full h-28 object-cover"
                            fill
                          />
                        )}

                        {image.isUploading ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                              src="/images/spinner-black.svg"
                              height={20}
                              width={20}
                              alt="Uploading..."
                              className="animate-spin"
                            />
                          </div>
                        ) : (
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
                        )}
                      </div>
                    ))}
                    {Array.from({
                      length: maxImages - totalCount,
                    }).map((_, i) => (
                      <button
                        key={`add-btn-${i}`}
                        onClick={pickImages}
                        className="flex-none w-20 h-28 rounded-lg border border-[#DFDFDF] flex items-center justify-center"
                        aria-label="Add image"
                        disabled={hasUploadingImages}
                      >
                        <Image
                          src="/images/file-add.svg"
                          height={20}
                          width={20}
                          alt="Plus icon"
                          className={hasUploadingImages ? "opacity-50" : ""}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button
              text="SAVE"
              onClick={handleSave}
              disabled={
                (existingImages.length === 0 && selectedImages.length === 0) ||
                hasUploadingImages
              }
              isLoading={isLoading}
            />

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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePicker;
