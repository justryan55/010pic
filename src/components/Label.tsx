import React from "react";

type LabelProps = {
  text: string;
  className?: string;
  htmlFor?: string;
};

export default function Label({ text, className = "", htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-black text-sm font-medium mb-2 ${className}`}
    >
      {text}
    </label>
  );
}
