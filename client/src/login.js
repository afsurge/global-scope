import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false, // for error msgs, included in jsx <p>
        };
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                if (data.success) {
                    // redirect
                    location.replace("/");
                } else {
                    // render error msg
                    this.setState({ error: true });
                }
            })
            .catch((err) => {
                console.log("Error in axios POST /login:", err.message);
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState:", this.state)
        );
        // console.log("this.state after setState:", this.state);
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                {this.state.error && <p>something went wrong!</p>}
                <input
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.handleClick()}>LOGIN</button>
            </div>
        );
    }
}
