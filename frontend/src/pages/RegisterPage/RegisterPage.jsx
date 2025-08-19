import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import '../LoginPage/LoginPage.css';
import Navbar from '../../components/Navbar/Navbar';

const apiUrl = import.meta.env.VITE_API_URL;

function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const url = `${apiUrl}/auth/register`;
        const formData = {
            name: name,
            email: email,
            password: password,
        };

        try {
            const response = await axios.post(url, formData);
            if (response.status === 201 || response.status === 200) {
                toast.success('Registration successful!');
                setTimeout(() => { 
                    navigate('/login');
                }, 1000);
            }
        } catch (err) {
            const errorMessage = err.response.data.error;
            setError(errorMessage);
            console.error('Error during registration:', err);
            toast.error(errorMessage);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="auth-page-container">
            <ToastContainer />
            <div id="auth-container">
                <div className="form-header">
                    <div className="icon-container">
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21 10.5h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2Zm-7.7 1.72A4.92 4.92 0 0 0 15 8.5a5 5 0 0 0-10 0a4.92 4.92 0 0 0 1.7 3.72A8 8 0 0 0 2 19.5a1 1 0 0 0 2 0a6 6 0 0 1 12 0a1 1 0 0 0 2 0a8 8 0 0 0-4.7-7.28ZM10 11.5a3 3 0 1 1 3-3a3 3 0 0 1-3 3Z" /></svg>
                    </div>
                    <h2>Create Account</h2>
                    <p>Fill in your details to get started</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            id="register-name"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            id="register-email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            id="register-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="6"
                            required
                        />
                    </div>

                    {/* {error && <p className="error-message">{error}</p>} */}
                    
                    <button type="submit" className="btn btn-primary">
                        Create Account
                    </button>
                </form>

                <p className="signup-link" style={{ marginTop: '1.5rem' }}>
                    <span className='signup-link-part'>Already have an account?</span>
                    <a href="#" className="form-link" onClick={() => navigate('/login')} style={{ marginLeft: '0.5rem' }}>
                        Log In
                    </a>
                </p>
            </div>
        </div>
        </div>
    );
}

export default RegisterPage;