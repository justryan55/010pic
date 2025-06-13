"use client";

import React from "react";
import Image from "next/image";
import { useSubscription } from "@/providers/SubscriptionProvider";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import { useGetPathname } from "@/helpers/getPathname";

export default function AddBtn({ subscribed }: { subscribed: boolean }) {
  const { toggleSubscription } = useSubscription();
  // const { toggleAlbumFlow, togglePhotoPicker } = usePhotoFlow();
  const { togglePicker, activePicker } = usePhotoFlow();

  const pathname = useGetPathname();

  const handleClick = () => {
    if (!subscribed) {
      toggleSubscription();
      return;
    }

    if (pathname === "/date") {
      togglePicker("date");
      return;
    }

    if (pathname === "/people") {
      togglePicker("people");
      return;
    }

    if (pathname === "/places") {
      togglePicker("places");
      return;
    }
    // toggleAlbumFlow();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label="Add item"
      className="flex justify-center items-center bg-black text-white w-[28px] h-[28px] rounded-full hover:cursor-pointer"
    >
      <Image
        src="/images/plus.svg"
        height={14.5}
        width={14.5}
        alt="Plus icon"
      />
    </button>
  );
}
