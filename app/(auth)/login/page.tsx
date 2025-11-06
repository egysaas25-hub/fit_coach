'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/store/auth.store';
import { toast } from '@/lib/hooks/common/use-toast';
import { useAuth } from '@/hooks/api/use-auth';

export default function UnifiedLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const { mutate: login, isLoading } = useAuth();
  const { user } = useAuthStore();
  const router = useRouter();

  // Redirect if already logged in
  if (user) {
    const redirectPath =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'super-admin'
        ? '/super-admin/dashboard'
        : user.role === 'trainer'
        ? '/trainer/dashboard'
        : '/client/dashboard';
    router.push(redirectPath);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password, type: role },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Logged in successfully' });
          const redirectPath =
            role === 'admin'
              ? '/admin/dashboard'
              : role === 'super-admin'
              ? '/super-admin/dashboard'
              : role === 'trainer'
              ? '/trainer/dashboard'
              : '/client/dashboard';
          router.push(redirectPath);
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.message || 'Invalid credentials',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-2xl font-bold">VTrack</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-4" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/client/register" className="text-primary hover:underline font-medium">
              Create Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}