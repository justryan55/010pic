"use client";
import React from "react";
import LogoText from "./LogoText";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link";
import { useUserContext } from "@/providers/UserProvider";

export default function Header() {
  const { toggleProfile } = useUserContext();

  return (
    <div className="flex flex-row items-center justify-between">
      <LogoText />

      <p
        onClick={toggleProfile}
        className="font-medium leading-[120%] underline cursor-pointer"
      >
        Profile
      </p>
    </div>
  );
}
