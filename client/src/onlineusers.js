import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function OnlineFriends() {
    const onlineUsers = useSelector((state) => state && state.onlineUsers);
    console.log("onlineUsers:", onlineUsers);

    return (
        <div id="online-users-container">
            <h2>ONLINE USERS</h2>
            <h3>These people are online at this very moment!</h3>
            {onlineUsers &&
                onlineUsers.map(function (onlineUser) {
                    return (
                        <div key={onlineUser.id}>
                            <Link
                                className="online-user-link"
                                to={`/user/${onlineUser.id}`}
                            >
                                <div className="people">
                                    <img
                                        className="userppic"
                                        src={onlineUser.imgurl}
                                    />
                                    <h2>
                                        {onlineUser.first} {onlineUser.last}
                                    </h2>
                                </div>
                            </Link>
                        </div>
                    );
                })}
        </div>
    );
}
