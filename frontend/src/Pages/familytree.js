import LeftSidebar from "../Components/leftSidebar"
import { useState, useEffect } from 'react';
import { convertDate } from '../library.js';

//paternalpaternalgreatgrandparents = paternal grandfather's parents
//paternalmaternalgreatgrandparents = paternal grandmother's parents
//maternalpaternalgrandparents = maternal grandfather's parents
//maternalmaternalgrandparents = maternal grandmother's parents

const FamilyTree = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [basePersonFirstName, setBasePersonFirstName] = useState('');
    const [basePersonName, setBasePersonName] = useState('');
    const [bottomPagePersonName, setBottomPagePersonName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [paternalGrandmotherName, setPaternalGrandmotherName] = useState('');
    const [paternalGrandfatherName, setPaternalGrandfatherName] = useState('');
    const [maternalGrandmotherName, setMaternalGrandmotherName] = useState('');
    const [maternalGrandfatherName, setMaternalGrandfatherName] = useState('');
    const [paternalPaternalGreatGrandmotherName, setPaternalPaternalGreatGrandmotherName] = useState('');
    const [paternalPaternalGreatGrandfatherName, setPaternalPaternalGreatGrandfatherName] = useState('');
    const [paternalMaternalGreatGrandmotherName, setPaternalMaternalGreatGrandmotherName] = useState('');
    const [paternalMaternalGreatGrandfatherName, setPaternalMaternalGreatGrandfatherName] = useState('');
    const [maternalPaternalGreatGrandmotherName, setMaternalPaternalGreatGrandmotherName] = useState('');
    const [maternalPaternalGreatGrandfatherName, setMaternalPaternalGreatGrandfatherName] = useState('');
    const [maternalMaternalGreatGrandmotherName, setMaternalMaternalGreatGrandmotherName] = useState('');
    const [maternalMaternalGreatGrandfatherName, setMaternalMaternalGreatGrandfatherName] = useState('');

    const [basePersonID, setBasePersonID] = useState('');
    const [bottomPagePersonID, setBottomPagePersonID] = useState('');
    const [fatherID, setFatherID] = useState('');
    const [motherID, setMotherID] = useState('');
    const [paternalGrandmotherID, setPaternalGrandmotherID] = useState('');
    const [paternalGrandfatherID, setPaternalGrandfatherID] = useState('');
    const [maternalGrandmotherID, setMaternalGrandmotherID] = useState('');
    const [maternalGrandfatherID, setMaternalGrandfatherID] = useState('');
    const [paternalPaternalGreatGrandmotherID, setPaternalPaternalGreatGrandmotherID] = useState('');
    const [paternalPaternalGreatGrandfatherID, setPaternalPaternalGreatGrandfatherID] = useState('');
    const [paternalMaternalGreatGrandmotherID, setPaternalMaternalGreatGrandmotherID] = useState('');
    const [paternalMaternalGreatGrandfatherID, setPaternalMaternalGreatGrandfatherID] = useState('');
    const [maternalPaternalGreatGrandmotherID, setMaternalPaternalGreatGrandmotherID] = useState('');
    const [maternalPaternalGreatGrandfatherID, setMaternalPaternalGreatGrandfatherID] = useState('');
    const [maternalMaternalGreatGrandmotherID, setMaternalMaternalGreatGrandmotherID] = useState('');
    const [maternalMaternalGreatGrandfatherID, setMaternalMaternalGreatGrandfatherID] = useState('');


    const [basePersonBirthDate, setBasePersonBirthDate] = useState('');
    const [bottomPagePersonBirthDate, setBottomPagePersonBirthDate] = useState('');
    const [fatherBirthDate, setFatherBirthDate] = useState('');
    const [motherBirthDate, setMotherBirthDate] = useState('');
    const [paternalGrandmotherBirthDate, setPaternalGrandmotherBirthDate] = useState('');
    const [paternalGrandfatherBirthDate, setPaternalGrandfatherBirthDate] = useState('');
    const [maternalGrandmotherBirthDate, setMaternalGrandmotherBirthDate] = useState('');
    const [maternalGrandfatherBirthDate, setMaternalGrandfatherBirthDate] = useState('');
    const [paternalPaternalGreatGrandmotherBirthDate, setPaternalPaternalGreatGrandmotherBirthDate] = useState('');
    const [paternalPaternalGreatGrandfatherBirthDate, setPaternalPaternalGreatGrandfatherBirthDate] = useState('');
    const [paternalMaternalGreatGrandmotherBirthDate, setPaternalMaternalGreatGrandmotherBirthDate] = useState('');
    const [paternalMaternalGreatGrandfatherBirthDate, setPaternalMaternalGreatGrandfatherBirthDate] = useState('');
    const [maternalPaternalGreatGrandmotherBirthDate, setMaternalPaternalGreatGrandmotherBirthDate] = useState('');
    const [maternalPaternalGreatGrandfatherBirthDate, setMaternalPaternalGreatGrandfatherBirthDate] = useState('');
    const [maternalMaternalGreatGrandmotherBirthDate, setMaternalMaternalGreatGrandmotherBirthDate] = useState('');
    const [maternalMaternalGreatGrandfatherBirthDate, setMaternalMaternalGreatGrandfatherBirthDate] = useState('');

    const [basePersonBirthPlace, setBasePersonBirthPlace] = useState('');
    const [bottomPagePersonBirthPlace, setBottomPagePersonBirthPlace] = useState('');
    const [fatherBirthPlace, setFatherBirthPlace] = useState('');
    const [motherBirthPlace, setMotherBirthPlace] = useState('');
    const [paternalGrandmotherBirthPlace, setPaternalGrandmotherBirthPlace] = useState('');
    const [paternalGrandfatherBirthPlace, setPaternalGrandfatherBirthPlace] = useState('');
    const [maternalGrandmotherBirthPlace, setMaternalGrandmotherBirthPlace] = useState('');
    const [maternalGrandfatherBirthPlace, setMaternalGrandfatherBirthPlace] = useState('');
    const [paternalPaternalGreatGrandmotherBirthPlace, setPaternalPaternalGreatGrandmotherBirthPlace] = useState('');
    const [paternalPaternalGreatGrandfatherBirthPlace, setPaternalPaternalGreatGrandfatherBirthPlace] = useState('');
    const [paternalMaternalGreatGrandmotherBirthPlace, setPaternalMaternalGreatGrandmotherBirthPlace] = useState('');
    const [paternalMaternalGreatGrandfatherBirthPlace, setPaternalMaternalGreatGrandfatherBirthPlace] = useState('');
    const [maternalPaternalGreatGrandmotherBirthPlace, setMaternalPaternalGreatGrandmotherBirthPlace] = useState('');
    const [maternalPaternalGreatGrandfatherBirthPlace, setMaternalPaternalGreatGrandfatherBirthPlace] = useState('');
    const [maternalMaternalGreatGrandmotherBirthPlace, setMaternalMaternalGreatGrandmotherBirthPlace] = useState('');
    const [maternalMaternalGreatGrandfatherBirthPlace, setMaternalMaternalGreatGrandfatherBirthPlace] = useState('');

    const [basePersonDeathDate, setBasePersonDeathDate] = useState('');
    const [bottomPagePersonDeathDate, setBottomPagePersonDeathDate] = useState('');
    const [fatherDeathDate, setFatherDeathDate] = useState('');
    const [motherDeathDate, setMotherDeathDate] = useState('');
    const [paternalGrandmotherDeathDate, setPaternalGrandmotherDeathDate] = useState('');
    const [paternalGrandfatherDeathDate, setPaternalGrandfatherDeathDate] = useState('');
    const [maternalGrandmotherDeathDate, setMaternalGrandmotherDeathDate] = useState('');
    const [maternalGrandfatherDeathDate, setMaternalGrandfatherDeathDate] = useState('');
    const [paternalPaternalGreatGrandmotherDeathDate, setPaternalPaternalGreatGrandmotherDeathDate] = useState('');
    const [paternalPaternalGreatGrandfatherDeathDate, setPaternalPaternalGreatGrandfatherDeathDate] = useState('');
    const [paternalMaternalGreatGrandmotherDeathDate, setPaternalMaternalGreatGrandmotherDeathDate] = useState('');
    const [paternalMaternalGreatGrandfatherDeathDate, setPaternalMaternalGreatGrandfatherDeathDate] = useState('');
    const [maternalPaternalGreatGrandmotherDeathDate, setMaternalPaternalGreatGrandmotherDeathDate] = useState('');
    const [maternalPaternalGreatGrandfatherDeathDate, setMaternalPaternalGreatGrandfatherDeathDate] = useState('');
    const [maternalMaternalGreatGrandmotherDeathDate, setMaternalMaternalGreatGrandmotherDeathDate] = useState('');
    const [maternalMaternalGreatGrandfatherDeathDate, setMaternalMaternalGreatGrandfatherDeathDate] = useState('');


    const [basePersonDeathPlace, setBasePersonDeathPlace] = useState('');
    const [bottomPagePersonDeathPlace, setBottomPagePersonDeathPlace] = useState('');
    const [fatherDeathPlace, setFatherDeathPlace] = useState('');
    const [motherDeathPlace, setMotherDeathPlace] = useState('');
    const [paternalGrandmotherDeathPlace, setPaternalGrandmotherDeathPlace] = useState('');
    const [paternalGrandfatherDeathPlace, setPaternalGrandfatherDeathPlace] = useState('');
    const [maternalGrandmotherDeathPlace, setMaternalGrandmotherDeathPlace] = useState('');
    const [maternalGrandfatherDeathPlace, setMaternalGrandfatherDeathPlace] = useState('');
    const [paternalPaternalGreatGrandmotherDeathPlace, setPaternalPaternalGreatGrandmotherDeathPlace] = useState('');
    const [paternalPaternalGreatGrandfatherDeathPlace, setPaternalPaternalGreatGrandfatherDeathPlace] = useState('');
    const [paternalMaternalGreatGrandmotherDeathPlace, setPaternalMaternalGreatGrandmotherDeathPlace] = useState('');
    const [paternalMaternalGreatGrandfatherDeathPlace, setPaternalMaternalGreatGrandfatherDeathPlace] = useState('');
    const [maternalPaternalGreatGrandmotherDeathPlace, setMaternalPaternalGreatGrandmotherDeathPlace] = useState('');
    const [maternalPaternalGreatGrandfatherDeathPlace, setMaternalPaternalGreatGrandfatherDeathPlace] = useState('');
    const [maternalMaternalGreatGrandmotherDeathPlace, setMaternalMaternalGreatGrandmotherDeathPlace] = useState('');
    const [maternalMaternalGreatGrandfatherDeathPlace, setMaternalMaternalGreatGrandfatherDeathPlace] = useState('');

    const [basePersonOccupation, setBasePersonOccupation] = useState('');
    const [bottomPagePersonOccupation, setBottomPagePersonOccupation] = useState('');
    const [fatherOccupation, setFatherOccupation] = useState('');
    const [motherOccupation, setMotherOccupation] = useState('');
    const [paternalGrandmotherOccupation, setPaternalGrandmotherOccupation] = useState('');
    const [paternalGrandfatherOccupation, setPaternalGrandfatherOccupation] = useState('');
    const [maternalGrandmotherOccupation, setMaternalGrandmotherOccupation] = useState('');
    const [maternalGrandfatherOccupation, setMaternalGrandfatherOccupation] = useState('');
    const [paternalPaternalGreatGrandmotherOccupation, setPaternalPaternalGreatGrandmotherOccupation] = useState('');
    const [paternalPaternalGreatGrandfatherOccupation, setPaternalPaternalGreatGrandfatherOccupation] = useState('');
    const [paternalMaternalGreatGrandmotherOccupation, setPaternalMaternalGreatGrandmotherOccupation] = useState('');
    const [paternalMaternalGreatGrandfatherOccupation, setPaternalMaternalGreatGrandfatherOccupation] = useState('');
    const [maternalPaternalGreatGrandmotherOccupation, setMaternalPaternalGreatGrandmotherOccupation] = useState('');
    const [maternalPaternalGreatGrandfatherOccupation, setMaternalPaternalGreatGrandfatherOccupation] = useState('');
    const [maternalMaternalGreatGrandmotherOccupation, setMaternalMaternalGreatGrandmotherOccupation] = useState('');
    const [maternalMaternalGreatGrandfatherOccupation, setMaternalMaternalGreatGrandfatherOccupation] = useState('');

    const [basePersonProfileNumber, setBasePersonProfileNumber] = useState('');
    const [bottomPagePersonProfileNumber, setBottomPagePersonProfileNumber] = useState('');
    const [fatherProfileNumber, setFatherProfileNumber] = useState('');
    const [motherProfileNumber, setMotherProfileNumber] = useState('');
    const [paternalGrandmotherProfileNumber, setPaternalGrandmotherProfileNumber] = useState('');
    const [paternalGrandfatherProfileNumber, setPaternalGrandfatherProfileNumber] = useState('');
    const [maternalGrandmotherProfileNumber, setMaternalGrandmotherProfileNumber] = useState('');
    const [maternalGrandfatherProfileNumber, setMaternalGrandfatherProfileNumber] = useState('');
    const [paternalPaternalGreatGrandmotherProfileNumber, setPaternalPaternalGreatGrandmotherProfileNumber] = useState('');
    const [paternalPaternalGreatGrandfatherProfileNumber, setPaternalPaternalGreatGrandfatherProfileNumber] = useState('');
    const [paternalMaternalGreatGrandmotherProfileNumber, setPaternalMaternalGreatGrandmotherProfileNumber] = useState('');
    const [paternalMaternalGreatGrandfatherProfileNumber, setPaternalMaternalGreatGrandfatherProfileNumber] = useState('');
    const [maternalPaternalGreatGrandmotherProfileNumber, setMaternalPaternalGreatGrandmotherProfileNumber] = useState('');
    const [maternalPaternalGreatGrandfatherProfileNumber, setMaternalPaternalGreatGrandfatherProfileNumber] = useState('');
    const [maternalMaternalGreatGrandmotherProfileNumber, setMaternalMaternalGreatGrandmotherProfileNumber] = useState('');
    const [maternalMaternalGreatGrandfatherProfileNumber, setMaternalMaternalGreatGrandfatherProfileNumber] = useState('');

    useEffect(() => {
        const getBasePerson = async () => {

            const userId = localStorage.getItem('userId');

            const response = await fetch('http://localhost:5000/get-base-person', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })

            const data = await response.json();
            setBasePersonFirstName(data.firstName);
            setBasePersonName(data.fullName);
            setBasePersonID(data.basePersonID)
        }

        getBasePerson();
    }, [])

    useEffect(() => {
        const getCurrentPageNumber = async () => {
            const userId = localStorage.getItem('userId');

            const response = await fetch('http://localhost:5000/get-current-page-number', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })

            const data = await response.json();
            setPageNumber(data);
        }
        getCurrentPageNumber();
    }, [])


   useEffect(() => {
    const getFather = async () => {
        if (basePersonID) {
            const personID = basePersonID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setFatherName(data.fatherName);
            setFatherID(data.fatherID);
            setFatherBirthDate(convertDate(data.fatherBirthDate));
            setFatherBirthPlace(data.fatherBirthPlace);
            setFatherDeathDate(convertDate(data.fatherDeathDate));
            setFatherDeathPlace(data.fatherDeathPlace);
            setFatherOccupation(data.fatherOccupation);
            setFatherProfileNumber(data.fatherProfileNumber);
        }
    }
    getFather();
}, [basePersonID])

useEffect(() => {
    const getMother = async () => {
        if (basePersonID) {
            const personID = basePersonID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMotherName(data.motherName);
            setMotherID(data.motherID);
            setMotherBirthDate(convertDate(data.motherBirthDate));
            setMotherBirthPlace(data.motherBirthPlace);
            setMotherDeathDate(convertDate(data.motherDeathDate));
            setMotherDeathPlace(data.motherDeathPlace);
            setMotherOccupation(data.motherOccupation);
            setMotherProfileNumber(data.motherProfileNumber);
        }
    }
    getMother();
}, [basePersonID])

useEffect(() => {
    const getPaternalGrandFather = async () => {
        if (fatherID) {
            const personID = fatherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalGrandfatherName(data.fatherName);
            setPaternalGrandfatherID(data.fatherID);
            setPaternalGrandfatherBirthDate(convertDate(data.fatherBirthDate));
            setPaternalGrandfatherBirthPlace(data.fatherBirthPlace);
            setPaternalGrandfatherDeathDate(convertDate(data.fatherDeathDate));
            setPaternalGrandfatherDeathPlace(data.fatherDeathPlace);
            setPaternalGrandfatherOccupation(data.fatherOccupation);
            setPaternalGrandfatherProfileNumber(data.fatherProfileNumber);
        }
    }
    getPaternalGrandFather();
}, [fatherID])

useEffect(() => {
    const getPaternalGrandMother= async () => {
        if (fatherID) {
            const personID = fatherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalGrandmotherName(data.motherName);
            setPaternalGrandmotherID(data.motherID);
            setPaternalGrandmotherBirthDate(convertDate(data.motherBirthDate));
            setPaternalGrandmotherBirthPlace(data.motherBirthPlace);
            setPaternalGrandmotherDeathDate(convertDate(data.motherDeathDate));
            setPaternalGrandmotherDeathPlace(data.motherDeathPlace);
            setPaternalGrandmotherOccupation(data.motherOccupation);
            setPaternalGrandmotherProfileNumber(data.motherProfileNumber);
            console.log(paternalGrandmotherName)
        }
    }
    getPaternalGrandMother();
}, [fatherID])

useEffect(() => {
    const getMaternalGrandFather = async () => {
        if (motherID) {
            const personID = motherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalGrandfatherName(data.fatherName);
            setMaternalGrandfatherID(data.fatherID);
            setMaternalGrandfatherBirthDate(convertDate(data.fatherBirthDate));
            setMaternalGrandfatherBirthPlace(data.fatherBirthPlace);
            setMaternalGrandfatherDeathDate(convertDate(data.fatherDeathDate));
            setMaternalGrandfatherDeathPlace(data.fatherDeathPlace);
            setMaternalGrandfatherOccupation(data.fatherOccupation);
            setMaternalGrandfatherProfileNumber(data.fatherProfileNumber);
        }
    }
    getMaternalGrandFather();
}, [motherID])

useEffect(() => {
    const getMaternalGrandMother = async () => {
        if (motherID) {
            const personID = motherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalGrandmotherName(data.motherName);
            setMaternalGrandmotherID(data.motherID);
            setMaternalGrandmotherBirthDate(convertDate(data.motherBirthDate));
            setMaternalGrandmotherBirthPlace(data.motherBirthPlace);
            setMaternalGrandmotherDeathDate(convertDate(data.motherDeathDate));
            setMaternalGrandmotherDeathPlace(data.motherDeathPlace);
            setMaternalGrandmotherOccupation(data.motherOccupation);
            setMaternalGrandmotherProfileNumber(data.motherProfileNumber);
        }
    }
    getMaternalGrandMother();
}, [motherID])

useEffect(() => {
    const getPaternalPaternalGreatGrandFather = async () => {
        if (paternalGrandfatherID) {
            const personID = paternalGrandfatherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalPaternalGreatGrandfatherName(data.fatherName);
            setPaternalPaternalGreatGrandfatherID(data.fatherID);
            setPaternalPaternalGreatGrandfatherBirthDate(convertDate(data.fatherBirthDate));
            setPaternalPaternalGreatGrandfatherBirthPlace(data.fatherBirthPlace);
            setPaternalPaternalGreatGrandfatherDeathDate(convertDate(data.fatherDeathDate));
            setPaternalPaternalGreatGrandfatherDeathPlace(data.fatherDeathPlace);
            setPaternalPaternalGreatGrandfatherOccupation(data.fatherOccupation);
            setPaternalPaternalGreatGrandfatherProfileNumber(data.fatherProfileNumber);
        }
    }
    getPaternalPaternalGreatGrandFather();
}, [paternalGrandfatherID])

useEffect(() => {
    const getPaternalPaternalGreatGrandMother = async () => {
        if (paternalGrandfatherID) {
            const personID = paternalGrandfatherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalPaternalGreatGrandmotherName(data.motherName);
            setPaternalPaternalGreatGrandmotherID(data.motherID);
            setPaternalPaternalGreatGrandmotherBirthDate(convertDate(data.motherBirthDate));
            setPaternalPaternalGreatGrandmotherBirthPlace(data.motherBirthPlace);
            setPaternalPaternalGreatGrandmotherDeathDate(convertDate(data.motherDeathDate));
            setPaternalPaternalGreatGrandmotherDeathPlace(data.motherDeathPlace);
            setPaternalPaternalGreatGrandmotherOccupation(data.motherOccupation);
            setPaternalPaternalGreatGrandmotherProfileNumber(data.motherProfileNumber);
        }
    }
    getPaternalPaternalGreatGrandMother();
}, [paternalGrandfatherID])


useEffect(() => {
    const getPaternalMaternalGreatGrandFather = async () => {
        if (paternalGrandmotherID) {
            const personID = paternalGrandmotherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalMaternalGreatGrandfatherName(data.fatherName);
            setPaternalMaternalGreatGrandfatherID(data.fatherID);
            setPaternalMaternalGreatGrandfatherBirthDate(convertDate(data.fatherBirthDate));
            setPaternalMaternalGreatGrandfatherBirthPlace(data.fatherBirthPlace);
            setPaternalMaternalGreatGrandfatherDeathDate(convertDate(data.fatherDeathDate));
            setPaternalMaternalGreatGrandfatherDeathPlace(data.fatherDeathPlace);
            setPaternalMaternalGreatGrandfatherOccupation(data.fatherOccupation);
            setPaternalMaternalGreatGrandfatherProfileNumber(data.fatherProfileNumber);
        }
    }
    getPaternalMaternalGreatGrandFather();
}, [paternalGrandmotherID])

useEffect(() => {
    const getPaternalMaternalGreatGrandMother = async () => {
        if (paternalGrandmotherID) {
            const personID = paternalGrandmotherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalMaternalGreatGrandmotherName(data.motherName);
            setPaternalMaternalGreatGrandmotherID(data.motherID);
            setPaternalMaternalGreatGrandmotherBirthDate(convertDate(data.motherBirthDate));
            setPaternalMaternalGreatGrandmotherBirthPlace(data.motherBirthPlace);
            setPaternalMaternalGreatGrandmotherDeathDate(convertDate(data.motherDeathDate));
            setPaternalMaternalGreatGrandmotherDeathPlace(data.motherDeathPlace);
            setPaternalMaternalGreatGrandmotherOccupation(data.motherOccupation);
            setPaternalMaternalGreatGrandmotherProfileNumber(data.motherProfileNumber);
        }
    }
    getPaternalMaternalGreatGrandMother();
}, [paternalGrandmotherID])

useEffect(() => {
    const getMaternalPaternalGreatGrandFather = async () => {
        if (maternalGrandfatherID) {
            const personID = maternalGrandfatherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalPaternalGreatGrandfatherName(data.fatherName);
            setMaternalPaternalGreatGrandfatherID(data.fatherID);
            setMaternalPaternalGreatGrandfatherBirthDate(convertDate(data.fatherBirthDate));
            setMaternalPaternalGreatGrandfatherBirthPlace(data.fatherBirthPlace);
            setMaternalPaternalGreatGrandfatherDeathDate(convertDate(data.fatherDeathDate));
            setMaternalPaternalGreatGrandfatherDeathPlace(data.fatherDeathPlace);
            setMaternalPaternalGreatGrandfatherOccupation(data.fatherOccupation);
            setMaternalPaternalGreatGrandfatherProfileNumber(data.fatherProfileNumber);
        }
        
    }
    getMaternalPaternalGreatGrandFather();
}, [maternalGrandfatherID])

useEffect(() => {
    const getMaternalPaternalGreatGrandmother = async () => {
        if (maternalGrandfatherID) {
            const personID = maternalGrandfatherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalPaternalGreatGrandmotherName(data.motherName);
            setMaternalPaternalGreatGrandmotherID(data.motherID);
            setMaternalPaternalGreatGrandmotherBirthDate(convertDate(data.motherBirthDate));
            setMaternalPaternalGreatGrandmotherBirthPlace(data.motherBirthPlace);
            setMaternalPaternalGreatGrandmotherDeathDate(convertDate(data.motherDeathDate));
            setMaternalPaternalGreatGrandmotherDeathPlace(data.motherDeathPlace);
            setMaternalPaternalGreatGrandmotherOccupation(data.motherOccupation);
            setMaternalPaternalGreatGrandmotherProfileNumber(data.motherProfileNumber);
        }
    }
    getMaternalPaternalGreatGrandmother();
}, [maternalGrandfatherID])

useEffect(() => {
    const getMaternalMaternalGreatGrandFather = async () => {
        if (maternalGrandmotherID) {
            const personID = maternalGrandmotherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalMaternalGreatGrandfatherName(data.fatherName);
            setMaternalMaternalGreatGrandfatherID(data.fatherID);
            setMaternalMaternalGreatGrandfatherBirthDate(convertDate(data.fatherBirthDate));
            setMaternalMaternalGreatGrandfatherBirthPlace(data.fatherBirthPlace);
            setMaternalMaternalGreatGrandfatherDeathDate(convertDate(data.fatherDeathDate));
            setMaternalMaternalGreatGrandfatherDeathPlace(data.fatherDeathPlace);
            setMaternalMaternalGreatGrandfatherOccupation(data.fatherOccupation);
            setMaternalMaternalGreatGrandfatherProfileNumber(data.fatherProfileNumber);
        }
    }
    getMaternalMaternalGreatGrandFather();
}, [maternalGrandmotherID])

useEffect(() => {
    const getMaternalMaternalGreatGrandMother = async () => {
        if (maternalGrandmotherID) {
            const personID = maternalGrandmotherID;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalMaternalGreatGrandmotherName(data.motherName);
            setMaternalMaternalGreatGrandmotherID(data.motherID);
            setMaternalMaternalGreatGrandmotherBirthDate(convertDate(data.motherBirthDate));
            setMaternalMaternalGreatGrandmotherBirthPlace(data.motherBirthPlace);
            setMaternalMaternalGreatGrandmotherDeathDate(convertDate(data.motherDeathDate));
            setMaternalMaternalGreatGrandmotherDeathPlace(data.motherDeathPlace);
            setMaternalMaternalGreatGrandmotherOccupation(data.motherOccupation);
            setMaternalMaternalGreatGrandmotherProfileNumber(data.motherProfileNumber);
        }
    }
    getMaternalMaternalGreatGrandMother();
}, [maternalGrandmotherID])


    const handleNavigateUpwards = (personID) => {
        window.location.reload();
    };


    return (
        <div>
            <div className="row">
                <LeftSidebar />

                {/*contains the whole tree*/}
                <div className="col">

                <div className="row scrollable">

                    <div id="tree-container scrollable">

                    {/*contains great-grandparents*/}
                    <div className="row">

                        <div className="row arrow-page-num-div">

                        {paternalPaternalGreatGrandfatherName || paternalPaternalGreatGrandfatherBirthDate || paternalPaternalGreatGrandfatherBirthPlace || paternalPaternalGreatGrandfatherDeathDate || paternalPaternalGreatGrandfatherDeathPlace || paternalPaternalGreatGrandfatherOccupation || paternalPaternalGreatGrandfatherProfileNumber ? (
                            <div className="col">
                                <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalPaternalGreatGrandfatherID)}>Page: <br />⇑</p>
                            </div>
                        ) : (
                            <div className="col">
                                <p className="up-arrow"> <br /></p>
                            </div>
                        )}

                            {paternalPaternalGreatGrandmotherName || paternalPaternalGreatGrandmotherBirthDate || paternalPaternalGreatGrandmotherBirthPlace || paternalPaternalGreatGrandmotherDeathDate || paternalPaternalGreatGrandmotherDeathPlace || paternalPaternalGreatGrandmotherOccupation || paternalPaternalGreatGrandmotherProfileNumber ? (
                            <div className="col">
                                <p className="up-arrow"onClick={() => handleNavigateUpwards(paternalPaternalGreatGrandmotherID)}>Page: <br />⇑</p>
                            </div>
                            ) : (
                                <div className="col">
                                    <p className="up-arrow"> <br /></p>
                                </div>
                            )}

                            {paternalMaternalGreatGrandfatherName || paternalMaternalGreatGrandfatherBirthDate || paternalMaternalGreatGrandfatherBirthPlace || paternalMaternalGreatGrandfatherDeathDate || paternalMaternalGreatGrandfatherDeathPlace || paternalMaternalGreatGrandfatherOccupation || paternalMaternalGreatGrandfatherProfileNumber ? (
                                <div className="col">
                                    <p className="up-arrow"onClick={() => handleNavigateUpwards(paternalMaternalGreatGrandfatherID)}>Page: <br />⇑</p>
                                </div>
                            ) : (
                                <div className="col">
                                    <p className="up-arrow"> <br /></p>
                                </div>
                            )}
                            

                            {paternalMaternalGreatGrandmotherName || paternalMaternalGreatGrandmotherBirthDate || paternalMaternalGreatGrandmotherBirthPlace || paternalMaternalGreatGrandmotherDeathDate || paternalMaternalGreatGrandmotherDeathPlace || paternalMaternalGreatGrandmotherOccupation || paternalMaternalGreatGrandmotherProfileNumber ? (
                                <div className="col">
                                    <p className="up-arrow"onClick={() => handleNavigateUpwards(paternalMaternalGreatGrandmotherID)}>Page: <br />⇑</p>
                                </div>
                            ) : (
                                <div className="col">
                                    <p className="up-arrow"> <br /></p>
                                </div>
                            )}
                            

                            {maternalPaternalGreatGrandfatherName || maternalPaternalGreatGrandfatherBirthDate || maternalPaternalGreatGrandfatherBirthPlace || maternalPaternalGreatGrandfatherDeathDate || maternalPaternalGreatGrandfatherDeathPlace || maternalPaternalGreatGrandfatherOccupation || maternalPaternalGreatGrandfatherProfileNumber ? (
                                <div className="col">
                                    <p className="up-arrow"onClick={() => handleNavigateUpwards(maternalPaternalGreatGrandfatherID)}>Page: <br />⇑</p>
                                </div>
                            ) : (
                                <div className="col">
                                    <p className="up-arrow"> <br /></p>
                                </div>
                            )}
                            

                            {maternalPaternalGreatGrandmotherID ? (
                                <div className="col">
                                    <p className="up-arrow"onClick={() => handleNavigateUpwards(maternalPaternalGreatGrandmotherID)}>Page: <br />⇑</p>
                                </div>
                            ) : (
                                <div className="col">
                                    <p className="up-arrow"> <br /></p>
                                </div>
                            )}
                            

                            {maternalMaternalGreatGrandfatherID ? (
                                <div className="col">
                                    <p className="up-arrow"onClick={() => handleNavigateUpwards(maternalMaternalGreatGrandfatherID)}>Page: <br />⇑</p>
                                </div>
                            ) : (
                                <div className="col">
                                    <p className="up-arrow"> <br /></p>
                                </div>
                            )}
                            

                            {maternalMaternalGreatGrandmotherID ? (
                                 <div className="col" >
                                    <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalMaternalGreatGrandmotherID)}>Page: <br />⇑</p>
                                </div>
                            ) : (
                                <div className="col">
                                    <p className="up-arrow"> <br /></p>
                                </div>
                            )}
                           
                            
                                
                        </div>

                        <div className="tree-row justify-content-center">

                            {paternalPaternalGreatGrandfatherName || paternalPaternalGreatGrandfatherBirthDate || paternalPaternalGreatGrandfatherBirthPlace || paternalPaternalGreatGrandfatherDeathDate || paternalPaternalGreatGrandfatherDeathPlace || paternalPaternalGreatGrandfatherOccupation || paternalPaternalGreatGrandfatherProfileNumber ? (
                                <table className="ancestor-box">
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}:</td>
                                        <td class="ancestor-box-border-bottom table-content"></td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandfatherName}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Birth: </td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandfatherBirthDate} <br />{paternalPaternalGreatGrandfatherBirthPlace}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Death:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandfatherDeathDate} <br />{paternalPaternalGreatGrandfatherDeathPlace}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandfatherOccupation}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Profile <br/>Number:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandfatherProfileNumber}</td>
                                    </tr>
                                </table>
                            ) : (
                                <>
                                {paternalGrandfatherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Father</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                                </>
                            )}
                          

                          {paternalPaternalGreatGrandmotherName || paternalPaternalGreatGrandmotherBirthDate || paternalPaternalGreatGrandmotherBirthPlace || paternalPaternalGreatGrandmotherDeathDate || paternalPaternalGreatGrandmotherDeathPlace || paternalPaternalGreatGrandmotherOccupation || paternalPaternalGreatGrandmotherProfileNumber ? (
                            <table className="ancestor-box">
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}:</td>
                                        <td class="ancestor-box-border-bottom table-content"></td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandmotherName}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Birth: </td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandmotherBirthDate} <br /> {paternalPaternalGreatGrandmotherBirthPlace}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Death:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandmotherDeathDate} <br/> {paternalPaternalGreatGrandmotherDeathPlace}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandmotherOccupation}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Profile <br/>Number:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalPaternalGreatGrandmotherProfileNumber}</td>
                                    </tr>
                            </table>
                        ) : (
                            <>
                                {paternalGrandfatherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Mother</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                                </>
                        )}

                        {paternalMaternalGreatGrandfatherName || paternalMaternalGreatGrandfatherBirthDate || paternalMaternalGreatGrandfatherBirthPlace || paternalMaternalGreatGrandfatherDeathDate || paternalMaternalGreatGrandfatherDeathPlace || paternalMaternalGreatGrandfatherOccupation || paternalMaternalGreatGrandfatherProfileNumber ? (
                        <table className="ancestor-box">
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}:</td>
                                        <td class="ancestor-box-border-bottom table-content"></td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandfatherName}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Birth: </td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandfatherBirthDate} <br /> {paternalMaternalGreatGrandfatherBirthPlace}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Death:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandfatherDeathDate} <br /> {paternalMaternalGreatGrandfatherDeathPlace}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandfatherOccupation}</td>
                                    </tr>
                                    <tr>
                                        <td class="ancestor-box-border-bottom table-label shrink">Profile <br/>Number:</td>
                                        <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandfatherProfileNumber}</td>
                                    </tr>
                            </table>
                            ): (
                                <>
                                {paternalGrandmotherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Father</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                                </>
                            )
                        }

                        {paternalMaternalGreatGrandmotherName || paternalMaternalGreatGrandmotherBirthDate || paternalMaternalGreatGrandmotherBirthPlace || paternalMaternalGreatGrandmotherDeathDate || paternalMaternalGreatGrandmotherDeathPlace || paternalMaternalGreatGrandmotherOccupation || paternalMaternalGreatGrandmotherProfileNumber ? (
                            <table className="ancestor-box">
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}:</td>
                                    <td class="ancestor-box-border-bottom table-content"></td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                    <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandmotherName}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Birth: </td>
                                    <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandmotherBirthDate} <br /> {paternalMaternalGreatGrandmotherBirthPlace}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Death:</td>
                                    <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandmotherDeathDate} <br /> {paternalMaternalGreatGrandmotherDeathPlace}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                    <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandmotherOccupation}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Profile <br/>Number:</td>
                                    <td class="ancestor-box-border-bottom table-content">{paternalMaternalGreatGrandmotherProfileNumber}</td>
                                </tr>
                        </table>
                        ) : (
                            <>
                            {paternalGrandmotherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Mother</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                            </>
                        )}
                            

                        {maternalPaternalGreatGrandfatherName || maternalPaternalGreatGrandfatherBirthDate || maternalPaternalGreatGrandfatherBirthPlace || maternalPaternalGreatGrandfatherDeathDate || maternalPaternalGreatGrandfatherDeathPlace || maternalPaternalGreatGrandfatherOccupation || maternalPaternalGreatGrandfatherProfileNumber ? (
                            <table className="ancestor-box">
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}:</td>
                                    <td class="ancestor-box-border-bottom table-content"></td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandfatherName}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Birth: </td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandfatherBirthDate} <br /> {maternalPaternalGreatGrandfatherBirthPlace}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Death:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandfatherDeathDate} <br /> {maternalPaternalGreatGrandfatherDeathPlace}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandfatherOccupation}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Profile <br/>Number:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandfatherProfileNumber}</td>
                                </tr>
                        </table>
                        ) : (
                            <>
                            {maternalGrandfatherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Father</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                            </>
                        )}
                            

                        {maternalPaternalGreatGrandmotherID ? (
                            <table className="ancestor-box">
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}:</td>
                                <td class="ancestor-box-border-bottom table-content"></td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandmotherName}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Birth: </td>
                                <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandmotherBirthDate} <br /> {maternalPaternalGreatGrandmotherBirthPlace}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Death:</td>
                                <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandmotherDeathDate} <br /> {maternalPaternalGreatGrandmotherDeathPlace}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandmotherOccupation}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Profile <br/>Number:</td>
                                <td class="ancestor-box-border-bottom table-content">{maternalPaternalGreatGrandmotherProfileNumber}</td>
                            </tr>
                    </table>
                        ) : (
                            <>
                            {maternalGrandfatherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Father</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                            </>
                        )}
                            

                            {maternalMaternalGreatGrandfatherID ? (
                                <table className="ancestor-box">
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}:</td>
                                    <td class="ancestor-box-border-bottom table-content"></td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandfatherName}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Birth: </td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandfatherBirthDate} <br /> {maternalMaternalGreatGrandfatherBirthPlace}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Death:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandfatherDeathDate} <br /> {maternalMaternalGreatGrandfatherDeathPlace}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandfatherOccupation}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Profile <br/>Number:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandfatherProfileNumber}</td>
                                </tr>
                        </table>
                            ) : (
                                <>
                            {maternalGrandmotherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Father</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                            </>
                            )}
                            

                            {maternalMaternalGreatGrandmotherID ? (
                                <table className="ancestor-box">
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}:</td>
                                    <td class="ancestor-box-border-bottom table-content"></td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandmotherName}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Birth: </td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandmotherBirthDate} <br /> {maternalMaternalGreatGrandmotherBirthPlace}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Death:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandmotherDeathDate} <br /> {maternalMaternalGreatGrandmotherDeathPlace}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandmotherOccupation}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Profile <br/>Number:</td>
                                    <td class="ancestor-box-border-bottom table-content">{maternalMaternalGreatGrandmotherProfileNumber}</td>
                                </tr>
                        </table>
                            ) : (
                                <>
                            {maternalGrandmotherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Mother</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                            </>
                            )}
                            

                            
                        </div>

                    </div>

                    {/*contains grandparents*/}
                    <div className="row tree-row">

                        <div className="tree-row justify-content-center">

                        {paternalGrandfatherID ? (
                             <table  className="ancestor-box">
                             <tr>
                                 <th class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}: </th>
                                 <th class="ancestor-box-border-bottom table-content" colspan="5"></th>
                             </tr>
                             <tr>
                                 <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                 <td class="ancestor-box-border-bottom table-content" colspan="5">{paternalGrandfatherName}</td>
                             </tr>
                             <tr>
                                 <td class="ancestor-box-border-right birth-date-cell table-label" rowspan="2">Birth</td>
                                 <td class="ancestor-box-border table-label shrink">date:</td>
                                 <td class="ancestor-box-border table-content">{paternalGrandfatherBirthDate}</td>
                                 <td class="birth-date-cell table-label" rowspan="2">Death</td>
                                 <td class="ancestor-box-border table-label shrink">date:</td>
                                 <td class="ancestor-box-border table-content">{paternalGrandfatherDeathDate}</td>
                             </tr>
                             <tr>
                                 <td class="ancestor-box-border table-label shrink">place:</td>
                                 <td class="ancestor-box-border table-content">{paternalGrandfatherBirthPlace}</td>
                                 <td class="ancestor-box-border table-label shrink">place:</td>
                                 <td class="ancestor-box-border table-content">{paternalGrandfatherDeathPlace}</td>
                             </tr>
                             <tr>
                                 <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                 <td class="ancestor-box-border table-content" colspan="5">{paternalGrandfatherOccupation}</td>
                             </tr>
                             <tr>
                                 <td class="ancestor-box-border-bottom table-label shrink">Profile Number:</td>
                                 <td class="ancestor-box-border table-content" colspan="5">{paternalGrandfatherProfileNumber}</td>
                             </tr>
                             </table>
                        ) : (
                            <>
                            {fatherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Father</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                            </>
                        )}
                       

                        {paternalGrandmotherID ? (
                            <table  className="ancestor-box">
                            <tr>
                                <th class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}: </th>
                                <th class="ancestor-box-border-bottom table-content" colspan="5"></th>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                <td class="ancestor-box-border-bottom table-content" colspan="5">{paternalGrandmotherName}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-right birth-date-cell table-label" rowspan="2">Birth</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{paternalGrandmotherBirthDate}</td>
                                <td class="birth-date-cell table-label" rowspan="2">Death</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{paternalGrandmotherDeathDate}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{paternalGrandmotherBirthPlace}</td>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{paternalGrandmotherDeathPlace}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{paternalGrandmotherOccupation}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Profile Number:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{paternalGrandmotherProfileNumber}</td>
                            </tr>
                            </table>
                        ) : (
                            <>
                            {fatherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Mother</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                            </>
                        )}
                        
                        {maternalGrandfatherID ? (
                            <table  className="ancestor-box">
                            <tr>
                                <th class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}: </th>
                                <th class="ancestor-box-border-bottom table-content" colspan="5"></th>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                <td class="ancestor-box-border-bottom table-content" colspan="5">{maternalGrandfatherName}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-right birth-date-cell table-label" rowspan="2">Birth</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{maternalGrandfatherBirthDate}</td>
                                <td class="birth-date-cell table-label" rowspan="2">Death</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{maternalGrandfatherDeathDate}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{maternalGrandfatherBirthPlace}</td>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{maternalGrandfatherDeathPlace}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{maternalGrandfatherOccupation}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Profile Number:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{maternalGrandfatherProfileNumber}</td>
                            </tr>
                            </table>
                        ) : (
                            <>
                            {motherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Father</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                            </>
                        )}
                        
                        {maternalGrandmotherID ? (
                            <table  className="ancestor-box">
                            <tr>
                                <th class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}: </th>
                                <th class="ancestor-box-border-bottom table-content" colspan="5"></th>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                <td class="ancestor-box-border-bottom table-content" colspan="5">{maternalGrandmotherName}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-right birth-date-cell table-label" rowspan="2">Birth</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{maternalGrandmotherBirthDate}</td>
                                <td class="birth-date-cell table-label" rowspan="2">Death</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{maternalGrandmotherDeathDate}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{maternalGrandmotherBirthPlace}</td>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{maternalGrandmotherDeathPlace}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{maternalGrandmotherOccupation}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Profile Number:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{maternalGrandmotherProfileNumber}</td>
                            </tr>
                            </table>
                        ) : (
                            <>
                            {motherID ? (
                                    <table className="unknown-ancestor">
                                        <tr><p></p></tr>
                                        <tr></tr>
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Mother</button></tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr></tr>
                                    </table>
                                ) : (
                                    <table className="empty-slot">
                                        <tr colspan="5" rowspan="6"><p></p></tr>
                                    </table>
                                )}
                            </>
                        )}
                        

                        </div>

                    </div>

                    {/*contains parents*/}
                    <div className="row tree-row">

                        <div className="tree-row justify-content-center">

                        {fatherID ? (
                            <table  className="ancestor-box">
                            <tr>
                                <th class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}: </th>
                                <th class="ancestor-box-border-bottom table-content" colspan="5"></th>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                <td class="ancestor-box-border-bottom table-content" colspan="5">{fatherName}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-right birth-date-cell table-label" rowspan="2">Birth</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{fatherBirthDate}</td>
                                <td class="birth-date-cell table-label" rowspan="2">Death</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{fatherDeathDate}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{fatherBirthPlace}</td>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{fatherDeathPlace}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{fatherOccupation}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Profile Number:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{fatherProfileNumber}</td>
                            </tr>
                    </table>
                        ) : (
                            <table className="unknown-ancestor">
                                <tr><p></p></tr>
                                <tr></tr>
                                <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Father</button></tr>
                                <tr></tr>
                                <tr></tr>
                                <tr></tr>
                            </table>
                        )}
                        
                        {motherID ? (
                            <table  className="ancestor-box">
                            <tr>
                                <th class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}: </th>
                                <th class="ancestor-box-border-bottom table-content" colspan="5"></th>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                <td class="ancestor-box-border-bottom table-content" colspan="5">{motherName}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-right birth-date-cell table-label" rowspan="2">Birth</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{motherBirthDate}</td>
                                <td class="birth-date-cell table-label" rowspan="2">Death</td>
                                <td class="ancestor-box-border table-label shrink">date:</td>
                                <td class="ancestor-box-border table-content">{motherDeathDate}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{motherBirthPlace}</td>
                                <td class="ancestor-box-border table-label shrink">place:</td>
                                <td class="ancestor-box-border table-content">{motherDeathPlace}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{motherOccupation}</td>
                            </tr>
                            <tr>
                                <td class="ancestor-box-border-bottom table-label shrink">Profile Number:</td>
                                <td class="ancestor-box-border table-content" colspan="5">{motherProfileNumber}</td>
                            </tr>
                            </table>
                        ) : (
                            <table className="unknown-ancestor">
                                <tr><p></p></tr>
                                <tr></tr>
                                <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button>Add Mother</button></tr>
                                <tr></tr>
                                <tr></tr>
                                <tr></tr>
                            </table>
                        )}
                        

                        </div>

                    </div>

                    {/*person at the bottom of page*/}
                    <div className="row tree-row">

                        <div classname="col-sm ">

                            <div className="tree-row justify-content-center">

                                <table  className="ancestor-box">
                                <tr>
                                    <th class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}: </th>
                                    <th class="ancestor-box-border-bottom table-content" colspan="5"></th>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                    <td class="ancestor-box-border-bottom table-content" colspan="5">{bottomPagePersonName}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-right birth-date-cell table-label" rowspan="2">Birth</td>
                                    <td class="ancestor-box-border table-label shrink">date:</td>
                                    <td class="ancestor-box-border table-content">{bottomPagePersonBirthDate}</td>
                                    <td class="birth-date-cell table-label" rowspan="2">Death</td>
                                    <td class="ancestor-box-border table-label shrink">date:</td>
                                    <td class="ancestor-box-border table-content">{bottomPagePersonDeathDate}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border table-label shrink">place:</td>
                                    <td class="ancestor-box-border table-content">{bottomPagePersonBirthPlace}</td>
                                    <td class="ancestor-box-border table-label shrink">place:</td>
                                    <td class="ancestor-box-border table-content">{bottomPagePersonDeathPlace}</td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                                    <td class="ancestor-box-border table-content" colspan="2">{bottomPagePersonOccupation}</td>
                                    <td class="ancestor-box-border table-label shrink">Spouse</td>
                                    <td class="ancestor-box-border table-content" colspan="2"></td>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Profile Number:</td>
                                    <td class="ancestor-box-border table-content" colspan="2">{bottomPagePersonProfileNumber}</td>
                                    <td class="ancestor-box-border table-label shrink">Spouse Page</td>
                                    <td class="ancestor-box-border table-content" colspan="2"></td>
                                </tr>
                                </table>
                            
                            </div>

                            <div className="col">
                                <p className="up-arrow">⇓</p>
                            </div>

                            
                        </div>
                    </div>

                    </div>

                </div>

                <div className="row bottom-bar">

                    <div className="bottom-bar-content">
                        <p>Current Page: /</p>

                        <div className="bottom-bar-searching">
                            <label style={{marginRight:"3px"}}>Go To Page</label>
                            <input style={{marginRight:"3px"}} type="text" className="bottom-bar-search"></input>
                            <button style={{marginRight:"10px"}} className="bottom-bar-button">Go</button>
                            <button style={{marginRight:"3px"}} className="bottom-bar-button">Return To Base Person</button>
                            <button style={{marginRight:"3px"}} className="bottom-bar-button">Random Page</button>
                        </div>

                    </div>

                </div>
                    
                </div>

            </div>


        </div>
    )
}

export default FamilyTree;