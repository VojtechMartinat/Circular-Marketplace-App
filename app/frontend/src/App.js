import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import ArticleDetails from './Components/ArticleDetails';
import NotFound from './Components/NotFound';
import NavBarDefault from './Components/NavBarDefault';
import Account from './Components/Account';
import CreateArticlePage from './Components/CreateArticlePage';
import Profile from "./Components/Profile"; // Import the new CreateArticlePage component

const App = () => {
    return (
        <Router>
            <NavBarDefault />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/articles/:id" element={<ArticleDetails />} />
                <Route path="/account" element={<Account />} />
                <Route path="/create-article" element={<CreateArticlePage />} /> {/* New route for creating articles */}
                <Route path="/profile/:id" element={<Profile/>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
