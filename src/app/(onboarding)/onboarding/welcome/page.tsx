import Button from "@/components/Button";
import LogoText from "@/components/LogoText";
import Link from "next/link";
import React from "react";

export default function Welcome() {
  return (
    <div>
      <div className="flex flex-col min-h-screen justify-between py-8 bg-[var(--brand-bg)]">
        <div className="flex-1 flex flex-col justify-center items-start gap-y-6 ">
          <div className="bg-white h-16 w-16 flex justify-center items-center rounded">
            <LogoText />
          </div>
          <h1 className="text-black font-semibold text-[28px] leading-[120%]">
            Welcome!
          </h1>
          <p className="text-black font-normal text-lg leading-[120%]">
            Pick just 10 photos for each story. Whether it’s a month, a trip, or
            someone special, focus on what really matters.
          </p>
        </div>
        {/* <div className="px-6"> */}
        <Link href="/onboarding/example">
          <Button text="Next" />
        </Link>
        {/* </div> */}
      </div>
    </div>
  );
}
