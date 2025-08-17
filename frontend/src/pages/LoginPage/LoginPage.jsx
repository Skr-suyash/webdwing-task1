import React from "react";
import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { toast, ToastContainer } from 'react-toastify';
import './LoginPage.css'; // Make sure this CSS file is present
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const url = "http://localhost:3000/auth/login";
            const response = await axios.post(url, {
                email: email,
                password: password,
            });

            if (response.data.token) {
                login(response.data.token);
                toast.success("Login successful!");
                setTimeout(() => {
                    navigate("/"); // Redirect after successful login
                }, 1000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error;
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Login error:", err);
            // alert(errorMessage);
        }
    };

    return (
        <div>
            <Navbar page="login" />
            <div className="auth-page-container">
                <ToastContainer />
                <div id="auth-container">
                    {/* {error && <p className="error-message">{error}</p>} */}
                    <div className="form-header">
                        <div className="icon-container">
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21 10.5h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2Zm-7.7 1.72A4.92 4.92 0 0 0 15 8.5a5 5 0 0 0-10 0a4.92 4.92 0 0 0 1.7 3.72A8 8 0 0 0 2 19.5a1 1 0 0 0 2 0a6 6 0 0 1 12 0a1 1 0 0 0 2 0a8 8 0 0 0-4.7-7.28ZM10 11.5a3 3 0 1 1 3-3a3 3 0 0 1-3 3Z" /></svg>
                        </div>
                        <h2>Sign In</h2>
                        <p>Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                id="login-email"
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
                                id="login-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Sign In
                        </button>
                    </form>
                    <div className="signup-link" style={{ marginTop: "1rem", textAlign: "center" }}>
                        <span className="signup-link-part">Don't have an account? </span>
                        <a href="/register" style={{ color: "#007bff", textDecoration: "underline" }}>Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;