/**
 * Validates a SWIFT/BIC code format.
 * A valid SWIFT/BIC is 8 or 11 characters long and follows a specific structure.
 * @param code The SWIFT/BIC code string.
 * @returns An error message string if invalid, otherwise null.
 */
export const validateSwiftBic = (code: string): string | null => {
  if (!code) return "SWIFT/BIC is required.";
  // A SWIFT code is 8 or 11 characters: 4 letters (bank), 2 letters (country), 2 alphanumeric (location), and optionally 3 alphanumeric (branch).
  const swiftRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  if (!swiftRegex.test(code.toUpperCase())) {
    return "Invalid SWIFT/BIC. Must be 8 or 11 characters.";
  }
  return null;
};

/**
 * Validates an Account Number or IBAN format.
 * This is a basic check for length and characters.
 * @param accountNumber The account number string.
 * @returns An error message string if invalid, otherwise null.
 */
export const validateAccountNumber = (accountNumber: string): string | null => {
  if (!accountNumber) return "Account Number/IBAN is required.";
  // Remove spaces for validation
  const sanitized = accountNumber.replace(/\s/g, '');
  // A very basic check for alphanumeric characters and a common length range for IBANs/account numbers.
  const accountRegex = /^[a-zA-Z0-9]{8,34}$/;
  if (!accountRegex.test(sanitized)) {
    return "Must be between 8 and 34 alphanumeric characters.";
  }
  return null;
};
