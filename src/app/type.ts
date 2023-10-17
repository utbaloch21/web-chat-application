type messageDataTypes = {
  content: any;
  fromSelf?: boolean;
  from?: string;
};
export type userDataType = {
  userID: string;
  username: string;
  connected: boolean;
  messages: messageDataTypes[];
  self: boolean;
  hasNewMessages: boolean;
};
