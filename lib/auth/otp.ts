// Use a global variable to persist the OTP store across module reloads in development
const globalForOtpStore = global as unknown as {
  otpStore: Map<string, { hash: string; expiresAt: number; attempts: number; lockedUntil?: number }>;
};

export const otpStore =
  globalForOtpStore.otpStore ||
  new Map<string, { hash: string; expiresAt: number; attempts: number; lockedUntil?: number }>();

if (process.env.NODE_ENV !== 'production') globalForOtpStore.otpStore = otpStore;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOtp(code: string): string {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}