import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imgUrl: "",
            showUploader: false,
        };
    }

    componentDidMount() {
        // console.log("App mounted");
        // axios request to 'get' info about logged in user (first, last, profilePicUrl/imageUrl)
        // axios route '/user' is good choice
        // add received info to state of the component (setState)
        axios.get("/user").then(({ data }) => {
            const loggedUser = data.rows[0];
            this.setState({
                first: loggedUser.first,
                last: loggedUser.last,
                imgUrl: loggedUser.imgUrl,
            });
            // console.log("data received about logged in user:", loggedUser);
        });
    }

    toggleUploader() {
        // console.log("toggleModal function is running!!!");
        this.setState({
            showUploader: !this.state.showUploader,
        });
    }

    methodInApp(arg) {
        console.log("I'm running in App! My argument is:", arg);
    }

    render() {
        return (
            <div>
                <h1>Hello {this.state.first}!</h1>

                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.imgUrl}
                    toggleUploader={() => this.toggleUploader()}
                />

                {/* <h2 onClick={() => this.toggleUploader()}>
                    Click here! Changing showUploader state with a method!
                </h2> */}

                {this.state.showUploader && (
                    <Uploader methodInApp={this.methodInApp} />
                )}
            </div>
        );
    }
}
