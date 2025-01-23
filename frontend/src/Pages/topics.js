import { useState, useEffect, useCallback } from "react";
import { capitaliseFirstLetter, convertNumToRelation } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";
import LeftSidebar from "../Components/leftSidebar.js";

const Topics = () => {
  const [topicNames, setTopicNames] = useState([]);
  const [topicLinks, setTopicLinks] = useState([]);

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

//   useEffect(() => {
//     console.log(topicNames)
//     console.log(topicLinks)
//   }, [topicNames]);

  const handleOpenTopic = async (topicLink) => {
    window.location.href = `topic/${topicLink}`;
  }

  return (
    <div className="row">
      <LeftSidebar />

      <div className="col-lg centre-col">
        <h1>Topics</h1>

        <button>Create New Topic</button>

        <div>
          {topicNames.map((topic, index) => (
            <div style={{display:"flex", flexDirection:"row"}}>
              <h5>{topicNames[index]}</h5>
              <button onClick={() => handleOpenTopic(topicLinks[index])}>Open</button>
              <button>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topics;
