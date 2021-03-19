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

//// socket.io ////
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
//// socket.io ////

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
    db.getUserByEmail(email)
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
    db.getUserById(userId)
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

app.get("/user/:id.json", (req, res) => {
    console.log("ID of user for OtherProfile:", req.params.id);
    const otherId = req.params.id;
    const userId = req.session.userId;
    db.getUserById(otherId)
        .then(({ rows }) => {
            rows[0].currentId = userId;
            // console.log("Info of otherId:", rows[0]);
            res.json({ rows });
        })
        .catch((err) => {
            "Error getting otherId info:", err.message;
            res.json({ success: false });
        });
});

app.get("/users.json", (req, res) => {
    db.getRecentUsers()
        .then(({ rows }) => {
            // console.log("Recent users:", rows);
            res.json({ rows });
        })
        .catch((err) => {
            "Error getting recent users:", err.message;
        });
});

app.get("/users/:name", (req, res) => {
    const name = req.params.name;
    console.log("Search term in server:", name);
    if (name != "undefined") {
        db.getSearchUsers(name)
            .then(({ rows }) => {
                // console.log("Searched users:", rows);
                res.json({ rows });
            })
            .catch((err) => {
                "Error getting searched users:", err.message;
            });
    } else {
        db.getRecentUsers()
            .then(({ rows }) => {
                // console.log("Recent users (search):", rows);
                res.json({ rows });
            })
            .catch((err) => {
                "Error getting recent users (search):", err.message;
            });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("/friendship/:otherId", (req, res) => {
    const userId = req.session.userId;
    const otherId = req.params.otherId;
    const buttonText = [
        "ADD FRIEND",
        "REMOVE FRIEND",
        "CANCEL REQUEST",
        "ACCEPT REQUEST",
    ];
    db.getFriendship(userId, otherId)
        .then(({ rows }) => {
            console.log("Friendship:", rows);
            if (rows.length == 0) {
                res.json({ buttonText: buttonText[0] });
            } else {
                if (rows[0].accepted) {
                    res.json({ buttonText: buttonText[1] });
                } else {
                    if (rows[0].sender_id == userId) {
                        res.json({ buttonText: buttonText[2] });
                    } else {
                        res.json({ buttonText: buttonText[3] });
                    }
                }
            }
        })
        .catch((err) => {
            console.log("Error getting frienship:", err.message);
            res.json({ success: false });
        });
});

app.post("/friendship/manage", (req, res) => {
    const buttonAction = req.body.buttonAction;
    const otherId = req.body.otherId;
    const userId = req.session.userId;
    console.log("buttonAction to manage (server):", buttonAction);
    console.log(
        `Manage action ${buttonAction} for userId:${userId}, otherId:${otherId}`
    );
    if (buttonAction == "ADD FRIEND") {
        db.addFriend(userId, otherId, false)
            .then(() => {
                console.log("Friend request added! 😊️");
                res.json({ buttonText: "CANCEL REQUEST" });
            })
            .catch((err) => {
                console.log("Error add friend:", err.message);
            });
    } else if (buttonAction == "CANCEL REQUEST") {
        db.cancelRequest(userId, otherId)
            .then(() => {
                console.log("Friend request cancelled! 😔️");
                res.json({ buttonText: "ADD FRIEND" });
            })
            .catch((err) => {
                console.log("Error cancelling request:", err.message);
            });
    } else if (buttonAction == "ACCEPT REQUEST") {
        db.acceptRequest(userId, otherId, true)
            .then(() => {
                console.log("Friend request accepted! 😀️");
                res.json({ buttonText: "REMOVE FRIEND" });
            })
            .catch((err) => {
                console.log("Error accepting request:", err.message);
            });
    } else if (
        buttonAction == "REMOVE FRIEND" ||
        buttonAction == "REJECT REQUEST"
    ) {
        db.removeFriend(userId, otherId)
            .then(() => {
                console.log("Friend/Request removed! 😢️");
                res.json({ buttonText: "ADD FRIEND" });
            })
            .catch((err) => {
                console.log("Error removing friend:", err.message);
            });
    }
});

app.get("/friends.json", (req, res) => {
    const userId = req.session.userId;
    db.getFriendsWannabes(userId)
        .then(({ rows }) => {
            // console.log("Response getFriendsWannabes from database:", rows);
            res.json({ rows });
        })
        .catch((err) => {
            console.log("Error getFriendsWannabes from database:", err.message);
            res.json({ success: false });
        });
});

// app.post("/friends/:id", (req, res) => {
//     const userId = req.session.userId;
//     const otherId = req.params.id;
//     const action = req.body.action;
//     console.log(`userId: ${userId}, otherId: ${otherId}, action: ${action}`);
//     if (action == "accept") {
//         db.acceptRequest(userId, otherId, true)
//             .then(() => {
//                 console.log("Friend accepted using Redux! 😀️");
//                 res.json({ success: true });
//             })
//             .catch((err) => {
//                 console.log(
//                     "Error accepting request using Redux:",
//                     err.message
//                 );
//             });
//     }

//     if (action == "remove") {
//         db.removeFriend(userId, otherId)
//             .then(() => {
//                 console.log("Friend removed using Redux! 😢️");
//                 res.json({ success: true });
//             })
//             .catch((err) => {
//                 console.log("Error removing friend using Redux:", err.message);
//             });
//     }
// });

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
// server.listen instead of app.listen after adding sockets.io boilerplate
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
//// listen ////

// has to be below listen for SN project
io.on("connection", (socket) => {
    console.log(`socket with id: ${socket.id} has connected!`);

    // emit
    // arg 1 - name of custom event that gets emitted
    // arg 2 - data (obj) to send to client
    socket.emit("hello", {
        cohort: "Fennel",
    });

    socket.on("cool message", (data) => {
        console.log("data from client:", data);
    });

    socket.on("helloWorld clicked", (data) => {
        console.log(data);
    });

    // server may want to send messages to ALL connected sockets
    io.emit("trying to talk to everyone", {
        cohort: "fennel",
    });

    // send message to every socket EXCEPT your own
    socket.broadcast.emit("hello to everyone except me", {
        cohort: "fennel",
    });

    // send message to a specific socket (bonus: private msg for SN)
    io.sockets.sockets.get(socket.id).emit("hello", {
        message: "hi there, im trying to talk to only you!",
    });

    // send message to every socket EXCEPT one
    io.sockets.sockets
        .get(socket.id)
        .broadcast.emit("excluding just a particular socket", {
            message: "we r trying to plan a surprise!",
        });

    socket.on("disconnect", () => {
        console.log(`socket with id: ${socket.id} just disconnected!`);
    });
});
