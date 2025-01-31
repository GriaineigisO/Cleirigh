import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { convertNumToRelation } from "../library";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useEffectOnce } from "../Components/useEffectOnce.js";
import ancientGroups from "../Components/AncientEthnicBreakdown.js";



const Profile = () => {
  const [ethnicityNameArray, setEthnicityNameArray] = useState([]);
  const [ethnicityPercentageArray, setEthnicityPercentageArray] = useState([]);
  const [isEditingInfo, setisEditingInfo] = useState(false);
  const [sourceNameLink, setSourceNameLink] = useState();
  const [sourceLink, setSourceLink] = useState();
  const [sourceNameLinkArray, setSourceNameLinkArray] = useState([]);
  const [sourceLinkArray, setSourceLinkArray] = useState([]);
  const [sourceType, setSourceType] = useState();
  const [sourceNameText, setSourceNameText] = useState();
  const [sourceNameTextAuthor, setSourceNameTextAuthor] = useState();
  const [sourceNameTextArray, setSourceNameTextArray] = useState([]);
  const [sourceNameTextAuthorArray, setSourceNameTextAuthorArray] = useState(
    []
  );
  const [editTextSourceOpen, setEditTextSourceOpen] = useState(false);
  const [showEditTextSourceModal, setShowEditTextSourceModal] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [editSources, setEditSources] = useState(false);
  const [value, setValue] = useState("");
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fatherName, setFatherName] = useState();
  const [motherName, setMotherName] = useState();
  const [parents, setParents] = useState();
  const [fatherId, setFatherId] = useState();
  const [motherId, setMotherId] = useState();
  const [childName, setChildName] = useState([]);
  const [childId, setChildId] = useState([]);
  const [child, setChild] = useState([]);
  const [spouseName, setSpouseName] = useState();
  const [spouseId, setSpouseId] = useState();
  const [spouse, setSpouse] = useState();
  const [content, setContent] = useState("<p>Describe Your Ancestor.../p>");
  const [basePersonFirstName, setBasePersonFirstName] = useState();
  const [ancestryPercent, setAncestryPercent] = useState();
  const [isEditing, setisEditing] = useState(false);
  const [editAlternativeNames, setEditAlternativeNames] = useState();
  const [profilePic, setProfilePic] = useState();
  const [file, setFile] = useState(null);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [topicNames, setTopicNames] = useState([]);
  const [topicLinks, setTopicLinks] = useState([]);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          "https://cleirigh-backend.vercel.app/api/ancestor-profiles",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, id }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Unable to fetch profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [id]);

  const calculateEthnicBreakdown = async () => {
    const userId = localStorage.getItem("userId");
    const getEthnicity = await fetch(
      "https://xkwbiwiieqlsjmptcagp.supabase.co/functions/v1/calculate-ethnic-breakdown",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY}` },
        body: JSON.stringify({ userId, id }),
      }
    );
    const data = await getEthnicity.json();
    if (ethnicityNameArray.length === 0) {
      setEthnicityNameArray((prev) => [...prev, data.ethnicityNameArray]);
      setEthnicityPercentageArray((prev) => [
        ...prev,
        data.ethnicityPercentageArray,
      ]);
    }
  };

  useEffectOnce(() => {
    calculateEthnicBreakdown();
  });

  const AncientEthnicBreakdown = () => {
    let ancientGroup = [];
    let ancientGroupPercent = [];
    let ancientGroupGraphColor = [];
    let ancientGroupPercentTotal = 0;
    for (let i = 0; i < ethnicityNameArray[0].length; i++) {
      const modernEthnicity = ethnicityNameArray[0][i]
        .toLowerCase()
        .replace(" ", "_");

      //if the % of the modern ethnic group is less than 0.0% when rounded up, the entire component will be ignored
      if (
        modernEthnicity in ancientGroups &&
        ethnicityPercentageArray[0][i].toFixed(2) > 0.0
      ) {
        const modernEthnicityBreakdown = ancientGroups[modernEthnicity];

        function calculateAncientComponent(component, ancientAverage, color) {
          const ancientComponentPercent =
            (ancientAverage * ethnicityPercentageArray[0][i]) / 100;

          if (!ancientGroup.includes(component)) {
            ancientGroup.push(component);
            ancientGroupPercent.push(ancientComponentPercent);
            ancientGroupGraphColor.push(color);
          } else {
            const amount = ancientGroupPercent[ancientGroup.indexOf(component)];
            ancientGroupPercent[ancientGroup.indexOf(component)] =
              amount + ancientComponentPercent;
          }
        }

        calculateAncientComponent(
          "Steppe",
          modernEthnicityBreakdown.steppe,
          "blue"
        );
        calculateAncientComponent(
          "Anatolian Neolithic Farmer",
          modernEthnicityBreakdown.anf,
          "orange"
        );
        calculateAncientComponent(
          "Western Hunter Gatherer",
          modernEthnicityBreakdown.whg,
          "green"
        );
        calculateAncientComponent(
          "Baltic Hunter Gatherer",
          modernEthnicityBreakdown.baltic_hg,
          "green"
        );
        calculateAncientComponent(
          "Iran Paleolithic",
          modernEthnicityBreakdown.iran_paleo,
          "green"
        );
        calculateAncientComponent(
          "Taforalt",
          modernEthnicityBreakdown.taforalt,
          "green"
        );
        calculateAncientComponent(
          "Eastern Hunter Gatherer",
          modernEthnicityBreakdown.ehg,
          "blue"
        );


      }
    }

    let count = 0;

    for (let l = 0; l < ancientGroupPercent.length; l++) {
      ancientGroupPercentTotal += ancientGroupPercent[l];
    }

    while (ancientGroupPercentTotal < 100) {
      ancientGroupPercent[0] += 0.01;
      ancientGroupPercentTotal += 0.01
      count++
    }

    return (
      <ul>
        {ancientGroup.map((ethnicity, index) => (
          <>
            {ancientGroupPercent[index].toFixed(2) == 0.0 ? (
              <></>
            ) : (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <li
                  key={index}
                  style={{
                    width: "250px",
                    textAlign: "right",
                    marginRight: "5px",
                    listStyle: "none",
                  }}
                >
                  {ancientGroup[index]}: {ancientGroupPercent[index].toFixed(2)}
                  %
                </li>
                <div>
                  <span
                    style={{
                      textAlign: "left",
                      paddingRight: `${
                        ancientGroupPercent[index].toFixed(2) * 10
                      }px`,
                      height: "16",
                      backgroundColor: `${ancientGroupGraphColor[index]}`,
                    }}
                  >
                    {" "}
                  </span>
                </div>
              </div>
            )}
          </>
        ))}
      </ul>
    );
  };

  const EthnicBreakdown = () => {
    if (ethnicityNameArray[0]) {
      return (
        <>
          <hr></hr>
          <h1>Ethnic Breakdown</h1>
          <p>
            The following ethnic breakdown is purely geneaological - it is not
            an accurate representation of your genetic composition. Your
            geneaological ancestry shown below may include incredibly small
            results (> 0.00%) that almost definitely mean that you have zero
            genes from this ancestral ethnic component. This calculation also
            makes some necessary assumptions. It only takes into consideration
            the listed ethnicities of each dead-end ancestor - thus it is blind
            to any ethnic components that lurk behind dead-ends. When an
            ancestor only has one parent listed, then the missing parent is
            assumed to have the same ethnicity as the listed one. So while the
            numbers below aren't a direct representation of your DNA, it is an
            interesting way to see the breakdown of your ancestry, even
            incredibly small components that have been totally genetically
            diluted - according to your known ancestry, that is.
          </p>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h4>Rounded</h4>
              <ol>
                {ethnicityNameArray[0].map((ethnicity, index) => (
                  <>
                    {ethnicityPercentageArray[0][index].toFixed(2) > 0.0 ? (
                      <li key={index}>
                        {ethnicityNameArray[0][index]}:{" "}
                        {ethnicityPercentageArray[0][index].toFixed(2)}%
                      </li>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </ol>

              <h4>No Rounding</h4>
              <ol>
                {ethnicityNameArray[0].map((ethnicity, index) => (
                  <li key={index}>
                    {ethnicityNameArray[0][index]}:{" "}
                    {ethnicityPercentageArray[0][index].toFixed(20)}%
                  </li>
                ))}
              </ol>
            </div>

            <div style={{ marginLeft: "100px" }}>
              <h4>Estimated Ancient Breakdown</h4>

              <AncientEthnicBreakdown />
            </div>
          </div>
        </>
      );
    }
  };

  const getSources = async () => {
    if (profileData) {
      const userId = localStorage.getItem("userId");
      const response = await fetch("https://cleirigh-backend.vercel.app/api/get-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, profileData }),
      });
      const data = await response.json();
      setSourceLinkArray(data.source_link);
      setSourceNameLinkArray(data.source_link_name);
      setSourceNameTextArray(data.source_text_name);
      setSourceNameTextAuthorArray(data.source_text_author);
    }
  };

  useEffect(() => {
    getSources();
  }, [profileData]);

  useEffect(() => {
    if (profileData) {
      setValue(profileData.profile_text);
    }
  }, [profileData]);

  useEffect(() => {
    // Fetch base person name
    const getBasePersonName = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch("https://cleirigh-backend.vercel.app/api/get-base-person", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        setBasePersonFirstName(data.firstName);
      } catch (err) {
        console.error("Error fetching base person name:", err);
      }
    };

    getBasePersonName();
  }, []);

  useEffect(() => {
    if (!profileData) return;

    // Fetch parents
    const getParents = async () => {
      const userId = localStorage.getItem("userId");
      const father = profileData.father_id;
      const mother = profileData.mother_id;
      const response = await fetch("https://cleirigh-backend.vercel.app/api/get-parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, father, mother }),
      });
      const data = await response.json();
      setFatherName(data.father);
      setMotherName(data.mother);
      setFatherId(data.fatherId);
      setMotherId(data.motherId);

      if (data.fatherId && data.motherId) {
        setParents(
          <>
            <a href={data.fatherId}>{data.father}</a> <span>and</span>{" "}
            <a href={data.motherId}>{data.mother}</a>
          </>
        );
      } else if (data.fatherId) {
        setParents(
          <>
            <a href={data.fatherId}>{data.father}</a>
          </>
        );
      } else if (data.motherId) {
        setParents(
          <>
            <a href={data.motherId}>{data.mother}</a>
          </>
        );
      } else {
        setParents("Unknown");
      }
    };

    getParents();
  }, [profileData]);

  useEffect(() => {
    if (!profileData) return;

    // Fetch child data
    const getChild = async () => {
      const userId = localStorage.getItem("userId");
      const sex = profileData.sex;
      const response = await fetch("https://cleirigh-backend.vercel.app/api/get-child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, id, sex }),
      });
      const data = await response.json();
      setChildName(data.childName);
      setChildId(data.childId);
      setSpouseName(data.spouseName);
      setSpouseId(data.spouseId);

      let childLinks = [];
      if (data.childId) {
        for (let i = 0; i < data.childId.length; i++) {
          childLinks.push(<a href={data.childId[i]}>{data.childName[i]}</a>);
        }
        setChild(childLinks);
      }
      if (data.spouseId) {
        setSpouse(<a href={data.spouseId}>{data.spouseName}</a>);
      }
    };

    getChild();
  }, [profileData]);

  const AncestryAmount = () => {
    let ancestryAmount = 0;
    for (let i = 0; i < profileData.relation_to_user.length; i++) {
      let inputNum = Number(profileData.relation_to_user[i] - 2) + 3;
      let hundred = 200;
      for (let i = 0; i < inputNum; i++) {
        hundred = hundred / 2;
      }
      if (hundred < 0.0000014901161193847656) {
        ancestryAmount += Number(hundred.toFixed(20));
      } else {
        ancestryAmount += hundred;
      }
    }

    if (ancestryAmount < 0.0000014901161193847656) {
      setAncestryPercent(ancestryAmount.toFixed(20));
    } else {
      setAncestryPercent(ancestryAmount);
    }

    //calculated what equivalent non-repeating relationship this ancestor would be
    let reverseAmount = ancestryPercent;
    let counter = 0;
    while (reverseAmount < 100) {
      reverseAmount *= 2;
      counter++;
    }

    if (profileData.relation_to_user.length > 1) {
      return (
        <p>
          {profileData.first_name} is responsible for {ancestryPercent}% of{" "}
          {basePersonFirstName}'s ancestry. If {profileData.first_name} was not
          a repeat ancestor, then this amount would make{" "}
          {profileData.sex === "male" ? "him" : "her"} equivalent to a{" "}
          {convertNumToRelation(counter, profileData.sex)}
        </p>
      );
    } else {
      return (
        <p>
          {profileData.first_name} is responsible for {ancestryPercent}% of{" "}
          {basePersonFirstName}'s ancestry.
        </p>
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleEdit = () => {
    setisEditing(true);
  };

  const handleSaveText = async () => {
    setisEditing(false);
    const userId = localStorage.getItem("userId");
    const response = await fetch("https://cleirigh-backend.vercel.app/api/save-profile-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, id, value }),
    });
  };

  const handleCancelText = async () => {
    setisEditing(false);
    setValue(value);
  };

  const openAddSource = () => {
    setSourceModalOpen(true);
  };

  const closeAddSource = () => {
    setSourceModalOpen(false);
  };

  const editTextSourceOpenModal = () => {
    setEditTextSourceOpen(true);
  };

  const closeEditTextSource = () => {
    setShowEditTextSourceModal(false);
  };

  const SaveSource = () => {
    const save = async () => {
      const userId = localStorage.getItem("userId");
      const response = await fetch("https://cleirigh-backend.vercel.app/api/save-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sourceNameLink,
          sourceLink,
          sourceNameText,
          sourceNameTextAuthor,
          profileData,
        }),
      });
      const data = response.json();
    };
    save();
    closeAddSource();
    getSources();
    // window.location.reload();
  };

  const SaveEditTextSource = (
    source,
    sourceAuthor,
    previousSource,
    previousSourceAuthor
  ) => {
    const save = async () => {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        "https://cleirigh-backend.vercel.app/api/save-edit-text-source",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            source,
            sourceAuthor,
            previousSource,
            previousSourceAuthor,
            profileData,
          }),
        }
      );
      const data = response.json();
    };
    save();
    closeAddSource();
    getSources();
    // window.location.reload();
  };

  const handleSourceType = (event) => {
    setSourceType(event.target.value);
  };

  const deleteSource = async (source, sourceName, type) => {
    const userId = localStorage.getItem("userId");
    const deleteSource = await fetch("https://cleirigh-backend.vercel.app/api/delete-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        profileData,
        source,
        sourceName,
        type,
      }),
    });
    const data = deleteSource.json();
  };

  const handleViewInTreee = async () => {
    //finds what page the ancestor is on
    const userId = localStorage.getItem("userId");
    const getPageNum = await fetch("https://cleirigh-backend.vercel.app/api/find-page-number", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, id }),
    });
    const num = await getPageNum.json();

    //sets current page to ancestor's page
    const setPageNum = await fetch(
      "https://cleirigh-backend.vercel.app/api/set-current-page-number",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, num }),
      }
    );
    const pageNumRecieved = await setPageNum.json();

    if (pageNumRecieved) {
      //redirect to tree
      window.location.href = "/familytree";
    }
  };

  const ListChildren = () => {
    const childList = child.reduce((acc, item, index, array) => {
      if (child.length > 1) {
        if (index === array.length - 1) {
          // For the last item, add " and " before it.
          acc.push(" and ", item);
        } else {
          // For all other items, add the item and ", ".
          if (child.length > 2) {
            acc.push(item, ", ");
          } else {
            acc.push(item);
          }
        }
      } else {
        acc.push(item);
      }

      return acc;
    }, []);

    if (profileData.sex === "male") {
      return <p>Father of {childList}</p>;
    } else {
      return <p>Mother of {childList}</p>;
    }
  };

  const CalculateRelation = () => {
    const relationArray = profileData.relation_to_user.map((relation) =>
      convertNumToRelation(relation, profileData.sex)
    );

    if (profileData.relation_to_user.length > 1) {
      return (
        <>
          <p>
            Repeat ancestor! {profileData.first_name} appears as a direct
            ancestor in your tree {relationArray.length} times.
          </p>
          <ul>
            {relationArray.map((relation, index) => (
              <li key={index}>{relation}</li>
            ))}
          </ul>
        </>
      );
    } else {
      return (
        <>
          <ul>
            {relationArray.map((relation, index) => (
              <li key={index}>{relation}</li>
            ))}
          </ul>
        </>
      );
    }
  };

  const handleEditInfo = () => {
    setisEditingInfo(true);
  };

  const handlSaveInfo = async () => {
    setisEditingInfo(false);
    const userId = localStorage.getItem("userId");
    const response = await fetch("https://cleirigh-backend.vercel.app/api/save-profile-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, profileData }),
    });
  };

  const handleProfilePicChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmitProfilePic = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", file);

    try {
      //upload image to server
      const response = await axios.post(
        "https://cleirigh-backend.vercel.app/api/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileName = response.data.fileName;

      //save image link to database
      const userId = localStorage.getItem("userId");
      const saveImage = await fetch("https://cleirigh-backend.vercel.app/api/save-image-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, profileData, fileName }),
      });

      //set profile picture
      const setProfilePic = await fetch(
        "https://cleirigh-backend.vercel.app/api/set-profile-picture",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, profileData, fileName }),
        }
      );

      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed");
    }
  };

  const EditTextSourceModal = (
    sourceNameTextArray,
    sourceNameTextAuthorArray,
    setSourceNameTextArray,
    setSourceNameTextAuthorArray,
    index
  ) => {
    const previousSource = useRef(sourceNameTextArray[index]);
    const previousSourceAuthor = useRef(sourceNameTextAuthorArray[index]);

    return (
      <>
        {/* edit text source */}
        <Modal
          show={editTextSourceOpenModal}
          onHide={closeEditTextSource}
          dialogclassName="custom-modal-width"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Source</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <label>Text Name</label>

                <input
                  type="text"
                  value={sourceNameTextArray[index]}
                  onChange={(event) => {
                    const updatedArray = [...sourceNameTextArray];
                    updatedArray[index] = event.target.value;
                    setSourceNameTextArray(updatedArray);
                  }}
                  style={{ marginLeft: "40px" }}
                ></input>

                <div>
                  <label style={{ marginRight: "67px" }}>Author</label>
                  <input
                    type="text"
                    value={sourceNameTextAuthorArray[index]}
                    onChange={(event) => {
                      const updatedArray = [...sourceNameTextAuthorArray];
                      updatedArray[index] = event.target.value;
                      setSourceNameTextAuthorArray(updatedArray);
                    }}
                  ></input>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="modal-footer-buttons">
              <div className="non-delete-buttons">
                <Button variant="secondary" onClick={closeEditTextSource}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    SaveEditTextSource(
                      sourceNameTextArray[index],
                      sourceNameTextAuthorArray[index],
                      previousSource,
                      previousSourceAuthor
                    )
                  }
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const GetAllTopics = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch("https://cleirigh-backend.vercel.app/api/get-all-topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId}),
    });
    const data = response.json();
    setTopicNames(data.topicNames);
    setTopicLinks(data.topicLinks);
  }
  useEffect(() => {
    GetAllTopics();
  }, [])

  return (
    <div className="profile">
      <Modal
        show={sourceModalOpen}
        onHide={closeAddSource}
        dialogclassName="custom-modal-width"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Source</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "300px" }}>
              <label style={{ marginRight: "30px" }}>Source Type</label>
              <select onChange={handleSourceType}>
                <option>--Select Type--</option>
                <option value="link">Link</option>
                <option value="image">Image</option>
                <option value="text">Text</option>
              </select>
            </div>

            <div>
              <label>Source Name</label>
              {sourceType === "link" ? (
                <>
                  <input
                    type="text"
                    onChange={(event) => setSourceNameLink(event.target.value)}
                    style={{ marginLeft: "20px" }}
                  ></input>

                  <div>
                    <label style={{ marginRight: "90px" }}>link</label>
                    <input
                      type="text"
                      onChange={(event) => setSourceLink(event.target.value)}
                    ></input>
                  </div>
                </>
              ) : (
                <></>
              )}

              {sourceType === "text" ? (
                <>
                  <input
                    type="text"
                    onChange={(event) => setSourceNameText(event.target.value)}
                    style={{ marginLeft: "20px" }}
                  ></input>

                  <div>
                    <label style={{ marginRight: "67px" }}>Author</label>
                    <input
                      type="text"
                      onChange={(event) =>
                        setSourceNameTextAuthor(event.target.value)
                      }
                    ></input>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-footer-buttons">
            <div className="non-delete-buttons">
              <Button variant="secondary" onClick={closeAddSource}>
                Cancel
              </Button>
              <Button variant="primary" onClick={SaveSource}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
          show={editTextSourceOpenModal}
          onHide={closeEditTextSource}
          dialogclassName="custom-modal-width"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Topic</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <select>

            </select>
            
          </Modal.Body>
          <Modal.Footer>
            <div className="modal-footer-buttons">
              <div className="non-delete-buttons">
                <Button variant="secondary" onClick={closeEditTextSource}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => SaveAddNewSource()}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>

      <div className="top-section">
        <div className="profile-photo-div">
          {profileData.profile_pic ? (
            <>
              <img
                className="profilePic"
                src={profileData.profile_pic}
                style={{
                  width: "400px",
                  maxHeight: "500px",
                  borderRadius: "10px",
                  zIndex: "800",
                }}
              ></img>
              {isEditingInfo ? (
                <input
                  placeholder="Profile Pic Caption"
                  value={profileData.profile_pic_caption}
                  style={{
                    zIndex: "2000",
                  }}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      profile_pic_caption: e.target.value,
                    }))
                  }
                ></input>
              ) : (
                <>
                  {profileData.profile_pic_caption ? (
                    <p className="profilePicCaption">
                      {profileData.profile_pic_caption}
                    </p>
                  ) : (
                    <></>
                  )}
                </>
              )}

              <div className="profilePicOverlay"></div>
            </>
          ) : (
            <div>
              <form
                onSubmit={handleSubmitProfilePic}
                style={{
                  display: "flex",
                  alignContent: "center",
                  flexDirection: "column",
                }}
              >
                <input
                  type="file"
                  onChange={(e) => handleProfilePicChange(e)}
                  accept="image/*"
                />
                <button type="submit">Upload image</button>
              </form>
            </div>
          )}
        </div>

        <div className="fact-section" style={{ marginRight: "40px" }}>
          <h1>
            {isEditingInfo ? (
              <input
                placeholder="First Name"
                value={profileData.first_name}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    first_name: e.target.value,
                  }))
                }
              ></input>
            ) : (
              <>
                {profileData.first_name}
                {profileData.uncertain_first_name ? (
                  <sup> uncertain</sup>
                ) : (
                  <></>
                )}
              </>
            )}{" "}
            {isEditingInfo ? (
              <input
                placeholder="Middle Name"
                value={profileData.middle_name}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    middle_name: e.target.value,
                  }))
                }
              ></input>
            ) : (
              <>
                {profileData.middle_name}
                {profileData.uncertain_middle_name ? (
                  <sup> uncertain</sup>
                ) : (
                  <></>
                )}
              </>
            )}{" "}
            {isEditingInfo ? (
              <input
                placeholder="Last Name"
                value={profileData.last_name}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    last_name: e.target.value,
                  }))
                }
              ></input>
            ) : (
              <>
                {profileData.last_name}
                {profileData.uncertain_last_name ? (
                  <sup> uncertain</sup>
                ) : (
                  <></>
                )}
              </>
            )}
          </h1>

          <CalculateRelation />

          <AncestryAmount />

          <div className="other-facts">
            <table>
              <tr>
                <td className="profile-table-label">Born </td>
                {isEditingInfo ? (
                  <>
                    <input
                      placeholder="Date of Birth"
                      value={profileData.date_of_birth}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          date_of_birth: e.target.value,
                        }))
                      }
                    ></input>
                    <input
                      placeholder="Place of Birth"
                      value={profileData.place_of_birth}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          place_of_birth: e.target.value,
                        }))
                      }
                    ></input>
                  </>
                ) : (
                  <td>
                    {profileData.date_of_birth}
                    {profileData.uncertain_birth_date ? (
                      <sup> uncertain</sup>
                    ) : (
                      <></>
                    )}{" "}
                    {profileData.place_of_birth}
                    {profileData.uncertain_birth_place ? (
                      <sup> uncertain</sup>
                    ) : (
                      <></>
                    )}{" "}
                    {profileData.cause_of_birth ? (
                      <span>due to {profileData.cause_of_birth}</span>
                    ) : (
                      <></>
                    )}{" "}
                  </td>
                )}
              </tr>

              <tr>
                <td className="profile-table-label">Married </td>
                {isEditingInfo ? (
                  <>
                    <input
                      placeholder="Date of Marriage"
                      value={profileData.marriage_date}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          marriage_date: e.target.value,
                        }))
                      }
                    ></input>
                    <input
                      placeholder="Place of Marriage"
                      value={profileData.marriage_place}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          marriage_place: e.target.value,
                        }))
                      }
                    ></input>
                  </>
                ) : (
                  <>
                    {profileData.marriage_date ? (
                      <td>
                        {profileData.marriage_date}
                        {profileData.uncertain_marriage_date ? (
                          <sup> uncertain</sup>
                        ) : (
                          <></>
                        )}{" "}
                        {profileData.marriage_place}
                        {profileData.uncertain_marriage_place ? (
                          <sup> uncertain</sup>
                        ) : (
                          <></>
                        )}{" "}
                        to {spouseName}
                      </td>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </tr>

              <tr>
                <td className="profile-table-label">Died </td>
                {isEditingInfo ? (
                  <>
                    <input
                      placeholder="Date of Death"
                      value={profileData.date_of_death}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          date_of_death: e.target.value,
                        }))
                      }
                    ></input>
                    <input
                      placeholder="Place of Death"
                      value={profileData.place_of_death}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          place_of_death: e.target.value,
                        }))
                      }
                    ></input>
                    <input
                      placeholder="Cause of Death"
                      value={profileData.cause_of_death}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          cause_of_death: e.target.value,
                        }))
                      }
                    ></input>
                  </>
                ) : (
                  <td>
                    {profileData.date_of_death}
                    {profileData.uncertain_death_date ? (
                      <sup> uncertain</sup>
                    ) : (
                      <></>
                    )}{" "}
                    {profileData.place_of_death}
                    {profileData.uncertain_death_place ? (
                      <sup> uncertain</sup>
                    ) : (
                      <></>
                    )}{" "}
                    {profileData.cause_of_death ? (
                      <span>due to {profileData.cause_of_death}</span>
                    ) : (
                      <></>
                    )}{" "}
                  </td>
                )}
              </tr>

              <tr>
                <td className="profile-table-label">Occupation </td>
                {isEditingInfo ? (
                  <input
                    placeholder="Occupation"
                    value={profileData.occupation}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        occupation: e.target.value,
                      }))
                    }
                  ></input>
                ) : (
                  <>
                    {profileData.occupation ? (
                      <td>
                        {profileData.occupation}
                        {profileData.uncertain_occupation ? (
                          <sup> uncertain</sup>
                        ) : (
                          <></>
                        )}
                      </td>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </tr>

              <tr>
                <td className="profile-table-label">Ethnicity </td>
                {isEditingInfo ? (
                  <input
                    placeholder="Ethnicity"
                    value={profileData.ethnicity}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        ethnicity: e.target.value,
                      }))
                    }
                  ></input>
                ) : (
                  <td>{profileData.ethnicity}</td>
                )}
              </tr>

              <tr>
                {profileData.sex === "male" ? (
                  <>
                    <td className="profile-table-label">
                      Paternal Haplogroup{" "}
                    </td>
                    {isEditingInfo ? (
                      <input
                        placeholder="Paternal Haplogroup"
                        value={profileData.paternal_haplogroup}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            paternal_haplogroup: e.target.value,
                          }))
                        }
                      ></input>
                    ) : (
                      <>
                        {profileData.paternal_haplogroup ? (
                          <td>{profileData.paternal_haplogroup}</td>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </tr>

              <tr>
                <td className="profile-table-label">Maternal Haplogroup </td>
                {isEditingInfo ? (
                  <input
                    placeholder="Maternal Haplogroup"
                    value={profileData.maternal_haplogroup}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        maternal_haplogroup: e.target.value,
                      }))
                    }
                  ></input>
                ) : (
                  <>
                    {profileData.maternal_haplogroup ? (
                      <td>{profileData.maternal_haplogroup}</td>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </tr>
              <tr>
                <td className="profile-table-label">Profile Number </td>
                <td>{profileData.ancestor_id}</td>
              </tr>
              <tr>
                <td className="profile-table-label">
                  Alternative Names/Spellings{" "}
                </td>
                {isEditingInfo ? (
                  <input
                    value={profileData.alternative_names}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        alternative_names: e.target.value,
                      }))
                    }
                  ></input>
                ) : (
                  <td>{profileData.alternative_names}</td>
                )}
              </tr>
            </table>
          </div>

          {isEditingInfo ? (
            <button style={{ marginTop: "10px" }} onClick={handlSaveInfo}>
              Save Changes
            </button>
          ) : (
            <button style={{ marginTop: "10px" }} onClick={handleEditInfo}>
              Edit Information
            </button>
          )}

          <button style={{ marginTop: "10px" }} onClick={handleViewInTreee}>
            View in Tree
          </button>
        </div>
      </div>

      <div className="family-section">
        <h1>Family</h1>

        {profileData.sex === "male" ? (
          <>
            <p>Son of {parents}</p>
            {spouse ? <p>Husband of {spouse}</p> : <></>}
            {child ? <ListChildren /> : <></>}
          </>
        ) : (
          <>
            <p>Daughter of {parents}</p>
            {spouse ? <p>Wife of {spouse}</p> : <></>}
            {child ? <ListChildren /> : <></>}
          </>
        )}

        {/*descendancy chart here*/}
      </div>

      <div className="ethnic-breakdown">
        <EthnicBreakdown />
      </div>

      <div className="tag-section">
        <hr></hr>
        <h1>Tags</h1>
        <p className="span-link" onClick={() => setShowAddTagModal(true)}>
          Add a tag
        </p>

        <p>{profileData.first_name} is associated with the following topics:</p>
        <ol>
          {topicNames.map((topic, index) => (
              <li className="span-link" onClick={() => handleOpenTopic(topicLinks[index])}>{topicNames[index]}</li>
          ))}
        </ol>
        

      </div>

      <div className="timeline-section">
        <hr></hr>
        <h1>Timeline</h1>
      </div>

      <div className="article-section">
        <hr></hr>
        <p className="span-link" onClick={handleEdit}>
          Edit
        </p>
        {isEditing ? (
          <div>
            <ReactQuill
              theme="snow"
              value={value}
              style={{ height: "300px" }}
              onChange={setValue}
            />
            <button style={{ marginTop: "60px" }} onClick={handleCancelText}>
              Cancel
            </button>
            <button style={{ marginTop: "60px" }} onClick={handleSaveText}>
              Save Text
            </button>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: value }} />
        )}
      </div>

      <div className="source-section">
        <hr></hr>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <h3>Sources</h3>

          {editSources ? (
            <>
              <p
                className="span-link"
                style={{ marginLeft: "10px", fontSize: "13px" }}
                onClick={openAddSource}
              >
                Add Source
              </p>

              <p
                className="span-link"
                style={{ marginLeft: "10px", fontSize: "13px" }}
                onClick={() => setEditSources(false)}
              >
                Save
              </p>
            </>
          ) : (
            <p
              className="span-link"
              style={{ marginLeft: "10px", fontSize: "13px" }}
              onClick={() => setEditSources(true)}
            >
              Edit Sources
            </p>
          )}
        </div>

        <ul className="source-ul">
          {sourceLinkArray.length > 0 ? (
            <>
              {sourceLinkArray.map((source, index) => (
                <li key={index}>
                  {editSources ? (
                    <>
                      <button
                        onClick={() => {
                          deleteSource(
                            sourceLinkArray[index],
                            sourceNameLinkArray[index],
                            "link"
                          );
                          const updatedSourceLinkArray = sourceLinkArray.filter(
                            (_, i) => i !== index
                          );
                          setSourceLinkArray(updatedSourceLinkArray);

                          const updatedSourceNameLinkArray =
                            sourceNameLinkArray.filter((_, i) => i !== index);
                          setSourceNameLinkArray(updatedSourceNameLinkArray);
                        }}
                      >
                        Delete
                      </button>
                      <button style={{ marginRight: "5px" }}>Edit</button>
                    </>
                  ) : (
                    <></>
                  )}
                  <a href={sourceLinkArray[index]} target="_blank">
                    {sourceNameLinkArray[index]}
                  </a>
                </li>
              ))}
            </>
          ) : (
            <></>
          )}
        </ul>

        <ul className="source-ul">
          {sourceNameTextArray.length > 0 ? (
            <>
              {sourceNameTextArray.map((source, index) => (
                <li key={index}>
                  {editSources ? (
                    <>
                      <button
                        onClick={() => {
                          deleteSource(
                            sourceNameTextArray[index],
                            sourceNameTextAuthorArray[index],
                            "text"
                          );
                          const updatedsourceNameTextArray =
                            sourceNameTextArray.filter((_, i) => i !== index);
                          setSourceNameTextArray(updatedsourceNameTextArray);

                          const updatedsourceNameTextAuthorArray =
                            sourceNameTextAuthorArray.filter(
                              (_, i) => i !== index
                            );
                          setSourceNameTextAuthorArray(
                            updatedsourceNameTextAuthorArray
                          );
                        }}
                      >
                        Delete
                      </button>
                      <button
                        style={{ marginRight: "5px" }}
                        onClick={() => {
                          setShowEditTextSourceModal(true);
                        }}
                      >
                        Edit
                      </button>

                      {showEditTextSourceModal ? (
                        EditTextSourceModal(
                          sourceNameTextArray,
                          sourceNameTextAuthorArray,
                          setSourceNameTextArray,
                          setSourceNameTextAuthorArray,
                          index
                        )
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  {sourceNameTextAuthorArray[index]},{" "}
                  <i>{sourceNameTextArray[index]}</i>
                </li>
              ))}
            </>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
