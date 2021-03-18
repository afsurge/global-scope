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

    if (action.type === "REMOVE_FRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                (friend) => friend.id != action.id
            ),
        };
    }

    // TEST PENDING
    // could be integrated into "REMOVE_FRIEND" above if below works!
    if (action.type === "REJECT_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                (wannabe) => wannabe.id != action.id
            ),
        };
    }

    console.log(`state in reducer for action "${action.type}":`, state);
    return state;
}
