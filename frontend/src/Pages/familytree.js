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
    const [showPaternalGrandmother, setShowPaternalGrandmother] = useState(false);
    const [showMaternalGrandfather, setShowMaternalGrandfather] = useState(false);
    const [showMaternalGrandmother, setShowMaternalGrandmother] = useState(false);
    const [showPaternalPaternalGreatGrandfather, setShowPaternalPaternalGreatGrandfather] = useState(false);
    const [showPaternalPaternalGreatGrandmother, setShowPaternalPaternalGreatGrandmother] = useState(false);
    const [showPaternalMaternalGreatGrandfather, setShowPaternalMaternalGreatGrandfather] = useState(false);
    const [showPaternalMaternalGreatGrandmother, setShowPaternalMaternalGreatGrandmother] = useState(false);
    const [showMaternalPaternalGreatGrandfather, setShowMaternalPaternalGreatGrandfather] = useState(false);
    const [showMaternalPaternalGreatGrandmother, setShowMaternalPaternalGreatGrandmother] = useState(false);
    const [showMaternalMaternalGreatGrandfather, setShowMaternalMaternalGreatGrandfather] = useState(false);
    const [showMaternalMaternalGreatGrandmother, setShowMaternalMaternalGreatGrandmother] = useState(false);

    const [showPaternalPaternalGreatGrandfathersFather, setShowPaternalPaternalGreatGrandfathersFather] = useState(false);
    const [showPaternalPaternalGreatGrandfathersMother, setShowPaternalPaternalGreatGrandfathersMother] = useState(false);
    const [showPaternalPaternalGreatGrandmothersFather, setShowPaternalPaternalGreatGrandmothersFather] = useState(false);
    const [showPaternalPaternalGreatGrandmothersMother, setShowPaternalPaternalGreatGrandmothersMother] = useState(false);

    const [showPaternalMaternalGreatGrandfathersFather, setShowPaternalMaternalGreatGrandfathersFather] = useState(false);
    const [showPaternalMaternalGreatGrandfathersMother, setShowPaternalMaternalGreatGrandfathersMother] = useState(false);
    const [showPaternalMaternalGreatGrandmothersFather, setShowPaternalMaternalGreatGrandmothersFather] = useState(false);
    const [showPaternalMaternalGreatGrandmothersMother, setShowPaternalMaternalGreatGrandmothersMother] = useState(false);

    const [showMaternalPaternalGreatGrandfathersFather, setShowMaternalPaternalGreatGrandfathersFather] = useState(false);
    const [showMaternalPaternalGreatGrandfathersMother, setShowMaternalPaternalGreatGrandfathersMother] = useState(false);
    const [showMaternalPaternalGreatGrandmothersFather, setShowMaternalPaternalGreatGrandmothersFather] = useState(false);
    const [showMaternalPaternalGreatGrandmothersMother, setShowMaternalPaternalGreatGrandmothersMother] = useState(false);

    const [showMaternalMaternalGreatGrandfathersFather, setShowMaternalMaternalGreatGrandfathersFather] = useState(false);
    const [showMaternalMaternalGreatGrandfathersMother, setShowMaternalMaternalGreatGrandfathersMother] = useState(false);
    const [showMaternalMaternalGreatGrandmothersFather, setShowMaternalMaternalGreatGrandmothersFather] = useState(false);
    const [showMaternalMaternalGreatGrandmothersMother, setShowMaternalMaternalGreatGrandmothersMother] = useState(false);

    const closeAddFatherModal = () => setShowFather(false);
    const openAddFatherModal = () => setShowFather(true);

    const closeAddMotherModal = () => setShowMother(false);
    const openAddMotherModal = () => setShowMother(true);

    const closeAddPaternalGrandfatherModal = () => setShowPaternalGrandfather(false);
    const openAddPaternalGrandfatherModal = () => setShowPaternalGrandfather(true);

    const closeAddPaternalGrandmotherModal = () => setShowPaternalGrandmother(false);
    const openAddPaternalGrandmotherModal = () => setShowPaternalGrandmother(true);

    const closeAddMaternalGrandfatherModal = () => setShowMaternalGrandfather(false);
    const openAddMaternalGrandfatherModal = () => setShowMaternalGrandfather(true);

    const closeAddMaternalGrandmotherModal = () => setShowMaternalGrandmother(false);
    const openAddMaternalGrandmotherModal = () => setShowMaternalGrandmother(true);

    const closeAddPaternalPaternalGreatGrandfatherModal = () => setShowPaternalPaternalGreatGrandfather(false);
    const openAddPaternalPaternalGreatGrandfatherModal = () => setShowPaternalPaternalGreatGrandfather(true);

    const closeAddPaternalPaternalGreatGrandmotherModal = () => setShowPaternalPaternalGreatGrandmother(false);
    const openAddPaternalPaternalGreatGrandmotherModal = () => setShowPaternalPaternalGreatGrandmother(true);

    const closeAddPaternalMaternalGreatGrandfatherModal = () => setShowPaternalMaternalGreatGrandfather(false);
    const openAddPaternalMaternalGreatGrandfatherModal = () => setShowPaternalMaternalGreatGrandfather(true);

    const closeAddPaternalMaternalGreatGrandmotherModal = () => setShowPaternalMaternalGreatGrandmother(false);
    const openAddPaternalMaternalGreatGrandmotherModal = () => setShowPaternalMaternalGreatGrandmother(true);


    const closeAddMaternalPaternalGreatGrandfatherModal = () => setShowMaternalPaternalGreatGrandfather(false);
    const openAddMaternalPaternalGreatGrandfatherModal = () => setShowMaternalPaternalGreatGrandfather(true);

    const closeAddMaternalPaternalGreatGrandmotherModal = () => setShowMaternalPaternalGreatGrandmother(false);
    const openAddMaternalPaternalGreatGrandmotherModal = () => setShowMaternalPaternalGreatGrandmother(true);

    const closeAddMaternalMaternalGreatGrandfatherModal = () => setShowMaternalMaternalGreatGrandfather(false);
    const openAddMaternalMaternalGreatGrandfatherModal = () => setShowMaternalMaternalGreatGrandfather(true);

    const closeAddMaternalMaternalGreatGrandmotherModal = () => setShowMaternalMaternalGreatGrandmother(false);
    const openAddMaternalMaternalGreatGrandmotherModal = () => setShowMaternalMaternalGreatGrandmother(true);

    const closeAddPaternalPaternalGreatGrandfathersFatherModal = () => setShowPaternalPaternalGreatGrandfathersFather(false);
    const openAddPaternalPaternalGreatGrandfathersFatherModal = () => setShowPaternalPaternalGreatGrandfathersFather(true);
    const closeAddPaternalPaternalGreatGrandfathersMotherModal = () => setShowPaternalPaternalGreatGrandfathersMother(false);
    const openAddPaternalPaternalGreatGrandfathersMotherModal = () => setShowPaternalPaternalGreatGrandfathersMother(true);

    const closeAddPaternalPaternalGreatGrandmothersFatherModal = () => setShowPaternalPaternalGreatGrandmothersFather(false);
    const openAddPaternalPaternalGreatGrandmothersFatherModal = () => setShowPaternalPaternalGreatGrandmothersFather(true);
    const closeAddPaternalPaternalGreatGrandmothersMotherModal = () => setShowPaternalPaternalGreatGrandmothersMother(false);
    const openAddPaternalPaternalGreatGrandmothersMotherModal = () => setShowPaternalPaternalGreatGrandmothersMother(true);

    const closeAddPaternalMaternalGreatGrandfathersFatherModal = () => setShowPaternalMaternalGreatGrandfathersFather(false);
    const openAddPaternalMaternalGreatGrandfathersFatherModal = () => setShowPaternalMaternalGreatGrandfathersFather(true);
    const closeAddPaternalMaternalGreatGrandfathersMotherModal = () => setShowPaternalMaternalGreatGrandfathersMother(false);
    const openAddPaternalMaternalGreatGrandfathersMotherModal = () => setShowPaternalMaternalGreatGrandfathersMother(true);

    const closeAddPaternalMaternalGreatGrandmothersFatherModal = () => setShowPaternalMaternalGreatGrandmothersFather(false);
    const openAddPaternalMaternalGreatGrandmothersFatherModal = () => setShowPaternalMaternalGreatGrandmothersFather(true);
    const closeAddPaternalMaternalGreatGrandmothersMotherModal = () => setShowPaternalMaternalGreatGrandmothersMother(false);
    const openAddPaternalMaternalGreatGrandmothersMotherModal = () => setShowPaternalMaternalGreatGrandmothersMother(true);

    const closeAddMaternalPaternalGreatGrandfathersFatherModal = () => setShowMaternalPaternalGreatGrandfathersFather(false);
    const openAddMaternalPaternalGreatGrandfathersFatherModal = () => setShowMaternalPaternalGreatGrandfathersFather(true);
    const closeAddMaternalPaternalGreatGrandfathersMotherModal = () => setShowMaternalPaternalGreatGrandfathersMother(false);
    const openAddMaternalPaternalGreatGrandfathersMotherModal = () => setShowMaternalPaternalGreatGrandfathersMother(true);

    const closeAddMaternalPaternalGreatGrandmothersFatherModal = () => setShowMaternalPaternalGreatGrandmothersFather(false);
    const openAddMaternalPaternalGreatGrandmothersFatherModal = () => setShowMaternalPaternalGreatGrandmothersFather(true);
    const closeAddMaternalPaternalGreatGrandmothersMotherModal = () => setShowMaternalPaternalGreatGrandmothersMother(false);
    const openAddMaternalPaternalGreatGrandmothersMotherModal = () => setShowMaternalPaternalGreatGrandmothersMother(true);

    const closeAddMaternalMaternalGreatGrandfathersFatherModal = () => setShowMaternalMaternalGreatGrandfathersFather(false);
    const openAddMaternalMaternalGreatGrandfathersFatherModal = () => setShowMaternalMaternalGreatGrandfathersFather(true);
    const closeAddMaternalMaternalGreatGrandfathersMotherModal = () => setShowMaternalMaternalGreatGrandfathersMother(false);
    const openAddMaternalMaternalGreatGrandfathersMotherModal = () => setShowMaternalMaternalGreatGrandfathersMother(true);

    const closeAddMaternalMaternalGreatGrandmothersFatherModal = () => setShowMaternalMaternalGreatGrandmothersFather(false);
    const openAddMaternalMaternalGreatGrandmothersFatherModal = () => setShowMaternalMaternalGreatGrandmothersFather(true);
    const closeAddMaternalMaternalGreatGrandmothersMotherModal = () => setShowMaternalMaternalGreatGrandmothersMother(false);
    const openAddMaternalMaternalGreatGrandmothersMotherModal = () => setShowMaternalMaternalGreatGrandmothersMother(true);



    const [fatherDetails, setFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
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
        occupation: null,
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
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalGrandmotherDetails, setPaternalGrandmotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalGrandfatherDetails, setMaternalGrandfatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalGrandmotherDetails, setMaternalGrandmotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalPaternalGreatGrandfatherDetails, setPaternalPaternalGreatGrandfatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalPaternalGreatGrandfathersFatherDetails, setPaternalPaternalGreatGrandfathersFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalPaternalGreatGrandfathersMotherDetails, setPaternalPaternalGreatGrandfathersMotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalPaternalGreatGrandmotherDetails, setPaternalPaternalGreatGrandmotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalPaternalGreatGrandmothersFatherDetails, setPaternalPaternalGreatGrandmothersFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalPaternalGreatGrandmothersMotherDetails, setPaternalPaternalGreatGrandmothersMotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalMaternalGreatGrandfatherDetails, setPaternalMaternalGreatGrandfatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalMaternalGreatGrandfathersFatherDetails, setPaternalMaternalGreatGrandfathersFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalMaternalGreatGrandfathersMotherDetails, setPaternalMaternalGreatGrandfathersMotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });
   

      const [paternalMaternalGreatGrandmotherDetails, setPaternalMaternalGreatGrandmotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalMaternalGreatGrandmothersFatherDetails, setPaternalMaternalGreatGrandmothersFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [paternalMaternalGreatGrandmothersMotherDetails, setPaternalMaternalGreatGrandmothersMotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalPaternalGreatGrandfatherDetails, setMaternalPaternalGreatGrandfatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalPaternalGreatGrandfathersFatherDetails, setMaternalPaternalGreatGrandfathersFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalPaternalGreatGrandfathersMotherDetails, setMaternalPaternalGreatGrandfathersMotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });
   

      const [maternalPaternalGreatGrandmotherDetails, setMaternalPaternalGreatGrandmotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalPaternalGreatGrandmothersFatherDetails, setMaternalPaternalGreatGrandmothersFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalPaternalGreatGrandmothersMotherDetails, setMaternalPaternalGreatGrandmothersMotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });
   


const [maternalMaternalGreatGrandfatherDetails, setMaternalMaternalGreatGrandfatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalMaternalGreatGrandfathersFatherDetails, setMaternalMaternalGreatGrandfathersFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalMaternalGreatGrandfathersMotherDetails, setMaternalMaternalGreatGrandfathersMotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });
   

      const [maternalMaternalGreatGrandmotherDetails, setMaternalMaternalGreatGrandmotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalMaternalGreatGrandmothersFatherDetails, setMaternalMaternalGreatGrandmothersFatherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });

      const [maternalMaternalGreatGrandmothersMotherDetails, setMaternalMaternalGreatGrandmothersMotherDetails] = React.useState({
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        deathPlace: null,
        causeOfDeath: null,
        occupation: null,
        ethnicity: null,
        relationTouser: null,
      });


    const [pageNumber, setPageNumber] = useState(1);
    const [totalNumOfPages, setTotalNumOfPages] = useState(1)
    const [pageEntry, setPageEntry] = useState();

    const [bottomPagePersonFirstName, setBottomPagePersonFirstName] = useState('');
    const [bottomPagePersonLastName, setBottomPagePersonLastName] = useState('');
    const [bottomPagePersonFullName, setBottomPagePersonFullName] = useState('');
    const [bottomPagePersonEthnicity, setBottomPagePersonEthnicity] = useState('');
    const [bottomPersonSex, setBottomPersonSex] = useState('');
    const [bottomRelationToBaseUser, setBottomRelationToBaseUser] = useState(0);
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

    const [paternalPaternalGreatGrandfatherHasParents, setPaternalPaternalGreatGrandfatherHasParents] = useState(false);
    const [paternalPaternalGreatGrandmotherHasParents, setPaternalPaternalGreatGrandmotherHasParents] = useState(false);

    const [paternalMaternalGreatGrandfatherHasParents, setPaternalMaternalGreatGrandfatherHasParents] = useState(false);
    const [paternalMaternalGreatGrandmotherHasParents, setPaternalMaternalGreatGrandmotherHasParents] = useState(false);

    const [maternalPaternalGreatGrandfatherHasParents, setMaternalPaternalGreatGrandfatherHasParents] = useState(false);
    const [maternalPaternalGreatGrandmotherHasParents, setMaternalPaternalGreatGrandmotherHasParents] = useState(false);


    const [maternalMaternalGreatGrandfatherHasParents, setMaternalMaternalGreatGrandfatherHasParents] = useState(false);
    const [maternalMaternalGreatGrandmotherHasParents, setMaternalMaternalGreatGrandmotherHasParents] = useState(false);

    const [paternalPaternalGreatGrandfatherPage, setPaternalPaternalGreatGrandfatherPage] = useState();

    

    const fetchInitialData = async () => {
        try {
            // Fetch Base Person
            const userId = localStorage.getItem('userId');
            const baseResponse = await fetch('http://localhost:5000/get-base-person', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const baseData = await baseResponse.json();
            setBasePersonFirstName(baseData.firstName);
            setBasePersonFullName(baseData.fullName);
            setBasePersonLastName(baseData.lastName);
            setBasePersonID(baseData.basePersonID);
            setBasePersonBirthDate(baseData.birthDate);
            setBasePersonBirthPlace(baseData.birthPlace);
            setBasePersonDeathDate(baseData.deathDate);
            setBasePersonDeathPlace(baseData.deathPlace);
            setBasePersonOccupation(baseData.occupation);
            setBasePersonEthnicity(baseData.ethnicity);
            setBasePersonProfileNumber(baseData.profileNumber);
            setBasePersonSex(baseData.sex);           
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    fetchInitialData();

    //grabs the current page number as stored in the database. This only runs once upon the page's reload
    useEffect(() => {
        const initialPageNum = async () => {
             // Fetch Current Page Number
             const userId = localStorage.getItem('userId');
             const pageResponse = await fetch('http://localhost:5000/get-current-page-number', {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId }),
          });
          const pageData = await pageResponse.json();
          setPageNumber(pageData.pageNum)
        }
        initialPageNum();
    }, [])


    const setNewPageNum = (num) => {
        const userId = localStorage.getItem('userId');
            const pageResponse = fetch('http://localhost:5000/set-current-page-number', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, num }),
        });
        setPageNumber(num)
        window.location.reload()
    }


    useEffect(() => {
            const getNewPageNum = async () => {
            const userId = localStorage.getItem('userId');
                const pageResponse = await fetch('http://localhost:5000/get-current-page-number', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            
            const pageData = await pageResponse.json();
            setBottomPagePersonFirstName(pageData.firstName);
            setBottomPagePersonLastName(pageData.lastName);
            setBottomPagePersonFullName(pageData.fullName);
            setBottomPagePersonID(pageData.id);
            setBottomPagePersonBirthDate(pageData.birthDate);
            setBottomPagePersonBirthPlace(pageData.birthPlace);
            setBottomPagePersonDeathDate(pageData.deathDate);
            setBottomPagePersonDeathPlace(pageData.deathPlace);
            setBottomPagePersonOccupation(pageData.occupation);
            setBottomPagePersonEthnicity(pageData.ethnicity);
            setBottomPagePersonProfileNumber(pageData.id);
            setBottomPersonSex(pageData.sex);
            setBottomRelationToBaseUser(pageData.relationToUser);
        }
        getNewPageNum();
    }, [pageNumber])

    const navigateDown = async (personID) => {
        console.log(personID)
        const userId = localStorage.getItem('userId');
        const response = await fetch('http://localhost:5000/get-previous-page', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID })
        })

        const data = await response.json();
        setPageNumber(data.pageNum);
        window.location.reload();
    }

    const countTotalPageNum = async () => {
        const userId = localStorage.getItem('userId');
        const response = await fetch('http://localhost:5000/count-all-pages', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
        })
        const data = await response.json();
        setTotalNumOfPages(data);
    }
    countTotalPageNum();

    const handleNavigateUpwards = async (personID) => {

        const userId = localStorage.getItem('userId');
        const response = await fetch('http://localhost:5000/get-next-page', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID })
        })
        const data = await response.json();
        setPageNumber(data.pageNum);
        window.location.reload();
    };

    const handlePageEntry = async (event) => {
        setPageEntry(event.target.value)
    }
    


    const getFather = async () => {
        if (bottomPagePersonID) {
            const personID = bottomPagePersonID;
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
            setFatherCauseOfDeath(data.causeOfDeath);
        }
    }

    useEffect(() => {
        getFather();
    }, [bottomPagePersonID])



    const getMother = async () => {
        if (bottomPagePersonID) {
            const personID = bottomPagePersonID;
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

    useEffect(() => {
        getMother();
    }, [bottomPagePersonID])



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
            setPaternalGrandfatherEthnicity(data.fatherEthnicity);
            setPaternalGrandfatherCauseOfDeath(data.causeOfDeath);
        }
    }

    useEffect(() => {
        getPaternalGrandFather();
    }, [fatherID])

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
            setPaternalGrandmotherEthnicity(data.motherEthnicity);
            setPaternalGrandmotherCauseOfDeath(data.causeOfDeath);
            setPaternalGrandmotherRelationToUser(data.relation_to_user)
        }
    }

    useEffect(() => {
        getPaternalGrandMother();
    }, [fatherID])

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
            setMaternalGrandfatherEthnicity(data.fatherEthnicity);
            setMaternalGrandfatherCauseOfDeath(data.causeOfDeath);
            setMaternalGrandfatherRelationToUser(data.relation_to_user)
        }
    }

    useEffect(() => {
        getMaternalGrandFather();
    }, [motherID])

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
            setMaternalGrandmotherEthnicity(data.motherEthnicity);
            setMaternalGrandmotherCauseOfDeath(data.causeOfDeath);
            setMaternalGrandmotherRelationToUser(data.relation_to_user)
        }
    }
    useEffect(() => {
        getMaternalGrandMother();
    }, [motherID])

   
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
            setPaternalPaternalGreatGrandfatherEthnicity(data.fatherEthnicity);
            setPaternalPaternalGreatGrandfatherCauseOfDeath(data.causeOfDeath);
            setPaternalPaternalGreatGrandfatherRelationToUser(data.relation_to_user)
        }
    }
    useEffect(() => {
        getPaternalPaternalGreatGrandFather();
    }, [paternalGrandfatherID])


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
            setPaternalPaternalGreatGrandmotherEthnicity(data.motherEthnicity);
            setPaternalPaternalGreatGrandmotherCauseOfDeath(data.causeOfDeath);
            setPaternalPaternalGreatGrandmotherRelationToUser(data.relation_to_user)
        }
    }
    useEffect(() => {
        getPaternalPaternalGreatGrandMother();
    }, [paternalGrandfatherID])


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
            setPaternalMaternalGreatGrandfatherEthnicity(data.fatherEthnicity);
            setPaternalMaternalGreatGrandfatherCauseOfDeath(data.causeOfDeath);
            setPaternalMaternalGreatGrandfatherRelationToUser(data.relation_to_user)
        }
    }
    useEffect(() => {
        getPaternalMaternalGreatGrandFather();
    }, [paternalGrandmotherID])


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
            setPaternalMaternalGreatGrandmotherEthnicity(data.motherEthnicity);
            setPaternalMaternalGreatGrandmotherCauseOfDeath(data.causeOfDeath);
            setPaternalMaternalGreatGrandmotherRelationToUser(data.relation_to_user)
        }
    }
    useEffect(() => {
        getPaternalMaternalGreatGrandMother();
    }, [paternalGrandmotherID])


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
            setMaternalPaternalGreatGrandfatherEthnicity(data.fatherEthnicity);
            setMaternalPaternalGreatGrandfatherCauseOfDeath(data.causeOfDeath);
            setMaternalPaternalGreatGrandfatherRelationToUser(data.relation_to_user)
        }
        
    }
    useEffect(() => {
        getMaternalPaternalGreatGrandFather();
    }, [maternalGrandfatherID])

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
            setMaternalPaternalGreatGrandmotherEthnicity(data.motherEthnicity);
            setMaternalPaternalGreatGrandmotherCauseOfDeath(data.causeOfDeath);
            setMaternalPaternalGreatGrandmotherRelationToUser(data.relation_to_user)
        }
    }
    useEffect(() => {
        getMaternalPaternalGreatGrandmother();
    }, [maternalGrandfatherID])

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
            setMaternalMaternalGreatGrandfatherEthnicity(data.fatherEthnicity);
            setMaternalMaternalGreatGrandfatherCauseOfDeath(data.causeOfDeath);
            setMaternalMaternalGreatGrandfatherRelationToUser(data.relation_to_user)
        }
    }
    useEffect(() => {
        getMaternalMaternalGreatGrandFather();
    }, [maternalGrandmotherID])

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
            setMaternalMaternalGreatGrandmotherEthnicity(data.motherEthnicity);
            setMaternalMaternalGreatGrandmotherCauseOfDeath(data.causeOfDeath);
            setMaternalMaternalGreatGrandmotherRelationToUser(data.relation_to_user)
        }
    }
    useEffect(() => {
        getMaternalMaternalGreatGrandMother();
    }, [maternalGrandmotherID])


    
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

        //updates paternalGrandfatherDetails whenever it changes
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

        //updates paternalGrandmotherDetails whenever it changes
        useEffect(() => {
            if (!paternalGrandmotherDetails.ethnicity  && fatherEthnicity) {
                setPaternalGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: fatherEthnicity,
                  }))
              }
        }, [paternalGrandmotherDetails.ethnicity, fatherEthnicity]);

        //updates maternalGrandfatherDetails whenever it changes
        useEffect(() => {
            if (!maternalGrandfatherDetails.lastName && motherLastName) {
                setMaternalGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: motherLastName,
                  }))
              }
        }, [maternalGrandfatherDetails.lastName, motherLastName]);

        useEffect(() => {
            if (!maternalGrandfatherDetails.ethnicity  && motherEthnicity) {
                setMaternalGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: motherEthnicity,
                  }))
              }
        }, [maternalGrandfatherDetails.ethnicity, motherEthnicity]);

        //updates maternalGrandmotherDetails whenever it changes
        useEffect(() => {
            if (!maternalGrandmotherDetails.ethnicity  && motherEthnicity) {
                setMaternalGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: motherEthnicity,
                  }))
              }
        }, [maternalGrandmotherDetails.ethnicity, motherEthnicity]);

        //updates paternalPaternalGreatGrandfatherDetails whenever it changes
        useEffect(() => {
            if (!paternalPaternalGreatGrandfatherDetails.lastName && paternalGrandfatherLastName) {
                setPaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalGrandfatherLastName,
                  }))
              }
        }, [paternalPaternalGreatGrandfatherDetails.lastName, paternalGrandfatherLastName]);

        useEffect(() => {
            if (!paternalPaternalGreatGrandfatherDetails.ethnicity  && paternalGrandfatherEthnicity) {
                setPaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalGrandfatherEthnicity,
                  }))
              }
        }, [paternalPaternalGreatGrandfatherDetails.ethnicity, paternalGrandfatherEthnicity]);

        //updates paternalPaternalGreatGrandmotherDetails whenever it changes
        useEffect(() => {
            if (!paternalPaternalGreatGrandmotherDetails.ethnicity  && paternalGrandfatherEthnicity) {
                setPaternalPaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalGrandfatherEthnicity,
                  }))
              }
        }, [paternalPaternalGreatGrandmotherDetails.ethnicity, paternalGrandfatherEthnicity]);

        //updates paternalMaternalGreatGrandfatherDetails whenever it changes
        useEffect(() => {
            if (!paternalMaternalGreatGrandfatherDetails.lastName && paternalGrandmotherLastName) {
                setPaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalGrandmotherLastName,
                  }))
              }
        }, [paternalMaternalGreatGrandfatherDetails.lastName, paternalGrandmotherLastName]);

        useEffect(() => {
            if (!paternalMaternalGreatGrandfatherDetails.ethnicity  && paternalGrandmotherEthnicity) {
                setPaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalGrandmotherEthnicity,
                  }))
              }
        }, [paternalMaternalGreatGrandfatherDetails.ethnicity, paternalGrandmotherEthnicity]);

        //updates paternalMaternalGreatGrandmotherDetails whenever it changes
        useEffect(() => {
            if (!paternalMaternalGreatGrandmotherDetails.ethnicity  && paternalGrandmotherEthnicity) {
                setPaternalMaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalGrandmotherEthnicity,
                  }))
              }
        }, [paternalMaternalGreatGrandmotherDetails.ethnicity, paternalGrandmotherEthnicity]);

        //updates maternalPaternalGreatGrandfatherDetails whenever it changes
        useEffect(() => {
            if (!maternalPaternalGreatGrandfatherDetails.lastName && maternalGrandfatherLastName) {
                setMaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalGrandfatherLastName,
                  }))
              }
        }, [maternalPaternalGreatGrandfatherDetails.lastName, maternalGrandfatherLastName]);

        useEffect(() => {
            if (!maternalPaternalGreatGrandfatherDetails.ethnicity  && maternalGrandfatherEthnicity) {
                setMaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalGrandfatherEthnicity,
                  }))
              }
        }, [maternalPaternalGreatGrandfatherDetails.ethnicity, maternalGrandfatherEthnicity]);

        //updates maternalPaternalGreatGrandmotherDetails whenever it changes
        useEffect(() => {
            if (!maternalPaternalGreatGrandmotherDetails.ethnicity  && maternalGrandfatherEthnicity) {
                setMaternalPaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalGrandfatherEthnicity,
                  }))
              }
        }, [maternalPaternalGreatGrandmotherDetails.ethnicity, maternalGrandfatherEthnicity]);

        //updates maternalMaternalGreatGrandfatherDetails whenever it changes
        useEffect(() => {
            if (!maternalMaternalGreatGrandfatherDetails.lastName && maternalGrandmotherLastName) {
                setMaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalGrandmotherLastName,
                  }))
              }
        }, [maternalMaternalGreatGrandfatherDetails.lastName, maternalGrandmotherLastName]);

        useEffect(() => {
            if (!maternalMaternalGreatGrandfatherDetails.ethnicity  && maternalGrandmotherEthnicity) {
                setMaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalGrandmotherEthnicity,
                  }))
              }
        }, [maternalMaternalGreatGrandfatherDetails.ethnicity, maternalGrandmotherEthnicity]);

        //updates maternalMaternalGreatGrandmotherDetails whenever it changes
        useEffect(() => {
            if (!maternalMaternalGreatGrandmotherDetails.ethnicity  && maternalGrandmotherEthnicity) {
                setMaternalMaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalGrandmotherEthnicity,
                  }))
              }
        }, [maternalMaternalGreatGrandmotherDetails.ethnicity, maternalGrandmotherEthnicity]);






        
        //updates paternalPaternalGreatGrandfathersFatherDetails whenever it changes
        useEffect(() => {
            if (!paternalPaternalGreatGrandfathersFatherDetails.lastName && paternalPaternalGreatGrandfatherLastName) {
                setPaternalPaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalPaternalGreatGrandfatherLastName,
                  }))
              }
        }, [paternalPaternalGreatGrandfathersFatherDetails.lastName, paternalPaternalGreatGrandfatherLastName]);

        useEffect(() => {
            if (!paternalPaternalGreatGrandfathersFatherDetails.ethnicity  && paternalPaternalGreatGrandfatherEthnicity) {
                setPaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalPaternalGreatGrandfatherEthnicity,
                  }))
              }
        }, [paternalPaternalGreatGrandfathersFatherDetails.ethnicity, paternalPaternalGreatGrandfatherEthnicity]);

        //updates paternalPaternalGreatGrandfathersMotherDetails whenever it changes
        useEffect(() => {
            if (!paternalPaternalGreatGrandfathersMotherDetails.ethnicity  && paternalPaternalGreatGrandfatherEthnicity) {
                setPaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalPaternalGreatGrandfatherEthnicity,
                  }))
              }
        }, [paternalPaternalGreatGrandfathersMotherDetails.ethnicity, paternalPaternalGreatGrandfatherEthnicity]);



        //updates paternalMaternalGreatGrandfathersFatherDetails whenever it changes
        useEffect(() => {
            if (!paternalMaternalGreatGrandfathersFatherDetails.lastName && paternalMaternalGreatGrandfatherLastName) {
                setPaternalMaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalMaternalGreatGrandfatherLastName,
                  }))
              }
        }, [paternalMaternalGreatGrandfathersFatherDetails.lastName, paternalMaternalGreatGrandfatherLastName]);

        useEffect(() => {
            if (!paternalMaternalGreatGrandfathersFatherDetails.ethnicity  && paternalMaternalGreatGrandfatherEthnicity) {
                setPaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalMaternalGreatGrandfatherEthnicity,
                  }))
              }
        }, [paternalMaternalGreatGrandfathersFatherDetails.ethnicity, paternalMaternalGreatGrandfatherEthnicity]);

        //updates paternalMaternalGreatGrandfathersMotherDetails whenever it changes
        useEffect(() => {
            if (!paternalMaternalGreatGrandfathersMotherDetails.ethnicity  && paternalMaternalGreatGrandfatherEthnicity) {
                setPaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalMaternalGreatGrandfatherEthnicity,
                  }))
              }
        }, [paternalMaternalGreatGrandfathersMotherDetails.ethnicity, paternalMaternalGreatGrandfatherEthnicity]);

        //updates paternalMaternalGreatGrandmothersFatherDetails whenever it changes
        useEffect(() => {
            if (!paternalMaternalGreatGrandmothersFatherDetails.lastName && paternalMaternalGreatGrandmotherLastName) {
                setPaternalMaternalGreatGrandmothersFatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalMaternalGreatGrandmotherLastName,
                  }))
              }
        }, [paternalMaternalGreatGrandmothersFatherDetails.lastName, paternalMaternalGreatGrandmotherLastName]);

        useEffect(() => {
            if (!paternalMaternalGreatGrandmothersFatherDetails.ethnicity  && paternalMaternalGreatGrandmotherEthnicity) {
                setPaternalMaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalMaternalGreatGrandmotherEthnicity,
                  }))
              }
        }, [paternalMaternalGreatGrandmothersFatherDetails.ethnicity, paternalMaternalGreatGrandmotherEthnicity]);

        //updates paternalMaternalGreatGrandmothersMotherDetails whenever it changes
        useEffect(() => {
            if (!paternalMaternalGreatGrandmothersMotherDetails.ethnicity  && paternalMaternalGreatGrandmotherEthnicity) {
                setPaternalMaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalMaternalGreatGrandmotherEthnicity,
                  }))
              }
        }, [paternalMaternalGreatGrandmothersMotherDetails.ethnicity, paternalMaternalGreatGrandmotherEthnicity]);


        


         //updates maternalPaternalGreatGrandfathersFatherDetails whenever it changes
         useEffect(() => {
            if (!maternalPaternalGreatGrandfathersFatherDetails.lastName && maternalPaternalGreatGrandfatherLastName) {
                setMaternalPaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalPaternalGreatGrandfatherLastName,
                  }))
              }
        }, [maternalPaternalGreatGrandfathersFatherDetails.lastName, maternalPaternalGreatGrandfatherLastName]);

        useEffect(() => {
            if (!maternalPaternalGreatGrandfathersFatherDetails.ethnicity  && maternalPaternalGreatGrandfatherEthnicity) {
                setMaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalPaternalGreatGrandfatherEthnicity,
                  }))
              }
        }, [maternalPaternalGreatGrandfathersFatherDetails.ethnicity, maternalPaternalGreatGrandfatherEthnicity]);

        //updates maternalPaternalGreatGrandfathersMotherDetails whenever it changes
        useEffect(() => {
            if (!maternalPaternalGreatGrandfathersMotherDetails.ethnicity  && maternalPaternalGreatGrandfatherEthnicity) {
                setMaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalPaternalGreatGrandfatherEthnicity,
                  }))
              }
        }, [maternalPaternalGreatGrandfathersMotherDetails.ethnicity, maternalPaternalGreatGrandfatherEthnicity]);





         //updates maternalPaternalGreatGrandmothersFatherDetails whenever it changes
         useEffect(() => {
            if (!maternalPaternalGreatGrandmothersFatherDetails.lastName && maternalPaternalGreatGrandmotherLastName) {
                setMaternalPaternalGreatGrandmothersFatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalPaternalGreatGrandmotherLastName,
                  }))
              }
        }, [maternalPaternalGreatGrandmothersFatherDetails.lastName, maternalPaternalGreatGrandmotherLastName]);

        useEffect(() => {
            if (!maternalPaternalGreatGrandmothersFatherDetails.ethnicity  && maternalPaternalGreatGrandmotherEthnicity) {
                setMaternalPaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalPaternalGreatGrandmotherEthnicity,
                  }))
              }
        }, [maternalPaternalGreatGrandmothersFatherDetails.ethnicity, maternalPaternalGreatGrandmotherEthnicity]);

        //updates maternalPaternalGreatGrandmothersMotherDetails whenever it changes
        useEffect(() => {
            if (!maternalPaternalGreatGrandmothersMotherDetails.ethnicity  && maternalPaternalGreatGrandmotherEthnicity) {
                setMaternalPaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalPaternalGreatGrandmotherEthnicity,
                  }))
              }
        }, [maternalPaternalGreatGrandmothersMotherDetails.ethnicity, maternalPaternalGreatGrandmotherEthnicity]);





        //updates MaternalMaternalGreatGrandfathersFatherDetails whenever it changes
        useEffect(() => {
            if (!maternalMaternalGreatGrandfathersFatherDetails.lastName && maternalMaternalGreatGrandfatherLastName) {
                setMaternalMaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalMaternalGreatGrandfatherLastName,
                  }))
              }
        }, [maternalMaternalGreatGrandfathersFatherDetails.lastName, maternalMaternalGreatGrandfatherLastName]);

        useEffect(() => {
            if (!maternalMaternalGreatGrandfathersFatherDetails.ethnicity  && maternalMaternalGreatGrandfatherEthnicity) {
                setMaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalMaternalGreatGrandfatherEthnicity,
                  }))
              }
        }, [maternalMaternalGreatGrandfathersFatherDetails.ethnicity, maternalMaternalGreatGrandfatherEthnicity]);

        //updates maternalMaternalGreatGrandfathersMotherDetails whenever it changes
        useEffect(() => {
            if (!maternalMaternalGreatGrandfathersMotherDetails.ethnicity  && maternalMaternalGreatGrandfatherEthnicity) {
                setMaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalMaternalGreatGrandfatherEthnicity,
                  }))
              }
        }, [maternalMaternalGreatGrandfathersMotherDetails.ethnicity, maternalMaternalGreatGrandfatherEthnicity]);


        //updates MaternalMaternalGreatGrandmothersFatherDetails whenever it changes
        useEffect(() => {
            if (!maternalMaternalGreatGrandmothersFatherDetails.lastName && maternalMaternalGreatGrandmotherLastName) {
                setMaternalMaternalGreatGrandmothersFatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalMaternalGreatGrandmotherLastName,
                  }))
              }
        }, [maternalMaternalGreatGrandmothersFatherDetails.lastName, maternalMaternalGreatGrandmotherLastName]);

        useEffect(() => {
            if (!maternalMaternalGreatGrandmothersFatherDetails.ethnicity  && maternalMaternalGreatGrandmotherEthnicity) {
                setMaternalMaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalMaternalGreatGrandmotherEthnicity,
                  }))
              }
        }, [maternalMaternalGreatGrandmothersFatherDetails.ethnicity, maternalMaternalGreatGrandmotherEthnicity]);

        //updates maternalMaternalGreatGrandmothersMotherDetails whenever it changes
        useEffect(() => {
            if (!maternalMaternalGreatGrandmothersMotherDetails.ethnicity  && maternalMaternalGreatGrandmotherEthnicity) {
                setMaternalMaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalMaternalGreatGrandmotherEthnicity,
                  }))
              }
        }, [maternalMaternalGreatGrandmothersMotherDetails.ethnicity, maternalMaternalGreatGrandmotherEthnicity]);



        





        const saveAncestorChanges = async (ancestorDetails, childID, sex) => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch('http://localhost:5000/save-ancestor', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, ancestorDetails, childID, sex }),
                });
        
                const data = await response.json();
                return data;
            } catch (error) {
                console.log("Error saving ancestor changes:", error);
                throw error;
            }
        }
        
        const saveFatherChanges = async () => {
            setShowFather(false);
            try {
                const data = await saveAncestorChanges(fatherDetails, bottomPagePersonID, "male");
                setFatherID(data);
                getFather();
            } catch (error) {
                console.log("Error saving father changes:", error);
            }
        }
        
        const saveMotherChanges = async () => {
            setShowMother(false);
            try {
                const data = await saveAncestorChanges(motherDetails, bottomPagePersonID, "female");
                setMotherID(data);
                getMother();
            } catch (error) {
                console.log("Error saving mother changes:", error);
            }
        }

        const savePaternalGrandfatherChanges = async () => {
            setShowPaternalGrandfather(false);
            try {
                const data = await saveAncestorChanges(paternalGrandfatherDetails, fatherID, "male");
                setPaternalGrandfatherID(data);
                getPaternalGrandFather();
            } catch (error) {
                console.log("Error saving paternal grandfather changes:", error);
            }
        }

        const savePaternalGrandmotherChanges = async () => {
            setShowPaternalGrandmother(false);
            try {
                const data = await saveAncestorChanges(paternalGrandmotherDetails, fatherID, "female");
                setPaternalGrandmotherID(data);
                getPaternalGrandMother();
            } catch (error) {
                console.log("Error saving paternal grandmother changes:", error);
            }
        }

        const saveMaternalGrandfatherChanges = async () => {
            setShowMaternalGrandfather(false);
            try {
                const data = await saveAncestorChanges(maternalGrandfatherDetails, motherID, "male");
                setMaternalGrandfatherID(data);
                getMaternalGrandFather();
            } catch (error) {
                console.log("Error saving maternal grandfather changes:", error);
            }
        }

        const saveMaternalGrandmotherChanges = async () => {
            setShowMaternalGrandmother(false);
            try {
                const data = await saveAncestorChanges(maternalGrandmotherDetails, motherID, "female");
                setMaternalGrandmotherID(data);
                getMaternalGrandMother();
            } catch (error) {
                console.log("Error saving maternal grandfather changes:", error);
            }
        }




        const savePaternalPaternalGreatGrandfatherChanges = async () => {
            setShowPaternalPaternalGreatGrandfather(false);

            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandfatherDetails, paternalGrandfatherID, "male");
                setPaternalPaternalGreatGrandfatherID(data);
                getPaternalPaternalGreatGrandFather();
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalPaternalGreatGrandmotherChanges = async () => {
            setShowPaternalPaternalGreatGrandmother(false);
            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandmotherDetails, paternalGrandfatherID, "female");
                setPaternalPaternalGreatGrandmotherID(data);
                getPaternalPaternalGreatGrandMother();
            } catch (error) {
                console.log("Error saving paternal paternal great grandmother changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandfatherChanges = async () => {
            setShowPaternalMaternalGreatGrandfather(false);
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandfatherDetails, paternalGrandmotherID, "male");
                setPaternalMaternalGreatGrandfatherID(data);
                getPaternalMaternalGreatGrandFather();
            } catch (error) {
                console.log("Error saving paternal maternal great grandfather changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandmotherChanges = async () => {
            setShowPaternalMaternalGreatGrandmother(false);
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandmotherDetails, paternalGrandmotherID, "female");
                setPaternalMaternalGreatGrandmotherID(data);
                getPaternalMaternalGreatGrandMother();
            } catch (error) {
                console.log("Error saving paternal maternal great grandmother changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandfatherChanges = async () => {
            setShowMaternalPaternalGreatGrandfather(false);
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandfatherDetails, maternalGrandfatherID, "male");
                setMaternalPaternalGreatGrandfatherID(data);
                getMaternalPaternalGreatGrandFather();
            } catch (error) {
                console.log("Error saving maternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandmotherChanges = async () => {
            setShowMaternalPaternalGreatGrandmother(false);
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandmotherDetails, maternalGrandfatherID, "female");
                setMaternalPaternalGreatGrandmotherID(data);
                getMaternalPaternalGreatGrandmother();
            } catch (error) {
                console.log("Error saving maternal paternal great grandmother changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandfatherChanges = async () => {
            setShowMaternalMaternalGreatGrandfather(false);
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandfatherDetails, maternalGrandmotherID, "male");
                setMaternalMaternalGreatGrandfatherID(data);
                getMaternalMaternalGreatGrandFather();
            } catch (error) {
                console.log("Error saving maternal maternal great grandfather changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandmotherChanges = async () => {
            setShowMaternalMaternalGreatGrandmother(false);
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandmotherDetails, maternalGrandmotherID, "female");
                setMaternalMaternalGreatGrandmotherID(data);
                getMaternalMaternalGreatGrandMother();
            } catch (error) {
                console.log("Error saving maternal maternal great grandmother changes:", error);
            }
        }



        const savePaternalPaternalGreatGrandfathersFatherChanges = async () => {
            setShowPaternalPaternalGreatGrandfathersFather(false);
      
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!paternalPaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalPaternalGreatGrandfatherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }

            

            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandfathersFatherDetails, paternalPaternalGreatGrandfatherID, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalPaternalGreatGrandfathersMotherChanges = async () => {
            setShowPaternalPaternalGreatGrandfathersMother(false);

            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalPaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalPaternalGreatGrandfatherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandfathersMotherDetails, paternalPaternalGreatGrandfatherID, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }


        const savePaternalPaternalGreatGrandmothersFatherChanges = async () => {
            setShowPaternalPaternalGreatGrandmothersFather(false);

            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalPaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalPaternalGreatGrandmotherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }

            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandmothersFatherDetails, paternalPaternalGreatGrandmotherID, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalPaternalGreatGrandmothersMotherChanges = async () => {
            setShowPaternalPaternalGreatGrandmothersMother(false);

             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!paternalPaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalPaternalGreatGrandmotherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandmothersMotherDetails, paternalPaternalGreatGrandmotherID, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }




        const savePaternalMaternalGreatGrandfathersFatherChanges = async () => {
            setShowPaternalMaternalGreatGrandfathersFather(false);

             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!paternalMaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalMaternalGreatGrandfatherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandfathersFatherDetails, paternalMaternalGreatGrandfatherID, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandfathersMotherChanges = async () => {
            setShowPaternalMaternalGreatGrandfathersMother(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalMaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalMaternalGreatGrandfatherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandfathersMotherDetails, paternalMaternalGreatGrandfatherID, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandmothersFatherChanges = async () => {
            setShowPaternalMaternalGreatGrandmothersFather(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalMaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalMaternalGreatGrandmotherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandmothersFatherDetails, paternalMaternalGreatGrandmotherID, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandmothersMotherChanges = async () => {
            setShowPaternalMaternalGreatGrandmothersMother(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalMaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalMaternalGreatGrandmotherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandmothersMotherDetails, paternalMaternalGreatGrandmotherID, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }




        const saveMaternalPaternalGreatGrandfathersFatherChanges = async () => {
            setShowMaternalPaternalGreatGrandfathersFather(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalPaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalPaternalGreatGrandfatherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandfathersFatherDetails, maternalPaternalGreatGrandfatherID, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandfathersMotherChanges = async () => {
            setShowMaternalPaternalGreatGrandfathersMother(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalPaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalPaternalGreatGrandfatherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandfathersMotherDetails, maternalPaternalGreatGrandfatherID, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandmothersFatherChanges = async () => {
            setShowMaternalPaternalGreatGrandmothersFather(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalPaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalPaternalGreatGrandmotherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandmothersFatherDetails, maternalPaternalGreatGrandmotherID, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandmothersMotherChanges = async () => {
            setShowMaternalPaternalGreatGrandmothersMother(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalPaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalPaternalGreatGrandmotherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandmothersMotherDetails, maternalPaternalGreatGrandmotherID, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }



        const saveMaternalMaternalGreatGrandfathersFatherChanges = async () => {
            setShowMaternalMaternalGreatGrandfathersFather(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalMaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalMaternalGreatGrandfatherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandfathersFatherDetails, maternalMaternalGreatGrandfatherID, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandfathersMotherChanges = async () => {
            setShowMaternalMaternalGreatGrandfathersMother(false);
             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!maternalMaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalMaternalGreatGrandfatherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandfathersMotherDetails, maternalMaternalGreatGrandfatherID, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandmothersFatherChanges = async () => {
            setShowMaternalMaternalGreatGrandmothersFather(false);
             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!maternalMaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalMaternalGreatGrandmotherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandmothersFatherDetails, maternalMaternalGreatGrandmotherID, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandmothersMotherChanges = async () => {
            setShowMaternalMaternalGreatGrandmothersMother(false);
             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!maternalMaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalMaternalGreatGrandmotherID;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandmothersMotherDetails, maternalMaternalGreatGrandmotherID, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }
        

    function makeModal(showPerson, closeAddPerson, childName, setDetails, details, sex, save, closeAdd) {

        let motherOrFather = "";
        if (sex === "male") {
            motherOrFather = "Father";
        } else {
            motherOrFather = "Mother";
        }

        return (

        <Modal show={showPerson} onHide={closeAddPerson} dialogClassName="custom-modal-width">
                <Modal.Header closeButton>
                <Modal.Title>Add {childName}'s {motherOrFather}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-modal">
                        <input  type="text" placeholder="First Name" onChange={(e) => setDetails({ ...details, firstName: e.target.value })}></input>

                        <input type="text" placeholder="Middle Name" onChange={(e) => setDetails({ ...details, middleName: e.target.value })}></input>

                        {/*if the person is male, then his default surname is the same as his childrens'*/}
                        {sex === "male" ? ( 
                            <input type="text" placeholder="Last Name"  value={details.lastName} onChange={(e) => setDetails({ ...details, lastName: e.target.value })}></input>
                        ): (
                            <input type="text" placeholder="Last Name" onChange={(e) => setDetails({ ...details, lastName: e.target.value })}></input>
                        )}
                        
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Birth Date" onChange={(e) => setDetails({ ...details, birthDate: e.target.value })}></input>

                    <input type="text" placeholder="Birth Place" onChange={(e) => setDetails({ ...details, birthPlace: e.target.value })}></input>
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Death Date" onChange={(e) => setDetails({ ...details, deathDate: e.target.value })}></input>

                    <input type="text" placeholder="Death Place" onChange={(e) => setDetails({ ...details, deathPlace: e.target.value })}></input>

                    <input type="text" placeholder="Cause of Death" onChange={(e) => setDetails({ ...details, causeOfDeath: e.target.value })}></input>
                    </div>
                   
                    <div className="input-modal">
                    <input type="text" placeholder="Titles/Occupations" onChange={(e) => setDetails({ ...details, occupation: e.target.value })}></input>

                    <input type="text" placeholder="Ethnicity" value={details.ethnicity} onChange={(e) => setDetails({ ...details, ethnicity: e.target.value })}></input>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeAdd}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={save}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

        )
    }

    function showAncestorTable(ID, basePersonFirstName, relationToUser, sex, name, birthDate, deathDate, birthPlace, deathPlace, occupation, profileNumber, childID, openAddModal) {

        let motherFather = "";
        if (sex === "male") {
            motherFather = "Father";
        } else {
            motherFather = "Mother";
        }

        return (
            <>
            {ID ? (
                <table  className="ancestor-box">
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}: </td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="3">{convertNumToRelation(relationToUser, sex)}</td>
                    <td className="ancestor-box-border-bottom table-label shrink">Profile Number:</td>
                    <td className="ancestor-box-border-bottom table-content shrink">{profileNumber}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Name:</td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="5"><b>{name}</b></td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom birth-date-cell table-label" rowSpan="2">Birth</td>
                    <td className="ancestor-box-border-bottom table-label shrink">date:</td>
                    <td className="ancestor-box-border-bottom table-content">{birthDate}</td>
                    <td className="ancestor-box-border-bottom birth-date-cell table-label" rowSpan="2">Death</td>
                    <td className="ancestor-box-border-bottom table-label shrink">date:</td>
                    <td className="ancestor-box-border-bottom table-content">{deathDate}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">place:</td>
                    <td className="ancestor-box-border-bottom table-content">{birthPlace}</td>
                    <td className="ancestor-box-border-bottom table-label shrink">place:</td>
                    <td className="ancestor-box-border-bottom table-content">{deathPlace}</td>
                </tr>
                <tr>
                    <td className=" ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                    <td className="table-content" colSpan="5">{occupation}</td>
                </tr>
                </table>
           ) : (
               <>
               {childID ? (
                       <table className="unknown-ancestor">
                           <tr><p></p></tr>
                           <tr></tr>
                           <tr colSpan="5" rowSpan="6" className="unknown-ancestor-cell"><button onClick={openAddModal}>Add {motherFather}</button></tr>
                           <tr></tr>
                           <tr></tr>
                           <tr></tr>
                       </table>
                   ) : (
                       <table className="empty-slot">
                           <tr colSpan="5" rowSpan="6"><p></p></tr>
                       </table>
                   )}
               </>
           )}
           </>
        )
    }

    function showGreatGrandParentTable(ID, basePersonFirstName, relationToUser, sex, name, birthDate, deathDate, birthPlace, deathPlace, occupation, profileNumber, childID, openAddModal) {

        let motherFather = "";
        if (sex === "male") {
            motherFather = "Father";
        } else {
            motherFather = "Mother";
        }

        return(
            <>
             {ID ? (
            <table className="ancestor-box">
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Relation to {basePersonFirstName}:</td>
                    <td className="ancestor-box-border-bottom table-content">{convertNumToRelation(relationToUser, sex)}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Name:</td>
                    <td className="ancestor-box-border-bottom table-content"><b>{name}</b></td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Birth: </td>
                    <td className="ancestor-box-border-bottom table-content">{birthDate} <br />{birthPlace}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Death:</td>
                    <td className="ancestor-box-border-bottom table-content">{deathDate} <br />{deathPlace}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                    <td className="ancestor-box-border-bottom table-content">{occupation}</td>
                </tr>
                <tr>
                    <td className=" table-label shrink">Profile <br/>Number:</td>
                    <td className="table-content">{profileNumber}</td>
                </tr>
            </table>
        ) : (
            <>
            {childID ? (
                <table className="unknown-ancestor">
                    <tr><p></p></tr>
                    <tr></tr>
                    <tr colSpan="5" rowSpan="6" className="unknown-ancestor-cell"><button onClick={openAddModal}>Add {motherFather}</button></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                </table>
            ) : (
                <table className="empty-slot">
                    <tr colSpan="5" rowSpan="6"><p></p></tr>
                </table>
            )}
            </>
        )}</>
        )
    };

    const checkIfGGHasParents = async (greatgrandparentID, setHasParents) => { 
        if (greatgrandparentID) {
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/check-if-great-grandparent-has-parents', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, greatgrandparentID }),
            })

            const data = await response.json();
            setHasParents(data);
     }
    }

    checkIfGGHasParents(paternalPaternalGreatGrandfatherProfileNumber, setPaternalPaternalGreatGrandfatherHasParents)
    checkIfGGHasParents(paternalPaternalGreatGrandmotherProfileNumber, setPaternalPaternalGreatGrandmotherHasParents)

    checkIfGGHasParents(paternalMaternalGreatGrandfatherProfileNumber, setPaternalMaternalGreatGrandfatherHasParents)
    checkIfGGHasParents(paternalMaternalGreatGrandmotherProfileNumber, setPaternalMaternalGreatGrandmotherHasParents)

    checkIfGGHasParents(maternalPaternalGreatGrandfatherProfileNumber, setMaternalPaternalGreatGrandfatherHasParents)
    checkIfGGHasParents(maternalPaternalGreatGrandmotherProfileNumber, setMaternalPaternalGreatGrandmotherHasParents)

    checkIfGGHasParents(maternalMaternalGreatGrandfatherProfileNumber, setMaternalMaternalGreatGrandfatherHasParents)
    checkIfGGHasParents(maternalMaternalGreatGrandmotherProfileNumber, setMaternalMaternalGreatGrandmotherHasParents)


        // const printPageNum = async (id, setPage) => {

        //     const userId = localStorage.getItem('userId');
        //     const personID = id;
        //     const response = await fetch('http://localhost:5000/get-next-page', {
        //         method: "POST",
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ userId, personID }),
        //     })
        //     const data = await response.json();
            
        //     setPageEntry(data.pageNum)
        // };
        // printPageNum(paternalPaternalGreatGrandfatherID, setPaternalPaternalGreatGrandfatherPage)
 


    return (
        <div>

            {makeModal(showFather, closeAddFatherModal, bottomPagePersonFirstName, setFatherDetails, fatherDetails, "male", saveFatherChanges, closeAddFatherModal)}

            {makeModal(showMother, closeAddMotherModal, bottomPagePersonFirstName, setMotherDetails, motherDetails, "female", saveMotherChanges, closeAddMotherModal)}

            {makeModal(showPaternalGrandfather, closeAddPaternalGrandfatherModal, fatherName, setPaternalGrandfatherDetails, paternalGrandfatherDetails, "male", savePaternalGrandfatherChanges, closeAddPaternalGrandfatherModal)}
            
            {makeModal(showPaternalGrandmother, closeAddPaternalGrandmotherModal, fatherName, setPaternalGrandmotherDetails, paternalGrandmotherDetails, "female", savePaternalGrandmotherChanges, closeAddPaternalGrandmotherModal)}

            {makeModal(showMaternalGrandfather, closeAddMaternalGrandfatherModal, motherName, setMaternalGrandfatherDetails, maternalGrandfatherDetails, "male", saveMaternalGrandfatherChanges, closeAddMaternalGrandfatherModal)}

            {makeModal(showMaternalGrandmother, closeAddMaternalGrandmotherModal, motherName, setMaternalGrandmotherDetails, maternalGrandmotherDetails, "female", saveMaternalGrandmotherChanges, closeAddMaternalGrandmotherModal)}

            {makeModal(showPaternalPaternalGreatGrandfather, closeAddPaternalPaternalGreatGrandfatherModal, paternalGrandfatherName, setPaternalPaternalGreatGrandfatherDetails, paternalPaternalGreatGrandfatherDetails, "male", savePaternalPaternalGreatGrandfatherChanges, closeAddPaternalPaternalGreatGrandfatherModal)}

            {makeModal(showPaternalPaternalGreatGrandmother, closeAddPaternalPaternalGreatGrandmotherModal, paternalGrandfatherName, setPaternalPaternalGreatGrandmotherDetails, paternalPaternalGreatGrandmotherDetails, "female", savePaternalPaternalGreatGrandmotherChanges, closeAddPaternalPaternalGreatGrandmotherModal)}

            {makeModal(showPaternalMaternalGreatGrandfather, closeAddPaternalMaternalGreatGrandfatherModal, paternalGrandmotherName, setPaternalMaternalGreatGrandfatherDetails, paternalMaternalGreatGrandfatherDetails, "male", savePaternalMaternalGreatGrandfatherChanges, closeAddPaternalMaternalGreatGrandfatherModal)}

            {makeModal(showPaternalMaternalGreatGrandmother, closeAddPaternalMaternalGreatGrandmotherModal, paternalGrandmotherName, setPaternalMaternalGreatGrandmotherDetails, paternalMaternalGreatGrandmotherDetails, "female", savePaternalMaternalGreatGrandmotherChanges, closeAddPaternalMaternalGreatGrandmotherModal)}

            {makeModal(showMaternalPaternalGreatGrandfather, closeAddMaternalPaternalGreatGrandfatherModal, maternalGrandfatherName, setMaternalPaternalGreatGrandfatherDetails, maternalPaternalGreatGrandfatherDetails, "male", saveMaternalPaternalGreatGrandfatherChanges, closeAddMaternalPaternalGreatGrandfatherModal)}

            {makeModal(showMaternalPaternalGreatGrandmother, closeAddMaternalPaternalGreatGrandmotherModal, maternalGrandfatherName, setMaternalPaternalGreatGrandmotherDetails, maternalPaternalGreatGrandmotherDetails, "female", saveMaternalPaternalGreatGrandmotherChanges, closeAddMaternalPaternalGreatGrandmotherModal)}

            {makeModal(showMaternalMaternalGreatGrandfather, closeAddMaternalMaternalGreatGrandfatherModal, maternalGrandmotherName, setMaternalMaternalGreatGrandfatherDetails, maternalMaternalGreatGrandfatherDetails, "male", saveMaternalMaternalGreatGrandfatherChanges, closeAddMaternalMaternalGreatGrandfatherModal)}

            {makeModal(showMaternalMaternalGreatGrandmother, closeAddMaternalMaternalGreatGrandmotherModal, maternalGrandmotherName, setMaternalMaternalGreatGrandmotherDetails, maternalMaternalGreatGrandmotherDetails, "female", saveMaternalMaternalGreatGrandmotherChanges, closeAddMaternalMaternalGreatGrandmotherModal)}



            {makeModal(showPaternalPaternalGreatGrandfathersFather, closeAddPaternalPaternalGreatGrandfathersFatherModal, paternalPaternalGreatGrandfatherName, setPaternalPaternalGreatGrandfathersFatherDetails, paternalPaternalGreatGrandfathersFatherDetails, "male", savePaternalPaternalGreatGrandfathersFatherChanges, closeAddPaternalPaternalGreatGrandfathersFatherModal)}

            {makeModal(showPaternalPaternalGreatGrandfathersMother, closeAddPaternalPaternalGreatGrandfathersMotherModal, paternalPaternalGreatGrandfatherName, setPaternalPaternalGreatGrandfathersMotherDetails, paternalPaternalGreatGrandfathersMotherDetails, "female", savePaternalPaternalGreatGrandfathersMotherChanges, closeAddPaternalPaternalGreatGrandfathersMotherModal)}

            {makeModal(showPaternalPaternalGreatGrandmothersFather, closeAddPaternalPaternalGreatGrandmothersFatherModal, paternalPaternalGreatGrandmotherName, setPaternalPaternalGreatGrandmothersFatherDetails, paternalPaternalGreatGrandmothersFatherDetails, "male", savePaternalPaternalGreatGrandmothersFatherChanges, closeAddPaternalPaternalGreatGrandmothersFatherModal)}

            {makeModal(showPaternalPaternalGreatGrandmothersMother, closeAddPaternalPaternalGreatGrandmothersMotherModal, paternalPaternalGreatGrandmotherName, setPaternalPaternalGreatGrandmothersMotherDetails, paternalPaternalGreatGrandmothersMotherDetails, "female", savePaternalPaternalGreatGrandmothersMotherChanges, closeAddPaternalPaternalGreatGrandmothersMotherModal)}

          

            {makeModal(showPaternalMaternalGreatGrandfathersFather, closeAddPaternalMaternalGreatGrandfathersFatherModal, paternalMaternalGreatGrandfatherName, setPaternalMaternalGreatGrandfathersFatherDetails, paternalMaternalGreatGrandfathersFatherDetails, "male", savePaternalMaternalGreatGrandfathersFatherChanges, closeAddPaternalMaternalGreatGrandfathersFatherModal)}

            {makeModal(showPaternalMaternalGreatGrandfathersMother, closeAddPaternalMaternalGreatGrandfathersMotherModal, paternalMaternalGreatGrandfatherName, setPaternalMaternalGreatGrandfathersMotherDetails, paternalMaternalGreatGrandfathersMotherDetails, "female", savePaternalMaternalGreatGrandfathersMotherChanges, closeAddPaternalMaternalGreatGrandfathersMotherModal)}

            {makeModal(showPaternalMaternalGreatGrandmothersFather, closeAddPaternalMaternalGreatGrandmothersFatherModal, paternalMaternalGreatGrandmotherName, setPaternalMaternalGreatGrandmothersFatherDetails, paternalMaternalGreatGrandmothersFatherDetails, "male", savePaternalMaternalGreatGrandmothersFatherChanges, closeAddPaternalMaternalGreatGrandmothersFatherModal)}

            {makeModal(showPaternalMaternalGreatGrandmothersMother, closeAddPaternalMaternalGreatGrandmothersMotherModal, paternalMaternalGreatGrandmotherName, setPaternalMaternalGreatGrandmothersMotherDetails, paternalMaternalGreatGrandmothersMotherDetails, "female", savePaternalMaternalGreatGrandmothersMotherChanges, closeAddPaternalMaternalGreatGrandmothersMotherModal)}



            {makeModal(showMaternalPaternalGreatGrandfathersFather, closeAddMaternalPaternalGreatGrandfathersFatherModal, maternalPaternalGreatGrandfatherName, setMaternalPaternalGreatGrandfathersFatherDetails, maternalPaternalGreatGrandfathersFatherDetails, "male", saveMaternalPaternalGreatGrandfathersFatherChanges, closeAddMaternalPaternalGreatGrandfathersFatherModal)}

            {makeModal(showMaternalPaternalGreatGrandfathersMother, closeAddMaternalPaternalGreatGrandfathersMotherModal, maternalPaternalGreatGrandfatherName, setMaternalPaternalGreatGrandfathersMotherDetails, maternalPaternalGreatGrandfathersMotherDetails, "female", saveMaternalPaternalGreatGrandfathersMotherChanges, closeAddMaternalPaternalGreatGrandfathersMotherModal)}


            {makeModal(showMaternalPaternalGreatGrandmothersFather, closeAddMaternalPaternalGreatGrandmothersFatherModal, maternalPaternalGreatGrandmotherName, setMaternalPaternalGreatGrandmothersFatherDetails, maternalPaternalGreatGrandmothersFatherDetails, "male", saveMaternalPaternalGreatGrandmothersFatherChanges, closeAddMaternalPaternalGreatGrandmothersFatherModal)}

            {makeModal(showMaternalPaternalGreatGrandmothersMother, closeAddMaternalPaternalGreatGrandmothersMotherModal, maternalPaternalGreatGrandmotherName, setMaternalPaternalGreatGrandmothersMotherDetails, maternalPaternalGreatGrandmothersMotherDetails, "female", saveMaternalPaternalGreatGrandmothersMotherChanges, closeAddMaternalPaternalGreatGrandmothersMotherModal)}



            {makeModal(showMaternalMaternalGreatGrandfathersFather, closeAddMaternalMaternalGreatGrandfathersFatherModal, maternalMaternalGreatGrandfatherName, setMaternalMaternalGreatGrandfathersFatherDetails, maternalMaternalGreatGrandfathersFatherDetails, "male", saveMaternalMaternalGreatGrandfathersFatherChanges, closeAddMaternalMaternalGreatGrandfathersFatherModal)}

            {makeModal(showMaternalMaternalGreatGrandfathersMother, closeAddMaternalMaternalGreatGrandfathersMotherModal, maternalMaternalGreatGrandfatherName, setMaternalMaternalGreatGrandfathersMotherDetails, maternalMaternalGreatGrandfathersMotherDetails, "female", saveMaternalMaternalGreatGrandfathersMotherChanges, closeAddMaternalMaternalGreatGrandfathersMotherModal)}

            {makeModal(showMaternalMaternalGreatGrandmothersFather, closeAddMaternalMaternalGreatGrandmothersFatherModal, maternalMaternalGreatGrandmotherName, setMaternalMaternalGreatGrandmothersFatherDetails, maternalMaternalGreatGrandmothersFatherDetails, "male", saveMaternalMaternalGreatGrandmothersFatherChanges, closeAddMaternalMaternalGreatGrandmothersFatherModal)}

            {makeModal(showMaternalMaternalGreatGrandmothersMother, closeAddMaternalMaternalGreatGrandmothersMotherModal, maternalMaternalGreatGrandmotherName, setMaternalMaternalGreatGrandmothersMotherDetails, maternalMaternalGreatGrandmothersMotherDetails, "female", saveMaternalMaternalGreatGrandmothersMotherChanges, closeAddMaternalMaternalGreatGrandmothersMotherModal)}



            
            
            <div className="row">
                <LeftSidebar />

                {/*contains the whole tree*/}
                <div className="col">

                <div className="row scrollable">

                    <div id="tree-container scrollable">

                    {/*contains great-grandparents*/}
                    <div className="row">

                        <div className="row arrow-page-num-div">

                            <div className="col">
                                {paternalPaternalGreatGrandfatherProfileNumber ? (
                                    <>
                                    {paternalPaternalGreatGrandfatherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalPaternalGreatGrandfatherProfileNumber)}>Page: {paternalPaternalGreatGrandfatherPage}<br />⇑</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="up-arrow gg-parent-buttons">
                                                <button onClick={openAddPaternalPaternalGreatGrandfathersFatherModal}>Add Father</button>
                                                <button onClick={openAddPaternalPaternalGreatGrandfathersMotherModal}>Add Mother</button>
                                            </div>
                                        </div>
                                    )}
                                    </>
                                ) : ( 
                                    <div >
                                        <p className="up-arrow"> <br /></p>
                                    </div>
                                    )
                                }
                            </div>

                            <div className="col">
                                {paternalPaternalGreatGrandmotherProfileNumber ? (
                                    <>
                                    {paternalPaternalGreatGrandmotherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalPaternalGreatGrandmotherProfileNumber)}>Page: <br />⇑</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="up-arrow gg-parent-buttons">
                                                <button onClick={openAddPaternalPaternalGreatGrandmothersFatherModal}>Add Father</button>
                                                <button onClick={openAddPaternalPaternalGreatGrandmothersMotherModal}>Add Mother</button>
                                            </div>
                                        </div>
                                    )}
                                    </>
                                ) : ( 
                                    <div >
                                        <p className="up-arrow"> <br /></p>
                                    </div>
                                    )
                                }
                            </div>

                            <div className="col">
                                {paternalMaternalGreatGrandfatherProfileNumber ? (
                                    <>
                                    {paternalMaternalGreatGrandfatherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalMaternalGreatGrandfatherProfileNumber)}>Page: <br />⇑</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="up-arrow gg-parent-buttons">
                                                <button onClick={openAddPaternalMaternalGreatGrandfathersFatherModal}>Add Father</button>
                                                <button onClick={openAddPaternalMaternalGreatGrandfathersMotherModal}>Add Mother</button>
                                            </div>
                                        </div>
                                    )}
                                    </>
                                ) : ( 
                                    <div >
                                        <p className="up-arrow"> <br /></p>
                                    </div>
                                    )
                                }
                            </div>
                               
                            <div className="col">
                                {paternalMaternalGreatGrandmotherProfileNumber ? (
                                    <>
                                    {paternalMaternalGreatGrandmotherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalMaternalGreatGrandmotherProfileNumber)}>Page: <br />⇑</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="up-arrow gg-parent-buttons">
                                                <button onClick={openAddPaternalMaternalGreatGrandmothersFatherModal}>Add Father</button>
                                                <button onClick={openAddPaternalMaternalGreatGrandmothersMotherModal}>Add Mother</button>
                                            </div>
                                        </div>
                                    )}
                                    </>
                                ) : ( 
                                    <div >
                                        <p className="up-arrow"> <br /></p>
                                    </div>
                                    )
                                }
                            </div>

                            <div className="col">
                                {maternalPaternalGreatGrandfatherProfileNumber ? (
                                    <>
                                    {maternalPaternalGreatGrandfatherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalPaternalGreatGrandfatherProfileNumber)}>Page: <br />⇑</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="up-arrow gg-parent-buttons">
                                                <button onClick={openAddMaternalPaternalGreatGrandfathersFatherModal}>Add Father</button>
                                                <button onClick={openAddMaternalPaternalGreatGrandfathersMotherModal}>Add Mother</button>
                                            </div>
                                        </div>
                                    )}
                                    </>
                                ) : ( 
                                    <div >
                                        <p className="up-arrow"> <br /></p>
                                    </div>
                                    )
                                }
                            </div>

                            <div className="col">
                                {maternalPaternalGreatGrandmotherProfileNumber ? (
                                    <>
                                    {maternalPaternalGreatGrandmotherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalPaternalGreatGrandmotherProfileNumber)}>Page: <br />⇑</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="up-arrow gg-parent-buttons">
                                                <button onClick={openAddMaternalPaternalGreatGrandmothersFatherModal}>Add Father</button>
                                                <button onClick={openAddMaternalPaternalGreatGrandmothersMotherModal}>Add Mother</button>
                                            </div>
                                        </div>
                                    )}
                                    </>
                                ) : ( 
                                    <div >
                                        <p className="up-arrow"> <br /></p>
                                    </div>
                                    )
                                }
                            </div>

                            <div className="col">
                                {maternalMaternalGreatGrandfatherProfileNumber ? (
                                    <>
                                    {maternalMaternalGreatGrandfatherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalMaternalGreatGrandfatherProfileNumber)}>Page: <br />⇑</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="up-arrow gg-parent-buttons">
                                                <button onClick={openAddMaternalMaternalGreatGrandfathersFatherModal}>Add Father</button>
                                                <button onClick={openAddMaternalMaternalGreatGrandfathersMotherModal}>Add Mother</button>
                                            </div>
                                        </div>
                                    )}
                                    </>
                                ) : ( 
                                    <div >
                                        <p className="up-arrow"> <br /></p>
                                    </div>
                                    )
                                }
                            </div>

                            <div className="col">
                                {maternalMaternalGreatGrandmotherProfileNumber ? (
                                    <>
                                    {maternalMaternalGreatGrandmotherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalMaternalGreatGrandmotherProfileNumber)}>Page: <br />⇑</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="up-arrow gg-parent-buttons">
                                                <button onClick={openAddMaternalMaternalGreatGrandmothersFatherModal}>Add Father</button>
                                                <button onClick={openAddMaternalMaternalGreatGrandmothersMotherModal}>Add Mother</button>
                                            </div>
                                        </div>
                                    )}
                                    </>
                                ) : ( 
                                    <div >
                                        <p className="up-arrow"> <br /></p>
                                    </div>
                                    )
                                }
                            </div>

                                
                        </div>

                        <div className="tree-row justify-content-center">

                            {showGreatGrandParentTable(paternalPaternalGreatGrandfatherID, basePersonFirstName, paternalPaternalGreatGrandfatherRelationToUser, "male", paternalPaternalGreatGrandfatherName, paternalPaternalGreatGrandfatherBirthDate, paternalPaternalGreatGrandfatherDeathDate, paternalPaternalGreatGrandfatherBirthPlace, paternalPaternalGreatGrandfatherDeathPlace, paternalPaternalGreatGrandfatherOccupation, paternalPaternalGreatGrandfatherProfileNumber, paternalGrandfatherID, openAddPaternalPaternalGreatGrandfatherModal)}

                            {showGreatGrandParentTable(paternalPaternalGreatGrandmotherID, basePersonFirstName, paternalPaternalGreatGrandmotherRelationToUser, "female", paternalPaternalGreatGrandmotherName, paternalPaternalGreatGrandmotherBirthDate, paternalPaternalGreatGrandmotherDeathDate, paternalPaternalGreatGrandmotherBirthPlace, paternalPaternalGreatGrandmotherDeathPlace, paternalPaternalGreatGrandmotherOccupation, paternalPaternalGreatGrandmotherProfileNumber, paternalGrandfatherID, openAddPaternalPaternalGreatGrandmotherModal)}

                            {showGreatGrandParentTable(paternalMaternalGreatGrandfatherID, basePersonFirstName, paternalMaternalGreatGrandfatherRelationToUser, "male", paternalMaternalGreatGrandfatherName, paternalMaternalGreatGrandfatherBirthDate, paternalMaternalGreatGrandfatherDeathDate, paternalMaternalGreatGrandfatherBirthPlace, paternalMaternalGreatGrandfatherDeathPlace, paternalMaternalGreatGrandfatherOccupation, paternalMaternalGreatGrandfatherProfileNumber, paternalGrandfatherID, openAddPaternalMaternalGreatGrandfatherModal)}

                            {showGreatGrandParentTable(paternalMaternalGreatGrandmotherID, basePersonFirstName, paternalMaternalGreatGrandmotherRelationToUser, "female", paternalMaternalGreatGrandmotherName, paternalMaternalGreatGrandmotherBirthDate, paternalMaternalGreatGrandmotherDeathDate, paternalMaternalGreatGrandmotherBirthPlace, paternalMaternalGreatGrandmotherDeathPlace, paternalMaternalGreatGrandmotherOccupation, paternalMaternalGreatGrandmotherProfileNumber, maternalGrandfatherID, openAddPaternalMaternalGreatGrandmotherModal)}

                            {showGreatGrandParentTable(maternalPaternalGreatGrandfatherID, basePersonFirstName, maternalPaternalGreatGrandfatherRelationToUser, "male", maternalPaternalGreatGrandfatherName, maternalPaternalGreatGrandfatherBirthDate, maternalPaternalGreatGrandfatherDeathDate, maternalPaternalGreatGrandfatherBirthPlace, maternalPaternalGreatGrandfatherDeathPlace, maternalPaternalGreatGrandfatherOccupation, maternalPaternalGreatGrandfatherProfileNumber, maternalGrandfatherID, openAddMaternalPaternalGreatGrandfatherModal)}

                            {showGreatGrandParentTable(maternalPaternalGreatGrandmotherID, basePersonFirstName, maternalPaternalGreatGrandmotherRelationToUser, "female", maternalPaternalGreatGrandmotherName, maternalPaternalGreatGrandmotherBirthDate, maternalPaternalGreatGrandmotherDeathDate, maternalPaternalGreatGrandmotherBirthPlace, maternalPaternalGreatGrandmotherDeathPlace, maternalPaternalGreatGrandmotherOccupation, maternalPaternalGreatGrandmotherProfileNumber, maternalGrandfatherID, openAddMaternalPaternalGreatGrandmotherModal)}

                            {showGreatGrandParentTable(maternalMaternalGreatGrandfatherID, basePersonFirstName, maternalMaternalGreatGrandfatherRelationToUser, "male", maternalMaternalGreatGrandfatherName, maternalMaternalGreatGrandfatherBirthDate, maternalMaternalGreatGrandfatherDeathDate, maternalMaternalGreatGrandfatherBirthPlace, maternalMaternalGreatGrandfatherDeathPlace, maternalMaternalGreatGrandfatherOccupation, maternalMaternalGreatGrandfatherProfileNumber, maternalGrandmotherID, openAddMaternalMaternalGreatGrandfatherModal)}

                            {showGreatGrandParentTable(maternalMaternalGreatGrandmotherID, basePersonFirstName, maternalMaternalGreatGrandmotherRelationToUser, "female", maternalMaternalGreatGrandmotherName, maternalMaternalGreatGrandmotherBirthDate, maternalMaternalGreatGrandmotherDeathDate, maternalMaternalGreatGrandmotherBirthPlace, maternalMaternalGreatGrandmotherDeathPlace, maternalMaternalGreatGrandmotherOccupation, maternalMaternalGreatGrandmotherProfileNumber, maternalGrandmotherID, openAddMaternalMaternalGreatGrandmotherModal)}
                           
                        </div>

                    </div>

                    {/*contains grandparents*/}
                    <div className="row tree-row">

                        <div className="tree-row justify-content-center">

                        {showAncestorTable(paternalGrandfatherID, basePersonFirstName, paternalGrandfatherRelationToUser, "male", paternalGrandfatherName, paternalGrandfatherBirthDate, paternalGrandfatherDeathDate, paternalGrandfatherBirthPlace, paternalGrandfatherDeathPlace, paternalGrandfatherOccupation, paternalGrandfatherProfileNumber, fatherID, openAddPaternalGrandfatherModal)}

                        {showAncestorTable(paternalGrandmotherID, basePersonFirstName, paternalGrandmotherRelationToUser, "female", paternalGrandmotherName, paternalGrandmotherBirthDate, paternalGrandmotherDeathDate, paternalGrandmotherBirthPlace, paternalGrandmotherDeathPlace, paternalGrandmotherOccupation, paternalGrandmotherProfileNumber, fatherID, openAddPaternalGrandmotherModal)}

                        {showAncestorTable(maternalGrandfatherID, basePersonFirstName, maternalGrandfatherRelationToUser, "male", maternalGrandfatherName, maternalGrandfatherBirthDate, maternalGrandfatherDeathDate, maternalGrandfatherBirthPlace, maternalGrandfatherDeathPlace, maternalGrandfatherOccupation, maternalGrandfatherProfileNumber, motherID, openAddMaternalGrandfatherModal)}

                        {showAncestorTable(maternalGrandmotherID, basePersonFirstName, maternalGrandmotherRelationToUser, "female", maternalGrandmotherName, maternalGrandmotherBirthDate, maternalGrandmotherDeathDate, maternalGrandmotherBirthPlace, maternalGrandmotherDeathPlace, maternalGrandmotherOccupation, maternalGrandmotherProfileNumber, motherID, openAddMaternalGrandmotherModal)}

                        </div>

                    </div>

                    {/*contains parents*/}
                    <div className="row tree-row">

                        <div className="tree-row justify-content-center">

                        {showAncestorTable(fatherID, basePersonFirstName, fatherRelationToUser, "male", fatherName, fatherBirthDate, fatherDeathDate, fatherBirthPlace, fatherDeathPlace, fatherOccupation, fatherProfileNumber, basePersonID, openAddFatherModal)}

                        {showAncestorTable(motherID, basePersonFirstName, motherRelationToUser, "female", motherName, motherBirthDate, motherDeathDate, motherBirthPlace, motherDeathPlace, motherOccupation, motherProfileNumber, basePersonID, openAddMotherModal)}

         
                        
                        

                        </div>

                    </div>

                    {/*person at the bottom of page*/}
                    <div className="row tree-row">

                        <div className="col-sm ">

                            <div className="tree-row justify-content-center">

                            {showAncestorTable(true, basePersonFirstName, bottomRelationToBaseUser, bottomPersonSex, bottomPagePersonFullName, bottomPagePersonBirthDate, bottomPagePersonDeathDate, bottomPagePersonBirthPlace, bottomPagePersonDeathPlace, bottomPagePersonOccupation, bottomPagePersonProfileNumber, basePersonID)}

                            
                            </div>
                            
                            {pageNumber !== 1 ? (
                                <div className="col">
                                    <p className="up-arrow" onClick={() => navigateDown(bottomPagePersonProfileNumber)}>⇓</p>
                                </div>
                            ) : (
                                <></>
                            )}
                                
                            

                            
                        </div>
                    </div>

                    </div>

                </div>

                <div className="row bottom-bar">

                    <div className="bottom-bar-content">
                        <p>Current Page: {pageNumber}/{totalNumOfPages}</p>

                        <div className="bottom-bar-searching">
                            <label style={{marginRight:"3px"}}>Go To Page</label>
                            <input style={{marginRight:"3px"}} type="text" className="bottom-bar-search" onChange={handlePageEntry}></input>
                            <button style={{marginRight:"10px"}} className="bottom-bar-button" onClick={() => {setNewPageNum(pageEntry)}}>Go</button>
                            <button style={{marginRight:"3px"}} className="bottom-bar-button" onClick={() => {setNewPageNum(1)}}>Return To Base Person</button>
                            <button style={{marginRight:"3px"}} className="bottom-bar-button" onClick={() => {
                                setNewPageNum(Math.floor(Math.random() * (totalNumOfPages - 1) + 1))
                            }}>Random Page</button>
                        </div>

                    </div>

                </div>
                    
                </div>

            </div>


        </div>
    )
}

export default FamilyTree;