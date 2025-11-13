// Simple test script to verify WhatsApp authentication implementation
// This script can be run with: npx ts-node test-whatsapp-auth.ts

import { hashOtp } from './lib/auth/otp';

async function testOtpFunctionality() {
  console.log('Testing OTP functionality...');
  
  // Test OTP generation
  const testCode = '123456';
  const hashed = hashOtp(testCode);
  console.log(`Hashed OTP for ${testCode}: ${hashed}`);
  
  // Test OTP verification
  const verifyCode = '123456';
  const verifyHash = hashOtp(verifyCode);
  console.log(`Verification hash for ${verifyCode}: ${verifyHash}`);
  
  const isValid = hashed === verifyHash;
  console.log(`OTP verification result: ${isValid}`);
  
  console.log('OTP functionality test completed.');
}

testOtpFunctionality().catch(console.error);