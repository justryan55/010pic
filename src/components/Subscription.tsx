"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useSubscription } from "@/providers/SubscriptionProvider";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import { Capacitor } from "@capacitor/core";

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
  // {
  //   heading: "Unlock - Video",
  //   text: "Sometimes there is more to remember",
  //   svg: "/images/video-black.svg",
  // },
];

export default function Subscription() {
  const { isSubOpen, toggleSubscription } = useSubscription();
  const {
    isInitialized,
    subscriptionStatus,
    currentOffering,

    loading,
    error,
    initialize,
    purchaseMonthlyPlan,
    purchaseYearlyPlan,
    restorePurchases,
  } = useRevenueCat();
  const isNative = Capacitor.isNativePlatform();

  const [isProcessing, setIsProcessing] = useState(false);

  const monthlyPackage = currentOffering?.availablePackages.find(
    (pkg) => pkg.identifier === "$rc_monthly"
  );

  const yearlyPackage = currentOffering?.availablePackages.find(
    (pkg) => pkg.identifier === "$rc_annual"
  );

  const monthlyPrice = monthlyPackage?.product.priceString;
  const yearlyPrice = yearlyPackage?.product.priceString;

  useEffect(() => {
    if (isSubOpen && !isInitialized) {
      initialize();
    }
  }, [isSubOpen, isInitialized, initialize]);

  const handleMonthlyPurchase = async () => {
    if (isProcessing || loading) return;

    setIsProcessing(true);
    try {
      const success = await purchaseMonthlyPlan();
      if (success) {
        alert("Monthly subscription activated!");
        toggleSubscription();
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleYearlyPurchase = async () => {
    if (isProcessing || loading) return;

    setIsProcessing(true);
    try {
      const success = await purchaseYearlyPlan();
      if (success) {
        alert("Yearly subscription activated!");
        toggleSubscription();
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestorePurchases = async () => {
    if (isProcessing || loading) return;

    setIsProcessing(true);
    try {
      const success = await restorePurchases();
      if (success) {
        alert("Purchases restored successfully!");
        if (subscriptionStatus?.isSubscribed) {
          toggleSubscription();
        }
      }
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Failed to restore purchases. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // // If user is already subscribed, show different content
  // if (subscriptionStatus?.isSubscribed) {
  //   return (
  //     <div
  //       className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-[var(--brand-bg)] px-6 flex flex-col justify-center items-center transition-transform duration-300 min-h-screen ${
  //         isSubOpen ? "translate-y-0 fixed" : "translate-y-[150%] hidden"
  //       }`}
  //     >
  //       <div className="flex justify-between w-full pt-8 mb-10">
  //         <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[241px]">
  //           Subscription Active
  //         </h1>
  //         <Image
  //           onClick={toggleSubscription}
  //           src="/images/X.svg"
  //           alt="Cancel Button"
  //           width={14}
  //           height={14}
  //           className="cursor-pointer"
  //         />
  //       </div>

  //       <div className="flex flex-col items-center justify-center flex-1">
  //         <div className="text-center mb-8">
  //           <h2 className="text-2xl font-bold text-green-600 mb-4">
  //             You&#39;re All Set!
  //           </h2>
  //           <p className="text-gray-700 mb-2">Your subscription is active</p>
  //           {subscriptionStatus?.expirationDate && (
  //             <p className="text-sm text-gray-500">
  //               Expires:{" "}
  //               {new Date(
  //                 subscriptionStatus?.expirationDate
  //               ).toLocaleDateString()}
  //             </p>
  //           )}
  //         </div>

  //         <div className="w-full max-w-sm">
  //           <Button
  //             text="Manage Subscription"
  //             onClick={() => {
  //               // You can add logic to open Google Play subscription management
  //               alert("Manage your subscription in the Google Play Store");
  //             }}
  //             uppercase={false}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-[var(--brand-bg)] px-6 flex flex-col justify-between transition-transform duration-300 min-h-screen ${
        isSubOpen ? "translate-y-0 fixed" : "translate-y-[150%] hidden"
      }`}
    >
      <div>
        <div className="flex justify-between pt-8">
          <h1 className="text-black font-semibold text-[28px] leading-[120%] max-w-[241px]">
            Subscription
          </h1>
          <Image
            onClick={toggleSubscription}
            src="/images/X.svg"
            alt="Cancel Button"
            width={14}
            height={14}
            className="cursor-pointer"
          />
        </div>

        {!isInitialized && !error && isNative && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-center">
              Initializing subscription service...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        <div className="mt-10 mb-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-row gap-x-5 items-center w-full mt-8 pointer-cursor"
            >
              <Image src={item.svg} alt={item.heading} width={20} height={20} />

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
          <Button
            text={`Monthly${monthlyPrice ? ` - ${monthlyPrice}` : ""}`}
            onClick={handleMonthlyPurchase}
            disabled={isProcessing || loading || !isInitialized}
            isLoading={isProcessing || loading}
            uppercase={false}
          />
        </div>
        <div className="flex flex-row justify-center items-center mt-4">
          <Button
            text={`Yearly${yearlyPrice ? ` - ${yearlyPrice}` : ""}`}
            onClick={handleYearlyPurchase}
            disabled={isProcessing || loading || !isInitialized}
            isLoading={isProcessing || loading}
            uppercase={false}
          />
        </div>

        <div className="flex flex-row justify-center items-center mt-4">
          <button
            onClick={handleRestorePurchases}
            disabled={isProcessing || loading || !isInitialized}
            className="text-sm text-gray-600 underline disabled:opacity-50"
          >
            Restore Purchases
          </button>
        </div>
        {/* Add restore purchases button */}

        <div className="flex flex-row items-center justify-center gap-1 my-10">
          <p className="text-black font-semibold text-sm leading-[120%]">
            Support
          </p>{" "}
          <span
            className="text-black font-normal italic text-sm"
            style={{ fontFamily: "var(--font-inria)" }}
          >
            indie
          </span>{" "}
          <p className="text-black font-semibold text-sm leading-[120%]">
            Apps
          </p>
        </div>
      </div>
    </div>
  );
}
