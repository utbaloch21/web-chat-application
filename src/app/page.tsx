"use client";
import React, { useState, useEffect } from "react";
import SelectUsername from "./components/SelectUsername";
import socket from "@/socket";
import Chat from "./components/Chat";
import { userDataType } from "./type";

const App = () => {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);
  const [users, setUsers] = useState<userDataType[]>([]);
  const [selectedUser, setSelectedUser] = useState<userDataType>();

  useEffect(() => {
    const onConnectError = (err: any) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
        console.log("Got Errroror: ", err);
      }
    };
    const onSession = ({ sessionID, userID }: any) => {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
    };

    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      setUsernameAlreadySelected(true);
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("session", onSession);
    socket.on("connect_error", onConnectError);
    return () => {
      socket.off("connect_error", onConnectError);
    };
  }, []);
  console.log("users: ", users);
  return (
    <div>
      {usernameAlreadySelected ? null : (
        <SelectUsername
          setUsernameAlreadySelected={setUsernameAlreadySelected}
        />
      )}
      <div>
        {/* <div className="chatContainer">
          <h1>Welcome</h1>
          <ul>
            {users.map((value, index) => {
              return <li key={index}>{value.username}</li>;
            })}
          </ul>
        </div> */}
        {/* <div className="messagesContainer"> */}

        <Chat
          setUsers={setUsers}
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />

        {/* </div> */}
      </div>
    </div>
  );
};

export default App;
