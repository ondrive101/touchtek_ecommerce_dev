import { io } from "socket.io-client";

let socket;

export const connectSocket = (session) => {

  // Remove image field from session
  const sessionNew = {
    user: (({ image, ...rest }) => rest)(session.user),
  };

  if (session === null || session === undefined) return;

  if (!socket) {
    console.log('creating connection', process.env.NEXT_PUBLIC_CHAT_SERVER_URL)
    socket = io(process.env.NEXT_PUBLIC_CHAT_SERVER_URL, {
      auth: { sessionUser: sessionNew },
      withCredentials: true,
      transports: ["websocket"], // optional, force websocket only
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected successfully!");
      socket.emit("get-contacts");
    });
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  }

  return socket;
};

//this will get both contact list and chat contacts
export const subscribeToContactList = (callback) => {
  if (!socket) return;


  console.log("✅ Subscribing to contact list!");


  socket.on("update-contacts", (data) => {
    callback(data);
  });
};

// ✅ New function to create a chat for a new user
export const createNewChat = (user, callback) => {
  if (!socket) return;

  socket.emit("create-chat", { user });

  if (callback) {
    socket.on("update-create-chat", (chatData) => {
      callback(chatData);
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // reset for clean reconnects
  }
};

// subscribe to error
export const subscribeToError = (callback) => {
  if (!socket) return;

  socket.on("error", (err) => {
    callback(err);
  });
};

//Subscribe contactChat
export const subscribeToContactChat = (chatId, callback) => {
  if (!socket) return;

  socket.emit("get-contact-chat", { chatId });

  socket.on("update-contact-chat", (data) => {
    callback(data);
  });
};

//send message
export const sendMessage = (chatId, message, replayMetadata) => {
  if (!socket) return;
  socket.emit("send-message", { chatId, message, replayMetadata });
};

//delete message
export const deleteMessage = (chatId, messageId) => {
  if (!socket) return;
  socket.emit("delete-message", { chatId, messageId });
};

//delete chat
export const deleteChat = (chatId) => {
  if (!socket) return;

  socket.emit("delete-chat", { chatId });
};
