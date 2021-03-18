export default function reducer(state = {}, action) {
    if (action.type === "GET_FRIENDS_WANNABES") {
        // console.log("Time to send friends and wannabes to Redux!");
        state = {
            ...state,
            friendsWannabes: action.friendsList,
        };
    }

    console.log("state from reducer:", state);
    return state;
}
