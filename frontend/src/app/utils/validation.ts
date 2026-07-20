/**
 * Centralized regex validation rules for professional production-graded security.
 */

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[6-9]\d{9}$/,
  POSTAL_CODE: /^\d{6}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  LAST_NAME: /^[a-zA-Z\s]{1,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
  OTP: /^\d{4,6}$/,
};

export const validateEmail = (val: string): string | null => {
  if (!val.trim()) return "Email address is required.";
  if (!REGEX.EMAIL.test(val)) return "Please enter a valid email address (e.g. name@domain.com).";
  return null;
};

export const validatePhone = (val: string): string | null => {
  const clean = val.replace(/\D/g, "");
  if (!val.trim()) return "Phone number is required.";
  if (clean.length !== 10 || !REGEX.PHONE.test(clean)) {
    return "Please enter a valid 10-digit mobile number starting with 6-9.";
  }
  return null;
};

export const validatePostalCode = (val: string): string | null => {
  if (!val.trim()) return "Postal code/PIN is required.";
  if (!REGEX.POSTAL_CODE.test(val.trim())) return "Please enter a valid 6-digit PIN code.";
  return null;
};

export const validateName = (fieldName: string, val: string): string | null => {
  if (!val.trim()) return `${fieldName} is required.`;
  
  if (fieldName.toLowerCase().includes("last")) {
    if (!REGEX.LAST_NAME.test(val.trim())) {
      return `${fieldName} must contain letters only (1-15 characters).`;
    }
  } else {
    if (!REGEX.NAME.test(val.trim())) {
      return `${fieldName} must contain letters only (2-50 characters).`;
    }
  }
  
  return null;
};

export const validatePassword = (val: string): string | null => {
  if (!val) return "Password is required.";
  if (!REGEX.PASSWORD.test(val)) {
    return "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character (@$!%*?&#).";
  }
  return null;
};

export const validateOtp = (val: string): string | null => {
  if (!val.trim()) return "Verification code is required.";
  if (!REGEX.OTP.test(val.trim())) return "Please enter a valid 4 to 6 digit verification code.";
  return null;
};
