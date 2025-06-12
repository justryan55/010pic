"use client";

import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import { nanoid } from "nanoid";
import Image from "next/image";
import React, { useState } from "react";

const years = Array.from({ length: 75 }, (_, i) => 2025 - i);

export default function YearSelector() {
  const [savedYears, setSavedYears] = useState([2025]);

  const { targetYear, setTargetYear } = usePhotoFlow();
  const [isOpen, setIsOpen] = useState(false);

  const toggleYearMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const addYearToList = (year: number) => {
    setSavedYears((prev) => [...prev, year].sort((a, b) => b - a));
  };

  const setDisplayYear = (year: number) => {
    setIsOpen(false);
    setTargetYear(year);
  };

  const remainingYears = years.filter((year) => !savedYears.includes(year));

  return (
    <div className="relative flex flex-col max-w-sm ">
      <div className=" flex flex-row gap-6 mt-6 items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain touch-pan-x">
        {savedYears.map((year) => {
          return (
            <ul key={nanoid()}>
              <li
                key={year}
                onClick={() => setDisplayYear(year)}
                className={`hover:cursor-pointer whitespace-nowrap select-none flex-shrink-0 text-sm ${
                  Number(targetYear) === year
                    ? "text-black"
                    : "text-[var(--brand-inactive)]"
                }`}
              >
                {year}
              </li>
            </ul>
          );
        })}

        <div className="flex flex-row" onClick={() => toggleYearMenu()}>
          <Image
            src="/images/arrow.svg"
            width={6.7}
            height={11.3}
            className={`transition duration-300 ${
              isOpen ? "rotate-90" : "rotate-none"
            }`}
            alt="Arrow button"
          />
          <p className="font-normal text-[13px] leading-[120%] ml-1 text-[#6F6F6F] min-w-min whitespace-nowrap">
            Add Years
          </p>
        </div>
      </div>

      <div
        className={`flex flex-row gap-7 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain touch-pan-x transition duration-200 transform ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {remainingYears.map((year) => (
          <ul key={nanoid()} className="mt-1 mr-2">
            <li
              key={year}
              onClick={() => addYearToList(year)}
              className={`hover:cursor-pointer whitespace-nowrap select-none  flex-shrink-0 text-black text-sm flex flex-row items-center gap-1`}
            >
              <Image
                src="/images/plus-black.svg"
                width={9}
                height={9}
                alt="Add year button"
              />
              {year}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}
