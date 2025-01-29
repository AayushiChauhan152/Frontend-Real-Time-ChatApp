import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [curUser, setCurUser] = useState(null);
  const [connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        roomId,
        setRoomId,
        curUser,
        setCurUser,
        connected,
        setConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;
