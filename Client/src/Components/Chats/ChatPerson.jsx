import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:7000");

const ChatPerson = ({ userId }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`http://localhost:7000/chats?receiverId=${userId}`)
            .then(res => res.json())
            .then(data => setChats(data))
            .catch(err => console.error(err));
    }, [userId]);

    const sendMessage = () => {
        if (message.trim() === "" || !selectedChat) return;

        const newMessage = { roomId: selectedChat.roomId, sender: userId, message };
        socket.emit("send_message", newMessage);
        setMessage("");
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/3 bg-gray-200 p-4">
                <h2 className="text-lg font-bold mb-2">Chats</h2>
                <ul>
                    {chats.map((chat) => (
                        <li key={chat.roomId} className={`cursor-pointer p-2 rounded-lg mb-2 ${selectedChat?.roomId === chat.roomId ? "bg-blue-500 text-white" : "bg-white"}`} onClick={() => setSelectedChat(chat)}>
                            Chat with {chat.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="w-2/3 bg-gray-100 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Messages would go here */}
                </div>

                {selectedChat && (
                    <div className="p-4 bg-white border-t flex items-center">
                        <input type="text" className="flex-1 p-2 border rounded-lg" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage()} />
                        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={sendMessage}>Send</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPerson;
