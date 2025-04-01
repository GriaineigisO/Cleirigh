import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { capitaliseFirstLetter, convertDate, capitalise } from "../library.js";
import "../style.css";
import { Link } from "react-router-dom";
import LeftSidebar from "../Components/leftSidebar.js";
import Table from "react-bootstrap/Table";

const Search = () => {
  const [firstName, setFirstName] = useState();
  const [middleName, setMiddleName] = useState();
  const [lastName, setLastName] = useState();
  const [birthDate, setBirthDate] = useState();
  const [birthPlace, setBirthPlace] = useState();
  const [deathDate, setDeathDate] = useState();
  const [deathPlace, setDeathPlace] = useState();
  const [ethnicity, setEthnicity] = useState();
  const [occupation, setOccupation] = useState();
  const [profileNum, setProfileNum] = useState();
  const [results, setResults] = useState([]);
  const [profileLinks, setProfileLinks] = useState([]);
  const [treeLinks, setTreeLinks] = useState([]);
  const [clickCount, setClickCount] = useState(0);

  const searchAncestors = async () => {
    setClickCount(clickCount + 1);
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      "https://cleirigh-backend.vercel.app/api/search-ancestors",
      {
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
          occupation,
          profileNum,
        }),
      }
    );
    const data = await response.json();
    setResults(data);

    for (let i = 0; i < data.length; i++) {
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

  const openProfile = (profileLink) => {
    window.open(profileLink, "_blank");
  };

  const openTree = (treeLink) => {
    changePageNum(treeLink.page_number);
    window.open(treeLink, "_blank");
  };

  return (
    <div>
      <div className="row">
        <div className="col">
          {results.length === 0 && clickCount > 0 ? (
            <h2
              style={{
                color: "rgb(123, 103, 103)",
                textAlign: "center",
                marginTop: "100px",
              }}
            >
              Your Search Gave No Results...
            </h2>
          ) : (
            <></>
          )}

          <div id="search">
            <div class="search-input-and-dropdown">
              <input
                placeholder="First Name"
                onChange={(event) => setFirstName(event.target.value)}
              ></input>
              <select>
                <option>Exact Match</option>
                <option>Names That Begin With</option>
                <option>Includes</option>
                <option>Include Variants</option>
              </select>
            </div>

            <div class="search-input-and-dropdown">
              <input
                placeholder="Middle Name"
                onChange={(event) => setMiddleName(event.target.value)}
              ></input>
              <select>
                <option>Exact Match</option>
                <option>Names That Begin With</option>
                <option>Includes</option>
                <option>Include Variants</option>
              </select>
            </div>

            <div class="search-input-and-dropdown">
              <input
                placeholder="Last Name"
                onChange={(event) => setLastName(event.target.value)}
              ></input>
              <select>
                <option>Exact Match</option>
                <option>Names That Begin With</option>
                <option>Includes</option>
                <option>Include Variants</option>
              </select>
            </div>

            <div class="search-input-and-dropdown">
              <input
                placeholder="Birth Date"
                onChange={(event) => setBirthDate(event.target.value)}
              ></input>
              <select>
                <option>Exact Match</option>
              </select>
            </div>

            <div class="search-input-and-dropdown">
              <input
                placeholder="Birth Place"
                onChange={(event) => setBirthPlace(event.target.value)}
              ></input>
              <select>
                <option>Exact Match</option>
                <option>Names That Begin With</option>
              </select>
            </div>

            <div class="search-input-and-dropdown">
              <input
                placeholder="Death Date"
                onChange={(event) => setDeathDate(event.target.value)}
              ></input>
              <select>
                <option>Exact Match</option>
              </select>
            </div>

            <div class="search-input-and-dropdown">
              <input
                placeholder="Death Place"
                onChange={(event) => setDeathPlace(event.target.value)}
              ></input>
              <select>
                <option>Exact Match</option>
                <option>Begins With</option>
              </select>
            </div>

            <div class="search-input-and-dropdown">
              <input
                placeholder="Ethnicity"
                onChange={(event) => setEthnicity(event.target.value)}
              ></input>
              <select>
                <option>Exact Match</option>
                <option>Begins With</option>
              </select>
            </div>

            <div class="search-input-and-dropdown">
              <input
                placeholder="Occupation"
                onChange={(event) => setOccupation(event.target.value)}
              ></input>
              <select>
                <option>Exact Match</option>
                <option>Begins With</option>
              </select>
            </div>

            <div class="search-input-and-dropdown">
              <input
                placeholder="Profile Number"
                onChange={(event) => setProfileNum(event.target.value)}
              ></input>
            </div>

            <button onClick={searchAncestors}>Search</button>
          </div>

          <div style={{ marginBottom: "80px" }}>
            <h4>{results.length} results</h4>
            <Table className="table-hover table-responsive table-striped">
              <tbody>
                {results.map((firstName, index) => (
                  <tr>
                    <td>
                      <button onClick={() => openProfile(profileLinks[index])}>
                        Profile
                      </button>
                    </td>
                    <td>
                      <button onClick={() => openTree(treeLinks[index])}>
                        Tree
                      </button>
                    </td>
                    <td>{results[index].ancestor_id}</td>
                    <td>
                      {capitalise(results[index].first_name)}{" "}
                      {capitalise(results[index].middle_name)}{" "}
                      {capitalise(results[index].last_name)}
                    </td>
                    <td>{capitalise(results[index].ethnicity)}</td>
                    <td>
                      <span class="small-caps">b.</span>
                      {`${results[index].date_of_birth} ${results[index].place_of_birth}`}
                    </td>
                    <td>
                      <span class="small-caps">d.</span>
                      {`${results[index].date_of_death} ${results[index].place_of_death}`}
                    </td>
                    <td>{results[index].occupation} </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
