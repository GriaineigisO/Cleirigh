import { useState, useEffect, useCallback } from "react";
import { capitaliseFirstLetter, convertNumToRelation } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";
import LeftSidebar from "../Components/leftSidebar.js";
import { Modal, Button } from "react-bootstrap";

const Topics = () => {
  const [topicNames, setTopicNames] = useState([]);
  const [topicLinks, setTopicLinks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState();

  const getAllTopics = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      "https://cleirigh-backend.vercel.app/api/get-all-topics",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );
    const data = await response.json();
    setTopicNames(data.topicNames);
    setTopicLinks(data.topicLinks);
  };

  useEffect(() => {
    getAllTopics();
  }, []);

  const handleCreateNewTopic = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      "https://cleirigh-backend.vercel.app/api/create-new-topic",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newTopicName }),
      }
    );
    const data = await response.json();
    setIsOpen(false);
    window.location.reload();
  };

  const handleOpenTopic = async (topicLink) => {
    window.location.href = `topic/${topicLink}`;
  };

  const createTopicOpen = async () => {
    setIsOpen(true);
  }

  const closeCreateTopic = async () => {
    setIsOpen(false);
  }

  return (
    <div className="row">
      <LeftSidebar />

      <div className="col-lg centre-col">
        <Modal
          show={isOpen}
          onHide={closeCreateTopic}
          dialogclassName="custom-modal-width"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Topic</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
                <label style={{marginRight:"5px"}}>Topic Name</label>
                <input onChange={(e) => setNewTopicName(e.target.value)}></input>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="modal-footer-buttons">
              <div className="non-delete-buttons">
                <Button variant="secondary" onClick={closeCreateTopic}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreateNewTopic}>
                  Create New Topic
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>

        <h1>Topics</h1>

        <button onClick={createTopicOpen}>Create New Topic</button>

        <div>
          {topicNames.map((topic, index) => (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <h5><Link to={`topic${topicLinks[index]}`}>{topicNames[index]}</Link></h5>
              {/* <button onClick={() => handleOpenTopic(topicLinks[index])}>
                Open
              </button> */}
              <button>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topics;
