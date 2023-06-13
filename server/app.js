const app = require("express")();
const { Server } = require("socket.io");
const server = app.listen(8080);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("test", (...args) => {
    console.log("YAY");
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
app.get("/", (req, res) => res.send("ee"));
