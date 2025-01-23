import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { capitaliseFirstLetter, convertNumToRelation } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";


const Topic = () => {
    const { topic } = useParams();
    const [topicData, setTopicData] = useState();

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
              throw new Error("Failed to fetch profile data");
            }
    
            const data = await response.json();
            setTopicData(data);
          } catch (err) {
            console.error("Error fetching profile data:", err);
            setError("Unable to fetch profile data. Please try again later.");
          } finally {
            setLoading(false);
          }
        };
    
        getTopicData();
      }, [topic]);

  return (
    <h1>{topicData.topic_name}</h1>
  );
};

export default Topic;
