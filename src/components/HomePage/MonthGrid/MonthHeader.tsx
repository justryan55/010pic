import AddBtn from "@/components/AddBtn";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React from "react";

export default function MonthHeader({ month }: { month: string }) {
  const { imagesByMonth, targetYear } = usePhotoFlow();

  const displayYear = targetYear || new Date().getFullYear();
  const monthKey = `${displayYear}-${month}`;

  const monthImages = imagesByMonth[monthKey] || [];
  const imageCount = monthImages.length;

  return (
    <div className="flex flex-row justify-between items-center pt-2 ">
      <div className="flex flex-row items-end gap-x-2">
        <h1 className={`font-medium text-[28px] leading-[120%]`}>{month}</h1>
        <p className="text-sm font-normal text-[#6F6F6F]">
          {" "}
          {imageCount.toString().padStart(2, "0")}/10
        </p>
      </div>
      <AddBtn subscribed={true} />
    </div>
  );
}
