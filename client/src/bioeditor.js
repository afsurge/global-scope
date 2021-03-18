import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            bioDraft: "",
            bioText: "",
            buttonTxt: "",
        };
    }

    componentDidMount() {
        console.log("Bio in BioEditor:", this.props.bio);
        if (this.props.bio) {
            this.setState({
                buttonTxt: "EDIT",
                bioText: this.props.bio,
            });
        } else {
            this.setState({
                buttonTxt: "ADD",
                bioText: "Tell us about yourself!",
            });
        }
    }

    handleChange(e) {
        // console.log("change in text area:", e.target.value);
        this.setState({ bioDraft: e.target.value });
    }

    handleClick() {
        this.setState({
            edit: true,
            buttonTxt: "EDIT",
        });
    }

    updateBio() {
        console.log("Bio to send to server:", this.state.bioDraft);

        if (this.state.bioDraft == "") {
            return this.setState({ edit: false });
        }

        axios
            .post("/bio", { bio: this.state.bioDraft })
            .then(({ data }) => {
                console.log("Response from server after Bio update:", data);
                if (data.success) {
                    this.setState({
                        bioText: this.state.bioDraft,
                        edit: false,
                    });
                    this.props.updateBioInApp(this.state.bioDraft);
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log(
                    "Error adding bio to database (axios):",
                    err.message
                );
            });
    }

    render() {
        return (
            <div id="bioeditor">
                <p id="biotext">{this.state.bioText}</p>
                {this.state.edit && (
                    <textarea
                        defaultValue={this.props.bio}
                        onChange={(e) => this.handleChange(e)}
                    />
                )}
                <button
                    className="bioButtons"
                    onClick={() => this.handleClick()}
                >
                    {this.state.buttonTxt}
                </button>
                {this.state.edit && (
                    <button
                        className="bioButtons"
                        onClick={() => this.updateBio()}
                    >
                        SAVE
                    </button>
                )}
                {/* {this.state.edit && <button>CLEAR</button>} */}
            </div>
        );
    }
}
