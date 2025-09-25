"use client";
import CollectionHeader from "@/components/CollectionHeader";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUserImagesByMonth } from "@/lib/imageManager";
import { useCurrentPage } from "@/providers/PageProvider";
import { useRevenueCat } from "@/hooks/useRevenueCat";

interface SelectedImage {
  id: string;
  src: string;
  name: string;
}

const getAllMonthsForYear = (
  year: number,
  currentYear: number,
  currentMonthIndex: number
) => {
  if (year === currentYear) {
    const months = [];
    for (let i = currentMonthIndex; i >= 0; i--) {
      months.push(i + 1);
    }
    return months;
  } else {
    return [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  }
};

const getMonthName = (monthNumber: number, year: number) => {
  const date = new Date(year, monthNumber - 1, 1);
  return date.toLocaleDateString(undefined, { month: "long" });
};

const formatMonthForAPI = (monthNumber: number): string => {
  return monthNumber.toString().padStart(2, "0");
};

const createMonthKey = (year: number, monthNumber: number): string => {
  return `${year}-${monthNumber.toString().padStart(2, "0")}`;
};

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
    setAccessHistory(getAccessHistory());
  }, [setCurrentPage]);

  const monthNumbers = getAllMonthsForYear(
    targetYear || currentYear,
    currentYear,
    currentMonthIndex
  );

  const isMonthLocked = (monthNumber: number) => {
    const monthDate = new Date(targetYear || currentYear, monthNumber - 1);
    const currentDate = new Date(currentYear, currentMonthIndex);
    const monthKey = createMonthKey(targetYear || currentYear, monthNumber);

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

      const monthsForAPI = monthNumbers.map(formatMonthForAPI);

      const newImagesByMonth = await fetchUserImagesByMonth(
        targetYear.toString(),
        monthsForAPI
      );

      setImagesByMonth((prev) => ({
        ...prev,
        ...newImagesByMonth,
      }));

      setIsLoading(false);
    };

    loadAllMonthImages();
  }, [targetYear, refreshToggle, accessHistory]);

  useEffect(() => {
    const currentMonthKey = `${currentYear}-${(currentMonthIndex + 1)
      .toString()
      .padStart(2, "0")}`;
    addToAccessHistory(currentMonthKey);
    setAccessHistory((prev) => {
      if (!prev.includes(currentMonthKey)) {
        return [...prev, currentMonthKey];
      }
      return prev;
    });
  }, [currentYear, currentMonthIndex]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
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
        {monthNumbers.map((monthNumber) => {
          const locked = isMonthLocked(monthNumber);
          const monthName = getMonthName(
            monthNumber,
            targetYear || currentYear
          );
          return (
            <div
              key={monthNumber}
              className={`cursor-pointer ${locked ? "relative" : ""}`}
              onClick={() => setTargetMonth(monthName)}
            >
              <MonthHeader
                monthNumber={monthNumber}
                monthName={monthName}
                locked={locked}
                targetYear={targetYear || currentYear}
                imagesByMonth={imagesByMonth}
              />
              <MonthPhotoGrid
                monthNumber={monthNumber}
                monthName={monthName}
                locked={locked}
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
  monthNumber,
  monthName,
  targetYear,
  imagesByMonth,
}: {
  monthNumber: number;
  monthName: string;
  locked: boolean;
  targetYear: number;
  imagesByMonth: Record<string, SelectedImage[]>;
}) {
  const monthKey = createMonthKey(targetYear, monthNumber);
  const images = imagesByMonth[monthKey] || [];

  return <PhotoGrid images={images} title={monthName} />;
});

const MonthHeader = React.memo(function MonthHeader({
  monthNumber,
  monthName,
  locked,
  targetYear,
  imagesByMonth,
}: {
  monthNumber: number;
  monthName: string;
  locked: boolean;
  targetYear: number;
  imagesByMonth: Record<string, SelectedImage[]>;
}) {
  const monthKey = createMonthKey(targetYear, monthNumber);
  const monthImages = imagesByMonth[monthKey] || [];
  const imageCount = monthImages.length;

  return (
    <CollectionHeader
      header={monthName}
      imageCount={imageCount}
      locked={locked}
    />
  );
});
