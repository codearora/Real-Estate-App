import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/users/login', formData);
            const { userId, role } = res.data;
            localStorage.setItem('userId', userId);
            if (role === 'seller') {
                navigate('/seller-dashboard');
            } else {
                // Navigate to another page for buyers if needed
                navigate('/buyer');
            }
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <button className="login-button" type="submit">Login</button>
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Login;
