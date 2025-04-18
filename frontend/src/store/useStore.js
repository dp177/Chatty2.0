import { create } from 'zustand';
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import io from "socket.io-client";

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : '';

export const useStore = create((set, get) => ({
  authUser: null,
  isloggedIn: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  logoutUser: async (navigate) => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      get().disconnectSocket();
      set({ authUser: null, isloggedIn: false });
      navigate("/login");
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, isloggedIn: true });
    } catch (error) {
      console.log("error in checkAuth", error);
      set({ authUser: null, isloggedIn: false });
    } finally {
      get().connectSocket();
      set({ isCheckingAuth: false });
    }
  },

  setAuthUser: (user) => set({ authUser: user }),
  setisLoggedIn: (status) => set({ isloggedIn: status }),

  updateProfile: async (data) => { 
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: { user: res.data } });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  handleGoogleLogin: () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  },

  handleAuthRedirect: (location, navigate) => {
    const params = new URLSearchParams(location.search);
    const authSuccess = params.get('authSuccess');
    const authError = params.get('authError');

    if (authSuccess === 'true') {
      get().connectSocket();
      set({ isloggedIn: true });
      navigate('/', { replace: true });
    }

    if (authError === 'true') {
      toast.error('Google authentication failed. Please try again.', {
        duration: 5000,
      });
      const newUrl = location.pathname;
      navigate(newUrl, { replace: true });
    }
  },

  connectSocket: () => {
    const authUser = get().authUser;
    if (!authUser || get().socket?.connected) return;

    const socket = io(API_BASE_URL, {
      path: '/socket.io',
      query: {
        userId: authUser.user._id,
      }
    });

    console.log("🧩 Attempting socket connect:", authUser, socket?.connected);
    socket.connect();
    
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: socket });
  },
  
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));