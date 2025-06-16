import Image from "next/image";
import React from "react";

type SocialLoginButton = {
  image: string;
  provider: string;
};

export default function SocialLoginButton({
  image,
  provider,
}: SocialLoginButton) {
  return (
    <button
      type="button"
      title={`Login with ${provider}`}
      className="w-[86px] h-[42px] bg-white rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
    >
      <Image alt="" width={24} height={24} src={image} />
    </button>
  );
}
