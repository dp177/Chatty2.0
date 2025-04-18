import React from "react";
import { FiSettings, FiLogOut, FiUser } from "react-icons/fi";
import { RiMessage2Fill } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useStore } from "../store/useStore";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useThemeStore();
  const { authUser } = useStore();

  const isLoginPage = location.pathname === "/login";

  const handleSettingsClick = () => navigate("/settings");
  const handleProfileClick = () => navigate("/profile");
  const handleLogoutClick = () => navigate("/logout");

  // Determine navbar background
  const navbarBackground = isLoginPage && theme === "dark" 
    ? "bg-white/1" 
    : "bg-base-100";
  const textColor = isLoginPage && theme === "dark" 
  ? "text-purple-200" 
  : "text-purple-800";
  return (
    <nav className={`w-full h-20 flex items-center justify-between px-12 shadow-md fixed top-0 left-0 z-50 ${navbarBackground}`}>
      <Link to="/">
        <div className="flex items-center gap-2">
          <span className="text-primary font-semibold text-base flex items-center">
            <RiMessage2Fill className="mr-2 text-xl" />
            <p className="text-xl font-bold">Chatty</p>
          </span>
        </div>
      </Link>

      {authUser && !isLoginPage && (
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌞 Light" : "🌙 Dark"}
          </button>

          {/* Settings */}
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-primary transition"
            onClick={handleSettingsClick}
          >
            <FiSettings className="text-primary text-lg" />
            <span className="text-primary text-xl font-medium">Settings</span>
          </div>

          {/* Profile */}
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-primary transition"
            onClick={handleProfileClick}
          >
            <FiUser className="text-primary text-lg" />
            <span className="text-primary text-xl font-medium ">Profile</span>
          </div>

          {/* Logout */}
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-primary transition"
            onClick={handleLogoutClick}
          >
            <FiLogOut className="text-primary text-lg" />
            <span className="text-primary text-xl font-medium">Logout</span>
          </div>
        </div>
      )}

      {!authUser && isLoginPage && (
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-primary transition"
          onClick={handleSettingsClick}
        >
          <FiSettings className={`text-primary text-lg font-medium ${textColor}`}/>
          <span className={`text-primary text-xl font-medium ${textColor}`}>Settings</span>
        </div>
      )}
    </nav>
  );
}

export default Navbar;