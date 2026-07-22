import axiosInstance from "./axiosInstance";

export const sendChatMessage = async (message, history = []) => {
  const res = await axiosInstance.post("/chat", { message, history });
  return res.data;
};