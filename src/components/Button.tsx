import React from "react";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  return (
    <button
      type="submit"
      className="w-full bg-black text-lg text-normal uppercase leading-[120%] text-white pt-[11px] pb-[11px] pr-[25px] pl-[25px] rounded-full hover:bg-gray-800 transition-colors hover:cursor-pointer"
    >
      {text}
    </button>
  );
}
