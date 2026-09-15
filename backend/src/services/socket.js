import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    transports: ["websocket"]
});

socket.on("connect", () => {
    console.log("Socket connected from frontend:", socket.id);
});

socket.on("connect_error", (error) => {
    console.log("Socket connection error:", error.message);
});

export default socket;