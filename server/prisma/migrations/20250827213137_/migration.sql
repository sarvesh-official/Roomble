-- AlterTable
ALTER TABLE "public"."RoomInvite" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '24 hours';
