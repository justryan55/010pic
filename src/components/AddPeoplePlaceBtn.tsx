"use client";

import { useGetPathname } from "@/helpers/getPathname";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React from "react";

export default function AddPeoplePlaceBtn() {
    const { togglePicker } = usePhotoFlow();
  
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
  return (
    <div onClick={() => handleClick()}>
      {pathname !== "/date" && (
        <p className="text-[13px] leading-[120%] font-normal underline text-left">
          Add {pathname === "/places" ? "Place" : "People"}
        </p>
      )}
    </div>
  );
}
