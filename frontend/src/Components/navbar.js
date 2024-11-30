import React, { useState, useEffect } from 'react';
import '../style.css';
import { Link } from 'react-router-dom';
import logo from '../Images/crest.png';
import {jwtDecode} from 'jwt-decode';
import {capitaliseFirstLetter} from '../library.js';

const Navbar = ({onLogin, onLogout}) => {
    const [currentUser, setCurrentUser] = useState(localStorage.getItem('username'));

    const handleSignOut = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        sessionStorage.clear();
        onLogout && onLogout();
        window.location.href = '/';
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



    const [treeName, setTreeName] = useState('');

     // returns name of user's tree
     useEffect (() => {
    
        const getTreeName = async () => {

            const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
    
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

            try {
            const response = await fetch('http://localhost:5000/get-tree-name', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId })
            });

            // Check if the response is valid and is JSON
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            
            const data = await response.json();
            setTreeName(data.treeName); // Update state based on response
        

            } catch (error) {
            console.error('Error checking trees:', error);
            }

            return treeName;
        };

        getTreeName();
    }, [])

    return (
        <div id="navbar">
        
            {isLoggedIn ? (
                <>
                    <div className="title-logo">
                        <img className="logo" src={logo} alt="Ó Cléirigh Cl"></img>
                        <h1 className="uncial-antiqua-regular"><Link to={"/home"}>Cleirigh</Link></h1>
                        <p className="subtitle">Geneological Archive</p>
                    </div>
                    <ul className="nav-ul">
                        <Link className="navlink">{capitaliseFirstLetter(treeName)} Tree</Link>
                        <Link to={`/${currentUser}`} className="navlink">Account</Link>
                        <Link onClick={handleSignOut} className="navlink">Sign Out</Link>
                    </ul>
                    
                </>
            ) : (
                <>
                    <div className="title-logo">
                        <img className="logo" src={logo} alt="Ó Cléirigh Cl"></img>
                        <h1 className="uncial-antiqua-regular"><a href="/">Cleirigh</a></h1>
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