type messageDataTypes = {
  content: any;
  fromSelf: boolean;
};
export type userDataType = {
  userID: string;
  username: string;
  connected: boolean;
  messages: messageDataTypes[];
  self: boolean;
  hasNewMessages: boolean;
};
