const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const server = app.listen(8080);
app.use(cors());
app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("joinRoom", (data) => {
    let roomId = `room-${data.roomId}`;
    socket.join(roomId);
    io.to(roomId).emit("confirmation", `User-test has joined this room`);
  });

  socket.on("sendMessage", (data) => {
    let roomId = `room-${data.roomId}`;
    console.log(data);
    io.to(roomId).emit("receiveMessage", data.message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
