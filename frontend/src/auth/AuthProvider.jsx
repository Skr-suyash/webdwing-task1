import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const apiUrl = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile(token);
        }
        
    }, []);

    // if token valid fetch user profile for global context
    const fetchUserProfile = (async (token) => {
        try {
            const response = await axios.get(`${apiUrl}/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // constantly keep checking if the jwt has not expired
            if (response.status == 200) {
                const userData = response.data;
                setUser(userData);
            } else if (response.status == 401) {
                console.log('Unauthorized access');
                logout();
            } else {
                console.error('Failed to fetch user profile');
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    });

    const login = (token) => {
        localStorage.setItem('token', token);
        fetchUserProfile(token);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    }

    return (
        // store global auth context
        <AuthContext.Provider value={{user, login, logout}}>
            {children} 
        </AuthContext.Provider>
    );
}

export const useAuth = () => { return useContext(AuthContext); }