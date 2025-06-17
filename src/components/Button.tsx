import React from "react";
import Image from "next/image";
import spinner from "/images/spinner.svg";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  uppercase?: boolean;
  padding?: string;
  textSize?: string;
  maxWidth?: string;
  isLoading?: boolean;
}

export default function Button({
  type = "button",
  text,
  disabled,
  onClick,
  uppercase = true,
  padding = "[25px]",
  textSize = "text-lg",
  maxWidth = "max-w-none",
  isLoading = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onTouchStart={onClick}
      // onClick={onClick}
      disabled={disabled}
      className={`w-full bg-black ${textSize} text-normal 
      ${isLoading && "flex justify-center items-center pt-[14px] pb-[14px]"} 
      ${
        uppercase && "uppercase"
      } leading-[120%] text-white pt-[11px] pb-[11px] pr-${padding} pl-${padding} ${maxWidth} rounded-full hover:bg-gray-800 transition-colors cursor-pointer  ${
        disabled ? "disabled:bg-gray-300 disabled:cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? (
        <Image
          src="/images/spinner.svg"
          width={20}
          height={20}
          alt="Loading spinner"
        />
      ) : (
        text
      )}
    </button>
  );
}
