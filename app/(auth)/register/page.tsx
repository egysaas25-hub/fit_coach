'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { registerSchema } from "@/lib/schemas/auth/auth.schema";
import { useRegister } from "@/lib/hooks/api/useAuth";
import { z } from 'zod';
import { RegisterDto } from '@/types/api/request/auth.dto';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * RegisterPage Component
 * Follows Architecture Rules:
 * - Rule 1: Component calls hook (useRegister) only, not services directly
 * - Rule 4: Uses Zod schema for validation
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState<Partial<RegisterDto>>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
  });
  
  // Rule 1: Component calls hook
  const { mutate: register, isPending } = useRegister();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Rule 4: Validate against existing schema
      const validatedData = registerSchema.parse(formData);
      const { confirmPassword, ...registerData } = validatedData;
      
      register(
        {
          ...registerData,
          role: formData.role,
        } as RegisterDto,
        {
          onSuccess: () => {
            toast({ 
              title: 'Success', 
              description: 'Registration successful! Redirecting...' 
            });
            router.push('/admin/dashboard');
          },
          onError: (error: Error) => {
            toast({
              title: 'Error',
              description: error.message || 'Registration failed',
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
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold">FitCoach Pro</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join FitCoach Pro and start today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger id="role" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="John Doe" 
                className="bg-background"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="coach@example.com" 
                className="bg-background"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone"
                type="tel" 
                placeholder="+1 (555) 000-0000" 
                className="bg-background"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="Create a strong password" 
                className="bg-background"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                className="bg-background"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button className="w-full" size="lg" type="submit" disabled={isPending}>
              {isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}