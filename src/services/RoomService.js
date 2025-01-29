import { httpClient } from "../config/AxiosHelper";

export const createRoom = async (roomDetail) => {
  const res = await httpClient.post("/api/v1/rooms", roomDetail);
  return res.data;
};

export const joinRoom = async (roomId) => {
  const res = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return res.data;
};

export const loadChats = async (roomId) => {
  const res = await httpClient.get(`/api/v1/rooms/${roomId}/messages`);
  return res.data;
};
