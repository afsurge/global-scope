const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const crs = require("crypto-random-string");
const ses = require("./ses");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const config = require("./config.json");

//// for S3 upload ////

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//// for S3 upload ////

//// middlewares ////

app.use(
    cookieSession({
        secret: `I love to eat.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("dtoken", req.csrfToken());
    next();
});
app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

//// middlewares ////

//// routes ////

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

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email == "" || password == "") {
        return res.json({ success: false });
    }
    db.getUser(email)
        .then(({ rows }) => {
            // console.log(rows);
            const hashpass = rows[0].hashpass;
            const id = rows[0].id;
            compare(password, hashpass).then((match) => {
                if (match) {
                    req.session.userId = id;
                    res.json({ success: true });
                } else {
                    console.log("Password does not match!");
                    return res.json({ success: false });
                }
            });
        })
        .catch((err) => {
            console.log("Error getting user info at login:", err.message);
            return res.json({ success: false });
        });
});

app.post("/pass/reset/start", (req, res) => {
    const { email } = req.body;
    const dCode = crs({ length: 6 });
    if (email == null) {
        return res.json({ success: false });
    }

    db.addCode(email, dCode)
        .then(() => {
            ses.sendEmail(
                "abrarfaisal20@gmail.com",
                "Your secret code: " + dCode,
                "Reset user password for your SocialNetwork Spiced project"
            )
                .then(() => {
                    console.log("It worked, email sent!");
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("Error in sending email:", err.message);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("Error in adding secret code:", err.message);
            // res.json({ success: false });
        });
});

app.post("/pass/reset/verify", (req, res) => {
    // console.log("req.body in reset verify:", req.body);
    const { code, email, newpass } = req.body;
    if (code == null || newpass == null) {
        return res.json({ success: false });
    }

    db.getCode(email)
        .then(({ rows }) => {
            if (rows[0].dcode == code) {
                hash(newpass)
                    .then((hashedpass) => {
                        db.updatePass(hashedpass, email)
                            .then(() => {
                                console.log("Password updated!");
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log(
                                    "Error updating password:",
                                    err.message
                                );
                            });
                        console.log("Hashed reset pass!");
                    })
                    .catch((err) => {
                        console.log(
                            "Error hashing reset password:",
                            err.message
                        );
                    });
                console.log("Secret code matched!");
            } else {
                console.log("Secret code does not match!");
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("Error checking secret code:", err.message);
            res.json({ success: false });
        });
});

app.get("/user", (req, res) => {
    const userId = req.session.userId;
    // console.log("id of logged in user:", id);
    db.getLoggedUser(userId)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.log("Error getting logged in user:", err.message);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const userId = req.session.userId;
    // console.log("profile pic uploaded by user id:", userId);
    const { filename } = req.file;
    const fullUrl = config.s3Url + filename;
    // console.log("fullUrl:", fullUrl);
    db.updateImg(fullUrl, userId)
        .then(() => {
            console.log("profile pic link added to database!");
            res.json({ imgUrl: fullUrl });
        })
        .catch((err) => {
            console.log("Error updating profile pic:", err.message);
        });
});

app.post("/bio", (req, res) => {
    const userId = req.session.userId;
    const { bio } = req.body;
    console.log("Received bio by server:", bio);
    db.updateBio(bio, userId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("Error updating bio (server):", err.message);
        });
});

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

//// routes ////

//// listen ////
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
//// listen ////
