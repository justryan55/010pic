"use client";

import AddBtn from "@/components/AddBtn";
import CollectionHeader from "@/components/CollectionHeader";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React from "react";

export default function Places() {
  const { targetYear, imagesByPlace, setTargetPlace } = usePhotoFlow();

  const placeKeys = Object.keys(imagesByPlace).filter((key) =>
    key.startsWith(`${targetYear}-place-`)
  );

  function getPlaceNameFromKey(key: string, year: number | null) {
    if (!year) return key;

    return key.replace(`${year}-place-`, "").replace(/_/g, " ");
  }

  function PlacesPhotoGrid({ place }: { place: string }) {
    const images = imagesByPlace[place] || [];

    return <PhotoGrid images={images} />;
  }

  function PlacesHeader({ place }: { place: string }) {
    const placeName = getPlaceNameFromKey(place, targetYear);
    const images = imagesByPlace[place] || [];
    const imageCount = images.length;
    return <CollectionHeader header={placeName} imageCount={imageCount} />;
  }
  return (
    <div
      className={`flex flex-col ${
        placeKeys.length === 0 ? "justify-center" : "justify-start"
      } items-center min-h-[70vh]`}
    >
      {placeKeys.length === 0 && (
        <>
          <AddBtn subscribed={true} />
          <div className="flex flex-row gap-x-2 mt-2">
            {/* <Image
          src="/images/lock.svg"
          width={11}
          height={15}
          alt="Image of lock"
        /> */}
            <p className="text-sm leading-[120%] font-normal text-[#6F6F6F]">
              Add Place
            </p>
          </div>
        </>
      )}
      {placeKeys.map((placeKey) => (
        <div
          key={placeKey}
          className="mt-4 w-full"
          onClick={() => setTargetPlace(placeKey)}
        >
          <PlacesHeader place={placeKey} />

          <PlacesPhotoGrid place={placeKey} />
        </div>
      ))}
    </div>
  );
}
