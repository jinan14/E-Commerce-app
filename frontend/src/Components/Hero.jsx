

import React from 'react'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col gap-8 justify-center items-center h-[90vh]'>
      <h1 className="text-4xl font-bold text-center">Welcome to our Shop</h1>
      <div className='flex gap-3 '>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signUp')}
          className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
        >
          SignUp
        </button>
      </div>
    </div>
  )
}

export default Hero