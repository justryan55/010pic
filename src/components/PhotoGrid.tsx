"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/zoom";

interface SelectedImage {
  id: string;
  src: string;
  name: string;
}

interface PhotoGridProps {
  images: SelectedImage[];
  title: string;
}

export default function PhotoGrid({ images, title }: PhotoGridProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const openFullScreen = (image: SelectedImage) => {
    const index = images.findIndex((img) => img.id === image.id);
    setCurrentImageIndex(index);
  };

  const closeFullScreen = () => {
    setCurrentImageIndex(null);
  };

  const goToPrevious = () => {
    if (currentImageIndex !== null && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentImageIndex !== null && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  const currentImage =
    currentImageIndex !== null ? images[currentImageIndex] : null;

  useEffect(() => {
    if (currentImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [currentImageIndex]);

  return (
    <div>
      <div className="grid grid-cols-5 grid-rows-2 h-56 gap-1 mt-2">
        {Array.from({ length: 10 }, (_, i) => {
          const image = images[i];

          return (
            <div key={i} className="border border-[#DFDFDF] overflow-hidden">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.name}
                  height={50}
                  width={50}
                  className="w-full h-full object-cover"
                  onClick={() => openFullScreen(image)}
                />
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {currentImage && (
        <>
          <div
            className="fixed inset-0 z-50 w-full bg-black/90 flex flex-col justify-center items-center"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest(".swiper-slide")) return;
              closeFullScreen();
            }}
          >
            <h1 className="absolute top-8 left-4 z-60 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors">
              {title}
            </h1>
            <button
              onClick={closeFullScreen}
              className="absolute top-8 right-4 z-60 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              title="Close fullscreen view"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <Swiper
              modules={[Zoom]}
              zoom={{ maxRatio: 3 }}
              initialSlide={currentImageIndex ?? 0}
              onSlideChange={(swiper) =>
                setCurrentImageIndex(swiper.activeIndex)
              }
              className="w-full h-full"
            >
              {images.map((image) => (
                <SwiperSlide key={image.id}>
                  <div
                    className="swiper-zoom-container flex justify-center items-center h-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image
                      src={image.src}
                      alt={image.name}
                      width={800}
                      height={600}
                      className="max-w-full max-h-full object-contain select-none"
                      priority
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-60 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
