import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { capitaliseFirstLetter, convertNumToRelation } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";
import LeftSidebar from "../Components/leftSidebar.js";

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
  const [basePersonFirstName, setBasePersonFirstName] = useState();
  const [treeName, setTreeName] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [currentTree, setCurrentTree] = useState();
  const [isDead, setIsDead] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [deathPlace, setDeathPlace] = useState("");
  const [deathCause, setDeathCause] = useState("");
  const [occupation, setOccupation] = useState("");
  const [numOfAncestors, setNumOfAncestors] = useState(0);
  const [numOfPlaces, setNumOfPlaces] = useState(0);
  const [numOfOccupations, setNumOfOccupations] = useState(0);
  const [listOfPlaces, setListOfPlaces] = useState("");
  const [listOfOccupations, setListOfOccupations] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostRemovedAncestor, setMostRemovedAncestor] = useState();
  const [mostRemovedAncestorLink, setMostRemovedAncestorLink] = useState();
  const [mostRemovedAncestorRelation, setMostRemovedAncestorRelation] =
    useState([]);
  const [
    mostRemovedAncestorRelationLargestInt,
    setMostRemovedAncestorRelationLargestInt,
  ] = useState();
  const [mostRemovedAncestorSex, setMostRemovedAncestorSex] = useState();
  const [mostRepeatedAncestor, setMostRepeatedAncestor] = useState();
  const [mostRepeatedAncestorLink, setMostRepeatedAncestorLink] = useState();
  const [repeatedTimes, setRepeatedTimes] = useState();
  const [progressPersonName, setProgressPersonName] = useState();
  const [progressPersonLink, setProgressPersonLink] = useState();
  const [progressNote, setProgressNote] = useState();
  const [savedProgress, setSavedProgress] = useState(false);

  // returns name of user's tree

  const getTreeName = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const response = await fetch("https://cleirigh-backend.vercel.app/api/get-tree-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      // Check if the response is valid and is JSON
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setTreeName(data.treeName); // Update state based on response
    } catch (error) {
      console.error("Error checking trees:", error);
    }

    return treeName;
  };

  getTreeName();

  const getCurrentTree = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    //gets the current_tree_id in the users table
    try {
      const response = await fetch("https://cleirigh-backend.vercel.app/api/get-current-tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      setCurrentTree(data.currentTree);
    } catch (error) {
      console.error("Error setting current tree:", error);
    }
  };

  useEffect(() => {
    getCurrentTree();
  }, []);

  useEffect(() => {
    const checkTreeEmpty = async () => {
      if (!currentTree !== null && currentTree !== undefined) {
        const response = await fetch(
          "https://cleirigh-backend.vercel.app/api/check-if-tree-empty",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentTree }),
          }
        );

        const data = await response.json();
        setIsEmpty(data.isEmpty);
      }
    };

    checkTreeEmpty();
  }, [currentTree]); // This runs whenever `currentTree` changes

  const handleAlive = () => {
    setIsDead(false);
  };

  const handleDead = () => {
    setIsDead(true);
  };

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleMiddleName = (event) => {
    setMiddleName(event.target.value);
  };

  const handleLastName = (event) => {
    setLastName(event.target.value);
  };

  const handleSex = (event) => {
    setSex(event.target.value);
  };

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

  const homePageStats = useCallback(async () => {
    try {
      const response = await fetch("https://cleirigh-backend.vercel.app/api/count-ancestors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentTree }),
      });

      const data = await response.json();
      setNumOfAncestors(data);

      const placeResponse = await fetch("https://cleirigh-backend.vercel.app/api/count-places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentTree }),
      });

      const placeData = await placeResponse.json();
      setNumOfPlaces(placeData.numOfPlaces);
      setListOfPlaces(`including: ${placeData.listOfPlaces}`);

      const occupationResponse = await fetch(
        "https://cleirigh-backend.vercel.app/api/count-occupations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentTree }),
        }
      );

      const occupationData = await occupationResponse.json();
      setNumOfOccupations(occupationData.numOfOccupations);
      setListOfOccupations(`including: ${occupationData.listOfOccupations}`);

      const userId = localStorage.getItem("userId");
      const removedResponse = await fetch(
        "https://cleirigh-backend.vercel.app/api/get-most-removed-ancestor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const removedData = await removedResponse.json();
      setMostRemovedAncestor(removedData.name);
      setMostRemovedAncestorLink(removedData.link);
      setMostRemovedAncestorRelation(removedData.relation);
      setMostRemovedAncestorSex(removedData.sex);

      const repeatedResponse = await fetch(
        "https://cleirigh-backend.vercel.app/api/get-most-repeated-ancestor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const repeatedData = await repeatedResponse.json();
      setMostRepeatedAncestor(repeatedData.name);
      setMostRepeatedAncestorLink(repeatedData.link);
      setRepeatedTimes(repeatedData.repeatedTimes);

      const baseUserResponse = await fetch(
        "https://cleirigh-backend.vercel.app/api/get-base-person",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const baseUserData = await baseUserResponse.json();
      setBasePersonFirstName(baseUserData.firstName);

      try {
        const progressResponse = await fetch(
          "https://cleirigh-backend.vercel.app/api/get-progress",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          }
        );
        const progressData = await progressResponse.json();
        setProgressPersonName(progressData.name);
        setProgressPersonLink(progressData.link);
        setProgressNote(progressData.note);
        if (progressData.bool) {
          setSavedProgress(true);
        } else {
          setSavedProgress(false);
        }
      } catch (error) {
        console.log("error getting progress:", error);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [currentTree]); // homePageStats now depends on currentTree

  useEffect(() => {
    const fetchData = async () => {
      if (currentTree) {
        setLoading(true); // Start loading
        try {
          await homePageStats(); // Call the memoized function
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    fetchData();
  }, [currentTree, homePageStats]); // Include homePageStats in dependencies

  const handleFirstPerson = async () => {
    const response = await fetch("https://cleirigh-backend.vercel.app/api/add-first-person", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        middleName,
        lastName,
        sex,
        ethnicity,
        birthDate,
        birthPlace,
        deathDate,
        deathPlace,
        deathCause,
        occupation,
        currentTree,
      }),
    });

    setIsEmpty(false);
  };

  const handleRemoveNote = async () => {
    setSavedProgress(false);
    const userId = localStorage.getItem("userId");
    const response = await fetch("https://cleirigh-backend.vercel.app/api/remove-progress-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  };

  useEffect(() => {
    if (mostRemovedAncestorRelation.length > 0 ) {
      //finds the largest value in the mostRemovedAncestorRelation array
      let largest = 0;
      for (let i = 0; i < mostRemovedAncestorRelation.length; i++) {
        if (mostRemovedAncestorRelation[i] > largest) {
          largest = mostRemovedAncestorRelation[i];
        }
      }

      setMostRemovedAncestorRelationLargestInt(largest);
    }
  }, [mostRemovedAncestorRelation]);
  

  return (
    <div className="oghamleaves">
      <h1>The {capitaliseFirstLetter(treeName)} Tree</h1>
      {isEmpty ? (
        <div>
          <p>
            Your tree is empty! Begin it by entering the base person - this is
            the person whose ancestry will be described. It may be yourself or
            someone else.
          </p>

          {/*form to enter base person*/}
          <div className="basePersonForm">
            <label>First Name</label>
            <input type="text" onChange={handleFirstName}></input>

            <label>Middle Name</label>
            <input type="text" onChange={handleMiddleName}></input>

            <label>Last Name</label>
            <input type="text" onChange={handleLastName}></input>

            <label>Sex</label>
            <select onChange={handleSex}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <label>Ethnicity</label>
            <input type="text" onChange={handleEthnicity}></input>

            <label>Date of Birth</label>
            <input type="text" onChange={handleBirthDate}></input>

            <label>Place of Birth</label>
            <input type="text" onChange={handleBirthPlace}></input>

            <div>
              <label>Alive</label>
              <input type="radio" name="deadOrAlive" onClick={handleAlive} />

              <label>Dead</label>
              <input type="radio" name="deadOrAlive" onClick={handleDead} />
            </div>

            {isDead ? (
              <>
                <label>Date of Death</label>
                <input type="text" onChange={handleDeathDate}></input>

                <label>Place of Death</label>
                <input type="text" onChange={handleDeathPlace}></input>

                <label>Cause of Death</label>
                <input type="text" onChange={handleDeathCause}></input>
              </>
            ) : (
              <></>
            )}

            <label>Occupation</label>
            <input type="text" onChange={handleOccupation}></input>

            <button onClick={handleFirstPerson}>Add First Person</button>
          </div>
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              {savedProgress ? (
                <div className="homePageDiv">
                  <p className="homePageDivLabel">Where You Left Off</p>
                  <p className="homePageDivContent progressContent">
                    <a
                      style={{ color: "rgb(210, 255, 126)" }}
                      href={progressPersonLink}
                    >
                      {progressPersonName}
                    </a>{" "}
                    <br /> {progressNote}{" "}
                  </p>
                  <button
                    className="remove-progress-button"
                    onClick={handleRemoveNote}
                  >
                    Remove Note
                  </button>
                </div>
              ) : (
                <></>
              )}

              <div className="homePageDiv">
                <p className="homePageDivLabel">
                  Number of ancestors in the tree
                </p>
                <p className="homePageDivContent">{numOfAncestors}</p>
              </div>

              <div className="homePageDiv">
                <p className="homePageDivLabel">
                  Number of places mentioned in the tree
                </p>
                <p className="homePageDivContent">
                  {numOfPlaces} {listOfPlaces}
                </p>
              </div>

              <div className="homePageDiv">
                <p className="homePageDivLabel">
                  Number of occupations mentioned in the tree
                </p>
                <p className="homePageDivContent">
                  {numOfOccupations} {listOfOccupations}
                </p>
              </div>

              
              <div className="homePageDiv">
                <p className="homePageDivLabel">
                  Most Removed Ancestor By Generation
                </p>
                <p className="homePageDivContent">
                  <a
                    style={{ color: "rgb(210, 255, 126)" }}
                    href={mostRemovedAncestorLink}
                  >
                    {mostRemovedAncestor}
                  </a>{" "}
                  - {basePersonFirstName}'s{" "}
                  {convertNumToRelation(
                    mostRemovedAncestorRelationLargestInt,
                    mostRemovedAncestorSex
                  )}
                </p>
              </div>

              
              {mostRepeatedAncestor && repeatedTimes > 1 ? (
                <div className="homePageDiv">
                  <p className="homePageDivLabel">Most Repeated Ancestor</p>
                  <p className="homePageDivContent">
                    <a
                      style={{ color: "rgb(210, 255, 126)" }}
                      href={mostRepeatedAncestorLink}
                    >
                      {mostRepeatedAncestor}
                    </a>{" "}
                    - occurs in this tree {repeatedTimes} times
                  </p>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [treeName, setTreeName] = useState("");
  const [hasTrees, setHasTrees] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    // Check if user has trees
    const checkUserHasTrees = async () => {
      try {
        const response = await fetch(
          "https://cleirigh-backend.vercel.app/api/check-if-no-trees",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        // Check if the response is valid and is JSON
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setHasTrees(data.hasTrees); // Update state based on response
      } catch (error) {
        console.error("Error checking trees:", error);
      }
    };

    checkUserHasTrees();
  }, []);

  const handleNewTree = async () => {
    // Get the token from localStorage
    const userId = localStorage.getItem("userId");
    const treeId = Date.now();

    try {
      const response = await fetch("https://cleirigh-backend.vercel.app/make-new-tree", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, treeName, treeId }),
      });

      const data = await response.json();
      //saves what tree is currently selected, in loca storage
      setHasTrees(true);
    } catch (error) {
      console.error("Error submitting query:", error);
    }

    //updates the current_tree_id column in the users table
    try {
      const response = await fetch("https://cleirigh-backend.vercel.app/set-current-tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, treeId }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Failed to update current tree:", data.error);
      }
    } catch (error) {
      console.error("Error setting current tree:", error);
    }
  };

  return (
    <div>
      <div className="row">
        <LeftSidebar />

        <div className="col-lg centre-col">
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
          <div className="row">
            <Link to={"/newTree"}>Make a New Tree</Link>
          </div>
          <div className="row">
            <a href="">Add New Ancestor</a>
          </div>
          <div className="row">
            <a href="">Random Ancestor's Profile</a>
          </div>
          <div className="row">
            <a href="">On This Day</a>
          </div>
          <div className="row">
            <a href="">Battles</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Home, treesName };
