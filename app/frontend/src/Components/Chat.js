import React, { useState, useEffect, useRef } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {createMessage, getChats, getMessages} from '../services/messageService';
import { getUser } from '../services/userService';
import {auth} from "../services/firebaseService";
import { useParams } from 'react-router-dom';
import './chat.css'


export const ChatsPage = () => {
    const [chats, setChats] = useState([]);
    const [userNames, setUserNames] = useState({});
    const { receiverID } = useParams();
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

    ////////////////////////////////////

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, []);

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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            await createMessage({
                senderID: user.uid,
                receiverID: receiverID,
                message: newMessage,
            });
            setMessages([...messages, { senderID: user.uid, message: newMessage, updatedAt: new Date() }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className='chat-window'>
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
            <div className="chat">
                <div className="chat-header">{chatUser?.username || 'User'}</div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.senderID === user.uid ? 'sent' : 'received'}`}>
                            <div className="message-bubble">{msg.message}</div>
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
            </div>
        </div>
    );
};


// ChatWindow Component for individual chat
export const ChatWindow = () => {
    // const { receiverID } = useParams();
    // const [messages, setMessages] = useState([]);
    // const [newMessage, setNewMessage] = useState('');
    // const [user, setUser] = useState(null);
    // const [chatUser, setChatUser] = useState(null);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const navigate = useNavigate();
    // const messagesEndRef = useRef(null);

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    //         if (currentUser) {
    //             setUser(currentUser);
    //         } else {
    //             navigate('/login');
    //         }
    //     });
    //     return () => unsubscribe();
    // }, []);

    // useEffect(() => {
    //     if (receiverID) {
    //         getUser(receiverID).then((response) => {
    //             if (response) {
    //                 setChatUser(response.user);
    //             }
    //         });
    //     }
    // }, [receiverID]);

    // useEffect(() => {
    //     const fetchChat = async () => {
    //         if (user && receiverID) {
    //             try {
    //                 const chatMessages = await getMessages(user.uid, receiverID);
    //                 setMessages(chatMessages.messages);
    //             } catch (error) {
    //                 console.error('Error loading chat:', error);
    //             }
    //         }
    //     };
    //     fetchChat();
    // }, [receiverID, user]);

    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // }, [messages]);

    // const handleSend = async () => {
    //     if (!newMessage.trim()) return;
    //     try {
    //         await createMessage({
    //             senderID: user.uid,
    //             receiverID: receiverID,
    //             message: newMessage,
    //         });
    //         setMessages([...messages, { senderID: user.uid, message: newMessage, updatedAt: new Date() }]);
    //         setNewMessage('');
    //     } catch (error) {
    //         console.error('Error sending message:', error);
    //     }
    // };

    // return (
    //     <div className="chat-window">
    //         <div className="chat-header">{chatUser?.username || 'User'}</div>
    //         <div className="chat-messages">
    //             {messages.map((msg, index) => (
    //                 <div key={index} className={`message ${msg.senderID === user.uid ? 'sent' : 'received'}`}>
    //                     <div className="message-bubble">{msg.message}</div>
    //                 </div>
    //             ))}
    //             <div ref={messagesEndRef} />
    //         </div>
    //         <div className="chat-input">
    //             <input
    //                 type="text"
    //                 value={newMessage}
    //                 onChange={(e) => setNewMessage(e.target.value)}
    //                 placeholder="Type a message..."
    //             />
    //             <button onClick={handleSend}>Send</button>
    //         </div>
    //     </div>
    // );
};
