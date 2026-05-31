export const parseRating = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
};

export const parseReviewCount = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  const num = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
};
