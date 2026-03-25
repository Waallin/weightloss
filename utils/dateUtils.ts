export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


export const getFormattedDate = (date: Date): string => {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  const dayString = isToday ? "idag" : date.toLocaleDateString("sv-SE", { weekday: "long" });
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString("sv-SE", { month: "long" });
  return `${dayString}, ${dayNumber} ${monthName}`;
};