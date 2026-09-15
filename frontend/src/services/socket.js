import { io } from "socket.io-client";

const storedUser = localStorage.getItem("user");

let user = null;

try {
    user = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
    user = null;
}

let tenantId = null;

if (user && user.tenantId) {
    if (typeof user.tenantId === "object") {
        tenantId = user.tenantId._id;
    } else {
        tenantId = user.tenantId;
    }
}

const socket = io("http://localhost:5000", {
    transports: ["websocket"],
    auth: {
        tenantId: tenantId
    }
});

socket.on("connect", () => {
    console.log(
        "Socket connected from frontend:",
        socket.id
    );
});

socket.on("connect_error", (error) => {
    console.log(
        "Socket connection error:",
        error.message
    );
});

export default socket;