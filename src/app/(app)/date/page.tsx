"use client";
import CollectionHeader from "@/components/CollectionHeader";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUserImagesByMonth } from "@/lib/imageManager";
import monthNameToNumber from "@/components/MonthNameToIndex";
import { useCurrentPage } from "@/providers/PageProvider";
import { useRevenueCat } from "@/hooks/useRevenueCat";

interface SelectedImage {
  id: string;
  src: string;
  name: string;
}

const allMonths = [
  "December",
  "November",
  "October",
  "September",
  "August",
  "July",
  "June",
  "May",
  "April",
  "March",
  "February",
  "January",
];

const getAccessHistory = (): string[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("monthAccessHistory");
  return stored ? JSON.parse(stored) : [];
};

const addToAccessHistory = (monthKey: string) => {
  if (typeof window === "undefined") return;
  const history = getAccessHistory();
  if (!history.includes(monthKey)) {
    history.push(monthKey);
    localStorage.setItem("monthAccessHistory", JSON.stringify(history));
  }
};

export default function Home() {
  const {
    setTargetMonth,
    targetYear,
    imagesByMonth,
    setImagesByMonth,
    refreshToggle,
  } = usePhotoFlow();

  const [isLoading, setIsLoading] = useState(false);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const { setCurrentPage } = useCurrentPage();
  const { subscriptionStatus } = useRevenueCat();
  const [accessHistory, setAccessHistory] = useState<string[]>([]);

  const hasActiveSubscription = subscriptionStatus?.isSubscribed || false;

  useEffect(() => {
    setCurrentPage("date");
  }, [setCurrentPage]);

  const filteredMonths =
    targetYear === currentYear
      ? allMonths.filter((month) => {
          const indexInCalendar = 11 - currentMonthIndex;
          return allMonths.indexOf(month) >= indexInCalendar;
        })
      : allMonths;

  useEffect(() => {
    const loadAllMonthImages = async () => {
      if (!targetYear) return;
      setIsLoading(true);

      const monthNumbers = filteredMonths.map(monthNameToNumber);

      const newImagesByMonth = await fetchUserImagesByMonth(
        targetYear.toString(),
        monthNumbers
      );

      setImagesByMonth((prev) => ({
        ...prev,
        ...newImagesByMonth,
      }));

      setIsLoading(false);
    };

    loadAllMonthImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetYear, refreshToggle]);

  const isMonthLocked = (month: string) => {
    const monthNumber = monthNameToNumber(month);
    const monthDate = new Date(
      targetYear || currentYear,
      Number(monthNumber) - 1
    );
    const currentDate = new Date(currentYear, currentMonthIndex);
    const monthKey = `${targetYear || currentYear}-${monthNumber}`;

    if (hasActiveSubscription) return false;

    if (
      monthDate.getFullYear() === currentDate.getFullYear() &&
      monthDate.getMonth() === currentDate.getMonth()
    ) {
      return false;
    }

    if (accessHistory.includes(monthKey)) {
      return false;
    }

    if (monthDate > currentDate) {
      return true;
    }

    return true;
  };

  useEffect(() => {
    const loadAllMonthImages = async () => {
      if (!targetYear) return;
      setIsLoading(true);

      const monthsToLoad = filteredMonths.filter(
        (month) => hasActiveSubscription || !isMonthLocked(month)
      );

      const monthNumbers = monthsToLoad.map(monthNameToNumber);

      const newImagesByMonth = await fetchUserImagesByMonth(
        targetYear.toString(),
        monthNumbers
      );

      setImagesByMonth((prev) => ({
        ...prev,
        ...newImagesByMonth,
      }));

      setIsLoading(false);
    };

    loadAllMonthImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetYear, refreshToggle, hasActiveSubscription, accessHistory]);

  useEffect(() => {
    const currentMonthKey = `${currentYear}-${currentMonthIndex + 1}`;
    addToAccessHistory(currentMonthKey);
    setAccessHistory((prev) => {
      if (!prev.includes(currentMonthKey)) {
        return [...prev, currentMonthKey];
      }
      return prev;
    });
  }, [currentYear, currentMonthIndex]);

  // function MonthPhotoGrid({ month }: { month: string }) {
  //   const monthNumber = monthNameToNumber(month);
  //   const monthKey = `${targetYear}-${monthNumber}`;
  //   const images = imagesByMonth[monthKey] || [];
  //   return <PhotoGrid images={images} title={month} />;
  // }

  // function MonthHeader({ month, locked }: { month: string; locked: boolean }) {
  //   const displayYear = targetYear || new Date().getFullYear();
  //   const monthNumber = monthNameToNumber(month);
  //   const monthKey = `${displayYear}-${monthNumber}`;
  //   const monthImages = imagesByMonth[monthKey] || [];
  //   const imageCount = monthImages.length;

  //   return (
  //     <CollectionHeader
  //       header={month}
  //       imageCount={imageCount}
  //       locked={locked}
  //     />
  //   );
  // }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Image
          src="/images/spinner-black.svg"
          width={20}
          height={20}
          alt="Loading spinner"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-30">
        {filteredMonths.map((month) => {
          const locked = isMonthLocked(month);
          return (
            <div
              key={month}
              className={`cursor-pointer ${locked ? "relative" : ""}`}
              onClick={() => setTargetMonth(month)}
            >
              <MonthHeader
                month={month}
                locked={locked}
                targetYear={targetYear || currentYear}
                imagesByMonth={imagesByMonth}
              />
              <MonthPhotoGrid
                month={month}
                targetYear={targetYear || currentYear}
                imagesByMonth={imagesByMonth}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MonthPhotoGrid = React.memo(function MonthPhotoGrid({
  month,
  targetYear,
  imagesByMonth,
}: {
  month: string;
  targetYear: number;
  imagesByMonth: Record<string, SelectedImage[]>;
}) {
  const monthNumber = monthNameToNumber(month);
  const monthKey = `${targetYear}-${monthNumber}`;
  const images = imagesByMonth[monthKey] || [];
  return <PhotoGrid images={images} title={month} />;
});

const MonthHeader = React.memo(function MonthHeader({
  month,
  locked,
  targetYear,
  imagesByMonth,
}: {
  month: string;
  locked: boolean;
  targetYear: number;
  imagesByMonth: Record<string, SelectedImage[]>;
}) {
  const monthNumber = monthNameToNumber(month);
  const monthKey = `${targetYear}-${monthNumber}`;
  const monthImages = imagesByMonth[monthKey] || [];
  const imageCount = monthImages.length;

  return (
    <CollectionHeader header={month} imageCount={imageCount} locked={locked} />
  );
});
