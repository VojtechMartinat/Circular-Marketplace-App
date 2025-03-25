import React, { useState, useEffect, useRef } from 'react';
import { getChats, getMessages, createMessage } from '../services/messageService';
import { getUser } from '../services/userService';
import { auth } from "../services/firebaseService";
import { useNavigate } from 'react-router-dom';
import './chat.css';
import { useParams } from 'react-router-dom';

export const ChatsPage = () => {
    const {receiverID} = useParams();
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
   



    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsLoggedIn(true);
                console.log('this is the useruid:', user.uid)
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
                    setChats(uniqueChats.interactedUserIDs);
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
        navigate(`/chats/${chatID}`)
        setSelectedChat(chatID);
        try {
            const chatMessages = await getMessages(user.uid, chatID);
            console.log('this is the useruid', user.uid)
            setMessages(chatMessages.messages);
            const response = await getUser(chatID);
            if (response) {
                setChatUser(response.user);
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    };

    useEffect(() =>{
        if (receiverID){
            console.log("ReceiverID from URL:", receiverID);
            getUser(receiverID).then((response) => {
                console.log('this is the response.user.uid', response.user.userID)
                if (response) {
                    openChat(response.user.userID)
                } else {
                    console.error("User not found")
                }
            });
        }
    }, [receiverID])


    const handleSend = async () => {
        if (!newMessage.trim()) return;
        const timestamp = new Date().toISOString();
        try {
            await createMessage({
                senderID: user.uid,
                receiverID: selectedChat,
                message: newMessage,
                timestamp
            });
            setMessages([...messages, { senderID: user.uid, message: newMessage, updatedAt: new Date(), timestamp }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
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
                        <div className="chat-header">{chatUser?.username || 'User'}</div>
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.senderID === user.uid ? 'sent' : 'received'}`}>
                                    <div className="message-bubble">
                                        {msg.message}
                                    </div>
                                    <div className='message-timestamp'>
                                            {new Date(msg.timestamp).toLocaleString([],{ hour: '2-digit', minute: '2-digit'})}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
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


