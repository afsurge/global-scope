// import NAME without "" because export default
// no need for {Welcome}
import ReactDOM from "react-dom";
// import Registration from "./registration";
import Welcome from "./welcome";
import App from "./app";

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    // elem = <img src="icon.png" />;
    elem = <App />;
}

// below can render only 1 component at a time
ReactDOM.render(elem, document.querySelector("main"));
