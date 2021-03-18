import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getFriendsWannabes,
    acceptFriend,
    removeFriend,
    rejectRequest,
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector((state) => {
        return (
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted)
        );
    });

    const wannabes = useSelector((state) => {
        return (
            state.friendsWannabes &&
            state.friendsWannabes.filter((wannabe) => !wannabe.accepted)
        );
    });

    // console.log("friends in component:", friends);
    // console.log("wannabes in component:", wannabes);

    useEffect(() => {
        // console.log("Dispatch for friends and wannabes!");
        dispatch(getFriendsWannabes());
    }, []);

    return (
        <div id="friendsWannabes">
            <h2>FRIENDS</h2>
            <div id="friends">
                {friends &&
                    friends.map((friend) => {
                        return (
                            <div className="friends" key={friend.id}>
                                <p>
                                    {friend.first} {friend.last}
                                </p>
                                <Link to={`/user/${friend.id}`}>
                                    <img
                                        className="friendppic"
                                        src={friend.imgurl}
                                    />
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(removeFriend(friend.id))
                                    }
                                >
                                    REMOVE
                                </button>
                            </div>
                        );
                    })}
            </div>
            <h2>WANNABES</h2>
            <div id="wannabes">
                {wannabes &&
                    wannabes.map((wannabe) => {
                        return (
                            <div className="wannabes" key={wannabe.id}>
                                <p>
                                    {wannabe.first} {wannabe.last}
                                </p>
                                <Link to={`/user/${wannabe.id}`}>
                                    <img
                                        className="wannabeppic"
                                        src={wannabe.imgurl}
                                    />
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(acceptFriend(wannabe.id))
                                    }
                                >
                                    ACCEPT
                                </button>
                                <button
                                    onClick={() =>
                                        dispatch(rejectRequest(wannabe.id))
                                    }
                                >
                                    REJECT
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
