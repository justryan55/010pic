"use client";

import React from "react";
import Image from "next/image";
import { useSubscription } from "@/providers/SubscriptionProvider";

export default function AddBtn({ subscribed }: { subscribed: boolean }) {
  const { toggleSubscription } = useSubscription();
  return (
    <button
      onClick={!subscribed ? toggleSubscription : () => {}}
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
