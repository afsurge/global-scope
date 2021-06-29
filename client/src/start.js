// import NAME without {} because export default
// no need for {Welcome}
import ReactDOM from "react-dom";
// import Registration from "./registration";
import Welcome from "./welcome";
import App from "./app";
import { init } from "./socket";

//// Redux ////
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
//// Redux ////

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    init(store); // initializes socket if user logged in

    elem = (
        // Redux "Provider" wrap for App with "store" as props
        <Provider store={store}>
            <App />
        </Provider>
    );
}

// below can render only 1 component at a time
ReactDOM.render(elem, document.querySelector("main"));
