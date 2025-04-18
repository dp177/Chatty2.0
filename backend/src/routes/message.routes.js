import express from "express";
import { getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getMessages } from "../controllers/message.controller.js";
//import isAuthenticated from "../middleware/isAuthenticated";
import { setCurrentId,getCurrentId } from "../controllers/currentID.js";
const router = express.Router();
const curID = getCurrentId();

router.get("/users", isAuthenticated, getUsersForSidebar);
router.post("/send/:id",isAuthenticated, sendMessage); // put before /:id
router.get("/:id", isAuthenticated, getMessages);


export default router;