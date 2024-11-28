import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './Components/Hero';
import AddProduct from './Components/AddProduct'
import Shop from './Components/Shop';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import ProductDetails from './ProductDetails';
import Cart from './Components/Cart';
import Order from './Components/Order';
import Header from './Components/Header';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element ={<Hero />} />
        <Route path='/header' element ={<Header />} />
        <Route path="/shop" element={<Shop />} />
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
