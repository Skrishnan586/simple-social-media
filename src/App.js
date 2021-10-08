import React from "react";
import "./App.css";
import Nav from "./components/nav/Nav";
import ChatBody from "./components/chatBody/ChatBody";
import { socket } from "./components/socket/SocketConfig";
import io from "socket.io-client";

const socket123 = io.connect("http://localhost:5000", {
  path: "/api/socket",
});

socket123.on("message", (message) => {
  console.log(message);
});

function App() {
  return (
    <div className="__main">
      <Nav />
      <ChatBody />
    </div>
  );
}

export default App;
