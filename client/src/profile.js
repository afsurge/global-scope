import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";
import axios from "./axios";
import { useState } from "react";

export default function Profile(props) {
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    function deleteProfile() {
        console.log("Want to delete this profile!");
        axios
            .get("/deleteProfile")
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/logout");
                }
            })
            .catch((err) => {
                console.log("Error deleting user profile:", err.message);
            });
    }

    return (
        <div id="profile">
            <ProfilePic
                imgUrl={props.imgUrl}
                toggleUploader={() => props.toggleUploader()}
                class1="withBio"
                class2="largeppic"
            />

            <BioEditor
                bio={props.bio}
                updateBioInApp={(bio) => props.updateBioInApp(bio)}
            />
            <button
                id="del-profile-button"
                onClick={() => {
                    setDeleteConfirm(true);
                }}
            >
                DELETE PROFILE
            </button>
            {deleteConfirm && (
                <div id="deleter">
                    <div id="del-confirmer">
                        <h3>
                            Are you sure you want to completely delete your
                            account?
                        </h3>
                        <button id="del-yes" onClick={deleteProfile}>
                            YES
                        </button>
                        <button
                            id="del-no"
                            onClick={() => {
                                setDeleteConfirm(false);
                            }}
                        >
                            NO
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
