const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./utils/bc");

//// middlewares ////
app.use(
    cookieSession({
        secret: `I love to eat.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());
//// middlewares ////

//// routes ////

app.get("/welcome", (req, res) => {
    // if user puts /welcome in url
    if (req.session.userId) {
        // if logged in - not allowed to see welcome page
        // redirect away from /welcome or / to page allowed to see
        res.redirect("/");
    } else {
        // send back HTML - will trigger start.js to render Welcome in DOM
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("*", (req, res) => {
    // runs for any route except /welcome
    if (!req.session.userId) {
        // if not logged in - redirect to /welcome
        // only page allowed
        res.redirect("/welcome");
    } else {
        // this if user logged in
        // send back HTML - start.js kicks in and renders <p>
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;

    if (password == undefined) {
        return res.json({ success: false });
    }

    hash(password)
        .then((hashedpass) => {
            db.addUser(first, last, email, hashedpass)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log(
                        "Error with adding user (server):",
                        err.message
                    );
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("Error with hashing password:", err.message);
        });
});

//// routes ////

//// listen ////
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
//// listen ////
