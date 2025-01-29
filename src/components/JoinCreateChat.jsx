import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoom, joinRoom } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { roomId, setRoomId, curUser, setCurUser, connected, setConnected } =
    useChatContext();

  const navigate = useNavigate();

  const handleFormInputChange = (e) => {
    setDetail({
      ...detail,
      [e.target.name]: e.target.value,
    });
  };

  const joinChatRoom = async () => {
    if (validateForm()) {
      try {
        const room = await joinRoom(detail.roomId);
        // console.log(room);
        // console.log(detail.roomId);

        toast.success("Room joined successfully!!");

        setRoomId(room.roomId);
        setCurUser(detail.userName);
        setConnected(true);

        navigate("/chat");
      } catch (error) {
        console.log("error");

        if (error.status === 400) {
          toast.error("Room does not exist!!");
        } else {
          toast.error("Failed to join room!!");
        }
      }
    }
  };

  const createChatRoom = async () => {
    if (validateForm()) {
      // console.log(detail);
      try {
        const res = await createRoom(detail);
        // console.log(res);
        toast.success("Room created successfully!!");

        setRoomId(res.roomId);
        setCurUser(detail.userName);
        setConnected(true);

        // forward to join chat function
        navigate("/chat");
      } catch (error) {
        console.log("error");

        if (error.status === 400) {
          toast.error("Room already exists!!");
        } else {
          toast.error("Failed to create room!!");
        }
      }
    }
  };

  const validateForm = () => {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid input!!");
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
        <h1 className="text-2xl font-semibold text-center">
          Join Room / Create Room
        </h1>
        <div className="mt-8">
          <label className="block font-medium mb-2">Your Name:</label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={detail.userName}
            onChange={handleFormInputChange}
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6">
          <label className="block font-medium mb-2">Room ID:</label>
          <input
            type="text"
            name="roomId"
            value={detail.roomId}
            onChange={handleFormInputChange}
            id="roomId"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-center mt-3 gap-3">
          <button
            onClick={joinChatRoom}
            className="px-3 py-2 bg-blue-800 rounded-lg hover:bg-blue-900 focus:ring-2 focus:ring-blue-800"
          >
            Join Room
          </button>
          <button
            onClick={createChatRoom}
            className="px-3 py-2 bg-orange-800 rounded-lg hover:bg-orange-900 focus:ring-2 focus:ring-orange-800"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
