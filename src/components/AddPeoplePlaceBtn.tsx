"use client";

import { useCurrentPage } from "@/providers/PageProvider";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React from "react";

export default function AddPeoplePlaceBtn() {
  const { togglePicker, imagesByPlace, imagesByPerson, isLoadingImages } =
    usePhotoFlow();
  const { currentPage } = useCurrentPage();

  const handleClick = () => {
    if (currentPage === "people") {
      togglePicker("people");
      return;
    }

    if (currentPage === "places") {
      togglePicker("places");
      return;
    }
  };

  const shouldShow =
    (currentPage === "people" && Object.keys(imagesByPerson).length > 0) ||
    (currentPage === "places" && Object.keys(imagesByPlace).length > 0);

  if (isLoadingImages) return null;

  return (
    <div className="pb-4">
      {shouldShow && (
        <div onClick={() => handleClick()}>
          <p className="text-[13px] leading-[120%] font-normal underline text-left cursor-pointer">
            Add {currentPage === "places" ? "Place" : "People"}
          </p>
        </div>
      )}
    </div>
  );
}
