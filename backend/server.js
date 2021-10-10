const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const db = require("./models");
const Role = db.role;
const dbConfig = require("./config/db.config");

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

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/welcome", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({ name: "admin" }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

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
