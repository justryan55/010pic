import React from "react";

interface ButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({ text, disabled, onClick }: ButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-black text-lg text-normal uppercase leading-[120%] text-white pt-[11px] pb-[11px] pr-[25px] pl-[25px] rounded-full hover:bg-gray-800 transition-colors hover:cursor-pointer ${
        disabled ? "disabled:bg-gray-300 disabled:cursor-not-allowed" : ""
      }`}
    >
      {text}
    </button>
  );
}
