import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { capitaliseFirstLetter, convertDate, capitalise } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";
import LeftSidebar from "../Components/leftSidebar.js";

const Search = () => {
  const [firstName, setFirstName] = useState();
  const [middleName, setMiddleName] = useState();
  const [lastName, setLastName] = useState();
  const [birthDate, setBirthDate] = useState();
  const [birthPlace, setBirthPlace] = useState();
  const [deathDate, setDeathDate] = useState();
  const [deathPlace, setDeathPlace] = useState();
  const [ethnicity, setEthnicity] = useState();
  const [profileNum, setProfileNum] = useState();
  const [results, setResults] = useState([]);
  const [profileLinks, setProfileLinks] = useState([]);
  const [treeLinks, setTreeLinks] = useState([]);
  const [clickCount, setClickCount] = useState(0);

  const searchAncestors = async () => {
    setClickCount(clickCount + 1);
    const userId = localStorage.getItem("userId");
    const response = await fetch("https://cleirigh-backend.vercel.app/api/search-ancestors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        firstName,
        middleName,
        lastName,
        birthDate,
        birthPlace,
        deathDate,
        deathPlace,
        ethnicity,
        profileNum,
      }),
    });
    const data = await response.json();
    setResults(data);

    for (let i = 0; i < data.length; i++) {
      console.log(data[i].page_number)
      profileLinks[i] = `/profile/${data[i].ancestor_id}`;
      treeLinks[i] = `/familytree/${data[i].page_number}`;
    }
  };

  const changePageNum = async (num) => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      "https://cleirigh-backend.vercel.app/api/set-current-page-number",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, num }),
      }
    );
  };

  return (
    <div>
      <div className="row">
        <LeftSidebar />

        <div className="col">

          {results.length === 0 && clickCount > 0 ? (
            <h2 style={{ color: "rgb(123, 103, 103)", textAlign:"center", marginTop: "100px" }}>
              Your Search Gave No Results...
            </h2>
          ) : (
            <></>
          )}

          <div id="search">
            <input
              placeholder="First Name"
              onChange={(event) => setFirstName(event.target.value)}
            ></input>
            <input
              placeholder="Middle Name"
              onChange={(event) => setMiddleName(event.target.value)}
            ></input>
            <input
              placeholder="Last Name"
              onChange={(event) => setLastName(event.target.value)}
            ></input>
            <input
              placeholder="Birth Date"
              onChange={(event) => setBirthDate(event.target.value)}
            ></input>
            <input
              placeholder="Birth Place"
              onChange={(event) => setBirthPlace(event.target.value)}
            ></input>
            <input
              placeholder="Death Date"
              onChange={(event) => setDeathDate(event.target.value)}
            ></input>
            <input
              placeholder="Death Place"
              onChange={(event) => setDeathPlace(event.target.value)}
            ></input>
            <input
              placeholder="Ethnicity"
              onChange={(event) => setEthnicity(event.target.value)}
            ></input>
            <input
              placeholder="Profile Number"
              onChange={(event) => setProfileNum(event.target.value)}
            ></input>
            <button onClick={searchAncestors}>Search</button>
          </div>

          <div style={{ marginBottom: "80px" }}>
          <h4>{results.length} results</h4>
            {results.map((firstName, index) => (
              <table id="searchResults">
                <tr>
                  <td className="li-span search-label search-border-right search-border-bottom">
                    profile number
                  </td>
                  <td className="search-content search-border-right search-border-bottom search-name">
                    {results[index].ancestor_id}
                  </td>
                  <td className="li-span search-label search-border-right search-border-bottom">
                    sex
                  </td>
                  <td className="search-content search-border-bottom">
                    {capitalise(results[index].sex)}
                  </td>
                  <td className="search-content  search-border-bottom"></td>
                </tr>
                <tr>
                  <td className="li-span search-label search-border-right search-border-bottom">
                    name
                  </td>
                  <td className="search-name search-content search-border-right search-border-bottom">
                    {capitalise(results[index].first_name)}{" "}
                    {capitalise(results[index].middle_name)}{" "}
                    {capitalise(results[index].last_name)}
                  </td>
                  <td className="li-span search-label search-border-right search-border-bottom">
                    ethnicity
                  </td>
                  <td className="search-content search-border-right search-border-bottom">
                    {capitalise(results[index].ethnicity)}
                  </td>

                  <td className="search-content search-border-bottom button-cell">
                    <a
                      href={profileLinks[index]}
                      target="_blank"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      View Profile
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="li-span search-label search-border-right search-border-bottom">
                    birth
                  </td>
                  <td className="search-content search-border-right search-border-bottom">
                    {results[index].date_of_birth}
                  </td>
                  <td
                    className="search-place search-content search-border-right search-border-bottom"
                    colSpan="2"
                  >
                    {results[index].place_of_birth}
                  </td>
                  <td className="search-content search-border-bottom button-cell">
                    <a
                      href={treeLinks[index]}
                      onClick={() => changePageNum(results[index].page_number)}
                      target="_blank"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      View in Tree
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="li-span search-label search-border-right  search-border-bottom">
                    death
                  </td>
                  <td className="search-content search-border-right search-border-bottom">
                    {results[index].date_of_death}{" "}
                  </td>
                  <td
                    className="search-place search-content search-border-right search-border-bottom"
                    colSpan="2"
                  >
                    {results[index].place_of_death}
                  </td>
                  <td className="search-content"></td>
                </tr>
                <tr>
                  <td  className="li-span search-label search-border-right">
                    Occupation
                  </td>
                  <td className="search-content search-border-right" colSpan="4">
                  {results[index].occupation}{" "}
                  </td>
                </tr>
              </table>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
