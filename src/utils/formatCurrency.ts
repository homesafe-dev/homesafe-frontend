export const formatNgnCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const value = Number.isNaN(numAmount) ? 0 : numAmount;

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/** Mask amount as ₦ ******** (stars only, no commas or decimals). */
export const formatMaskedNgnCurrency = (amount: string | number): string => {
  const formatted = formatNgnCurrency(amount);
  const digitCount = (formatted.match(/\d/g) || []).length;
  const stars = '*'.repeat(Math.max(digitCount, 6));

  return `₦ ${stars}`;
};
