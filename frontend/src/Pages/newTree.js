import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css'

const NewTree = () => {
  const [treeName, setTreeName] = useState('');
  const [treeId, setTreeId] = useState();
  const [currentTree, setCurrentTree] = useState();
  const [isDead, setIsDead] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [deathPlace, setDeathPlace] = useState('');
  const [deathCause, setDeathCause] = useState('');
  const [occupation, setOccupation] = useState('');
  const [finishedMakingTree, setFinishedMakingTree] = useState(false);
 

    const handleTreeName =(event) => {
        setTreeName(event.target.value);
    }

    const handleAlive = () => {
        setIsDead(false);
      }
    
      const handleDead = () => {
        setIsDead(true);
      }
    
      const handleFirstName = (event) => {
        setFirstName(event.target.value);
      }
    
      const handleMiddleName = (event) => {
        setMiddleName(event.target.value);
      }
    
      const handleLastName = (event) => {
        setLastName(event.target.value);
      }
    
      const handleSex = (event) => {
        setSex(event.target.value);
      }
    
      const handleEthnicity = (event) => {
        setEthnicity(event.target.value);
      };
    
      const handleBirthDate = (event) => {
        setBirthDate(event.target.value);
      };
    
      const handleBirthPlace = (event) => {
        setBirthPlace(event.target.value);
      };
    
      const handleDeathDate = (event) => {
        setDeathDate(event.target.value);
      };
    
      const handleDeathPlace = (event) => {
        setDeathPlace(event.target.value);
      };
    
      const handleDeathCause = (event) => {
        setDeathCause(event.target.value);
      };
    
      const handleOccupation = (event) => {
        setOccupation(event.target.value);
      };

     

const navigate = useNavigate();

const HandleFirstPerson = async () => {
  const userId = localStorage.getItem('userId');
  const generatedTreeId = Date.now();
  setTreeId(generatedTreeId);

  try {
    const createTreeResponse = await fetch('`${process.env.REACT_APP_BACKEND_URL}/make-new-tree', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, treeName, treeId: generatedTreeId }),
    });

    if (!createTreeResponse.ok) {
      throw new Error('Failed to create a new tree');
    }

    const addPersonResponse = await fetch('`${process.env.REACT_APP_BACKEND_URL}/add-first-person', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        middleName,
        lastName,
        sex,
        ethnicity,
        birthDate,
        birthPlace,
        deathDate: isDead ? deathDate : null,
        deathPlace: isDead ? deathPlace : null,
        deathCause: isDead ? deathCause : null,
        occupation,
        currentTree: generatedTreeId,
      }),
    });

    if (!addPersonResponse.ok) {
      throw new Error('Failed to add the first person');
    }

    const setCurrentTreeResponse = await fetch('`${process.env.REACT_APP_BACKEND_URL}/set-current-tree', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, treeId: generatedTreeId }),
    });

    if (!setCurrentTreeResponse.ok) {
      throw new Error('Failed to set the current tree');
    }

    // Redirect after all API calls are successful
    console.log('All API calls succeeded. Navigating to /home');
    navigate('/home');
  } catch (error) {
    console.error('Error making new tree: ', error);
  }
};

      

    return (
        <div>

            <div id="newTreeForm">

                <h1>Make A New Tree</h1>

                <div>
                    <label className="basePersonNewTreeLabel">Enter Your New Tree's Name</label>
                    <input type="text" onChange={handleTreeName} />
                </div>
            

                <div id="basePersonNewTree">
                    <h3>Enter Base Person Information</h3>
                    <p>The base person is the person at the very bottom of the tree, whose ancestry is being described.</p>
             
                        <label className="basePersonNewTreeLabel">First Name</label>
                        <input type="text" onChange={handleFirstName}></input>

                        <label className="basePersonNewTreeLabel">Middle Name</label>
                        <input type="text" onChange={handleMiddleName}></input>

                        <label className="basePersonNewTreeLabel">Last Name</label>
                        <input type="text" onChange={handleLastName}></input>
              

                   
                        <label className="basePersonNewTreeLabel">Sex</label>
                        <select onChange={handleSex}>
                            <option>--Select An Option--</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        </select>

                        <label className="basePersonNewTreeLabel">Ethnicity</label>
                        <input type="text" onChange={handleEthnicity}></input>

                        <label className="basePersonNewTreeLabel">Occupation</label>
                        <input type="text" onChange={handleOccupation}></input>
                    

                   
                        <label className="basePersonNewTreeLabel">Date of Birth</label>
                        <input type="text" onChange={handleBirthDate}></input>

                        <label className="basePersonNewTreeLabel">Place of Birth</label>
                        <input type="text"  onChange={handleBirthPlace}></input>
                  

                   <div className="aliveDead">
                    <label>Alive</label>
                    <input type="radio" name="deadOrAlive" onClick={handleAlive}/>
                   </div>

                   <div className="aliveDead">
                    <label>Dead</label>
                    <input type="radio" name="deadOrAlive" onClick={handleDead}/>
                   </div>
                                 

                    {isDead ? (
                    <>
                    <label>Date of Death</label>
                    <input type="text"  onChange={handleDeathDate}></input>
        
                    <label>Place of Death</label>
                    <input type="text"  onChange={handleDeathPlace}></input>

                    <label>Cause of Death</label>
                    <input type="text" onChange={handleDeathCause}></input>
                    </>
                    ) : (
                    <></>
                    )}

               

                </div>

                    <button id="newTreeButton" onClick={HandleFirstPerson}>Create New Tree</button>
                    
            

          </div>

    </div>

    )

}

export default NewTree;