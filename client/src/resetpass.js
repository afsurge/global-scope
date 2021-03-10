import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: false,
        };
    }

    handleReset() {
        axios
            .post("/pass/reset/start", this.state)
            .then(({ data }) => {
                if (data.success) {
                    // redirect
                    this.setState({ step: 2 });
                } else {
                    // render error msg
                    this.setState({ error: true });
                }
            })
            .catch((err) => {
                console.log(
                    "Error in axios POST /pass/reset/start:",
                    err.message
                );
                this.setState({ error: true });
            });
    }

    handleVerify() {
        axios
            .post("/pass/reset/verify", this.state)
            .then(({ data }) => {
                if (data.success) {
                    // redirect
                    this.setState({ step: 3 });
                } else {
                    // render error msg
                    this.setState({ error: true });
                }
            })
            .catch((err) => {
                console.log(
                    "Error in axios POST /pass/reset/verify:",
                    err.message
                );
                this.setState({ error: true });
            });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    render() {
        const { step } = this.state;

        return (
            <div className="resetpass">
                <h1>Reset Password</h1>
                {this.state.error && <p>something went wrong!</p>}
                {step == 1 && (
                    <div>
                        <input
                            name="email"
                            placeholder="email"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button onClick={() => this.handleReset()}>
                            RESET
                        </button>
                    </div>
                )}
                {step == 2 && (
                    <div>
                        <input
                            name="code"
                            placeholder="secret code"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <input
                            name="newpass"
                            placeholder="new password"
                            type="password"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button onClick={() => this.handleVerify()}>
                            VERIFY
                        </button>
                    </div>
                )}
                {step == 3 && (
                    <div>
                        <p>SUCCESS!</p>
                        <Link to="/login">Back to LOGIN</Link>
                    </div>
                )}
            </div>
        );
    }
}
