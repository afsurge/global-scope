import { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            imgurl: "",
            bio: "",
            currentId: "",
        };
    }

    componentDidMount() {
        console.log("ID of other user:", this.props.match.params.id);
        const otherId = this.props.match.params.id;
        axios
            .get("/user/:" + otherId + ".json")
            .then((response) => {
                // console.log("Response about otherId:", response.data.rows[0]);
                if (
                    response.data.rows[0].currentId ==
                    this.props.match.params.id
                ) {
                    return this.props.history.push("/");
                } else {
                    this.setState(response.data.rows[0]);
                    console.log("this.state of otherId:", this.state);
                }
            })
            .catch((err) => {
                console.log("Error getting otherId info:", err.message);
                return this.props.history.push("/");
            });
    }

    render() {
        return (
            <div id="otherProfile">
                {/* <h1>This is the OtherProfile!</h1> */}
                <img
                    id="otherProfilePic"
                    className="largeppic"
                    src={this.state.imgurl}
                />
                <div id="otherProfileInfo">
                    <h2>
                        Profile: {this.state.first} {this.state.last}
                    </h2>
                    <h2>Bio: {this.state.bio}</h2>
                </div>
            </div>
        );
    }
}
