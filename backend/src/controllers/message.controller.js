import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getCurrentId } from "./currentID.js";
import mongoose from "mongoose";
import { cloudinary } from '../lib/cloudnary.js';
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async(req,res)=>{
    try{
        const loggedInUserId=req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}});
        res.status(200).json(filteredUsers);
    }
    catch(error)
    {
        console.log("error in getUsersForSidebar",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}
export const getMessages = async (req, res) => {
    try {
        const userToChatId = new mongoose.Types.ObjectId(req.params.id.trim());
        const myId = new mongoose.Types.ObjectId(req.user._id);
        
     
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId }
        ]
      });
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("error in getMessages", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  export const sendMessage = async (req, res) => {
    try {
      const receiverId = req.params.id.trim();
      const senderId = req.user._id;
      console.log("rec id",receiverId);
      console.log("send id",senderId);
      const { text, image } = req.body;
      let imageUrl = "";
  
      if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();
  
      // 🔍 Prepare a plain JS object for frontend
      const messageToEmit = {
        _id: newMessage._id,
        senderId,
        receiverId,
        text,
        image: imageUrl,
        createdAt: newMessage.createdAt,
      };
      console.log(messageToEmit);
      const ReceiverSocketId = getReceiverSocketId(receiverId);
      if (ReceiverSocketId) {
        io.to(ReceiverSocketId).emit("newMessage", messageToEmit); // ✅ Plain object
      }
  
      res.status(201).json(messageToEmit); // Also send plain object to frontend
    } catch (error) {
      console.error("error in sendMessage", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  