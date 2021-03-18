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
