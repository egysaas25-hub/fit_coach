'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Phone, MessageSquare, AlertCircle, Loader2, HelpCircle, User, Building } from 'lucide-react';
import { useRequestOtp, useRegisterWithOtp } from "@/lib/hooks/api/useAuth";
import { toast } from "@/lib/hooks/common/use-toast";

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

export default function UnifiedRegister() {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [countryCode, setCountryCode] = useState('+20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  
  const requestOtp = useRequestOtp();
  const registerWithOtp = useRegisterWithOtp();
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('lang');
      if (savedLang === 'en' || savedLang === 'ar') setLanguage(savedLang as 'en' | 'ar');
    } catch {}
    const navLang = (navigator.language || '').toLowerCase();
    const langMap: Record<string, string> = {
      'en-us': '+1', 'en-gb': '+44', 'de': '+49', 'fr': '+33', 'ja': '+81', 'zh-cn': '+86', 'hi': '+91', 'ar': '+20', 'ar-eg': '+20', 'ar-sa': '+966', 'ar-ae': '+971'
    };
    const match = Object.keys(langMap).find(k => navLang.startsWith(k));
    if (match) setCountryCode(langMap[match]);
  }, []);
  
  useEffect(() => {
    try { localStorage.setItem('lang', language); } catch {}
    document.documentElement.lang = language;
  }, [language]);

  // Format phone for display while keeping digits-only state
  const formatPhone = (raw: string) => {
    const d = raw.replace(/\D/g, '');
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0,3)}-${d.slice(3)}`;
    return `${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7,11)}`;
  };

  const fullPhone = `${countryCode}${phoneNumber.replace(/\D/g,'')}`;
  const isValidPhone = /^\+[0-9]{1,3}[0-9]{6,14}$/.test(fullPhone);
  const isValidForm = name.trim() !== '' && workspaceName.trim() !== '' && isValidPhone;

  // Send OTP
  const handleSendOTP = async () => {
    if (!isValidForm) {
      setError('Please fill all required fields and enter a valid phone number');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await requestOtp.mutateAsync({ phone: phoneNumber, countryCode });
      
      // 🔥 DEV MODE: Show OTP in toast
      if (res?.devMode?.otp) {
        toast({
          title: '🔓 Development Mode',
          description: `Your OTP is: ${res.devMode.otp}`,
          duration: 30000, // Show for 30 seconds
        });
      }
      
      setIsLoading(false);
      setOtpSent(true);
      setStep('otp');
      setIsOtpModalOpen(true);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'EVT-REG-START', phone: fullPhone });
      const ttl = res?.ttlSeconds ?? 60;
      setResendTimer(ttl);
      const interval = setInterval(() => {
        setResendTimer((prev: number) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e: any) {
      setIsLoading(false);
      const msg = e?.response?.data?.error?.message || 'Failed to send OTP';
      setError(msg);
      const status = e?.response?.status;
      (window as any).dataLayer = (window as any).dataLayer || [];
      if (status === 429) {
        (window as any).dataLayer.push({ event: 'EVT-AUTH-LOCK', phone: fullPhone });
      }
    }
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

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    if (text.length) {
      e.preventDefault();
      const arr = text.split('');
      const filled = [...otp];
      for (let i=0;i<6;i++) filled[i] = arr[i] || '';
      setOtp(filled);
      if (text.length === 6) handleVerifyOTP(text);
    }
  };

  // Handle backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify OTP and create account
  const handleVerifyOTP = async (otpCode: string) => {
    setIsLoading(true);
    setError('');
    try {
      // For registration, we'll use the registerWithOtp hook
      const result = await registerWithOtp.mutateAsync({ 
        phone: phoneNumber, 
        countryCode, 
        code: otpCode,
        name,
        email,
        workspaceName
      });
      setIsLoading(false);
      setStatusMessage('Registration successful');
      setIsOtpModalOpen(false);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'EVT-REG-SUCCESS', phone: fullPhone });
      
      // Show success message and redirect
      toast({ 
        title: 'Success', 
        description: 'Registration successful! Redirecting to dashboard...' 
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
    } catch (e: any) {
      setIsLoading(false);
      setError(e?.response?.data?.error?.message || 'Invalid OTP code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-2xl font-bold">FitCoach</span>
            </div>
            <div className="w-28">
              <Select value={language} onValueChange={(val) => setLanguage(val as 'en' | 'ar')}>
                <SelectTrigger id="language" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="ar">AR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 'form' && 'Create your Trainer Workspace'}
            {step === 'otp' && 'Verify Your Number'}
          </CardTitle>
          <CardDescription>
            {step === 'form' && 'Start your fitness journey with us'}
            {step === 'otp' && `We sent a code to ${countryCode} ${phoneNumber.replace(/\d(?=\d{4})/g, 'x')}`}
          </CardDescription>
          <div role="status" aria-live="polite" className="sr-only">{statusMessage}</div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step 1: Registration Form */}
          {step === 'form' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="workspaceName">Workspace Name *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="workspaceName"
                    placeholder="My Fitness Studio"
                    className="bg-background pl-10"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="bg-background pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="coach@example.com"
                  className="bg-background"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

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
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex gap-2">
                  <div className="w-20 flex items-center justify-center border border-border rounded-lg bg-muted text-sm font-medium">
                    {countryCode}
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123456789"
                    className="bg-background flex-1"
                    value={formatPhone(phoneNumber)}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g,''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                    aria-describedby="phone-error"
                  />
                </div>
                {error && (
                  <div id="phone-error" className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>WhatsApp Verification</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  You'll receive a 6-digit code via WhatsApp. Make sure you have WhatsApp installed and can receive messages.
                </p>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                disabled={!isValidForm || isLoading}
                onClick={handleSendOTP}
                aria-describedby={error ? "phone-error" : undefined}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Send code on WhatsApp
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </div>
            </>
          )}

          {/* Step 2: OTP Verification (Modal) */}
          {step === 'otp' && (
            <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter the 6-digit code</DialogTitle>
                  <DialogDescription>Sent to {countryCode} {phoneNumber.replace(/\d(?=\d{4})/g, 'x')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {otp.map((digit: string, index: number) => (
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
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        aria-label={`Digit ${index + 1} of 6`}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
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
                      <span className="text-muted-foreground">Resend code in {resendTimer}s</span>
                    ) : (
                      <button 
                        onClick={() => { 
                          (window as any).dataLayer = (window as any).dataLayer || []; 
                          (window as any).dataLayer.push({ event: 'EVT-AUTH-RESEND', phone: fullPhone }); 
                          handleSendOTP(); 
                        }} 
                        className="text-primary hover:underline font-medium"
                      >
                        Resend via WhatsApp
                      </button>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={() => handleVerifyOTP(otp.join(''))} 
                    disabled={isLoading || !otp.every(d => d)}
                  >
                    Create Account
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStep('form');
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                      setIsOtpModalOpen(false);
                    }}
                  >
                    Edit Information
                  </Button>

                  <div className="text-center pt-2 border-t border-border">
                    <button 
                      className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1"
                      onClick={() => setIsHelpOpen(true)}
                    >
                      <HelpCircle className="w-4 h-4" />
                      Lost access to WhatsApp?
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Help Modal */}
          <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Need help with WhatsApp verification?</DialogTitle>
                <DialogDescription>If you lost access to WhatsApp, contact support or use an alternate verification method provided by your admin.</DialogDescription>
              </DialogHeader>
              <div className="text-sm text-muted-foreground">
                <ul className="list-disc pl-4 space-y-2">
                  <li>Email us: <a href="mailto:support@fitcoach.example" className="text-primary">support@fitcoach.example</a></li>
                  <li>WhatsApp: <a href="https://wa.me/200100000000" target="_blank" rel="noreferrer" className="text-primary">Open WhatsApp</a></li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <div className="mt-4 text-xs text-muted-foreground text-center">
        ©2025 Trainer SaaS · v2025.1
      </div>
    </div>
  );
}