import AddBtn from "@/components/AddBtn";
import React from "react";

export default function CollectionHeader({
  header,
  imageCount,
  locked = false,
}: {
  header: string;
  imageCount: number;
  locked?: boolean;
}) {
  return (
    <div className="flex flex-row justify-between items-center pt-2 ">
      <div className="flex flex-row items-end gap-x-2">
        <h1 className={`font-medium text-[28px] leading-[120%]`}>{header}</h1>
        <p className="text-sm font-normal text-[#6F6F6F]">
          {imageCount.toString().padStart(2, "0")}/10
        </p>
      </div>
      <AddBtn imageCount={imageCount} requiresSubscription={locked} />
    </div>
  );
}
