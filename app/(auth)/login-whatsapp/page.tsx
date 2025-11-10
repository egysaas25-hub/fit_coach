"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Phone, MessageSquare, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useRequestOtp, useVerifyOtp, useTenants } from '@/lib/hooks/api/useAuth';
import { useAuthStore } from '@/lib/store/auth.store';
import { useSettings } from '@/lib/hooks/api/useSettings';
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
  const [step, setStep] = useState<'phone' | 'otp' | 'tenant' | 'role'>('phone');
  const [countryCode, setCountryCode] = useState('+20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [role, setRole] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const [statusMessage, setStatusMessage] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const { data: settings, refetch: refetchSettings } = useSettings();
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const { setTenantId } = useAuthStore();
  const { data: tenants } = useTenants();
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

  // Send OTP
  const handleSendOTP = async () => {
    if (!isValidPhone) {
      setError('Please enter a valid phone number');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await requestOtp.mutateAsync({ phone: phoneNumber, countryCode });
      setIsLoading(false);
      setOtpSent(true);
      setStep('otp');
      setIsOtpModalOpen(true);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'EVT-AUTH-REQ', phone: fullPhone });
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

  // Verify OTP
  const handleVerifyOTP = async (otpCode: string) => {
    setIsLoading(true);
    setError('');
    try {
      const { token, user } = await verifyOtp.mutateAsync({ phone: phoneNumber, countryCode, code: otpCode, role });
      setIsLoading(false);
      setStatusMessage('Code verified');
      setIsOtpModalOpen(false);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'EVT-AUTH-VERIFY', phone: fullPhone });
      setStep('tenant');
    } catch (e: any) {
      setIsLoading(false);
      setError(e?.response?.data?.error?.message || 'Invalid OTP code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    }
  };

  // Complete login
  const handleLogin = () => {
    setIsLoading(true);
    const { tenantId } = useAuthStore.getState();
    setTimeout(() => {
      const dashboards: Record<string, string> = {
        client: '/client/dashboard',
        trainer: '/trainer/dashboard',
        admin: '/admin/dashboard',
        'super-admin': '/super-admin/dashboard'
      };
      const basePath = dashboards[role as keyof typeof dashboards] || '/client/dashboard';
      const target = tenantId ? `/t/${tenantId}${basePath}` : basePath;
      window.location.href = target;
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0E0C] p-4">
      <Card className="w-full max-w-md border-border/50 bg-card">
        <CardHeader className="space-y-1">
      <div className="flex items-center gap-2 mb-4 justify-between">
            <div className="flex items-center gap-2">
              {settings?.branding?.logoUrl ? (
                <img src={settings.branding.logoUrl} alt="Brand Logo" className="h-6 w-auto rounded-sm" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-[#00C26A]" />
              )}
              <span className="text-2xl font-bold">{settings?.branding?.title || settings?.general?.appName || 'VTrack'}</span>
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
            {step === 'phone' && 'Welcome back 👋'}
            {step === 'otp' && 'Verify Your Number'}
            {step === 'tenant' && 'Select Your Workspace'}
            {step === 'role' && 'Select Your Role'}
          </CardTitle>
          <CardDescription>
            {step === 'phone' && 'Sign in to your Trainer Dashboard'}
            {step === 'otp' && `We sent a code to ${countryCode} ${phoneNumber.replace(/\d(?=\d{4})/g, 'x')}`}
            {step === 'tenant' && 'Select your workspace'}
            {step === 'role' && 'Choose how you want to access VTrack'}
          </CardDescription>
          <div role="status" aria-live="polite" className="sr-only">{statusMessage}</div>
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
                    value={formatPhone(phoneNumber)}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g,''))}
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
                    Send code on WhatsApp
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
                      <span className="text-muted-foreground">Resend code in {resendTimer}s</span>
                    ) : (
                      <button onClick={() => { (window as any).dataLayer = (window as any).dataLayer || []; (window as any).dataLayer.push({ event: 'EVT-AUTH-RESEND', phone: fullPhone }); handleSendOTP(); }} className="text-[#00C26A] hover:underline font-medium">Resend via WhatsApp</button>
                    )}
                  </div>

                  <Button className="w-full bg-[#00C26A] hover:bg-[#00C26A]/90" size="lg" onClick={() => handleVerifyOTP(otp.join(''))} disabled={isLoading || !otp.every(d => d)}>
                    Verify
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStep('phone');
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                      setIsOtpModalOpen(false);
                    }}
                  >
                    Use Different Number
                  </Button>

                  <div className="text-center pt-2 border-t border-border">
                    <button className="text-sm text-muted-foreground hover:text-[#00C26A]" onClick={() => setIsHelpOpen(true)}>
                      Lost access to WhatsApp?
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Step 3: Tenant Selection */}
          {step === 'tenant' && (
            <>
              <div className="space-y-2">
                <Label>Select Workspace</Label>
                <Select value={selectedTenantId ?? ''} onValueChange={(val) => setSelectedTenantId(val)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(tenants || []).map((t: any) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[#00C26A] hover:bg-[#00C26A]/90" size="lg" onClick={() => { if (selectedTenantId) { setTenantId(selectedTenantId); refetchSettings(); } setStep('role'); }} disabled={!selectedTenantId}>
                Continue
              </Button>
            </>
          )}
          {/* Step 4: Role Selection */}
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

          {/* Help Modal */}
          <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Need help with WhatsApp verification?</DialogTitle>
                <DialogDescription>If you lost access to WhatsApp, contact support or use an alternate verification method provided by your admin.</DialogDescription>
              </DialogHeader>
              <div className="text-sm text-muted-foreground">
                <ul className="list-disc pl-4">
                  <li>Email us: <a href="mailto:support@vtrack.example" className="text-[#00C26A]">support@vtrack.example</a></li>
                  <li>WhatsApp: <a href="https://wa.me/200100000000" target="_blank" rel="noreferrer" className="text-[#00C26A]">Open WhatsApp</a></li>
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