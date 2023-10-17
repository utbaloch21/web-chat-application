import socket from "@/socket";
import React, { Dispatch, SetStateAction, useState } from "react";

const SelectUsername = ({
  setUsernameAlreadySelected,
}: {
  setUsernameAlreadySelected: Dispatch<SetStateAction<boolean>>;
}) => {
  const [username, setUsername] = useState("");
  const onUsernameSelection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect();
    console.log("saved username: ", username);
  };
  return (
    <div className="formContainer">
      <form onSubmit={onUsernameSelection} className="form">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border"
          />
        </label>
        <button>Start Conversation</button>
      </form>
    </div>
  );
};

export default SelectUsername;
