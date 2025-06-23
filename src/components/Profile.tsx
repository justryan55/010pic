"use client";

import { deleteAccount, logOut } from "@/lib/authentication";
import { useUserContext } from "@/providers/UserProvider";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSubscription } from "@/providers/SubscriptionProvider";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { isProfileOpen, toggleProfile, userProfile } = useUserContext();
  const { toggleSubscription } = useSubscription();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const slideVariants = {
    hidden: { y: "100%", opacity: 1 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 1 },
  };

  const items = [
    {
      heading: userProfile.name,
      alt: "User profile icon",
      svg: "/images/user.svg",
    },
    {
      heading: "Subscription",
      alt: "Subscription icon",
      svg: "/images/subscription.svg",
    },

    {
      heading: "Sign Out",
      alt: "Sign out icon icon",
      svg: "/images/logout.svg",
    },
  ];

  const triggerAccountDeletion = async (userId: string, email: string) => {
    const res = await deleteAccount(userId, email);

    if (!res?.success) {
      setError(res?.message ?? null);
      return;
    }

    router.push("/");
  };
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
                      alt={item.alt}
                      width={20}
                      height={20}
                    />

                    <div className="flex flex-col">
                      <h2 className="text-black font-semibold text-lg">
                        {item.heading}
                      </h2>
                    </div>
                  </div>
                ))}
                <p
                  className="w-full mt-8 cursor-pointer text-[#E55A5A] font-semibold text-lg"
                  onClick={() => {
                    setOpenDeleteModal(true);
                  }}
                >
                  Delete Account
                </p>
              </div>
            </div>

            {openDeleteModal && (
              <div
                className="fixed inset-0 z-50 w-full bg-black/75 flex flex-col justify-center items-center"
                onClick={() => setOpenDeleteModal(false)}
              >
                <div
                  className={`opacity-100 h-[163px] z-60 bg-[var(--brand-bg)] relative w-[90%]  border border-black flex flex-col items-center justify-evenly transition duration-200 ease-in-out`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    aria-label="Cancel deletion"
                    className="absolute top-3 right-3 cursor-pointer"
                    onClick={() => setOpenDeleteModal(false)}
                  >
                    <Image
                      src="/images/X.svg"
                      alt="Cancel Button"
                      width={14}
                      height={14}
                    />
                  </button>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold leading-[120%] text-center w-[178px]">
                      Are you sure?
                    </p>
                    <p className="text-sm font-normal leading-[120%] text-center w-[178px]">
                      All pictures will be deleted
                    </p>
                    {error && (
                      <p className="text-sm font-normal leading-[120%] text-center w-[178px]">
                        {error}
                      </p>
                    )}
                  </div>
                  <Button
                    text="Confirm & Delete"
                    uppercase={false}
                    padding="[15px]"
                    textSize="text-[13px]"
                    maxWidth="max-w-[159px]"
                    onClick={() =>
                      triggerAccountDeletion(userProfile.id, userProfile.email)
                    }
                  />
                </div>
              </div>
            )}

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
