import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ApiResponse } from "@/types/shared/response"
import { registerSchema } from "@/lib/schemas/auth/auth.schema"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/hooks/api/useAuth"
import { useState } from "react"

export default function RegisterPage() {
  const [formData, setFormData] = useState<Partial<RegisterRequest>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'trainer', // Fixed to 'trainer' as per page context
  });
  const { mutate: register, isLoading } = useAuth('register'); // Assuming useAuth supports register
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Rule 4: Validate against existing schema, ensuring confirmPassword is checked
      const validatedData = registerSchema.parse({
        ...formData,
        role: 'trainer', // Enforce trainer role
      });
      register(
        validatedData as RegisterRequest, // Rule 2: Cast to existing request type
        {
          onSuccess: (data: ApiResponse) => {
            toast({ title: 'Success', description: 'Registration successful! Redirecting...' });
            router.push('/trainer/dashboard'); // Redirect to trainer dashboard
          },
          onError: (error: any) => {
            toast({
              title: 'Error',
              description: error.message || 'Registration failed',
              variant: 'destructive',
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: 'Validation Error',
        description: (error as Error).message || 'Please check your input',
        variant: 'destructive',
      });
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
          <CardTitle className="text-2xl font-bold">Create Your Trainer Account</CardTitle>
          <CardDescription>Join FitCoach Pro and start coaching today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" className="bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="coach@example.com" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a strong password" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              className="bg-background"
            />
          </div>
          <Button className="w-full" size="lg">
            Create Account
          </Button>
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
