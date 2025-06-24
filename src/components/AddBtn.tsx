"use client";

import React from "react";
import Image from "next/image";
import { useSubscription } from "@/providers/SubscriptionProvider";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import { useCurrentPage } from "@/providers/PageProvider";

export default function AddBtn({
  subscribed,
  imageCount,
}: {
  subscribed: boolean;
}) {
  const { toggleSubscription } = useSubscription();
  const { togglePicker } = usePhotoFlow();
  const { currentPage } = useCurrentPage();

  const handleClick = () => {
    if (!subscribed) {
      toggleSubscription();
      return;
    }

    if (currentPage === "date") {
      togglePicker("date");
      return;
    }

    if (currentPage === "people") {
      togglePicker("people");
      return;
    }

    if (currentPage === "places") {
      togglePicker("places");
      return;
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label="Add item"
      className="flex justify-center items-center bg-black text-white w-[28px] h-[28px] rounded-full cursor-pointer"
    >
      <Image
        // src="/images/plus.svg"
        src={imageCount === 0 ? "/images/plus.svg" : "/images/edit.svg"}
        height={14.5}
        width={14.5}
        alt="Plus icon"
      />
    </button>
  );
}
