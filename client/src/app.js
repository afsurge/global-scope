import { Component } from "react";
import axios from "./axios";
import Profile from "./profile";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imgUrl: "",
            bio: null,
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
                imgUrl: loggedUser.imgurl,
                bio: loggedUser.bio,
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

    uploaderInApp(imgUrlFromUploader) {
        console.log(
            "Received imgUrl in App from Uploader:",
            imgUrlFromUploader
        );
        this.setState({
            imgUrl: imgUrlFromUploader,
            showUploader: !this.state.showUploader,
        });
    }

    updateBioInApp(bioFromBioEditor) {
        console.log("Received bio in App from BioEditor:", bioFromBioEditor);
    }

    render() {
        return (
            <div id="mainAppContainer">
                <div className="appTop">
                    <img id="logo" src="icon.png" />
                </div>
                <ProfilePic
                    imgUrl={this.state.imgUrl}
                    toggleUploader={() => this.toggleUploader()}
                    class1="appTop"
                    class2="smallppic"
                />
                <h1 id="greetuser">Hi {this.state.first}!</h1>
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    bio={this.state.bio}
                    imgUrl={this.state.imgUrl}
                    toggleUploader={() => this.toggleUploader()}
                    updateBioInApp={(bio) => this.updateBioInApp(bio)}
                />
                {this.state.showUploader && (
                    <div id="uploaderContainer">
                        <Uploader
                            uploaderInApp={(imgUrl) =>
                                this.uploaderInApp(imgUrl)
                            }
                            toggleUploader={() => this.toggleUploader()}
                        />
                    </div>
                )}
            </div>
        );
    }
}
