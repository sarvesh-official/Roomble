import { Request, Response } from "express";
import { verifyClerkWebhook } from "../utils/clerk";
import { createUser, deleteUser } from "../services/user.service";

export const handleClerkWebhook = async (req: Request, res: Response) => {
  try {
    const event = await verifyClerkWebhook(req);

    if (event.type === "user.created") {
      await createUser(event.data);
    }

    if (event.type === "user.deleted") {
      await deleteUser(event.data);
    }

    return res.status(200).send("Webhook received");
  } catch (err) {
    console.error("Webhook verification failed: ", err);
    return res.status(400).send("Invalid webhook");
  }
};
