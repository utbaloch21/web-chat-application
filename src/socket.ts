import { io, Socket } from "socket.io-client";

// const URL =
//   process.env.NODE_ENV === "production"
//     ? "http://localhost:8080"
//     : "http://localhost:3001";
// const socket = io(URL, { autoConnect: false });
interface SocketData extends Socket {
  userID?: string;
  username?: string;
  sessionID?: string;
}
// https://web-chat-application-ehfo6idgb-utbaloch21s-projects.vercel.app
const SERVER_IP =
  "web-chat-application-ehfo6idgb-utbaloch21s-projects.vercel.app"; // e.g., '10.13.1.215'
const SERVER_PORT = 8080;
const socket: SocketData = io(`https://${SERVER_IP}:${SERVER_PORT}`, {
  autoConnect: false,
});

// const socket = io("http://localhost:3001", {
//   autoConnect: false,
// });
socket.onAny((event, ...args) => {
  console.log("socket any running nice");
  console.log(event, args);
});

export default socket;
