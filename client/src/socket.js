import {
    chatMessages,
    chatMessage,
    onlineUsersAct,
    userJoinedAct,
    userLeftAct,
} from "./actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));

        socket.on("onlineUsers", (onlineUsers) =>
            store.dispatch(onlineUsersAct(onlineUsers))
        );

        socket.on("userJoined", (userJoined) =>
            store.dispatch(userJoinedAct(userJoined))
        );

        socket.on("userLeft", (userLeft) =>
            store.dispatch(userLeftAct(userLeft))
        );
    }
};
