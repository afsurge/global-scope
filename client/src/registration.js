import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false, // for error msgs, included in jsx <p>
        };
        // method1 binding
        // this.handleChange = this.handleChange.bind(this);
        // method2 binding in JSX attribute onChange with arrow function
    }

    // 1. render 4 input fields + button
    // 2. capture user input and store
    // 3. when user submits, send data to server
    // if sth wrong, render error
    // if everything OK, redirect user to /

    handleClick() {
        // console.log("clicked!");
        axios
            .post("/registration", this.state)
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
                console.log("err in axios POST /registration:", err.message);
            });
    }

    handleChange(e) {
        // console.log("change is running!");
        // 1. access what user typing
        // console.log("e.target.value:", e.target.value);
        // name of input field user typing in
        // console.log("name of input:", e.target.name);
        // 2. store input in state
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            // () => console.log("this.state after setState:", this.state)
        );
        // console.log("this.state after setState:", this.state);
    }

    render() {
        return (
            <div id="regForm">
                <h1>Registration</h1>
                <h3>
                    Please provide the minimum details for registering to the
                    network.
                </h3>
                {this.state.error && (
                    <p className="error-msg">ERROR: PLEASE TRY AGAIN !</p>
                )}
                <input
                    name="first"
                    placeholder="first"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="last"
                    onChange={(e) => this.handleChange(e)}
                />
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
                <button onClick={() => this.handleClick()}>SIGN UP!</button>
                <Link to="/login">Already with us? Go to LOGIN</Link>
            </div>
        );
    }
}
