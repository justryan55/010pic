"use client";

import AddBtn from "@/components/AddBtn";
import React from "react";
import CollectionHeader from "@/components/CollectionHeader";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";

export default function People() {
  const { targetYear, imagesByPerson, setTargetPerson } = usePhotoFlow();

  const personKeys = Object.keys(imagesByPerson).filter((key) =>
    key.startsWith(`${targetYear}-person-`)
  );

  function getPersonNameFromKey(key: string, year: number | null) {
    if (!year) return key;

    return key.replace(`${year}-person-`, "").replace(/_/g, " ");
  }

  function PeoplePhotoGrid({ person }: { person: string }) {
    const images = imagesByPerson[person] || [];

    return <PhotoGrid images={images} />;
  }

  function PeopleHeader({ person }: { person: string }) {
    const personName = getPersonNameFromKey(person, targetYear);
    const images = imagesByPerson[person] || [];
    const imageCount = images.length;
    return <CollectionHeader header={personName} imageCount={imageCount} />;
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
            {/* <Image
             src="/images/lock.svg"
             width={11}
             height={15}
             alt="Image of lock"
           /> */}
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
