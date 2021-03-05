import { Component } from "react";

export default class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            name: "",
        };

        // this.incrementCount = this.incrementCount.bind(this);
    }

    componentDidMount() {
        console.log("component mounted!");
    }

    incrementCount() {
        this.setState({
            count: this.state.count + 1,
        });
    }

    handleChange(e) {
        this.setState({
            name: e.target.value,
        });
    }

    render() {
        return (
            <div>
                <h1>I am the counter! The count is: {this.state.count}</h1>
                <button onClick={() => this.incrementCount()}>Click Me!</button>
                <input onChange={(e) => this.handleChange(e)} />
                <div>{this.state.name}</div>
            </div>
        );
    }
}
