import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Example() {
  return (
    <div>
      <div className="flex flex-col min-h-screen justify-between py-8 bg-[var(--brand-bg)]">
        <div className="flex-1 flex flex-col justify-center items-start gap-y-6 ">
          <div className="flex flex-row gap-5 w-full place-items-end">
            <div className="flex flex-col w-full">
              <Image
                src="/images/example-mess.svg"
                width={160}
                height={275}
                alt="Example of previous messy photo album"
                className="w-full max-h-[275px]"
              />
              <Image
                src="/images/example-mess.svg"
                width={160}
                height={275}
                alt="Example of previous messy photo album"
                className="w-full max-h-[275px]"
              />
            </div>
            <Image
              src="/images/example-tidy.svg"
              width={160}
              height={275}
              alt="Example of organised photos"
              className="w-full max-h-[275px]"
            />
          </div>
          <div className="flex flex-row gap-5 w-full text-center">
            <p className="text-black font-semibold text-lg w-full">
              From this ^
            </p>
            <p className="text-black font-semibold text-lg w-full">To this ^</p>
          </div>
        </div>
        <Link href="/onboarding/permissions">
          <Button text="Next" />
        </Link>
      </div>
    </div>
  );
}
