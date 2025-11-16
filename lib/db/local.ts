// Simple local database for development
// This replaces the complex PostgreSQL setup for quick testing

interface User {
  id: string;
  tenant_id: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  is_active: boolean;
}

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
      phone: '+1234567890',
      role: 'admin',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Trainer',
      email: 'trainer@demo.com',
      phone: '+1234567891',
      role: 'senior',
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
  verifyOTP: (phone: string, codeHash: string) => {
    const now = Date.now();
    const otpRecord = localDB.otp_codes.find(otp => 
      otp.phone === phone && 
      otp.code_hash === codeHash && 
      otp.expires_at > now
    );
    
    if (otpRecord) {
      // Remove used OTP
      localDB.otp_codes = localDB.otp_codes.filter(otp => otp.phone !== phone);
      return true;
    }
    
    return false;
  },
  
  // Clean expired OTPs
  cleanExpiredOTPs: () => {
    const now = Date.now();
    localDB.otp_codes = localDB.otp_codes.filter(otp => otp.expires_at > now);
  }
};

// Clean expired OTPs every minute
setInterval(() => {
  localDatabase.cleanExpiredOTPs();
}, 60000);

console.log('🗄️ Local database initialized with test users:');
console.log('- Admin: +1234567890 (admin@demo.com)');
console.log('- Trainer: +1234567891 (trainer@demo.com)');