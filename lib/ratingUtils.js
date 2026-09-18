// Shared helpers for displaying and validating ratings.

export function formatRating(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }
  return Number(value).toFixed(1);
}

export function clampRating(value) {
  const n = Math.round(Number(value) * 10) / 10;
  if (Number.isNaN(n)) return null;
  return Math.min(10, Math.max(0, n));
}

// Rough color bucket so the UI can tint scores (purely cosmetic).
export function ratingColorClass(value) {
  if (value === null || value === undefined) return "text-gray-500";
  const n = Number(value);
  if (n >= 8.5) return "text-emerald-400";
  if (n >= 7) return "text-lime-400";
  if (n >= 5.5) return "text-amber-400";
  if (n >= 4) return "text-orange-400";
  return "text-red-400";
}
