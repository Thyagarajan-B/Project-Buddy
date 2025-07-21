// src/socket.js
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:3000"; // backend URL
const socket = io(ENDPOINT, {
  withCredentials: true,
});

export default socket;
