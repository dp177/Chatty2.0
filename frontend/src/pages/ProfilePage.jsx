import { useState } from "react";
import { useStore } from "../store/useStore";
import { Camera, Mail, User } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore"; // Import theme store

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const { theme } = useThemeStore(); // Get current theme

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const img = new Image();

    reader.onload = () => {
      img.src = reader.result;
    };

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const maxSize = 300;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

      setSelectedImg(compressedBase64);
      await updateProfile({ profilePic: compressedBase64 });
      console.log("Profile pic URL:", compressedBase64);
    };

    reader.readAsDataURL(file);
  };

  // Determine background and text colors based on theme
  const backgroundColor = theme === "light" ? "bg-white" : "bg-base-100";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const borderColor = theme === "light" ? "border-gray-300" : "border-gray-700";

  return (
    <div className={`h-fit pt-20 ${backgroundColor}`}>
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className={`h-fit ${borderColor} rounded-xl p-6 space-y-8`}>
          <div className="text-center">
            <h1 className={`text-2xl font-semibold ${textColor}`}>Profile</h1>
            <p className={`mt-2 ${textColor}`}>Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || (authUser?.user?.profilePic ?? "/avatar.png")}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
                referrerPolicy="no-referrer"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className={`text-sm ${textColor}`}>
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className={`text-sm ${textColor} flex items-center gap-2`}>
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className={`px-4 py-2.5 ${backgroundColor} rounded-lg border ${borderColor}`}>{authUser.user.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className={`text-sm ${textColor} flex items-center gap-2`}>
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className={`px-4 py-2.5 ${backgroundColor} rounded-lg border ${borderColor}`}>{authUser.user.email}</p>
            </div>
          </div>

          <div className={`mt-6 ${backgroundColor} rounded-xl p-6`}>
            <h2 className={`text-lg font-medium ${textColor} mb-4`}>Account Information</h2>
            <div className={`space-y-3 text-sm ${textColor}`}>
              <div className={`flex items-center justify-between py-2 border-b ${borderColor}`}>
                <span>Member Since</span>
                <span>{authUser.user.createdAt?.split("T")[0]}</span>
              </div>
              <div className={`flex items-center justify-between py-2`}>
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
