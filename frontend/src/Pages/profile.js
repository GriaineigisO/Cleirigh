import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import testPhoto from '../Images/James Ó Donnell.jpg';
import { convertNumToRelation } from '../library';
import { propTypes } from 'react-bootstrap/esm/Image';
import { Link } from 'react-router-dom';


const Profile = () => {
    const { id } = useParams(); 
    const [profileData, setProfileData] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [fatherName, setFatherName] = useState();
    const [motherName, setMotherName] = useState();
    const [parents, setParents] = useState();
    const [fatherId, setFatherId] = useState();
    const [motherId, setMotherId] = useState();
    const [childName, setChildName] = useState();
    const [childId, setChildId] = useState();
    const [child, setChild] = useState();
    const [spouseName, setSpouseName] = useState();
    const [spouseId, setSpouseId] = useState();
    const [spouse, setSpouse] = useState();

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch('http://localhost:5000/ancestor-profiles', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('Unable to fetch profile data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getProfileData();
    }, [id]);

    
    if (loading) {
        return <div>Loading...</div>;
    }

    
    if (error) {
        return <div>{error}</div>;
    }

    const openLink = (id) => {
        window.location.href = `${id}`
    }


    const getParents = async () => {
        const userId = localStorage.getItem('userId');
        const father = profileData.father_id;
        const mother = profileData.mother_id;
        const response = await fetch('http://localhost:5000/get-parents', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, father, mother }),
        });
        const data = await response.json();
        setFatherName(data.father);
        setMotherName(data.mother);
        setFatherId(data.fatherId);
        setMotherId(data.motherId);


        if (fatherId && motherId) {
            setParents(
                <>
                 <span className="span-link" onClick={() => openLink(fatherId)}>{fatherName}</span> <span>and</span> <span className="span-link" onClick={() => openLink(motherId)}>{motherName}</span>
                </>
            );
        } else if (fatherId && !motherId) {
            setParents(
                <>
                 <span className="span-link" onClick={() => openLink(fatherId)}>{fatherName}</span>
                </>
            );
        } else if (!fatherId && motherId) {
            setParents(
                <>
                 <span className="span-link" onClick={() => openLink(motherId)}>{motherName}</span>
                </>
            );
        } else {
            setParents("Unknown")
        }

    }
    getParents();

    const getChild = async () => {
        const userId = localStorage.getItem('userId');
        const sex = profileData.sex;
        const response = await fetch('http://localhost:5000/get-child', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, id, sex }),
        });
        const data = await response.json();
        setChildName(data.childName)
        setChildId(data.childId);
        setSpouseName(data.spouseName);
        setSpouseId(data.spouseId)


        if (childId) {
            setChild(
                <>
                 <span className="span-link" onClick={() => openLink(childId)}>{childName}</span>
                </>
            );
        }

        if (spouseId) {
            setSpouse(
                <>
                 <span className="span-link" onClick={() => openLink(spouseId)}>{spouseName}</span>
                </>
            );
        }

    }
    getChild();

       

        
    return (
        <div className="profile">

            <div className="top-section">

                <div className="profile-photo-div">
                    {/* <img class="profile-photo-frame" src={frame} style={{height: "80%", width:"5%"}}></img> */}
                    <img className="profile-photo" src={testPhoto}></img>
                </div>

                <div className="fact-section">

                    <h1>{profileData.first_name} {profileData.middle_name} {profileData.last_name}</h1>

                    <p>{convertNumToRelation(profileData.relation_to_user, profileData.sex)}</p>

                    <div className="other-facts">

                        <table>
                            <tr>
                                <td className="profile-table-label">Born </td>
                                <td>{profileData.date_of_birth} {profileData.place_of_birth}</td>
                            </tr>

                            {profileData.married_date ? (
                                <tr>
                                    <td className="profile-table-label">Married </td>
                                    <td>{profileData.marriage_date} {profileData.marriage_place} to placeholder</td>
                                </tr>
                            ) : (
                                <></>
                            )}
                            
                            <tr>
                                <td className="profile-table-label">Died </td>
                                <td>{profileData.date_of_death} {profileData.place_of_death} {profileData.cause_of_death ? (<span>due to {profileData.cause_of_death}</span>) : (<></>)} </td>
                            </tr>

                            {profileData.occupation ? (
                                 <tr>
                                    <td className="profile-table-label">Occupation </td>
                                    <td>{profileData.occupation}</td>
                                </tr>
                            ) : (<></>)}
                           

                           {profileData.ethnicity ? (
                                 <tr>
                                    <td className="profile-table-label">Ethnicity </td>
                                    <td>{profileData.ethnicity}</td>
                                </tr>
                            ) : (<></>)}

                            <tr>
                                <td className="profile-table-label">Paternal Haplogroup  </td>
                                <td > </td>
                            </tr>
                            <tr>
                                <td className="profile-table-label">Maternal Haplogroup  </td>
                                <td> </td>
                            </tr>
                            <tr>
                                <td className="profile-table-label">Profile Number  </td>
                                <td>{profileData.ancestor_id}</td>
                            </tr>
                            <tr>
                                <td className="profile-table-label">Alternative Names/Spellings  </td>
                                <td></td>
                            </tr>
                        </table>

                    </div>
                    
                </div>


            </div>

            <div className="family-section">
                <h1>Family</h1>

            
                {profileData.sex === "male" ? (
                    <>
                        <p>Son of {parents}</p>
                        {spouse ? (<p>Husband of {spouse}</p>) : (<></>)}
                        {child ? (<p>Father of {child}</p>) : (<></>)}
                    </>
                ) : (
                    <>
                        <p>Daughter of {parents}</p>
                        {spouse ? (<p>Wife of {spouse}</p>) : (<></>)}
                        {child ? (<p>Mother of {child}</p>) : (<></>)}
                    </>
                )}
             

            </div>

            <div className="timeline-section">

            </div>

            <div className="article-section">

            </div>

            <div className="source-section">

            </div>

        </div>
    );
};

export default Profile;
