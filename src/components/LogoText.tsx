import React from "react";

type LogoTextProps = {
  position?: string;
};

export default function LogoText({ position }: LogoTextProps) {
  return (
    <div className={`${position}`}>
      <span className="text-black font-semibold text-sm leading-[120%] ">
        O10
      </span>
      <span
        className="text-black font-normal italic text-lg"
        style={{ fontFamily: "var(--font-inria)" }}
      >
        p
      </span>
    </div>
  );
}
