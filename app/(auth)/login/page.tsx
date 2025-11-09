'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserStore } from '@/lib/store/user.store';
import { toast } from '@/lib/hooks/common/use-toast';
import { useLogin } from '@/lib/hooks/api/useAuth';
import { loginSchema } from '@/lib/schemas/auth/auth.schema';
import { z } from 'zod';
import { UserType } from '@/types/domain/user.model';

/**
 * UnifiedLoginPage Component
 * Follows Architecture Rules:
 * - Rule 1: Component calls hook (useLogin) only, not services directly
 * - Rule 4: Uses Zod schema for validation
 * - Uses Zustand store (useUserStore) for UI state access only
 */
export default function UnifiedLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('team_member');
  
  // Rule 1: Component calls hook
  const { mutate: login, isPending } = useLogin();
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const redirectPath =
        user.type === UserType.TEAM_MEMBER
          ? '/admin/dashboard'
          : '/client/dashboard';
      router.push(redirectPath);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Rule 4: Validate against existing schema
      const validatedData = loginSchema.parse({ 
        email, 
        password, 
        type: userType 
      });
      
      // Call hook mutation
      login(
        {
          email: validatedData.email,
          password: validatedData.password,
          type: validatedData.type || 'email',
        },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Logged in successfully' });
          },
          onError: (error: Error) => {
            toast({
              title: 'Error',
              description: error.message || 'Invalid credentials',
              variant: 'destructive',
            });
          },
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    }
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
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger id="role" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_member">Team Member</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
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
            <Button type="submit" className="w-full mt-4" size="lg" disabled={isPending}>
              {isPending ? 'Signing In...' : 'Sign In'}
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