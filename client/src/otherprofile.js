import { Component } from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";
import { Link } from "react-router-dom";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            imgurl: "",
            bio: "",
            currentId: "",
            friend: false,
            otherFriends: [],
        };
    }

    componentDidMount() {
        console.log("ID of other user:", this.props.match.params.id);
        const otherId = this.props.match.params.id;
        axios
            .get("/user/" + otherId + ".json")
            .then(({ data }) => {
                // console.log("Response about otherId:", data.rows[0]);
                if (data.rows[0].currentId == this.props.match.params.id) {
                    return this.props.history.push("/");
                } else {
                    this.setState(data.rows[0]);
                    // console.log("this.state of otherId:", this.state);
                    // make axios to check friendship with otherId
                    axios
                        .get("/otherFriends/" + this.props.match.params.id)
                        .then(({ data }) => {
                            console.log(data);
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].id == this.state.currentId) {
                                    console.log(
                                        "You are friends and so can see other friends!"
                                    );
                                    data.splice(i, 1); // remove logged friend from array
                                    this.setState({
                                        friend: true,
                                        otherFriends: data.slice(0, 5), // include max 5 friends in array
                                    });
                                }
                            }
                        })
                        .catch((err) => {
                            "Error getting otherFriends:", err.message;
                        });
                }
            })
            .catch((err) => {
                console.log("Error getting otherId info:", err.message);
                return this.props.history.push("/");
            });
    }

    render() {
        return (
            <>
                <div id="otherProfile">
                    <img
                        id="otherProfilePic"
                        className="largeppic"
                        src={this.state.imgurl}
                    />
                    <div id="otherProfileInfo">
                        <h1>
                            {this.state.first} {this.state.last}
                        </h1>
                        <h2>ABOUT ME</h2>
                        <p className="biotext">{this.state.bio}</p>
                        <FriendButton otherId={this.props.match.params.id} />
                    </div>
                </div>
                <div id="otherFriends">
                    {this.state.friend && <h2>OTHER FRIENDS</h2>}
                    {this.state.friend &&
                        this.state.otherFriends.map(function (otherFriend) {
                            return (
                                <div
                                    className="otherFriend"
                                    key={otherFriend.id}
                                >
                                    <p>
                                        {otherFriend.first} {otherFriend.last}
                                    </p>
                                    <Link to={`/user/${otherFriend.id}`}>
                                        <img
                                            className="otherfriendppic"
                                            src={otherFriend.imgurl}
                                        />
                                    </Link>
                                </div>
                            );
                        })}
                </div>
            </>
        );
    }
}
