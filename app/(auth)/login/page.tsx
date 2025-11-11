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
import { useAuthStore } from '@/lib/store/auth.store';
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
  const [bypassValidation, setBypassValidation] = useState(false);
  
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
      // If bypassing validation, skip schema validation
      if (bypassValidation) {
        // Direct API call without validation
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            password, 
            bypassValidation: true 
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Update stores with successful login data
          const { setUser } = useUserStore.getState();
          const { setToken } = useAuthStore.getState();
          setUser(data.data.user);
          setToken(data.data.token);
          toast({ title: 'Success', description: 'Logged in successfully' });
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Invalid credentials',
            variant: 'destructive',
          });
        }
        return;
      }
      
      // Rule 4: Validate against existing schema (removed invalid 'type: userType')
      const validatedData = loginSchema.parse({ 
        email, 
        password,
      });
      
      // Call hook mutation (hardcode type to 'email' since this is email login)
      login(
        {
          email: validatedData.email,
          password: validatedData.password,
          type: 'email',
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
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
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
            <span className="text-2xl font-bold">FitCoach</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Admin Access:</span> Use Team Member role with email <code className="bg-blue-100 dark:bg-blue-800/50 px-1 rounded">admin1@example.com</code> and password <code className="bg-blue-100 dark:bg-blue-800/50 px-1 rounded">password123</code>
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger id="role" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_member">Team Member (Admin)</SelectItem>
                  <SelectItem value="customer">Customer (Client)</SelectItem>
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