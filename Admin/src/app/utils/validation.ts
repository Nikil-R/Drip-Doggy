export const REGEX_PATTERNS = {
  // E.g., admin@dripdoggy.com
  EMAIL: /^([a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})$/,
  
  // E.g., 9876543210 or +919876543210
  PHONE: /^\+?[0-9]{10,15}$/,
  
  // Alphanumeric names for categories, subcategories, products, slide titles
  NAME: /^[a-zA-Z0-9\s\-&',()]{2,100}$/,
  
  // Alphanumeric coupon codes: SAVE50, DRIP100
  COUPON: /^[a-zA-Z0-9]{3,20}$/,
  
  // Alphanumeric SKU codes: DD-DRS-004-BLK
  SKU: /^[a-zA-Z0-9\-_]{3,40}$/,
  
  // Currency values: 129.99, 1500
  PRICE: /^[0-9]+(\.[0-9]{1,2})?$/,
  
  // Integers: ordering, active indices, stock quantities
  INTEGER: /^[0-9]+$/
};

export const validateField = (pattern: RegExp, value: string): boolean => {
  return pattern.test(value.trim());
};
