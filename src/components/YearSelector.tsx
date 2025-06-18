"use client";

import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import {
  addYearToDB,
  confirmDeletionFromDb,
  fetchSavedYears,
} from "@/lib/imageManager";

const years = Array.from({ length: 75 }, (_, i) => 2025 - i);

export default function YearSelector() {
  const [isLoading, setIsLoading] = useState(false);
  const [savedYearsByTab, setSavedYearsByTab] = useState<
    Record<string, number[]>
  >({
    people: [],
    places: [],
    dates: [],
  });

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [yearToRemove, setYearToRemove] = useState<number | null>(null);
  const {
    targetYear,
    setTargetYear,
    imagesByMonth,
    setImagesByMonth,
    activeTab,
  } = usePhotoFlow();
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const toggleYearMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const addYearToList = async (year: number) => {
    const res = await addYearToDB(year, activeTab);

    if (!res?.success) return;

    setSavedYearsByTab((prev) => {
      const updatedYears = [...(prev[activeTab] || []), year].sort(
        (a, b) => b - a
      );
      return {
        ...prev,
        [activeTab]: updatedYears,
      };
    });
  };

  const openDeletionModal = (yearToRemove: number) => {
    setOpenDeleteModal(true);

    setYearToRemove(yearToRemove);
  };

  const confirmDeletion = async (yearToRemove: number) => {
    if (!yearToRemove) return;

    const res = await confirmDeletionFromDb(yearToRemove, activeTab);

    if (!res?.success) {
      console.error("Failed to delete year from DB");
      return;
    }

    setSavedYearsByTab((prev) => {
      const updatedYears = (prev[activeTab] || []).filter(
        (year) => year !== yearToRemove
      );
      return {
        ...prev,
        [activeTab]: updatedYears,
      };
    });

    const updatedImages = Object.entries(imagesByMonth).reduce<
      Record<string, (typeof imagesByMonth)[keyof typeof imagesByMonth]>
    >((acc, [key, value]) => {
      if (!key.startsWith(String(yearToRemove))) {
        acc[key] = value;
      }
      return acc;
    }, {});

    setImagesByMonth(updatedImages);

    setOpenDeleteModal(false);
    setYearToRemove(null);
  };

  const selectOrRemoveYear = (year: number) => {
    if (isOpen && year !== currentYear) {
      openDeletionModal(year);
      return;
    }

    setTargetYear(year);
  };

  const savedYears = savedYearsByTab[activeTab] || [];
  const remainingYears = years.filter((year) => !savedYears.includes(year));

  useEffect(() => {
    if (!activeTab) return;
    setIsLoading(true);
    const fetchYears = async () => {
      const res = await fetchSavedYears(activeTab);

      if (!res?.success) return;

      let yearsFromDb = res?.data?.map((row) => row.year) ?? [];

      if (!yearsFromDb.includes(currentYear)) {
        const addRes = await addYearToDB(currentYear, activeTab);
        if (addRes?.success) {
          yearsFromDb = [...yearsFromDb, currentYear];
        }
      }

      setSavedYearsByTab((prev) => ({
        ...prev,
        [activeTab]: yearsFromDb.sort((a, b) => b - a),
      }));

      setIsLoading(false);
    };

    fetchYears();
  }, [currentYear, activeTab]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row max-w-sm mb-4 ">
        <div className=" flex flex-row mt-6 items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain touch-pan-x">
          <div className="flex flex-row items-center gap-5">
            <ul className="flex flex-row items-center gap-5">
              {isLoading ? (
                <Image
                  src="/images/text-loader.svg"
                  width={20}
                  height={20}
                  alt="Text loading animation"
                />
              ) : (
                savedYears.map((year, index) => (
                  <li
                    key={year}
                    onClick={() => selectOrRemoveYear(year)}
                    className={`relative cursor-pointer whitespace-nowrap select-none flex-shrink-0 text-sm 
        ${isOpen ? "text-black" : ""}
        ${index !== 0 ? "pl-3" : ""}
        ${
          Number(targetYear) === year
            ? "text-black"
            : "text-[var(--brand-inactive)]"
        }`}
                  >
                    {isOpen && currentYear !== year && (
                      <Image
                        src="/images/minus-black.svg"
                        width={8}
                        height={1}
                        className="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out"
                        alt="Minus icon"
                      />
                    )}
                    {year}
                  </li>
                ))
              )}
            </ul>

            <div
              className="flex flex-row items-center bg-black py-[11px] px-[15px] rounded-full min-w-[89px] w-full h-7"
              onClick={() => toggleYearMenu()}
            >
              <div className="relative w-[14.5px] h-[14.5px] mr-2">
                <Image
                  src="/images/plus.svg"
                  fill
                  className={`absolute transition-all duration-300 ease-in-out ${
                    isOpen ? "opacity-0 scale-90" : "opacity-100 scale-100"
                  }`}
                  alt="Plus icon"
                />
                <Image
                  src="/images/minus.svg"
                  fill
                  className={`absolute transition-all duration-300 ease-in-out ${
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                  alt="Minus icon"
                />
              </div>
              <p className="font-normal text-[13px] leading-[120%] ml-1 text-white min-w-min whitespace-nowrap">
                Year
              </p>
              {isOpen && (
                <ul className="flex flex-row mr-2">
                  {remainingYears.map((year) => (
                    <li
                      key={year}
                      onClick={(e) => {
                        e.stopPropagation();
                        addYearToList(year);
                      }}
                      className="flex items-center text-white text-sm cursor-pointer"
                    >
                      <div className="flex flex-row mr-2">
                        <Image
                          src="/images/plus.svg"
                          width={9}
                          height={9}
                          alt="Add year button"
                          className="ml-5 mr-1"
                        />
                        {year}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>{" "}
        </div>
      </div>
      <div
        className={`${
          openDeleteModal ? "opacity-100 h-[163px]" : "opacity-0 h-0 hidden"
        } relative w-full  border border-black flex flex-col items-center justify-evenly transition duration-200 ease-in-out `}
      >
        <button
          aria-label="Cancel deletion"
          className="absolute top-3 right-3 cursor-pointer"
          onClick={() => setOpenDeleteModal(false)}
        >
          <Image
            src="/images/X.svg"
            alt="Cancel Button"
            width={14}
            height={14}
          />
        </button>
        <p className="text-sm font-normal leading-[120%] text-center w-[178px]">
          All pictures from this year will be deleted
        </p>
        <Button
          text="Confirm & Delete"
          uppercase={false}
          padding="[15px]"
          textSize="text-[13px]"
          maxWidth="max-w-[159px]"
          onClick={async () => {
            if (yearToRemove !== null) {
              await confirmDeletion(yearToRemove);
            }
          }}
        />
      </div>
    </div>
  );
}
