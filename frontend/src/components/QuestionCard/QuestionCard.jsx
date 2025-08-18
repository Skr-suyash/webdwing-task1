import React from 'react';
import './QuestionCard.css';
import { useAuth } from '../../auth/AuthProvider';
import bookmarkLogo from '../../assets/bookmark.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

async function postBookmark(userId, questionId) {
    const url = `http://localhost:3000/user/${userId}/bookmarks`;
    const response = await axios.post(url, {
        questionId: questionId,
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    });
    console.log(response);
    if (response.status === 200) {
        toast.success('Bookmark added successfully!');
    } else {
        toast.error('Failed to add bookmark.');
    }
}

function QuestionCard({ question, showBookmark = true }) {
    const { user } = useAuth();
    return (
        <div className="question-card">
            <ToastContainer />
            <div className="question-info">            
                <h2 className="question-title">{question.title}</h2>
                <p className="question-difficulty">
                    <span className="label">Difficulty:</span>{" "}
                    <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
                        {question.difficulty}
                    </span>
                </p>
            </div>
            <a
                href={question.url}
                target="_blank"
                rel="noopener noreferrer"
                className="question-link"
            >
                View Question
            </a>
            {user && showBookmark && (
                <button
                    className="bookmark-button"
                    onClick={() => {
                        postBookmark(user.id, question._id);
                    }}
                >
                    <img className="bookmark-icon" src={bookmarkLogo} />
                </button>
            )}
        </div>
    );
}

export default QuestionCard;
