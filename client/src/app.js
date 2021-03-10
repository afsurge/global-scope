import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "Abrar",
            last: "Faisal",
            showUploader: false,
        };
    }

    componentDidMount() {
        console.log("App mounted");
        // here is where we want to make an axios request to 'get' info about logged in user (first name, last name, and profilePicUrl / imageUrl)
        // an axios route '/user' is a good path for it
        // when we have the info from the server, add it to the state of the component (i.e. setState)
        axios.get("/user");
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
