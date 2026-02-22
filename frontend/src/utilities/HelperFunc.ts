export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // time
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  // day with suffix
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";

  const dayWithSuffix = `${day}${suffix}`;

  // month + year
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${dayWithSuffix} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};
