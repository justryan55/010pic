import AddBtn from "@/components/AddBtn";
import AlbumFlow from "@/components/AlbumFlow/AlbumFlow";
import Image from "next/image";
import React from "react";

export default function People() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh]">
      <AddBtn subscribed={true} />
      <div className="flex flex-row gap-x-2 mt-2">
        <Image
          src="/images/lock.svg"
          width={11}
          height={15}
          alt="Image of lock"
        />
        <p className="text-sm leading-[120%] font-normal text-[#6F6F6F]">
          Add Place
        </p>
      </div>
      <AlbumFlow />
    </div>
  );
}
