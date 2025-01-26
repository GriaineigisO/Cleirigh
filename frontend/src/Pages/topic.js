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
        if (profileData) {
          setValue(profileData.profile_text);
        }
      }, [profileData]);

      const handleEdit = () => {
        setisEditing(true);
      };

      const handleCancelText = async () => {
        setisEditing(false);
        setValue(value);
      };

      const handleSaveText = async () => {
        setisEditing(false);
        const userId = localStorage.getItem("userId");
        const response = await fetch("https://cleirigh-backend.vercel.app/api/save-topic-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, topic, value }),
        });
      };


  return (
    <div>
    {topicData ? (
      <div>
        <h1>{topicData[0].topic_name}</h1>

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
          </div>
    ) : (<></>)}
    </div>
  );
};

export default Topic;
