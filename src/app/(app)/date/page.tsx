import MonthHeader from "@/components/HomePage/MonthGrid/MonthHeader";
import PhotoGrid from "@/components/HomePage/MonthGrid/PhotoGrid";
import React from "react";

const months = ["March", "February", "January"];

export default function Home() {
  return (
    <div>
      <div className="mb-28">
        {months.map((month) => (
          <div key={month}>
            <MonthHeader month={month} />
            <PhotoGrid />
          </div>
        ))}
      </div>
    </div>
  );
}
