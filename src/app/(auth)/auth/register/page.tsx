import AuthForm from "@/components/AuthForm";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import LogoText from "@/components/LogoText";
import SocialLoginButton from "@/components/SocialLoginButton";
import { useGetPathname } from "@/helpers/getPathname";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  return (
    <div className="max-h-screen flex flex-col">
      <LogoText position={"pt-[26px] pl-6"} />
      <AuthForm />

      {/* <main className="flex-1 flex flex-col items-center justify-center px-6 ">
        <div className="text-center  w-full flex justify-between max-w-[300px] py-2">
          <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[241px] ">
            Create account
          </h1>
          <Link href="/auth/login" className="flex justify-center items-center">
            <Image
              src="/images/X.svg"
              alt="Cancel Button"
              width={14}
              height={14}
            />
          </Link>
        </div>
        <form className="space-y-4">
          <div>
            <Label text="Name" htmlFor="name" />
            <Input id="name" type="name" placeholder="ex: john smith" />
          </div>

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
            <Label text="Confirm Password" htmlFor="confirmPassword" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="*********"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 mr-3 border border-black rounded-sm appearance-none bg-white checked:bg-white text-black checked:border-black focus:outline-none flex items-center justify-center relative checked:after:content-['✓'] checked:after:text-black checked:after:text-[11px] checked:after:absolute checked:after:font-semibold checked:after:leading-none"
            />
            <label htmlFor="terms" className="text-black text-sm">
              I understand the{" "}
              <a href="#" className="underline hover:no-underline">
                terms & policy
              </a>
            </label>
          </div>
          <div>
            <Button text="Sign Up" />
          </div>

          <div className="text-center pt-3">
            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <p className="text-black text-sm font-normal mx-4">
                or sign up with
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
            Have an account?
          </p>
          <Link
            // href="/auth/login"
            href="/onboarding/welcome"
            className="text-black text-sm font-bold underline hover:no-underline hover:cursor-pointer"
          >
            Login
          </Link>
        </div>
      </main> */}
    </div>
  );
}
