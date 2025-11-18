// Simple local database for development
// This replaces the complex PostgreSQL setup for quick testing

interface OTPCode {
  phone: string;
  code_hash: string;
  expires_at: number;
}

// In-memory database for local development
const localDB = {
  tenants: [
    {
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Demo Tenant',
      domain: 'demo.fitcoach.com',
      is_active: true
    }
  ],
  
  team_members: [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Admin User',
      email: 'admin@demo.com',
      phone: '+201012345678',
      role: 'admin',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Trainer',
      email: 'trainer@demo.com',
      phone: '+201087654321',
      role: 'senior',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Sarah Coach',
      email: 'sarah@demo.com',
      phone: '+966501234567',
      role: 'junior',
      is_active: true
    }
  ],
  
  otp_codes: [] as OTPCode[]
};

export const localDatabase = {
  // Find user by phone
  findUserByPhone: (phone: string) => {
    return localDB.team_members.find(user => user.phone === phone && user.is_active);
  },
  
  // Find user by ID
  findUserById: (id: string) => {
    return localDB.team_members.find(user => user.id === id && user.is_active);
  },
  
  // Store OTP
  storeOTP: (phone: string, codeHash: string, expiresAt: number) => {
    // Remove existing OTP for this phone
    localDB.otp_codes = localDB.otp_codes.filter(otp => otp.phone !== phone);
    
    // Add new OTP
    localDB.otp_codes.push({
      phone,
      code_hash: codeHash,
      expires_at: expiresAt
    });
  },
  
  // Verify OTP
  verifyOTP: async (phone: string, providedCode: string) => {
    console.log(`🔍 Verifying OTP for ${phone} with code: ${providedCode}`);
    console.log(`🔍 Current OTP records:`, localDB.otp_codes);
    
    const now = Date.now();
    const otpRecord = localDB.otp_codes.find(otp => 
      otp.phone === phone && 
      otp.expires_at > now
    );
    
    if (!otpRecord) {
      console.log(`❌ No valid OTP found for ${phone}. Current time: ${now}`);
      console.log(`❌ Available OTPs:`, localDB.otp_codes.map(otp => ({
        phone: otp.phone,
        expires_at: otp.expires_at,
        expired: otp.expires_at <= now
      })));
      return false;
    }

    console.log(`🔍 Found OTP record for ${phone}, comparing codes...`);
    
    // Compare the provided code with the stored hash
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(providedCode, otpRecord.code_hash);
    
    console.log(`🔍 Code comparison result: ${isValid}`);
    
    if (isValid) {
      // Remove used OTP
      localDB.otp_codes = localDB.otp_codes.filter(otp => otp.phone !== phone);
      console.log(`✅ OTP verified for ${phone}`);
      return true;
    }
    
    console.log(`❌ Invalid OTP for ${phone}`);
    return false;
  },
  
  // Clean expired OTPs
  cleanExpiredOTPs: () => {
    const now = Date.now();
    localDB.otp_codes = localDB.otp_codes.filter(otp => otp.expires_at > now);
  },

  // Add new user
  addUser: (user: any) => {
    localDB.team_members.push(user);
    console.log(`✅ New user added: ${user.name} (${user.phone})`);
  }
};

// Clean expired OTPs every minute
setInterval(() => {
  localDatabase.cleanExpiredOTPs();
}, 60000);

console.log('🗄️ Local database initialized with test users:');
console.log('- Admin: +201012345678 (admin@demo.com)');
console.log('- Senior Trainer: +201087654321 (trainer@demo.com)');
console.log('- Junior Coach: +966501234567 (sarah@demo.com)');