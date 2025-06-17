export default function monthNameToNumber(month: string): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIndex = months.indexOf(month);
  if (monthIndex === -1) {
    throw new Error(`Invalid month name: ${month}`);
  }
  return (monthIndex + 1).toString().padStart(2, "0");
}
