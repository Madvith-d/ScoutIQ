import React from 'react'
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from '../components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createUserWithEmailAndPassword ,getAuth ,sendEmailVerification} from 'firebase/auth'
import { doc, setDoc ,serverTimestamp ,getFirestore } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useState } from 'react'
import { useNavigate } from 'react-router'
const SignUpPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // const auth = getAuth()
  // const db = getFirestore()
  const handleSignUp = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send verification email with custom settings
      await sendEmailVerification(user, {
        url: window.location.origin + '/login', // Redirect URL after verification
        handleCodeInApp: false
      });
      
      // No need to reload immediately after sending verification
      // await user.reload();

      await setDoc(doc(db,"users",user.uid),{
        name,
        email,
        password,
        isVerified: false,
        createdAt: serverTimestamp()
      })
      setError('')
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setLoading(false)
      alert('Account created successfully check your inbox')
      navigate('/login')
    } catch (error) {
      setError(error.message)
      setLoading(false)
      alert(error.message)
    }
  }

  return (
    <div className='min-h-screen w-full bg-background flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Create an account</CardTitle>
          <CardDescription>Enter your details to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Name</Label>
              <Input type='text' id='name' placeholder='John Doe' required onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input type='email' id='email' placeholder='john@example.com' required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input type='password' id='password' placeholder='••••••••' required onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input type='password' id='confirmPassword' placeholder='••••••••' required onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button type='submit' className='w-full mt-2' onClick={(e) => {
              if (password !== confirmPassword) {
                setError('Passwords do not match')
                return
              }
              setError('')
              handleSignUp(e)
            }}>Sign Up</Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground text-center'>
            Already have an account? <a href='/login' className='text-primary underline-offset-4 hover:underline'>Log in</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUpPage