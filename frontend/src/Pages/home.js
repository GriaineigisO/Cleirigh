import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import {capitaliseFirstLetter} from '../library.js'

const HomePageNoTrees = ({ treeName, setTreeName, handleNewTree }) => {
    return (
      <div>
        <h1>Begin Your New Archive</h1>
        <p>To begin creating your first tree, enter its name below.</p>
        <input
          type="text"
          value={treeName}
          onChange={(e) => setTreeName(e.target.value)} // Update parent state
          placeholder="Enter tree name"
        />
        <button onClick={handleNewTree}>Create Your First Tree</button>
      </div>
    );
  };

let treesName = "";
const HomePageWithTree = () => {

  const [treeName, setTreeName] = useState('');
  const [isEmpty, setIsEmpty] = useState(null);
  const [currentTree, setCurrentTree] = useState();
  
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

  
  const CheckIfTreeIsEmpty = async () => {

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    //gets the current_tree_id in the users table
    try {
      const response = await fetch('http://localhost:5000/get-current-tree', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.success) {
          console.log('Current tree updated to:', data.currentTree);
          setCurrentTree(data.currentTree);
      } else {
          console.error('Failed to update current tree:', data.error);
      }
  } catch (error) {
      console.error('Error setting current tree:', error);
  }

  //counts amount of rows in the current tree to check if the tree is empty or not
  try {
    console.log("current tree is:", currentTree)
    const response = await fetch('http://localhost:5000/check-if-tree-empty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentTree }),
    });

    const data = await response.json();
    console.log('Tree is empty:', data.isEmpty);
    setIsEmpty(data.isEmpty)
    console.log(isEmpty)
  } catch (error) {
      console.error('Error setting current tree:', error);
  }
    
  }

  useEffect(() => {
    CheckIfTreeIsEmpty();
  }, []);



  return (
    <div>
      <h1>The {capitaliseFirstLetter(treeName)} Tree</h1>
      {isEmpty ? (
        <p>Your tree is empty!</p>
      ) : (
        <ul>
          <li>X-num ancestors</li>
          <li>X-num places</li>
          <li>x-num occupations</li>
      </ul>
      )}
    </div>
  );
};

const Home = () => {
    const [treeName, setTreeName] = useState('');
    const [hasTrees, setHasTrees] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
    
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
    
        // Check if user has trees
        const checkUserHasTrees = async () => {
          try {
            const response = await fetch('http://localhost:5000/check-if-no-trees', {
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
            setHasTrees(data.hasTrees); // Update state based on response
          } catch (error) {
            console.error('Error checking trees:', error);
          }
        };
    
        checkUserHasTrees(); 
      }, []); 
    
    const handleNewTree = async () => {
    
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        // Decode the token to get the user ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id; 
        const treeId = Date.now();
        
        try {
          
            const response = await fetch('http://localhost:5000/make-new-tree', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId, treeName, treeId })
            });
           
            const data = await response.json();
            //saves what tree is currently selected, in loca storage
            setHasTrees(true);
            
        } catch (error) {
            console.error('Error submitting query:', error);
        }
        
        //updates the current_tree_id column in the users table
        try {
            const response = await fetch('http://localhost:5000/set-current-tree', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, treeId }),
            });
    
            const data = await response.json();
            if (data.success) {
                console.log('Current tree updated to:', data.currentTree);
            } else {
                console.error('Failed to update current tree:', data.error);
            }
        } catch (error) {
            console.error('Error setting current tree:', error);
        }
        
        
        
    };    

    return (
        <div >
            <div className="row">

                <div className="col-sm-2 left-sidebar">
                    <div className="row"><a href="">Family tree</a></div>
                    <div className="row"><a href="">Ancestor Profiles</a></div>
                    <div className="row"><a href="">Queries</a></div>
                </div>

                <div className="col-lg centre-col ">
                    {hasTrees ? (
                        <HomePageWithTree />
                    ) : (
                        <HomePageNoTrees 
                            treeName={treeName} 
                            setTreeName={setTreeName} 
                            handleNewTree={handleNewTree} 
                        />
                    )}
                </div>


                <div className="col-sm-3 right-sidebar">
                        <div className="row"><a href="">Make a New Tree</a></div>
                        <div className="row"><a href="">Add New Ancestor</a></div>
                        <div className="row"><a href="">Random Ancestor's Profile</a></div>
                        <div className="row"><a href="">On This Day</a></div>
                        <div className="row"><a href="">Battles</a></div>
                </div>

            </div>
        </div>
    )

};

export {Home, treesName};