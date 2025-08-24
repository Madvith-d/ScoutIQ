import { useState } from 'react'
import SignUpPage from './pages/SignUpPage'
import axios from 'axios'
import { useEffect } from 'react'
import { Router, Route, Routes } from 'react-router'
import { Navigate } from 'react-router'
import Landing from './pages/LandingPage'
import Login from './pages/LoginPage'
import Signup from './pages/SignUpPage'
import Home from './pages/HomePage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

function App() {
  const [count, setCount] = useState(0)
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use Firebase's built-in auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 dark ">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/home" replace />} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/home" replace />} />
        <Route path="/home" element={authUser ? <Home /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
