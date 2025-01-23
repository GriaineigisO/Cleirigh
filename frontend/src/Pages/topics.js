import { useState, useEffect, useCallback } from "react";
import { capitaliseFirstLetter, convertNumToRelation } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";
import LeftSidebar from "../Components/leftSidebar.js";

const Topics = () => {
  return (
    <div className="row">
      <LeftSidebar />

      <div className="col-lg centre-col">

        <h1>Topics</h1>

      </div>
    </div>
  );
};

export default Topics;
