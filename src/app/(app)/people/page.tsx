"use client";

import AddBtn from "@/components/AddBtn";
import React, { useEffect, useState } from "react";
import CollectionHeader from "@/components/CollectionHeader";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import { fetchUserImagesByPersonYear } from "@/lib/imageManager";
import Image from "next/image";
import { useCurrentPage } from "@/providers/PageProvider";

export default function People() {
  const {
    targetYear,
    imagesByPerson,
    setTargetPerson,
    setImagesByPerson,
    setIsLoadingImages,
    refreshToggle,
  } = usePhotoFlow();
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentPage } = useCurrentPage();

  useEffect(() => {
    setCurrentPage("people");
  }, [setCurrentPage]);

  const personKeys = Object.keys(imagesByPerson);

  function getPersonNameFromKey(key: string, year: number | null) {
    if (!year) return key;

    return key.replace(`${year}-person-`, "").replace(/_/g, " ");
  }

  function PeopleHeader({ person }: { person: string }) {
    const personName = getPersonNameFromKey(person, targetYear);
    const images = imagesByPerson[person] || [];
    return <CollectionHeader header={personName} imageCount={images.length} />;
  }

  function PeoplePhotoGrid({ person }: { person: string }) {
    const images = imagesByPerson[person] || [];
    return <PhotoGrid images={images} />;
  }

  useEffect(() => {
    const loadPeopleForYear = async () => {
      if (!targetYear) return;
      setIsLoading(true);
      setIsLoadingImages(true);

      const peopleImages = await fetchUserImagesByPersonYear(
        targetYear.toString()
      );

      setImagesByPerson(peopleImages);
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
        personKeys.length === 0 ? "justify-center" : "justify-start"
      } items-center min-h-[70vh]`}
    >
      {personKeys.length === 0 && (
        <>
          <AddBtn subscribed={true} />
          <div className="flex flex-row gap-x-2 mt-2">
            <p className="text-sm leading-[120%] font-normal text-[#6F6F6F]">
              Add Person
            </p>
          </div>
        </>
      )}

      {personKeys.map((personKey) => (
        <div
          key={personKey}
          className="mt-4 w-full"
          onClick={() => setTargetPerson(personKey)}
        >
          <PeopleHeader person={personKey} />
          <PeoplePhotoGrid person={personKey} />
        </div>
      ))}
    </div>
  );
}
