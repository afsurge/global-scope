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
        // console.log(this.state.bioDraft);
        // axios
        //     .post("/bio", this.state.bioText)
        //     .then(() => {})
        //     .catch((err) => {
        //         console.log(
        //             "Error adding bio to database (axios):",
        //             err.message
        //         );
        //     });
        this.setState({
            bioText: this.state.bioDraft,
            edit: false,
        });
        this.props.updateBioInApp(this.state.bioDraft);
    }

    render() {
        return (
            <div id="bioeditor">
                <h2>{this.state.bioText}</h2>
                {this.state.edit && (
                    <textarea
                        defaultValue={this.props.bio}
                        onChange={(e) => this.handleChange(e)}
                    />
                )}
                <button onClick={() => this.handleClick()}>
                    {this.state.buttonTxt}
                </button>
                {this.state.edit && (
                    <button onClick={() => this.updateBio()}>SAVE</button>
                )}
                {/* {this.state.edit && <button>CLEAR</button>} */}
            </div>
        );
    }
}
