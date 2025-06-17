"use client";
import CollectionHeader from "@/components/CollectionHeader";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotoFlow } from "@/providers/PhotoFlowProvider";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUserImagesByMonth } from "@/lib/imagesDB";
import monthNameToNumber from "@/components/MonthNameToIndex";

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

  const filteredMonths =
    targetYear === currentYear
      ? allMonths.filter((month) => {
          const indexInCalendar = 11 - currentMonthIndex;
          return allMonths.indexOf(month) >= indexInCalendar;
        })
      : allMonths;

  // useEffect(() => {
  //   const loadAllMonthImages = async () => {
  //     setIsLoading(true);
  //     if (!targetYear) return;

  //     const loadPromises = filteredMonths.map(async (month) => {
  //       const monthNumber = monthNameToNumber(month);
  //       const monthKey = `${targetYear}-${monthNumber}`;

  //       if (!imagesByMonth[monthKey]) {
  //         const images = await fetchUserImagesByMonth(
  //           targetYear.toString(),
  //           monthNumber
  //         );

  //         const filteredImages = images.filter(
  //           (img): img is { id: string; src: string; name: string } =>
  //             img !== null
  //         );

  //         return { monthKey, images: filteredImages };
  //       }
  //       return null;
  //     });

  //     const results = await Promise.all(loadPromises);

  //     const newImagesByMonth: Record<
  //       string,
  //       { id: string; src: string; name: string }[]
  //     > = {};
  //     results.forEach((result) => {
  //       if (result) {
  //         newImagesByMonth[result.monthKey] = result.images;
  //       }
  //     });

  //     if (Object.keys(newImagesByMonth).length > 0) {
  //       setImagesByMonth((prev) => ({
  //         ...prev,
  //         ...newImagesByMonth,
  //       }));
  //     }

  //     setIsLoading(false);
  //   };

  //   loadAllMonthImages();
  // }, [
  //   targetYear,
  //   filteredMonths,
  //   imagesByMonth,
  //   setImagesByMonth,
  //   refreshToggle,
  // ]);

  useEffect(() => {
    const loadAllMonthImages = async () => {
      if (!targetYear) return;
      setIsLoading(true);

      const monthsToLoad = filteredMonths;

      const loadPromises = monthsToLoad.map(async (month) => {
        const monthNumber = monthNameToNumber(month);
        const images = await fetchUserImagesByMonth(
          targetYear.toString(),
          monthNumber
        );
        const filteredImages = images.filter(
          (img): img is { id: string; src: string; name: string } =>
            img !== null
        );
        return {
          monthKey: `${targetYear}-${monthNumber}`,
          images: filteredImages,
        };
      });

      const results = await Promise.all(loadPromises);

      if (results.length > 0) {
        const newImagesByMonth = results.reduce((acc, { monthKey, images }) => {
          acc[monthKey] = images;
          return acc;
        }, {} as Record<string, { id: string; src: string; name: string }[]>);

        setImagesByMonth((prev) => ({
          ...prev,
          ...newImagesByMonth,
        }));
      }

      setIsLoading(false);
    };

    loadAllMonthImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetYear, refreshToggle]);

  function MonthPhotoGrid({ month }: { month: string }) {
    const monthNumber = monthNameToNumber(month);
    const monthKey = `${targetYear}-${monthNumber}`;
    const images = imagesByMonth[monthKey] || [];
    return <PhotoGrid images={images} />;
  }

  function MonthHeader({ month }: { month: string }) {
    const displayYear = targetYear || new Date().getFullYear();
    const monthNumber = monthNameToNumber(month);
    const monthKey = `${displayYear}-${monthNumber}`;
    const monthImages = imagesByMonth[monthKey] || [];
    const imageCount = monthImages.length;
    return <CollectionHeader header={month} imageCount={imageCount} />;
  }

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
      <div className="mb-14">
        {filteredMonths.map((month) => (
          <div key={month} onClick={() => setTargetMonth(month)}>
            <MonthHeader month={month} />
            <MonthPhotoGrid month={month} />
          </div>
        ))}
      </div>
    </div>
  );
}
