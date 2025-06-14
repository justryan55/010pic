"use client";

import { useGetPathname } from "@/helpers/getPathname";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React from "react";

export default function AddPeoplePlaceBtn() {
  const { togglePicker, imagesByPlace, targetYear } = usePhotoFlow();

  const pathname = useGetPathname();

  const placeKeys = Object.keys(imagesByPlace).filter((key) =>
    key.startsWith(`${targetYear}-place-`)
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
  return (
    <div onClick={() => handleClick()}>
      {pathname !== "/date" && placeKeys.length !== 0 && (
        <p className="text-[13px] leading-[120%] font-normal underline text-left cursor-pointer">
          Add {pathname === "/places" ? "Place" : "People"}
        </p>
      )}
    </div>
  );
}
