"use client";

import { useGetPathname } from "@/helpers/getPathname";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React from "react";

export default function AddPeoplePlaceBtn() {
  const {
    togglePicker,
    imagesByPlace,
    imagesByPerson,
    isLoadingImages,
  } = usePhotoFlow();

  const pathname = useGetPathname();

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
    (pathname === "/people" && Object.keys(imagesByPerson).length > 0) ||
    (pathname === "/places" && Object.keys(imagesByPlace).length > 0);

  if (isLoadingImages) return null;

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
