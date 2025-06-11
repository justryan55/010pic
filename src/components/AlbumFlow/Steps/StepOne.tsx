"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAlbumFlow } from "@/providers/AlbumFlowProvider";
import Image from "next/image";
import React from "react";

export default function StepOne({ handleBulkPhotoSelect, renderPhotoGrid }: { handleBulkPhotoSelect: (event: React.ChangeEvent<HTMLInputElement>) => void, renderPhotoGrid: () => React.ReactNode }) {
  const { isFlowOpen, toggleFlow } = useAlbumFlow();
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-[var(--brand-bg)] px-6 flex flex-col justify-between transition-transform duration-300 min-h-screen ${
        isFlowOpen ? "translate-y-0" : "translate-y-full"
      } `}
    >
      <div className="flex flex-col min-h-screen justify-between">
        <div>
          <div className="flex justify-between">
            <h1 className="text-black font-medidum text-[28px] leading-[120%] max-w-[241px] py-8">
              Title
            </h1>

            <Image
              onClick={toggleFlow}
              src="/images/X.svg"
              alt="Cancel Button"
              width={14}
              height={14}
            />
          </div>

          <Input id="title" type="text" placeholder="Title" />

          <div className="flex flex-row items-end gap-x-2 pt-8 pb-2">
            <h1 className="text-black font-medidum text-[28px] leading-[120%]">
              Add Photos
            </h1>
            <p className="text-sm font-normal text-[#6F6F6F]">00/10</p>
          </div>

          <div className="grid grid-cols-5 grid-rows-2 h-56 gap-1">
            <input
              id="bulk-photo-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkPhotoSelect}
              className="hidden"
              title="Upload multiple photos"
              placeholder="Upload multiple photos"
              aria-label="Upload multiple photos"
            />

            {renderPhotoGrid()}
            {/* {Array.from({ length: 10 }, (_, i) => (
              <p
                key={i}
                className="border border-[#DFDFDF] flex justify-center items-center"
              >
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload photo"
                  title="Upload photo"
                  // onChange={handlePhotoSelect}
                  className="hidden"
                  id={`photo-input-${i}`}
                />
                <label htmlFor={`photo-input-${i}`} className="photo-slot-button">
                  <Image
                    src="/images/plus-black.svg"
                    height={14.5}
                    width={14.5}
                    alt="Plus icon"
                  />
                </label>
              </p>
            ))} */}
          </div>
        </div>
        <div className="mb-6">
          <Button text="Create" />
        </div>
      </div>
    </div>
  );
}
