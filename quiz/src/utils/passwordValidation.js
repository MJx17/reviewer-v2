// utils/passwordValidation.js
export const passwordRules = [
  { test: (p) => p.length >= 8, message: "At least 8 characters" },
  { test: (p) => /[A-Z]/.test(p), message: "An uppercase letter" },
  { test: (p) => /[a-z]/.test(p), message: "A lowercase letter" },
  { test: (p) => /\d/.test(p), message: "A number" },
  { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), message: "A special character" },
];

export const checkPasswordRules = (password) => {
  return passwordRules.map((rule) => ({
    message: rule.message,
    valid: rule.test(password),
  }));
};
