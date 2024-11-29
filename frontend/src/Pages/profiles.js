import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import {capitaliseFirstLetter, convertDate} from '../library.js'
import '../style.css';
import {Link} from "react-router-dom";
import LeftSidebar from '../Components/leftSidebar.js'

const Profiles = () => {
    const [firstNames, setFirstNames] = useState([]);
    const [middleNames, setMiddleNames] = useState([]);
    const [lastNames, setLastNames] = useState([]);
    const [sexes, setSexes] = useState([]);
    const [ethnicities, setEthnicities] = useState([]);
    const [datesOfBirth, setDatesOfBirth] = useState([]);
    const [placesOfBirth, setPlacesOfBirth] = useState([]);
    const [datesOfDeath, setDatesOfDeath] = useState([]);
    const [placesOfDeath, setPlacesOfDeath] = useState([]);
    

    useEffect(() => { 
        const getAllProfiles = async () => {
            try {
                //gets user's id
                const userId = localStorage.getItem('userId');
                const response = await fetch('http://localhost:5000/get-all-ancestors', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId })
                })

                const data = await response.json();
                setFirstNames(data.firstNames);
                setMiddleNames(data.middleNames);
                setLastNames(data.lastNames);  
                setSexes(data.sexes);
                setDatesOfBirth(data.datesOfBirth);
                setPlacesOfBirth(data.placesOfBirth);
                setDatesOfDeath(data.datesOfDeath);
                setPlacesOfDeath(data.placesOfDeath)
                setEthnicities(data.ethnicities);


            } catch (error) {
                console.log('Error fetching profile lists:', error)
            }
        };

        getAllProfiles();
    }, []);

    return (
        <div>
            <div className="row">
                <LeftSidebar />

                <div className="col">
                    <h1>Profiles</h1>

                    <ul>
                        {firstNames.map((firstName, index) => (
                            <li key={index}>
                                {firstNames[index]} {middleNames[index]} {lastNames[index]} {sexes[index]} {convertDate(datesOfBirth[index])} {placesOfBirth[index]} {convertDate(datesOfDeath[index])} {placesOfDeath[index]} {ethnicities[index]}
                            </li>
                        ))}
                    </ul>

                </div>

            </div>
        </div>
    )
}

export default Profiles;