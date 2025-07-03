import Image from "next/image";
import React from "react";

type SocialLoginButton = {
  image: string;
  provider: string;
  onClick: () => void;
};

export default function SocialLoginButton({
  image,
  provider,
  onClick,
}: SocialLoginButton) {
  return (
    // <button
    //   type="button"
    //   title={`Login with ${provider}`}
    //   className="w-[86px] h-[42px] bg-white rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
    //   onClick={onClick}
    // >
    <button
      type="button"
      title={`Login with ${provider}`}
      className="w-full h-[42px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      <Image alt="" width={24} height={24} src={image} />
    </button>
  );
}
