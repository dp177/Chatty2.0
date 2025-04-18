import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useStore } from "./useStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    console.log(selectedUser);
    console.log(messageData);
   try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData,
        { withCredentials: true } // ✅ this makes sure cookies are sent
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }
  ,

  subscribeToMessages: async() => {
    const { selectedUser } = get();
    console.log("sl",selectedUser);
    if (!selectedUser) return;

    const socket = await useStore.getState().socket;
    if(!socket)
    {
      console.log("njdkvns dfj ger");
    }
    socket.on("newMessage", (newMessage) => {
      console.log("new message are",newMessage);
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: async() => {
    const socket = await useStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));