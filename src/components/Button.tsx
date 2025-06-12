import React from "react";

interface ButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  uppercase?: boolean;
  padding?: string;
  textSize?: string;
  maxWidth?: string;
}

export default function Button({
  text,
  disabled,
  onClick,
  uppercase = true,
  padding = "[25px]",
  textSize = "text-lg",
  maxWidth = "max-w-none",
}: ButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-black ${textSize} text-normal ${
        uppercase && "uppercase"
      } leading-[120%] text-white pt-[11px] pb-[11px] pr-${padding} pl-${padding} ${maxWidth} rounded-full hover:bg-gray-800 transition-colors cursor-pointer  ${
        disabled ? "disabled:bg-gray-300 disabled:cursor-not-allowed" : ""
      }`}
    >
      {text}
    </button>
  );
}
