import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpass";

// "presentational"/"dumb" components
export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome</h1>
            <img src="./icon.png" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpass" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
