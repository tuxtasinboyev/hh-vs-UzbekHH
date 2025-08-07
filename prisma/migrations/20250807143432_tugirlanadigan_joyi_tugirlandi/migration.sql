/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "avatar_url" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "avatar_url";
