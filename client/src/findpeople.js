import axios from "./axios";
import { useState, useEffect } from "react";

export default function FindPeople() {
    const [searchTerm, setSearchTerm] = useState("");
    const [resultUsers, setResultUsers] = useState();

    // for storing copy of results at mount -> 1.useEffect
    // use later when searchTerm is empty "" -> 2.useEffect
    // Alistair: can make logic in server for empty searchTerm to avoid using extra const -> new query to server
    // current issue: will not update if new user registers in meantime -> using client copy and not new query by server
    const [resultsDraft, setResultsDraft] = useState();

    useEffect(function () {
        axios
            .get("/users.json")
            .then(({ data }) => {
                console.log("Received recent users:", data.rows);
                setResultUsers(data.rows);
                setResultsDraft(data.rows);
            })
            .catch((err) => {
                "Error getting recent users (component):", err.message;
            });
    }, []);

    useEffect(
        function () {
            if (searchTerm != "") {
                axios
                    .get("/users/" + searchTerm)
                    .then(({ data }) => {
                        console.log("Received search users:", data.rows);
                        setResultUsers(data.rows);
                    })
                    .catch((err) => {
                        "Error getting searched users (component):",
                            err.message;
                    });
            } else {
                console.log("resultsDraft:", resultsDraft);
                setResultUsers(resultsDraft);
            }
        },
        [searchTerm]
    );

    return (
        <div id="findPeople">
            {searchTerm == "" && <h3>These people just joined our network!</h3>}
            {searchTerm == "" || <h3>Search results for: "{searchTerm}"</h3>}
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
            {searchTerm == "" && <h4>Someone specific ?</h4>}
            <input
                defaultValue={searchTerm}
                onChange={({ target }) => {
                    setSearchTerm(target.value);
                }}
                placeholder="Enter name"
            />
        </div>
    );
}