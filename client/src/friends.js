import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getFriendsWannabes,
    acceptFriend,
    removeFriend,
    rejectRequest,
    cancelRequest,
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
            state.friendsWannabes.filter(
                (wannabe) =>
                    !wannabe.accepted && wannabe.id == wannabe.sender_id
            )
        );
    });

    const wannahaves = useSelector((state) => {
        return (
            state.friendsWannabes &&
            state.friendsWannabes.filter(
                (wannahaves) =>
                    !wannahaves.accepted &&
                    wannahaves.id != wannahaves.sender_id
            )
        );
    });

    // console.log("friends in component:", friends);
    // console.log("wannabes in component:", wannabes);
    // console.log("wannahaves in component:", wannahaves);

    useEffect(() => {
        // console.log("Dispatch for friends and wannabes!");
        dispatch(getFriendsWannabes());
    }, []);

    return (
        <div id="friendsWannabes">
            <div id="friends">
                <h2>FRIENDS</h2>
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
            <div id="wannabes">
                <h2>WANNABES</h2>
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
            <div id="wannahaves">
                <h2>PENDING</h2>
                {wannahaves &&
                    wannahaves.map((wannahave) => {
                        return (
                            <div className="wannahaves" key={wannahave.id}>
                                <p>
                                    {wannahave.first} {wannahave.last}
                                </p>
                                <Link to={`/user/${wannahave.id}`}>
                                    <img
                                        className="wannahaveppic"
                                        src={wannahave.imgurl}
                                    />
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(cancelRequest(wannahave.id))
                                    }
                                >
                                    CANCEL
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
