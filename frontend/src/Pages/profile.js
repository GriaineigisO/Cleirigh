import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import testPhoto from "../Images/James Ó Donnell.jpg";
import { convertNumToRelation } from "../library";
import { propTypes } from "react-bootstrap/esm/Image";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const Profile = () => {
  const [isEditingInfo, setisEditingInfo] = useState(false);
  const [profilePicCaption, setProfilePicCaption] = useState();
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
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
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

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          "http://localhost:5000/ancestor-profiles",
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

  const getSources = async () => {
    if (profileData) {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:5000/get-sources", {
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

  const openLink = (id) => {
    window.location.href = `${id}`;
  };

  useEffect(() => {
    // Fetch base person name
    const getBasePersonName = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch("http://localhost:5000/get-base-person", {
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
      const response = await fetch("http://localhost:5000/get-parents", {
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
      const response = await fetch("http://localhost:5000/get-child", {
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
    const response = await fetch("http://localhost:5000/save-profile-text", {
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

  const SaveSource = () => {
    const save = async () => {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:5000/save-source", {
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
    };
    save();
    closeAddSource();
    getSources();
  };

  const handleSourceType = (event) => {
    setSourceType(event.target.value);
  };

  const handleViewInTreee = async () => {
    //finds what page the ancestor is on
    const userId = localStorage.getItem("userId");
    const getPageNum = await fetch("http://localhost:5000/find-page-number", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, id }),
    });
    const num = await getPageNum.json();

    //sets current page to ancestor's page
    const setPageNum = await fetch(
      "http://localhost:5000/set-current-page-number",
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
    const response = await fetch("http://localhost:5000/save-profile-info", {
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
        "http://localhost:5000/upload-image",
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
      const saveImage = await fetch("http://localhost:5000/save-image-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, profileData, fileName }),
      });

      //set profile picture
      const setProfilePic = await fetch(
        "http://localhost:5000/set-profile-picture",
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
              <label>Source Type</label>
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
                  ></input>

                  <div>
                    <label>link</label>
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
                  ></input>

                  <div>
                    <label>Author</label>
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
                  value={profileData.profile_pic_caption}
                  style={{
                    zIndex:"2000"
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
                      value={profileData.date_of_birth}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          date_of_birth: e.target.value,
                        }))
                      }
                    ></input>
                    <input
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
                      value={profileData.marriage_date}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          marriage_date: e.target.value,
                        }))
                      }
                    ></input>
                    <input
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
                      value={profileData.date_of_death}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          date_of_death: e.target.value,
                        }))
                      }
                    ></input>
                    <input
                      value={profileData.place_of_death}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          place_of_death: e.target.value,
                        }))
                      }
                    ></input>
                    <input
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

              {profileData.ethnicity ? (
                <tr>
                  <td className="profile-table-label">Ethnicity </td>
                  {isEditingInfo ? (
                    <input
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
              ) : (
                <></>
              )}

              <tr>
                {profileData.sex === "male" ? (
                  <>
                    <td className="profile-table-label">
                      Paternal Haplogroup{" "}
                    </td>
                    {isEditingInfo ? (
                      <input
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

          <p
            className="span-link"
            style={{ marginLeft: "10px", fontSize: "13px" }}
            onClick={openAddSource}
          >
            Add Source
          </p>
        </div>

        <ul className="source-ul">
          {sourceLinkArray.length > 0 ? (
            <>
              {sourceLinkArray.map((source, index) => (
                <li key={index}>
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
