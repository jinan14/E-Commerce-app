import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddProduct from './Components/AddProduct'
import Shop from './Components/Shop';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import ProductDetails from './ProductDetails';
import Cart from './Components/Cart';
import Order from './Components/Order';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path='/Order' element={<Order />} />
      </Routes>
    </Router>
  );
}


export default App
