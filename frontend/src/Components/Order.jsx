

import React from 'react'
import { useNavigate } from 'react-router-dom';


function Order() {
    const navigate = useNavigate();
  return (
    <div>
        <h1>Your Order</h1>
        <p>Order details go here.</p>
        <button  onClick={() => navigate('/shop')}>Print Order</button>
  
    </div>
  )
}

export default Order