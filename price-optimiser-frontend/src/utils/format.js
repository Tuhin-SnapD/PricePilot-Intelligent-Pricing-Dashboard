export const formatCurrency = (value, fallback = "—") => {
  const num = typeof value === "number" ? value : parseFloat(value);
  if (!Number.isFinite(num)) return fallback;
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatNumber = (value, fallback = "—") => {
  const num = typeof value === "number" ? value : parseFloat(value);
  if (!Number.isFinite(num)) return fallback;
  return num.toLocaleString("en-US");
};

export const formatPercent = (value, digits = 1, fallback = "—") => {
  const num = typeof value === "number" ? value : parseFloat(value);
  if (!Number.isFinite(num)) return fallback;
  return `${num.toFixed(digits)}%`;
};
