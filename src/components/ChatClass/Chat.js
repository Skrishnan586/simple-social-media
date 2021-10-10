import React, { Component } from "react";

import ChatBody from "../chatBody/ChatBody";
import Nav from "../nav/Nav";
import "./chat.css";

export default class Chat extends Component {
  render() {
    return (
      <div className="__main">
        <Nav />
        <ChatBody />
      </div>
    );
  }
}
