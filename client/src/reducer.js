export default function reducer(state = {}, action) {
    if (action.type === "GET_FRIENDS_WANNABES") {
        // console.log("Time to send friends and wannabes to Redux!");
        state = {
            ...state,
            friendsWannabes: action.friendsList,
        };
    }

    if (action.type === "ACCEPT_FRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((wannabe) => {
                if (wannabe.id == action.id) {
                    return {
                        ...wannabe,
                        accepted: true,
                    };
                } else {
                    return wannabe;
                }
            }),
        };
    }

    if (
        action.type === "REMOVE_FRIEND" ||
        action.type === "REJECT_REQUEST" ||
        action.type === "CANCEL_REQUEST"
    ) {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                (friendWannabe) => friendWannabe.id != action.id
            ),
        };
    }

    if (action.type === "RECENT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.msgs,
        };
    }

    if (action.type === "NEW_MESSAGE") {
        console.log("msg details from server:", action.msg);
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.msg],
        };
    }

    if (action.type === "ONLINE_USERS") {
        console.log("online users in network:", action.users);
        state = { ...state, onlineUsers: action.users };
    }

    if (action.type === "USER_JOINED") {
        console.log("user joined to network:", action.user);
        state = { ...state, onlineUsers: [...state.onlineUsers, action.user] };
    }

    if (action.type === "USER_LEFT") {
        console.log("user left from network:", action.user);
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                (user) => user.id != action.user
            ),
        };
    }

    console.log(`state in reducer for action "${action.type}":`, state);
    return state;
}
