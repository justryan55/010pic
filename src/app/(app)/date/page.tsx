"use client";

import CollectionHeader from "@/components/CollectionHeader";
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
  const { setTargetMonth, targetYear, imagesByMonth } = usePhotoFlow();

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

  function MonthPhotoGrid({ month }: { month: string }) {
    const monthKey = `${targetYear}-${month}`;
    const images = imagesByMonth[monthKey] || [];

    return <PhotoGrid images={images} />;
  }

  function MonthHeader({ month }: { month: string }) {
    const displayYear = targetYear || new Date().getFullYear();
    const monthKey = `${displayYear}-${month}`;

    const monthImages = imagesByMonth[monthKey] || [];
    const imageCount = monthImages.length;
    return <CollectionHeader header={month} imageCount={imageCount} />;
  }

  return (
    <div>
      <div className="mb-14">
        {filteredMonths.map((month) => (
          <div key={month} onClick={() => setTargetMonth(month)}>
            <MonthHeader month={month} />
            <MonthPhotoGrid month={month} />
          </div>
        ))}
      </div>
    </div>
  );
}
