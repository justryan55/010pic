import React from "react";
import LogoText from "./LogoText";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-row items-center justify-between pt-[26px]">
      <LogoText />
      {/* <Link
        href="/profile"
        className="font-medium leading-[120%] underline hover:pointer-cursor"
      > */}
      <p className="font-medium leading-[120%] underline pointer-cursor">
        Profile
      </p>
      {/* </Link> */}
    </div>
  );
}
