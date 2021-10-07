import io from "socket.io-client";

let room_name;
let users_name;

export const socket = io.connect("http://localhost:5000", {
  path: "/api/socket",
});

socket.on("message", (message) => {
  console.log(message);
});

socket.on("roomUsers", ({ room, users }) => {
  room_name = room;
  users_name = users;
});

// eslint-disable-next-line import/no-anonymous-default-export
// export default socket;
