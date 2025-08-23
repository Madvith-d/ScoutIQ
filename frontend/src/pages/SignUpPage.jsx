import React from 'react'
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from '../components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
const SignUpPage = () => {
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
              <Input type='text' id='name' placeholder='John Doe' required />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input type='email' id='email' placeholder='john@example.com' required />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input type='password' id='password' placeholder='••••••••' required />
            </div>
            <Button type='submit' className='w-full mt-2'>Sign Up</Button>
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