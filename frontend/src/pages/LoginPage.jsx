import React, { useState } from "react";
import Particles from "react-tsparticles";
import { Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useThemeStore } from "../store/useThemeStore";
import { useEffect } from "react";
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeStore();
  const { handleGoogleLogin, handleAuthRedirect } = useStore();

  const [rotate, setRotate] = useState({ x: 0, y: 0 });
	  useEffect(() => {
    handleAuthRedirect(location, navigate);
  }, [location, navigate, handleAuthRedirect]);

  const handleMouseMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width - 0.5) * 15;
    const y = ((e.clientY - box.top) / box.height - 0.5) * -15;
    setRotate({ x, y });
  };

  const resetRotate = () => setRotate({ x: 0, y: 0 });

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-gradient-to-br from-gray-900 to-purple-900'}`}>
      
      <div className="absolute inset-0 z-0">
        <Particles
          options={{
            fullScreen: { enable: true },
            particles: {
              number: { value: 60, density: { enable: true, area: 800 } },
              color: { value: theme === 'light' ? '#6366f1' : '#a855f7' },
              shape: { type: "circle" },
              opacity: { value: 0.5, random: true },
              size: { value: 3, random: true },
              links: {
                enable: true,
                color: theme === 'light' ? '#4f46e5' : '#7e22ce',
                distance: 150,
                opacity: 0.4,
                width: 1
              },
              move: {
                enable: true,
                speed: 2,
                direction: "none",
                outModes: { default: "out" }
              }
            },
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                  parallax: { enable: true, force: 60, smooth: 10 }
                },
                onClick: { enable: true, mode: "push", particles: { quantity: 4 } }
              },
              modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { quantity: 4 },
                bubble: { distance: 200, size: 6, duration: 0.4 }
              }
            }
          }}
        />
      </div>

      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={resetRotate}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.y}deg) rotateY(${rotate.x}deg)`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative z-10 max-w-md w-full p-8 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl text-center"
      >
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Welcome to Chatty!
        </h1>

        <p className="text-lg mb-8 text-gray-200">Talk smarter. Laugh harder. Type weirder.</p>

        <ul className="space-y-3 mb-8 text-left">
          <li className="flex items-center gap-2">
            <span className={`text-2xl ${theme === 'light' ? 'text-indigo-500' : 'text-purple-400'}`}>👽</span>
            <span>Meet intergalactic pen pals</span>
          </li>
          <li className="flex items-center gap-2">
            <span className={`text-2xl ${theme === 'light' ? 'text-blue-500' : 'text-pink-400'}`}>🤪</span>
            <span>Send messages that autocorrect to funnier versions</span>
          </li>
          <li className="flex items-center gap-2">
            <span className={`text-2xl ${theme === 'light' ? 'text-pink-500' : 'text-blue-400'}`}>🚀</span>
            <span>Chat at warp speed (when the servers cooperate)</span>
          </li>
        </ul>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 font-bold shadow-lg hover:shadow-xl active:scale-95 w-full"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-6 h-6"
            alt="Google"
          />
          Blast off with Google
        </button>
      </div>

      <Toaster />
    </div>
  );
}

export default LoginPage;
