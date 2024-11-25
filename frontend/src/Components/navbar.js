import React, { useState, useEffect } from 'react';
import '../style.css';
import { Link } from 'react-router-dom';
import logo from '../Images/crest.png';

const Navbar = ({onLogin, onLogout}) => {
    const [currentUser, setCurrentUser] = useState(localStorage.getItem('username'));

    const handleSignOut = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        sessionStorage.clear();
        onLogout && onLogout();
        window.location.href = '/welcome';
    };

    const isLoggedIn = !! localStorage.getItem('token');

    //checks is user has a paid account
    const [isPremium, setIsPremium] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const username = localStorage.getItem('username');

        if (!username) {
            setError('User is not logged in');
            return
        };

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:500/api/user?username=${encodeURIComponent(username)}`);
                if (!response.of) {
                    throw new Error('User not found');
                };
                const data = await response.json();
                setIsPremium(data.premium);
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            setCurrentUser(username);
        }
    }, [isLoggedIn]);

    return (
        <div id="navbar">
        
            {isLoggedIn ? (
                <>
                    <div>
                        <h1><a href="./Pages/home.js">Cleirigh</a></h1>
                    </div>
                    <Link to={`/${currentUser}`} className="navlink">{currentUser}</Link>
                    <Link className="navlink">Tree</Link>
                    <Link onClick={handleSignOut} className="navlink">Sign Out</Link>
                </>
            ) : (
                <>
                    <div className="title-logo">
                        <img className="logo" src={logo} alt="Ó Cléirigh Cl"></img>
                        <h1 className="uncial-antiqua-regular"><a href="/welcome">Cleirigh</a></h1>
                        <p className="subtitle">Geneological Archive</p>
                    </div>
                    <ul className="nav-ul">
                        <Link to="/login" className="navlink">Login</Link>
                        <Link to="/register" className="navlink">Register</Link>
                    </ul>
                    
                </>
            )}

        </div>
    )
};

export default Navbar;