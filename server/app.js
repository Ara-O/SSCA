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

class Room {
  static #allRooms = [];
  static ROOM_LIMIT = 2;

  constructor(roomId) {
    this.roomId = roomId;
    this.messageHistory = [];
    this.connectedClients = 1;
    Room.#allRooms.push(roomId);
  }

  addClient() {
    this.connectedClients++;
  }

  addMessage(message) {
    this.messageHistory.push(message);
  }

  getMessageHistory() {
    return this.messageHistory;
  }

  hasReachedRoomThreshold() {
    if (this.connectedClients == Room.ROOM_LIMIT) {
      return true;
    }
    return false;
  }

  static hasRoom(roomId) {
    return Room.#allRooms.includes(roomId);
  }
}

const roomInfo = {};
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (data) => {
    let roomId = `room-${data.roomId}`;

    if (Room.hasRoom(roomId)) {
      if (roomInfo[roomId].hasReachedRoomThreshold()) {
        socket.emit("userThresholdBreached");
        return;
      }
      roomInfo[roomId].addClient();
    } else {
      roomInfo[roomId] = new Room(roomId);
    }
    socket.join(roomId);
    io.to(roomId).emit("roomJoined", roomInfo[roomId].getMessageHistory());
  });

  socket.on("sendMessage", (data) => {
    let roomId = `room-${data.roomId}`;
    roomInfo[roomId].addMessage(data.message);
    io.to(roomId).emit("newMessage", roomInfo[roomId].getMessageHistory());
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
