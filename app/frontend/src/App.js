import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import ArticleDetails from './Components/ArticleDetails';
import NotFound from './Components/NotFound';
import NavBarDefault from './Components/NavBarDefault';
import CreateArticlePage from './Components/CreateArticlePage';
import Profile from "./Components/Profile";
import {AuthProvider} from "./Contexts/AuthContext";
import Login from './Components/Login';
import Register from "./Components/Register";
import Logout from "./Components/Logout";
import {ChatsPage, ChatWindow} from "./Components/Chat";
import Background from './Components/Background'; 



const App = () => {
    return (
        <AuthProvider>
        <Router>

            <NavBarDefault />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/articles/:id" element={<ArticleDetails />} />
                <Route path="/create-article" element={<CreateArticlePage />} /> {}
                <Route path="/profile/:id" element={<Profile/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/chats" element={<ChatsPage />} />
                <Route path="/chat/:receiverID" element={<ChatWindow />} />
                <Route path="/Background" element={<Background />} />

            </Routes>

        </Router>
        </AuthProvider>
    );
};

export default App;

