'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/hooks/common/use-toast';
import { useForgotPassword } from '@/lib/hooks/api/useAuth';
import { forgotPasswordSchema } from '@/lib/schemas/auth/auth.schema';
import { z } from 'zod';

/**
 * ForgotPasswordPage Component
 * Follows Architecture Rules:
 * - Rule 1: Component calls hook (useForgotPassword) only, not services directly
 * - Rule 4: Uses Zod schema for validation
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  
  // Rule 1: Component calls hook
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Rule 4: Validate against existing schema
      const validatedData = forgotPasswordSchema.parse({ email });
      
      forgotPassword(validatedData, {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Password reset link sent! Check your email.',
          });
          router.push('/login');
        },
        onError: (error: Error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to send reset link',
            variant: 'destructive',
          });
        },
      });
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
          <CardTitle className="text-2xl font-bold">Forgot your password?</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
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
            <Button className="w-full" size="lg" type="submit" disabled={isPending}>
              {isPending ? 'Sending...' : 'Submit'}
            </Button>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}