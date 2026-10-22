export const CATEGORY_OPTIONS = [
  { value: "Electronics", icon: "📱" },
  { value: "Outdoor", icon: "🏕️" },
  { value: "Sustainable", icon: "🌱" },
  { value: "Home", icon: "🏠" },
  { value: "Fitness", icon: "💪" },
  { value: "Stationery", icon: "📝" },
  { value: "Apparel", icon: "👕" },
];

export const DEFAULT_CATEGORIES = CATEGORY_OPTIONS.map((category) => category.value);

export const getCategoryIcon = (category) =>
  CATEGORY_OPTIONS.find((option) => option.value === category)?.icon || "🏷️";
