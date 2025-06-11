import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import Image from "next/image";
import React from "react";

interface SelectedImage {
  src: string;
  name: string;
}

interface ImageData {
  src: SelectedImage;
  name: SelectedImage;
}

export default function PhotoGrid({ month }: { month: string }) {
  const { targetYear, imagesByMonth } = usePhotoFlow();
  const monthKey = `${targetYear}-${month}`;
  const monthImages: ImageData[] = (imagesByMonth[monthKey] || []).map(
    (src) => ({ src, name: src })
  );

  return (
    <div className="grid grid-cols-5 grid-rows-2 h-56 gap-1 mt-2">
      {Array.from({ length: 10 }, (_, i) => {
        const image = monthImages[i];

        return (
          <div key={i} className="border border-[#DFDFDF] overflow-hidden">
            {image ? (
              <Image
                src={image.src.src}
                alt={image.name.name}
                height={50}
                width={50}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
