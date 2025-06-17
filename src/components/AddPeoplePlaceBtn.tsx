"use client";

import { useGetPathname } from "@/helpers/getPathname";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React from "react";

export default function AddPeoplePlaceBtn() {
  const { togglePicker, imagesByPlace, targetYear, imagesByPerson } =
    usePhotoFlow();

  const pathname = useGetPathname();

  const placeKeys = Object.keys(imagesByPlace).filter((key) =>
    key.startsWith(`${targetYear}-place-`)
  );

  const peopleKeys = Object.keys(imagesByPerson).filter((key) =>
    key.startsWith(`${targetYear}-person-`)
  );

  const handleClick = () => {
    if (pathname === "/people") {
      togglePicker("people");
      return;
    }

    if (pathname === "/places") {
      togglePicker("places");
      return;
    }
  };

  const shouldShow =
    (pathname === "/people" && peopleKeys.length > 0) ||
    (pathname === "/places" && placeKeys.length > 0);

  return (
    <>
      {shouldShow && (
        <div onClick={() => handleClick()}>
          <p className="text-[13px] leading-[120%] font-normal underline text-left cursor-pointer">
            Add {pathname === "/places" ? "Place" : "People"}
          </p>
        </div>
      )}
    </>
  );
}
