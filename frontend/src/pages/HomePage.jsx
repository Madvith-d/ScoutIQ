import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

const HomePage = () => {
  const navigate = useNavigate()
  const user = auth.currentUser

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      // Navigation will be handled automatically by the auth state listener
    } catch (error) {
      toast.error('Error logging out: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen w-full bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to ScoutIQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">User Information</h3>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.uid}</p>
              <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage