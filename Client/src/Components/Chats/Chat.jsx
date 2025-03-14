import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://real-estate-project-1-d60c.onrender.com");

const Chat = () => {
    const [senderEmail, setSenderEmail] = useState("");
    const [receiverEmail, setReceiverEmail] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const handleStartChat = () => {
        if (!senderEmail || !receiverEmail) {
            alert("Please enter both sender and receiver email!");
            return;
        }
        socket.emit("join_chat", { senderEmail, receiverEmail });
    };

    useEffect(() => {
        socket.on("load_messages", (data) => {
            setMessages(data);
        });

        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("load_messages");
            socket.off("receive_message");
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;
        if (!senderEmail || !receiverEmail) {
            alert("Set the sender and receiver emails first!");
            return;
        }

        const newMessage = {
            senderEmail,
            receiverEmail,
            message,
        };

        socket.emit("send_message", newMessage);
        setMessage(""); // ✅ Don't update state manually (backend will handle it)
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4 mt-16"> {/* Added margin top for navbar */}
            {/* Sender & Receiver Email Setup */}
            <div className="p-4 bg-white shadow-md rounded-lg mb-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="border p-2 rounded-lg w-full mb-2"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Enter receiver email"
                    className="border p-2 rounded-lg w-full mb-2"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                    onClick={handleStartChat}
                >
                    Start Chat
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 max-w-md rounded-xl shadow-md my-2 ${
                            msg.senderEmail === senderEmail
                                ? "bg-blue-500 text-white self-end ml-auto"
                                : "bg-white text-gray-900 self-start"
                        }`}
                    >
                        <p>{msg.message}</p>
                        <span className="text-xs text-gray-400 block">
                            {new Date(msg.timestamp).toLocaleTimeString()} {/* ✅ Fixed timestamp */}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white border-t flex items-center">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
