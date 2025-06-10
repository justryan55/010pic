import React from "react";

export default function PhotoGrid() {
  return (
    <div className="grid grid-cols-5 grid-rows-2 h-56 gap-1 mt-2">
      {Array.from({ length: 10 }, (_, i) => (
        <p key={i} className="border border-[#DFDFDF]"></p>
      ))}
    </div>
  );
}
