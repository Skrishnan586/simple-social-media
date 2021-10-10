import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { socket } from "./components/socket/SocketConfig";
import io from "socket.io-client";
import Login from "./components/login/Login";
import Register from "./components/Register/register";

import Chat from "./components/ChatClass/Chat";

const socket123 = io.connect("http://localhost:5000", {
  path: "/api/socket",
});

socket123.on("message", (message) => {
  console.log(message);
});

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/chat" component={Chat} />
      </Router>
    );
  }
}

export default App;
