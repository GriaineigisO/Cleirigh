import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import testPhoto from '../Images/James Ó Donnell.jpg';
import { convertNumToRelation } from '../library';
import { propTypes } from 'react-bootstrap/esm/Image';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';




const Profile = () => {

    const [value, setValue] = useState('');
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
    const [content, setContent] = useState('<p>Describe Your Ancestor.../p>');
    const [basePersonFirstName, setBasePersonFirstName] = useState();
    const [ancestryPercent, setAncestryPercent] = useState();
    const [isEditing, setisEditing] = useState(false);
      

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

    useEffect(() => {
        if (profileData) {
            setValue(profileData.profile_text);
        }
    }, [profileData])

    
    const openLink = (id) => {
        window.location.href = `${id}`
    }

    useEffect(() => {
        // Fetch base person name
        const getBasePersonName = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch('http://localhost:5000/get-base-person', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });
                const data = await response.json();
                setBasePersonFirstName(data.firstName);
            } catch (err) {
                console.error('Error fetching base person name:', err);
            }
        };

        getBasePersonName();
    }, []);

    useEffect(() => {
        if (!profileData) return;

        // Fetch parents
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

            if (data.fatherId && data.motherId) {
                setParents(
                    <>
                        <span className="span-link" onClick={() => openLink(data.fatherId)}>{data.father}</span> <span>and</span> <span className="span-link" onClick={() => openLink(data.motherId)}>{data.mother}</span>
                    </>
                );
            } else if (data.fatherId) {
                setParents(
                    <>
                        <span className="span-link" onClick={() => openLink(data.fatherId)}>{data.father}</span>
                    </>
                );
            } else if (data.motherId) {
                setParents(
                    <>
                        <span className="span-link" onClick={() => openLink(data.motherId)}>{data.mother}</span>
                    </>
                );
            } else {
                setParents("Unknown");
            }
        };

        getParents();
    }, [profileData]);

    useEffect(() => {
        if (!profileData) return;

        // Fetch child data
        const getChild = async () => {
            const userId = localStorage.getItem('userId');
            const sex = profileData.sex;
            const response = await fetch('http://localhost:5000/get-child', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, id, sex }),
            });
            const data = await response.json();
            setChildName(data.childName);
            setChildId(data.childId);
            setSpouseName(data.spouseName);
            setSpouseId(data.spouseId);

            if (data.childId) {
                setChild(<span className="span-link" onClick={() => openLink(data.childId)}>{data.childName}</span>);

            }
            if (data.spouseId) {
                setSpouse(<span className="span-link" onClick={() => openLink(data.spouseId)}>{data.spouseName}</span>);
            }
        };

        getChild();
    }, [profileData]);


    useEffect(() => {
        if (!profileData) return;

        const calculateAncestryPercent = () => {
            let inputNum = Number(profileData.relation_to_user - 2) + 3;
            let hundred = 200;
            for (let i = 0; i < inputNum; i++) {
                hundred = hundred / 2;
            }
            if (hundred < 0.0000014901161193847656) {
                setAncestryPercent(hundred.toFixed(10));
            } else {
                setAncestryPercent(hundred);
            }
        };

        calculateAncestryPercent();
    }, [profileData]);

    
    if (loading) {
        return <div>Loading...</div>;
    }

    
    if (error) {
        return <div>{error}</div>;
    }

    const handleEdit = () => {
        setisEditing(true);
    }

    const handleSaveText = async () => {
        setisEditing(false)
        const userId = localStorage.getItem('userId');
        const response = await fetch('http://localhost:5000/save-profile-text', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, id, value}),
        });
    }

    const handleCancelText = async () => {
        setisEditing(false)
        setValue(value);
    }
        
    return (
        <div className="profile"S>

            <div className="top-section">

                <div className="profile-photo-div">
                    {/* <img className="profile-photo" src={testPhoto}></img> */}
                </div>

                <div className="fact-section">

                    <h1>{profileData.first_name}{profileData.uncertain_first_name ? (<sup> uncertain</sup>) :(<></>)} {profileData.middle_name}{profileData.uncertain_middle_name ? (<sup> uncertain</sup>) :(<></>)} {profileData.last_name}{profileData.uncertain_lasst_name ? (<sup> uncertain</sup>) :(<></>)}</h1>

                    <p>{convertNumToRelation(profileData.relation_to_user, profileData.sex)}</p>

                    <p>{profileData.first_name} is responsible for {ancestryPercent}% of {basePersonFirstName}'s ancestry.</p>

                    <div className="other-facts">

                        <table>
                            <tr>
                                <td className="profile-table-label">Born </td>
                                <td>{profileData.date_of_birth}{profileData.uncertain_birth_date ? (<sup> uncertain</sup>) :(<></>)} {profileData.place_of_birth}{profileData.uncertain_birth_place ? (<sup> uncertain</sup>) :(<></>)}</td>
                            </tr>

                            {profileData.married_date ? (
                                <tr>
                                    <td className="profile-table-label">Married </td>
                                    <td>{profileData.marriage_date}{profileData.uncertain_marriage_date ? (<sup> uncertain</sup>) :(<></>)} {profileData.marriage_place}{profileData.uncertain_marriage_place ? (<sup> uncertain</sup>) :(<></>)} to placeholder</td>
                                </tr>
                            ) : (
                                <></>
                            )}
                            
                            <tr>
                                <td className="profile-table-label">Died </td>
                                <td>{profileData.date_of_death}{profileData.uncertain_death_date ? (<sup> uncertain</sup>) :(<></>)} {profileData.place_of_death}{profileData.uncertain_death_place ? (<sup> uncertain</sup>) :(<></>)} {profileData.cause_of_death ? (<span>due to {profileData.cause_of_death}</span>) : (<></>)} </td>
                            </tr>

                            {profileData.occupation ? (
                                 <tr>
                                    <td className="profile-table-label">Occupation </td>
                                    <td>{profileData.occupation}{profileData.uncertain_occupation ? (<sup> uncertain</sup>) :(<></>)}</td>
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
             
             {/*descendancy chart here*/}

            </div>

            <div className="timeline-section">
                <hr></hr>
                <h1>Timeline</h1>

            </div>

            <div className="article-section">
                <hr></hr>
                <p className="span-link" onClick={handleEdit}>Edit</p>
                {isEditing ? (
                    <div>
                        <ReactQuill theme="snow" value={value}  style={{ height: '300px' }}  onChange={setValue} />
                        <button style={{marginTop:"60px"}} onClick={handleCancelText}>Cancel</button>
                        <button style={{marginTop:"60px"}} onClick={handleSaveText}>Save Text</button>
                    </div>
                    ) : (<div dangerouslySetInnerHTML={{ __html: value }} />)}
            </div>

            <div className="source-section">
                <h3>Sources</h3>
            </div>

        </div>
    );
};

export default Profile;
