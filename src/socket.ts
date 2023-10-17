import { io } from "socket.io-client";

// const URL =
//   process.env.NODE_ENV === "production"
//     ? "http://localhost:8080"
//     : "http://localhost:3001";
// const socket = io(URL, { autoConnect: false });

const SERVER_IP = "10.13.1.215"; // e.g., '10.13.1.215'
const SERVER_PORT = 3001;
const socket = io(`http://${SERVER_IP}:${SERVER_PORT}`, { autoConnect: false });

// const socket = io("http://localhost:3001", {
//   autoConnect: false,
// });
socket.onAny((event, ...args) => {
  console.log("socket any running nice");
  console.log(event, args);
});

export default socket;
