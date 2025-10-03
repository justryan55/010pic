"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import { supabase } from "@/lib/supabase/createSupabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LogoText from "@/components/LogoText";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(4, "Password must be at least 4 characters.")
      .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
      .regex(/[0-9]/, { message: "Must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Must contain at least one special character.",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password fields do not match.",
        path: ["confirmPassword"],
      });
    }
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateResetToken = async () => {
      try {
        const code = searchParams.get("code");

        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error("Code exchange error:", error);
            setAuthError(
              "Invalid or expired reset link. Please request a new one."
            );
          } else {
            console.log("Code exchanged successfully");
          }
        } else if (type !== "recovery" || !accessToken) {
          setAuthError(
            "Invalid or expired reset link. Please request a new one."
          );
        }
      } catch (error) {
        console.error("Validation error:", error);
        setAuthError("An error occurred validating the reset link.");
      } finally {
        setIsValidating(false);
      }
    };

    validateResetToken();
  }, [searchParams]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    setIsLoading(true);
    setAuthError("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      setSuccessMessage("Password updated successfully! Redirecting...");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LogoText position={"mb-4"} />
        <p className="text-black">Validating reset link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LogoText position={"pt-[26px] pl-6"} />

      <div className="flex-1 flex flex-col items-center px-6 justify-evenly px-10">
        <div className="text-center w-full flex justify-center mb-12">
          <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[241px]">
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

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 min-w-[280px]"
        >
          <div className="flex flex-col mb-6">
            <h2 className="text-black text-2xl font-semibold pb-2">
              Create new password
            </h2>
          </div>

          <div>
            <Label text="Password" htmlFor="password" />
            <Input
              {...form.register("password")}
              id="password"
              type="password"
              placeholder="*********"
            />
            {form.formState.errors.password && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label text="Re-enter your password" htmlFor="confirmPassword" />
            <Input
              {...form.register("confirmPassword")}
              id="confirmPassword"
              type="password"
              placeholder="*********"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {authError && (
            <p className="text-destructive text-sm p-2">{authError}</p>
          )}

          {successMessage && (
            <p className="text-black text-sm p-2">{successMessage}</p>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              text="SAVE"
              isLoading={isLoading}
              disabled={!form.formState.isValid || !!authError}
            />
          </div>
        </form>

        <div></div>
        <div></div>
      </div>
    </div>
  );
}
