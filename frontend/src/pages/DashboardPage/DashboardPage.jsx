import React, { use, useEffect, useState } from 'react'
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import axios from 'axios';
import { useAuth } from '../../auth/AuthProvider';
import Navbar from '../../components/Navbar/Navbar';
import { redirect, useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

function DashboardPage() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [error, setError] = useState(null);

    const fetchBookmarks = async () => {
        try {
            const url = `${apiUrl}/user/${user.id}/bookmarks`;
            
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            console.log(response);
            
            if (response.status == 200) {
                setBookmarks(response.data);
            }
            else {
                console.log(response);
                // setError(response.data.error.error);
            }
        } catch (err) {
            setError(err);
            console.error('Error fetching bookmarks:', err);
        }
    }
    useEffect(() => {
        console.log(user);
        
        if (user) {
            fetchBookmarks();
            setError(null);
        }
        else {
            setError('User not authenticated');
        }
    }, [user]);
    

    return (
        <div>
            <Navbar page="dashboard" />
            <h1 className='home-hero'>Bookmarks</h1>
            <div className='bookmarks-container' style={{ padding: '20px' }}>
                {error && <p className="error">{error}</p>}
            {bookmarks.length == 0 ? (
                <p>No bookmarks found.</p>
            )
                : (
                    <div className="bookmarks-list">
                        {bookmarks.map((bookmark) => (
                            <QuestionCard key={bookmark.id} question={bookmark} showBookmark={false} />
                        ))}
                    </div>
                )
            }
            </div>
        </div>
    )
}

export default DashboardPage;