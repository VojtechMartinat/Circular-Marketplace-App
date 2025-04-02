import React, { useState, useEffect, useRef } from 'react';
import { getChats, getMessages, createMessage } from '../services/messageService';
import {getUser, getUserArticles, getUserRating, getUserReviews} from '../services/userService';
import { auth } from "../services/firebaseService";
import { useNavigate } from 'react-router-dom';
import './chat.css';
import React, { useState, useEffect, useRef } from 'react';
import { getChats, getMessages, createMessage } from '../services/messageService';
import {getUser, getUserArticles, getUserRating, getUserReviews} from '../services/userService';
import { auth } from "../services/firebaseService";
import { useNavigate } from 'react-router-dom';
import './chat.css';
import { useParams } from 'react-router-dom';
import { RxAvatar } from "react-icons/rx";


import { RxAvatar } from "react-icons/rx";


export const ChatsPage = () => {
    const {receiverID} = useParams();
    const {receiverID} = useParams();
    const [chats, setChats] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [selectedChat, setSelectedChat] = useState(receiverID || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userNames, setUserNames] = useState({});
    const [selectedChat, setSelectedChat] = useState(receiverID || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const [chatUser, setChatUser] = useState(null);
    const [chatUser, setChatUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const [articleUser, setArticleUser] = useState(null);
    const [rating, setRating] = useState(null);
    const [reviewAmount, setReviewAmount] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [showReviews, setShowReviews] = useState(false);
    const [reviewUser, setReviewUser] = useState(null);
   


    const messagesEndRef = useRef(null);
    const [articleUser, setArticleUser] = useState(null);
    const [rating, setRating] = useState(null);
    const [reviewAmount, setReviewAmount] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [showReviews, setShowReviews] = useState(false);
    const [reviewUser, setReviewUser] = useState(null);
   



    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsLoggedIn(true);
                console.log('this is the useruids:', currentUser.uid)
                console.log('this is the useruids:', currentUser.uid)
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
                    if (uniqueChats && uniqueChats.interactedUserIDs) {
                        setChats(uniqueChats.interactedUserIDs);
                    } else {
                        setChats([]); 
                    }
                    
                    console.log("this is chats", uniqueChats)
                    if (uniqueChats && uniqueChats.interactedUserIDs) {
                        setChats(uniqueChats.interactedUserIDs);
                    } else {
                        setChats([]); 
                    }
                    
                    console.log("this is chats", uniqueChats)
                } catch (error) {
                    console.error('Error loading chats:', error);
                }
            }
        };
        fetchChats();
    }, [user]);

    useEffect(() => {
        if (chats.length > 0) {
        if (chats.length > 0) {
            chats.forEach(async (chat) => {
                const response = await getUser(chat);
                if (response) {
                    setUserNames(prev => ({ ...prev, [chat]: response.user.username }));
                    setUserNames(prev => ({ ...prev, [chat]: response.user.username }));
                }
            });
        }
    }, [chats]);

    const openChat = async (chatID) => {
        if (!user) {
            console.error("User is not set yet");
            return;
        }
        navigate(`/chats/${chatID}`);
        setSelectedChat(chatID);
        setChatUser({username: "Loading..."});
        try {
            const chatMessages = await getMessages(user.uid, chatID);
            setMessages(chatMessages.messages || []);
            const response = await getUser(chatID);
            if (response && response.user) {
                setChatUser(response.user);

                setChats(prevChats => {
                    if (!prevChats.includes(chatID)){
                        return [...prevChats, chatID];
                    }
                    return prevChats;
                });

                setUserNames(prevUserNames => ({...prevUserNames,[chatID]: response.user.username}));
    const openChat = async (chatID) => {
        if (!user) {
            console.error("User is not set yet");
            return;
        }
        navigate(`/chats/${chatID}`);
        setSelectedChat(chatID);
        setChatUser({username: "Loading..."});
        try {
            const chatMessages = await getMessages(user.uid, chatID);
            setMessages(chatMessages.messages || []);
            const response = await getUser(chatID);
            if (response && response.user) {
                setChatUser(response.user);

                setChats(prevChats => {
                    if (!prevChats.includes(chatID)){
                        return [...prevChats, chatID];
                    }
                    return prevChats;
                });

                setUserNames(prevUserNames => ({...prevUserNames,[chatID]: response.user.username}));
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    };
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    };

    useEffect(() =>{
        if (receiverID && user){
            console.log("ReceiverID from URL:", receiverID);
    useEffect(() =>{
        if (receiverID && user){
            console.log("ReceiverID from URL:", receiverID);
            getUser(receiverID).then((response) => {
                if (response) {
                    setSelectedChat(response.user.userID)
                    openChat(response.user.userID)
                } else {
                    console.error("User not found")
                    setSelectedChat(response.user.userID)
                    openChat(response.user.userID)
                } else {
                    console.error("User not found")
                }
            });
        }
    }, [receiverID, user])

    }, [receiverID, user])


    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            await createMessage({
                senderID: user.uid,
                receiverID: selectedChat,
                receiverID: selectedChat,
                message: newMessage,
            });
            setMessages(prevMessages => [
                ...prevMessages,
                { senderID: user.uid, message: newMessage, updatedAt: new Date() }
            ]);
                setNewMessage('');
            setMessages(prevMessages => [
                ...prevMessages,
                { senderID: user.uid, message: newMessage, updatedAt: new Date() }
            ]);
                setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleShowReviews = () => {
        if (chatUser?.userID) {
            getUserReviews(chatUser.userID)
                .then((response) => {
                    console.log("this is reviews", response)
                    if (response) {
                        setReviews(response.reviews || []);
                        setShowReviews(true);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching reviews:", error);
                });
        }
    };

    const ReviewModal = ({onClose}) => {
        return (
            <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal-content">
                <h2>Reviews for {articleUser?.username}</h2>
                <div className="reviews">
                    <ul className="review-list">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <li key={index}>
                                    <span><strong>{reviewUser?.username}</strong>: {review.comment}</span>
                                    <div className="star-rating-container">
                                        <StarRating rating={review.rating}/>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </ul>
                </div>

                <button onClick={onClose} className="close-modal">Close</button>
            </div>
            </div>
        );
    };

    const StarRating = ({ rating, totalStars = 5 }) => {
        return (
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
                        </span> {/* Foreground star (partially filled) */}
                    </span>
                    );
                })}
            </div>
        );
    };

    
    

    

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

    const handleShowReviews = () => {
        if (chatUser?.userID) {
            getUserReviews(chatUser.userID)
                .then((response) => {
                    console.log("this is reviews", response)
                    if (response) {
                        setReviews(response.reviews || []);
                        setShowReviews(true);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching reviews:", error);
                });
        }
    };

    const ReviewModal = ({onClose}) => {
        return (
            <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal-content">
                <h2>Reviews for {articleUser?.username}</h2>
                <div className="reviews">
                    <ul className="review-list">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <li key={index}>
                                    <span><strong>{reviewUser?.username}</strong>: {review.comment}</span>
                                    <div className="star-rating-container">
                                        <StarRating rating={review.rating}/>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </ul>
                </div>

                <button onClick={onClose} className="close-modal">Close</button>
            </div>
            </div>
        );
    };

    const StarRating = ({ rating, totalStars = 5 }) => {
        return (
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
                        </span> {/* Foreground star (partially filled) */}
                    </span>
                    );
                })}
            </div>
        );
    };

    
    

    

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
                            {messages?.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.senderID === user.uid ? 'sent' : 'received'}`}>
                                        <div className="message-bubble">{msg.message}</div>
                                        <div className="message-timestamp">
                                            {new Date(msg.updatedAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No messages yet</p>
                            )}
                            <div ref={messagesEndRef} />
                            {showReviews && <ReviewModal onClose={() => setShowReviews(false)} />}

                        </div>

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





