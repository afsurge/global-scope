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
