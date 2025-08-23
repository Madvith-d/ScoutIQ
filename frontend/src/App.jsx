import { useState } from 'react'
import SignUpPage from './pages/SignUpPage'



function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='min-h-screen w-full dark flex flex-col justify-center items-center bg-gray-50'>
      <SignUpPage className='min-h-full w-full dark flex flex-col justify-center items-center bg-gray-50'/>
    </div>
   
   
  )
}

export default App
