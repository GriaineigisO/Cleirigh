import { useState, useEffect, useCallback } from "react";
import { capitaliseFirstLetter, convertNumToRelation } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";
import LeftSidebar from "../Components/leftSidebar.js";

const Topics = () => {
  const [topics, setTopics] = useState([]);

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
    setTopics((prev) => ([...prev, data.topic_name]));
    console.log(topics)
  };

  useEffect(() => {
    getAllTopics();
  }, []);

  return (
    <div className="row">
      <LeftSidebar />

      <div className="col-lg centre-col">
        <h1>Topics</h1>

        <button>Create New Topic</button>

        <div>
          {topics.map((topic, index) => (
            <div>
              <p>topics[index]</p>
              <button>Open</button>
              <button>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topics;
