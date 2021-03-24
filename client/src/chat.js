import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("chatMessages", chatMessages);

    const socket = io.connect();
    const elemRef = useRef();

    let chatMsg = "";

    useEffect(() => {
        // console.log("scrollHeight:", elemRef.current.scrollHeight);
        // console.log("clientHeight:", elemRef.current.clientHeight);
        // console.log("scrollTop:", elemRef.current.scrollTop);
        // elemRef.current.scrollTop = 100;
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        // console.log("new scrollTop:", elemRef.current.scrollTop);
    }, [chatMessages]);

    function sendChatMsg(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            chatMsg = e.target.value;
            console.log("New chat:", chatMsg);
            e.target.value = "";
            socket.emit("chatMessage", chatMsg);
        }
    }

    return (
        <div id="full-chat">
            <h2>CHAT ROOM</h2>
            <h3>You can chat with everyone in the network!</h3>
            <div id="chat-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map(function (user_msg) {
                        return (
                            <div className="chat-block" key={user_msg.id}>
                                <img
                                    className="chat-img"
                                    src={user_msg.imgurl}
                                ></img>
                                <div className="chat-details">
                                    <h4 className="chat-user-time">
                                        {user_msg.first} {user_msg.last} on{" "}
                                        {user_msg.created_at.slice(0, 10)} at{" "}
                                        {user_msg.created_at.slice(11, 16)}
                                    </h4>
                                    <p className="chat-msg">{user_msg.msg}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <textarea
                id="chat-msg-editor"
                onKeyDown={sendChatMsg}
                placeholder="Write your chat message here..."
            ></textarea>
            <img id="chaton" src="/chaton.png" />
        </div>
    );
}
