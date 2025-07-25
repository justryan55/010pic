"use client";

import Button from "@/components/Button";
import LogoText from "@/components/LogoText";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/createSupabaseClient";

export default function Welcome() {
  // const [step, setStep] = useState(1);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const completeOnboarding = async () => {
    setIsLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated.");
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("id", user.id);

      if (updateError) {
        setError("Failed to update onboarding status.");
        setIsLoading(false);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error("Onboarding completion error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col min-h-screen justify-between py-8 bg-[var(--brand-bg)]">
        {/* <p className="text-right">{step}/3</p> */}
        {/* {step === 1 && ( */}
        <>
          <div className="flex-1 flex flex-col justify-center items-start gap-y-6 ">
            <div className="bg-white h-16 w-16 flex justify-center items-center rounded">
              <LogoText />
            </div>
            <h1 className="text-black font-semibold text-[28px] leading-[120%]">
              Welcome!
            </h1>
            <p className="text-black font-normal text-lg leading-[120%]">
              Pick just 10 photos for each story. Whether it’s a month, a trip,
              or someone special, focus on what really matters.
            </p>
          </div>
        </>
        {/* )} */}

        {/* {step === 2 && (
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
              <p className="text-black font-semibold text-lg w-full">
                To this ^
              </p>
            </div>
          </div>
        )} */}

        {/* <div className="px-6"> */}
        {error && <p className="text-destructive">{error}</p>}

        <Link href="/">
          <Button
            text="Get Started"
            onClick={completeOnboarding}
            isLoading={isLoading}
          />
        </Link>
        {/* </div> */}
      </div>
    </div>
  );
}
