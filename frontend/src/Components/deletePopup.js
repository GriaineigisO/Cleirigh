import React, { useState } from "react";
import ReactDOM from "react-dom";

function DeleteModal({ details, setDetails, sex, getPerson, closeEditPerson }) {
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const hisHer = sex === "male" ? "his" : "her";

    const deletePerson = async () => {
        const personID = details.id;
        try {
            const userId = localStorage.getItem("userId");
            const response = await fetch("https://cleirigh-backend.vercel.app/delete-person", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, personID, sex }),
            });

            if (!response.ok) {
                throw new Error(`Failed to delete person: ${response.statusText}`);
            }

            setDetails({ id: null });
            setShowDeletePopup(false)
            closeEditPerson();
            window.location.reload();
        } catch (error) {
            console.error(`Error deleting ${personID}: `, error);
        }
    };

    return ReactDOM.createPortal(
        <>
            {showDeletePopup && (
                <div className="popup-delete">
                    <div className="popup-delete-content">
                        <h3>Delete Ancestor</h3>
                        <p>Are you sure that you want to delete {details.fullName}?</p>
                        <div>
                            <h5>Warning</h5>
                            <p>
                                By deleting {details.fullName}, you will also delete all of {hisHer} ancestors. 
                                This is not a reversible action. Do you wish to continue?
                            </p>
                        </div>
                        <button onClick={setShowDeletePopup(false)}>Cancel</button>
                        <button onClick={deletePerson}>Delete</button>
                    </div>
                </div>
            )}
        </>,
        document.body // Portal target
    );
}

export default DeleteModal;
