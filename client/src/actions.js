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

export async function cancelRequest(id) {
    console.log("cancel action triggered for id:", id);
    // await axios.post(`/friends/${id}`, { action: "remove" });
    await axios.post("/friendship/manage", {
        buttonAction: "CANCEL REQUEST",
        otherId: id,
    });
    return {
        type: "CANCEL_REQUEST",
        id,
    };
}

export function chatMessages(msgs) {
    // console.log("Messages in action.js:", msgs);
    return {
        type: "RECENT_MESSAGES",
        msgs: msgs,
    };
}

export function chatMessage(msg) {
    // console.log("action dispatch from socket for new chat message!");
    return {
        type: "NEW_MESSAGE",
        msg: msg,
    };
}

export function onlineUsersAct(onlineUsers) {
    // console.log("onlineUsers action!");
    return {
        type: "ONLINE_USERS",
        users: onlineUsers,
    };
}

export function userJoinedAct(userJoined) {
    // console.log("userJoined action!");
    return {
        type: "USER_JOINED",
        user: userJoined,
    };
}

export function userLeftAct(userLeft) {
    // console.log("userLeft action!");
    return {
        type: "USER_LEFT",
        user: userLeft,
    };
}
