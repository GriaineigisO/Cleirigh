import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { capitaliseFirstLetter, convertNumToRelation } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import { Modal, Button } from "react-bootstrap";
import warningLogo from "../Images/warning.png";
import MyEditor from "../Components/quillEditor.js";

const Topic = () => {
  const { topic } = useParams();
  const [topicData, setTopicData] = useState();
  const [isEditing, setisEditing] = useState(false);
  const [value, setValue] = useState("");
  const [topicName, setTopicName] = useState("");
  const [showDeletePop, setShowDeletePop] = useState(false);
  const [taggedAncestorsArray, setTaggedAncestorsArray] = useState([]);
  const [taggedAncestorsNamesArray, setTaggedAncestorsNamesArray] = useState(
    []
  );

  useEffect(() => {
    const getTopicData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          "https://cleirigh-backend.vercel.app/api/get-topic",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, topic }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch topic data");
        }

        const data = await response.json();
        setTopicData(data[0]);
      } catch (err) {
        console.error("Error fetching topic data:", err);
      }
    };

    getTopicData();
  }, []);

  useEffect(() => {
    if (topicData) {
      setValue(topicData.topic_text);
    }
  }, [topicData]);

  const handleEdit = () => {
    setisEditing(true);
  };

  const handleCancelText = async () => {
    setisEditing(false);
    setValue(value);
  };

  const handlSaveInfo = async () => {
    setisEditing(false);
    handleSaveText();
    handeSaveTopicName();
  };

  const closeDeletePopup = () => setShowDeletePop(false);
  const openDeletePopup = () => setShowDeletePop(true);

  const handleDelete = async () => {
    const userId = localStorage.getItem("userId");
    const topicId = topicData.id;
    const response = await fetch(
      "https://cleirigh-backend.vercel.app/api/delete-topic",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, topicId }),
      }
    );
    const data = response.json();
    closeDeletePopup();
    window.location.href = "/topics";
  };

  const handleSaveText = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      "https://cleirigh-backend.vercel.app/api/save-topic-text",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, topic, value }),
      }
    );
  };

  const handeSaveTopicName = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      "https://cleirigh-backend.vercel.app/api/save-topic-name",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          topic,
          topic_name: topicData.topic_name,
        }),
      }
    );
  };

  const getTaggedAncestors = async () => {
    const userId = localStorage.getItem("userId");
    const topicId = topicData.id;
    const response = await fetch(
      "https://cleirigh-backend.vercel.app/api/get-tagged-ancestors",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          topicId,
        }),
      }
    );
    const data = await response.json();
    console.error(`data.taggedAncestors: ${data.taggedAncestors}`);
    setTaggedAncestorsArray(data.taggedAncestors);
    setTaggedAncestorsNamesArray(data.taggedAncestorsNames);
  };

  useEffect(() => {
    if (topicData) {
      getTaggedAncestors();
    }
  }, [topicData]);

  return (
    <div>
      {topicData ? (
        <>
          <Modal
            show={showDeletePop}
            onHide={closeDeletePopup}
            dialogclassName="custom-modal-width"
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>Delete {topicData.topic_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  <div
                    className="warning-message"
                    style={{ marginBottom: "20px" }}
                  >
                    <div className="warning-logo-header">
                      <img className="warning-logo" src={warningLogo}></img>
                      <h5>Warning</h5>
                    </div>

                    <p>
                      Deleting {topicData.topic_name} is not a reversible
                      action. Do you wish to continue?
                    </p>
                  </div>
                </div>
              </div>

              <button onClick={closeDeletePopup}>Cancel</button>

              <button onClick={handleDelete}>Delete</button>
            </Modal.Body>
          </Modal>

          <div style={{ marginLeft: "50px", marginRight: "50px" }}>
            <div style={{ textAlign: "center" }}>
              {isEditing ? (
                <input
                  value={topicData.topic_name}
                  onChange={(e) =>
                    setTopicData((prev) => ({
                      ...prev,
                      topic_name: e.target.value,
                    }))
                  }
                ></input>
              ) : (
                <h1>{topicData.topic_name}</h1>
              )}
            </div>

            <div className="article-section">
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="span-link" onClick={handleEdit}>
                  Edit
                </p>
                {isEditing ? (
                  <p
                    style={{ marginLeft: "10px" }}
                    className="span-link"
                    onClick={openDeletePopup}
                  >
                    Delete Topic
                  </p>
                ) : (
                  <></>
                )}
              </div>

              {isEditing ? (
                <div>
                  <MyEditor
                    value={value}
                    onChange={setValue}
                    style={{ height: "500px" }}
                  />

                  <button
                    style={{ marginTop: "60px" }}
                    onClick={handleCancelText}
                  >
                    Cancel
                  </button>
                  <button style={{ marginTop: "60px" }} onClick={handlSaveInfo}>
                    Save Text
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <p>Ancestors associated with this topic: </p>
                    {console.error(taggedAncestorsArray)}
                    <ul>
                      {taggedAncestorsArray.map((array, index) => (
                        <li>
                          <a
                            href={`https://cleirighgenealogy.com/profile/${taggedAncestorsArray[index]}`}
                            target="_blank"
                          >
                            {taggedAncestorsNamesArray[index]} (
                            {taggedAncestorsArray[index]})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="content-display" dangerouslySetInnerHTML={{ __html: value }} />
                </>
              )}
            </div>
          </div>
          <></>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Topic;
