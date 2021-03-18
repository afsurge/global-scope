import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsWannabes } from "./actions";

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
                                <img
                                    className="friendppic"
                                    src={friend.imgurl}
                                />
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
                                <img
                                    className="wannabeppic"
                                    src={wannabe.imgurl}
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
