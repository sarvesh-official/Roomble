-- AlterTable
ALTER TABLE "public"."RoomInvite" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '24 hours';

-- AlterTable
ALTER TABLE "public"."Tag" ADD COLUMN     "isCategory" BOOLEAN NOT NULL DEFAULT false;
