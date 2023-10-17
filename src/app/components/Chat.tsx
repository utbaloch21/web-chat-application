import socket from "@/socket";
import React, { useEffect, useState } from "react";
import { userDataType } from "../type";

const Chat = ({
  selectedUser,
  setSelectedUser,
  setUsers,
  users,
}: {
  setUsers: React.Dispatch<React.SetStateAction<userDataType[]>>;
  users: userDataType[];
  selectedUser: userDataType | undefined;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<userDataType | undefined>
  >;
}) => {
  const [content, setContent] = useState("");
  const [renderPage, setRenderPage] = useState(false);
  const initReactiveProperties = (user: userDataType) => {
    user.hasNewMessages = false;
  };

  const onMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
      selectedUser.messages.push({
        content,
        fromSelf: true,
      });
    }
    setContent("");
  };

  useEffect(() => {
    const onUsersConnected = (allUsers: userDataType[]) => {
      allUsers.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        for (let i = 0; i < users.length; i++) {
          const existingUser = users[i];

          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            existingUser.messages = user.messages;
            return;
          }
        }
        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        console.log("got some users with messages: ", user);
        setUsers((previous) => [...previous, user]);
      });

      // // put the current user first, and then sort by username
      allUsers.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(allUsers);
    };
    const onUserConnect = (user: userDataType) => {
      for (let i = 0; i < users.length; i++) {
        const updatedUsers = [...users];

        const existingUser = users[i];
        if (existingUser.userID === user.userID) {
          updatedUsers[i].connected = true;
          setUsers(updatedUsers);
          return;
        }
      }
      initReactiveProperties(user);
      setUsers((previous) => [...previous, user]);
    };
    const onUserDisconnect = (id: any) => {
      for (let i = 0; i < users.length; i++) {
        const updatedUsers = [...users];
        const user = users[i];

        if (user.userID === id) {
          updatedUsers[i].connected = false;
          setUsers(updatedUsers);
          break;
        }
      }
    };
    const onConnect = () => {
      const updatedUsers = [...users];

      users.forEach((user, index) => {
        if (user.self) {
          updatedUsers[index].connected = true;
          setUsers(updatedUsers);
        }
      });
    };
    const onDisconnect = () => {
      const updatedUsers = [...users];
      users.forEach((user, index) => {
        if (user.self) {
          updatedUsers[index].connected = false;
          setUsers(updatedUsers);
        }
      });
    };

    const onMessageReceived = ({
      content,
      from,
      to,
    }: {
      content: any;
      from: any;
      to: any;
    }) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            fromSelf,
          });
          if (user !== selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
      setRenderPage(!renderPage);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("user disconnected", onUserDisconnect);
    socket.on("private message", onMessageReceived);
    socket.on("user connected", onUserConnect);
    socket.on("users", onUsersConnected);

    return () => {
      socket.off("user disconnected", onUserDisconnect);
      socket.off("private message", onMessageReceived);
      socket.off("user connected", onUserConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("users", onUsersConnected);
      socket.off("connect", onConnect);
    };
  }, [setUsers, users, selectedUser, content, setSelectedUser, renderPage]);

  return (
    <>
      {users.length > 0 ? (
        <div className="pageContainer">
          <div className="chatContainer">
            <h1>Welcome</h1>
            <ul>
              {users.map((value, index) => {
                return (
                  <li
                    className={`${
                      selectedUser === value ? "selectedUser" : ""
                    } `}
                    key={index}
                    onClick={() => {
                      setSelectedUser(value);
                      value.hasNewMessages = false;
                    }}
                  >
                    <div className="flex justify-between align-middle">
                      <span className="userName">{value.username}</span>
                      {value.hasNewMessages ? (
                        <p className="newMessageIndicator">new*</p>
                      ) : (
                        <div />
                      )}
                    </div>
                    <span className=" statusIndicator">
                      <div
                        className={`statusIndicatorIcon ${
                          value.connected
                            ? "onlineStatusIndicatorIcon"
                            : "offlineStatusIndicatorIcon"
                        }`}
                      />
                      {value.connected ? "Online" : "Offline"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {selectedUser && (
            <div className="messagesContainer">
              <div className="flex mt-2 mb-4">
                <div
                  className={`statusIndicatorIcon ${
                    selectedUser?.connected
                      ? "onlineStatusIndicatorIcon"
                      : "offlineStatusIndicatorIcon"
                  }`}
                />
                <p>{selectedUser?.username}</p>
              </div>
              <ul className="messagesList">
                {selectedUser?.messages.map((value, index) => {
                  return (
                    <li
                      key={index}
                      className={`${value.fromSelf ? "fromSelf" : "fromOther"}`}
                    >
                      <div
                        className={`messageWrapper ${
                          value.fromSelf ? "selfText" : "othersText"
                        }`}
                      >
                        <h3>
                          {value.fromSelf ? "you" : selectedUser.username}
                        </h3>
                        <p>{value.content}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <form action="" className="form" onSubmit={onMessage}>
                <input
                  type="text"
                  placeholder="Your message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button>Send</button>
              </form>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Chat;
