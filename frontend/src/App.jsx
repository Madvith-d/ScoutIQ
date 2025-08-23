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

function App() {
  const [count, setCount] = useState(0)
  const [authUser, setAuthUser] = useState(null)
  const getAuthUser = async () => {
    const user = await axios.get("http://localhost:3000/api/auth/verify", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    console.log(user)
    setAuthUser(user)
  }
  useEffect(() => {
    getAuthUser()
  }, [])
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
