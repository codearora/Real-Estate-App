// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import SellerDashboard from './components/SellerDashboard';
import PropertyDetails from './components/PropertyDetails';

axios.defaults.baseURL = 'http://localhost:5000/api';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
    </Routes>
  </Router>
);

export default App;
