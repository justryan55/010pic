import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Permissions() {
  return (
    <div>
      <div className="flex flex-col min-h-screen justify-between py-8 bg-[var(--brand-bg)]">
        <div className="flex-1 flex flex-col justify-center items-start gap-y-6 ">
          <div className="bg-white h-16 w-16 flex justify-center items-center rounded">
            <Image
              src="/images/permission-icon.svg"
              alt="Permissions icon"
              height={31}
              width={31}
            />
          </div>
          <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[334px]">
            Permission to access your photo library
          </h1>
          <p className="text-black font-normal text-lg leading-[120%]">
            To choose your 10 favorite photos
          </p>
        </div>
        <Link href="/">
          <Button text="Next" />
        </Link>
      </div>
    </div>
  );
}
