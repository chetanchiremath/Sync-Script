const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(           // (io.sockets.adapter.rooms.get(roomId) -> returns a Set of all socket IDs in the given roomId
        (socketId) => {                                                          // Each socket ID is converted into an object
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on("connection", (socket) => {
    // console.log(`User connected: ${socket.id}`);
    socket.on("join", ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        // console.log(clients);
        // Notify all users that new client is joined
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username,
                socketId: socket.id,
            });
        })
    });

    socket.on("code-change", ({ roomId, code }) => {
        socket.in(roomId).emit("code-change", {
            code
        });
    });

    socket.on("sync-code", ({ socketId, code }) => {
        io.to(socketId).emit("code-change", {
            code
        });
    })

    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];                      // socket.rooms -> Returns the rooms the socket is currently in.
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected", {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })
});

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
