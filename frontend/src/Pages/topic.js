import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { capitaliseFirstLetter, convertNumToRelation } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";

const Topic = () => {
  const { topic } = useParams();
  const [topicData, setTopicData] = useState();
  const [isEditing, setisEditing] = useState(false);
  const [value, setValue] = useState("");
  const [topicName, setTopicName] = useState("");

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
        setTopicData(data);
      } catch (err) {
        console.error("Error fetching topic data:", err);
      }
    };

    getTopicData();
  }, []);

  useEffect(() => {
    if (topicData) {
      setValue(topicData[0].topic_text);
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
    setTopicName(topicData[0].topic_name)
    console.log(topicName)
    const response = await fetch(
      "https://cleirigh-backend.vercel.app/api/save-topic-name",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, topic, topicName}),
      }
    );
  };

  return (
    <div>
      {topicData ? (
        <div style={{ marginLeft: "50px", marginRight: "50px" }}>
          <div style={{textAlign:"center"}}>
            {isEditing ? (
              <input value={topicData[0].topic_name}
              onChange={(e) =>
                setTopicData((prev) => ({
                  ...prev,
                  topic_name: e.target.value,
                }))
              }>
              </input>
            ) : (
              <h1 >{topicData[0].topic_name}</h1>
              )}
          
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
                  style={{ height: "500px" }}
                  onChange={setValue}
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
              <div dangerouslySetInnerHTML={{ __html: value }} />
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Topic;
