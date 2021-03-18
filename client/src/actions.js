import axios from "./axios";

export async function getFriendsWannabes() {
    const { data } = await axios.get("/friends.json");
    // console.log("Received info from server, time for some action!");
    // console.log("Data received by actions.js:", data.rows);
    return {
        type: "GET_FRIENDS_WANNABES",
        friendsList: data.rows,
    };
}

export async function acceptFriend(id) {
    console.log("accept action triggered for id:", id);
    // await axios.post(`/friends/${id}`, { action: "accept" });
    await axios.post("/friendship/manage", {
        buttonAction: "ACCEPT REQUEST",
        otherId: id,
    });
    return {
        type: "ACCEPT_FRIEND",
        id,
    };
}

export async function removeFriend(id) {
    console.log("remove action triggered for id:", id);
    // await axios.post(`/friends/${id}`, { action: "remove" });
    await axios.post("/friendship/manage", {
        buttonAction: "REMOVE FRIEND",
        otherId: id,
    });
    return {
        type: "REMOVE_FRIEND",
        id,
    };
}

export async function rejectRequest(id) {
    console.log("reject action triggered for id:", id);
    // await axios.post(`/friends/${id}`, { action: "remove" });
    await axios.post("/friendship/manage", {
        buttonAction: "REJECT REQUEST",
        otherId: id,
    });
    return {
        type: "REJECT_REQUEST",
        id,
    };
}
