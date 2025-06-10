import React from "react";

type InputProps = {
  id: string;
  type: string;
  placeholder: string;
};
export default function Input({ id, type, placeholder }: InputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className="bg-white border border-white h-12 w-full h-[42px] px-4 placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
    />
  );
}
