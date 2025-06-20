"use client";

import AddBtn from "@/components/AddBtn";
import CollectionHeader from "@/components/CollectionHeader";
import PhotoGrid from "@/components/PhotoGrid";
import { fetchUserImagesByPlaceYear } from "@/lib/imageManager";
import { useCurrentPage } from "@/providers/PageProvider";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Places() {
  const {
    targetYear,
    imagesByPlace,
    setTargetPlace,
    setImagesByPlace,
    setIsLoadingImages,
    refreshToggle,
  } = usePhotoFlow();
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentPage } = useCurrentPage();

  useEffect(() => {
    setCurrentPage("places");
  }, [setCurrentPage]);

  const placeKeys = Object.keys(imagesByPlace);

  function getPlaceNameFromKey(key: string, year: number | null) {
    if (!year) return key;

    return key.replace(`${year}-place-`, "").replace(/_/g, " ");
  }

  function PlacesHeader({ place }: { place: string }) {
    const placeName = getPlaceNameFromKey(place, targetYear);
    const images = imagesByPlace[place] || [];
    const imageCount = images.length;
    return <CollectionHeader header={placeName} imageCount={imageCount} />;
  }

  function PlacesPhotoGrid({ place }: { place: string }) {
    const images = imagesByPlace[place] || [];
    return <PhotoGrid images={images} title={place} />;
  }

  useEffect(() => {
    const loadPeopleForYear = async () => {
      if (!targetYear) return;
      setIsLoading(true);
      setIsLoadingImages(true);

      const placesImages = await fetchUserImagesByPlaceYear(
        targetYear.toString()
      );

      setImagesByPlace(placesImages);
      setIsLoading(false);
      setIsLoadingImages(false);
    };

    loadPeopleForYear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetYear, refreshToggle]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Image
          src="/images/spinner-black.svg"
          width={20}
          height={20}
          alt="Loading spinner"
        />
      </div>
    );
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
