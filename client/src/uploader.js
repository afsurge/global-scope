import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.file = null;

        console.log("props in Uploader: ", props);
    }

    componentDidMount() {
        // console.log("Uploader mounted!");
    }

    handleChange(e) {
        console.log("upload file selected!");
        // console.log(e.target.files[0]);
        this.file = e.target.files[0];
    }

    uploader() {
        var formData = new FormData();
        formData.append("file", this.file);
        var self = this;
        axios
            .post("/upload", formData)
            .then((response) => {
                // console.log(
                //     "response after file upload (url):",
                //     response.data.imgUrl
                // );
                this.props.uploaderInApp(response.data.imgUrl);
            })
            .catch((err) => {
                console.log("Error in post /upload (Uploader):", err.message);
            });
        // this.props.uploaderInApp("whoaaaa");
    }

    render() {
        return (
            <div id="uploader">
                <h3 onClick={this.props.toggleUploader}>X</h3>
                <h3>Want to change/upload your profile picture?</h3>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="file"
                    type="file"
                    accept="image/*"
                />
                <button onClick={() => this.uploader()}>UPLOAD</button>
            </div>
        );
    }
}
