'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/hooks/common/use-toast";
import { registerSchema } from "@/lib/schemas/auth/auth.schema";
import { useRegister } from "@/lib/hooks/api/useAuth";
import { z } from 'zod';
import { RegisterDto } from '@/types/api/request/auth.dto';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

/**
 * RegisterPage Component
 * Follows Architecture Rules:
 * - Rule 1: Component calls hook (useRegister) only, not services directly
 * - Rule 4: Uses Zod schema for validation
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Rule 1: Component calls hook
  const { mutate: register, isPending } = useRegister();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    // Clear error for role field
    if (errors.role) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.role;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add explicit check to ensure form submission is being triggered
    console.log('Form submission triggered');
    setErrors({});
    
    // Log form data for debugging
    console.log('Form data being submitted:', formData);
    
    // Check if passwords match before sending to API
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords must match' });
      toast({
        title: 'Validation Error',
        description: 'Passwords must match',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Rule 4: Validate against existing schema
      const validatedData = registerSchema.parse(formData);
      console.log('Client-side validation passed:', validatedData);
      
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = validatedData;
      
      register(
        registerData as RegisterDto,
        {
          onSuccess: (data) => {
            toast({ 
              title: 'Success', 
              description: 'Registration successful! Redirecting...' 
            });
            
            // Redirect based on role
            const roleRedirects: Record<string, string> = {
              'admin': '/admin/dashboard',
              'trainer': '/trainer/dashboard',
              'client': '/client/dashboard',
            };
            
            const redirectPath = roleRedirects[formData.role] || '/client/dashboard';
            
            setTimeout(() => {
              router.push(redirectPath);
            }, 500);
          },
          onError: (error: any) => {
            console.error('Registration API error:', error);
            let errorMessage = 'Registration failed';
            
            // Handle different types of errors
            if (error.message) {
              errorMessage = error.message;
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (typeof error === 'string') {
              errorMessage = error;
            }
            
            // Handle validation errors from the API
            if (error.error?.details) {
              try {
                const details = Array.isArray(error.error.details) ? error.error.details : [error.error.details];
                details.forEach((detail: any) => {
                  if (detail.path && detail.path.length > 0) {
                    const field = detail.path[0];
                    setErrors((prev: any) => ({
                      ...prev,
                      [field]: detail.message
                    }));
                  }
                });
                
                // Show the first validation error in toast
                if (details.length > 0) {
                  errorMessage = details[0].message;
                }
              } catch (e) {
                console.error('Error parsing validation details:', e);
              }
            }
            
            toast({
              title: 'Error',
              description: errorMessage,
              variant: 'destructive',
            });
            
            // Check for specific field errors
            if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('email')) {
              setErrors({ email: errorMessage });
            }
          },
        }
      );
    } catch (error) {
      console.error('Validation error:', error);
      if (error instanceof z.ZodError) {
        // Convert Zod errors to field-specific errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        
        // Show first error in toast
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
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold">FitCoach Pro</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join FitCoach Pro and start today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
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
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="John Doe" 
                className={`bg-background ${errors.name ? 'border-destructive' : ''}`}
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="coach@example.com" 
                className={`bg-background ${errors.email ? 'border-destructive' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input 
                id="phone" 
                name="phone"
                type="tel" 
                placeholder="+1 (555) 000-0000" 
                className={`bg-background ${errors.phone ? 'border-destructive' : ''}`}
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="Create a strong password" 
                className={`bg-background ${errors.password ? 'border-destructive' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                className={`bg-background ${errors.confirmPassword ? 'border-destructive' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
            
            <Button 
              className="w-full" 
              size="lg" 
              type="submit" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
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