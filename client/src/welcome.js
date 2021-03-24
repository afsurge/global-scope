import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpass";

// "presentational"/"dumb" components
export default function Welcome() {
    return (
        <div id="welcome">
            <div id="name-logo">
                <p>GLOBAL</p>
                <img id="welcome-logo" src="./net2.png" />
                <p>SCOPE</p>
            </div>
            <HashRouter>
                <>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpass" component={ResetPassword} />
                </>
            </HashRouter>
        </div>
    );
}
