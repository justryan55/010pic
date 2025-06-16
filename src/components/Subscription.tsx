"use client";

import Image from "next/image";
import React from "react";
import Button from "./Button";
import { useSubscription } from "@/providers/SubscriptionProvider";

const items = [
  {
    heading: "Unlock - Places",
    text: "Remember your trips in 10 picture",
    svg: "/images/places-black.svg",
  },
  {
    heading: "Unlock - People",
    text: "Remember your friends and family in only 10 pictures",
    svg: "/images/people-black.svg",
  },
  {
    heading: "Unlock - Previous months",
    text: "Organise photos from all previous months.",
    svg: "/images/date-black.svg",
  },
  {
    heading: "Unlock - Video",
    text: "Sometimes there is more to remember",
    svg: "/images/video-black.svg",
  },
];

export default function Subscription() {
  const { isSubOpen, toggleSubscription } = useSubscription();
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-[var(--brand-bg)] px-6 flex flex-col justify-between transition-transform duration-300 h-[90vh]  ${
        isSubOpen ? "translate-y-0 fixed" : "translate-y-[150%] hidden"
      }`}
    >
      <div>
        <div className="flex justify-between">
          <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[241px]">
            Subscription
          </h1>
          <Image
            onClick={toggleSubscription}
            src="/images/X.svg"
            alt="Cancel Button"
            width={14}
            height={14}
          />
        </div>
        <div className="mt-10">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-row gap-x-5 items-center w-full mt-8 pointer-cursor"
            >
              <Image
                src={item.svg}
                alt="Cancel Button"
                width={20}
                height={20}
              />

              <div className="flex flex-col">
                <h2 className="text-black font-semibold text-lg">
                  {item.heading}
                </h2>
                <p className="text-sm leading-[120%] font-normal text-[#6F6F6F]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-row justify-center items-center">
          <Button text="Monthly - 20 kr." />
        </div>
        <div className="flex flex-row justify-center items-center mt-4">
          <Button text="Yearly - 200 kr." />
        </div>
        <div className="flex flex-row items-center justify-center gap-1 my-10">
          <p className="text-black font-semibold text-sm leading-[120%] ">
            Support
          </p>{" "}
          <span
            className="text-black font-normal italic text-sm"
            style={{ fontFamily: "var(--font-inria)" }}
          >
            indie
          </span>{" "}
          <p className="text-black font-semibold text-sm leading-[120%] ">
            Apps
          </p>
        </div>{" "}
      </div>
    </div>
  );
}
