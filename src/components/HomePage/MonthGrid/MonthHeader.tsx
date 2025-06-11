import AddBtn from "@/components/AddBtn";
import React from "react";

export default function MonthHeader({ month }: { month: string }) {
  return (
    <div className="flex flex-row justify-between items-center pt-2 ">
      <div className="flex flex-row items-end gap-x-2">
        <h1 className={`font-medium text-[28px] leading-[120%]`}>{month}</h1>
        <p className="text-sm font-normal text-[#6F6F6F]">00/10</p>
      </div>
      <AddBtn subscribed={true} />
    </div>
  );
}
