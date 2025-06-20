"use client";

import Button from "@/components/Button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/createSupabaseClient";

export default function Permissions() {
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

      router.push("/date");
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
          {error && <p className="text-destructive">{error}</p>}
        </div>

        <Button
          text="Next"
          onClick={completeOnboarding}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
