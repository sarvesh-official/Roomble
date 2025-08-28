import { Request } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { configDotenv } from "dotenv";
configDotenv();


if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
  throw new Error("CLERK_WEBHOOK_SIGNING_SECRET not set");
}

export const verifyClerkWebhook = async (req: Request) => {
  return verifyWebhook(req);
};

