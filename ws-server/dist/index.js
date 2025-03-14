"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
console.log("Server started on port 8080");
wss.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("message", (msg) => {
        try {
            const parsedMsg = JSON.parse(msg.toString());
            console.log("Received message:", parsedMsg);
            if (parsedMsg.type === "join") {
                const room = parsedMsg.payload.room;
                const name = parsedMsg.payload.user.name;
                const id = parsedMsg.payload.user.id;
                console.log(`Joining room: ${room}`);
                allSockets.push({ id, name, room, socket });
            }
            if (parsedMsg.type === "chat") {
                const message = parsedMsg.payload.message;
                const user = allSockets.find((s) => s.socket === socket);
                const userRoom = user === null || user === void 0 ? void 0 : user.room;
                const id = user === null || user === void 0 ? void 0 : user.id;
                const name = user === null || user === void 0 ? void 0 : user.name;
                if (!userRoom) {
                    console.log("User not in any room. Ignoring chat message.");
                    return;
                }
                const socketsInRoom = allSockets.filter((s) => s.room === userRoom);
                socketsInRoom.forEach((s) => {
                    s.socket.send(JSON.stringify({ message, id, name }));
                });
            }
        }
        catch (error) {
            console.error("Error parsing message:", error);
        }
    });
    socket.on("close", () => {
        console.log("Client disconnected");
        allSockets = allSockets.filter((s) => s.socket !== socket);
    });
    socket.on("error", (err) => {
        console.error("WebSocket error:", err);
    });
});
