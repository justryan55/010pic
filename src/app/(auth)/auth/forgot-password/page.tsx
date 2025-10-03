"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import { supabase } from "@/lib/supabase/createSupabaseClient";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LogoText from "@/components/LogoText";
import { Capacitor } from "@capacitor/core";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email({ message: "Please enter a valid email." }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function Page() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    setIsLoading(true);
    setAuthError("");
    setSuccessMessage("");

    try {
      const isNative = Capacitor.isNativePlatform();
      const redirectUrl = isNative
        ? "o10pic://auth/reset-password"
        : `${window.location.origin}/auth/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email.trim().toLowerCase(),
        {
          redirectTo: redirectUrl,
        }
      );

      if (error) {
        setAuthError(error.message);
        return;
      }

      setSuccessMessage("Password reset email sent! Please check your inbox.");
      form.reset();
    } catch (err) {
      console.error("Password reset error:", err);
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LogoText position={"pt-[26px] pl-6"} />

      <div
        className={`flex-1 flex flex-col items-center px-6 justify-evenly h-full px-10`}
      >
        <div className={`text-center w-full flex justify-center mb-12"`}>
          <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[241px] pb-10 ">
            Remember{" "}
            <span
              className="font-normal italic"
              style={{ fontFamily: "var(--font-inria)" }}
            >
              only
            </span>{" "}
            what matters
          </h1>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div>
            <div className="flex flex-col">
              <h2 className="text-black text-2xl font-semibold pb-4">
                Forgot Password
              </h2>
              <p className="text-black text-base pb-4">
                We will send you an email for you to create a new password
              </p>
            </div>
            <div>
              <Label text="Email" htmlFor="email" />
              <Input
                {...form.register("email")}
                id="email"
                type="email"
                placeholder="john.smith@gmail.com"
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          {authError && (
            <p className="text-destructive text-sm p-2 mt-2">{authError}</p>
          )}

          {successMessage && (
            <p className="text-black text-sm p-2 mt-2">{successMessage}</p>
          )}

          <div className="flex gap-4 w-full mt-6">
            <button
              type="button"
              className="w-18 bg-black rounded-full flex items-center justify-center"
              onClick={() => router.push("/")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M19 12H5M5 12L12 19M5 12L12 5" />
              </svg>
            </button>

            <Button
              type="submit"
              className="flex-1"
              text="Send"
              isLoading={isLoading}
              disabled={!form.formState.isValid}
            />
          </div>
        </form>

        <div className="text-center pt-6">
          <p className="text-black text-sm font-normal mb-2">
            {"Have an account?"}
          </p>
          <button
            onClick={() => router.push("/auth/")}
            className={`text-black pb-8 text-sm font-bold underline hover:no-underline cursor-pointer bg-transparent border-none`}
          >
            {"Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
