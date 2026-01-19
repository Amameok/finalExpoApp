
// This a regex validation for client side

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// Detect script tags or SQL-like injection patterns
export const SUSPICIOUS_RE = /(<script\b[^>]*>.*?<\/script>)|(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDROP\b|(\%27)|(\%3C)|(\%3E)|(--\s)|(;))/i;

export function validateLoginInput(email: string, password: string) {
  if (!EMAIL_RE.test(email)) throw new Error("Invalid email format");
  if (!PASS_RE.test(password)) throw new Error("Password must be minimul 8 chars with letters, numbers and symbols");
  if (SUSPICIOUS_RE.test(email) || SUSPICIOUS_RE.test(password)) throw new Error("Suspicious input detected");
}