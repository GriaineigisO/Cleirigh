import LeftSidebar from "../Components/leftSidebar"
import React, { useState, useEffect, Component } from 'react';
import { convertDate, convertNumToRelation } from '../library.js';
import { Modal, Button } from 'react-bootstrap';

//paternalpaternalgreatgrandparents = paternal grandfather's parents
//paternalmaternalgreatgrandparents = paternal grandmother's parents
//maternalpaternalgrandparents = maternal grandfather's parents
//maternalmaternalgrandparents = maternal grandmother's parents

const FamilyTree = () => {

    const [showFather, setShowFather] = useState(false);
    const [showMother, setShowMother] = useState(false);
    const [showPaternalGrandfather, setShowPaternalGrandfather] = useState(false);

    const closeAddFatherModal = () => setShowFather(false);
    const openAddFatherModal = () => setShowFather(true);

    const closeAddMotherModal = () => setShowMother(false);
    const openAddMotherModal = () => setShowMother(true);

    const closeAddPaternalGrandfatherModal = () => setShowPaternalGrandfather(false);
    const openAddPaternalGrandfatherModal = () => setShowPaternalGrandfather(true);

    const [fatherDetails, setFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        titles: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [motherDetails, setMotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        titles: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalGrandfatherDetails, setPaternalGrandfatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        titles: null,
        ethnicity: null,
        relationTouser: null,
      });

   


    const [pageNumber, setPageNumber] = useState(1);

    const [bottomPagePersonFirstName, setBottomPagePersonFirstName] = useState('');
    const [bottomPagePersonLastName, setBottomPagePersonLastName] = useState('');
    const [bottomPagePersonFullName, setBottomPagePersonFullName] = useState('');
    const [bottomPagePersonEthnicity, setBottomPagePersonEthnicity] = useState('');
    const [bottomPersonSex, setBottomPersonSex] = useState('');
    const [bottomRelationToBaseUser, setBottomRelationToBaseUser] = useState('');
    const [basePersonSex, setBasePersonSex] = useState('');
    const [basePersonEthnicity, setBasePersonEthnicity] = useState('');

    const [basePersonFirstName, setBasePersonFirstName] = useState('');
    const [basePersonFullName, setBasePersonFullName] = useState('');
    const [basePersonLastName, setBasePersonLastName] = useState('');
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

    const [fatherFirstName, setFatherFirstName] = useState('');
    const [motherFirstName, setMotherFirstName] = useState('');
    const [paternalGrandmotherFirstName, setPaternalGrandmotherFirstName] = useState('');
    const [paternalGrandfatherFirstName, setPaternalGrandfatherFirstName] = useState('');
    const [maternalGrandmotherFirstName, setMaternalGrandmotherFirstName] = useState('');
    const [maternalGrandfatherFirstName, setMaternalGrandfatherFirstName] = useState('');
    const [paternalPaternalGreatGrandmotherFirstName, setPaternalPaternalGreatGrandmotherFirstName] = useState('');
    const [paternalPaternalGreatGrandfatherFirstName, setPaternalPaternalGreatGrandfatherFirstName] = useState('');
    const [paternalMaternalGreatGrandmotherFirstName, setPaternalMaternalGreatGrandmotherFirstName] = useState('');
    const [paternalMaternalGreatGrandfatherFirstName, setPaternalMaternalGreatGrandfatherFirstName] = useState('');
    const [maternalPaternalGreatGrandmotherFirstName, setMaternalPaternalGreatGrandmotherFirstName] = useState('');
    const [maternalPaternalGreatGrandfatherFirstName, setMaternalPaternalGreatGrandfatherFirstName] = useState('');
    const [maternalMaternalGreatGrandmotherFirstName, setMaternalMaternalGreatGrandmotherFirstName] = useState('');
    const [maternalMaternalGreatGrandfatherFirstName, setMaternalMaternalGreatGrandfatherFirstName] = useState('');

    const [fatherMiddleName, setFatherMiddleName] = useState('');
    const [motherMiddleName, setMotherMiddleName] = useState('');
    const [paternalGrandmotherMiddleName, setPaternalGrandmotherMiddleName] = useState('');
    const [paternalGrandfatherMiddleName, setPaternalGrandfatherMiddleName] = useState('');
    const [maternalGrandmotherMiddleName, setMaternalGrandmotherMiddleName] = useState('');
    const [maternalGrandfatherMiddleName, setMaternalGrandfatherMiddleName] = useState('');
    const [paternalPaternalGreatGrandmotherMiddleName, setPaternalPaternalGreatGrandmotherMiddleName] = useState('');
    const [paternalPaternalGreatGrandfatherMiddleName, setPaternalPaternalGreatGrandfatherMiddleName] = useState('');
    const [paternalMaternalGreatGrandmotherMiddleName, setPaternalMaternalGreatGrandmotherMiddleName] = useState('');
    const [paternalMaternalGreatGrandfatherMiddleName, setPaternalMaternalGreatGrandfatherMiddleName] = useState('');
    const [maternalPaternalGreatGrandmotherMiddleName, setMaternalPaternalGreatGrandmotherMiddleName] = useState('');
    const [maternalPaternalGreatGrandfatherMiddleName, setMaternalPaternalGreatGrandfatherMiddleName] = useState('');
    const [maternalMaternalGreatGrandmotherMiddleName, setMaternalMaternalGreatGrandmotherMiddleName] = useState('');
    const [maternalMaternalGreatGrandfatherMiddleName, setMaternalMaternalGreatGrandfatherMiddleName] = useState('');


    const [fatherLastName, setFatherLastName] = useState('');
    const [motherLastName, setMotherLastName] = useState('');
    const [paternalGrandmotherLastName, setPaternalGrandmotherLastName] = useState('');
    const [paternalGrandfatherLastName, setPaternalGrandfatherLastName] = useState('');
    const [maternalGrandmotherLastName, setMaternalGrandmotherLastName] = useState('');
    const [maternalGrandfatherLastName, setMaternalGrandfatherLastName] = useState('');
    const [paternalPaternalGreatGrandmotherLastName, setPaternalPaternalGreatGrandmotherLastName] = useState('');
    const [paternalPaternalGreatGrandfatherLastName, setPaternalPaternalGreatGrandfatherLastName] = useState('');
    const [paternalMaternalGreatGrandmotherLastName, setPaternalMaternalGreatGrandmotherLastName] = useState('');
    const [paternalMaternalGreatGrandfatherLastName, setPaternalMaternalGreatGrandfatherLastName] = useState('');
    const [maternalPaternalGreatGrandmotherLastName, setMaternalPaternalGreatGrandmotherLastName] = useState('');
    const [maternalPaternalGreatGrandfatherLastName, setMaternalPaternalGreatGrandfatherLastName] = useState('');
    const [maternalMaternalGreatGrandmotherLastName, setMaternalMaternalGreatGrandmotherLastName] = useState('');
    const [maternalMaternalGreatGrandfatherLastName, setMaternalMaternalGreatGrandfatherLastName] = useState('');

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

    const [fatherRelationToUser, setFatherRelationToUser] = useState('');
    const [motherRelationToUser, setMotherRelationToUser] = useState('');
    const [paternalGrandmotherRelationToUser, setPaternalGrandmotherRelationToUser] = useState('');
    const [paternalGrandfatherRelationToUser, setPaternalGrandfatherRelationToUser] = useState('');
    const [maternalGrandmotherRelationToUser, setMaternalGrandmotherRelationToUser] = useState('');
    const [maternalGrandfatherRelationToUser, setMaternalGrandfatherRelationToUser] = useState('');
    const [paternalPaternalGreatGrandmotherRelationToUser, setPaternalPaternalGreatGrandmotherRelationToUser] = useState('');
    const [paternalPaternalGreatGrandfatherRelationToUser, setPaternalPaternalGreatGrandfatherRelationToUser] = useState('');
    const [paternalMaternalGreatGrandmotherRelationToUser, setPaternalMaternalGreatGrandmotherRelationToUser] = useState('');
    const [paternalMaternalGreatGrandfatherRelationToUser, setPaternalMaternalGreatGrandfatherRelationToUser] = useState('');
    const [maternalPaternalGreatGrandmotherRelationToUser, setMaternalPaternalGreatGrandmotherRelationToUser] = useState('');
    const [maternalPaternalGreatGrandfatherRelationToUser, setMaternalPaternalGreatGrandfatherRelationToUser] = useState('');
    const [maternalMaternalGreatGrandmotherRelationToUser, setMaternalMaternalGreatGrandmotherRelationToUser] = useState('');
    const [maternalMaternalGreatGrandfatherRelationToUser, setMaternalMaternalGreatGrandfatherRelationToUser] = useState('');

    const [fatherEthnicity, setFatherEthnicity] = useState('');
    const [motherEthnicity, setMotherEthnicity] = useState('');
    const [paternalGrandmotherEthnicity, setPaternalGrandmotherEthnicity] = useState('');
    const [paternalGrandfatherEthnicity, setPaternalGrandfatherEthnicity] = useState('');
    const [maternalGrandmotherEthnicity, setMaternalGrandmotherEthnicity] = useState('');
    const [maternalGrandfatherEthnicity, setMaternalGrandfatherEthnicity] = useState('');
    const [paternalPaternalGreatGrandmotherEthnicity, setPaternalPaternalGreatGrandmotherEthnicity] = useState('');
    const [paternalPaternalGreatGrandfatherEthnicity, setPaternalPaternalGreatGrandfatherEthnicity] = useState('');
    const [paternalMaternalGreatGrandmotherEthnicity, setPaternalMaternalGreatGrandmotherEthnicity] = useState('');
    const [paternalMaternalGreatGrandfatherEthnicity, setPaternalMaternalGreatGrandfatherEthnicity] = useState('');
    const [maternalPaternalGreatGrandmotherEthnicity, setMaternalPaternalGreatGrandmotherEthnicity] = useState('');
    const [maternalPaternalGreatGrandfatherEthnicity, setMaternalPaternalGreatGrandfatherEthnicity] = useState('');
    const [maternalMaternalGreatGrandmotherEthnicity, setMaternalMaternalGreatGrandmotherEthnicity] = useState('');
    const [maternalMaternalGreatGrandfatherEthnicity, setMaternalMaternalGreatGrandfatherEthnicity] = useState('');

    const [fatherCauseOfDeath, setFatherCauseOfDeath] = useState('');
    const [motherCauseOfDeath, setMotherCauseOfDeath] = useState('');
    const [paternalGrandmotherCauseOfDeath, setPaternalGrandmotherCauseOfDeath] = useState('');
    const [paternalGrandfatherCauseOfDeath, setPaternalGrandfatherCauseOfDeath] = useState('');
    const [maternalGrandmotherCauseOfDeath, setMaternalGrandmotherCauseOfDeath] = useState('');
    const [maternalGrandfatherCauseOfDeath, setMaternalGrandfatherCauseOfDeath] = useState('');
    const [paternalPaternalGreatGrandmotherCauseOfDeath, setPaternalPaternalGreatGrandmotherCauseOfDeath] = useState('');
    const [paternalPaternalGreatGrandfatherCauseOfDeath, setPaternalPaternalGreatGrandfatherCauseOfDeath] = useState('');
    const [paternalMaternalGreatGrandmotherCauseOfDeath, setPaternalMaternalGreatGrandmotherCauseOfDeath] = useState('');
    const [paternalMaternalGreatGrandfatherCauseOfDeath, setPaternalMaternalGreatGrandfatherCauseOfDeath] = useState('');
    const [maternalPaternalGreatGrandmotherCauseOfDeath, setMaternalPaternalGreatGrandmotherCauseOfDeath] = useState('');
    const [maternalPaternalGreatGrandfatherCauseOfDeath, setMaternalPaternalGreatGrandfatherCauseOfDeath] = useState('');
    const [maternalMaternalGreatGrandmotherCauseOfDeath, setMaternalMaternalGreatGrandmotherCauseOfDeath] = useState('');
    const [maternalMaternalGreatGrandfatherCauseOfDeath, setMaternalMaternalGreatGrandfatherCauseOfDeath] = useState('');

    

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
            setBasePersonFullName(data.fullName);
            setBasePersonLastName(data.lastName);
            setBasePersonID(data.basePersonID);
            setBasePersonBirthDate(data.birthDate);
            setBasePersonBirthPlace(data.birthPlace);
            setBasePersonDeathDate(data.deathDate);
            setBasePersonDeathPlace(data.deathPlace);
            setBasePersonOccupation(data.occupation);
            setBasePersonEthnicity(data.ethnicity);
            setBasePersonProfileNumber(data.profileNumber);
            setBasePersonSex(data.sex)
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
            
            if (basePersonID) {
            //if the user is on page 1, then the bottom person will always be the base person
            if (pageNumber === Number(1)) {
                setBottomPagePersonFirstName(basePersonFirstName);
                setBottomPagePersonLastName(basePersonLastName);
                setBottomPagePersonFullName(basePersonFullName);
                setBottomPagePersonID(basePersonID);
                setBottomPagePersonBirthDate(basePersonBirthDate);
                setBottomPagePersonBirthPlace(basePersonBirthPlace);
                setBottomPagePersonDeathDate(basePersonDeathDate);
                setBottomPagePersonDeathPlace(basePersonDeathPlace);
                setBottomPagePersonOccupation(basePersonOccupation);
                setBottomPagePersonEthnicity(basePersonEthnicity);
                setBottomPagePersonProfileNumber(basePersonID);
                setBottomPersonSex(basePersonSex);
                setBottomRelationToBaseUser(0)
            }

            }
        }
        getCurrentPageNumber();
    }, [basePersonID])



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
            setFatherFirstName(data.fatherFirstName);
            setFatherMiddleName(data.fatherMiddleName);
            setFatherLastName(data.fatherLastName);
            setFatherID(data.fatherID);
            setFatherBirthDate(data.fatherBirthDate);
            setFatherBirthPlace(data.fatherBirthPlace);
            setFatherDeathDate(data.fatherDeathDate);
            setFatherDeathPlace(data.fatherDeathPlace);
            setFatherOccupation(data.fatherOccupation);
            setFatherProfileNumber(data.fatherProfileNumber);
            setFatherRelationToUser(data.relation_to_user)
            setFatherEthnicity(data.fatherEthnicity);
            console.log(fatherEthnicity)
            setFatherCauseOfDeath(data.causeOfDeath);
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
            setMotherFirstName(data.motherFirstName);
            setMotherMiddleName(data.motherMiddleName);
            setMotherLastName(data.motherLastName);
            setMotherBirthDate(data.motherBirthDate);
            setMotherBirthPlace(data.motherBirthPlace);
            setMotherDeathDate(data.motherDeathDate);
            setMotherDeathPlace(data.motherDeathPlace);
            setMotherOccupation(data.motherOccupation);
            setMotherProfileNumber(data.motherProfileNumber);
            setMotherRelationToUser(data.relation_to_user);
            setMotherEthnicity(data.ethnicity);
            setMotherCauseOfDeath(data.causeOfDeath);
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
            setPaternalGrandfatherFirstName(data.fatherFirstName);
            setPaternalGrandfatherMiddleName(data.fatherMiddleName);
            setPaternalGrandfatherLastName(data.fatherLastName);
            setPaternalGrandfatherID(data.fatherID);
            setPaternalGrandfatherBirthDate(data.fatherBirthDate);
            setPaternalGrandfatherBirthPlace(data.fatherBirthPlace);
            setPaternalGrandfatherDeathDate(data.fatherDeathDate);
            setPaternalGrandfatherDeathPlace(data.fatherDeathPlace);
            setPaternalGrandfatherOccupation(data.fatherOccupation);
            setPaternalGrandfatherProfileNumber(data.fatherProfileNumber);
            setPaternalGrandfatherRelationToUser(data.relation_to_user)
            setPaternalGrandfatherEthnicity(data.ethnicity);
            setPaternalGrandfatherCauseOfDeath(data.causeOfDeath);
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
            setPaternalGrandmotherFirstName(data.motherFirstName);
            setPaternalGrandmotherMiddleName(data.motherMiddleName);
            setPaternalGrandmotherLastName(data.motherLastName);
            setPaternalGrandmotherBirthDate(data.motherBirthDate);
            setPaternalGrandmotherBirthPlace(data.motherBirthPlace);
            setPaternalGrandmotherDeathDate(data.motherDeathDate);
            setPaternalGrandmotherDeathPlace(data.motherDeathPlace);
            setPaternalGrandmotherOccupation(data.motherOccupation);
            setPaternalGrandmotherProfileNumber(data.motherProfileNumber);
            setPaternalGrandmotherEthnicity(data.ethnicity);
            setPaternalGrandmotherCauseOfDeath(data.causeOfDeath);
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
            setMaternalGrandfatherFirstName(data.fatherFirstName);
            setMaternalGrandfatherMiddleName(data.fatherMiddleName);
            setMaternalGrandfatherLastName(data.fatherLastName);
            setMaternalGrandfatherBirthDate(data.fatherBirthDate);
            setMaternalGrandfatherBirthPlace(data.fatherBirthPlace);
            setMaternalGrandfatherDeathDate(data.fatherDeathDate);
            setMaternalGrandfatherDeathPlace(data.fatherDeathPlace);
            setMaternalGrandfatherOccupation(data.fatherOccupation);
            setMaternalGrandfatherProfileNumber(data.fatherProfileNumber);
            setMaternalGrandfatherEthnicity(data.ethnicity);
            setMaternalGrandfatherCauseOfDeath(data.causeOfDeath);
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
            setMaternalGrandmotherFirstName(data.motherFirstName);
            setMaternalGrandmotherMiddleName(data.motherMiddleName);
            setMaternalGrandmotherLastName(data.motherLastName);
            setMaternalGrandmotherBirthDate(data.motherBirthDate);
            setMaternalGrandmotherBirthPlace(data.motherBirthPlace);
            setMaternalGrandmotherDeathDate(data.motherDeathDate);
            setMaternalGrandmotherDeathPlace(data.motherDeathPlace);
            setMaternalGrandmotherOccupation(data.motherOccupation);
            setMaternalGrandmotherProfileNumber(data.motherProfileNumber);
            setMaternalGrandmotherEthnicity(data.ethnicity);
            setMaternalGrandmotherCauseOfDeath(data.causeOfDeath);
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
            setPaternalPaternalGreatGrandfatherFirstName(data.fatherFirstName);
            setPaternalPaternalGreatGrandfatherMiddleName(data.fatherMiddleName);
            setPaternalPaternalGreatGrandfatherLastName(data.fatherLastName);
            setPaternalPaternalGreatGrandfatherBirthDate(data.fatherBirthDate);
            setPaternalPaternalGreatGrandfatherBirthPlace(data.fatherBirthPlace);
            setPaternalPaternalGreatGrandfatherDeathDate(data.fatherDeathDate);
            setPaternalPaternalGreatGrandfatherDeathPlace(data.fatherDeathPlace);
            setPaternalPaternalGreatGrandfatherOccupation(data.fatherOccupation);
            setPaternalPaternalGreatGrandfatherProfileNumber(data.fatherProfileNumber);
            setPaternalPaternalGreatGrandfatherEthnicity(data.ethnicity);
            setPaternalPaternalGreatGrandfatherCauseOfDeath(data.causeOfDeath);
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
            setPaternalPaternalGreatGrandmotherFirstName(data.motherFirstName);
            setPaternalPaternalGreatGrandmotherMiddleName(data.motherMiddleName);
            setPaternalPaternalGreatGrandmotherLastName(data.motherLastName);
            setPaternalPaternalGreatGrandmotherBirthDate(data.motherBirthDate);
            setPaternalPaternalGreatGrandmotherBirthPlace(data.motherBirthPlace);
            setPaternalPaternalGreatGrandmotherDeathDate(data.motherDeathDate);
            setPaternalPaternalGreatGrandmotherDeathPlace(data.motherDeathPlace);
            setPaternalPaternalGreatGrandmotherOccupation(data.motherOccupation);
            setPaternalPaternalGreatGrandmotherProfileNumber(data.motherProfileNumber);
            setPaternalPaternalGreatGrandmotherEthnicity(data.ethnicity);
            setPaternalPaternalGreatGrandmotherCauseOfDeath(data.causeOfDeath);
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
            setPaternalMaternalGreatGrandfatherFirstName(data.fatherFirstName);
            setPaternalMaternalGreatGrandfatherMiddleName(data.fatherMiddleName);
            setPaternalMaternalGreatGrandfatherLastName(data.fatherLastName);
            setPaternalMaternalGreatGrandfatherBirthDate(data.fatherBirthDate);
            setPaternalMaternalGreatGrandfatherBirthPlace(data.fatherBirthPlace);
            setPaternalMaternalGreatGrandfatherDeathDate(data.fatherDeathDate);
            setPaternalMaternalGreatGrandfatherDeathPlace(data.fatherDeathPlace);
            setPaternalMaternalGreatGrandfatherOccupation(data.fatherOccupation);
            setPaternalMaternalGreatGrandfatherProfileNumber(data.fatherProfileNumber);
            setPaternalMaternalGreatGrandfatherEthnicity(data.ethnicity);
            setPaternalMaternalGreatGrandfatherCauseOfDeath(data.causeOfDeath);
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
            setPaternalMaternalGreatGrandmotherFirstName(data.motherFirstName);
            setPaternalMaternalGreatGrandmotherMiddleName(data.motherMiddleName);
            setPaternalMaternalGreatGrandmotherLastName(data.motherLastName);
            setPaternalMaternalGreatGrandmotherBirthDate(data.motherBirthDate);
            setPaternalMaternalGreatGrandmotherBirthPlace(data.motherBirthPlace);
            setPaternalMaternalGreatGrandmotherDeathDate(data.motherDeathDate);
            setPaternalMaternalGreatGrandmotherDeathPlace(data.motherDeathPlace);
            setPaternalMaternalGreatGrandmotherOccupation(data.motherOccupation);
            setPaternalMaternalGreatGrandmotherProfileNumber(data.motherProfileNumber);
            setPaternalMaternalGreatGrandmotherEthnicity(data.ethnicity);
            setPaternalMaternalGreatGrandmotherCauseOfDeath(data.causeOfDeath);
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
            setMaternalPaternalGreatGrandfatherFirstName(data.fatherFirstName);
            setMaternalPaternalGreatGrandfatherMiddleName(data.fatherMiddleName);
            setMaternalPaternalGreatGrandfatherLastName(data.fatherLastName);
            setMaternalPaternalGreatGrandfatherBirthDate(data.fatherBirthDate);
            setMaternalPaternalGreatGrandfatherBirthPlace(data.fatherBirthPlace);
            setMaternalPaternalGreatGrandfatherDeathDate(data.fatherDeathDate);
            setMaternalPaternalGreatGrandfatherDeathPlace(data.fatherDeathPlace);
            setMaternalPaternalGreatGrandfatherOccupation(data.fatherOccupation);
            setMaternalPaternalGreatGrandfatherProfileNumber(data.fatherProfileNumber);
            setMaternalPaternalGreatGrandfatherEthnicity(data.ethnicity);
            setMaternalPaternalGreatGrandfatherCauseOfDeath(data.causeOfDeath);
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
            setMaternalPaternalGreatGrandmotherFirstName(data.motherFirstName);
            setMaternalPaternalGreatGrandmotherMiddleName(data.motherMiddleName);
            setMaternalPaternalGreatGrandmotherLastName(data.motherLastName);
            setMaternalPaternalGreatGrandmotherBirthDate(data.motherBirthDate);
            setMaternalPaternalGreatGrandmotherBirthPlace(data.motherBirthPlace);
            setMaternalPaternalGreatGrandmotherDeathDate(data.motherDeathDate);
            setMaternalPaternalGreatGrandmotherDeathPlace(data.motherDeathPlace);
            setMaternalPaternalGreatGrandmotherOccupation(data.motherOccupation);
            setMaternalPaternalGreatGrandmotherProfileNumber(data.motherProfileNumber);
            setMaternalPaternalGreatGrandmotherEthnicity(data.ethnicity);
            setMaternalPaternalGreatGrandmotherCauseOfDeath(data.causeOfDeath);
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
            setMaternalMaternalGreatGrandfatherFirstName(data.fatherFirstName);
            setMaternalMaternalGreatGrandfatherMiddleName(data.fatherMiddleName);
            setMaternalMaternalGreatGrandfatherLastName(data.fatherLastName);
            setMaternalMaternalGreatGrandfatherBirthDate(data.fatherBirthDate);
            setMaternalMaternalGreatGrandfatherBirthPlace(data.fatherBirthPlace);
            setMaternalMaternalGreatGrandfatherDeathDate(data.fatherDeathDate);
            setMaternalMaternalGreatGrandfatherDeathPlace(data.fatherDeathPlace);
            setMaternalMaternalGreatGrandfatherOccupation(data.fatherOccupation);
            setMaternalMaternalGreatGrandfatherProfileNumber(data.fatherProfileNumber);
            setMaternalMaternalGreatGrandfatherEthnicity(data.ethnicity);
            setMaternalMaternalGreatGrandfatherCauseOfDeath(data.causeOfDeath);
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
            setMaternalMaternalGreatGrandmotherFirstName(data.motherFirstName);
            setMaternalMaternalGreatGrandmotherMiddleName(data.motherMiddleName);
            setMaternalMaternalGreatGrandmotherLastName(data.motherLastName);
            setMaternalMaternalGreatGrandmotherBirthDate(data.motherBirthDate);
            setMaternalMaternalGreatGrandmotherBirthPlace(data.motherBirthPlace);
            setMaternalMaternalGreatGrandmotherDeathDate(data.motherDeathDate);
            setMaternalMaternalGreatGrandmotherDeathPlace(data.motherDeathPlace);
            setMaternalMaternalGreatGrandmotherOccupation(data.motherOccupation);
            setMaternalMaternalGreatGrandmotherProfileNumber(data.motherProfileNumber);
            setMaternalMaternalGreatGrandmotherEthnicity(data.ethnicity);
            setMaternalMaternalGreatGrandmotherCauseOfDeath(data.causeOfDeath);
        }
    }
    getMaternalMaternalGreatGrandMother();
}, [maternalGrandmotherID])


    const handleNavigateUpwards = (personID) => {
        window.location.reload();
    };

    
    //updates fatherDetails whenever it changes
        useEffect(() => {
            if (!fatherDetails.lastName && bottomPagePersonLastName) {
                setFatherDetails((prev) => ({
                  ...prev,
                  lastName: bottomPagePersonLastName,
                }));
              }
        }, [fatherDetails.lastName, bottomPagePersonLastName]);

        useEffect(() => {
            if (!fatherDetails.ethnicity && bottomPagePersonEthnicity) {
                setFatherDetails((prev) => ({
                  ...prev,
                  ethnicity: bottomPagePersonEthnicity,
                }));
              }
        }, [fatherDetails.ethnicity, bottomPagePersonEthnicity]);

        //updates motherDetails whenever it changes
        useEffect(() => {
            if (!motherDetails.ethnicity && bottomPagePersonEthnicity) {
                setMotherDetails((prev) => ({
                  ...prev,
                  ethnicity: bottomPagePersonEthnicity,
                }));
              }
        }, [motherDetails.ethnicity, bottomPagePersonEthnicity]);


        useEffect(() => {
            if (!paternalGrandfatherDetails.lastName && fatherLastName) {
                setPaternalGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: fatherLastName,
                  }))
              }
        }, [paternalGrandfatherDetails.lastName, fatherLastName]);

        useEffect(() => {
            if (!paternalGrandfatherDetails.ethnicity  && fatherEthnicity) {
                setPaternalGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: fatherEthnicity,
                  }))
              }
        }, [paternalGrandfatherDetails.ethnicity, fatherEthnicity]);


    const saveFatherChanges = async () => {
        setShowFather(false)
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/save-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, fatherDetails, bottomPagePersonID }),
            })   
            
            const data = await response.json()
            window.location.reload();
        } catch (error) {
            console.log("Error saving father changes:", error)
        }
    }

    const saveMotherChanges = async () => {
        setShowMother(false)
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/save-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, motherDetails, bottomPagePersonID }),
            })   
            
            const data = await response.json()
            window.location.reload();
        } catch (error) {
            console.log("Error saving father changes:", error)
        }
    }

    const savePaternalGrandfatherChanges = async () => {
        setShowPaternalGrandfather(false)
        try {
            console.log(paternalGrandfatherDetails.firstName)
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/save-paternal-grandfather', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, paternalGrandfatherDetails, fatherID }),
            })   
            
            const data = await response.json()
            window.location.reload();
        } catch (error) {
            console.log("Error saving paternal grandfather changes:", error)
        }
    }



    return (
        <div>

            <Modal show={showFather} onHide={closeAddFatherModal} dialogClassName="custom-modal-width">
                <Modal.Header closeButton>
                <Modal.Title>Add {bottomPagePersonFirstName}'s Father</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-modal">
                        <input  type="text" placeholder="First Name" onChange={(e) => setFatherDetails({ ...fatherDetails, firstName: e.target.value })}></input>

                        <input type="text" placeholder="Middle Name" onChange={(e) => setFatherDetails({ ...fatherDetails, middleName: e.target.value })}></input>

                        <input type="text" placeholder="Last Name"  value={fatherDetails.lastName} onChange={(e) => setFatherDetails({...fatherDetails, lastName: e.target.value})}></input>
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Birth Date" onChange={(e) => setFatherDetails({ ...fatherDetails, birthDate: e.target.value })}></input>

                    <input type="text" placeholder="Birth Place" onChange={(e) => setFatherDetails({ ...fatherDetails, birthPlace: e.target.value })}></input>
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Death Date" onChange={(e) => setFatherDetails({ ...fatherDetails, deathDate: e.target.value })}></input>

                    <input type="text" placeholder="Death Place" onChange={(e) => setFatherDetails({ ...fatherDetails, deathPlace: e.target.value })}></input>

                    <input type="text" placeholder="Cause of Death" onChange={(e) => setFatherDetails({ ...fatherDetails, causeOfDeath: e.target.value })}></input>
                    </div>
                   
                    <div className="input-modal">
                    <input type="text" placeholder="Titles/Occupations" onChange={(e) => setFatherDetails({ ...fatherDetails, titles: e.target.value })}></input>

                    <input type="text" placeholder="Ethnicity" value={fatherDetails.ethnicity} onChange={(e) => setFatherDetails({...fatherDetails, ethnicity: e.target.value})}></input>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeAddFatherModal}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={saveFatherChanges}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showMother} onHide={closeAddMotherModal} dialogClassName="custom-modal-width">
                <Modal.Header closeButton>
                <Modal.Title>Add {bottomPagePersonFirstName}'s Mother</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-modal">
                        <input  type="text" placeholder="First Name" onChange={(e) => setMotherDetails({ ...motherDetails, firstName: e.target.value })}></input>

                        <input type="text" placeholder="Middle Name" onChange={(e) => setMotherDetails({ ...motherDetails, middleName: e.target.value })}></input>

                        <input type="text" placeholder="Last Name"  onChange={(e) => setMotherDetails({...motherDetails, lastName: e.target.value})}></input>
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Birth Date" onChange={(e) => setMotherDetails({ ...motherDetails, birthDate: e.target.value })}></input>

                    <input type="text" placeholder="Birth Place" onChange={(e) => setMotherDetails({ ...motherDetails, birthPlace: e.target.value })}></input>
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Death Date" onChange={(e) => setMotherDetails({ ...motherDetails, deathDate: e.target.value })}></input>

                    <input type="text" placeholder="Death Place" onChange={(e) => setMotherDetails({ ...motherDetails, deathPlace: e.target.value })}></input>

                    <input type="text" placeholder="Cause of Death" onChange={(e) => setMotherDetails({ ...motherDetails, causeOfDeath: e.target.value })}></input>
                    </div>
                   
                    <div className="input-modal">
                    <input type="text" placeholder="Titles/Occupations" onChange={(e) => setMotherDetails({ ...motherDetails, titles: e.target.value })}></input>

                    <input type="text" placeholder="Ethnicity" value={motherDetails.ethnicity} onChange={(e) => setMotherDetails({...motherDetails, ethnicity: e.target.value})}></input>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeAddMotherModal}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={saveMotherChanges}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPaternalGrandfather} onHide={closeAddPaternalGrandfatherModal} dialogClassName="custom-modal-width">
                <Modal.Header closeButton>
                <Modal.Title>Add {fatherName}'s Father</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-modal">
                        <input  type="text" placeholder="First Name" onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, firstName: e.target.value })}></input>

                        <input type="text" placeholder="Middle Name" onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, middleName: e.target.value })}></input>

                        <input type="text" placeholder="Last Name"  value={paternalGrandfatherDetails.lastName} onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, lastName: e.target.value })}></input>
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Birth Date" onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, birthDate: e.target.value })}></input>

                    <input type="text" placeholder="Birth Place" onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, birthPlace: e.target.value })}></input>
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Death Date" onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, deathDate: e.target.value })}></input>

                    <input type="text" placeholder="Death Place" onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, deathPlace: e.target.value })}></input>

                    <input type="text" placeholder="Cause of Death" onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, causeOfDeath: e.target.value })}></input>
                    </div>
                   
                    <div className="input-modal">
                    <input type="text" placeholder="Titles/Occupations" onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, occupation: e.target.value })}></input>

                    <input type="text" placeholder="Ethnicity" value={paternalGrandfatherDetails.ethnicity} onChange={(e) => setPaternalGrandfatherDetails({ ...paternalGrandfatherDetails, ethnicity: e.target.value })}></input>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeAddPaternalGrandfatherModal}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={savePaternalGrandfatherChanges}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
            
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
                                 <th class="ancestor-box-border-bottom table-content" colspan="5">{convertNumToRelation(paternalGrandfatherRelationToUser, "male")}</th>
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
                                        <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button onClick={openAddPaternalGrandfatherModal}>Add Father</button></tr>
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
                                <th class="ancestor-box-border-bottom table-content" colspan="5">{convertNumToRelation(fatherRelationToUser, "male")}</th>
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
                                <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button onClick={openAddFatherModal}>Add Father</button></tr>
                                <tr></tr>
                                <tr></tr>
                                <tr></tr>
                            </table>
                        )}
                        
                        
                        {motherID ? (
                            <table  className="ancestor-box">
                            <tr>
                                <th class="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}: </th>
                                <th class="ancestor-box-border-bottom table-content" colspan="5">{convertNumToRelation(motherRelationToUser, "female")}</th>
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
                                <tr colspan="5" rowspan="6" className="unknown-ancestor-cell"><button  onClick={openAddMotherModal}>Add Mother</button></tr>
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
                                    <th class="ancestor-box-border-bottom table-content" colspan="5">{convertNumToRelation(bottomRelationToBaseUser, bottomPersonSex)}</th>
                                </tr>
                                <tr>
                                    <td class="ancestor-box-border-bottom table-label shrink">Name:</td>
                                    <td class="ancestor-box-border-bottom table-content" colspan="5">{bottomPagePersonFullName}</td>
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