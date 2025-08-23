import React, { useState } from 'react'
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from '../components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Temporarily bypassing email verification check
      // Comment this back in when your Firebase email is working
      /*if (!user.emailVerified) {
        toast.error('Please verify your email before logging in')
        setLoading(false)
        return
      }*/
      
      // For testing: Show a toast about verification status
      if (!user.emailVerified) {
        toast.warning('Email not verified, but allowing login for testing')
      }
      
      // Login successful
      toast.success('Login successful')
      localStorage.setItem('token', await user.getIdToken())
      setLoading(false)
      navigate('/home')
    } catch (error) {
      setLoading(false)
      
      // Handle specific error codes
      if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed login attempts. Please try again later')
      } else {
        toast.error(error.message)
      }
    }
  }

  return (
    <div className='min-h-screen w-full bg-background flex items-center justify-center p-4'>
      <ToastContainer position="top-right" autoClose={3000} />
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login to your account</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='grid gap-4' onSubmit={handleLogin}>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input 
                type='email' 
                id='email' 
                placeholder='john@example.com' 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input 
                type='password' 
                id='password' 
                placeholder='••••••••' 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <Button 
              type='submit' 
              className='w-full mt-2'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground text-center'>
            Don't have an account? <a href='/signup' className='text-primary underline-offset-4 hover:underline'>Sign up</a>
          </p>
          <p className='text-sm text-muted-foreground text-center'>
            <a href='/forgot-password' className='text-primary underline-offset-4 hover:underline'>Forgot password?</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage