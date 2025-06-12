"use client";

import MonthHeader from "@/components/HomePage/MonthGrid/MonthHeader";
import PhotoGrid from "@/components/HomePage/MonthGrid/PhotoGrid";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React from "react";

const allMonths = [
  "December",
  "November",
  "October",
  "September",
  "August",
  "July",
  "June",
  "May",
  "April",
  "March",
  "February",
  "January",
];

export default function Home() {
  const { setTargetMonth, targetYear } = usePhotoFlow();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();

  const filteredMonths =
    targetYear === currentYear
      ? allMonths.filter((month) => {
          const indexInCalendar = 11 - currentMonthIndex;
          return allMonths.indexOf(month) >= indexInCalendar;
        })
      : allMonths;

  return (
    <div>
      <div className="mb-14">
        {filteredMonths.map((month) => (
          <div key={month} onClick={() => setTargetMonth(month)}>
            <MonthHeader month={month} />
            <PhotoGrid month={month} />
          </div>
        ))}
      </div>
    </div>
  );
}
