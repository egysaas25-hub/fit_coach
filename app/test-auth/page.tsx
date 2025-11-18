"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function TestAuthPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testLogin = async (phone: string) => {
    setLoading(true)
    try {
      // Step 1: Request OTP
      const otpResponse = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      if (!otpResponse.ok) {
        throw new Error('Failed to request OTP')
      }

      toast.success(`OTP sent to ${phone} - Check console for the code`)
      
      // Step 2: Simulate OTP verification with a test code
      setTimeout(async () => {
        try {
          const verifyResponse = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, code: '123456' }) // Test code
          })
          
          const data = await verifyResponse.json()
          
          if (verifyResponse.ok) {
            setResult(data)
            toast.success('Login successful!')
          } else {
            toast.error(data.error || 'Login failed')
          }
        } catch (error) {
          toast.error('Verification failed')
        }
        setLoading(false)
      }, 2000)
      
    } catch (error) {
      toast.error('Request failed')
      setLoading(false)
    }
  }

  const testRegister = async () => {
    setLoading(true)
    const testPhone = '+201999888777'
    
    try {
      // Step 1: Request OTP
      const otpResponse = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhone })
      })
      
      if (!otpResponse.ok) {
        throw new Error('Failed to request OTP')
      }

      toast.success('OTP sent - Check console for the code')
      
      // Step 2: Register with OTP
      setTimeout(async () => {
        try {
          const registerResponse = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              phone: testPhone,
              code: '123456', // Test code
              name: 'Test User',
              email: 'test@example.com',
              workspaceName: 'Test Gym'
            })
          })
          
          const data = await registerResponse.json()
          
          if (registerResponse.ok) {
            setResult(data)
            toast.success('Registration successful!')
          } else {
            toast.error(data.error || 'Registration failed')
          }
        } catch (error) {
          toast.error('Registration failed')
        }
        setLoading(false)
      }, 2000)
      
    } catch (error) {
      toast.error('Request failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Test Login (Existing Users)</h3>
                <div className="space-y-2">
                  <Button 
                    onClick={() => testLogin('+201012345678')}
                    disabled={loading}
                    className="w-full"
                  >
                    Login as Admin (+201012345678)
                  </Button>
                  <Button 
                    onClick={() => testLogin('+201087654321')}
                    disabled={loading}
                    className="w-full"
                  >
                    Login as Trainer (+201087654321)
                  </Button>
                  <Button 
                    onClick={() => testLogin('+966501234567')}
                    disabled={loading}
                    className="w-full"
                  >
                    Login as Coach (+966501234567)
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Test Registration</h3>
                <Button 
                  onClick={testRegister}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  Register New User
                </Button>
              </div>
            </div>
            
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Processing...</p>
              </div>
            )}
            
            {result && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Click any login button to test existing users</li>
                <li>Check the browser console for the OTP code</li>
                <li>The system will automatically verify with code "123456"</li>
                <li>Test registration creates a new user with phone +201999888777</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}