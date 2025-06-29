export const formatNumber = (num) => {
  if (typeof num !== "number" || isNaN(num)) return "N/A";
  return num.toLocaleString();
};
