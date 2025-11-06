import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Phone, MessageSquare, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
];

export default function WhatsAppLogin() {
  const [step, setStep] = useState<'phone' | 'otp' | 'role'>('phone');
  const [countryCode, setCountryCode] = useState('+20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [role, setRole] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Phone number validation
  const isValidPhone = phoneNumber.length >= 9 && /^\d+$/.test(phoneNumber);

  // Send OTP
  const handleSendOTP = async () => {
    if (!isValidPhone) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setStep('otp');
      setResendTimer(60);
      
      // Start countdown
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-verify when all filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  // Handle backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otpCode: string) => {
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Check OTP (in real app, this is done on backend)
      if (otpCode === '123456') {
        setStep('role');
      } else {
        setError('Invalid OTP code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    }, 1000);
  };

  // Complete login
  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const dashboards = {
        client: '/client/dashboard',
        trainer: '/trainer/dashboard',
        admin: '/admin/dashboard',
        'super-admin': '/super-admin/dashboard'
      };
      
      // In real app: window.location.href = dashboards[role];
      alert(`Redirecting to ${dashboards[role as keyof typeof dashboards]}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0E0C] p-4">
      <Card className="w-full max-w-md border-border/50 bg-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#00C26A]" />
            <span className="text-2xl font-bold">VTrack</span>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 'phone' && 'Sign In'}
            {step === 'otp' && 'Verify Your Number'}
            {step === 'role' && 'Select Your Role'}
          </CardTitle>
          <CardDescription>
            {step === 'phone' && 'Enter your phone number to receive a verification code via WhatsApp'}
            {step === 'otp' && `We sent a code to ${countryCode} ${phoneNumber}`}
            {step === 'role' && 'Choose how you want to access VTrack'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step 1: Phone Number */}
          {step === 'phone' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="country">Country Code</Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger id="country" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map(({ code, country, flag }) => (
                      <SelectItem key={code} value={code}>
                        <span className="flex items-center gap-2">
                          <span>{flag}</span>
                          <span>{code}</span>
                          <span className="text-muted-foreground">- {country}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="w-20 flex items-center justify-center border border-border rounded-lg bg-muted text-sm font-medium">
                    {countryCode}
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123456789"
                    className="bg-background flex-1"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm text-[#F14A4A]">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="w-4 h-4 text-[#00C26A]" />
                  <span>WhatsApp Verification</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  You'll receive a 6-digit code via WhatsApp. Make sure you have WhatsApp installed and can receive messages.
                </p>
              </div>

              <Button 
                className="w-full bg-[#00C26A] hover:bg-[#00C26A]/90" 
                size="lg"
                disabled={!isValidPhone || isLoading}
                onClick={handleSendOTP}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Continue with WhatsApp
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <a href="/register" className="text-[#00C26A] hover:underline font-medium">
                  Create Account
                </a>
              </div>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <>
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-14 text-center text-xl font-bold bg-background"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-[#F14A4A]">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying code...</span>
                  </div>
                )}

                <div className="text-center text-sm">
                  {resendTimer > 0 ? (
                    <span className="text-muted-foreground">
                      Resend code in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      onClick={handleSendOTP}
                      className="text-[#00C26A] hover:underline font-medium"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="font-medium">Tip:</span> Check your WhatsApp for a message from VTrack. The code expires in 5 minutes.
                </p>
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep('phone');
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                }}
              >
                Use Different Number
              </Button>
            </>
          )}

          {/* Step 3: Role Selection */}
          {step === 'role' && (
            <>
              <div className="flex items-center justify-center p-4 bg-[#00C26A]/10 border border-[#00C26A]/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#00C26A] mr-2" />
                <span className="text-sm font-medium">Phone verified successfully</span>
              </div>

              <div className="space-y-2">
                <Label>I am a</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Client</span>
                        <span className="text-xs text-muted-foreground">Track workouts and nutrition</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="trainer">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Trainer</span>
                        <span className="text-xs text-muted-foreground">Manage clients and programs</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Admin</span>
                        <span className="text-xs text-muted-foreground">Business management</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="super-admin">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Super Admin</span>
                        <span className="text-xs text-muted-foreground">Platform administration</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-[#00C26A] hover:bg-[#00C26A]/90"
                size="lg"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Continue to Dashboard'
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setStep('phone')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Sign in with different number
                </button>
              </div>
            </>
          )}

          {/* Forgot Device Link */}
          {step === 'otp' && (
            <div className="text-center pt-2 border-t border-border">
              <button className="text-sm text-muted-foreground hover:text-[#00C26A]">
                Lost access to WhatsApp?
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}