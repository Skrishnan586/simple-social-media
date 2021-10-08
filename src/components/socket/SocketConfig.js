import React, { Component } from "react";
import io from "socket.io-client";
import { EventEmitter } from "../events/events";

let room_name;
let users_name;

export const socket = io.connect("http://localhost:5000", {
  path: "/api/socket",
});

socket.on("message", (message) => {
  EventEmitter.dispatch("subscribeChat", message);
});

socket.on("roomUsers", ({ room, users }) => {
  room_name = room;
  users_name = users;
});

// eslint-disable-next-line import/no-anonymous-default-export
// export default socket;
