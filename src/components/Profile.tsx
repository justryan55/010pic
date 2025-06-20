"use client";

import { logOut } from "@/lib/authentication";
import { useUserContext } from "@/providers/UserProvider";
import Image from "next/image";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSubscription } from "@/providers/SubscriptionProvider";

export default function Profile() {
  const { isProfileOpen, toggleProfile, userProfile } = useUserContext();
  const { toggleSubscription } = useSubscription();

  const slideVariants = {
    hidden: { y: "100%", opacity: 1 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 1 },
  };

  const items = [
    {
      heading: userProfile.name,
      svg: "/images/user.svg",
    },
    {
      heading: "Subscription",
      svg: "/images/subscription.svg",
    },

    {
      heading: "Sign Out",
      svg: "/images/logout.svg",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {isProfileOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 flex items-end"
        >
          <div
            className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-[var(--brand-bg)] px-6 flex flex-col justify-between transition-transform duration-300 min-h-screen 
      
      `}
          >
            <div>
              <div className="flex justify-between pt-8">
                <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[241px]">
                  Profile
                </h1>
                <Image
                  onClick={toggleProfile}
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
                    className="flex flex-row gap-x-5 items-center w-full mt-8 cursor-pointer"
                    onClick={() => {
                      if (item.heading === "Sign Out") {
                        logOut();
                      } else if (item.heading === "Subscription") {
                        toggleSubscription();
                      }
                    }}
                  >
                    <Image
                      src={item.svg}
                      alt="Cancel Button"
                      width={30}
                      height={30}
                    />

                    <div className="flex flex-col">
                      <h2 className="text-black font-semibold text-lg">
                        {item.heading}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="text-sm font-normal text-[#919191] text-center">
                We are two friends working on this app, feel free to write to us
                for any questions
              </p>
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

            {/* </div> */}

            {/* <div>
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
        </div>{" "} */}
          </div>{" "}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
