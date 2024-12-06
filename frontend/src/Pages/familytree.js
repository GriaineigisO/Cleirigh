import LeftSidebar from "../Components/leftSidebar"
import React, { useState, useEffect, Component } from 'react';
import { convertDate, convertNumToRelation } from '../library.js';
import { Modal, Button } from 'react-bootstrap';
import editLogo from '../Images/edit.png';

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
                middleName: baseData.fatherMiddleName,
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

    useEffect(() => {
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
                sex: pageData.sex
              }));
        }
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
                causeOfDeath: data.causeOfDeath
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
            console.log(paternalMaternalGreatGrandfatherDetails)
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


        const deletePerson = async (personID) => {
            // try {
            //     const userId = localStorage.getItem('userId');
            //     const response = fetch('http://localhost:5000/delete-person', {
            //         method: "POST",
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ userId, personID }),
            //     })
            // } catch (error) {
            //     console.log(`Error deleting ${personID}: `, error);
            // }
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

    function makeEditModal(showPerson, closeEditPerson, setDetails, details, save, seteditShowPerson, getPerson, closeAdd, deletePerson) {
console.log(details)
        return (

        <Modal show={showPerson} onHide={closeEditPerson} dialogClassName="custom-modal-width">
                <Modal.Header closeButton>
                <Modal.Title>Edit {details.fullName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-modal">

                        <input  type="text" placeholder="First Name" value={details.firstName} onChange={(e) => setDetails({ ...details, firstName: e.target.value })}></input>

                        <input type="text" placeholder="Middle Name" value={details.middleName} onChange={(e) => setDetails({ ...details, middleName: e.target.value })}></input>

                        <input type="text" placeholder="Last Name"  value={details.lastName} onChange={(e) => setDetails({ ...details, lastName: e.target.value })}></input>
                        
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Birth Date" value={details.birthDate} onChange={(e) => setDetails({ ...details, birthDate: e.target.value })}></input>

                    <input type="text" placeholder="Birth Place" value={details.birthPlace} onChange={(e) => setDetails({ ...details, birthPlace: e.target.value })}></input>
                    </div>

                    <div className="input-modal">
                    <input type="text" placeholder="Death Date" value={details.deathDate} onChange={(e) => setDetails({ ...details, deathDate: e.target.value })}></input>

                    <input type="text" placeholder="Death Place" value={details.deathPlace}  onChange={(e) => setDetails({ ...details, deathPlace: e.target.value })}></input>

                    <input type="text" placeholder="Cause of Death" value={details.causeOfDeath} onChange={(e) => setDetails({ ...details, causeOfDeath: e.target.value })}></input>
                    </div>
                   
                    <div className="input-modal">
                    <input type="text" placeholder="Titles/Occupations" value={details.occupation} onChange={(e) => setDetails({ ...details, occupation: e.target.value })}></input>

                    <input type="text" placeholder="Ethnicity" value={details.ethnicity} onChange={(e) => setDetails({ ...details, ethnicity: e.target.value })}></input>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={deletePerson(details.profileNumber)}>
                    Delete Person
                </Button>
                <Button variant="secondary" onClick={closeEditPerson}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => save(details, seteditShowPerson, getPerson)}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

        )
    }

    function showAncestorTable(basePersonDetails, sex, details, childID, openAddModal, openEditModal) {

        let motherFather = "";
        if (sex === "male") {
            motherFather = "Father";
        } else {
            motherFather = "Mother";
        }

        return (
            <>
            {details.id ? (
                <table  className="ancestor-box">
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Relation to {basePersonDetails.firstName}: </td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="3">{convertNumToRelation(details.relationToUser, sex)}</td>
                    <td className="ancestor-box-border-bottom table-label shrink">Profile Number:</td>
                    <td className="ancestor-box-border-bottom table-content shrink">{details.id}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Name:</td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="5"><b>{details.fullName}</b></td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom birth-date-cell table-label">Birth</td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="5">{details.birthDate} {details.birthPlace}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom birth-date-cell table-label">Death</td>
                    <td className="ancestor-box-border-bottom table-content" colSpan="5">{details.deathDate} {details.deathPlace}</td>
                </tr>
                <tr>
                    <td className=" ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                    <td className="table-content" colSpan="4">{details.occupation}</td>
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

    function showGreatGrandParentTable(basePersonDetails, sex, details, childID, openAddModal, openEditModal) {

        let motherFather = "";
        if (sex === "male") {
            motherFather = "Father";
        } else {
            motherFather = "Mother";
        }

        return(
            <>
             {details.id ? (
            <table className="ancestor-box">
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Relation to {basePersonDetails.firstName}:</td>
                    <td className="ancestor-box-border-bottom table-content">{convertNumToRelation(details.relationToUser, sex)}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Name:</td>
                    <td className="ancestor-box-border-bottom table-content"><b>{details.fullName}</b></td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Birth: </td>
                    <td className="ancestor-box-border-bottom table-content">{details.birthDate} <br />{details.birthPlace}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom table-label shrink">Death:</td>
                    <td className="ancestor-box-border-bottom table-content">{details.deathDate} <br />{details.deathPlace}</td>
                </tr>
                <tr>
                    <td className="ancestor-box-border-bottom ancestor-box-border-top table-label shrink">Titles/Occupation:</td>
                    <td className="ancestor-box-border-bottom table-content">{details.occupation}</td>
                </tr>
                <tr>
                    <td className=" table-label shrink">Profile <br/>Number:</td>
                    <td className="table-content">{details.id} {<img className="editLogo" src={editLogo} onClick={openEditModal}></img>}</td>
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
        // printPageNum(paternalPaternalGreatGrandfatherDetails, setPaternalPaternalGreatGrandfatherPage)
 


    return (
        <div>

            {makeModal(showFather, closeAddFatherModal, bottomPersonDetails.firstName, setFatherDetails, fatherDetails, "male", saveFatherChanges, closeAddFatherModal)}

            {makeModal(showMother, closeAddMotherModal, bottomPersonDetails.firstNameName, setMotherDetails, motherDetails, "female", saveMotherChanges, closeAddMotherModal)}

            {makeModal(showPaternalGrandfather, closeAddPaternalGrandfatherModal, fatherDetails.fullName, setPaternalGrandfatherDetails, paternalGrandfatherDetails, "male", savePaternalGrandfatherChanges, closeAddPaternalGrandfatherModal)}
            
            {makeModal(showPaternalGrandmother, closeAddPaternalGrandmotherModal, fatherDetails.fullName, setPaternalGrandmotherDetails, paternalGrandmotherDetails, "female", savePaternalGrandmotherChanges, closeAddPaternalGrandmotherModal)}

            {makeModal(showMaternalGrandfather, closeAddMaternalGrandfatherModal, motherDetails.fullName, setMaternalGrandfatherDetails, maternalGrandfatherDetails, "male", saveMaternalGrandfatherChanges, closeAddMaternalGrandfatherModal)}

            {makeModal(showMaternalGrandmother, closeAddMaternalGrandmotherModal, motherDetails.fullName, setMaternalGrandmotherDetails, maternalGrandmotherDetails, "female", saveMaternalGrandmotherChanges, closeAddMaternalGrandmotherModal)}

            {makeModal(showPaternalPaternalGreatGrandfather, closeAddPaternalPaternalGreatGrandfatherModal, paternalGrandfatherDetails.fullName, setPaternalPaternalGreatGrandfatherDetails, paternalPaternalGreatGrandfatherDetails, "male", savePaternalPaternalGreatGrandfatherChanges, closeAddPaternalPaternalGreatGrandfatherModal)}

            {makeModal(showPaternalPaternalGreatGrandmother, closeAddPaternalPaternalGreatGrandmotherModal, paternalGrandfatherDetails.fullName, setPaternalPaternalGreatGrandmotherDetails, paternalPaternalGreatGrandmotherDetails, "female", savePaternalPaternalGreatGrandmotherChanges, closeAddPaternalPaternalGreatGrandmotherModal)}

            {makeModal(showPaternalMaternalGreatGrandfather, closeAddPaternalMaternalGreatGrandfatherModal, paternalGrandmotherDetails.fullName, setPaternalMaternalGreatGrandfatherDetails, paternalMaternalGreatGrandfatherDetails, "male", savePaternalMaternalGreatGrandfatherChanges, closeAddPaternalMaternalGreatGrandfatherModal)}

            {makeModal(showPaternalMaternalGreatGrandmother, closeAddPaternalMaternalGreatGrandmotherModal, paternalGrandmotherDetails.fullName, setPaternalMaternalGreatGrandmotherDetails, paternalMaternalGreatGrandmotherDetails, "female", savePaternalMaternalGreatGrandmotherChanges, closeAddPaternalMaternalGreatGrandmotherModal)}

            {makeModal(showMaternalPaternalGreatGrandfather, closeAddMaternalPaternalGreatGrandfatherModal, maternalGrandfatherDetails.fullName, setMaternalPaternalGreatGrandfatherDetails, maternalPaternalGreatGrandfatherDetails, "male", saveMaternalPaternalGreatGrandfatherChanges, closeAddMaternalPaternalGreatGrandfatherModal)}

            {makeModal(showMaternalPaternalGreatGrandmother, closeAddMaternalPaternalGreatGrandmotherModal, maternalGrandfatherDetails.fullName, setMaternalPaternalGreatGrandmotherDetails, maternalPaternalGreatGrandmotherDetails, "female", saveMaternalPaternalGreatGrandmotherChanges, closeAddMaternalPaternalGreatGrandmotherModal)}

            {makeModal(showMaternalMaternalGreatGrandfather, closeAddMaternalMaternalGreatGrandfatherModal, maternalGrandmotherDetails.fullName, setMaternalMaternalGreatGrandfatherDetails, maternalMaternalGreatGrandfatherDetails, "male", saveMaternalMaternalGreatGrandfatherChanges, closeAddMaternalMaternalGreatGrandfatherModal)}

            {makeModal(showMaternalMaternalGreatGrandmother, closeAddMaternalMaternalGreatGrandmotherModal, maternalGrandmotherDetails.fullName, setMaternalMaternalGreatGrandmotherDetails, maternalMaternalGreatGrandmotherDetails, "female", saveMaternalMaternalGreatGrandmotherChanges, closeAddMaternalMaternalGreatGrandmotherModal)}

            {makeModal(showPaternalPaternalGreatGrandfathersFather, closeAddPaternalPaternalGreatGrandfathersFatherModal, paternalPaternalGreatGrandfatherDetails.fullName, setPaternalPaternalGreatGrandfathersFatherDetails, paternalPaternalGreatGrandfathersFatherDetails, "male", savePaternalPaternalGreatGrandfathersFatherChanges, closeAddPaternalPaternalGreatGrandfathersFatherModal)}

            {makeModal(showPaternalPaternalGreatGrandfathersMother, closeAddPaternalPaternalGreatGrandfathersMotherModal, paternalPaternalGreatGrandfatherDetails.fullName, setPaternalPaternalGreatGrandfathersMotherDetails, paternalPaternalGreatGrandfathersMotherDetails, "female", savePaternalPaternalGreatGrandfathersMotherChanges, closeAddPaternalPaternalGreatGrandfathersMotherModal)}

            {makeModal(showPaternalPaternalGreatGrandmothersFather, closeAddPaternalPaternalGreatGrandmothersFatherModal, paternalPaternalGreatGrandmotherDetails.fullName, setPaternalPaternalGreatGrandmothersFatherDetails, paternalPaternalGreatGrandmothersFatherDetails, "male", savePaternalPaternalGreatGrandmothersFatherChanges, closeAddPaternalPaternalGreatGrandmothersFatherModal)}

            {makeModal(showPaternalPaternalGreatGrandmothersMother, closeAddPaternalPaternalGreatGrandmothersMotherModal, paternalPaternalGreatGrandmotherDetails.fullName, setPaternalPaternalGreatGrandmothersMotherDetails, paternalPaternalGreatGrandmothersMotherDetails, "female", savePaternalPaternalGreatGrandmothersMotherChanges, closeAddPaternalPaternalGreatGrandmothersMotherModal)}

            {makeModal(showPaternalMaternalGreatGrandfathersFather, closeAddPaternalMaternalGreatGrandfathersFatherModal, paternalMaternalGreatGrandfatherDetails.fullName, setPaternalMaternalGreatGrandfathersFatherDetails, paternalMaternalGreatGrandfathersFatherDetails, "male", savePaternalMaternalGreatGrandfathersFatherChanges, closeAddPaternalMaternalGreatGrandfathersFatherModal)}

            {makeModal(showPaternalMaternalGreatGrandfathersMother, closeAddPaternalMaternalGreatGrandfathersMotherModal, paternalMaternalGreatGrandfatherDetails.fullName, setPaternalMaternalGreatGrandfathersMotherDetails, paternalMaternalGreatGrandfathersMotherDetails, "female", savePaternalMaternalGreatGrandfathersMotherChanges, closeAddPaternalMaternalGreatGrandfathersMotherModal)}

            {makeModal(showPaternalMaternalGreatGrandmothersFather, closeAddPaternalMaternalGreatGrandmothersFatherModal, paternalMaternalGreatGrandmotherDetails.fullName, setPaternalMaternalGreatGrandmothersFatherDetails, paternalMaternalGreatGrandmothersFatherDetails, "male", savePaternalMaternalGreatGrandmothersFatherChanges, closeAddPaternalMaternalGreatGrandmothersFatherModal)}

            {makeModal(showPaternalMaternalGreatGrandmothersMother, closeAddPaternalMaternalGreatGrandmothersMotherModal, paternalMaternalGreatGrandmotherDetails.fullName, setPaternalMaternalGreatGrandmothersMotherDetails, paternalMaternalGreatGrandmothersMotherDetails, "female", savePaternalMaternalGreatGrandmothersMotherChanges, closeAddPaternalMaternalGreatGrandmothersMotherModal)}

            {makeModal(showMaternalPaternalGreatGrandfathersFather, closeAddMaternalPaternalGreatGrandfathersFatherModal, maternalPaternalGreatGrandfatherDetails.fullName, setMaternalPaternalGreatGrandfathersFatherDetails, maternalPaternalGreatGrandfathersFatherDetails, "male", saveMaternalPaternalGreatGrandfathersFatherChanges, closeAddMaternalPaternalGreatGrandfathersFatherModal)}

            {makeModal(showMaternalPaternalGreatGrandfathersMother, closeAddMaternalPaternalGreatGrandfathersMotherModal, maternalPaternalGreatGrandfatherDetails.fullName, setMaternalPaternalGreatGrandfathersMotherDetails, maternalPaternalGreatGrandfathersMotherDetails, "female", saveMaternalPaternalGreatGrandfathersMotherChanges, closeAddMaternalPaternalGreatGrandfathersMotherModal)}

            {makeModal(showMaternalPaternalGreatGrandmothersFather, closeAddMaternalPaternalGreatGrandmothersFatherModal, maternalPaternalGreatGrandmotherDetails.fullName, setMaternalPaternalGreatGrandmothersFatherDetails, maternalPaternalGreatGrandmothersFatherDetails, "male", saveMaternalPaternalGreatGrandmothersFatherChanges, closeAddMaternalPaternalGreatGrandmothersFatherModal)}

            {makeModal(showMaternalPaternalGreatGrandmothersMother, closeAddMaternalPaternalGreatGrandmothersMotherModal, maternalPaternalGreatGrandmotherDetails.fullName, setMaternalPaternalGreatGrandmothersMotherDetails, maternalPaternalGreatGrandmothersMotherDetails, "female", saveMaternalPaternalGreatGrandmothersMotherChanges, closeAddMaternalPaternalGreatGrandmothersMotherModal)}

            {makeModal(showMaternalMaternalGreatGrandfathersFather, closeAddMaternalMaternalGreatGrandfathersFatherModal, maternalMaternalGreatGrandfatherDetails.fullName, setMaternalMaternalGreatGrandfathersFatherDetails, maternalMaternalGreatGrandfathersFatherDetails, "male", saveMaternalMaternalGreatGrandfathersFatherChanges, closeAddMaternalMaternalGreatGrandfathersFatherModal)}

            {makeModal(showMaternalMaternalGreatGrandfathersMother, closeAddMaternalMaternalGreatGrandfathersMotherModal, maternalMaternalGreatGrandfatherDetails.fullName, setMaternalMaternalGreatGrandfathersMotherDetails, maternalMaternalGreatGrandfathersMotherDetails, "female", saveMaternalMaternalGreatGrandfathersMotherChanges, closeAddMaternalMaternalGreatGrandfathersMotherModal)}

            {makeModal(showMaternalMaternalGreatGrandmothersFather, closeAddMaternalMaternalGreatGrandmothersFatherModal, maternalMaternalGreatGrandmotherDetails.fullName, setMaternalMaternalGreatGrandmothersFatherDetails, maternalMaternalGreatGrandmothersFatherDetails, "male", saveMaternalMaternalGreatGrandmothersFatherChanges, closeAddMaternalMaternalGreatGrandmothersFatherModal)}

            {makeModal(showMaternalMaternalGreatGrandmothersMother, closeAddMaternalMaternalGreatGrandmothersMotherModal, maternalMaternalGreatGrandmotherDetails.fullName, setMaternalMaternalGreatGrandmothersMotherDetails, maternalMaternalGreatGrandmothersMotherDetails, "female", saveMaternalMaternalGreatGrandmothersMotherChanges, closeAddMaternalMaternalGreatGrandmothersMotherModal)}


            {makeEditModal(editShowFather, closeEditFatherModal, setFatherDetails, fatherDetails, saveEdits, seteditShowFather, getFather, closeAddFatherModal, deletePerson)}

            {makeEditModal(editShowMother, closeEditMotherModal, setMotherDetails, motherDetails, saveEdits, seteditShowMother, getMother, closeAddMotherModal, deletePerson)}

            {makeEditModal(editShowPaternalGrandfather, closeEditPaternalGrandfatherModal, setPaternalGrandfatherDetails, paternalGrandfatherDetails,  saveEdits, seteditShowPaternalGrandfather, getPaternalGrandFather, closeAddPaternalGrandfatherModal, deletePerson)}

            {makeEditModal(editShowPaternalGrandmother, closeEditPaternalGrandmotherModal, setPaternalGrandmotherDetails, paternalGrandmotherDetails,  saveEdits, seteditShowPaternalGrandmother, getPaternalGrandMother, closeAddPaternalGrandmotherModal, deletePerson)}

            {makeEditModal(editShowMaternalGrandfather, closeEditMaternalGrandfatherModal, setMaternalGrandfatherDetails, maternalGrandfatherDetails,  saveEdits, seteditShowMaternalGrandfather, getMaternalGrandFather, closeAddMaternalGrandfatherModal, deletePerson)}

            {makeEditModal(editShowMaternalGrandmother, closeEditMaternalGrandmotherModal, setMaternalGrandmotherDetails, maternalGrandmotherDetails,  saveEdits, seteditShowMaternalGrandmother, getMaternalGrandMother, closeAddMaternalGrandmotherModal, deletePerson)}

            {makeEditModal(editShowPaternalPaternalGreatGrandfather, closeEditPaternalPaternalGreatGrandfatherModal, setPaternalPaternalGreatGrandfatherDetails, paternalPaternalGreatGrandfatherDetails,  saveEdits, seteditShowPaternalPaternalGreatGrandfather, getPaternalPaternalGreatGrandFather, closeAddPaternalPaternalGreatGrandfatherModal, deletePerson)}

            {makeEditModal(editShowPaternalPaternalGreatGrandmother, closeEditPaternalPaternalGreatGrandmotherModal, setPaternalPaternalGreatGrandmotherDetails, paternalPaternalGreatGrandmotherDetails,  saveEdits, seteditShowPaternalPaternalGreatGrandmother, getPaternalPaternalGreatGrandMother, closeAddPaternalPaternalGreatGrandmotherModal, deletePerson)}

            {makeEditModal(editShowPaternalMaternalGreatGrandfather, closeEditPaternalMaternalGreatGrandfatherModal, setPaternalMaternalGreatGrandfatherDetails, paternalMaternalGreatGrandfatherDetails,  saveEdits, seteditShowPaternalMaternalGreatGrandfather, getPaternalMaternalGreatGrandFather, closeAddPaternalMaternalGreatGrandfatherModal, deletePerson)}

            {makeEditModal(editShowPaternalMaternalGreatGrandmother, closeEditPaternalMaternalGreatGrandmotherModal, setPaternalMaternalGreatGrandmotherDetails, paternalMaternalGreatGrandmotherDetails,  saveEdits, seteditShowPaternalMaternalGreatGrandmother, getPaternalMaternalGreatGrandMother, closeAddPaternalMaternalGreatGrandmotherModal, deletePerson)}

            {makeEditModal(editShowMaternalPaternalGreatGrandfather, closeEditMaternalPaternalGreatGrandfatherModal, setMaternalPaternalGreatGrandfatherDetails, maternalPaternalGreatGrandfatherDetails,  saveEdits, seteditShowMaternalPaternalGreatGrandfather, getMaternalPaternalGreatGrandFather, closeAddMaternalPaternalGreatGrandfatherModal, deletePerson)}

            {makeEditModal(editShowMaternalPaternalGreatGrandmother, closeEditMaternalPaternalGreatGrandmotherModal, setMaternalPaternalGreatGrandmotherDetails, maternalPaternalGreatGrandmotherDetails,  saveEdits, seteditShowMaternalPaternalGreatGrandmother, getMaternalPaternalGreatGrandmother, closeAddMaternalPaternalGreatGrandmotherModal, deletePerson)}

            {makeEditModal(editShowMaternalMaternalGreatGrandfather, closeEditMaternalMaternalGreatGrandfatherModal, setMaternalMaternalGreatGrandfatherDetails, maternalMaternalGreatGrandfatherDetails,  saveEdits, seteditShowMaternalMaternalGreatGrandfather, getMaternalMaternalGreatGrandFather, closeAddMaternalMaternalGreatGrandfatherModal, deletePerson)}

            {makeEditModal(editShowMaternalMaternalGreatGrandmother, closeEditMaternalMaternalGreatGrandmotherModal, setMaternalMaternalGreatGrandmotherDetails, maternalMaternalGreatGrandmotherDetails,  saveEdits, seteditShowMaternalMaternalGreatGrandmother, getMaternalMaternalGreatGrandMother, closeAddMaternalMaternalGreatGrandmotherModal, deletePerson)}

            
            
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
                                {paternalPaternalGreatGrandfatherDetails.id ? ( 
                                    <>
                                    {paternalPaternalGreatGrandfatherHasParents ? (
                                        <div >
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalPaternalGreatGrandfatherDetails.id)}>Page: <br />⇑</p>
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
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalPaternalGreatGrandmotherDetails.id)}>Page: <br />⇑</p>
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
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalMaternalGreatGrandfatherDetails.id)}>Page: <br />⇑</p>
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
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(paternalMaternalGreatGrandmotherDetails.id)}>Page: <br />⇑</p>
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
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalPaternalGreatGrandfatherDetails.id)}>Page: <br />⇑</p>
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
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalPaternalGreatGrandmotherDetails.id)}>Page: <br />⇑</p>
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
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalMaternalGreatGrandfatherDetails.id)}>Page: <br />⇑</p>
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
                                            <p className="up-arrow" onClick={() => handleNavigateUpwards(maternalMaternalGreatGrandmotherDetails.id)}>Page: <br />⇑</p>
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

                            {showGreatGrandParentTable(basePersonDetails, "male", paternalPaternalGreatGrandfatherDetails, paternalGrandfatherDetails.id, openAddPaternalPaternalGreatGrandfatherModal, openEditPaternalPaternalGreatGrandfatherModal)}

                            {showGreatGrandParentTable(basePersonDetails, "female", paternalPaternalGreatGrandmotherDetails, paternalGrandfatherDetails.id, openAddPaternalPaternalGreatGrandmotherModal, openEditPaternalPaternalGreatGrandmotherModal)}

                            {showGreatGrandParentTable(basePersonDetails, "male", paternalMaternalGreatGrandfatherDetails, paternalGrandmotherDetails.id, openAddPaternalMaternalGreatGrandfatherModal, openEditPaternalMaternalGreatGrandfatherModal)}

                            {showGreatGrandParentTable(basePersonDetails, "female", paternalMaternalGreatGrandmotherDetails, paternalGrandmotherDetails.id, openAddPaternalMaternalGreatGrandmotherModal,openEditPaternalMaternalGreatGrandmotherModal)}

                            {showGreatGrandParentTable(basePersonDetails, "male", maternalPaternalGreatGrandfatherDetails, maternalGrandfatherDetails.id, openAddMaternalPaternalGreatGrandfatherModal, openEditMaternalPaternalGreatGrandfatherModal)}

                            {showGreatGrandParentTable(basePersonDetails, "female", maternalPaternalGreatGrandmotherDetails, maternalGrandfatherDetails.id, openAddMaternalPaternalGreatGrandmotherModal, openEditMaternalPaternalGreatGrandmotherModal)}

                            {showGreatGrandParentTable(basePersonDetails, "male", maternalMaternalGreatGrandfatherDetails, maternalGrandmotherDetails.id, openAddMaternalMaternalGreatGrandfatherModal, openEditMaternalMaternalGreatGrandfatherModal)}

                            {showGreatGrandParentTable(basePersonDetails, "female", maternalMaternalGreatGrandmotherDetails, maternalGrandmotherDetails.id, openAddMaternalMaternalGreatGrandmotherModal, openEditMaternalMaternalGreatGrandmotherModal)}
                           
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

                            {showAncestorTable(basePersonDetails, bottomPersonDetails.sex, bottomPersonDetails)}

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