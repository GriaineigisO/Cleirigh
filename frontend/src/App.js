import React, { useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './Components/navbar.js';
import Welcome from './Pages/welcome.js';
import Login from './Pages/login.js';
import Register from './Pages/register.js';
import Account from './Pages/account.js';
import Success from './Pages/success.js';
import Cancel from './Pages/cancel.js';
import {Home} from './Pages/home.js';
import Search from './Pages/search.js';
import FamilyTree from './Pages/familytree.js';
import Queries from './Pages/queries.js';
import NewTree from './Pages/newTree.js';
import Profile from './Pages/profile.js';
import Topics from './Pages/topics.js';
import Topic from './Pages/topic.js';
import FamilyMigrationMap from './Pages/migrationMap.js';





function App() {

  //check login state from local storage
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  //check localstorage for user on page load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/familytree/:pageNum" element={<FamilyTree />} />
          <Route path="/queries" element={<Queries />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:id" element={<Account />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/newTree" element={<NewTree />}></Route>
          <Route path="/topics" element={<Topics />}></Route>
          <Route path="/topic/:topic" element={<Topic />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="/migrationmap" element={<FamilyMigrationMap />} />
        </Routes>
      </div>
    </Router>
  )
};

export default App;
