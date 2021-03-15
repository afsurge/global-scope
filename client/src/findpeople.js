import axios from "./axios";
import { useState, useEffect } from "react";

export default function FindPeople() {
    const [searchTerm, setSearchTerm] = useState("");
    const [resultUsers, setResultUsers] = useState();

    useEffect(function mount() {
        axios
            .get("/users/recent.json")
            .then(({ data }) => {
                console.log("Received recent users:", data.rows);
                setResultUsers(data.rows);
            })
            .catch((err) => {
                "Error getting recent users (component):", err.message;
            });
    }, []);

    useEffect(
        function () {
            if (searchTerm != "") {
                axios
                    .get("/user/" + searchTerm)
                    .then(({ data }) => {
                        console.log("Received search users:", data.rows);
                        setResultUsers(data.rows);
                    })
                    .catch((err) => {
                        "Error getting searched users (component):",
                            err.message;
                    });
            }
        },
        [searchTerm]
    );

    return (
        <div id="findPeople">
            <h3>These people just joined our network!</h3>
            {resultUsers &&
                resultUsers.map(function (user) {
                    return (
                        <div className="people" key={user.id}>
                            <img className="userppic" src={user.imgurl} />
                            <h2>
                                {user.first} {user.last}
                            </h2>
                        </div>
                    );
                })}
            <input
                defaultValue={searchTerm}
                onChange={({ target }) => {
                    setSearchTerm(target.value);
                }}
            />
        </div>
    );
}
