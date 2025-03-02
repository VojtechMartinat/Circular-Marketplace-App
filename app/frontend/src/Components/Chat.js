import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {createMessage, getChats, getMessages} from '../services/messageService';
import { getUser } from '../services/userService';
import {auth} from "../services/firebaseService";
import { useParams } from 'react-router-dom';
// ChatsPage Component for displaying all user chats
export const ChatsPage = () => {
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNames, setUserNames] = useState({});
    const navigate = useNavigate();

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

    if (!isLoggedIn) {
        navigate('/login');
    }
    useEffect(() => {
        const fetchChats = async () => {
            if (user) {
                try {
                    const uniqueChats = await getChats(user.uid);
                    setChats(uniqueChats.interactedUserIDs);
                } catch (error) {
                    console.error('Error loading chats:', error);
                }
            }
        };
        fetchChats();
    }, [user]);

    useEffect(() => {
        if (chats && chats.length > 0) {
            chats.forEach(async (chat) => {
                const response = await getUser(chat);
                if (response) {
                    setUserNames((prevUserNames) => ({ ...prevUserNames, [chat]: response.user.username }));
                }
            });
        }
    }, [chats]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Chats</h1>
            {Array.isArray(chats) && chats.length > 0 ? (
                chats.map((chat, index) => (
                    <div key={chat} className="mb-2">
                        <Link to={`/chat/${chat}`} className="block p-2 border rounded shadow hover:bg-gray-100">
                            Chat with {userNames[chat] || 'User'}
                        </Link>
                    </div>
                ))
            ) : (
                <p>No chats found.</p>
            )}
        </div>
    );
};


// ChatWindow Component for individual chat
export const ChatWindow = () => {
    const { receiverID } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const [chatUser, setChatUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

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

    if (!isLoggedIn) {
        navigate('/login');
    }

    useEffect(() => {
        if (receiverID) {
            getUser(receiverID).then((response) => {
                if (response) {
                    setChatUser(response.user);
                }
            });
        }
    }, [receiverID]);

    useEffect(() => {
        const fetchChat = async () => {
            if (user && receiverID) {
                try {
                    const chatMessages = await getMessages(user.uid, receiverID);
                    setMessages(chatMessages.messages);
                } catch (error) {
                    console.error('Error loading chat:', error);
                }
            }
        };
        fetchChat();
    }, [receiverID, user]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            await createMessage({
                senderID: user.uid,
                receiverID: receiverID,
                message: newMessage,
            });
            setMessages((prevMessages) => [...(prevMessages || []), { senderID: user.uid, message: newMessage, updatedAt: new Date() }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    return (
        <div className="chat-window">
            <div className="chat-container">
                <h2 className="chat-header">Chat with {chatUser?.username || 'User'}</h2>
                <div className="message-container">
                    {messages && messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.senderID === user.uid ? 'sent' : 'received'}`}
                            >
                                <div className="message-bubble">
                                    <p className="message-text">{(msg.senderID === user.uid ? 'sent: ' : 'received: ') + msg.message}</p>
                                    <span className="message-time">
                                        {new Date(msg.updatedAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-messages">No messages yet.</p>
                    )}
                </div>
            </div>
            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button onClick={handleSend} className="send-button">
                    Send
                </button>
            </div>
        </div>
    );
};