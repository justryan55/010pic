"use client";

import React from "react";
import Image from "next/image";
import { useSubscription } from "@/providers/SubscriptionProvider";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import { useCurrentPage } from "@/providers/PageProvider";
import { useRevenueCat } from "@/hooks/useRevenueCat";

export default function AddBtn({
  imageCount,
  requiresSubscription = false,
}: {
  imageCount: number;
  requiresSubscription?: boolean;
}) {
  const { toggleSubscription } = useSubscription();
  const { togglePicker } = usePhotoFlow();
  const { currentPage } = useCurrentPage();
  const { subscriptionStatus } = useRevenueCat();

  const isSubscribed = Boolean(subscriptionStatus?.isSubscribed);

  const handleClick = () => {
    if (requiresSubscription && !isSubscribed) {
      toggleSubscription();
      return;
    }

    if (currentPage === "date") togglePicker("date");
    if (currentPage === "people") togglePicker("people");
    if (currentPage === "places") togglePicker("places");
  };

  return (
    <div className="flex flex-row gap-2">
      {requiresSubscription && currentPage === "date" && (
        <Image
          src="/images/lock.svg"
          width={16}
          height={21}
          alt="Image of lock"
        />
      )}
      <button
        onClick={handleClick}
        type="button"
        aria-label="Add item"
        className="flex justify-center items-center bg-black text-white w-[28px] h-[28px] rounded-full cursor-pointer"
      >
        <Image
          src={imageCount === 0 ? "/images/plus.svg" : "/images/edit.svg"}
          height={14.5}
          width={14.5}
          alt={imageCount === 0 ? "Plus icon" : "Edit icon"}
        />
      </button>
    </div>
  );
}
