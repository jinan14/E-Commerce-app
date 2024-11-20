import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddProduct from './Components/AddProduct'
import Shop from './Components/Shop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </Router>
  );
}


export default App
