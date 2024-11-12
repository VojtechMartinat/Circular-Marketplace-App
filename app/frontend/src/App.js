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


const App = () => {
    return (
        <AuthProvider>
        <Router>

            <NavBarDefault />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/articles/:id" element={<ArticleDetails />} />
                <Route path="/account" element={<Account />} />
                <Route path="/profile/:id/new-article" element={<CreateArticlePage />} /> {}
                <Route path="/profile/:id" element={<Profile/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

        </Router>
        </AuthProvider>
    );
};

export default App;
