import React, { useState, useRef, useEffect } from "react";
import { IoMdSend, IoMdAttach } from "react-icons/io";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import { baseURL } from "../config/AxiosHelper";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { loadChats } from "../services/RoomService";
import { timeAgo } from "../context/helper";

const ChatPage = () => {
  const { roomId, curUser, connected, setConnected, setRoomId, setCurUser } =
    useChatContext();

  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatboxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [roomId, curUser, connected]);

  // load messages-
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await loadChats(roomId);
        // console.log(res);
        setMessages(res);
      } catch (error) {
        console.log(error);
      }
    };
    if (connected) {
      loadMessages();
    }
  }, [roomId]);

  // connect to websocket-
  useEffect(() => {
    const connectWebSocket = () => {
      // SockJS
      const socket = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(socket);
      client.connect(
        {},
        () => {
          setStompClient(client);
          toast.success("connected");
          client.subscribe(`/topic/room/${roomId}`, (msg) => {
            const message = JSON.parse(msg.body);
            // console.log(message);
            setMessages((prev) => [...prev, message]);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    };
    if (connected) {
      connectWebSocket();
    }
  }, [roomId, connected]);

  // sendMessage handle-
  const sendMessage = async () => {
    if (connected && stompClient && input.trim() !== "") {
      const message = {
        sender: curUser,
        content: input,
        roomId: roomId,
      };
      // console.log(message);

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // logout function
  const handleLogout = () => {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurUser("");
    navigate("/");
  };

  return (
    <div>
      <header className="flex items-center fixed w-full h-20 justify-around p-4 dark:bg-gray-900 shadow">
        {/* room name container */}
        <div>
          <h1 className="text-xl font-semibold">Walkie Talkie</h1>
        </div>
        {/* username container */}
        <div>
          <h1 className="text-xl font-semibold">
            User: <span>{curUser} </span>
          </h1>
        </div>
        {/* button :leave room */}
        <div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-700 rounded-lg hover:bg-red-900 "
          >
            Leave Room
          </button>
        </div>
      </header>

      <main className="py-24 px-10 w-2/3  rounded-lg h-screen  overflow-auto no-scrollbar  mx-auto dark:bg-slate-700 bg-slate-400 ">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === curUser ? "justify-end" : "justify-start "
            }`}
          >
            <div
              className={`my-2  p-2 max-w-xs rounded ${
                msg.sender === curUser
                  ? "justify-end bg-indigo-500 text-white"
                  : "justify-start bg-white text-black "
              }`}
            >
              <div className="flex flex-row gap-2">
                <img
                  src={"https://avatar.iran.liara.run/public"}
                  alt=""
                  className="h-10 w-10"
                />
                <div className=" flex flex-col gap-1">
                  <p className="text-sm font-bold">{msg.sender}</p>
                  <p> {msg.content} </p>
                  <p className="text-xs text-gray-900 font-semibold">
                    {timeAgo(msg.timeStamp)}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* typing area */}
      <div className="fixed bottom-0 w-full h-16">
        <div className="h-full flex items-center gap-3 justify-between  w-2/3 mx-auto dark:bg-gray-900 shadow rounded-lg pr-2">
          <input
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            type="text"
            className="dark:bg-gray-800  w-full h-full rounded-lg p-3 focus:outline-none"
            placeholder="Type your message here"
          />
          <div className="flex gap-2 ">
            <button className="px-3 py-2 bg-purple-800 rounded-lg hover:bg-purple-900 ">
              <IoMdAttach size={25} />
            </button>
            <button
              onClick={sendMessage}
              className="px-3 py-2 bg-green-800 rounded-lg hover:bg-green-900 "
            >
              <IoMdSend size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
