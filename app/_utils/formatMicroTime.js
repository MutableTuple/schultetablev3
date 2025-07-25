import { formatDistanceToNowStrict } from "date-fns";

export function formatMicroTime(date) {
  const result = formatDistanceToNowStrict(date);
  const [value, unit] = result.split(" ");

  const shortUnits = {
    second: "s",
    seconds: "s",
    minute: "m",
    minutes: "m",
    hour: "h",
    hours: "h",
    day: "d",
    days: "d",
    month: "mo",
    months: "mo",
    year: "y",
    years: "y",
  };

  return `${value}${shortUnits[unit] || ""}`;
}
