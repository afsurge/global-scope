import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpass";

// "presentational"/"dumb" components
export default function Welcome() {
    return (
        <div id="welcome">
            <h1>WELCOME</h1>
            <img id="welcome-logo" src="./net2.png" />
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
