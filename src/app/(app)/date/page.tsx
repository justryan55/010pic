"use client";

import MonthHeader from "@/components/HomePage/MonthGrid/MonthHeader";
import PhotoGrid from "@/components/HomePage/MonthGrid/PhotoGrid";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React from "react";

const months = [
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
  const { setTargetMonth } = usePhotoFlow();

  return (
    <div>
      <div className="mb-28">
        {months.map((month) => (
          <div key={month} onClick={() => setTargetMonth(month)}>
            <MonthHeader month={month} />
            <PhotoGrid month={month} />
          </div>
        ))}
      </div>
    </div>
  );
}
