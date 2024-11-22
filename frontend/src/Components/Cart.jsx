

import React from 'react'
import { useNavigate } from 'react-router-dom';

function Cart() {
    const navigate = useNavigate();
  return (
    <div className='flex flex-col gap-3'>
        <h1>Cart</h1>
      <p>You have no items in your cart.</p>
      <button
      className=' w-28 m-auto px-5 py-2 rounded-full'
       onClick={() => navigate('/')}
      >Back</button>

    </div>
  )
}

export default Cart