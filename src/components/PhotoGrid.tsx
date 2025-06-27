"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Zoom } from "swiper/modules";
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

  const openFullScreen = (image: SelectedImage) => {
    const index = images.findIndex((img) => img.id === image.id);
    setCurrentImageIndex(index);
  };

  const closeFullScreen = () => {
    setCurrentImageIndex(null);
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openFullScreen(image);
                  }}
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
              modules={[Zoom, Pagination]}
              zoom={{ maxRatio: 3 }}
              pagination={{
                clickable: true,
                renderBullet: (index, className) =>
                  `<span class="${className} custom-dot"></span>`,
              }}
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
          </div>
        </>
      )}
    </div>
  );
}
