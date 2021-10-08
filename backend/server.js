const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const proxy = require("express-http-proxy");
const { format } = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server, { path: "/api/socket" });

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/", proxy("http://localhost:3000/"));

const botName = "ChatCord Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    try {
      const user = getCurrentUser(socket.id);
      console.log(user);
      console.log("Message: " + JSON.stringify(msg));

      io.to(user.room).emit("message", formatMessage(user.username, msg));
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} A user has left the chat`)
      );
    }
  });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
