const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect("mongodb+srv://admin:adminram@cluster0.30qmmci.mongodb.net/chat", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Chat Schema & Model
const chatSchema = new mongoose.Schema(
    {
        roomId: { type: String, required: true },
        senderEmail: { type: String, required: true },
        receiverEmail: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }, // ✅ Ensure timestamp is saved properly
    },
    { timestamps: true }
);
const Chat = mongoose.model("Chat", chatSchema);

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`⚡ User Connected: ${socket.id}`);

    // Join chat room
    socket.on("join_chat", async ({ senderEmail, receiverEmail }) => {
        if (!senderEmail || !receiverEmail) return;

        const roomId = [senderEmail, receiverEmail].sort().join("_");
        socket.join(roomId);
        console.log(`🔹 User joined chat room: ${roomId}`);

        try {
            const messages = await Chat.find({ roomId }).sort({ timestamp: 1 });
            socket.emit("load_messages", messages);
        } catch (err) {
            console.error("❌ Error loading messages:", err);
        }
    });

    // Handle message sending
    socket.on("send_message", async ({ senderEmail, receiverEmail, message }) => {
        if (!senderEmail || !receiverEmail || !message) return;

        try {
            const roomId = [senderEmail, receiverEmail].sort().join("_");

            const newMessage = new Chat({
                senderEmail,
                receiverEmail,
                message,
                roomId,
                timestamp: new Date(), // ✅ Ensure valid timestamp
            });

            await newMessage.save(); // Save to DB

            io.to(roomId).emit("receive_message", newMessage); // Send only from backend
        } catch (err) {
            console.error("❌ Error sending message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log(`🔻 User Disconnected: ${socket.id}`);
    });
});

// Start Server
const PORT = 7000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
