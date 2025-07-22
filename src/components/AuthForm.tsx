"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import { supabase } from "@/lib/supabase/createSupabaseClient";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCurrentPage } from "@/providers/PageProvider";
import { useRouter } from "next/navigation";
import { handlePostLogin } from "@/helpers/handlePostLogin";
import { Capacitor } from "@capacitor/core";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Name is too long."),
    email: z.string().trim().email({ message: "Please enter a valid email." }),
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

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email({ message: "Please enter a valid email." }),
  password: z.string().min(1, "Password is required."),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export default function AuthForm() {
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage } = useCurrentPage();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(event.target.checked);
  };

  const isRegister =
    currentPage === "register" || currentPage === "auth/register";

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onRegisterSubmit = async (values: RegisterFormData) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            display_name: values.name,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (data.user) {
        const { user } = data;

        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: values.name,
          subscription_status: false,
          onboarding_complete: false,
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          setAuthError("Failed to create user profile.");
          return;
        }

        // Auto-login after registration
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (loginError) {
          console.error("Auto-login error:", loginError);
          setAuthError("Registration successful, but failed to log in.");
          return;
        }

        const {
          data: { user: loggedInUser },
        } = await supabase.auth.getUser();

        if (loggedInUser) {
          await handlePostLogin({
            user: loggedInUser,
            supabase,
            setAuthError,
            router,
            setCurrentPage,
          });
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onLoginSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (error || !data?.user) {
        setAuthError(error?.message || "Login failed");
        return;
      }

      const user = data.user;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("onboarding_complete, is_deleted")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        setAuthError("Failed to retrieve profile information.");
        return;
      }

      if (profile?.is_deleted) {
        await supabase.auth.signOut();
        setAuthError("This account has been deleted.");
        return;
      }

      if (!profile?.onboarding_complete) {
        router.push("/onboarding/");
        setCurrentPage("onboarding");
        return;
      }

      setCurrentPage("date");

      if (Capacitor.getPlatform() === "ios") {
        window.location.href = "/date/index.html";
      } else {
        router.replace("/date/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // async function onGoogleAuth() {
  //   setAuthError("");
  //   // setIsLoading(true);

  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       // options: {
  //       //   redirectTo: `${window.location.origin}/auth/callback`,
  //       // },
  //     });

  //     if (error) {
  //       setAuthError(error.message);
  //       // setIsLoading(false);
  //       return;
  //     }
  //   } catch (err) {
  //     console.error("Google OAuth error:", err);
  //     setAuthError("Failed to sign in with Google. Please try again.");
  //     // setIsLoading(false);
  //   }
  // }

  const handleNavigation = (targetPage: string) => {
    setCurrentPage(targetPage);
    setAuthError("");
  };

  return (
    <main
      className={`flex-1 flex flex-col items-center px-6 ${
        isRegister ? "justify-center" : "justify-evenly"
      }`}
    >
      <div
        className={`text-center w-full flex ${
          isRegister
            ? "justify-between max-w-[300px] mb-8"
            : "justify-center mb-12"
        }`}
      >
        {isRegister ? (
          <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[241px]">
            Create account
          </h1>
        ) : (
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
        )}

        {isRegister && (
          <button
            onClick={() => handleNavigation("login")}
            className="flex justify-center items-center cursor-pointer"
            title="Cancel registration"
            aria-label="Cancel registration"
          >
            <Image
              src="/images/X.svg"
              alt="Cancel Button"
              width={14}
              height={14}
            />
          </button>
        )}
      </div>

      <form
        onSubmit={
          isRegister
            ? registerForm.handleSubmit(onRegisterSubmit)
            : loginForm.handleSubmit(onLoginSubmit)
        }
        className="space-y-4 min-w-[280px]"
      >
        {isRegister && (
          <div>
            <Label text="Name" htmlFor="name" />
            <Input
              {...registerForm.register("name")}
              id="name"
              type="text"
              placeholder="John Smith"
            />
            {registerForm.formState.errors.name && (
              <p className="text-destructive text-sm mt-1">
                {registerForm.formState.errors.name.message}
              </p>
            )}
          </div>
        )}

        <div>
          <Label text="Email" htmlFor="email" />
          <Input
            {...(isRegister
              ? registerForm.register("email")
              : loginForm.register("email"))}
            id="email"
            type="email"
            placeholder="john.smith@gmail.com"
          />
          {isRegister && registerForm.formState.errors.email && (
            <p className="text-destructive text-sm mt-1">
              {registerForm.formState.errors.email.message}
            </p>
          )}
          {!isRegister && loginForm.formState.errors.email && (
            <p className="text-destructive text-sm mt-1">
              {loginForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label text="Password" htmlFor="password" />
          <Input
            {...(isRegister
              ? registerForm.register("password")
              : loginForm.register("password"))}
            id="password"
            type="password"
            placeholder="*********"
          />
          {isRegister && registerForm.formState.errors.password && (
            <p className="text-destructive text-sm mt-1">
              {registerForm.formState.errors.password.message}
            </p>
          )}
          {!isRegister && loginForm.formState.errors.password && (
            <p className="text-destructive text-sm mt-1">
              {loginForm.formState.errors.password.message}
            </p>
          )}
        </div>

        {isRegister && (
          <div>
            <Label text="Confirm Password" htmlFor="confirmPassword" />
            <Input
              {...registerForm.register("confirmPassword")}
              id="confirmPassword"
              type="password"
              placeholder="*********"
            />
            {registerForm.formState.errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">
                {registerForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {isRegister && (
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={handleCheckboxChange}
              className="w-4 h-4 mr-3 border border-black rounded-sm appearance-none bg-white checked:bg-white text-black checked:border-black focus:outline-none flex items-center justify-center relative checked:after:content-['✓'] checked:after:text-black checked:after:text-[11px] checked:after:absolute checked:after:font-semibold checked:after:leading-none"
            />
            <label htmlFor="terms" className="text-black text-sm">
              I agree to the{" "}
              <a
                href="https://justryan55.github.io/010pic-privacy/"
                className="underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </label>
          </div>
        )}

        {authError && (
          <p className="text-destructive text-sm p-2">{authError}</p>
        )}

        <div>
          <Button
            type="submit"
            text={isRegister ? "Sign Up" : "Sign In"}
            isLoading={isLoading}
            disabled={
              isRegister && (!registerForm.formState.isValid || !agreed)
            }
          />
        </div>

        <div className="text-center pt-3">
          {/* <div className="flex items-center mb-6"> */}
          {/* <div className="flex-1 h-px bg-gray-300"></div> */}
          {/* <p className="text-black text-sm font-normal mx-4"> */}
          {/* {isRegister ? "or sign up with" : "or sign in with"} */}
          {/* </p> */}
          {/* <div className="flex-1 h-px bg-gray-300"></div> */}
          {/* </div> */}

          {/* <div className="flex justify-center space-x-4 mb-6">
            <SocialLoginButton image="/images/apple.svg" provider="Apple" />
            <SocialLoginButton image="/images/google.svg" provider="Google" />
            <SocialLoginButton
              image="/images/facebook.svg"
              provider="Facebook"
            />
          </div> */}
        </div>
      </form>

      <div className="text-center">
        <p className="text-black text-sm font-normal mb-2">
          {isRegister ? "Have an account?" : "Don't have an account?"}
        </p>
        <button
          onClick={() => handleNavigation(isRegister ? "login" : "register")}
          className={`text-black ${
            isRegister && "pb-8"
          } text-sm font-bold underline hover:no-underline cursor-pointer bg-transparent border-none`}
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </div>
    </main>
  );
}
