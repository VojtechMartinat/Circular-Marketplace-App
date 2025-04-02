import React, { useState, useEffect, useRef } from 'react';
import { getChats, getMessages, createMessage } from '../services/messageService';
import { getUser, getUserReviews } from '../services/userService';
import { auth } from "../services/firebaseService";
import { useNavigate, useParams } from 'react-router-dom';
import './chat.css';
import { RxAvatar } from "react-icons/rx";

export const ChatsPage = () => {
    const { receiverID } = useParams();
    const [chats, setChats] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [selectedChat, setSelectedChat] = useState(receiverID || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const [chatUser, setChatUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const [reviews, setReviews] = useState(null);
    const [showReviews, setShowReviews] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const fetchChats = async () => {
            if (user) {
                try {
                    const uniqueChats = await getChats(user.uid);
                    setChats(uniqueChats?.interactedUserIDs || []);
                } catch (error) {
                    console.error('Error loading chats:', error);
                }
            }
        };
        fetchChats();
    }, [user]);

    useEffect(() => {
        if (chats.length > 0) {
            chats.forEach(async (chat) => {
                const response = await getUser(chat);
                if (response) {
                    setUserNames(prev => ({ ...prev, [chat]: response.user.username }));
                }
            });
        }
    }, [chats]);

    const openChat = async (chatID) => {
        if (!user) return;

        navigate(`/chats/${chatID}`);
        setSelectedChat(chatID);
        setChatUser({ username: "Loading..." });

        try {
            const chatMessages = await getMessages(user.uid, chatID);
            setMessages(chatMessages.messages || []);

            const response = await getUser(chatID);
            if (response && response.user) {
                setChatUser(response.user);
                setChats(prevChats => (prevChats.includes(chatID) ? prevChats : [...prevChats, chatID]));
                setUserNames(prev => ({ ...prev, [chatID]: response.user.username }));
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    };

    useEffect(() => {
        if (receiverID && user) {
            getUser(receiverID).then((response) => {
                if (response) {
                    setSelectedChat(response.user.userID);
                    openChat(response.user.userID);
                } else {
                    console.error("User not found");
                }
            });
        }
    }, [receiverID, user]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        try {
            await createMessage({
                senderID: user.uid,
                receiverID: selectedChat,
                message: newMessage,
            });

            setMessages(prev => [...prev, { senderID: user.uid, message: newMessage, updatedAt: new Date() }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleShowReviews = () => {
        if (chatUser?.userID) {
            getUserReviews(chatUser.userID)
                .then((response) => {
                    if (response) {
                        setReviews(response.reviews || []);
                        setShowReviews(true);
                    }
                })
                .catch((error) => console.error("Error fetching reviews:", error));
        }
    };

    const ReviewModal = ({ onClose }) => (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal-content">
                <h2>Reviews for {chatUser?.username}</h2>
                <ul className="review-list">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <li key={index}>
                                <span><strong>{review.username}</strong>: {review.comment}</span>
                                <StarRating rating={review.rating} />
                            </li>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </ul>
                <button onClick={onClose} className="close-modal">Close</button>
            </div>
        </div>
    );

    const StarRating = ({ rating, totalStars = 5 }) => (
        <div style={{ display: "flex", gap: "2px" }}>
            {Array.from({ length: totalStars }, (_, index) => {
                const fillPercentage = Math.max(0, Math.min(1, rating - index)); // 1 for full, 0.5 for half, etc.
                return (
                    <span key={index} style={{ position: "relative", fontSize: "20px" }}>
                        <span style={{ color: "gray" }}>★</span> {/* Background star */}
                        <span
                            style={{
                                color: "gold",
                                position: "absolute",
                                left: 0,
                                width: `${fillPercentage * 100}%`, // Dynamic width
                                overflow: "hidden",
                                display: "inline-block",
                            }}
                        >
                            ★
                        </span>
                    </span>
                );
            })}
        </div>
    );

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h1 className="sidebar-header">Chats</h1>
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <div key={chat} onClick={() => openChat(chat)} className="chat-item">
                            {userNames[chat] || 'User'}
                        </div>
                    ))
                ) : (
                    <p>No chats found.</p>
                )}
            </div>

            <div className="chat-window">
                {selectedChat ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-user-info" onClick={handleShowReviews}>
                                <RxAvatar size={40} className="chat-avatar" />
                                <span className="chat-username">{chatUser?.username || 'User'}</span>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.senderID === user.uid ? 'sent' : 'received'}`}>
                                        <div className="message-bubble">{msg.message}</div>
                                        <div className="message-timestamp">
                                            {new Date(msg.updatedAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No messages yet.</div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {showReviews && <ReviewModal onClose={() => setShowReviews(false)} />}

                        <div className="chat-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button onClick={handleSend}>Send</button>
                        </div>
                    </>
                ) : (
                    <div className="chat-placeholder">Select a chat to start messaging</div>
                )}
            </div>
        </div>
    );
};
