import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import Image from "next/image";
import React, { useState } from "react";

interface SelectedImage {
  id: string;
  src: string;
  name: string;
}

export default function PhotoGrid({ month }: { month: string }) {
  const [fullScreenImage, setFullScreenImage] = useState<SelectedImage | null>(
    null
  );

  const { targetYear, imagesByMonth } = usePhotoFlow();
  const monthKey = `${targetYear}-${month}`;
  const monthImages: SelectedImage[] = imagesByMonth[monthKey] || [];

  const openFullScreen = (image: SelectedImage) => {
    setFullScreenImage(image);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  return (
    <div>
      <div className="grid grid-cols-5 grid-rows-2 h-56 gap-1 mt-2">
        {Array.from({ length: 10 }, (_, i) => {
          const image = monthImages[i];

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

      {fullScreenImage && (
        <>
          <div
            className={`fixed inset-0 z-50 w-full bg-black/75 px-6 flex flex-col justify-center items-center transition-transform duration-300`}
            onClick={closeFullScreen}
          >
            <Image
              src={fullScreenImage.src}
              alt={fullScreenImage.name}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              priority
            />
          </div>
        </>
      )}
    </div>
  );
}
