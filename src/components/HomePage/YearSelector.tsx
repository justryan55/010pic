"use client";

import React, { useState } from "react";

const years = Array.from({ length: 75 }, (_, i) => 2025 - i);

export default function YearSelector() {
  const [selectedYear, setSelectedYear] = useState(2025);

  return (
    <ul className="flex flex-row gap-6 mt-8 pb-8 overflow-x-auto max-w-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain touch-pan-x">
      {years.map((year) => (
        <li
          key={year}
          onClick={() => setSelectedYear(year)}
          className={`hover:cursor-pointer whitespace-nowrap select-none flex-shrink-0 ${
            selectedYear === year
              ? "text-black"
              : "text-[var(--brand-inactive)]"
          }`}
        >
          {year}
        </li>
      ))}
    </ul>
  );
}
