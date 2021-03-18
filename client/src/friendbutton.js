import { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState("FRIENDS");
    const otherId = props.otherId;

    useEffect(function () {
        // console.log("props from OtherProfile:", parseInt(props.otherId));
        // setOtherId(parseInt(props.otherId));
        axios
            .get("/friendship/" + otherId)
            .then(({ data }) => {
                console.log("buttonText from server:", data.buttonText);
                setButtonText(data.buttonText);
            })
            .catch((err) => {
                console.log(
                    "Error getting friendship (component):",
                    err.message
                );
            });
    }, []);

    function handleFriendship() {
        console.log("Button clicked! buttonText:", buttonText);
        axios
            .post("/friendship/manage/", {
                buttonAction: buttonText,
                otherId: otherId,
            })
            .then(({ data }) => {
                console.log(
                    "buttonText after friendship manage:",
                    data.buttonText
                );
                setButtonText(data.buttonText);
            });
    }

    return (
        <div>
            <button onClick={handleFriendship}>{buttonText}</button>
        </div>
    );
}
