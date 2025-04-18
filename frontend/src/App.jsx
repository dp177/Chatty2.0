import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import { useStore } from "./store/useStore";
import { useEffect, useRef } from "react"; // Import useRef
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import LogoutPage from "./pages/LogoutPage";



import {useThemeStore} from "./store/useThemeStore"
function App() {
  const { authUser, checkAuth, isCheckingAuth ,onlineUsers} = useStore();
  const {theme} = useThemeStore();
  console.log(theme);
  const toastShown = useRef(false); // Initialize useRef
  

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => { // Moved useEffect to the top level
    if (authUser && !toastShown.current) {
      toast.success("Entered Successfully");
      toastShown.current = true; // Set to true after showing toast once
    }
  }, [authUser]);

  console.log(authUser);
  console.log("online users",onlineUsers);
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"></Loader>
      </div>
    );

  console.log(authUser);
  
  return (
    <div data-theme={theme}>

      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            // Check if authUser exists and fullName is not undefined or null
            authUser && authUser.user && authUser.user.fullName ? 
              <HomePage /> : 
              <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route
          path="/profile"
          element={
            authUser ? <ProfilePage /> : <Navigate to="/login" />
          }
        />
        <Route path="/logout" element={<LogoutPage />}></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
