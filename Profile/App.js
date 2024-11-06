// App.js
import React from 'react';
import Profile from './Profile';
import ItemList from './ItemList';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Profile name="Mike" rating="3" />
      <ItemList items={[
        { title: "Title", price: "Free" },
        { title: "Title", price: "£65" },
        { title: "Title", price: "£30" },
        { title: "Title", price: "" },
      ]} />
    </div>
  );
}

export default App;
