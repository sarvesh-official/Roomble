import { Router } from "express";
import { fetchMessages, sendMessage } from "../controllers/message.controllers";


const router = Router();


router.post("/send-message", sendMessage);
router.get("/get-messages/:roomId", fetchMessages);

export default router;
