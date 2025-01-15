import React, { useState, useEffect } from 'react';
import '../style.css';
import { Link } from 'react-router-dom';
import logo from '../Images/crest.png';
import {jwtDecode} from 'jwt-decode';
import {capitaliseFirstLetter} from '../library.js';

const Navbar = ({onLogin, onLogout}) => {
    const [currentUser, setCurrentUser] = useState(localStorage.getItem('username'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentTreeName, setCurrentTreeName] = useState('');
    const [currentTreeID, setCurrentTreeID] = useState('');

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
    // const [isPremium, setIsPremium] = useState(false);
    // const [error, setError] = useState(null);
    // useEffect(() => {
    //     const username = localStorage.getItem('username');

    //     if (!username) {
    //         setError('User is not logged in');
    //         return
    //     };

    //     const fetchUserData = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:500/api/user?username=${encodeURIComponent(username)}`);
    //             if (!response.of) {
    //                 throw new Error('User not found');
    //             };
    //             const data = await response.json();
    //             setIsPremium(data.premium);
    //         } catch (error) {
    //             console.error('Error fetching user data:', error)
    //         }
    //     };
    //     fetchUserData();
    // }, []);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            setCurrentUser(username);
        }
    }, [isLoggedIn]);


    useEffect(() => { 
        const getAllTrees = async () => {
            if (isLoggedIn) {
            try {
                //gets user's id
                const userId = localStorage.getItem('userId');
                const response = await fetch('`${process.env.REACT_APP_BACKEND_URL}/get-all-trees', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId })
                })

                const data = await response.json();
                setCurrentTreeName(data.treeName);
                setCurrentTreeID(data.treeID);
            } catch (error) {
                console.log('Error getting list of all trees:', error)
            }
        }
        };

        getAllTrees();
    }, [isLoggedIn]);

    const switchTree = async (treeId) => {
        try {
            //gets user's id
            const userId = localStorage.getItem('userId');
            const response = await fetch('`${process.env.REACT_APP_BACKEND_URL}/switch-trees', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, treeId })
            })
        
            const data = await response.json();
            if (data) {
                window.location.href = "/home"
            }


        } catch (error) {
            console.log('Error getting list of all trees:', error)
        }
    }



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
            const response = await fetch('`${process.env.REACT_APP_BACKEND_URL}/get-tree-name', {
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
                    <Link to={'/familytree'} className="navlink">View Tree</Link>
                    <Link to={'/search'} className="navlink">Search</Link>
                    <Link to={'/queries'} className="navlink">Queries</Link>
                    {/* Tree Link with Dropdown */}
                    <div className="dropdown">
                        <Link
                            className="navlink"
                            onClick={toggleDropdown}
                        >
                            {capitaliseFirstLetter(treeName)} Tree
                        </Link>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="/tree/settings">Tree Settings</Link></li>
                                <li><Link><i>--Switch Tree--</i></Link></li>
                                
                                {currentTreeName.map((trees, index) => (
                                    <li key={index} onClick={() => switchTree(currentTreeID[index])}>
                                        <Link>{currentTreeName[index]} Tree</Link>
                                    </li>
                                ))}




                            </ul>
                        )}
                    </div>
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
    );
};

export default Navbar;