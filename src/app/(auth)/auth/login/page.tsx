import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import LogoText from "@/components/LogoText";
import SocialLoginButton from "@/components/SocialLoginButton";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <LogoText position={"pt-[26px] pl-6"} />
      <main className="flex-1 flex flex-col items-center justify-evenly px-6 ">
        <div className="text-center mb-12 w-full flex justify-center ">
          <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[241px] ">
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

        <form className="space-y-4">
          <div>
            <Label text="Email" htmlFor="email" />
            <Input
              id="email"
              type="email"
              placeholder="ex: jon.smith@email.com"
            />
          </div>

          <div>
            <Label text="Password" htmlFor="password" />
            <Input id="password" type="password" placeholder="*********" />
          </div>

          <div>
            <Button text="Sign In" />
          </div>

          <div className="text-center pt-3">
            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <p className="text-black text-sm font-normal mx-4">
                or sign in with
              </p>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <SocialLoginButton image="/images/apple.svg" provider="Apple" />
              <SocialLoginButton image="/images/google.svg" provider="Google" />
              <SocialLoginButton
                image="/images/facebook.svg"
                provider="Facebook"
              />
            </div>
          </div>
        </form>

        <div className="text-center">
          <p className="text-black text-sm font-normal mb-2">
            Don&apos;t have an account?
          </p>
          <Link
            href="/auth/register"
            className="text-black text-sm font-bold underline hover:no-underline hover:cursor-pointer"
          >
            Create Account
          </Link>
        </div>
      </main>
    </div>
  );
}
