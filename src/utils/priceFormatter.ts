/**
 * Format price to Vietnamese currency or show "Liên hệ" if price is 0
 * @param price - The price value (may be string from MySQL decimal)
 * @returns Formatted price string e.g. "24.000đ"
 */
export const formatPrice = (price: number | string | undefined): string => {
  const num = Number(price);
  if (!num || num === 0) {
    return "Liên hệ";
  }

  return Math.round(num).toLocaleString("vi-VN");
};

/**
 * Format price for simple display (without currency symbol)
 * @param price - The price value
 * @returns Formatted price string or "Liên hệ"
 */
export const formatPriceSimple = (price: number | string | undefined): string => {
  const num = Number(price);
  if (!num || num === 0) {
    return "Liên hệ";
  }

  return Math.round(num).toLocaleString("vi-VN");
};
