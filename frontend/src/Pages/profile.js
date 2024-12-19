import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import testPhoto from '../Images/James Ó Donnell.jpg';
import { convertNumToRelation } from '../library';
import { propTypes } from 'react-bootstrap/esm/Image';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Modal, Button } from 'react-bootstrap';




const Profile = () => {

    const [sourceNameLinkArray, setSourceNameLinkArray] = useState([]);
    const [sourceLinkArray, setSourceLinkArray] = useState([]);
    const [sourceNameLink, setSourceNameLink] = useState();
    const [sourceLink, setSourceLink] = useState();
    const [sourceType, setSourceType] = useState();
    const [sourceModalOpen, setSourceModalOpen] = useState(false)
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
    const [childName, setChildName] = useState([]);
    const [childId, setChildId] = useState([]);
    const [child, setChild] = useState([]);
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
                        <a href={data.fatherId}>{data.father}</a> <span>and</span> <a href={data.motherId}>{data.mother}</a>
                    </>
                );
            } else if (data.fatherId) {
                setParents(
                    <>
                        <a href={data.fatherId}>{data.father}</a>
                    </>
                );
            } else if (data.motherId) {
                setParents(
                    <>
                        <a href={data.motherId}>{data.mother}</a>
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

            let childLinks = []
            if (data.childId) {
                for (let i = 0; i < data.childId.length; i++) {
                    childLinks.push(<a href={data.childId[i]}>{data.childName[i]}</a>);
                }
                setChild(childLinks);

            }
            if (data.spouseId) {
                setSpouse(<a href={data.spouseId}>{data.spouseName}</a>);
            }
        };

        getChild();
    }, [profileData]);



        const AncestryAmount = () => {
            let ancestryAmount = 0;
            for (let i = 0; i < profileData.relation_to_user.length; i++) {

                let inputNum = Number(profileData.relation_to_user[i] - 2) + 3;
                let hundred = 200;
                for (let i = 0; i < inputNum; i++) {
                    hundred = hundred / 2;
                }
                if (hundred < 0.0000014901161193847656) {
                    ancestryAmount += Number(hundred.toFixed(20));
                } else {
                    ancestryAmount += hundred;
                }

            }

            if (ancestryAmount < 0.0000014901161193847656) {
                setAncestryPercent(ancestryAmount.toFixed(20));
            } else {
                setAncestryPercent(ancestryAmount);
            }

            //calculated what equivalent non-repeating relationship this ancestor would be
            let reverseAmount = ancestryPercent;
            let counter = 0;
            while (reverseAmount < 100) {
                reverseAmount *= 2;
                counter++;
            } 

            if (profileData.relation_to_user.length > 1) {
                return (
                    <p>{profileData.first_name} is responsible for {ancestryPercent}% of {basePersonFirstName}'s ancestry. If {profileData.first_name} was not a repeat ancestor, then this amount would make him equivalent to a {convertNumToRelation(counter, profileData.sex)}</p>
                )
            } else {
                return (
                    <p>{profileData.first_name} is responsible for {ancestryPercent}% of {basePersonFirstName}'s ancestry.</p>
                )
            }

        };


    
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

    const openAddSource = () => {
        setSourceModalOpen(true);
    }

    const closeAddSource = () => {
        setSourceModalOpen(false);
    }

    const saveSource = async () => {
        setSourceNameLinkArray((prev) => ([
            ...prev,
            sourceNameLink
        ]))

        setSourceLinkArray((prev) => ([
            ...prev,
            sourceLink
        ]))

        const userId = localStorage.getItem('userId');
        const response = await fetch('http://localhost:5000/save-source-link', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, sourceNameLinkArray, sourceLinkArray}),
        });
    }


    const handleSourceType = (event) => {
        setSourceType(event.target.value)
    }

    const handleViewInTreee = async () => {

        //finds what page the ancestor is on
        const userId = localStorage.getItem('userId');
        const getPageNum = await fetch('http://localhost:5000/find-page-number', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, id}),
        });
        const num = await getPageNum.json();

        //sets current page to ancestor's page
        const setPageNum = await fetch('http://localhost:5000/set-current-page-number', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, num}),
        });
        const pageNumRecieved = await setPageNum.json();

        if (pageNumRecieved) {
            //redirect to tree
            window.location.href = '/familytree';
        }

    }

    const ListChildren = () => {

            const childList = child.reduce((acc, item, index, array) => {
                if(child.length > 1) {
                    if (index === array.length - 1) {
                        // For the last item, add " and " before it.
                        acc.push(" and ", item);
                    } else {
                        // For all other items, add the item and ", ".
                        if (child.length > 2) {
                            acc.push(item, ", ");
                        } else {
                            acc.push(item)
                        }  
                    }
                } else {
                    acc.push(item)
                }
                
                return acc;
            }, []);

        if (profileData.sex === "male") {
            return (
                <p>Father of {childList}</p>
            )
        } else {
            return (
                <p>Mother of {childList}</p>
            )
        }
        
    }

    const CalculateRelation = () => {

        const relationArray = profileData.relation_to_user.map((relation) =>
            convertNumToRelation(relation, profileData.sex)
        );

        if (profileData.relation_to_user.length > 1) {
            return (
                <>
                    <p>Repeat ancestor! {profileData.first_name} appears as a direct ancestor in your tree {relationArray.length} times.</p>
                    <ul>
                        {relationArray.map((relation, index) => (
                            <li key={index}>{relation}</li>
                        ))}
                    </ul>
                </>
            );
        } else {
            return (
                <>
                    <ul>
                        {relationArray.map((relation, index) => (
                            <li key={index}>{relation}</li>
                        ))}
                    </ul>
                </>
            );
        }

    };
    
        
    return (
        <div className="profile">


            <Modal show={sourceModalOpen} onHide={closeAddSource} dialogclassName="custom-modal-width" backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Add Source</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{display:"flex", flexDirection:"column"}}>    
                        <div style={{width:"300px"}}>
                            <label>Source Type</label>
                            <select onChange={handleSourceType}>
                                <option>--Select Type--</option>
                                <option value="link">Link</option>
                                <option value="image">Image</option>
                                <option value="text">Text</option>
                            </select>
                        </div>      

                        <div>
                            <label>Source Name</label>
                            {sourceType === "link" ? (
                                <input type="text" onChange={(event) => setSourceNameLink(event.target.value)}></input>
                            ) : (
                                <></>
                            )}
                        </div>    

                        {sourceType === "link" ? (
                            <div>
                                <label>link</label>
                                <input type="text" onChange={(event) => setSourceLink(event.target.value)}></input>
                            </div>
                        ) : (<></>)}
                        
                        
                    </div>

                </Modal.Body>
                <Modal.Footer>
                
                <div className="modal-footer-buttons">

                    <div className="non-delete-buttons">
                        <Button variant="secondary" onClick={closeAddSource}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={saveSource}>
                            Save Changes
                        </Button>
                    </div>

                </div>
                </Modal.Footer>
                
        </Modal>

            <div className="top-section">

                <div className="profile-photo-div">
                    {/* <img className="profile-photo" src={testPhoto}></img> */}
                </div>

                <div className="fact-section">

                    <h1>{profileData.first_name}{profileData.uncertain_first_name ? (<sup> uncertain</sup>) :(<></>)} {profileData.middle_name}{profileData.uncertain_middle_name ? (<sup> uncertain</sup>) :(<></>)} {profileData.last_name}{profileData.uncertain_lasst_name ? (<sup> uncertain</sup>) :(<></>)}</h1>

                    <CalculateRelation />

                    <AncestryAmount />


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
                    
                    <button style={{marginTop:"10px"}} onClick={handleViewInTreee}>View in Tree</button>

                </div>


            </div>

            <div className="family-section">
                <h1>Family</h1>

            
                {profileData.sex === "male" ? (
                    <>
                        <p>Son of {parents}</p>
                        {spouse ? (<p>Husband of {spouse}</p>) : (<></>)}
                        {child ? (<ListChildren />) : (<></>)}
            
                    </>
                ) : (
                    <>
                        <p>Daughter of {parents}</p>
                        {spouse ? (<p>Wife of {spouse}</p>) : (<></>)}
                        {child ? (<ListChildren />) : (<></>)}
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
                <hr></hr>
                <h3>Sources</h3>
                <p className="span-link" onClick={openAddSource}>Add Source</p>

                <ul>
                    {sourceNameLinkArray.map((index) => (
                        <li key={index}><a href={sourceLinkArray[index]} target="_blank">{sourceNameLinkArray[index]}</a></li>
                    ))}
                </ul>

            </div>

        </div>
    );
};

export default Profile;
