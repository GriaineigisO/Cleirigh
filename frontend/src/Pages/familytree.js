import LeftSidebar from "../Components/leftSidebar"
import React, { useState, useEffect, Component } from 'react';
import { convertDate, convertNumToRelation, capitaliseFirstLetter } from '../library.js';
import { Modal, Button } from 'react-bootstrap';
import editLogo from '../Images/edit.png';
import warningLogo from '../Images/warning.png';
import '../style.css';
import treeLines from '../cleirighTreeLines.png'

//paternalpaternalgreatgrandparents = paternal grandfather's parents
//paternalmaternalgreatgrandparents = paternal grandmother's parents
//maternalpaternalgrandparents = maternal grandfather's parents
//maternalmaternalgrandparents = maternal grandmother's parents

const FamilyTree = () => {

    const [addRepeatAncestorSection, setAddRepeatAncestorSection] = useState(false)



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

    const [editShowBottomPerson, seteditShowBottomPerson] = useState(false);
    const [editShowFather, seteditShowFather] = useState(false);
    const [editShowMother, seteditShowMother] = useState(false);
    const [editShowPaternalGrandfather, seteditShowPaternalGrandfather] = useState(false);
    const [editShowPaternalGrandmother, seteditShowPaternalGrandmother] = useState(false);
    const [editShowMaternalGrandfather, seteditShowMaternalGrandfather] = useState(false);
    const [editShowMaternalGrandmother, seteditShowMaternalGrandmother] = useState(false);
    const [editShowPaternalPaternalGreatGrandfather, seteditShowPaternalPaternalGreatGrandfather] = useState(false);
    const [editShowPaternalPaternalGreatGrandmother, seteditShowPaternalPaternalGreatGrandmother] = useState(false);
    const [editShowPaternalMaternalGreatGrandfather, seteditShowPaternalMaternalGreatGrandfather] = useState(false);
    const [editShowPaternalMaternalGreatGrandmother, seteditShowPaternalMaternalGreatGrandmother] = useState(false);
    const [editShowMaternalPaternalGreatGrandfather, seteditShowMaternalPaternalGreatGrandfather] = useState(false);
    const [editShowMaternalPaternalGreatGrandmother, seteditShowMaternalPaternalGreatGrandmother] = useState(false);
    const [editShowMaternalMaternalGreatGrandfather, seteditShowMaternalMaternalGreatGrandfather] = useState(false);
    const [editShowMaternalMaternalGreatGrandmother, seteditShowMaternalMaternalGreatGrandmother] = useState(false);

    const [editShowPaternalPaternalGreatGrandfathersFather, seteditShowPaternalPaternalGreatGrandfathersFather] = useState(false);
    const [editShowPaternalPaternalGreatGrandfathersMother, seteditShowPaternalPaternalGreatGrandfathersMother] = useState(false);
    const [editShowPaternalPaternalGreatGrandmothersFather, seteditShowPaternalPaternalGreatGrandmothersFather] = useState(false);
    const [editShowPaternalPaternalGreatGrandmothersMother, seteditShowPaternalPaternalGreatGrandmothersMother] = useState(false);

    const [editShowPaternalMaternalGreatGrandfathersFather, seteditShowPaternalMaternalGreatGrandfathersFather] = useState(false);
    const [editShowPaternalMaternalGreatGrandfathersMother, seteditShowPaternalMaternalGreatGrandfathersMother] = useState(false);
    const [editShowPaternalMaternalGreatGrandmothersFather, seteditShowPaternalMaternalGreatGrandmothersFather] = useState(false);
    const [editShowPaternalMaternalGreatGrandmothersMother, seteditShowPaternalMaternalGreatGrandmothersMother] = useState(false);

    const [editShowMaternalPaternalGreatGrandfathersFather, seteditShowMaternalPaternalGreatGrandfathersFather] = useState(false);
    const [editShowMaternalPaternalGreatGrandfathersMother, seteditShowMaternalPaternalGreatGrandfathersMother] = useState(false);
    const [editShowMaternalPaternalGreatGrandmothersFather, seteditShowMaternalPaternalGreatGrandmothersFather] = useState(false);
    const [editShowMaternalPaternalGreatGrandmothersMother, seteditShowMaternalPaternalGreatGrandmothersMother] = useState(false);

    const [editShowMaternalMaternalGreatGrandfathersFather, seteditShowMaternalMaternalGreatGrandfathersFather] = useState(false);
    const [editShowMaternalMaternalGreatGrandfathersMother, seteditShowMaternalMaternalGreatGrandfathersMother] = useState(false);
    const [editShowMaternalMaternalGreatGrandmothersFather, seteditShowMaternalMaternalGreatGrandmothersFather] = useState(false);
    const [editShowMaternalMaternalGreatGrandmothersMother, seteditShowMaternalMaternalGreatGrandmothersMother] = useState(false);

    const [showDeletePopup, setShowDeletePop] = useState(false)
    const [showSaveProgressHerePopup, setShowSaveProgressHerePopup] = useState(false)
    const [progressNote, setProgressNote] = useState();
    const [progressPerson, setProgressPerson] = useState();

    const closeDeletePopup = () => setShowDeletePop(false);
    const openDeletePopup = () => setShowDeletePop(true);

    const closeSaveProgressHerePopup = () => setShowSaveProgressHerePopup(false);
    const openSaveProgressHerePopup = () => setShowSaveProgressHerePopup(true);

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

    

    const closeEditBottomPersonModal = () => seteditShowBottomPerson(false);
    const openEditBottomPersonModal = () => seteditShowBottomPerson(true);

    const closeEditFatherModal = () => seteditShowFather(false);
    const openEditFatherModal = () => seteditShowFather(true);

    const closeEditMotherModal = () => seteditShowMother(false);
    const openEditMotherModal = () => seteditShowMother(true);

    const closeEditPaternalGrandfatherModal = () => seteditShowPaternalGrandfather(false);
    const openEditPaternalGrandfatherModal = () => seteditShowPaternalGrandfather(true);

    const closeEditPaternalGrandmotherModal = () => seteditShowPaternalGrandmother(false);
    const openEditPaternalGrandmotherModal = () => seteditShowPaternalGrandmother(true);

    const closeEditMaternalGrandfatherModal = () => seteditShowMaternalGrandfather(false);
    const openEditMaternalGrandfatherModal = () => seteditShowMaternalGrandfather(true);

    const closeEditMaternalGrandmotherModal = () => seteditShowMaternalGrandmother(false);
    const openEditMaternalGrandmotherModal = () => seteditShowMaternalGrandmother(true);

    const closeEditPaternalPaternalGreatGrandfatherModal = () => seteditShowPaternalPaternalGreatGrandfather(false);
    const openEditPaternalPaternalGreatGrandfatherModal = () => seteditShowPaternalPaternalGreatGrandfather(true);

    const closeEditPaternalPaternalGreatGrandmotherModal = () => seteditShowPaternalPaternalGreatGrandmother(false);
    const openEditPaternalPaternalGreatGrandmotherModal = () => seteditShowPaternalPaternalGreatGrandmother(true);

    const closeEditPaternalMaternalGreatGrandfatherModal = () => seteditShowPaternalMaternalGreatGrandfather(false);
    const openEditPaternalMaternalGreatGrandfatherModal = () => seteditShowPaternalMaternalGreatGrandfather(true);

    const closeEditPaternalMaternalGreatGrandmotherModal = () => seteditShowPaternalMaternalGreatGrandmother(false);
    const openEditPaternalMaternalGreatGrandmotherModal = () => seteditShowPaternalMaternalGreatGrandmother(true);


    const closeEditMaternalPaternalGreatGrandfatherModal = () => seteditShowMaternalPaternalGreatGrandfather(false);
    const openEditMaternalPaternalGreatGrandfatherModal = () => seteditShowMaternalPaternalGreatGrandfather(true);

    const closeEditMaternalPaternalGreatGrandmotherModal = () => seteditShowMaternalPaternalGreatGrandmother(false);
    const openEditMaternalPaternalGreatGrandmotherModal = () => seteditShowMaternalPaternalGreatGrandmother(true);

    const closeEditMaternalMaternalGreatGrandfatherModal = () => seteditShowMaternalMaternalGreatGrandfather(false);
    const openEditMaternalMaternalGreatGrandfatherModal = () => seteditShowMaternalMaternalGreatGrandfather(true);

    const closeEditMaternalMaternalGreatGrandmotherModal = () => seteditShowMaternalMaternalGreatGrandmother(false);
    const openEditMaternalMaternalGreatGrandmotherModal = () => seteditShowMaternalMaternalGreatGrandmother(true);

    const closeEditPaternalPaternalGreatGrandfathersFatherModal = () => seteditShowPaternalPaternalGreatGrandfathersFather(false);
    const openEditPaternalPaternalGreatGrandfathersFatherModal = () => seteditShowPaternalPaternalGreatGrandfathersFather(true);
    const closeEditPaternalPaternalGreatGrandfathersMotherModal = () => seteditShowPaternalPaternalGreatGrandfathersMother(false);
    const openEditPaternalPaternalGreatGrandfathersMotherModal = () => seteditShowPaternalPaternalGreatGrandfathersMother(true);

    const closeEditPaternalPaternalGreatGrandmothersFatherModal = () => seteditShowPaternalPaternalGreatGrandmothersFather(false);
    const openEditPaternalPaternalGreatGrandmothersFatherModal = () => seteditShowPaternalPaternalGreatGrandmothersFather(true);
    const closeEditPaternalPaternalGreatGrandmothersMotherModal = () => seteditShowPaternalPaternalGreatGrandmothersMother(false);
    const openEditPaternalPaternalGreatGrandmothersMotherModal = () => seteditShowPaternalPaternalGreatGrandmothersMother(true);

    const closeEditPaternalMaternalGreatGrandfathersFatherModal = () => seteditShowPaternalMaternalGreatGrandfathersFather(false);
    const openEditPaternalMaternalGreatGrandfathersFatherModal = () => seteditShowPaternalMaternalGreatGrandfathersFather(true);
    const closeEditPaternalMaternalGreatGrandfathersMotherModal = () => seteditShowPaternalMaternalGreatGrandfathersMother(false);
    const openEditPaternalMaternalGreatGrandfathersMotherModal = () => seteditShowPaternalMaternalGreatGrandfathersMother(true);

    const closeEditPaternalMaternalGreatGrandmothersFatherModal = () => seteditShowPaternalMaternalGreatGrandmothersFather(false);
    const openEditPaternalMaternalGreatGrandmothersFatherModal = () => seteditShowPaternalMaternalGreatGrandmothersFather(true);
    const closeEditPaternalMaternalGreatGrandmothersMotherModal = () => seteditShowPaternalMaternalGreatGrandmothersMother(false);
    const openEditPaternalMaternalGreatGrandmothersMotherModal = () => seteditShowPaternalMaternalGreatGrandmothersMother(true);

    const closeEditMaternalPaternalGreatGrandfathersFatherModal = () => seteditShowMaternalPaternalGreatGrandfathersFather(false);
    const openEditMaternalPaternalGreatGrandfathersFatherModal = () => seteditShowMaternalPaternalGreatGrandfathersFather(true);
    const closeEditMaternalPaternalGreatGrandfathersMotherModal = () => seteditShowMaternalPaternalGreatGrandfathersMother(false);
    const openEditMaternalPaternalGreatGrandfathersMotherModal = () => seteditShowMaternalPaternalGreatGrandfathersMother(true);

    const closeEditMaternalPaternalGreatGrandmothersFatherModal = () => seteditShowMaternalPaternalGreatGrandmothersFather(false);
    const openEditMaternalPaternalGreatGrandmothersFatherModal = () => seteditShowMaternalPaternalGreatGrandmothersFather(true);
    const closeEditMaternalPaternalGreatGrandmothersMotherModal = () => seteditShowMaternalPaternalGreatGrandmothersMother(false);
    const openEditMaternalPaternalGreatGrandmothersMotherModal = () => seteditShowMaternalPaternalGreatGrandmothersMother(true);

    const closeEditMaternalMaternalGreatGrandfathersFatherModal = () => seteditShowMaternalMaternalGreatGrandfathersFather(false);
    const openEditMaternalMaternalGreatGrandfathersFatherModal = () => seteditShowMaternalMaternalGreatGrandfathersFather(true);
    const closeEditMaternalMaternalGreatGrandfathersMotherModal = () => seteditShowMaternalMaternalGreatGrandfathersMother(false);
    const openEditMaternalMaternalGreatGrandfathersMotherModal = () => seteditShowMaternalMaternalGreatGrandfathersMother(true);

    const closeEditMaternalMaternalGreatGrandmothersFatherModal = () => seteditShowMaternalMaternalGreatGrandmothersFather(false);
    const openEditMaternalMaternalGreatGrandmothersFatherModal = () => seteditShowMaternalMaternalGreatGrandmothersFather(true);
    const closeEditMaternalMaternalGreatGrandmothersMotherModal = () => seteditShowMaternalMaternalGreatGrandmothersMother(false);
    const openEditMaternalMaternalGreatGrandmothersMotherModal = () => seteditShowMaternalMaternalGreatGrandmothersMother(true);


    const [basePersonDetails, setBasePersonDetails] = useState({});

    const [bottomPersonDetails, setBottomPersonDetails] = useState({});

    const [fatherDetails, setFatherDetails] = useState({});

    const [motherDetails, setMotherDetails] = useState({});

    const [paternalGrandfatherDetails, setPaternalGrandfatherDetails] = useState({});

    const [paternalGrandmotherDetails, setPaternalGrandmotherDetails] = useState({});

    const [maternalGrandfatherDetails, setMaternalGrandfatherDetails] = useState({});

      const [maternalGrandmotherDetails, setMaternalGrandmotherDetails] = useState({});

      const [paternalPaternalGreatGrandfatherDetails, setPaternalPaternalGreatGrandfatherDetails] = useState({});

      const [paternalPaternalGreatGrandfathersFatherDetails, setPaternalPaternalGreatGrandfathersFatherDetails] = useState({});

      const [paternalPaternalGreatGrandfathersMotherDetails, setPaternalPaternalGreatGrandfathersMotherDetails] = useState({});

      const [paternalPaternalGreatGrandmotherDetails, setPaternalPaternalGreatGrandmotherDetails] = useState({});

      const [paternalPaternalGreatGrandmothersFatherDetails, setPaternalPaternalGreatGrandmothersFatherDetails] = useState({});

      const [paternalPaternalGreatGrandmothersMotherDetails, setPaternalPaternalGreatGrandmothersMotherDetails] = useState({});

      const [paternalMaternalGreatGrandfatherDetails, setPaternalMaternalGreatGrandfatherDetails] = useState({});

      const [paternalMaternalGreatGrandfathersFatherDetails, setPaternalMaternalGreatGrandfathersFatherDetails] = useState({});

      const [paternalMaternalGreatGrandfathersMotherDetails, setPaternalMaternalGreatGrandfathersMotherDetails] = useState({});
   
      const [paternalMaternalGreatGrandmotherDetails, setPaternalMaternalGreatGrandmotherDetails] = useState({});

      const [paternalMaternalGreatGrandmothersFatherDetails, setPaternalMaternalGreatGrandmothersFatherDetails] = useState({});

      const [paternalMaternalGreatGrandmothersMotherDetails, setPaternalMaternalGreatGrandmothersMotherDetails] = useState({});

      const [maternalPaternalGreatGrandfatherDetails, setMaternalPaternalGreatGrandfatherDetails] = useState({});

      const [maternalPaternalGreatGrandfathersFatherDetails, setMaternalPaternalGreatGrandfathersFatherDetails] = useState({});

      const [maternalPaternalGreatGrandfathersMotherDetails, setMaternalPaternalGreatGrandfathersMotherDetails] = useState({});
   
      const [maternalPaternalGreatGrandmotherDetails, setMaternalPaternalGreatGrandmotherDetails] = useState({});

      const [maternalPaternalGreatGrandmothersFatherDetails, setMaternalPaternalGreatGrandmothersFatherDetails] = useState({});

      const [maternalPaternalGreatGrandmothersMotherDetails, setMaternalPaternalGreatGrandmothersMotherDetails] = useState({});
   
      const [maternalMaternalGreatGrandfatherDetails, setMaternalMaternalGreatGrandfatherDetails] = useState({});

      const [maternalMaternalGreatGrandfathersFatherDetails, setMaternalMaternalGreatGrandfathersFatherDetails] = useState({});

      const [maternalMaternalGreatGrandfathersMotherDetails, setMaternalMaternalGreatGrandfathersMotherDetails] = useState({});
   

      const [maternalMaternalGreatGrandmotherDetails, setMaternalMaternalGreatGrandmotherDetails] = useState({});

      const [maternalMaternalGreatGrandmothersFatherDetails, setMaternalMaternalGreatGrandmothersFatherDetails] = useState({});

      const [maternalMaternalGreatGrandmothersMotherDetails, setMaternalMaternalGreatGrandmothersMotherDetails] = useState({});


    const [pageNumber, setPageNumber] = useState(1);
    const [totalNumOfPages, setTotalNumOfPages] = useState(1)
    const [pageEntry, setPageEntry] = useState();

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
            setBasePersonDetails((prevDetails) => ({
                ...prevDetails,
                fullName: baseData.fullName,
                firstName: baseData.firstName,
                middleName: baseData.middleName,
                lastName: baseData.lastName,
                id: baseData.id,
                birthDate: baseData.birthDate,
                birthPlace: baseData.birthPlace,
                deathPlace: baseData.deathPlace,
                deathDate: baseData.deathDate,
                occupation: baseData.occupation,
                relationToUser: 0,
                sex: baseData.sex,
                ethnicity: baseData.ethnicity
              }));
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    useEffect(() => {
    fetchInitialData();
    }, [])

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
        console.log(num)
        const userId = localStorage.getItem('userId');
            const pageResponse = fetch('http://localhost:5000/set-current-page-number', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, num }),
        });
        setPageNumber(num)
        window.location.reload()
    }

    
            const getNewPageNum = async () => {
            const userId = localStorage.getItem('userId');
                const pageResponse = await fetch('http://localhost:5000/get-current-page-number', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            
            const pageData = await pageResponse.json();
            setBottomPersonDetails((prevDetails) => ({
                ...prevDetails,
                fullName: pageData.fullName,
                firstName: pageData.firstName,
                middleName: pageData.middleName,
                lastName: pageData.lastName,
                id: pageData.id,
                birthDate: pageData.birthDate,
                birthPlace: pageData.birthPlace,
                deathPlace: pageData.deathPlace,
                deathDate: pageData.deathDate,
                occupation: pageData.occupation,
                relationToUser: pageData.relationToUser,
                ethnicity: pageData.ethnicity,
                causeOfDeath: pageData.causeOfDeath,
                sex: pageData.sex,
                uncertainFirstName: pageData.uncertainFirstName,
                uncertainMiddleName: pageData.uncertainMiddleName,
                uncertainLastName: pageData.uncertainLastName,
                uncertainBirthDate: pageData.uncertainBirthDate,
                uncertainBirthPlace: pageData.uncertainBirthPlace,
                uncertainDeathDate: pageData.uncertainDeathDate,
                uncertainDeathPlace: pageData.uncertainDeathPlace,
                uncertainOccupation: pageData.uncertainOccupation,
                memberOfNobility:pageData.memberOfNobility
              }));
        }
    
        useEffect(() => {
        getNewPageNum();
    }, [pageNumber])

    const navigateDown = async (personID) => {
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
        if (bottomPersonDetails.id) {
            const personID = bottomPersonDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setFatherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.fatherFullName,
                firstName: data.fatherFirstName,
                middleName: data.fatherMiddleName,
                lastName: data.fatherLastName,
                id: data.fatherID,
                birthDate: data.fatherBirthDate,
                birthPlace: data.fatherBirthPlace,
                deathPlace: data.fatherDeathPlace,
                deathDate: data.fatherDeathDate,
                occupation: data.fatherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.fatherEthnicity,
                causeOfDeath: data.causeOfDeath,
                uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility
              }));
        }
    }

    useEffect(() => {
        getFather();
    }, [bottomPersonDetails.id])


    const getMother = async () => {
        if (bottomPersonDetails.id) {
            const personID = bottomPersonDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMotherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.motherFullName,
                firstName: data.motherFirstName,
                middleName: data.motherMiddleName,
                lastName: data.motherLastName,
                id: data.motherID,
                birthDate: data.motherBirthDate,
                birthPlace: data.motherBirthPlace,
                deathPlace: data.motherDeathPlace,
                deathDate: data.motherDeathDate,
                occupation: data.motherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.motherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility
              }));
        }
    }

    useEffect(() => {
        getMother();
    }, [bottomPersonDetails.id])

    const getPaternalGrandFather = async () => {
        if (fatherDetails.id) {
            const personID = fatherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalGrandfatherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.fatherFullName,
                firstName: data.fatherFirstName,
                middleName: data.fatherMiddleName,
                lastName: data.fatherLastName,
                id: data.fatherID,
                birthDate: data.fatherBirthDate,
                birthPlace: data.fatherBirthPlace,
                deathPlace: data.fatherDeathPlace,
                deathDate: data.fatherDeathDate,
                occupation: data.fatherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.fatherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility
              }));
        }
    }

    useEffect(() => {
        getPaternalGrandFather();
    }, [fatherDetails.id])

    const getPaternalGrandMother= async () => {
        if (fatherDetails.id) {
            const personID = fatherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalGrandmotherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.motherFullName,
                firstName: data.motherFirstName,
                middleName: data.motherMiddleName,
                lastName: data.motherLastName,
                id: data.motherID,
                birthDate: data.motherBirthDate,
                birthPlace: data.motherBirthPlace,
                deathPlace: data.motherDeathPlace,
                deathDate: data.motherDeathDate,
                occupation: data.motherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.motherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility
              }));
        }
    }

    useEffect(() => {
        getPaternalGrandMother();
    }, [fatherDetails.id])

    const getMaternalGrandFather = async () => {
        if (motherDetails.id) {
            const personID = motherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalGrandfatherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.fatherFullName,
                firstName: data.fatherFirstName,
                middleName: data.fatherMiddleName,
                lastName: data.fatherLastName,
                id: data.fatherID,
                birthDate: data.fatherBirthDate,
                birthPlace: data.fatherBirthPlace,
                deathPlace: data.fatherDeathPlace,
                deathDate: data.fatherDeathDate,
                occupation: data.fatherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.fatherEthnicity,
                causeOfDeath: data.causeOfDeath,
                uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility
              }));
        }
    }

    useEffect(() => {
        getMaternalGrandFather();
    }, [motherDetails.id])

    const getMaternalGrandMother = async () => {
        if (motherDetails.id) {
            const personID = motherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalGrandmotherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.motherFullName,
                firstName: data.motherFirstName,
                middleName: data.motherMiddleName,
                lastName: data.motherLastName,
                id: data.motherID,
                birthDate: data.motherBirthDate,
                birthPlace: data.motherBirthPlace,
                deathPlace: data.motherDeathPlace,
                deathDate: data.motherDeathDate,
                occupation: data.motherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.motherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation
              }));
        }
    }
    useEffect(() => {
        getMaternalGrandMother();
    }, [motherDetails.id])

   
   const getPaternalPaternalGreatGrandFather = async () => {
        if (paternalGrandfatherDetails.id) {
            const personID = paternalGrandfatherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalPaternalGreatGrandfatherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.fatherFullName,
                firstName: data.fatherFirstName,
                middleName: data.fatherMiddleName,
                lastName: data.fatherLastName,
                id: data.fatherID,
                birthDate: data.fatherBirthDate,
                birthPlace: data.fatherBirthPlace,
                deathPlace: data.fatherDeathPlace,
                deathDate: data.fatherDeathDate,
                occupation: data.fatherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.fatherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility,
                pageNum:data.pageNum
              }));
        }
    }
    useEffect(() => {
        getPaternalPaternalGreatGrandFather();
    }, [paternalGrandfatherDetails.id])


    const getPaternalPaternalGreatGrandMother = async () => {
        if (paternalGrandfatherDetails.id) {
            const personID = paternalGrandfatherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalPaternalGreatGrandmotherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.motherFullName,
                firstName: data.motherFirstName,
                middleName: data.motherMiddleName,
                lastName: data.motherLastName,
                id: data.motherID,
                birthDate: data.motherBirthDate,
                birthPlace: data.motherBirthPlace,
                deathPlace: data.motherDeathPlace,
                deathDate: data.motherDeathDate,
                occupation: data.motherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.motherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility,
                pageNum:data.pageNum
              }));
        }
    }
    useEffect(() => {
        getPaternalPaternalGreatGrandMother();
    }, [paternalGrandfatherDetails.id])


    const getPaternalMaternalGreatGrandFather = async () => {
        if (paternalGrandmotherDetails.id) {
            const personID = paternalGrandmotherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalMaternalGreatGrandfatherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.fatherFullName,
                firstName: data.fatherFirstName,
                middleName: data.fatherMiddleName,
                lastName: data.fatherLastName,
                id: data.fatherID,
                birthDate: data.fatherBirthDate,
                birthPlace: data.fatherBirthPlace,
                deathPlace: data.fatherDeathPlace,
                deathDate: data.fatherDeathDate,
                occupation: data.fatherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.fatherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility,
                pageNum:data.pageNum
              }));
        }
    }
    useEffect(() => {
        getPaternalMaternalGreatGrandFather();
    }, [paternalGrandmotherDetails.id])


    const getPaternalMaternalGreatGrandMother = async () => {
        if (paternalGrandmotherDetails.id) {
            const personID = paternalGrandmotherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setPaternalMaternalGreatGrandmotherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.motherFullName,
                firstName: data.motherFirstName,
                middleName: data.motherMiddleName,
                lastName: data.motherLastName,
                id: data.motherID,
                birthDate: data.motherBirthDate,
                birthPlace: data.motherBirthPlace,
                deathPlace: data.motherDeathPlace,
                deathDate: data.motherDeathDate,
                occupation: data.motherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.motherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility,
                pageNum:data.pageNum
              }));
        }
    }
    useEffect(() => {
        getPaternalMaternalGreatGrandMother();
    }, [paternalGrandmotherDetails.id])


    const getMaternalPaternalGreatGrandFather = async () => {
        if (maternalGrandfatherDetails.id) {
            const personID = maternalGrandfatherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalPaternalGreatGrandfatherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.fatherFullName,
                firstName: data.fatherFirstName,
                middleName: data.fatherMiddleName,
                lastName: data.fatherLastName,
                id: data.fatherID,
                birthDate: data.fatherBirthDate,
                birthPlace: data.fatherBirthPlace,
                deathPlace: data.fatherDeathPlace,
                deathDate: data.fatherDeathDate,
                occupation: data.fatherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.fatherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility,
                pageNum:data.pageNum
              }));
        }
        
    }
    useEffect(() => {
        getMaternalPaternalGreatGrandFather();
    }, [maternalGrandfatherDetails.id])

    const getMaternalPaternalGreatGrandmother = async () => {
        if (maternalGrandfatherDetails.id) {
            const personID = maternalGrandfatherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalPaternalGreatGrandmotherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.motherFullName,
                firstName: data.motherFirstName,
                middleName: data.motherMiddleName,
                lastName: data.motherLastName,
                id: data.motherID,
                birthDate: data.motherBirthDate,
                birthPlace: data.motherBirthPlace,
                deathPlace: data.motherDeathPlace,
                deathDate: data.motherDeathDate,
                occupation: data.motherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.motherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility,
                pageNum:data.pageNum
              }));
        }
    }
    useEffect(() => {
        getMaternalPaternalGreatGrandmother();
    }, [maternalGrandfatherDetails.id])

    const getMaternalMaternalGreatGrandFather = async () => {
        if (maternalGrandmotherDetails.id) {
            const personID = maternalGrandmotherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-father', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalMaternalGreatGrandfatherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.fatherFullName,
                firstName: data.fatherFirstName,
                middleName: data.fatherMiddleName,
                lastName: data.fatherLastName,
                id: data.fatherID,
                birthDate: data.fatherBirthDate,
                birthPlace: data.fatherBirthPlace,
                deathPlace: data.fatherDeathPlace,
                deathDate: data.fatherDeathDate,
                occupation: data.fatherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.fatherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility,
                pageNum:data.pageNum
              }));
        }
    }
    useEffect(() => {
        getMaternalMaternalGreatGrandFather();
    }, [maternalGrandmotherDetails.id])

    const getMaternalMaternalGreatGrandMother = async () => {
        if (maternalGrandmotherDetails.id) {
            const personID = maternalGrandmotherDetails.id;
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/get-mother', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, personID }),
            })

            const data = await response.json();
            setMaternalMaternalGreatGrandmotherDetails((prevDetails) => ({
                ...prevDetails,
                fullName: data.motherFullName,
                firstName: data.motherFirstName,
                middleName: data.motherMiddleName,
                lastName: data.motherLastName,
                id: data.motherID,
                birthDate: data.motherBirthDate,
                birthPlace: data.motherBirthPlace,
                deathPlace: data.motherDeathPlace,
                deathDate: data.motherDeathDate,
                occupation: data.motherOccupation,
                relationToUser: data.relation_to_user,
                ethnicity: data.motherEthnicity,
                causeOfDeath: data.causeOfDeath,
uncertainFirstName: data.uncertainFirstName,
                uncertainMiddleName: data.uncertainMiddleName,
                uncertainLastName: data.uncertainLastName,
                uncertainBirthDate: data.uncertainBirthDate,
                uncertainBirthPlace: data.uncertainBirthPlace,
                uncertainDeathDate: data.uncertainDeathDate,
                uncertainDeathPlace: data.uncertainDeathPlace,
                uncertainOccupation: data.uncertainOccupation,
                memberOfNobility:data.memberOfNobility,
                pageNum:data.pageNum
              }));
        }
    }
    useEffect(() => {
        getMaternalMaternalGreatGrandMother();
    }, [maternalGrandmotherDetails.id])


    //below useEffects automatically supply the surname and ethnicity of the child
    //updates fatherDetails whenever it changes
        useEffect(() => {
                setFatherDetails((prev) => ({
                  ...prev,
                  lastName: bottomPersonDetails.lastName,
                }));
              
        }, [bottomPersonDetails.lastName]);

        useEffect(() => {
                setFatherDetails((prev) => ({
                  ...prev,
                  ethnicity: bottomPersonDetails.ethnicity,
                }));
              
        }, [bottomPersonDetails.ethnicity]);

        //updates motherDetails whenever it changes
        useEffect(() => {
                setMotherDetails((prev) => ({
                  ...prev,
                  ethnicity: bottomPersonDetails.ethnicity,
                }));
              
        }, [bottomPersonDetails.ethnicity]);

        //updates paternalGrandfatherDetails whenever it changes
        useEffect(() => {
                setPaternalGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: fatherDetails.lastName,
                  }))
              
        }, [fatherDetails.lastName]);

        useEffect(() => {
                setPaternalGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: fatherDetails.ethnicity,
                  }))
              
        }, [fatherDetails.ethnicity]);

        //updates paternalGrandmotherDetails whenever it changes
        useEffect(() => {
                setPaternalGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: fatherDetails.ethnicity,
                  }))
        }, [fatherDetails.ethnicity]);

        //updates maternalGrandfatherDetails whenever it changes
        useEffect(() => {
                setMaternalGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: motherDetails.lastName,
                  }))
        }, [motherDetails.lastName]);

        useEffect(() => {
                setMaternalGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: motherDetails.ethnicity,
                  }))
        }, [motherDetails.ethnicity]);

        //updates maternalGrandmotherDetails whenever it changes
        useEffect(() => {
                setMaternalGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: motherDetails.ethnicity,
                  }))
        }, [motherDetails.ethnicity]);

        //updates paternalPaternalGreatGrandfatherDetails whenever it changes
        useEffect(() => {
                setPaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalGrandfatherDetails.lastName,
                  }))
        }, [paternalGrandfatherDetails.lastName]);

        useEffect(() => {
                setPaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalGrandfatherDetails.ethnicity,
                  }))
        }, [paternalGrandfatherDetails.ethnicity]);

        //updates paternalPaternalGreatGrandmotherDetails whenever it changes
        useEffect(() => {
                setPaternalPaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalGrandfatherDetails.ethnicity,
                  }))
        }, [paternalGrandfatherDetails.ethnicity]);

        //updates paternalMaternalGreatGrandfatherDetails whenever it changes
        useEffect(() => {
                setPaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalGrandmotherDetails.lastName,
                  }))
        }, [paternalGrandmotherDetails.lastName]);

        useEffect(() => {
                setPaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalGrandmotherDetails.ethnicity,
                  }))
        }, [paternalGrandmotherDetails.ethnicity]);

        //updates paternalMaternalGreatGrandmotherDetails whenever it changes
        useEffect(() => {
                setPaternalMaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalGrandmotherDetails.ethnicity,
                  }))
        }, [paternalGrandmotherDetails.ethnicity]);

        //updates maternalPaternalGreatGrandfatherDetails whenever it changes
        useEffect(() => {
                setMaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalGrandfatherDetails.lastName,
                  }))
        }, [maternalGrandfatherDetails.lastName]);

        useEffect(() => {
                setMaternalPaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalGrandfatherDetails.ethnicity,
                  }))
        }, [maternalGrandfatherDetails.ethnicity]);

        //updates maternalPaternalGreatGrandmotherDetails whenever it changes
        useEffect(() => {
                setMaternalPaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalGrandfatherDetails.ethnicity,
                  }))
        }, [maternalGrandfatherDetails.ethnicity]);

        //updates maternalMaternalGreatGrandfatherDetails whenever it changes
        useEffect(() => {
                setMaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalGrandmotherDetails.lastName,
                  }))
        }, [maternalGrandmotherDetails.lastName]);

        useEffect(() => {
                setMaternalMaternalGreatGrandfatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalGrandmotherDetails.ethnicity,
                  }))
        }, [maternalGrandmotherDetails.ethnicity]);

        //updates maternalMaternalGreatGrandmotherDetails whenever it changes
        useEffect(() => {
                setMaternalMaternalGreatGrandmotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalGrandmotherDetails.ethnicity,
                  }))
        }, [maternalGrandmotherDetails.ethnicity]);

        //updates paternalPaternalGreatGrandfathersFatherDetails whenever it changes
        useEffect(() => {
                setPaternalPaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalPaternalGreatGrandfatherDetails.lastName,
                  }))
        }, [paternalPaternalGreatGrandfatherDetails.lastName]);

        useEffect(() => {
                setPaternalPaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalPaternalGreatGrandfatherDetails.ethnicity,
                  }))
        }, [paternalPaternalGreatGrandfatherDetails.ethnicity]);

        //updates paternalPaternalGreatGrandfathersMotherDetails whenever it changes
        useEffect(() => {
                setPaternalPaternalGreatGrandfathersMotherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalPaternalGreatGrandfatherDetails.ethnicity,
                  }))
        }, [paternalPaternalGreatGrandfatherDetails.ethnicity]);



        //updates paternalPaternalGreatGrandmothersFatherDetails whenever it changes
        useEffect(() => {
            setPaternalPaternalGreatGrandmothersFatherDetails((prev) => ({
                ...prev,
                lastName: paternalPaternalGreatGrandmotherDetails.lastName,
              }))
    }, [paternalPaternalGreatGrandmotherDetails.lastName]);

    useEffect(() => {
            setPaternalPaternalGreatGrandmothersFatherDetails((prev) => ({
                ...prev,
                ethnicity: paternalPaternalGreatGrandmotherDetails.ethnicity,
              }))
    }, [paternalPaternalGreatGrandmotherDetails.ethnicity]);

    //updates paternalPaternalGreatGrandmothersMotherDetails whenever it changes
    useEffect(() => {
            setPaternalPaternalGreatGrandmothersMotherDetails((prev) => ({
                ...prev,
                ethnicity: paternalPaternalGreatGrandmotherDetails.ethnicity,
              }))
    }, [paternalPaternalGreatGrandmotherDetails.ethnicity]);



        //updates paternalMaternalGreatGrandfathersFatherDetails whenever it changes
        useEffect(() => {
                setPaternalMaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalMaternalGreatGrandfatherDetails.lastName,
                  }))
        }, [paternalMaternalGreatGrandfatherDetails.lastName]);

        useEffect(() => {
                setPaternalMaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalMaternalGreatGrandfatherDetails.ethnicity,
                  }))
        }, [paternalMaternalGreatGrandfatherDetails.ethnicity]);

        //updates paternalMaternalGreatGrandfathersMotherDetails whenever it changes
        useEffect(() => {
                setPaternalMaternalGreatGrandfathersMotherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalMaternalGreatGrandfatherDetails.ethnicity,
                  }))
        }, [paternalMaternalGreatGrandfatherDetails.ethnicity]);

        //updates paternalMaternalGreatGrandmothersFatherDetails whenever it changes
        useEffect(() => {
                setPaternalMaternalGreatGrandmothersFatherDetails((prev) => ({
                    ...prev,
                    lastName: paternalMaternalGreatGrandmotherDetails.lastName,
                  }))
        }, [paternalMaternalGreatGrandmotherDetails.lastName]);

        useEffect(() => {
                setPaternalMaternalGreatGrandmothersFatherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalMaternalGreatGrandmotherDetails.ethnicity,
                  }))
        }, [paternalMaternalGreatGrandmotherDetails.ethnicity]);

        //updates paternalMaternalGreatGrandmothersMotherDetails whenever it changes
        useEffect(() => {
                setPaternalMaternalGreatGrandmothersMotherDetails((prev) => ({
                    ...prev,
                    ethnicity: paternalMaternalGreatGrandmotherDetails.ethnicity,
                  }))
        }, [paternalMaternalGreatGrandmotherDetails.ethnicity]);



         //updates maternalPaternalGreatGrandfathersFatherDetails whenever it changes
         useEffect(() => {
                setMaternalPaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalPaternalGreatGrandfatherDetails.lastName,
                  }))
        }, [maternalPaternalGreatGrandfatherDetails.lastName]);

        useEffect(() => {
                setMaternalPaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalPaternalGreatGrandfatherDetails.ethnicity,
                  }))
        }, [maternalPaternalGreatGrandfatherDetails.ethnicity]);

        //updates maternalPaternalGreatGrandfathersMotherDetails whenever it changes
        useEffect(() => {
                setMaternalPaternalGreatGrandfathersMotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalPaternalGreatGrandfatherDetails.ethnicity,
                  }))
        }, [maternalPaternalGreatGrandfatherDetails.ethnicity]);

         //updates maternalPaternalGreatGrandmothersFatherDetails whenever it changes
         useEffect(() => {
                setMaternalPaternalGreatGrandmothersFatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalPaternalGreatGrandmotherDetails.lastName,
                  }))
        }, [maternalPaternalGreatGrandmotherDetails.lastName]);

        useEffect(() => {
                setMaternalPaternalGreatGrandmothersFatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalPaternalGreatGrandmotherDetails.ethnicity,
                  }))
        }, [maternalPaternalGreatGrandmotherDetails.ethnicity]);

        //updates maternalPaternalGreatGrandmothersMotherDetails whenever it changes
        useEffect(() => {
                setMaternalPaternalGreatGrandmothersMotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalPaternalGreatGrandmotherDetails.ethnicity,
                  }))
        }, [maternalPaternalGreatGrandmotherDetails.ethnicity]);

        //updates MaternalMaternalGreatGrandfathersFatherDetails whenever it changes
        useEffect(() => {
                setMaternalMaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalMaternalGreatGrandfatherDetails.lastName,
                  }))
        }, [maternalMaternalGreatGrandfatherDetails.lastName]);

        useEffect(() => {
                setMaternalMaternalGreatGrandfathersFatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalMaternalGreatGrandfatherDetails.ethnicity,
                  }))
        }, [maternalMaternalGreatGrandfatherDetails.ethnicity]);

        //updates maternalMaternalGreatGrandfathersMotherDetails whenever it changes
        useEffect(() => {
                setMaternalMaternalGreatGrandfathersMotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalMaternalGreatGrandfatherDetails.ethnicity,
                  }))
        }, [maternalMaternalGreatGrandfatherDetails.ethnicity]);


        //updates MaternalMaternalGreatGrandmothersFatherDetails whenever it changes
        useEffect(() => {
                setMaternalMaternalGreatGrandmothersFatherDetails((prev) => ({
                    ...prev,
                    lastName: maternalMaternalGreatGrandmotherDetails.lastName,
                  }))
        }, [maternalMaternalGreatGrandmotherDetails.lastName]);

        useEffect(() => {
                setMaternalMaternalGreatGrandmothersFatherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalMaternalGreatGrandmotherDetails.ethnicity,
                  }))
        }, [maternalMaternalGreatGrandmotherDetails.ethnicity]);

        //updates maternalMaternalGreatGrandmothersMotherDetails whenever it changes
        useEffect(() => {
                setMaternalMaternalGreatGrandmothersMotherDetails((prev) => ({
                    ...prev,
                    ethnicity: maternalMaternalGreatGrandmotherDetails.ethnicity,
                  }))
        }, [maternalMaternalGreatGrandmotherDetails.ethnicity]);


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
                const data = await saveAncestorChanges(fatherDetails, bottomPersonDetails.id, "male");
                setFatherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getFather();
            } catch (error) {
                console.log("Error saving father changes:", error);
            }
        }
        
        const saveMotherChanges = async () => {
            setShowMother(false);
            try {
                const data = await saveAncestorChanges(motherDetails, bottomPersonDetails.id, "female");
                setMotherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));;
                getMother();
            } catch (error) {
                console.log("Error saving mother changes:", error);
            }
        }

        const savePaternalGrandfatherChanges = async () => {
            setShowPaternalGrandfather(false);
            try {
                const data = await saveAncestorChanges(paternalGrandfatherDetails, fatherDetails.id, "male");
                setPaternalGrandfatherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getPaternalGrandFather();
            } catch (error) {
                console.log("Error saving paternal grandfather changes:", error);
            }
        }

        const savePaternalGrandmotherChanges = async () => {
            setShowPaternalGrandmother(false);
            try {
                const data = await saveAncestorChanges(paternalGrandmotherDetails, fatherDetails.id, "female");
                setPaternalGrandmotherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getPaternalGrandMother();
            } catch (error) {
                console.log("Error saving paternal grandmother changes:", error);
            }
        }

        const saveMaternalGrandfatherChanges = async () => {
            setShowMaternalGrandfather(false);
            try {
                const data = await saveAncestorChanges(maternalGrandfatherDetails, motherDetails.id, "male");
                setMaternalGrandfatherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getMaternalGrandFather();
            } catch (error) {
                console.log("Error saving maternal grandfather changes:", error);
            }
        }

        const saveMaternalGrandmotherChanges = async () => {
            setShowMaternalGrandmother(false);
            try {
                const data = await saveAncestorChanges(maternalGrandmotherDetails, motherDetails.id, "female");
                setMaternalGrandmotherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getMaternalGrandMother();
            } catch (error) {
                console.log("Error saving maternal grandfather changes:", error);
            }
        }

        const savePaternalPaternalGreatGrandfatherChanges = async () => {
            setShowPaternalPaternalGreatGrandfather(false);

            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandfatherDetails, paternalGrandfatherDetails.id, "male");
                setPaternalPaternalGreatGrandfatherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getPaternalPaternalGreatGrandFather();
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalPaternalGreatGrandmotherChanges = async () => {
            setShowPaternalPaternalGreatGrandmother(false);
     
            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandmotherDetails, paternalGrandfatherDetails.id, "female");
                setPaternalPaternalGreatGrandmotherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getPaternalPaternalGreatGrandMother();
            } catch (error) {
                console.log("Error saving paternal paternal great grandmother changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandfatherChanges = async () => {
            setShowPaternalMaternalGreatGrandfather(false);
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandfatherDetails, paternalGrandmotherDetails.id, "male");
                setPaternalMaternalGreatGrandfatherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getPaternalMaternalGreatGrandFather();
            } catch (error) {
                console.log("Error saving paternal maternal great grandfather changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandmotherChanges = async () => {
            setShowPaternalMaternalGreatGrandmother(false);
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandmotherDetails, paternalGrandmotherDetails.id, "female");
                setPaternalMaternalGreatGrandmotherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getPaternalMaternalGreatGrandMother();
            } catch (error) {
                console.log("Error saving paternal maternal great grandmother changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandfatherChanges = async () => {
            setShowMaternalPaternalGreatGrandfather(false);
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandfatherDetails, maternalGrandfatherDetails.id, "male");
                setMaternalPaternalGreatGrandfatherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getMaternalPaternalGreatGrandFather();
            } catch (error) {
                console.log("Error saving maternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandmotherChanges = async () => {
            setShowMaternalPaternalGreatGrandmother(false);
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandmotherDetails, maternalGrandfatherDetails.id, "female");
                setMaternalPaternalGreatGrandmotherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getMaternalPaternalGreatGrandmother();
            } catch (error) {
                console.log("Error saving maternal paternal great grandmother changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandfatherChanges = async () => {
            setShowMaternalMaternalGreatGrandfather(false);
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandfatherDetails, maternalGrandmotherDetails.id, "male");
                setMaternalMaternalGreatGrandfatherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
                getMaternalMaternalGreatGrandFather();
            } catch (error) {
                console.log("Error saving maternal maternal great grandfather changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandmotherChanges = async () => {
            setShowMaternalMaternalGreatGrandmother(false);
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandmotherDetails, maternalGrandmotherDetails.id, "female");
                setMaternalMaternalGreatGrandmotherDetails((prevDetails) => ({
                    ...prevDetails,
                    id: data
                  }));
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
                const personID = paternalPaternalGreatGrandfatherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandfathersFatherDetails, paternalPaternalGreatGrandfatherDetails.id, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalPaternalGreatGrandfathersMotherChanges = async () => {
            setShowPaternalPaternalGreatGrandfathersMother(false);

            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalPaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalPaternalGreatGrandfatherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID , pageNumber}),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandfathersMotherDetails, paternalPaternalGreatGrandfatherDetails.id, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalPaternalGreatGrandmothersFatherChanges = async () => {
            setShowPaternalPaternalGreatGrandmothersFather(false);

            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalPaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalPaternalGreatGrandmotherDetails.id; 
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }

            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandmothersFatherDetails, paternalPaternalGreatGrandmotherDetails.id, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalPaternalGreatGrandmothersMotherChanges = async () => {
            setShowPaternalPaternalGreatGrandmothersMother(false);

             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!paternalPaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalPaternalGreatGrandmotherDetails.id; 
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalPaternalGreatGrandmothersMotherDetails, paternalPaternalGreatGrandmotherDetails.id, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandfathersFatherChanges = async () => {
            setShowPaternalMaternalGreatGrandfathersFather(false);

             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!paternalMaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalMaternalGreatGrandfatherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandfathersFatherDetails, paternalMaternalGreatGrandfatherDetails.id, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandfathersMotherChanges = async () => {
            setShowPaternalMaternalGreatGrandfathersMother(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalMaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalMaternalGreatGrandfatherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandfathersMotherDetails, paternalMaternalGreatGrandfatherDetails.id, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandmothersFatherChanges = async () => {
            setShowPaternalMaternalGreatGrandmothersFather(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalMaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalMaternalGreatGrandmotherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandmothersFatherDetails, paternalMaternalGreatGrandmotherDetails.id, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const savePaternalMaternalGreatGrandmothersMotherChanges = async () => {
            setShowPaternalMaternalGreatGrandmothersMother(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!paternalMaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = paternalMaternalGreatGrandmotherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(paternalMaternalGreatGrandmothersMotherDetails, paternalMaternalGreatGrandmotherDetails.id, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandfathersFatherChanges = async () => {
            setShowMaternalPaternalGreatGrandfathersFather(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalPaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalPaternalGreatGrandfatherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandfathersFatherDetails, maternalPaternalGreatGrandfatherDetails.id, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandfathersMotherChanges = async () => {
            setShowMaternalPaternalGreatGrandfathersMother(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalPaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalPaternalGreatGrandfatherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandfathersMotherDetails, maternalPaternalGreatGrandfatherDetails.id, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandmothersFatherChanges = async () => {
            setShowMaternalPaternalGreatGrandmothersFather(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalPaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalPaternalGreatGrandmotherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandmothersFatherDetails, maternalPaternalGreatGrandmotherDetails.id, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalPaternalGreatGrandmothersMotherChanges = async () => {
            setShowMaternalPaternalGreatGrandmothersMother(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalPaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalPaternalGreatGrandmotherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalPaternalGreatGrandmothersMotherDetails, maternalPaternalGreatGrandmotherDetails.id, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandfathersFatherChanges = async () => {
            setShowMaternalMaternalGreatGrandfathersFather(false);
            //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
            if (!maternalMaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalMaternalGreatGrandfatherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandfathersFatherDetails, maternalMaternalGreatGrandfatherDetails.id, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandfathersMotherChanges = async () => {
            setShowMaternalMaternalGreatGrandfathersMother(false);
             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!maternalMaternalGreatGrandfatherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalMaternalGreatGrandfatherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandfathersMotherDetails, maternalMaternalGreatGrandfatherDetails.id, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandmothersFatherChanges = async () => {
            setShowMaternalMaternalGreatGrandmothersFather(false);
             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!maternalMaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalMaternalGreatGrandmotherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandmothersFatherDetails, maternalMaternalGreatGrandmotherDetails.id, "male");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }

        const saveMaternalMaternalGreatGrandmothersMotherChanges = async () => {
            setShowMaternalMaternalGreatGrandmothersMother(false);
             //  if this person didn't already have parents, this addition of a parent will result in this person becoming the bottom page person on a new page
             if (!maternalMaternalGreatGrandmotherHasParents) {
                const userId = localStorage.getItem('userId');
                const personID = maternalMaternalGreatGrandmotherDetails.id;
                const response = fetch('http://localhost:5000/make-new-page', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, pageNumber }),
                })
                countTotalPageNum();
            }
            try {
                const data = await saveAncestorChanges(maternalMaternalGreatGrandmothersMotherDetails, maternalMaternalGreatGrandmotherDetails.id, "female");
            } catch (error) {
                console.log("Error saving paternal paternal great grandfather changes:", error);
            }
        }


        const saveEdits = (personDetails, setEditShow, getPerson) => {
            setEditShow(false);
            try {
                const userId = localStorage.getItem('userId');
                const response = fetch('http://localhost:5000/edit-person', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personDetails}),
                })
                getPerson();
            } catch (error) {
                console.log("Error saving edits:", error);
            }
        }


        const deletePerson = (details, setDetails, sex, getPerson, closeEditPerson) => {
            const personID = details.id;
            openDeletePopup();
            try {
                const userId = localStorage.getItem('userId');
                const response = fetch('http://localhost:5000/delete-person', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, personID, sex}),
                })
                setDetails((prev) => ({
                    id: null
                }));
                closeDeletePopup();
                closeEditPerson();
                 window.location.reload();
                
            } catch (error) {
                console.log(`Error deleting ${personID}: `, error);
            }
           
        }


        /*UNCERTAIN STATUS - will update whether the "uncertain" label will appear next to a piece of information (name, birth date ect) on an ancestor's node in the tree*/
        const toggleUncertain = async (details, setDetails, infoType) => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch('http://localhost:5000/toggle-uncertain', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, details, infoType}),
                })
                const data = await response.json();

                switch (infoType) {
                    case "first_name":
                        setDetails((prev) => ({
                            ...prev,
                            uncertainFirstName: data
                        }))
                        break;
                    case "middle_name":
                        setDetails((prev) => ({
                            ...prev,
                            uncertainMiddleName: data
                        }))
                        break;
                    case "last_name":
                        setDetails((prev) => ({
                            ...prev,
                            uncertainLastName: data
                        }))
                        break;
                    case "birth_date":
                        setDetails((prev) => ({
                            ...prev,
                            uncertainBirthDate: data
                        }))
                        break;
                    case "birth_place":
                        setDetails((prev) => ({
                            ...prev,
                            uncertainBirthPlace: data
                        }))
                        break;
                    case "death_date":
                        setDetails((prev) => ({
                            ...prev,
                            uncertainDeathDate: data
                        }))
                        break;
                    case "death_place":
                        setDetails((prev) => ({
                            ...prev,
                            uncertainDeathPlace: data
                        }))
                        break;
                    case "occupation":
                        setDetails((prev) => ({
                            ...prev,
                            uncertainOccupation: data
                        }))
                        break;
                }
            } catch (error) {
                console.log("Error toggling uncertain:", error);
            }
        }

    const handleAddExistingAncestor = () => {
        if (addRepeatAncestorSection) {
            setAddRepeatAncestorSection(false)
        } else {
            setAddRepeatAncestorSection(true);
        }
    }

    function MakeModal(showPerson, closeAddPerson, childName, setDetails, details, sex, save, closeAdd) {
        const [isNobility, setIsNobility] = useState(false);

        let motherOrFather = "";
        if (sex === "male") {
            motherOrFather = "Father";
        } else {
            motherOrFather = "Mother";
        }

        const handleNobility = () => {
            setIsNobility((prevState) => {
                const newState = !prevState;
                setDetails((prevDetails) => ({
                    ...prevDetails,
                    memberOfNobility: newState
                }));
                return newState;
            });
        };

        const saveRepeatAncestor = () => {

        }


        return (

        <Modal show={showPerson} onHide={closeAddPerson} dialogclassName="custom-modal-width">
                <Modal.Header closeButton>
                <Modal.Title>Add {childName}'s {motherOrFather}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-modal">

                        <div className="inputandQuestionMark">
                            <input  type="text" placeholder="First Name" onChange={(e) => setDetails({ ...details, firstName: e.target.value })}></input>

                            
                        </div>

                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Middle Name" onChange={(e) => setDetails({ ...details, middleName: e.target.value })}></input>

                            
                        </div>

                        {/*if the person is male, then his default surname is the same as his childrens'*/}
                        {sex === "male" ? ( 
                            <div className="inputandQuestionMark">
                                <input type="text" placeholder="Last Name"  value={details.lastName} onChange={(e) => setDetails({ ...details, lastName: e.target.value })}></input>
                                
                            </div>
                        ): (
                            <div className="inputandQuestionMark">
                                 <input type="text" placeholder="Last Name" onChange={(e) => setDetails({ ...details, lastName: e.target.value })}></input>

                            </div>
                        )}
                    </div>
                        

                    <div className="input-modal">
                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Birth Date" onChange={(e) => setDetails({ ...details, birthDate: e.target.value })}></input>
                        </div>
                        
                        <div className="inputandQuestionMark">
                        <input type="text" placeholder="Birth Place" onChange={(e) => setDetails({ ...details, birthPlace: e.target.value })}></input>
                        
                        </div>
                        </div>

                 

                    <div className="input-modal">

                    <div className="inputandQuestionMark">
                        <input type="text" placeholder="Death Date" onChange={(e) => setDetails({ ...details, deathDate: e.target.value })}></input>
                    </div>

                    <div className="inputandQuestionMark">
                    
                        <input type="text" placeholder="Death Place" onChange={(e) => setDetails({ ...details, deathPlace: e.target.value })}></input>
                    </div>

                    <div className="inputandQuestionMark">
                        <input type="text" placeholder="Cause of Death" onChange={(e) => setDetails({ ...details, causeOfDeath: e.target.value })}></input>
                    </div>
                    </div>
                   
                    <div className="input-modal">
                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Occupations" onChange={(e) => setDetails({ ...details, occupation: e.target.value })}></input>
                        </div>
                    
                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Ethnicity" value={details.ethnicity} onChange={(e) => setDetails({ ...details, ethnicity: e.target.value })}></input>
                        </div>
                    </div>

                    <div className="input-modal">
                        <div className="inputandQuestionMark">
                                <label>Member of Nobility</label>
                                <input type="checkbox" onClick={handleNobility}/>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                <div className="modal-footer-buttons">
                    <p class="onclick-text" onClick={handleAddExistingAncestor}><u>Add Pre-Existing Person</u></p>
                    <div className="non-delete-buttons">
                    <Button variant="secondary" onClick={closeAdd}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={save}>
                        Save Changes
                    </Button>
                    </div>
                </div>
                
                </Modal.Footer>
                {addRepeatAncestorSection ? (
                    <Modal.Footer className="repeatAncestorFooter">
                        <div className="repeat-ancestor-search-div">
                            <label>Repeat Ancestor</label>
                            <input></input>
                            <button onClick={saveRepeatAncestor}>Select</button>
                        </div>
                    </Modal.Footer>
                ) : (
                    <></>
                )}
            </Modal>

        )
    }




    function DeleteModal(details, setDetails, sex, getPerson, closeEditPerson) {


        let hisHer = "";
        if (sex === "male") {
            hisHer = "his"
        } else {
            hisHer = "her"
        }

        return (
            <>
            {showDeletePopup ? (
                <div className="popup-delete">
                    <div className="popup-delete-content">

                    <h3>Delete Ancestor</h3>

                    <p>Are you sure that you want to delete ${details.fullName}?</p>

                    <div>
                        <h5>Warning</h5>
                        <p>By deleting ${details.fullName} you will also delete all of ${hisHer} ancestors. This is not a reversible action. Do you wish to continue?</p>
                    </div>

                    <button onClick={closeDeletePopup}>Cancel</button>

                    <button onClick={() => deletePerson(details, setDetails, sex, getPerson, closeEditPerson)}>Delete</button>

                    </div>
            </div>
            ) : (<></>)}
            </>
        )

    }

    const handleProgressNote = (event) => {
        setProgressNote(event.target.value)
    }

    const saveProgress = async (details, closeEditPerson) => {
        closeSaveProgressHerePopup();
        closeEditPerson();
        const userId = localStorage.getItem('userId');
        const removedResponse = await fetch('http://localhost:5000/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, progressNote, details }),
        });
    }

    function MakeEditModal(showPerson, closeEditPerson, setDetails, details, save, seteditShowPerson, getPerson, closeAdd, deletePerson, sex) {

        let hisHer = "";
        if (sex === "male") {
            hisHer = "his"
        } else {
            hisHer = "her"
        }

        const [isNobility, setIsNobility] = useState(false);


        const handleNobility = () => {
            setIsNobility((prevState) => {
                const newState = !prevState;
                setDetails((prevDetails) => ({
                    ...prevDetails,
                    memberOfNobility: newState
                }));
                return newState;
            });
        };
        

        let questionMarkFirstNameColor = "grey";
        if (details.uncertainFirstName) {
            questionMarkFirstNameColor = "red";
        }

        let questionMarkMiddleNameColor = "grey";
        if (details.uncertainMiddleName) {
            questionMarkMiddleNameColor = "red";
        }

        let questionMarkLastNameColor = "grey";
        if (details.uncertainLastName) {
            questionMarkLastNameColor = "red";
        }

        let questionMarkBirthDateColor = "grey";
        if (details.uncertainBirthDate) {
            questionMarkBirthDateColor = "red";
        }

        let questionMarkBirthPlaceColor = "grey";
        if (details.uncertainBirthPlace) {
            questionMarkBirthPlaceColor = "red";
        }

        let questionMarkDeathDateColor = "grey";
        if (details.uncertainDeathDate) {
            questionMarkDeathDateColor = "red";
        }

        let questionMarkDeathPlaceColor = "grey";
        if (details.uncertainDeathPlace) {
            questionMarkDeathPlaceColor = "red";
        }

        let questionMarkOccupationColor = "grey";
        if (details.uncertainOccupation) {
            questionMarkOccupationColor = "red";
        }



        return (

        <Modal show={showPerson} onHide={closeEditPerson} dialogclassName="custom-modal-width" backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Edit {details.fullName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-modal">

                        <div className="inputandQuestionMark">
                            <input  type="text" placeholder="First Name" value={details.firstName} onChange={(e) => setDetails({ ...details, firstName: e.target.value })}></input>
                            <div className="uncertainMark"><p onClick={() => toggleUncertain(details, setDetails, "first_name")} style={{color:questionMarkFirstNameColor}}>?</p></div>
                        </div>

                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Middle Name" value={details.middleName} onChange={(e) => setDetails({ ...details, middleName: e.target.value })}></input>
                            <div className="uncertainMark uncertainMarkMiddleRow"><p onClick={() => toggleUncertain(details, setDetails, "middle_name")}  style={{color:questionMarkMiddleNameColor}}>?</p></div>
                        </div>

                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Last Name"  value={details.lastName} onChange={(e) => setDetails({ ...details, lastName: e.target.value })}></input> 
                            <div className="uncertainMark uncertainMarkRightRow"><p onClick={() => toggleUncertain(details, setDetails, "last_name")} style={{color:questionMarkLastNameColor}}>?</p></div>                        
                        </div>

                    </div>
                    
                    <div className="input-modal">
                        <div className="inputandQuestionMark">
                        <input type="text" placeholder="Birth Date" value={details.birthDate} onChange={(e) => setDetails({ ...details, birthDate: e.target.value })}></input>
                        <div className="uncertainMark"><p onClick={() => toggleUncertain(details, setDetails, "birth_date")} style={{color:questionMarkBirthDateColor}}>?</p></div>
                        </div>

                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Birth Place" value={details.birthPlace} onChange={(e) => setDetails({ ...details, birthPlace: e.target.value })}></input>
                            <div className="uncertainMark uncertainMarkMiddleRow"><p onClick={() => toggleUncertain(details, setDetails, "birth_place")} style={{color:questionMarkBirthPlaceColor}}>?</p></div>
                        </div>
                    </div>

                    
                    <div className="input-modal">
                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Death Date" value={details.deathDate} onChange={(e) => setDetails({ ...details, deathDate: e.target.value })}></input>
                            <div className="uncertainMark"><p onClick={() => toggleUncertain(details, setDetails, "death_date")} style={{color:questionMarkDeathDateColor}}>?</p></div>
                        </div>

                        <div className="inputandQuestionMark">
                        <input type="text" placeholder="Death Place" value={details.deathPlace}  onChange={(e) => setDetails({ ...details, deathPlace: e.target.value })}></input>
                        <div className="uncertainMark uncertainMarkMiddleRow"><p onClick={() => toggleUncertain(details, setDetails, "death_place")} style={{color:questionMarkDeathPlaceColor}}>?</p></div>
                        </div>

                        <div className="inputandQuestionMark">
                        <input type="text" placeholder="Cause of Death" value={details.causeOfDeath} onChange={(e) => setDetails({ ...details, causeOfDeath: e.target.value })}></input>
                       
                        </div>
                    </div>
                   
                    
                    <div className="input-modal">
                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Occupations" value={details.occupation} onChange={(e) => setDetails({ ...details, occupation: e.target.value })}></input>
                            
                            <div className="uncertainMark"><p onClick={() => toggleUncertain(details, setDetails, "occupation")} style={{color:questionMarkOccupationColor}}>?</p></div>
                        </div>

                        <div className="inputandQuestionMark">
                            <input type="text" placeholder="Ethnicity" value={details.ethnicity} onChange={(e) => setDetails({ ...details, ethnicity: e.target.value })}></input>
                        </div>
                        
                    </div>

                    <div className="input-modal">
                        <div className="inputandQuestionMark">
                                <label>Member of Nobility</label>
                                <input type="checkbox" checked={isNobility} onClick={handleNobility}/>
                                
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                
                <div className="modal-footer-buttons">

                    <div style={{
                                display:"flex",
                                flexDirection:"row"
                            }}>

                        <p variant="secondary" onClick={openDeletePopup} className="onclick-text">
                            <u>Delete {details.fullName}</u>
                        </p>
                        <p variant="secondary" onClick={openSaveProgressHerePopup} className="onclick-text" style={{marginLeft:"15px"}}>
                            <u>Save Progress Here</u>
                        </p>
                        
                    </div>

                    <div className="non-delete-buttons">
                        <Button variant="secondary" onClick={closeEditPerson}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => save(details, seteditShowPerson, getPerson)}>
                            Save Changes
                        </Button>
                    </div>

                </div>
                </Modal.Footer>
                {showDeletePopup ? (
                    <Modal.Footer>
                        <div>
                            <div>
                                                               
                                <div className="warning-message">
                                    <div className="warning-logo-header">
                                        <img className="warning-logo" src={warningLogo}></img>
                                        <h5>Warning</h5>
                                    </div>
                                    
                                    <p>By deleting {details.fullName} you will also delete all of {hisHer} ancestors. This is not a reversible action. Do you wish to continue?</p>
                                    <p>Any of {details.firstName}'s' ancestors who are repeat ancestors will not be deleted, though any connection with {details.firstName} will be deleted.</p>
                                </div>
                                
                            </div>
                        </div>

                        <button onClick={closeDeletePopup}>Cancel</button>

                        <button onClick={() => deletePerson(details, setDetails, sex, getPerson, closeEditPerson)}>Delete</button>
                </Modal.Footer>
                ) : (<></>)}
                {showSaveProgressHerePopup ? (
                    <Modal.Footer>
                        <div style={{
                                display:"flex",
                                flexDirection:"row",
                                justifyContent:"left"
                            }}>
                            <div style={{
                                display:"flex",
                                flexDirection:"column",
                                marginRight:"100px"
                            }}>
                                                               
                                    <p>Leave a note for your future self</p>
                                    <textarea type="text" onChange={handleProgressNote}></textarea>
                            
                            </div>
                        </div>

                        <button onClick={closeSaveProgressHerePopup}>Cancel</button>

                        <button onClick={() => saveProgress(details, closeEditPerson)}>Save Progress</button>
                </Modal.Footer>
                ) : (<></>)}

                
        </Modal>

        )
    }

    function showAncestorTable(basePersonDetails, sex, details, childID, openAddModal, openEditModal) {

        let motherFather = "";
        if (sex === "male") {
            motherFather = "Father";
        } else {
            motherFather = "Mother";
        };
        
        const uncertainText = <sup>(uncertain)</sup>;

        let boxShadowColor = "5px 5px 35px rgba(2, 110, 2)";
        let tableColor = "#75b74f"
        
        if(details.memberOfNobility) {
            boxShadowColor = "5px 5px 35px rgba(5, 94, 237)";
            tableColor = "rgba(5, 94, 237)"
        } 

        const handleOpenProfile = (id) => {
            window.location.href = `profile/${id}`
        }

        return (
            <>
            {details.id ? (
                <table  className="ancestor-box" style={{boxShadow: boxShadowColor}} >
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink" style={{backgroundColor:tableColor}}>Relation to {basePersonDetails.firstName}: </td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="3">{convertNumToRelation(details.relationToUser, sex)}</td>
                    <td className="ancestor-box-border-bottom table-label shrink" style={{backgroundColor:tableColor}}>Profile Number:</td>
                    <td className="ancestor-box-border-bottom table-content shrink profile-cell"><span className="span-link"  onClick={() => handleOpenProfile(details.id)}>{details.id}</span></td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink" style={{backgroundColor:tableColor}}>Name:</td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="5"><b>{capitaliseFirstLetter(details.firstName)}</b>{details.uncertainFirstName ? (uncertainText) : (<></>)} <b>{capitaliseFirstLetter(details.middleName)}</b>{details.uncertainMiddleName ? (uncertainText) : (<></>)} <b>{capitaliseFirstLetter(details.lastName)}</b>{details.uncertainLastName ? (uncertainText) : (<></>)}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom birth-date-cell table-label" style={{backgroundColor:tableColor}}>Birth</td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="5">{details.birthDate}{details.uncertainBirthDate ? (uncertainText) : (<></>)} {capitaliseFirstLetter(details.birthPlace)}{details.uncertainBirthPlace ? (uncertainText) : (<></>)}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom birth-date-cell table-label"style={{backgroundColor:tableColor}} >Death</td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="5">{details.deathDate}{details.uncertainDeathDate ? (uncertainText) : (<></>)} {capitaliseFirstLetter(details.deathPlace)}{details.uncertainDeathPlace ? (uncertainText) : (<></>)}</td>
                </tr>
                <tr>
                    <td className=" ancestor-box-border-top table-label shrink" style={{backgroundColor:tableColor}}>Occupation:</td>
                    <td className="table-content" colSpan="4">{capitaliseFirstLetter(details.occupation)}{details.uncertainOccupation ? (uncertainText) : (<></>)}</td>
                    <td className="table-content" >{<img className="editLogo" src={editLogo} onClick={openEditModal}></img>}</td>
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

    function ShowGreatGrandParentTable(basePersonDetails, sex, details, childID, openAddModal, openEditModal) {
        

        let motherFather = "";
        if (sex === "male") {
            motherFather = "Father";
        } else {
            motherFather = "Mother";
        }

        const uncertainText = <sup>(uncertain)</sup>;

        const handleOpenProfile = (id) => {
            window.location.href = `profile/${id}`
        }


        let boxShadowColor = "5px 5px 35px rgba(2, 110, 2)";
        let tableColor = "#75b74f"

        
        if(details.memberOfNobility) {
            boxShadowColor = "5px 5px 35px rgba(5, 94, 237)";
            tableColor = "rgba(5, 94, 237)"
        } 


        return(
            <>
             {details.id ? (
            <table className="ancestor-box" style={{boxShadow: boxShadowColor}}>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink" style={{backgroundColor:tableColor}}>Relation to {basePersonDetails.firstName}:</td>
                    <td className="ancestor-box-border-bottom table-content">{convertNumToRelation(details.relationToUser, sex)}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink" style={{backgroundColor:tableColor}}>Name:</td>
                    <td className="ancestor-box-border-bottom table-content"><b>{capitaliseFirstLetter(details.firstName)}</b>{details.uncertainFirstName ? (uncertainText) : (<></>)} <b>{capitaliseFirstLetter(details.middleName)}</b>{details.uncertainMiddleName ? (uncertainText) : (<></>)} <b>{capitaliseFirstLetter(details.lastName)}</b>{details.uncertainLastName ? (uncertainText) : (<></>)}
                    </td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink" style={{backgroundColor:tableColor}}>Birth: </td>
                    <td className="ancestor-box-border-bottom table-content">{details.birthDate}{details.uncertainBirthDate ? (uncertainText) : (<></>)} {capitaliseFirstLetter(details.birthPlace)}{details.uncertainBirthPlace ? (uncertainText) : (<></>)}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink" style={{backgroundColor:tableColor}}>Death:</td>
                    <td className="ancestor-box-border-bottom table-content">{details.deathDate}{details.uncertainDeathDate ? (uncertainText) : (<></>)} {capitaliseFirstLetter(details.deathPlace)}{details.uncertainDeathPlace ? (uncertainText) : (<></>)}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom ancestor-box-border-top table-label shrink" style={{backgroundColor:tableColor}}>Occupation:</td>
                    <td className="ancestor-box-border-bottom table-content">{capitaliseFirstLetter(details.occupation)}{details.uncertainOccupation ? (uncertainText) : (<></>)}</td>
                </tr>
                <tr>
                    <td className=" table-label shrink" style={{backgroundColor:tableColor}}>Profile <br/>Number:</td>
                    <td className="table-content profile-cell"><span className="span-link" onClick={() => handleOpenProfile(details.id)}>{details.id}</span> {<img className="editLogo" src={editLogo} onClick={openEditModal}></img>}</td>
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

    checkIfGGHasParents(paternalPaternalGreatGrandfatherDetails.id, setPaternalPaternalGreatGrandfatherHasParents)
    checkIfGGHasParents(paternalPaternalGreatGrandmotherDetails.id, setPaternalPaternalGreatGrandmotherHasParents)

    checkIfGGHasParents(paternalMaternalGreatGrandfatherDetails.id, setPaternalMaternalGreatGrandfatherHasParents)
    checkIfGGHasParents(paternalMaternalGreatGrandmotherDetails.id, setPaternalMaternalGreatGrandmotherHasParents)

    checkIfGGHasParents(maternalPaternalGreatGrandfatherDetails.id, setMaternalPaternalGreatGrandfatherHasParents)
    checkIfGGHasParents(maternalPaternalGreatGrandmotherDetails.id, setMaternalPaternalGreatGrandmotherHasParents)

    checkIfGGHasParents(maternalMaternalGreatGrandfatherDetails.id, setMaternalMaternalGreatGrandfatherHasParents)
    checkIfGGHasParents(maternalMaternalGreatGrandmotherDetails.id, setMaternalMaternalGreatGrandmotherHasParents)



    return (
        <div id="family-tree-parent-div" >

            

            {MakeModal(showFather, closeAddFatherModal, bottomPersonDetails.firstName, setFatherDetails, fatherDetails, "male", saveFatherChanges, closeAddFatherModal)}

            {MakeModal(showMother, closeAddMotherModal, bottomPersonDetails.firstNameName, setMotherDetails, motherDetails, "female", saveMotherChanges, closeAddMotherModal)}

            {MakeModal(showPaternalGrandfather, closeAddPaternalGrandfatherModal, fatherDetails.fullName, setPaternalGrandfatherDetails, paternalGrandfatherDetails, "male", savePaternalGrandfatherChanges, closeAddPaternalGrandfatherModal)}
            
            {MakeModal(showPaternalGrandmother, closeAddPaternalGrandmotherModal, fatherDetails.fullName, setPaternalGrandmotherDetails, paternalGrandmotherDetails, "female", savePaternalGrandmotherChanges, closeAddPaternalGrandmotherModal)}

            {MakeModal(showMaternalGrandfather, closeAddMaternalGrandfatherModal, motherDetails.fullName, setMaternalGrandfatherDetails, maternalGrandfatherDetails, "male", saveMaternalGrandfatherChanges, closeAddMaternalGrandfatherModal)}

            {MakeModal(showMaternalGrandmother, closeAddMaternalGrandmotherModal, motherDetails.fullName, setMaternalGrandmotherDetails, maternalGrandmotherDetails, "female", saveMaternalGrandmotherChanges, closeAddMaternalGrandmotherModal)}

            {MakeModal(showPaternalPaternalGreatGrandfather, closeAddPaternalPaternalGreatGrandfatherModal, paternalGrandfatherDetails.fullName, setPaternalPaternalGreatGrandfatherDetails, paternalPaternalGreatGrandfatherDetails, "male", savePaternalPaternalGreatGrandfatherChanges, closeAddPaternalPaternalGreatGrandfatherModal)}

            {MakeModal(showPaternalPaternalGreatGrandmother, closeAddPaternalPaternalGreatGrandmotherModal, paternalGrandfatherDetails.fullName, setPaternalPaternalGreatGrandmotherDetails, paternalPaternalGreatGrandmotherDetails, "female", savePaternalPaternalGreatGrandmotherChanges, closeAddPaternalPaternalGreatGrandmotherModal)}

            {MakeModal(showPaternalMaternalGreatGrandfather, closeAddPaternalMaternalGreatGrandfatherModal, paternalGrandmotherDetails.fullName, setPaternalMaternalGreatGrandfatherDetails, paternalMaternalGreatGrandfatherDetails, "male", savePaternalMaternalGreatGrandfatherChanges, closeAddPaternalMaternalGreatGrandfatherModal)}

            {MakeModal(showPaternalMaternalGreatGrandmother, closeAddPaternalMaternalGreatGrandmotherModal, paternalGrandmotherDetails.fullName, setPaternalMaternalGreatGrandmotherDetails, paternalMaternalGreatGrandmotherDetails, "female", savePaternalMaternalGreatGrandmotherChanges, closeAddPaternalMaternalGreatGrandmotherModal)}

            {MakeModal(showMaternalPaternalGreatGrandfather, closeAddMaternalPaternalGreatGrandfatherModal, maternalGrandfatherDetails.fullName, setMaternalPaternalGreatGrandfatherDetails, maternalPaternalGreatGrandfatherDetails, "male", saveMaternalPaternalGreatGrandfatherChanges, closeAddMaternalPaternalGreatGrandfatherModal)}

            {MakeModal(showMaternalPaternalGreatGrandmother, closeAddMaternalPaternalGreatGrandmotherModal, maternalGrandfatherDetails.fullName, setMaternalPaternalGreatGrandmotherDetails, maternalPaternalGreatGrandmotherDetails, "female", saveMaternalPaternalGreatGrandmotherChanges, closeAddMaternalPaternalGreatGrandmotherModal)}

            {MakeModal(showMaternalMaternalGreatGrandfather, closeAddMaternalMaternalGreatGrandfatherModal, maternalGrandmotherDetails.fullName, setMaternalMaternalGreatGrandfatherDetails, maternalMaternalGreatGrandfatherDetails, "male", saveMaternalMaternalGreatGrandfatherChanges, closeAddMaternalMaternalGreatGrandfatherModal)}

            {MakeModal(showMaternalMaternalGreatGrandmother, closeAddMaternalMaternalGreatGrandmotherModal, maternalGrandmotherDetails.fullName, setMaternalMaternalGreatGrandmotherDetails, maternalMaternalGreatGrandmotherDetails, "female", saveMaternalMaternalGreatGrandmotherChanges, closeAddMaternalMaternalGreatGrandmotherModal)}

            {MakeModal(showPaternalPaternalGreatGrandfathersFather, closeAddPaternalPaternalGreatGrandfathersFatherModal, paternalPaternalGreatGrandfatherDetails.fullName, setPaternalPaternalGreatGrandfathersFatherDetails, paternalPaternalGreatGrandfathersFatherDetails, "male", savePaternalPaternalGreatGrandfathersFatherChanges, closeAddPaternalPaternalGreatGrandfathersFatherModal)}

            {MakeModal(showPaternalPaternalGreatGrandfathersMother, closeAddPaternalPaternalGreatGrandfathersMotherModal, paternalPaternalGreatGrandfatherDetails.fullName, setPaternalPaternalGreatGrandfathersMotherDetails, paternalPaternalGreatGrandfathersMotherDetails, "female", savePaternalPaternalGreatGrandfathersMotherChanges, closeAddPaternalPaternalGreatGrandfathersMotherModal)}

            {MakeModal(showPaternalPaternalGreatGrandmothersFather, closeAddPaternalPaternalGreatGrandmothersFatherModal, paternalPaternalGreatGrandmotherDetails.fullName, setPaternalPaternalGreatGrandmothersFatherDetails, paternalPaternalGreatGrandmothersFatherDetails, "male", savePaternalPaternalGreatGrandmothersFatherChanges, closeAddPaternalPaternalGreatGrandmothersFatherModal)}

            {MakeModal(showPaternalPaternalGreatGrandmothersMother, closeAddPaternalPaternalGreatGrandmothersMotherModal, paternalPaternalGreatGrandmotherDetails.fullName, setPaternalPaternalGreatGrandmothersMotherDetails, paternalPaternalGreatGrandmothersMotherDetails, "female", savePaternalPaternalGreatGrandmothersMotherChanges, closeAddPaternalPaternalGreatGrandmothersMotherModal)}

            {MakeModal(showPaternalMaternalGreatGrandfathersFather, closeAddPaternalMaternalGreatGrandfathersFatherModal, paternalMaternalGreatGrandfatherDetails.fullName, setPaternalMaternalGreatGrandfathersFatherDetails, paternalMaternalGreatGrandfathersFatherDetails, "male", savePaternalMaternalGreatGrandfathersFatherChanges, closeAddPaternalMaternalGreatGrandfathersFatherModal)}

            {MakeModal(showPaternalMaternalGreatGrandfathersMother, closeAddPaternalMaternalGreatGrandfathersMotherModal, paternalMaternalGreatGrandfatherDetails.fullName, setPaternalMaternalGreatGrandfathersMotherDetails, paternalMaternalGreatGrandfathersMotherDetails, "female", savePaternalMaternalGreatGrandfathersMotherChanges, closeAddPaternalMaternalGreatGrandfathersMotherModal)}

            {MakeModal(showPaternalMaternalGreatGrandmothersFather, closeAddPaternalMaternalGreatGrandmothersFatherModal, paternalMaternalGreatGrandmotherDetails.fullName, setPaternalMaternalGreatGrandmothersFatherDetails, paternalMaternalGreatGrandmothersFatherDetails, "male", savePaternalMaternalGreatGrandmothersFatherChanges, closeAddPaternalMaternalGreatGrandmothersFatherModal)}

            {MakeModal(showPaternalMaternalGreatGrandmothersMother, closeAddPaternalMaternalGreatGrandmothersMotherModal, paternalMaternalGreatGrandmotherDetails.fullName, setPaternalMaternalGreatGrandmothersMotherDetails, paternalMaternalGreatGrandmothersMotherDetails, "female", savePaternalMaternalGreatGrandmothersMotherChanges, closeAddPaternalMaternalGreatGrandmothersMotherModal)}

            {MakeModal(showMaternalPaternalGreatGrandfathersFather, closeAddMaternalPaternalGreatGrandfathersFatherModal, maternalPaternalGreatGrandfatherDetails.fullName, setMaternalPaternalGreatGrandfathersFatherDetails, maternalPaternalGreatGrandfathersFatherDetails, "male", saveMaternalPaternalGreatGrandfathersFatherChanges, closeAddMaternalPaternalGreatGrandfathersFatherModal)}

            {MakeModal(showMaternalPaternalGreatGrandfathersMother, closeAddMaternalPaternalGreatGrandfathersMotherModal, maternalPaternalGreatGrandfatherDetails.fullName, setMaternalPaternalGreatGrandfathersMotherDetails, maternalPaternalGreatGrandfathersMotherDetails, "female", saveMaternalPaternalGreatGrandfathersMotherChanges, closeAddMaternalPaternalGreatGrandfathersMotherModal)}

            {MakeModal(showMaternalPaternalGreatGrandmothersFather, closeAddMaternalPaternalGreatGrandmothersFatherModal, maternalPaternalGreatGrandmotherDetails.fullName, setMaternalPaternalGreatGrandmothersFatherDetails, maternalPaternalGreatGrandmothersFatherDetails, "male", saveMaternalPaternalGreatGrandmothersFatherChanges, closeAddMaternalPaternalGreatGrandmothersFatherModal)}

            {MakeModal(showMaternalPaternalGreatGrandmothersMother, closeAddMaternalPaternalGreatGrandmothersMotherModal, maternalPaternalGreatGrandmotherDetails.fullName, setMaternalPaternalGreatGrandmothersMotherDetails, maternalPaternalGreatGrandmothersMotherDetails, "female", saveMaternalPaternalGreatGrandmothersMotherChanges, closeAddMaternalPaternalGreatGrandmothersMotherModal)}

            {MakeModal(showMaternalMaternalGreatGrandfathersFather, closeAddMaternalMaternalGreatGrandfathersFatherModal, maternalMaternalGreatGrandfatherDetails.fullName, setMaternalMaternalGreatGrandfathersFatherDetails, maternalMaternalGreatGrandfathersFatherDetails, "male", saveMaternalMaternalGreatGrandfathersFatherChanges, closeAddMaternalMaternalGreatGrandfathersFatherModal)}

            {MakeModal(showMaternalMaternalGreatGrandfathersMother, closeAddMaternalMaternalGreatGrandfathersMotherModal, maternalMaternalGreatGrandfatherDetails.fullName, setMaternalMaternalGreatGrandfathersMotherDetails, maternalMaternalGreatGrandfathersMotherDetails, "female", saveMaternalMaternalGreatGrandfathersMotherChanges, closeAddMaternalMaternalGreatGrandfathersMotherModal)}

            {MakeModal(showMaternalMaternalGreatGrandmothersFather, closeAddMaternalMaternalGreatGrandmothersFatherModal, maternalMaternalGreatGrandmotherDetails.fullName, setMaternalMaternalGreatGrandmothersFatherDetails, maternalMaternalGreatGrandmothersFatherDetails, "male", saveMaternalMaternalGreatGrandmothersFatherChanges, closeAddMaternalMaternalGreatGrandmothersFatherModal)}

            {MakeModal(showMaternalMaternalGreatGrandmothersMother, closeAddMaternalMaternalGreatGrandmothersMotherModal, maternalMaternalGreatGrandmotherDetails.fullName, setMaternalMaternalGreatGrandmothersMotherDetails, maternalMaternalGreatGrandmothersMotherDetails, "female", saveMaternalMaternalGreatGrandmothersMotherChanges, closeAddMaternalMaternalGreatGrandmothersMotherModal)}

            {MakeEditModal(editShowBottomPerson, closeEditBottomPersonModal, setBottomPersonDetails, bottomPersonDetails, saveEdits, seteditShowBottomPerson, getNewPageNum, closeAddFatherModal, deletePerson, bottomPersonDetails.sex)}

            {MakeEditModal(editShowFather, closeEditFatherModal, setFatherDetails, fatherDetails, saveEdits, seteditShowFather, getFather, closeAddFatherModal, deletePerson, "male")}

            {MakeEditModal(editShowMother, closeEditMotherModal, setMotherDetails, motherDetails, saveEdits, seteditShowMother, getMother, closeAddMotherModal, deletePerson, "female")}

            {MakeEditModal(editShowPaternalGrandfather, closeEditPaternalGrandfatherModal, setPaternalGrandfatherDetails, paternalGrandfatherDetails,  saveEdits, seteditShowPaternalGrandfather, getPaternalGrandFather, closeAddPaternalGrandfatherModal, deletePerson, "male")}

            {MakeEditModal(editShowPaternalGrandmother, closeEditPaternalGrandmotherModal, setPaternalGrandmotherDetails, paternalGrandmotherDetails,  saveEdits, seteditShowPaternalGrandmother, getPaternalGrandMother, closeAddPaternalGrandmotherModal, deletePerson, "female")}

            {MakeEditModal(editShowMaternalGrandfather, closeEditMaternalGrandfatherModal, setMaternalGrandfatherDetails, maternalGrandfatherDetails,  saveEdits, seteditShowMaternalGrandfather, getMaternalGrandFather, closeAddMaternalGrandfatherModal, deletePerson, "male")}

            {MakeEditModal(editShowMaternalGrandmother, closeEditMaternalGrandmotherModal, setMaternalGrandmotherDetails, maternalGrandmotherDetails,  saveEdits, seteditShowMaternalGrandmother, getMaternalGrandMother, closeAddMaternalGrandmotherModal, deletePerson, "female")}

            {MakeEditModal(editShowPaternalPaternalGreatGrandfather, closeEditPaternalPaternalGreatGrandfatherModal, setPaternalPaternalGreatGrandfatherDetails, paternalPaternalGreatGrandfatherDetails,  saveEdits, seteditShowPaternalPaternalGreatGrandfather, getPaternalPaternalGreatGrandFather, closeAddPaternalPaternalGreatGrandfatherModal, deletePerson, "male")}

            {MakeEditModal(editShowPaternalPaternalGreatGrandmother, closeEditPaternalPaternalGreatGrandmotherModal, setPaternalPaternalGreatGrandmotherDetails, paternalPaternalGreatGrandmotherDetails,  saveEdits, seteditShowPaternalPaternalGreatGrandmother, getPaternalPaternalGreatGrandMother, closeAddPaternalPaternalGreatGrandmotherModal, deletePerson, "female")}

            {MakeEditModal(editShowPaternalMaternalGreatGrandfather, closeEditPaternalMaternalGreatGrandfatherModal, setPaternalMaternalGreatGrandfatherDetails, paternalMaternalGreatGrandfatherDetails,  saveEdits, seteditShowPaternalMaternalGreatGrandfather, getPaternalMaternalGreatGrandFather, closeAddPaternalMaternalGreatGrandfatherModal, deletePerson, "male")}

            {MakeEditModal(editShowPaternalMaternalGreatGrandmother, closeEditPaternalMaternalGreatGrandmotherModal, setPaternalMaternalGreatGrandmotherDetails, paternalMaternalGreatGrandmotherDetails,  saveEdits, seteditShowPaternalMaternalGreatGrandmother, getPaternalMaternalGreatGrandMother, closeAddPaternalMaternalGreatGrandmotherModal, deletePerson, "female")}

            {MakeEditModal(editShowMaternalPaternalGreatGrandfather, closeEditMaternalPaternalGreatGrandfatherModal, setMaternalPaternalGreatGrandfatherDetails, maternalPaternalGreatGrandfatherDetails,  saveEdits, seteditShowMaternalPaternalGreatGrandfather, getMaternalPaternalGreatGrandFather, closeAddMaternalPaternalGreatGrandfatherModal, deletePerson, "male")}

            {MakeEditModal(editShowMaternalPaternalGreatGrandmother, closeEditMaternalPaternalGreatGrandmotherModal, setMaternalPaternalGreatGrandmotherDetails, maternalPaternalGreatGrandmotherDetails,  saveEdits, seteditShowMaternalPaternalGreatGrandmother, getMaternalPaternalGreatGrandmother, closeAddMaternalPaternalGreatGrandmotherModal, deletePerson, "female")}

            {MakeEditModal(editShowMaternalMaternalGreatGrandfather, closeEditMaternalMaternalGreatGrandfatherModal, setMaternalMaternalGreatGrandfatherDetails, maternalMaternalGreatGrandfatherDetails,  saveEdits, seteditShowMaternalMaternalGreatGrandfather, getMaternalMaternalGreatGrandFather, closeAddMaternalMaternalGreatGrandfatherModal, deletePerson, "male")}

            {MakeEditModal(editShowMaternalMaternalGreatGrandmother, closeEditMaternalMaternalGreatGrandmotherModal, setMaternalMaternalGreatGrandmotherDetails, maternalMaternalGreatGrandmotherDetails,  saveEdits, seteditShowMaternalMaternalGreatGrandmother, getMaternalMaternalGreatGrandMother, closeAddMaternalMaternalGreatGrandmotherModal, deletePerson, "female")}

            
            
            <div className="row" >

                {/*contains the whole tree*/}
                <div className="col">

                <img id="treeLines" src={treeLines}></img>

                <div className="row scrollable">

                    <div id="tree-container scrollable">

                    {/*contains great-grandparents*/}
                    <div className="row">

                        <div className="row arrow-page-num-div">

                            <div className="col">
                                {paternalPaternalGreatGrandfatherDetails.id ? ( 
                                    <>
                                    {paternalPaternalGreatGrandfatherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalPaternalGreatGrandfatherDetails.id)}>Page: {paternalPaternalGreatGrandfatherDetails.pageNum}<br />⇑</p>
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
                                {paternalPaternalGreatGrandmotherDetails.id ? (
                                    <>
                                    {paternalPaternalGreatGrandmotherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalPaternalGreatGrandmotherDetails.id)}>Page: {paternalPaternalGreatGrandmotherDetails.pageNum}<br />⇑</p>
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
                                {paternalMaternalGreatGrandfatherDetails.id ? ( 
                                    <>
                                    {paternalMaternalGreatGrandfatherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalMaternalGreatGrandfatherDetails.id)}>Page: {paternalMaternalGreatGrandfatherDetails.pageNum}<br />⇑</p>
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
                                {paternalMaternalGreatGrandmotherDetails.id ? (  
                                    <> 
                                    {paternalMaternalGreatGrandmotherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalMaternalGreatGrandmotherDetails.id)}>Page: {paternalMaternalGreatGrandmotherDetails.pageNum}<br />⇑</p>
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
                                {maternalPaternalGreatGrandfatherDetails.id ? ( 
                                    <>
                                    {maternalPaternalGreatGrandfatherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalPaternalGreatGrandfatherDetails.id)}>Page: {maternalPaternalGreatGrandfatherDetails.pageNum}<br />⇑</p>
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
                                {maternalPaternalGreatGrandmotherDetails.id ? ( 
                                    <>
                                    {maternalPaternalGreatGrandmotherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalPaternalGreatGrandmotherDetails.id)}>Page: {maternalPaternalGreatGrandmotherDetails.pageNum}<br />⇑</p>
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
                                {maternalMaternalGreatGrandfatherDetails.id ? (   
                                    <>
                                    {maternalMaternalGreatGrandfatherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalMaternalGreatGrandfatherDetails.id)}>Page: {maternalMaternalGreatGrandfatherDetails.pageNum}<br />⇑</p>
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
                                {maternalMaternalGreatGrandmotherDetails.id ? (  
                                    <>
                                    {maternalMaternalGreatGrandmotherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalMaternalGreatGrandmotherDetails.id)}>Page: {maternalMaternalGreatGrandmotherDetails.pageNum}<br />⇑</p>
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

                            
                            {ShowGreatGrandParentTable(basePersonDetails, "male", paternalPaternalGreatGrandfatherDetails, paternalGrandfatherDetails.id, openAddPaternalPaternalGreatGrandfatherModal, openEditPaternalPaternalGreatGrandfatherModal)}

                            {ShowGreatGrandParentTable(basePersonDetails, "female", paternalPaternalGreatGrandmotherDetails, paternalGrandfatherDetails.id, openAddPaternalPaternalGreatGrandmotherModal, openEditPaternalPaternalGreatGrandmotherModal)}

                            {ShowGreatGrandParentTable(basePersonDetails, "male", paternalMaternalGreatGrandfatherDetails, paternalGrandmotherDetails.id, openAddPaternalMaternalGreatGrandfatherModal, openEditPaternalMaternalGreatGrandfatherModal)}

                            {ShowGreatGrandParentTable(basePersonDetails, "female", paternalMaternalGreatGrandmotherDetails, paternalGrandmotherDetails.id, openAddPaternalMaternalGreatGrandmotherModal,openEditPaternalMaternalGreatGrandmotherModal)}

                            {ShowGreatGrandParentTable(basePersonDetails, "male", maternalPaternalGreatGrandfatherDetails, maternalGrandfatherDetails.id, openAddMaternalPaternalGreatGrandfatherModal, openEditMaternalPaternalGreatGrandfatherModal)}

                            {ShowGreatGrandParentTable(basePersonDetails, "female", maternalPaternalGreatGrandmotherDetails, maternalGrandfatherDetails.id, openAddMaternalPaternalGreatGrandmotherModal, openEditMaternalPaternalGreatGrandmotherModal)}

                            {ShowGreatGrandParentTable(basePersonDetails, "male", maternalMaternalGreatGrandfatherDetails, maternalGrandmotherDetails.id, openAddMaternalMaternalGreatGrandfatherModal, openEditMaternalMaternalGreatGrandfatherModal)}

                            {ShowGreatGrandParentTable(basePersonDetails, "female", maternalMaternalGreatGrandmotherDetails, maternalGrandmotherDetails.id, openAddMaternalMaternalGreatGrandmotherModal, openEditMaternalMaternalGreatGrandmotherModal)}
                           
                        </div>

                    </div>

                    {/*contains grandparents*/}
                    <div className="row tree-row">

                        <div className="tree-row justify-content-center">

                        {showAncestorTable(basePersonDetails, "male", paternalGrandfatherDetails, fatherDetails.id, openAddPaternalGrandfatherModal, openEditPaternalGrandfatherModal)}

                        {showAncestorTable(basePersonDetails, "female", paternalGrandmotherDetails, fatherDetails.id, openAddPaternalGrandmotherModal, openEditPaternalGrandmotherModal)}

                        {showAncestorTable(basePersonDetails, "male", maternalGrandfatherDetails, motherDetails.id, openAddMaternalGrandfatherModal, openEditMaternalGrandfatherModal)}

                        {showAncestorTable(basePersonDetails, "female", maternalGrandmotherDetails, motherDetails.id, openAddMaternalGrandmotherModal, openEditMaternalGrandmotherModal)}

                        </div>

                    </div>

                    {/*contains parents*/}
                    <div className="row tree-row">

                        <div className="tree-row justify-content-center">

                            {showAncestorTable(basePersonDetails, "male", fatherDetails, bottomPersonDetails.id, openAddFatherModal, openEditFatherModal)}

                            {showAncestorTable(basePersonDetails, "female", motherDetails, bottomPersonDetails.id, openAddMotherModal, openEditMotherModal)}

                        </div>

                    </div>

                    {/*person at the bottom of page*/}
                    <div className="row tree-row">

                        <div className="col-sm ">

                            <div className="tree-row justify-content-center">

                            {showAncestorTable(basePersonDetails, bottomPersonDetails.sex, bottomPersonDetails, bottomPersonDetails.id, true, openEditBottomPersonModal)}

                            </div>
                            
                            {pageNumber !== 1 ? (
                                <div className="col">
                                    <p className="up-arrow" onClick={() => navigateDown(bottomPersonDetails.id)}>⇓</p>
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